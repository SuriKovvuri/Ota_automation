import { defineFeature, loadFeature } from 'jest-cucumber';
import { Login } from '../helper/otalogin';
import { thenDeleteUser, thenChangeUserGroup, thenGetUsername, whenIAddUser, confirmpsw_error, email_error, firstname_error, lastname_error, phone_error, gotoAddUser, password_error, thenCheckUser } from '../helper/otauser';
import { logger } from '../log.setup';
import { createPDF, customScreenshot, delay, expectToClick, goTo } from '../../utils/utils';
import {  givenAdminLoggedIn, givenAccessUserLoggedIn } from './otashared-steps';
import { thenDeleteDevice, thenChangeConnectionendpoint, thenIAddDeviceUsergroup, thenICheckDevice, thenIRemoveDeviceUsergroup,whenIAddDevice, device_error, ip_error, host_error, city_error, country_error, gotoAddDevice } from '../helper/otadevice'
const { PendingXHR } = require('pending-xhr-puppeteer');
import * as device from '../helper/otadevice'


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

let OStoken, db, consoleSpy

const feature = loadFeature('./otae2e/features/otauiwallpaper.feature', 
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
        try {
          const elemExists = await expect(page).toMatchElement('svg[type="UserCircle"]') ? true : false;
          if (elemExists == true) {
            expect(elemExists).toBe(true)
            //const check = await expect(page).toMatchElement('svg[type="UserCircle"]') ? true : false;
            await expect(page).toClick('svg[class="anticon valign-sub"]')
            await page.waitFor(1000)
            const check1 = await expect(page).toClick('svg[type="UserCircle"]') ? true : false;
            await expect(page).toClick('span', { text: 'Signout' })
            await page.waitFor(2000)
            //perf
            await customScreenshot('AfterAll.png', 1920, 1200) 
          }
        } catch(err) {
          logger.info("Ignorable exception, possibly have already logged out");
        }
        //await goTo(global.homeurl+'dashboard')
        //await customScreenshot('afterEach.png', 1920, 1200) 
        //await delay(2000)
        
    })

    beforeEach(async () => {
        //const performanceTiming = JSON.parse(
        //  await page.evaluate(() => JSON.stringify(window.performance.timing))
        //);
        logger.info("Before Each ");
        //jest.setTimeout(120000)
    })

    afterAll(async () => {
      try {
        await logger.info('After ALL')
        
        //trying HAR
        await har.stop(); 
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
        reporter = global.reporter
        //trying HAR
        await har.start({ path: './reports/otauigroup'+global.testStart+'.har', saveResponse: true }); 

      }
      catch(err) {
        logger.info(err);
        }
      })

      test('Verification of  enable and disable option in ssh and rdp device for admin user',({
        given,
        when,
        then, 
        
      }) => 
      {
          var flag = false
        try {
          givenAdminLoggedIn(given)
          when(/^Tries to create a ssh or rdp connections$/, async (table) => {
            
            for (let i=0; i < table.length; i++) {
              let row = table[i]
              reporter.startStep("Tries to create a connection " + row.connectendpoint + " with ftp option " + row.ftp +
              " and wallpaper option " + row.wallpaper);
              await device.addDevice(row)
              await device.verifyDevice(row)
              await device.deleteDevice(row)
              await delay(5000)
              reporter.endStep()
            }
          })
          then(/^Both Filetransfer and wallpaper setting should be available with a switch to turn it on or off$/, async (table) => {
            reporter.startStep('Both Filetransfer and wallpaper setting should be available with a switch to turn it on or off');
            reporter.endStep()
          })
        } catch(err) {
          logger.info(err);
        }
          
      });

});
