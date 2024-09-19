import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo } from '../../utils/utils';
import { allPropertiesOverview } from '../constants/locators';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateAllProperties.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              }
                //tagFilter: '@test',
            });

        
            
defineFeature(feature, test => {

    afterEach(async () => {
        logger.info("After Each ");
        await customScreenshot('afterEach.png')
    })

    beforeEach(async () => {   
        logger.info("Before Each ");
        jest.setTimeout(1200000)           
    })

    afterAll(async () => {
      try {
        logger.info('After ALL')
        await logout()
        await har.stop();
        
        await customScreenshot('loggedout.png') 
        await createPDF(global.testStart,'sbp')
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
          await har.start({ path: './reports/sbp'+global.testStart+'.har', saveResponse: true }); 
          logger.info("global.env = "+global.env)
          await goTo(config.sbpURL)
          await login(global.env, "BM")           
          await customScreenshot('beforeAll.png') 
        }
        catch(err) {
            logger.error(err);
        }
        })    

  //test.concurrent.each(Array(100).fill(null))('may be flaky test', async () => {})
  test.concurrent.each(Array(2).fill(null))('Verify Overall Property RealTime Occupancy is non-zero during 7AM-7PM EST', async ({
    given,
    when,
    then
  }) => {
    let occupancy_value, date, day, hours
    given('I am logged as a Building Manager', async() =>{
        reporter.startStep("Given I am logged as an Building Manager");
        let retValue = await verifyLogin()
        expect(retValue).toBeTruthy()
        let ss = await customScreenshot('loggedin.png')
        reporter.addAttachment("loggedIn", ss, "image/png");
        reporter.endStep();
    });
    when('I fetch the Overall real-time occupancy', async() =>{
        reporter.startStep("When I fetch the Overall real-time occupancy");
        day = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false, weekday: "short"});
        date = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false});
        hours = parseInt(date.split(' ')[1].split(':')[0])
        logger.info(date, day, hours)
        let value = await getPropertyValueByXpath(allPropertiesOverview.div.overallOccupancyValue, "textContent")
        occupancy_value = value.slice(0, -1);
        reporter.endStep();
    });
    then('The value must be non-zero during 7AM-7PM EST', async() =>{
      reporter.startStep("Then The value must be non-zero during 7AM-7PM EST");
      reporter.startStep(`Overall occupancy is ${occupancy_value} at ${day} ${date} EST`)
      if (day != 'Sat' && day != 'Sun')
      {
        if ((hours >= 7 && hours <= 18)) {
            logger.info("In Busy time")
            expect(parseFloat(occupancy_value) > 0.0).toBeTruthy()
        } else {
            logger.info("Not busy time; Ignore occupancy value")
        }
      } else {
        logger.info("It is weekend!; Ignore occupancy value")
      }
      reporter.endStep();
      reporter.endStep();
    });
  }); 
  
  test('Itemized list of <Building> shows non-zero numbers for numerators during 7AM-7PM EST', async ({
    given,
    when,
    then
  }) => {
    let numerator_value, date, day, hours
    when(/^I fetch numerator of "(.*)"$/, async(building) =>{
        reporter.startStep(`I fetch numerator of ${building}`);
        day = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false, weekday: "short"});
        date = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false});
        hours = parseInt(date.split(' ')[1].split(':')[0])
        logger.info(date, day, hours)
        let tdHandle = await getElementHandleByXpath(`//p[text()='${building}']//ancestor::td//following-sibling::td[1]//p[2]`)
        await tdHandle[0].hover()
        //let numeratorHandle = await getElementHandleByXpath("//p[2]", tdHandle[0])
        let value = await getPropertyValue(tdHandle[0], "textContent")
        numerator_value = value.split('/')[0].trim();
        logger.info(`Numerator value is ${numerator_value}`)
        let ss = await customScreenshot('itemisedList.png')
        reporter.addAttachment("itemisedList", ss, "image/png");
        reporter.endStep();
    });
    then('The value must be non-zero during 7AM-7PM EST', async() =>{
      reporter.startStep("Then The value must be non-zero during 7AM-7PM EST");
      reporter.startStep(`Numerator value is ${numerator_value} at ${day} ${date} EST`)
      if (day != 'Sat' && day != 'Sun')
      {
        if ((hours >= 7 && hours <= 18)) {
            logger.info("In Busy time")
            expect(parseInt(numerator_value) > 0).toBeTruthy()
        } else {
            logger.info("Not busy time; Ignore numerator value")
        }
      } else {
        logger.info("It is weekend!; Ignore numerator value")
      }
      reporter.endStep();
      reporter.endStep();
    });
  });  

});
