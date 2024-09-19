"use strict";

exports.__esModule = true;
exports.default = void 0;

//var _jestEnvironmentNode = _interopRequireDefault(require("jest-environment-node"));
var _jestCircusAllure = _interopRequireDefault(require("jest-circus-allure-environment"));

var _chalk = _interopRequireDefault(require("chalk"));

var _readConfig = require("./readConfig");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const handleError = error => {
  process.emit('uncaughtException', error);
};

const KEYS = {
  CONTROL_C: '\u0003',
  CONTROL_D: '\u0004',
  ENTER: '\r'
}; // JEST_WORKER_ID starts at 1

const getWorkerIndex = () => process.env.JEST_WORKER_ID - 1;

const getEndpointIndex = () => Math.min(+process.env.BROWSERS_COUNT - 1, getWorkerIndex());

class CustomPuppeteerEnvironment extends _jestCircusAllure.default {
  // Jest is not available here, so we have to reverse engineer
  // the setTimeout function, see https://github.com/facebook/jest/blob/v23.1.0/packages/jest-runtime/src/index.js#L823
  setTimeout(timeout) {
    if (this.global.jasmine) {
      // eslint-disable-next-line no-underscore-dangle
      this.global.jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    } else {
      this.global[Symbol.for('TEST_TIMEOUT_SYMBOL')] = timeout;
    }
  }

  async setup() {
    const config = await (0, _readConfig.readConfig)();
    const puppeteer = (0, _readConfig.getPuppeteer)();
    this.global.puppeteerConfig = config;
    let wsEndpoint;

    try {
      wsEndpoint = JSON.parse(process.env.PUPPETEER_WS_ENDPOINTS)[getEndpointIndex()];
    } catch (e) {
      throw new Error(`wsEndpoints parse error: ${e.message} in ${process.env.PUPPETEER_WS_ENDPOINTS}`);
    }

    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    this.global.jestPuppeteer = {
      debug: async () => {
        // eslint-disable-next-line no-eval
        // Set timeout to 4 days
        this.setTimeout(345600000); // Run a debugger (in case Puppeteer has been launched with `{ devtools: true }`)

        await this.global.page.evaluate(() => {
          // eslint-disable-next-line no-debugger
          debugger;
        }); // eslint-disable-next-line no-console

        console.log(_chalk.default.blue('\n\n🕵️‍  Code is paused, press enter to resume')); // Run an infinite promise

        return new Promise(resolve => {
          const {
            stdin
          } = process;

          const onKeyPress = key => {
            if (key === KEYS.CONTROL_C || key === KEYS.CONTROL_D || key === KEYS.ENTER) {
              stdin.removeListener('data', onKeyPress);

              if (!listening) {
                if (stdin.isTTY) {
                  stdin.setRawMode(false);
                }

                stdin.pause();
              }

              resolve();
            }
          };

          const listening = stdin.listenerCount('data') > 0;

          if (!listening) {
            if (stdin.isTTY) {
              stdin.setRawMode(true);
            }

            stdin.resume();
            stdin.setEncoding('utf8');
          }

          stdin.on('data', onKeyPress);
        });
      },
      resetPage: async () => {
        if (this.global.page) {
          this.global.page.removeListener('pageerror', handleError);
          await this.global.page.close();
        }

        this.global.page = await this.global.context.newPage();

        if (config && config.exitOnPageError) {
          this.global.page.addListener('pageerror', handleError);
        }
      },
      resetBrowser: async () => {
        if (this.global.page) {
          this.global.page.removeListener('pageerror', handleError);
        }

        if (config.browserContext === 'incognito' && this.global.context) {
          await this.global.context.close();
        } else if (this.global.page) {
          await this.global.page.close();
        }

        this.global.page = null;

        if (this.global.browser) {
          await this.global.browser.disconnect();
        }

        this.global.browser = await puppeteer.connect(_extends({}, config.connect, config.launch, {
          browserURL: undefined,
          browserWSEndpoint: wsEndpoint
        }));

        if (config.browserContext === 'incognito') {
          // Using this, pages will be created in a pristine context.
          this.global.context = await this.global.browser.createIncognitoBrowserContext();
        } else if (config.browserContext === 'default' || !config.browserContext) {
          /**
           * Since this is a new browser, browserContexts() will return only one instance
           * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#browserbrowsercontexts
           */
          this.global.context = await this.global.browser.browserContexts()[0];
        } else {
          throw new Error(`browserContext should be either 'incognito' or 'default'. Received '${config.browserContext}'`);
        }

        await this.global.jestPuppeteer.resetPage();
      }
    };
    await this.global.jestPuppeteer.resetBrowser();
  }

  async teardown() {
    const {
      page,
      context,
      browser,
      puppeteerConfig
    } = this.global;

    if (page) {
      page.removeListener('pageerror', handleError);
    }

    if (puppeteerConfig.browserContext === 'incognito') {
      if (context) {
        await context.close();
      }
    } else if (page) {
      await page.close();
    }

    if (browser) {
      await browser.disconnect();
    }
  }

}

var _default = CustomPuppeteerEnvironment;
exports.default = _default;
