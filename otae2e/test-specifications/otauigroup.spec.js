import { logger } from '../log.setup';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as group from '../helper/otagroup'
import { Login } from '../helper/otalogin';
import {  givenAdminLoggedIn, givenAccessUserLoggedIn, givenIamLoggedIn } from './otashared-steps';
import { thenDeleteUser, thenChangeUserGroup, thenGetUsername, whenIAddUser, confirmpsw_error, email_error, firstname_error, lastname_error, phone_error, gotoAddUser, password_error, thenCheckUser } from '../helper/otauser';
import { verifyLoadingSpinner, createPDF, customScreenshot, delay, getEnvConfig, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, screenshot, capturePageScreenshot } from '../../utils/utils';
import { thenDeleteDevice, thenChangeConnectionendpoint, thenIAddDeviceUsergroup, thenICheckDevice, thenIRemoveDeviceUsergroup,whenIAddDevice, device_error, ip_error, host_error, city_error, country_error, gotoAddDevice } from '../helper/otadevice'
import { add_auth_domain_page, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage, deviceprofilepage, adddevice, addendpoint, addgroup, adduser, user_role_association, device_role_association, user_detail, device_detail, group_detail, endpoint_review, user_search, device_search, group_search, accesslist } from '../constants/locators';


const { PendingXHR } = require('pending-xhr-puppeteer');
const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
let OStoken, db, consoleSpy
const sprintf = require('sprintf-js').sprintf;

const feature = loadFeature('./otae2e/features/otauigroup.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              },
            });

let reporter;

// Define the feature and associated tests
defineFeature(feature, test => {
    afterEach(async () => {
      logger.info("After Each ");
    })

    beforeEach(async () => {
        logger.info("Before Each ");
    })

    afterAll(async () => {
      try {
        await logger.info('After ALL')
        try {
          await page.setViewport({ width: 1300, height: 500})
          await delay(1000)
          let navigated = await performAction('hover', "//*[name()='svg'][@type='user-circle']//ancestor::a[@class='ant-dropdown-trigger ant-dropdown-link']")
          await delay(500)
          navigated = await performAction('click', "//a[@href='/logout']")
          expect(navigated).toBeTruthy()
          expect(await verifyLoadingSpinner()).toBeTruthy()
          await delay(3000)
          page.setViewport({ width: parseInt(global.width), height: parseInt(global.height)})
        } catch (err) {
          logger.info("Ignorable exception, possibly have already logged out");
        }
        logger.info('Ending After all')
      }
      catch (err) {
        logger.info(err);
      }
  
    })

    beforeAll(async () => {
      try {
        logger.info('Before all')
        let login
        login = new Login();
        logger.info("global.env = " + global.env)
        await login.launch(global.env, "orgAdmin")
        reporter = global.reporter
        await har.start({ path: './reports/otauigroup'+global.testStart+'.har', saveResponse: true }); 
      }
      catch (err) {
        logger.error(err);
      }
    })

    test('Availability of Create Group Option for admin user',({
      given,
      when,
      then, 
      
    }) => 
    {
        var flag = false
        givenAdminLoggedIn(given)
        group.whenAdminAccessGroup(when)
        then(/^Admin navigate to group page and add group option is available$/, async (table) => {
          reporter.startStep('Admin user is able to navigate to group page and add group option is available.');
          await group.verifyAddGroupButton(true)
          let screenshot = await customScreenshot('verifyAddGroupButton.png')
          reporter.addAttachment("Admin user is able to navigate to group page and add group option is available.", screenshot, "image/png");
          reporter.endStep()
        })
        
    });


    test('Availability of Create Group Option for access user',({
      given,
      when,
      then, 
      
    }) => 
    {
      logger.info("Availability of Create Group Option for access user")
      givenAccessUserLoggedIn(given)
      when('Access user access the group page', async () => {
        reporter.startStep("Access user access the group page");
        let result;
        // Navigate to user profile page
        result = await navigatePageByClick(leftpane.a.userprofilepage)
        expect(result).toBeTruthy()
        expect(result < 10.0).toBe(true)
        logger.info(`Navigation time is ${result} is less than 10s`)
        expect(await screenshot("userprofilepage")).toBe(true)
        reporter.endStep();
      });
      then(/^Group page option is not available$/, async (table) => {
        reporter.startStep('Group page option is not available.');
        await group.gotoGroupPage(false)
        let screenshot = await customScreenshot('verifyAddGroupButton.png')
        reporter.addAttachment("Group page option is not available.", screenshot, "image/png");
        // Logout from access user
        let login
        login = new Login();
        await login.logout()
        reporter.endStep()
      })
        
    });

    test("Mandatory fields and field policies on the create group UI",({
      given,
      when,
      then, 
      
    }) => 
    {
      logger.info("Mandatory fields and field policies on the create group UI")
      givenAdminLoggedIn(given)
      when(/^Admin user tries to create a group with invalid character on name$/, async (table) => {
        for (let i=0; i < table.length; i++) {
          let row = table[i]
          reporter.startStep("Group Name Inputs, Name: "+ row.name +" and Desc:"+ row.description +"Expected output:"
          + row.error);
          logger.info("Group Name Inputs, Name: "+ row.name +" and Desc:"+ row.description +" Expected output:"
          + row.error)
          await group.add_Group(row.name, row.description, row.error)
          reporter.endStep()
        }
      })
      then(/^Appropriate error should be thrown$/, async (table) => {
        reporter.startStep('Appropriate error should be thrown');
        reporter.endStep()
      })
        
    });

    test("Create a group and verify the roles auto created under a group",({
      given,
      when,
      then, 
      
    }) => 
    {
      logger.info("Create a group and verify the roles auto created under a group")
      givenAdminLoggedIn(given)
      when(/^Admin user creates a group$/, async (table) => {
        reporter.startStep("Create a group and verify the roles auto created under a group");
        // Generate random group name with "AutomationTest" prefix
        const groupAddObj = await group.add_Group("char", "char")
        // Set name as stored in groupAddObj
        groupAddObj.setName(group.capitalize(groupAddObj.getName())) 
        await group.verifyRoles(group.capitalize(groupAddObj.getName()))
        await group.deleteGroup(group.capitalize(groupAddObj.getName()))
        reporter.endStep()
      })
      then(/^Group created should have two roles admin and access associated to it$/, async (table) => {
        reporter.startStep('Group created is having two roles admin and access associated to it.');
        reporter.endStep()
      })
        
    });

    test("Create duplicate group",({
      given,
      when,
      then, 
      
    }) => 
    {
      let groupAddObj = ""
      logger.info("Create duplicate group")
      givenAdminLoggedIn(given)
      when(/^Admin User tries to create a group with duplicate name$/, async (table) => {
        reporter.startStep("Create duplicate group");
        // Generate random group name with "AutomationTest" prefix
        groupAddObj = await group.add_Group("char", "char")
        // Set name as stored in the system
        groupAddObj.setName(group.capitalize(groupAddObj.getName())) 
        reporter.endStep()
      })
      then(/^Group name already exists error should thrown$/, async (table) => {
        reporter.startStep('Group name already exists error should thrown');
        await group.gotoGroupPage()
        await group.clickAddGroupButton()
        await group.submitGroup(groupAddObj.getName(), groupAddObj.getDescription(), "groupDuplicateName")
        await group.deleteGroup(group.capitalize(groupAddObj.getName()))
        reporter.endStep()
      })
        
    });

    test("Associate or Dissociate of device or user from group profile page",({
      given,
      when,
      then, 
      
    }) => 
    {
      let groupAddObj = ""
      logger.info("Associate or Dissociate of device or user from group profile page")
      givenAdminLoggedIn(given)
      when(/^Admin User tries to associate the device or user in the group profile page$/, async (table) => {
        reporter.startStep("Admin User tries to associate the device or user in the the group profile page");
        groupAddObj = await group.add_Group("char", "char")
        // Set name as stored in the system
        groupAddObj.setName(group.capitalize(groupAddObj.getName())) 
        await delay(5000)
        for (let i=0; i < table.length; i++) {
          let row = table[i]
          //reporter.startStep("Group Name Inputs, User: "+ row.user +" and Device:"+ row.device);
          logger.info("Group Name Inputs, User: "+ row.user +" and Device:"+ row.device)
          await group.associateDevice(row.device, groupAddObj.getName())
          await group.associateUser(row.user, groupAddObj.getName())
          await group.verifyAssociateUser(row.user, groupAddObj.getName())
          await group.verifyAssociateDevice(row.device, groupAddObj.getName())
          reporter.endStep()
        }
      })
      then(/^Associated devices or users should be in a group detail page and disassociate should work$/, async (table) => {
        reporter.startStep('Associated devices or users should be in a group detail page and disassociate should work');
        for (let i=0; i < table.length; i++) {
          let row = table[i]
          await group.disassociateDevice(row.device, groupAddObj.getName())
          await group.disassociateUser(row.user, groupAddObj.getName())
          await group.verifyDisassociateUser(row.user, groupAddObj.getName())
          await group.verifyDisassociateDevice(row.device, groupAddObj.getName())
          // Delete the created group
          await group.deleteGroup(groupAddObj.getName())
        }
        reporter.endStep()
      })
        
    });


    test("Group is onboarded once created",({
      given,
      when,
      then, 
      
    }) => 
    {
      let groupAddObj = ""
      logger.info("Group is onboarded once created")
      givenAdminLoggedIn(given)
      when(/^Admin user creates a group$/, async (table) => {
        reporter.startStep("Create a group");
        // Generate random group name with "AutomationTest" prefix
        groupAddObj = await group.add_Group("char", "char")
        let screenshot = await customScreenshot('verifyGroupCreated.png', 1920, 1200)
        reporter.addAttachment("Create a group", screenshot, "image/png")
        // Set name as stored in groupAddObj
        groupAddObj.setName(group.capitalize(groupAddObj.getName())) 
        reporter.endStep()
      })
      then(/^Created group should move from OnBoarding to onboarded state$/, async (table) => {
        reporter.startStep('Created group should move from OnBoarding to onboarded state');
        await group.verifyGroupOnboarded(groupAddObj.getName())
        // Delete the created group
        await group.deleteGroup(groupAddObj.getName())
        reporter.endStep()
      })
        
    });
   
    


    test("Device association by users in groups",({
      given,
      when,
      then, 
      
    }) => 
    {
      let groupAddObj1 = ""
      let groupAddObj2 = ""
      let groupAddObj3 = ""
      let loginObj
      loginObj = new Login();
      logger.info("Device association by users in groups")
      givenAdminLoggedIn(given)
      when('I add device and associate user', async (table) => {
        let config = await getEnvConfig()
        reporter.startStep("Creating three new groups");
        // Create three new groups
        groupAddObj1 = await group.add_Group("char", "char")
        groupAddObj2 = await group.add_Group("char", "char")
        groupAddObj3 = await group.add_Group("char", "char")
        // Set name as stored in the OTA
        groupAddObj1.setName(group.capitalize(groupAddObj1.getName())) 
        groupAddObj2.setName(group.capitalize(groupAddObj2.getName()))
        groupAddObj3.setName(group.capitalize(groupAddObj3.getName()))
        await group.associateDevice("moreconnection", groupAddObj1.getName(), ["80"])
        await group.associateDevice("moreconnection", groupAddObj2.getName(), ["8080"])
        await group.associateDevice("moreconnection", groupAddObj3.getName(), ["3389"])
        await group.associateUser(config[table[0]["userIDInConfig"]]["Name"], groupAddObj1.getName())
        await group.associateUser(config[table[1]["userIDInConfig"]]["Name"], groupAddObj2.getName())
        await group.associateUser(config[table[2]["userIDInConfig"]]["Name"], groupAddObj3.getName())
        }
      )
      then("User and device should be associated", async (table) => {
        reporter.startStep('User and device should be associated');
        let config = await getEnvConfig()
        /* Scenario 1: User 1 has access to Device 1 with Connection 1 under Group 1*/
        await group.verifyDeviceUserAssociate(config[table[0]["userIDInConfig"]]["UserName"], config[table[0]["userIDInConfig"]]["Password"], groupAddObj1.getName(), "moreconnection", ["80"],true)
        /* Scenario 2: User 1 does not have access to Device 1 with Connection 2 under Group 1*/
        await group.verifyDeviceUserDisassociate(config[table[0]["userIDInConfig"]]["UserName"], config[table[0]["userIDInConfig"]]["Password"], groupAddObj1.getName(), "moreconnection", ["8080"],false)
        /* Scenario 3: User 2 has access to Device 1 with Connection 2 under Group 1*/
        await group.verifyDeviceUserAssociate(config[table[1]["userIDInConfig"]]["UserName"], config[table[1]["userIDInConfig"]]["Password"], groupAddObj2.getName(), "moreconnection", ["8080"],true)
        /* Scenario 4: User 2 does not have access to Device 1 with Connection 1 under Group 1*/
        await group.verifyDeviceUserDisassociate(config[table[1]["userIDInConfig"]]["UserName"], config[table[1]["userIDInConfig"]]["Password"], groupAddObj2.getName(), "moreconnection", ["80"],false)
        /* Scenario 5: User 3 does not have access to Connection 1 and 2 from Device 1*/
        await group.verifyDeviceUserDisassociate(config[table[2]["userIDInConfig"]]["UserName"], config[table[2]["userIDInConfig"]]["Password"], groupAddObj3.getName(), "moreconnection", ["80","8080"],true)
        // Delete the created groups
        await group.deleteGroup(groupAddObj1.getName())
        await group.deleteGroup(groupAddObj2.getName())
        await group.deleteGroup(groupAddObj3.getName())
        reporter.endStep()
    })
     
    });
});
