import { defineFeature, loadFeature } from 'jest-cucumber';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig, closeModal, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, tableToObjects, matchByKey, waitForNetworkIdle, sortTable } from '../../utils/utils';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { getApi } from '../../utils/api_utils';
import { leftpane, dashboard, allInodes, serialNumbers, allNetworks, allServices, inodeDetails, pullSecrets, modals, volumes, networksTab, servicesTab, csp, allUsers, allRoles, onlineHelp, eventsTab, imagesTab, images, interfacesTab, events, apiKeys, sshKeys, downloadSoftware, downloadActivity, downloadEvents, manageAlerts, myProfile, clusters, clusterDetails, clusterNetworksTab, clusteriNodesTab } from '../constants/locators'
import { goToCluster } from '../helper/cluster';

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/navigateCluster.feature',
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
      await createPDF(global.testStart, 'navigation')
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
      await login.launch(global.env, global.scope)

      await (page
        .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
        .then(() => logger.info('Waiting In before ALL berfore proceeding')))

      await page.$x("//button[contains(@title, 'My Account')]", { visible: true })
      reporter = global.reporter
      await customScreenshot('beforeAll.png', 1920, 1200)
    }
    catch (err) {
      logger.error(err);
    }
  })


  test('Navigate to Clusters page', async ({
    given,
    when,
    and,
    then
  }) => {
    when('I navigate to Clusters page', async () => {
      reporter.startStep("When I navigate to Clusters page");
      let op = await page.waitForXPath(leftpane.li.clusters)
      let handle = await page.$x(leftpane.li.clusters)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(Object.values(propValue))
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          logger.info("submenu closed")
          let navigated = await navigatePageByClick(leftpane.li.clusters)
          expect(navigated).toBeTruthy()
          reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
          expect(navigated < 10.0).toBe(true)
          reporter.endStep()
        }
      } else {
        logger.error("Unable to get Clusters in left menu")
        expect(true).toBe(false)
      }
      //let navigated = await navigatePageByClick(leftpane.li.allInodes)
      //expect(navigated).toBeTruthy()
      //reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
      //expect(navigated < 10.0).toBe(true)
      //reporter.endStep()

      //reporter.startStep("Pagination - Scroll the inode list to the end")
      //let test = await getElementHandleByXpath(allInodes.div.scrollbar)
      //await autoScroll(test[0])
      //logger.info("scroll over")
      //reporter.endStep()
      //let screenshot = await customScreenshot('allInodes.png', 1920, 1200)
      //reporter.addAttachment("All inodes", screenshot, "image/png");
      reporter.endStep();
    });
    then('All required web elements must be present', async () => {
      reporter.startStep("Then All required web elements must be present");
      let node_list = await getApi("cluster", null, true)
      let total_count = node_list.total_count
      let tablerows = await getElementHandleByXpath(clusters.div.tableBodyRows)

      reporter.startStep(`Number of clusters rows ${tablerows.length} must match the api total cluster list ${total_count}`)
      if (tablerows.length == total_count) {
        logger.info("All clusters are listed correctly")
      } else {
        logger.error("Total count in cluster by api does not match in UI")
        expect(true).toBe(false)
      }
      reporter.endStep()

      for (let elem1 in clusters) {
        reporter.startStep(`Verifying ${elem1} webelements`)
        for (let elem2 in clusters[elem1]) {
          if (elem2.startsWith('_') != true) {
            reporter.startStep(`Verifying webelement ${elem2} in page`)
            let handle = await getElementHandleByXpath(clusters[elem1][elem2])
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

  test('Navigate to Clusters as a(n) <Role> User', async ({
    given,
    when,
    and,
    then
  }) => {

    //givenIamLoggedInAs(given)
    when('I navigate to cluster page', async () => {

      reporter.startStep("When I navigate to Clusters page");
      let op = await page.waitForXPath(leftpane.li.clusters)
      let handle = await page.$x(leftpane.li.clusters)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(Object.values(propValue))
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          logger.info("submenu closed")
          let navigated = await navigatePageByClick(leftpane.li.clusters)
          expect(navigated).toBeTruthy()
          reporter.startStep(`Navigation time is ${navigated} is less than 10s`)
          expect(navigated < 10.0).toBe(true)
          reporter.endStep()
        }
      } else {
        logger.error("Unable to get Clusters in left menu")
        expect(true).toBe(false)
      }


      reporter.startStep("When I navigate to cluster details page")
      let config = await getEnvConfig()
      await goToCluster(config.navigation.clusters.Name)

      let handle1 = await getElementHandleByXpath(clusterDetails.button.manageCluster)
      await handle1[0].click()
      await delay(2000)

      let screenshot = await customScreenshot('clusters.png', 1920, 1200)
      reporter.addAttachment("clusters", screenshot, "image/png");
      reporter.endStep()
    });
    then(/^All required web elements must be present depending on role "(.*)"$/, async (scope) => {
      reporter.startStep(`Then All required web elements must be present depending on role ${scope}`)
      for (let tag in clusterDetails) {
        if (tag.startsWith('_') == true) { continue }
        reporter.startStep(`Verifying ${tag} webelements`)
        for (let elem in clusterDetails[tag]) {
          if (elem.startsWith('_') == true) { continue }
          reporter.startStep(`Verifying webelement ${elem} in page`)
          let handle = await getElementHandleByXpath(clusterDetails[tag][elem])
          logger.info(handle.length)
          if (scope != 'orgAdmin' && clusterDetails._adminOnly.includes(elem) == true) {
            if (handle == false) {
              logger.info(`Element ${elem} not present in ${scope} user as expected`)
            } else {
              let value = await getPropertyValue(handle[0], 'disabled')
              expect(value).toBe(true)
              logger.info(`${elem} is disabled for ${scope} user as expected`)
            }
          } else {
            expect(handle).toBeTruthy()
            if (elem == 'manageCluster') {
              await handle[0].hover()
            }
          }
          reporter.endStep()
        }
        reporter.endStep()
      }
      reporter.endStep()
    });
  })

  test('Navigate Cluster inodes tab', async ({
    given,
    when,
    and,
    then
  }) => {
    when(/^I navigate to inodes tab of cluster$/, async () => {
      reporter.startStep("When I navigate to inodes tab of cluster");
      let config = await getEnvConfig()
      //var node
      //node = config.navigation.edge1.Name
      //await goToNode(node)
      await goToCluster(config.navigation.clusters.Name)
      let action = await performAction('click', clusterDetails.div.clusteriNodesTab)
      expect(action).toBeTruthy()
      let found = getElementHandleByXpath(clusteriNodesTab.a.expandAll)
      if (found != false) {
        await Promise.all([
          performAction('click', clusteriNodesTab.a.expandAll),
          waitForNetworkIdle(120000)
        ])
        await delay(3000)
      }
      reporter.endStep();
    });
    then('All inodes must be present', async () => {
      reporter.startStep("Then All inodes must be present");
      let screenshot = await customScreenshot('clusteriNodesTab.png', 1920, 1200)
      reporter.addAttachment("inodes tab", screenshot, "image/png");
      let tableHead = await getElementHandleByXpath(clusteriNodesTab.table.tableHeader)
      let tableBody = await getElementHandleByXpath(clusteriNodesTab.table.tableBody)
      let clusternodeTable = await tableToObjects(tableHead[0], tableBody[0])
      expect(clusternodeTable).toBeTruthy()
      logger.debug("Complete inode table", clusternodeTable)
      reporter.endStep()
    });
  });


  test('Navigate Cluster networks tab', async ({
    given,
    when,
    and,
    then
  }) => {
    when(/^I navigate to networks tab of cluster$/, async () => {
      reporter.startStep("When I navigate to networks tab of cluster");
      let config = await getEnvConfig()
      //var node
      //node = config.navigation.edge1.Name
      //await goToNode(node)
      await goToCluster(config.navigation.clusters.Name)
      let action = await performAction('click', clusterDetails.div.clusterNetworksTab)
      expect(action).toBeTruthy()
      let found = getElementHandleByXpath(clusterNetworksTab.a.expandAll)
      if (found != false) {
        await Promise.all([
          performAction('click', clusterNetworksTab.a.expandAll),
          waitForNetworkIdle(120000)
        ])
        await delay(3000)
      }
      reporter.endStep();
    });
    then('All networks must be present', async () => {
      reporter.startStep("Then All networks must be present");
      let screenshot = await customScreenshot('clusterNetworksTab.png', 1920, 1200)
      reporter.addAttachment("networks tab", screenshot, "image/png");
      let tableHead = await getElementHandleByXpath(clusterNetworksTab.table.clusterNetworksHead)
      let tableBody = await getElementHandleByXpath(clusterNetworksTab.table.clusterNetworksBody)
      let networkTable = await tableToObjects(tableHead[0], tableBody[0])
      expect(networkTable).toBeTruthy()
      logger.debug("Complete network table", networkTable)
      var config = await getEnvConfig()
      //Iterate all networks
      for (let network of config.navigation.clusters.cluster_e2e_networks) {
        reporter.startStep(`Verifying fields of network ${network.Name}`)
        logger.debug("Network defined in suite ", network)
        let foundNetwork = await matchByKey(networkTable, 'Name', network.Name)
        expect(foundNetwork).toBeTruthy()
        //Iterate parsed fields in a network
        for (let field of Object.keys(network)) {
          if (Object.keys(foundNetwork).includes(field)) {
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
      for (let item in clusterNetworksTab.button) {
        let present = getElementHandleByXpath(clusterNetworksTab.button[item])
        expect(present).toBeTruthy()
      }
      reporter.endStep()
    });
  });


});

