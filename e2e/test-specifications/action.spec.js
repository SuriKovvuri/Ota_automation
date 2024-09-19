import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage, deleteAllAlertSubscription } from '../helper/alert';
import { addTanNetwork, getCountOfNetworks, goAllNetworks, goToNetwork, goToNetworkAction, expandTabsInNetworkPage, connectNetwork, getTunnelStatus, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive, rebootiNode } from '../helper/node';
import { verifyServiceRestartCount, addService, serviceStatus, goToService, deleteAllServices, goToServiceAction} from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig, closeModal, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, tableToObjects, matchByKey, waitForNetworkIdle } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis, whenIAddTanNetwork, whenIConnectNetwork, whenTunnelStatusExists, givenIamLoggedInAs } from './shared-steps';
import { del } from 'openstack-client/lib/util';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { NetworkAdd } from '../src/networkAdd';
import { deleteNetworksInNode, deleteServicesInNode, getApi } from '../../utils/api_utils';
import { leftpane, dashboard, allInodes, serialNumbers, allNetworks, allServices, inodeDetails, pullSecrets, modals, volumes, networksTab } from '../constants/locators'



var assert = require('assert');

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/action.feature', 
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
        logger.info("After Each ");
        await customScreenshot('afterEach.png', 1920, 1200)
    })

    beforeEach(async () => {   
        logger.info("Before Each ");
        jest.setTimeout(1200000)           
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
        await createPDF(global.testStart,'status')
      }
      catch(err) {
          logger.error(err);
      }  
      })

      beforeAll(async() => {
        try {
          //page.waitForNavigation()
          jest.setTimeout(300000)
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
        }
        catch(err) {
            logger.error(err);
        }
        })

        test('Reboot inode', async ({
            given,
            when,
            and,
            then
          }) => {
            givenIamLoggedIn(given)
            when('I reboot the inode', async() =>{
              reporter.startStep("When I reboot the inode");
              let config = await getEnvConfig()
              await goToNode(config.node1)
              let rebootStatus = await rebootiNode(config.node1)
              expect(rebootStatus).toBe(true)
              reporter.endStep();
            });
            then('iNode must be rebooted', async() =>{
              reporter.startStep("Then iNode must be rebooted");
              await delay(2000)
              let state = await getPropertyValueByXpath(inodeDetails.div.systemInfoValue.replace('Name','Health / Status'), 'innerText')
              logger.info(state)
              expect(state).toBe("REBOOTING")
              let screenshot = await customScreenshot('rebooting.png', 1920, 1200)
              reporter.addAttachment("Rebooting node", screenshot, "image/png");
              for (let loop=1; loop<=20; loop+=1){
                state = await getPropertyValueByXpath(inodeDetails.div.systemInfoValue.replace('Name','Health / Status'), 'innerText')
                logger.info(`Loop count ${loop}; Node status is ${state}`)
                if (state == 'ALIVE'){
                  break;
                }
                await delay(60000)
              }
              expect(state).toBe('ALIVE')
              let screenshot2 = await customScreenshot('alive.png', 1920, 1200)
              reporter.addAttachment("Alive node ", screenshot2, "image/png");
              reporter.endStep();
            });
          });

          test('Verify events for iNode reboot', async ({
            given,
            when,
            and,
            then
          }) => {
            let eventsCount = 0
            givenIamLoggedIn(given)
            when('I navigate to Events page', async() =>{
              reporter.startStep("When I navigate to Events page")
              let config = await getEnvConfig()
              logger.info(config)
              await goToNode(config.node1)
              let screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
              reporter.addAttachment("iNode Details", screenshot, "image/png");
              reporter.endStep()
        
              reporter.startStep("When I navigate to Events tab");
              let navigated = await navigatePageByClick(inodeDetails.tab.events)
              expect(navigated).toBeTruthy()
              screenshot = await customScreenshot('eventsTab.png', 1920, 1200)
              reporter.addAttachment("Events Tab", screenshot, "image/png");
              reporter.endStep()
        
              reporter.startStep("When I click More Events link");
              navigated = await navigatePageByClick(eventsTab.a.moreEvents)
              expect(navigated).toBeTruthy()
              screenshot = await customScreenshot('events.png', 1920, 1200)
              reporter.addAttachment("Events Page", screenshot, "image/png");
              reporter.endStep()
        
              reporter.startStep(`Getting total number of events`)
              let handle = await getElementHandleByXpath(events['span']['eventsCount'])
              expect(handle).toBeTruthy()
              eventsCount = await getPropertyValue(handle[0], 'innerText')
              expect(eventsCount).toBeTruthy()
              logger.info(`Total number of events listed: ${eventsCount}`)
              reporter.endStep();
            });
            when('I reboot the inode', async() =>{
              reporter.startStep("When I reboot the inode");
              let config = await getEnvConfig()
              await goToNode(config.node1)
              let rebootStatus = await rebootiNode(config.node1)
              expect(rebootStatus).toBe(true)
              reporter.endStep();
            });
            then('iNode must be rebooted', async() =>{
              reporter.startStep("Then iNode must be rebooted");
              await delay(2000)
              let state = await getPropertyValueByXpath(inodeDetails.div.systemInfoValue.replace('Name','Health / Status'), 'innerText')
              logger.info(state)
              expect(state).toBe("REBOOTING")
              let screenshot = await customScreenshot('rebooting.png', 1920, 1200)
              reporter.addAttachment("Rebooting node", screenshot, "image/png");
              for (let loop=1; loop<=20; loop+=1){
                state = await getPropertyValueByXpath(inodeDetails.div.systemInfoValue.replace('Name','Health / Status'), 'innerText')
                logger.info(`Loop count ${loop}; Node status is ${state}`)
                if (state == 'ALIVE'){
                  break;
                }
                await delay(60000)
              }
              expect(state).toBe('ALIVE')
              let screenshot2 = await customScreenshot('alive.png', 1920, 1200)
              reporter.addAttachment("Alive node ", screenshot2, "image/png");
              reporter.endStep();
            });
            then('iNode reboot related events must be present in Events page', async() =>{
              reporter.startStep("Then iNode reboot related events must be present in Events page");
        
              let config = await getEnvConfig()
              reporter.startStep("When I navigate to Events page")
              logger.info(config)
              await goToNode(config.node1)
              let screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
              reporter.addAttachment("iNode Details", screenshot, "image/png");
              reporter.endStep()
        
              reporter.startStep("When I navigate to Events tab");
              let navigated = await navigatePageByClick(inodeDetails.tab.events)
              expect(navigated).toBeTruthy()
              screenshot = await customScreenshot('eventsTab.png', 1920, 1200)
              reporter.addAttachment("Events Tab", screenshot, "image/png");
              reporter.endStep()
        
              reporter.startStep("When I click More Events link");
              navigated = await navigatePageByClick(eventsTab.a.moreEvents)
              expect(navigated).toBeTruthy()
              screenshot = await customScreenshot('events.png', 1920, 1200)
              reporter.addAttachment("Events Page", screenshot, "image/png");
              reporter.endStep()
        
              reporter.startStep(`Getting total number of events`)
              let handle = await getElementHandleByXpath(events['span']['eventsCount'])
              expect(handle).toBeTruthy()
              let eventsCountNew = await getPropertyValue(handle[0], 'innerText')
              expect(eventsCountNew).toBeTruthy()
              logger.info(`Total number of events listed => Before reboot: ${eventsCount}; After reboot: ${eventsCountNew}`)
              expect(parseInt(eventsCountNew)).toBe(parseInt(eventsCount)+3)
              reporter.endStep();
        
              reporter.startStep(`Verifying REBOOTED, ALIVE, UNREACHABLE events`)
              var expected_statuses = {
                'REBOOTED' : true,
                'ALIVE' : true,
                'UNREACHABLE' : true
              }
              var statuses = {}
              var i;
              for (i = 1; i <= 3; i++) {
                let handle = await getElementHandleByXpath(events['_verify']['row'+String(i)+'Status'])
                expect(handle).toBeTruthy()
                let status = await getPropertyValue(handle[0], 'innerText')
                expect(status).toBeTruthy()
                statuses[status] = true
              }
              logger.info(`Actual statuses: ${statuses} and expected_statuses: ${expected_statuses}`)
              expect(statuses).toStrictEqual(expected_statuses)
              reporter.endStep();
        
              reporter.endStep();
            });
          });
        
        });