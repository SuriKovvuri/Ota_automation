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
import { goToCluster } from '../helper/cluster';

const fs = require('fs');

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');


const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/cluster.feature', 
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
        logger.info("after modal close")
        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        logger.info("After Each ");
        var config = await getEnvConfig()
        logger.info(performanceTiming);
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
        await deleteAllServices();
        await delay(10000)
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
          jest.setTimeout(1200000)
          console.log("beforeall2 ", Date.now())
          await page.setDefaultNavigationTimeout(50000); 
          await page.waitFor(5000);

          let config = await getEnvConfig()
          global.orchIP = config.orchIP


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
           logger.info("beforeall completed")
        }
        catch(err) {
            logger.error(err);
          }
        })       


  test('Add a TAN Network in cluster', async ({
    given,
    when,
    and,
    then
  }) => {
    console.info("In test1")
    given(/^Cluster exists "(.*?)"$/, async (clusterName) => {
      logger.info("Given Cluster exists")
      reporter.startStep(`Given Cluster exists ${clusterName}`);
      await goToCluster(clusterName)
      let screenshot = await customScreenshot('cluster_exists.png', 1920, 1200)
      reporter.addAttachment("Cluster Exists", screenshot, "image/png");
      reporter.endStep();
      //expect(status).toBe(true)
    });
    when(/^Add A TAN Network in the cluster$/, async (table) => {
      reporter.startStep("When Add A TAN Network in the cluster");

      var network
      for (var row of table) {
        var config = await getEnvConfig()
        if (row.NetworkName == 'node1_tan1') {
          logger.info("config.node1_tan1 = " + config.node1_tan1)
          row.NetworkName = config.node1_tan1
        }
        if (row.NodeName == 'node1') {
          logger.info("config.node1 = " + config.node1)
          row.NodeName = config.node1
        }
        network = new NetworkAdd()
        network.setNetworkAdd(row.NetworkName, row.Label, row.Nw_Addressing, row.CIDR, row.Start_IP, row.end_IP,
          row.GW, row.VLAN, row.VLAN_ID, row.Default_Destination)
      }
      await addTanNetwork(network)
      //let screenshot = await customScreenshot('restart.png', 1920, 1200)
      //reporter.addAttachment("Restart Service", screenshot, "image/png");
      reporter.endStep();
    });
    then(/^Network should be Added "(.*?)"$/, async (networkname) => {
      reporter.startStep("Then Network should be Added");
      logger.info('Then Network Should be Added ' + networkname);
      reporter.startStep("Then Network should be Added " + networkname);
      var exist = await goToNetwork(networkname)
      expect(exist).toBeTruthy
      let screenshot = await customScreenshot('networkCreated.png', 1920, 1200)
      reporter.addAttachment("Network created_" + networkname, screenshot, "image/png");
      reporter.endStep();  
      //let screenshot = await customScreenshot('restarting.png', 1920, 1200)
      //reporter.addAttachment("Service Restarting", screenshot, "image/png");
      reporter.endStep();
      //expect(status).toBe(true)
    });
  });
  
  test('Add Services in cluster', async ({
    given,
    when,
    and,
    then
  }) => {
    console.info("In test1")
    given(/^Cluster exists "(.*?)"$/, async (clusterName) => {
      logger.info("Given Cluster exists")
      reporter.startStep(`Given Cluster exists ${clusterName}`);
      await goToCluster(clusterName)
      let screenshot = await customScreenshot('cluster_exists.png', 1920, 1200)
      reporter.addAttachment("Cluster Exists", screenshot, "image/png");
      reporter.endStep();
      //expect(status).toBe(true)
    });
    when(/^I add service$/, async (table) => {
      reporter.startStep("When I add service");
      for (var row of table) {
          let service_file = `./utils/${row.ServiceFields}.json`
          let rawdata = fs.readFileSync(service_file);
          let fields = JSON.parse(rawdata);
          let created = await addService(row.ServiceName,row.AppName,row.NetworkName, fields)
          await expect(created).toBe(true)
      }
      reporter.endStep();
    });
    then(/^Services should be healthy "(.*?)"$/, async (serviceName) => {
      reporter.startStep("Then Services should be healthy");
      let services = serviceName.split(',')
      for(let i=0;i<services.length;i++){
          //let screenshot = await customScreenshot('serviceHealthy'+ i + '.png', 1920, 1200)
          let status = await serviceStatus(services[i],"HEALTHY")
          await expect(status).toBe(true)
      }
      reporter.endStep();
    });
  });


});