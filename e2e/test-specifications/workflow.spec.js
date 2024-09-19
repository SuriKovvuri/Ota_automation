import { defineFeature, loadFeature } from 'jest-cucumber';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { leftpane, myProfile, userChangePasswordModal, serialNumbers, inodeDetails, downloadEvents, downloadActivity, addNetwork, addOrg, addiNodeForm, addUserForm, addCSPForm, csp, sshKeys, networksTab, pullSecrets, addPullSecretsForm, volumes, clusters, manageAlerts } from '../constants/locators';
import { goToOrg, addMyOrg } from '../helper/org';
import { OrgAdd } from '../src/orgAdd';
import { UserAdd } from '../src/userAdd';
import { NodeAdd } from '../src/nodeAdd';
import { ChangePassword } from '../src/changePassword';
import { goToNode, addMyiNode } from '../helper/node';
import { addMyUser, verifyUserEmail, changeUserPassword } from '../helper/user';
import { connectmongoDB, createPDF, delay, replaceEnvs, getEnvConfig, closeModal, navigatePageByClick, goTo, getPropertyValue, performAction, getElementHandleByXpath, getPropertyValueByXpath, screenshot, closemongoDB } from '../../utils/utils';
import { givenIamLoggedIn, givenIamLoggedInAs } from './shared-steps';
import { addSSHKeyNew } from '../helper/sshkey'
import { CSPAdd } from '../src/cspAdd';
import { addCSP } from '../helper/csp';
import { addPullSecret } from '../helper/pullsecrets';
import { PullSecretAdd } from '../src/pullsecretAdd';
import { VolumeAdd } from '../src/volumeAdd';
import { addPullSecretConst } from '../constants/const';
import { addVolumeConst } from '../constants/const';
import { addVolume } from '../helper/volumes';
import { cleanup } from '../helper/cleanup';
import { ClusterAdd } from '../src/clusterAdd';
import { addCluster, goToCluster } from '../helper/cluster';
import { goToAlertPage, addAlertSubscription } from '../helper/alert';
import { AlertAdd } from '../src/alertAdd';

var assert = require('assert');

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/workflow.feature',
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
var cleanupResources;
var db;

//Uncomment it to disable re-run on failure
//jest.retryTimes(0)

defineFeature(feature, test => {

  afterEach(async () => {
    await closeModal()
    logger.info("After Each ");
    await screenshot('afterEach')
    let result = await cleanup(cleanupResources)
    expect(result).toBe(true)
    await delay(10000)
  })

  beforeEach(async () => {
    logger.info("Before Each ");
    jest.setTimeout(1200000)
    logger.info(test.name)
    await goTo(global.homeurl + '/home')
    cleanupResources = {
      "pullSecrets": [],
      "volumes": [],
      "clusters": [],
      "alerts": [],
      "nodes": [],
      "serialNumbers": [],
      "sshKeys": [],
      "customSecurityPolicies": [],
      "orgs": []
    };
    logger.info("beforeEach - cleanupResources:", cleanupResources)
  })

  afterAll(async () => {
    try {
      logger.info('After ALL')
      await closemongoDB()
      const elemXPath = "//button[contains(@title, 'My Account')]"
      const elemExists = await page.waitForXPath(elemXPath, { timeout: 10000 }) ? true : false;

      expect(elemExists).toBe(true)
      await expect(page).toClick('button[title="My Account"]')
      await page.waitFor(1000)
      await expect(page).toClick('span', { text: 'Logout' })
      await page.waitFor(2000)
      //perf
      logger.info(await testIotium(page));
      await screenshot('loggedout')
      await createPDF(global.testStart, 'status')
    }
    catch (err) {
      logger.error(err);
    }
  })

  beforeAll(async () => {
    try {
      //page.waitForNavigation()
      //jest.setTimeout(300000)
      //await page.setDefaultNavigationTimeout(50000); 
      await page.waitFor(5000);

      let config = await getEnvConfig()
      global.orchIP = config.orchIP
      global.apiKey = config.apiKey

      db = await connectmongoDB()

      let login
      login = new Login();
      logger.info("global.env = " + global.env)
      await login.launch(global.env, "Admin")

      await (page
        .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
        .then(() => logger.info('Waiting In before ALL berfore proceeding')))

      logger.info("before $x")
      await page.$x("//button[contains(@title, 'My Account')]", { visible: true })
      logger.info("after $x")
      reporter = global.reporter
      await screenshot('beforeAll')
    }
    catch (err) {
      logger.error(err);
    }
  })

  test('Org onboarding', async ({
    given,
    when,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I create an org$/, async (table) => {
      reporter.startStep("When I create an Org")
      let config = await getEnvConfig()
      logger.info(config)

      reporter.startStep("When I click Add button");
      let navigated = await navigatePageByClick(leftpane.button.add)
      expect(navigated).toBeTruthy()
      let result = await screenshot('add')
      expect(result).toBeTruthy()
      reporter.endStep()

      reporter.startStep("When I click 'Add Org' button");
      navigated = await navigatePageByClick(leftpane.button.addOrg)
      expect(navigated).toBeTruthy()
      result = await screenshot('addOrg')
      expect(result).toBeTruthy()
      reporter.endStep()

      reporter.startStep("When I fill parameters");
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let org
        org = new OrgAdd()
        cleanupResources["orgs"].push({ "orgName": row.OrgName })
        org.setOrgAdd(row.OrgName, row.BillingName, row.BillingEmail)
        let result = await addMyOrg(org)
        expect(result).toBe(true)
        await delay(5000)
      }
      reporter.endStep()

      reporter.endStep()
    });
    when(/^I create an user$/, async (table) => {
      reporter.startStep("When I create an user")
      let config = await getEnvConfig()
      logger.info(config)

      reporter.startStep("When I fill parameters");
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let user
        user = new UserAdd()
        user.setUserAdd(row.UserName, row.Email, row.Password, row.Password, row.Role)

        let result = await goToOrg(row.OrgName)
        expect(result).toBe(true)
        result = await screenshot('org')
        expect(result).toBeTruthy()

        reporter.startStep("When I click Add button");
        let navigated = await navigatePageByClick(leftpane.button.add)
        expect(navigated).toBeTruthy()
        result = await screenshot('add')
        expect(result).toBeTruthy()
        reporter.endStep()
        await delay(2000)
        reporter.startStep("When I click 'Add User' button");
        navigated = await navigatePageByClick(leftpane.button.addUser)
        expect(navigated).toBeTruthy()
        result = await screenshot('addUser')
        expect(result).toBeTruthy()
        reporter.endStep()

        result = await addMyUser(user)
        expect(result).toBe(true)
        await delay(5000)
      }
      reporter.endStep()
      reporter.endStep()
    });
    when(/^I verify user email address$/, async (table) => {
      reporter.startStep("When I verify user email address")
      let config = await getEnvConfig()
      logger.info(config)
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        reporter.startStep("When I update user document in DB");
        let updated = await verifyUserEmail(row.Email, true, true)
        expect(updated).toBe(true)
        reporter.endStep()
      }
      reporter.endStep()
    });
    then(/^I login and change the password$/, async (table) => {
      reporter.startStep("Then I login and change the password")
      let config = await getEnvConfig()
      logger.info(config)
      for (let i = 0; i < table.length; i++) {
        reporter.startStep("When I login with new user")
        await delay(10000)
        let row = table[i]
        row = await replaceEnvs(row);
        let login
        login = new Login();
        logger.info("global.env = " + global.env)
        let credentials = {
          username: row.UserName,
          password: row.Password
        }
        let result = await login.logout()
        expect(result).toBe(true)
        logger.info("Logout completed wait for networkidle")
        await delay(10000)
        await login.launch(global.env, 'custom', credentials)
        await delay(10000)

        let changepwd = new ChangePassword()
        changepwd.setChangePassword(row.Password, row.NewPassword, row.NewPassword)
        reporter.startStep("When I change password");
        let updated = changeUserPassword(changepwd)
        expect(updated).toBeTruthy()
        reporter.endStep()

        await delay(10000)
        credentials = {
          username: row.UserName,
          password: row.NewPassword
        }
        await login.launch(global.env, 'custom', credentials)
        await delay(10000)

        result = await login.logout()
        expect(result).toBe(true)
        logger.info("Logout completed wait for networkidle")
        await delay(10000)
        await login.launch(global.env, 'Admin')
        await delay(10000)
        reporter.endStep()
      }
      reporter.endStep()
    });
  });

  test('Change Password', async ({
    given,
    when,
    then
  }) => {
    givenIamLoggedInAs(given)
    when(/^I go to 'My Profile' page$/, async () => {
      reporter.startStep("When I click 'My Account' icon");
      let navigated = await navigatePageByClick(leftpane.button.myAccount)
      expect(navigated).toBeTruthy()
      let result = await screenshot('myAccount')
      expect(result).toBeTruthy()
      reporter.endStep()

      reporter.startStep("When I click 'My Profile' link");
      navigated = await navigatePageByClick(leftpane.li.myProfile)
      expect(navigated).toBeTruthy()
      await delay(5000)
      result = await screenshot('myprofile')
      expect(result).toBeTruthy()
      reporter.endStep()
    });
    when(/^I click 'Change Password' link$/, async () => {
      reporter.startStep("When I click 'Change Password' link")
      let navigated = await navigatePageByClick(myProfile.span.changePassword)
      expect(navigated).toBeTruthy()
      await delay(5000)
      let result = await screenshot('changepassword')
      expect(result).toBeTruthy()
      reporter.endStep()
    });
    when(/^I change password$/, async (table) => {
      reporter.startStep("When I change password")
      let config = await getEnvConfig()
      logger.info(config)
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let changepwd = new ChangePassword()
        let password
        if (row.Password === "") {
          logger.info('Empty password')
          password = config.changepwd_password
        } else {
          password = row.Password
        }
        changepwd.setChangePassword(password, row.NewPassword, row.NewPassword)
        reporter.startStep("When I change password");
        let updated = changeUserPassword(changepwd, true)
        expect(updated).toBeTruthy()
        await delay(10000)
        reporter.endStep()
      }
      reporter.endStep()
    });
    then(/^I am able to login with new password$/, async (table) => {
      let config = await getEnvConfig()
      logger.info(config)
      for (let i = 0; i < table.length; i++) {
        reporter.startStep("When I login with new password")
        await delay(10000)
        let row = table[i]
        row = await replaceEnvs(row);
        let login
        login = new Login();
        logger.info("global.env = " + global.env)
        await login.launch(global.env, 'changepwd', null, row.Password)
        await delay(20000)
        let result = await login.logout()
        expect(result).toBe(true)
        logger.info("Logout completed wait for networkidle")
        await delay(10000)
      }
      reporter.endStep()
    });
    then(/^I reset the password to original$/, async (table) => {
      reporter.startStep("When I reset the password to original")
      let config = await getEnvConfig()
      logger.info(config)
      let login
      login = new Login();
      for (let i = 0; i < table.length; i++) {
        //reporter.startStep("When I change password")
        let row = table[i]
        row = await replaceEnvs(row);
        logger.info("global.env = " + global.env)
        let result = await screenshot('beforechangepassword' + i.toString() + '')
        expect(result).toBeTruthy()
        await login.launch(global.env, 'changepwd', null, row.Password)
        await delay(20000)
        let navigated = await navigatePageByClick(leftpane.button.myAccount)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(leftpane.li.myProfile)
        expect(navigated).toBeTruthy()
        await delay(10000)
        navigated = await navigatePageByClick(myProfile.span.changePassword)
        expect(navigated).toBeTruthy()
        let changepwd = new ChangePassword()
        let newpassword
        if (row.NewPassword === "") {
          logger.info('Empty password')
          newpassword = config.changepwd_password
        } else {
          newpassword = row.NewPassword
        }
        changepwd.setChangePassword(row.Password, newpassword, newpassword)
        let updated = changeUserPassword(changepwd, true)
        expect(updated).toBeTruthy()
        await delay(15000)
        result = await screenshot('afterChangePassword' + i.toString() + '')
        expect(result).toBeTruthy()
        //reporter.endStep()
      }
      await login.launch(global.env, 'changepwd')
      await delay(20000)
      let result = await login.logout()
      expect(result).toBe(true)
      await delay(10000)
      reporter.endStep()
    });
    then(/^I expect error for changing password to one of the last three passwords$/, async (table) => {
      reporter.startStep("Then I expect error for changing password to one of the last three passwords")
      let config = await getEnvConfig()
      logger.info(config)
      let login
      login = new Login();
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let password
        if (row.Password === "") {
          logger.info('Empty password')
          password = config.changepwd_password
        } else {
          password = row.Password
        }
        await login.launch(global.env, 'changepwd', null, password)
        await delay(20000)
        let navigated = await navigatePageByClick(leftpane.button.myAccount)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(leftpane.li.myProfile)
        expect(navigated).toBeTruthy()
        await delay(10000)
        navigated = await navigatePageByClick(myProfile.span.changePassword)
        let changepwd = new ChangePassword()
        logger.info("value:" + row.Password + "ends")

        changepwd.setChangePassword(password, row.NewPassword, row.NewPassword)
        reporter.startStep("When I change password");
        let updated = changeUserPassword(changepwd, true, true)
        expect(updated).toBeTruthy()
        await delay(5000)
        navigated = await navigatePageByClick(userChangePasswordModal.button.cancel)
        expect(navigated).toBeTruthy()
        await delay(5000)
        let result = await login.logout()
        expect(result).toBe(true)
        logger.info("Logout completed wait for networkidle")
        await delay(10000)
        await login.launch(global.env, 'Admin')
        await delay(10000)
        reporter.endStep()
      }
      reporter.endStep()
    });
  });

  test('Edge iNode Onboarding', async ({
    given,
    when,
    then
  }) => {
    var cspName = ""
    var sshKeyName = ""
    givenIamLoggedIn(given)
    when(/^I add HSN to org$/, async () => {
      reporter.startStep("When I add HSN to org")
      let config = await getEnvConfig()
      logger.info(config)

      reporter.startStep("When I navigate to org")
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      result = await screenshot('org')
      expect(result).toBeTruthy()
      reporter.endStep()

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
      result = await screenshot('iNodes')
      expect(result).toBeTruthy()

      reporter.startStep("When I click Serial Numbers link");
      let navigated = await navigatePageByClick(leftpane.li.serialNumbers)
      expect(navigated).toBeTruthy()
      result = await screenshot('serialNumbers')
      expect(result).toBeTruthy()
      reporter.endStep()

      reporter.startStep("When I click 'Add Serial Number' button");
      navigated = await navigatePageByClick(serialNumbers._button.add)
      expect(navigated).toBeTruthy()
      result = await screenshot('addSerialNumber')
      expect(result).toBeTruthy()
      reporter.endStep()

      reporter.startStep("When I enter serial numbers");
      var action = await performAction("type", serialNumbers._textarea.serialNumbers, "page", config.workflowEdgeProvisioningHSN)
      expect(action).toBeTruthy()
      cleanupResources["serialNumbers"].push({ "hsn": config.workflowEdgeProvisioningHSN, "orgName": config.orgName })
      navigated = await navigatePageByClick(serialNumbers._button.addSerial)
      expect(navigated).toBeTruthy()
      await delay(5000)
      reporter.endStep()

      reporter.endStep()
    });
    when(/^I add an SSH Key$/, async (table) => {
      reporter.startStep("When I add an SSH Key")
      let config = await getEnvConfig()
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
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

        sshKeyName = row.SSHKeyName
        let navigated = await navigatePageByClick(leftpane.li.sshKeys)
        expect(navigated).toBeTruthy()
        handle = await getElementHandleByXpath("//span[@title='Key Name']//ancestor::div[@class='ant-table-scroll']//tbody[@class='ant-table-tbody']//td//div[text()='" + row.SSHKeyName + "']", page, { timeout: 100 })
        logger.info(handle)
        if (handle && handle.length > 0) {
          logger.info("SSH Key exists already.")
        } else {
          navigated = await navigatePageByClick(sshKeys.button.addSSHKey)
          expect(navigated).toBeTruthy()
          cleanupResources["sshKeys"].push({ "sshKeyName": row.SSHKeyName, "orgName": config.orgName })
          let result = await addSSHKeyNew(row.SSHKeyName, row.PublicKey)
          expect(result).toBe(true)
        }
      }
      reporter.endStep()
    });
    when(/^I create a custom security policy$/, async (table) => {
      reporter.startStep("When I create a custom security policy")
      let config = await getEnvConfig()
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let navigated = await navigatePageByClick(leftpane.li.networks)
        expect(navigated).toBeTruthy()

        navigated = await navigatePageByClick(leftpane.li.customSecurityPolicy)
        expect(navigated).toBeTruthy()

        navigated = await navigatePageByClick(csp.button.addCustomSecurityPolicy)
        expect(navigated).toBeTruthy()

        let csp1 = new CSPAdd()
        cspName = row.CSPName
        cleanupResources["customSecurityPolicies"].push({ "customSecurityPolicyName": row.CSPName, "orgName": config.orgName })
        csp1.setCSPAdd(row.CSPName, row.FromNetworkLabel)
        let result = await addCSP(csp1)
        expect(result).toBe(true)
      }
      reporter.endStep()
    });
    when(/^I provision an edge iNode with HSN$/, async (table) => {
      reporter.startStep("When I provision an edge iNode with HSN")
      let config = await getEnvConfig()
      logger.info(config)

      let navigated = await navigatePageByClick(leftpane.li.inodes)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(leftpane.li.serialNumbers)
      expect(navigated).toBeTruthy()

      reporter.startStep("When I verify HSN in Serial Numbers page")
      let hsn = await getPropertyValueByXpath("//div[text()='" + config.workflowEdgeProvisioningHSN + "']", 'innerText')
      logger.info(hsn)
      expect(hsn).toBe(config.workflowEdgeProvisioningHSN)
      reporter.endStep()

      reporter.startStep("When I click Add button");
      navigated = await navigatePageByClick(leftpane.button.add)
      expect(navigated).toBeTruthy()
      reporter.endStep()

      reporter.startStep("When I click 'Add iNode' button");
      navigated = await navigatePageByClick(leftpane.button.addInode)
      expect(navigated).toBeTruthy()
      reporter.endStep()

      reporter.startStep("When I fill parameters");
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let nodeObj
        nodeObj = new NodeAdd()
        cleanupResources["nodes"].push({ "nodeName": row.NodeName, "orgName": config.orgName })
        nodeObj.setNodeAdd(row.NodeName, "", row.Profile, config.workflowEdgeProvisioningHSN, row.SSHKey, "", "")
        let result = await addMyiNode(nodeObj)
        expect(result).toBe(true)
        await delay(5000)
        reporter.endStep()
      }

      reporter.endStep()
    });
    when(/^I go to iNode details page$/, async (table) => {
      reporter.startStep("When I go to iNode details page")
      let config = await getEnvConfig()
      logger.info(config)
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        await goToNode(row.NodeName)
        await delay(10000)
        let result = await screenshot('iNodeDetails')
        expect(result).toBeTruthy()
      }
      reporter.endStep()
    });
    when(/^I associate custom security policy with network$/, async (table) => {
      reporter.startStep("When I associate custom security policy with network")
      let config = await getEnvConfig()
      logger.info(config)
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        var action = await performAction("hover", networksTab.button.wanNetworkMoreDots)
        expect(action).toBeTruthy()
        let navigated = await navigatePageByClick(networksTab.button._editNetwork)
        expect(navigated).toBeTruthy()
        let result = await screenshot('editnw')
        expect(result).toBeTruthy()
        action = await performAction("click", addNetwork.div.security)
        expect(action).toBeTruthy()
        result = await screenshot('security')
        expect(result).toBeTruthy()
        action = await performAction("click", addNetwork.div.selectCSP)
        expect(action).toBeTruthy()
        action = await performAction("click", "//li[@title='  " + row.CSPName + "']")
        expect(action).toBeTruthy()
        action = await performAction("click", addNetwork.button.update)
        expect(action).toBeTruthy()
        const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-success']//span[text()='WAN Network updated successfully']", { timeout: 10000 }) ? true : false;
        expect(elemExists).toBe(true)
      }
      reporter.endStep()
    });
    then(/^I expect iNode becomes ALIVE$/, async (table) => {
      reporter.startStep("When I expect iNode becomes ALIVE")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        await goToNode(row.NodeName)
      }
      for (let i = 0; i < 8; i++) {
        let handle = await getElementHandleByXpath(inodeDetails._iNodeStatus.alive)
        logger.info(handle.length)
        if (handle && handle.length > 0) {
          logger.info("iNode is ALIVE")
          break
        }
        logger.info("Sleeping 30 seconds for iNode to become ALIVE; Iteration:" + i.toString())
        await delay(30000)
      }
      reporter.endStep()
    });
  });
  test('Download Events', async ({
    given,
    when,
    and,
    then
  }) => {
    var downloadCount = 0
    givenIamLoggedIn(given)
    when(/^I go to 'Download Events' page$/, async (table) => {
      reporter.startStep("I go to 'Download Events' page")

      reporter.startStep("When I click download button");
      let navigated = await navigatePageByClick(leftpane.button.download)
      expect(navigated).toBeTruthy()
      await delay(3000)
      let result = await screenshot('download')
      expect(result).toBeTruthy()
      reporter.endStep()

      reporter.startStep("When I click 'Download Events' button");
      navigated = await performAction("click", leftpane.li.downloadEvents, "page")
      expect(navigated).toBeTruthy()
      await delay(3000)
      result = await screenshot('downloadEvents')
      expect(result).toBeTruthy()
      reporter.endStep()

      reporter.endStep()
    });
    when(/^I select options in filter and request report$/, async (table) => {
      reporter.startStep("I cancel any pending request")
      let handle = await getElementHandleByXpath(downloadEvents.button.cancelRequest, page, { timeout: 1000 })
      logger.info(handle.length)
      if (handle && handle.length > 0) {
        let navigated = await navigatePageByClick(downloadEvents.button.cancelRequest)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(downloadEvents.button.yesCancelRequest)
        expect(navigated).toBeTruthy()
      }

      reporter.endStep()

      reporter.startStep("When I select options in filter")
      let navigated = await navigatePageByClick(downloadEvents.div.filterBySource)
      expect(navigated).toBeTruthy()
      let result = await screenshot('filter')
      expect(result).toBeTruthy()
      navigated = await navigatePageByClick(downloadEvents.li.filterBySourceInode)
      expect(navigated).toBeTruthy()
      reporter.endStep()

      reporter.startStep("Getting number of download requests")
      handle = await getElementHandleByXpath(downloadEvents.button.downloadReport)
      if (handle && handle.length > 0) {
        downloadCount = handle.length
        if (handle.length > 9) {
          let navigated = await navigatePageByClick(downloadEvents.button.deleteReportFirst)
          expect(navigated).toBeTruthy()
          navigated = await navigatePageByClick(downloadEvents.button.yesDeleteReport)
          expect(navigated).toBeTruthy()
          downloadCount = downloadCount - 1
        }
      }
      logger.info("Current Download Count:" + downloadCount)
      reporter.endStep()

      reporter.startStep("When I click 'Request Report' button")
      navigated = await navigatePageByClick(downloadEvents.button.requestReport)
      expect(navigated).toBeTruthy()
      reporter.endStep()
    });
    then(/^Request is completed and I am able to download the report$/, async (table) => {
      reporter.startStep("Then I expect request is completed")
      var i = 1
      var handle
      let downloadComplete = false
      //Waiting for maximum 5 minutes to complete download request
      while (i <= 10) {
        logger.info("Checking download request status. Iteration:" + i)
        handle = await getElementHandleByXpath(downloadEvents.button.cancelRequest, page, { timeout: 1000 })
        logger.info(handle)
        if (handle && handle.length > 0) {
          logger.info("Sleeping for 30 seconds")
          await delay(30000)
        } else {
          downloadComplete = true
          break
        }
        i = i + 1
      }
      expect(downloadComplete).toBe(true)

      handle = await getElementHandleByXpath(downloadEvents.button.downloadReport)
      logger.info("Current Download Count:" + handle.length)
      expect(handle.length).toBe(downloadCount + 1)
      reporter.endStep()

      reporter.startStep("Then I am able to download the report")
      await page.waitForXPath(downloadEvents.button.downloadReportFirst)
      handle = await page.$x(downloadEvents.button.downloadReportFirst)
      logger.info(handle.length)
      await Promise.all([
        handle[0].click(),
      ])
      const finalResponse = await page.waitForResponse(response =>
        response.url().endsWith("file")
        && (response.request().method() === 'GET'
          && response.status() === 200)
        , 30);
      if (finalResponse == null) {
        await expect(false).toBe(true);
      }
      reporter.endStep()

      reporter.startStep("Then I verify download URL")
      //Fetching request ID from request URI
      logger.info("Response:" + finalResponse)
      let filePattern = /\/api\/v1\/download\/event\/([0-9a-f\-]{36})\/file$/;
      logger.info("URL:" + finalResponse.url())
      let match = filePattern.exec(finalResponse.url())
      await expect(match != null).toBe(true)

      //Fetching request ID from download URL
      let responseJson = await finalResponse.json();
      logger.info("API response JSON:" + responseJson)
      let contentPattern = /\/api\/v1\/download\/event\/([0-9a-f\-]{36})\/content\?temp_token=[0-9A-Za-z]{32}$/;
      logger.info("Download URL:" + responseJson['download_url'])
      let match2 = contentPattern.exec(responseJson['download_url'])
      await expect(match2 != null).toBe(true)

      //Comparing request IDs of request URI and download URL
      await expect(match[1]).toBe(match2[1])
      reporter.endStep()
    });
  });

  test('Download Activity', async ({
    given,
    when,
    and,
    then
  }) => {
    var downloadCount = 0
    givenIamLoggedIn(given)
    when(/^I go to 'Download Activity' page$/, async (table) => {
      reporter.startStep("I go to 'Download Activity' page")

      reporter.startStep("When I click download button");
      let navigated = await navigatePageByClick(leftpane.button.download)
      expect(navigated).toBeTruthy()
      await delay(3000)
      let result = await screenshot('download')
      expect(result).toBeTruthy()
      reporter.endStep()

      reporter.startStep("When I click 'Download Activity' button");
      navigated = await performAction("click", leftpane.li.downloadActivity, "page")
      expect(navigated).toBeTruthy()
      await delay(3000)
      result = await screenshot('downloadActivity')
      expect(result).toBeTruthy()
      reporter.endStep()

      reporter.endStep()
    });
    when(/^I select options in filter and request report$/, async (table) => {
      reporter.startStep("I cancel any pending request")
      let handle = await getElementHandleByXpath(downloadActivity.button.cancelRequest, page, { timeout: 1000 })
      logger.info(handle.length)
      if (handle != false && handle.length > 0) {
        let navigated = await navigatePageByClick(downloadActivity.button.cancelRequest)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(downloadActivity.button.yesCancelRequest)
        expect(navigated).toBeTruthy()
      }
      reporter.endStep()

      reporter.startStep("When I select options in filter")
      let navigated = await navigatePageByClick(downloadActivity.input.endDate)
      expect(navigated).toBeTruthy()
      let result = await screenshot('filter')
      expect(result).toBeTruthy()
      navigated = await navigatePageByClick(downloadActivity.a.endDateNow)
      expect(navigated).toBeTruthy()
      reporter.endStep()

      reporter.startStep("Getting number of download requests")
      handle = await getElementHandleByXpath(downloadActivity.button.downloadReport, page, { timeout: 1000 })
      if (handle && handle.length > 0) {
        downloadCount = handle.length
      }
      if (handle.length > 9) {
        let navigated = await navigatePageByClick(downloadActivity.button.deleteReportFirst)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(downloadActivity.button.yesDeleteReport)
        expect(navigated).toBeTruthy()
        downloadCount = downloadCount - 1
      }
      logger.info("Current Download Count:" + downloadCount)
      reporter.endStep()

      reporter.startStep("When I click 'Request Report' button")
      navigated = await navigatePageByClick(downloadActivity.button.requestReport)
      expect(navigated).toBeTruthy()
      reporter.endStep()
    });
    then(/^Request is completed and I am able to download the report$/, async (table) => {
      reporter.startStep("Then I expect request is completed")
      var i = 1
      var handle
      let downloadComplete = false
      //Waiting for maximum 5 minutes to complete download request
      while (i <= 10) {
        logger.info("Checking download request status. Iteration:" + i)
        handle = await getElementHandleByXpath(downloadActivity.button.cancelRequest, page, { timeout: 1000 })
        logger.info(handle)
        if (handle && handle.length > 0) {
          logger.info("Sleeping for 30 seconds")
          await delay(30000)
        } else {
          downloadComplete = true
          break
        }
        i = i + 1
      }
      expect(downloadComplete).toBe(true)

      handle = await getElementHandleByXpath(downloadActivity.button.downloadReport)
      logger.info("Current Download Count:" + handle.length)
      expect(handle.length).toBe(downloadCount + 1)
      reporter.endStep()

      await page.waitForXPath(downloadActivity.button.downloadReportFirst)
      handle = await page.$x(downloadActivity.button.downloadReportFirst)
      logger.info(handle.length)
      await Promise.all([
        handle[0].click(),
      ])
      const finalResponse = await page.waitForResponse(response =>
        response.url().endsWith("file")
        && (response.request().method() === 'GET'
          && response.status() === 200)
        , 30);
      if (finalResponse == null) {
        await expect(false).toBe(true);
      }
      reporter.endStep()

      reporter.startStep("Then I verify download URL")
      //Fetching request ID from request URI
      logger.info("Response:" + finalResponse)
      let filePattern = /\/api\/v1\/download\/activity\/([0-9a-f\-]{36})\/file$/;
      logger.info("URL:" + finalResponse.url())
      let match = filePattern.exec(finalResponse.url())
      await expect(match != null).toBe(true)

      //Fetching request ID from download URL
      let responseJson = await finalResponse.json();
      logger.info("API response JSON:" + responseJson)
      let contentPattern = /\/api\/v1\/download\/activity\/([0-9a-f\-]{36})\/content\?temp_token=[0-9A-Za-z]{32}$/;
      logger.info("Download URL:" + responseJson['download_url'])
      let match2 = contentPattern.exec(responseJson['download_url'])
      await expect(match2 != null).toBe(true)

      //Comparing request IDs of request URI and download URL
      await expect(match[1]).toBe(match2[1])
      reporter.endStep()

      reporter.endStep()
    });
  });

  test('Add Service Secrets', async ({
    given,
    when,
    and,
    then
  }) => {
    var pullSecretName;
    var volumeName;
    givenIamLoggedIn(given)
    when(/^I add a pull secret$/, async (table) => {
      reporter.startStep("When I add a pull secret")
      let config = await getEnvConfig()
      logger.info(config)

      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)

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
        logger.error("Unable to get service secrets in left menu")
        expect(true).toBe(false)
      }

      let navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(pullSecrets.button.addPullSecret)
      expect(navigated).toBeTruthy()
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let obj = new PullSecretAdd()
        pullSecretName = row.PullSecretName
        cleanupResources["pullSecrets"].push({ "pullSecretName": row.PullSecretName, "orgName": config.orgName })
        obj.setPullSecretAdd(row.PullSecretName, JSON.stringify(addPullSecretConst.dockerConfig))
        let result = await addPullSecret(obj)
        expect(result).toBe(true)
      }

      reporter.endStep()
    });
    when(/^I add a volume$/, async (table) => {
      reporter.startStep("When I add a volume")
      let config = await getEnvConfig()
      logger.info(config)

      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)

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
        logger.error("Unable to get service secrets in left menu")
        expect(true).toBe(false)
      }

      let navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(volumes.tab.volumes)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(volumes.button.addVolume)
      expect(navigated).toBeTruthy()
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let obj = new VolumeAdd()
        volumeName = row.VolumeName
        cleanupResources["volumes"].push({ "volumeName": row.VolumeName, "orgName": config.orgName })
        obj.setVolumeAdd(row.VolumeName, "WorkflowVolumeFileName", addVolumeConst.filecontent)
        let result = await addVolume(obj)
        expect(result).toBe(true)
      }
      reporter.endStep()
    });
    then(/^I expect the created pull secret in list page$/, async (table) => {
      reporter.startStep("Then I expect the created pull secret in list page")

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
        logger.error("Unable to get service secrets in left menu")
        expect(true).toBe(false)
      }

      let navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
      expect(navigated).toBeTruthy()
      handle = await getElementHandleByXpath("//td//div[text()='" + pullSecretName + "']", page, { timeout: 100 })
      expect(handle && handle.length > 0).toBe(true)
      reporter.endStep()
    });
    then(/^I expect the created volume in list page$/, async (table) => {
      reporter.startStep("Then I expect the volume in list page")

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
        logger.error("Unable to get service secrets in left menu")
        expect(true).toBe(false)
      }

      let navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(volumes.tab.volumes)
      expect(navigated).toBeTruthy()

      handle = await getElementHandleByXpath("//td//div[text()='" + volumeName + "']", page, { timeout: 100 })
      expect(handle && handle.length > 0).toBe(true)
      reporter.endStep()
    });
  });

  test('Add Cluster', async ({
    given,
    when,
    and,
    then
  }) => {
    let clusterName;
    givenIamLoggedIn(given)
    when(/^I create a cluster$/, async (table) => {
      reporter.startStep("When I create a cluster")
      let config = await getEnvConfig()
      logger.info(config)
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)

      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);
        let navigated = await navigatePageByClick(leftpane.li.clusters)
        expect(navigated).toBeTruthy()

        let handle = await getElementHandleByXpath("//span[@title='Name  ']//ancestor::div[@class='ant-table-scroll']//tbody[@class='ant-table-tbody']//td//a[text()='" + row.ClusterName + "']", page, { timeout: 100 })
        logger.info(handle)
        if (handle && handle.length == 0) {
          logger.info("Cluster name doesn't exist already")
          navigated = await navigatePageByClick(clusters.button.addCluster)
          expect(navigated).toBeTruthy()

          let nodes = []
          let nodeNames = row.iNodeNames.split(";")
          let priorities = row.Priority.split(";")
          let candidates = row.Candidate.split(";")
          for (let j = 0; j < nodeNames.length; j++) {
            nodes.push({
              "name": nodeNames[j],
              "priority": priorities[j],
              "isCandidate": candidates[j]
            })
          }
          clusterName = row.ClusterName
          cleanupResources["clusters"].push({ "clusterName": row.ClusterName, "orgName": config.orgName })
          let cluster = new ClusterAdd()
          cluster.setClusterAdd(row.ClusterName, nodes)
          let result = await addCluster(cluster)
          expect(result).toBe(true)
          await delay(5000)
        } else {
          logger.error("Cluster Name " + row.ClusterName + "already exists")
          expect(true).toBe(false)
        }
      }
      reporter.endStep()
    });
    then(/^I expect master is elected$/, async (table) => {
      reporter.startStep("Then I expect master is elected")
      let config = await getEnvConfig()
      logger.info(config)
      await goToCluster(clusterName)
      logger.info("Sleeping 60 seconds for master election")
      await delay(60000)
      let handle = await getElementHandleByXpath(clusters.span.master, page, { timeout: 100 })
      expect(handle && handle.length > 0).toBe(true)
      reporter.endStep()
    });
  });

  test('Add Webhook Alert Subscription', async ({
    given,
    when,
    then
  }) => {
    let alertName;
    let alertType;
    let nodeName;
    let duration;
    let scope;
    let channel;
    let date;
    givenIamLoggedIn(given)
    when(/^I create an alert subscription using webhook$/, async (table) => {
      reporter.startStep("I create an alert subscription using webhook")
      let config = await getEnvConfig()
      logger.info(config)
      await goToAlertPage()
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);

        let handle = await getElementHandleByXpath("//span[text()='Alert Name']//ancestor::div[@class='ant-table-scroll']//div[@class='ant-table-body']//td//span[text()='" + row.AlertName + "']", page, { timeout: 100 })
        logger.info(handle)
        if (handle && handle.length > 0) {
          logger.error("Alert Name " + row.AlertName + "already exists; exiting")
          expect(true).toBe(false)
        } else {
          logger.info("Alert name doesn't exist already")
          alertName = row.AlertName
          alertType = row.AlertType
          duration = row.For.split(":")
          scope = row.Scope.split(":")
          channel = row.Channel.split(":")
          cleanupResources["alerts"].push({ "alertName": row.AlertName, "orgName": config.orgName })

          let alert = new AlertAdd()
          alert.setAlertAdd(row.AlertName, "", "", "", "", "", "Node", "Default", row.For, row.Scope, row.Channel)
          await addAlertSubscription(alert)
          let result = await screenshot('alert')
          expect(result).toBeTruthy()
          await delay(2000)
        }
      }
      reporter.endStep()
    });
    when(/^I bring up an iNode to ALIVE state$/, async (table) => {
      reporter.startStep("I bring up an iNode to ALIVE state")
      let config = await getEnvConfig()
      logger.info(config)

      //goto org
      let result = await goToOrg(config.orgName)
      expect(result).toBe(true)
      result = await screenshot('org')
      expect(result).toBeTruthy()
      let navigated;

      //add serial number
      await page.waitForXPath(leftpane.li.inodes)
      let handle = await page.$x(leftpane.li.inodes)
      logger.info(handle.length)
      if (handle.length > 0) {
        let propValue = await getPropertyValue(handle[0], 'classList')
        logger.info(propValue)
        if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
          navigated = await navigatePageByClick(leftpane.li.inodes)
          expect(navigated).toBeTruthy()
        }
      } else {
        logger.error("Unable to get iNodes in left menu")
        expect(true).toBe(false)
      }
      navigated = await navigatePageByClick(leftpane.li.serialNumbers)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(serialNumbers._button.add)
      expect(navigated).toBeTruthy()
      var action = await performAction("type", serialNumbers._textarea.serialNumbers, "page", config.workflowEdgeProvisioningHSN)
      expect(action).toBeTruthy()
      navigated = await navigatePageByClick(serialNumbers._button.addSerial)
      expect(navigated).toBeTruthy()
      cleanupResources["serialNumbers"].push({ "hsn": config.workflowEdgeProvisioningHSN, "orgName": config.orgName })
      await delay(5000)

      //verifying serial number in serial numbers page 
      navigated = await navigatePageByClick(leftpane.li.inodes)
      expect(navigated).toBeTruthy()
      navigated = await navigatePageByClick(leftpane.li.serialNumbers)
      expect(navigated).toBeTruthy()
      result = await screenshot('hsn')
      expect(result).toBeTruthy()
      let hsn = await getPropertyValueByXpath("//div[text()='" + config.workflowEdgeProvisioningHSN + "']", 'innerText')
      expect(hsn).toBe(config.workflowEdgeProvisioningHSN)

      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        row = await replaceEnvs(row);

        //add ssh key
        navigated = await navigatePageByClick(leftpane.li.sshKeys)
        expect(navigated).toBeTruthy()
        handle = await getElementHandleByXpath("//span[@title='Key Name']//ancestor::div[@class='ant-table-scroll']//tbody[@class='ant-table-tbody']//td//div[text()='" + row.SSHKeyName + "']", page, { timeout: 100 })
        logger.info(handle)

        if (handle && handle.length > 0) {
          logger.info("SSH Key exists already.")
        } else {
          navigated = await navigatePageByClick(sshKeys.button.addSSHKey)
          expect(navigated).toBeTruthy()
          result = await addSSHKeyNew(row.SSHKeyName, row.PublicKey)
          expect(result).toBe(true)
          cleanupResources["sshKeys"].push({ "sshKeyName": row.SSHKeyName, "orgName": config.orgName })
          result = await screenshot('sshkey')
          expect(result).toBeTruthy()
        }

        //add edge iNode
        navigated = await navigatePageByClick(leftpane.button.add)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(leftpane.button.addInode)
        expect(navigated).toBeTruthy()
        date = Date.now() * 1000000
        let nodeObj
        nodeObj = new NodeAdd()
        nodeName = row.NodeName
        nodeObj.setNodeAdd(row.NodeName, "", row.Profile, config.workflowEdgeProvisioningHSN, row.SSHKeyName, "", "")
        cleanupResources["nodes"].push({ "nodeName": row.NodeName, "orgName": config.orgName })
        result = await addMyiNode(nodeObj)
        expect(result).toBe(true)
        await delay(5000)
        await goToNode(row.NodeName)
        for (let j = 0; j < 120; j++) {
          //checking ALIVE status
          handle = await getElementHandleByXpath(inodeDetails._iNodeStatus.alive)
          logger.info(handle.length)
          if (handle && handle.length > 0) {
            logger.info("iNode is ALIVE")
            result = await screenshot('alive')
            expect(result).toBeTruthy()
            break
          }
          logger.info("Sleeping 30 seconds for iNode to become ALIVE; Iteration:" + j.toString())
          await delay(2000)
        }
      }
      reporter.endStep()
    });
    then(/^I expect a notification for the created alert$/, async () => {
      reporter.startStep("I expect a notification for the created alert")
      logger.info("Sleeping 60 seconds for notification to get generated")
      await delay(60000)
      logger.info(`date is ${date}`)
      var myDocument = await db.collection('user_notification').findOne(
        {
          'type': 'NODE_STATE_CHANGE',
          'fields.alert.name': alertName,
          'fields.nodeName': nodeName,
          'fields.status': 'NODE_ALIVE',
          'createdAt': { $gt: date }
        })
      logger.info(myDocument)

      reporter.startStep("Verifying Alert duration")
      logger.info(myDocument.fields.alert.settings)
      expect(myDocument.fields.alert.settings.duration).toBe(duration[0])
      reporter.endStep()

      if (scope[0] == "Org" && scope[1] == "All") {
        reporter.startStep("Verifying Scope")
        expect(myDocument.fields.alert.settings.include_child).toBe("true")
        reporter.endStep()
      }

      reporter.startStep("Verifying Alert user notifcation record has alertAfterAt is " + duration[0] + " " + duration[1] + " from eventTime")
      logger.info(myDocument.eventTime)
      logger.info(myDocument.alertAfterAt)
      logger.info(~~((myDocument.alertAfterAt - myDocument.eventTime) / 1000000000))
      expect(~~((myDocument.alertAfterAt - myDocument.eventTime) / 1000000000)).toBe(60)
      reporter.endStep()
    });
  });
});

