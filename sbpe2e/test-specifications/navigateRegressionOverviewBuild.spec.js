import { assert } from 'console';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, delay, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab, envTab, verifyBuildPage, tenantAdmin, commons, VerifyOccupancySensors } from '../constants/locators';
import { environment_Sensor } from '../constants/environment_sensor';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding } from './shared-steps';
import exp from 'constants';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateRegressionOverviewBuild.feature',
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
    jest.setTimeout(3200000)
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
      await page.waitFor(5000);

      let config = await getEnvConfig()
      await har.start({ path: './reports/sbp' + global.testStart + '.har', saveResponse: true });
      logger.info("global.env = " + global.env)
      await goTo(config.sbpURL)
      await login(global.env, "BM")
      await customScreenshot('beforeAll.png')
    }
    catch (err) {
      logger.error(err);
    }
  })

  test('Navigate to Building and validate <Building> overview page', async ({
    given,
    when,
    then,
    and
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedIn(given)
    when(/^I select "(.*)"$/, async (building) => {
      reporter.startStep(`When I select ${building}`);
      logger.info(`When I select ${building}`)
      buildingName = building
      await delay(3000)
      await performAction('click', commons.button.selectBuilding)
      await delay(2000)
      await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
      await Promise.all([
        performAction('click', `//ul[@role='menu']//li[span='${building}']`),
        waitForNetworkIdle(120000) //2mins
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    then('Verify Occupancy Online Sensor and Offline Sensor', async () => {
      reporter.startStep(`Then Verify Occupancy Online Sensor and Offline Sensor`);
      let occupancySensor = await getEnvConfig()
      if (occupancySensor.Building[buildingName]['Online_Sensor'] == 'NA') {
        logger.error(`Occupancy Online Sensor is not available in ${buildingName}`)
        reporter.startStep(`Occupancy Online Sensor is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let onlinecount_occupancy = await getPropertyValueByXpath(verifyBuildPage.div.onlineSensors, "textContent")
        let occupancyOnlineSplit = onlinecount_occupancy.split(" ");
        let onlinecount = occupancyOnlineSplit[0]
        reporter.startStep(`Expected online sensor count is - ${occupancySensor.Building[buildingName].Online_Sensor_OverView} and Actual count is - ${onlinecount}`);
        if (onlinecount === occupancySensor.Building[buildingName].Online_Sensor_OverView) {
          logger.info(`Expected online sensor count is - ${occupancySensor.Building[buildingName].Online_Sensor_OverView} and Actual count is - ${onlinecount}`)
          expect(occupancySensor.Building[buildingName].Online_Sensor_OverView).toBe(onlinecount);
        } else {
          logger.error(`Expected online sensor count is - ${occupancySensor.Building[buildingName].Online_Sensor_OverView} and Actual count is ${onlinecount}`);
          expect(true).toBe(false);
        }
        reporter.endStep();
      }
      if (occupancySensor.Building[buildingName]['Offline_Sensor'] == 'NA') {
        logger.error(`Occupancy Offline Sensor is not available in ${buildingName}`)
        reporter.startStep(`Occupancy Offline Sensor is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let offlinecount_Occupancy = await getPropertyValueByXpath(verifyBuildPage.div.offlineSensors, "textContent")
        let occupancyOfflinesplit = offlinecount_Occupancy.split(" ");
        let offlinecount = occupancyOfflinesplit[0]
        reporter.startStep(`Expected Offline Sensor count is - ${occupancySensor.Building[buildingName].Offline_Sensor_OverView} and Actual Count is - ${offlinecount}`);
        if (offlinecount === occupancySensor.Building[buildingName].Offline_Sensor_OverView) {
          logger.info(`Expected Offline Sensor count is - ${occupancySensor.Building[buildingName].Offline_Sensor_OverView} and Actual Count is - ${offlinecount}`)
          expect(occupancySensor.Building[buildingName].Offline_Sensor_OverView).toBe(offlinecount);
        } else {
          logger.error(`Expected Offline Sensor count is ${occupancySensor.Building[buildingName].Offline_Sensor_OverView} and Actual count is ${offlinecount}`);
          expect(true).toBe(false)
        }
        let ss = await customScreenshot('building.png')
        reporter.addAttachment("building", ss, "image/png");
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify Environment Active device and Inactive device', async () => {
      reporter.startStep(`And Verify Environment Active device and Inactive device`);
      let occupancySensor = await getEnvConfig()
      if (occupancySensor.Building[buildingName]['Active_device'] == 'NA') {
        logger.error(`Environment Active Devices is not available in ${buildingName}`)
        reporter.startStep(`Environment Active Devices is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let onlinedevicecount_Energy = await getPropertyValueByXpath(verifyBuildPage.div.onlineDevice, "textContent")
        let energyOnlineSplit = onlinedevicecount_Energy.split(" ");
        let onlinedevicecount = energyOnlineSplit[0]
        let environmentDevice = await getEnvConfig()
        let active_device = environmentDevice.Building[buildingName].Active_device
        reporter.startStep(`Expected Environment Active Device count difference is ± within expect range - ${active_device} and Actual Device Count is - ${onlinedevicecount}`);
        if (Math.abs(active_device - onlinedevicecount) <= 1 && Math.abs(active_device - onlinedevicecount) <= 2) {
          logger.info(`Expected Environment Active Device count difference is ± within expect range - ${active_device} and Actual Device Count is - ${onlinedevicecount}`)
          expect(Math.abs(active_device - onlinedevicecount) <= 1 && Math.abs(active_device - onlinedevicecount) <= 2).toBeTruthy();
        } else {
          logger.error(`Expected Environment Active Device count difference is ± within expect range - ${active_device} and Actual Device Count is - ${onlinedevicecount}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      // reporter.endStep();
      if (occupancySensor.Building[buildingName]['Inactive_device'] == 'NA') {
        logger.error(`Environment Inactive Devices is not available in ${buildingName}`)
        reporter.startStep(`Environment Inactive Devices is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let offlinedevicecount_Energy = await getPropertyValueByXpath(verifyBuildPage.div.offlineDevice, "textContent")
        let energyOfflinexsplit = offlinedevicecount_Energy.split(" ");
        let offlinedevicecount = energyOfflinexsplit[0]
        let environmentDevice = await getEnvConfig()
        let inactive_device = environmentDevice.Building[buildingName].Inactive_device
        reporter.startStep(`Expected Environment Inactive Devices  Count difference is ± within expect range - ${inactive_device} and Actual Devices Count is - ${offlinedevicecount}`);
        if (Math.abs(inactive_device - offlinedevicecount) <= 1 && Math.abs(inactive_device - offlinedevicecount) <= 2) {
          logger.info(`Expected Environment Inactive Devices  Count difference is ± within expect range - ${inactive_device} and Actual Devices Count is - ${offlinedevicecount}`)
          expect(Math.abs(inactive_device - offlinedevicecount) <= 1 && Math.abs(inactive_device - offlinedevicecount) <= 2).toBeTruthy();
        } else {
          logger.error(`Expected Environment Inactive Devices count difference is ± within expect range - ${inactive_device} and Actual Devices is ${offlinedevicecount}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });
    /*
        and('Verify the user count Building Manager and Tenant Admin', async () => {
          reporter.startStep(`And Verify the user count Building Manager and Tenant Admin`);
          let buildmanagerx = await getPropertyValueByXpath(verifyBuildPage.div.buildManager, "textContent")
          let user = await getEnvConfig()
          reporter.startStep(`Expected Building Manager count is - ${user.Building[buildingName].Building_Manager} and Actual count is - ${buildmanagerx}`);
          if (buildmanagerx >= user.Building[buildingName].Building_Manager) {
            logger.info(`User Building Manager Count ${buildmanagerx}`)
            expect(buildmanagerx >= user.Building[buildingName].Building_Manager).toBeTruthy();
          } else {
            logger.error(`Expected Building Manager count is ${user.Building[buildingName].Building_Manager} and Actual count is ${buildmanagerx}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          let tenantadminx = await getPropertyValueByXpath(verifyBuildPage.div.buildAdmin, "textContent")
          reporter.startStep(`Expected Tenant Admin count is - ${user.Building[buildingName].Tenant_Admin} and Actual count is - ${tenantadminx}`);
          if (tenantadminx >= user.Building[buildingName].Tenant_Admin) {
            logger.info(`User Tenant Admin Count ${tenantadminx}`)
            expect(tenantadminx >= user.Building[buildingName].Tenant_Admin).toBeTruthy();
          } else {
            logger.error(`Expected Tenant Admin count is ${user.Building[buildingName].Tenant_Admin} and Actual count is ${tenantadminx}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          reporter.endStep();
        });
    */
    and('Verify Building Address', async () => {
      reporter.startStep(`And Verify Building Address`);
      let buildingaddress = await getPropertyValueByXpath(verifyBuildPage.div.buildAddress, "textContent")
      let address = await getEnvConfig()
      reporter.startStep(`Expected Building Address is - ${address.Building[buildingName].Address} and Actual Building Address is - ${buildingaddress}`);
      if (buildingaddress === address.Building[buildingName].Address) {
        logger.info(`Expected Building Address is - ${address.Building[buildingName].Address} and Actual Building Address is - ${buildingaddress}`)
        expect(address.Building[buildingName].Address).toBe(buildingaddress);
      } else {
        logger.error(`Expected Building Address is ${address.Building[buildingName].Address} and Actual Building Address is ${buildingaddress}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('validate Environment status Thermal and Air and Light and Sound', async () => {
      reporter.startStep(`And validate Environment status Thermal and Air and Light and Sound`);
      let configFile = await getEnvConfig()
      if ('ThermalStatus' in configFile.Building[buildingName] && configFile.Building[buildingName]['ThermalStatus'] == 'NA') {
        logger.error(`Thermal Quality sensor is not available in ${buildingName}`)
        reporter.startStep(`Thermal Quality sensor is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        reporter.startStep(`Verify The Environment Thermal Quality`);
        let thermalQauality = await getPropertyValueByXpath(verifyBuildPage.h6.thermalQuality, "textContent")
        const thermalQaualityList = ["Excellent", "Good", "Moderate", "Poor"]
        reporter.startStep(`Expected Thermal Quality Status ${thermalQaualityList} and Actual Status - ${thermalQauality}`);
        if ((thermalQauality === "Good") || (thermalQauality === "Excellent") || (thermalQauality === "Moderate") || (thermalQauality === "Poor")) {
          logger.info(`Expected Thermal Quality Status ${thermalQaualityList} and Actual Status - ${thermalQauality}`)
          expect(thermalQaualityList.includes(thermalQauality)).toBeTruthy()
        } else {
          logger.error(`Expected Thermal Quality Status ${thermalQaualityList} and Actual Status ${thermalQauality}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
        reporter.endStep();
      }

      if ('AirStatus' in configFile.Building[buildingName] && configFile.Building[buildingName]['AirStatus'] == 'NA') {
        logger.error(`Air Quality sensor is not available in ${buildingName}`)
        reporter.startStep(`Air Quality sensor is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        reporter.startStep(`Verify The Environment Air Quality`);
        let airQualityStatus = await getPropertyValueByXpath(verifyBuildPage.h6.airQauality, "textContent")
        const airQaualityList = ["Excellent", "Good", "Moderate", "Poor"]
        reporter.startStep(`Expected Environment Air Quality Status - ${airQaualityList} and Actual Status - ${airQualityStatus}`);
        if ((airQualityStatus === "Good") || (airQualityStatus === "Excellent") || (airQualityStatus === "Moderate") || (airQualityStatus === "Poor")) {
          logger.info(`Expected Environment Air Quality Status - ${airQaualityList} and Actual Status - ${airQualityStatus}`)
          expect(airQaualityList.includes(airQualityStatus)).toBeTruthy()
        } else {
          logger.error(`Expected Environment Air Quality Status - ${airQaualityList} and Actual Status - ${airQualityStatus}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
        reporter.endStep();
      }

      if ('LightStatus' in configFile.Building[buildingName] && configFile.Building[buildingName]['LightStatus'] == 'NA') {
        logger.error(`Light Quality sensor is not available in ${buildingName}`)
        reporter.startStep(`Light Quality sensor is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        reporter.startStep(`Verify The Environment Light Quality`);
        let lightQualityStatus = await getPropertyValueByXpath(verifyBuildPage.h6.lightQuality, "textContent")
        const lightQaualityList = ["Excellent", "Good", "Moderate", "Poor"]
        reporter.startStep(`Expected Environment Light Quality Status - ${lightQaualityList} and Actual Status - ${lightQualityStatus}`);
        if ((lightQualityStatus === "Good") || (lightQualityStatus === "Excellent") || (lightQualityStatus === "Moderate") || (lightQualityStatus === "Poor")) {
          logger.info(`Expected Environment Light Quality Status - ${lightQaualityList} and Actual Status - ${lightQualityStatus}`)
          expect(lightQaualityList.includes(lightQualityStatus)).toBeTruthy()
        } else {
          logger.error(`Expected Environment Light Quality Status - ${lightQaualityList} and Actual Status - ${lightQualityStatus}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
        reporter.endStep();
      }

      if ('SoundStatus' in configFile.Building[buildingName] && configFile.Building[buildingName]['SoundStatus'] == 'NA') {
        logger.error(`Sound Quality sensor is not available in ${buildingName}`)
        reporter.startStep(`Sound Quality sensor is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        reporter.startStep(`Verify The Environment Sound Quality`);
        let soundQualityStatus = await getPropertyValueByXpath(verifyBuildPage.h6.soundQuality, "textContent")
        reporter.startStep(`Expected Sound Quality Status - ${"N/A"} and Actual Status - ${soundQualityStatus}`);
        if (soundQualityStatus === "N/A") {
          logger.info(`Expected Sound Quality Status - ${"N/A"} and Actual Status - ${soundQualityStatus}`)
          expect("N/A").toBe(soundQualityStatus);
        } else {
          logger.error(`Expected Sound Quality Status ${"N/A"} and Actual Status ${soundQualityStatus}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
        reporter.endStep();
      }
      reporter.endStep();
    });
    /*
        and('Verify Floor details with Zone and devices', async () => {
          reporter.startStep(`And Verify Floor details with Zone and devices`);
          let fullname = await getPropertyValueByXpath(verifyBuildPage.div.areaLocate, "textContent")
          let name = fullname.split(" ");
          let floorcount = name[0]
          let zonecount = name[2]
          let devicecount = " " + name[4]
          let floor_zone = await getEnvConfig()
          reporter.startStep(`Expected Floor Count is ${floor_zone.Building[buildingName].Floor} and Actual Count - ${floorcount}`);
          if (floorcount === floor_zone.Building[buildingName].Floor) {
            logger.info(`Floor Count is ${floorcount}`)
            expect(floor_zone.Building[buildingName].Floor).toBe(floorcount);
          } else {
            logger.error(`Expected Floor Count is ${floor_zone.Building[buildingName].Floor} and Actual Count ${floorcount}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          reporter.startStep(`Expected Zone Count is ${floor_zone.Building[buildingName].Zone} and Actual Count - ${zonecount}`);
          if (zonecount === floor_zone.Building[buildingName].Zone) {
            logger.info(`Zone Count is ${zonecount}`)
            expect(floor_zone.Building[buildingName].Zone).toBe(zonecount);
          } else {
            logger.error(`Expected Zone Count is ${floor_zone.Building[buildingName].Zone} and Actual Count ${zonecount}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          reporter.startStep(`Expected Device Count is - ${floor_zone.Building[buildingName].Devices} and Actual Count - ${devicecount}`);
          if (devicecount === floor_zone.Building[buildingName].Devices) {
            logger.info(`Device Count is ${devicecount}`)
            expect(floor_zone.Building[buildingName].Devices).toBe(devicecount);
          } else {
            logger.error(`Expected Device Count is ${floor_zone.Building[buildingName].Devices} and Actual Count ${devicecount}`);
            expect(true).toBe(false)
          }
          reporter.endStep();
          reporter.endStep();
        });
        */
  });

  test('Navigate to Building and validate <Building> Environment page', async ({
    given,
    when,
    and,
    then
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedIn(given)
    when(/^I select "(.*)"$/, async (building) => {
      reporter.startStep(`When I select ${building}`);
      logger.info(`When I select ${building}`)
      buildingName = building
      await performAction('click', commons.button.selectBuilding)
      await delay(2000)
      await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
      await Promise.all([
        performAction('click', `//ul[@role='menu']//li[span='${building}']`),
        waitForNetworkIdle(120000) //2mins
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    then('Verify Building Overview Page Last updated time difference from current time shouldnt be more that 15 mins', async () => {
      reporter.startStep("Then Verify Building Overview Page Last updated time difference from current time shouldnt be more that 15 mins");
      let configFile = await getEnvConfig()
      if ('Last_updated_time' in configFile.Building[buildingName] && configFile.Building[buildingName]['Last_updated_time'] == 'NA') {
        logger.error(`Last updated time not available in ${buildingName}`)
        reporter.startStep(`Last updated time not available in ${buildingName}`);
        reporter.endStep();
      } else {
        await Promise.all([
          performAction("click", buildingOverview.a.overviewTab),
          waitForNetworkIdle(120000)
        ])
        let last_Update = await getPropertyValueByXpath(verifyBuildPage.span.appTime, "textContent")
        let ss = await customScreenshot('building.png')
        reporter.addAttachment("building", ss, "image/png");
        await delay(2000)
        const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
        let datesplit = date.split(",");
        let splitvalueDate = datesplit[0]
        let last__Update_Time_OverView = splitvalueDate + "," + last_Update

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
      }
      reporter.endStep();
    });

    and('Verify The Environment status', async () => {
      reporter.startStep("And Verify The Environment status");
      let configFile = await getEnvConfig()
      if ('Environment_Status' in configFile.Building[buildingName] && configFile.Building[buildingName]['Environment_Status'] == 'NA') {
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
        let allSensors = await getElementHandleByXpath(verifyBuildPage.div.environmentAllSensors)
        let enviromentSensor_Count = await getEnvConfig()
        expect(enviromentSensor_Count.environmentSensor['All sensors count'].count).toBe(allSensors.length);
        reporter.startStep(`Verify all sensor Expexted count is - 11 and Actual count is - ${allSensors.length}`);
        reporter.endStep();
        for (let i = 0; i < allSensors.length; i++) {
          let title = await allSensors[i].$x(verifyBuildPage.h6.environmentSensorTitle)
          let titleValue = await getPropertyValue(title[0], "textContent")
          reporter.startStep(`Verify the ${titleValue} status`);
          let sensorCount = await allSensors[i].$x(verifyBuildPage.h6.environmentSensorCount)
          let sensorCountValue = await getPropertyValue(sensorCount[0], "textContent")
          let allsensor_Split = sensorCountValue.split(" ");
          let all_Sensor_Value = allsensor_Split[0]
          let all_Sensor_Unit_Value = allsensor_Split[1]
          let environment_Arrow = await allSensors[i].$x(verifyBuildPage.span.allEnvironment_ArrowRight)
          expect(environment_Arrow.length).toBe(1)
          reporter.startStep(`Verify the ${titleValue} environment sensors right arrow - ${environment_Arrow.length}`);
          reporter.endStep();

          let expectedBand;
          for (let item = 0; item < environment_Sensor[titleValue]['bands'].length; item++) {
            if ('max' in environment_Sensor[titleValue]['bands'][item]) {
              if (parseFloat(all_Sensor_Value) >= parseFloat(environment_Sensor[titleValue]['bands'][item]['min']) && parseFloat(all_Sensor_Value) < environment_Sensor[titleValue]['bands'][item]['max']) {
                expectedBand = environment_Sensor[titleValue]['bands'][item]['band']
                break;
              }
            } else {
              if (parseFloat(all_Sensor_Value) >= parseFloat(environment_Sensor[titleValue]['bands'][item]['min'])) {
                expectedBand = environment_Sensor[titleValue]['bands'][item]['band']
                break;
              }
            }
          }
          let environment_Status = await allSensors[i].$x(verifyBuildPage.div.allEnironmentStatus)
          let all_Environment_Status = await getPropertyValue(environment_Status[0], "textContent")
          reporter.startStep(`The ${titleValue} Environment status is - ${all_Environment_Status}`);
          expect(expectedBand).toBe(all_Environment_Status)
          reporter.endStep();
          reporter.startStep(`The ${titleValue} Environment Unit value is - ${all_Sensor_Unit_Value}`);
          let unit_Value = environment_Sensor[titleValue]['unit']
          expect(unit_Value).toBe(all_Sensor_Unit_Value)
          reporter.endStep();
          reporter.endStep();
        }
      }
      reporter.endStep();
    });
  });

  test('Navigate to Building and validate <Building> Occupancy page', async ({
    given,
    when,
    then,
    and
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedIn(given)
    when(/^I select "(.*)"$/, async (building) => {
      reporter.startStep(`When I select ${building}`);
      logger.info(`When I select ${building}`)
      buildingName = building
      await performAction('click', commons.button.selectBuilding)
      await delay(2000)
      await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
      await Promise.all([
        performAction('click', `//ul[@role='menu']//li[span='${building}']`),
        waitForNetworkIdle(120000) //2mins
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    then('Verify Lobby activity Last updated time', async () => {
      reporter.startStep("And Verify Lobby activity Last updated time");
      let configFile = await getEnvConfig()
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      if ('Occupancy_Page' in configFile.Building[buildingName] && configFile.Building[buildingName]['Occupancy_Page'] == 'NA') {
        logger.error(`The Lobby activity Last updated time not available in ${buildingName}`)
        reporter.startStep(`Lobby activity Last updated time not available in ${buildingName}`);
        reporter.endStep();
      } else {
        await Promise.all([
          performAction("click", buildingOverview.a.occupancyTab),
          waitForNetworkIdle(120000)
        ])
        let Last_updatedTime = await getPropertyValueByXpath(verifyBuildPage.div.lobbyTime, "textContent")
        let splitlobby = Last_updatedTime.split(":");
        let last_hours = splitlobby[1]
        let last_Update1 = splitlobby[2]
        let last_Update = last_hours + ":" + last_Update1
        let ss = await customScreenshot('building.png')
        reporter.addAttachment("building", ss, "image/png");
        await delay(2000)
        const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
        let datesplit = date.split(",");
        let splitvalueDate = datesplit[0]
        let last__Update_Time_OverView = splitvalueDate + "," + last_Update
    
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
      }
      reporter.endStep();
    });

    and('Navigate to Occupancy Sensor page and verify Online Sensor and Offline sensor count', async () => {
      reporter.startStep(`And Navigate to Occupancy Sensor page and verify Online Sensor and Offline sensor count`);
      let configFile = await getEnvConfig()
      if ('Occupancy_Page' in configFile.Building[buildingName] && configFile.Building[buildingName]['Occupancy_Page'] == 'NA') {
        logger.error(`The Occupancy Sensor not available in ${buildingName}`)
        reporter.startStep(`The Occupancy Sensor not available in ${buildingName}`);
        reporter.endStep();
      } else {
        await Promise.all([
          performAction("click", occupancySensorsTab.div.sensorsTab),
          waitForNetworkIdle(120000)
        ])
        let occupancyonline = await getPropertyValueByXpath(verifyBuildPage.h5.onlineSensor, "textContent")
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        let splitoccupancyonline = occupancyonline.split(" ");
        let splitoccpancyon = splitoccupancyonline[0]

        reporter.startStep(`Expected Occupancy online sensor count is - ${configFile.Building[buildingName].Online_Sensor} and Actual count is - ${splitoccpancyon}`);
        if (splitoccpancyon === configFile.Building[buildingName].Online_Sensor) {
          logger.info(`Expected Occupancy online sensor count is - ${configFile.Building[buildingName].Online_Sensor} and Actual count is - ${splitoccpancyon}`)
          expect(configFile.Building[buildingName].Online_Sensor).toBe(splitoccpancyon);
        } else {
          logger.error(`Expected Occupancy online sensor count is ${configFile.Building[buildingName].Online_Sensor} and Actual count is ${splitoccpancyon}`);
          expect(true).toBe(false)
        }
        reporter.endStep();

        //here verify the Occupancy sensor -->and verify The Offline Occupancy Count
        let occupancyoffline = await getPropertyValueByXpath(verifyBuildPage.h5.offlineSensor, "textContent")
        let splitoccupancyoffline = occupancyoffline.split(" ");
        let splitoccpancyoff = splitoccupancyoffline[1]
        if (splitoccpancyoff === configFile.Building[buildingName].Occ_Offline_Sensor) {
          logger.info(`Expected Occupancy Offline Sensor count is ${configFile.Building[buildingName].Occ_Offline_Sensor} and Actual count is ${splitoccpancyoff}`)
          reporter.startStep(`Expected Occupancy Offline Sensor count is ${configFile.Building[buildingName].Occ_Offline_Sensor} and Actual count is ${splitoccpancyoff}`);
          reporter.endStep()
        } else {

          reporter.startStep(`Expected Occupancy Offline Sensor count is ${configFile.Building[buildingName].Offline_Sensor} and Actual count is ${splitoccpancyoff}`);
          if (splitoccpancyoff === configFile.Building[buildingName].Offline_Sensor) {
            logger.info(`Expected Occupancy Offline Sensor count is ${configFile.Building[buildingName].Offline_Sensor} and Actual count is ${splitoccpancyoff}`)
            expect(configFile.Building[buildingName].Offline_Sensor).toBe(splitoccpancyoff);
          } else {
            logger.error(`Expected Occupancy Offline Sensor count is - ${configFile.Building[buildingName].Offline_Sensor} and Actual count is - ${splitoccpancyoff}`);
            expect(true).toBe(false)
          }
          await Promise.all([
            performAction("click", buildingOverview.a.overviewTab),
            waitForNetworkIdle(120000)
          ])
          reporter.endStep()
        }
      }
      reporter.endStep();
    });
  });

  test('Navigate to Building and validate <Building> Visit Frequency in Overview Page', async ({
    given,
    when,
    then,
    and
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedIn(given)
    when(/^I select "(.*)"$/, async (building) => {
      reporter.startStep(`When I select ${building}`);
      logger.info(`When I select ${building}`)
      buildingName = building
      await performAction('click', commons.button.selectBuilding)
      await delay(2000)
      await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
      await Promise.all([
        performAction('click', `//ul[@role='menu']//li[span='${building}']`),
        waitForNetworkIdle(120000) //2mins
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    then('Verify The Visit Frequency last Update Time', async () => {
      reporter.startStep("Then Verify The Visit Frequency last Update Time");
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['last_Update_Time'] == 'NA') {
        logger.error(`Visit Frequency last Update Time is not available in ${buildingName}`)
        reporter.startStep(`Visit Frequency last Update Time is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        // let configFile = await getEnvConfig()
        // if ('Last_updated_time' in configFile.Building[buildingName] && configFile.Building[buildingName]['Last_updated_time'] == 'NA') {
        //   logger.error(`Last updated time not available in ${buildingName}`)
        //   reporter.startStep(`Last updated time not available in ${buildingName}`);
        //   reporter.endStep();
        // } else {
        await Promise.all([
          performAction("click", buildingOverview.a.overviewTab),
          waitForNetworkIdle(120000)
        ])
        let Last_updatedTime = await getPropertyValueByXpath(verifyBuildPage.h4.vistFrequencyLastTime, "textContent")
        let Last_updatedTimeSplit = Last_updatedTime.split(": ");
        let last_Update = Last_updatedTimeSplit[1]
        let ss = await customScreenshot('building.png')
        reporter.addAttachment("building", ss, "image/png");
        await delay(2000)
        const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
        let datesplit = date.split(",");
        let splitvalueDate = datesplit[0]
        let last__Update_Time_OverView = splitvalueDate + "," + last_Update

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
          // console.log(strTimeEST)
          // console.log(last__Update_Time_OverView)
          // expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and(/^Verify The Title "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep("And Verify The Title");
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['page_Title1'] == 'NA') {
        logger.error(`Visit Frequency Title is not available in ${buildingName}`)
        reporter.startStep(`Visit Frequency Title is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let page_Title1_visit = await getPropertyValueByXpath(verifyBuildPage.h4.visitFrequencyTitle, "textContent")
        let conFig = await getEnvConfig()
        reporter.startStep(`Expected Title  - ${conFig.Building[buildingName].page_Title1} and Actual Title - ${page_Title1_visit}`);
        if (page_Title1_visit === conFig.Building[buildingName].page_Title1) {
          logger.info(`Expected Title  - ${conFig.Building[buildingName].page_Title1} and Actual Title - ${page_Title1_visit}`)
          expect(conFig.Building[buildingName].page_Title1).toBe(page_Title1_visit);
        } else {
          logger.error(`Expected The Title  - ${conFig.Building[buildingName].page_Title1} and Actual Title - ${page_Title1_visit}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify The Total Unique Users Title in visit frequency', async () => {
      reporter.startStep(`And Verify The Total Unique Users Title in visit frequency`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['unique_Users'] == 'NA') {
        logger.error(`Visit Frequency Total Unique Users Title is not available in ${buildingName}`)
        reporter.startStep(`Visit Frequency Total Unique Users Title is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let Total_Unique_Users = await getPropertyValueByXpath(verifyBuildPage.div.total_Unique_Users, "textContent")
        let conFig = await getEnvConfig()
        reporter.startStep(`Expected The Total Unique Users Title - ${conFig.Building[buildingName].unique_Users} and Actual Title - ${Total_Unique_Users}`);
        if (Total_Unique_Users === conFig.Building[buildingName].unique_Users) {
          logger.info(`Expected The Total Unique Users Title - ${conFig.Building[buildingName].unique_Users} and Actual Title - ${Total_Unique_Users}`)
          expect(conFig.Building[buildingName].unique_Users).toBe(Total_Unique_Users);
        } else {
          logger.error(`Expected The Total Unique Users Title - ${conFig.Building[buildingName].unique_Users} and Actual Title- ${Total_Unique_Users}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify The Total Unique Users Count', async () => {
      reporter.startStep(`And Verify The Total Unique Users Count`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['Unique_Users_Count'] == 'NA') {
        logger.error(`Visit Frequency The Total Unique Users Count is not available in ${buildingName}`)
        reporter.startStep(`Visit Frequency The Total Unique Users Count is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let totalUsers_Count = await getPropertyValueByXpath(verifyBuildPage.div.total_users_Count, "textContent")
        reporter.startStep(`Expected The Total Unique Users Count - Non Zero and Actual count is - ${totalUsers_Count}`);
        reporter.endStep();
        if (totalUsers_Count > 0) {
          logger.info(`Expected The Total Unique Users Count - Non Zero and Actual count is - ${totalUsers_Count}`)
          expect(totalUsers_Count > 0).toBeTruthy();
        } else {
          logger.error(`Expected The Total Unique Users Count - Non Zero and Actual count is - ${totalUsers_Count}`);
          expect(true).toBe(false);
        }
      }
      reporter.endStep();

    });

    and('Verify The Total Swips Title in visit frequency', async () => {
      reporter.startStep(`And Verify The Total Swips Title in visit frequency`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['totalSwips'] == 'NA') {
        logger.error(`The Total Swips Title is not available in ${buildingName}`)
        reporter.startStep(`The Total Swips Title is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let totalSwipsText = await getPropertyValueByXpath(verifyBuildPage.div.totalSwipsx, "textContent")
        let conFig = await getEnvConfig()
        reporter.startStep(`Expected Title - ${conFig.Building[buildingName].totalSwips} and Actual Title- ${totalSwipsText}`);
        if (totalSwipsText === conFig.Building[buildingName].totalSwips) {
          logger.info(`Expected Title - ${conFig.Building[buildingName].totalSwips} and Actual Title- ${totalSwipsText}`)
          expect(conFig.Building[buildingName].totalSwips).toBe(totalSwipsText);
        } else {
          logger.error(`Expected  Title - ${conFig.Building[buildingName].totalSwips} and Actual Title- ${totalSwipsText}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify The Total Swips Count', async () => {
      reporter.startStep(`And Verify The Total Swips Count`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['Total_Swips_Count'] == 'NA') {
        logger.error(`Total Swips Count is not available in ${buildingName}`)
        reporter.startStep(`Total Swips Count is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let totalSwips_Count = await getPropertyValueByXpath(verifyBuildPage.div.totalSwipsCount, "textContent")
        reporter.startStep(`Expected The Total Swips Count - Non Zero and Actual count is - ${totalSwips_Count}`);
        reporter.endStep();
        if (totalSwips_Count > 0) {
          logger.info(`Expected The Total Swips Count - Non Zero and Actual count is - ${totalSwips_Count}`)
          expect(totalSwips_Count > 0).toBeTruthy();
        } else {
          logger.error(`Expected The Total Swips Count - Non Zero and Actual count is - ${totalSwips_Count}`);
          expect(true).toBe(false);
        }
      }
      reporter.endStep();
    });

    //And Verify Total swipes into building and tenant spaces   //swips_Buildandspace
    and('Verify Total swipes Text into building and tenant spaces', async () => {
      reporter.startStep(`And Total swipes Text into building and tenant spaces`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['swips_Buildandspace'] == 'NA') {
        logger.error(`Total swipes Text into building and tenant spaces is not available in ${buildingName}`)
        reporter.startStep(`Total swipes Text into building and tenant spaces is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let buildandSpace_Text = await getPropertyValueByXpath(verifyBuildPage.div.buildandSpace, "textContent")
        let conFig = await getEnvConfig()
        reporter.startStep(`Expected Text - ${conFig.Building[buildingName].swips_Buildandspace} and Actual Text- ${buildandSpace_Text}`);
        if (buildandSpace_Text === conFig.Building[buildingName].swips_Buildandspace) {
          logger.info(`Expected Text - ${conFig.Building[buildingName].swips_Buildandspace} and Actual Text- ${buildandSpace_Text}`)
          expect(conFig.Building[buildingName].swips_Buildandspace).toBe(buildandSpace_Text);
        } else {
          logger.error(`Expected  Text - ${conFig.Building[buildingName].swips_Buildandspace} and Actual Text- ${buildandSpace_Text}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify Installed Visit Frequency Devices Title', async () => {
      reporter.startStep(`And Verify Installed Visit Frequency Devices Title`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['installvisitfrquencyText'] == 'NA') {
        logger.error(`Installed Visit Frequency Devices Title is not available in ${buildingName}`)
        reporter.startStep(`Installed Visit Frequency Devices Title is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let installvisitFrequence_Text = await getPropertyValueByXpath(verifyBuildPage.h4.installvisitFrequenceText, "textContent")
        let conFig = await getEnvConfig()
        reporter.startStep(`Expected Title - ${conFig.Building[buildingName].installvisitfrquencyText} and Actual Title- ${installvisitFrequence_Text}`);
        if (installvisitFrequence_Text === conFig.Building[buildingName].installvisitfrquencyText) {
          logger.info(`Expected Title - ${conFig.Building[buildingName].installvisitfrquencyText} and Actual Title- ${installvisitFrequence_Text}`)
          expect(conFig.Building[buildingName].installvisitfrquencyText).toBe(installvisitFrequence_Text);
        } else {
          logger.error(`Expected  Title - ${conFig.Building[buildingName].installvisitfrquencyText} and Actual Title- ${installvisitFrequence_Text}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });
    //And Verify Installed Visit Frequency Devices Count
    and('Verify Installed Visit Frequency Devices Count', async () => {
      reporter.startStep(`And Verify Installed Visit Frequency Devices Count`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['Visit_Frequency_Devices_Count'] == 'NA') {
        logger.error(`Installed Visit Frequency Devices Count is not available in ${buildingName}`)
        reporter.startStep(`Installed Visit Frequency Devices Count is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let installVisit_Count = await getPropertyValueByXpath(verifyBuildPage.h4.installVisitCount, "textContent")
        reporter.startStep(`Expected The Installed Visit Frequency Devices Count - Non Zero and Actual count is - ${installVisit_Count}`);
        reporter.endStep();
        if (installVisit_Count > 0) {
          logger.info(`Expected The Installed Visit Frequency Devices Count - Non Zero and Actual count is - ${installVisit_Count}`)
          expect(installVisit_Count > 0).toBeTruthy();
        } else {
          logger.error(`Expected The Installed Visit Frequency Devices Count - Non Zero and Actual count is - ${installVisit_Count}`);
          expect(true).toBe(false);
        }
      }
      reporter.endStep();
    });
  });

  test('Navigate to Building and validate <Building> Occupancy in Overview Page', async ({
    given,
    when,
    then,
    and
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedIn(given)
    when(/^I select "(.*)"$/, async (building) => {
      reporter.startStep(`When I select ${building}`);
      logger.info(`When I select ${building}`)
      buildingName = building
      await performAction('click', commons.button.selectBuilding)
      await delay(2000)
      await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
      await Promise.all([
        performAction('click', `//ul[@role='menu']//li[span='${building}']`),
        waitForNetworkIdle(120000) //2mins
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    //Then Verify The Building Occupancy last Update Time
    then('Verify The Building Occupancy last Update Time', async () => {
      reporter.startStep("Then Verify The Building Occupancy last Update Time");
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['Build_Occ_last_Update_Time'] == 'NA') {
        logger.error(`Building Occupancy last Update Time is not available in ${buildingName}`)
        reporter.startStep(`Building Occupancy last Update Time is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        // let configFile = await getEnvConfig()
        // if ('Last_updated_time' in configFile.Building[buildingName] && configFile.Building[buildingName]['Last_updated_time'] == 'NA') {
        //   logger.error(`Last updated time not available in ${buildingName}`)
        //   reporter.startStep(`Last updated time not available in ${buildingName}`);
        //   reporter.endStep();
        // } else {
        await Promise.all([
          performAction("click", buildingOverview.a.overviewTab),
          waitForNetworkIdle(120000)
        ])
        let Last_updatedTime = await getPropertyValueByXpath(verifyBuildPage.h4.buildingOccupancyLastTime, "textContent")
        let Last_updatedTimeSplit = Last_updatedTime.split(": ");
        let last_Update = Last_updatedTimeSplit[1]
        let ss = await customScreenshot('building.png')
        reporter.addAttachment("building", ss, "image/png");
        await delay(2000)
        const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
        let datesplit = date.split(",");
        let splitvalueDate = datesplit[0]
        let last__Update_Time_OverView = splitvalueDate + ", " + last_Update

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
        // }
      }
      reporter.endStep();
    });

    and(/^Verify The Building Occupancy Title "(.*)"$/, async (building) => {
      buildingName = building
      reporter.startStep("And Verify The Building Occupancy Title");
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['building_Occ_Title'] == 'NA') {
        logger.error(`The Building Occupancy Title is not available in ${buildingName}`)
        reporter.startStep(`The Building Occupancy Title is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let buildingOccupancy_Title = await getPropertyValueByXpath(verifyBuildPage.h4.buildingOccupancyTitle, "textContent")
        let conFig = await getEnvConfig()
        reporter.startStep(`Expected Title  - ${conFig.Building[buildingName].building_Occ_Title} and Actual Title - ${buildingOccupancy_Title}`);
        if (buildingOccupancy_Title === conFig.Building[buildingName].building_Occ_Title) {
          logger.info(`Expected Title  - ${conFig.Building[buildingName].building_Occ_Title} and Actual Title - ${buildingOccupancy_Title}`)
          expect(conFig.Building[buildingName].building_Occ_Title).toBe(buildingOccupancy_Title);
        } else {
          logger.error(`Expected The Title  - ${conFig.Building[buildingName].building_Occ_Title} and Actual Title - ${buildingOccupancy_Title}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify The Real Time Occupancy Percentage', async () => {
      reporter.startStep(`And Verify The Real Time Occupancy Percentage`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['real_Time_Occ_percent'] == 'NA') {
        logger.error(`The Real Time Occupancy Percentage is not available in ${buildingName}`)
        reporter.startStep(`The Real Time Occupancy Percentage is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
        date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
        hours = parseInt(date.split(' ')[1].split(':')[0])
        if (day != 'Sat' && day != 'Sun') {
          if ((hours >= 7 && hours <= 18)) {
            logger.info("In Busy time")
            let realTimeOccCount = await getPropertyValueByXpath(verifyBuildPage.div.realTimeOcc_Count, "textContent")
            reporter.startStep(`Expected The Real Time Occupancy Percentage - Non Zero and Actual Percentage is - ${realTimeOccCount}`);
            reporter.endStep();
            if (realTimeOccCount > 0 + "%") {
              logger.info(`Expected The Real Time Occupancy Percentage - Non Zero and Actual Percentage is - ${realTimeOccCount}`)
              expect(realTimeOccCount > 0 + "%").toBeTruthy();
            } else {
              logger.error(`Expected The Real Time Occupancy Percentage - Non Zero and Actual Percentage is - ${realTimeOccCount}`);
              expect(true).toBe(false);
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
      }
      reporter.endStep();
    });

    and('Verify peak Occupancy Percentage', async () => {
      reporter.startStep(`And Verify peak Occupancy Percentage`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['peak_Occ_percent'] == 'NA') {
        logger.error(`The peak Occupancy Percentage is not available in ${buildingName}`)
        reporter.startStep(`The peak Occupancy Percentage is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let buildOCCPeakOcc = await getPropertyValueByXpath(verifyBuildPage.div.buildOCC_PeakOcc, "textContent")
        reporter.startStep(`Expected The peak occupancy over last 90 days Non Zero and Actual Status - ${buildOCCPeakOcc}`);
        if (buildOCCPeakOcc > 0 + "%") {
          logger.info(`Expected The peak occupancy over last 90 days Non Zero and Actual Status - ${buildOCCPeakOcc}`)
          expect(buildOCCPeakOcc > 0 + "%").toBeTruthy();
        } else {
          logger.error(`Expected The peak occupancy over last 90 days Non Zero and Actual Status - ${buildOCCPeakOcc}`);
          expect(true).toBe(false);
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify 90 Day Peak Unique Users', async () => {
      reporter.startStep(`And Verify 90 Day Peak Unique Users`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['days_PeakUnique_User'] == 'NA') {
        logger.error(`90 Day Peak Unique Users is not available in ${buildingName}`)
        reporter.startStep(`90 Day Peak Unique Users is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let PeakUsers = await getPropertyValueByXpath(verifyBuildPage.div.peakOccTodaydate, "textContent")
        let PeakUserssplit = PeakUsers.split(" ");
        let Peak_Users = PeakUserssplit[2]
        var currentDate = new Date();
        var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var splitvalueDate = daysOfWeek[currentDate.getDay()];
        reporter.startStep(`Expected 90 Day Peak Unique Users - ${splitvalueDate} Actual 90 Day Peak Unique Users - ${Peak_Users}`);
        reporter.endStep();
        if (splitvalueDate === Peak_Users) {
          logger.info(`Expected 90 Day Peak Unique Users - ${splitvalueDate} Actual 90 Day Peak Unique Users - ${Peak_Users}`)
          expect(splitvalueDate).toBe(Peak_Users);
        } else {
          logger.error(`Expected 90 Day Peak Unique Users - ${splitvalueDate} Actual 90 Day Peak Unique Users - ${Peak_Users}`);
          expect(true).toBe(false)
        }
      }
      reporter.endStep();
    });

    and('Verify The Real Time Occupancy and 90 days Peak Occupancy in OverView page', async () => {
      reporter.startStep(`And Verify The Real Time Occupancy and 90 days Peak Occupancy in OverView page`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['realandPeak_count'] == 'NA') {
        logger.error(`Real Time Occupancy and 90 days Peak Occupancy count is not available in ${buildingName}`)
        reporter.startStep(`The Real Time Occupancy and 90 days Peak Occupancy count is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
        date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
        hours = parseInt(date.split(' ')[1].split(':')[0])
        if (day != 'Sat' && day != 'Sun') {
          if ((hours >= 7 && hours <= 18)) {
            logger.info("In Busy time")
            let occRealTimeOcc_Counts = await getPropertyValueByXpath(verifyBuildPage.div.real_TimeOcc_count, "textContent")
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

            let occ90DaysPeak_Counts = await getPropertyValueByXpath(verifyBuildPage.div.peak_TimeOcc_count, "textContent")
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
      }
      reporter.endStep();
    });

    and(/^Verify Total Real Time Occupancy and 90 Days Peak Occupancy "(.*)"$/, async (building) => {
      reporter.startStep(`And Verify Total Real Time Occupancy and 90 Days Peak Occupancy`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['total_Real_Peak'] == 'NA') {
        logger.error(`Total Real Time Occupancy and 90 Days Peak Occupancy count is not available in ${buildingName}`)
        reporter.startStep(`Total Real Time Occupancy and 90 Days Peak Occupancy count is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        buildingName = building
        let total_RealTimeOcc_Counts = await getPropertyValueByXpath(verifyBuildPage.div.real_TimeOcc_count, "textContent")
        let total_RealTimeOcc_CountsSplit = total_RealTimeOcc_Counts.split(" ");
        let total_RealTimeOcc_CountVal = total_RealTimeOcc_CountsSplit[2]
        const total_RealTimeOcc_Count = total_RealTimeOcc_CountVal.trim();
        let conFig = await getEnvConfig()
        reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_RealTimeOcc_Count}`);
        if (total_RealTimeOcc_Count === conFig.Building[buildingName].total_People) {
          logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_RealTimeOcc_Count}`)
          expect(conFig.Building[buildingName].total_People).toBe(total_RealTimeOcc_Count);
        } else {
          logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_RealTimeOcc_Count}`);
          expect(true).toBe(false)
        }
        reporter.endStep();

        //here Verify total 90 Days Peak Occupancy
        let occ90DaysPeak_Counts = await getPropertyValueByXpath(verifyBuildPage.div.peak_TimeOcc_count, "textContent")
        let occ90DaysPeak_CountsSplit = occ90DaysPeak_Counts.split(" ");
        let occ90DaysPeak_Count = occ90DaysPeak_CountsSplit[2]
        reporter.startStep(`Expected The Total 90 Days Peak Occupancy - ${conFig.Building[buildingName].total_People} and Actual  Count - ${occ90DaysPeak_Count}`);
        if (occ90DaysPeak_Count === conFig.Building[buildingName].total_People) {
          logger.info(`Expected The Total 90 Days Peak Occupancy- ${conFig.Building[buildingName].total_People} and Actual  Count - ${occ90DaysPeak_Count}`)
          expect(conFig.Building[buildingName].total_People).toBe(occ90DaysPeak_Count);
        } else {
          logger.error(`Expected The Total 90 Days Peak Occupancy - ${conFig.Building[buildingName].total_People} and Actual  Count - ${occ90DaysPeak_Count}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

  });

  test('Navigate to Building and validate <Building> Environment in Overview Page', async ({
    given,
    when,
    //then,
    and
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedIn(given)
    when(/^I select "(.*)"$/, async (building) => {
      reporter.startStep(`When I select ${building}`);
      logger.info(`When I select ${building}`)
      buildingName = building
      // await delay(10000)
      await performAction('click', commons.button.selectBuilding)
      await delay(2000)
      await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
      await Promise.all([
        performAction('click', `//ul[@role='menu']//li[span='${building}']`),
        waitForNetworkIdle(120000) //2mins
      ])
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });

    //Then Verify The Building Environment last Update Time
    // then('Verify The Building Environment last Update Time', async () => {
    //   reporter.startStep("Then Verify The Building Environment last Update Time");
    //   let configFile = await getEnvConfig()
    //   if (configFile.Building[buildingName]['Build_Occ_last_Update_Time'] == 'NA') {
    //     logger.error(`Building Occupancy last Update Time is not available in ${buildingName}`)
    //     reporter.startStep(`Building Occupancy last Update Time is not available in ${buildingName}`);
    //     reporter.endStep();
    //   } else {
    //     // let configFile = await getEnvConfig()
    //     // if ('Last_updated_time' in configFile.Building[buildingName] && configFile.Building[buildingName]['Last_updated_time'] == 'NA') {
    //     //   logger.error(`Last updated time not available in ${buildingName}`)
    //     //   reporter.startStep(`Last updated time not available in ${buildingName}`);
    //     //   reporter.endStep();
    //     // } else {
    //     await Promise.all([
    //       performAction("click", buildingOverview.a.overviewTab),
    //       waitForNetworkIdle(120000)
    //     ])
    //     let Last_updatedTime = await getPropertyValueByXpath(verifyBuildPage.h4.buildEnvLastTime, "textContent")
    //     let Last_updatedTimeSplit = Last_updatedTime.split(":");
    //     let last_Update2 = Last_updatedTimeSplit[1]
    //     let last_Update1 = Last_updatedTimeSplit[2]
    //     let last_Update = last_Update2 + ":" + last_Update1
    //     let ss = await customScreenshot('building.png')
    //     reporter.addAttachment("building", ss, "image/png");
    //     await delay(2000)
    //     const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
    //     let datesplit = date.split(",");
    //     let splitvalueDate = datesplit[0]
    //     let totaltime = splitvalueDate + ", " + last_Update
    //     let valuedate = new Date(totaltime);
    //     let unixtime = valuedate.getTime();
    //     var valuetimemin = 900000;
    //     var estTime = new Date();
    //     var currentDateTimeCentralTimeZone = new Date(estTime.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    //     var month = currentDateTimeCentralTimeZone.getMonth() + 1;
    //     var day = currentDateTimeCentralTimeZone.getDate();
    //     var year = currentDateTimeCentralTimeZone.getFullYear().toString();
    //     var hours = currentDateTimeCentralTimeZone.getHours() + 1;
    //     var minutes = currentDateTimeCentralTimeZone.getMinutes();
    //     var am_pm = hours >= 12 ? "PM" : "AM";
    //     hours = hours % 12;
    //     hours = hours ? hours : 12;
    //     month = month < 10 ? '0' + month : month;
    //     day = day < 10 ? '0' + day : day;
    //     hours = hours < 10 ? '0' + hours : hours;
    //     minutes = minutes < 10 ? '0' + minutes : minutes;
    //     var strTimeEST = month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ' ' + am_pm;
    //     let EstTime = hours + ':' + minutes + ' ' + am_pm;
    //     let strTimeEST1 = new Date(strTimeEST);
    //     let EST_TimeZone1 = strTimeEST1.getTime();
    //     reporter.startStep(`Expected EST current time is - ${EstTime} and Actual time is ${last_Update}`);
    //     if (Math.abs(unixtime - EST_TimeZone1) <= (valuetimemin)) {
    //       logger.info(`Last Updated time is ${last_Update}`)
    //       expect(Math.abs(unixtime - EST_TimeZone1) <= (valuetimemin)).toBeTruthy()
    //     } else {
    //       logger.error(`Expected EST current time is - ${EstTime} and Actual time is ${last_Update}`);
    //       expect(true).toBe(false)
    //     }
    //     reporter.endStep();
    //     // }
    //   }
    //   reporter.endStep();
    // });

    and('Verify The Visit Frequency see more option', async () => {
      reporter.startStep(`And Verify The Visit Frequency see more option`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['visit_Frequency_Seemore'] == 'NA') {
        logger.error(`The Visit Frequency see more option is not available in ${buildingName}`)
        reporter.startStep(`The Visit Frequency see more option is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        await delay(4000)
        await Promise.all([
          performAction("click", buildingOverview.a.overviewTab),
          waitForNetworkIdle(120000)
        ])
        delay(8000)
        await Promise.all([
          performAction("click", verifyBuildPage.h4.visitFrequency_Seemore_Option),
          waitForNetworkIdle(80000)
        ])
        let ss = await customScreenshot('building.png')
        reporter.addAttachment("building", ss, "image/png");
        await delay(4000)
        let occupancy_Usage = await getPropertyValueByXpath(verifyBuildPage.h4.total_Frequency_Txt, "textContent")
        await delay(2000)
        let conFig = await getEnvConfig()
        reporter.startStep(`Expected The Occupancy Usage Page Text  - ${conFig.Building[buildingName].occupancy_Usage_SeeMore} and Actual Text - ${occupancy_Usage}`);
        if (occupancy_Usage === conFig.Building[buildingName].occupancy_Usage_SeeMore) {
          logger.info(`Expected The Occupancy Usage Page Text  - ${conFig.Building[buildingName].occupancy_Usage_SeeMore} and Actual Text - ${occupancy_Usage}`)
          expect(conFig.Building[buildingName].occupancy_Usage_SeeMore).toBe(occupancy_Usage);
        } else {
          logger.error(`Occupancy Usage Page Text  - ${conFig.Building[buildingName].occupancy_Usage_SeeMore} and Actual Text - ${occupancy_Usage}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
    });

    and('Click The Building Occupancy See More option', async () => {
      reporter.startStep(`And Click The Building Occupancy See More option`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['building_Occupancy_Seemore'] == 'NA') {
        logger.error(`The Building Occupancy See More option is not available in ${buildingName}`)
        reporter.startStep(`The Building Occupancy See More option is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        await delay(8000)
        await Promise.all([
          performAction("click", verifyBuildPage.h4.buildOcc_SeeMore_option),
          waitForNetworkIdle(80000)
        ])
        let ss = await customScreenshot('building.png')
        reporter.addAttachment("building", ss, "image/png");
        let conFig = await getEnvConfig()
        let buildingOccupancyTxtSeeMore = await getPropertyValueByXpath(verifyBuildPage.h5.buildingOccupancyTxt_SeeMore, "textContent")
        reporter.startStep(`Expected Building Occupancy Text In See more Option   - ${conFig.Building[buildingName].buildOccTextSeeMore} and Actual  status - ${buildingOccupancyTxtSeeMore}`);
        if (buildingOccupancyTxtSeeMore === conFig.Building[buildingName].buildOccTextSeeMore) {
          logger.info(`Expected Building Occupancy Text In See more Option- ${conFig.Building[buildingName].buildOccTextSeeMore} and Actual  status - ${buildingOccupancyTxtSeeMore}`)
          expect(conFig.Building[buildingName].buildOccTextSeeMore).toBe(buildingOccupancyTxtSeeMore);
        } else {
          logger.error(`Expected Building Occupancy Text In See more Option - ${conFig.Building[buildingName].buildOccTextSeeMore} and Actual  status - ${buildingOccupancyTxtSeeMore}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify The Environment see more option', async () => {
      reporter.startStep(`And Verify The Environment see more option`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['environment_Seemorecl'] == 'NA') {
        logger.error(`The Environment see more option is not available in ${buildingName}`)
        reporter.startStep(`The Environment see more option is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        await Promise.all([
          performAction("click", buildingOverview.a.overviewTab),
          waitForNetworkIdle(120000)
        ])
        await Promise.all([
          performAction("click", verifyBuildPage.h4.env_Seemore_Option),
          waitForNetworkIdle(120000)
        ])
        let ss = await customScreenshot('building.png')
        reporter.addAttachment("building", ss, "image/png");
        let environment_Weather = await getPropertyValueByXpath(verifyBuildPage.h5.env_SeeMore_Txt, "textContent")
        let conFig = await getEnvConfig()
        reporter.startStep(`Expected The Environment Page Text  - ${conFig.Building[buildingName].environment_SeeMore} and Actual Text - ${environment_Weather}`);
        if (environment_Weather === conFig.Building[buildingName].environment_SeeMore) {
          logger.info(`Expected The Environment Page Text  - ${conFig.Building[buildingName].environment_SeeMore} and Actual Text - ${environment_Weather}`)
          expect(conFig.Building[buildingName].environment_SeeMore).toBe(environment_Weather);
        } else {
          logger.error(`Expected The Environment Page Text  - ${conFig.Building[buildingName].environment_SeeMore} and Actual Text - ${environment_Weather}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
      await Promise.all([
        performAction("click", buildingOverview.a.overviewTab),
        waitForNetworkIdle(120000)
      ])
    });

    // And Validate The last 7 Days Chart in VisitFrequency
    and('Validate The last 7 Days Chart in VisitFrequency', async () => {
      reporter.startStep(`And Validate The last 7 Days Chart in VisitFrequency`);
      let configFile = await getEnvConfig()
      if (configFile.Building[buildingName]['visitFrequencyChart'] == 'NA') {
        logger.error(`The last 7 Days Chart in VisitFrequency is not available in ${buildingName}`)
        reporter.startStep(`The last 7 Days Chart in VisitFrequency is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        var visitFrequency_chat = await getElementHandleByXpath(verifyBuildPage.h4.visit_Frequency_chat)
        for (let i = 1; i < visitFrequency_chat.length; i++) {
          visitFrequency_chat = await getElementHandleByXpath(verifyBuildPage.h4.visit_Frequency_chat)
          try {
            await visitFrequency_chat[i].hover()
            await delay(1000)
            performAction(visitFrequency_chat[i]);
          } catch (error) {
            logger.error(`Error occurred for Unable to Hover The Visit Frequency Chart`)
            reporter.startStep(`Error occurred for Unable to Hover The Visit Frequency Chart`);
            expect(true).toBe(false)
            reporter.endStep();
          }
          await visitFrequency_chat[i].hover()
          await delay(2000)
          let visitFrequency_Date = await getPropertyValueByXpath(verifyBuildPage.div.visit_Frequency_Chat_Date, "textContent")
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const visitFrequencyfullyear = visitFrequency_Date + " " + currentYear;
          const date = new Date(visitFrequencyfullyear);
          const day = date.getDay(); // Get the day of the week
          if (day != 0 && day != 6) { // here verifynot sat and sun
            let VisitFrequencyChat_Count = await getPropertyValueByXpath(verifyBuildPage.div.VisitFrequency_Chat_Count, "textContent")
            function extractNumbers(str) {
              return str.replace(/\D/g, "");
            }
            const VisitFrequencyChatCount = extractNumbers(VisitFrequencyChat_Count);
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
      }
      reporter.endStep();
    });
  });

  test('Navigate to Building and validate <Building> Occupancy Sensor page', async ({
    given,
    when,
    then,
    and
  }) => {
    let online_sensors, date, day, hours, buildingName
    givenIamLoggedIn(given); // Use the given parameter to call the function
    when(/^I select "(.*)"$/, async (building) => {
      reporter.startStep(`When I select ${building}`);
      logger.info(`When I select ${building}`)
      buildingName = building
      await performAction('click', commons.button.selectBuilding)
      await delay(2000)
      await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
      await Promise.all([
        performAction('click', `//ul[@role='menu']//li[span='${building}']`),
        waitForNetworkIdle(120000) //2mins
      ])
    
      let ss = await customScreenshot('building.png')
      reporter.addAttachment("building", ss, "image/png");
      reporter.endStep();
    });
    then('verify Occupancy sensor last updated time', async () => {
      reporter.startStep("And verify Occupancy sensor last updated time");

      // Fetch environment configuration
      let configFile = await getEnvConfig();

      // Check if the Occupancy Sensor is available in the specified building
      if (configFile.Building[buildingName]['Occupancy_Page'] == 'NA') {
        // Occupancy Sensor is not available
        logger.info(`The Occupancy Sensor is not available in ${buildingName}`);
        reporter.startStep(`The Occupancy Sensor is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        // Click on the occupancy tab and wait for network idle
        await Promise.all([
          performAction("click", buildingOverview.a.occupancyTab),
          waitForNetworkIdle(120000)
        ]);

        // Click on the sensors tab within the occupancy page and wait for network idle
        await Promise.all([
          performAction("click", occupancySensorsTab.div.sensorsTab),
          waitForNetworkIdle(120000)
        ]);

        let hasNextPage = true; // Indicates whether there is a next page of sensors
        let page = 1; // Page counter
        let failedCount = 0; // Variable to keep track of the number of failed test cases

        while (hasNextPage) {
          // Get the count of online sensors
          let onlineSensorCount = await getPropertyValueByXpath(verifyBuildPage.h5.onlineSensor, "textContent");
          let splitOnlineSensorCount = parseInt(onlineSensorCount.split(" ")[0]);

          // Iterate over online sensors
          for (let i = 1; i <= splitOnlineSensorCount; i++) {
            // Get the sensor ID, online status, and last updated time for each online sensor
            let sensorId = await getPropertyValueByXpath(`(${VerifyOccupancySensors.p.OccupancyId})[${i}]`, "textContent");
            let onlineStatus = await getPropertyValueByXpath(`(${VerifyOccupancySensors.div.onlineStatus})[${i}]`, "textContent");
            let lastUpdatedTime = await getPropertyValueByXpath(`(${VerifyOccupancySensors.div.lastUpdated})[${i}]`, "textContent");

            // Extract date and time from the last updated time
            let datePart = lastUpdatedTime.slice(0, 10);
            let timePart = lastUpdatedTime.slice(10);
            let lastUpdatedTimeFormatted = datePart + " " + timePart;

            // Get the current time in EST timezone
            let estTime = new Date();
            let month = estTime.getMonth() + 1;
            let day = estTime.getDate();
            let year = estTime.getFullYear().toString();
            let hours = estTime.getHours();
            let minutes = estTime.getMinutes();
            let am_pm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12;
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            let strTimeEST = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ' ' + am_pm;

            reporter.startStep(`Sensor ${i}: Sensor ID ${sensorId} - Expected EST current time is ${strTimeEST} and Occupancy sensor Last updated time is ${lastUpdatedTimeFormatted}`);

            // Calculate the time difference between the current time and the last updated time
            let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(lastUpdatedTimeFormatted)) / 60000);

            // Test Cases for online sensors
            if (timeDifferenceInMinutes <= 180) {
              // Last updated time is within the allowed limit
              logger.info(`Sensor ${sensorId} Last Updated time is within the allowed limit.`);
            } else {
              // Last updated time exceeds the allowed limit, sensor is offline
              logger.error(`Sensor ${sensorId}: Occupancy sensor last updated time is greater than 3 hours. Test case failed.`);
              failedCount++; // Increment the failedCount variable
            }
            reporter.endStep();
          }
          reporter.endStep();
          // Get the count of offline sensors
          let offlineSensorCount = await getPropertyValueByXpath(verifyBuildPage.h5.offlineSensor, "textContent");
          let splitOfflineCount = parseInt(offlineSensorCount.split(" ")[1]);

          // Iterate over offline sensors
          for (let j = splitOnlineSensorCount + 1; j <= (splitOnlineSensorCount + splitOfflineCount); j++) {
            // Get the sensor ID, offline status, and last updated time for each offline sensor
            let sensorId = await getPropertyValueByXpath(`(${VerifyOccupancySensors.p.OccupancyId})[${j}]`, "textContent");
            let offStatus = await getPropertyValueByXpath(`(${VerifyOccupancySensors.div.offStatus})[${j - splitOnlineSensorCount}]`, "textContent");
            let lastUpdatedTime = await getPropertyValueByXpath(`(${VerifyOccupancySensors.div.lastUpdated})[${j}]`, "textContent");

            // Extract date and time from the last updated time
            let datePart = lastUpdatedTime.slice(0, 10);
            let timePart = lastUpdatedTime.slice(10);
            let lastUpdatedTimeFormatted = datePart + " " + timePart;

            // Get the current time in EST timezone
            let estTime = new Date();
            let month = estTime.getMonth() + 1;
            let day = estTime.getDate();
            let year = estTime.getFullYear().toString();
            let hours = estTime.getHours();
            let minutes = estTime.getMinutes();
            let am_pm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12;
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            let strTimeEST = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ' ' + am_pm;

            reporter.startStep(`Sensor ${j}: Sensor ID ${sensorId}  - Expected EST current time is ${strTimeEST} and Occupancy sensor Last updated time is ${lastUpdatedTimeFormatted}`);

            // Calculate the time difference between the current time and the last updated time
            let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(lastUpdatedTimeFormatted)) / 60000);

            if (lastUpdatedTimeFormatted === "N/A") {
              logger.info(`Sensor ${sensorId} sensor is offline, so Last Updated time is showing N/A`);
            } else if (lastUpdatedTimeFormatted.trim() === "-") {
              logger.error("Last updated data is not available");
            } else if (timeDifferenceInMinutes >= 180) {
              // Last updated time is within the allowed limit
              logger.info(`Sensor ${sensorId} Last Updated time is within the allowed limit.`);
              expect(true).toBe(true); // Test case pass
            } else {
              // Last updated time exceeds the allowed limit, sensor is offline
              logger.error(`Sensor ${sensorId}: Occupancy sensor last updated time is greater than 3 hours. Test case failed.`);
              failedCount++; // Increment the failedCount variable
            }

            reporter.endStep();
          }

          // Check if there is a next page of sensors
          let nextPageButton = await getPropertyValueByXpath(VerifyOccupancySensors.button.gotonextpage, "textContent");
          hasNextPage = nextPageButton !== null && nextPageButton !== "";

          if (hasNextPage) {
            // Go to the next page of sensors
            await performAction("click", VerifyOccupancySensors.button.gotonextpage);
            waitForNetworkIdle(120000);
            page++;
          } else {
            // All sensors have been processed
            logger.info(`Sensor Last Updated time is pass`);
          }
        }
        // After all the test cases have been executed
        if (failedCount === 0) {
          logger.info("All test cases passed.");
        } else {
          logger.error(`Failed test cases: ${failedCount}`);
          // Fail the test case here
          expect(true).toBe(false);
        }
        // Check if there is a next page of sensors
        let nextPageButton = await getPropertyValueByXpath(VerifyOccupancySensors.button.gotonextpage, "textContent");
        hasNextPage = nextPageButton !== null && nextPageButton !== "";

        if (hasNextPage) {
          // Go to the next page of sensors
          await performAction("click", VerifyOccupancySensors.button.gotonextpage);
          waitForNetworkIdle(120000);
          page++;
        } else {
          // All sensors have been processed
          logger.info(`Sensor Last Updated time is pass`);
        }
      }
    });
  });
});













