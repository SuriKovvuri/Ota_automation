import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab } from '../constants/locators';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding } from './shared-steps';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateOccupancy.feature', 
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



  test('Verify specific building <Building> Real-time Occupancy is non-zero in occupancy page during Busy hours', async ({
    given,
    when,
    then
  }) => {
    let occupancy_value, date, day, hours
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I get Real-time Occupancy in occupancy page', async() =>{
      reporter.startStep('I get Real-time Occupancy')
      await Promise.all ([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('occupancyBuilding.png')
      reporter.addAttachment("occupancyBuilding", ss, "image/png");
      day = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false, weekday: "short"});
      date = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false});
      hours = parseInt(date.split(' ')[1].split(':')[0])
      logger.info(date, day, hours)
      let val = await getPropertyValueByXpath(occupancyBuildingTab.h5.realTimeOccupancy, "textContent")
      logger.info(`Online sensor count is ${val}`)
      occupancy_value = parseFloat(val.slice(0,-1))
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
  
  test('Verify specific building <Building> Average Day Occupancy over 90days  is non-zero during Busy hours', async ({
    given,
    when,
    then
  }) => {
    let occupancy_value, date, day, hours
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I get Average Day Occupancy', async() =>{
      reporter.startStep('I get Average Day Occupancy')
      await Promise.all ([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('occupancyBuilding.png')
      reporter.addAttachment("occupancyBuilding", ss, "image/png");
      day = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false, weekday: "short"});
      date = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false});
      hours = parseInt(date.split(' ')[1].split(':')[0])
      logger.info(date, day, hours)
      let val = await getPropertyValueByXpath(occupancyBuildingTab.h5.averageDayOccupancy, "textContent")
      logger.info(`Average Day Occupancy is ${val}`)
      occupancy_value = parseFloat(val.slice(0,-1))
      reporter.endStep()
    });
    then('The value must be non-zero during busy hours', async() =>{
      reporter.startStep("The value must be non-zero during busy hours");
      reporter.startStep(`Average Occupancy is ${occupancy_value} at ${day} ${date} EST`)
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
  
  test('Verify specific building <Building> Peak Day Occupancy over 90days is non-zero during Busy hours', async ({
    given,
    when,
    then
  }) => {
    let occupancy_value, date, day, hours
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I get Peak Day Occupancy', async() =>{
      reporter.startStep('I get Peak Day Occupancy')
      await Promise.all ([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('occupancyBuilding.png')
      reporter.addAttachment("occupancyBuilding", ss, "image/png");
      day = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false, weekday: "short"});
      date = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false});
      hours = parseInt(date.split(' ')[1].split(':')[0])
      logger.info(date, day, hours)
      let val = await getPropertyValueByXpath(occupancyBuildingTab.h5.peakDayOccupancy, "textContent")
      logger.info(`Average Day Occupancy is ${val}`)
      occupancy_value = parseFloat(val.slice(0,-1))
      reporter.endStep()
    });
    then('The value must be non-zero during busy hours', async() =>{
      reporter.startStep("The value must be non-zero during busy hours");
      reporter.startStep(`Peak Day Occupancy is ${occupancy_value} at ${day} ${date} EST`)
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

  test('Verify specific building <Building> Real-time Lobby is non-zero during Busy hours', async ({
    given,
    when,
    then
  }) => {
    let lobby_value, date, day, hours
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I get Real-time Lobby', async() =>{
      reporter.startStep('I get Real-time Lobby')
      await Promise.all ([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('occupancyBuilding.png')
      reporter.addAttachment("occupancyBuilding", ss, "image/png");
      day = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false, weekday: "short"});
      date = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false});
      hours = parseInt(date.split(' ')[1].split(':')[0])
      logger.info(date, day, hours)
      let val = await getPropertyValueByXpath(occupancyBuildingTab.h5.RealTimeLobby, "textContent")
      logger.info(`Real-time Lobby is ${val}`)
      lobby_value = parseInt(val.split(' ')[0])
      reporter.endStep()
    });
    then('The value must be non-zero during busy hours', async() =>{
      reporter.startStep("The value must be non-zero during busy hours");
      reporter.startStep(`Real-time Lobby is ${lobby_value} at ${day} ${date} EST`)
      if (day != 'Sat' && day != 'Sun')
      {
        if ((hours >= 7 && hours <= 18)) {
            logger.info("In Busy time")
            expect(lobby_value > 0).toBeTruthy()
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
  
  test('Verify specific building <Building> Average Lobby for 90 days is non-zero during Busy hours', async ({
    given,
    when,
    then
  }) => {
    let lobby_value, date, day, hours
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I get Average Lobby', async() =>{
      reporter.startStep('I get Average Lobby')
      await Promise.all ([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('occupancyBuilding.png')
      reporter.addAttachment("occupancyBuilding", ss, "image/png");
      day = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false, weekday: "short"});
      date = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false});
      hours = parseInt(date.split(' ')[1].split(':')[0])
      logger.info(date, day, hours)
      let val = await getPropertyValueByXpath(occupancyBuildingTab.h5.AverageDayLobby, "textContent")
      logger.info(`Average Lobby is ${val}`)
      lobby_value = parseInt(val.split(' ')[0])
      reporter.endStep()
    });
    then('The value must be non-zero during busy hours', async() =>{
      reporter.startStep("The value must be non-zero during busy hours");
      reporter.startStep(`Average Lobby is ${lobby_value} at ${day} ${date} EST`)
      if (day != 'Sat' && day != 'Sun')
      {
        if ((hours >= 7 && hours <= 18)) {
            logger.info("In Busy time")
            expect(lobby_value > 0).toBeTruthy()
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
  
  test('Verify specific building <Building> online sensor is non-zero in occuancy sensor page', async ({
    given,
    when,
    then
  }) => {
    let online_sensors, date, day, hours
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I get online sensor count in occupancy page', async() =>{
      reporter.startStep('I get online sensor count in occupancy page')
      await Promise.all ([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])

      await Promise.all ([
        performAction("click", occupancySensorsTab.div.sensorsTab),
        waitForNetworkIdle(120000)
      ])

      let ss = await customScreenshot('occupancyBuilding.png')
      reporter.addAttachment("occupancyBuilding", ss, "image/png");
      day = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false, weekday: "short"});
      date = new Date().toLocaleString("en-US", {timeZone: "America/New_York", hour12: false});
      hours = parseInt(date.split(' ')[1].split(':')[0])
      logger.info(date, day, hours)
      let val = await getPropertyValueByXpath(occupancySensorsTab.p.onlineSensors, "textContent")
      logger.info(`Online sensors is ${val}`)
      online_sensors = parseInt(val.split(' ')[0])
      reporter.endStep()
    });
    then('The value must be non-zero', async() =>{
      reporter.startStep("The value must be non-zero");
      reporter.startStep(`Online sensors is ${online_sensors} at ${day} ${date} EST`)
      if (day != 'Sat' && day != 'Sun')
      {
        if ((hours >= 7 && hours <= 18)) {
            logger.info("In Busy time")
            expect(online_sensors > 0).toBeTruthy()
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


});
