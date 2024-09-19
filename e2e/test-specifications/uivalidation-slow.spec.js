import { defineFeature, loadFeature } from 'jest-cucumber';
import { goToAddNetwork, networkcidr_error, networkendip_error, networkgwip_error, networkname_error, networkstartip_error } from '../helper/networks';
import { connectOS } from '../helper/node';
import { confirmpsw_error, email_error, email_info, fullname_error, gotoAddUser, password_error } from '../helper/user';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay } from '../../utils/utils';
import { andWhenNodeIs, givenIamLoggedIn, whenOrgis } from './shared-steps';



const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

let OStoken, db, consoleSpy
var client;

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

        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        console.log("After Each ");
        console.log(performanceTiming);
        await page.goto(global.homeurl+'/home')
        await delay(5000)
        await customScreenshot('afterEach.png', 1920, 1200) 
        
    })

    beforeEach(async () => {
        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        console.log("Before Each ");
        console.log(performanceTiming);
        jest.setTimeout(60000)
    })

    afterAll(async () => {
      try {
        console.log('After ALL')
        const elemXPath = "//button[contains(@title, 'My Account')]"
        const elemExists = await page.waitForXPath(elemXPath, {timeout: 10000}) ? true : false;
        expect(elemExists).toBe(true)
        await expect(page).toClick('button[title="My Account"]')
        await page.waitFor(1000)
        await expect(page).toClick('span', { text: 'Logout' })
        await page.waitFor(2000)
        //perf
        console.log(await testIotium(page));
        //perf
        await customScreenshot('loggedout.png', 1920, 1200) 
        //await checkConsoleErrors();
        //Make a PDF of the tests by merging all screenshots into the pdf
        await createPDF(global.testStart,'uivalidation-slow')
        await closemongoDB()
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
      }
      catch(err) {
          console.log(err);
        }
  
      })

    beforeAll(async () => {
      try {
        jest.setTimeout(60000)
        await page.setDefaultNavigationTimeout(60000); 
        await delay(5000)
        await (page
          .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
          .then(() => console.log('Waiting In before ALL berfore proceeding')))

        await page.$x("//button[contains(@title, 'My Account')]", { visible: true })
        reporter = global.reporter
        await customScreenshot('beforeAll.png', 1920, 1200) 

        //Slow down
            //perf
        client = await page.target().createCDPSession();
        await client.send('Network.enable');
        await client.send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 200, // ms
          downloadThroughput: 680 * 1024 / 8, // 780 kb/s
          uploadThroughput: 330 * 1024 / 8, // 330 kb/s
        });
        await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        //perf
        //Slow down
        //This is for openstack
        OStoken = await connectOS()
        db = await connectmongoDB()
        //This is for recording JS and CSS usages
        await Promise.all([
          page.coverage.startJSCoverage(),
          page.coverage.startCSSCoverage()
         ]);
         //performance tracing
         await page.tracing.start({ path: './reports/uivalidation-slow'+global.testStart+'_tracing.json' });
         //trying HAR
         await har.start({ path: './reports/uivalidation-slow'+global.testStart+'.har', saveResponse: true }); 
         //for redirecting console logs
         jest.clearAllMocks();
         //consoleSpy = jest.spyOn(console, 'log')


      }
      catch(err) {
          console.log(err);
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
            console.log("Starting to add a error user")
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
              reporter.addAttachment("Adduser uivalidation-slow Errors", screenshot, "image/png");
              //Cancel from add user page
              await expect(page).toClick('span', { text: 'Cancel' })
              await page.waitFor(1000)
              console.log('clicked the cancel in Add user');
              flag = true //ensure the test is made as pass only when all above executes without failure

          })
          then(/UI should throw validation errors$/, async() => {
            console.log('In Then UI should throw validation errors');
            reporter.startStep('Then UI should throw validation errors');

            await console.log('flag ==== ', flag)
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
                  await expect(page).toFill('#cidr', '22')
                  await expect(page).toMatchElement('div.ant-form-explain', { text: networkcidr_error, visible: true})
               }
              }
              if (row.fieldName == 'startip') {
                if (row.condition == 'invalid') {
                  await expect(page).toFill("input[id='reserved.start']", '22')
                  count =  await page.$$('div.ant-form-explain', { text: networkstartip_error, visible: true})
                  expect(count.length).toBe(3)//the error for all ip is same, so verifying using count. Some reason count starts from 3
                  await expect(page).toMatchElement('div.ant-form-explain', { text: networkstartip_error, visible: true})
               }
              }
              if (row.fieldName == 'endip') {
                if (row.condition == 'invalid') {
                  await expect(page).toFill("input[id='reserved.end']", '22')
                  count =  await page.$$('div.ant-form-explain', { text: networkendip_error, visible: true})
                  expect(count.length).toBe(4)//the error for all ip is same, so verifying using count
                  await expect(page).toMatchElement('div.ant-form-explain', { text: networkendip_error, visible: true})
               }
              }
              if (row.fieldName == 'gatewayip') {
                if (row.condition == 'invalid') {
                  await expect(page).toFill('#gateway', '22')
                  count =  await page.$$('div.ant-form-explain', { text: networkgwip_error, visible: true})
                  expect(count.length).toBe(5)//the error for all ip is same, so verifying using count, 
                  await expect(page).toMatchElement('div.ant-form-explain', { text: networkgwip_error, visible: true})
               }
              }
              await delay(1000)
              reporter.endStep()
            }

              let screenshot = await customScreenshot('addnetwork_error.png', 1920, 1200)
              reporter.addAttachment("Addnetwork uivalidation-slow Errors", screenshot, "image/png");
              //Cancel from add network page
              await expect(page).toClick('span', { text: 'Cancel' })
              await page.waitFor(1000)
              console.log('clicked the cancel in Add Network');
              flag = true //ensure the test is made as pass only when all above executes without failure

          })
          then(/UI should throw validation errors$/, async() => {
            console.log('In Then UI should throw validation errors');
            reporter.startStep('Then UI should throw validation errors');
            await console.log('flag is ', flag)
            await expect(flag).toBe(true);
            reporter.endStep()
          });

        });

    });