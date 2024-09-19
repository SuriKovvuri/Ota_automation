import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage, deleteAllAlertSubscription } from '../helper/alert';
import { addTanNetwork, getCountOfNetworks, goAllNetworks, goToNetwork, goToNetworkAction, expandTabsInNetworkPage, connectNetwork, getTunnelStatus, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive } from '../helper/node';
import { verifyServiceRestartCount, addService, serviceStatus, goToService, deleteAllServices, goToServiceAction, editSkySpark, verifySkySparkconfig, editniagara, verifyniagaraconfig } from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig, closeModal } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis, whenIAddTanNetwork, whenIConnectNetwork, whenTunnelStatusExists } from './shared-steps';
import { del } from 'openstack-client/lib/util';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { NetworkAdd } from '../src/networkAdd';
import { LoginAs } from '../helper/org';
import { deleteNetworksInNode, deleteServicesInNode } from '../../utils/api_utils';

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');


const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/servicevalidation.feature',
  {
    errors: {
      missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
      missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
      missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
      missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
    }
    //tagFilter: '@servicecase2',
  });

let reporter;


defineFeature(feature, test => {

  afterEach(async () => {
    await closeModal()
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    logger.info("After Each ");
    var config = await getEnvConfig()
    logger.info(performanceTiming);
    await deleteAllServices();
    //await page.goto(global.homeurl+'/home' )
    //await delay(10000)
    //await page.goto(global.homeurl+'/home' )
    //await delay(5000)
    await customScreenshot('afterEach.png', 1920, 1200)
  })

  beforeEach(async () => {
    //await page.waitForNavigation()
    //perf      
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    logger.info("Before Each ");
    logger.info(performanceTiming);
    //perf
    jest.setTimeout(1200000)
    await delay(5000)

  })

  afterAll(async () => {

    try {
      logger.info('After ALL')
      //await deleteAllNetworks();
      const elemXPath = "//button[contains(@title, 'My Account')]"
      const elemExists = await page.waitForXPath(elemXPath, { timeout: 10000 }) ? true : false;
      expect(elemExists).toBe(true)
      await expect(page).toClick('button[title="My Account"]')
      await page.waitFor(1000)
      await expect(page).toClick('span', { text: 'Logout' })
      await page.waitFor(2000)
      //perf
      logger.info(await testIotium(page));
      await customScreenshot('loggedout.png', 1920, 1200)
      //perf
      //await checkConsoleErrors();
      //Make a PDF of the tests by merging all screenshots into the pdf
      await createPDF(global.testStart, 'status')
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

    }
    catch (err) {
      logger.info(err);
    }

  })

  beforeAll(async () => {

    try {
      //page.waitForNavigation()
      console.log("beforeall ", Date.now())
      jest.setTimeout(300000)
      console.log("beforeall2 ", Date.now())
      await page.setDefaultNavigationTimeout(50000);
      await page.waitFor(5000);

      let config = await getEnvConfig()
      global.orchIP = config.orchIP
      global.apiKey = config.apiKey

      let login
      login = new Login();
      logger.info("global.env = " + global.env)
      await login.launch(global.env, global.scope)

      await (page
        .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
        .then(() => logger.info('Waiting In before ALL berfore proceeding')))

      await page.$x("//button[contains(@title, 'My Account')]", { visible: true })
      reporter = global.reporter
      await customScreenshot('beforeAll.png', 1920, 1200)

      //This is for recording JS and CSS usages
      await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
      ]);
      //performance tracing
      await page.tracing.start({ path: './reports/status' + global.testStart + '_tracing.json' });
      //trying HAR
      await har.start({ path: './reports/status' + global.testStart + '.har', saveResponse: true });

      await deleteServicesInNode(config.node1)
      await deleteNetworksInNode(config.node1)

      await goToNode(config.node1)
      await delay(3000)
      //await verifyServiceRestartCount("serv","1")
      var network
      network = new NetworkAdd()
      network.setNetworkAdd(config.node1_tan1, "uiauto:tan", "Static", "11.1.1.0/24", "11.1.1.100", "11.1.1.110", "11.1.1.100", "Disabled", "","")
      await addTanNetwork(network)
    }
    catch (err) {
      logger.error(err);
    }
  })

  test('Skyspark Service create with existing license', async ({
    given,
    when,
    and,
    then
  }) => {
    let serviceName = "servicecase1"
    console.info("In test1")
    given('Skyspark Service create with existing license', async () => {
      logger.info("Skyspark Service create with existing license")
      reporter.startStep("Skyspark Service create with existing licenser");
      let config = await getEnvConfig()
      var ss = {
        'password': '1234',
        'license': 'license1',
        'ssh': 'pccc',
        'httpPort': '80'
      }
      await addService(serviceName, 'SkySpark', config.node1_tan1, ss)
      let status = await serviceStatus(serviceName, 'HEALTHY')
      let screenshot = await customScreenshot('healthyservice.png', 1920, 1200)
      reporter.addAttachment("Healthy Service", screenshot, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });
    when('I edit the service', async () => {
      reporter.startStep("I edit the service");
      await goToServiceAction(serviceName, "edit")
      await delay(1000)
      let config = await getEnvConfig()
      var ss = {
        'password': '1234',
        'license': 'license',
        'ssh': 'autovolume',
        'lastssh': 'enabled',
        'httpPort': '80',
        'version': '3.0.21',
        'dns': '8.8.8.8'
      }
      await editSkySpark(serviceName, 'SkySpark', config.node1_tan1, ss)
      logger.info("sleeping for service to come up after edit")
      await delay(120000)
      let screenshot = await customScreenshot('edit.png', 1920, 1200)
      let status = await serviceStatus(serviceName, 'HEALTHY')
      reporter.addAttachment("edit Service", screenshot, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });
    then('Verify Skyspark service config', async () => {
      reporter.startStep("Verify Skyspark service config");
      await logger.info("Verify Skyspark service config")
      await goToServiceAction(serviceName, "edit")
      await delay(1000)
      let config = await getEnvConfig()
      var ss = {
        'password': '1234',
        'license': 'license',
        'ssh': 'autovolume',
        'lastssh': 'enabled',
        'httpPort': '80',
        'version': '3.0.21',
        'dns': '8.8.8.8'
      }
      await verifySkySparkconfig(serviceName, 'SkySpark', config.node1_tan1, ss)
      let screenshot = await customScreenshot('verify.png', 1920, 1200)
      let status = await serviceStatus(serviceName, 'HEALTHY')
      reporter.endStep();
      expect(status).toBe(true)
    });

  });


  test('Niagra Service Create', async ({
    given,
    when,
    //and,
    then
  }) => {
    let serviceName = "servicecase2"
    console.info("In test2")
    given('Niagra Service Create', async () => {
      logger.info("Niagra Service Create")
      reporter.startStep("Niagra Service Create");
      let config = await getEnvConfig()
      await addService(serviceName, 'Niagara 4', config.node1_tan1, {})
      let status = await serviceStatus(serviceName, 'HEALTHY')
      let screenshot = await customScreenshot('healthyservice.png', 1920, 1200)
      reporter.addAttachment("Healthy Service", screenshot, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });

    when('I edit the service', async () => {
      reporter.startStep("I edit the service");
      await goToServiceAction(serviceName, "edit")
      await delay(1000)
      let config = await getEnvConfig()
      var ss = {
        'dns': '8.8.8.8'
      }
      await editniagara(serviceName, 'Niagara 4', config.node1_tan1, ss)
      logger.info("sleeping for service to come up after edit")
      await delay(10000)
      let screenshot = await customScreenshot('edit.png', 1920, 1200)
      let status = await serviceStatus(serviceName, 'HEALTHY')
      reporter.addAttachment("edit Service", screenshot, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });

    then('Verify Niagara service config', async () => {
      reporter.startStep("Verify Niagara service config");
      await logger.info("Verify Niagara service config")
      await goToServiceAction(serviceName, "edit")
      await delay(1000)
      let config = await getEnvConfig()
      var ss = {
        'dns': '8.8.8.8'
      }
      await verifyniagaraconfig(serviceName, 'Niagara 4', config.node1_tan1, ss)
      let screenshot = await customScreenshot('verify.png', 1920, 1200)
      let status = await serviceStatus(serviceName, 'HEALTHY')
      reporter.endStep();
      expect(status).toBe(true)
    });

  });

  test('Create Service with All Components', async ({
    given,
    when,
    and,
    then,
  }) => {
    given(/^I am logged in as "(.*?)"$/, async (scope) => {
      console.log('I am logged in as ' + scope)
      logger.info('I am logged in as ' + scope)
      reporter.startStep("Login as " + scope)
      await LoginAs(scope)
      reporter.endStep()
    })
    //whenOrgis(and)
    when('Create QA Service', async () => {
      console.log("Create QA Service")
      logger.info("Create QA Service")
      let config = await getEnvConfig()
      reporter.startStep("Novigate to iNode Page");
      await goToNode(config.node1)
      await delay(3000)
      let screenshot = await customScreenshot('qa_inode_oage.png', 1366, 768)
      reporter.addAttachment("On iNode Page", screenshot, "image/png");
      reporter.endStep();

      reporter.startStep("Create QA Service");
      var ss = {
        'license': 'dhcp_ddns_s1_cfg1____________',
        'dockerConfig': 'config.json'
      }
      let status = await addService(config.node1_service1, 'All Components of Service Template', config.node1_tan1, ss)
      let screenshot1 = await customScreenshot('qa_service.png', 1366, 768)
      reporter.addAttachment("Healthy QA Service", screenshot1, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });
    then(/^Verify service is "(.*?)"$/, async (state) => {
      console.log("Verify service")
      logger.info("Verify service")
      let config = await getEnvConfig()
      reporter.startStep("Verify QA Service");
      let status = await serviceStatus(config.node1_service1, 'HEALTHY')
      let screenshot1 = await customScreenshot('qa_service.png', 1366, 768)
      reporter.addAttachment("Healthy QA Service", screenshot1, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });

  });

  test('Edit QA Service', async ({
    given,
    when,
    and,
    then,
  }) => {
    given(/^I am logged in as "(.*?)"$/, async (scope) => {
      console.log('I am logged in as ' + scope)
      logger.info('I am logged in as ' + scope)
      reporter.startStep("Login as " + scope)
      await LoginAs(scope)
      reporter.endStep()
    })
    //whenOrgis(and)
    when('I edit the service', async () => {
      console.log("I edit the service")
      logger.info("I edit the service")
      let config = await getEnvConfig()
      reporter.startStep("Novigate to iNode Page");
      await goToNode(config.node1)
      await delay(3000)
      let screenshot = await customScreenshot('qa_inode_oage.png', 1366, 768)
      reporter.addAttachment("On iNode Page", screenshot, "image/png");
      reporter.endStep();

      reporter.startStep("I edit the service");
      var ss = {
        'license': 'dhcp_ddns_s1_cfg1____________',
        'dockerConfig': 'config.json'
      }
      await goToServiceAction(config.node1_service1, "edit")
      await delay(1000)
      let screenshot1 = await customScreenshot('qa_edit_service.png', 1366, 768)
      reporter.addAttachment("Healthy QA Service", screenshot1, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });
    then(/^Verify service is "(.*?)"$/, async (state) => {
      console.log("Verify service")
      logger.info("Verify service")
      let config = await getEnvConfig()
      reporter.startStep("Verify QA Service");
      let status = await serviceStatus(config.node1_service1, 'HEALTHY')
      let screenshot1 = await customScreenshot('qa_edit_service.png', 1366, 768)
      reporter.addAttachment("Healthy QA Service", screenshot1, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });

  });


});

