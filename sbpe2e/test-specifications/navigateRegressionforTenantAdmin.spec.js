import { assert } from 'console';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, delay, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle, getDefaultValueByXPath } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab, envTab, loginPage, verifyBuildPage, commons, tenantAdmin } from '../constants/locators';
import { environment_Sensor } from '../constants/environment_sensor';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding, givenIamLoggedTn, } from './shared-steps';
import exp from 'constants';
let action;


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateRegressionforTenantAdmin.feature',
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
    let config = await getEnvConfig()
    await goTo(config.sbpURL)
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
      await page.waitFor(7000);

      let config = await getEnvConfig()
      await har.start({ path: './reports/sbp' + global.testStart + '.har', saveResponse: true });
      logger.info("global.env = " + global.env)
      await goTo(config.sbpURL)
      await login(global.env, "TA")
      await customScreenshot('beforeAll.png')
    }
    catch (err) {
      logger.error(err);
    }
  })

  test('Navigate the <Building> and Verify The Overviewpage', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    then('Verify The Visit Frequency last Update Time', async () => {
      reporter.startStep("Then Verify The Visit Frequency last Update Time");
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      await delay(2000)
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.overViewPage_CornerTime, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and(/^Verify Building Name and Building Address "(.*)"$/, async (building) => {
      reporter.startStep(`Verify Building Name and Building Address`);
      buildingName = building
      let build_Name = await getPropertyValueByXpath(tenantAdmin.div.buildingName, "textContent")
      let address = await getEnvConfig()
      reporter.startStep(`Expected Building Name is - ${address.Building1[buildingName].building_name} and Actual Building Name is - ${build_Name}`);
      reporter.endStep();
      if (build_Name === address.Building1[buildingName].building_name) {
        logger.info(`Expected Building Name is - ${address.Building1[buildingName].building_name} and Actual Building Name is - ${build_Name}`)
        expect(address.Building1[buildingName].building_name).toBe(build_Name);
      } else {
        logger.error(`Expected Building Name is ${address.Building1[buildingName].building_name} and Actual Building Name is ${build_Name}`);
        expect(true).toBe(false)
      }
      let build_Address = await getPropertyValueByXpath(tenantAdmin.div.building_Address, "textContent")
      reporter.startStep(`Expected Building Address is - ${address.Building1[buildingName].Address} and Actual Building Address is - ${build_Address}`);
      reporter.endStep();
      if (build_Address === address.Building1[buildingName].Address) {
        logger.info(`Expected Building Address is - ${address.Building1[buildingName].Address} and Actual Building Address is - ${build_Address}`)
        expect(address.Building1[buildingName].Address).toBe(build_Address);
      } else {
        logger.error(`Expected Building Address is ${address.Building1[buildingName].Address} and Actual Building Address is ${build_Address}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
    });

    and('validate Environment status Thermal and Air and Light and Sound', async () => {
      reporter.startStep(`And validate Environment status Thermal and Air and Light and Sound`);
      reporter.startStep(`Verify The Environment Thermal Quality`);
      let thermalQauality = await getPropertyValueByXpath(tenantAdmin.h6.thermalQuality, "textContent")
      const thermalQaualityList = ["Within optimal range", "Outside optimal range"]
      reporter.startStep(`Expected Thermal Quality Status ${thermalQaualityList} and Actual Status - ${thermalQauality}`);
      if ((thermalQauality === "Within optimal range") || (thermalQauality === "Outside optimal range")) {
        logger.info(`Expected Thermal Quality Status ${thermalQaualityList} and Actual Status - ${thermalQauality}`)
        expect(thermalQaualityList.includes(thermalQauality)).toBeTruthy()
      } else {
        logger.error(`Expected Thermal Quality Status ${thermalQaualityList} and Actual Status ${thermalQauality}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      reporter.startStep(`Verify The Environment Air Quality`);
      let airQualityStatus = await getPropertyValueByXpath(tenantAdmin.h6.airQuality, "textContent")
      const airQaualityList = ["Within optimal range", "Outside optimal range"]
      reporter.startStep(`Expected Environment Air Quality Status - ${airQaualityList} and Actual Status - ${airQualityStatus}`);
      if ((airQualityStatus === "Within optimal range") || (airQualityStatus === "Outside optimal range")) {
        logger.info(`Expected Environment Air Quality Status - ${airQaualityList} and Actual Status - ${airQualityStatus}`)
        expect(airQaualityList.includes(airQualityStatus)).toBeTruthy()
      } else {
        logger.error(`Expected Environment Air Quality Status - ${airQaualityList} and Actual Status - ${airQualityStatus}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      reporter.startStep(`Verify The Environment Light Quality`);
      let lightQualityStatus = await getPropertyValueByXpath(tenantAdmin.h6.lightQuality, "textContent")
      const lightQaualityList = ["Within optimal range", "Outside optimal range"]
      reporter.startStep(`Expected Environment Light Quality Status - ${lightQaualityList} and Actual Status - ${lightQualityStatus}`);
      if ((lightQualityStatus === "Within optimal range") || (lightQualityStatus === "Outside optimal range")) {
        logger.info(`Expected Environment Light Quality Status - ${lightQaualityList} and Actual Status - ${lightQualityStatus}`)
        expect(lightQaualityList.includes(lightQualityStatus)).toBeTruthy()
      } else {
        logger.error(`Expected Environment Light Quality Status - ${lightQaualityList} and Actual Status - ${lightQualityStatus}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      // reporter.startStep(`Verify The Environment Sound Quality`);
      // let soundQualityStatus = await getPropertyValueByXpath(tenantAdmin.h6.soundQuality, "textContent")
      // reporter.startStep(`Expected Sound Quality Status - ${"N/A"} and Actual Status - ${soundQualityStatus}`);
      // if (soundQualityStatus === "N/A") {
      //   logger.info(`Expected Sound Quality Status - ${"N/A"} and Actual Status - ${soundQualityStatus}`)
      //   expect("N/A").toBe(soundQualityStatus);
      // } else {
      //   logger.error(`Expected Sound Quality Status ${"N/A"} and Actual Status ${soundQualityStatus}`);
      //   expect(true).toBe(false)
      // }
      // reporter.endStep();
     // reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Environment see more option', async () => {
      reporter.startStep(`And Verify The Environment see more option`);
      await Promise.all([
        performAction("click", tenantAdmin.h4.environment_Seemore_Option),
        waitForNetworkIdle(120000)
      ])
      let environment_Weather = await getPropertyValueByXpath(tenantAdmin.div.environmentPage_Text, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Environment Page Text  - ${conFig.Building1[buildingName].environment_SeeMore} and Actual Text - ${environment_Weather}`);
      if (environment_Weather === conFig.Building1[buildingName].environment_SeeMore) {
        logger.info(`Expected The Environment Page Text  - ${conFig.Building1[buildingName].environment_SeeMore} and Actual Text - ${environment_Weather}`)
        expect(conFig.Building1[buildingName].environment_SeeMore).toBe(environment_Weather);
      } else {
        logger.error(`Expected The Environment Page Text  - ${conFig.Building1[buildingName].environment_SeeMore} and Actual Text - ${environment_Weather}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    and('Verify The Energy see more option', async () => {
      reporter.startStep(`And Verify The Energy see more option`);
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.h4.energy_Seemore_Option),
        waitForNetworkIdle(120000)
      ])
      await delay(2000)
      let energyPage = await getPropertyValueByXpath(tenantAdmin.div.energyPage_Text, "textContent")
      await delay(2000)
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Energy Page Text  - ${conFig.Building1[buildingName].energy_SeeMore} and Actual Text - ${energyPage}`);
      if (energyPage === conFig.Building1[buildingName].energy_SeeMore) {
        logger.info(`Expected The Energy Page Text  - ${conFig.Building1[buildingName].energy_SeeMore} and Actual Text - ${energyPage}`)
        expect(conFig.Building1[buildingName].energy_SeeMore).toBe(energyPage);
      } else {
        logger.error(`The Energy Page Text  - ${conFig.Building1[buildingName].energy_SeeMore} and Actual Text - ${energyPage}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      await delay(2000)
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      reporter.endStep();
    });

    and('Click The Building Occupancy See More option', async () => {
      reporter.startStep(`And Click The Building Occupancy See More option`);
      let ss1 = await customScreenshot('building.png')
      reporter.addAttachment("building", ss1, "image/png");
      await delay(6000)
      performAction("click", tenantAdmin.h4.seeMoreOption_Occ),
        await delay(6000);
      let conFig = await getEnvConfig()
      let buildingOccupancyTxtSeeMore = await getPropertyValueByXpath(tenantAdmin.h5.buildingOccupancyTxt_SeeMore, "textContent")
      reporter.startStep(`Expected Building Occupancy Text In See more Option   - ${conFig.Building1[buildingName].buildOccTextSeeMore} and Actual  status - ${buildingOccupancyTxtSeeMore}`);
      if (buildingOccupancyTxtSeeMore === conFig.Building1[buildingName].buildOccTextSeeMore) {
        logger.info(`Expected Building Occupancy Text In See more Option- ${conFig.Building1[buildingName].buildOccTextSeeMore} and Actual  status - ${buildingOccupancyTxtSeeMore}`)
        expect(conFig.Building1[buildingName].buildOccTextSeeMore).toBe(buildingOccupancyTxtSeeMore);
      } else {
        logger.error(`Expected Building Occupancy Text In See more Option - ${conFig.Building1[buildingName].buildOccTextSeeMore} and Actual  status - ${buildingOccupancyTxtSeeMore}`);
        expect(true).toBe(false)
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
      await delay(2000)
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      reporter.endStep();
    });
  });

  test('Navigate the <Building> and Validate the Visit Frequency in overview page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    then(/^Verify The Title "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep("Then Verify The Title");
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      let page_Title1_visit = await getPropertyValueByXpath(tenantAdmin.div.overViewPage_Title1, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Title  - ${conFig.Building1[buildingName].page_Title1} and Actual Title - ${page_Title1_visit}`);
      if (page_Title1_visit === conFig.Building1[buildingName].page_Title1) {
        logger.info(`Expected Title  - ${conFig.Building1[buildingName].page_Title1} and Actual Title - ${page_Title1_visit}`)
        expect(conFig.Building1[buildingName].page_Title1).toBe(page_Title1_visit);
      } else {
        logger.error(`Expected The Title  - ${conFig.Building1[buildingName].page_Title1} and Actual Title - ${page_Title1_visit}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Total Unique Users Title in visit frequency', async () => {
      reporter.startStep(`And Verify The Total Unique Users Title in visit frequency`);
      let Total_Unique_Users_Title = await getPropertyValueByXpath(tenantAdmin.div.total_Unique_Users, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Total Unique Users Title - ${conFig.Building1[buildingName].unique_Users_Title} and Actual - ${Total_Unique_Users_Title}`);
      if (Total_Unique_Users_Title === conFig.Building1[buildingName].unique_Users_Title) {
        logger.info(`Expected The Total Unique Users Title - ${conFig.Building1[buildingName].unique_Users_Title} and Actual - ${Total_Unique_Users_Title}`)
        expect(conFig.Building1[buildingName].unique_Users_Title).toBe(Total_Unique_Users_Title);
      } else {
        logger.error(`Expected The Total Unique Users Title - ${conFig.Building1[buildingName].unique_Users_Title} and Actual - ${Total_Unique_Users_Title}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Total Unique Users Count', async () => {
      reporter.startStep(`And Verify The Total Unique Users Count`);
      let totalUsers_Count = await getPropertyValueByXpath(tenantAdmin.div.total_users_Count, "textContent")
      reporter.startStep(`Expected The Total Unique Users Count - Non Zero and Actual count is - ${totalUsers_Count}`);
      reporter.endStep();
      if (totalUsers_Count > 0) {
        logger.info(`Expected The Total Unique Users Count - Non Zero and Actual count is - ${totalUsers_Count}`)
        expect(totalUsers_Count > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Total Unique Users Count - Non Zero and Actual count is - ${totalUsers_Count}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
    });

    //here Validate peak day in 90days
    and('verify the peak day in 90 days', async () => {
      reporter.startStep(`And verify the peak day in 90 days`);
      let PeakUsers = await getPropertyValueByXpath(tenantAdmin.div.peak_users, "textContent")
      let PeakUserssplit = PeakUsers.split(" ");
      let Peak_Users = PeakUserssplit[2]
      var currentDate = new Date();
      var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var splitvalueDate = daysOfWeek[currentDate.getDay()];
      reporter.startStep(`Expected the peak day in 90 days - ${splitvalueDate} Actual peak day - ${Peak_Users}`);
      reporter.endStep();
      if (splitvalueDate === Peak_Users) {
        logger.info(`Expected the peak day in 90 days - ${splitvalueDate} Actual peak day - ${Peak_Users}`)
        expect(splitvalueDate).toBe(Peak_Users);
      } else {
        logger.error(`Expected the peak day in 90 days - ${splitvalueDate} Actual peak day - ${Peak_Users}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
    });

    and('Validate The last 7 Days Chart', async () => {
      reporter.startStep(`And Validate The last 7 Days Chart`);
       var visitFrequency_chat = await getElementHandleByXpath(tenantAdmin.h4.visit_Frequency_chat)
     // let visitFrequency_chat = await getPropertyValueByXpath(tenantAdmin.h4.visit_Frequency_chat, "textContent")
      for (let i = 1; i < visitFrequency_chat.length; i++) {
         visitFrequency_chat = await getElementHandleByXpath(tenantAdmin.h4.visit_Frequency_chat)
       // visitFrequency_chat = await getElementHandleByXpath(tenantAdmin.h4.visit_Frequency_chat)
        try {
          await visitFrequency_chat[i].hover()
          await delay(2000)
          await performAction("click", visitFrequency_chat[i]);
        } catch (error) {
          logger.error(`Error occurred for Unable to Hover The Visit Frequency Chart`)
          reporter.startStep(`Error occurred for Unable to Hover The Visit Frequency Chart`);
          expect(true).toBe(false)
          reporter.endStep();
        }
        let visitFrequency_Date = await getPropertyValueByXpath(tenantAdmin.div.visit_Frequency_Chat_Date, "textContent")
        console.log("visitFrequency_Date : " + visitFrequency_Date)
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const visitFrequencyfullyear = visitFrequency_Date + " " + currentYear;
        const date = new Date(visitFrequencyfullyear);
        const day = date.getDay(); // Get the day of the week
        if (day != 0 && day != 6) {
          let VisitFrequencyChat_Count = await getPropertyValueByXpath(tenantAdmin.div.VisitFrequency_Chat_Count, "textContent")
          console.log("VisitFrequencyChat_Count : " + VisitFrequencyChat_Count)
          function extractNumbers(str) {
            return str.replace(/\D/g, "");
          }
          const VisitFrequencyChatCount = extractNumbers(VisitFrequencyChat_Count);
          console.log("VisitFrequencyChatCount : " + VisitFrequencyChatCount)
          reporter.startStep(`Expected The ${visitFrequency_Date} Unique Users Count are Non Zero and Actual Count is - ${VisitFrequencyChatCount}`);
          reporter.endStep();
          if (VisitFrequencyChatCount > '0') {
            logger.info(`Expected The ${visitFrequency_Date} Unique Users Count are Non Zero and Actual Count is - ${VisitFrequencyChatCount}`)
            expect(VisitFrequencyChatCount > '0').toBeTruthy();
          } else {
            logger.error(`Expected The ${visitFrequency_Date} Unique Users Count are Non Zero and Actual Count is - ${VisitFrequencyChatCount}`);
            expect(true).toBe(false)
          }
          let ss = await customScreenshot('building.png')
          reporter.addAttachment("building", ss, "image/png");
        } else {
          logger.info("It is weekend!; Ignore The Unique Users Count are Non Zero is Non Zero")
          reporter.startStep(`It is weekend!;${visitFrequency_Date} Ignore The Unique Users Count are Non Zero is Non Zero`);
          reporter.endStep();
        }
      }
      reporter.endStep();
    });

    and('Verify 90 Day Peak Unique Users Count', async () => {
      reporter.startStep(`And Verify 90 Day Peak Unique Users Count`);
      let peakUsers_Count = await getPropertyValueByXpath(tenantAdmin.div.peak_Users_Count, "textContent")
      reporter.startStep(`Expected 90 Day Peak Unique Users Count - Non Zero and Actual count is - ${peakUsers_Count}`);
      reporter.endStep();
      if (peakUsers_Count > 0) {
        logger.info(`Expected 90 Day Peak Unique Users Count - Non Zero and Actual count is - ${peakUsers_Count}`)
        expect(peakUsers_Count > 0).toBeTruthy();
      } else {
        logger.error(`Expected 90 Day Peak Unique Users Count - Non Zero and Actual count is - ${peakUsers_Count}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
    });

    and('Verify The Visit Frequency see more option', async () => {
      reporter.startStep(`And Verify The Visit Frequency see more option`);
      await delay(4000)
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      async function continuousClickWithNetworkWait(actionFunction, element, maxIterations, timeout) {
        //await delay(4000)
        var element = (tenantAdmin.h4.visitFrequency_Seemore_Option)
        let iteration = 0;
        while (iteration < maxIterations) {
          await Promise.all([
            actionFunction("click", element),
            waitForNetworkIdle(timeout)
          ]);
          iteration++;
        }
      }
      // Usage
      const maxIterations = 3; // Set the number of times you want to click
      const timeout = 120000;   // Set the network idle timeout
      continuousClickWithNetworkWait(performAction, buildingOverview.a.overviewTab, maxIterations, timeout);
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      await delay(4000)
      let occupancy_Usage = await getPropertyValueByXpath(tenantAdmin.div.occupancy_Usagepage_Text, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Occupancy Usage Page Text  - ${conFig.Building1[buildingName].occupancy_Usage_SeeMore} and Actual Text - ${occupancy_Usage}`);
      if (occupancy_Usage === conFig.Building1[buildingName].occupancy_Usage_SeeMore) {
        logger.info(`Expected The Occupancy Usage Page Text  - ${conFig.Building1[buildingName].occupancy_Usage_SeeMore} and Actual Text - ${occupancy_Usage}`)
        expect(conFig.Building1[buildingName].occupancy_Usage_SeeMore).toBe(occupancy_Usage);
      } else {
        logger.error(`Occupancy Usage Page Text  - ${conFig.Building1[buildingName].occupancy_Usage_SeeMore} and Actual Text - ${occupancy_Usage}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      await delay(4000)
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      reporter.endStep();
    });
  });

  test('Navigate the <Building> and Verify The Energy in OverView Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    then(/^Verify The Title "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep("Then Verify The Title");
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      let energyTiltle = await getPropertyValueByXpath(tenantAdmin.div.energy_Tiltle, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Title  - ${conFig.Building1[buildingName].page_Title2} and Actual Title - ${energyTiltle}`);
      if (energyTiltle === conFig.Building1[buildingName].page_Title2) {
        logger.info(`Expected Title  - ${conFig.Building1[buildingName].page_Title2} and Actual Title - ${energyTiltle}`)
        expect(conFig.Building1[buildingName].page_Title2).toBe(energyTiltle);
      } else {
        logger.error(`Expected The Title  - ${conFig.Building1[buildingName].page_Title2} and Actual Title - ${energyTiltle}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The OverView Page last Update Time in Energy', async () => {
      reporter.startStep("And Verify The OverView Page last Update Time in Energy");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.energy_LastUpdate_Time, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView

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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Average Monthly Usage Title on Energy', async () => {
      reporter.startStep(`And Verify The Average Monthly Usage Title on Energy`);
      let MonthUsage_text = await getPropertyValueByXpath(tenantAdmin.div.averageMonthUsage_text, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Average Monthly Usage Title on Energy  - ${conFig.Building1[buildingName].monthUsageText} and Actual  Status- ${MonthUsage_text}`);
      if (MonthUsage_text === conFig.Building1[buildingName].monthUsageText) {
        logger.info(`Expected The Average Monthly Usage on Energy  - ${conFig.Building1[buildingName].monthUsageText} and Actual  Status- ${MonthUsage_text}`)
        expect(conFig.Building1[buildingName].monthUsageText).toBe(MonthUsage_text);
      } else {
        logger.error(`Expected The Average Monthly Usage Title on Energy  - ${conFig.Building1[buildingName].monthUsageText} and Actual  Status- ${MonthUsage_text}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Average Monthly Usage consumption', async () => {
      reporter.startStep(`And Verify The Average Monthly Usage consumption`);
      let energyConsum = await getPropertyValueByXpath(tenantAdmin.div.energy_Consum, "textContent")
      reporter.startStep(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${energyConsum}`);
      reporter.endStep();
      if (energyConsum > 0 + " KWH") {
        logger.info(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${energyConsum}`)
        expect(energyConsum > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${energyConsum}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
    });

    and('Verify The Average Monthly EUI Text', async () => {
      reporter.startStep(`And Verify The Average Monthly EUI Text`);
      let energyEUI = await getPropertyValueByXpath(tenantAdmin.div.energy_EUI, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Average Monthly EUI Text  - ${conFig.Building1[buildingName].month_EUI_Text} and Actual  Status- ${energyEUI}`);
      if (energyEUI === conFig.Building1[buildingName].month_EUI_Text) {
        logger.info(`Expected The Average Monthly EUI Text - ${conFig.Building1[buildingName].month_EUI_Text} and Actual  Status- ${energyEUI}`)
        expect(conFig.Building1[buildingName].month_EUI_Text).toBe(energyEUI);
      } else {
        logger.error(`Expected The Average Monthly EUI Text - ${conFig.Building1[buildingName].month_EUI_Text} and Actual  Status- ${energyEUI}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Average Monthly EUI Data', async () => {
      reporter.startStep(`And Verify The Average Monthly EUI Data`);
      let energyEUI_Data = await getPropertyValueByXpath(tenantAdmin.div.energy_EUI_Data, "textContent")
      reporter.startStep(`Expected The Average Monthly EUI Data is - Non Zero and Actual Data is - ${energyEUI_Data}`);
      reporter.endStep();
      if (energyEUI_Data >= 0.0) {
        logger.info(`Expected The Average Monthly EUI Data is - Non Zero and Actual Data is - ${energyEUI_Data}`)
        expect(energyEUI_Data >= 0.0).toBeTruthy();
      } else {
        logger.error(`Expected The Average Monthly EUI Data is - Non Zero and Actual Data is - ${energyEUI_Data}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    //And Verify Month and Year in Average consumption
    and('Verify Month and Year in Average consumption', async () => {
      reporter.startStep(`And Verify Month and Year in Average consumption`);
      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.average_Month_Year, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[3]
      let averageYearVal = averageMonthYearValSplit[4]
      const averageYear = parseInt(averageYearVal);

      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Input: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Input: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Input: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();

      const today = new Date();
      const currentYearVal = today.getFullYear() % 100;
      const currentYear = parseInt(currentYearVal);
      reporter.startStep(`Expected Current Year - ${currentYear} and Actaul Year  ${averageYear} `);
      // reporter.endStep();
      if (currentYear == averageYear) {
        logger.info(`Expected Current Year - ${currentYear} and Actaul Year  ${averageYear}`)
        expect(currentYear).toBe(averageYear);
      } else {
        logger.error(`Expected Current Year - ${currentYear} and Actaul Year  ${averageYear}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify Month and Year in Average EUI
    and('Verify Month and Year in Average EUI', async () => {
      reporter.startStep(`And Verify Month and Year in Average EUI`);
      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.averageMonthYear_EUI, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[3]
      let averageYearVal = averageMonthYearValSplit[4]
      const averageYear = parseInt(averageYearVal);

      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Input: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Input: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Input: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();

      const today = new Date();
      const currentYearVal = today.getFullYear() % 100;
      const currentYear = parseInt(currentYearVal);
      reporter.startStep(`Expected Current Year - ${currentYear} and Actaul Year  ${averageYear} `);
      // reporter.endStep();
      if (currentYear == averageYear) {
        logger.info(`Expected Current Year - ${currentYear} and Actaul Year  ${averageYear}`)
        expect(currentYear).toBe(averageYear);
      } else {
        logger.error(`Expected Current Year - ${currentYear} and Actaul Year  ${averageYear}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });
  });

  test('Navigate the <Building> and Verify The Environment Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    then(/^Verify The Environment status "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep("Then Verify The Environment status");
      let configFile = await getEnvConfig()
      if ('Environment_Status' in configFile.Building1[buildingName] && configFile.Building1[buildingName]['Environment_Status'] == 'NA') {
        logger.error(`The Environment status not available in ${buildingName}`)
        reporter.startStep(`The Environment status not available in ${buildingName}`);
        reporter.endStep();
      } else {
        await Promise.all([
          performAction("click", buildingOverview.a.environmentTab),
          waitForNetworkIdle(120000)
        ])
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        let allSensors = await getElementHandleByXpath(tenantAdmin.h6.allSensors)
        let enviromentSensor_Count = await getEnvConfig()
        expect(enviromentSensor_Count.environmentSensor['All sensors count'].count).toBe(allSensors.length);
        reporter.startStep(`Verify all sensor Expexted count is - 11 and Actual count is - ${allSensors.length}`);
        reporter.endStep();
        for (let i = 0; i < allSensors.length; i++) {
          let title = await allSensors[i].$x(tenantAdmin.p.environmentSensorTitle)
          let titleValue = await getPropertyValue(title[0], "textContent")
          reporter.startStep(`Verify the ${titleValue} status`);
          let sensorCount = await allSensors[i].$x(tenantAdmin.p.environmentSensorCount)
          let sensorCountValue = await getPropertyValue(sensorCount[0], "textContent")
          let allsensor_Split = sensorCountValue.split(" ");
          let all_Sensor_Value = allsensor_Split[0]
          let all_Sensor_Unit_Value = allsensor_Split[1]
          const Environment_Status_List = ["Within optimal range", "Outside optimal range"]
          let environment_Status = await allSensors[i].$x(tenantAdmin.span.allEnironmentStatus)
          let all_Environment_Status = await getPropertyValue(environment_Status[0], "textContent")
          reporter.startStep(`The ${titleValue} Environment status is - ${all_Environment_Status}`);
          if ((all_Environment_Status === "Within optimal range") || (all_Environment_Status === "Outside optimal range")) {
            expect(Environment_Status_List.includes(all_Environment_Status)).toBeTruthy()
            reporter.endStep();
          } else {
            logger.error(`Expected Environment Light Quality Status - ${Environment_Status_List} and Actual Status - ${Environment_Status_List}`);
            expect(true).toBe(false)
          }
          reporter.startStep(`The ${titleValue} Expected Unit value are - non zero, Actual  value- ${all_Sensor_Value}`);
          expect(all_Sensor_Value > 0).toBeTruthy();
          reporter.endStep();
          reporter.startStep(`The ${titleValue} Environment Unit value is - ${all_Sensor_Unit_Value}`);
          let unit_Value = environment_Sensor[titleValue]['unit']
          expect(unit_Value).toBe(all_Sensor_Unit_Value)
          reporter.endStep();
          reporter.endStep();
        }
        reporter.endStep();
      }
    });

    and('Verify The Environment Page last Update Time', async () => {
      reporter.startStep("And Verify The Environment Page last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.env_LastUpdate_Time, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(",");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView

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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Weather reports', async () => {
      reporter.startStep(`And Verify The Weather reports`);
      var weatherAllReports = await getElementHandleByXpath(tenantAdmin.div.weather_AllReports)
      for (let i = 1; i < weatherAllReports.length; i++) {
        weatherAllReports = await getElementHandleByXpath(tenantAdmin.div.weather_AllReports)
        await weatherAllReports[i].hover()
        await delay(2000)
        let weatherAllDate = await weatherAllReports[i].$x(tenantAdmin.div.weather_AllDate)
        let weather_All_Date = await getPropertyValue(weatherAllDate[0], "textContent")
        reporter.startStep(`Verify The Date - ${weather_All_Date}`);
        let WeatherAllTime = await weatherAllReports[i].$x(tenantAdmin.div.Weather_AllTime)
        let Weather_All_Time = await getPropertyValue(WeatherAllTime[0], "textContent")
        reporter.startStep(`Verify The Time - ${Weather_All_Time}`);
        reporter.endStep();
        let weatherAllTemp = await weatherAllReports[i].$x(tenantAdmin.div.weather_AllTemp)
        let weather_All_Temp = await getPropertyValue(weatherAllTemp[0], "textContent")
        reporter.startStep(`Expected Weather Forecast are Non zero  and Actual status - ${weather_All_Temp}`);
        reporter.endStep();
        if (weather_All_Temp > 0.0 + "˚F") {
          logger.info(`Expected Weather Forecast Non zero  and Actual status - ${weather_All_Temp}`)
          expect(weather_All_Temp > 0.0 + "˚F").toBeTruthy();
        } else {
          logger.error(`Expected Weather Forecast are Non zero  and Actual status - ${weather_All_Temp}`);
          expect(true).toBe(false);
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify Local Weather Forecast Today and Tomorrow and Day After Tomorrow', async () => {
      reporter.startStep(`Verify Local Weather Forecast Today and Tomorrow and Day After Tomorrow`);
      let weatherStatusToday = await getPropertyValueByXpath(tenantAdmin.span.weatherStatus_Today, "textContent")
      reporter.startStep(`Expected The Day For Weather Forecast - "TODAY" Actual Day - ${weatherStatusToday}`);
      if ("TODAY" === weatherStatusToday) {
        logger.info(`Expected The Day For Weather Forecast - "TODAY" Actual Day - ${weatherStatusToday}`)
        expect("TODAY" === weatherStatusToday);
      } else {
        logger.error(`Expected The Day For Weather Forecast - "TODAY" Actual Day - ${weatherStatusToday}`);
        expect(true).toBe(false)
      }
      let today_Status = await getPropertyValueByXpath(tenantAdmin.span.todayStatus, "textContent")
      let today_StatusSplit = today_Status.split(": ");
      let todayStatuS = today_StatusSplit[1]
      reporter.startStep(`Expected The Precipitation percentage is - Zero or Non Zero and Actual percentage is - ${todayStatuS}`);
      if (todayStatuS >= 0 + "%") {
        logger.info(`Expected The Precipitation percentage is - Zero or Non Zero and Actual percentage is - ${todayStatuS}`)
        expect(todayStatuS >= 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Precipitation percentage is - Zero or Non Zero and Actual percentage is - ${todayStatuS}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      let todayHumidity = await getPropertyValueByXpath(tenantAdmin.span.today_Humidity, "textContent")
      let todayHumiditySplit = todayHumidity.split(": ");
      let today_Humidity = todayHumiditySplit[1]
      reporter.startStep(`Expected The Humidity percentage is - Non Zero and Actual percentage is - ${today_Humidity}`);
      if (today_Humidity > 0 + "%") {
        logger.info(`Expected The Humidity percentage is - Non Zero and Actual percentage is - ${today_Humidity}`)
        expect(today_Humidity > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Humidity percentage is - Non Zero and Actual percentage is - ${today_Humidity}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      let todayWind = await getPropertyValueByXpath(tenantAdmin.span.today_Wind, "textContent")
      let todayWindSplit = todayWind.split(": ");
      let today_WindSpeed = todayWindSplit[1]
      reporter.startStep(`Expected The wind Km/h is - Non Zero and Actual Km/h is - ${today_WindSpeed}`);
      if (today_WindSpeed > 0 + " km/h") {
        logger.info(`Expected The wind Km/h is - Non Zero and Actual Km/h is - ${today_WindSpeed}`)
        expect(today_WindSpeed > 0 + " km/h").toBeTruthy();
      } else {
        logger.error(`Expected The wind Km/h is - Non Zero and Actual Km/h is - ${today_WindSpeed}`);
        expect(true).toBe(false);
      }
      reporter.endStep();

      let todayTemp = await getPropertyValueByXpath(tenantAdmin.span.today_Temp, "textContent")
      let todayTempSplit = todayTemp.split("/");
      let todayTemp_Max = todayTempSplit[0]
      let todayTemp_Min = todayTempSplit[1]
      reporter.startStep(`Expected The Minium Temperature is - Non Zero and Actual Temperature is - ${todayTemp_Min}`);
      if (todayTemp_Min > 0 + "˚") {
        logger.info(`Expected The Minium Temperature is - Non Zero and Actual Temperature is - ${todayTemp_Min}`)
        expect(todayTemp_Min > 0 + "˚").toBeTruthy();
      } else {
        logger.error(`Expected The Minium Temperature is - Non Zero and Actual Temperature is - ${todayTemp_Min}`);
        expect(true).toBe(false);
      }
      reporter.endStep();

      reporter.startStep(`Expected The Maximum Temperature is - Non Zero and Actual Temperature is - ${todayTemp_Max}`);
      if (todayTemp_Max > 0 + "˚") {
        logger.info(`Expected The Maximum Temperature is - Non Zero and Actual Temperature is - ${todayTemp_Max}`)
        expect(todayTemp_Max > 0 + "˚").toBeTruthy();
      } else {
        logger.error(`Expected The Maximum Temperature is - Non Zero and Actual Temperature is - ${todayTemp_Max}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();

      let weatherStatusTomorrow = await getPropertyValueByXpath(tenantAdmin.span.weatherStatus_Tomorrow, "textContent")
      reporter.startStep(`Expected The Day For Weather Forecast - "TOMORROW" Actual Day - ${weatherStatusTomorrow}`);
      if ("TOMORROW" === weatherStatusTomorrow) {
        logger.info(`Expected The Day For Weather Forecast - "TOMORROW" Actual Day - ${weatherStatusTomorrow}`)
        expect("TOMORROW" === weatherStatusTomorrow);
      } else {
        logger.error(`Expected The Day For Weather Forecast - "TOMORROW" Actual Day - ${weatherStatusTomorrow}`);
        expect(true).toBe(false)
      }
      let tomorrow_Status = await getPropertyValueByXpath(tenantAdmin.span.tomorrowStatus, "textContent")
      let tomorrow_StatusSplit = tomorrow_Status.split(": ");
      let tomorrowStatus = tomorrow_StatusSplit[1]
      reporter.startStep(`Expected The Precipitation percentage is - Zero or Non Zero and Actual percentage is - ${tomorrowStatus}`);
      if (tomorrowStatus >= 0 + "%") {
        logger.info(`Expected The Precipitation percentage is - Zero or Non Zero and Actual percentage is - ${tomorrowStatus}`)
        expect(tomorrowStatus >= 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Precipitation percentage is - Zero or Non Zero and Actual percentage is - ${tomorrowStatus}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      let tomorrowHumidity = await getPropertyValueByXpath(tenantAdmin.span.tomorrow_Humidity, "textContent")
      let tomorrowHumiditySplit = tomorrowHumidity.split(": ");
      let tomorrow_Humidity = tomorrowHumiditySplit[1]
      reporter.startStep(`Expected The Humidity percentage is - Non Zero and Actual percentage is - ${tomorrow_Humidity}`);
      if (tomorrow_Humidity > 0 + "%") {
        logger.info(`Expected The Humidity percentage is - Non Zero and Actual percentage is - ${tomorrow_Humidity}`)
        expect(tomorrow_Humidity > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Humidity percentage is - Non Zero and Actual percentage is - ${tomorrow_Humidity}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      let tomorrowWind = await getPropertyValueByXpath(tenantAdmin.span.tomorrow_Wind, "textContent")
      let tomorrowWindSplit = tomorrowWind.split(": ");
      let tomorrow_Winds = tomorrowWindSplit[1]
      reporter.startStep(`Expected The wind Km/h is - Non Zero and Actual Km/h is - ${tomorrow_Winds}`);
      if (tomorrow_Winds >= 0 + " km/h") {
        logger.info(`Expected The wind Km/h is - Non Zero and Actual Km/h is - ${tomorrow_Winds}`)
        expect(tomorrow_Winds > 0 + " km/h").toBeTruthy();
      } else {
        logger.error(`Expected The wind Km/h is - Non Zero and Actual Km/h is - ${tomorrow_Winds}`);
        expect(true).toBe(false);
      }
      reporter.endStep();

      let tomorrowTemp = await getPropertyValueByXpath(tenantAdmin.span.tomorrow_Temp, "textContent")
      let tomorrowTempSplit = tomorrowTemp.split("/");
      let tomorrowTemp_Max = tomorrowTempSplit[0]
      let tomorrowTemp_Min = todayTempSplit[1]
      reporter.startStep(`Expected The Minium Temperature is - Non Zero and Actual Temperature is - ${tomorrowTemp_Min}`);
      if (tomorrowTemp_Min > 0 + "˚") {
        logger.info(`Expected The Minium Temperature is - Non Zero and Actual Temperature is - ${tomorrowTemp_Min}`)
        expect(tomorrowTemp_Min > 0 + "˚").toBeTruthy();
      } else {
        logger.error(`Expected The Minium Temperature is - Non Zero and Actual Temperature is - ${tomorrowTemp_Min}`);
        expect(true).toBe(false);
      }
      reporter.endStep();

      reporter.startStep(`Expected The Maximum Temperature is - Non Zero and Actual Temperature is - ${tomorrowTemp_Max}`);
      if (tomorrowTemp_Max > 0 + "˚") {
        logger.info(`Expected The Maximum Temperature is - Non Zero and Actual Temperature is - ${tomorrowTemp_Max}`)
        expect(tomorrowTemp_Max > 0 + "˚").toBeTruthy();
      } else {
        logger.error(`Expected The Maximum Temperature is - Non Zero and Actual Temperature is - ${tomorrowTemp_Max}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();

      let Weather_dayAfterTomorrow = await getPropertyValueByXpath(tenantAdmin.span.dayAfterTomorrow, "textContent")
      reporter.startStep(`Expected The Day For Weather Forecast - "Day After Tomorrow" Actual Day - ${Weather_dayAfterTomorrow}`);
      let dayAftertomorrow_Status = await getPropertyValueByXpath(tenantAdmin.span.dayAftertomorrow_Pre, "textContent")
      let dayAftertomorrow_StatusSplit = dayAftertomorrow_Status.split(": ");
      let dayAftertomorrowS = dayAftertomorrow_StatusSplit[1]
      reporter.startStep(`Expected The Precipitation percentage is - Zero or Non Zero and Actual percentage is - ${dayAftertomorrowS}`);
      if (tomorrowStatus >= 0 + "%") {
        logger.info(`Expected The Precipitation percentage is - Zero or Non Zero and Actual percentage is - ${dayAftertomorrowS}`)
        expect(tomorrowStatus >= 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Precipitation percentage is - Zero or Non Zero and Actual percentage is - ${dayAftertomorrowS}`);
        expect(true).toBe(false);
      }
      reporter.endStep();

      let dayAfterTomorrowHumidity = await getPropertyValueByXpath(tenantAdmin.span.dayAfterTomorrow_Humidity, "textContent")
      let dayAfterTomorrowHumiditySplit = dayAfterTomorrowHumidity.split(": ");
      let day_After_TomorrowHumidity = dayAfterTomorrowHumiditySplit[1]
      reporter.startStep(`Expected The Humidity percentage is - Non Zero and Actual percentage is - ${day_After_TomorrowHumidity}`);
      if (day_After_TomorrowHumidity > 0 + "%") {
        logger.info(`Expected The Humidity percentage is - Non Zero and Actual percentage is - ${day_After_TomorrowHumidity}`)
        expect(day_After_TomorrowHumidity > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Humidity percentage is - Non Zero and Actual percentage is - ${day_After_TomorrowHumidity}`);
        expect(true).toBe(false);
      }
      reporter.endStep();

      let dayAfterTomorrowwind = await getPropertyValueByXpath(tenantAdmin.span.dayAfterTomorrow_wind, "textContent")
      let dayAfterTomorrowwindSplit = dayAfterTomorrowwind.split(": ");
      let day_After_Tomorrowwind = dayAfterTomorrowwindSplit[1]
      reporter.startStep(`Expected The wind Km/h is - Non Zero and Actual Km/h is - ${day_After_Tomorrowwind}`);
      if (day_After_Tomorrowwind >= 0 + " km/h") {
        logger.info(`Expected The wind Km/h is - Non Zero and Actual Km/h is - ${day_After_Tomorrowwind}`)
        expect(day_After_Tomorrowwind > 0 + " km/h").toBeTruthy();
      } else {
        logger.error(`Expected The wind Km/h is - Non Zero and Actual Km/h is - ${day_After_Tomorrowwind}`);
        expect(true).toBe(false);
      }
      reporter.endStep();

      let dayAfterTomorrowTemp = await getPropertyValueByXpath(tenantAdmin.span.dayAfterTomorrow_Temp, "textContent")
      let dayAfterTomorrowTempSplit = dayAfterTomorrowTemp.split("/");
      let dayAfterTomorrowTemp_Max = dayAfterTomorrowTempSplit[0]
      let dayAfterTomorrowTemp_Min = todayTempSplit[1]
      reporter.startStep(`Expected The Minium Temperature is - Non Zero and Actual Temperature is - ${dayAfterTomorrowTemp_Min}`);
      if (dayAfterTomorrowTemp_Min > 0 + "˚") {
        logger.info(`Expected The Minium Temperature is - Non Zero and Actual Temperature is - ${dayAfterTomorrowTemp_Min}`)
        expect(dayAfterTomorrowTemp_Min > 0 + "˚").toBeTruthy();
      } else {
        logger.error(`Expected The Minium Temperature is - Non Zero and Actual Temperature is - ${dayAfterTomorrowTemp_Min}`);
        expect(true).toBe(false);
      }
      reporter.endStep();

      reporter.startStep(`Expected The Maximum Temperature is - Non Zero and Actual Temperature is - ${dayAfterTomorrowTemp_Max}`);
      if (dayAfterTomorrowTemp_Max > 0 + "˚") {
        logger.info(`Expected The Maximum Temperature is - Non Zero and Actual Temperature is - ${dayAfterTomorrowTemp_Max}`)
        expect(dayAfterTomorrowTemp_Max > 0 + "˚").toBeTruthy();
      } else {
        logger.error(`Expected The Maximum Temperature is - Non Zero and Actual Temperature is - ${dayAfterTomorrowTemp_Max}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
      reporter.endStep();

    });
  });

  test('Navigate the <Building> and Verify The Energy Page Last 13 Months', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    then(/^Verify The High and Low Energy Using Tenant "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep("Verify The High and Low Energy Using Tenant");
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.a.energy_Page),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      let highEnergyUsageTenant = await getPropertyValueByXpath(tenantAdmin.div.high_Energy_Usage, "textContent")
      let highEnergyUsageTenantSplit = highEnergyUsageTenant.split(": ");
      let highEnergyUsage_Tenant = highEnergyUsageTenantSplit[1]
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected High Energy consumption Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyUsage_Tenant}`);
      if (highEnergyUsage_Tenant === conFig.Building1[buildingName].HigheneryUsageName) {
        logger.info(`Expected High Energy consumption Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyUsage_Tenant}`)
        expect(conFig.Building1[buildingName].HigheneryUsageName).toBe(highEnergyUsage_Tenant);
      } else {
        logger.error(`Expected High Energy consumption Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyUsage_Tenant}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let lowEnergyUsage = await getPropertyValueByXpath(tenantAdmin.div.low_Energy_Usage, "textContent")
      let lowEnergyUsageTenantSplit = lowEnergyUsage.split(": ");
      let lowEnergyUsage_Tenant = lowEnergyUsageTenantSplit[1]
      reporter.startStep(`Expected Low Energy consumption Using Tenant  - ${conFig.Building1[buildingName].LowenergyUsageName} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
      if (lowEnergyUsage_Tenant === conFig.Building1[buildingName].LowenergyUsageName) {
        logger.info(`Expected Low Energy Using consumption Tenant  - ${conFig.Building1[buildingName].LowenergyUsageName} and Actual Tenant - ${lowEnergyUsage_Tenant}`)
        expect(conFig.Building1[buildingName].LowenergyUsageName).toBe(lowEnergyUsage_Tenant);
      } else {
        logger.error(`Expected Low Energy Using consumption Tenant  - ${conFig.Building1[buildingName].LowenergyUsageName} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let highEnergyTenantEUI = await getPropertyValueByXpath(tenantAdmin.div.high_Energy_Tenant_EUI, "textContent")
      let highEnergyTenantEUISplit = highEnergyTenantEUI.split(": ");
      let highEnergyTenant_EUI = highEnergyTenantEUISplit[1]
      reporter.startStep(`Expected High EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyTenant_EUI}`);
      if (highEnergyTenant_EUI === conFig.Building1[buildingName].HigheneryUsageName) {
        logger.info(`Expected High EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyTenant_EUI}`)
        expect(conFig.Building1[buildingName].HigheneryUsageName).toBe(highEnergyTenant_EUI);
      } else {
        logger.error(`Expected High EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyTenant_EUI}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let lowEnergyTenantEUI = await getPropertyValueByXpath(tenantAdmin.div.low_Energy_Tenant_EUI, "textContent")
      let lowEnergyTenantEUISplit = lowEnergyTenantEUI.split(": ");
      let lowEnergyTenant_EUI = lowEnergyTenantEUISplit[1]
      reporter.startStep(`Expected Low EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${lowEnergyTenant_EUI}`);
      if (lowEnergyTenant_EUI === conFig.Building1[buildingName].HigheneryUsageName) {
        logger.info(`Expected Low EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${lowEnergyTenant_EUI}`)
        expect(conFig.Building1[buildingName].HigheneryUsageName).toBe(lowEnergyTenant_EUI);
      } else {
        logger.error(`Expected Low EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${lowEnergyTenant_EUI}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Last 13 Months Page last Update Time', async () => {
      reporter.startStep("And Verify Last 13 Months Page last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.energyPage_LastUpdate, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Average monthly tenant usage Text', async () => {
      reporter.startStep(`And Verify The Average monthly tenant usage Text`);
      let averageUsageTxt = await getPropertyValueByXpath(tenantAdmin.div.averageUsage_Txt, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Average monthly tenant usage Text  - ${conFig.Building1[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
      if (averageUsageTxt === conFig.Building1[buildingName].averageUsage_Txt) {
        logger.info(`Expected Average monthly tenant usage text  - ${conFig.Building1[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`)
        expect(conFig.Building1[buildingName].averageUsage_Txt).toBe(averageUsageTxt);
      } else {
        logger.error(`Expected Average monthly tenant usage text  - ${conFig.Building1[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Energy consumption and EUI for Last 13 months', async () => {
      reporter.startStep(`And Verify The Energy consumption and EUI for Last 13 months`);
      let averageMonthConsum = await getPropertyValueByXpath(tenantAdmin.div.average_Month_Consum, "textContent")
      reporter.startStep(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
      reporter.endStep();
      if (averageMonthConsum > 0 + " KWH") {
        logger.info(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`)
        expect(averageMonthConsum > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
        expect(true).toBe(false);
      }
      let lowestUsage = await getPropertyValueByXpath(tenantAdmin.div.lowest_Usage, "textContent")
      reporter.startStep(`Expected The  Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
      reporter.endStep();
      if (lowestUsage > 0 + " KWH") {
        logger.info(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`)
        expect(lowestUsage > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
        expect(true).toBe(false);
      }
      let highestUsage = await getPropertyValueByXpath(tenantAdmin.div.highest_Usage, "textContent")
      reporter.startStep(`Expected The Highest Monthly  Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
      reporter.endStep();
      if (highestUsage > 0 + " KWH") {
        logger.info(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`)
        expect(highestUsage > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
        expect(true).toBe(false);
      }
      let averageMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.average_Month_EUI, "textContent")
      reporter.startStep(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
      reporter.endStep();
      if (averageMonthEUI > 0 + " KWH") {
        logger.info(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`)
        expect(averageMonthEUI > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
        expect(true).toBe(false);
      }
      let highestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.highest_Month_EUI, "textContent")
      reporter.startStep(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
      reporter.endStep();
      if (highestMonthEUI > 0 + " KWH") {
        logger.info(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`)
        expect(highestMonthEUI > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
        expect(true).toBe(false);
      }
      let lowestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.lowest_Month_EUI, "textContent")
      reporter.startStep(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
      reporter.endStep();
      if (lowestMonthEUI > 0 + " KWH") {
        logger.info(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`)
        expect(lowestMonthEUI > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
    });

    and('Verify Energy Usage Intensity Text', async () => {
      reporter.startStep(`And Verify Energy Usage Intensity Text`);
      let energyUsage_IntensityTxt = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Intensity_Txt, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Energy Usage Intensity Text  - ${conFig.Building1[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
      if (energyUsage_IntensityTxt === conFig.Building1[buildingName].energy_Intensity_Txt) {
        logger.info(`Expected Energy Usage Intensity Text  - ${conFig.Building1[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`)
        expect(conFig.Building1[buildingName].energy_Intensity_Txt).toBe(energyUsage_IntensityTxt);
      } else {
        logger.error(`Expected Energy Usage Intensity Text  - ${conFig.Building1[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The click box in last 13 months and calender Year and Last 37 months', async () => {
      reporter.startStep(`And Verify The click box in last 13 months and calender Year and Last 37 months`);
      let energyUsage_Intensity_Button = await getPropertyValueByXpath(tenantAdmin.button.last_13_Months, "textContent")
      let energyUsage = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Click, "textContent")
      let energyUsageSplit = energyUsage.split(" ");
      let energyUsage_last = energyUsageSplit[5]
      let energyUsage_Teen = energyUsageSplit[6]
      let energyUsage_Month = energyUsageSplit[7]
      let energy_Usage_Txt = energyUsage_last + " " + energyUsage_Teen + " " + energyUsage_Month
      reporter.startStep(`Expected The Energy Usage Last 13 months Page Text  - ${energy_Usage_Txt} and Actual  Status- ${energyUsage_Intensity_Button}`);
      if (energy_Usage_Txt === energyUsage_Intensity_Button) {
        logger.info(`Expected The Energy Usage Last 13 months Page Text  - ${energy_Usage_Txt} and Actual  Status- ${energyUsage_Intensity_Button}`)
        expect(energy_Usage_Txt).toBe(energyUsage_Intensity_Button);
      } else {
        logger.error(`Expected The Energy Usage Last 13 months Page Text  - ${energy_Usage_Txt} and Actual  Status- ${energyUsage_Intensity_Button}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let energyIntensityClick = await getPropertyValueByXpath(tenantAdmin.div.energy_Intensity_Click, "textContent")
      let energyIntensityClickSplit = energyIntensityClick.split(" ");
      let energyIntensitys = energyIntensityClickSplit[9]
      let energyIntensityss = energyIntensityClickSplit[10]
      let energyIntensitysss = energyIntensityClickSplit[11]
      let energy_Intensity_Text = energyIntensitys + " " + energyIntensityss + " " + energyIntensitysss
      reporter.startStep(`Expected The Energy Usage Intensity Last 13 months Page Text  - ${energy_Intensity_Text} and Actual  Status- ${energyUsage_Intensity_Button}`);
      if (energy_Intensity_Text === energyUsage_Intensity_Button) {
        logger.info(`Expected The Energy Usage Intensity Last 13 months Page Text  - ${energy_Intensity_Text} and Actual  Status- ${energyUsage_Intensity_Button}`)
        expect(energy_Intensity_Text).toBe(energyUsage_Intensity_Button);
      } else {
        logger.error(`Expected The Energy Usage Intensity Last 13 months Page Text  - ${energy_Intensity_Text} and Actual  Status- ${energyUsage_Intensity_Button}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      await Promise.all([
        performAction("click", tenantAdmin.button.calender_Year),
        waitForNetworkIdle(120000)
      ])
      let calenderYear_cap = await getPropertyValueByXpath(tenantAdmin.button.calender_Year, "textContent")
      function convertToLowercase(calenderYear_cap) {
        var modifiedText = calenderYear_cap.toLowerCase();
        return modifiedText;
      }
      var calenderYear = convertToLowercase(calenderYear_cap);
      let energyUsage_CalYear = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Click, "textContent")
      let energyUsagecalSplit = energyUsage_CalYear.split(" ");
      let energyUsage_cal = energyUsagecalSplit[5]
      let energyUsage_year = energyUsagecalSplit[6]
      let energy_Usage_calender_cap = energyUsage_cal + " " + energyUsage_year
      function convertToLowercase(energy_Usage_calender_cap) {
        var modifiedText = energy_Usage_calender_cap.toLowerCase();
        return modifiedText;
      }
      var energy_Usage_calender = convertToLowercase(energy_Usage_calender_cap);
      reporter.startStep(`Expected The Energy Usage Calendar year Page Text  - ${calenderYear} and Actual  Status- ${energy_Usage_calender}`);
      if (calenderYear === energy_Usage_calender) {
        logger.info(`Expected The Energy Usage Calendar year Page Text  - ${calenderYear} and Actual  Status- ${energy_Usage_calender}`)
        expect(calenderYear).toBe(energy_Usage_calender);
      } else {
        logger.error(`Expected The Energy Usage Calendar year Page Text - ${calenderYear} and Actual  Status- ${energy_Usage_calender}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let energyIntensityCalYear = await getPropertyValueByXpath(tenantAdmin.div.energy_Intensity_Click, "textContent")
      let energyIntensityCalYearSplit = energyIntensityCalYear.split(" ");
      let energyIntensityCal = energyIntensityCalYearSplit[9]
      let energyIntensityYear = energyIntensityCalYearSplit[10]
      let energyIntensityCal_Year_cap = energyIntensityCal + " " + energyIntensityYear
      function convertToLowercase(energyIntensityCal_Year_cap) {
        var modifiedText = energyIntensityCal_Year_cap.toLowerCase();
        return modifiedText;
      }
      var energyIntensityCal_Year = convertToLowercase(energyIntensityCal_Year_cap);
      reporter.startStep(`Expected The Energy Usage Intensity Calendar year Page Text  - ${calenderYear} and Actual  Status- ${energyIntensityCal_Year}`);
      if (calenderYear === energyIntensityCal_Year) {
        logger.info(`Expected The Energy Usage Intensity Calendar year Page Text  - ${calenderYear} and Actual  Status- ${energyIntensityCal_Year}`)
        expect(calenderYear).toBe(energyIntensityCal_Year);
      } else {
        logger.error(`Expected The Energy Usage Intensity Calendar year Page Text  - ${calenderYear} and Actual  Status- ${energyIntensityCal_Year}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      await Promise.all([
        performAction("click", tenantAdmin.button.last_37_Months),
        waitForNetworkIdle(120000)
      ])
      let energyUsage_last37Month = await getPropertyValueByXpath(tenantAdmin.button.last_37_Months, "textContent")
      let energyUsage_37mon = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Click, "textContent")
      let energyUsage_37monSplit = energyUsage_37mon.split(" ");
      let energyUsagelast = energyUsage_37monSplit[5]
      let energyUsage_ThreeSeven = energyUsage_37monSplit[6]
      let energyUsage_Months = energyUsage_37monSplit[7]
      let energy_Usage_ThreeSeven_Mon = energyUsagelast + " " + energyUsage_ThreeSeven + " " + energyUsage_Months
      reporter.startStep(`Expected The Energy Usage Last 37 months Page Text  - ${energyUsage_last37Month} and Actual  Status- ${energy_Usage_ThreeSeven_Mon}`);
      if (energyUsage_last37Month === energy_Usage_ThreeSeven_Mon) {
        logger.info(`Expected The Energy Usage Last 37 months Page Text  - ${energyUsage_last37Month} and Actual  Status- ${energy_Usage_ThreeSeven_Mon}`)
        expect(energyUsage_last37Month).toBe(energy_Usage_ThreeSeven_Mon);
      } else {
        logger.error(`Expected The Energy Usage Last 37 months Page Text  - ${energyUsage_last37Month} and Actual  Status- ${energy_Usage_ThreeSeven_Mon}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let energyIntensity_Last37_Mon = await getPropertyValueByXpath(tenantAdmin.div.energy_Intensity_Click, "textContent")
      let energyIntensity_Last37_MonSplit = energyIntensity_Last37_Mon.split(" ");
      let energyIntensity_Last37_MonSplits = energyIntensity_Last37_MonSplit[9]
      let energyIntensity_Last37_MonSplitss = energyIntensity_Last37_MonSplit[10]
      let energyIntensity_Last37_MonSplitsss = energyIntensity_Last37_MonSplit[11]
      let energyIntensity_Last37_Mon_Text = energyIntensity_Last37_MonSplits + " " + energyIntensity_Last37_MonSplitss + " " + energyIntensity_Last37_MonSplitsss
      reporter.startStep(`Expected The Energy Usage Intensity Last 37 months Page Text  - ${energyUsage_last37Month} and Actual  Status- ${energyIntensity_Last37_Mon_Text}`);
      if (energyUsage_last37Month === energyIntensity_Last37_Mon_Text) {
        logger.info(`Expected The Energy Usage Intensity Last 37 months Page Text  - ${energyUsage_last37Month} and Actual  Status- ${energyIntensity_Last37_Mon_Text}`)
        expect(energyUsage_last37Month).toBe(energyIntensity_Last37_Mon_Text);
      } else {
        logger.error(`Expected The Energy Usage Intensity Last 37 months Page Text  - ${energyUsage_last37Month} and Actual  Status- ${energyIntensity_Last37_Mon_Text}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify Month and Year in Average consumption
    and('Verify Highest Month_Year in Energy Usage', async () => {
      reporter.startStep(`And Verify Highest Month_Year in Energy Usage`);
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.a.energy_Page),
        waitForNetworkIdle(120000)
      ])

      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.high_AverageMonthYear, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      let averageYearVal = averageMonthYearValSplit[2]
      const averageYear = parseInt(averageYearVal);

      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Highest Month in Energy Usage : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();

      const today = new Date();
      const currentYearVal = today.getFullYear() % 100;
      const currentYear = parseInt(currentYearVal);

      reporter.startStep(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);
      if (currentYear == averageYear) {
        logger.info(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
        expect(currentYear).toBe(averageYear);
      } else {
        logger.error(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify Lowest Month_Year in Energy Usage
    and('Verify Lowest Month_Year in Energy Usage', async () => {
      reporter.startStep(`And Verify Lowest Month_Year in Energy Usage`);
      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.low_AverageMonthYear, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      let averageYearVal = averageMonthYearValSplit[2]
      const averageYear = parseInt(averageYearVal);
      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Lowest Month in Energy Usage : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Lowest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Lowest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();

      const today = new Date();
      const currentYearVal = today.getFullYear() % 100;
      const currentYear = parseInt(currentYearVal);

      reporter.startStep(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);

      if (currentYear == averageYear) {
        logger.info(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
        expect(currentYear).toBe(averageYear);
      } else {
        logger.error(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Highest Month in Energy Use Intensity', async () => {
      reporter.startStep(`And Verify Highest Month in Energy Use Intensity`);

      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.highmonthInten, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Highest Month in Energy Use Intensity : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Highest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Highest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify Lowest Month in Energy Use Intensity
    and('Verify Lowest Month in Energy Use Intensity', async () => {
      reporter.startStep(`And Verify Lowest Month in Energy Use Intensity`);

      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.lowMonthInten, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Lowest Month in Energy Use Intensity : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
      reporter.endStep();
    });

  });

  test('Navigate the <Building> and Verify The Energy Page Calendar Year', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    then(/^Verify The High and Low Energy Using Tenant "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep("Verify The High and Low Energy Using Tenant");
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.a.energy_Page),
        waitForNetworkIdle(120000)
      ])

      await Promise.all([
        performAction("click", tenantAdmin.button.calender_Year),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      let highEnergyUsageTenant = await getPropertyValueByXpath(tenantAdmin.div.high_Energy_Usage, "textContent")
      let highEnergyUsageTenantSplit = highEnergyUsageTenant.split(": ");
      let highEnergyUsage_Tenant = highEnergyUsageTenantSplit[1]
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected High Energy consumption Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyUsage_Tenant}`);
      if (highEnergyUsage_Tenant === conFig.Building1[buildingName].HigheneryUsageName) {
        logger.info(`Expected High Energy consumption Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyUsage_Tenant}`)
        expect(conFig.Building1[buildingName].HigheneryUsageName).toBe(highEnergyUsage_Tenant);
      } else {
        logger.error(`Expected High Energy consumption Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyUsage_Tenant}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let lowEnergyUsage = await getPropertyValueByXpath(tenantAdmin.div.low_Energy_Usage, "textContent")
      let lowEnergyUsageTenantSplit = lowEnergyUsage.split(": ");
      let lowEnergyUsage_Tenant = lowEnergyUsageTenantSplit[1]
      reporter.startStep(`Expected Low Energy consumption Using Tenant  - ${conFig.Building1[buildingName].LowenergyUsageName} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
      if (lowEnergyUsage_Tenant === conFig.Building1[buildingName].LowenergyUsageName) {
        logger.info(`Expected Low Energy Using consumption Tenant  - ${conFig.Building1[buildingName].LowenergyUsageName} and Actual Tenant - ${lowEnergyUsage_Tenant}`)
        expect(conFig.Building1[buildingName].LowenergyUsageName).toBe(lowEnergyUsage_Tenant);
      } else {
        logger.error(`Expected Low Energy Using consumption Tenant  - ${conFig.Building1[buildingName].LowenergyUsageName} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let highEnergyTenantEUI = await getPropertyValueByXpath(tenantAdmin.div.high_Energy_Tenant_EUI, "textContent")
      let highEnergyTenantEUISplit = highEnergyTenantEUI.split(": ");
      let highEnergyTenant_EUI = highEnergyTenantEUISplit[1]
      reporter.startStep(`Expected High EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyTenant_EUI}`);
      if (highEnergyTenant_EUI === conFig.Building1[buildingName].HigheneryUsageName) {
        logger.info(`Expected High EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyTenant_EUI}`)
        expect(conFig.Building1[buildingName].HigheneryUsageName).toBe(highEnergyTenant_EUI);
      } else {
        logger.error(`Expected High EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyTenant_EUI}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let lowEnergyTenantEUI = await getPropertyValueByXpath(tenantAdmin.div.low_Energy_Tenant_EUI, "textContent")
      let lowEnergyTenantEUISplit = lowEnergyTenantEUI.split(": ");
      let lowEnergyTenant_EUI = lowEnergyTenantEUISplit[1]
      reporter.startStep(`Expected Low EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${lowEnergyTenant_EUI}`);
      if (lowEnergyTenant_EUI === conFig.Building1[buildingName].HigheneryUsageName) {
        logger.info(`Expected Low EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${lowEnergyTenant_EUI}`)
        expect(conFig.Building1[buildingName].HigheneryUsageName).toBe(lowEnergyTenant_EUI);
      } else {
        logger.error(`Expected Low EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${lowEnergyTenant_EUI}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Calendar Year Page last Update Time', async () => {
      reporter.startStep("And Verify Calendar Year Page last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.energyPage_LastUpdate, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Average monthly tenant usage Text', async () => {
      reporter.startStep(`And Verify The Average monthly tenant usage Text`);
      let averageUsageTxt = await getPropertyValueByXpath(tenantAdmin.div.averageUsage_Txt, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Average monthly tenant usage Text  - ${conFig.Building1[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
      if (averageUsageTxt === conFig.Building1[buildingName].averageUsage_Txt) {
        logger.info(`Expected Average monthly tenant usage text  - ${conFig.Building1[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`)
        expect(conFig.Building1[buildingName].averageUsage_Txt).toBe(averageUsageTxt);
      } else {
        logger.error(`Expected Average monthly tenant usage text  - ${conFig.Building1[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Energy consumption and EUI for Calendar year', async () => {
      reporter.startStep(`And Verify The Energy consumption and EUI for Calendar year`);
      let averageMonthConsum = await getPropertyValueByXpath(tenantAdmin.div.average_Month_Consum, "textContent")
      reporter.startStep(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
      reporter.endStep();
      if (averageMonthConsum > 0 + " KWH") {
        logger.info(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`)
        expect(averageMonthConsum > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
        expect(true).toBe(false);
      }
      let lowestUsage = await getPropertyValueByXpath(tenantAdmin.div.lowest_Usage, "textContent")
      reporter.startStep(`Expected The  Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
      reporter.endStep();
      if (lowestUsage > 0 + " KWH") {
        logger.info(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`)
        expect(lowestUsage > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
        expect(true).toBe(false);
      }
      let highestUsage = await getPropertyValueByXpath(tenantAdmin.div.highest_Usage, "textContent")
      reporter.startStep(`Expected The Highest Monthly  Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
      reporter.endStep();
      if (highestUsage > 0 + " KWH") {
        logger.info(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`)
        expect(highestUsage > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
        expect(true).toBe(false);
      }
      let averageMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.average_Month_EUI, "textContent")
      reporter.startStep(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
      reporter.endStep();
      if (averageMonthEUI > 0 + " KWH") {
        logger.info(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`)
        expect(averageMonthEUI > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
        expect(true).toBe(false);
      }
      let highestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.highest_Month_EUI, "textContent")
      reporter.startStep(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
      reporter.endStep();
      if (highestMonthEUI > 0 + " KWH") {
        logger.info(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`)
        expect(highestMonthEUI > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
        expect(true).toBe(false);
      }
      let lowestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.lowest_Month_EUI, "textContent")
      reporter.startStep(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
      reporter.endStep();
      if (lowestMonthEUI > 0 + " KWH") {
        logger.info(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`)
        expect(lowestMonthEUI > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
    });

    and('Verify Energy Usage Intensity Text', async () => {
      reporter.startStep(`And Verify Energy Usage Intensity Text`);
      let energyUsage_IntensityTxt = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Intensity_Txt, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Energy Usage Intensity Text  - ${conFig.Building1[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
      if (energyUsage_IntensityTxt === conFig.Building1[buildingName].energy_Intensity_Txt) {
        logger.info(`Expected Energy Usage Intensity Text  - ${conFig.Building1[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`)
        expect(conFig.Building1[buildingName].energy_Intensity_Txt).toBe(energyUsage_IntensityTxt);
      } else {
        logger.error(`Expected Energy Usage Intensity Text  - ${conFig.Building1[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify Month and Year in Average consumption
    and('Verify Highest Month_Year in Energy Usage', async () => {
      reporter.startStep(`And Verify Highest Month_Year in Energy Usage`);
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.a.energy_Page),
        waitForNetworkIdle(120000)
      ])
      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.high_AverageMonthYear, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      let averageYearVal = averageMonthYearValSplit[2]
      const averageYear = parseInt(averageYearVal);
      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Highest Month in Energy Usage : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
      const today = new Date();
      const currentYearVal = today.getFullYear() % 100;
      const currentYear = parseInt(currentYearVal);
      reporter.startStep(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);
      if (currentYear == averageYear) {
        logger.info(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
        expect(currentYear).toBe(averageYear);
      } else {
        logger.error(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify Lowest Month_Year in Energy Usage
    and('Verify Lowest Month_Year in Energy Usage', async () => {
      reporter.startStep(`And Verify Lowest Month_Year in Energy Usage`);
      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.low_AverageMonthYear, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      let averageYearVal = averageMonthYearValSplit[2]
      const averageYear = parseInt(averageYearVal);
      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Lowest Month in Energy Usage : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Lowest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Lowest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
      const today = new Date();
      const currentYearVal = today.getFullYear() % 100;
      const currentYear = parseInt(currentYearVal);
      reporter.startStep(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);
      if (currentYear == averageYear) {
        logger.info(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
        expect(currentYear).toBe(averageYear);
      } else {
        logger.error(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Highest Month in Energy Use Intensity', async () => {
      reporter.startStep(`And Verify Highest Month in Energy Use Intensity`);
      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.highmonthInten, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Highest Month in Energy Use Intensity : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Highest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Highest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify Lowest Month in Energy Use Intensity
    and('Verify Lowest Month in Energy Use Intensity', async () => {
      reporter.startStep(`And Verify Lowest Month in Energy Use Intensity`);
      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.lowMonthInten, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Lowest Month in Energy Use Intensity : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
      reporter.endStep();
    });
  });

  test('Navigate the <Building> and Verify The Energy Page Last 37 Months', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    then(/^Verify The High and Low Energy Using Tenant "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep("Verify The High and Low Energy Using Tenant");
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.a.energy_Page),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.last_37_Months),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      let highEnergyUsageTenant = await getPropertyValueByXpath(tenantAdmin.div.high_Energy_Usage, "textContent")
      let highEnergyUsageTenantSplit = highEnergyUsageTenant.split(": ");
      let highEnergyUsage_Tenant = highEnergyUsageTenantSplit[1]
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected High Energy consumption Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyUsage_Tenant}`);
      if (highEnergyUsage_Tenant === conFig.Building1[buildingName].HigheneryUsageName) {
        logger.info(`Expected High Energy consumption Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyUsage_Tenant}`)
        expect(conFig.Building1[buildingName].HigheneryUsageName).toBe(highEnergyUsage_Tenant);
      } else {
        logger.error(`Expected High Energy consumption Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyUsage_Tenant}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let lowEnergyUsage = await getPropertyValueByXpath(tenantAdmin.div.low_Energy_Usage, "textContent")
      let lowEnergyUsageTenantSplit = lowEnergyUsage.split(": ");
      let lowEnergyUsage_Tenant = lowEnergyUsageTenantSplit[1]
      reporter.startStep(`Expected Low Energy consumption Using Tenant  - ${conFig.Building1[buildingName].LowenergyUsageName} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
      if (lowEnergyUsage_Tenant === conFig.Building1[buildingName].LowenergyUsageName) {
        logger.info(`Expected Low Energy Using consumption Tenant  - ${conFig.Building1[buildingName].LowenergyUsageName} and Actual Tenant - ${lowEnergyUsage_Tenant}`)
        expect(conFig.Building1[buildingName].LowenergyUsageName).toBe(lowEnergyUsage_Tenant);
      } else {
        logger.error(`Expected Low Energy Using consumption Tenant  - ${conFig.Building1[buildingName].LowenergyUsageName} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let highEnergyTenantEUI = await getPropertyValueByXpath(tenantAdmin.div.high_Energy_Tenant_EUI, "textContent")
      let highEnergyTenantEUISplit = highEnergyTenantEUI.split(": ");
      let highEnergyTenant_EUI = highEnergyTenantEUISplit[1]
      reporter.startStep(`Expected High EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyTenant_EUI}`);
      if (highEnergyTenant_EUI === conFig.Building1[buildingName].HigheneryUsageName) {
        logger.info(`Expected High EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyTenant_EUI}`)
        expect(conFig.Building1[buildingName].HigheneryUsageName).toBe(highEnergyTenant_EUI);
      } else {
        logger.error(`Expected High EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${highEnergyTenant_EUI}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let lowEnergyTenantEUI = await getPropertyValueByXpath(tenantAdmin.div.low_Energy_Tenant_EUI, "textContent")
      let lowEnergyTenantEUISplit = lowEnergyTenantEUI.split(": ");
      let lowEnergyTenant_EUI = lowEnergyTenantEUISplit[1]
      reporter.startStep(`Expected Low EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${lowEnergyTenant_EUI}`);
      if (lowEnergyTenant_EUI === conFig.Building1[buildingName].HigheneryUsageName) {
        logger.info(`Expected Low EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${lowEnergyTenant_EUI}`)
        expect(conFig.Building1[buildingName].HigheneryUsageName).toBe(lowEnergyTenant_EUI);
      } else {
        logger.error(`Expected Low EUI Using Tenant  - ${conFig.Building1[buildingName].HigheneryUsageName} and Actual Tenant - ${lowEnergyTenant_EUI}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Last 37 Months last Update Time', async () => {
      reporter.startStep("And Verify The Last 37 Months last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.energyPage_LastUpdate, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Average monthly tenant usage Text', async () => {
      reporter.startStep(`And Verify The Average monthly tenant usage Text`);
      let averageUsageTxt = await getPropertyValueByXpath(tenantAdmin.div.averageUsage_Txt, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Average monthly tenant usage Text  - ${conFig.Building1[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
      if (averageUsageTxt === conFig.Building1[buildingName].averageUsage_Txt) {
        logger.info(`Expected Average monthly tenant usage text  - ${conFig.Building1[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`)
        expect(conFig.Building1[buildingName].averageUsage_Txt).toBe(averageUsageTxt);
      } else {
        logger.error(`Expected Average monthly tenant usage text  - ${conFig.Building1[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Energy consumption and EUI for Last 37 Months', async () => {
      reporter.startStep(`And Verify The Energy consumption and EUI for Calendar year`);
      let averageMonthConsum = await getPropertyValueByXpath(tenantAdmin.div.average_Month_Consum, "textContent")
      reporter.startStep(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
      reporter.endStep();
      if (averageMonthConsum > 0 + " KWH") {
        logger.info(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`)
        expect(averageMonthConsum > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
        expect(true).toBe(false);
      }
      let lowestUsage = await getPropertyValueByXpath(tenantAdmin.div.lowest_Usage, "textContent")
      reporter.startStep(`Expected The  Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
      reporter.endStep();
      if (lowestUsage > 0 + " KWH") {
        logger.info(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`)
        expect(lowestUsage > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
        expect(true).toBe(false);
      }
      let highestUsage = await getPropertyValueByXpath(tenantAdmin.div.highest_Usage, "textContent")
      reporter.startStep(`Expected The Highest Monthly  Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
      reporter.endStep();
      if (highestUsage > 0 + " KWH") {
        logger.info(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`)
        expect(highestUsage > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
        expect(true).toBe(false);
      }
      let averageMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.average_Month_EUI, "textContent")
      reporter.startStep(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
      reporter.endStep();
      if (averageMonthEUI > 0 + " KWH") {
        logger.info(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`)
        expect(averageMonthEUI > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
        expect(true).toBe(false);
      }
      let highestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.highest_Month_EUI, "textContent")
      reporter.startStep(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
      reporter.endStep();
      if (highestMonthEUI > 0 + " KWH") {
        logger.info(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`)
        expect(highestMonthEUI > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
        expect(true).toBe(false);
      }
      let lowestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.lowest_Month_EUI, "textContent")
      reporter.startStep(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
      reporter.endStep();
      if (lowestMonthEUI > 0 + " KWH") {
        logger.info(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`)
        expect(lowestMonthEUI > 0 + " KWH").toBeTruthy();
      } else {
        logger.error(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
    });

    and('Verify Energy Usage Intensity Text', async () => {
      reporter.startStep(`And Verify Energy Usage Intensity Text`);
      let energyUsage_IntensityTxt = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Intensity_Txt, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Energy Usage Intensity Text  - ${conFig.Building1[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
      if (energyUsage_IntensityTxt === conFig.Building1[buildingName].energy_Intensity_Txt) {
        logger.info(`Expected Energy Usage Intensity Text  - ${conFig.Building1[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`)
        expect(conFig.Building1[buildingName].energy_Intensity_Txt).toBe(energyUsage_IntensityTxt);
      } else {
        logger.error(`Expected Energy Usage Intensity Text  - ${conFig.Building1[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Highest Month_Year in Energy Usage', async () => {
      reporter.startStep(`And Verify Highest Month_Year in Energy Usage`);
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.a.energy_Page),
        waitForNetworkIdle(120000)
      ])

      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.high_AverageMonthYear, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      let averageYearVal = averageMonthYearValSplit[2]
      const averageYear = parseInt(averageYearVal);

      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Highest Month in Energy Usage : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();

      const today = new Date();
      const currentYearVal = today.getFullYear() % 100;
      const currentYear = parseInt(currentYearVal);

      reporter.startStep(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);

      if (currentYear == averageYear) {
        logger.info(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
        expect(currentYear).toBe(averageYear);
      } else {
        logger.error(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify Lowest Month_Year in Energy Usage
    and('Verify Lowest Month_Year in Energy Usage', async () => {
      reporter.startStep(`And Verify Lowest Month_Year in Energy Usage`);

      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.low_AverageMonthYear, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      let averageYearVal = averageMonthYearValSplit[2]
      const averageYear = parseInt(averageYearVal);

      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Lowest Month in Energy Usage : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Lowest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Lowest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();

      const today = new Date();
      const currentYearVal = today.getFullYear() % 100;
      const currentYear = parseInt(currentYearVal);

      reporter.startStep(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);

      if (currentYear == averageYear) {
        logger.info(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
        expect(currentYear).toBe(averageYear);
      } else {
        logger.error(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Highest Month in Energy Use Intensity', async () => {
      reporter.startStep(`And Verify Highest Month in Energy Use Intensity`);

      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.highmonthInten, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Highest Month in Energy Use Intensity : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Highest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Highest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify Lowest Month in Energy Use Intensity
    and('Verify Lowest Month in Energy Use Intensity', async () => {
      reporter.startStep(`And Verify Lowest Month in Energy Use Intensity`);

      let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.lowMonthInten, "textContent")
      let averageMonthYearValSplit = averageMonthYearVal.split(" ");
      let averageMonthYear = averageMonthYearValSplit[1]
      const validMonths = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const isValidMonth = validMonths.includes(averageMonthYear);
      const expectedValidity = true;
      reporter.startStep(`Expected Lowest Month in Energy Use Intensity : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
      if (expectedValidity == isValidMonth) {
        logger.info(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
        expect(expectedValidity).toBe(isValidMonth);
      } else {
        logger.error(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
        expect(true).toBe(false);
      }
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
      reporter.endStep();
    });
  });

  test('Navigate the <Building> and Verify The Occupancy Today Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)
    then('Verify Today Occupancy Page last Update Time', async () => {
      reporter.startStep("Then Verify Today Occupancy Page last Update Time");
      await Promise.all([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.today),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.today),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.occupancy_LastUpDate, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Real Time Occupancy percentage for Today', async () => {
      reporter.startStep(`And Verify The Real Time Occupancy percentage for Today`);
      day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
      date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      hours = parseInt(date.split(' ')[1].split(':')[0])
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          let realTime_OccupancyPercent = await getPropertyValueByXpath(tenantAdmin.p.realTime_Occupancy_Percent, "textContent")
          reporter.startStep(`Expected Today Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
          if (realTime_OccupancyPercent > 0 + "%") {
            logger.info(`Expected Today Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`)
            expect(realTime_OccupancyPercent > 0 + "%").toBeTruthy();
          } else {
            logger.error(`Expected Today Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
            expect(true).toBe(false);
          }
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

    and('Verify The Average occupancy over last 90 days', async () => {
      reporter.startStep(`And Verify The Average occupancy over last 90 days`);
      let AverageOccupancy = await getPropertyValueByXpath(tenantAdmin.p.Average_Occupancy, "textContent")
      reporter.startStep(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
      if (AverageOccupancy > 0 + "%") {
        logger.info(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`)
        expect(AverageOccupancy > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Peak occupancy over last 90 days', async () => {
      reporter.startStep(`And Verify Peak occupancy over last 90 days`);
      let peak_Occupancy = await getPropertyValueByXpath(tenantAdmin.p.peakOccupancy, "textContent")
      reporter.startStep(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
      if (peak_Occupancy > 0 + "%") {
        logger.info(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`)
        expect(peak_Occupancy > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and(/^Verify The Total People Count "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep(`And Verify The Total People`);
      let totalRealTime = await getPropertyValueByXpath(tenantAdmin.p.total_RealTime, "textContent")
      let totalRealTimeSplit = totalRealTime.split("/");
      let total_Real_Time1 = totalRealTimeSplit[0]
      let total_Real_Time = totalRealTimeSplit[1]
      let totalRealTimeSplits = total_Real_Time.split(" ");
      let total_Real_Time_Count = totalRealTimeSplits[0]
      let conFig = await getEnvConfig()
      reporter.startStep(`Verify The Real Time Occupancy Count `);
      reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
      if (total_Real_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Real_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          reporter.startStep(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
          if (total_Real_Time1 > 0) {
            logger.info(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`)
            expect(total_Real_Time1 > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

        } else {
          logger.info("Not busy time; Ignore The Total People Count on Real Time Occupancy is Non Zero")
          reporter.startStep(`Not busy time;Ignore The Total People Count on Real Time Occupancy is Non Zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero")
        reporter.startStep(`It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero`);
        reporter.endStep();
      }
      reporter.endStep();

      let totalAverageTime = await getPropertyValueByXpath(tenantAdmin.p.total_AverageTime, "textContent")
      let totalAverageTimeSplit = totalAverageTime.split("/");
      let total_Average_Time1 = totalAverageTimeSplit[0]
      let total_Average_Time = totalAverageTimeSplit[1]
      let total_Average_TimeSplits = total_Average_Time.split(" ");
      let total_Average_Time_Count = total_Average_TimeSplits[0]
      reporter.startStep(`Verify The  Average occupancy over last 90 days `);
      reporter.startStep(`Expected The Total People Count on Average occupancy over last 90 days - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
      if (total_Average_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Average_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      // if (day != 'Sat' && day != 'Sun') {
      //   if ((hours >= 8 && hours <= 18)) {
      //     logger.info("In Busy time")

      reporter.startStep(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
      if (total_Average_Time1 > 0) {
        logger.info(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`)
        expect(total_Average_Time1 > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //   } else {
      //     logger.info("Not busy time; Ignore The Average occupancy Count over last 90 days is Non Zero")
      //     reporter.startStep(`Not busy time;Ignore The Average occupancy Count over last 90 days is Non Zero`);
      //     reporter.endStep();
      //   }
      // } else {
      //   logger.info("It is weekend!; Ignore The Average occupancy Count over last 90 days is Non Zero")
      //   reporter.startStep(`It is weekend!; The Average occupancy Count over last 90 days is Non Zero`);
      //   reporter.endStep();
      // }
      reporter.endStep();

      let totalPeakTime = await getPropertyValueByXpath(tenantAdmin.p.total_PeakTime, "textContent")
      let totalPeakTimeSplit = totalPeakTime.split("/");
      let total_Peak_Time1 = totalPeakTimeSplit[0]
      let total_Peak_Time = totalPeakTimeSplit[1]
      let total_Peak_TimeSplits = total_Peak_Time.split(" ");
      let total_Peak_Time_Count = total_Peak_TimeSplits[0]
      reporter.startStep(`Verify The  Peak occupancy over last 90 days `);
      reporter.startStep(`Expected The Total People Count on Peak occupancy over last 90 days - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
      if (total_Peak_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Peak_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      // if (day != 'Sat' && day != 'Sun') {
      //   if ((hours >= 8 && hours <= 18)) {
      //     logger.info("In Busy time")
      reporter.startStep(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
      if (total_Peak_Time1 > 0) {
        logger.info(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`)
        expect(total_Peak_Time1 > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //   } else {
      //     logger.info("Not busy time; Ignore The Peak occupancy Count over last 90 days is Non Zero")
      //     reporter.startStep(`Not busy time;Ignore The Peak occupancy Count over last 90 days is Non Zero`);
      //     reporter.endStep();
      //   }
      // } else {
      //   logger.info("It is weekend!; Ignore The Peak occupancy Count over last 90 days is Non Zero")
      //   reporter.startStep(`It is weekend!; The Peak occupancy Count over last 90 days is Non Zero`);
      //   reporter.endStep();
      // }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Lobby Active label', async () => {
      reporter.startStep(`And Verify Lobby Active label`);
      //Validate the lobby active title
      let lobby_Active_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Txt, "textContent")
      let lobby_Active_Txt = lobby_Active_Txt_Trim.trim();
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Lobby Active Title Text  - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
      if (lobby_Active_Txt === conFig.Building1[buildingName].lobbyTitle) {
        logger.info(`Expected Lobby Active Title Text   - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`)
        expect(conFig.Building1[buildingName].lobbyTitle).toBe(lobby_Active_Txt);
      } else {
        logger.error(`Expected Lobby Active Title Text   - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      //Verify Lobby The Last Update Time and It's diff between 15mints est and portal time
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Time, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      //verify Real-time foot traffic is non zero
      let RealTime_FootTraffic_lobby = await getPropertyValueByXpath(tenantAdmin.p.RealTime_FootTraffic, "textContent")
      let RealTime_FootTraffic_lobbySplit = RealTime_FootTraffic_lobby.split(" ");
      let RealTime_FootTraffic = RealTime_FootTraffic_lobbySplit[0]
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          reporter.startStep(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
          if (RealTime_FootTraffic >= 0) {
            logger.info(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`)
            expect(RealTime_FootTraffic >= 0).toBeTruthy();
          } else {
            logger.error(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

        } else {
          logger.info("Not busy time; Ignore The Real-time foot traffic is non zero")
          reporter.startStep(`Not busy time;Ignore Real-time foot traffic is non zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
        reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
        reporter.endStep();
      }

      //verify the Average foot traffic over last 90 days
      let lobby_90Days_FootTraffic = await getPropertyValueByXpath(tenantAdmin.div.lobby90Days_FootTraffic, "textContent")
      let lobby_90Days_FootTrafficSplit = lobby_90Days_FootTraffic.split(" ");
      let lobby_90Days_Foot_Traffic = lobby_90Days_FootTrafficSplit[0]
      reporter.startStep(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
      if (lobby_90Days_Foot_Traffic > 0) {
        logger.info(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`)
        expect(lobby_90Days_Foot_Traffic > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
    });

    // And Verify The Building Occupancy Details label
    and('Verify The Building Occupancy Details label', async () => {
      reporter.startStep(`And Verify The Building Occupancy Details label`);
      let building_Occupancy_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.buildingOccupancyTxt, "textContent")
      const building_Occupancy_Txt = building_Occupancy_Txt_Trim.trim();
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Building Occupancy Title Text  - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
      if (building_Occupancy_Txt === conFig.Building1[buildingName].buildOccupancy_Txt) {
        logger.info(`Expected Building Occupancy Text   - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`)
        expect(conFig.Building1[buildingName].buildOccupancy_Txt).toBe(building_Occupancy_Txt);
      } else {
        logger.error(`Expected Building Occupancy Text   - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The building Occupancy last Update Time', async () => {
      reporter.startStep("Verify The building Occupancy last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.span.building_Occupancy_lastTime, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });


    and('Verify The Building Entrance Details', async () => {
      reporter.startStep("And Verify The Building Entrance Details");
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          let highRaiseBuildOccupancy = await getPropertyValueByXpath(tenantAdmin.p.highRaiseBuildOccupancy, "textContent")
          let highRaiseBuildOccupancySplit = highRaiseBuildOccupancy.split(" ");
          let high_Raise_Build_Occupancy = highRaiseBuildOccupancySplit[0]

          // verify The High Raise Building Occupancy is non zero
          reporter.startStep(`Expected The Entrance-1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`);
          if (high_Raise_Build_Occupancy > 0) {
            logger.info(`Expected The Entrance-1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`)
            expect(high_Raise_Build_Occupancy > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance-1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          // verify The Low  Raise West Building Occupancy is non zero
          let lowRaiseWest_BuildOcc = await getPropertyValueByXpath(tenantAdmin.p.lowRaiseWestBuildOcc, "textContent")
          let lowRaiseWest_BuildOccSplit = lowRaiseWest_BuildOcc.split(" ");
          let lowRaiseWestBuildOcc = lowRaiseWest_BuildOccSplit[0]
          reporter.startStep(`Expected The Entrance-2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`);
          if (lowRaiseWestBuildOcc > 0) {
            logger.info(`Expected TThe Entrance-2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`)
            expect(lowRaiseWestBuildOcc > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance-2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          // verify The Low  Raise East Building Occupancy is non zero
          let lowRaiseEast_BuildOcc = await getPropertyValueByXpath(tenantAdmin.p.lowRaiseEastBuildOcc, "textContent")
          let lowRaiseEast_BuildOccSplit = lowRaiseEast_BuildOcc.split(" ");
          let lowRaiseEastBuildOcc = lowRaiseEast_BuildOccSplit[0]
          reporter.startStep(`Expected The Entrance-3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`);
          if (lowRaiseEastBuildOcc > 0) {
            logger.info(`Expected The Entrance-3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`)
            expect(lowRaiseEastBuildOcc > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance-3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
        } else {
          logger.info("Not busy time; Ignore Building Occupancy Count is non zero")
          reporter.startStep(`Not busy time; Ignore Building Occupancy Count is non zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Building Occupancy Count is non zero")
        reporter.startStep(`It is weekend!; Ignore Building Occupancy Count is non zero`);
        reporter.endStep();
      }
      reporter.endStep();
    });
  });

  test('Navigate the <Building> and Verify The Occupancy Yesterday Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    //Then Verify Yesterday Occupancy Page last Update Time
    then('Verify Yesterday Occupancy Page last Update Time', async () => {
      reporter.startStep("Then Verify Yesterday Occupancy Page last Update Time");
      await Promise.all([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.today),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.yesterday),
        waitForNetworkIdle(120000)
      ])

      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.occupancy_LastUpDate, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Real Time Occupancy percentage
    and('Verify The Real Time Occupancy percentage', async () => {
      reporter.startStep(`And Verify The Real Time Occupancy percentage`);
      day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
      date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      hours = parseInt(date.split(' ')[1].split(':')[0])
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          let realTime_OccupancyPercent = await getPropertyValueByXpath(tenantAdmin.p.realTime_Occupancy_Percent, "textContent")
          reporter.startStep(`Expected  Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
          if (realTime_OccupancyPercent > 0 + "%") {
            logger.info(`Expected  Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`)
            expect(realTime_OccupancyPercent > 0 + "%").toBeTruthy();
          } else {
            logger.error(`Expected Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
            expect(true).toBe(false);
          }
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

    and('Verify The Average occupancy over last 90 days', async () => {
      reporter.startStep(`And Verify The Average occupancy over last 90 days`);
      let AverageOccupancy = await getPropertyValueByXpath(tenantAdmin.p.Average_Occupancy, "textContent")
      reporter.startStep(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
      if (AverageOccupancy > 0 + "%") {
        logger.info(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`)
        expect(AverageOccupancy > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Peak occupancy over last 90 days', async () => {
      reporter.startStep(`And Verify Peak occupancy over last 90 days`);
      let peak_Occupancy = await getPropertyValueByXpath(tenantAdmin.p.peakOccupancy, "textContent")
      reporter.startStep(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
      if (peak_Occupancy > 0 + "%") {
        logger.info(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`)
        expect(peak_Occupancy > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and(/^Verify The Total People Count "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep(`And Verify The Total People`);
      let totalRealTime = await getPropertyValueByXpath(tenantAdmin.p.total_RealTime, "textContent")
      let totalRealTimeSplit = totalRealTime.split("/");
      let total_Real_Time1 = totalRealTimeSplit[0]
      let total_Real_Time = totalRealTimeSplit[1]
      let totalRealTimeSplits = total_Real_Time.split(" ");
      let total_Real_Time_Count = totalRealTimeSplits[0]
      let conFig = await getEnvConfig()
      reporter.startStep(`Verify The Real Time Occupancy Count `);
      reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
      if (total_Real_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Real_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          reporter.startStep(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
          if (total_Real_Time1 > 0) {
            logger.info(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`)
            expect(total_Real_Time1 > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

        } else {
          logger.info("Not busy time; Ignore The Total People Count on Real Time Occupancy is Non Zero")
          reporter.startStep(`Not busy time;Ignore The Total People Count on Real Time Occupancy is Non Zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero")
        reporter.startStep(`It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero`);
        reporter.endStep();
      }
      reporter.endStep();

      let totalAverageTime = await getPropertyValueByXpath(tenantAdmin.p.total_AverageTime, "textContent")
      let totalAverageTimeSplit = totalAverageTime.split("/");
      let total_Average_Time1 = totalAverageTimeSplit[0]
      let total_Average_Time = totalAverageTimeSplit[1]
      let total_Average_TimeSplits = total_Average_Time.split(" ");
      let total_Average_Time_Count = total_Average_TimeSplits[0]
      reporter.startStep(`Verify The  Average occupancy over last 90 days `);
      reporter.startStep(`Expected The Total People Count on Average occupancy over last 90 days - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
      if (total_Average_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Average_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      reporter.startStep(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
      if (total_Average_Time1 > 0) {
        logger.info(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`)
        expect(total_Average_Time1 > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      let totalPeakTime = await getPropertyValueByXpath(tenantAdmin.p.total_PeakTime, "textContent")
      let totalPeakTimeSplit = totalPeakTime.split("/");
      let total_Peak_Time1 = totalPeakTimeSplit[0]
      let total_Peak_Time = totalPeakTimeSplit[1]
      let total_Peak_TimeSplits = total_Peak_Time.split(" ");
      let total_Peak_Time_Count = total_Peak_TimeSplits[0]
      reporter.startStep(`Verify The  Peak occupancy over last 90 days `);
      reporter.startStep(`Expected The Total People Count on Peak occupancy over last 90 days - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
      if (total_Peak_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Peak_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      reporter.startStep(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
      if (total_Peak_Time1 > 0) {
        logger.info(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`)
        expect(total_Peak_Time1 > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Lobby Active label', async () => {
      reporter.startStep(`And Verify Lobby Active label`);
      //Validate the lobby active title
      let lobby_Active_Txt_Trim= await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Txt, "textContent")
      let lobby_Active_Txt = lobby_Active_Txt_Trim.trim();
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Lobby Active Title Text  - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
      if (lobby_Active_Txt === conFig.Building1[buildingName].lobbyTitle) {
        logger.info(`Expected Lobby Active Title Text   - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`)
        expect(conFig.Building1[buildingName].lobbyTitle).toBe(lobby_Active_Txt);
      } else {
        logger.error(`Expected Lobby Active Title Text   - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      //Verify Lobby The Last Update Time and It's diff between 15mints est and portal time
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Time, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //verify Real-time foot traffic is non zero
      let RealTime_FootTraffic_lobby = await getPropertyValueByXpath(tenantAdmin.p.RealTime_FootTraffic, "textContent")
      let RealTime_FootTraffic_lobbySplit = RealTime_FootTraffic_lobby.split(" ");
      let RealTime_FootTraffic = RealTime_FootTraffic_lobbySplit[0]
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          reporter.startStep(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
          if (RealTime_FootTraffic >= 0) {
            logger.info(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`)
            expect(RealTime_FootTraffic >= 0).toBeTruthy();
          } else {
            logger.error(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

        } else {
          logger.info("Not busy time; Ignore The Real-time foot traffic is non zero")
          reporter.startStep(`Not busy time;Ignore Real-time foot traffic is non zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
        reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
        reporter.endStep();
      }

      //verify the Average foot traffic over last 90 days
      let lobby_90Days_FootTraffic = await getPropertyValueByXpath(tenantAdmin.div.lobby90Days_FootTraffic, "textContent")
      let lobby_90Days_FootTrafficSplit = lobby_90Days_FootTraffic.split(" ");
      let lobby_90Days_Foot_Traffic = lobby_90Days_FootTrafficSplit[0]
      // if (day != 'Sat' && day != 'Sun') {
      //   if ((hours >= 8 && hours <= 18)) {
      //     logger.info("In Busy time")
      reporter.startStep(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
      if (lobby_90Days_Foot_Traffic > 0) {
        logger.info(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`)
        expect(lobby_90Days_Foot_Traffic > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    // And Verify The Building Occupancy Details label
    and('Verify The Building Occupancy Details label', async () => {
      reporter.startStep(`And Verify The Building Occupancy Details label`);
      let building_Occupancy_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.buildingOccupancyTxt, "textContent")
      let building_Occupancy_Txt = building_Occupancy_Txt_Trim.trim();
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Building Occupancy Title Text  - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
      if (building_Occupancy_Txt === conFig.Building1[buildingName].buildOccupancy_Txt) {
        logger.info(`Expected Building Occupancy Text   - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`)
        expect(conFig.Building1[buildingName].buildOccupancy_Txt).toBe(building_Occupancy_Txt);
      } else {
        logger.error(`Expected Building Occupancy Text   - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The building Occupancy last Update Time', async () => {
      reporter.startStep("Verify The building Occupancy last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.span.building_Occupancy_lastTime, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Building Entrance Details', async () => {
      reporter.startStep("And Verify The Building Entrance Details");
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          let highRaiseBuildOccupancy = await getPropertyValueByXpath(tenantAdmin.p.highRaiseBuildOccupancy, "textContent")
          let highRaiseBuildOccupancySplit = highRaiseBuildOccupancy.split(" ");
          let high_Raise_Build_Occupancy = highRaiseBuildOccupancySplit[0]

          // verify The High Raise Building Occupancy is non zero
          reporter.startStep(`Expected The Entrance-1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`);
          if (high_Raise_Build_Occupancy > 0) {
            logger.info(`Expected The Entrance-1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`)
            expect(high_Raise_Build_Occupancy > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance-1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          // verify The Low  Raise West Building Occupancy is non zero
          let lowRaiseWest_BuildOcc = await getPropertyValueByXpath(tenantAdmin.p.lowRaiseWestBuildOcc, "textContent")
          let lowRaiseWest_BuildOccSplit = lowRaiseWest_BuildOcc.split(" ");
          let lowRaiseWestBuildOcc = lowRaiseWest_BuildOccSplit[0]
          let ss = await customScreenshot('building.png')
          reporter.addAttachment("building", ss, "image/png");
          reporter.startStep(`Expected The Entrance-2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`);
          if (lowRaiseWestBuildOcc >= 0) {
            logger.info(`Expected The Entrance-2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`)
            expect(lowRaiseWestBuildOcc >= 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance-2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          // verify The Low  Raise East Building Occupancy is non zero
          let lowRaiseEast_BuildOcc = await getPropertyValueByXpath(tenantAdmin.p.lowRaiseEastBuildOcc, "textContent")
          let lowRaiseEast_BuildOccSplit = lowRaiseEast_BuildOcc.split(" ");
          let lowRaiseEastBuildOcc = lowRaiseEast_BuildOccSplit[0]
          reporter.startStep(`Expected The Entrance-3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`);
          if (lowRaiseEastBuildOcc >= 0) {
            logger.info(`Expected  The Entrance-3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`)
            expect(lowRaiseEastBuildOcc >= 0).toBeTruthy();
          } else {
            logger.error(`Expected  The Entrance-3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
        } else {
          logger.info("Not busy time; Ignore Building Occupancy Count is non zero")
          reporter.startStep(`Not busy time; Ignore Building Occupancy Count is non zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Building Occupancy Count is non zero")
        reporter.startStep(`It is weekend!; Ignore Building Occupancy Count is non zero`);
        reporter.endStep();
      }
      reporter.endStep();
    });
  });

  //Navigate the <Building> and Verify The Occupancy Last 7 days Page
  test('Navigate the <Building> and Verify The Occupancy Last 7 days Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    //Then Verify Occupancy Page last Update Time
    then('Verify Occupancy Page last Update Time', async () => {
      reporter.startStep("Then Verify Occupancy Page last Update Time");
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.today),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.last7Days),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.occupancy_LastUpDate, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Real Time Occupancy percentage
    and('Verify The Real Time Occupancy percentage', async () => {
      reporter.startStep(`And Verify The Real Time Occupancy percentage`);
      day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
      date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      hours = parseInt(date.split(' ')[1].split(':')[0])
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          let realTime_OccupancyPercent = await getPropertyValueByXpath(tenantAdmin.p.realTime_Occupancy_Percent, "textContent")
          reporter.startStep(`Expected  Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
          if (realTime_OccupancyPercent > 0 + "%") {
            logger.info(`Expected  Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`)
            expect(realTime_OccupancyPercent > 0 + "%").toBeTruthy();
          } else {
            logger.error(`Expected Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
            expect(true).toBe(false);
          }
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

    and('Verify The Average occupancy over last 90 days', async () => {
      reporter.startStep(`And Verify The Average occupancy over last 90 days`);
      let AverageOccupancy = await getPropertyValueByXpath(tenantAdmin.p.Average_Occupancy, "textContent")
      reporter.startStep(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
      if (AverageOccupancy > 0 + "%") {
        logger.info(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`)
        expect(AverageOccupancy > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Peak occupancy over last 90 days', async () => {
      reporter.startStep(`And Verify Peak occupancy over last 90 days`);
      let peak_Occupancy = await getPropertyValueByXpath(tenantAdmin.p.peakOccupancy, "textContent")
      reporter.startStep(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
      if (peak_Occupancy > 0 + "%") {
        logger.info(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`)
        expect(peak_Occupancy > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and(/^Verify The Total People Count "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep(`And Verify The Total People`);
      let totalRealTime = await getPropertyValueByXpath(tenantAdmin.p.total_RealTime, "textContent")
      let totalRealTimeSplit = totalRealTime.split("/");
      let total_Real_Time1 = totalRealTimeSplit[0]
      let total_Real_Time = totalRealTimeSplit[1]
      let totalRealTimeSplits = total_Real_Time.split(" ");
      let total_Real_Time_Count = totalRealTimeSplits[0]
      let conFig = await getEnvConfig()
      reporter.startStep(`Verify The Real Time Occupancy Count `);
      reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
      if (total_Real_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Real_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          reporter.startStep(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
          if (total_Real_Time1 > 0) {
            logger.info(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`)
            expect(total_Real_Time1 > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

        } else {
          logger.info("Not busy time; Ignore The Total People Count on Real Time Occupancy is Non Zero")
          reporter.startStep(`Not busy time;Ignore The Total People Count on Real Time Occupancy is Non Zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero")
        reporter.startStep(`It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero`);
        reporter.endStep();
      }
      reporter.endStep();

      let totalAverageTime = await getPropertyValueByXpath(tenantAdmin.p.total_AverageTime, "textContent")
      let totalAverageTimeSplit = totalAverageTime.split("/");
      let total_Average_Time1 = totalAverageTimeSplit[0]
      let total_Average_Time = totalAverageTimeSplit[1]
      let total_Average_TimeSplits = total_Average_Time.split(" ");
      let total_Average_Time_Count = total_Average_TimeSplits[0]
      reporter.startStep(`Verify The  Average occupancy over last 90 days `);
      reporter.startStep(`Expected The Total People Count on Average occupancy over last 90 days - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
      if (total_Average_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Average_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      reporter.startStep(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
      if (total_Average_Time1 > 0) {
        logger.info(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`)
        expect(total_Average_Time1 > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      let totalPeakTime = await getPropertyValueByXpath(tenantAdmin.p.total_PeakTime, "textContent")
      let totalPeakTimeSplit = totalPeakTime.split("/");
      let total_Peak_Time1 = totalPeakTimeSplit[0]
      let total_Peak_Time = totalPeakTimeSplit[1]
      let total_Peak_TimeSplits = total_Peak_Time.split(" ");
      let total_Peak_Time_Count = total_Peak_TimeSplits[0]
      reporter.startStep(`Verify The  Peak occupancy over last 90 days `);
      reporter.startStep(`Expected The Total People Count on Peak occupancy over last 90 days - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
      if (total_Peak_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Peak_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      reporter.startStep(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
      if (total_Peak_Time1 > 0) {
        logger.info(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`)
        expect(total_Peak_Time1 > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Lobby Active label', async () => {
      reporter.startStep(`And Verify Lobby Active label`);
      //Validate the lobby active title
      let lobby_Active_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Txt, "textContent")
      let lobby_Active_Txt = lobby_Active_Txt_Trim.trim();
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Lobby Active Title Text  - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
      if (lobby_Active_Txt === conFig.Building1[buildingName].lobbyTitle) {
        logger.info(`Expected Lobby Active Title Text   - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`)
        expect(conFig.Building1[buildingName].lobbyTitle).toBe(lobby_Active_Txt);
      } else {
        logger.error(`Expected Lobby Active Title Text   - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      //Verify Lobby The Last Update Time and It's diff between 15mints est and portal time
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Time, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //verify Real-time foot traffic is non zero
      let RealTime_FootTraffic_lobby = await getPropertyValueByXpath(tenantAdmin.p.RealTime_FootTraffic, "textContent")
      let RealTime_FootTraffic_lobbySplit = RealTime_FootTraffic_lobby.split(" ");
      let RealTime_FootTraffic = RealTime_FootTraffic_lobbySplit[0]
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          reporter.startStep(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
          if (RealTime_FootTraffic >= 0) {
            logger.info(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`)
            expect(RealTime_FootTraffic >= 0).toBeTruthy();
          } else {
            logger.error(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

        } else {
          logger.info("Not busy time; Ignore The Real-time foot traffic is non zero")
          reporter.startStep(`Not busy time;Ignore Real-time foot traffic is non zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
        reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
        reporter.endStep();
      }

      //verify the Average foot traffic over last 90 days
      let lobby_90Days_FootTraffic = await getPropertyValueByXpath(tenantAdmin.div.lobby90Days_FootTraffic, "textContent")
      let lobby_90Days_FootTrafficSplit = lobby_90Days_FootTraffic.split(" ");
      let lobby_90Days_Foot_Traffic = lobby_90Days_FootTrafficSplit[0]
      reporter.startStep(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
      if (lobby_90Days_Foot_Traffic > 0) {
        logger.info(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`)
        expect(lobby_90Days_Foot_Traffic > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    // And Verify The Building Occupancy Details label
    and('Verify The Building Occupancy Details label', async () => {
      reporter.startStep(`And Verify The Building Occupancy Details label`);
      let building_Occupancy_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.buildingOccupancyTxt, "textContent")
      let building_Occupancy_Txt = building_Occupancy_Txt_Trim.trim();
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Building Occupancy Title Text  - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
      if (building_Occupancy_Txt === conFig.Building1[buildingName].buildOccupancy_Txt) {
        logger.info(`Expected Building Occupancy Text   - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`)
        expect(conFig.Building1[buildingName].buildOccupancy_Txt).toBe(building_Occupancy_Txt);
      } else {
        logger.error(`Expected Building Occupancy Text   - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

    });

    and('Verify The building Occupancy last Update Time', async () => {
      reporter.startStep("Verify The building Occupancy last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.span.building_Occupancy_lastTime, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Building Entrance Details', async () => {
      reporter.startStep("And Verify The Building Entrance Details");
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          let highRaiseBuildOccupancy = await getPropertyValueByXpath(tenantAdmin.p.highRaiseBuildOccupancy, "textContent")
          let highRaiseBuildOccupancySplit = highRaiseBuildOccupancy.split(" ");
          let high_Raise_Build_Occupancy = highRaiseBuildOccupancySplit[0]

          // verify The High Raise Building Occupancy is non zero
          reporter.startStep(`Expected The Entrance-1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`);
          if (high_Raise_Build_Occupancy > 0) {
            logger.info(`Expected The Entrance-1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`)
            expect(high_Raise_Build_Occupancy > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance-1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          // verify The Low  Raise West Building Occupancy is non zero
          let lowRaiseWest_BuildOcc = await getPropertyValueByXpath(tenantAdmin.p.lowRaiseWestBuildOcc, "textContent")
          let lowRaiseWest_BuildOccSplit = lowRaiseWest_BuildOcc.split(" ");
          let lowRaiseWestBuildOcc = lowRaiseWest_BuildOccSplit[0]
          reporter.startStep(`Expected The Entrance-2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`);
          if (lowRaiseWestBuildOcc > 0) {
            logger.info(`Expected The Entrance-2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`)
            expect(lowRaiseWestBuildOcc > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance-2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          // verify The Low  Raise East Building Occupancy is non zero
          let lowRaiseEast_BuildOcc = await getPropertyValueByXpath(tenantAdmin.p.lowRaiseEastBuildOcc, "textContent")
          let lowRaiseEast_BuildOccSplit = lowRaiseEast_BuildOcc.split(" ");
          let lowRaiseEastBuildOcc = lowRaiseEast_BuildOccSplit[0]
          reporter.startStep(`Expected The Entrance-3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`);
          if (lowRaiseEastBuildOcc > 0) {
            logger.info(`Expected The Entrance-3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`)
            expect(lowRaiseEastBuildOcc > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance-3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
        } else {
          logger.info("Not busy time; Ignore Building Occupancy Count is non zero")
          reporter.startStep(`Not busy time; Ignore Building Occupancy Count is non zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Building Occupancy Count is non zero")
        reporter.startStep(`It is weekend!; Ignore Building Occupancy Count is non zero`);
        reporter.endStep();
      }
      reporter.endStep();
    });
  });

  test('Navigate the <Building> and Verify The Occupancy Last 30 days Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    //Then Verify Occupancy Page last Update Time
    then('Verify Occupancy Page last Update Time', async () => {
      reporter.startStep("Then Verify Occupancy Page last Update Time");
      await Promise.all([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.today),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.last30DaysClick),
        waitForNetworkIdle(120000)
      ])

      let ss = await customScreenshot('env.png')
      reporter.addAttachment("env", ss, "image/png");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.occupancy_LastUpDate, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Real Time Occupancy percentage
    and('Verify The Real Time Occupancy percentage', async () => {
      reporter.startStep(`And Verify The Real Time Occupancy percentage`);
      day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
      date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      hours = parseInt(date.split(' ')[1].split(':')[0])
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          let realTime_OccupancyPercent = await getPropertyValueByXpath(tenantAdmin.p.realTime_Occupancy_Percent, "textContent")
          reporter.startStep(`Expected  Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
          if (realTime_OccupancyPercent > 0 + "%") {
            logger.info(`Expected  Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`)
            expect(realTime_OccupancyPercent > 0 + "%").toBeTruthy();
          } else {
            logger.error(`Expected Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
            expect(true).toBe(false);
          }
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

    and('Verify The Average occupancy over last 90 days', async () => {
      reporter.startStep(`And Verify The Average occupancy over last 90 days`);
      let AverageOccupancy = await getPropertyValueByXpath(tenantAdmin.p.Average_Occupancy, "textContent")
      reporter.startStep(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
      if (AverageOccupancy > 0 + "%") {
        logger.info(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`)
        expect(AverageOccupancy > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Peak occupancy over last 90 days', async () => {
      reporter.startStep(`And Verify Peak occupancy over last 90 days`);
      let peak_Occupancy = await getPropertyValueByXpath(tenantAdmin.p.peakOccupancy, "textContent")
      reporter.startStep(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
      if (peak_Occupancy > 0 + "%") {
        logger.info(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`)
        expect(peak_Occupancy > 0 + "%").toBeTruthy();
      } else {
        logger.error(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
        expect(true).toBe(false);
      }
      reporter.endStep();
      reporter.endStep();
    });

    and(/^Verify The Total People Count "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep(`And Verify The Total People`);
      let totalRealTime = await getPropertyValueByXpath(tenantAdmin.p.total_RealTime, "textContent")
      let totalRealTimeSplit = totalRealTime.split("/");
      let total_Real_Time1 = totalRealTimeSplit[0]
      let total_Real_Time = totalRealTimeSplit[1]
      let totalRealTimeSplits = total_Real_Time.split(" ");
      let total_Real_Time_Count = totalRealTimeSplits[0]
      let conFig = await getEnvConfig()
      reporter.startStep(`Verify The Real Time Occupancy Count `);
      reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
      if (total_Real_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Real_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          reporter.startStep(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
          if (total_Real_Time1 > 0) {
            logger.info(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`)
            expect(total_Real_Time1 > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

        } else {
          logger.info("Not busy time; Ignore The Total People Count on Real Time Occupancy is Non Zero")
          reporter.startStep(`Not busy time;Ignore The Total People Count on Real Time Occupancy is Non Zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero")
        reporter.startStep(`It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero`);
        reporter.endStep();
      }
      reporter.endStep();

      let totalAverageTime = await getPropertyValueByXpath(tenantAdmin.p.total_AverageTime, "textContent")
      let totalAverageTimeSplit = totalAverageTime.split("/");
      let total_Average_Time1 = totalAverageTimeSplit[0]
      let total_Average_Time = totalAverageTimeSplit[1]
      let total_Average_TimeSplits = total_Average_Time.split(" ");
      let total_Average_Time_Count = total_Average_TimeSplits[0]
      reporter.startStep(`Verify The  Average occupancy over last 90 days `);
      reporter.startStep(`Expected The Total People Count on Average occupancy over last 90 days - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
      if (total_Average_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Average_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      reporter.startStep(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
      if (total_Average_Time1 > 0) {
        logger.info(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`)
        expect(total_Average_Time1 > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      let totalPeakTime = await getPropertyValueByXpath(tenantAdmin.p.total_PeakTime, "textContent")
      let totalPeakTimeSplit = totalPeakTime.split("/");
      let total_Peak_Time1 = totalPeakTimeSplit[0]
      let total_Peak_Time = totalPeakTimeSplit[1]
      let total_Peak_TimeSplits = total_Peak_Time.split(" ");
      let total_Peak_Time_Count = total_Peak_TimeSplits[0]
      reporter.startStep(`Verify The  Peak occupancy over last 90 days `);
      reporter.startStep(`Expected The Total People Count on Peak occupancy over last 90 days - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
      if (total_Peak_Time_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_Peak_Time_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      reporter.startStep(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
      if (total_Peak_Time1 > 0) {
        logger.info(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`)
        expect(total_Peak_Time1 > 0).toBeTruthy();
      } else {
        logger.error(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify Lobby Active label', async () => {
      reporter.startStep(`And Verify Lobby Active label`);
      //Validate the lobby active title
      let lobby_Active_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Txt, "textContent")
      let lobby_Active_Txt = lobby_Active_Txt_Trim.trim();
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Lobby Active Title Text  - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
      if (lobby_Active_Txt === conFig.Building1[buildingName].lobbyTitle) {
        logger.info(`Expected Lobby Active Title Text   - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`)
        expect(conFig.Building1[buildingName].lobbyTitle).toBe(lobby_Active_Txt);
      } else {
        logger.error(`Expected Lobby Active Title Text   - ${conFig.Building1[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      //Verify Lobby The Last Update Time and It's diff between 15mints est and portal time
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Time, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //verify Real-time foot traffic is non zero
      let RealTime_FootTraffic_lobby = await getPropertyValueByXpath(tenantAdmin.p.RealTime_FootTraffic, "textContent")
      let RealTime_FootTraffic_lobbySplit = RealTime_FootTraffic_lobby.split(" ");
      let RealTime_FootTraffic = RealTime_FootTraffic_lobbySplit[0]
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          reporter.startStep(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
          if (RealTime_FootTraffic >= 0) {
            logger.info(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`)
            expect(RealTime_FootTraffic >= 0).toBeTruthy();
          } else {
            logger.error(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

        } else {
          logger.info("Not busy time; Ignore The Real-time foot traffic is non zero")
          reporter.startStep(`Not busy time;Ignore Real-time foot traffic is non zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
        reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
        reporter.endStep();
      }

      //verify the Average foot traffic over last 90 days
      let lobby_90Days_FootTraffic = await getPropertyValueByXpath(tenantAdmin.div.lobby90Days_FootTraffic, "textContent")
      let lobby_90Days_FootTrafficSplit = lobby_90Days_FootTraffic.split(" ");
      let lobby_90Days_Foot_Traffic = lobby_90Days_FootTrafficSplit[0]
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          reporter.startStep(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
          if (lobby_90Days_Foot_Traffic > 0) {
            logger.info(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`)
            expect(lobby_90Days_Foot_Traffic > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

        } else {
          logger.info("Not busy time; Ignore The Average foot traffic over last 90 days is non Zero")
          reporter.startStep(`Not busy time; Ignore The Average foot traffic over last 90 days is non Zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore The Average foot traffic over last 90 days is non Zero")
        reporter.startStep(`It is weekend!; Ignore The Average foot traffic over last 90 days is non Zero`);
        reporter.endStep();
      }
      reporter.endStep();
    });

    // And Verify The Building Occupancy Details label
    and('Verify The Building Occupancy Details label', async () => {
      reporter.startStep(`And Verify The Building Occupancy Details label`);
      let building_Occupancy_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.buildingOccupancyTxt, "textContent")
      let building_Occupancy_Txt = building_Occupancy_Txt_Trim.trim();
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected Building Occupancy Title Text  - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
      if (building_Occupancy_Txt === conFig.Building1[buildingName].buildOccupancy_Txt) {
        logger.info(`Expected Building Occupancy Text   - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`)
        expect(conFig.Building1[buildingName].buildOccupancy_Txt).toBe(building_Occupancy_Txt);
      } else {
        logger.error(`Expected Building Occupancy Text   - ${conFig.Building1[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The building Occupancy last Update Time', async () => {
      reporter.startStep("Verify The building Occupancy last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.span.building_Occupancy_lastTime, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Entrance', async () => {
      reporter.startStep("And Verify The Entrance");
      let conFig = await getEnvConfig()
      let mainEnter1 = await getPropertyValueByXpath(tenantAdmin.div.enter1, "textContent")
      const entrance = ["High Rise", "Low Rise West", "Low Rise East"]
      reporter.startStep(`Expected The  Entrance 1 Name  - ${entrance} and Actual Name - ${mainEnter1}`);
      if ((mainEnter1 === "High Rise") || (mainEnter1 === "Low Rise West") || (mainEnter1 === "Low Rise East")) {
        logger.info(`Expected The  Entrance 1 Name  - ${entrance} and Actual Name - ${mainEnter1}`)
        expect(entrance.includes(mainEnter1)).toBeTruthy()
      } else {
        logger.error(`Expected The  Entrance 1 Name  - ${entrance} and Actual Name - ${mainEnter1}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      let mainEnter2 = await getPropertyValueByXpath(tenantAdmin.div.enter2, "textContent")
      reporter.startStep(`Expected The  Entrance 2 Name  - ${entrance} and Actual Name - ${mainEnter2}`);
      if ((mainEnter2 === "High Rise") || (mainEnter2 === "Low Rise West") || (mainEnter2 === "Low Rise East")) {
        logger.info(`Expected The  Entrance 2 Name  - ${entrance} and Actual Name - ${mainEnter2}`)
        expect(entrance.includes(mainEnter2)).toBeTruthy()
      } else {
        logger.error(`Expected The  Entrance 2 Name  - ${entrance} and Actual Name - ${mainEnter2}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      let mainEnter3 = await getPropertyValueByXpath(tenantAdmin.div.enter3, "textContent")
      reporter.startStep(`Expected The  Entrance 3 Name  - ${entrance} and Actual Name - ${mainEnter3}`);
      if ((mainEnter3 === "High Rise") || (mainEnter3 === "Low Rise West") || (mainEnter3 === "Low Rise East")) {
        logger.info(`Expected The  Entrance 3 Name  - ${entrance} and Actual Name - ${mainEnter3}`)
        expect(entrance.includes(mainEnter3)).toBeTruthy()
      } else {
        logger.error(`Expected The  Entrance 3 Name  - ${entrance} and Actual Name - ${mainEnter3}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Building Entrance Details', async () => {
      reporter.startStep("And Verify The Building Entrance Details");
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          let highRaiseBuildOccupancy = await getPropertyValueByXpath(tenantAdmin.p.highRaiseBuildOccupancy, "textContent")
          let highRaiseBuildOccupancySplit = highRaiseBuildOccupancy.split(" ");
          let high_Raise_Build_Occupancy = highRaiseBuildOccupancySplit[0]

          // verify The High Raise Building Occupancy is non zero
          reporter.startStep(`Expected The Entrance 1 is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`);
          if (high_Raise_Build_Occupancy > 0) {
            logger.info(`Expected The Entrance 1  is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`)
            expect(high_Raise_Build_Occupancy > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance 1  is non zero and Actual  Count - ${high_Raise_Build_Occupancy}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          // verify The Low  Raise West Building Occupancy is non zero
          let lowRaiseWest_BuildOcc = await getPropertyValueByXpath(tenantAdmin.p.lowRaiseWestBuildOcc, "textContent")
          let lowRaiseWest_BuildOccSplit = lowRaiseWest_BuildOcc.split(" ");
          let lowRaiseWestBuildOcc = lowRaiseWest_BuildOccSplit[0]
          reporter.startStep(`Expected The Entrance 2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`);
          if (lowRaiseWestBuildOcc > 0) {
            logger.info(`Expected The Entrance 2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`)
            expect(lowRaiseWestBuildOcc > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance 2 is non zero and Actual  Count - ${lowRaiseWestBuildOcc}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          // verify The Low  Raise East Building Occupancy is non zero
          let lowRaiseEast_BuildOcc = await getPropertyValueByXpath(tenantAdmin.p.lowRaiseEastBuildOcc, "textContent")
          let lowRaiseEast_BuildOccSplit = lowRaiseEast_BuildOcc.split(" ");
          let lowRaiseEastBuildOcc = lowRaiseEast_BuildOccSplit[0]
          reporter.startStep(`Expected The Entrance 3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`);
          if (lowRaiseEastBuildOcc > 0) {
            logger.info(`Expected The Entrance 3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`)
            expect(lowRaiseEastBuildOcc > 0).toBeTruthy();
          } else {
            logger.error(`Expected The Entrance 3 is non zero and Actual  Count - ${lowRaiseEastBuildOcc}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
        } else {
          logger.info("Not busy time; Ignore Building Occupancy Count is non zero")
          reporter.startStep(`Not busy time; Ignore Building Occupancy Count is non zero`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Ignore Building Occupancy Count is non zero")
        reporter.startStep(`It is weekend!; Ignore Building Occupancy Count is non zero`);
        reporter.endStep();
      }
      reporter.endStep();
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
    });
  });

  //Navigate the <Building> and Verify The Last 7 Days Occupancy Usage Page
  test('Navigate the <Building> and Verify The Last 7 Days Occupancy Usage Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    then('Verify Last 7 Days OccupancyUsage Page', async () => {
      reporter.startStep("Then Verify Last 7 Days OccupancyUsage Page");
      await Promise.all([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.usageTab),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      let energy_Usage_IntensityScore = await getPropertyValueByXpath(tenantAdmin.p.energy_Usage_Intensity_Score, "textContent")
      reporter.startStep(`Expected The energy Usage Intensity Score are non zero and Actual  Score - ${energy_Usage_IntensityScore}`);
      if (energy_Usage_IntensityScore >= 0) {
        logger.info(`Expected The energy Usage Intensity Score are non zero and Actual  Score - ${energy_Usage_IntensityScore}`)
        expect(energy_Usage_IntensityScore >= 0).toBeTruthy();
      } else {
        logger.error(`Expected The energy Usage Intensity Score are non zero and Actual  Score - ${energy_Usage_IntensityScore}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //here verify total Swips are non zero
      let totalSwips = await getPropertyValueByXpath(tenantAdmin.p.total_Swips, "textContent")
      reporter.startStep(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
      if (totalSwips > 0) {
        logger.info(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`)
        expect(totalSwips > 0).toBeTruthy();
      } else {
        logger.error(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //here verify total Unique Users are non zero
      let totalUnique_Users = await getPropertyValueByXpath(tenantAdmin.p.total_Unique_Users, "textContent")
      reporter.startStep(`Expected Total Unique Users are non zero and Actual  Count - ${totalUnique_Users}`);
      if (totalUnique_Users > 0) {
        logger.info(`Expected Total Unique Users are non zero and Actual  Count - ${totalUnique_Users}`)
        expect(totalUnique_Users > 0).toBeTruthy();
      } else {
        logger.error(`Expected Total Unique Users are non zero and Actual  Count - ${totalUnique_Users}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and(/^Verify The Visit Frequency Text "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep(`And Verify The Visit Frequency Text`);
      let visit_Frequency_Txt = await getPropertyValueByXpath(tenantAdmin.h5.visit_Frequency_Txt_xpath, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Visit Frequency  Title Text  - ${conFig.Building1[buildingName].visitFrequencyTxt} and Actual  Status- ${visit_Frequency_Txt}`);
      if (visit_Frequency_Txt === conFig.Building1[buildingName].visitFrequencyTxt) {
        logger.info(`Expected The Visit Frequency  Title Text   - ${conFig.Building1[buildingName].visitFrequencyTxt} and Actual  Status- ${visit_Frequency_Txt}`)
        expect(conFig.Building1[buildingName].visitFrequencyTxt).toBe(visit_Frequency_Txt);
      } else {
        logger.error(`Expected The Visit Frequency  Title Text  - ${conFig.Building1[buildingName].visitFrequencyTxt} and Actual  Status- ${visit_Frequency_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Usage Page Last Upadte Time 
    and('Verify The Usage Page Last Upadte Time', async () => {
      reporter.startStep("And Verify The Usage Page Last Upadte Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.visitFrequencyLastUpadteTime, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //Here Verify The Aggregate user swipes into your spaces Text in Usage Page
    and('Verify The Aggregate user swipes Text in Usage Page', async () => {
      reporter.startStep(`And Verify The Aggregate user swipes Text in Usage Page`);
      let aggregateUser_Txt = await getPropertyValueByXpath(tenantAdmin.div.aggregate_User_Txt, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Aggregate user swipes Text in Usage Page  - ${conFig.Building1[buildingName].Aggregate_user_swipes} and Actual  Status- ${aggregateUser_Txt}`);
      if (aggregateUser_Txt === conFig.Building1[buildingName].Aggregate_user_swipes) {
        logger.info(`Expected The Aggregate user swipes Text in Usage Page   - ${conFig.Building1[buildingName].Aggregate_user_swipes} and Actual  Status- ${aggregateUser_Txt}`)
        expect(conFig.Building1[buildingName].Aggregate_user_swipes).toBe(aggregateUser_Txt);
      } else {
        logger.error(`Expected The Aggregate user swipes Text in Usage Page   - ${conFig.Building1[buildingName].Aggregate_user_swipes} and Actual  Status- ${aggregateUser_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Peak unique daily users Text in Usage Page
    and('Verify The Peak unique daily users Text in Usage Page', async () => {
      reporter.startStep(`And Verify The Peak unique daily users Text in Usage Page`);
      let usagePagePeakUser = await getPropertyValueByXpath(tenantAdmin.div.usagePage_PeakUser, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Peak unique daily users Text in Usage Page  - ${conFig.Building1[buildingName].Peak_Unique_daily_users} and Actual  Status- ${usagePagePeakUser}`);
      if (usagePagePeakUser === conFig.Building1[buildingName].Peak_Unique_daily_users) {
        logger.info(`Expected The Peak unique daily users Text in Usage Page   - ${conFig.Building1[buildingName].Peak_Unique_daily_users} and Actual  Status- ${usagePagePeakUser}`)
        expect(conFig.Building1[buildingName].Peak_Unique_daily_users).toBe(usagePagePeakUser);
      } else {
        logger.error(`Expected The Peak unique daily users Text in Usage Page   - ${conFig.Building1[buildingName].Peak_Unique_daily_users} and Actual  Status- ${usagePagePeakUser}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
    });
  });

  //Navigate the <Building> and Verify The Last 14 Days Occupancy Usage Page
  test('Navigate the <Building> and Verify The Last 14 Days Occupancy Usage Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    then('Verify Last 14 Days OccupancyUsage Page', async () => {
      reporter.startStep("Then Verify Last 14 Days OccupancyUsage Page");
      await Promise.all([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.usageTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.last14Days),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      let energy_Usage_IntensityScore = await getPropertyValueByXpath(tenantAdmin.p.energy_Usage_Intensity_Score, "textContent")
      reporter.startStep(`Expected The energy Usage Intensity Score are non zero and Actual  Score - ${energy_Usage_IntensityScore}`);
      if (energy_Usage_IntensityScore >= 0) {
        logger.info(`Expected The energy Usage Intensity Score are non zero and Actual  Score - ${energy_Usage_IntensityScore}`)
        expect(energy_Usage_IntensityScore >= 0).toBeTruthy();
      } else {
        logger.error(`Expected The energy Usage Intensity Score are non zero and Actual  Score - ${energy_Usage_IntensityScore}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //here verify total Swips are non zero
      let totalSwips = await getPropertyValueByXpath(tenantAdmin.p.total_Swips, "textContent")
      reporter.startStep(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
      if (totalSwips > 0) {
        logger.info(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`)
        expect(totalSwips > 0).toBeTruthy();
      } else {
        logger.error(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //here verify total Unique Users are non zero
      let totalUnique_Users = await getPropertyValueByXpath(tenantAdmin.p.total_Unique_Users, "textContent")
      reporter.startStep(`Expected Total Unique Users are non zero and Actual  Count - ${totalUnique_Users}`);
      if (totalUnique_Users > 0) {
        logger.info(`Expected Total Unique Users are non zero and Actual  Count - ${totalUnique_Users}`)
        expect(totalUnique_Users > 0).toBeTruthy();
      } else {
        logger.error(`Expected Total Unique Users are non zero and Actual  Count - ${totalUnique_Users}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and(/^Verify The Visit Frequency Text "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep(`And Verify The Visit Frequency Text`);
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      let visit_Frequency_Txt = await getPropertyValueByXpath(tenantAdmin.h5.visit_Frequency_Txt_xpath, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Visit Frequency  Title Text  - ${conFig.Building1[buildingName].visitFrequencyTxt} and Actual  Status- ${visit_Frequency_Txt}`);
      if (visit_Frequency_Txt === conFig.Building1[buildingName].visitFrequencyTxt) {
        logger.info(`Expected The Visit Frequency  Title Text   - ${conFig.Building1[buildingName].visitFrequencyTxt} and Actual  Status- ${visit_Frequency_Txt}`)
        expect(conFig.Building1[buildingName].visitFrequencyTxt).toBe(visit_Frequency_Txt);
      } else {
        logger.error(`Expected The Visit Frequency  Title Text  - ${conFig.Building1[buildingName].visitFrequencyTxt} and Actual  Status- ${visit_Frequency_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Usage Page Last Upadte Time 
    and('Verify The Usage Page Last Upadte Time', async () => {
      reporter.startStep("And Verify The Usage Page Last Upadte Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.visitFrequencyLastUpadteTime, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //Here Verify The Aggregate user swipes into your spaces Text in Usage Page
    and('Verify The Aggregate user swipes Text in Usage Page', async () => {
      reporter.startStep(`And Verify The Aggregate user swipes Text in Usage Page`);
      let aggregateUser_Txt = await getPropertyValueByXpath(tenantAdmin.div.aggregate_User_Txt, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Aggregate user swipes Text in Usage Page  - ${conFig.Building1[buildingName].Aggregate_user_swipes} and Actual  Status- ${aggregateUser_Txt}`);
      if (aggregateUser_Txt === conFig.Building1[buildingName].Aggregate_user_swipes) {
        logger.info(`Expected The Aggregate user swipes Text in Usage Page   - ${conFig.Building1[buildingName].Aggregate_user_swipes} and Actual  Status- ${aggregateUser_Txt}`)
        expect(conFig.Building1[buildingName].Aggregate_user_swipes).toBe(aggregateUser_Txt);
      } else {
        logger.error(`Expected The Aggregate user swipes Text in Usage Page   - ${conFig.Building1[buildingName].Aggregate_user_swipes} and Actual  Status- ${aggregateUser_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Peak unique daily users Text in Usage Page
    and('Verify The Peak unique daily users Text in Usage Page', async () => {
      reporter.startStep(`And Verify The Peak unique daily users Text in Usage Page`);
      let usagePagePeakUser = await getPropertyValueByXpath(tenantAdmin.div.usagePage_PeakUser, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Peak unique daily users Text in Usage Page  - ${conFig.Building1[buildingName].Peak_Unique_daily_users} and Actual  Status- ${usagePagePeakUser}`);
      if (usagePagePeakUser === conFig.Building1[buildingName].Peak_Unique_daily_users) {
        logger.info(`Expected The Peak unique daily users Text in Usage Page   - ${conFig.Building1[buildingName].Peak_Unique_daily_users} and Actual  Status- ${usagePagePeakUser}`)
        expect(conFig.Building1[buildingName].Peak_Unique_daily_users).toBe(usagePagePeakUser);
      } else {
        logger.error(`Expected The Peak unique daily users Text in Usage Page   - ${conFig.Building1[buildingName].Peak_Unique_daily_users} and Actual  Status- ${usagePagePeakUser}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
    });
  });

  test('Navigate the <Building> and Verify The Last 30 Days Occupancy Usage Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)
    then('Verify Last 30 Days OccupancyUsage Page', async () => {
      reporter.startStep("Then Verify Last 30 Days OccupancyUsage Page");
      await delay(4000)
      await Promise.all([
        performAction("click", buildingOverview.a.occupancyTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.usageTab),
        waitForNetworkIdle(120000)
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.last30Days),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      let energy_Usage_IntensityScore = await getPropertyValueByXpath(tenantAdmin.p.energy_Usage_Intensity_Score, "textContent")
      reporter.startStep(`Expected The energy Usage Intensity Score are non zero and Actual  Score - ${energy_Usage_IntensityScore}`);
      if (energy_Usage_IntensityScore >= 0) {
        logger.info(`Expected The energy Usage Intensity Score are non zero and Actual  Score - ${energy_Usage_IntensityScore}`)
        expect(energy_Usage_IntensityScore >= 0).toBeTruthy();
      } else {
        logger.error(`Expected The energy Usage Intensity Score are non zero and Actual  Score - ${energy_Usage_IntensityScore}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //here verify total Swips are non zero
      let totalSwips = await getPropertyValueByXpath(tenantAdmin.p.total_Swips, "textContent")
      reporter.startStep(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
      if (totalSwips > 0) {
        logger.info(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`)
        expect(totalSwips > 0).toBeTruthy();
      } else {
        logger.error(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //here verify total Unique Users are non zero
      let totalUnique_Users = await getPropertyValueByXpath(tenantAdmin.p.total_Unique_Users, "textContent")
      reporter.startStep(`Expected Total Unique Users are non zero and Actual  Count - ${totalUnique_Users}`);
      if (totalUnique_Users > 0) {
        logger.info(`Expected Total Unique Users are non zero and Actual  Count - ${totalUnique_Users}`)
        expect(totalUnique_Users > 0).toBeTruthy();
      } else {
        logger.error(`Expected Total Unique Users are non zero and Actual  Count - ${totalUnique_Users}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and(/^Verify The Visit Frequency Text "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep(`And Verify The Visit Frequency Text`);
      let visit_Frequency_Txt = await getPropertyValueByXpath(tenantAdmin.h5.visit_Frequency_Txt_xpath, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Visit Frequency  Title Text  - ${conFig.Building1[buildingName].visitFrequencyTxt} and Actual  Status- ${visit_Frequency_Txt}`);
      if (visit_Frequency_Txt === conFig.Building1[buildingName].visitFrequencyTxt) {
        logger.info(`Expected The Visit Frequency  Title Text   - ${conFig.Building1[buildingName].visitFrequencyTxt} and Actual  Status- ${visit_Frequency_Txt}`)
        expect(conFig.Building1[buildingName].visitFrequencyTxt).toBe(visit_Frequency_Txt);
      } else {
        logger.error(`Expected The Visit Frequency  Title Text  - ${conFig.Building1[buildingName].visitFrequencyTxt} and Actual  Status- ${visit_Frequency_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Usage Page Last Upadte Time 
    and('Verify The Usage Page Last Upadte Time', async () => {
      reporter.startStep("And Verify The Usage Page Last Upadte Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.visitFrequencyLastUpadteTime, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //Here Verify The Aggregate user swipes into your spaces Text in Usage Page
    and('Verify The Aggregate user swipes Text in Usage Page', async () => {
      reporter.startStep(`And Verify The Aggregate user swipes Text in Usage Page`);
      let aggregateUser_Txt = await getPropertyValueByXpath(tenantAdmin.div.aggregate_User_Txt, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Aggregate user swipes Text in Usage Page  - ${conFig.Building1[buildingName].Aggregate_user_swipes} and Actual  Status- ${aggregateUser_Txt}`);
      if (aggregateUser_Txt === conFig.Building1[buildingName].Aggregate_user_swipes) {
        logger.info(`Expected The Aggregate user swipes Text in Usage Page   - ${conFig.Building1[buildingName].Aggregate_user_swipes} and Actual  Status- ${aggregateUser_Txt}`)
        expect(conFig.Building1[buildingName].Aggregate_user_swipes).toBe(aggregateUser_Txt);
      } else {
        logger.error(`Expected The Aggregate user swipes Text in Usage Page   - ${conFig.Building1[buildingName].Aggregate_user_swipes} and Actual  Status- ${aggregateUser_Txt}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Peak unique daily users Text in Usage Page
    and('Verify The Peak unique daily users Text in Usage Page', async () => {
      reporter.startStep(`And Verify The Peak unique daily users Text in Usage Page`);
      let usagePagePeakUser = await getPropertyValueByXpath(tenantAdmin.div.usagePage_PeakUser, "textContent")
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Peak unique daily users Text in Usage Page  - ${conFig.Building1[buildingName].Peak_Unique_daily_users} and Actual  Status- ${usagePagePeakUser}`);
      if (usagePagePeakUser === conFig.Building1[buildingName].Peak_Unique_daily_users) {
        logger.info(`Expected The Peak unique daily users Text in Usage Page   - ${conFig.Building1[buildingName].Peak_Unique_daily_users} and Actual  Status- ${usagePagePeakUser}`)
        expect(conFig.Building1[buildingName].Peak_Unique_daily_users).toBe(usagePagePeakUser);
      } else {
        logger.error(`Expected The Peak unique daily users Text in Usage Page   - ${conFig.Building1[buildingName].Peak_Unique_daily_users} and Actual  Status- ${usagePagePeakUser}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();

      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
    });
  });

  test('Navigate the <Building> and Verify The Building Occupancy in Overviewpage', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedTn(given)
    whenIselectBuilding(when)

    //Then Verify The OverView Page last Update Time
    then('Verify The OverView Page last Update Time', async () => {
      reporter.startStep("Then Verify The OverView Page last Update Time");
      let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.buildOccLastUpdate, "textContent")
      let Last_updatedTimeSplit = Last_updatedTime.split(": ");
      let last__Update_Time_OverView = Last_updatedTimeSplit[1]
      const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      let datesplit = date.split(",");
      let splitvalueDate = datesplit[0]
      let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
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
      let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
      reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
      if (timeDifferenceInMinutes <= 15) {
        logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
        expect(timeDifferenceInMinutes <= 15).toBeTruthy()
      } else {
        logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    //And Verify The Real Time Occupancy in OverView page
    and('Verify The Real Time Occupancy and 90 days Peak Occupancy in OverView page', async () => {
      reporter.startStep(`And Verify The Real Time Occupancy and 90 days Peak Occupancy in OverView page`);
      day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
      date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
      hours = parseInt(date.split(' ')[1].split(':')[0])
      if (day != 'Sat' && day != 'Sun') {
        if ((hours >= 8 && hours <= 18)) {
          logger.info("In Busy time")
          //here Verify The Real Time Occupancy percentage are non zero in OverView page  
          let occRealTimeOcc = await getPropertyValueByXpath(tenantAdmin.div.occ_RealTimeOcc, "textContent")
          reporter.startStep(`Expected The Real Time Occupancy Percentage are non zero and Actual  Status - ${occRealTimeOcc}`);
          if (occRealTimeOcc >= 0 + "%") {
            logger.info(`Expected The Real Time Occupancy Percentage are non zero and Actual  Status - ${occRealTimeOcc}`)
            expect(occRealTimeOcc >= 0 + "%").toBeTruthy();
          } else {
            logger.error(`Expected The Real Time Occupancy Percentage are non zero and Actual  Status - ${occRealTimeOcc}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          //here Verify The Real Time Occupancy count are non zero in OverView page
          let occRealTimeOcc_Counts = await getPropertyValueByXpath(tenantAdmin.div.occ_RealTimeOcc_Count, "textContent")
          let occRealTimeOcc_CountsSplit = occRealTimeOcc_Counts.split(" ");
          let occRealTimeOcc_Count = occRealTimeOcc_CountsSplit[0]
          reporter.startStep(`Expected The Real Time Occupancy Count are non zero and Actual  Status - ${occRealTimeOcc_Count}`);
          if (occRealTimeOcc_Count >= 0) {
            logger.info(`Expected The Real Time Occupancy Count are non zero and Actual  Status - ${occRealTimeOcc_Count}`)
            expect(occRealTimeOcc_Count >= 0).toBeTruthy();
          } else {
            logger.error(`Expected The Real Time Occupancy Count are non zero and Actual  Status - ${occRealTimeOcc_Count}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          //here verify 90 days Peak Occupancy percentage are non zero in OverView page
          let occ90DaysPeak = await getPropertyValueByXpath(tenantAdmin.div.occ_90Days_Peak, "textContent")
          reporter.startStep(`Expected 90 days Peak Occupancy Percentage are non zero and Actual  Status - ${occ90DaysPeak}`);
          if (occ90DaysPeak > 0 + "%") {
            logger.info(`Expected 90 days Peak Occupancy Percentage are non zero and Actual  Status - ${occ90DaysPeak}`)
            expect(occ90DaysPeak > 0 + "%").toBeTruthy();
          } else {
            logger.error(`Expected 90 days Peak Occupancy Percentage are non zero and Actual  Status - ${occ90DaysPeak}`);
            expect(true).toBe(false)
          }
          reporter.endStep();

          //here verify 90 days Peak Occupancy count are non zero in OverView page
          let occ90DaysPeak_Counts = await getPropertyValueByXpath(tenantAdmin.div.occ_90DaysPeak_Count, "textContent")
          let occ90DaysPeak_CountsSplit = occ90DaysPeak_Counts.split(" ");
          let occ90DaysPeak_Count = occ90DaysPeak_CountsSplit[0]
          reporter.startStep(`Expected 90 days Peak Occupancy count are non zero and Actual  Status - ${occ90DaysPeak_Count}`);
          if (occ90DaysPeak_Count >= 0) {
            logger.info(`Expected 90 days Peak Occupancy count are non zero and Actual  Status - ${occ90DaysPeak_Count}`)
            expect(occ90DaysPeak_Count >= 0).toBeTruthy();
          } else {
            logger.error(`Expected 90 days Peak Occupancy count are non zero and Actual  Status - ${occ90DaysPeak_Count}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
        } else {
          logger.info("Not busy time; Ignore The Real Time Occupancy and 90 days Peak Occupancy are non zero in Overview Page")
          reporter.startStep(`Not busy time; Ignore The Real Time Occupancy and 90 days Peak Occupancy are non zero in Overview Page`);
          reporter.endStep();
        }
      } else {
        logger.info("It is weekend!; Not busy time; Ignore The Real Time Occupancy and 90 days Peak Occupancy are non zero in Overview Page")
        reporter.startStep(`It is weekend!; Not busy time; Ignore The Real Time Occupancy and 90 days Peak Occupancy are non zero in Overview Page`);
        reporter.endStep();
      }
      reporter.endStep();
    });

    //here Verify Total real Time Occupancy 
    and(/^Verify Total Real Time Occupancy and 90 Days Peak Occupancy "(.*)"$/, async (building) => {
      reporter.startStep(`And Verify Total Real Time Occupancy and 90 Days Peak Occupancy`);
      buildingName = building
      let total_RealTimeOcc_Counts = await getPropertyValueByXpath(tenantAdmin.div.occ_RealTimeOcc_Count, "textContent")
      let total_RealTimeOcc_CountsSplit = total_RealTimeOcc_Counts.split(" ");
      let total_RealTimeOcc_Count = total_RealTimeOcc_CountsSplit[2]
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_RealTimeOcc_Count}`);
      if (total_RealTimeOcc_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_RealTimeOcc_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(total_RealTimeOcc_Count);
      } else {
        logger.error(`Expected The Total People Count  - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${total_RealTimeOcc_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      //here Verify total 90 Days Peak Occupancy
      let occ90DaysPeak_Counts = await getPropertyValueByXpath(tenantAdmin.div.occ_90DaysPeak_Count, "textContent")
      let occ90DaysPeak_CountsSplit = occ90DaysPeak_Counts.split(" ");
      let occ90DaysPeak_Count = occ90DaysPeak_CountsSplit[2]
      reporter.startStep(`Expected The Total 90 Days Peak Occupancy - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${occ90DaysPeak_Count}`);
      if (occ90DaysPeak_Count === conFig.Building1[buildingName].total_People) {
        logger.info(`Expected The Total 90 Days Peak Occupancy- ${conFig.Building1[buildingName].total_People} and Actual  Count - ${occ90DaysPeak_Count}`)
        expect(conFig.Building1[buildingName].total_People).toBe(occ90DaysPeak_Count);
      } else {
        logger.error(`Expected The Total 90 Days Peak Occupancy - ${conFig.Building1[buildingName].total_People} and Actual  Count - ${occ90DaysPeak_Count}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify The Installed Occupancy Online and Offline Count', async () => {
      reporter.startStep(`And Verify The Installed Occupancy Online and Offline Count`);
      let installOccOnline_Count = await getPropertyValueByXpath(tenantAdmin.p.install_OccOnline_Count, "textContent")
      let installOccOnline_CountSplit = installOccOnline_Count.split(" ");
      let installOccOnlineCount = installOccOnline_CountSplit[0]
      let conFig = await getEnvConfig()
      reporter.startStep(`Expected The Installed Occupancy Online Count is  - ${conFig.Building1[buildingName].occ_OnlineCount} and Actual  Count - ${installOccOnlineCount}`);
      if (installOccOnlineCount === conFig.Building1[buildingName].occ_OnlineCount) {
        logger.info(`Expected The Installed Occupancy Online Count is- ${conFig.Building1[buildingName].occ_OnlineCount} and Actual  Count - ${installOccOnlineCount}`)
        expect(conFig.Building1[buildingName].occ_OnlineCount).toBe(installOccOnlineCount);
      } else {
        logger.error(`Expected The Installed Occupancy Online Count is - ${conFig.Building1[buildingName].occ_OnlineCount} and Actual  Count - ${installOccOnlineCount}`);
        expect(true).toBe(false)
      }
      reporter.endStep();

      let install_OccOfflinecount = await getPropertyValueByXpath(tenantAdmin.p.install_OccOffline_count, "textContent")
      let install_OccOfflinecountSplit = install_OccOfflinecount.split(" ");
      let installOccOfflinecount = install_OccOfflinecountSplit[0]
      reporter.startStep(`Expected The Installed Occupancy Offline Count is  - ${conFig.Building1[buildingName].occ_OfflineCount} and Actual  Count - ${installOccOfflinecount}`);
      if (installOccOfflinecount === conFig.Building1[buildingName].occ_OfflineCount) {
        logger.info(`Expected The Installed Occupancy Offline Count is- ${conFig.Building1[buildingName].occ_OfflineCount} and Actual  Count - ${installOccOfflinecount}`)
        expect(conFig.Building1[buildingName].occ_OfflineCount).toBe(installOccOfflinecount);
      } else {
        logger.error(`Expected The Installed Occupancy Offline Count is - ${conFig.Building1[buildingName].occ_OfflineCount} and Actual  Count - ${installOccOfflinecount}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });
  });

  test('Navigate the Building and Verify User Page', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    given('I am logged as a Building Manager', async () => {
      reporter.startStep("Given I am logged as a Building Manager");
      await delay(4000)
      await logout()
      let config = await getEnvConfig()
      logger.info("global.env = " + global.env)
      await goTo(config.sbpURL)
      await login(global.env, "BM")
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    whenIselectBuilding(when)
    then('Create The New User in User Page', async () => {
      reporter.startStep(`Then Create The New User in User Page`);
      await delay(2000)
      await Promise.all([
        performAction("click", tenantAdmin.button.userTab),
        waitForNetworkIdle()
      ])
      await Promise.all([
        performAction("click", tenantAdmin.button.addUser),
        waitForNetworkIdle(120000)
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });


    and(/^Enter The Name "(.*)"and"(.*)"$/, async (arg2, arg3) => {
      reporter.startStep("Enter The FirstName and LastName");
      action = await performAction("type", tenantAdmin.label.firstName, page, arg2)
      expect(action).toBeTruthy()
      action = await performAction("type", tenantAdmin.label.lastName, page, arg3)
      expect(action).toBeTruthy()
      await delay(2000)
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    and(/^Enter The Information "(.*)"and"(.*)"$/, async (arg4, arg5) => {
      reporter.startStep("And Enter The Information");
      action = await performAction("type", tenantAdmin.label.email, page, arg4)
      expect(action).toBeTruthy()
      action = await performAction("type", tenantAdmin.label.phone, page, arg5)
      expect(action).toBeTruthy()
      await delay(2000)
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    and(/^Enter The Passwords "(.*)"and"(.*)"$/, async (arg6, arg7) => {
      reporter.startStep("And Enter The Passwords");
      action = await performAction("type", tenantAdmin.label.password, page, arg6)
      expect(action).toBeTruthy()
      action = await performAction("type", tenantAdmin.label.confirmPassword, page, arg7)
      expect(action).toBeTruthy()

      let ss1 = await customScreenshot('building.png')
      reporter.addAttachment("building", ss1, "image/png");
      await delay(4000)
      await performAction("click", tenantAdmin.button.tenantAdminTab)
      await delay(2000)
      let ss2 = await customScreenshot('building.png')
      reporter.addAttachment("building", ss2, "image/png");
      await delay(4000)
      await Promise.all([
        performAction("click", tenantAdmin.button.tenantAdminClick),
        waitForNetworkIdle()
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    and('Select Add New User', async () => {
      reporter.startStep(`And Select The Add New User`);
      await Promise.all([
        performAction("click", tenantAdmin.button.nextTab),
        waitForNetworkIdle(120000)
      ])
      await delay(2000)
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    and('Select The Company and Building', async () => {
      reporter.startStep(`And Select The Company and Building`);
      await performAction('click', tenantAdmin.button.selectBuildingDrop)
      await delay(2000)
      await Promise.all([
        performAction("click", tenantAdmin.button.clickBuilding),
        waitForNetworkIdle(90000)
      ])
      await delay(6000)
      try {
        performAction("click", tenantAdmin.button.companySelect),
          await delay(4000)
        await performAction("click", tenantAdmin.button.clickcompanyBm);
        await delay(4000);

      } catch {
        performAction("click", tenantAdmin.button.companySelect),
          await delay(4000)
        await performAction("click", tenantAdmin.button.clickcompanyBm);
        await delay(4000);
      }
      await Promise.all([
        performAction("click", tenantAdmin.div.addClickUser),
        waitForNetworkIdle()
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    and(/^Verify The New add User details "(.*)"$/, async (arg8) => {
      reporter.startStep(`And Verify The New add User details`);
      await delay(2000)
      action = await performAction("type", tenantAdmin.input.searchUsers, page, arg8)
      expect(action).toBeTruthy()
      await delay(2000)
      let emailText = await getPropertyValueByXpath(tenantAdmin.input.searchUsers, "defaultValue")
      let configFile = await getEnvConfig()
      reporter.startStep(`Expected Email Id ${configFile.newUser['userData'].emailId} and Actual Id ${emailText}`);
      if (emailText === configFile.newUser['userData'].emailId) {
        logger.info(`Expected Email Id ${configFile.newUser['userData'].emailId} and Actual Id ${emailText}`)
        expect(configFile.newUser['userData'].emailId).toBe(emailText);
      } else {
        logger.error(`Expected Email Id ${configFile.newUser['userData'].emailId} and Actual Id ${emailText}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      await delay(2000)
      let userName_Verify = await getPropertyValueByXpath(tenantAdmin.div.userNameVerify, "textContent")
      reporter.startStep(`Expected The Name- ${configFile.newUser['userData'].Name} and Actual Id ${userName_Verify}`);
      if (userName_Verify === configFile.newUser['userData'].Name) {
        logger.info(`Expected Email Id ${configFile.newUser['userData'].Name} and Actual Id ${userName_Verify}`)
        expect(configFile.newUser['userData'].Name).toBe(userName_Verify);
      } else {
        logger.error(`Expected Email Id ${configFile.newUser['userData'].Name} and Actual Id ${userName_Verify}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let user_NumberVerify = await getPropertyValueByXpath(tenantAdmin.div.userNumberVerify, "textContent")
      reporter.startStep(`Expected The User Number- ${configFile.newUser['userData'].userNo} and Actual Number - ${user_NumberVerify}`);
      if (user_NumberVerify === configFile.newUser['userData'].userNo) {
        logger.info(`Expected The User Number - ${configFile.newUser['userData'].userNo} and Actual Number - ${user_NumberVerify}`)
        expect(configFile.newUser['userData'].userNo).toBe(user_NumberVerify);
      } else {
        logger.error(`Expected The User Number - ${configFile.newUser['userData'].userNo} and Actual Number - ${user_NumberVerify}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let user_Persona = await getPropertyValueByXpath(tenantAdmin.div.userPersona, "textContent")
      reporter.startStep(`Expected The Persona- ${configFile.newUser['userData'].persona} and Actual Persona - ${user_Persona}`);
      if (user_Persona === configFile.newUser['userData'].persona) {
        logger.info(`Expected The Persona - ${configFile.newUser['userData'].persona} and Actual Persona - ${user_Persona}`)
        expect(configFile.newUser['userData'].persona).toBe(user_Persona);
      } else {
        logger.error(`Expected The Persona - ${configFile.newUser['userData'].persona} and Actual Persona - ${user_Persona}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });
  });

  test('Navigate the Building and Verify The Edit User', async ({
    given,
    when,
    then,
    and,
  }) => {
    let online_sensors, date, day, hours, buildingName
    given('I am logged as a Building Manager', async () => {
      reporter.startStep("Given I am logged as a Building Manager");
      await delay(2000)
      await logout()
      let config = await getEnvConfig()
      logger.info("global.env = " + global.env)
      await goTo(config.sbpURL)
      await login(global.env, "BM")
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    whenIselectBuilding(when)
    then(/^Click The Edit User "(.*)"$/, async (arg1) => {
      reporter.startStep(`Then Click The Edit User`);
      await delay(2000)
      await Promise.all([
        performAction("click", tenantAdmin.button.userTab),
        waitForNetworkIdle()
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      await delay(4000)
      action = await performAction("type", tenantAdmin.input.searchUsers, page, arg1)
      expect(action).toBeTruthy()
      await delay(4000)
      action = await performAction("click", tenantAdmin.span.editUser, page, arg1)
      expect(action).toBeTruthy()
      await delay(2000)
      reporter.endStep();
    });

    and(/^Edit The Name "(.*)"and"(.*)"$/, async (arg2, arg3) => {
      reporter.startStep("Edit The FirstName and LastName");
      action = await performAction("type", tenantAdmin.label.firstName, page, arg2)
      expect(action).toBeTruthy()
      action = await performAction("type", tenantAdmin.label.lastName, page, arg3)
      expect(action).toBeTruthy()
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    and(/^Edit The User Contact Number "(.*)"$/, async (arg4) => {
      reporter.startStep(`And Edit The User Contact Number`);
      action = await performAction("click", tenantAdmin.input.editMobileNo, page, arg4)
      expect(action).toBeTruthy()
      await page.keyboard.down('Control', page, arg4);
      await page.keyboard.press('a', page, arg4); // Press the 'a' key while holding Control to select all
      await page.keyboard.up('Control', page, arg4);
      await page.keyboard.press('Backspace', page, arg4);
      action = await performAction("type", tenantAdmin.input.editMobileNo, page, arg4)
      expect(action).toBeTruthy()
      await delay(2000)
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    and('Change The Building  and Company Name', async () => {
      reporter.startStep(`And Change The Building  and Company Name`);
      await performAction('click', tenantAdmin.label.modifyCompanySelectDrop)
      await delay(2000)
      await Promise.all([
        performAction("click", tenantAdmin.button.changeBuilding),
        waitForNetworkIdle(90000)
      ])
      await delay(6000)
      try {
        performAction("click", tenantAdmin.button.companySelect),
          await delay(4000)
        await performAction("click", tenantAdmin.button.clickcompanyBm);
        await delay(4000);

      } catch {
        performAction("click", tenantAdmin.button.companySelect),
          await delay(4000)
        await performAction("click", tenantAdmin.button.clickcompanyBm);
        await delay(4000);
      }
      let ss1 = await customScreenshot('building.png')
      reporter.addAttachment("building", ss1, "image/png");
      await delay(2000);
      await performAction("click", tenantAdmin.button.saveEdit);
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      await delay(4000)
      reporter.endStep();
    });

    and(/^Delete The New User "(.*)"$/, async (arg8) => {
      reporter.startStep(`And Delete The New User`);
      action = await performAction("type", tenantAdmin.input.searchUsers, page, arg8)
      expect(action).toBeTruthy()
      await delay(2000)
      action = await performAction("click", tenantAdmin.span.userDelete, page, arg8)
      expect(action).toBeTruthy()
      action = await performAction("click", tenantAdmin.button.deleteOk, page, arg8)
      expect(action).toBeTruthy()
      await delay(2000)
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      await delay(6000)
      action = await performAction("click", commons.li.logout, page, arg8)
      reporter.endStep();
    });
  });
});