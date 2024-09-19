//jest.retryTimes(0)
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
import { leftpane, dashboard, allInodes, serialNumbers, allNetworks, allServices, inodeDetails, pullSecrets, modals, volumes, networksTab, servicesTab, csp, allUsers, allRoles, onlineHelp, eventsTab, imagesTab, images, interfacesTab, events, apiKeys, sshKeys, downloadSoftware, downloadActivity, downloadEvents, manageAlerts, myProfile} from '../constants/locators'
import { goToOrg } from '../helper/org';

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/navigateInodeDetails.feature', 
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
        await har.stop();

        let login = new Login();
        let result = await login.logout()
        expect(result).toBe(true)

        await createPDF(global.testStart,'navigation')
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
          await login.launch(global.env, global.scope) 
  
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




  test('Navigate networks tab', async ({
    given,
    when,
    and,
    then
  }) => {
    when(/^I navigate to networks tab of inode$/, async() => {
      reporter.startStep("When I navigate to networks tab of inode");
        let config = await getEnvConfig()
        var node
        node = config.navigation.edge1.Name
        await goToNode(node)
        let action = await performAction('click',inodeDetails.div.networksTab)
        expect(action).toBeTruthy()
        let found = await getElementHandleByXpath(networksTab.a.expandAll)
        if (found != false) {
          await Promise.all([
            performAction('click',networksTab.a.expandAll),
            waitForNetworkIdle(120000)
          ])
          await delay(3000)
        }
      reporter.endStep();
    });
    then('All networks and tunnels must be present', async() =>{
      reporter.startStep("Then All networks and tunnels must be present");
      let screenshot = await customScreenshot('networkstab.png', 1920, 1200)
      reporter.addAttachment("networks tab", screenshot, "image/png");
      let tableHead = await getElementHandleByXpath(networksTab.table.networks + "/thead")
      let tableBody = await getElementHandleByXpath(networksTab.table.networks + "/tbody")
      let networkTable = await tableToObjects(tableHead[0], tableBody[0])
      expect (networkTable).toBeTruthy()
      logger.debug("Complete network table", networkTable)
      var config = await getEnvConfig()
      //Iterate all networks
      for (let network of config.navigation.edge1_networks){
        reporter.startStep(`Verifying fields of network ${network.Name}`)
        logger.debug("Network defined in suite ", network)
        let foundNetwork = await matchByKey(networkTable, 'Name', network.Name)
        expect(foundNetwork).toBeTruthy()
        //Iterate parsed fields in a network
        for (let field of Object.keys(network)){
          if (Object.keys(foundNetwork).includes(field)){
            logger.info(`Field: ${field},Value - ${network[field]}; Expected: ${foundNetwork[field]}`)
            reporter.startStep(`Field: ${field},Expected - ${network[field]}; Found: ${foundNetwork[field]}`)
            expect(foundNetwork[field]).toStrictEqual(network[field])
            reporter.endStep()
          } else {
            logger.error(`${field} missing in ${foundNetwork}`)
            expect(true).toBe(false)
          }
        }
        reporter.endStep()
      }
      reporter.endStep()
      reporter.startStep("Verify presence of buttons");
      for (let item in networksTab.button){
        if (item.startsWith('_') != true) {
          let present = await getElementHandleByXpath(networksTab.button[item])
          expect(present).toBeTruthy()
        }
      }
      reporter.endStep()
    });
  });

  test('Navigate services tab', async ({
    given,
    when,
    and,
    then
  }) => {
    when(/^I navigate to services tab of inode$/, async() => {
      reporter.startStep("When I navigate to services tab of inode");
        let config = await getEnvConfig()
        var node
        node = config.navigation.edge1.Name
        await goToNode(node)
        let action = await performAction('click',inodeDetails.div.servicesTab)
        expect(action).toBeTruthy()

        let test = await getElementHandleByXpath(servicesTab.table.scrollbar)
        await autoScroll(test[0])
        logger.info("scroll over")

        let found = await getElementHandleByXpath(servicesTab.a.expandAll)
        if (found != false) {
          await Promise.all([
            performAction('click',servicesTab.a.expandAll),
            waitForNetworkIdle(120000)
          ])
          await delay(3000)
        }
        //Expand inner table 
        var expandAll = await getElementHandleByXpath("//tr[contains(@class, 'ant-table-expanded-row-level-1')]//div[@aria-label='Expand row']")
        if(expandAll != false){
          logger.info(expandAll.length)
          for (let item of expandAll){
            await item.click()
          }
        }
      reporter.endStep();
    });
    then('All services and containers must be present', async() =>{
      reporter.startStep("Then All services and containers must be present");
      let screenshot = await customScreenshot('servicestab.png', 1920, 1200)
      reporter.addAttachment("services tab", screenshot, "image/png");
      let tableHead = await getElementHandleByXpath(servicesTab.table.servicesHaed)
      let tableBody = await getElementHandleByXpath(servicesTab.table.servicesBody)
      let serviceTable = await tableToObjects(tableHead[0], tableBody[0], "service")
      expect (serviceTable).toBeTruthy()
      logger.debug("Complete service table", serviceTable)

      var config = await getEnvConfig()
      //Iterate all networks
      for (let service of config.navigation.edge1_services){
        reporter.startStep(`Verifying fields of service ${service.Name}`)
        logger.debug("Service defined in suite ", service)
        let foundService = await matchByKey(serviceTable, 'Name', service.Name)

        //Don't verify restart counter value; It may vary on reboots.
        for (let obj of foundService.innerTable){
          delete obj['Restart Count']
        }
        expect(foundService).toBeTruthy()
        logger.info(foundService.innerTable)
        //Iterate parsed fields in a service
        for (let field of Object.keys(service)){
          if (Object.keys(foundService).includes(field)){
            logger.info(`Field: ${field},Value - ${service[field]}; Expected: ${foundService[field]}`)
            reporter.startStep(`Field: ${field},Expected - ${service[field]}; Found: ${foundService[field]}`)
            expect(foundService[field]).toStrictEqual(service[field])
            reporter.endStep()
          } else {
            logger.error(`${field} missing in ${foundService}`)
            expect(true).toBe(false)
          }
        }
        reporter.endStep()
      }
      reporter.endStep()
      reporter.startStep("Verify presence of buttons");
      for (let item in servicesTab.button){
        if (item.startsWith('_') != true) {
          let present = await getElementHandleByXpath(servicesTab.button[item])
          expect(present).toBeTruthy()
        }
      }
      
      reporter.endStep()
    });
  });

  test('Navigate to Events tab in iNode details Page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Events tab in iNode details page', async() =>{
        reporter.startStep("When I navigate to inode details page")
        let config = await getEnvConfig()
        logger.info(config)
        await goToNode(config.navigation.edge1.Name)
        let screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
        reporter.addAttachment("iNode Details", screenshot, "image/png");
        reporter.endStep()

        reporter.startStep("When I navigate to Events tab");
        let navigated = await navigatePageByClick(inodeDetails.tab.events)
        expect(navigated).toBeTruthy()
        screenshot = await customScreenshot('eventsTab.png', 1920, 1200)
        reporter.addAttachment("Events Tab", screenshot, "image/png");
        reporter.endStep()

    });
    then('Events tab in iNode details page is active', async() =>{
      reporter.startStep("Then Events tab in iNode details page is active");
      let config = await getEnvConfig()
      for (let elem1 in eventsTab['_active']){
        reporter.startStep(`Verifying ${elem1} webelements`)
        let handle = await getElementHandleByXpath(eventsTab['_active'][elem1])
        logger.info(handle.length)
        expect(handle).toBeTruthy()
        reporter.endStep()
      }
      reporter.endStep()
    });
    then('All required web elements must be present', async() =>{
      reporter.startStep("Then All required web elements must be present");
      
      for (let elem1 in eventsTab){
        if (elem1.startsWith('_') == true)
        {
          continue
        }
        let parent_handles = await getElementHandleByXpath(eventsTab['_active']['_parent'])
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in eventsTab[elem1]){
          if (elem2.startsWith('_') != true)
          {
              reporter.startStep(`Verifying webelement ${elem2} in page`)
              let handle = await getElementHandleByXpath('.'+eventsTab[elem1][elem2],parent_handles[0])
              logger.info(handle.length)
              expect(handle).toBeTruthy()
              reporter.endStep()
          }
        }
        reporter.endStep()
      }
      reporter.endStep()
    });
  });

  test('Navigate to Images tab in iNode details Page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Images tab in iNode details page', async() =>{
        reporter.startStep("When I navigate to inode details page")
        let config = await getEnvConfig()
        logger.info(config)
        await goToNode(config.navigation.edge1.Name)
        let screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
        reporter.addAttachment("iNode Details", screenshot, "image/png");
        reporter.endStep()

        reporter.startStep("When I navigate to Images tab");
        let navigated = await navigatePageByClick(inodeDetails.tab.images)
        expect(navigated).toBeTruthy()
        screenshot = await customScreenshot('imagesTab.png', 1920, 1200)
        reporter.addAttachment("Images Tab", screenshot, "image/png");
        reporter.endStep()

    });
    then('Images tab in iNode details page is active', async() =>{
      reporter.startStep("Then Images tab in iNode details page is active");
      let config = await getEnvConfig()
      for (let elem1 in imagesTab['_active']){
        reporter.startStep(`Verifying ${elem1} webelements`)
        let handle = await getElementHandleByXpath(imagesTab['_active'][elem1])
        logger.info(handle.length)
        expect(handle).toBeTruthy()
        reporter.endStep()
      }
      reporter.endStep()
    });
    then('All required web elements must be present', async() =>{
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in imagesTab){
        if (elem1.startsWith('_') == true)
        {
          continue
        }
        let parent_handles = await getElementHandleByXpath(imagesTab['_active']['_parent'])
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in imagesTab[elem1]){
          if (elem2.startsWith('_') == true)
          {
            continue
          }
          if (elem2 == 'moreImages') {
            let node_list = await getApi("node", null, true)
            var node_id = null
            var i;
            for (i = 0; i < node_list.total_count; i++) {
              logger.info(node_list.results[i])
              if (node_list.results[i]['name'] == config.navigation.edge1.Name) {
                node_id = node_list.results[i]['id']
                break
              }
            }
            let image_list = await getApi("node/"+node_id+"/image", null, true)
            if (image_list.total_count <= 5) {
              logger.info("Skipping 'More Images' link")
              continue
            }
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath('.'+imagesTab[elem1][elem2],parent_handles[0])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }
      reporter.endStep()
    });
  });

  test('Navigate to Images page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Images page', async() =>{
        reporter.startStep("When I navigate to Images page")
        let config = await getEnvConfig()
        logger.info(config)
        await goToNode(config.navigation.edge1.Name)
        let screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
        reporter.addAttachment("iNode Details", screenshot, "image/png");
        reporter.endStep()

        reporter.startStep("When I navigate to Images tab");
        let navigated = await navigatePageByClick(inodeDetails.tab.images)
        expect(navigated).toBeTruthy()
        screenshot = await customScreenshot('imagesTab.png', 1920, 1200)
        reporter.addAttachment("Images Tab", screenshot, "image/png");
        reporter.endStep()

        reporter.startStep("When I click More Images link");
        navigated = await navigatePageByClick(imagesTab.a.moreImages)
        expect(navigated).toBeTruthy()
        screenshot = await customScreenshot('images.png', 1920, 1200)
        reporter.addAttachment("Images Page", screenshot, "image/png");
        reporter.endStep()
    });
    then('Images page is active', async() =>{
      reporter.startStep("Then Images page is active");
      let config = await getEnvConfig()
      for (let elem1 in images['_active']){
        reporter.startStep(`Verifying ${elem1} webelements`)
        let handle = await getElementHandleByXpath(images['_active'][elem1])
        //logger.info(handle.length)
        expect(handle).toBeTruthy()
        reporter.endStep()
      }
      reporter.endStep()
    });
    then('All required web elements must be present', async() =>{
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in images){
        if (elem1.startsWith('_') == true)
        {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in images[elem1]){
          if (elem2.startsWith('_') == true)
          {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(images[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }

      reporter.startStep("Pagination - Scroll the images list to the end")
      let test = await getElementHandleByXpath(images.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      let screenshot = await customScreenshot('images-pagination.png', 1920, 1200)
      reporter.addAttachment("Images Pagination", screenshot, "image/png")

      reporter.startStep(`Verifying total number of images listed`)
      let node_list = await getApi("node", null, true)
      var node_id = null
      var i;
      for (i = 0; i < node_list.total_count; i++) {
        logger.info(node_list.results[i])
        if (node_list.results[i]['name'] == config.navigation.edge1.Name) {
          node_id = node_list.results[i]['id']
          break
        }
      }
      let image_list = await getApi("node/"+node_id+"/image", null, true)
      let handle = await getElementHandleByXpath(images['div']['tableBodyRows'])
      logger.info(handle.length)
      expect(handle).toBeTruthy()
      logger.info(`Total number of images listed: ${handle.length}; API returned: ${image_list.total_count}`)
      expect(image_list.total_count == handle.length).toBe(true)
      reporter.endStep();

      reporter.endStep()
    });
  });

  test('Navigate to Interfaces tab in iNode details Page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Interfaces tab in iNode details page', async() =>{
        reporter.startStep("When I navigate to inode details page")
        let config = await getEnvConfig()
        logger.info(config)
        await goToNode(config.navigation.edge1.Name)
        let screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
        reporter.addAttachment("iNode Details", screenshot, "image/png");
        reporter.endStep()

        reporter.startStep("When I navigate to Interfaces tab");
        let navigated = await navigatePageByClick(inodeDetails.tab.interfaces)
        expect(navigated).toBeTruthy()
        screenshot = await customScreenshot('interfacesTab.png', 1920, 1200)
        reporter.addAttachment("Interfaces Tab", screenshot, "image/png");
        reporter.endStep()

    });
    then('Interfaces tab in iNode details page is active', async() =>{
      reporter.startStep("Then Interfaces tab in iNode details page is active");
      let config = await getEnvConfig()
      for (let elem1 in interfacesTab['_active']){
        reporter.startStep(`Verifying ${elem1} webelements`)
        let handle = await getElementHandleByXpath(interfacesTab['_active'][elem1])
        logger.info(handle.length)
        expect(handle).toBeTruthy()
        reporter.endStep()
      }
      reporter.endStep()
    });
    then('All required web elements must be present', async() =>{
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in interfacesTab){
        if (elem1.startsWith('_') == true)
        {
          continue
        }
        let parent_handles = await getElementHandleByXpath(interfacesTab['_active']['_parent'])
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in interfacesTab[elem1]){
          if (elem2.startsWith('_') == true)
          {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(interfacesTab[elem1][elem2],parent_handles[0])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          if (elem2.endsWith('hardware_address') == true) {
            let value = await getPropertyValue(handle[0], 'innerText')
            expect(value).toBeTruthy()
            reporter.startStep(`Verifying Hardware Address ${value}`)
            let matched = value.match(/^((([a-fA-F0-9][a-fA-F0-9]+[-]){5}|([a-fA-F0-9][a-fA-F0-9]+[:]){5})([a-fA-F0-9][a-fA-F0-9])$)|(^([a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]+[.]){2}([a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]))$/g)
            expect(matched).toBeTruthy()
            reporter.endStep()
          }
          reporter.endStep()
        }
        reporter.endStep()
      }
      reporter.endStep()
    });
  });

  test('Navigate to Events page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Events page', async() =>{
        reporter.startStep("When I navigate to Events page")
        let config = await getEnvConfig()
        logger.info(config)
        await goToNode(config.navigation.edge1.Name)
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
    });
    then('Events page is active', async() =>{
      reporter.startStep("Then Events page is active");
      let config = await getEnvConfig()
      for (let elem1 in events['_active']){
        reporter.startStep(`Verifying ${elem1} webelements`)
        let handle = await getElementHandleByXpath(events['_active'][elem1])
        expect(handle).toBeTruthy()
        reporter.endStep()
      }
      reporter.endStep()
    });
    then('All required web elements must be present', async() =>{
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in events){
        if (elem1.startsWith('_') == true)
        {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in events[elem1]){
          if (elem2.startsWith('_') == true)
          {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(events[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }

      reporter.startStep("Pagination - Scroll the events list to the end")
      let test = await getElementHandleByXpath(events.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      let screenshot = await customScreenshot('events-pagination.png', 1920, 1200)
      reporter.addAttachment("Events Pagination", screenshot, "image/png")
      reporter.endStep()
    });
  });

  test('Verify tunnel count and status', async ({
    given,
    when,
    and,
    then
  }) => {
    var networkTable
    when(/^I navigate to networks tab of inode$/, async() => {
      reporter.startStep("When I navigate to networks tab of inode");
        let config = await getEnvConfig()
        var node
        node = config.navigation.edge1.Name
        await goToNode(node)
        let action = await performAction('click',inodeDetails.div.networksTab)
        expect(action).toBeTruthy()
        let found = await getElementHandleByXpath(networksTab.a.expandAll)
        if (found != false) {
          await Promise.all([
            performAction('click',networksTab.a.expandAll),
            waitForNetworkIdle(120000)
          ])
          await delay(3000)
        }
        let screenshot = await customScreenshot('networkstab.png', 1920, 1200)
        reporter.addAttachment("networks tab", screenshot, "image/png");
      reporter.endStep();
    });
    then('Networks count must match', async() =>{
      reporter.startStep("Then Networks count must match");
      let tableHead = await getElementHandleByXpath(networksTab.table.networks + "/thead")
      let tableBody = await getElementHandleByXpath(networksTab.table.networks + "/tbody")
      networkTable = await tableToObjects(tableHead[0], tableBody[0])
      expect (networkTable).toBeTruthy()
      logger.info("Complete network table length is ", networkTable.length)
      var config = await getEnvConfig()
      expect(networkTable.length).toBe(config.navigation.count.network.total)
      reporter.endStep()
    });
    then('Tunnel status count must match', async() =>{
      reporter.startStep("And Tunnel status count must match");
      var config = await getEnvConfig()
      let foundStatus = {'CONNECTED':0,'NOT AVAILABLE':0,'TERMINATED':0}
      for (let net of networkTable){
        if ('innerTable' in net){
          for (let tunnel of net['innerTable']){
            let status = tunnel['Connection Status']
            foundStatus[status] += 1
          }
        }
      }
      logger.info(foundStatus)
      expect(foundStatus.CONNECTED).toBe(config.navigation.count.tunnel.CONNECTED)
      expect(foundStatus['NOT AVAILABLE']).toBe(config.navigation.count.tunnel['NOT AVAILABLE'])
      reporter.endStep()
    });
  });

  test('Verify service count and status', async ({
    given,
    when,
    and,
    then
  }) => {
    var serviceTable
    when(/^I navigate to services tab of inode$/, async() => {
      reporter.startStep("When I navigate to services tab of inode");
        let config = await getEnvConfig()
        var node
        node = config.navigation.edge1.Name
        await goToNode(node)
        let action = await performAction('click',inodeDetails.div.servicesTab)
        expect(action).toBeTruthy()
        let test = await getElementHandleByXpath(servicesTab.table.scrollbar)
        await autoScroll(test[0])
        logger.info("scroll over")
        let screenshot = await customScreenshot('servicestab.png', 1920, 1200)
        reporter.addAttachment("services tab", screenshot, "image/png");
      reporter.endStep();
    });
    then('Services count must match', async() =>{
      reporter.startStep("Then Services count must match")
      let tableHead = await getElementHandleByXpath(servicesTab.table.servicesHaed)
      let tableBody = await getElementHandleByXpath(servicesTab.table.servicesBody)
      serviceTable = await tableToObjects(tableHead[0], tableBody[0], "service")
      expect (serviceTable).toBeTruthy()
      logger.info("Complete service table length", serviceTable.length)
      var config = await getEnvConfig()
      expect(serviceTable.length).toBe(config.navigation.count.service.total)
      reporter.endStep()
    });
    then('Service status count must match', async() =>{
      reporter.startStep("And Service status count must match");
      var config = await getEnvConfig()
      let foundStatus = {'HEALTHY':0,'UNHEALTHY':0,'TERMINATED':0, 'UNKNOWN':0}
      for (let service of serviceTable){
            let status = service.Status
            foundStatus[status] += 1
      }
      logger.info(foundStatus)
      expect(foundStatus.HEALTHY).toBe(config.navigation.count.service.HEALTHY)
      expect(foundStatus.UNHEALTHY).toBe(config.navigation.count.service.UNHEALTHY)
      expect(foundStatus.TERMINATED).toBe(config.navigation.count.service.TERMINATED)
      expect(foundStatus.UNKNOWN).toBe(config.navigation.count.service.UNKNOWN)
      reporter.endStep()
    });
  });

  test('Verify Representational Network', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to inode details page', async() =>{
      reporter.startStep("When I navigate to inode details page")
      let config = await getEnvConfig()
      await goToNode(config.navigation.edge1.Name)
      let screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
      reporter.addAttachment("iNode Details", screenshot, "image/png");
      reporter.endStep()
    });
    when('I expand the network with Representational Network config', async() =>{
      reporter.startStep("When I expand the network with Representational Network config")
      //let navigated = await navigatePageByClick("//span[@class='iot-table-column-overflow'][text()='tan']//preceding::td[@class='ant-table-row-expand-icon-cell'][1]")
      await Promise.all([
        performAction('click',"//span[@class='iot-table-column-overflow'][text()='tan']//preceding::td[@class='ant-table-row-expand-icon-cell'][1]"),
        //navigatePageByClick("//span[@class='iot-table-column-overflow'][text()='tan']//preceding::td[@class='ant-table-row-expand-icon-cell'][1]"),
        waitForNetworkIdle(120000)
      ])
      await delay(2000)
      //expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('expandNetwork.png', 1920, 1200)
      reporter.addAttachment("Expand Network", screenshot, "image/png");
      reporter.endStep()
    });
    then('All required web elements must be present', async() =>{
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      var repNw = '';
      var remoteiNode = '';
      var i;
      for (i = 0; i < config.navigation.edge1_networks.length; i++) {
        if (config.navigation.edge1_networks[i].Name == 'tan') {
          var j;
          for (j = 0; j < config.navigation.edge1_networks[i].innerTable.length; j++) {
            if (config.navigation.edge1_networks[i].innerTable[j]["Represent Remote Network Locally as"] != '') {
              repNw = config.navigation.edge1_networks[i].innerTable[j]["Represent Remote Network Locally as"]
              remoteiNode = config.navigation.edge1_networks[i].innerTable[j]["Remote Network"]
              break
            }
          }
          if (repNw != '' && remoteiNode != '') {
            break
          }
        }
      }
      logger.info('repNw:'+repNw)
      let handle = await getElementHandleByXpath("//tr[contains(@class,'ant-table-expanded-row-level-1')]//span[text()='"+remoteiNode.split(' ')[0]+"']//ancestor::tr[1]//td[2]")
      expect(handle).toBeTruthy()
      let repNwActual = await getPropertyValue(handle[0], 'innerText')
      logger.info(repNwActual)
      expect(repNwActual).toBe(repNw)
      reporter.endStep()
    });
  });


    test('Navigate to iNode details page as a(n) <Role> User', async ({
      given,
      when,
      and,
      then
    }) => {

      givenIamLoggedInAs(given)
      when('I navigate to inode details page', async() =>{
        reporter.startStep("When I navigate to inode details page")
        let config = await getEnvConfig()
        await goToNode(config.navigation.edge1.Name)
        let handle = await getElementHandleByXpath(inodeDetails.a.moreInfo)
        await handle[0].click()
        let screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
        reporter.addAttachment("iNode Details", screenshot, "image/png");
        reporter.endStep()
      });
      then(/^All required web elements must be present depending on role "(.*)"$/, async(scope) =>{
        reporter.startStep(`Then All required web elements must be present depending on role ${scope}`)
        for (let tag in inodeDetails){
          if (tag.startsWith('_') == true) { continue }
          reporter.startStep(`Verifying ${tag} webelements`)
          for (let elem in inodeDetails[tag]){
            if (elem.startsWith('_') == true) { continue }
            reporter.startStep(`Verifying webelement ${elem} in page`)
            let handle = await getElementHandleByXpath(inodeDetails[tag][elem])
            logger.info(handle.length)
            if (scope != 'orgAdmin' && inodeDetails._adminOnly.includes(elem) == true) {
              if (handle == false) {
                logger.info(`Element ${elem} not present in ${scope} user as expected`)
              } else {
                let value = await getPropertyValue(handle[0], 'disabled')
                expect(value).toBe(true)
                logger.info(`${elem} is disabled for ${scope} user as expected`)
              }
            } else {
              expect(handle).toBeTruthy()
              if (elem == 'manageInode') {
                await handle[0].hover()
              }
            }
            reporter.endStep()
          }
          reporter.endStep()
        }
        reporter.endStep()
      });
      then('All fields must be displayed in system info card', async() =>{
        reporter.startStep("And All fields must be displayed in system info card")
        let config = await getEnvConfig()
        for (let field in config.navigation.edge1) {
          let handle = await getElementHandleByXpath(inodeDetails.div.systemInfoValue.replace('Name', field))
          expect(handle).toBeTruthy()
          let value = await getPropertyValue(handle[0], 'innerText')
          if (config.navigation.edge1[field] != "") {
            reporter.startStep(`${field} value is ${value}. Expected - ${config.navigation.edge1[field]} `)
            expect(value).toBe(config.navigation.edge1[field])
            reporter.endStep()
          }
        }
        reporter.endStep()
      })
      then('Time server must be synchronised', async() =>{
        reporter.startStep('Time server must be synchronised')
        let handle = await getElementHandleByXpath(inodeDetails.div.systemInfoValue.replace('Name', 'Time Servers'))
        let sync_status = await handle[0].$x("//*[contains(@class, 'node-ntp-status-active')]")
        expect(sync_status).toBeTruthy()
        await sync_status[0].hover()
        await page.$x("//div[text()='Synchronized to this server']")
        reporter.endStep()
      })
    })
  
});
