import { assert } from 'console';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, delay, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab, envTab, verifyBuildPage, commons } from '../constants/locators';
import { environment_Sensor } from '../constants/environment_sensor';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding } from './shared-steps';
import exp from 'constants';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateOverviewBuild.feature',
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
        let onlinecount = await getPropertyValueByXpath(verifyBuildPage.div.onlineSensors, "textContent")
        reporter.startStep(`Expected online sensor count is - ${occupancySensor.Building[buildingName].Online_Sensor} and Actual count is - ${onlinecount}`);
        if (onlinecount === occupancySensor.Building[buildingName].Online_Sensor) {
          logger.info(`Online Sensor count is ${onlinecount}`)
          expect(occupancySensor.Building[buildingName].Online_Sensor).toBe(onlinecount);
        } else {
          logger.error(`Expected online sensor count is - ${occupancySensor.Building[buildingName].Online_Sensor} and Actual count is ${onlinecount}`);
          expect(true).toBe(false); 
        }
        reporter.endStep();
      }
      if (occupancySensor.Building[buildingName]['Offline_Sensor'] == 'NA') {
        logger.error(`Occupancy Offline Sensor is not available in ${buildingName}`)
        reporter.startStep(`Occupancy Offline Sensor is not available in ${buildingName}`);
        reporter.endStep();
      } else {
        let offlinecount = await getPropertyValueByXpath(verifyBuildPage.div.offlineSensors, "textContent")
        reporter.startStep(`Expected Offline Sensor count is - ${occupancySensor.Building[buildingName].Offline_Sensor} and Actual Count is - ${offlinecount}`);
        if (offlinecount === occupancySensor.Building[buildingName].Offline_Sensor) {
          logger.info(`Offline Sensor count is ${offlinecount}`)
          expect(occupancySensor.Building[buildingName].Offline_Sensor).toBe(offlinecount);
        } else {
          logger.error(`Expected Offline Sensor count is ${occupancySensor.Building[buildingName].Offline_Sensor} and Actual count is ${offlinecount}`);
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
      let onlinedevicecount = await getPropertyValueByXpath(verifyBuildPage.div.onlineDevice, "textContent")
      let environmentDevice = await getEnvConfig()
      reporter.startStep(`Expected Environment Active Device Count is - ${environmentDevice.Building[buildingName].Active_device} and Actual Device Count is - ${onlinedevicecount}`);
      if (onlinedevicecount === environmentDevice.Building[buildingName].Active_device) {
        logger.info(`Environment Active device Count is ${onlinedevicecount}`)
        expect(environmentDevice.Building[buildingName].Active_device).toBe(onlinedevicecount);
      } else {
        logger.error(`Expected Environment Active Device is ${environmentDevice.Building[buildingName].Active_device} and Actual Device is ${onlinedevicecount}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      let offlinedevicecount = await getPropertyValueByXpath(verifyBuildPage.div.offlineDevice, "textContent")
      reporter.startStep(`Expected Environment Inactive Devices  Count is - ${environmentDevice.Building[buildingName].Inactive_device} and Actual Devices Count is - ${offlinedevicecount}`);
      if (offlinedevicecount === environmentDevice.Building[buildingName].Inactive_device) {
        logger.info(`Environment Inactive Devices Count is ${offlinedevicecount}`)
        expect(environmentDevice.Building[buildingName].Inactive_device).toBe(offlinedevicecount);
      } else {
        logger.error(`Expected Environment Inactive Devices is ${environmentDevice.Building[buildingName].Inactive_device} and Actual Devices is ${offlinedevicecount}`);
        expect(true).toBe(false)
      }
      reporter.endStep();
      reporter.endStep();
    });

    and('Verify the user count Building Manager and Tenant Admin', async () => {
      reporter.startStep(`And Verify the user count Building Manager and Tenant Admin`);
      let buildmanagerx = await getPropertyValueByXpath(verifyBuildPage.p.buildManager, "textContent")
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
      let tenantadminx = await getPropertyValueByXpath(verifyBuildPage.p.buildAdmin, "textContent")
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

    and('Verify Building Address', async () => {
      reporter.startStep(`And Verify Building Address`);
      let buildingaddress = await getPropertyValueByXpath(verifyBuildPage.div.buildAddress, "textContent")
      let address = await getEnvConfig()
      reporter.startStep(`Expected Building Address is - ${address.Building[buildingName].Address} and Actual Building Address is - ${buildingaddress}`);
      if (buildingaddress === address.Building[buildingName].Address) {
        logger.info(`Building Address is ${buildingaddress}`)
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
          logger.info(`Thermal Quality Status - ${thermalQauality}`)
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
          logger.info(`Air Quality Status- ${airQualityStatus}`)
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
          logger.info(`Light Quality Status - ${lightQualityStatus}`)
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
        const soundQaualityList = ["Excellent", "Good", "Moderate", "Poor"]
        reporter.startStep(`Expected Sound Quality Status ${soundQaualityList} and Actual Status ${soundQualityStatus}`);
        if ((soundQualityStatus === "Good") || (soundQualityStatus === "Excellent") || (soundQualityStatus === "Moderate") || (soundQualityStatus === "Poor")) {
          logger.info(`Environment Sound Quality Status ${soundQualityStatus}`)
          expect(soundQaualityList.includes(soundQualityStatus)).toBeTruthy()
        } else {
          logger.error(`Expected Sound Quality Status ${soundQaualityList} and Actual Status ${soundQualityStatus}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
        reporter.endStep();
      }
      reporter.endStep();
    });

    and('Verify Floor details with Zone and devices', async () => {
      reporter.startStep(`And Verify Floor details with Zone and devices`);
      let fullname = await getPropertyValueByXpath(verifyBuildPage.p.areaLocate, "textContent")
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
        let portaltime = await getPropertyValueByXpath(verifyBuildPage.span.appTime, "textContent")
        const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
        let datesplit = date.split(",");
        let splitvalueDate = datesplit[0]
        let totaltime = splitvalueDate + ", " + portaltime
        let valuedate = new Date(totaltime);
        let unixtime = valuedate.getTime();
        var valuetimemin = 900000;
        let leasttime = unixtime - valuetimemin
        let maxtime = unixtime + valuetimemin
        reporter.startStep(`Expected EST current time and Actual time is ${portaltime}`);
        if (unixtime > leasttime && unixtime < maxtime) {
          logger.info(`Last Updated time is ${portaltime}`)
          expect(unixtime > leasttime && unixtime < maxtime).toBeTruthy()
        } else {
          logger.error(`Expected EST current time and Actual time is ${portaltime}`);
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
      reporter.startStep("Then Verify Lobby activity Last updated time");
      let configFile = await getEnvConfig()
      if ('Occupancy_Page' in configFile.Building[buildingName] && configFile.Building[buildingName]['Occupancy_Page'] == 'NA') {
        logger.error(`The Lobby activity Last updated time not available in ${buildingName}`)
        reporter.startStep(`Lobby activity Last updated time not available in ${buildingName}`);
        reporter.endStep();
      } else {
        await Promise.all([
          performAction("click", buildingOverview.a.occupancyTab),
          waitForNetworkIdle(120000)
        ])
        let lobbytimex = await getPropertyValueByXpath(verifyBuildPage.span.lobbyTime, "textContent")
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        let splitlobby = lobbytimex.split(":");
        let last_Update = splitlobby[0]
        reporter.startStep(`${splitlobby}`);
        if (last_Update === ("LAST UPDATED")) {
          logger.info(`${splitlobby}`)
          expect("LAST UPDATED").toBe(last_Update)
        } else {
          logger.error(`Expect value is  ${splitlobby}`);
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
        let occupancyonline = await getPropertyValueByXpath(verifyBuildPage.p.onlineSensor, "textContent")
        let ss = await customScreenshot('env.png')
        reporter.addAttachment("env", ss, "image/png");
        let splitoccupancyonline = occupancyonline.split(" ");
        let splitoccpancyon = splitoccupancyonline[0]
        reporter.startStep(`Expected Occupancy online sensor count is - ${configFile.Building[buildingName].Online_Sensor} and Actual count is - ${splitoccpancyon}`);
        if (splitoccpancyon === configFile.Building[buildingName].Online_Sensor) {
          logger.info(`Occupancy Online Sensor count is ${splitoccpancyon}`)
          expect(configFile.Building[buildingName].Online_Sensor).toBe(splitoccpancyon);
        } else {
          logger.error(`Expected Occupancy online sensor count is ${configFile.Building[buildingName].Online_Sensor} and Actual count is ${splitoccpancyon}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
        let occupancyoffline = await getPropertyValueByXpath(verifyBuildPage.p.offlineSensor, "textContent")
        let splitoccupancyoffline = occupancyoffline.split(" ");
        let splitoccpancyoff = splitoccupancyoffline[1]
        reporter.startStep(`Expected Occupancy Offline Sensor count is ${configFile.Building[buildingName].Offline_Sensor} and Actual count is ${splitoccpancyoff}`);
        if (splitoccpancyoff === configFile.Building[buildingName].Offline_Sensor) {
          logger.info(`Occupancy Offline Sensor count is ${splitoccpancyoff}`)
          expect(configFile.Building[buildingName].Offline_Sensor).toBe(splitoccpancyoff);
        } else {
          logger.error(`Expected Occupancy Offline Sensor count is - ${configFile.Building[buildingName].Offline_Sensor} and Actual count is - ${splitoccpancyoff}`);
          expect(true).toBe(false)
        }
        reporter.endStep();
      }
      reporter.endStep();
    });
  });
});
