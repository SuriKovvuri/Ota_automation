import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage, deleteAllAlertSubscription } from '../helper/alert';
import { addTanNetwork, getCountOfNetworks, goAllNetworks, goToNetwork, goToNetworkAction, expandTabsInNetworkPage, connectNetwork, getTunnelStatus, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive } from '../helper/node';
import { verifyServiceRestartCount, addService, serviceStatus, goToService, deleteAllServices, goToServiceAction} from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig, closeModal } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis, whenIAddTanNetwork, whenIConnectNetwork, whenTunnelStatusExists } from './shared-steps';
import { del } from 'openstack-client/lib/util';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { NetworkAdd } from '../src/networkAdd';
import { deleteNetworksInNode, deleteServicesInNode } from '../../utils/api_utils';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');


const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/servicerestart.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              }
                //tagFilter: '@test',
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
        let config = await getEnvConfig()
        await deleteServicesInNode(config.node1)
        await delay(5000)
           
    })

    afterAll(async () => {
      try {
        logger.info('After ALL')
        await deleteAllNetworks();
        const elemXPath = "//button[contains(@title, 'My Account')]"
        const elemExists = await page.waitForXPath(elemXPath, {timeout: 10000}) ? true : false;
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
        await createPDF(global.testStart,'status')
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
      catch(err) {
          logger.info(err);
        }
  
      })

      beforeAll(async() => {

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
          logger.info("global.env = "+global.env)
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
           await page.tracing.start({ path: './reports/status'+global.testStart+'_tracing.json' });
           //trying HAR
           await har.start({ path: './reports/status'+global.testStart+'.har', saveResponse: true }); 

           await deleteServicesInNode(config.node1)
           await deleteNetworksInNode(config.node1)

           await goToNode(config.node1)
           await delay(3000)
           //await verifyServiceRestartCount("serv","1")
           var network
           network = new NetworkAdd()
           network.setNetworkAdd(config.node1_tan1, "uiauto:tan", "Static", "11.1.1.0/24", "11.1.1.100", "11.1.1.110", 
             "11.1.1.100", "Disabled", "","")
           await addTanNetwork(network)
        }
        catch(err) {
            logger.error(err);
          }
        })    


  test('Service restart with single container', async ({
    given,
    when,
    and,
    then
  }) => {
    let serviceName = "servicecase1"
    console.info("In test1")
    given('A sevice is healthy on iNode with single container', async() => {
      logger.info("A sevice is healthy on iNode with single container")
      reporter.startStep("A sevice is healthy on iNode with restart policy never");
      let config = await getEnvConfig()
      await addService(serviceName,'ThingWorx',config.node1_tan1, {})
      let status = await serviceStatus(serviceName, 'HEALTHY')
      let screenshot = await customScreenshot('healthyservice.png', 1920, 1200)
      reporter.addAttachment("Healthy Service", screenshot, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });
    when('I restart the service', async() =>{
      reporter.startStep("I restart the service");
      await goToServiceAction(serviceName, "restart")
      await delay(1000)
      let screenshot = await customScreenshot('restart.png', 1920, 1200)
      reporter.addAttachment("Restart Service", screenshot, "image/png");
      reporter.endStep();
    });
    then('Service must go to Restarting state', async() =>{
      reporter.startStep("Service must go to Restarting state");
      let status = await serviceStatus(serviceName, 'RESTARTING')
      let screenshot = await customScreenshot('restarting.png', 1920, 1200)
      reporter.addAttachment("Service Restarting", screenshot, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });
    and('Restart count is incremented', async() =>{
      let status = await verifyServiceRestartCount(serviceName, '1')
      expect(status).toBe(true)
    });
    and('Service must come back to healthy state', async() =>{
      reporter.startStep("Service must come back to healthy state");
      let status = await serviceStatus(serviceName, 'HEALTHY')
      reporter.endStep();
      expect(status).toBe(true)
    });

  });
  
  
  test('Service restart with multiple containers', async ({
    given,
    when,
    and,
    then
  }) => {
    let serviceName = "servicecase2"
    console.info("In test1")
    given('A sevice is healthy on iNode with multi container', async() => {
      logger.info("A sevice is healthy on iNode with single container")
      reporter.startStep("A sevice is healthy on iNode with restart policy never");
      let config = await getEnvConfig()
      var ss = {
        'password':'ss',
        'license':'license',
        'ssh':'autovolume',
        'httpPort':'80'
      }
      await addService(serviceName,'SkySpark',config.node1_tan1, ss)
      let status = await serviceStatus(serviceName, 'HEALTHY')
      let screenshot = await customScreenshot('healthyservice.png', 1920, 1200)
      reporter.addAttachment("Healthy Service", screenshot, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });
    when('I restart the service', async() =>{
      reporter.startStep("I restart the service");
      await goToServiceAction(serviceName, "restart")
      await delay(1000)
      let screenshot = await customScreenshot('restart.png', 1920, 1200)
      reporter.addAttachment("Restart Service", screenshot, "image/png");
      reporter.endStep();
    });
    then('Service must go to Restarting state', async() =>{
      reporter.startStep("Service must go to Restarting state");
      let status = await serviceStatus(serviceName, 'RESTARTING')
      let screenshot = await customScreenshot('restarting.png', 1920, 1200)
      reporter.addAttachment("Service Restarting", screenshot, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });
    and('Restart count is incremented', async() =>{
      let status = await verifyServiceRestartCount(serviceName, '1')
      expect(status).toBe(true)
    });
    and('Service must come back to healthy state', async() =>{
      reporter.startStep("Service must come back to healthy state");
      await logger.info("Service must come back to healthy state")
      let status = await serviceStatus(serviceName, 'HEALTHY')
      reporter.endStep();
      expect(status).toBe(true)
    });

  });



  test('Service restart with restart policy as never', async ({
    given,
    when,
    and,
    then
  }) => {
    let serviceName = "servicecase3"
    console.info("In test1")
    given('A sevice is healthy on iNode with restart policy never', async() => {
      logger.info("A sevice is healthy on iNode with restart policy never")
      reporter.startStep("A sevice is healthy on iNode with restart policy never");
      let config = await getEnvConfig()
      await addService(serviceName,'Custom',config.node1_tan1, {'fileName':'custom_restart_never.json'})
      let status = await serviceStatus(serviceName, 'HEALTHY')
      let screenshot = await customScreenshot('healthyservice.png', 1920, 1200)
      reporter.addAttachment("Healthy Service", screenshot, "image/png");
      reporter.endStep();
      expect(status).toBe(true)
    });
    when('I try restarting the service', async() =>{
      reporter.startStep("I try restarting the service");
      const service = await goToService(serviceName)
      const netGear = await service.$('button.ant-dropdown-trigger', { visible: true }) 
      await netGear.hover()
      await delay(1000)
      let screenshot = await customScreenshot('servicegear.png', 1920, 1200)
      reporter.addAttachment("Trying restart", screenshot, "image/png");
      reporter.endStep();
    });
    then('Restart service button must be disabled', async() =>{
      reporter.startStep("Restart service button must be disabled");
      const service = await goToService(serviceName)
      const netGear = await service.$('button.ant-dropdown-trigger', { visible: true }) 
      await netGear.hover()
      await delay(1000)
      var el
      await page.evaluate(() => {
        el = document.querySelector('button[title="Service restart disabled because restart policy is set to never"]');
      });
      let handle = await page.$('button[title="Service restart disabled because restart policy is set to never"]')
      await handle.hover()
      await delay(1000)
      let screenshot = await customScreenshot('restartdisabled.png', 1920, 1200)
      reporter.addAttachment("Disabled service restart", screenshot, "image/png");
      reporter.endStep()
    });

  });

});