import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage, deleteAllAlertSubscription } from '../helper/alert';
import { addTanNetwork, getCountOfNetworks, goAllNetworks, goToNetwork, goToNetworkAction, expandTabsInNetworkPage, connectNetwork, getTunnelStatus, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive, rebootiNode } from '../helper/node';
import { verifyServiceRestartCount, addService, serviceStatus, goToService, deleteAllServices, goToServiceAction} from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig, closeModal, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, tableToObjects, matchByKey, waitForNetworkIdle, sortTable, goTo } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis, whenIAddTanNetwork, whenIConnectNetwork, whenTunnelStatusExists, givenIamLoggedInAs } from './shared-steps';
import { del } from 'openstack-client/lib/util';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { NetworkAdd } from '../src/networkAdd';
import { deleteNetworksInNode, deleteServicesInNode, getApi } from '../../utils/api_utils';
import { leftpane, dashboard, allInodes, serialNumbers, allNetworks, allServices, inodeDetails, pullSecrets, modals, volumes, networksTab, servicesTab, csp, allUsers, allRoles, onlineHelp, eventsTab, imagesTab, images, interfacesTab, events, apiKeys, sshKeys, downloadSoftware, downloadActivity, downloadEvents, manageAlerts, myProfile} from '../constants/locators'
import { goToOrg } from '../helper/org';
import { modalProperties } from '../constants/modals';

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/navigatePage.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              }
                //tagFilter: '@test',
            });

        
            
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
        await har.stop();

        let login = new Login();
        let result = await login.logout()
        expect(result).toBe(true)
        
        await customScreenshot('loggedout.png', 1920, 1200) 
        //await createPDF(global.testStart,'navigation')
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

          await har.start({ path: './reports/navigation'+global.testStart+'.har', saveResponse: true }); 
          let login
          login = new Login();
          logger.info("global.env = "+global.env)
          await goTo(config.orchURL)
          let credentials = {
                              'username':config.navOrgAdmin4,
                              'password':config.navOrgAdminPassword4
                            }
          await login.launch(global.env, "custom", credentials)           
          await (page
            .waitForXPath(leftpane.button.logout, { visible: true })
            .then(() => logger.info('Waiting In before ALL berfore proceeding')))
  
          await customScreenshot('beforeAll.png', 1920, 1200) 
        }
        catch(err) {
            logger.error(err);
        }
        })    


  test('Navigate to dashboard', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I land in dashboard page', async() =>{
        reporter.startStep("When I land in dashboard page");
        let navigated = await navigatePageByClick(leftpane.li.dashboard)
        expect(navigated).toBeTruthy()
        expect(navigated < 10.0).toBe(true)
        reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
        reporter.endStep()
        let screenshot = await customScreenshot('dashboard.png', 1920, 1200)
        reporter.addAttachment("Dashboard", screenshot, "image/png");
        reporter.endStep();
    });
    then('All layouts must be present', async() =>{
      reporter.startStep("Then All layouts must be present");
      reporter.startStep("Verify all numberCards")
      for (const key in dashboard.numberCard) {
        if (key.startsWith('_') != true)
        {
            let handle = await getElementHandleByXpath(dashboard.numberCard[key])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
        }
      }
      reporter.endStep();
      
      reporter.startStep("Verify all widgets and activity card")
      for (const key in dashboard.widget) {
        if (key.startsWith('_') != true)
        {
            let handle = await getElementHandleByXpath(dashboard.widget[key])
            expect(handle).toBeTruthy()
        }
      }
      reporter.endStep();

      reporter.startStep("Verify Manage Dashboard button")
      for (const key in dashboard.button) {
        if (key.startsWith('_') != true)
        {
            let handle = await getElementHandleByXpath(dashboard.button[key])
            expect(handle).toBeTruthy()
        }
      }
      reporter.endStep();

      reporter.startStep("Verify page title - Dashboard")
      for (const key in dashboard.h2) {
        if (key.startsWith('_') != true)
        {
            let handle = await getElementHandleByXpath(dashboard.h2[key])
            expect(handle).toBeTruthy()
        }
      }
      reporter.endStep();

      reporter.startStep("Verify Dashboard - numberCard Values")
      var config = await getEnvConfig()
      for (const key in dashboard.a) {
        if (key.endsWith('Value') == true)
        {
            logger.info(`comparing ${key}`)
            let handle = await getElementHandleByXpath(dashboard.a[key])
            expect(handle).toBeTruthy()
            let value = await getPropertyValue(handle[0], 'innerText')
            expect(value).toBeTruthy()
            reporter.startStep(`Comparing ${key} value ${value} is >= ${eval("config.dashboard.numberCard.".concat(key))}`)
            let copmareOp = await compareValue(value, eval("config.dashboard.numberCard.".concat(key)), ">=")
            reporter.endStep()
            expect(copmareOp).toBe(true)
        }
      }
      reporter.endStep();

      reporter.endStep();
    });
  });  
});
