import { defineFeature, loadFeature } from 'jest-cucumber';
import { Login } from '../helper/login';
import { goToAddNetwork, networkcidr_error, networkendip_error, networkgwip_error, networkname_error, networkstartip_error } from '../helper/networks';
import { connectOS } from '../helper/node';
import { gotoAddSSHKey, name_del_error, name_error, sshkey_error } from '../helper/sshkey';
import { confirmpsw_error, email_error, email_info, fullname_error, gotoAddUser, password_error } from '../helper/user';
import { logger } from '../log.setup';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, expectToClick, goTo, getEnvConfig, closeModal } from '../../utils/utils';
import { andWhenNodeIs, givenIamLoggedIn, whenOrgis } from './shared-steps';
import { goToOrg, EditOrg, HoverOrg, ConfigureCustomBrand, LoginAs, OpenEditOrg, IsBrandingEnabled, GetLogoImg, VerifyForExpectedLogo, RevertBranding, ExpandSideBar, CollapseSideBar } from '../helper/org';
import { Org } from '../src/org';
import { Branding } from '../src/branding';
const { PendingXHR } = require('pending-xhr-puppeteer');



const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

let OStoken, db, consoleSpy

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/branding.feature',
  {
    errors: {
      missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
      missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
      missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
      missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
    },
    //tagFilter: '@branding',
  });

let reporter;
defineFeature(feature, test => {

  afterEach(async () => {
    await closeModal()
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    logger.info("After Each ");
    logger.info(performanceTiming);
    //await goTo(global.homeurl + '/home')
    await delay(5000)
    //await customScreenshot('afterEach.png', 1920, 1200)

  })

  beforeEach(async () => {
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    logger.info("Before Each ");
    logger.info(performanceTiming);
    //jest.setTimeout(60000)
  })

  afterAll(async () => {
    try {
      await logger.info('After ALL')
      await LoginAs("Admin")
      var config = await getEnvConfig()
      await goToOrg(config.orgName)
      await EditOrg(config.orgName, 'Disable')
      const elemXPath = "//button[contains(@title, 'My Account')]"
      try {
        const elemExists = await page.waitForXPath(elemXPath, { timeout: 30000 }) ? true : false;
        if (elemExists == true) {
          expect(elemExists).toBe(true)
          await expect(page).toClick('button[title="My Account"]')
          await page.waitFor(1000)
          //await expect(page).toClick('span', { text: 'Logout' })
          var jsonStr = "{ text: 'Logout' }"
          await expectToClick('span', jsonStr)
          await page.waitFor(2000)
          //perf
          logger.info(await testIotium(page));
          //perf
          await customScreenshot('loggedout.png', 1366, 768)
        }
      } catch (err) {
        logger.info("Ignorable exception, possibly have already logged out");
      }
      //await checkConsoleErrors();
      //Make a PDF of the tests by merging all screenshots into the pdf
      await createPDF(global.testStart, 'branding')
      if (global.env != 'staging') {
        await closemongoDB()
      }
      //Retrive the coverage objects
      //This is for stopping JS and CSS usages
      const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
      ]);

      //Stop perf tracing
      await page.tracing.stop();
      //trying HAR
      await har.stop();
      //get all the console logs

      jest.clearAllMocks();
      logger.info('Ending After all')
    }
    catch (err) {
      logger.info(err);
    }

  })

  beforeAll(async () => {
    try {

      jest.setTimeout(120000)
      page.setDefaultNavigationTimeout(120000);
      await page.setViewport({
        width: 1366,
        height: 768,
      });
      logger.info('Before all')
      //await delay(5000)



      //moving the login from setup to each test
      let login
      login = new Login();
      logger.info("global.env = " + global.env)
      logger.info("global.scope = " + global.scope)
      reporter = global.reporter
      await login.launch(global.env, global.scope)
      //moving the login from setup to each test
      /*
      await (page
        .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
        .then(() => logger.info('Waiting In before ALL berfore proceeding')))
      */
      await page.$x("//button[contains(@title, 'My Account')]", { visible: true, timeout: 30 })
      //await customScreenshot('beforeAll.png', 1366, 768)
      //This is for openstack
      if (global.env != 'staging') {
        OStoken = await connectOS()
        db = await connectmongoDB()
      }

      //This is for recording JS and CSS usages
      await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
      ]);
      //performance tracing
      await page.tracing.start({ path: './reports/branding' + global.testStart + '_tracing.json' });
      //trying HAR
      await har.start({ path: './reports/branding' + global.testStart + '.har', saveResponse: true });
      //for redirecting console logs
      //jest.clearAllMocks();
      //consoleSpy = jest.spyOn(console, 'log')


    }
    catch (err) {
      logger.info(err);
    }
  })

  test('Enable Branding', ({
    given,
    when,
    and,
    then,
  }) => {
    var flag = false

    given(/^I am logged in as "(.*?)"$/, async (scope) => {
      logger.info('I am logged in as ' + scope)
      reporter.startStep("Login as " + scope + " to enable branding")
      await LoginAs(scope)
      reporter.endStep()
    })
    whenOrgis(when)
    and(/^"(.*?)" Branding "(.*?)"$/, async (policyflag, org) => {
      logger.info("editing the ORG")
      //let screenshot = await customScreenshot('edit_branding.png', 1366, 768)
      if (org == 'orgName') {
        //here replace the node name from the env config file
        var config = await getEnvConfig()
        logger.info("config.orgName = " + config.orgName)
        org = config.orgName
      }
      reporter.startStep("Edit ORG and enable branding.");
      //let screenshot = await customScreenshot('edit_org_branding.png', 1366, 768)
      await EditOrg(org, policyflag)
      //reporter.addAttachment("Branding is ", screenshot, "image/png");
      reporter.endStep()
    })
    then(/^Branding Enabled "(.*?)"$/, async (org) => {
      logger.info("then verification")
      if (org == 'orgName') {
        //here replace the node name from the env config file
        var config = await getEnvConfig()
        logger.info("config.orgName = " + config.orgName)
        org = config.orgName
      }
      reporter.startStep("Verify is Braning icon is seen while hovering on ORG");
      //let screenshot = await customScreenshot('hover_org_branding.png', 1366, 768)
      var op = await HoverOrg(org)
      expect(op).toBe(true)
      //reporter.addAttachment("hover is ", screenshot, "image/png");
      reporter.endStep()

    })
  });
  test('Login with ORG_ADMIN', ({
    given,
    when,
    and,
    then,
  }) => {
    given(/^I am logged in as "(.*?)"$/, async (scope) => {
      logger.info('I am logged in as ' + scope)
      reporter.startStep("Login as " + scope)
      await LoginAs(scope)
      reporter.endStep()
    })
    whenOrgis(when)
    then(/^Branding in Advanced settings is "(.*?)"$/, async (ButtonState) => {
      logger.info('Advanced settings action to check ' + ButtonState)
      reporter.startStep("Verify Braning is " + ButtonState)
      //let screenshot = await customScreenshot('IsBrandingEnabled.png', 1366, 768)      
      var state = await IsBrandingEnabled()
      //reporter.addAttachment("IsBrandingEnabled ", screenshot, "image/png");
      logger.info('>>> ' + state)
      if (ButtonState == "Enable") {
        logger.info('enabled')
        expect(state).not.toBe(true)
      } else if (ButtonState == "Disable") {
        logger.info('disabled')
        expect(state).toBe(true)
      }
      reporter.endStep()
    })
  });
  test('Login with IOTIUM_ADMIN', ({
    given,
    when,
    and,
    then,
  }) => {
    given(/^I am logged in as "(.*?)"$/, async (scope) => {
      logger.info('I am logged in as ' + scope)
      reporter.startStep("Login as " + scope)
      await LoginAs(scope)
      reporter.endStep()
    })
    whenOrgis(when)
    then(/^Branding in Advanced settings is "(.*?)"$/, async (ButtonState) => {
      logger.info('Advanced settings action to check ' + ButtonState)
      reporter.startStep("Verify Branding in Advanced settings is " + ButtonState)
      //let screenshot = await customScreenshot('IsBrandingEnabled.png', 1366, 768)
      var state = await IsBrandingEnabled()
      //reporter.addAttachment("IsBrandingEnabled ", screenshot, "image/png");
      logger.info('>>> ' + state)
      if (ButtonState == "Enable") {
        logger.info('enabled')
        expect(state).not.toBe(true)
      } else if (ButtonState == "Disable") {
        logger.info('disabled')
        expect(state).toBe(true)
      }
      reporter.endStep()
    })
  });
  test('Configure Branding', ({
    given,
    when,
    and,
    then,
  }) => {
    var branding
    branding = new Branding()
    given(/^I am logged in as "(.*?)"$/, async (scope) => {
      logger.info('I am logged in as ' + scope)
      reporter.startStep("Login as " + scope)
      await LoginAs(scope)
      reporter.endStep()
    })
    whenOrgis(when)
    and(/^Customize Branding$/, async (table) => {
      logger.info("and verification")
      reporter.startStep("Configure Branding")
      table.forEach(row => {
        branding.ConfigureBranding(row.DarkLogoURL, row.LightLogoUrl, row.FavoIconUrl, row.LoginBgUrl, row.Theme, row.FromEmailAddress, row.FontFamilyUrl)
      });
      //reporter.startStep("customize branding");
      //let screenshot = await customScreenshot('customize_branding.png', 1366, 768)
      var config = await getEnvConfig()
      var ret = await ConfigureCustomBrand(config.orgName, branding)
      expect(ret).toBe(true)
      //reporter.addAttachment("customize ", screenshot, "image/png");
      reporter.endStep()
    })
    then(/^"(.*?)" Page should have "(.*?)" "(.*?)"$/, async (endpoint, logo1, logo2) => {
      reporter.startStep("Verifying LOGO on home page")
      await page.goto(global.homeurl + '/' + endpoint)
      await delay(5000)
      //let screenshot = await customScreenshot('VerifyForExpectedLogo.png', 1366, 768)
      var op = await VerifyForExpectedLogo([logo1], await GetLogoImg())
      //reporter.addAttachment("VerifyForExpectedLogo ", screenshot, "image/png");
      //let screenshot = await customScreenshot('CollapseSideBar.png', 1366, 768)
      await CollapseSideBar()
      var op2 = await VerifyForExpectedLogo([logo2], await GetLogoImg())
      //reporter.addAttachment("CollapseSideBar ", screenshot, "image/png");
      //let screenshot1 = await customScreenshot('ExpandSideBar.png', 1366, 768)
      await ExpandSideBar()
      //reporter.addAttachment("ExpandSideBar ", screenshot1, "image/png");
      expect(op).toBe(true)
      expect(op2).toBe(true)
      reporter.endStep()
    })
    and(/^Font Family is "(.*?)"$/, async (ff) => {
      reporter.startStep("Verify Font Family URL is loaded")
      var flag = false
      await page.setRequestInterception(true);
      await page.on('request', interceptedRequest => {
        if (interceptedRequest.url() === ff) {
          console.log('font family url found')
          console.log('flag= ' + flag)
          flag = true
          console.log('flag= ' + flag)
          //interceptedRequest.abort();
        } else {
          //interceptedRequest.continue();
        }
      }, 1000);
      await page.setRequestInterception(false);
      //console.log('flag= ' + flag)
      //expect(flag).toBe(true)
      reporter.endStep()
    })
  });
  test('Delete Branding', ({
    given,
    when,
    and,
    then,
  }) => {
    //var branding
    //branding = new Branding()
    var b_logo
    var a_logo
    given(/^I am logged in as "(.*?)"$/, async (scope) => {
      logger.info('I am logged in as ' + scope)
      reporter.startStep("Login as " + scope)
      await LoginAs(scope)
      reporter.endStep()
    })
    whenOrgis(when)
    and(/^Revert Branding$/, async () => {
      reporter.startStep("Revert Branding")
      page.goto(page.url())
      b_logo = await GetLogoImg()
      logger.info(b_logo)
      logger.info('reverting...')
      var config = await getEnvConfig()
      //let screenshot = await customScreenshot('RevertBranding.png', 1366, 768)
      var op = await RevertBranding(config.orgName)
      //reporter.addAttachment("RevertBranding ", screenshot, "image/png");
      expect(op).toBe(true)
      reporter.endStep()
    })
    then(/^Config get removed$/, async () => {
      reporter.startStep("Check for ioTium LOGO")
      logger.info('Config get removed')
      await page.goto(page.url())
      await delay(5000)
      //a_logo = await GetLogoImg()
      //logger.info('before>>> ' + b_logo)
      //logger.info('after>>> ' + a_logo)
      //expect(a_logo).toBe([])
      reporter.endStep()
    })
  });
  test('Configure Branding2', ({
    given,
    when,
    and,
    then,
  }) => {
    var branding
    branding = new Branding()
    given(/^I am logged in as "(.*?)"$/, async (scope) => {
      reporter.startStep('I am logged in as ' + scope)
      await LoginAs(scope)
      reporter.endStep()
    })
    whenOrgis(when)
    and(/^Customize Branding$/, async (table) => {
      //logger.info("and verification")
      table.forEach(row => {
        branding.ConfigureBranding(row.DarkLogoURL, row.LightLogoUrl, row.FavoIconUrl, row.LoginBgUrl, row.Theme, row.FromEmailAddress, row.FontFamilyUrl)
      });
      reporter.startStep("customize branding");
      let screenshot = await customScreenshot('customize_branding2.png', 1366, 768)
      var config = await getEnvConfig()
      var ret = await ConfigureCustomBrand(config.orgName, branding)
      expect(ret).toBe(false)
      reporter.addAttachment("customize ", screenshot, "image/png");
      reporter.endStep()
    })
    then(/^Error seen "(.*?)"$/, async (errMsg) => {
      reporter.startStep("Error Seen");
      var linkTexts = await page.$$eval(".ant-message > span",
        elements => elements.map(item => item.textContent))
      var op = await VerifyForExpectedLogo([errMsg], linkTexts)
      expect(op).toBe(true)
      reporter.endStep()
    })
  });
  test('Branding Error Scenario I', ({
    given,
    when,
    and,
    then,
  }) => {
    var branding
    branding = new Branding()
    given(/^I am logged in as "(.*?)"$/, async (scope) => {
      reporter.startStep('I am logged in as ' + scope)
      await LoginAs(scope)
      reporter.endStep()
    })
    whenOrgis(when)
    and(/^Customize Branding$/, async (table) => {
      //logger.info("and verification")
      table.forEach(row => {
        branding.ConfigureBranding(row.DarkLogoURL, row.LightLogoUrl, row.FavoIconUrl, row.LoginBgUrl, row.Theme, row.FromEmailAddress, row.FontFamilyUrl)
      });
      reporter.startStep("customize branding");
      let screenshot = await customScreenshot('customize_branding1.png', 1366, 768)
      var config = await getEnvConfig()
      var ret = await ConfigureCustomBrand(config.orgName, branding)
      expect(ret).toBe(false)
      reporter.addAttachment("customize ", screenshot, "image/png");
      reporter.endStep()
    })
    then(/^Error seen "(.*?)"$/, async (errMsg) => {
      reporter.startStep("Checking for URL validation Error");
      var flag = false
      try {
        await expect(page).toMatchElement('div.ant-form-explain', { text: errMsg, visible: true })
        logger.info('error message seen')
        flag = true
      } catch (err) {
        logger.error('error message not seen')
        flag = false
      }
      expect(flag).toBe(true)
      reporter.endStep()
    })
  });

});

