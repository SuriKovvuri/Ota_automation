import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab } from '../constants/locators';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding } from './shared-steps';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateBuilding.feature', 
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


  test('Verify specific building <Building> online sensor is non-zero in overview page', async ({
    given,
    when,
    and,
    then
  }) => {
    let online_sensors, date, day, hours
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    and('I get online sensors count', async() =>{
      reporter.startStep('I get online sensors count')
      let val = await getPropertyValueByXpath(buildingOverview.h6.onlineSensors, "textContent")
      logger.info(`Online sensor count is ${val}`)
      online_sensors = parseInt(val)
      reporter.endStep()
    });
    then('The value must be non-zero', async() =>{
      reporter.startStep("The value must be non-zero");
      reporter.startStep(`Online sensor count is ${online_sensors}`)
      expect(online_sensors > 0).toBeTruthy()
      reporter.endStep();
      reporter.endStep();
    });
  }); 

  test('Verify specific building <Building> Real-time Occupancy is non-zero in overview page during Busy hours', async ({
    given,
    when,
    then
  }) => {
    let occupancy_value, date, day, hours
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I get Real-time Occupancy', async() =>{
      reporter.startStep('I get Real-time Occupancy')
      day = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false, weekday: "short"});
      date = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false});
      hours = parseInt(date.split(' ')[1].split(':')[0])
      logger.info(date, day, hours)
      let val = await getPropertyValueByXpath(buildingOverview.div.realTimeOccupancy, "textContent")
      logger.info(`Online sensor count is ${val}`)
      occupancy_value = parseInt(val.slice(0,-1))
      reporter.endStep()
    });
    then('The value must be non-zero during busy hours', async() =>{
      reporter.startStep("The value must be non-zero during busy hours");
      reporter.startStep(`Real-time Occupancy is ${occupancy_value} at ${day} ${date} EST`)
      if (day != 'Sat' && day != 'Sun')
      {
        if ((hours >= 7 && hours <= 18)) {
            logger.info("In Busy time")
            expect(occupancy_value > 0).toBeTruthy()
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

  test('Verify specific building <Building> Active Environment sensors is non-zero in overview page', async ({
    given,
    when,
    and,
    then
  }) => {
    let online_sensors, date, day, hours
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    and('I get active environment sensor count in overview page', async() =>{
      reporter.startStep('I get active environment sensor count in overview page')
      await Promise.all ([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      let val = await getPropertyValueByXpath(buildingOverview.h6.activeEnvSensors, "textContent")
      logger.info(`Online sensor count is ${val}`)
      online_sensors = parseInt(val)
      reporter.endStep()
    });
    then('The value must be non-zero', async() =>{
      reporter.startStep("The value must be non-zero");
      reporter.startStep(`Active Environment sensor count is ${online_sensors}`)
      expect(online_sensors > 0).toBeTruthy()
      reporter.endStep();
      reporter.endStep();
    });
  });

});
