import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage, deleteAllAlertSubscription } from '../helper/alert';
import { addTanNetwork, getCountOfNetworks, goAllNetworks, goToNetwork, goToNetworkAction, expandTabsInNetworkPage, connectNetwork, getTunnelStatus, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive, rebootiNode } from '../helper/node';
import { verifyServiceRestartCount, addService, serviceStatus, goToService, deleteAllServices, goToServiceAction} from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig, closeModal, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, tableToObjects, matchByKey, waitForNetworkIdle, sortTable } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis, whenIAddTanNetwork, whenIConnectNetwork, whenTunnelStatusExists, givenIamLoggedInAs } from './shared-steps';
import { del } from 'openstack-client/lib/util';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { NetworkAdd } from '../src/networkAdd';
import { deleteNetworksInNode, deleteServicesInNode, getApi } from '../../utils/api_utils';
import { inodeDetails, servicesTab, serviceLogs, iNodeLogs, leftpane} from '../constants/locators';
import { goToOrg } from '../helper/org';



var assert = require('assert');

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/iotiumUser.feature', 
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
        let login = new Login();
        let result = await login.logout()
        expect(result).toBe(true)

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
          await login.launch(global.env, "Admin")
  
          await (page
            .waitForXPath(leftpane.button.logout, { visible: true })
            .then(() => logger.info('Waiting In before ALL berfore proceeding')))
  
          reporter = global.reporter
          await customScreenshot('beforeAll.png', 1920, 1200) 
        }
        catch(err) {
            logger.error(err);
        }
        })    

  test('Navigate to iNode Logs page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to iNode Logs page', async() =>{
      reporter.startStep("When I navigate to inode details page")
      let config = await getEnvConfig()
      logger.info(config)

      await goToOrg(config.orgName)
      let screenshot = await customScreenshot('org.png', 1920, 1200)
      reporter.addAttachment("Org", screenshot, "image/png");
      reporter.endStep()

      await goToNode(config.node1,orgName=config.orgName)
      screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
      reporter.addAttachment("iNode Details", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click Manage iNode");
      let navigated = await navigatePageByClick(inodeDetails.button.manageInode)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('manageInode.png', 1920, 1200)
      reporter.addAttachment("Manage iNode", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click 'View Logs' button");
      navigated = await navigatePageByClick(inodeDetails.button._viewInodeLogs)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('iNodeLogs.png', 1920, 1200)
      reporter.addAttachment("iNode Logs", screenshot, "image/png");
      reporter.endStep()
    });
    then('All required web elements must be present', async() =>{
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in iNodeLogs){
        if (elem1.startsWith('_') == true)
        {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in iNodeLogs[elem1]){
          if (elem2.startsWith('_') == true)
          {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(iNodeLogs[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }
      
      reporter.startStep(`Verify page title - ${config.orgName}`)
      let handle = await getElementHandleByXpath(iNodeLogs.h2.pageTitle)
      let ui_value = await getPropertyValue(handle[0], "innerText")
      let value = config.node1
      expect(ui_value.trim()).toBe(value)
      reporter.endStep()

      reporter.endStep()
    });
  });

  test('Navigate to Service Logs page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Service Logs page', async() =>{
      reporter.startStep("When I navigate to inode details page")
      let config = await getEnvConfig()
      logger.info(config)
      
      await goToOrg(config.orgName)
      let screenshot = await customScreenshot('org.png', 1920, 1200)
      reporter.addAttachment("Org", screenshot, "image/png");
      reporter.endStep()
      
      await goToNode(config.navigation.edge1.Name)
      //await goToNode(config.navigation.edge1.Name,orgName=config.orgName)
      screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
      reporter.addAttachment("iNode Details", screenshot, "image/png");
      reporter.endStep()

      let action = await performAction('click',inodeDetails.div.servicesTab)
      expect(action).toBeTruthy()

      reporter.startStep("Pagination - Scroll the inode list to the end")
      let test = await getElementHandleByXpath(servicesTab.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      reporter.endStep()

      reporter.startStep("When I click 'Options' button");
      let navigated = await navigatePageByClick(servicesTab.div.rows+'//td//span[text()=\''+config.navigation.edge1_services[0].Name+'\']//ancestor::tr'+servicesTab._admin.options)
      expect(navigated).toBeTruthy()

      reporter.startStep("When I click 'Service Logs' button");
      navigated = await navigatePageByClick(servicesTab._admin.serviceLogs)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('serviceLogs.png', 1920, 1200)
      reporter.addAttachment("Service Logs", screenshot, "image/png");
      reporter.endStep()
    });
    then('All required web elements must be present', async() =>{
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in serviceLogs){
        if (elem1.startsWith('_') == true)
        {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in serviceLogs[elem1]){
          if (elem2.startsWith('_') == true)
          {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(serviceLogs[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }
      
      reporter.startStep(`Verify page title - ${config.orgName}`)
      let handle = await getElementHandleByXpath(serviceLogs.h2.pageTitle)
      let ui_value = await getPropertyValue(handle[0], "innerText")
      let value = config.navigation.edge1.Name
      expect(ui_value.trim()).toBe(value)
      reporter.endStep()

      reporter.endStep()
    });
  });

});
