import { defineFeature, loadFeature } from 'jest-cucumber';
import { Login } from '../helper/otalogin';
import { createPDF, customScreenshot, delay,  getEnvConfig, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, goTo } from '../../utils/utils';
import { thenDeleteUser, thenChangeUserGroup,thenResetUserPasswordwithwrongcnfpwd,thenLoginwithwrongpassword,thenResetUserPassword, thenDisableMfaforuser,whenOptionallevelorgMfa, whenEnablelevelorgMfa, thenLoginandsetupMFA, thenOptionalorgMfa, thenemailverify, thenEnableMfaforuser, thenGetUsername,thenDisableorgMfa,thenEnableorgMfa, whenIAddUser,thenLoginwithnewUserMFA,thenLoginwithnewUserMFAdisabled,confirmpsw_error, email_error, firstname_error, lastname_error, phone_error, gotoAddUser, password_error, thenCheckUser } from '../helper/otauser';
import { logger } from '../log.setup';
import { add_auth_domain_page,otalogin, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage,deviceprofilepage,adddevice,addendpoint,addgroup,adduser,user_role_association,device_role_association,user_detail,device_detail,group_detail,endpoint_review, user_search, device_search,group_search } from '../constants/locators';
import {  givenIamLoggedIn } from './otashared-steps';
import { thenDeleteDevice, thenChangeConnectionendpoint, thenIAddDeviceUsergroup, thenICheckDevice, thenIRemoveDeviceUsergroup,whenIAddDevice, device_error, ip_error, host_error, city_error, country_error, gotoAddDevice, whenIAccessDevice } from '../helper/otadevice'
import { user } from 'openstack-client/lib/keystone';
const { PendingXHR } = require('pending-xhr-puppeteer');



const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

let OStoken, db, consoleSpy

//const testIotium = require('../src/testIotium');
const feature = loadFeature('./otae2e/features/otauivalidation.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              },
                //tagFilter: '@otauivalidation',
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
        await createPDF(global.testStart,'otauivalidation')
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
        await har.start({ path: './reports/otauivalidation'+global.testStart+'.har', saveResponse: true }); 
        //for redirecting console logs
        // jest.clearAllMocks();
        //consoleSpy = jest.spyOn(console, 'log')


      }
      catch(err) {
        logger.info(err);
        }
      })

      test('Check for errors in Add User page',({
        given,
        when,
        then, 
        
      }) => 
      {
          var flag = false
          givenIamLoggedIn(given)
          when(/^I test add user errors$/, async (table) => {
            logger.info("Add User UI error validation")
            await gotoAddUser()
            reporter.startStep("Add User UI error validation");
            logger.info("In Add user Page")
            for (let i=0; i < table.length; i++) {
              let row = table[i]
              reporter.startStep("UI validation for field "+ row.fieldName +" and condition- " + row.condition);
              if (row.fieldName == 'firstname') {
                if (row.condition == 'splchar') {
                  await performAction("type", adduser.details.first_name, "page", "test$")
                  await performAction("click",adduser.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+firstname_error+"']")
                  expect(handle.length).toBe(1)
               }
              }
              if (row.fieldName == 'lastname') {
                if (row.condition == 'splchar') {
                  await performAction("type", adduser.details.last_name, "page", "check$")
                  await performAction("click",adduser.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+lastname_error+"']")
                  expect(handle.length).toBe(1)
               }
              }
              if (row.fieldName == 'email') {
                if (row.condition == 'no@') {
                  await performAction("type", adduser.details.email, "page", "test")
                  await performAction("click",adduser.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+email_error+"']")
                  expect(handle.length).toBe(1)                
               }
              }
              if (row.fieldName == 'password') {
                if (row.condition == 'length') {
                  await performAction("click",adduser.details.auth_domain)
                  await performAction("click","//div[text()='OTA Internal']")
                  await performAction("type",adduser.details._password,"page","test")
                  await performAction("click",adduser.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+password_error+"']")
                  expect(handle.length).toBe(2)
               }
              }
              if (row.fieldName == 'confirmpsw') {
                if (row.condition == 'length') {
                  await performAction("type",adduser.details._confirm_password,"page","tes")
                  await performAction("click",adduser.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+confirmpsw_error+"']")
                  expect(handle.length).toBe(2)
               }
              }
              if (row.fieldName == 'phone') {
                if (row.condition == 'alphanum') {
                  await performAction("type",adduser.details.phone,"page","@123tes")
                  await performAction("click",adduser.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+phone_error+"']")
                  expect(handle.length).toBe(1)
               }
              }
              await delay(1000)
              reporter.endStep()
              }
              
              let screenshot = await customScreenshot('adduser_error.png', 1920, 1200)
              reporter.addAttachment("Adduser uivalidation Errors", screenshot, "image/png");
              await performAction("click",adduser.details.cancel_button)
              await page.waitFor(1000)
              logger.info('clicked the cancel in Add user');
              flag = true //ensure the test is made as pass only when all above executes without failure
              reporter.endStep()

          })
          then(/UI should throw validation errors$/, async() => {
            logger.info('In Then UI should throw validation errors');
            reporter.startStep('Then UI should throw validation errors');
            reporter.endStep()
          });
          
      });


      test('Check for mandatory fields in Add User page',({
        given,
        when,
        then, 
        
      }) => 
      {
         var flag = false
          givenIamLoggedIn(given)
          when(/^I test add user for mandatory fields$/, async (table) => {
            logger.info("Add User UI error validation")
            await gotoAddUser()
            reporter.startStep("Add User UI mandatory fields validation");
            logger.info("In Add user Page")
            await performAction("click",adduser.details.submit_button)
            let handle  = await getElementHandleByXpath("//div[text()=' First Name is mandatory']")
            expect(handle.length).toBe(1)
            let handle1  = await getElementHandleByXpath("//div[text()=' Last Name is mandatory']")
            expect(handle1.length).toBe(1)
            let handle2  = await getElementHandleByXpath("//div[text()='Email is mandatory']")
            expect(handle2.length).toBe(1)
            let handle3  = await getElementHandleByXpath("//div[text()=' Password is mandatory']")
            expect(handle3.length).toBe(1)
            let handle4  = await getElementHandleByXpath("//div[text()=' Confirm Password is mandatory']")
            expect(handle4.length).toBe(1)
            logger.info("Proper message is shown for mandatory fields")
            let screenshot = await customScreenshot('adduserman_error.png', 1920, 1200)
            reporter.addAttachment("Adduser uivalidation Errors", screenshot, "image/png");
              //Cancel from add user page
            await performAction("click",adduser.details.cancel_button)
            await page.waitFor(1000)
            logger.info('clicked the cancel in Add user');
            flag = true //ensure the test is made as pass only when all above executes without failure
          })
          then(/UI should throw validation errors$/, async() => {
            logger.info('In Then UI should throw validation errors');
            reporter.startStep('Then UI should throw validation errors');
            reporter.endStep()
          });
          
      });

      test('Check for errors in Add Device page',({
        given,
        when,
        then, 
        
      }) => 
      {
         var flag = false
          givenIamLoggedIn(given)
          when(/^I test add device errors$/, async (table) => {
            logger.info("Add Device UI error validation")
            await gotoAddDevice()
            reporter.startStep("Add Device UI error validation");
            logger.info("In Add Device Page")
            for (let i=0; i < table.length; i++) {
              let row = table[i]
              reporter.startStep("UI validation for field "+ row.fieldName +" and condition- " + row.condition);
              if (row.fieldName == 'device') {
                if (row.condition == 'splchar') {
                  await performAction("type",adddevice.details.name,"page","@@$")
                  await performAction("click",adddevice.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+device_error+"']")
                  expect(handle.length).toBe(1)
                  logger.info("Device name error verified")
                }
              }
              if (row.fieldName == 'ip') {
                if (row.condition == 'splchar') {
                  await performAction("type",adddevice.details.ip_address,"page","che@")
                  await performAction("click",adddevice.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+ip_error+"']")
                  expect(handle.length).toBe(1)
                  logger.info("IP error verified") 
                }
              }
              if (row.fieldName == 'host') {
                if (row.condition == 'splchar') {
                  await performAction("type",adddevice.details.hostname,"page","@@$")
                  await performAction("click",adddevice.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+host_error+"']")
                  expect(handle.length).toBe(1)
                  logger.info("hostname error verified")
               }
              }
              if (row.fieldName == 'city') {
                if (row.condition == 'splchar') {
                  await performAction("type",adddevice.details.city,"page","@@$")
                  await performAction("click",adddevice.details.submit_button)
                  let handle  = await getElementHandleByXpath("//div[text()='"+city_error+"']")
                  expect(handle.length).toBe(1)
                  logger.info("city name error verified") 
              }
              }
              
              await delay(1000)
              reporter.endStep()
              }

              let screenshot = await customScreenshot('adddevice_error.png', 1920, 1200)
              reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
              //Cancel from add device page
              await performAction("click",adddevice.details.cancel_button)
              await page.waitFor(1000)
              logger.info('clicked the cancel in Add Device');
              flag = true //ensure the test is made as pass only when all above executes without failure

          })
          then(/UI should throw validation errors$/, async() => {
            logger.info('In Then UI should throw validation errors');
            reporter.startStep('Then UI should throw validation errors');
            reporter.endStep()
          });
          
      });

      test('Check for mandatory fields in Add Device page',({
        given,
        when,
        then, 
        
      }) => 
      {
         var flag = false
          givenIamLoggedIn(given)
          when(/^I test add device for mandatory fields$/, async (table) => {
            logger.info("Add Device UI error validation")
            await gotoAddDevice()
            reporter.startStep("Add Device UI mandatory fields validation");
            logger.info("In Add Device Page")
            await performAction("click",adddevice.details.submit_button)
            await page.waitFor(1000)
            await getElementHandleByXpath("//div[text()='Device Name is mandatory']")
            await getElementHandleByXpath("//div[text()='IP is mandatory']")
            await getElementHandleByXpath("//div[text()='Host Name is mandatory']")
            await getElementHandleByXpath("//div[text()='Description is mandatory']")
            await getElementHandleByXpath("//div[text()='City is mandatory']")
            await getElementHandleByXpath("//div[text()='Country is mandatory']")
            logger.info("Proper message is shown for mandatory fields")
            let screenshot = await customScreenshot('adddevice_error.png', 1920, 1200)
            reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
              //Cancel from add device page
            await performAction("click",adddevice.details.cancel_button)
            logger.info('clicked the cancel in Add Device');
            flag = true //ensure the test is made as pass only when all above executes without failure
          })
          then(/UI should throw validation errors$/, async() => {
            logger.info('In Then UI should throw validation errors');
            reporter.startStep('Then UI should throw validation errors');
            reporter.endStep()
          });
          
      });

      test('UserWorkflow',({
        // user work flow without usergroup
        given,
        when,
        then,
        and,
        
      }) => 
      {
         var flag = false
          givenIamLoggedIn(given)
          whenIAddUser(when)
          thenCheckUser(then)
          thenGetUsername(then)
          thenChangeUserGroup(then)
          thenDeleteUser(then)
      });

      test('DeviceWorkflow',({
        given,
        when,
        then,
        and,
        
      }) => 
      {
         var flag = false
          givenIamLoggedIn(given)
          whenIAddDevice(when)
          thenIAddDeviceUsergroup(then)
          thenICheckDevice(then)
          //thenIRemoveDeviceUsergroup(then)
          thenChangeConnectionendpoint(then)
          thenIAddDeviceUsergroup(then)
          thenDeleteDevice(then)
      });

          test('MfaWorkflow',({
            // user work flow without usergroup
            given,
            when,
            and,
            then,            
          }) => 
          {
             var flag = false
             var username
             givenIamLoggedIn(given)
             whenOptionallevelorgMfa(when)
             whenIAddUser(when)
             thenEnableMfaforuser(then)
             thenemailverify(then)
             thenLoginandsetupMFA(then)
              });

          test('Mfauserdisable',({
                // user work flow without usergroup
                given,
                when,
                then,            
              }) => 
              {
                 var flag = false
                 var username
                 givenIamLoggedIn(given)
                 thenDisableMfaforuser(then)
                 thenLoginwithnewUserMFAdisabled(then)
                 thenLoginwithnewUserMFAdisabled(then)
                 thenDeleteUser(then)
                });  

          test('Mfauserenable',({
                // user work flow without usergroup
                given,
                when,
                then,            
              }) => 
              {
                 var flag = false
                 var username
                 givenIamLoggedIn(given)
                 whenIAddUser(when)
                 thenemailverify(then)
                 thenEnableMfaforuser(then)
                 thenLoginandsetupMFA(then)
                 thenLoginwithnewUserMFAdisabled(then)
                 thenDeleteUser(then)
                });           
          
          // Test case blocked due to OTQA-1108
          test('Mfadisable',({
            // user work flow without usergroup
            given,
            when,
            then,            
          }) => 
          {
             var flag = false
             var username
              givenIamLoggedIn(given)
              whenIAddUser(when)
              thenemailverify(then)
              thenEnableMfaforuser(then)
              thenDisableorgMfa(then)
              thenLoginwithnewUserMFAdisabled(then)
              thenLoginwithnewUserMFAdisabled(then)
              thenDeleteUser(then)
              });  
          //Test case blocked due to OTQA-1108
          test('Mfaenable',({
                // user work flow without usergroup
                given,
                when,
                then,            
              }) => 
              {
                 var flag = false
                 var username
                  givenIamLoggedIn(given)
                  whenIAddUser(when)
                  thenemailverify(then)
                  thenEnableorgMfa(then)
                  thenLoginandsetupMFA(then)
                  thenDisableorgMfa(then)
                  thenLoginwithnewUserMFAdisabled(then)
                  thenDeleteUser(then)
                  });        

          test('PasswordReset',({
            // user work flow without usergroup
            given,
            when,
            then,            
          }) => 
          {
             var flag = false
             var username
              givenIamLoggedIn(given)
              whenIAddUser(when)
              thenemailverify(then)
              thenResetUserPassword(then)
              thenLoginwithnewUserMFAdisabled(then)
              thenLoginwithnewUserMFAdisabled(then)
              thenDeleteUser(then)
              });
              
              test('Check for mandatory fields in Password Reset',({
                given,
                when,
                then, 
                
              }) => 
              {
                 var flag = false
                  givenIamLoggedIn(given)
                  when(/^I test password reset for mandatory fields$/, async (table) => {
                    logger.info("Password reset window validation")
                    await delay(3000)
                    await getElementHandleByXpath(dashboard.svg.loginuser)
                    await performAction("click",dashboard.svg.loginuser)
                    await delay(3000)
                    await getElementHandleByXpath(userprofilepage.user.username_expand)
                    await performAction("click",userprofilepage.user.username_expand)
                    await delay(1000)
                    await performAction("click",user_detail.action.password_reset)
                    await delay(1000)
                    await getElementHandleByXpath(password_reset.input.new_password)
                    await performAction("click",password_reset.input.submit_button)
                    let handle  = await getElementHandleByXpath("//div[text()='Please input your password!']")
                    expect(handle.length).toBe(1)
                    logger.info("Password error verified")
                    let handle1  = await getElementHandleByXpath("//div[text()='Please input new password!']")
                    expect(handle1.length).toBe(1)
                    logger.info("New Password error verified")
                    let handle2  = await getElementHandleByXpath("//div[text()='Please confirm the new password!']")
                    expect(handle2.length).toBe(1)
                    logger.info("Confirm Password error verified")
                    await performAction("click",password_reset.input.cancel_button)
                  })
                  then(/UI should throw validation errors$/, async() => {
                    logger.info('In Then UI should throw validation errors');
                    reporter.startStep('Then UI should throw validation errors');
                    reporter.endStep()
                  });
                  
              });


          test('Password reset without old password',({
                given,
                when,
                then, 
                
              }) => 
              {
                 var flag = false
                  givenIamLoggedIn(given)
                  when(/^I test password reset without old password$/, async (table) => {
                    logger.info("Password reset window validation")
                    await delay(3000)
                    await getElementHandleByXpath(dashboard.svg.loginuser)
                    await performAction("click",dashboard.svg.loginuser)
                    await delay(3000)
                    await getElementHandleByXpath(userprofilepage.user.username_expand)
                    await performAction("click",userprofilepage.user.username_expand)
                    await delay(1000)
                    await performAction("click",user_detail.action.password_reset)
                    await delay(1000)
                    await getElementHandleByXpath(password_reset.input.new_password)
                    await getElementHandleByXpath(password_reset.input.new_password)
                    await performAction("type",password_reset.input.new_password,"page",row.newpassword)
                    await performAction("type",password_reset.input.confirm_password,"page",row.newpassword)
                    let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
                    reporter.addAttachment("Reset password", screenshot, "image/png");
                    await performAction("click",password_reset.input.submit_button)
                    await delay(5000)
                    let del = await getElementHandleByXpath("//span[text()='New Password cannot be an old password ']")
                    if (del.length == 1) {
                      let screenshot1 = await customScreenshot('Usenamecheck1.png', 1920, 1200)
                      reporter.addAttachment("Password reset result", screenshot1, "image/png")
                      logger.info("User passwors reset is successful")
                    } else {
                        logger.error("User password reset failed")
                    }
                    await performAction("click",password_reset.input.cancel_button)
                  })
                  then(/UI should throw validation errors$/, async() => {
                    logger.info('In Then UI should throw validation errors');
                    reporter.startStep('Then UI should throw validation errors');
                    reporter.endStep()
                  });
                  
              });
              
              
          test('PasswordResetwithwrongconfirmpassword',({
            // user work flow without usergroup
            given,
            when,
            then,            
          }) => 
          {
             var flag = false
             var username
              givenIamLoggedIn(given)
              //whenIAddUser(when)
              thenResetUserPasswordwithwrongcnfpwd(then)
              //thenDeleteUser(then)
              });

            test('Deviceaccess',({
              // user work flow without usergroup
              given,
              when,
              then,            
            }) => 
            {
               var flag = false
               var username
                givenIamLoggedIn(given)
                whenIAccessDevice(when)
                });
                });
