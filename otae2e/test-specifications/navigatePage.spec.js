import { defineFeature, loadFeature } from 'jest-cucumber';
import { verifyLoadingSpinner, createPDF, customScreenshot, delay, getEnvConfig, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, screenshot, capturePageScreenshot } from '../../utils/utils';
import { logger } from '../log.setup';
import { Login } from '../helper/otalogin';
import { add_auth_domain_page, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage, deviceprofilepage, adddevice, addendpoint, addgroup, adduser, user_role_association, device_role_association, user_detail, device_detail, group_detail, endpoint_review, user_search, device_search, group_search, accesslist } from '../constants/locators';
import { givenIamLoggedIn, givenAdminLoggedIn } from './otashared-steps';

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./otae2e/features/navigatePage.feature',
  {
    errors: {
      missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
      missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
      missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
      missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
    },

  });

let reporter;

defineFeature(feature, test => {

  afterEach(async () => {
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    logger.info("After Each ");
    logger.info(performanceTiming);
  })

  beforeEach(async () => {
    logger.info("Before Each ");
  })

  afterAll(async () => {
    try {
      await logger.info('After ALL')
      try {
        const elemExists = await expect(page).toMatchElement('svg[type="Users"]') ? true : false;
        if (elemExists == true) {
          expect(elemExists).toBe(true)
          await expect(page).toMatchElement('svg[type="UserCircle"]') ? true : false;
          await expect(page).toClick('svg[class="anticon valign-sub"]')
          await page.waitFor(1000)
          await expect(page).toClick('svg[type="user-circle"]') ? true : false;
          await expect(page).toClick("//a[@href[contains(.,'logout')]]")
          await page.waitFor(2000)
        }
      } catch (err) {
        logger.info("Ignorable exception, possibly have already logged out");
      }
      //Make a PDF of the tests by merging all screenshots into the pdf
      //await createPDF(global.testStart, 'otauinavigationvalidation')
      await har.stop();
      logger.info('Ending After all')
    }
    catch (err) {
      logger.info(err);
    }

  })

  beforeAll(async () => {
    try {
      logger.info('Before all')
      await delay(120000)
      let login
      login = new Login();
      logger.info("global.env = " + global.env)
      await login.launch(global.env, "orgAdmin")
      reporter = global.reporter
      await har.start({ path: './reports/otauinavigationvalidation'+global.testStart+'.har', saveResponse: true }); 
    }
    catch (err) {
      logger.error(err);
    }
  })

  test('Verify Leftpane', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I land in Dashboard page', async () => {
      reporter.startStep("When I land in Dashboard page");
      expect(await screenshot("leftpane")).toBe(true)
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in leftpane) {
        for (const tag in leftpane[key]) {
          if (tag.startsWith('_') != true) {
            let handle;
            reporter.startStep(`Verifying ${key} ${tag}`);
            if (tag == 'auditdashboard' || tag == 'accessdashboard') {
              let action = await performAction("hover", leftpane.span.accountBook)
              expect(action).toBeTruthy()
              handle = await getElementHandleByXpath(leftpane[key][tag])
              logger.info(handle.length)
              expect(handle).toBeTruthy()
            } else {
              handle = await getElementHandleByXpath(leftpane[key][tag])
              logger.info(handle.length)
              expect(handle).toBeTruthy()
            }
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify Dashboard', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I land in Dashboard page', async () => {
      reporter.startStep("When I land in Dashboard page");
      let result;
      result = await navigatePageByClick(leftpane.a.userdashboard)
      expect(result).toBeTruthy()

      result = await navigatePageByClick(leftpane.a.dashboardicon)
      expect(result).toBeTruthy()
      expect(result < 10.0).toBe(true)
      
      reporter.startStep(`Navigation time is ${result} is less than 10s`)
      reporter.endStep()
      
      expect(await screenshot("dashboard")).toBe(true)
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in dashboard) {
        for (const tag in dashboard[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(dashboard[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify UserlistPage', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to userlist page', async () => {
      reporter.startStep("When I navigate to userlist page");
      let result;
      result = await navigatePageByClick(leftpane.a.userdashboard)
      expect(result).toBeTruthy()
      expect(result < 10.0).toBe(true)
      
      reporter.startStep(`Navigation time is ${result} is less than 10s`)
      reporter.endStep()
      
      expect(await screenshot("userlist")).toBe(true)
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in userlist) {
        for (const tag in userlist[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(userlist[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify DevicelistPage', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to devicelist page', async () => {
      reporter.startStep("When I navigate to devicelist page");
      let result;
      result = await navigatePageByClick(leftpane.a.devicedashboard)
      expect(result).toBeTruthy()
      expect(result < 10.0).toBe(true)
      
      reporter.startStep(`Navigation time is ${result} is less than 10s`)
      reporter.endStep()
      
      expect(await screenshot("devicelist")).toBe(true)
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in devicelist) {
        for (const tag in devicelist[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(devicelist[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify GrouplistPage', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to grouplist page', async () => {
      reporter.startStep("When I navigate to grouplist page");
      let result;
      result = await navigatePageByClick(leftpane.a.groupdashboard)
      expect(result).toBeTruthy()
      expect(result < 10.0).toBe(true)

      reporter.startStep(`Navigation time is ${result} is less than 10s`)
      reporter.endStep()

      expect(await screenshot("grouplist")).toBe(true)
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in grouplist) {
        for (const tag in grouplist[key]) {
          if (tag.startsWith('_') != true && key !== 'group_profile') {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(grouplist[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify AuditPage', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to audit page', async () => {
      reporter.startStep("When I navigate to audit page");
      let result;
      result = await navigatePageByClick(leftpane.a.dashboardicon)
      expect(result).toBeTruthy()
      
      result = await performAction("hover", leftpane.span.accountBook)
      expect(result).toBeTruthy()
      
      await page.waitFor(2000)
      await page.waitForXPath(leftpane.a.auditdashboard)
      expect(await screenshot("accountbook")).toBe(true)
      
      await page.waitFor(1000)
      result = await navigatePageByClick(leftpane.a.auditdashboard)
      expect(result).toBeTruthy()
      expect(result < 10.0).toBe(true)

      reporter.startStep(`Navigation time is ${result} is less than 10s`)
      reporter.endStep()

      expect(await screenshot("auditlist")).toBe(true)
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in auditlist) {
        for (const tag in auditlist[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            logger.info("getElementHandleByXpath")
            let handle = await getElementHandleByXpath(auditlist[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify AccessPage', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to access page', async () => {
      reporter.startStep("When I navigate to access page");
      let result;
      result = await navigatePageByClick(leftpane.a.dashboardicon)
      expect(result).toBeTruthy()

      result = await performAction("hover", leftpane.span.accountBook)
      expect(result).toBeTruthy()

      await page.waitFor(2000)
      await page.waitForXPath(leftpane.a.accessdashboard)
      expect(await screenshot("accountbook")).toBe(true)
      
      await page.waitFor(1000)
      result = await navigatePageByClick(leftpane.a.accessdashboard)
      expect(result).toBeTruthy()
      expect(result < 10.0).toBe(true)

      reporter.startStep(`Navigation time is ${result} is less than 10s`)
      reporter.endStep()

      expect(await screenshot("accesslist")).toBe(true)
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in accesslist) {
        for (const tag in accesslist[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(accesslist[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify OrgPage', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to org page', async () => {
      reporter.startStep("When I navigate to org page");
      let result;
      result = await navigatePageByClick(leftpane.a.orginfo)
      expect(result).toBeTruthy()
      expect(result < 10.0).toBe(true)

      reporter.startStep(`Navigation time is ${result} is less than 10s`)
      reporter.endStep()

      expect(await screenshot("orgpage")).toBe(true)
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in orgpage) {
        for (const tag in orgpage[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(orgpage[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });



  test('Verify UserProfilePage', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to userprofile page', async () => {
      reporter.startStep("When I navigate to userprofile page");
      let result;
      result = await navigatePageByClick(leftpane.a.userprofilepage)
      expect(result).toBeTruthy()
      expect(result < 10.0).toBe(true)

      reporter.startStep(`Navigation time is ${result} is less than 10s`)
      reporter.endStep()

      expect(await screenshot("userprofilepage")).toBe(true)
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in userprofilepage) {
        for (const tag in userprofilepage[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(userprofilepage[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify SpecificUserProfilePage for <Name>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/^I navigate to specificuserprofile page of (.*)$/, async (Name) => {
      let result;
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let name_list  = Name.split(".")
      Name = config[name_list[0]][name_list[1]]
      logger.info("Username is : " + Name)
      result = await navigatePageByClick(leftpane.a.userdashboard)
      expect(result).toBeTruthy()

      await page.waitForXPath(userlist.search.search_expand)
      result = await navigatePageByClick(userlist.search.search_expand)
      expect(result).toBeTruthy()

      result = await performAction("type", user_search.full_name.name_input, "page", Name)
      expect(result).toBeTruthy()

      result = await performAction("click", userlist.search.search_button)
      expect(result).toBeTruthy()

      expect(await verifyLoadingSpinner()).toBeTruthy()

      let handle = await getElementHandleByXpath("//td//a[text()='" + Name + "']")
      expect(handle.length).toBe(1)

      result = await navigatePageByClick("//a[text()='" + Name + "']")
      expect(result).toBeTruthy()
      await screenshot('userprofilepage')
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in userprofilepage) {
        for (const tag in userprofilepage[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(userprofilepage[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify DeviceProfilePage for <devicename>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/^I navigate to deviceprofile page of (.*)$/, async (devicename) => {
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let device_list  = devicename.split(".")
      devicename = config[device_list[0]][device_list[1]]
      logger.info("Devicename is : " + devicename)
      let result;
      result = await navigatePageByClick(leftpane.a.devicedashboard)
      expect(result).toBeTruthy()

      await page.waitForXPath(devicelist.search.search_expand)
      result = await navigatePageByClick(devicelist.search.search_expand)
      expect(result).toBeTruthy()

      result = await performAction("type", device_search.name.device_name_input, "page", devicename)
      expect(result).toBeTruthy()

      result = await performAction("click", devicelist.search.search_button)
      expect(result).toBeTruthy()

      expect(await verifyLoadingSpinner()).toBe(true)

      let handle = await getElementHandleByXpath("//td//a[text()='" + devicename + "']")
      expect(handle.length).toBe(1)

      result = await navigatePageByClick("//a[text()='" + devicename + "']")
      expect(result).toBeTruthy()

      result = await screenshot('Deviceprofilepage')
      expect(result).toBeTruthy()
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in deviceprofilepage) {
        for (const tag in deviceprofilepage[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(deviceprofilepage[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify GroupProfilePage for <groupname>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/^I navigate to groupprofile page of (.*)$/, async (groupname) => {
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let group_list  = groupname.split(".")
      groupname = config[group_list[0]][group_list[1]]
      logger.info("Groupname is : " + groupname)
      let result;
      result = await navigatePageByClick(leftpane.a.groupdashboard)
      expect(result).toBeTruthy()
      // Search for the group in group list
      await page.waitForXPath(grouplist.search.search_expand)
      result = await navigatePageByClick(grouplist.search.search_expand)
      expect(result).toBeTruthy()
      result = await performAction("type", group_search.name.name_input, "page", groupname)
      expect(result).toBeTruthy()
      result = await performAction("click", grouplist.search.search_button)
      expect(result).toBeTruthy()
      expect(await verifyLoadingSpinner()).toBe(true)
      //Click on the group name
      let handle = await getElementHandleByXpath("//td//a[text()='" + groupname + "']")
      expect(handle.length).toBe(1)
      result = await performAction("click", "//a[text()='" + groupname + "']")
      expect(result).toBeTruthy()
      result = await screenshot('Groupprofilepage')
      expect(result).toBeTruthy()
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in groupprofilepage) {
        for (const tag in groupprofilepage[key]) {
          if (tag.startsWith('_') != true && key !== 'role' ) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(groupprofilepage[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify UserDetail for <Name>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/I navigate to userdetail page of (.*)$/, async (Name) => {
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let name_list  = Name.split(".")
      Name = config[name_list[0]][name_list[1]]
      logger.info("Username is : " + Name)
      let result;
      result = await navigatePageByClick(leftpane.a.userdashboard)
      expect(result).toBeTruthy()

      await page.waitForXPath(userlist.search.search_expand)
      result = await navigatePageByClick(userlist.search.search_expand)
      expect(result).toBeTruthy()

      result = await performAction("type", user_search.full_name.name_input, "page", Name)
      expect(result).toBeTruthy()

      result = await performAction("click", userlist.search.search_button)
      expect(result).toBeTruthy()
      
      expect(await verifyLoadingSpinner()).toBe(true)

      let handle = await getElementHandleByXpath("//td//a[text()='" + Name + "']")
      expect(handle.length).toBe(1)

      result = await performAction("click", "//a[text()='" + Name + "']")
      expect(result).toBeTruthy()

      result = await performAction("click", userprofilepage.user.username_expand)
      expect(result).toBeTruthy()

      // Commented this due to error caused during changing screen resolution/captureBeyondViewport(in screenshot function)
      //result = await screenshot('Userdetailpage')
      //expect(result).toBeTruthy()

      result = await capturePageScreenshot('Userdetailpage')
      expect(result).toBeTruthy()
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in user_detail) {
        for (const tag in user_detail[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(user_detail[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify DeviceDetailPage for <devicename>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/^I navigate to devicedetail page of (.*)$/, async (devicename) => {
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let device_list  = devicename.split(".")
      devicename = config[device_list[0]][device_list[1]]
      logger.info("Devicename is : " + devicename)
      let result;
      result = await navigatePageByClick(leftpane.a.devicedashboard)
      expect(result).toBeTruthy()

      await page.waitForXPath(devicelist.search.search_expand)
      result = await navigatePageByClick(devicelist.search.search_expand)
      expect(result).toBeTruthy()

      result = await performAction("type", device_search.name.device_name_input, "page", devicename)
      expect(result).toBeTruthy()

      result = await performAction("click", devicelist.search.search_button)
      expect(result).toBeTruthy()

      expect(await verifyLoadingSpinner()).toBe(true)

      let handle = await getElementHandleByXpath("//td//a[text()='" + devicename + "']")
      expect(handle.length).toBe(1)

      result = await performAction("click", "//a[text()='" + devicename + "']")
      expect(result).toBeTruthy()

      result = await performAction("click", deviceprofilepage.device.device_expand)
      expect(result).toBeTruthy()

      result = await screenshot('Devicedetailpage')
      expect(result).toBeTruthy()
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in device_detail) {
        for (const tag in device_detail[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(device_detail[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify GroupDetailPage for <groupname>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/^I navigate to groupdetail page of (.*)$/, async (groupname) => {
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let group_list  = groupname.split(".")
      groupname = config[group_list[0]][group_list[1]]
      logger.info("Groupname is : " + groupname)
      let result;

      result = await navigatePageByClick(leftpane.a.groupdashboard)
      expect(result).toBeTruthy()

      await page.waitForXPath(grouplist.search.search_expand)
      result = await navigatePageByClick(grouplist.search.search_expand)
      expect(result).toBeTruthy()

      result = await performAction("type", group_search.name.name_input, "page", groupname)
      expect(result).toBeTruthy()

      result = await performAction("click", grouplist.search.search_button)
      expect(result).toBeTruthy()

      expect(await verifyLoadingSpinner()).toBe(true)

      let handle = await getElementHandleByXpath("//td//a[text()='" + groupname + "']")
      expect(handle.length).toBe(1)

      result = await performAction("click", "//a[text()='" + groupname + "']")
      expect(result).toBeTruthy()

      result = await performAction("click", groupprofilepage.group.group_expand)
      expect(result).toBeTruthy()

      await delay(5000)
      // Clicking on group expand
      const groupElem = await page.$x(userprofilepage.user.username_val)
      logger.debug(groupElem.length)
      if (groupElem.length !== 0) {
          await groupElem[0].click()
      }

      result = await screenshot('Groupdetailpage')
      expect(result).toBeTruthy()
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in group_detail) {
        for (const tag in group_detail[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(group_detail[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      reporter.endStep();
    });
  });

  test('Verify AddUser', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to add user page', async () => {
      reporter.startStep("When I navigate to add user page");
      let result;
      result = await navigatePageByClick(leftpane.a.userdashboard)
      expect(result).toBeTruthy()
      
      result = await performAction("click", userlist.button.add_user)
      expect(result).toBeTruthy()
      
      result = await screenshot("adduser")
      expect(result).toBeTruthy()
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in adduser) {
        for (const tag in adduser[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(adduser[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      let result = await performAction("click", adduser.details.cancel_button)
      expect(result).toBeTruthy()
      reporter.endStep();

    });
  });

  test('Verify AddDevice', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to add device page', async () => {
      reporter.startStep("When I navigate to add device page");
      let result;
      result = await performAction("click", leftpane.a.devicedashboard)
      expect(result).toBeTruthy()
      
      result = await performAction("click", devicelist.button.add_device)
      expect(result).toBeTruthy()
      
      result = await screenshot("adddevice")
      expect(result).toBeTruthy()
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in adddevice) {
        for (const tag in adddevice[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(adddevice[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      let result = await performAction("click", adddevice.details.cancel_button)
      expect(result).toBeTruthy()
      reporter.endStep();
    });
  });

  test('Verify AddGroup', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to add group page', async () => {
      reporter.startStep("When I navigate to add group page");
      let result;
      result = await navigatePageByClick(leftpane.a.groupdashboard)
      expect(result).toBeTruthy()
      
      result = await performAction("click", grouplist.button.add_group)
      expect(result).toBeTruthy()
      
      result = await screenshot("addgroup")
      expect(result).toBeTruthy()
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in addgroup) {
        for (const tag in addgroup[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(addgroup[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      let result = await navigatePageByClick(addgroup.details.cancel_button)
      expect(result).toBeTruthy()
      reporter.endStep();
    });
  });

  test('Verify AddEndpointPage for <devicename>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/^I navigate to add endpoint page of (.*)$/, async (devicename) => { 
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let device_list  = devicename.split(".")
      devicename = config[device_list[0]][device_list[1]]     
      logger.info("Devicename is : " + devicename)
      let result;

      result = await navigatePageByClick(leftpane.a.devicedashboard)
      expect(result).toBeTruthy()

      await page.waitForXPath(devicelist.search.search_expand)
      result = await navigatePageByClick(devicelist.search.search_expand)
      expect(result).toBeTruthy()

      result = await performAction("type", device_search.name.device_name_input, "page", devicename)
      expect(result).toBeTruthy()

      result = await performAction("click", devicelist.search.search_button)
      expect(result).toBeTruthy()

      expect(await verifyLoadingSpinner()).toBe(true)

      let handle = await getElementHandleByXpath("//td//a[text()='" + devicename + "']")
      expect(handle.length).toBe(1)
      
      result = await performAction("click", "//a[text()='" + devicename + "']")
      expect(result).toBeTruthy()

      result = await navigatePageByClick(deviceprofilepage.device.device_expand)
      expect(result).toBeTruthy()
      
      result = await performAction("click", device_detail.action.edit_endpoint)
      expect(result).toBeTruthy()
      
      result = await screenshot('addendpoint')
      expect(result).toBeTruthy()
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in addendpoint) {
        for (const tag in addendpoint[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(addendpoint[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      let result = await performAction("click", addendpoint.details.cancel_button)
      expect(result).toBeTruthy()
      reporter.endStep();
    });
  });

  test('Verify UserRoleAssociationPage for <Name>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/^I navigate to user role association page of (.*)$/, async (Name) => {
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let name_list  = Name.split(".")
      Name = config[name_list[0]][name_list[1]]
      logger.info("Username is : " + Name)
      let result;
      result = await navigatePageByClick(leftpane.a.userdashboard)
      expect(result).toBeTruthy()

      await page.waitForXPath(userlist.search.search_expand)
      result = await navigatePageByClick(userlist.search.search_expand)
      expect(result).toBeTruthy()

      result = await performAction("type", user_search.full_name.name_input, "page", Name)
      expect(result).toBeTruthy()

      result = await performAction("click", userlist.search.search_button)
      expect(result).toBeTruthy()

      expect(await verifyLoadingSpinner()).toBe(true)
    
      let handle = await getElementHandleByXpath("//td//a[text()='" + Name + "']")
      expect(handle.length).toBe(1)
      
      result = await performAction("click", "//a[text()='" + Name + "']")
      expect(result).toBeTruthy()

      result = await navigatePageByClick(userprofilepage.user.username_expand)
      expect(result).toBeTruthy()
      
      result = await navigatePageByClick(user_detail.action.edit_role)
      expect(result).toBeTruthy()
      
      // Commenting this due to error caused during changing screen resolution/captureBeyondViewport(in screenshot function)
      //result = await screenshot('Userroleassociationpage')
      //expect(result).toBeTruthy()

      result = await capturePageScreenshot('Userroleassociationpage')
      expect(result).toBeTruthy()


      
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in user_role_association) {
        for (const tag in user_role_association[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(user_role_association[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      let result = await performAction("click", user_role_association.details.cancel_button)
      expect(result).toBeTruthy()
      reporter.endStep();
    });
  });

  test('Verify DeviceRoleAssociationPage for <devicename>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/^I navigate to device role association page of (.*)$/, async (devicename) => {
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let device_list  = devicename.split(".")
      devicename = config[device_list[0]][device_list[1]]
      logger.info("Devicename is : " + devicename)
      let result;
      result = await navigatePageByClick(leftpane.a.devicedashboard)
      expect(result).toBeTruthy()
      
      await page.waitForXPath(devicelist.search.search_expand)
      result = await navigatePageByClick(devicelist.search.search_expand)
      expect(result).toBeTruthy()

      result = await performAction("type", device_search.name.device_name_input, "page", devicename)
      expect(result).toBeTruthy()

      result = await performAction("click", devicelist.search.search_button)
      expect(result).toBeTruthy()

      expect(await verifyLoadingSpinner()).toBe(true)

      result = await performAction("click", "//a[text()='" + devicename + "']")
      expect(result).toBeTruthy()

      result = await navigatePageByClick(deviceprofilepage.device.device_expand)
      expect(result).toBeTruthy()
      
      result = await performAction("click", device_detail.action.edit_role)
      expect(result).toBeTruthy()

      result = await screenshot('Deviceroleassociationpage')
      expect(result).toBeTruthy()
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in device_role_association) {
        for (const tag in device_role_association[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(device_role_association[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      let result = await performAction("click", device_role_association.details.cancel_button)
      expect(result).toBeTruthy()
      reporter.endStep();
    });
  });

  test('Verify UserPasswordResetPage for <Name>', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when(/^I navigate to user password reset page of (.*)$/, async (Name) => {
      // Get the config details for username available in setup
      const config = await getEnvConfig()
      let name_list  = Name.split(".")
      Name = config[name_list[0]][name_list[1]]
      logger.info("Username is : " + Name)
      let result;
      result = await navigatePageByClick(leftpane.a.userdashboard)
      expect(result).toBeTruthy()

      await page.waitForXPath(userlist.search.search_expand)
      result = await navigatePageByClick(userlist.search.search_expand)
      expect(result).toBeTruthy()

      result = await performAction("type", user_search.full_name.name_input, "page", Name)
      expect(result).toBeTruthy()

      result = await performAction("click", userlist.search.search_button)
      expect(result).toBeTruthy()

      expect(await verifyLoadingSpinner()).toBe(true)

      let handle = await getElementHandleByXpath("//td//a[text()='" + Name + "']")
      expect(handle.length).toBe(1)

      result = await performAction("click", "//a[text()='" + Name + "']")
      expect(result).toBeTruthy()

      result = await navigatePageByClick(userprofilepage.user.username_expand)
      expect(result).toBeTruthy()
      
      result = await navigatePageByClick(user_detail.action.password_reset)
      expect(result).toBeTruthy()

      // Removing this due to error caused during changing screen resolution/captureBeyondViewport(in screenshot function)
      //result = await screenshot('Userpasswordresetpage')
      //expect(result).toBeTruthy()

      result = await capturePageScreenshot('Userpasswordresetpage')
      expect(result).toBeTruthy()
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in password_reset) {
        for (const tag in password_reset[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(password_reset[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      let result = await performAction("click", password_reset.input.cancel_button)
      expect(result).toBeTruthy()
      reporter.endStep();
    });
  });

  test('Verify AddAuthDomainPage', async ({
    given,
    when,
    then
  }) => {
    givenAdminLoggedIn(given)
    when('I navigate to Add Auth Domain Page', async () => {
      reporter.startStep("I navigate to Add Auth Domain Page");
      let result;
      result = await navigatePageByClick(leftpane.a.orginfo)
      expect(result).toBeTruthy()

      result = await performAction("click", orgpage.button.add_auth_domain)
      expect(result).toBeTruthy()

      result = await screenshot("addauthdomain")
      expect(result).toBeTruthy()
      reporter.endStep();
    });
    then('All layouts must be present', async () => {
      reporter.startStep("Then All layouts must be present");
      for (const key in add_auth_domain_page) {
        for (const tag in add_auth_domain_page[key]) {
          if (tag.startsWith('_') != true) {
            reporter.startStep(`Verifying ${key} ${tag}`);
            let handle = await getElementHandleByXpath(add_auth_domain_page[key][tag])
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            reporter.endStep();
          }
        }
      }
      let result = await performAction("click", add_auth_domain_page.add.cancel_button)
      expect(result).toBeTruthy()      
      reporter.endStep();
    });
  });
});
