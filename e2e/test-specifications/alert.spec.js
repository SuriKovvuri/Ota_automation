import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage, deleteAllAlertSubscription } from '../helper/alert';
import { getCountOfNetworks, goAllNetworks, goToNetwork, goToNetworkAction, expandTabsInNetworkPage, connectNetwork, getTunnelStatus, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive } from '../helper/node';
import { addService, serviceStatus } from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis, whenIAddTanNetwork, whenIConnectNetwork, whenTunnelStatusExists } from './shared-steps';
import { del } from 'openstack-client/lib/util';
import { Login } from '../helper/login';
import { logger } from '../log.setup';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');

let OStoken, db

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/alert.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              }
                //tagFilter: '@TunnelAlertCase1',
            });

            let reporter;
        
            
defineFeature(feature, test => {

    afterEach(async () => {
        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        logger.info("After Each ");
        var config = await getEnvConfig()
        logger.info(performanceTiming);
        await page.goto(global.homeurl+'/home' )
        await delay(10000)
        logger.info("node1 is " + config.node1)
        await goToNode(config.node1)
        await delay(3000)
        await disconnectAllTunnels(config.node1_tan1)
        await delay(3000)
        await deleteAllNetworks()
        await deleteAllAlertSubscription()
        await makeAllNodesAlive(OStoken)
        await page.goto(global.homeurl+'/home' )
        await delay(5000)
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
        await closemongoDB()
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
          logger.info("00"+Date.now())
          //await delay(5000);
          //logger.info("FF"+Date.now())
          let config = await getEnvConfig()
          global.orchIP = config.orchIP
          //This is for openstack
          OStoken = await connectOS()
          db = await connectmongoDB()
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
           
        }
        catch(err) {
            logger.info(err);
          }
        })    

  const whenIAddAlertSubscriptions = when => {
    when(/^I Add Alert subscriptions$/, async (table) => {
      logger.info("Starting to add Alert subscriptions")
      var alerts = []
      var alert
      for (let i=0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let tunnel_name = row.TunnelName.split(':')
        var config = await getEnvConfig()
        for (let i=0;i<tunnel_name.length;i++)
        {
          if (tunnel_name[i] == 'node1' || tunnel_name[i] == 'vnode1' || tunnel_name[i] == 'vnode2')
          {
            tunnel_name[i] = config.node1
          } else if (tunnel_name[i] == 'node1_tan1') {
            tunnel_name[i] = config.node1_tan1
          }
        }
        row.TunnelName = tunnel_name.join(':')
        alert = new AlertAdd()
        alert.setAlertAdd(row.SubscriptionName, row.OrgName, row.NodeName, row.TunnelName, row.ServiceName, row.Label,
          row.If, row.Is, row.For,row.Scope)

        await goToAlertPage()
        await addAlertSubscription(alert)
        alerts.push(alert.getname())
      }
      logger.info("Ending add Alert subscriptions ",alerts.length)
    });
    
  }

  test('Verify tunnel status change alert for connected tunnels', async ({
    given,
    when,
    and,
    then
  }) => {
    var alerts = []
    var nodename
    var date
    console.info("In test1")
    givenIamLoggedIn(given)
    whenIAddAlertSubscriptions(when)
    whenIAddTanNetwork(when)
    whenIConnectNetwork(when)
    whenTunnelStatusExists(when)
    then(/^Verify alert records$/,  async (table) => {
      date = await global.connected_time
      console.log("date in test1 ", date)
      reporter.startStep('Verify alert records')
      let verifyStatus = true
      logger.info("last" + date)
      for(let row of table){
        row = await replaceEnvs(row);
        let retStatus = await verifyUserNotification(db,row,date)
        logger.info(retStatus)
        if (!retStatus){ verifyStatus = false }
      }
      assert(verifyStatus, "Alert record verification failed")
      reporter.endStep()
    });
  });


  test('Verify alert is not sent for old state when tunnel state changes', async ({
    given,
    when,
    and,
    then
  }) => {
    console.info("In test3")
    var alerts = []
    var nodename
    var date

    givenIamLoggedIn(given)
    whenIAddAlertSubscriptions(when)
    whenIAddTanNetwork(when)
    whenIConnectNetwork(when)
    whenTunnelStatusExists(when)
    when(/^I power off virtual node "(.*)"$/, async (nodename) => {
      reporter.startStep('I power off virtual node ' + nodename)
      logger.info("Stopping virtual")
      if (nodename == 'vnode1' || nodename == 'vnode2')
      {
        var config = await getEnvConfig()
        nodename = eval("config." + nodename)
      }
      assert(await changeNodeState(nodename, OStoken, "os-stop"),"Node state not as expected")
      logger.info("node state as expected. Waiting 90s for tunnel state detection")
      await delay(100000) // Timeout 90s for detect tunnel health - LAT-10071
      reporter.endStep()
    });
    then(/^Verify alert records$/,  async (table) => {
      date = await global.connected_time
      reporter.startStep('Verify alert records')
      let verifyStatus = true
      logger.info("last" + date)
      for(let row of table){
        row = await replaceEnvs(row);
        let retStatus = await verifyUserNotification(db,row,date)
        logger.info(retStatus)
        if (!retStatus){ verifyStatus = false }
      }
      assert(verifyStatus, "Alert record verification failed")
      reporter.endStep()
    });
  });

  test('Verify tunnel status change alert for specific tunnel subscription', async ({
    given,
    when,
    and,
    then
  }) => {
    var date
    logger.info("in test")
    givenIamLoggedIn(given)
    whenIAddAlertSubscriptions(when)
    whenIAddTanNetwork(when)
    whenIConnectNetwork(when)
    whenTunnelStatusExists(when)
    whenIAddAlertSubscriptions(when)    
    when(/^I power off virtual node "(.*)"$/, async (nodename) => {
      reporter.startStep('I power off virtual node ' + nodename)
      if (nodename == 'vnode1' || nodename == 'vnode2')
      {
        var config = await getEnvConfig()
        nodename = eval("config." + nodename)
      }
      logger.info("Stopping virtual")
      assert(await changeNodeState(nodename, OStoken, "os-stop"),"Node state not as expected")
      //assert(await changeNodeState(nodename, OStoken, "os-start"),"Node state not as expected")
      logger.info("node state as expected. Waiting 90s for tunnel state detection")
      await delay(100000) // Timeout 90s for detect tunnel health - LAT-10071
      reporter.endStep()
    })
    then(/^Verify alert records$/,  async (table) => {
      date = await global.connected_time
      reporter.startStep('Verify alert records')
      let verifyStatus = true
      logger.info("last" + date)
      for(let row of table){
        row = await replaceEnvs(row);
        let retStatus = await verifyUserNotification(db,row,date)
        logger.info(retStatus)
        if (!retStatus){ verifyStatus = false }
      }
      assert(verifyStatus, "Alert record verification failed")
      reporter.endStep()
    });
  });

  test('Verify tunnel status change alert is not sent for tunnel flap case C---T-C.', async ({
    given,
    when,
    and,
    then
  }) => {
    var date
    logger.info("in test")
    givenIamLoggedIn(given)
    whenIAddAlertSubscriptions(when)
    whenIAddTanNetwork(when)
    whenIConnectNetwork(when)
    given(/^Alert is sent for connected tunnels$/,  async (table) => {
      date = await global.connected_time
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - (date/1000000) < 600000); // 6mins * 60 + extra time for tunnrl status
      logger.info(currentDate, date) 
      reporter.startStep('Alert is sent for connected tunnels')
      let verifyStatus = true
      logger.info("last" + date)
      for(let row of table){
        row = await replaceEnvs(row);
        let retStatus = await verifyUserNotification(db,row,date)
        logger.info(retStatus)
        if (!retStatus){ verifyStatus = false }
      }
      assert(verifyStatus, "Alert is NOT sent for connected tunnels")
      reporter.endStep()
    });
    when(/^I power off virtual node "(.*)"$/, async (nodename) => {
      date = Date.now() * 1000000
      reporter.startStep('I power off virtual node ' + nodename)
      if (nodename == 'vnode1' || nodename == 'vnode2')
      {
        var config = await getEnvConfig()
        nodename = eval("config." + nodename)
      }
      logger.info("Stopping virtual")
      assert(await changeNodeState(nodename, OStoken, "os-stop"),"Node state not as expected")
      logger.info("node state as expected. Waiting 90s for tunnel state detection")
      await delay(100000) // Timeout 90s for detect tunnel health - LAT-10071
      reporter.endStep()
    })
    when(/^I power on virtual node "(.*)"$/, async (nodename) => {
      reporter.startStep('I power on virtual node ' + nodename)
      if (nodename == 'vnode1' || nodename == 'vnode2')
      {
        var config = await getEnvConfig()
        nodename = eval("config." + nodename)
      }
      logger.info("Starting virtual")
      assert(await changeNodeState(nodename, OStoken, "os-start"),"Node state not as expected")
      logger.info("node state as expected. Waiting 30s for tunnel connection")
      await delay(60000)
      reporter.endStep()
    })
    whenTunnelStatusExists(when)
    then(/^Verify alert records$/,  async (table) => {
      reporter.startStep('Verify alert records')
      let verifyStatus = true
      logger.info("last" + date)
      for(let row of table){
        row = await replaceEnvs(row);
        let retStatus = await verifyUserNotification(db,row,date)
        logger.info(retStatus)
        if (!retStatus){ verifyStatus = false }
      }
      assert(verifyStatus, "Alert record verification failed")
      reporter.endStep()
    });
  });

  test('Verify tunnel status change alert is not sent after node reboot.', async ({
    given,
    when,
    and,
    then
  }) => {
    var date
    logger.info("in test")
    givenIamLoggedIn(given)
    whenIAddAlertSubscriptions(when)
    whenIAddTanNetwork(when)
    whenIConnectNetwork(when)
    given(/^Alert is sent for connected tunnels$/,  async (table) => {
      date = await global.connected_time
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - (date/1000000) < 600000); // 6mins * 60 + extra time for tunnrl status
      logger.info(currentDate, date) 
      reporter.startStep('Alert is sent for connected tunnels')
      let verifyStatus = true
      logger.info("last" + date)
      for(let row of table){
        row = await replaceEnvs(row);
        let retStatus = await verifyUserNotification(db,row,date)
        logger.info(retStatus)
        if (!retStatus){ verifyStatus = false }
      }
      assert(verifyStatus, "Alert is NOT sent for connected tunnels")
      reporter.endStep()
    });
    when(/^I reboot the node "(.*)"$/, async (nodename) => {
      date = Date.now() * 1000000
      reporter.startStep('I reboot the node ' + nodename)
      if (nodename == 'node1')
      {
        var config = await getEnvConfig()
        nodename = eval("config." + nodename)
      }
      logger.info("Stopping node")
      assert(await changeNodeState(nodename, OStoken, "hard"),"Node state not as expected")
      logger.info("node state as expected. Waiting 30s for tunnel connection")
      await delay(60000)
      reporter.endStep()
    })
    whenTunnelStatusExists(when)
    then(/^Verify alert records$/,  async (table) => {
      date = await global.connected_time
      reporter.startStep('Verify alert records')
      let verifyStatus = true
      logger.info("last" + date)
      for(let row of table){
        row = await replaceEnvs(row);
        let retStatus = await verifyUserNotification(db,row,date)
        logger.info(retStatus)
        if (!retStatus){ verifyStatus = false }
      }
      assert(verifyStatus, "Alert record verification failed")
      reporter.endStep()
    });
  });

  test('Verify tunnel status change alert for a terminated tunnel.', async ({
    given,
    when,
    and,
    then
  }) => {
    var date
    givenIamLoggedIn(given)
    whenIAddAlertSubscriptions(when)
    whenIAddTanNetwork(when)
    whenIConnectNetwork(when)
    when(/^I disconnect all tunnels in the network "(.*)"$/, async (network) => {
      if (network == 'node1_tan1')
      {
        var config = await getEnvConfig()
        network = config.node1_tan1
      }
      await disconnectAllTunnels(network)
    })
    when(/^I power off virtual node "(.*)"$/, async (nodename) => {
      date = Date.now() * 1000000
      reporter.startStep('I power off virtual node ' + nodename)
      if (nodename == 'vnode1' || nodename == 'vnode2')
      {
        var config = await getEnvConfig()
        nodename = eval("config." + nodename)
      }
      logger.info("Stopping virtual")
      assert(await changeNodeState(nodename, OStoken, "os-stop"),"Node state not as expected")
      logger.info("node state as expected.")
      reporter.endStep()
    })
    whenIConnectNetwork(when)
    whenTunnelStatusExists(when)
    then(/^Verify alert records$/,  async (table) => {
      date = await global.connected_time
      reporter.startStep('Verify alert records')
      let verifyStatus = true
      logger.info("last" + date)
      for(let row of table){
        row = await replaceEnvs(row);
        let retStatus = await verifyUserNotification(db,row,date)
        logger.info(retStatus)
        if (!retStatus){ verifyStatus = false }
      }
      assert(verifyStatus, "Alert record verification failed")
      reporter.endStep()
    });
  });
});
