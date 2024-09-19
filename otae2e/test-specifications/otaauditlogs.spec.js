import { defineFeature, loadFeature } from 'jest-cucumber';
import { Login } from '../helper/otalogin';
import { createPDF, customScreenshot, delay,  getEnvConfig, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, goTo } from '../../e2e/utils/utils';
import { thenDeleteUser,whenEnableMfaforuser,whenDeleteUser,whenEnableuserstatus,whenDisableuserstatus,whenResetMfaforuser, thenChangeUserGroup,whenResetUserPassword,whenDisableMfaforuser,whenChangeUserGroup,thenResetUserPasswordwithwrongcnfpwd,thenLoginwithwrongpassword,thenResetUserPassword, thenDisableMfaforuser,whenOptionallevelorgMfa, whenEnablelevelorgMfa, thenLoginandsetupMFA, thenOptionalorgMfa, thenemailverify, thenEnableMfaforuser, thenGetUsername,thenDisableorgMfa,thenEnableorgMfa, whenIAddUser,thenLoginwithnewUserMFA,thenLoginwithnewUserMFAdisabled,confirmpsw_error, email_error, firstname_error, lastname_error, phone_error, gotoAddUser, password_error, thenCheckUser,whenIEditUser } from '../helper/otauser';
import { logger } from '../log.setup';
import { add_auth_domain_page,otalogin, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage,deviceprofilepage,adddevice,addendpoint,addgroup,adduser,user_role_association,device_role_association,user_detail,device_detail,group_detail,endpoint_review, user_search, device_search,group_search } from '../constants/locators';
import {  givenIamLoggedIn } from './otashared-steps';
import { thenDeleteDevice, whenChangeConnectionendpoint, whenDeleteDevice ,thenChangeConnectionendpoint,whenIAddDeviceUsergroup, thenIAddDeviceUsergroup, thenICheckDevice, thenIRemoveDeviceUsergroup,whenIAddDevice, device_error, ip_error, host_error, city_error, country_error, gotoAddDevice, whenIAccessDevice } from '../helper/otadevice'
import { user } from 'openstack-client/lib/keystone';
import { thenVerifyAuditLogs } from '../helper/otaaudit';
const { PendingXHR } = require('pending-xhr-puppeteer');
import {whenIAddGroup,whenIEditGroup,whenIDeleteGroup} from '../helper/otagroup';



const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

let OStoken, db, consoleSpy

//const testIotium = require('../src/testIotium');
const feature = loadFeature('./otae2e/features/otaauditlogs.feature',
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              },
                tagFilter: '@otaAuditLogs1',
            });

            let reporter;
defineFeature(feature, test => {

    afterEach(async () => {

        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        logger.info("After Each ");
        logger.info(performanceTiming);
        //await goTo(global.homeurl+'dashboard')
        //await delay(2000)
        //logger.info("After Each before snap");
        //await customScreenshot('afterEach.png', 1920, 1200) 
        //logger.info("After Each after snap");
        //await delay(2000)
        
    })

    beforeEach(async () => {
        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        logger.info("Before Each ");
        jest.setTimeout(1200000)
    })

    afterAll(async () => {
      try {
        await logger.info('After ALL')
        try {
          let handle  = await getElementHandleByXpath(leftpane.a.userdashboard)
          expect(handle.length).toBe(1)
          if (handle.length == 1) {
            logger.info("matched user element1");
            await getElementHandleByXpath(leftpane.svg.myprofile)
            await performAction("hover",leftpane.svg.myprofile)
            await performAction('click',leftpane.a._logout)
            await page.waitFor(2000)
            //perf
            await customScreenshot('loggedout.png', 1920, 1200) 
            logger.info("matched user element 6");
          }
        } catch(err) {
          logger.info("Ignorable exception, possibly have already logged out");
        }
        //await checkConsoleErrors();
        //Make a PDF of the tests by merging all screenshots into the pdf
        await createPDF(global.testStart,'otaauditlogs')
        //Retrive the coverage objects
        //This is for stopping JS and CSS usages
        //const [jsCoverage, cssCoverage] = await Promise.all([
        //   page.coverage.stopJSCoverage(),
        //   page.coverage.stopCSSCoverage(),
        //]);

        //Stop perf tracing
        //await page.tracing.stop();
        //trying HAR
        logger.info("matched user element 7");
        await har.stop(); 
        logger.info("matched user element 8");
        //get all the console logs

        logger.info('Ending After all')
      }
      catch(err) {
        logger.info(err);
        }
  
      })

    beforeAll(async () => {
      try {

        jest.setTimeout(1200000)
        page.setDefaultNavigationTimeout(1200000); 
        logger.info('Before all')

        //moving the login from setup to each test
        let login
        login = new Login();
        logger.info("global.env = "+global.env)
        await login.launch(global.env, global.scope) 
        //moving the login from setup to each test
        /*
        await (pagePage.captureScreenshot
          .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
          .then(() => logger.info('Waiting In before ALL berfore proceeding')))
        */
        await getElementHandleByXpath(leftpane.a.userdashboard)
        logger.info("Login Successfull")
        reporter = global.reporter
        //global.reporter
        await customScreenshot('beforeAll.png', 1920, 1200) 
        //This is for recording JS and CSS usages
        //await Promise.all([
        //  page.coverage.startJSCoverage(),
        //  page.coverage.startCSSCoverage()
        //]);
        //performance tracing
        //await page.tracing.start({ path: './reports/otaivalidation'+global.testStart+'_tracing.json' });
        //trying HAR
        await har.start({ path: './reports/otaauditlogs'+global.testStart+'.har', saveResponse: true });
        //for redirecting console logs
        // jest.clearAllMocks();
        //consoleSpy = jest.spyOn(console, 'log')


      }
      catch(err) {
        logger.info(err);
        }
      })


      test('User Create Audit logs',({
        given,
        when,
        then,
        and,
      }) => 
      {
         var flag = false
          givenIamLoggedIn(given)
          whenIAddUser(when)
          thenVerifyAuditLogs(then)
          thenVerifyAuditLogs(then)
      });

      test('UserGroup Remove Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenChangeUserGroup(when)
          thenVerifyAuditLogs(then)
      });

      test('User update Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenIEditUser(when)
          thenVerifyAuditLogs(then)
      });

      test('User Password reset Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenResetUserPassword(when)
          thenVerifyAuditLogs(then)
      });

      test('User MFA enable Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenEnableMfaforuser(when)
          thenVerifyAuditLogs(then)
      });
      test('User MFA reset Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenEnableMfaforuser(when)
          whenResetMfaforuser(when)
          thenVerifyAuditLogs(then)
      });
      test('User MFA Disable Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenDisableMfaforuser(when)
          thenVerifyAuditLogs(then)
      });
      test('User Status Disable Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenDisableuserstatus(when)
          thenVerifyAuditLogs(then)
      });
      test('User Status Enable Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenEnableuserstatus(when)
          thenVerifyAuditLogs(then)
      });
      test('Device and connection endpoint create Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenIAddDevice(when)
          thenVerifyAuditLogs(then)
          thenVerifyAuditLogs(then)
      });
      test('Usergroup and connection endpoint association Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenIAddDeviceUsergroup(when)
          thenVerifyAuditLogs(then)
      });
      test('Device  Connection endpoint removal audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenChangeConnectionendpoint(when)
          thenVerifyAuditLogs(then)
      });
      test('Device Delete Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenDeleteDevice(when)
          thenVerifyAuditLogs(then)
      });
      test('Group Create Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenIAddGroup(when)
          thenVerifyAuditLogs(then)
      });
      test('Group Edit Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenIEditGroup(when)
          thenVerifyAuditLogs(then)
      });
      test('Group Delete Audit logs',({
        given,
        when,
        then,
      }) =>
      {
         var flag = false
          givenIamLoggedIn(given)
          whenIDeleteGroup(when)
          thenVerifyAuditLogs(then)
      });




    });