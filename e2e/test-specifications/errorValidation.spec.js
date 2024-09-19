import { defineFeature, loadFeature } from 'jest-cucumber';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { leftpane, myProfile, userChangePasswordModal, serialNumbers, inodeDetails, downloadEvents, downloadActivity, addNetwork, addOrg, addiNodeForm, addUserForm, addAlertForm, addCSPForm, csp, addSSHKeyForm, sshKeys, addRoleForm, allRoles, clusters, addClusterForm, addPullSecretsForm, pullSecrets, volumes, addVolumesForm, manageAlerts } from '../constants/locators';
import { goToOrg, addMyOrg, deleteOrg, addOrgError } from '../helper/org';
import { OrgAdd } from '../src/orgAdd';
import { UserAdd } from '../src/userAdd';
import { NodeAdd } from '../src/nodeAdd';
import { ChangePassword } from '../src/changePassword';
import { goToNode, addMyiNode, addiNodeError } from '../helper/node';
import { addMyUser, verifyUserEmail, changeUserPassword, addUserError } from '../helper/user';
import { createPDF, customScreenshot, delay, replaceEnvs, getEnvConfig, closeModal, navigatePageByClick, goTo, getPropertyValue, performAction, getElementHandleByXpath, getPropertyValueByXpath, getErrorValues} from '../../utils/utils';
import { givenIamLoggedIn, givenIamLoggedInAs } from './shared-steps';
import { NetworkAdd } from '../src/networkAdd';
import { addNetworkError, addTanNetwork, deleteAllNetworks } from '../helper/networks';
import { addService, deleteAllServices } from '../helper/services';
import { RoleAdd } from '../src/roleAdd';
import { addRoleError } from '../helper/role';
import { addSSHKey, addSSHKeyError } from '../helper/sshkey';
import { addSSHKeyFormConst } from '../constants/const';
import { addCluster, addClusterError } from '../helper/cluster';
import { ClusterAdd } from '../src/clusterAdd';
import { addPullSecret } from '../helper/pullsecrets';

var assert = require('assert');

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/errorValidation.feature', 
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
    await goTo(global.homeurl + '/home')
})

beforeEach(async () => {   
    logger.info("Before Each ");
    jest.setTimeout(1200000)
    logger.info(test.name)
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
      await login.launch(global.env, "Admin")

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

  test('"Add Network" page validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I navigate to 'Add Network' page$/, async(table) => {
      reporter.startStep("When I navigate to 'Add Network' page")
      var screenshot
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let config = await getEnvConfig()
        logger.info(config)
        let result = await goToOrg(config.orgName)
        expect(result).toBe(true)
        await goToNode(row.NodeName)
        await delay(2000)
        screenshot = await customScreenshot('iNodeDetails.png', 1920, 1200)
        reporter.addAttachment("iNode Details", screenshot, "image/png");
      }
      let navigated = await navigatePageByClick(inodeDetails.button._networksTab.add)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('addNetwork.png', 1920, 1200)
      reporter.addAttachment("Add Network", screenshot, "image/png");
      await delay(1000)
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        var cidr
        var ipAndLength
        var screenshot
        let valueErrorPairs = []
        reporter.startStep(`Validating ${row.FieldName}`)
        switch (row.FieldName) {
          case "Name":
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Network","Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              action = await performAction("type", addNetwork.input.name, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addNetwork._errors.name[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addNetwork._errors.name.closeCircleIcon, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          case "Label Key":
            handle = await getElementHandleByXpath(addNetwork.input.labelKey, page, {timeout : 1000})
            logger.info(handle)
            if (handle && handle.length == 0) {
              action = await performAction("click", addNetwork.button.label, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Network","Label Key")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addNetwork.input.labelKey, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addNetwork._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          case "Label Value":
            handle = await getElementHandleByXpath(addNetwork.input.labelValue, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addNetwork.button.label, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Network","Label Value")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addNetwork.input.labelValue, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addNetwork._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          case "Network CIDR":
            ipAndLength = row.Value.split("/")
            action = await performAction("type", addNetwork.input.networkCidrIP, "page", ipAndLength[0], true)
            expect(action).toBeTruthy()
            action = await performAction("type", addNetwork.input.networkCidrLength, "page", ipAndLength[1], true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addNetwork._errors.networkCidr[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            handle = await getElementHandleByXpath(addNetwork._errors.networkCidr.closeCircleIcon, page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          case "Reserved IP Range":
            cidr = row.OtherInfo.split(":")
            if (cidr[0] == 'Network CIDR') {
              ipAndLength = cidr[1].split('/')
              action = await performAction("type", addNetwork.input.networkCidrIP, "page", ipAndLength[0], true)
              expect(action).toBeTruthy()
              action = await performAction("type", addNetwork.input.networkCidrLength, "page", ipAndLength[1], true)
              expect(action).toBeTruthy()
            }
            let startAndEndIPs = row.Value.split(",")
            action = await performAction("type", addNetwork.input.startIP, "page", startAndEndIPs[0], true)
            expect(action).toBeTruthy()
            action = await performAction("type", addNetwork.input.endIP, "page", startAndEndIPs[1], true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addNetwork._errors.reservedIPRange[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            handle = await getElementHandleByXpath(addNetwork._errors.reservedIPRange.closeCircleIcon, page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          case "iNode IP Address":
            cidr = row.OtherInfo.split(":")
            if (cidr[0] === 'Network CIDR') {
              ipAndLength = cidr[1].split('/')
              action = await performAction("type", addNetwork.input.networkCidrIP, "page", ipAndLength[0], true)
              expect(action).toBeTruthy()
              action = await performAction("type", addNetwork.input.networkCidrLength, "page", ipAndLength[1], true)
              expect(action).toBeTruthy()
            }
            action = await performAction("type", addNetwork.input.iNodeIPAddress, "page", row.Value, true)
            expect(action).toBeTruthy()
            await delay(2000)
            handle = await getElementHandleByXpath(addNetwork._errors.iNodeIPAddress[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            handle = await getElementHandleByXpath(addNetwork._errors.iNodeIPAddress.closeCircleIcon, page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          case "VLAN ID":
            handle = await getElementHandleByXpath(addNetwork.input.vlanId, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addNetwork.span.vlanEnabled, "page")
              expect(action).toBeTruthy()
            }
            action = await performAction("type", addNetwork.input.vlanId, "page", row.Value, true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addNetwork._errors.vlanId[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            handle = await getElementHandleByXpath(addNetwork._errors.vlanId.closeCircleIcon, page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          case "Default Dest IP":
            cidr = row.OtherInfo.split(":")
            if (cidr[0] === 'Network CIDR') {
              ipAndLength = cidr[1].split('/')
              action = await performAction("type", addNetwork.input.networkCidrIP, "page", ipAndLength[0], true)
              expect(action).toBeTruthy()
              action = await performAction("type", addNetwork.input.networkCidrLength, "page", ipAndLength[1], true)
              expect(action).toBeTruthy()
            }
            handle = await getElementHandleByXpath(addNetwork.input.defaultDestinationViaIP, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addNetwork.i.defaultDesinationDown, "page")
              expect(action).toBeTruthy()
              action = await performAction("click", addNetwork.li.specifyIPAddress, "page")
              expect(action).toBeTruthy()
            }
            action = await performAction("type", addNetwork.input.defaultDestinationViaIP, "page", row.Value, true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addNetwork._errors.defaultDestination[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            handle = await getElementHandleByXpath(addNetwork._errors.defaultDestination.closeCircleIcon, page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          case "Dest Network CIDR":
            cidr = row.OtherInfo.split(":")
            if (cidr[0] === 'Network CIDR') {
              ipAndLength = cidr[1].split('/')
              action = await performAction("type", addNetwork.input.networkCidrIP, "page", ipAndLength[0], true)
              expect(action).toBeTruthy()
              action = await performAction("type", addNetwork.input.networkCidrLength, "page", ipAndLength[1], true)
              expect(action).toBeTruthy()
            }
            handle = await getElementHandleByXpath(addNetwork.button.addStaticRoute, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addNetwork.div.staticRoutes, "page")
              expect(action).toBeTruthy()
            }
            handle = await getElementHandleByXpath(addNetwork.input.staticRouteIP, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addNetwork.button.addStaticRoute, "page")
              expect(action).toBeTruthy()
            }
            ipAndLength = row.Value.split("/")
            action = await performAction("type", addNetwork.input.staticRouteIP, "page", ipAndLength[0], true)
            expect(action).toBeTruthy()
            action = await performAction("type", addNetwork.input.staticRouteLength, "page", ipAndLength[1], true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addNetwork._errors.staticRouteDestCIDR[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            //LAT-15039
            //handle = await getElementHandleByXpath(addNetwork._errors.staticRouteDestCIDR.closeCircleIcon, page, {timeout : 1000})
            //expect(handle && handle.length > 0).toBe(true)
            break
          case "Via":
            cidr = row.OtherInfo.split(":")
            if (cidr[0] === 'Network CIDR') {
              ipAndLength = cidr[1].split('/')
              action = await performAction("type", addNetwork.input.networkCidrIP, "page", ipAndLength[0], true)
              expect(action).toBeTruthy()
              action = await performAction("type", addNetwork.input.networkCidrLength, "page", ipAndLength[1], true)
              expect(action).toBeTruthy()
            }
            handle = await getElementHandleByXpath(addNetwork.div.staticRoutesExpanded, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addNetwork.div.staticRoutes, "page")
              expect(action).toBeTruthy()
            }
            handle = await getElementHandleByXpath(addNetwork.input.staticRouteIP, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addNetwork.button.addStaticRoute, "page")
              expect(action).toBeTruthy()
            }
            handle = await getElementHandleByXpath(addNetwork.input.staticRouteViaIP, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addNetwork.i.staticRouteViaDown, "page")
              expect(action).toBeTruthy()
              action = await performAction("click", addNetwork.li.specifyIPAddress, "page")
              expect(action).toBeTruthy()
            }
            action = await performAction("type", addNetwork.input.staticRouteViaIP, "page", row.Value, true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addNetwork._errors.staticRouteVia[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            handle = await getElementHandleByXpath(addNetwork._errors.staticRouteVia.closeCircleIcon, page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          default:
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
        }
        let screenshot1 = await customScreenshot(`${row.FieldName}.png`, 1920, 1200)
        reporter.addAttachment(`${row.FieldName}`, screenshot1, "image/png");  
        reporter.endStep()
      }
      let status = await performAction("click", leftpane.li.orgs)
      expect(status).toBeTruthy()
      reporter.endStep()
    });
  });

  test('"Add Org" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add Org' modal$/, async() => {
      reporter.startStep("When I open 'Add Org' modal")
      let navigated = await navigatePageByClick(leftpane.button.add)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('add.png', 1920, 1200)
      reporter.addAttachment("Add", screenshot, "image/png");
      await delay(1000)

      navigated = await navigatePageByClick(leftpane.button.addOrg)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('addOrg.png', 1920, 1200)
      reporter.addAttachment("Add Org", screenshot, "image/png");
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var screenshotOrg
        var action
        var handle
        var valueErrorPairs = []
        switch (row.FieldName) {
          case "Organization Name":
            reporter.startStep("Organization Name Errors")
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Org","Organization Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addOrg.input.name, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addOrg._errors.orgName[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addOrg._errors.i.closeCircle, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            screenshotOrg = await customScreenshot('orgName.png', 1920, 1200)
            reporter.addAttachment("Organization Name", screenshotOrg, "image/png");
            reporter.endStep()
            break
          case "Billing Name":
            reporter.startStep("Billing Name Errors")
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Org","Billing Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              action = await performAction("type", addOrg.input.billing_name, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addOrg._errors.billingName[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addOrg._errors.i.closeCircle, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            screenshotOrg = await customScreenshot('billingName.png', 1920, 1200)
            reporter.addAttachment("Billing Name", screenshotOrg, "image/png");
            reporter.endStep()
            break
          case "Billing Email":
            reporter.startStep("Billing Email errors")
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Org","Billing Email")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              action = await performAction("type", addOrg.input.billing_email, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addOrg._errors.billingEmail[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addOrg._errors.i.closeCircle, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            screenshotOrg = await customScreenshot('biilingEmail.png', 1920, 1200)
            reporter.addAttachment("Billing Email", screenshotOrg, "image/png");
            reporter.endStep()
            break
          case "Domain Name":
          reporter.startStep("Domain Name Errors")
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Org","Domain Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              action = await performAction("type", addOrg.input.domain_name, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addOrg._errors.domainName[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addOrg._errors.i.closeCircle, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            screenshotOrg = await customScreenshot('domain name.png', 1920, 1200)
            reporter.addAttachment("DomainName", screenshotOrg, "image/png");
            reporter.endStep()
            break
          default:
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
        }
      }
      reporter.endStep()
    });
  });
  
  test('"Add iNode" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add iNode' modal$/, async() => {
      reporter.startStep("When I open 'Add iNode' modal")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let navigated = await navigatePageByClick(leftpane.button.add)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('add.png', 1920, 1200)
      reporter.addAttachment("Add", screenshot, "image/png");
      await delay(1000)

      navigated = await navigatePageByClick(leftpane.button.addInode)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('addInode.png', 1920, 1200)
      reporter.addAttachment("Add iNode", screenshot, "image/png");
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "iNode Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add iNode","iNode Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addiNodeForm.input.name, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addiNodeForm._errors.iNodeName[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addiNodeForm._errors.iNodeName.closeCircleIcon, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Label Key": {
            handle = await getElementHandleByXpath(addiNodeForm.input.labelKey, page, {timeout : 1000})
            logger.info(handle)
            if (handle && handle.length == 0) {
              action = await performAction("click", addiNodeForm.button.label, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add iNode","Label Key")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addiNodeForm.input.labelKey, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addiNodeForm._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Label Value": {
            handle = await getElementHandleByXpath(addiNodeForm.input.labelValue, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addiNodeForm.button.label, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add iNode","Label Value")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addiNodeForm.input.labelValue, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addiNodeForm._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Serial Number": {
            action = await performAction("click", addiNodeForm.div.profile)
            expect(action).toBeTruthy()
            action = await performAction("click", "//li[contains(@class,'ant-select-dropdown-menu-item')][text()='Edge']")
            expect(action).toBeTruthy()
            action = await performAction("click", addiNodeForm.div.serialNumber)
            expect(action).toBeTruthy()
            action = await performAction("type", addiNodeForm.div.serialNumber, page, row.Value)
            expect(action).toBeTruthy()
            await delay(10000)
            handle = await getElementHandleByXpath(addiNodeForm._errors.serialNumber[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          case "SSH Key": {
            action = await performAction("click", addiNodeForm.div.sshKey)
            expect(action).toBeTruthy()
            action = await performAction("type", addiNodeForm.div.sshKey, page, row.Value)
            expect(action).toBeTruthy()
            await delay(10000)
            handle = await getElementHandleByXpath(addiNodeForm._errors.sshKey[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });

  test('"Add User" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add User' modal$/, async() => {
      reporter.startStep("When I open 'Add User' modal")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let navigated = await navigatePageByClick(leftpane.button.add)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('add.png', 1920, 1200)
      reporter.addAttachment("Add", screenshot, "image/png");
      await delay(1000)

      navigated = await navigatePageByClick(leftpane.button.addUser)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('addUser.png', 1920, 1200)
      reporter.addAttachment("Add User", screenshot, "image/png");
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        var screenshot
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "Full Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add User","Full Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addUserForm.input.name, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addUserForm._errors.name[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addUserForm._errors.name.closeCircleIcon, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Email Address": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add User","Email Address")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addUserForm.input.email, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addUserForm._errors.emailAddress[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addUserForm._errors.emailAddress.closeCircleIcon, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Password": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add User","Password")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              logger.info(addUserForm._errors.password[valueErrorPairs[j]["error"]])
              action = await performAction("type", addUserForm.input.password, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addUserForm._errors.password[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Confirm Password": {
            action = await performAction("type", addUserForm.input.password, "page", row.Value)
            expect(action).toBeTruthy()
            action = await performAction("type", addUserForm.input.confirm_password, "page", row.Value+"abc")
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addUserForm._errors.confirmPassword[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          case "Role": {
            action = await performAction("click", addUserForm.div.role)
            expect(action).toBeTruthy()
            action = await performAction("type", addUserForm.div.role, "page", row.Value, true)
            expect(action).toBeTruthy()
            await delay(10000)
            screenshot = await customScreenshot('role.png', 1920, 1200)
            reporter.addAttachment("role", screenshot, "image/png");
            handle = await getElementHandleByXpath(addUserForm._errors.role[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          case "Time Zone": {
            action = await performAction("click", addUserForm.div.timezone)
            expect(action).toBeTruthy()
            action = await performAction("type", addUserForm.div.timezone, "page", row.Value)
            expect(action).toBeTruthy()
            await delay(10000)
            screenshot = await customScreenshot('timezone.png', 1920, 1200)
            reporter.addAttachment("timezone", screenshot, "image/png");
            handle = await getElementHandleByXpath(addUserForm._errors.timezone[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });

  test('User Email Address Unique Constraint', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I create an user with any existing user email address$/, async() => {
      reporter.startStep("When I create an user with any existing user email address")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let navigated = await navigatePageByClick(leftpane.button.add)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('add.png', 1920, 1200)
      reporter.addAttachment("Add", screenshot, "image/png");
      await delay(1000)

      navigated = await navigatePageByClick(leftpane.button.addUser)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('addUser.png', 1920, 1200)
      reporter.addAttachment("Add User", screenshot, "image/png");
      reporter.endStep()
    });
    then(/^I expect unique email address error$/, async (table) => {
      reporter.startStep("Then I expect unique email address error")
      let config = await getEnvConfig()
      logger.info(config)
      let user = new UserAdd()
      user.setUserAdd("My Name", config.iotiumAdmin, config.iotiumAdminPassword, config.iotiumAdminPassword, "Read Only")
      let result = await addUserError(user,"The given user id "+config.iotiumAdmin+" is already exists.")
      expect(result).toBe(true)
      reporter.endStep()
    });
  });

  test('Org Billing Email Address Unique Constraint', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I create an org with any existing org billing email address$/, async() => {
      reporter.startStep("When I create an org with any existing org billing email address")
      let navigated = await navigatePageByClick(leftpane.button.add)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('add.png', 1920, 1200)
      reporter.addAttachment("Add", screenshot, "image/png");
      await delay(1000)

      navigated = await navigatePageByClick(leftpane.button.addOrg)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('addOrg.png', 1920, 1200)
      reporter.addAttachment("Add Org", screenshot, "image/png");
      reporter.endStep()
    });
    then(/^I expect unique billing email address error$/, async (table) => {
      reporter.startStep("Then I expect unique billing email address error")
      let config = await getEnvConfig()
      logger.info(config)
      let org = new OrgAdd()
      org.setOrgAdd("My Org", "My Name", config.iotiumAdmin)
      let result = await addOrgError(org,"The org billing email "+config.iotiumAdmin+" already exists.")
      expect(result).toBe(true)
      reporter.endStep()
    });
  });

  test('iNode name Unique Constraint', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I create an iNode with any existing iNode name$/, async() => {
      reporter.startStep("When I create an iNode with any existing iNode name")
      let config = await getEnvConfig()
      logger.info(config)
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      await delay(2000)
      let navigated = await navigatePageByClick(leftpane.button.add)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('add.png', 1920, 1200)
      reporter.addAttachment("Add", screenshot, "image/png");
      await delay(1000)

      navigated = await navigatePageByClick(leftpane.button.addInode)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('addNode.png', 1920, 1200)
      reporter.addAttachment("Add iNode", screenshot, "image/png");
      reporter.endStep()
    });
    then(/^I expect unique iNode name error$/, async (table) => {
      reporter.startStep("Then I expect unique iNode name error")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let nodeObj = new NodeAdd()
        nodeObj.setNodeAdd(row.NodeName, "", row.Profile, "", "","aws")
        let result = await addiNodeError(nodeObj,"Node name already exist")
        expect(result).toBe(true)
      }
      reporter.endStep()
    });
  });

  test('Network name Unique Constraint', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I create a network with any existing network name$/, async(table) => {
      reporter.startStep("When I create a network with any existing network name")
      let config = await getEnvConfig()
      logger.info(config)
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let result = await goToOrg(config.orgName)
        expect(result).toBe(true)
        await delay(2000)
        await goToNode(row.NodeName)
        await delay(5000)
        let navigated = await navigatePageByClick(inodeDetails.button._networksTab.add)
        expect(navigated).toBeTruthy()
        let screenshot = await customScreenshot('addNetwork.png', 1920, 1200)
        reporter.addAttachment("Add Network", screenshot, "image/png");
        await delay(1000)
      }
      reporter.endStep()
    });
    then(/^I expect unique network name error$/, async (table) => {
      reporter.startStep("Then I expect unique network name error")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let networkObj = new NetworkAdd()
        networkObj.setNetworkAdd(row.NetworkName,"","Static","10.0.0.0/16","10.0.0.1","10.0.0.10","10.0.0.1")
        let result = await addNetworkError(networkObj,"Network name must be unique across the Node")
        expect(result).toBe(true)
      }
      reporter.endStep()
    });
  });   
  
  test('Service name Unique Constraint', async ({
    given,
    when,
    and,
    then
  }) => {
    var serviceInfo
    givenIamLoggedIn(given)
    when(/^I create a service with any existing service name$/, async(table) => {
      reporter.startStep("When I create a service with any existing service name")
      let config = await getEnvConfig()
      logger.info(config)
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        serviceInfo = row
        let result = await goToOrg(config.orgName)
        expect(result).toBe(true)
        await delay(2000)
        await goToNode(row.NodeName)
        await delay(2000)
        let networkObj = new NetworkAdd()
        networkObj.setNetworkAdd(row.NetworkName,"a:a","Static",row.CIDR,row.StartIP,row.EndIP)
        await addTanNetwork(networkObj)
        result = await addService(row.ServiceName,row.AppName,row.NetworkName)
        expect(result).toBe(true)
      }
      reporter.endStep()
    });
    then(/^I expect unique service name error$/, async () => {
      reporter.startStep("Then I expect unique service name error")
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      let result = await addService(serviceInfo.ServiceName,serviceInfo.AppName,serviceInfo.NetworkName,{},"Service name must be unique across the Node.")
      expect(result).toBe(true)
      await deleteAllServices()
      await deleteAllNetworks()
      reporter.endStep()
    });
  });


  test('"Add Custom Security Policy" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add Custom Security Policy' modal$/, async() => {
      reporter.startStep("When I open 'Add Custom Security Policy' modal")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let navigated = await navigatePageByClick(leftpane.li.networks)
      expect(navigated).toBeTruthy()
      let screenshot = await customScreenshot('add.png', 1920, 1200)
      reporter.addAttachment("Add", screenshot, "image/png");
      await delay(1000)

      navigated = await navigatePageByClick(leftpane.li.customSecurityPolicy)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('CSP.png', 1920, 1200)
      reporter.addAttachment("CSP", screenshot, "image/png");

      navigated = await navigatePageByClick(csp.button.addCustomSecurityPolicy)
      expect(navigated).toBeTruthy()
      screenshot = await customScreenshot('addCSP.png', 1920, 1200)
      reporter.addAttachment("Add CSP", screenshot, "image/png");
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Custom Security Policy","Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addCSPForm.input.name, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addCSPForm._errors.name[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addCSPForm._errors.name.closeCircleIcon, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Label Key": {
            handle = await getElementHandleByXpath(addCSPForm.input.labelKey, page, {timeout : 1000})
            logger.info(handle)
            if (handle && handle.length == 0) {
              action = await performAction("click", addCSPForm.button.label, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Custom Security Policy","Label Key")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addCSPForm.input.labelKey, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addCSPForm._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Label Value": {
            handle = await getElementHandleByXpath(addCSPForm.input.labelValue, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addCSPForm.button.label, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Custom Security Policy","Label Value")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addCSPForm.input.labelValue, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addCSPForm._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Priority": {
            action = await performAction("type", addCSPForm.input.priority, page, row.Value, true)
            expect(action).toBeTruthy()
            await delay(10000)
            handle = await getElementHandleByXpath(addCSPForm._errors.priority[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          case "Source Port": {
            handle = await getElementHandleByXpath(addCSPForm.li.protocol.tcp, page, {timeout : 1000})
            if (!(handle && handle.length > 0)) {
              action = await performAction("click", addCSPForm.div.protocol)
              expect(action).toBeTruthy()
              action = await performAction("click", addCSPForm.li.protocol.tcp)
              expect(action).toBeTruthy()
            }
            action = await performAction("type", addCSPForm.input.sourcePort, page, row.Value, true)
            expect(action).toBeTruthy()
            await delay(10000)
            handle = await getElementHandleByXpath(addCSPForm._errors.sourcePort[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          case "Destination Port": {
            handle = await getElementHandleByXpath(addCSPForm.li.protocol.tcp, page, {timeout : 1000})
            if (!(handle && handle.length > 0)) {
              action = await performAction("click", addCSPForm.div.protocol)
              expect(action).toBeTruthy()
              action = await performAction("click", addCSPForm.li.protocol.tcp)
              expect(action).toBeTruthy()
            }
            action = await performAction("type", addCSPForm.input.destinationPort, page, row.Value,true)
            expect(action).toBeTruthy()
            await delay(10000)
            handle = await getElementHandleByXpath(addCSPForm._errors.destinationPort[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          case "Source CIDR": {
            action = await performAction("type", addCSPForm.input.sourceCIDR, page, row.Value, true)
            expect(action).toBeTruthy()
            await delay(10000)
            handle = await getElementHandleByXpath(addCSPForm._errors.sourceCIDR[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          case "Destination CIDR": {
            action = await performAction("type", addCSPForm.input.destinationCIDR, page, row.Value, true)
            expect(action).toBeTruthy()
            await delay(10000)
            handle = await getElementHandleByXpath(addCSPForm._errors.destinationCIDR[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });

  test('"Add Serial" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add Serial' modal$/, async() => {
      reporter.startStep("When I open 'Add Serial' modal")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let op = await page.waitForXPath(leftpane.li.inodes)
      let handle = await page.$x(leftpane.li.inodes)
      logger.info(handle.length)
      if (handle.length > 0){
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

      handle = await getElementHandleByXpath(serialNumbers.textarea.serialNumbers, page, {timeout : 100})
      logger.info(handle)
      if (handle && handle.length == 0) {
        let navigated = await navigatePageByClick(leftpane.li.serialNumbers)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(serialNumbers.button.add)
        expect(navigated).toBeTruthy()
      }
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "Serial Number": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Serial","Serial Number")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", serialNumbers.textarea.serialNumbers , "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(serialNumbers._errors.serialNumber[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(serialNumbers._errors.serialNumber.closeCircleIcon, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });

  test('"Add SSH Key" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add SSH Key' modal$/, async() => {
      reporter.startStep("When I open 'Add SSH Key' modal")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let op = await page.waitForXPath(leftpane.li.inodes)
      let handle = await page.$x(leftpane.li.inodes)
      logger.info(handle.length)
      if (handle.length > 0){
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

      handle = await getElementHandleByXpath(addSSHKeyForm.textarea.sshKeyName, page, {timeout : 100})
      logger.info(handle)
      if (handle && handle.length == 0) {
        let navigated = await navigatePageByClick(leftpane.li.sshKeys)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(sshKeys.button.addSSHKey)
        expect(navigated).toBeTruthy()
      }
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "SSH Key Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add SSH Key","SSH Key Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addSSHKeyForm.textarea.sshKeyName , "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addSSHKeyForm._errors.sshKeyName[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addSSHKeyForm._errors.sshKeyName.closeCircleIcon, page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "SSH Public Key": {
            if (row.Value == "") {
              action = await performAction("type", addSSHKeyForm.textarea.sshPublicKey , "page", "test", true)  
            }
            action = await performAction("type", addSSHKeyForm.textarea.sshPublicKey , "page", row.Value, true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addSSHKeyForm._errors.sshPublicKey[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });
  
  test('"Add Role" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add Role' modal$/, async() => {
      reporter.startStep("When I open 'Add Role' modal")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let op = await page.waitForXPath(leftpane.li.users)
      let handle = await page.$x(leftpane.li.users)
      logger.info(handle.length)
      if (handle.length > 0){
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.users)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get Users in left menu")
        expect(true).toBe(false)
      }

      handle = await getElementHandleByXpath(addRoleForm.input.roleName, page, {timeout : 100})
      logger.info(handle)
      if (handle && handle.length == 0) {
        let navigated = await navigatePageByClick(leftpane.li.allRoles)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(allRoles.button.addRole)
        expect(navigated).toBeTruthy()
      }
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "Role Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Role","Role Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addRoleForm.input.roleName , "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addRoleForm._errors.roleName[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Description": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Role","Description")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addRoleForm.input.description , "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addRoleForm._errors.description[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Permissions": {         
            action = await performAction("click", addRoleForm.div.permissions)
            expect(action).toBeTruthy()
            action = await performAction("type", addRoleForm.div.permissions , "page", row.Value)
            expect(action).toBeTruthy()
            await delay(10000)
            let screenshot = await customScreenshot('perm.png', 1920, 1200)
            reporter.addAttachment("perm", screenshot, "image/png");
            handle = await getElementHandleByXpath(addRoleForm._errors.permissions[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });
  
  test('"Add Cluster" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add Cluster' modal$/, async() => {
      reporter.startStep("When I open 'Add Cluster' modal")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let navigated = await navigatePageByClick(leftpane.li.clusters)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(clusters.button.addCluster)
      expect(navigated).toBeTruthy()
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "Cluster Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Cluster","Cluster Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addClusterForm.input.clusterName , "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addClusterForm._errors.clusterName[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Label Key": {
            handle = await getElementHandleByXpath(addClusterForm.input.labelKey, page, {timeout : 1000})
            logger.info(handle)
            if (handle && handle.length == 0) {
              action = await performAction("click", addClusterForm.button.label, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Cluster","Label Key")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addClusterForm.input.labelKey, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addClusterForm._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Label Value": {
            handle = await getElementHandleByXpath(addClusterForm.input.labelValue, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addClusterForm.button.label, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Cluster","Label Value")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addClusterForm.input.labelValue, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addClusterForm._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "iNode Name": { 
            handle = await getElementHandleByXpath(addClusterForm.input.selectInode, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addClusterForm.button.addiNode, "page")
              expect(action).toBeTruthy()
            }
                    
            action = await performAction("click", addClusterForm.input.selectInode)
            expect(action).toBeTruthy()
            
            action = await performAction("type", addClusterForm.input.selectInode , "page", row.Value)
            expect(action).toBeTruthy()
            await delay(5000)
            let screenshot = await customScreenshot('cluster.png', 1920, 1200)
            reporter.addAttachment("cluster Details", screenshot, "image/png");
            handle = await getElementHandleByXpath(addClusterForm._errors.selectInode[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });
  
  test('Role Name Unique Constraint', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I create a role with any existing role name$/, async() => {
      reporter.startStep("When I create a role with any existing role name")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let op = await page.waitForXPath(leftpane.li.users)
      let handle = await page.$x(leftpane.li.users)
      logger.info(handle.length)
      if (handle.length > 0){
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.users)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get Users in left menu")
        expect(true).toBe(false)
      }

      handle = await getElementHandleByXpath(addRoleForm.input.roleName, page, {timeout : 100})
      logger.info(handle)
      if (handle && handle.length == 0) {
        let navigated = await navigatePageByClick(leftpane.li.allRoles)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(allRoles.button.addRole)
        expect(navigated).toBeTruthy()
      }
      reporter.endStep()
    });
    then(/^I expect unique role name error$/, async (table) => {
      reporter.startStep("Then I expect unique role name error")
      let config = await getEnvConfig()
      logger.info(config)
      let role = new RoleAdd()
      role.setRoleAdd("Admin", "Error Validation Role", ["USER:READ"])
      let result = await addRoleError(role,"The given  name Admin is already exists.")
      expect(result).toBe(true)
      reporter.endStep()
    });
  });

  test('SSH Key Name Unique Constraint', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I create an SSH Key with any existing SSH Key name$/, async(table) => {
      reporter.startStep("When I create an SSH Key with any existing SSH Key name")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let op = await page.waitForXPath(leftpane.li.inodes)
        let handle = await page.$x(leftpane.li.inodes)
        logger.info(handle.length)
        if (handle.length > 0){
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

        let navigated = await navigatePageByClick(leftpane.li.sshKeys)
        expect(navigated).toBeTruthy()
        handle = await getElementHandleByXpath("//span[@title='Key Name']//ancestor::div[@class='ant-table-scroll']//tbody[@class='ant-table-tbody']//td//div[text()='"+row.SSHKeyName+"']", page, {timeout : 100})
        logger.info(handle)
        if (handle && handle.length == 0) {
          logger.info("SSH Key doesn't exist already")
          await addSSHKey(row.SSHKeyName,addSSHKeyFormConst.sampleSSHPublicKey,false)
        }
        handle = await getElementHandleByXpath(addSSHKeyForm.textarea.sshKeyName, page, {timeout : 100})
        logger.info(handle)
        if (handle && handle.length == 0) {
          navigated = await navigatePageByClick(sshKeys.button.addSSHKey)
          expect(navigated).toBeTruthy()
        }
      }
      reporter.endStep()
    });
    then(/^I expect unique SSH key name error$/, async (table) => {
      reporter.startStep("Then I expect unique SSH key name error")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let result = await addSSHKeyError(row.SSHKeyName,addSSHKeyFormConst.sampleSSHPublicKey,'SSH key name is already in use.')
        expect(result).toBe(true)
      }
      reporter.endStep()
    });
  });
  
  test('Cluster Name Unique Constraint', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I create a cluster with any existing cluster name$/, async(table) => {
      reporter.startStep("When I create a cluster with any existing cluster name")
      let config = await getEnvConfig()
      logger.info(config)
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let navigated = await navigatePageByClick(leftpane.li.clusters)
        expect(navigated).toBeTruthy()

        let handle = await getElementHandleByXpath("//span[@title='Name  ']//ancestor::div[@class='ant-table-scroll']//tbody[@class='ant-table-tbody']//td//a[text()='"+row.ClusterName+"']", page, {timeout : 100})
        logger.info(handle)
        if (handle && handle.length == 0) {
          logger.info("Cluster name doesn't exist already")
          navigated = await navigatePageByClick(clusters.button.addCluster)
          expect(navigated).toBeTruthy()
          let cluster = new ClusterAdd()
          cluster.setClusterAdd(row.ClusterName)
          result = await addCluster(cluster)
          expect(result).toBe(true)
          await delay(5000)
        }

        navigated = await navigatePageByClick(clusters.button.addCluster)
        expect(navigated).toBeTruthy()
      }
      reporter.endStep()
    });
    then(/^I expect unique cluster name error$/, async (table) => {
      reporter.startStep("Then I expect unique cluster name error")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let cluster = new ClusterAdd()
        cluster.setClusterAdd(row.ClusterName)
        let result = await addClusterError(cluster,'The cluster name already exists. The cluster name must be unique across the organization.')
        expect(result).toBe(true)
      }
      reporter.endStep()
    });
  });

  test('"Add Pull Secret" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add Pull Secret' modal$/, async() => {
      reporter.startStep("When I open 'Add Pull Secret' modal")
      let config = await getEnvConfig()
      logger.info(config)
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let handle = await page.$x(leftpane.li.services)
      logger.info(handle.length)
      if (handle.length > 0){
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.services)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get service secrets in left menu")
        expect(true).toBe(false)
      }

      let navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(pullSecrets.button.addPullSecret)
      expect(navigated).toBeTruthy()
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "Pull Secret Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Pull Secret","Pull Secret Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addPullSecretsForm.input.pullSecretName , "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addPullSecretsForm._errors.pullSecretName[valueErrorPairs[j]["error"]], "page", {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addPullSecretsForm._errors.pullSecretName.closeCircleIcon, "page", {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "Docker Config": {
            if (row.Value == "") {
              action = await performAction("type", addPullSecretsForm.textarea.dockerConfig , "page", "test", true)  
            }
            action = await performAction("type", addPullSecretsForm.textarea.dockerConfig , "page", row.Value, true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addPullSecretsForm._errors.dockerConfig[row.Error], "page", {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });

  test('"Add Volume" modal validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add Volume' modal$/, async() => {
      reporter.startStep("When I open 'Add Volume' modal")
      let config = await getEnvConfig()
      logger.info(config)
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let handle = await page.$x(leftpane.li.services)
      logger.info(handle.length)
      if (handle.length > 0){
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          let navigated = await navigatePageByClick(leftpane.li.services)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get service secrets in left menu")
        expect(true).toBe(false)
      }

      let navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(volumes.tab.volumes)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(volumes.button.addVolume)
      expect(navigated).toBeTruthy()
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "Volume Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Volume","Volume Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addVolumesForm.input.volumeName , "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addVolumesForm._errors.volumeName[valueErrorPairs[j]["error"]], "page", {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "File Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Volume","File Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              handle = await getElementHandleByXpath(addVolumesForm.input.fileName, page, {timeout : 100})
              if (handle && handle.length == 0) {
                action = await performAction("click", addVolumesForm.button.addFile)
                expect(action).toBeTruthy()
              }
              action = await performAction("type", addVolumesForm.input.fileName , "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addVolumesForm._errors.fileName[valueErrorPairs[j]["error"]], "page", {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              handle = await getElementHandleByXpath(addVolumesForm._errors.fileName.closeCircleIcon, "page", {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
            }
            break
          }
          case "File Contents": {
            handle = await getElementHandleByXpath(addVolumesForm.input.fileName, page, {timeout : 100})
            if (handle && handle.length == 0) {
              action = await performAction("click", addVolumesForm.button.addFile)
              expect(action).toBeTruthy()
            }
            handle = await getElementHandleByXpath(addVolumesForm.checkbox.showFileContentChecked, page, {timeout : 100})
            if (handle && handle.length == 0) {   
              action = await performAction("click", addVolumesForm.checkbox.showFileContent)
              expect(action).toBeTruthy()
            }
            if (row.Value == "") {
              action = await performAction("type", addVolumesForm.textarea.fileContent , "page", "test", true)  
            }
            action = await performAction("type", addVolumesForm.textarea.fileContent , "page", row.Value, true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addVolumesForm._errors.fileContents[row.Error], "page", {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });

  
  test('"Add Alert" form validation', async ({
    given,
    when,
    and,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I open 'Add Alert' form$/, async() => {
      reporter.startStep("When I open 'Add Alert' form")
      let config = await getEnvConfig()
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      let navigated = await navigatePageByClick(leftpane.button.myAccount)
      expect(navigated).toBeTruthy()
      let found = await getElementHandleByXpath(leftpane.li.manageAlerts)
      await found[0].hover()
      navigated = await navigatePageByClick(leftpane.li.manageAlerts)
      expect(navigated).toBeTruthy()
      //Click 'Add alert' button
      navigated = await navigatePageByClick(manageAlerts.button.addAlert)
      expect(navigated).toBeTruthy()
      reporter.endStep()
    });
    then(/^I expect proper error for incorrect value$/, async (table) => {
      reporter.startStep("Then I expect proper error for incorrect value")
      var screenshot;
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action
        var handle
        let valueErrorPairs = []
        switch (row.FieldName) {
          case "Alert Name": {
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Alert","Alert Name")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addAlertForm.input.alertName , "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addAlertForm._errors.alertName[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              if (j == 0) {
                screenshot = await customScreenshot('alertname.png', 1920, 1200)
                reporter.addAttachment("alert name", screenshot, "image/png");
              }
            }
            break
          }
          case "Label Key": {
            handle = await getElementHandleByXpath(addAlertForm.input.labelKey, page, {timeout : 1000})
            logger.info(handle)
            if (handle && handle.length == 0) {
              action = await performAction("click", addAlertForm.button.newLabel, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Alert","Label Key")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            logger.info(valueErrorPairs)
            logger.info(valueErrorPairs.length)
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addAlertForm.input.labelKey, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addAlertForm._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              if (j == 0) {
                screenshot = await customScreenshot('alertname.png', 1920, 1200)
                reporter.addAttachment("alert name", screenshot, "image/png");
              }
            }
            break
          }
          case "Label Value": {
            handle = await getElementHandleByXpath(addAlertForm.input.labelValue, page, {timeout : 1000})
            if (handle && handle.length == 0) {
              action = await performAction("click", addAlertForm.button.newLabel, "page")
              expect(action).toBeTruthy()
            }
            if (row.Value == '__POSSIBLE_ERROR_CASES') {
              valueErrorPairs = await getErrorValues("Add Alert","Label Value")
              expect(valueErrorPairs.length == 0).toBe(false)
            } else {
              var temp = {}
              temp["value"] = row.Value
              temp["error"] = row.Error
              valueErrorPairs.push(temp)
            }
            for (let j = 0; j < valueErrorPairs.length; j++) {
              logger.info(valueErrorPairs[j]["value"])
              logger.info(valueErrorPairs[j]["error"])
              action = await performAction("type", addAlertForm.input.labelValue, "page", valueErrorPairs[j]["value"], true)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(addAlertForm._errors.label[valueErrorPairs[j]["error"]], page, {timeout : 1000})
              expect(handle && handle.length > 0).toBe(true)
              if (j == 0) {
                screenshot = await customScreenshot('alertname.png', 1920, 1200)
                reporter.addAttachment("alert name", screenshot, "image/png");
              }
            }
            break
          }
          case "For Minutes": {
            logger.info(row.Value)
            logger.info(row.Error)
            handle = await getElementHandleByXpath(addAlertForm.input.for, page, {timeout : 100})
            if (handle && handle.length == 0) {
              let otherInfo = row.OtherInfo.split(":")
              if (otherInfo.length > 0 && otherInfo[0] == "AlertName") {
                action = await performAction("type", addAlertForm.input.alertName , "page", otherInfo[1], true)
                expect(action).toBeTruthy()
                action = await performAction("click", addAlertForm.button.next)
                expect(action).toBeTruthy()
              }
            }
            handle = await getElementHandleByXpath(addAlertForm.div.minutesSelected, page, {timeout : 100})
            if (handle && handle.length == 0) {   
              action = await performAction("click", addAlertForm.div.durationUnit)
              expect(action).toBeTruthy()
              action = await performAction("click", addAlertForm.li.minutes)
              expect(action).toBeTruthy()
            }
            action = await performAction("type", addAlertForm.input.for , "page", row.Value, true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addAlertForm._errors.for[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            screenshot = await customScreenshot('alertname.png', 1920, 1200)
            reporter.addAttachment("alert name", screenshot, "image/png");
            break
          }
          case "For Hours": {
            logger.info(row.Value)
            logger.info(row.Error)
            handle = await getElementHandleByXpath(addAlertForm.input.for, page, {timeout : 100})
            if (handle && handle.length == 0) {
              let otherInfo = row.OtherInfo.split(":")
              if (otherInfo.length > 0 && otherInfo[0] == "AlertName") {
                action = await performAction("type", addAlertForm.input.alertName , "page", otherInfo[1], true)
                expect(action).toBeTruthy()
                action = await performAction("click", addAlertForm.button.next)
                expect(action).toBeTruthy()
              }
            }
            handle = await getElementHandleByXpath(addAlertForm.div.hoursSelected, page, {timeout : 100})
            if (handle && handle.length == 0) {   
              action = await performAction("click", addAlertForm.div.durationUnit)
              expect(action).toBeTruthy()
              action = await performAction("click", addAlertForm.li.hours)
              expect(action).toBeTruthy()
            }
            action = await performAction("type", addAlertForm.input.for , "page", row.Value, true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addAlertForm._errors.for[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            screenshot = await customScreenshot('alertname.png', 1920, 1200)
            reporter.addAttachment("alert name", screenshot, "image/png");
            break
          }
          case "For Days": {
            logger.info(row.Value)
            logger.info(row.Error)
            handle = await getElementHandleByXpath(addAlertForm.input.for, page, {timeout : 100})
            if (handle && handle.length == 0) {
              let otherInfo = row.OtherInfo.split(":")
              if (otherInfo.length > 0 && otherInfo[0] == "AlertName") {
                action = await performAction("type", addAlertForm.input.alertName , "page", otherInfo[1], true)
                expect(action).toBeTruthy()
                action = await performAction("click", addAlertForm.button.next)
                expect(action).toBeTruthy()
              }
            }
            handle = await getElementHandleByXpath(addAlertForm.div.daysSelected, page, {timeout : 100})
            if (handle && handle.length == 0) {   
              action = await performAction("click", addAlertForm.div.durationUnit)
              expect(action).toBeTruthy()
              action = await performAction("click", addAlertForm.li.days)
              expect(action).toBeTruthy()
            }
            action = await performAction("type", addAlertForm.input.for , "page", row.Value, true)
            expect(action).toBeTruthy()
            handle = await getElementHandleByXpath(addAlertForm._errors.for[row.Error], page, {timeout : 1000})
            expect(handle && handle.length > 0).toBe(true)
            screenshot = await customScreenshot('alertname.png', 1920, 1200)
            reporter.addAttachment("alert name", screenshot, "image/png");
            break
          }
          default: {
            logger.error("No match found in switch case")
            expect(true).toBe(false)
            break
          }
        }
      }
      reporter.endStep()
    });
  });
})
