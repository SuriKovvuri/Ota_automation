import { assert } from 'console';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, delay, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab, envTab, verifyBuildPage, tenantAdmin, commons, VerifyOccupancySensors, BuildingManager } from '../constants/locators';
import { environment_Sensor } from '../constants/environment_sensor';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding } from './shared-steps';
import exp from 'constants';
let action;

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateRegressionBuildingManager.feature',
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
        await goTo(config.sbcBMURL)
    })

    afterAll(async () => {
        try {
            logger.info('After ALL')
            await logout()
            await har.stop();

            await customScreenshot('loggedout.png')
            await createPDF(global.testStart, 'sbpauto')
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
            await goTo(config.sbcBMURL)
            await login(global.env, "SBC")
            await customScreenshot('beforeAll.png')
        }
        catch (err) {
            logger.error(err);
        }
    })


    test('Navigate to <Building> and validate overview page', async ({
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
            if (occupancySensor.Building3[buildingName]['Online_Sensor'] == 'NA') {
                logger.error(`Occupancy Online Sensor is not available in ${buildingName}`)
                reporter.startStep(`Occupancy Online Sensor is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let onlinecount_occupancy = await getPropertyValueByXpath(verifyBuildPage.div.onlineSensors, "textContent")
                let occupancyOnlineSplit = onlinecount_occupancy.split(" ");
                let onlinecount = occupancyOnlineSplit[0]
                reporter.startStep(`Expected online sensor count is - ${occupancySensor.Building3[buildingName].Online_Sensor} and Actual count is - ${onlinecount}`);
                if (onlinecount === occupancySensor.Building3[buildingName].Online_Sensor) {
                    logger.info(`Expected online sensor count is - ${occupancySensor.Building3[buildingName].Online_Sensor} and Actual count is - ${onlinecount}`)
                    expect(occupancySensor.Building3[buildingName].Online_Sensor).toBe(onlinecount);
                } else {
                    logger.error(`Expected online sensor count is - ${occupancySensor.Building3[buildingName].Online_Sensor} and Actual count is ${onlinecount}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            if (occupancySensor.Building3[buildingName]['Offline_Sensor'] == 'NA') {
                logger.error(`Occupancy Offline Sensor is not available in ${buildingName}`)
                reporter.startStep(`Occupancy Offline Sensor is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let offlinecount_Occupancy = await getPropertyValueByXpath(verifyBuildPage.div.offlineSensors, "textContent")
                let occupancyOfflinesplit = offlinecount_Occupancy.split(" ");
                let offlinecount = occupancyOfflinesplit[0]
                reporter.startStep(`Expected Offline Sensor count is - ${occupancySensor.Building3[buildingName].Offline_Sensor} and Actual Count is - ${offlinecount}`);
                if (offlinecount === occupancySensor.Building3[buildingName].Offline_Sensor) {
                    logger.info(`Expected Offline Sensor count is - ${occupancySensor.Building3[buildingName].Offline_Sensor} and Actual Count is - ${offlinecount}`)
                    expect(occupancySensor.Building3[buildingName].Offline_Sensor).toBe(offlinecount);
                } else {
                    logger.error(`Expected Offline Sensor count is ${occupancySensor.Building3[buildingName].Offline_Sensor} and Actual count is ${offlinecount}`);
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
            if (occupancySensor.Building3[buildingName]['Active_device'] == 'NA') {
                logger.error(`Environment Active Devices is not available in ${buildingName}`)
                reporter.startStep(`Environment Active Devices is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let onlinedevicecount_Energy = await getPropertyValueByXpath(verifyBuildPage.div.onlineDevice, "textContent")
                let energyOnlineSplit = onlinedevicecount_Energy.split(" ");
                let onlinedevicecount = energyOnlineSplit[0]
                let environmentDevice = await getEnvConfig()
                let active_device = environmentDevice.Building3[buildingName].Active_device
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
            if (occupancySensor.Building3[buildingName]['Inactive_device'] == 'NA') {
                logger.error(`Environment Inactive Devices is not available in ${buildingName}`)
                reporter.startStep(`Environment Inactive Devices is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let offlinedevicecount_Energy = await getPropertyValueByXpath(verifyBuildPage.div.offlineDevice, "textContent")
                let energyOfflinexsplit = offlinedevicecount_Energy.split(" ");
                let offlinedevicecount = energyOfflinexsplit[0]
                let environmentDevice = await getEnvConfig()
                let inactive_device = environmentDevice.Building3[buildingName].Inactive_device
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
            reporter.startStep(`Expected Building Address is - ${address.Building3[buildingName].Address} and Actual Building Address is - ${buildingaddress}`);
            if (buildingaddress === address.Building3[buildingName].Address) {
                logger.info(`Expected Building Address is - ${address.Building3[buildingName].Address} and Actual Building Address is - ${buildingaddress}`)
                expect(address.Building3[buildingName].Address).toBe(buildingaddress);
            } else {
                logger.error(`Expected Building Address is ${address.Building3[buildingName].Address} and Actual Building Address is ${buildingaddress}`);
                expect(true).toBe(false)
            }
            reporter.endStep();
            reporter.endStep();
        });

        and('validate Environment status Thermal and Air and Light and Sound', async () => {
            reporter.startStep(`And validate Environment status Thermal and Air and Light and Sound`);
            let configFile = await getEnvConfig()
            if ('ThermalStatus' in configFile.Building3[buildingName] && configFile.Building3[buildingName]['ThermalStatus'] == 'NA') {
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

            if ('AirStatus' in configFile.Building3[buildingName] && configFile.Building3[buildingName]['AirStatus'] == 'NA') {
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

            if ('LightStatus' in configFile.Building3[buildingName] && configFile.Building3[buildingName]['LightStatus'] == 'NA') {
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

            if ('SoundStatus' in configFile.Building3[buildingName] && configFile.Building3[buildingName]['SoundStatus'] == 'NA') {
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

    test('Navigate to <Building> and validate Environment page', async ({
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
            if ('Last_updated_time' in configFile.Building3[buildingName] && configFile.Building3[buildingName]['Last_updated_time'] == 'NA') {
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
            if ('Environment_Status' in configFile.Building3[buildingName] && configFile.Building3[buildingName]['Environment_Status'] == 'NA') {
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

    test('Navigate to <Building> and validate Occupancy page', async ({
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
            if ('Occupancy_Page' in configFile.Building3[buildingName] && configFile.Building3[buildingName]['Occupancy_Page'] == 'NA') {
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
            if ('Occupancy_Page' in configFile.Building3[buildingName] && configFile.Building3[buildingName]['Occupancy_Page'] == 'NA') {
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

                reporter.startStep(`Expected Occupancy online sensor count is - ${configFile.Building3[buildingName].Online_Sensor} and Actual count is - ${splitoccpancyon}`);
                if (splitoccpancyon === configFile.Building3[buildingName].Online_Sensor) {
                    logger.info(`Expected Occupancy online sensor count is - ${configFile.Building3[buildingName].Online_Sensor} and Actual count is - ${splitoccpancyon}`)
                    expect(configFile.Building3[buildingName].Online_Sensor).toBe(splitoccpancyon);
                } else {
                    logger.error(`Expected Occupancy online sensor count is ${configFile.Building3[buildingName].Online_Sensor} and Actual count is ${splitoccpancyon}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();

                //here verify the Occupancy sensor -->and verify The Offline Occupancy Count
                let occupancyoffline = await getPropertyValueByXpath(verifyBuildPage.h5.offlineSensor, "textContent")
                let splitoccupancyoffline = occupancyoffline.split(" ");
                let splitoccpancyoff = splitoccupancyoffline[1]
                // if (splitoccpancyoff === configFile.Building3[buildingName].Occ_Offline_Sensor) {
                //     logger.info(`Expected Occupancy Offline Sensor count is ${configFile.Building3[buildingName].Occ_Offline_Sensor} and Actual count is ${splitoccpancyoff}`)
                //     reporter.startStep(`Expected Occupancy Offline Sensor count is ${configFile.Building3[buildingName].Occ_Offline_Sensor} and Actual count is ${splitoccpancyoff}`);
                //     reporter.endStep()
                // } else {

                reporter.startStep(`Expected Occupancy Offline Sensor count is ${configFile.Building3[buildingName].Offline_Sensor} and Actual count is ${splitoccpancyoff}`);
                if (splitoccpancyoff === configFile.Building3[buildingName].Offline_Sensor) {
                    logger.info(`Expected Occupancy Offline Sensor count is ${configFile.Building3[buildingName].Offline_Sensor} and Actual count is ${splitoccpancyoff}`)
                    expect(configFile.Building3[buildingName].Offline_Sensor).toBe(splitoccpancyoff);
                } else {
                    logger.error(`Expected Occupancy Offline Sensor count is - ${configFile.Building3[buildingName].Offline_Sensor} and Actual count is - ${splitoccpancyoff}`);
                    expect(true).toBe(false)
                }
                await Promise.all([
                    performAction("click", buildingOverview.a.overviewTab),
                    waitForNetworkIdle(120000)
                ])
                reporter.endStep()
                // }
            }
            reporter.endStep();
        });
    });

    test('Navigate to <Building> and validate Visit Frequency in Overview Page', async ({
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
            if (configFile.Building3[buildingName]['last_Update_Time'] == 'NA') {
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
            if (configFile.Building3[buildingName]['page_Title1'] == 'NA') {
                logger.error(`Visit Frequency Title is not available in ${buildingName}`)
                reporter.startStep(`Visit Frequency Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let page_Title1_visit = await getPropertyValueByXpath(verifyBuildPage.h4.visitFrequencyTitle, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Title  - ${conFig.Building3[buildingName].page_Title1} and Actual Title - ${page_Title1_visit}`);
                if (page_Title1_visit === conFig.Building3[buildingName].page_Title1) {
                    logger.info(`Expected Title  - ${conFig.Building3[buildingName].page_Title1} and Actual Title - ${page_Title1_visit}`)
                    expect(conFig.Building3[buildingName].page_Title1).toBe(page_Title1_visit);
                } else {
                    logger.error(`Expected The Title  - ${conFig.Building3[buildingName].page_Title1} and Actual Title - ${page_Title1_visit}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify The Total Unique Users Title in visit frequency', async () => {
            reporter.startStep(`And Verify The Total Unique Users Title in visit frequency`);
            let configFile = await getEnvConfig()
            if (configFile.Building3[buildingName]['unique_Users'] == 'NA') {
                logger.error(`Visit Frequency Total Unique Users Title is not available in ${buildingName}`)
                reporter.startStep(`Visit Frequency Total Unique Users Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Total_Unique_Users = await getPropertyValueByXpath(verifyBuildPage.div.total_Unique_Users, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The Total Unique Users Title - ${conFig.Building3[buildingName].unique_Users} and Actual Title - ${Total_Unique_Users}`);
                if (Total_Unique_Users === conFig.Building3[buildingName].unique_Users) {
                    logger.info(`Expected The Total Unique Users Title - ${conFig.Building3[buildingName].unique_Users} and Actual Title - ${Total_Unique_Users}`)
                    expect(conFig.Building3[buildingName].unique_Users).toBe(Total_Unique_Users);
                } else {
                    logger.error(`Expected The Total Unique Users Title - ${conFig.Building3[buildingName].unique_Users} and Actual Title- ${Total_Unique_Users}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify The Total Unique Users Count', async () => {
            reporter.startStep(`And Verify The Total Unique Users Count`);
            let configFile = await getEnvConfig()
            if (configFile.Building3[buildingName]['Unique_Users_Count'] == 'NA') {
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
            if (configFile.Building3[buildingName]['totalSwips'] == 'NA') {
                logger.error(`The Total Swips Title is not available in ${buildingName}`)
                reporter.startStep(`The Total Swips Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let totalSwipsText = await getPropertyValueByXpath(verifyBuildPage.div.totalSwipsx, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Title - ${conFig.Building3[buildingName].totalSwips} and Actual Title- ${totalSwipsText}`);
                if (totalSwipsText === conFig.Building3[buildingName].totalSwips) {
                    logger.info(`Expected Title - ${conFig.Building3[buildingName].totalSwips} and Actual Title- ${totalSwipsText}`)
                    expect(conFig.Building3[buildingName].totalSwips).toBe(totalSwipsText);
                } else {
                    logger.error(`Expected  Title - ${conFig.Building3[buildingName].totalSwips} and Actual Title- ${totalSwipsText}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify The Total Swips Count', async () => {
            reporter.startStep(`And Verify The Total Swips Count`);
            let configFile = await getEnvConfig()
            if (configFile.Building3[buildingName]['Total_Swips_Count'] == 'NA') {
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
            if (configFile.Building3[buildingName]['swips_Buildandspace'] == 'NA') {
                logger.error(`Total swipes Text into building and tenant spaces is not available in ${buildingName}`)
                reporter.startStep(`Total swipes Text into building and tenant spaces is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let buildandSpace_Text = await getPropertyValueByXpath(verifyBuildPage.div.buildandSpace, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Text - ${conFig.Building3[buildingName].swips_Buildandspace} and Actual Text- ${buildandSpace_Text}`);
                if (buildandSpace_Text === conFig.Building3[buildingName].swips_Buildandspace) {
                    logger.info(`Expected Text - ${conFig.Building3[buildingName].swips_Buildandspace} and Actual Text- ${buildandSpace_Text}`)
                    expect(conFig.Building3[buildingName].swips_Buildandspace).toBe(buildandSpace_Text);
                } else {
                    logger.error(`Expected  Text - ${conFig.Building3[buildingName].swips_Buildandspace} and Actual Text- ${buildandSpace_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Installed Visit Frequency Devices Title', async () => {
            reporter.startStep(`And Verify Installed Visit Frequency Devices Title`);
            let configFile = await getEnvConfig()
            if (configFile.Building3[buildingName]['installvisitfrquencyText'] == 'NA') {
                logger.error(`Installed Visit Frequency Devices Title is not available in ${buildingName}`)
                reporter.startStep(`Installed Visit Frequency Devices Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let installvisitFrequence_Text = await getPropertyValueByXpath(verifyBuildPage.h4.installvisitFrequenceText, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Title - ${conFig.Building3[buildingName].installvisitfrquencyText} and Actual Title- ${installvisitFrequence_Text}`);
                if (installvisitFrequence_Text === conFig.Building3[buildingName].installvisitfrquencyText) {
                    logger.info(`Expected Title - ${conFig.Building3[buildingName].installvisitfrquencyText} and Actual Title- ${installvisitFrequence_Text}`)
                    expect(conFig.Building3[buildingName].installvisitfrquencyText).toBe(installvisitFrequence_Text);
                } else {
                    logger.error(`Expected  Title - ${conFig.Building3[buildingName].installvisitfrquencyText} and Actual Title- ${installvisitFrequence_Text}`);
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
            if (configFile.Building3[buildingName]['Visit_Frequency_Devices_Count'] == 'NA') {
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

    test('Navigate to <Building> and validate Occupancy in Overview Page', async ({
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
            if (configFile.Building3[buildingName]['Build_Occ_last_Update_Time'] == 'NA') {
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
            if (configFile.Building3[buildingName]['building_Occ_Title'] == 'NA') {
                logger.error(`The Building Occupancy Title is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let buildingOccupancy_Title = await getPropertyValueByXpath(verifyBuildPage.h4.buildingOccupancyTitle, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Title  - ${conFig.Building3[buildingName].building_Occ_Title} and Actual Title - ${buildingOccupancy_Title}`);
                if (buildingOccupancy_Title === conFig.Building3[buildingName].building_Occ_Title) {
                    logger.info(`Expected Title  - ${conFig.Building3[buildingName].building_Occ_Title} and Actual Title - ${buildingOccupancy_Title}`)
                    expect(conFig.Building3[buildingName].building_Occ_Title).toBe(buildingOccupancy_Title);
                } else {
                    logger.error(`Expected The Title  - ${conFig.Building3[buildingName].building_Occ_Title} and Actual Title - ${buildingOccupancy_Title}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify The Real Time Occupancy Percentage', async () => {
            reporter.startStep(`And Verify The Real Time Occupancy Percentage`);
            let configFile = await getEnvConfig()
            if (configFile.Building3[buildingName]['real_Time_Occ_percent'] == 'NA') {
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
            if (configFile.Building3[buildingName]['peak_Occ_percent'] == 'NA') {
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
            if (configFile.Building3[buildingName]['days_PeakUnique_User'] == 'NA') {
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
            if (configFile.Building3[buildingName]['realandPeak_count'] == 'NA') {
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
            if (configFile.Building3[buildingName]['total_Real_Peak'] == 'NA') {
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
                reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building3[buildingName].total_People} and Actual  Count - ${total_RealTimeOcc_Count}`);
                if (total_RealTimeOcc_Count === conFig.Building3[buildingName].total_People) {
                    logger.info(`Expected The Total People Count  - ${conFig.Building3[buildingName].total_People} and Actual  Count - ${total_RealTimeOcc_Count}`)
                    expect(conFig.Building3[buildingName].total_People).toBe(total_RealTimeOcc_Count);
                } else {
                    logger.error(`Expected The Total People Count  - ${conFig.Building3[buildingName].total_People} and Actual  Count - ${total_RealTimeOcc_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();

                //here Verify total 90 Days Peak Occupancy
                let occ90DaysPeak_Counts = await getPropertyValueByXpath(verifyBuildPage.div.peak_TimeOcc_count, "textContent")
                let occ90DaysPeak_CountsSplit = occ90DaysPeak_Counts.split(" ");
                let occ90DaysPeak_Count = occ90DaysPeak_CountsSplit[2]
                reporter.startStep(`Expected The Total 90 Days Peak Occupancy - ${conFig.Building3[buildingName].total_People} and Actual  Count - ${occ90DaysPeak_Count}`);
                if (occ90DaysPeak_Count === conFig.Building3[buildingName].total_People) {
                    logger.info(`Expected The Total 90 Days Peak Occupancy- ${conFig.Building3[buildingName].total_People} and Actual  Count - ${occ90DaysPeak_Count}`)
                    expect(conFig.Building3[buildingName].total_People).toBe(occ90DaysPeak_Count);
                } else {
                    logger.error(`Expected The Total 90 Days Peak Occupancy - ${conFig.Building3[buildingName].total_People} and Actual  Count - ${occ90DaysPeak_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

    });

    test('Navigate to <Building> and validate Environment in Overview Page', async ({
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
            if (configFile.Building3[buildingName]['visit_Frequency_Seemore'] == 'NA') {
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
                reporter.startStep(`Expected The Occupancy Usage Page Text  - ${conFig.Building3[buildingName].occupancy_Usage_SeeMore} and Actual Text - ${occupancy_Usage}`);
                if (occupancy_Usage === conFig.Building3[buildingName].occupancy_Usage_SeeMore) {
                    logger.info(`Expected The Occupancy Usage Page Text  - ${conFig.Building3[buildingName].occupancy_Usage_SeeMore} and Actual Text - ${occupancy_Usage}`)
                    expect(conFig.Building3[buildingName].occupancy_Usage_SeeMore).toBe(occupancy_Usage);
                } else {
                    logger.error(`Occupancy Usage Page Text  - ${conFig.Building3[buildingName].occupancy_Usage_SeeMore} and Actual Text - ${occupancy_Usage}`);
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
            if (configFile.Building3[buildingName]['building_Occupancy_Seemore'] == 'NA') {
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
                reporter.startStep(`Expected Building Occupancy Text In See more Option   - ${conFig.Building3[buildingName].buildOccTextSeeMore} and Actual  status - ${buildingOccupancyTxtSeeMore}`);
                if (buildingOccupancyTxtSeeMore === conFig.Building3[buildingName].buildOccTextSeeMore) {
                    logger.info(buildingOccupancyTxtSeeMore + "buildingOccupancyTxtSeeMore")
                    logger.info(conFig.Building3[buildingName].buildOccTextSeeMore + "conFig.Building3[buildingName].buildOccTextSeeMore")
                    logger.info(`Expected Building Occupancy Text In See more Option- ${conFig.Building3[buildingName].buildOccTextSeeMore} and Actual  status - ${buildingOccupancyTxtSeeMore}`)
                    expect((conFig.Building3[buildingName].buildOccTextSeeMore).trim()).toBe((buildingOccupancyTxtSeeMore).trim());
                } else {
                    logger.error(`Expected Building Occupancy Text In See more Option - ${(conFig.Building3[buildingName].buildOccTextSeeMore).trim()} and Actual  status - ${(buildingOccupancyTxtSeeMore).trim()}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify The Environment see more option', async () => {
            reporter.startStep(`And Verify The Environment see more option`);
            let configFile = await getEnvConfig()
            if (configFile.Building3[buildingName]['environment_Seemorecl'] == 'NA') {
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
                reporter.startStep(`Expected The Environment Page Text  - ${conFig.Building3[buildingName].environment_SeeMore} and Actual Text - ${environment_Weather}`);
                if (environment_Weather === conFig.Building3[buildingName].environment_SeeMore) {
                    logger.info(`Expected The Environment Page Text  - ${conFig.Building3[buildingName].environment_SeeMore} and Actual Text - ${environment_Weather}`)
                    expect(conFig.Building3[buildingName].environment_SeeMore).toBe(environment_Weather);
                } else {
                    logger.error(`Expected The Environment Page Text  - ${conFig.Building3[buildingName].environment_SeeMore} and Actual Text - ${environment_Weather}`);
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
            if (configFile.Building3[buildingName]['visitFrequencyChart'] == 'NA') {
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

    test('Navigate to <Building> and validate the Occupancy page', async ({
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
        and('verify Occupancy sensor last updated time', async () => {
            reporter.startStep("And verify Occupancy sensor last updated time");

            // Fetch environment configuration
            let configFile = await getEnvConfig();

            // Check if the Occupancy Sensor is available in the specified building
            if (configFile.Building3[buildingName]['Occupancy_Page'] == 'NA') {
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

    test('Navigate the <Building> and validate The Environment Page', async ({
        given,
        when,
        then,
        and,
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
        then('verify The Environment status', async () => {
            //   buildingName = building
            reporter.startStep("Then Verify The Environment status");
            let configFile = await getEnvConfig()
            if ('Environment_Status' in configFile.Building3[buildingName] && configFile.Building3[buildingName]['Environment_Status'] == 'NA') {
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
                let allSensors = await getElementHandleByXpath(BuildingManager.h6.allSensors)
                let enviromentSensor_Count = await getEnvConfig()
                expect(enviromentSensor_Count.environmentSensor['All sensors count'].count).toBe(allSensors.length);
                reporter.startStep(`Verify all sensor Expexted count is - 11 and Actual count is - ${allSensors.length}`);
                reporter.endStep();
                for (let i = 0; i < allSensors.length; i++) {
                    let title = await allSensors[i].$x(BuildingManager.div.environmentSensorTitle)
                    let titleValue = await getPropertyValue(title[i], "textContent")
                    // console.log(titleValue + "titleValue")
                    reporter.startStep(`Verify the ${titleValue} status`);
                    let sensorCount = await allSensors[i].$x(BuildingManager.h6.environmentSensorCount)
                    let sensorCountValue = await getPropertyValue(sensorCount[i], "textContent")
                    let allsensor_Split = sensorCountValue.split(" ");
                    //   console.log(allsensor_Split)
                    let all_Sensor_Value = allsensor_Split[0]
                    //    console.log(all_Sensor_Value + "all_Sensor_Value")
                    let all_Sensor_Unit_Value = allsensor_Split[1]
                    const Environment_Status_List = ["Excellent", "Good", "Moderate", "Poor"]
                    let environment_Status = await allSensors[i].$x(BuildingManager.span.allEnironmentStatus)
                    let all_Environment_Status = await getPropertyValue(environment_Status[0], "textContent")
                    reporter.startStep(`The ${titleValue} Environment status is - ${all_Environment_Status}`);
                    if ((all_Environment_Status === "Excellent") || (all_Environment_Status === "Good") || (all_Environment_Status === "Moderate") || (all_Environment_Status === "Poor")) {
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
            let Last_updatedTime = await getPropertyValueByXpath(BuildingManager.div.env_LastUpdate_Time, "textContent")
            let Last_updatedTimeSplit = Last_updatedTime.split(",");
            let last__Update_Time_OverView = Last_updatedTimeSplit[1]
            const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
            let datesplit = date.split(",");
            let splitvalueDate = datesplit[0]
            let totaltime = splitvalueDate + "," + last__Update_Time_OverView
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
            var weatherAllReports = await getElementHandleByXpath(BuildingManager.div.weather_AllReports)
            for (let i = 1; i < weatherAllReports.length; i++) {
                weatherAllReports = await getElementHandleByXpath(BuildingManager.div.weather_AllReports)
                await weatherAllReports[i].hover()
                await delay(2000)
                let weatherAllDate = await weatherAllReports[i].$x(BuildingManager.div.weather_AllDate)
                let weather_All_Date = await getPropertyValue(weatherAllDate[0], "textContent")
                reporter.startStep(`Verify The Date - ${weather_All_Date}`);
                let WeatherAllTime = await weatherAllReports[i].$x(BuildingManager.div.Weather_AllTime)
                let Weather_All_Time = await getPropertyValue(WeatherAllTime[0], "textContent")
                reporter.startStep(`Verify The Time - ${Weather_All_Time}`);
                reporter.endStep();
                let weatherAllTemp = await weatherAllReports[i].$x(BuildingManager.div.weather_AllTemp)
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
            let weatherStatusToday = await getPropertyValueByXpath(BuildingManager.span.weatherStatus_Today, "textContent")
            reporter.startStep(`Expected The Day For Weather Forecast - "TODAY" Actual Day - ${weatherStatusToday}`);
            if ("TODAY" === weatherStatusToday) {
                logger.info(`Expected The Day For Weather Forecast - "TODAY" Actual Day - ${weatherStatusToday}`)
                expect("TODAY" === weatherStatusToday);
            } else {
                logger.error(`Expected The Day For Weather Forecast - "TODAY" Actual Day - ${weatherStatusToday}`);
                expect(true).toBe(false)
            }
            let today_Status = await getPropertyValueByXpath(BuildingManager.span.todayStatus, "textContent")
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
            let todayHumidity = await getPropertyValueByXpath(BuildingManager.span.today_Humidity, "textContent")
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
            let todayWind = await getPropertyValueByXpath(BuildingManager.span.today_Wind, "textContent")
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

            let todayTemp = await getPropertyValueByXpath(BuildingManager.span.today_Temp, "textContent")
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

            let weatherStatusTomorrow = await getPropertyValueByXpath(BuildingManager.span.weatherStatus_Tomorrow, "textContent")
            reporter.startStep(`Expected The Day For Weather Forecast - "TOMORROW" Actual Day - ${weatherStatusTomorrow}`);
            if ("TOMORROW" === weatherStatusTomorrow) {
                logger.info(`Expected The Day For Weather Forecast - "TOMORROW" Actual Day - ${weatherStatusTomorrow}`)
                expect("TOMORROW" === weatherStatusTomorrow);
            } else {
                logger.error(`Expected The Day For Weather Forecast - "TOMORROW" Actual Day - ${weatherStatusTomorrow}`);
                expect(true).toBe(false)
            }
            let tomorrow_Status = await getPropertyValueByXpath(BuildingManager.span.tomorrowStatus, "textContent")
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
            let tomorrowHumidity = await getPropertyValueByXpath(BuildingManager.span.tomorrow_Humidity, "textContent")
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
            let tomorrowWind = await getPropertyValueByXpath(BuildingManager.span.tomorrow_Wind, "textContent")
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

            let tomorrowTemp = await getPropertyValueByXpath(BuildingManager.span.tomorrow_Temp, "textContent")
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

            let Weather_dayAfterTomorrow = await getPropertyValueByXpath(BuildingManager.span.dayAfterTomorrow, "textContent")
            reporter.startStep(`Expected The Day For Weather Forecast - "Day After Tomorrow" Actual Day - ${Weather_dayAfterTomorrow}`);
            let dayAftertomorrow_Status = await getPropertyValueByXpath(BuildingManager.span.dayAftertomorrow_Pre, "textContent")
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

            let dayAfterTomorrowHumidity = await getPropertyValueByXpath(BuildingManager.span.dayAfterTomorrow_Humidity, "textContent")
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

            let dayAfterTomorrowwind = await getPropertyValueByXpath(BuildingManager.span.dayAfterTomorrow_wind, "textContent")
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

            let dayAfterTomorrowTemp = await getPropertyValueByXpath(BuildingManager.span.dayAfterTomorrow_Temp, "textContent")
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

    test('Navigate the <Building> and validate The Energy Page Last 13 Months', async ({
        given,
        when,
        then,
        and,
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
            delay(12000)
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            reporter.endStep();
        });

        then('Verify The High and Low Energy Using Building Manager', async () => {
            // buildingName = building
            reporter.startStep("Verify The High and Low Energy Using Tenant");
            await Promise.all([
                performAction("click", buildingOverview.a.overviewTab),
                waitForNetworkIdle(120000)
            ])
            await Promise.all([
                performAction("click", BuildingManager.a.energy_Page),
                waitForNetworkIdle(120000)
            ])
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");

            let highEnergyUsageTenant = await getPropertyValueByXpath(BuildingManager.div.high_Energy_Usage, "textContent")
            let highEnergyUsageTenantSplit = highEnergyUsageTenant.split(": ");
            let highEnergyUsage_Tenant = highEnergyUsageTenantSplit[1]
            let conFig = await getEnvConfig()
            const expectedTenantList = conFig.Building3[buildingName].EnergyUsage;
            reporter.startStep(`Expected High Energy consumption Using Tenant  - ${conFig.Building3[buildingName].EnergyUsage} and Actual Tenant - ${highEnergyUsage_Tenant}`);
            // console.log("buildingName : " + buildingName)
            // console.log(conFig.Building3[buildingName].highestEnergyUsage)
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyUsage_Tenant}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyUsage_Tenant}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            let lowEnergyUsage = await getPropertyValueByXpath(BuildingManager.div.low_Energy_Usage, "textContent")
            let lowEnergyUsageTenantSplit = lowEnergyUsage.split(": ");
            let lowEnergyUsage_Tenant = lowEnergyUsageTenantSplit[1]
            reporter.startStep(`Expected Low Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            let highEnergyTenantEUI = await getPropertyValueByXpath(BuildingManager.div.high_Energy_Tenant_EUI, "textContent")
            let highEnergyTenantEUISplit = highEnergyTenantEUI.split(": ");
            let highEnergyTenant_EUI = highEnergyTenantEUISplit[1]
            reporter.startStep(`Expected High EUI Using Tenant  - ${conFig.Building3[buildingName].EnergyUsage} and Actual Tenant - ${highEnergyTenant_EUI}`);
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyTenant_EUI}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyTenant_EUI}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            let lowEnergyTenantEUI = await getPropertyValueByXpath(BuildingManager.div.low_Energy_Tenant_EUI, "textContent")
            let lowEnergyTenantEUISplit = lowEnergyTenantEUI.split(": ");
            let lowEnergyTenant_EUI = lowEnergyTenantEUISplit[1]
            reporter.startStep(`Expected Low EUI Using Tenant  - ${conFig.Building3[buildingName].EnergyUsage} and Actual Tenant - ${lowEnergyTenant_EUI}`);
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyTenant_EUI}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyTenant_EUI}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            reporter.endStep();
        });

        and('Verify Last 13 Months Page last Update Time', async () => {
            reporter.startStep("And Verify Last 13 Months Page last Update Time");
            let Last_updatedTime = await getPropertyValueByXpath(BuildingManager.div.energyPage_LastUpdate, "textContent")
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
            // console.log("strTimeEST : " + strTimeEST)
            // console.log("totaltime : " + totaltime)
            let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
            reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
            if (timeDifferenceInMinutes <= 30) {
                logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                expect(timeDifferenceInMinutes <= 30).toBeTruthy()
            } else {
                logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                expect(true).toBe(false)
            }
            reporter.endStep();
            reporter.endStep();
        });

        and('Verify The Average monthly tenant usage Text', async () => {
            reporter.startStep(`And Verify The Average monthly tenant usage Text`);
            let averageUsageTxt = await getPropertyValueByXpath(BuildingManager.div.averageUsage_Txt, "textContent")
            let envFig = await getEnvConfig()
            reporter.startStep(`Expected Average monthly tenant usage Text  - ${envFig.Building3[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
            if (averageUsageTxt === envFig.Building3[buildingName].averageUsage_Txt) {
                logger.info(`Expected Average monthly tenant usage text  - ${envFig.Building3[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`)
                expect(envFig.Building3[buildingName].averageUsage_Txt).toBe(averageUsageTxt);
            } else {
                logger.error(`Expected Average monthly tenant usage text  - ${envFig.Building3[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
                expect(true).toBe(false)
            }
            reporter.endStep();
            reporter.endStep();
        });

        and('Verify The Energy consumption and EUI for Last 13 months', async () => {
            reporter.startStep(`And Verify The Energy consumption and EUI for Last 13 months`);
            let averageMonthConsum = await getPropertyValueByXpath(BuildingManager.div.average_Month_Consum, "textContent")
            reporter.startStep(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
            reporter.endStep();
            if (averageMonthConsum > 0 + " KWH") {
                logger.info(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`)
                expect(averageMonthConsum > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
                expect(true).toBe(false);
            }
            let lowestUsage = await getPropertyValueByXpath(BuildingManager.div.lowest_Usage, "textContent")
            reporter.startStep(`Expected The  Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
            reporter.endStep();
            if (lowestUsage > 0 + " KWH") {
                logger.info(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`)
                expect(lowestUsage > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
                expect(true).toBe(false);
            }
            let highestUsage = await getPropertyValueByXpath(BuildingManager.div.highest_Usage, "textContent")
            reporter.startStep(`Expected The Highest Monthly  Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
            reporter.endStep();
            if (highestUsage > 0 + " KWH") {
                logger.info(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`)
                expect(highestUsage > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
                expect(true).toBe(false);
            }
            let averageMonthEUI = await getPropertyValueByXpath(BuildingManager.div.average_Month_EUI, "textContent")
            reporter.startStep(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
            reporter.endStep();
            if (averageMonthEUI > 0 + " KWH") {
                logger.info(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`)
                expect(averageMonthEUI > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
                expect(true).toBe(false);
            }
            let highestMonthEUI = await getPropertyValueByXpath(BuildingManager.div.highest_Month_EUI, "textContent")
            reporter.startStep(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
            reporter.endStep();
            if (highestMonthEUI > 0 + " KWH") {
                logger.info(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`)
                expect(highestMonthEUI > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
                expect(true).toBe(false);
            }
            let lowestMonthEUI = await getPropertyValueByXpath(BuildingManager.div.lowest_Month_EUI, "textContent")
            reporter.startStep(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
            reporter.endStep();
            if (lowestMonthEUI <= 0 + " KWH" || lowestMonthEUI >= 0 + " KWH") {
                logger.info(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`)
                expect(true).toBeTruthy();
            } else {
                logger.error(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
        });


        and('Verify Energy Usage Intensity Text', async () => {
            reporter.startStep(`And Verify Energy Usage Intensity Text`);
            let energyUsage_IntensityTxt = await getPropertyValueByXpath(BuildingManager.div.energy_Usage_Intensity_Txt, "textContent")
            // console.log(energyUsage_IntensityTxt)
            let envFig = await getEnvConfig()
            reporter.startStep(`Expected Energy Usage Intensity Text  - ${envFig.Building3[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
            if (energyUsage_IntensityTxt === envFig.Building3[buildingName].energy_Intensity_Txt) {
                logger.info(`Expected Energy Usage Intensity Text  - ${envFig.Building3[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`)
                expect(envFig.Building3[buildingName].energy_Intensity_Txt).toBe(energyUsage_IntensityTxt);
            } else {
                logger.error(`Expected Energy Usage Intensity Text  - ${envFig.Building3[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
                expect(true).toBe(false)
            }
            reporter.endStep();
            reporter.endStep();
        });

        and('Verify The click box in last 13 months and calender Year and Last 37 months', async () => {
            reporter.startStep(`And Verify The click box in last 13 months and calender Year and Last 37 months`);
            let energyUsage_Intensity_Button = await getPropertyValueByXpath(BuildingManager.button.last_13_Months, "textContent")
            let energyUsage = await getPropertyValueByXpath(BuildingManager.div.energy_Usage_Click, "textContent")
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
            let energyIntensityClick = await getPropertyValueByXpath(BuildingManager.div.energy_Intensity_Click, "textContent")
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
                performAction("click", BuildingManager.button.calender_Year),
                waitForNetworkIdle(120000)
            ])
            let calenderYear_cap = await getPropertyValueByXpath(BuildingManager.button.calender_Year, "textContent")
            function convertToLowercase(calenderYear_cap) {
                var modifiedText = calenderYear_cap.toLowerCase();
                return modifiedText;
            }
            var calenderYear = convertToLowercase(calenderYear_cap);
            let energyUsage_CalYear = await getPropertyValueByXpath(BuildingManager.div.energy_Usage_Click, "textContent")
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
            let energyIntensityCalYear = await getPropertyValueByXpath(BuildingManager.div.energy_Intensity_Click, "textContent")
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
                performAction("click", BuildingManager.button.last_37_Months),
                waitForNetworkIdle(120000)
            ])
            let energyUsage_last37Month = await getPropertyValueByXpath(BuildingManager.button.last_37_Months, "textContent")
            let energyUsage_37mon = await getPropertyValueByXpath(BuildingManager.div.energy_Usage_Click, "textContent")
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
            let energyIntensity_Last37_Mon = await getPropertyValueByXpath(BuildingManager.div.energy_Intensity_Click, "textContent")
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
                performAction("click", BuildingManager.a.energy_Page),
                waitForNetworkIdle(120000)
            ])

            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.p.high_AverageMonthYear, "textContent")
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
            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.p.low_AverageMonthYear, "textContent")
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

            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.div.highmonthInten, "textContent")
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

            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.div.lowMonthInten, "textContent")
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
        //verify the tenant count
        and('Verify the Tenant count', async () => {
            reporter.startStep(`And Verify the Tenant count`);
            let conFig = await getEnvConfig()

            const tenantInformationXpath = await getPropertyValueByXpath(BuildingManager.div.tenant_info, "textContent");
            logger.info(tenantInformationXpath);
            const ten_count = tenantInformationXpath.split('of')[1].trim().split(',')[0].trim();
            logger.info(ten_count);
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            //Here to fetch from the config file and print the tenant count
            const expectedTenantList = conFig.Building3[buildingName].EnergyUsage;
            // Get the count of expected tenants
            const tenantCount = expectedTenantList.length;
            logger.info(`Tenant Count is : ${tenantCount}`);
            const tenantsTest = (`${tenantCount} tenants`);
            logger.info(tenantsTest);
            //verify the tenants count
            reporter.startStep(`Expected tenant count is : ${ten_count} and Actual tenant count is : ${tenantsTest}`);
            if (ten_count == tenantsTest) {
                logger.info(`Expected tenant count is : ${ten_count} and Actual tenant count is : ${tenantsTest}`);
                expect(ten_count).toBe(tenantsTest);
            } else {
                logger.error(`Expected tenant count is : ${ten_count} and Actual tenant count is : ${tenantsTest}`);
                expect(true).toBe(false);
            }
            // End the test step in the reporter
            reporter.endStep();
            reporter.endStep();
        })
        //verify the last usage tenant month
        and('Verify the last Updated tenant usage month', async () => {
            reporter.startStep('Verify the last Updated tenant usage month')
            const lastUpdatedUsage = await getPropertyValueByXpath(BuildingManager.div.tenant_info, "textContent");
            logger.info(lastUpdatedUsage)
            const datepart = lastUpdatedUsage.split(" – ");
            logger.info(datepart)
            const date = datepart[1];
            logger.info(date);
            const month = date.split(' ')[0]; // Split by space and take the first part
            logger.info(month); // Output: "Sep"
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");

            const now = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const estTime = `${monthNames[now.getMonth() - 1].substr(0, 3)}`;
            logger.info('Current EST Time:', estTime);

            //start step
            reporter.startStep(`Expected last usage tenant month is : ${estTime} and Actual last usage tenant month is : ${month}`);
            //verify the last usage tenant month
            if (estTime == month) {
                logger.info(`Expected last usage tenant month is : ${estTime} and Actual last usage tenant month is : ${month}`);
                expect(estTime).toBe(month);
            } else {
                logger.error(`Expected last usage tenant month is : ${estTime} and Actual last usage tenant month is : ${month}`);
                expect(true).toBe(false);
            }

            reporter.endStep();
            reporter.endStep();
        })

        and('Verify the energy usage graph', async () => {
            reporter.startStep('And Verify the energy usage graph')
            let eui_x_array = await getElementHandleByXpath(BuildingManager.img.energyUsageGraph)
            let length = eui_x_array.length;
            logger.info(length);
            let energyUsageIntensityArray = []; // Initialize an array to store values
            let simplifiedMonths = []; // Initialize an array to store values
            // energyUsageArray
            for (let i = 0; i < eui_x_array.length; i++) {
                let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                let simplifiedEnergyUsageXpath = energyUsageXpath.split(' ')[0];
                energyUsageIntensityArray.push(energyUsageXpath);
                simplifiedMonths.push(simplifiedEnergyUsageXpath.toLowerCase()); // Add the value to the array
                // logger.info(simplifiedEnergyUsageXpath)
                // Perform your action with energyUsageXpath here
            }
            for (let i = 1; i < energyUsageIntensityArray.length; i++) {
                logger.info((energyUsageIntensityArray[energyUsageIntensityArray.length - i]))
            }
            logger.info(energyUsageIntensityArray);
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                logger.info("simplifiedMonths[simplifiedMonths.length - i] : " + simplifiedMonths[simplifiedMonths.length - i]);
            }
            logger.info("simplifiedMonths : " + simplifiedMonths);
             //screenshot
             let ss = await customScreenshot('building.png')
             reporter.addAttachment("building", ss, "image/png");


            const now = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const currentMonthIndex = now.getMonth();

            const getAbbreviatedMonthName = (index) => {
                return monthNames[index].substr(0, 3).toLowerCase();
            };

            // let estTime = "";
            let allEstMonths = []
            for (let i = 1; i < length + 1; i++) {
                // console.log(length)
                const monthIndex = (currentMonthIndex - i + 12) % 12;
                // estTime += getAbbreviatedMonthName(monthIndex) + '\n';
                allEstMonths.push(getAbbreviatedMonthName(monthIndex))

            }
            // console.log('Current EST Time:', estTime);
            console.log("allEstMonths")

            console.log(allEstMonths)
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                reporter.startStep(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);

                if (allEstMonths[i - 1] == simplifiedMonths[simplifiedMonths.length - i]) {
                    logger.info(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(allEstMonths[i - 1]).toBe(simplifiedMonths[simplifiedMonths.length - i]);
                } else {
                    logger.error(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify the energy use Intensity graph', async () => {
            reporter.startStep('And Verify the energy use Intensity graph');
            let eui_x_array = await getElementHandleByXpath(BuildingManager.img.energyUseIntensity)
            let length = eui_x_array.length;
            logger.info(length);
            let energyUsageIntensityArray = []; // Initialize an array to store values
            let simplifiedMonths = []; // Initialize an array to store values
            // energyUsageArray
            for (let i = 0; i < eui_x_array.length; i++) {
                let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                let simplifiedEnergyUsageXpath = energyUsageXpath.split(' ')[0];
                energyUsageIntensityArray.push(energyUsageXpath);
                simplifiedMonths.push(simplifiedEnergyUsageXpath.toLowerCase()); // Add the value to the array
                // logger.info(simplifiedEnergyUsageXpath)
                // Perform your action with energyUsageXpath here
            }
            for (let i = 1; i < energyUsageIntensityArray.length; i++) {
                logger.info((energyUsageIntensityArray[energyUsageIntensityArray.length - i]))
            }
            logger.info(energyUsageIntensityArray);
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                logger.info("simplifiedMonths[simplifiedMonths.length - i] : " + simplifiedMonths[simplifiedMonths.length - i]);
            }
            logger.info("simplifiedMonths : " + simplifiedMonths);

            //screenshot
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");

            const now = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const currentMonthIndex = now.getMonth();

            const getAbbreviatedMonthName = (index) => {
                return monthNames[index].substr(0, 3).toLowerCase();
            };

            // let estTime = "";
            let allEstMonths = []
            for (let i = 1; i < length + 1; i++) {
                // console.log(length)
                const monthIndex = (currentMonthIndex - i + 12) % 12;
                // estTime += getAbbreviatedMonthName(monthIndex) + '\n';
                allEstMonths.push(getAbbreviatedMonthName(monthIndex))

            }
            // console.log('Current EST Time:', estTime);
            console.log("allEstMonths")

            console.log(allEstMonths)
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                reporter.startStep(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);

                if (allEstMonths[i - 1] == simplifiedMonths[simplifiedMonths.length - i]) {
                    logger.info(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(allEstMonths[i - 1]).toBe(simplifiedMonths[simplifiedMonths.length - i]);
                } else {
                    logger.error(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });
    });

    test('Navigate the <Building> and validate The Energy Page Calendar Year', async ({
        given,
        when,
        then,
        and,
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


        then('Verify The High and Low Energy Using Building Manager', async () => {
            reporter.startStep("Verify The High and Low Energy Using Building Manager");
            await Promise.all([
                performAction("click", buildingOverview.a.overviewTab),
                waitForNetworkIdle(120000)
            ])
            await Promise.all([
                performAction("click", BuildingManager.a.energy_Page),
                waitForNetworkIdle(120000)
            ])

            await Promise.all([
                performAction("click", BuildingManager.button.calender_Year),
                waitForNetworkIdle(120000)
            ])
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            let highEnergyUsageTenant = await getPropertyValueByXpath(BuildingManager.div.high_Energy_Usage, "textContent")
            let highEnergyUsageTenantSplit = highEnergyUsageTenant.split(": ");
            let highEnergyUsage_Tenant = highEnergyUsageTenantSplit[1]
            let conFig = await getEnvConfig()
            const expectedTenantList = conFig.Building3[buildingName].EnergyUsage;
            reporter.startStep(`Expected High Energy consumption Using Tenant  - ${conFig.Building3[buildingName].EnergyUsage} and Actual Tenant - ${highEnergyUsage_Tenant}`);
            // console.log("buildingName : " + buildingName)
            // console.log(conFig.Building3[buildingName].highestEnergyUsage)
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyUsage_Tenant}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyUsage_Tenant}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            let lowEnergyUsage = await getPropertyValueByXpath(BuildingManager.div.low_Energy_Usage, "textContent")
            let lowEnergyUsageTenantSplit = lowEnergyUsage.split(": ");
            let lowEnergyUsage_Tenant = lowEnergyUsageTenantSplit[1]
            reporter.startStep(`Expected Low Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            let highEnergyTenantEUI = await getPropertyValueByXpath(BuildingManager.div.high_Energy_Tenant_EUI, "textContent")
            let highEnergyTenantEUISplit = highEnergyTenantEUI.split(": ");
            let highEnergyTenant_EUI = highEnergyTenantEUISplit[1]
            reporter.startStep(`Expected High EUI Using Tenant  - ${conFig.Building3[buildingName].EnergyUsage} and Actual Tenant - ${highEnergyTenant_EUI}`);
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyTenant_EUI}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyTenant_EUI}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            let lowEnergyTenantEUI = await getPropertyValueByXpath(BuildingManager.div.low_Energy_Tenant_EUI, "textContent")
            let lowEnergyTenantEUISplit = lowEnergyTenantEUI.split(": ");
            let lowEnergyTenant_EUI = lowEnergyTenantEUISplit[1]
            reporter.startStep(`Expected Low EUI Using Tenant  - ${conFig.Building3[buildingName].EnergyUsage} and Actual Tenant - ${lowEnergyTenant_EUI}`);
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyTenant_EUI}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyTenant_EUI}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            reporter.endStep();
        });


        and('Verify Calendar Year Page last Update Time', async () => {
            reporter.startStep("And Verify Calendar Year Page last Update Time");
            let Last_updatedTime = await getPropertyValueByXpath(BuildingManager.div.energyPage_LastUpdate, "textContent")
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
            let averageUsageTxt = await getPropertyValueByXpath(BuildingManager.div.averageUsage_Txt, "textContent")
            let conFig = await getEnvConfig()
            reporter.startStep(`Expected Average monthly tenant usage Text  - ${conFig.Building3[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
            if (averageUsageTxt === conFig.Building3[buildingName].averageUsage_Txt) {
                logger.info(`Expected Average monthly tenant usage text  - ${conFig.Building3[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`)
                expect(conFig.Building3[buildingName].averageUsage_Txt).toBe(averageUsageTxt);
            } else {
                logger.error(`Expected Average monthly tenant usage text  - ${conFig.Building3[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
                expect(true).toBe(false)
            }
            reporter.endStep();
            reporter.endStep();
        });

        and('Verify The Energy consumption and EUI for Calendar year', async () => {
            reporter.startStep(`And Verify The Energy consumption and EUI for Calendar year`);
            let averageMonthConsum = await getPropertyValueByXpath(BuildingManager.div.average_Month_Consum, "textContent")
            reporter.startStep(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
            reporter.endStep();
            if (averageMonthConsum > 0 + " KWH") {
                logger.info(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`)
                expect(averageMonthConsum > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
                expect(true).toBe(false);
            }
            let lowestUsage = await getPropertyValueByXpath(BuildingManager.div.lowest_Usage, "textContent")
            reporter.startStep(`Expected The  Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
            reporter.endStep();
            if (lowestUsage > 0 + " KWH") {
                logger.info(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`)
                expect(lowestUsage > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
                expect(true).toBe(false);
            }
            let highestUsage = await getPropertyValueByXpath(BuildingManager.div.highest_Usage, "textContent")
            reporter.startStep(`Expected The Highest Monthly  Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
            reporter.endStep();
            if (highestUsage > 0 + " KWH") {
                logger.info(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`)
                expect(highestUsage > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
                expect(true).toBe(false);
            }
            let averageMonthEUI = await getPropertyValueByXpath(BuildingManager.div.average_Month_EUI, "textContent")
            reporter.startStep(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
            reporter.endStep();
            if (averageMonthEUI > 0 + " KWH") {
                logger.info(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`)
                expect(averageMonthEUI > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
                expect(true).toBe(false);
            }
            let highestMonthEUI = await getPropertyValueByXpath(BuildingManager.div.highest_Month_EUI, "textContent")
            reporter.startStep(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
            reporter.endStep();
            if (highestMonthEUI > 0 + " KWH") {
                logger.info(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`)
                expect(highestMonthEUI > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
                expect(true).toBe(false);
            }
            let lowestMonthEUI = await getPropertyValueByXpath(BuildingManager.div.lowest_Month_EUI, "textContent")
            reporter.startStep(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
            reporter.endStep();
            if (lowestMonthEUI <= 0 + " KWH" || lowestMonthEUI >= 0 + " KWH") {
                logger.info(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`)
                expect(true).toBeTruthy();
            } else {
                logger.error(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
        });

        and('Verify Energy Usage Intensity Text', async () => {
            reporter.startStep(`And Verify Energy Usage Intensity Text`);
            let energyUsage_IntensityTxt = await getPropertyValueByXpath(BuildingManager.div.energy_Usage_Intensity_Txt, "textContent")
            let conFig = await getEnvConfig()
            reporter.startStep(`Expected Energy Usage Intensity Text  - ${conFig.Building3[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
            if (energyUsage_IntensityTxt === conFig.Building3[buildingName].energy_Intensity_Txt) {
                logger.info(`Expected Energy Usage Intensity Text  - ${conFig.Building3[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`)
                expect(conFig.Building3[buildingName].energy_Intensity_Txt).toBe(energyUsage_IntensityTxt);
            } else {
                logger.error(`Expected Energy Usage Intensity Text  - ${conFig.Building3[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
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
                performAction("click", BuildingManager.a.energy_Page),
                waitForNetworkIdle(120000)
            ])
            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.p.high_AverageMonthYear, "textContent")
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
            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.p.low_AverageMonthYear, "textContent")
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
            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.div.highmonthInten, "textContent")
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
            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.div.lowMonthInten, "textContent")
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
        //verify the tenant count
        and('Verify the Tenant count', async () => {
            reporter.startStep(`And Verify the Tenant count`);
            let conFig = await getEnvConfig()

            const tenantInformationXpath = await getPropertyValueByXpath(BuildingManager.div.tenant_info, "textContent");
            logger.info(tenantInformationXpath);
            const ten_count = tenantInformationXpath.split('of')[1].trim().split(',')[0].trim();
            logger.info(ten_count);
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            //Here to fetch from the config file and print the tenant count
            const expectedTenantList = conFig.Building3[buildingName].EnergyUsage;
            // Get the count of expected tenants
            const tenantCount = expectedTenantList.length;
            logger.info(`Tenant Count is : ${tenantCount}`);
            const tenantsTest = (`${tenantCount} tenants`);
            logger.info(tenantsTest);
            //verify the tenants count
            reporter.startStep(`Expected tenant count is : ${ten_count} and Actual tenant count is : ${tenantsTest}`);
            if (ten_count == tenantsTest) {
                logger.info(`Expected tenant count is : ${ten_count} and Actual tenant count is : ${tenantsTest}`);
                expect(ten_count).toBe(tenantsTest);
            } else {
                logger.error(`Expected tenant count is : ${ten_count} and Actual tenant count is : ${tenantsTest}`);
                expect(true).toBe(false);
            }
            // End the test step in the reporter
            reporter.endStep();
            reporter.endStep();
        })

        //verify the last usage tenant month
        and('Verify the last Updated tenant usage month', async () => {
            reporter.startStep('Verify the last Updated tenant usage month')
            const lastUpdatedUsage = await getPropertyValueByXpath(BuildingManager.div.tenant_info, "textContent");
            logger.info(lastUpdatedUsage)
            const datepart = lastUpdatedUsage.split(" – ");
            logger.info(datepart)
            const date = datepart[1];
            logger.info(date);
            const month = date.split(' ')[0]; // Split by space and take the first part
            logger.info(month); // Output: "Sep"
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");

            const now = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const estTime = `${monthNames[now.getMonth() - 1].substr(0, 3)}`;
            logger.info('Current EST Time:', estTime);

            //start step
            reporter.startStep(`Expected last usage tenant month is : ${estTime} and Actual last usage tenant month is : ${month}`);
            //verify the last usage tenant month
            if (estTime == month) {
                logger.info(`Expected last usage tenant month is : ${estTime} and Actual last usage tenant month is : ${month}`);
                expect(estTime).toBe(month);
            } else {
                logger.error(`Expected last usage tenant month is : ${estTime} and Actual last usage tenant month is : ${month}`);
                expect(true).toBe(false);
            }

            reporter.endStep();
            reporter.endStep();
        })
        and('Verify the energy usage graph', async () => {
            reporter.startStep('And Verify the energy usage graph')
            let eui_x_array = await getElementHandleByXpath(BuildingManager.img.energyUsageGraph)
            let length = eui_x_array.length;
            logger.info(length);
            let energyUsageIntensityArray = []; // Initialize an array to store values
            let simplifiedMonths = []; // Initialize an array to store values
            // energyUsageArray
            for (let i = 0; i < eui_x_array.length; i++) {
                let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                let simplifiedEnergyUsageXpath = energyUsageXpath.split(' ')[0];
                energyUsageIntensityArray.push(energyUsageXpath);
                simplifiedMonths.push(simplifiedEnergyUsageXpath.toLowerCase()); // Add the value to the array
                // logger.info(simplifiedEnergyUsageXpath)
                // Perform your action with energyUsageXpath here
            }
            for (let i = 1; i < energyUsageIntensityArray.length; i++) {
                logger.info((energyUsageIntensityArray[energyUsageIntensityArray.length - i]))
            }
            logger.info(energyUsageIntensityArray);
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                logger.info("simplifiedMonths[simplifiedMonths.length - i] : " + simplifiedMonths[simplifiedMonths.length - i]);
            }
            logger.info("simplifiedMonths : " + simplifiedMonths);
            //screenshot
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");


            const now = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const currentMonthIndex = now.getMonth();

            const getAbbreviatedMonthName = (index) => {
                return monthNames[index].substr(0, 3).toLowerCase();
            };

            // let estTime = "";
            let allEstMonths = []
            for (let i = 1; i < length + 1; i++) {
                // console.log(length)
                const monthIndex = (currentMonthIndex - i + 12) % 12;
                // estTime += getAbbreviatedMonthName(monthIndex) + '\n';
                allEstMonths.push(getAbbreviatedMonthName(monthIndex))

            }
            // console.log('Current EST Time:', estTime);
            console.log("allEstMonths")

            console.log(allEstMonths)
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                reporter.startStep(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);

                if (allEstMonths[i - 1] == simplifiedMonths[simplifiedMonths.length - i]) {
                    logger.info(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(allEstMonths[i - 1]).toBe(simplifiedMonths[simplifiedMonths.length - i]);
                } else {
                    logger.error(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify the energy use Intensity graph', async () => {
            reporter.startStep('And Verify the energy use Intensity graph');
            let eui_x_array = await getElementHandleByXpath(BuildingManager.img.energyUseIntensity)
            let length = eui_x_array.length;
            logger.info(length);
            let energyUsageIntensityArray = []; // Initialize an array to store values
            let simplifiedMonths = []; // Initialize an array to store values
            // energyUsageArray
            for (let i = 0; i < eui_x_array.length; i++) {
                let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                let simplifiedEnergyUsageXpath = energyUsageXpath.split(' ')[0];
                energyUsageIntensityArray.push(energyUsageXpath);
                simplifiedMonths.push(simplifiedEnergyUsageXpath.toLowerCase()); // Add the value to the array
                // logger.info(simplifiedEnergyUsageXpath)
                // Perform your action with energyUsageXpath here
            }
            for (let i = 1; i < energyUsageIntensityArray.length; i++) {
                logger.info((energyUsageIntensityArray[energyUsageIntensityArray.length - i]))
            }
            logger.info(energyUsageIntensityArray);
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                logger.info("simplifiedMonths[simplifiedMonths.length - i] : " + simplifiedMonths[simplifiedMonths.length - i]);
            }
            logger.info("simplifiedMonths : " + simplifiedMonths);
            //screenshot
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");


            const now = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const currentMonthIndex = now.getMonth();

            const getAbbreviatedMonthName = (index) => {
                return monthNames[index].substr(0, 3).toLowerCase();
            };

            // let estTime = "";
            let allEstMonths = []
            for (let i = 1; i < length + 1; i++) {
                // console.log(length)
                const monthIndex = (currentMonthIndex - i + 12) % 12;
                // estTime += getAbbreviatedMonthName(monthIndex) + '\n';
                allEstMonths.push(getAbbreviatedMonthName(monthIndex))

            }
            // console.log('Current EST Time:', estTime);
            console.log("allEstMonths")

            console.log(allEstMonths)
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                reporter.startStep(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);

                if (allEstMonths[i - 1] == simplifiedMonths[simplifiedMonths.length - i]) {
                    logger.info(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(allEstMonths[i - 1]).toBe(simplifiedMonths[simplifiedMonths.length - i]);
                } else {
                    logger.error(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

    });

    test('Navigate the <Building> and Verify The Energy Page Last 37 Months', async ({
        given,
        when,
        then,
        and,
    }) => {

        let online_sensors, date, day, hours, buildingName, energyUsageIntensityMonths;
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

        then('Verify The High and Low Energy Using Building Manager', async () => {
            // buildingName = building
            reporter.startStep("Verify The High and Low Energy Using Tenant");
            await Promise.all([
                performAction("click", buildingOverview.a.overviewTab),
                waitForNetworkIdle(120000)
            ])
            await Promise.all([
                performAction("click", BuildingManager.a.energy_Page),
                waitForNetworkIdle(120000)
            ])

            await Promise.all([
                performAction("click", BuildingManager.button.last_37_Months),
                waitForNetworkIdle(120000)
            ])
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            let highEnergyUsageTenant = await getPropertyValueByXpath(BuildingManager.div.high_Energy_Usage, "textContent")
            let highEnergyUsageTenantSplit = highEnergyUsageTenant.split(": ");
            let highEnergyUsage_Tenant = highEnergyUsageTenantSplit[1]
            let conFig = await getEnvConfig()
            const expectedTenantList = conFig.Building3[buildingName].EnergyUsage;
            reporter.startStep(`Expected High Energy consumption Using Tenant  - ${conFig.Building3[buildingName].EnergyUsage} and Actual Tenant - ${highEnergyUsage_Tenant}`);
            // console.log("buildingName : " + buildingName)
            // console.log(conFig.Building3[buildingName].highestEnergyUsage)
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyUsage_Tenant}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyUsage_Tenant}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            let lowEnergyUsage = await getPropertyValueByXpath(BuildingManager.div.low_Energy_Usage, "textContent")
            let lowEnergyUsageTenantSplit = lowEnergyUsage.split(": ");
            let lowEnergyUsage_Tenant = lowEnergyUsageTenantSplit[1]
            reporter.startStep(`Expected Low Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyUsage_Tenant}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            let highEnergyTenantEUI = await getPropertyValueByXpath(BuildingManager.div.high_Energy_Tenant_EUI, "textContent")
            let highEnergyTenantEUISplit = highEnergyTenantEUI.split(": ");
            let highEnergyTenant_EUI = highEnergyTenantEUISplit[1]
            reporter.startStep(`Expected High EUI Using Tenant  - ${conFig.Building3[buildingName].EnergyUsage} and Actual Tenant - ${highEnergyTenant_EUI}`);
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyTenant_EUI}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${highEnergyTenant_EUI}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            let lowEnergyTenantEUI = await getPropertyValueByXpath(BuildingManager.div.low_Energy_Tenant_EUI, "textContent")
            let lowEnergyTenantEUISplit = lowEnergyTenantEUI.split(": ");
            let lowEnergyTenant_EUI = lowEnergyTenantEUISplit[1]
            reporter.startStep(`Expected Low EUI Using Tenant  - ${conFig.Building3[buildingName].EnergyUsage} and Actual Tenant - ${lowEnergyTenant_EUI}`);
            if (expectedTenantList.includes(highEnergyUsage_Tenant)) {
                logger.info(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyTenant_EUI}`);
                expect(expectedTenantList).toContain(highEnergyUsage_Tenant);
            } else {
                logger.error(`Expected High Energy consumption Using Tenant  - ${expectedTenantList} and Actual Tenant - ${lowEnergyTenant_EUI}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
            reporter.endStep();
        });


        and('Verify The Last 37 Months last Update Time', async () => {
            reporter.startStep("And Verify The Last 37 Months last Update Time");
            let Last_updatedTime = await getPropertyValueByXpath(BuildingManager.div.energyPage_LastUpdate, "textContent")
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
            let averageUsageTxt = await getPropertyValueByXpath(BuildingManager.div.averageUsage_Txt, "textContent")
            let conFig = await getEnvConfig()
            reporter.startStep(`Expected Average monthly tenant usage Text  - ${conFig.Building3[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
            if (averageUsageTxt === conFig.Building3[buildingName].averageUsage_Txt) {
                logger.info(`Expected Average monthly tenant usage text  - ${conFig.Building3[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`)
                expect(conFig.Building3[buildingName].averageUsage_Txt).toBe(averageUsageTxt);
            } else {
                logger.error(`Expected Average monthly tenant usage text  - ${conFig.Building3[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
                expect(true).toBe(false)
            }
            reporter.endStep();
            reporter.endStep();
        });

        and('Verify The Energy consumption and EUI for Last 37 Months', async () => {
            reporter.startStep(`And Verify The Energy consumption and EUI for Calendar year`);
            let averageMonthConsum = await getPropertyValueByXpath(BuildingManager.div.average_Month_Consum, "textContent")
            reporter.startStep(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
            reporter.endStep();
            if (averageMonthConsum > 0 + " KWH") {
                logger.info(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`)
                expect(averageMonthConsum > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
                expect(true).toBe(false);
            }
            let lowestUsage = await getPropertyValueByXpath(BuildingManager.div.lowest_Usage, "textContent")
            reporter.startStep(`Expected The  Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
            reporter.endStep();
            if (lowestUsage > 0 + " KWH") {
                logger.info(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`)
                expect(lowestUsage > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Lowest Monthly Usage consumption is - Non Zero and Actual consumption is - ${lowestUsage}`);
                expect(true).toBe(false);
            }
            let highestUsage = await getPropertyValueByXpath(BuildingManager.div.highest_Usage, "textContent")
            reporter.startStep(`Expected The Highest Monthly  Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
            reporter.endStep();
            if (highestUsage > 0 + " KWH") {
                logger.info(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`)
                expect(highestUsage > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Highest Monthly Usage consumption is - Non Zero and Actual consumption is - ${highestUsage}`);
                expect(true).toBe(false);
            }
            let averageMonthEUI = await getPropertyValueByXpath(BuildingManager.div.average_Month_EUI, "textContent")
            reporter.startStep(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
            reporter.endStep();
            if (averageMonthEUI > 0 + " KWH") {
                logger.info(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`)
                expect(averageMonthEUI > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
                expect(true).toBe(false);
            }
            let highestMonthEUI = await getPropertyValueByXpath(BuildingManager.div.highest_Month_EUI, "textContent")
            reporter.startStep(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
            reporter.endStep();
            if (highestMonthEUI > 0 + " KWH") {
                logger.info(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`)
                expect(highestMonthEUI > 0 + " KWH").toBeTruthy();
            } else {
                logger.error(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
                expect(true).toBe(false);
            }
            let lowestMonthEUI = await getPropertyValueByXpath(BuildingManager.div.lowest_Month_EUI, "textContent")
            reporter.startStep(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
            reporter.endStep();
            if (lowestMonthEUI <= 0 + " KWH" || lowestMonthEUI >= 0 + " KWH") {
                logger.info(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`)
                expect(true).toBeTruthy();
            } else {
                logger.error(`Expected The Lowest Monthly EUI - Non Zero and Actual EUI is - ${lowestMonthEUI}`);
                expect(true).toBe(false);
            }
            reporter.endStep();
        });

        and('Verify Energy Usage Intensity Text', async () => {
            reporter.startStep(`And Verify Energy Usage Intensity Text`);
            let energyUsage_IntensityTxt = await getPropertyValueByXpath(BuildingManager.div.energy_Usage_Intensity_Txt, "textContent")
            let conFig = await getEnvConfig()
            reporter.startStep(`Expected Energy Usage Intensity Text  - ${conFig.Building3[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
            if (energyUsage_IntensityTxt === conFig.Building3[buildingName].energy_Intensity_Txt) {
                logger.info(`Expected Energy Usage Intensity Text  - ${conFig.Building3[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`)
                expect(conFig.Building3[buildingName].energy_Intensity_Txt).toBe(energyUsage_IntensityTxt);
            } else {
                logger.error(`Expected Energy Usage Intensity Text  - ${conFig.Building3[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
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
                performAction("click", BuildingManager.a.energy_Page),
                waitForNetworkIdle(120000)
            ])

            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.p.high_AverageMonthYear, "textContent")
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

            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.p.low_AverageMonthYear, "textContent")
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

            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.div.highmonthInten, "textContent")
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

            let averageMonthYearVal = await getPropertyValueByXpath(BuildingManager.div.lowMonthInten, "textContent")
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

        //verify the tenant count
        and('Verify the Tenant count', async () => {
            reporter.startStep(`And Verify the Tenant count`);
            let conFig = await getEnvConfig()

            const tenantInformationXpath = await getPropertyValueByXpath(BuildingManager.div.tenant_info, "textContent");
            logger.info(tenantInformationXpath);
            const ten_count = tenantInformationXpath.split('of')[1].trim().split(',')[0].trim();
            logger.info(ten_count);
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            //Here to fetch from the config file and print the tenant count
            const expectedTenantList = conFig.Building3[buildingName].EnergyUsage;
            // Get the count of expected tenants
            const tenantCount = expectedTenantList.length;
            logger.info(`Tenant Count is : ${tenantCount}`);
            const tenantsTest = (`${tenantCount} tenants`);
            logger.info(tenantsTest);
            //verify the tenants count
            reporter.startStep(`Expected tenant count is : ${ten_count} and Actual tenant count is : ${tenantsTest}`);
            if (ten_count == tenantsTest) {
                logger.info(`Expected tenant count is : ${ten_count} and Actual tenant count is : ${tenantsTest}`);
                expect(ten_count).toBe(tenantsTest);
            } else {
                logger.error(`Expected tenant count is : ${ten_count} and Actual tenant count is : ${tenantsTest}`);
                expect(true).toBe(false);
            }
            // End the test step in the reporter
            reporter.endStep();
            reporter.endStep();
        })

        //verify the last usage tenant month
        and('Verify the last Updated tenant usage month', async () => {
            reporter.startStep('Verify the last Updated tenant usage month')
            const lastUpdatedUsage = await getPropertyValueByXpath(BuildingManager.div.tenant_info, "textContent");
            logger.info(lastUpdatedUsage)
            const datepart = lastUpdatedUsage.split(" – ");
            logger.info(datepart)
            const date = datepart[1];
            logger.info(date);
            const month = date.split(' ')[0]; // Split by space and take the first part
            logger.info(month); // Output: "Sep"
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");

            const now = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const estTime = `${monthNames[now.getMonth() - 1].substr(0, 3)}`;
            logger.info('Current EST Time:', estTime);

            //start step
            reporter.startStep(`Expected last usage tenant month is : ${estTime} and Actual last usage tenant month is : ${month}`);
            //verify the last usage tenant month
            if (estTime == month) {
                logger.info(`Expected last usage tenant month is : ${estTime} and Actual last usage tenant month is : ${month}`);
                expect(estTime).toBe(month);
            } else {
                logger.error(`Expected last usage tenant month is : ${estTime} and Actual last usage tenant month is : ${month}`);
                expect(true).toBe(false);
            }

            reporter.endStep();
            reporter.endStep();
        })


        and('Verify the energy usage graph', async () => {
            reporter.startStep('And Verify the energy usage graph')
            let eui_x_array = await getElementHandleByXpath(BuildingManager.img.energyUsageGraph)
            let length = eui_x_array.length;
            logger.info(length);
            let energyUsageIntensityArray = []; // Initialize an array to store values
            let simplifiedMonths = []; // Initialize an array to store values
            // energyUsageArray
            for (let i = 0; i < eui_x_array.length; i++) {
                let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                let simplifiedEnergyUsageXpath = energyUsageXpath.split(' ')[0];
                energyUsageIntensityArray.push(energyUsageXpath);
                simplifiedMonths.push(simplifiedEnergyUsageXpath.toLowerCase()); // Add the value to the array
                // logger.info(simplifiedEnergyUsageXpath)
                // Perform your action with energyUsageXpath here
            }
            for (let i = 1; i < energyUsageIntensityArray.length; i++) {
                logger.info((energyUsageIntensityArray[energyUsageIntensityArray.length - i]))
            }
            logger.info(energyUsageIntensityArray);
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                logger.info("simplifiedMonths[simplifiedMonths.length - i] : " + simplifiedMonths[simplifiedMonths.length - i]);
            }
            logger.info("simplifiedMonths : " + simplifiedMonths);
            //screenshot
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");


            const now = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const currentMonthIndex = now.getMonth();

            const getAbbreviatedMonthName = (index) => {
                return monthNames[index].substr(0, 3).toLowerCase();
            };

            // let estTime = "";
            let allEstMonths = []
            for (let i = 1; i < length + 1; i++) {
                // console.log(length)
                const monthIndex = (currentMonthIndex - i + 12) % 12;
                // estTime += getAbbreviatedMonthName(monthIndex) + '\n';
                allEstMonths.push(getAbbreviatedMonthName(monthIndex))

            }
            // console.log('Current EST Time:', estTime);
            console.log("allEstMonths")

            console.log(allEstMonths)
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                reporter.startStep(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);

                if (allEstMonths[i - 1] == simplifiedMonths[simplifiedMonths.length - i]) {
                    logger.info(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(allEstMonths[i - 1]).toBe(simplifiedMonths[simplifiedMonths.length - i]);
                } else {
                    logger.error(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify the energy use Intensity graph', async () => {
            reporter.startStep('And Verify the energy use Intensity graph');
            let eui_x_array = await getElementHandleByXpath(BuildingManager.img.energyUseIntensity)
            let length = eui_x_array.length;
            logger.info(length);
            let energyUsageIntensityArray = []; // Initialize an array to store values
            let simplifiedMonths = []; // Initialize an array to store values
            // energyUsageArray
            for (let i = 0; i < eui_x_array.length; i++) {
                let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                let simplifiedEnergyUsageXpath = energyUsageXpath.split(' ')[0];
                energyUsageIntensityArray.push(energyUsageXpath);
                simplifiedMonths.push(simplifiedEnergyUsageXpath.toLowerCase()); // Add the value to the array
                // logger.info(simplifiedEnergyUsageXpath)
                // Perform your action with energyUsageXpath here
            }
            for (let i = 1; i < energyUsageIntensityArray.length; i++) {
                logger.info((energyUsageIntensityArray[energyUsageIntensityArray.length - i]))
            }
            logger.info(energyUsageIntensityArray);
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                logger.info("simplifiedMonths[simplifiedMonths.length - i] : " + simplifiedMonths[simplifiedMonths.length - i]);
            }
            logger.info("simplifiedMonths : " + simplifiedMonths);
            //screenshot
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");

            const now = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const currentMonthIndex = now.getMonth();

            const getAbbreviatedMonthName = (index) => {
                return monthNames[index].substr(0, 3).toLowerCase();
            };

            // let estTime = "";
            let allEstMonths = []
            for (let i = 1; i < length + 1; i++) {
                // console.log(length)
                const monthIndex = (currentMonthIndex - i + 12) % 12;
                // estTime += getAbbreviatedMonthName(monthIndex) + '\n';
                allEstMonths.push(getAbbreviatedMonthName(monthIndex))

            }
            // console.log('Current EST Time:', estTime);
            console.log("allEstMonths")

            console.log(allEstMonths)
            for (let i = 1; i < simplifiedMonths.length + 1; i++) {
                reporter.startStep(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);

                if (allEstMonths[i - 1] == simplifiedMonths[simplifiedMonths.length - i]) {
                    logger.info(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(allEstMonths[i - 1]).toBe(simplifiedMonths[simplifiedMonths.length - i]);
                } else {
                    logger.error(`Expected last usage tenant month is : ${allEstMonths[i - 1]} and Actual last usage tenant month is : ${simplifiedMonths[simplifiedMonths.length - i]}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });
    });
});