import { defineFeature, loadFeature } from 'jest-cucumber';
import { report } from 'process';
import { createPDF, customScreenshot, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, envTab, occupancyBuildingTab, occupancySensorsTab } from '../constants/locators';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding } from './shared-steps';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateEnvironment.feature', 
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



  test('Verify Todays temperature is nonzero in environment tab of <Building>', async ({
    given,
    when,
    then
  }) => {
    let temperature
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I navigate environment tab in building', async() =>{
        reporter.startStep('I navigate environment tab in building')
        logger.info('I navigate environment tab in building')
        await Promise.all ([
            performAction("click", buildingOverview.a.environmentTab),
            waitForNetworkIdle(120000)
          ])
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        reporter.endStep()
    })
    when('I fetch todays temperature', async() =>{
        reporter.startStep('I fetch todays temperature')
        let value = await getPropertyValueByXpath(envTab.span.todayTemp, "textContent")
        logger.info(value)
        temperature = value
        let num = value.split('/')[0].slice(0,-1)
        let den = value.split('/')[1].slice(0,-1)
        logger.info(num, den)
        reporter.endStep()
    });
    then('The value must be non-zero', async() =>{
      reporter.startStep("The value must be non-zero");
      reporter.startStep(`Value is ${temperature}`)
      let numerator = temperature.split('/')[0].slice(0,-1)
      let denominator = temperature.split('/')[1].slice(0,-1)
      logger.info(numerator, denominator)
      expect(parseInt(numerator) > 0).toBeTruthy()
      expect(parseInt(denominator) > 0).toBeTruthy()
      reporter.endStep()
      reporter.endStep();
    });
  }); 

  test('Verify Tomorrows temperature is nonzero in environment tab of <Building>', async ({
    given,
    when,
    then
  }) => {
    let temperature
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I navigate environment tab in building', async() =>{
        reporter.startStep('I navigate environment tab in building')
        logger.info('I navigate environment tab in building')
        await Promise.all ([
            performAction("click", buildingOverview.a.environmentTab),
            waitForNetworkIdle(120000)
          ])
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        reporter.endStep()
    })
    when('I fetch tomorrows temperature', async() =>{
        reporter.startStep('I fetch tomorrows temperature')
        let value = await getPropertyValueByXpath(envTab.span.tomorrowTemp, "textContent")
        logger.info(value)
        temperature = value
        let num = value.split('/')[0].slice(0,-1)
        let den = value.split('/')[1].slice(0,-1)
        logger.info(num, den)
        reporter.endStep()
    });
    then('The value must be non-zero', async() =>{
      reporter.startStep("The value must be non-zero");
      reporter.startStep(`Value is ${temperature}`)
      let numerator = temperature.split('/')[0].slice(0,-1)
      let denominator = temperature.split('/')[1].slice(0,-1)
      logger.info(numerator, denominator)
      expect(parseInt(numerator) > 0).toBeTruthy()
      expect(parseInt(denominator) > 0).toBeTruthy()
      reporter.endStep()
      reporter.endStep();
    });
  }); 

  test('Verify day after tomorrows temperature is nonzero in environment tab of <Building>', async ({
    given,
    when,
    then
  }) => {
    let temperature
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I navigate environment tab in building', async() =>{
        reporter.startStep('I navigate environment tab in building')
        logger.info('I navigate environment tab in building')
        await Promise.all ([
            performAction("click", buildingOverview.a.environmentTab),
            waitForNetworkIdle(120000)
          ])
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        reporter.endStep()
    })
    when('I fetch day after tomorrows temperature', async() =>{
        reporter.startStep('I fetch day after tomorrows temperature')
        let value = await getPropertyValueByXpath(envTab.span.dayAftertomorrowTemp, "textContent")
        logger.info(value)
        temperature = value
        let num = value.split('/')[0].slice(0,-1)
        let den = value.split('/')[1].slice(0,-1)
        logger.info(num, den)
        reporter.endStep()
    });
    then('The value must be non-zero', async() =>{
      reporter.startStep("The value must be non-zero");
      reporter.startStep(`Value is ${temperature}`)
      let numerator = temperature.split('/')[0].slice(0,-1)
      let denominator = temperature.split('/')[1].slice(0,-1)
      logger.info(numerator, denominator)
      expect(parseInt(numerator) > 0).toBeTruthy()
      expect(parseInt(denominator) > 0).toBeTruthy()
      reporter.endStep()
      reporter.endStep();
    });
  }); 


  test('Verify all components of <Sensor> widget is present in environment tab of <Building>', async ({
    given,
    when,
    then
  }) => {
    var widgetHandle
    givenIamLoggedIn(given)
    whenIselectBuilding(when)
    when('I navigate environment tab in building', async() =>{
        reporter.startStep('I navigate environment tab in building')
        logger.info('I navigate environment tab in building')
        await Promise.all ([
            performAction("click", buildingOverview.a.environmentTab),
            waitForNetworkIdle(120000)
          ])
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        reporter.endStep()
    })
    when(/^I locate "(.*)" widget$/, async(sensor) =>{
        reporter.startStep(`When I locate ${sensor} widget`)
        let widgetPath = envTab.div.sensorWidget.replace('sensorName', sensor)
        widgetHandle = await getElementHandleByXpath(widgetPath)
        reporter.endStep()
    });
    then('All componetns must be populated in the widget', async() =>{
      reporter.startStep("All componetns must be populated in the widget");
      reporter.startStep("Expecting slider thumb");
      let handle = await getElementHandleByXpath(envTab.span.sliderThumb, widgetHandle[0])
      expect(handle).toBeTruthy()
      reporter.endStep()

      reporter.startStep("Expecting slider thumb");
      handle = await getElementHandleByXpath(envTab.span.slider, widgetHandle[0])
      expect(handle).toBeTruthy()
      reporter.endStep()

      reporter.startStep("Expecting sensorAverage");
      handle = await getElementHandleByXpath(envTab.h6.sensorAverage, widgetHandle[0])
      expect(handle).toBeTruthy()
      reporter.endStep()

      let value = await getPropertyValue(handle[0], "textContent")
      logger.info(`Value is ${value}`)
      let found = value.split(' ')[0]
      logger.info(found)
      reporter.startStep(`Expecting sensor average > 0.0; Found ${found}`)
      expect(parseFloat(found) > 0.0)
      reporter.endStep()

      reporter.startStep("Expecting safety band")
      handle = await getElementHandleByXpath(envTab.div.safetyBand, widgetHandle[0])
      expect(handle).toBeTruthy()
      reporter.endStep()
      
      reporter.endStep();
    });
  }); 
  


});
