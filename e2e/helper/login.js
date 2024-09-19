import { logger } from '../log.setup';
import { customScreenshot, delay, expectToClick, getElementHandleByXpath, getEnvConfig, goTo, performAction } from '../../utils/utils';
import { leftpane, modals } from '../constants/locators';

const PuppeteerHar = require('puppeteer-har');
const { PendingXHR } = require('pending-xhr-puppeteer');
const har = new PuppeteerHar(page);

export class Login {
    constructor() {

    }

    async launch(env, scope, credentials=null, password=null) {

        var config
        await har.start({ path: './reports/login_' + global.testStart + '.har', saveResponse: true });
        //await page.setDefaultNavigationTimeout(30000); 
        //await page.goto(Settings.orchURL)
        //if (env == 'staging')
        logger.info("env = " + env)
        //var file = '../env/'+env+'_config.js'
        //config  = require(file);

        config = await getEnvConfig()

        //await page.goto('https://192.170.200.8')
        global.orchIP = config.orchIP
        global.homeurl = config.orchURL
        global.orgName = config.orgName
        global.OSprefix = config.OSprefix
        global.apiKey = config.apiKey
        //const pendingXHR = new PendingXHR(page);
        //await page.goto(config.orchURL)
        if (scope != 'custom' && scope != 'changepwd') {
            await goTo(config.orchURL)
        }
        //logger.info("count 1 = ", pendingXHR.pendingXhrCount())
        //if (typeof(title)==='undefined') title = 'Login - ioTium Orchestrator';
        //await expect(page.title()).resolves.toMatch(title);
        const cookies = await page.cookies()
        logger.info("Cookies print " + cookies);
        logger.info('Before ALL')
        //await customScreenshot('loginPage.png', 1920, 1200)
        //jest.setTimeout(30000)
        //jest.setTimeout.timeout = 30000
        logger.info("scope is ",scope)
        if (scope == 'Admin') {
            await expect(page).toFill('input[id="username"]', config.iotiumAdmin)
            await expect(page).toFill('input[id="password"]', config.iotiumAdminPassword)
        } else if (scope == 'orgAdmin') {
            await expect(page).toFill('input[id="username"]', config.orgAdmin)
            await expect(page).toFill('input[id="password"]', config.orgAdminPassword)
        } else if (scope == 'custom') {
            await expect(page).toFill('input[id="username"]', credentials.username)
            await expect(page).toFill('input[id="password"]', credentials.password)
        } else if (scope == 'changepwd') {
            await expect(page).toFill('input[id="username"]', eval("config."+scope+"_username"))
            if (password == null) {
                await expect(page).toFill('input[id="password"]', eval("config."+scope+"_password"))
            } else {
                await expect(page).toFill('input[id="password"]', password)
            }
        } else {
            await expect(page).toFill('input[id="username"]', config.orgReadonly)
            await expect(page).toFill('input[id="password"]', config.orgReadonlyPassword)
        }
        let screenshot = await customScreenshot('launch.png', 1366, 768)
        await delay(1000)
        //await expect(page).toClick('button', { text: 'Login' })
        var jsonStr = "{ text: 'Login' }"
        await expectToClick('button', jsonStr)
        global.reporter.addAttachment("launch ", screenshot, "image/png");
        //logger.info("count 2 = ", pendingXHR.pendingXhrCount())
        /* const finalResponse = await page.waitForResponse(response => 
            (response.status() === 200)
            && (response.request().method() === 'POST'), 30);//in 30 seconds */

        //logger.info("count 3 = ", pendingXHR.pendingXhrCount())
        logger.info("Hit login")

        //await delay(5000)
        /* await Promise.all([
            await expect(page).toClick('button', { text: 'Login' }),
            await page.waitForResponse(response => response.status() === 200),
            //await page.waitForNavigation({ waitUntil: 'networkidle2' })
          ]); 
          const finalResponse = await page.waitForResponse(response => 
            (response.status() === 200)
            && (response.request().method() === 'POST'), 30);//in 30 seconds
            */
        //await delay(2000)
        //logger.info("count 4 = ", pendingXHR.pendingXhrCount())
        //await pendingXHR.waitForAllXhrFinished();
        //logger.info("count 5 = ", pendingXHR.pendingXhrCount())
        logger.info("login completed wait for networkidle")
        await delay(1000)

        /*
          await page
            .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
            .then(() => logger.info('Completed login and in home page'))
        expect(await page.$x("//button[contains(., 'Login')]", { hidden: true }) ? true : false).toBe(true)
        */
        //await customScreenshot('home.png', 1920, 1200)
        //waiting 5 seconds after logging in
        await har.stop();

    }

    async logout() {
        try {
            await page.waitForXPath(leftpane.button.logout)
            await performAction("click", leftpane.button.logout)
            await page.waitFor(1000)
            let checkModal = await getElementHandleByXpath(modals.button.primary)
            if (checkModal.length != 0) {
              //await performAction("click", modals.button.primary)
              await Promise.all([
                performAction("click", modals.button.primary),
                page.waitForNavigation({waitUntil: 'networkidle2'})
              ])
            }
            await page.waitForXPath('//input[@id="username"]',{timeout: 120000})
            await customScreenshot('loggedout.png', 1920, 1200)
            return true
        }
        catch(err) {
            logger.error("Exception caught: "+err);
            return false
        }
    }

}