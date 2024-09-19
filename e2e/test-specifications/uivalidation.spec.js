import { defineFeature, loadFeature } from 'jest-cucumber';
import { Login } from '../helper/login';
import { goToAddNetwork, networkcidr_error, networkendip_error, networkgwip_error, networkname_error, networkstartip_error } from '../helper/networks';
import { connectOS } from '../helper/node';
import { gotoAddSSHKey, name_del_error, name_error, sshkey_error } from '../helper/sshkey';
import { confirmpsw_error, email_error, email_info, fullname_error, gotoAddUser, password_error } from '../helper/user';
import { logger } from '../log.setup';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, expectToClick, goTo, closeModal } from '../../utils/utils';
import { andWhenNodeIs, givenIamLoggedIn, whenOrgis } from './shared-steps';
const { PendingXHR } = require('pending-xhr-puppeteer');



const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

let OStoken, db, consoleSpy

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/uivalidation.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              }
                //tagFilter: '@UIValidation',
            });

            let reporter;
defineFeature(feature, test => {

    afterEach(async () => {
        await closeModal()
        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        logger.info("After Each ");
        logger.info(performanceTiming);
        await goTo(global.homeurl+'/home')
        await delay(5000)
        await customScreenshot('afterEach.png', 1920, 1200) 
        
    })

    beforeEach(async () => {
        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        logger.info("Before Each ");
        logger.info(performanceTiming);
        //jest.setTimeout(60000)
    })

    afterAll(async () => {
      try {
        await logger.info('After ALL')
        const elemXPath = "//button[contains(@title, 'My Account')]"
        try {
          const elemExists = await page.waitForXPath(elemXPath, {timeout: 30000}) ? true : false;
          if (elemExists == true) {
          expect(elemExists).toBe(true)
          await expect(page).toClick('button[title="My Account"]')
          await page.waitFor(1000)
          await expect(page).toClick('span', { text: 'Logout' })
          //var jsonStr = "{ text: 'Logout' }"
          //await expectToClick('span', jsonStr)
          await page.waitFor(2000)
          //perf
          logger.info(await testIotium(page));
          //perf
          await customScreenshot('loggedout.png', 1920, 1200) 
          }
        } catch(err) {
          logger.error("Error is ", err)
          logger.info("Ignorable exception, possibly have already logged out");
        }
        //await checkConsoleErrors();
        //Make a PDF of the tests by merging all screenshots into the pdf
        await createPDF(global.testStart,'uivalidation')
        if (global.env != 'staging') {
          await closemongoDB()
        }
        //Retrive the coverage objects
        //This is for stopping JS and CSS usages
          const [jsCoverage, cssCoverage] = await Promise.all([
            page.coverage.stopJSCoverage(),
            page.coverage.stopCSSCoverage(),
        ]);

        //Stop perf tracing
        await page.tracing.stop();
        //trying HAR
        await har.stop(); 
        //get all the console logs
        
        jest.clearAllMocks();
        logger.info('Ending After all')
      }
      catch(err) {
        logger.info(err);
        }
  
      })

    beforeAll(async () => {
      try {

        jest.setTimeout(120000)
        page.setDefaultNavigationTimeout(120000); 
        logger.info('Before all')
        //await delay(5000)

        //moving the login from setup to each test
        let login
        login = new Login();
        logger.info("global.env = "+global.env)
        await login.launch(global.env, global.scope) 
        //moving the login from setup to each test
        /*
        await (page
          .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
          .then(() => logger.info('Waiting In before ALL berfore proceeding')))
        */
        await page.$x("//button[contains(@title, 'My Account')]", { visible: true, timeout: 30})
        reporter = global.reporter
        await customScreenshot('beforeAll.png', 1920, 1200) 
        //This is for openstack
        if (global.env != 'staging') {
          OStoken = await connectOS()
        db = await connectmongoDB()
        }
        //This is for recording JS and CSS usages
        await Promise.all([
          page.coverage.startJSCoverage(),
          page.coverage.startCSSCoverage()
         ]);
         //performance tracing
         await page.tracing.start({ path: './reports/uivalidation'+global.testStart+'_tracing.json' });
         //trying HAR
         await har.start({ path: './reports/uivalidation'+global.testStart+'.har', saveResponse: true }); 
         //for redirecting console logs
         //jest.clearAllMocks();
         //consoleSpy = jest.spyOn(console, 'log')


      }
      catch(err) {
        logger.info(err);
        }
      })

      test('Check for errors in Add User page',({
        given,
        when,
        and,
        then, 
        
      }) => 
      {
         var flag = false
          givenIamLoggedIn(given)
          whenOrgis(when)
          and(/^I test add user errors$/, async (table) => {
            logger.info("Starting to add a error user")
            await gotoAddUser()
            reporter.startStep("Add User UI error validation");
            for (let i=0; i < table.length; i++) {
              let row = table[i]
              reporter.startStep("UI validation for field "+ row.fieldName +" and condition- " + row.condition);
              if (row.fieldName == 'fullname') {
                if (row.condition == 'splchar') {
                await expect(page).toFill('input[placeholder="Full Name"]', 'test$')
                await expect(page).toMatchElement('div.ant-form-explain', { text: fullname_error, visible: true})
               }
              }
              if (row.fieldName == 'email') {
                if (row.condition == 'no@') {
                await expect(page).toFill('input[placeholder="Email Address"]', 'test')
                await expect(page).toMatchElement('div.ant-form-explain', { text: email_error, visible: true})
                
               }
              }
              if (row.fieldName == 'email') {
                if (row.condition == 'valid') {
                await expect(page).toFill('input[placeholder="Email Address"]', 'test@qa.com') //Valid email id
                await expect(page).toMatchElement('span', { text: email_info, visible: true})
                await expect(page).toFill('input[placeholder="Email Address"]', '')//Fill empty
               }
              }
              if (row.fieldName == 'password') {
                if (row.condition == 'length') {
                  await expect(page).toFill('input[placeholder="Password"]', 'test') //Valid email id
                await expect(page).toMatchElement('div.ant-form-explain', { text: password_error, visible: true})
               }
              }
              if (row.fieldName == 'confirmpsw') {
                if (row.condition == 'length') {
                  await expect(page).toFill('input[placeholder="Confirm Password"]', 'tes') //Valid email id
                await expect(page).toMatchElement('div.ant-form-explain', { text: confirmpsw_error, visible: true})
               }
              }
              await delay(1000)
              reporter.endStep()
              }

              let screenshot = await customScreenshot('adduser_error.png', 1920, 1200)
              reporter.addAttachment("Adduser uivalidation Errors", screenshot, "image/png");
              //Cancel from add user page
              await expect(page).toClick('span', { text: 'Cancel' })
              await page.waitFor(1000)
              logger.info('clicked the cancel in Add user');
              flag = true //ensure the test is made as pass only when all above executes without failure

          })
          then(/UI should throw validation errors$/, async() => {
            logger.info('In Then UI should throw validation errors');
            reporter.startStep('Then UI should throw validation errors');

            await logger.info('flag = ', flag)
            await expect(flag).toBe(true);
            reporter.endStep()
          });
          
      }); 

          test('Check for errors in Add Network page', ({
            given,
            when,
            and,
            then
          }) => {
            var flag = false
            
            givenIamLoggedIn(given)
            whenOrgis(when)
            andWhenNodeIs(and)
            
            and(/^I test add network errors$/, async (table) => {
            let count
            await goToAddNetwork()
            reporter.startStep("Add Network UI error validation");
            for (let i=0; i < table.length; i++) {
              let row = table[i]
              reporter.startStep("UI validation for field "+ row.fieldName +" and condition- " + row.condition);
              if (row.fieldName == 'name') {
                if (row.condition == 'splchar') {
                  await expect(page).toFill('#name', 'test$')
                await expect(page).toMatchElement('div.ant-form-explain', { text: networkname_error, visible: true})
               }
              }
              if (row.fieldName == 'cidr') {
                if (row.condition == 'invalid') {
                  //await expect(page).toFill('#cidr', '22')
                  let address = await page.$$("input[placeholder='IP Address']")
                  await address[0].type('22') 
                  await expect(page).toMatchElement('div.ant-form-explain', { text: networkcidr_error, visible: true})
               }
              }
              if (row.fieldName == 'startip') {
                if (row.condition == 'invalid') {
                  await expect(page).toFill("input[id='reserved.start']", '22')
                  count =  await page.$$('p.reserved-range-error', { text: networkstartip_error, visible: true})
                  expect(count.length).toBe(1)//the error for all ip is same, so verifying using count. Some reason count starts from 3
                  await expect(page).toMatchElement('p.reserved-range-error', { text: networkstartip_error, visible: true})
               }
              }
              if (row.fieldName == 'endip') {
                if (row.condition == 'invalid') {
                  await expect(page).toFill("input[id='reserved.end']", '22')
                  count =  await page.$$('p.reserved-range-error', { text: networkendip_error, visible: true})
                  expect(count.length).toBe(1)//the error for all ip is same, so verifying using count
                  await expect(page).toMatchElement('p.reserved-range-error', { text: networkendip_error, visible: true})
               }
              }
              if (row.fieldName == 'gatewayip') {
                if (row.condition == 'invalid') {
                  //await expect(page).toFill('#gateway', '22')
                  let address = await page.$$("input[placeholder='IP Address']")
                  await address[1].type('22') 
                  count =  await page.$$('div.ant-form-explain', { text: networkcidr_error, visible: true})
                  expect(count.length).toBe(3)//the error for all ip is same, so verifying using count, 
                  await expect(page).toMatchElement('div.ant-form-explain', { text: networkcidr_error, visible: true})
               }
              }
              await delay(1000)
              reporter.endStep()
            }

              let screenshot = await customScreenshot('addnetwork_error.png', 1920, 1200)
              reporter.addAttachment("Addnetwork uivalidation Errors", screenshot, "image/png");
              //Cancel from add network page
              await expect(page).toClick('span', { text: 'Cancel' })
              await page.waitFor(1000)
              logger.info('clicked the cancel in Add Network');
              flag = true //ensure the test is made as pass only when all above executes without failure

          })
          then(/UI should throw validation errors$/, async() => {
            logger.info('In Then UI should throw validation errors');
            reporter.startStep('Then UI should throw validation errors');
            await logger.info('flag is =', flag)
            await expect(flag).toBe(true);
            reporter.endStep()
          });

        });

        test('Check for errors in Add SSH Key',({
          given,
          when,
          and,
          then, 
          
        }) => 
        {
           var flag = false
            givenIamLoggedIn(given)
            whenOrgis(when)
            and(/^I test add ssh key errors$/, async (table) => {
              logger.info("Starting to add a error ssh key")
              await gotoAddSSHKey()
              reporter.startStep("Add SSH Key UI error validation");
              for (let i=0; i < table.length; i++) {
                let row = table[i]
                reporter.startStep("UI validation for field "+ row.fieldName +" and condition- " + row.condition);
                if (row.fieldName == 'name') {
                  if (row.condition == 'splchar') {
                    //const elemsshName = await page.$('textarea[placeholder="SSH Key Name"]')
                  await expect(page).toFill('textarea[placeholder="SSH Key Name"]', 'test$')
                  await expect(page).toMatchElement('div.ant-form-explain', { text: name_error, visible: true})
                  await delay(1000)
                  //await elemsshName.click({ clickCount: 3 })
                  //await elemsshName.press('Delete')
                  await expect(page).toFill('textarea[placeholder="SSH Key Name"]', '')
                  await page.keyboard.press('Delete');
                  await delay(1000)
                  await expect(page).toMatchElement('div.ant-form-explain', { text: name_del_error, visible: true})
                 }
                }
                if (row.fieldName == 'sshkey') {
                  if (row.condition == 'del') {
                  await expect(page).toFill('textarea[placeholder="Paste a valid SSH (RSA) public key"]', 'test')
                  await delay(1000)
                  await expect(page).toFill('textarea[placeholder="Paste a valid SSH (RSA) public key"]', '')
                  await page.keyboard.press('Delete');
                  await delay(1000)
                  await expect(page).toMatchElement('div.ant-form-explain', { text: sshkey_error, visible: true})
                  
                 }
                }
                await delay(1000)
                reporter.endStep()
                }
  
                let screenshot = await customScreenshot('addsshkey_error.png', 1920, 1200)
                reporter.addAttachment("Addsshkey uivalidation Errors", screenshot, "image/png");
                //Cancel from add user page
                await expect(page).toClick('span', { text: 'Cancel' })
                await page.waitFor(1000)
                logger.info('clicked the cancel in Add SSH key');
                flag = true //ensure the test is made as pass only when all above executes without failure
  
            })
            then(/UI should throw validation errors$/, async() => {
              logger.info('In Then UI should throw validation errors');
              reporter.startStep('Then UI should throw validation errors');
  
              await logger.info('flag is = ', flag)
              await expect(flag).toBe(true);
              reporter.endStep()
            });
            
        }); 

        test('Check invalid routes redirect to login', ({
          given,
          when,
          and,
          then
        }) => {

          var flag = false

          given('I am not logged in', async() => {
            
              logger.info('Given I am not logged in')
              
              //await goTo(global.homeurl+'/logout' )
              
              await expect(page).toClick('button[title="My Account"]')
              await page.waitFor(1000)
              await expect(page).toClick('span', { text: 'Logout' })
              await delay(2000)
              const username = await page.waitForSelector('input[id="username"]', {timeout: 30000,  visible: true}) ? true : false;
              expect(username).toBe(true)
             
           });
          
                    
          when(/^I try invalid routes$/, async (table) => {
          let count
          let screenshot

          logger.info('When I try invalid routes')
          
          reporter.startStep("I try invalid routes");
          for (let i=0; i < table.length; i++) {
            let tempflag = false
            let row = table[i]
            reporter.startStep("UI validation for url "+ global.homeurl +"/"+row.url +" and condition- " + row.condition);
            await page.goto(global.homeurl+'/'+row.url  )
            logger.info("Testing this url "+global.homeurl+'/'+row.url )
            screenshot = await customScreenshot('invalidurl_'+row.url+'.png', 1920, 1200) 
            reporter.addAttachment('testing invalidurl_'+row.url, screenshot, "image/png");
            await delay(500)
            //login page will have the enter user name input field, checking for this to ensure we are in Login page
            const username = await page.waitForSelector('input[id="username"]', {timeout: 30000, visible: true}) ? true : false;
            expect(username).toBe(true)
            logger.info("Verified the redirect ");
              reporter.startStep("Verified the url redirected to login when using "+global.homeurl +"/"+row.url)
              reporter.endStep()
            reporter.endStep()
          }
            flag = true //ensure the test is made as pass only when all above executes without failure
        })
        then(/UI should throw validation errors$/, async() => {
          logger.info('Then UI should redirect the login');
          reporter.startStep('Then UI should redirect the login');
          await logger.info('flag is ', flag)
          await expect(flag).toBe(true);
          reporter.endStep()
        });

      });

    });