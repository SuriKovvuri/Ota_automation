import { assert } from 'console';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, delay, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab, envTab, verifyBuildPage, allBuildOccupancy, allBuildOccupancy1, commons, rockBuilding, allPropertiesOverviewPage } from '../constants/locators';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding } from './shared-steps';

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateRegressionAllPropertiesOverView.feature',
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
      await createPDF(global.testStart, 'sbp')
    }
    catch (err) {
      logger.error(err);
    }
  })

  beforeAll(async () => {
    try {

      jest.setTimeout(300000)
      await page.setDefaultNavigationTimeout(50000);
      await page.waitFor(5000);

      let config = await getEnvConfig()
      await har.start({ path: './reports/sbp' + global.testStart + '.har', saveResponse: true });
      logger.info("global.env = " + global.env)
      //  await page.emulateTimezone('America/New_York');
      await goTo(config.sbpURL)
      await login(global.env, "BM")
      await customScreenshot('beforeAll.png')
    }
    catch (err) {
      logger.error(err);
    }
  })


  test('Navigate All Properties Overview Page', async ({
    given,
    when,
    then,
    and
  }) => {
    let occupancy_value, date, day, hours
    givenIamLoggedIn(given)
    when('I Click Days in All Properties OverView Page', async () => {
      reporter.startStep(`When I Click Days in All Properties OverView Page`);
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.days),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.yesterday),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      reporter.endStep();
    });

    then('I fetch The Yesterday Occupancy List', async () => {
      reporter.startStep("Then I fetch The Yesterday Occupancy List");
      function wasYesterdayWeekend() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const day = yesterday.toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
        return day === 'Sat' || day === 'Sun';
      }
      const yesterdayWeekend = wasYesterdayWeekend();
      if (yesterdayWeekend) {
        logger.info("Yesterday was a weekend!; Ignore Real Time Occupancy percentage");
        reporter.startStep(`Yesterday was a weekend!; Ignore Real Time Occupancy percentage`);
        reporter.endStep();
      } else {
        var yesterday_AllData = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
        let conFigFile = await getEnvConfig()
        reporter.startStep(`Expexted The Yesterday Chart count ${conFigFile.overViewPage['overView'].yesterdayCount} Actual Count- ${yesterday_AllData.length}`);
        expect(conFigFile.overViewPage['overView'].yesterdayCount).toBe(yesterday_AllData.length);
        reporter.endStep();
        for (let i = 8; i < yesterday_AllData.length; i++) {
          yesterday_AllData = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
          try {
            await yesterday_AllData[i].hover()
            await delay(1000)
            performAction(yesterday_AllData[i]);
          } catch (error) {
            logger.error(`Error occurred for Unable to Hover on Yeaterday Chart`)
            reporter.startStep(`Error occurred for Unable to Hover on Yeaterday Chart`);
            expect(true).toBe(false)
            reporter.endStep();
          }
          let configFile = await getEnvConfig()
          let chatHover_Title = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Title, "textContent")
          reporter.startStep(`Expected The Tiltle is - ${configFile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
          if (configFile.overViewPage['overView'].chatHoverTitle == chatHover_Title) {
            logger.info(`Expected The Tiltle is - ${configFile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`)
            expect(configFile.overViewPage['overView'].chatHoverTitle == chatHover_Title).toBeTruthy();
          } else {
            logger.error(`Expected The Tiltle is - ${configFile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
            expect(true).toBe(false)
          }
          let Hover_OccupancyPercentage = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_OccupancyPercentage, "textContent")
          let Hover_OccupancyPercentage_Split = Hover_OccupancyPercentage.split("%");
          let chatHover_OccupancyPercentage = Hover_OccupancyPercentage_Split[0]
          reporter.startStep(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
          if (parseFloat(chatHover_OccupancyPercentage) > 0.0) {
            logger.info(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`)
            expect(parseFloat(chatHover_OccupancyPercentage) > 0.0).toBeTruthy();
          } else {
            logger.error(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          let Hover_Occupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
          let Hover_Occupancy_Split = Hover_Occupancy.split("/");
          let chatHover_Present_Occupancy = Hover_Occupancy_Split[0]
          reporter.startStep(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
          if (chatHover_Present_Occupancy > 0) {
            logger.info(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`)
            expect(chatHover_Present_Occupancy > 0).toBeTruthy();
          } else {
            logger.error(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          let Hover_TotalOccupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
          let Hover_TotalOccupancy_Split = Hover_TotalOccupancy.split("/");
          let chatHover_Total_Occupancy = Hover_TotalOccupancy_Split[1]
          reporter.startStep(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
          if (chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount) {
            logger.info(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`)
            expect(chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount).toBeTruthy();
          } else {
            logger.error(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          reporter.endStep();
        }
      }
      reporter.endStep();
    });

    and('fetch The Last 7 days Occupancy List', async () => {
      reporter.startStep("And fetch The Last 7 days Occupancy List");
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.days),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.last7Days),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      var last7Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
      let conFigFile = await getEnvConfig()
      reporter.startStep(`Expexted The Last 7 Days Chart count ${conFigFile.overViewPage['overView'].last7DaysCount} Actual Count- ${last7Days_alldata.length}`);
      expect(conFigFile.overViewPage['overView'].last7DaysCount).toBe(last7Days_alldata.length);
      reporter.endStep();
      for (let i = 0; i < last7Days_alldata.length; i++) {
        last7Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
        await last7Days_alldata[i].hover()
        await delay(1000)
        let chatHover_Time = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Time, "textContent")
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const visitFrequencyfullyear = chatHover_Time + " " + currentYear;
        const date = new Date(visitFrequencyfullyear);
        const day = date.getDay(); // Get the day of the week
        if (day != 0 && day != 6) { // here verifynot sat and sun
          let chatHover_Title = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Title, "textContent")
          let conFigfile = await getEnvConfig()
          reporter.startStep(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
          if (conFigfile.overViewPage['overView'].chatHoverTitle == chatHover_Title) {
            logger.info(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`)
            expect(conFigfile.overViewPage['overView'].chatHoverTitle == chatHover_Title).toBeTruthy();
          } else {
            logger.error(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
            expect(true).toBe(false)
          }
          let ss = await customScreenshot('building.png')
          reporter.addAttachment("building", ss, "image/png");
          let Hover_OccupancyPercentage = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_OccupancyPercentage, "textContent")
          let Hover_OccupancyPercentage_Split = Hover_OccupancyPercentage.split("%");
          let chatHover_OccupancyPercentage = Hover_OccupancyPercentage_Split[0]
          reporter.startStep(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
          if (parseFloat(chatHover_OccupancyPercentage) > 0.0) {
            logger.info(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`)
            expect(parseFloat(chatHover_OccupancyPercentage) > 0.0).toBeTruthy();
          } else {
            logger.error(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          let Hover_Occupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
          let Hover_Occupancy_Split = Hover_Occupancy.split("/");
          let chatHover_Present_Occupancy = Hover_Occupancy_Split[0]
          reporter.startStep(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
          if (chatHover_OccupancyPercentage > 0) {
            logger.info(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`)
            expect(chatHover_OccupancyPercentage > 0).toBeTruthy();
          } else {
            logger.error(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          let Hover_TotalOccupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
          let Hover_TotalOccupancy_Split = Hover_TotalOccupancy.split("/");
          let chatHover_Total_Occupancy = Hover_TotalOccupancy_Split[1]
          let configFile = await getEnvConfig()
          reporter.startStep(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
          if (chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount) {
            logger.info(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`)
            expect(chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount).toBeTruthy();
          } else {
            logger.error(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          reporter.endStep();
        } else {
          logger.info(`It is weekend!;${chatHover_Time} Ignore The Building Occupancy Count are Non Zero`)
          reporter.startStep(`It is weekend!;${chatHover_Time} Ignore The Building Occupancy Count are Non Zero`);
          reporter.endStep();
        }
      }
      reporter.endStep();
    });

    and('fetch The Last 14 Days Occupancy List', async () => {
      reporter.startStep("And fetch The Last 14 Days Occupancy List");
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.days),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.last14Days),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      var last14Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
      let conFigFile = await getEnvConfig()
      reporter.startStep(`Expexted The Last 14 Days Chart count ${conFigFile.overViewPage['overView'].last14DaysCount} and Actual Count- ${last14Days_alldata.length}`);
      expect(conFigFile.overViewPage['overView'].last14DaysCount).toBe(last14Days_alldata.length);
      reporter.endStep();
      for (let i = 0; i < last14Days_alldata.length; i++) {
        last14Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
        await last14Days_alldata[i].hover()
        await delay(2000)
        let chatHover_Time = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Time, "textContent")
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const visitFrequencyfullyear = chatHover_Time + " " + currentYear;
        const date = new Date(visitFrequencyfullyear);
        const day = date.getDay();
        if (day != 0 && day != 6) {
          let conFigfile = await getEnvConfig()
          let chatHover_Title = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Title, "textContent")
          reporter.startStep(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
          if (conFigfile.overViewPage['overView'].chatHoverTitle == chatHover_Title) {
            logger.info(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`)
            expect(conFigfile.overViewPage['overView'].chatHoverTitle == chatHover_Title).toBeTruthy();
          } else {
            logger.error(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
            expect(true).toBe(false)
          }
          let Hover_OccupancyPercentage = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_OccupancyPercentage, "textContent")
          let Hover_OccupancyPercentage_Split = Hover_OccupancyPercentage.split("%");
          let chatHover_OccupancyPercentage = Hover_OccupancyPercentage_Split[0]
          reporter.startStep(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
          if (parseFloat(chatHover_OccupancyPercentage) > 0.0) {
            logger.info(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`)
            expect(parseFloat(chatHover_OccupancyPercentage) > 0.0).toBeTruthy();
          } else {
            logger.error(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          let Hover_Occupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
          let Hover_Occupancy_Split = Hover_Occupancy.split("/");
          let chatHover_Present_Occupancy = Hover_Occupancy_Split[0]
          reporter.startStep(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
          if (chatHover_OccupancyPercentage > 0) {
            logger.info(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`)
            expect(chatHover_OccupancyPercentage > 0).toBeTruthy();
          } else {
            logger.error(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          let Hover_TotalOccupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
          let Hover_TotalOccupancy_Split = Hover_TotalOccupancy.split("/");
          let chatHover_Total_Occupancy = Hover_TotalOccupancy_Split[1]
          let configFile = await getEnvConfig()
          reporter.startStep(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
          if (chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount) {
            logger.info(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`)
            expect(chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount).toBeTruthy();
          } else {
            logger.error(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          reporter.endStep();
        } else {
          logger.info(`It is weekend!;${chatHover_Time} Ignore The Building Occupancy Count are Non Zero`)
          reporter.startStep(`It is weekend!;${chatHover_Time} Ignore The Building Occupancy Count are Non Zero`);
          reporter.endStep();
        }
      }
      reporter.endStep();
    });

    and('fetch The Last 30 Days Occupancy List', async () => {
      reporter.startStep("And fetch The Last 30 Days Occupancy List");
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.days),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.last30Days),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      var last30Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
      let conFigFile = await getEnvConfig()
      reporter.startStep(`Expexted The Last 30 Days Chart count ${conFigFile.overViewPage['overView'].last30daysCount} and Actual Count- ${last30Days_alldata.length}`);
      expect(conFigFile.overViewPage['overView'].last30daysCount).toBe(last30Days_alldata.length);
      reporter.endStep();
      for (let i = 0; i < last30Days_alldata.length; i++) {
        last30Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
        await last30Days_alldata[i].hover()
        await delay(2000)
        let chatHover_Time = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Time, "textContent")
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const visitFrequencyfullyear = chatHover_Time + " " + currentYear;
        const date = new Date(visitFrequencyfullyear);
        const day = date.getDay();
        if (day != 0 && day != 6) {
          let conFigfile = await getEnvConfig()
          let chatHover_Title = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Title, "textContent")
          reporter.startStep(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
          if (conFigfile.overViewPage['overView'].chatHoverTitle == chatHover_Title) {
            logger.info(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`)
            expect(conFigfile.overViewPage['overView'].chatHoverTitle == chatHover_Title).toBeTruthy();
          } else {
            logger.error(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
            expect(true).toBe(false)
          }
          let Hover_OccupancyPercentage = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_OccupancyPercentage, "textContent")
          let Hover_OccupancyPercentage_Split = Hover_OccupancyPercentage.split("%");
          let chatHover_OccupancyPercentage = Hover_OccupancyPercentage_Split[0]
          reporter.startStep(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
          if (parseFloat(chatHover_OccupancyPercentage) > 0.0) {
            logger.info(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`)
            expect(parseFloat(chatHover_OccupancyPercentage) > 0.0).toBeTruthy();
          } else {
            logger.error(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
            expect(true).toBe(false)
          }
          let ss = await customScreenshot('building.png')
          reporter.addAttachment("building", ss, "image/png");
          reporter.endStep();
          let Hover_Occupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
          let Hover_Occupancy_Split = Hover_Occupancy.split("/");
          let chatHover_Present_Occupancy = Hover_Occupancy_Split[0]
          reporter.startStep(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
          if (chatHover_OccupancyPercentage > 0) {
            logger.info(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`)
            expect(chatHover_OccupancyPercentage > 0).toBeTruthy();
          } else {
            logger.error(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          let Hover_TotalOccupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
          let Hover_TotalOccupancy_Split = Hover_TotalOccupancy.split("/");
          let chatHover_Total_Occupancy = Hover_TotalOccupancy_Split[1]
          let configFile = await getEnvConfig()
          reporter.startStep(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
          if (chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount) {
            logger.info(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`)
            expect(chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount).toBeTruthy();
          } else {
            logger.error(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          reporter.endStep();
        } else {
          logger.info(`It is weekend!;${chatHover_Time} Ignore The Building Occupancy Count are Non Zero`)
          reporter.startStep(`It is weekend!;${chatHover_Time} Ignore The Building Occupancy Count are Non Zero`);
          reporter.endStep();
        }
      }
      reporter.endStep();
    });

    and('fetch The Today Occupancy List', async () => {
      reporter.startStep("And fetch The Today Occupancy List");
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.days),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", allPropertiesOverviewPage.button.today),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
      date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      hours = parseInt(date.split(' ')[1].split(':')[0])
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          var today_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData_Today)
          for (let i = 8; i < today_alldata.length; i++) {
            today_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData_Today)
            try {
              await today_alldata[i].hover()
              await delay(2000)
              performAction(today_alldata[i]);
            } catch (error) {
              logger.error(`Error occurred for Unable to Hover on Today Chart`)
              reporter.startStep(`Error occurred for Unable to Hover on Today Chart`);
              expect(true).toBe(false)
              reporter.endStep();
            }
            let chatHover_Title = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Title, "textContent")
            let conFigfile = await getEnvConfig()
            reporter.startStep(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
            if (conFigfile.overViewPage['overView'].chatHoverTitle == chatHover_Title) {
              logger.info(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`)
              expect(conFigfile.overViewPage['overView'].chatHoverTitle == chatHover_Title).toBeTruthy();
            } else {
              logger.error(`Expected The Tiltle is - ${conFigfile.overViewPage['overView'].chatHoverTitle} and Actual Title is ${chatHover_Title}`);
              expect(true).toBe(false)
            }
            let Hover_OccupancyPercentage = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_OccupancyPercentage, "textContent")
            let Hover_OccupancyPercentage_Split = Hover_OccupancyPercentage.split("%");
            let chatHover_OccupancyPercentage = Hover_OccupancyPercentage_Split[0]
            reporter.startStep(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
            if (parseFloat(chatHover_OccupancyPercentage) > 0.0) {
              logger.info(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`)
              expect(parseFloat(chatHover_OccupancyPercentage) > 0.0).toBeTruthy();
            } else {
              logger.error(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${chatHover_OccupancyPercentage}%`);
              expect(true).toBe(false)
            }
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            reporter.endStep();
            let Hover_Occupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
            let Hover_Occupancy_Split = Hover_Occupancy.split("/");
            let chatHover_Present_Occupancy = Hover_Occupancy_Split[0]
            reporter.startStep(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
            if (chatHover_OccupancyPercentage > 0) {
              logger.info(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`)
              expect(chatHover_OccupancyPercentage > 0).toBeTruthy();
            } else {
              logger.error(`Expected Current Occupancy is Non Zero and Actual Status is - ${chatHover_Present_Occupancy}`);
              expect(true).toBe(false)
            }
            reporter.endStep();
            let Hover_TotalOccupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
            let Hover_TotalOccupancy_Split = Hover_TotalOccupancy.split("/");
            let chatHover_Total_Occupancy = Hover_TotalOccupancy_Split[1]
            let configFile = await getEnvConfig()
            reporter.startStep(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
            if (chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount) {
              logger.info(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`)
              expect(chatHover_Total_Occupancy == configFile.overViewPage['overView'].total_occupancyCount).toBeTruthy();
            } else {
              logger.error(`Expected Total Occupancy Count is - ${configFile.overViewPage['overView'].total_occupancyCount} and Actual Count -${chatHover_Total_Occupancy}`);
              expect(true).toBe(false)
            }
            reporter.endStep();
            reporter.endStep();
          }
        } else {
          logger.info("Not busy time; Ignore Real Time Occupancy percentage")
          reporter.startStep(`Not busy time; Ignore Real Time Occupancy percentage`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Real Time Occupancy percentage")
        reporter.startStep(`It is weekend!; Ignore Real Time Occupancy percentage`);
        reporter.endStep();
      }
      reporter.endStep();
    });
  });


  test('Validate The Occupancy and Building Count in Overview Page', async ({
    given,
    when,
    then,
    and
  }) => {
    var occupancy_value, date, day, hours, buildingName
    givenIamLoggedIn(given)
    when('I Click Days in All Properties OverView Page', async () => {
      reporter.startStep(`When I Click Days in All Properties OverView Page`);
      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      reporter.endStep();
    });

    then('Verify The OverView Page Time', async () => {
      reporter.startStep("Then Verify The OverView Page Time");
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      await delay(2000)
      let totaltime = await getPropertyValueByXpath(allPropertiesOverviewPage.div.overall_Time, "textContent")
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let last__Update_Time_OverView = splitvalueDate + ", " + totaltime
      let estTime = new Date();
      let month = estTime.getMonth() + 1;
      let day = estTime.getDate();
      let year = estTime.getFullYear().toString();
      let hours = estTime.getHours();
      let minutes = estTime.getMinutes();
      let am_pm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      let strTimeEST = month + '/' + day + '/' + year + ',' + hours + ':' + minutes + ' ' + am_pm;
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(last__Update_Time_OverView)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Real Time Occupancy Percentage in Overview page', async () => {
      reporter.startStep("And Verify The Real Time Occupancy Percentage in Overview page");
      day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
      date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      hours = parseInt(date.split(' ')[1].split(':')[0])
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          let realTime_OccupancyPercent = await getPropertyValueByXpath(allPropertiesOverviewPage.div.realTime_OccupancyPercentage, "textContent")
          reporter.startStep(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${realTime_OccupancyPercent}%`);
          if (parseFloat(realTime_OccupancyPercent) > 0.0) {
            logger.info(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${realTime_OccupancyPercent}%`)
            expect(parseFloat(realTime_OccupancyPercent) > 0.0).toBeTruthy();
          } else {
            logger.error(`Expected Occupancy Percentage Non Zero and Actual Percentage is - ${realTime_OccupancyPercent}%`);
            expect(true).toBe(false)
          }
          let ss = await customScreenshot('building.png')
          reporter.addAttachment("building", ss, "image/png");
          reporter.endStep();
        } else {
          logger.info("Not busy time; Ignore Real Time Occupancy percentage")
          reporter.startStep(`Not busy time; Ignore Real Time Occupancy percentage`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Real Time Occupancy percentage")
        reporter.startStep(`It is weekend!; Ignore Real Time Occupancy percentage`);
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify The Building Count in Overview page', async () => {
      reporter.startStep("And Verify The Building Count in Overview page");
      let configFile = await getEnvConfig()
      let building_count = await getPropertyValueByXpath(allPropertiesOverviewPage.div.build_count, "textContent")
      let building_countSplit = building_count.split(" ");
      let building_countVal = building_countSplit[0]
      reporter.startStep(`Expected Building Count is ${configFile.overViewPage['overView'].buildingCount} and Actual count is ${building_countVal}`);
      if (building_countVal === configFile.overViewPage['overView'].buildingCount) {
        logger.info(`Expected Building Count is ${configFile.overViewPage['overView'].buildingCount} and Actual count is ${building_countVal}`)
        expect(configFile.overViewPage['overView'].buildingCount).toBe(building_countVal);
      } else {
        logger.error(`Expected Building Count is ${configFile.overViewPage['overView'].buildingCount} and Actual count is ${building_countVal}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('fetch all Occupancy List in Overview page', async () => {
      reporter.startStep("And fetch all Occupancy List in Overview page");
      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      var all_Building_Occupancy = await getElementHandleByXpath(allPropertiesOverviewPage.tbody.all_BuildOccupancy)
      for (let i = 0; i < all_Building_Occupancy.length; i++) {
        let all_Building = await all_Building_Occupancy[i].$x(allPropertiesOverviewPage.div.all_BuildingName)
        let all_Building_Name = await getPropertyValue(all_Building[0], "textContent")
        reporter.startStep(`Verify The Building Name is - ${all_Building_Name}`);
        let configFile = await getEnvConfig()
        let all_occupancy_Count = await all_Building_Occupancy[i].$x(allPropertiesOverviewPage.tbody.occupancy_Count_NonZero)
        let occupancy_Count_allproper = await getPropertyValue(all_occupancy_Count[0], "textContent")
        let occupancy_Count_allproper_Split = occupancy_Count_allproper.split("/");
        let occupancy_Count_allpropertiesVal = occupancy_Count_allproper_Split[1]
        let occupancy_Count_allproperties = occupancy_Count_allpropertiesVal.trim();
        reporter.startStep(`Expected Occupancy Count - ${configFile.Building[all_Building_Name].total_People} and actual count - ${occupancy_Count_allproperties}`);
        reporter.endStep();
        if (occupancy_Count_allproperties == configFile.Building[all_Building_Name].total_People) {
          logger.info(`Expected Occupancy Count ${configFile.Building[all_Building_Name].total_People} and actual count ${occupancy_Count_allproperties} `)
          expect(occupancy_Count_allproperties == configFile.Building[all_Building_Name].total_People).toBeTruthy();
        } else {
          logger.error(`Expected Occupancy Count ${configFile.Building[all_Building_Name].total_People} and actual count ${occupancy_Count_allproperties} `)
          expect(true).toBe(false)
        }
        day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
        date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
        hours = parseInt(date.split(' ')[1].split(':')[0])
        if (day != 'Sat' && day != 'Sun') {
          if ((hours >= 8 && hours <= 18)) {
            logger.info("In Busy time")
            let all_occupancy_perecent = await all_Building_Occupancy[i].$x(allPropertiesOverviewPage.tbody.list_Occupancy_Percent)
            let occupancy_Count_percent = await getPropertyValue(all_occupancy_perecent[0], "textContent")
            reporter.startStep(`Expected The Building - ${all_Building_Name} Occupancy Count are Non Zero and Actual Count is - ${occupancy_Count_percent}`);
            reporter.endStep();
            if ((occupancy_Count_percent) > 0 + "%") {
              logger.info(`Expected Occupancy Count are Non Zero and Actual Count is - ${occupancy_Count_percent}`)
              expect((occupancy_Count_percent) > 0 + "%").toBeTruthy();
            } else {
              logger.error(`Expected Occupancy Count are Non Zero and Actual Count is - ${occupancy_Count_percent}`);
              expect(true).toBe(false)
            }
          } else {
            logger.info("Not busy time; Ignore Real Time Occupancy percentage")
            reporter.startStep(`Not busy time; Ignore Real Time Occupancy percentage`);
            reporter.endStep();
          }
        } else {
          logger.info("It is weekend!; Ignore Real Time Occupancy percentage")
          reporter.startStep(`It is weekend!; Ignore Real Time Occupancy percentage`);
          reporter.endStep();
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify The OverView Page last Update Time', async () => {
      reporter.startStep("And Verify The OverView Page last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(allPropertiesOverviewPage.div.overViewPage_CornerTime, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let totaltime = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let last__Update_Time_OverView = splitvalueDate + ", " + totaltime
      let estTime = new Date();
      let month = estTime.getMonth() + 1;
      let day = estTime.getDate();
      let year = estTime.getFullYear().toString();
      let hours = estTime.getHours();
      let minutes = estTime.getMinutes();
      let am_pm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      let strTimeEST = month + '/' + day + '/' + year + ',' + hours + ':' + minutes + ' ' + am_pm;
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(last__Update_Time_OverView)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });
  });


  test('Navigate All Properties Overview Page and Verify the chart', async ({
    given,
    when,
    then,
    and
}) => {
    let occupancy_value, date, day, hours
    givenIamLoggedIn(given)
    when('I Click Days in All Properties OverView Page', async () => {
        reporter.startStep(`When I Click Days in All Properties OverView Page`);
        await Promise.all([
            performAction("click", allPropertiesOverviewPage.button.days),
            waitForNetworkIdle(120000)
        ])
        await Promise.all([
            performAction("click", allPropertiesOverviewPage.button.last7Days),
            waitForNetworkIdle(120000)
        ])
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        reporter.endStep();
    });

    then('verify last 7 days in last 14 days', async () => {
        reporter.startStep("Then verify last 7 days in last 14 days");
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        var last7Days = [];
        var last7DaysPeopelePercentage = [];
        var last7DaysPeopeleCount = [];

        var last7Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
        for (let i = 0; i < last7Days_alldata.length; i++) {
            last7Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
            try {
                await last7Days_alldata[i].hover()
                await delay(1000)
                performAction(last7Days_alldata[i]);
            } catch (error) {
                logger.error(`Error occurred for Unable to Hover The last 7 days Chart in All properties OverviewPage`)
                reporter.startStep(`Error occurred for Unable to Hover The last 7 days Chart in All properties OverviewPage`);
                expect(true).toBe(false)
                reporter.endStep();
            }
            await delay(2000)
            let chatHover_Time = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Time, "textContent")
            last7Days.push(chatHover_Time);

            let Hover_OccupancyPercentage = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_OccupancyPercentage, "textContent")
            let Hover_OccupancyPercentage_Split = Hover_OccupancyPercentage.split("%");
            let OccupancyPercentage = Hover_OccupancyPercentage_Split[0]
            last7DaysPeopelePercentage.push(OccupancyPercentage);

            let Hover_Occupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
            let Hover_Occupancy_Split = Hover_Occupancy.split("/");
            let OccupancyCount = Hover_Occupancy_Split[0]
            last7DaysPeopeleCount.push(OccupancyCount);
        }
        await Promise.all([
            performAction("click", allPropertiesOverviewPage.button.days),
            waitForNetworkIdle(120000)
        ])
        await Promise.all([
            performAction("click", allPropertiesOverviewPage.button.last14Days),
            waitForNetworkIdle(120000)
        ])

        var last14Days = [];
        var last14DaysPeopelePercentage = [];
        var last14DaysPeopeleCount = [];

        var last14Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
        for (let j = 7; j < last14Days_alldata.length; j++) {
            last14Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)

            try {
                await last14Days_alldata[j].hover()
                await delay(1000)
                performAction(last14Days_alldata[j]);
            } catch (error) {
                logger.error(`Error occurred for Unable to Hover The last 14 days Chart in All properties OverviewPage`)
                reporter.startStep(`Error occurred for Unable to Hover The last 14 days Chart in All properties OverviewPage`);
                expect(true).toBe(false)
                reporter.endStep();
            }
            await delay(2000)
            let chatHover_Time = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Time, "textContent")
            last14Days.push(chatHover_Time);

            let Hover_OccupancyPercentage = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_OccupancyPercentage, "textContent")
            let Hover_OccupancyPercentage_Split = Hover_OccupancyPercentage.split("%");
            let OccupancyPercentage = Hover_OccupancyPercentage_Split[0]
            last14DaysPeopelePercentage.push(OccupancyPercentage);

            let Hover_Occupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
            let Hover_Occupancy_Split = Hover_Occupancy.split("/");
            let OccupancyCount = Hover_Occupancy_Split[0]
            last14DaysPeopeleCount.push(OccupancyCount);
        }
        reporter.startStep(`Verify The last 7 Days Date and last 14 Days Date equal or not`);
        for (let i2 = 0; i2 < last7Days.length; i2++) {
            reporter.startStep(`Expected last 7 Days Date is - ${last7Days[i2]}  and last 14 Days Date - ${last14Days[i2]} are equal`);
            if (last7Days[i2] == last14Days[i2]) {
                expect(last7Days[i2] == last14Days[i2]).toBeTruthy();
                logger.info(`Expected last 7 Days Date is - ${last7Days[i2]}  and last 14 Days Date - ${last14Days[i2]} are equal`);
            } else {
                logger.error(`Expected last 7 Days Date is - ${last7Days[i2]}  and last 14 Days Date - ${last14Days[i2]} are equal`);
                expect(true).toBe(false)
            }
            reporter.endStep();
        }
        reporter.endStep();

        reporter.startStep(`Verify The last 7 Days Occupancy Percentage and and last 14 Occupancy Percentage equal or not`);
        for (let i3 = 0; i3 < last7DaysPeopelePercentage.length; i3++) {
            reporter.startStep(`Expected last 7 Days Occupancy Percentage - ${last7DaysPeopelePercentage[i3]}  and last 14 Occupancy Percentage - ${last14DaysPeopelePercentage[i3]} are equal`);
            if (last7DaysPeopelePercentage[i3] == last14DaysPeopelePercentage[i3]) {
                expect(last7DaysPeopelePercentage[i3] == last14DaysPeopelePercentage[i3]).toBeTruthy();
                logger.info(`Expected last 7 Days Occupancy Percentage - ${last7DaysPeopelePercentage[i3]}  and last 14 Occupancy Percentage - ${last14DaysPeopelePercentage[i3]} are equal`);
            } else {
                logger.error(`Expected last 7 Days Occupancy Percentage - ${last7DaysPeopelePercentage[i3]}  and last 14 Occupancy Percentage - ${last14DaysPeopelePercentage[i3]} are equal`);
                expect(true).toBe(false)
            }
            reporter.endStep();
        }
        reporter.endStep();

        reporter.startStep(`Verify The last 7 Days Occupancy Count and and last 14 Occupancy Count equal or not`);
        for (let i4 = 0; i4 < last7DaysPeopeleCount.length; i4++) {
            reporter.startStep(`Expected last 7 Days Occupancy Count - ${last7DaysPeopeleCount[i4]}  and last 14 Occupancy Count - ${last14DaysPeopeleCount[i4]} are equal`);
            if (last7DaysPeopeleCount[i4] == last14DaysPeopeleCount[i4]) {
                expect(last7DaysPeopeleCount[i4] == last14DaysPeopeleCount[i4]).toBeTruthy();
                logger.info(`Expected last 7 Days Occupancy Count - ${last7DaysPeopeleCount[i4]}  and last 14 Occupancy Count - ${last14DaysPeopeleCount[i4]} are equal`);
            } else {
                logger.error(`Expected last 7 Days Occupancy Count - ${last7DaysPeopeleCount[i4]}  and last 14 Occupancy Count - ${last14DaysPeopeleCount[i4]} are equal`);
                expect(true).toBe(false)
            }
            reporter.endStep();
        }
        reporter.endStep();
        reporter.endStep();
    });


    and('verify last 14 days in last 30 days', async () => {
        reporter.startStep("And verify last 14 days in last 30 days");
        var last14Days = [];
        var last14DaysPeopelePercentage = [];
        var last14DaysPeopeleCount = [];
        var last14Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
        for (let j = 0; j < last14Days_alldata.length; j++) {
            last14Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
            try {
                await last14Days_alldata[j].hover()
                await delay(1000)
                performAction(last14Days_alldata[j]);
            } catch (error) {
                logger.error(`Error occurred for Unable to Hover The last 14 days Chart in All properties OverviewPage`)
                reporter.startStep(`Error occurred for Unable to Hover The last 14 days Chart in All properties OverviewPage`);
                expect(true).toBe(false)
                reporter.endStep();
            }
            await delay(2000)
            let chatHover_Time = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Time, "textContent")
            last14Days.push(chatHover_Time);

            let Hover_OccupancyPercentage = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_OccupancyPercentage, "textContent")
            let Hover_OccupancyPercentage_Split = Hover_OccupancyPercentage.split("%");
            let OccupancyPercentage = Hover_OccupancyPercentage_Split[0]
            last14DaysPeopelePercentage.push(OccupancyPercentage);

            let Hover_Occupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
            let Hover_Occupancy_Split = Hover_Occupancy.split("/");
            let OccupancyCount = Hover_Occupancy_Split[0]
            last14DaysPeopeleCount.push(OccupancyCount);
        }
        await Promise.all([
            performAction("click", allPropertiesOverviewPage.button.days),
            waitForNetworkIdle(120000)
        ])
        await Promise.all([
            performAction("click", allPropertiesOverviewPage.button.last30Days),
            waitForNetworkIdle(120000)
        ])
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        var last30Days = [];
        var last30DaysPeopelePercentage = [];
        var last30DaysPeopeleCount = [];
        var last14Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
        for (let i = 16; i < last14Days_alldata.length; i++) {
            last14Days_alldata = await getElementHandleByXpath(allPropertiesOverviewPage.div.chat_AllData)
            try {
                await last14Days_alldata[i].hover()
                await delay(1000)
                performAction(last14Days_alldata[i]);
            } catch (error) {
                logger.error(`Error occurred for Unable to Hover The last 30 days Chart in All properties OverviewPage`)
                reporter.startStep(`Error occurred for Unable to Hover The last 30 days Chart in All properties OverviewPage`);
                expect(true).toBe(false)
                reporter.endStep();
            }
            await delay(2000)
            let chatHover_Time = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Time, "textContent")
            last30Days.push(chatHover_Time);

            let Hover_OccupancyPercentage = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_OccupancyPercentage, "textContent")
            let Hover_OccupancyPercentage_Split = Hover_OccupancyPercentage.split("%");
            let OccupancyPercentage = Hover_OccupancyPercentage_Split[0]
            last30DaysPeopelePercentage.push(OccupancyPercentage);

            let Hover_Occupancy = await getPropertyValueByXpath(allPropertiesOverviewPage.div.chat_Hover_Occupancy, "textContent")
            let Hover_Occupancy_Split = Hover_Occupancy.split("/");
            let OccupancyCount = Hover_Occupancy_Split[0]
            last30DaysPeopeleCount.push(OccupancyCount);
        }
        reporter.startStep(`Verify The last 14 Days Date and last 30 Days Date equal or not`);
        for (let i2 = 0; i2 < last30Days.length; i2++) {
            reporter.startStep(`Expected last 30 Days Date is - ${last30Days[i2]}  and last 14 Days Date - ${last14Days[i2]}  equal or not`);
            if (last30Days[i2] == last14Days[i2]) {
                expect(last30Days[i2] == last14Days[i2]).toBeTruthy();
                logger.info(`Expected last 30 Days Date is - ${last30Days[i2]}  and last 14 Days Date - ${last14Days[i2]} are equal`);
            } else {
                logger.error(`Expected last 30 Days Date is - ${last30Days[i2]}  and last 14 Days Date - ${last14Days[i2]} are equal`);
                expect(true).toBe(false)
            }
            reporter.endStep();
        }
        reporter.endStep();

        reporter.startStep(`Verify The last 30 Days Occupancy Percentage and and last 14 Occupancy Percentage equal or not`);
        for (let i3 = 0; i3 < last30DaysPeopelePercentage.length; i3++) {
            reporter.startStep(`Expected last 30 Days Occupancy Percentage - ${last30DaysPeopelePercentage[i3]}  and last 14 Occupancy Percentage - ${last14DaysPeopelePercentage[i3]} are equal`);
            if (last30DaysPeopelePercentage[i3] == last14DaysPeopelePercentage[i3]) {
                expect(last30DaysPeopelePercentage[i3] == last14DaysPeopelePercentage[i3]).toBeTruthy();
                logger.info(`Expected last 30 Days Occupancy Percentage - ${last30DaysPeopelePercentage[i3]}  and last 14 Occupancy Percentage - ${last14DaysPeopelePercentage[i3]} are equal`);
            } else {
                logger.error(`Expected last 30 Days Occupancy Percentage - ${last30DaysPeopelePercentage[i3]}  and last 14 Occupancy Percentage - ${last14DaysPeopelePercentage[i3]} are equal`);
                expect(true).toBe(false)
            }
            reporter.endStep();
        }
        reporter.endStep();

        reporter.startStep(`Verify The last 30 Days Occupancy Count and and last 14 Days Occupancy Count equal or not`);
        for (let i4 = 0; i4 < last30DaysPeopeleCount.length; i4++) {
            reporter.startStep(`Expected last 30 Days Occupancy Count - ${last30DaysPeopeleCount[i4]}  and last 14 Occupancy Count - ${last14DaysPeopeleCount[i4]} are equal`);
            if (last30DaysPeopeleCount[i4] == last14DaysPeopeleCount[i4]) {
                expect(last30DaysPeopeleCount[i4] == last14DaysPeopeleCount[i4]).toBeTruthy();
                logger.info(`Expected last 30 Days Occupancy Count - ${last30DaysPeopeleCount[i4]}  and last 14 Occupancy Count - ${last14DaysPeopeleCount[i4]} are equal`);
            } else {
                logger.error(`Expected last 30 Days Occupancy Count - ${last30DaysPeopeleCount[i4]}  and last 14 Occupancy Count - ${last14DaysPeopeleCount[i4]} are equal`);
                expect(true).toBe(false)
            }
            reporter.endStep();
        }
        reporter.endStep();
        reporter.endStep();
    });
});
});









