import { defineFeature, loadFeature } from 'jest-cucumber';
import { Login } from '../helper/login';
import { goToAddNetwork, networkcidr_error, networkendip_error, networkgwip_error, networkname_error, networkstartip_error, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive, rebootiNode } from '../helper/node';
import { gotoAddSSHKey, name_del_error, name_error, sshkey_error } from '../helper/sshkey';
import { confirmpsw_error, email_error, email_info, fullname_error, gotoAddUser, password_error } from '../helper/user';
import { logger } from '../log.setup';
import { del } from 'openstack-client/lib/util';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, expectToClick, goTo, getEnvConfig, closeModal } from '../../utils/utils';
import { whenIAddTanNetwork, whenIConnectNetwork, thenTunnelStatusExists, whenTunnelStatusExists,andWhenNodeIs, givenIamLoggedIn, whenOrgis, whenIRebootiNode } from './shared-steps';
import { deleteNetworksInNode, deleteServicesInNode } from '../../utils/api_utils';
const { PendingXHR } = require('pending-xhr-puppeteer');



const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');

let OStoken, db, consoleSpy

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/tunnelValidation.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              },
                //tagFilter: '@TunnelValidationCase3',
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
        await page.goto(global.homeurl+'/home' )
        await delay(10000)
        var config = await getEnvConfig()
        logger.info("node1 is " + config.node1)
        await goToNode(config.node1)
        await delay(3000)
        await disconnectAllTunnels(config.node1_tan1)
        await delay(3000)
        await deleteAllNetworks()
        await customScreenshot('afterEach.png', 1920, 1200) 
        
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
        const elemXPath = "//button[contains(@title, 'My Account')]"
        try {
          const elemExists = await page.waitForXPath(elemXPath, {timeout: 30000}) ? true : false;
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
          await customScreenshot('loggedout.png', 1920, 1200) 
          }
        } catch(err) {
          logger.info("Ignorable exception, possibly have already logged out");
        }
        //await checkConsoleErrors();
        //Make a PDF of the tests by merging all screenshots into the pdf
        await createPDF(global.testStart,'tunnelValidation')
        if (global.env != 'staging') {
         // await closemongoDB()
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
      catch(err) {
        logger.info(err);
        }
  
      })

    beforeAll(async () => {
      try {

        jest.setTimeout(1500000)
        page.setDefaultNavigationTimeout(1500000); 
        logger.info('Before all')
        //await delay(5000)

        //moving the login from setup to each test
        let login
        login = new Login();
        logger.info("global.env = "+global.env)
        await login.launch(global.env, global.scope) 
        //moving the login from setup to each test
        /*
        await (page
          .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
          .then(() => logger.info('Waiting In before ALL berfore proceeding')))
        */
        await page.$x("//button[contains(@title, 'My Account')]", { visible: true, timeout: 30})
        reporter = global.reporter
        await customScreenshot('beforeAll.png', 1920, 1200) 
        //This is for openstack
        if (global.env != 'staging') {
          OStoken = await connectOS()
        //  db = await connectmongoDB()
        }
        //This is for recording JS and CSS usages
        await Promise.all([
          page.coverage.startJSCoverage(),
          page.coverage.startCSSCoverage()
         ]);
         //performance tracing
         await page.tracing.start({ path: './reports/tunnelValidation'+global.testStart+'_tracing.json' });
         //trying HAR
         await har.start({ path: './reports/tunnelValidation'+global.testStart+'.har', saveResponse: true }); 
         //for redirecting console logs
         //jest.clearAllMocks();
         //consoleSpy = jest.spyOn(console, 'log')
         await deleteServicesInNode(config.node1)
         await deleteNetworksInNode(config.node1)

      }
      catch(err) {
        logger.info(err);
        }
      })

        test('Verify tunnel status change', async ({
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
          whenIAddTanNetwork(when)
          whenIConnectNetwork(when)
          thenTunnelStatusExists(then)
          thenTunnelStatusExists(then)
        });

      test('Verify tunnel status change during iNode reboot', async ({
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
        whenIAddTanNetwork(when)
        whenIConnectNetwork(when)
        whenTunnelStatusExists(when)
        whenIRebootiNode(when)
        thenTunnelStatusExists(then)
        thenTunnelStatusExists(then)
        logger.info("Sleeping for iNode to bootup")
        await delay(300000)
      });


      test('Verify tunnel status change during iNode shutdown', async ({
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
        whenIAddTanNetwork(when)
        whenIConnectNetwork(when)
        whenTunnelStatusExists(when)
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
        whenTunnelStatusExists(when)
        whenTunnelStatusExists(when)
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
        thenTunnelStatusExists(then)
        thenTunnelStatusExists(then)
      });
  });