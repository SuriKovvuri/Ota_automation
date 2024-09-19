import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage, deleteAllAlertSubscription } from '../helper/alert';
import { addTanNetwork, getCountOfNetworks, goAllNetworks, goToNetwork, goToNetworkAction, expandTabsInNetworkPage, connectNetwork, getTunnelStatus, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive, rebootiNode } from '../helper/node';
import { verifyServiceRestartCount, addService, serviceStatus, goToService, deleteAllServices, goToServiceAction } from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig, closeModal, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, tableToObjects, matchByKey, waitForNetworkIdle, sortTable, goTo } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis, whenIAddTanNetwork, whenIConnectNetwork, whenTunnelStatusExists, givenIamLoggedInAs } from './shared-steps';
import { del } from 'openstack-client/lib/util';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { NetworkAdd } from '../src/networkAdd';
import { deleteNetworksInNode, deleteServicesInNode, getApi } from '../../utils/api_utils';
import { leftpane, dashboard, allInodes, serialNumbers, allNetworks, allServices, inodeDetails, pullSecrets, modals, volumes, networksTab, servicesTab, csp, allUsers, allRoles, OnlineHelp, eventsTab, imagesTab, images, interfacesTab, events, apiKeys, sshKeys, downloadSoftware, downloadActivity, downloadEvents, manageAlerts, myProfile } from '../constants/locators'
import { goToOrg } from '../helper/org';
import { modalProperties } from '../constants/modals';
import { report } from 'process';

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

      let login = new Login();
      let result = await login.logout()
      expect(result).toBe(true)
      await har.stop();

      await customScreenshot('loggedout.png', 1920, 1200)
      //await createPDF(global.testStart, 'navigation')
    }
    catch (err) {
      logger.error(err);
    }
  })

  beforeAll(async () => {
    try {
      //page.waitForNavigation()
      jest.setTimeout(300000)
      await page.setDefaultNavigationTimeout(50000);
      await page.waitFor(5000);

      let config = await getEnvConfig()
      global.orchIP = config.orchIP
      global.apiKey = config.apiKey

      await har.start({ path: './reports/navigation' + global.testStart + '.har', saveResponse: true });
      let login
      login = new Login();
      logger.info("global.env = " + global.env)
      await goTo(config.orchURL)
      let credentials = {
        'username': config.navOrgAdmin,
        'password': config.navOrgAdminPassword
      }
      await login.launch(global.env, "custom", credentials)
      await (page
        .waitForXPath(leftpane.button.logout, { visible: true })
        .then(() => logger.info('Waiting In before ALL berfore proceeding')))

      await customScreenshot('beforeAll.png', 1920, 1200)
    }
    catch (err) {
      logger.error(err);
    }
  })


  test('Navigate to dashboard', async ({
    given,
    when,
    //and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I land in dashboard page', async () => {
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
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      reporter.startStep("Verify all numberCards")
      for (const key in dashboard.numberCard) {
        if (key.startsWith('_') != true) {
          let handle = await getElementHandleByXpath(dashboard.numberCard[key])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
        }
      }
      reporter.endStep();

      reporter.startStep("Verify all widgets and activity card")
      for (const key in dashboard.widget) {
        if (key.startsWith('_') != true) {
          let handle = await getElementHandleByXpath(dashboard.widget[key])
          expect(handle).toBeTruthy()
        }
      }
      reporter.endStep();

      reporter.startStep("Verify Manage Dashboard button")
      for (const key in dashboard.button) {
        if (key.startsWith('_') != true) {
          let handle = await getElementHandleByXpath(dashboard.button[key])
          expect(handle).toBeTruthy()
        }
      }
      reporter.endStep();

      reporter.startStep("Verify page title - Dashboard")
      for (const key in dashboard.h2) {
        if (key.startsWith('_') != true) {
          let handle = await getElementHandleByXpath(dashboard.h2[key])
          expect(handle).toBeTruthy()
        }
      }
      reporter.endStep();

      reporter.startStep("Verify Dashboard - numberCard Values")
      var config = await getEnvConfig()
      for (const key in dashboard.a) {
        if (key.endsWith('Value') == true) {
          logger.info(`comparing ${key}`)
          let handle = await getElementHandleByXpath(dashboard.a[key])
          expect(handle).toBeTruthy()
          let value = await getPropertyValue(handle[0], 'innerText')
          expect(value).toBeTruthy()
          reporter.startStep(`Comparing ${key} value ${value} is >= ${eval("config.dashboard.numberCard.".concat(key))}`)
          let copmareOp = await compareValue(value, eval("config.dashboard.numberCard.".concat(key)), ">=")
          expect(copmareOp).toBe(true)
          reporter.endStep()
        }
      }
      reporter.endStep();

      reporter.endStep();
    });
  });

  test('Navigate to all inodes page', async ({
    given,
    when,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to all inodes page', async () => {
      reporter.startStep("When I navigate to all inodes page");
      let op = await page.waitForXPath(leftpane.li.inodes)
      let handle = await page.$x(leftpane.li.inodes)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(Object.values(propValue))
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          logger.info("submenu closed")
          let navigated = await navigatePageByClick(leftpane.li.inodes)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get inodes in left menu")
        expect(true).toBe(false)
      }
      let navigated = await navigatePageByClick(leftpane.li.allInodes)
      expect(navigated).toBeTruthy()
      reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      expect(navigated < 10.0).toBe(true)
      reporter.endStep()

      reporter.startStep("Pagination - Scroll the inode list to the end")
      let test = await getElementHandleByXpath(allInodes.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      reporter.endStep()
      let screenshot = await customScreenshot('allInodes.png', 1920, 1200)
      reporter.addAttachment("All inodes", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let node_list = await getApi("node", null, true)
      let total_count = node_list.total_count
      let tablerows = await getElementHandleByXpath(allInodes.div.tableBodyRows)
      console.log("tablerows")

      reporter.startStep(`Number of inode rows ${tablerows.length} must match the api total node list ${total_count}`)
      console.log(tablerows.length)
      console.log(total_count)
      if (tablerows.length == total_count) {
        logger.info("All inodes are listed correctly")
      } else {
        logger.error("Total count in inodes by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in allInodes) {
        if (elem1.startsWith('_') == true) {
          continue;
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in allInodes[elem1]){
          if (elem2.startsWith('_') != true){
            reporter.startStep(`Verifying webelement ${elem2} in page`)
            let handle = await getElementHandleByXpath(allInodes[elem1][elem2])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep()
          }
        }
        reporter.endStep()
      }

      reporter.endStep();
    });
  });

  test('Navigate to all Serial Numbers page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to all serial numbers page', async () => {
      reporter.startStep("When I navigate to all serial numbers page");
      let op = await page.waitForXPath(leftpane.li.inodes)
      let handle = await page.$x(leftpane.li.inodes)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.inodes)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get inodes in left menu")
        expect(true).toBe(false)
      }
      let navigated = await navigatePageByClick(leftpane.li.serialNumbers)
      expect(navigated).toBeTruthy()
      reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      expect(navigated < 10.0).toBe(true)
      reporter.endStep()

      reporter.startStep("Pagination - Scroll the inode list to the end")
      let test = await getElementHandleByXpath(serialNumbers.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      reporter.endStep()
      let screenshot = await customScreenshot('serialNumbers.png', 1920, 1200)
      reporter.addAttachment("All serial numbers", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let node_list = await getApi("pki", "assigned=false", true)
      let total_count = node_list.total_count
      let tablerows = await getElementHandleByXpath(serialNumbers.div.tableBodyRows)
      console.log(tablerows)

      reporter.startStep(`Number of serial numbers rows ${tablerows.length} must match the api total node list ${total_count}`)
      console.log(tablerows.length)
      console.log(total_count)
      if (tablerows.length == total_count) {
        logger.info("All serial numbers are listed correctly")
      } else {
        logger.error("Total count in serial numbers by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in serialNumbers) {
        if (elem1.startsWith('_') != true) {
          reporter.startStep(`Verifying ${elem1} webelements`)
          for (let elem2 in serialNumbers[elem1]) {
            if (elem2.startsWith('_') != true) {
              reporter.startStep(`Verifying webelement ${elem2} in page`)
              let handle = await getElementHandleByXpath(serialNumbers[elem1][elem2])
              logger.info(handle.length)
              expect(handle).toBeTruthy()
              reporter.endStep()
            }
          }
          reporter.endStep()
        }
      }

      reporter.endStep();
    });
  });


  test('Navigate to all networks page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to all networks page', async () => {
      reporter.startStep("When I navigate to all networks page");
      let op = await page.waitForXPath(leftpane.li.networks)
      let handle = await page.$x(leftpane.li.networks)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.networks)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get networks in left menu")
        expect(true).toBe(false)
      }
      let navigated = await navigatePageByClick(leftpane.li.allNetworks)
      expect(navigated).toBeTruthy()
      reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      expect(navigated < 10.0).toBe(true)
      reporter.endStep()

      reporter.startStep("Pagination - Scroll the networks list to the end")
      await delay(5000)

      let test = await getElementHandleByXpath(allNetworks.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      reporter.endStep()
      let screenshot = await customScreenshot('allNetworks.png', 1920, 1200)
      reporter.addAttachment("All networks", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let network_list = await getApi("network", null, true)
      let total_count = network_list.total_count
      let tablerows = await getElementHandleByXpath(allNetworks.div.tableBodyRows)

      reporter.startStep(`Number of networks rows ${tablerows.length} must match the api total networks list ${total_count}`)
      console.log(tablerows.length)
      console.log(total_count)
      if (tablerows.length == total_count) {
        logger.info("All networks are listed correctly")
      } else {
        logger.error("Total count in networks by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in allNetworks) {
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in allNetworks[elem1]) {
          if (elem2.startsWith('_') != true) {
            reporter.startStep(`Verifying webelement ${elem2} in page`)
            let handle = await getElementHandleByXpath(allNetworks[elem1][elem2])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep()
          }
        }
        reporter.endStep()
      }

      let config = await getEnvConfig()
      let value = "Home/" + config.orgName + "/Networks"
      reporter.startStep(`Verify value of bread-crumb - ${value}`)
      let handle = await getElementHandleByXpath(allNetworks.div.breadcrumb)
      let ui_value = await getPropertyValue(handle[0], "innerText")
      let resutls = ui_value.replaceAll("\n", "")
      expect(resutls).toBe(value)
      reporter.endStep()

      reporter.startStep(`Verify page title - ${config.orgName}`)
      handle = await getElementHandleByXpath(allNetworks.h2.pageTitle)
      ui_value = await getPropertyValue(handle[0], "innerText")
      value = config.orgName
      expect(ui_value.trim()).toBe(value)
      reporter.endStep()

      reporter.endStep();
    });
  });

  test('Navigate to all services page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to all services page', async () => {
      reporter.startStep("When I navigate to all services page");
      let op = await page.waitForXPath(leftpane.li.services)
      let handle = await page.$x(leftpane.li.services)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.services)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get services in left menu")
        expect(true).toBe(false)
      }
      let navigated = await navigatePageByClick(leftpane.li.allServices)
      expect(navigated).toBeTruthy()
      reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      expect(navigated < 10.0).toBe(true)
      reporter.endStep()

      reporter.startStep("Pagination - Scroll the services list to the end")
      let test = await getElementHandleByXpath(allServices.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      reporter.endStep()
      let screenshot = await customScreenshot('allServices.png', 1920, 1200)
      reporter.addAttachment("All services", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let service_list = await getApi("service", null, true)
      let total_count = service_list.total_count
      let tablerows = await getElementHandleByXpath(allServices.div.tableBodyRows)

      reporter.startStep(`Number of services rows ${tablerows.length} must match the api total services list ${total_count}`)
      console.log(tablerows)
      console.log(total_count)
      if (tablerows.length == total_count) {
        logger.info("All services are listed correctly")
      } else {
        logger.error("Total count in services by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in allServices) {
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in allServices[elem1]) {
          if (elem2.startsWith('_') != true) {
            reporter.startStep(`Verifying webelement ${elem2} in page`)
            let handle = await getElementHandleByXpath(allServices[elem1][elem2])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep()
          }
        }
        reporter.endStep()
      }

      let config = await getEnvConfig()
      let value = "Home/" + config.orgName + "/Services"
      reporter.startStep(`Verify value of bread-crumb - ${value}`)
      let handle = await getElementHandleByXpath(allNetworks.div.breadcrumb)
      let ui_value = await getPropertyValue(handle[0], "innerText")
      let results = ui_value.replaceAll("\n", "")
      logger.info(results)
      expect(results).toBe(value)
      reporter.endStep()

      reporter.startStep(`Verify page title - ${config.orgName}`)
      handle = await getElementHandleByXpath(allNetworks.h2.pageTitle)
      ui_value = await getPropertyValue(handle[0], "innerText")
      value = config.orgName
      expect(ui_value.trim()).toBe(value)
      reporter.endStep()
      let screenshot = await customScreenshot('allServices.png', 1920, 1200)
      reporter.addAttachment("All services", screenshot, "image/png");
      reporter.endStep();
    });
  });

  test('Navigate to Pull Secrets Page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I land in Pull Secrets page', async () => {
      reporter.startStep("When I land in Pull Secrets page");

      let op = await page.waitForXPath(leftpane.li.services)
      let handle = await page.$x(leftpane.li.services)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.services)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get services in left menu")
        expect(true).toBe(false)
      }
      let screenshot = await customScreenshot('services.png', 1920, 1200)
      reporter.addAttachment("Services", screenshot, "image/png");

      let navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
      expect(navigated).toBeTruthy()
      expect(navigated < 10.0).toBe(true)
      reporter.startStep(`Navigation time is ${navigated.TaskDuration} is less than 10s`)
      reporter.endStep()
      screenshot = await customScreenshot('serviceSecrets.png', 1920, 1200)
      reporter.addAttachment("ServiceSecrets", screenshot, "image/png");
      reporter.endStep();

      reporter.startStep("Pagination - Scroll the pull secret list to the end")
      let test = await getElementHandleByXpath(pullSecrets.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      screenshot = await customScreenshot('pull-secrets-pagination.png', 1920, 1200)
      reporter.addAttachment("Pull Secrets Pagination", screenshot, "image/png");
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      let config = await getEnvConfig()
      reporter.startStep("Then All layouts must be present");
      let handle = await getElementHandleByXpath(pullSecrets.h2["pageTitle"])
      expect(handle).toBeTruthy()
      let value = await getPropertyValue(handle[0], 'innerText')
      expect(value).toBeTruthy()
      reporter.startStep(`Comparing Org Name: ${value} == ${config.orgName}`)
      logger.info(`Comparing Org Name: ${value} == ${config.orgName}`)
      expect(value.trim()).toBe(config.orgName)
      reporter.endStep();
      let screenshot = await customScreenshot('pull-secrets-pagination.png', 1920, 1200)
      reporter.addAttachment("Pull Secrets Pagination", screenshot, "image/png");


      let filters = "type=Dockerconfigjson"
      let volume_list = await getApi("secret", filters, true)
      let total_count = volume_list.total_count
      let tablerows = await getElementHandleByXpath(pullSecrets.div.tableBodyRows)

      reporter.startStep(`Number of pull secret rows ${tablerows.length} must match the api total pull secret list ${total_count}`)
      if (tablerows.length == total_count) {
        logger.info("All pull secrets are listed correctly")
      } else {
        logger.error("Total count in pull secrets by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in pullSecrets) {
        if (elem1.startsWith('_') != true) {
          reporter.startStep(`Verifying ${elem1} webelements`)
          for (let elem2 in pullSecrets[elem1]) {
            if (elem2.startsWith('_') != true) {
              reporter.startStep(`Verifying webelement ${elem2} in page`)
              let handle = await getElementHandleByXpath(pullSecrets[elem1][elem2])
              logger.info(handle.length)
              expect(handle).toBeTruthy()
              screenshot = await customScreenshot('pull-secrets-pagination.png', 1920, 1200)
              reporter.addAttachment("Pull Secrets Pagination", screenshot, "image/png");
              reporter.endStep()
            }
          }
          reporter.endStep()
        }
      }
      reporter.endStep()
    });
  });

  test('Navigate to Volumes Page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I land in Volumes page', async () => {
      reporter.startStep("When I land in Volumes page");

      let op = await page.waitForXPath(leftpane.li.services)
      let handle = await page.$x(leftpane.li.services)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.services)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get services in left menu")
        expect(true).toBe(false)
      }
      let screenshot = await customScreenshot('services.png', 1920, 1200)
      reporter.addAttachment("Services", screenshot, "image/png");

      let navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
      expect(navigated).toBeTruthy()
      expect(navigated < 10.0).toBe(true)
      reporter.startStep(`Navigation time is ${navigated.TaskDuration} is less than 10s`)
      reporter.endStep()

      navigated = await navigatePageByClick(volumes.tab.volumes)
      expect(navigated).toBeTruthy()
      expect(navigated < 10.0).toBe(true)
      reporter.startStep(`Navigation time is ${navigated.TaskDuration} is less than 10s`)
      reporter.endStep()
      screenshot = await customScreenshot('volumes.png', 1920, 1200)
      reporter.addAttachment("Volumes", screenshot, "image/png");
      reporter.endStep();

      reporter.startStep("Pagination - Scroll the volumes list to the end")
      let test = await getElementHandleByXpath(volumes.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      screenshot = await customScreenshot('volumes-pagination.png', 1920, 1200)
      reporter.addAttachment("Volumes Pagination", screenshot, "image/png");
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      let config = await getEnvConfig()
      reporter.startStep("Then All layouts must be present");
      let handle = await getElementHandleByXpath(volumes.h2["pageTitle"])
      expect(handle).toBeTruthy()
      let value = await getPropertyValue(handle[0], 'innerText')
      expect(value).toBeTruthy()
      reporter.startStep(`Comparing Org Name: ${value} == ${config.orgName}`)
      logger.info(`Comparing Org Name: ${value} == ${config.orgName}`)
      expect(value.trim()).toBe(config.orgName)
      reporter.endStep();

      let filters = "type=Opaque"
      let volume_list = await getApi("secret", filters, true)
      let total_count = volume_list.total_count
      let tablerows = await getElementHandleByXpath(volumes.div.tableBodyRows)

      reporter.startStep(`Number of volume rows ${tablerows.length} must match the api total volume list ${total_count}`)
      if (tablerows.length == total_count) {
        logger.info("All volumes are listed correctly")
      } else {
        logger.error("Total count in volumes by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in volumes) {
        if (elem1.startsWith('_') != true) {
          reporter.startStep(`Verifying ${elem1} webelements`)
          for (let elem2 in volumes[elem1]) {
            if (elem2.startsWith('_') != true) {
              reporter.startStep(`Verifying webelement ${elem2} in page`)
              let handle = await getElementHandleByXpath(volumes[elem1][elem2])
              logger.info(handle.length)
              expect(handle).toBeTruthy()
              reporter.endStep()
            }
          }
          reporter.endStep()
        }
      }
      reporter.endStep()
    });
  });

  test('Navigate to csp page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to csp page', async () => {
      reporter.startStep("When I navigate to csp page");
      let op = await page.waitForXPath(leftpane.li.networks)
      let handle = await page.$x(leftpane.li.networks)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.networks)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get networks in left menu")
        expect(true).toBe(false)
      }
      let navigated = await navigatePageByClick(leftpane.li.customSecurityPolicy)
      expect(navigated).toBeTruthy()
      reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      expect(navigated < 10.0).toBe(true)
      reporter.endStep()

      reporter.startStep("Pagination - Scroll the csp list to the end")
      let test = await getElementHandleByXpath(csp.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      reporter.endStep()
      let screenshot = await customScreenshot('csp.png', 1920, 1200)
      reporter.addAttachment("csp", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let csp_list = await getApi("firewallgroup", "isDefault=false", true)
      let total_count = csp_list.total_count
      let tablerows = await getElementHandleByXpath(csp.div.tableBodyRows)

      reporter.startStep(`Number of csp rows ${tablerows.length} must match the api total csp list ${total_count}`)
      if (tablerows.length == total_count) {
        logger.info("All csp are listed correctly")
      } else {
        logger.error("Total count in csp by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in csp) {
        if (elem1.startsWith('_') != true) {
          reporter.startStep(`Verifying ${elem1} webelements`)
          for (let elem2 in csp[elem1]) {
            if (elem2.startsWith('_') != true) {
              reporter.startStep(`Verifying webelement ${elem2} in page`)
              let handle = await getElementHandleByXpath(csp[elem1][elem2])
              logger.info(handle.length)
              expect(handle).toBeTruthy()
              reporter.endStep()
            }
          }
          reporter.endStep()
        }
      }

      let config = await getEnvConfig()
      let value = "Home/" + config.orgName + "/Custom Security Policy"
      reporter.startStep(`Verify value of bread-crumb - ${value}`)
      let handle = await getElementHandleByXpath(csp.div.breadcrumb)
      let ui_value = await getPropertyValue(handle[0], "innerText")
      let resutls = ui_value.replaceAll("\n", "")
      expect(resutls).toBe(value)
      reporter.endStep()

      reporter.startStep(`Verify page title - ${config.orgName}`)
      handle = await getElementHandleByXpath(csp.h2.pageTitle)
      ui_value = await getPropertyValue(handle[0], "innerText")
      value = config.orgName
      expect(ui_value.trim()).toBe(value)
      reporter.endStep()
      reporter.endStep();
    });
  });

  test('Navigate to users page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to users page', async () => {
      reporter.startStep("When I navigate to users page");
      let op = await page.waitForXPath(leftpane.li.users)
      let handle = await page.$x(leftpane.li.users)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.users)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get networks in left menu")
        expect(true).toBe(false)
      }
      let navigated = await navigatePageByClick(leftpane.li.allUsers)
      expect(navigated).toBeTruthy()
      reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      expect(navigated < 10.0).toBe(true)
      reporter.endStep()

      reporter.startStep("Pagination - Scroll the users list to the end")
      let test = await getElementHandleByXpath(allUsers.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      reporter.endStep()
      let screenshot = await customScreenshot('allUsers.png', 1920, 1200)
      reporter.addAttachment("all users", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let user_list = await getApi("user", null, true)
      let total_count = user_list.total_count
      let tablerows = await getElementHandleByXpath(allUsers.div.tableBodyRows)

      reporter.startStep(`Number of users rows ${tablerows.length} must match the api total users list ${total_count}`)
      if (tablerows.length == total_count) {
        logger.info("All users are listed correctly")
      } else {
        logger.error("Total count in users by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in allUsers) {
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in allUsers[elem1]) {
          if (elem2.startsWith('_') != true) {
            reporter.startStep(`Verifying webelement ${elem2} in page`)
            let handle = await getElementHandleByXpath(allUsers[elem1][elem2])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep()
          }
        }
        reporter.endStep()
      }

      let config = await getEnvConfig()
      let value = "Home/" + config.orgName + "/Users"
      reporter.startStep(`Verify value of bread-crumb - ${value}`)
      let handle = await getElementHandleByXpath(allUsers.div.breadcrumb)
      let ui_value = await getPropertyValue(handle[0], "innerText")
      let results = ui_value.replaceAll("\n", "")
      expect(results).toBe(value)
      reporter.endStep()

      reporter.startStep(`Verify page title - ${config.orgName}`)
      handle = await getElementHandleByXpath(allUsers.h2.pageTitle)
      ui_value = await getPropertyValue(handle[0], "innerText")
      value = config.orgName
      expect(ui_value.trim()).toBe(value)
      reporter.endStep()
      reporter.endStep();
    });
  });

  test('Navigate to roles page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to roles page', async () => {
      reporter.startStep("When I navigate to roles page");
      let op = await page.waitForXPath(leftpane.li.users)
      let handle = await page.$x(leftpane.li.users)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.users)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get users in left menu")
        expect(true).toBe(false)
      }
      let navigated = await navigatePageByClick(leftpane.li.allRoles)
      expect(navigated).toBeTruthy()
      reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      expect(navigated < 10.0).toBe(true)
      reporter.endStep()

      reporter.startStep("Pagination - Scroll the roles list to the end")
      let test = await getElementHandleByXpath(allRoles.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")
      reporter.endStep()
      let screenshot = await customScreenshot('allRoles.png', 1920, 1200)
      reporter.addAttachment("all roles", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let role_list = await getApi("role", null, true)
      let total_count = role_list.total_count
      let tablerows = await getElementHandleByXpath(allRoles.div.tableBodyRows)

      reporter.startStep(`Number of roles rows ${tablerows.length} must match the api total roles list ${total_count}`)
      if (tablerows.length == total_count) {
        logger.info("All roles are listed correctly")
      } else {
        logger.error("Total count in roles by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in allRoles) {
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in allRoles[elem1]) {
          if (elem2.startsWith('_') != true) {
            reporter.startStep(`Verifying webelement ${elem2} in page`)
            let handle = await getElementHandleByXpath(allRoles[elem1][elem2])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep()
          }
        }
        reporter.endStep()
      }

      let config = await getEnvConfig()
      let value = "Home/" + config.orgName + "/Roles"
      reporter.startStep(`Verify value of bread-crumb - ${value}`)
      let handle = await getElementHandleByXpath(allRoles.div.breadcrumb)
      let ui_value = await getPropertyValue(handle[0], "innerText")
      let results = ui_value.replaceAll("\n", "")
      expect(results).toBe(value)
      reporter.endStep()

      reporter.startStep(`Verify page title - ${config.orgName}`)
      handle = await getElementHandleByXpath(allRoles.h2.pageTitle)
      ui_value = await getPropertyValue(handle[0], "innerText")
      value = config.orgName
      expect(ui_value.trim()).toBe(value)
      reporter.endStep()
      reporter.endStep();
    });
  });

  test('Sort the all networks table', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    var ordredValues, head, body
    when('I navigate to all networks page', async () => {
      reporter.startStep("When I navigate to all networks page");
      let op = await page.waitForXPath(leftpane.li.networks)
      let handle = await page.$x(leftpane.li.networks)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.networks)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get networks in left menu")
        expect(true).toBe(false)
      }
      let navigated = await navigatePageByClick(leftpane.li.allNetworks)
      expect(navigated).toBeTruthy()
      reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      expect(navigated < 10.0).toBe(true)
      reporter.endStep()

      let test = await getElementHandleByXpath(allNetworks.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")

      head = await getElementHandleByXpath(allNetworks.div.tableHeader + "//thead")
      body = await getElementHandleByXpath(allNetworks.div.tableBody + "//tbody")
      let tableValues = await tableToObjects(head[0], body[0])
      logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>",tableValues)
      ordredValues = tableValues.map(x => x.Name).sort()

      let screenshot = await customScreenshot('allNetworks.png', 1920, 1200)
      reporter.addAttachment("All networks", screenshot, "image/png");
      reporter.endStep();
    });
    and(/^Sort networks table by name in "(.*?)" order$/, async (order) => {
      reporter.startStep(`And Sort services table by name in ${order} order`)
      let sorted = await sortTable(allNetworks.div.tableHeader, "Name", order)
      expect(sorted).toBe(true)
      reporter.endStep()
    })
    then(/^Networks table must be sorted by name in "(.*?)" order$/, async (order) => {
      logger.info(order)
      let expectedValues
      if (order == 'descending') {
        expectedValues = ordredValues.reverse()
      } else {
        expectedValues = ordredValues
      }
      logger.info("ordered values is ", expectedValues)
      /*
      let test = await getElementHandleByXpath(allNetworks.div.scrollbar)
      await autoScroll(test[0])
      logger.info("scroll over")      
      */
      head = await getElementHandleByXpath(allNetworks.div.tableHeader + "//thead")
      body = await getElementHandleByXpath(allNetworks.div.tableBody + "//tbody")
      let tableValues = await tableToObjects(head[0], body[0])
      logger.info(tableValues.length)
      let foundNames = tableValues.map(x => x.Name)
      logger.info(foundNames)
      expect(foundNames.slice(0, 25)).toStrictEqual(expectedValues.slice(0, 25))
    });
  });

  test('Navigate to Online help page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Online help page', async () => {
      reporter.startStep("When I navigate to Online help page");
      let action = await performAction('click', leftpane.button.help)
      expect(action).toBe(true)
      let navigated = await performAction('hover', "//span[text()='Online Help']//ancestor::a[contains(@href, '/docs')]")
      navigated = await performAction('click', "//span[text()='Online Help']//ancestor::a[contains(@href, '/docs')]")
      expect(navigated).toBeTruthy()
    //   await page.waitForXPath("//i[@aria-label='icon: loading']");
    //   while (true) {
    //     let loader = await page.$x("//i[@aria-label='icon: loading']")
    //     if (loader.length == 0) { break }
    // }
    //   await page.waitForSelector("i[aria-label='icon: loading']")
      let screenshot = await customScreenshot('OnlineHelp.png', 1920, 1200)
      reporter.addAttachment("Online help", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      await page.waitForXPath("//iframe[@name='OnlineHelpDoc']")
      let frames = await page.$x("//iframe[@name='OnlineHelpDoc']")
      logger.info("iframe length ", frames.length)
      const frame = await page.frames().find((frame) => frame.name() === 'OnlineHelpDoc');
      expect(frames).toBeTruthy()
      for (let elem1 in OnlineHelp) {
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in OnlineHelp[elem1]) {
          if (elem2.startsWith('_') != true) {
            reporter.startStep(`Verifying webelement ${elem2} in page`)
            let handle = await frames.$x("." + OnlineHelp[elem1][elem2])
            logger.info(`${OnlineHelp[elem1][elem2]} length is ${handle.length}`)
            expect(handle.length != 0).toBe(true)
            reporter.endStep()
          }
        }
        reporter.endStep()
      }

      reporter.endStep();
    });
  });

  test('Navigate to API Keys page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to API Keys page', async () => {
      reporter.startStep("When I click My Account");
      let navigated = await navigatePageByClick(leftpane.li.myAccount)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('myAccount.png', 1920, 1200)
      reporter.addAttachment("My Account", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click API Keys link");
      let found = await getElementHandleByXpath(leftpane.li.apiKeys)
      logger.info("found api keys ", found)
      await found[0].hover()
      screenshot = await customScreenshot('hoverapiKeys.png')
      reporter.addAttachment("Hover API Keys Page", screenshot, "image/png");
      navigated = await navigatePageByClick(leftpane.li.apiKeys)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('apiKeys.png', 1920, 1200)
      reporter.addAttachment("API Keys Page", screenshot, "image/png");
      reporter.endStep()
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in apiKeys) {
        if (elem1.startsWith('_') == true) {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in apiKeys[elem1]) {
          if (elem2.startsWith('_') == true) {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(apiKeys[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }

      reporter.startStep(`Verifying total number of API Keys listed`)
      let apiKeyList = await getApi("user/current/apikey", null, true, "v1")
      let handle = await getElementHandleByXpath(apiKeys['div']['tableBodyRows'])
      logger.info(handle.length)
      expect(handle).toBeTruthy()
      logger.info(`Total number of API Keys listed: ${handle.length}; API returned: ${apiKeyList.length}`)
      expect(apiKeyList.length).toBe(handle.length)
      reporter.endStep();

      reporter.endStep()
    });
  });

  test('Navigate to SSH Keys page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to SSH Keys page', async () => {
      reporter.startStep("When I click iNodes in leftpane");
      let op = await page.waitForXPath(leftpane.li.inodes)
      let handle = await page.$x(leftpane.li.inodes)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.inodes)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get iNodes in left menu")
        expect(true).toBe(false)
      }
      let screenshot = await customScreenshot('iNodes.png', 1920, 1200)
      reporter.addAttachment("iNodes", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click SSH Keys link");
      let navigated = await navigatePageByClick(leftpane.li.sshKeys)
      expect(navigated).toBeTruthy()
      expect(navigated < 10.0).toBe(true)
      reporter.startStep(`Navigation time is ${navigated.TaskDuration} is less than 10s`)
      reporter.endStep()
      screenshot = await customScreenshot('sshKeys.png', 1920, 1200)
      reporter.addAttachment("SSH Keys Page", screenshot, "image/png");
      reporter.endStep()
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in sshKeys) {
        if (elem1.startsWith('_') == true) {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in sshKeys[elem1]) {
          if (elem2.startsWith('_') == true) {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(sshKeys[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }

      reporter.startStep(`Verify page title - ${config.orgName}`)
      let handle = await getElementHandleByXpath(sshKeys.h2.pageTitle)
      let ui_value = await getPropertyValue(handle[0], "innerText")
      let value = config.orgName
      expect(ui_value.trim()).toBe(value)
      reporter.endStep()

      reporter.startStep(`Verifying total number of SSH Keys listed`)
      let sshKeyList = await getApi("sshkey", null, true)
      handle = await getElementHandleByXpath(sshKeys['div']['tableBodyRows'])
      logger.info(handle.length)
      expect(handle).toBeTruthy()
      logger.info(`Total number of SSH Keys listed: ${handle.length}; API returned: ${sshKeyList.total_count}`)
      expect(sshKeyList.total_count).toBe(handle.length)
      reporter.endStep();

      reporter.endStep()
    });
  });

  test('Navigate to download software page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to download software page', async () => {
      reporter.startStep("When I navigate to download software page");
      let action = await performAction('click', leftpane.button.download)
      expect(action).toBe(true)
      let navigated = await navigatePageByClick(leftpane.li.downloadSoftware)
      expect(navigated).toBeTruthy()
      reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      expect(navigated < 10.0).toBe(true)
      reporter.endStep()
      //await page.waitForSelector(!"i[aria-label='icon: loading']")
      let screenshot = await customScreenshot('downloadsoftware.png', 1920, 1200)
      reporter.addAttachment("download software", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      for (let elem1 in downloadSoftware) {
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in downloadSoftware[elem1]) {
          if (elem2.startsWith('_') != true) {
            //download software with latest tag is maintained only in staging bucket.          
            if (global.env == "develop" && elem2.startsWith('latest') == true) { continue }
            reporter.startStep(`Verifying webelement ${elem2} in page`)
            let handle = await getElementHandleByXpath(downloadSoftware[elem1][elem2])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep()
          }
        }
        reporter.endStep()
      }
      reporter.endStep();
    });
    then('Latest release software must be present', async () => {
      //download software with latest tag is maintained only in staging bucket.          
      if (global.env != "develop") {
        reporter.startStep("And Latest release software must be present");
        let latestCard = await getElementHandleByXpath(downloadSoftware.div.latestReleaseCard)
        expect(latestCard).toBeTruthy()
        reporter.startStep("Latest ova image is present")
        let ovaImage = await getElementHandleByXpath("." + downloadSoftware.div._latestOva, latestCard[0])
        expect(ovaImage.length).toBe(1)
        let downloadIcon = await getElementHandleByXpath("." + downloadSoftware.svg.downloadIcon, ovaImage[0])
        expect(downloadIcon.length).toBe(1)
        reporter.endStep()
        reporter.startStep("Latest azure launcher is present")
        let azureLauncher = await getElementHandleByXpath("." + downloadSoftware.div._latestAzureLauncher, latestCard[0])
        expect(azureLauncher.length).toBe(1)
        downloadIcon = await getElementHandleByXpath("." + downloadSoftware.svg.downloadIcon, azureLauncher[0])
        expect(downloadIcon.length).toBe(1)
        reporter.endStep()
        reporter.endStep();
      }
    });
  });

  test('Navigate to Download Events page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Download Events page', async () => {
      reporter.startStep("When I click Download icon");
      let navigated = await navigatePageByClick(leftpane.button.download)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('download.png', 1920, 1200)
      reporter.addAttachment("Download", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click Download Events link");
      navigated = await navigatePageByClick(leftpane.li.downloadEvents)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('downloadEvents.png', 1920, 1200)
      reporter.addAttachment("Download Events Page", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click Info Icon next to 'Request Report' button");
      navigated = await navigatePageByClick(downloadEvents['button']['infoRequestReport'])
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('infoRequestReport.png', 1920, 1200)
      reporter.addAttachment("Info Request Report", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click Info Icon next to 'Created On'");
      navigated = await navigatePageByClick(downloadEvents['button']['infoCreatedOn'])
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('infoCreatedOn.png', 1920, 1200)
      reporter.addAttachment("Info Cretaed On", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click Request Event Report label");
      navigated = await navigatePageByClick(downloadEvents['span']['requestEventReport'])
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('requestEventReport.png', 1920, 1200)
      reporter.addAttachment("Request Event Report Label", screenshot, "image/png");
      reporter.endStep()
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in downloadEvents) {
        if (elem1.startsWith('_') == true) {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in downloadEvents[elem1]) {
          if (elem2.startsWith('_') == true) {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(downloadEvents[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }

      reporter.startStep(`Verifying total number of Download Events listed`)
      let downloadEventList = await getApi("download/event", null, true, "v1")
      let handle = await getElementHandleByXpath(downloadEvents['div']['tableBodyRows'])
      logger.info(handle.length)
      expect(handle).toBeTruthy()
      //logger.info(`Total number of Download Events listed: ${handle.length}; API returned: ${downloadEventList.total_count}`)
      //expect(downloadEventList.total_count).toBe(handle.length)
      //reporter.endStep();

      //reporter.endStep()
    });
  });

  test('Navigate to Download Activity page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Download Activity page', async () => {
      reporter.startStep("When I click Download icon");
      let navigated = await navigatePageByClick(leftpane.button.download)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('download.png', 1920, 1200)
      reporter.addAttachment("Download", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click Download Activity link");
      navigated = await navigatePageByClick(leftpane.li.downloadActivity)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('downloadActivity.png', 1920, 1200)
      reporter.addAttachment("Download Activity Page", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click Info Icon next to 'Request Report' button");
      navigated = await navigatePageByClick(downloadActivity['button']['infoRequestReport'])
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('infoRequestReport.png', 1920, 1200)
      reporter.addAttachment("Info Request Report", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click Info Icon next to 'Created On'");
      navigated = await navigatePageByClick(downloadActivity['button']['infoCreatedOn'])
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('infoCreatedOn.png', 1920, 1200)
      reporter.addAttachment("Info Cretaed On", screenshot, "image/png");
      reporter.endStep()

      // reporter.startStep("When I click Request Event Report label");
      // navigated = await navigatePageByClick(downloadActivity['span']['requestEventReport'])
      // expect(navigated).toBeTruthy()
      // screenshot = await customScreenshot('requestEventReport.png', 1920, 1200)
      // reporter.addAttachment("Request Event Report Label", screenshot, "image/png");
      // reporter.endStep()
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in downloadActivity) {
        if (elem1.startsWith('_') == true) {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in downloadActivity[elem1]) {
          if (elem2.startsWith('_') == true) {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(downloadActivity[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }

      reporter.startStep(`Verifying total number of Download Events listed`)
      let downloadActivityList = await getApi("download/event", null, true, "v1")
      let handle = await getElementHandleByXpath(downloadActivity['div']['tableBodyRows'])
      logger.info(handle.length)
      expect(handle).toBeTruthy()
      logger.info(`Total number of Download Activities listed: ${handle.length}; API returned: ${downloadActivityList.total_count}`)
      expect(downloadActivityList.total_count).toBe(handle.length)
      reporter.endStep();

      reporter.endStep()
    });
  });

  test('Navigate to Manage Alerts page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to Manage Alerts page', async () => {
      reporter.startStep("When I click My Account");
      let navigated = await navigatePageByClick(leftpane.li.myAccount)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('myAccount.png', 1920, 1200)
      reporter.addAttachment("My Account", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click Manage Alerts link");
      let found = await getElementHandleByXpath(leftpane.li.manageAlerts)
      logger.info("Manage alerts found ", found.length)
      logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>", found[0])
      await found[0].hover()
      screenshot = await customScreenshot('hovermanageAlerts.png')
      reporter.addAttachment("Hover Manage Alerts Page", screenshot, "image/png");
      navigated = await navigatePageByClick(leftpane.li.manageAlerts)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('manageAlerts.png', 1920, 1200)
      reporter.addAttachment("Manage Alerts Page", screenshot, "image/png");
      reporter.endStep()
    });
    when('I hover on an alert dropdown', async () => {
      reporter.startStep("When I hover on an alert dropdown");
      let found = await getElementHandleByXpath(manageAlerts.button.dropDownTrigger)
      logger.info("found dropdown on alertrecord ", found)
      await found[0].hover()
      let screenshot = await customScreenshot('alertHover.png')
      reporter.addAttachment("alertHover", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in manageAlerts) {
        if (elem1.startsWith('_') == true) {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in manageAlerts[elem1]) {
          if (elem2.startsWith('_') == true) {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(manageAlerts[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }

      reporter.startStep(`Verifying total number of alerts listed`)
      let alertList = await getApi("mysubscriptions", null, true)
      let handle = await getElementHandleByXpath(manageAlerts['div']['tableBodyRows'])
      logger.info(handle.length)
      expect(handle).toBeTruthy()
      logger.info(`Total number of API Keys listed: ${handle.length}; API returned: ${alertList.total_count}`)
      expect(alertList.total_count).toBe(handle.length)
      reporter.endStep();

      reporter.endStep()
    });
  });

  test('Navigate to My Profile page', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I navigate to My Profile page', async () => {
      reporter.startStep("When I click My Account");
      let navigated = await navigatePageByClick(leftpane.li.myAccount)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('myAccount.png', 1920, 1200)
      reporter.addAttachment("My Account", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click My Profile link");
      let found = await getElementHandleByXpath(leftpane.li.myProfile)
      logger.info("found my profile keys ", found)
      await found[0].hover()
      screenshot = await customScreenshot('hovermyProfile.png')
      reporter.addAttachment("Hover My Profile Page", screenshot, "image/png");
      navigated = await navigatePageByClick(leftpane.li.myProfile)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('myProfile.png', 1920, 1200)
      reporter.addAttachment("My Profile Page", screenshot, "image/png");
      reporter.endStep()
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let config = await getEnvConfig()
      for (let elem1 in myProfile) {
        if (elem1.startsWith('_') == true) {
          continue
        }
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in myProfile[elem1]) {
          if (elem2.startsWith('_') == true) {
            continue
          }
          reporter.startStep(`Verifying webelement ${elem2} in page`)
          let handle = await getElementHandleByXpath(myProfile[elem1][elem2])
          logger.info(handle.length)
          expect(handle).toBeTruthy()
          reporter.endStep()
        }
        reporter.endStep()
      }
      reporter.endStep()
    });
  });

  test('Collapse Left Menu', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I collapse left menu', async () => {
      reporter.startStep("When I click collapse icon");
      let navigated = await navigatePageByClick(leftpane._i.collapse)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('collapse.png', 1920, 1200)
      reporter.addAttachment("Collapse", screenshot, "image/png");
      reporter.endStep()
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      reporter.startStep(`Verifying webelement ${leftpane["_i"]["expand"]} in page`)
      let handle = await getElementHandleByXpath(leftpane["_i"]["expand"])
      logger.info(handle.length)
      expect(handle).toBeTruthy()
      reporter.endStep()
      reporter.startStep("When I click expand icon");
      let navigated = await navigatePageByClick(leftpane._i.expand)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('expand.png', 1920, 1200)
      reporter.addAttachment("Expand", screenshot, "image/png");
      reporter.endStep()
      reporter.endStep()
    });
  });

  test('Expand Left Menu', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when('I expand left menu', async () => {
      reporter.startStep("When I click collapse icon");
      let navigated = await navigatePageByClick(leftpane._i.collapse)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('collapse.png', 1920, 1200)
      reporter.addAttachment("Collapse", screenshot, "image/png");
      reporter.endStep()

      reporter.startStep("When I click expand icon");
      navigated = await navigatePageByClick(leftpane._i.expand)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('expand.png', 1920, 1200)
      reporter.addAttachment("Expand", screenshot, "image/png");
      reporter.endStep()
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      reporter.startStep(`Verifying webelement ${leftpane["_i"]["collapse"]} in page`)
      let handle = await getElementHandleByXpath(leftpane["_i"]["collapse"])
      logger.info(handle.length)
      expect(handle).toBeTruthy()
      reporter.endStep()
      reporter.endStep()
    });
  });
});