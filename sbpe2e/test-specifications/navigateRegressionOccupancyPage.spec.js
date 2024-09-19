import { assert } from 'console';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, delay, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle, getDefaultValueByXPath } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab, envTab, loginPage, verifyBuildPage, commons, tenantAdmin, occupancyPageVerify } from '../constants/locators';
import { environment_Sensor } from '../constants/environment_sensor';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding, givenIamLoggedTn, } from './shared-steps';
import exp from 'constants';
let action;


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateRegressionOccupancyPage.feature',
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

    test('Navigate the <Building> and Verify The Occupancy Today Page', async ({
        given,
        when,
        then,
        and,
    }) => {
        let online_sensors, date, day, hours, buildingName
        givenIamLoggedIn(given)
        when(/^I select "(.*)"$/, async (building) => {
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`)
            buildingName = building
            await delay(3000)
            await performAction('click', commons.button.selectBuilding)
            await delay(4000)
            await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
            await Promise.all([
                performAction('click', `//ul[@role='menu']//li[span='${building}']`),
                waitForNetworkIdle(120000) //2mins
            ])
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            reporter.endStep();
        });

        then('Verify Today Occupancy Page last Update Time', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify Today Occupancy Page last Update Time");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['occ_last_Update_Time'] == 'NA') {
                // Log an error if not available
                logger.error(`Today Occupancy Page last Update Time is not available in ${buildingName}`)
                reporter.startStep(`Today Occupancy Page last Update Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                await delay(6000)
                // Click on the occupancy tab and wait for network idle
                await Promise.all([
                    performAction("click", buildingOverview.a.occupancyTab),
                    waitForNetworkIdle(120000)
                ])
                // Wait for 2 seconds
                await delay(2000)
                // Click on the "Today" button again and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.today),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000)
                await Promise.all([
                    performAction("click", tenantAdmin.button.today),
                    waitForNetworkIdle(120000)
                ])
                // Wait for 4 seconds
                await delay(4000)
                // Take a screenshot and attach it to the report
                let ss = await customScreenshot('env.png')
                reporter.addAttachment("env", ss, "image/png");
                // Get the last updated time from the web page
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.occupancy_LastUpDate, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
                // Calculate the time difference in minutes
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
                // Log and report the time comparison
                reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        // And Verify The Building Occupancy Title
        and('Verify The Building Occupancy Title in Occupancy Today Page', async () => {
            reporter.startStep(`And Verify The Building Occupancy Title in Occupancy Today Page`);
            // Load the environment configuration.
            let configFile = await getEnvConfig()
            // Check if Building Occupancy Title is available
            if (configFile.Building[buildingName]['Building_Occupancy_Title'] == 'NA') {
                logger.error(`The Building Occupancy Title is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // If the title is not 'NA', proceed to check it on the web page.
                let building_Occupancy_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.buildingOccupancyTxt, "textContent")
                const building_Occupancy_Txt = building_Occupancy_Txt_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Building Occupancy Title Text  - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
                // Compare the expected title text with the actual text on the web page.
                if (building_Occupancy_Txt === conFig.Building[buildingName].buildOccupancy_Txt) {
                    // Log a success message if the texts match.
                    logger.info(`Expected Building Occupancy Text   - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`)
                    expect(conFig.Building[buildingName].buildOccupancy_Txt).toBe(building_Occupancy_Txt);
                } else {
                    logger.error(`Expected Building Occupancy Text   - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Real Time Occupancy percentage in Occupancy Today Page
        and('Verify The Real Time Occupancy percentage in Occupancy Today Page', async () => {
            reporter.startStep(`And Verify The Real Time Occupancy percentage in Occupancy Today Page`);
            // Get environment configuration.
            let configFile = await getEnvConfig()
            // Check if the Real Time Occupancy percentage is 'NA' in the configuration.
            if (configFile.Building[buildingName]['Real_Time_Occ_percentage'] == 'NA') {
                // If the Real Time Occupancy percentage is not available, log an error
                logger.error(`The Real Time Occupancy percentage is not available in ${buildingName}`)
                reporter.startStep(`The Real Time Occupancy percentage is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the current day and date in the America/New_York timezone.
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        let realTime_OccupancyPercent = await getPropertyValueByXpath(tenantAdmin.p.realTime_Occupancy_Percent, "textContent")
                        reporter.startStep(`Expected Today Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
                        // Check if the Real Time Occupancy percentage is greater than 0%
                        if (realTime_OccupancyPercent > 0 + "%") {
                            logger.info(`Expected Today Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`)
                            expect(realTime_OccupancyPercent > 0 + "%").toBeTruthy();
                        } else {
                            logger.error(`Expected Today Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
                            // If the percentage is not greater than 0%, log an error and fail the test.
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    } else {
                        logger.info("Not busy time; Ignore Real Time Occupancy percentage")
                        // Log that it's not a busy time and skip the verification step.
                        reporter.startStep(`Not busy time; Ignore Real Time Occupancy percentage`);
                        reporter.endStep();
                    }
                } else {
                    logger.info("It is weekend!; Ignore Real Time Occupancy percentage")
                    // Log that it's the weekend and skip the verification step.
                    reporter.startStep(`It is weekend!; Ignore Real Time Occupancy percentage`);
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });

        //And Verify The Average occupancy over last 90 days in Occupancy Today Page
        and('Verify The Average occupancy over last 90 days in Occupancy Today Page', async () => {
            // Start a reporting step
            reporter.startStep(`And Verify The Average occupancy over last 90 days in Occupancy Today Page`);
            // Get environment configuration
            let configFile = await getEnvConfig()
            // Check if Average occupancy over the last 90 days is available
            if (configFile.Building[buildingName]['Avg_Occ_overlast90days'] == 'NA') {
                // Log an error message and report it
                logger.error(`The Average occupancy over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Average occupancy over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {


                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average occupancy over last 90 days equal zero in ${buildingName}`)
                    reporter.startStep(`The Average occupancy over last 90 days  equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
    
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average occupancy over last 90 days in Occupancy are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average occupancy over last 90 days in Occupancy on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                // If available, get the Average Occupancy value from a specific location (XPath)
                let AverageOccupancy = await getPropertyValueByXpath(tenantAdmin.p.Average_Occupancy, "textContent")
                // Start a reporting step with the expected and actual values
                reporter.startStep(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
                // Check if Average Occupancy is greater than 0%
                if (AverageOccupancy > 0 + "%") {
                    // Log an info message and use an assertion to ensure it's true
                    logger.info(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`)
                    expect(AverageOccupancy > 0 + "%").toBeTruthy();
                } else {
                    // If not greater than 0%, log an error and fail the assertion
                    logger.error(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            }
        }
            reporter.endStep();
        });

        and('Verify Peak occupancy over last 90 days in Occupancy Today Page', async () => {
            reporter.startStep(`And Verify Peak occupancy over last 90 days in Occupancy Today Page`);
            let configFile = await getEnvConfig()
            // Check if Peak Occupancy over the last 90 days is available 
            if (configFile.Building[buildingName]['Peak_Occ_overlast90days'] == 'NA') {
                // If not available, log an error and report it in the test report.
                logger.error(`The Peak occupancy over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Peak occupancy over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {

                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Peak occupancy over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Peak occupancy over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Peak occupancy over last 90 days in Occupancy are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Peak occupancy over last 90 days in Occupancy on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                // If available, get the peak occupancy value from the web page.
                let peak_Occupancy = await getPropertyValueByXpath(tenantAdmin.p.peakOccupancy, "textContent")
                reporter.startStep(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
                // Check if the peak occupancy is greater than 0%.
                if (peak_Occupancy > 0 + "%") {
                    // If it is greater than 0%, log it as expected and assert it's true in the test.
                    logger.info(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`)
                    expect(peak_Occupancy > 0 + "%").toBeTruthy();
                } else {
                    // If it's not greater than 0%, log it as an error and fail the test.
                    logger.error(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
                    expect(true).toBe(false);
                }
                // End the step in the test report.
                reporter.endStep();
            }
        }
    }
            // End the main step in the test report.
            reporter.endStep();
        });

        and('Verify The Total People Count in Occupancy Today Page', async () => {
            reporter.startStep(`And Verify The Total People`);
            // Check the building if Total People Count is 'NA' in the configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Total_People_Count'] == 'NA') {
                // Log an error if Total People Count is not available
                logger.error(`The Total People Count is not available in ${buildingName}`)
                reporter.startStep(`The Total People Count is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the total real-time occupancy count from the web page 
                let totalRealTime = await getPropertyValueByXpath(tenantAdmin.p.total_RealTime, "textContent")
                let totalRealTimeSplit = totalRealTime.split("/");
                let total_Real_Time1 = totalRealTimeSplit[0]
                let total_Real_Time = totalRealTimeSplit[1]
                // Split the total real-time count to extract the numeric count
                let totalRealTimeSplits = total_Real_Time.split(" ");
                let total_Real_Time_Count = totalRealTimeSplits[0]
                let conFig = await getEnvConfig()
                reporter.startStep(`Verify The Real Time Occupancy Count `);
                reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
                // Check if the actual real-time count matches the expected count
                if (total_Real_Time_Count === conFig.Building[buildingName].total_People) {
                    // Log and assert if it matches
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Real_Time_Count);
                } else {
                    // Log an error and fail the test if it doesn't match
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
                // Get the EST current day and time
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        reporter.startStep(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
                        // Check if the Total People Count on Real Time Occupancy is greater than 0
                        if (total_Real_Time1 > 0) {
                            logger.info(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`)
                            expect(total_Real_Time1 > 0).toBeTruthy();
                        } else {
                            // If Total People Count on Real Time Occupancy is not greater than 0, log an error and fail the test.
                            logger.error(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
                            expect(true).toBe(false)
                        }
                        reporter.endStep();

                    } else {
                        logger.info("Not busy time; Ignore The Total People Count on Real Time Occupancy is Non Zero")
                        // Log that it's not a busy time and skip the verification step.
                        reporter.startStep(`Not busy time;Ignore The Total People Count on Real Time Occupancy is Non Zero`);
                        reporter.endStep();
                    }
                } else {
                    logger.info("It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero")
                    // Log that it's the weekend and skip the verification step.
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
                
                reporter.startStep(`Expected The Total People Count on Average occupancy over last 90 days - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
                if (total_Average_Time_Count === conFig.Building[buildingName].total_People) {
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Average_Time_Count);
                } else {
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();


                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average occupancy over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average occupancy over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average occupancy over last 90 days in Occupancy are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average occupancy over last 90 days in Occupancy on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                reporter.startStep(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
                if (total_Average_Time1 > 0) {
                    logger.info(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`)
                    expect(total_Average_Time1 > 0).toBeTruthy();
                } else {
                    logger.error(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            }
                reporter.endStep();

                let totalPeakTime = await getPropertyValueByXpath(tenantAdmin.p.total_PeakTime, "textContent")
                let totalPeakTimeSplit = totalPeakTime.split("/");
                let total_Peak_Time1 = totalPeakTimeSplit[0]
                let total_Peak_Time = totalPeakTimeSplit[1]
                let total_Peak_TimeSplits = total_Peak_Time.split(" ");
                let total_Peak_Time_Count = total_Peak_TimeSplits[0]
                reporter.startStep(`Verify The  Peak occupancy over last 90 days `);
                reporter.startStep(`Expected The Total People Count on Peak occupancy over last 90 days - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
                if (total_Peak_Time_Count === conFig.Building[buildingName].total_People) {
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Peak_Time_Count);
                } else {
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();

                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Peak occupancy over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Peak occupancy over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Peak occupancy over last 90 days in Occupancy are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Peak occupancy over last 90 days in Occupancy on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                reporter.startStep(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
                if (total_Peak_Time1 > 0) {
                    logger.info(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`)
                    expect(total_Peak_Time1 > 0).toBeTruthy();
                } else {
                    logger.error(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
        }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Lobby Foot Traffic Tiltle', async () => {
            reporter.startStep(`And Verify Lobby Foot Traffic Tiltle`);
            //Get environment configuration information.
            let configFile = await getEnvConfig()
            // Check if the average foot traffic data for the last 90 days is available in the configuration.
            if (configFile.Building[buildingName]['Lobby_FootTraffic_Tiltle'] == 'NA') {
                logger.error(`The Lobby Foot Traffic Tiltle is not available in ${buildingName}`)
                reporter.startStep(`The Lobby Foot Traffic Tiltle is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the foot traffic data from a web page element using an XPath selector.
                let lobby_Active_Txt_trim = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Txt, "textContent")
                const lobby_Active_Txt = lobby_Active_Txt_trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Lobby Active Title Text  - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
                // Check if the actual foot traffic count is greater than 0.
                if (lobby_Active_Txt === conFig.Building[buildingName].lobbyTitle) {
                    logger.info(`Expected Lobby Active Title Text   - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`)
                    expect(conFig.Building[buildingName].lobbyTitle).toBe(lobby_Active_Txt);
                } else {
                    // Log an error message and expect the condition to be false.
                    logger.error(`Expected Lobby Active Title Text   - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify The Lobby Foot Traffic Last upadte Time in Occupancy Today Page
        and('Verify The Lobby Foot Traffic Last upadte Time in Occupancy Today Page', async () => {
            reporter.startStep(`And Verify The Lobby Foot Traffic Last upadte Time in Occupancy Today Page`);
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['LobbyTraffic_LastupadteTime'] == 'NA') {
                // Log an error message if the last update time is not available
                logger.error(`The Lobby Foot Traffic Last upadte Time is not available in ${buildingName}`)
                reporter.startStep(`The Lobby Foot Traffic Last upadte Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Time, "textContent")
                // Split the retrieved time to isolate the time portion.
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current date and time in the America/New_York time zone.
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
                // Calculate the time difference in minutes between EST and the retrieved time.
                let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
                reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //verify Real-time foot traffic is non zero in Occupancy Today Page
        and('verify Real-time foot traffic is non zero in Occupancy Today Page', async () => {
            reporter.startStep(`And verify Real-time foot traffic is non zero in Occupancy Today Page`);
            let configFile = await getEnvConfig()
            // Check if Real-time foot traffic is available in the given building
            if (configFile.Building[buildingName]['RealTimefoot_traffic'] == 'NA') {
                logger.error(`The Real-time foot traffic is not available in ${buildingName}`)
                reporter.startStep(`The Real-time foot traffic is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let RealTime_FootTraffic_lobby = await getPropertyValueByXpath(tenantAdmin.p.RealTime_FootTraffic, "textContent")
                let RealTime_FootTraffic_lobbySplit = RealTime_FootTraffic_lobby.split(" ");
                let RealTime_FootTraffic = RealTime_FootTraffic_lobbySplit[0]
                // Get the current day and time in the New York timezone
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        reporter.startStep(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
                        if (RealTime_FootTraffic > 0) {
                            logger.info(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`)
                            expect(RealTime_FootTraffic > 0).toBeTruthy();
                        } else {
                            logger.error(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
                            expect(true).toBe(false)
                        }
                        reporter.endStep();

                    } else {
                        // Log that it's not a busy time and ignore the check
                        logger.info("Not busy time; Ignore The Real-time foot traffic is non zero")
                        reporter.startStep(`Not busy time;Ignore Real-time foot traffic is non zero`);
                        reporter.endStep();
                    }
                } else {
                    // Log that it's the weekend and ignore the check
                    logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
                    reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });

        //And verify the Average foot traffic over last 90 days in Occupancy Today Page
        and('verify the Average foot traffic over last 90 days in Occupancy Today Page', async () => {
            reporter.startStep(`And verify the Average foot traffic over last 90 days in Occupancy Today Page`);
            let configFile = await getEnvConfig()
            // Check if Average foot traffic for the last 90 days is available for a specific building
            if (configFile.Building[buildingName]['Avgfoottraffic_90days'] == 'NA') {
                logger.error(`The Average foot traffic over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Average foot traffic over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average foot traffic over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average foot traffic over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                let lobby_90Days_FootTraffic = await getPropertyValueByXpath(tenantAdmin.div.lobby90Days_FootTraffic, "textContent")
                let lobby_90Days_FootTrafficSplit = lobby_90Days_FootTraffic.split(" ");
                let lobby_90Days_Foot_Traffic = lobby_90Days_FootTrafficSplit[0]
                // Get the current day and time in the New York timezone
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                // Check if it's not a weekend (Sat or Sun) 
                if (day != 'Sat' && day != 'Sun') {
                    reporter.startStep(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
                    // Check if the actual foot traffic count is greater than 0
                    if (lobby_90Days_Foot_Traffic > 0) {
                        logger.info(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`)
                        // Use an assertion to check if the condition is true
                        expect(lobby_90Days_Foot_Traffic > 0).toBeTruthy();
                    } else {
                        logger.error(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
                        // Use an assertion to indicate test failure
                        expect(true).toBe(false)
                    }
                    reporter.endStep();
                } else {
                    // Log that it's the weekend and ignore the check
                    logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
                    reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
                    reporter.endStep();
                }
            }
            }
            reporter.endStep();
        });

        and('verify The Building Occupancy Details Title in Occupancy Today Page', async () => {
            reporter.startStep(`And verify The Building Occupancy Details Title in Occupancy Today Page`);
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_DetailsTitle'] == 'NA') {
                // Log an error message if the title is not available
                logger.error(`The Building Occupancy Details Title is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Details Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let occ_Detail_Title_trim = await getPropertyValueByXpath(occupancyPageVerify.h5.occ_Detail_Title, "textContent")
                const occ_Detail_Title_txt = occ_Detail_Title_trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`);
                // Check if the actual title matches the expected title from the configuration
                if (occ_Detail_Title_txt === conFig.Building[buildingName].buildOcc_Details_Title) {
                    // Log a success message if the titles match
                    logger.info(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`)
                    // Use an assertion to verify that the titles are equal
                    expect(conFig.Building[buildingName].buildOcc_Details_Title).toBe(occ_Detail_Title_txt);
                } else {
                    // Log an error message if the titles do not match
                    logger.error(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`);
                    // Use an assertion to fail the test
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('verify The Building Occupancy Details Last upadte Time in Occupancy Today Page', async () => {
            reporter.startStep("verify The Building Occupancy Details Last upadte Time in Occupancy Today Page");
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occ_Details_LastupadteTime'] == 'NA') {
                logger.error(`The Building Occupancy Details Last upadte Time is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Details Last upadte Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.span.building_Occupancy_lastTime, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
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
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify All Building Entrance Are non zero in Occupancy Today Page
        and('Verify All Building Entrance Are non zero in Occupancy Today Page', async () => {
            reporter.startStep("And Verify All Building Entrance Are non zero in Occupancy Today Page");
            let configFile = await getEnvConfig()
            // Check if the building entrance data is available for the specified building
            if (configFile.Building[buildingName]['Building_Entrance'] == 'NA') {
                // Log an error if the data is not available
                logger.error(`The Building Entrance is not available in ${buildingName}`)
                reporter.startStep(`The Building Entrance is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        let highRaiseBuildOccupancy = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance1, "textContent")
                        let highRaiseBuildOccupancySplit = highRaiseBuildOccupancy.split(" ");
                        let entrance1 = highRaiseBuildOccupancySplit[0]

                        // Check if the data for Entrance 1 is available
                        if (configFile.Building[buildingName]['build_Entrance1'] == 'NA') {
                            logger.error(`The Building Entrance 1  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 1 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            reporter.startStep(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`);
                            // Log and assert that Entrance 1 occupancy is non-zero
                            if (entrance1 > 0) {
                                logger.info(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`)
                                expect(entrance1 > 0).toBeTruthy();
                            } else {
                                // Log an error and fail the test if Entrance 1 occupancy is zero
                                logger.error(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }

                        //verify The Entrance 2 Occupancy is non zero
                        // Check if the data for Entrance 2 is available
                        if (configFile.Building[buildingName]['build_Entrance2'] == 'NA') {
                            logger.error(`The Building Entrance 2  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 2 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let lowRaiseWest_BuildOcc = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance2, "textContent")
                            let lowRaiseWest_BuildOccSplit = lowRaiseWest_BuildOcc.split(" ");
                            let entrance2 = lowRaiseWest_BuildOccSplit[0]
                            reporter.startStep(`Expected The Entrance-2 is non zero and Actual  Count - ${entrance2}`);
                            // Log and assert that Entrance 2 occupancy is non-zero
                            if (entrance2 > 0) {
                                logger.info(`Expected TThe Entrance-2 is non zero and Actual  Count - ${entrance2}`)
                                expect(entrance2 > 0).toBeTruthy();
                            } else {
                                // Log an error and fail the test if Entrance 2 occupancy is zero
                                logger.error(`Expected The Entrance-2 is non zero and Actual  Count - ${entrance2}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 3 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance3'] == 'NA') {
                            logger.error(`The Building Entrance 3  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 3 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let lowRaiseEast_BuildOcc = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance3, "textContent")
                            let lowRaiseEast_BuildOccSplit = lowRaiseEast_BuildOcc.split(" ");
                            let entrance3 = lowRaiseEast_BuildOccSplit[0]
                            reporter.startStep(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`);
                            if (entrance3 > 0) {
                                logger.info(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`)
                                expect(entrance3 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();

                        }
                        // verify The Entrance 4 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance4'] == 'NA') {
                            logger.error(`The Building Entrance 4  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 4  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance4 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance4, "textContent")
                            let buidling_Entrance4Split = buidling_Entrance4.split(" ");
                            let entrance4 = buidling_Entrance4Split[0]
                            reporter.startStep(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`);
                            if (entrance4 > 0) {
                                logger.info(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`)
                                expect(entrance4 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 5 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance5'] == 'NA') {
                            logger.error(`The Building Entrance 5  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 5  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance5, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance5 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`);
                            if (entrance5 > 0) {
                                logger.info(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`)
                                expect(entrance5 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 6 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance6'] == 'NA') {
                            logger.error(`The Building Entrance 6  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 6  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance6, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance6 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`);
                            if (entrance6 > 0) {
                                logger.info(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`)
                                expect(entrance6 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 7 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance7'] == 'NA') {
                            logger.error(`The Building Entrance 7  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 7  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance7, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance7 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`);
                            if (entrance7 > 0) {
                                logger.info(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`)
                                expect(entrance7 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                    } else {
                        // Log that it's not a busy time and ignore the check
                        logger.info("Not busy time; Ignore Building Occupancy Count is non zero")
                        reporter.startStep(`Not busy time; Ignore Building Occupancy Count is non zero`);
                        reporter.endStep();
                    }
                } else {
                    // Log that it's the weekend and ignore the check
                    logger.info("It is weekend!; Ignore Building Occupancy Count is non zero")
                    reporter.startStep(`It is weekend!; Ignore Building Occupancy Count is non zero`);
                    reporter.endStep();
                }
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
        givenIamLoggedIn(given)
        when(/^I select "(.*)"$/, async (building) => {
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`)
            buildingName = building
            await delay(3000)
            await performAction('click', commons.button.selectBuilding)
            await delay(4000)
            await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
            await Promise.all([
                performAction('click', `//ul[@role='menu']//li[span='${building}']`),
                waitForNetworkIdle(120000) //2mins
            ])
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            reporter.endStep();
        });

        then('Verify Yesterday Occupancy Page last Update Time', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify Yesterday Occupancy Page last Update Time");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['occ_last_Update_Time'] == 'NA') {
                // Log an error if not available
                logger.error(`Yesterday Occupancy Page last Update Time is not available in ${buildingName}`)
                reporter.startStep(`Yesterday Occupancy Page last Update Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                await delay(6000)
                // Click on the occupancy tab and wait for network idle
                await Promise.all([
                    performAction("click", buildingOverview.a.occupancyTab),
                    waitForNetworkIdle(120000)
                ])
                // Wait for 2 seconds
                await delay(2000)
                // Click on the "Yesterday" button again and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.today),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000)                             
                await Promise.all([
                    performAction("click", tenantAdmin.button.yesterday),
                    waitForNetworkIdle(120000)
                ])
                // Wait for 2 seconds
                await delay(2000)
                // Take a screenshot and attach it to the report
                let ss = await customScreenshot('env.png')
                reporter.addAttachment("env", ss, "image/png");
                // Get the last updated time from the web page
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.occupancy_LastUpDate, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
                // Calculate the time difference in minutes
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
                // Log and report the time comparison
                reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        // And Verify The Building Occupancy Title
        and('Verify The Building Occupancy Title in Occupancy Yesterday Page', async () => {
            reporter.startStep(`And Verify The Building Occupancy Title in Occupancy Yesterday Page`);
            // Load the environment configuration.
            let configFile = await getEnvConfig()
            // Check if Building Occupancy Title is available
            if (configFile.Building[buildingName]['Building_Occupancy_Title'] == 'NA') {
                logger.error(`The Building Occupancy Title is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // If the title is not 'NA', proceed to check it on the web page.
                let building_Occupancy_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.buildingOccupancyTxt, "textContent")
                const building_Occupancy_Txt = building_Occupancy_Txt_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Building Occupancy Title Text  - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
                // Compare the expected title text with the actual text on the web page.
                if (building_Occupancy_Txt === conFig.Building[buildingName].buildOccupancy_Txt) {
                    // Log a success message if the texts match.
                    logger.info(`Expected Building Occupancy Text   - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`)
                    expect(conFig.Building[buildingName].buildOccupancy_Txt).toBe(building_Occupancy_Txt);
                } else {
                    logger.error(`Expected Building Occupancy Text   - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Real Time Occupancy percentage in Occupancy Yesterday Page
        and('Verify The Real Time Occupancy percentage in Occupancy Yesterday Page', async () => {
            reporter.startStep(`And Verify The Real Time Occupancy percentage in Occupancy Yesterday Page`);
            // Get environment configuration.
            let configFile = await getEnvConfig()
            // Check if the Real Time Occupancy percentage is 'NA' in the configuration.
            if (configFile.Building[buildingName]['Real_Time_Occ_percentage'] == 'NA') {
                // If the Real Time Occupancy percentage is not available, log an error
                logger.error(`The Real Time Occupancy percentage is not available in ${buildingName}`)
                reporter.startStep(`The Real Time Occupancy percentage is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the current day and date in the America/New_York timezone.
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        let realTime_OccupancyPercent = await getPropertyValueByXpath(tenantAdmin.p.realTime_Occupancy_Percent, "textContent")
                        reporter.startStep(`Expected Yesterday Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
                        // Check if the Real Time Occupancy percentage is greater than 0%
                        if (realTime_OccupancyPercent > 0 + "%") {
                            logger.info(`Expected Yesterday Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`)
                            expect(realTime_OccupancyPercent > 0 + "%").toBeTruthy();
                        } else {
                            logger.error(`Expected Yesterday Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
                            // If the percentage is not greater than 0%, log an error and fail the test.
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    } else {
                        logger.info("Not busy time; Ignore Real Time Occupancy percentage")
                        // Log that it's not a busy time and skip the verification step.
                        reporter.startStep(`Not busy time; Ignore Real Time Occupancy percentage`);
                        reporter.endStep();
                    }
                } else {
                    logger.info("It is weekend!; Ignore Real Time Occupancy percentage")
                    // Log that it's the weekend and skip the verification step.
                    reporter.startStep(`It is weekend!; Ignore Real Time Occupancy percentage`);
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });

        //And Verify The Average occupancy over last 90 days in Occupancy Yesterday Page
        and('Verify The Average occupancy over last 90 days in Occupancy Yesterday Page', async () => {
            // Start a reporting step
            reporter.startStep(`And Verify The Average occupancy over last 90 days in Occupancy Yesterday Page`);
            // Get environment configuration
            let configFile = await getEnvConfig()
            // Check if Average occupancy over the last 90 days is available
            if (configFile.Building[buildingName]['Avg_Occ_overlast90days'] == 'NA') {
                // Log an error message and report it
                logger.error(`The Average occupancy over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Average occupancy over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average occupancy over last 90 days equal zero in ${buildingName}`)
                    reporter.startStep(`The Average occupancy over last 90 days  equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average occupancy over last 90 days in Occupancy are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average occupancy over last 90 days in Occupancy are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                        // If available, get the Average Occupancy value from a specific location (XPath)
                        let AverageOccupancy = await getPropertyValueByXpath(tenantAdmin.p.Average_Occupancy, "textContent")
                        // Start a reporting step with the expected and actual values
                        reporter.startStep(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
                        // Check if Average Occupancy is greater than 0%
                        if (AverageOccupancy > 0 + "%") {
                            // Log an info message and use an assertion to ensure it's true
                            logger.info(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`)
                            expect(AverageOccupancy > 0 + "%").toBeTruthy();
                        } else {
                            // If not greater than 0%, log an error and fail the assertion
                            logger.error(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                //     } else {
                //         logger.info("Not busy time; Ignore Real Time Occupancy percentage")
                //         // Log that it's not a busy time and skip the verification step.
                //         reporter.startStep(`Not busy time; Ignore Real Time Occupancy percentage`);
                //         reporter.endStep();
                //     }
                // } else {
                //     logger.info("It is weekend!; Ignore Real Time Occupancy percentage")
                //     // Log that it's the weekend and skip the verification step.
                //     reporter.startStep(`It is weekend!; Ignore Real Time Occupancy percentage`);
                //     reporter.endStep();
                 }
            }
        }
            reporter.endStep();
        });

        and('Verify Peak occupancy over last 90 days in Occupancy Yesterday Page', async () => {
            reporter.startStep(`And Verify Peak occupancy over last 90 days in Occupancy Yesterday Page`);
            let configFile = await getEnvConfig()
            // Check if Peak Occupancy over the last 90 days is available 
            if (configFile.Building[buildingName]['Peak_Occ_overlast90days'] == 'NA') {
                // If not available, log an error and report it in the test report.
                logger.error(`The Peak occupancy over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Peak occupancy over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Peak occupancy over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Peak occupancy over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Peak occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Peak occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
    
                // If available, get the peak occupancy value from the web page.
                let peak_Occupancy = await getPropertyValueByXpath(tenantAdmin.p.peakOccupancy, "textContent")
                reporter.startStep(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
                // Check if the peak occupancy is greater than 0%.
                if (peak_Occupancy > 0 + "%") {
                    // If it is greater than 0%, log it as expected and assert it's true in the test.
                    logger.info(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`)
                    expect(peak_Occupancy > 0 + "%").toBeTruthy();
                } else {
                    // If it's not greater than 0%, log it as an error and fail the test.
                    logger.error(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
                    expect(true).toBe(false);
                }
                // End the step in the test report.
                reporter.endStep();
            }
            }
        }
            // End the main step in the test report.
            reporter.endStep();
        });

        and('Verify The Total People Count in Occupancy Yesterday Page', async () => {
            reporter.startStep(`And Verify The Total People`);
            // Check the building if Total People Count is 'NA' in the configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Total_People_Count'] == 'NA') {
                // Log an error if Total People Count is not available
                logger.error(`The Total People Count is not available in ${buildingName}`)
                reporter.startStep(`The Total People Count is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the total real-time occupancy count from the web page 
                let totalRealTime = await getPropertyValueByXpath(tenantAdmin.p.total_RealTime, "textContent")
                let totalRealTimeSplit = totalRealTime.split("/");
                let total_Real_Time1 = totalRealTimeSplit[0]
                let total_Real_Time = totalRealTimeSplit[1]
                // Split the total real-time count to extract the numeric count
                let totalRealTimeSplits = total_Real_Time.split(" ");
                let total_Real_Time_Count = totalRealTimeSplits[0]
                let conFig = await getEnvConfig()
                reporter.startStep(`Verify The Real Time Occupancy Count `);
                reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
                // Check if the actual real-time count matches the expected count
                if (total_Real_Time_Count === conFig.Building[buildingName].total_People) {
                    // Log and assert if it matches
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Real_Time_Count);
                } else {
                    // Log an error and fail the test if it doesn't match
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
                // Get the EST current day and time
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        reporter.startStep(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
                        // Check if the Total People Count on Real Time Occupancy is greater than 0
                        if (total_Real_Time1 > 0) {
                            logger.info(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`)
                            expect(total_Real_Time1 > 0).toBeTruthy();
                        } else {
                            // If Total People Count on Real Time Occupancy is not greater than 0, log an error and fail the test.
                            logger.error(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
                            expect(true).toBe(false)
                        }
                        reporter.endStep();

                    } else {
                        logger.info("Not busy time; Ignore The Total People Count on Real Time Occupancy is Non Zero")
                        // Log that it's not a busy time and skip the verification step.
                        reporter.startStep(`Not busy time;Ignore The Total People Count on Real Time Occupancy is Non Zero`);
                        reporter.endStep();
                    }
                } else {
                    logger.info("It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero")
                    // Log that it's the weekend and skip the verification step.
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
                reporter.startStep(`Expected The Total People Count on Average occupancy over last 90 days - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
                if (total_Average_Time_Count === conFig.Building[buildingName].total_People) {
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Average_Time_Count);
                } else {
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();

                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average occupancy Count over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average occupancy Count over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                reporter.startStep(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
                if (total_Average_Time1 > 0) {
                    logger.info(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`)
                    expect(total_Average_Time1 > 0).toBeTruthy();
                } else {
                    logger.error(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            }
                reporter.endStep();

                let totalPeakTime = await getPropertyValueByXpath(tenantAdmin.p.total_PeakTime, "textContent")
                let totalPeakTimeSplit = totalPeakTime.split("/");
                let total_Peak_Time1 = totalPeakTimeSplit[0]
                let total_Peak_Time = totalPeakTimeSplit[1]
                let total_Peak_TimeSplits = total_Peak_Time.split(" ");
                let total_Peak_Time_Count = total_Peak_TimeSplits[0]
                reporter.startStep(`Verify The  Peak occupancy over last 90 days `);
                reporter.startStep(`Expected The Total People Count on Peak occupancy over last 90 days - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
                if (total_Peak_Time_Count === conFig.Building[buildingName].total_People) {
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Peak_Time_Count);
                } else {
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();

                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Peak occupancy Count over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Peak occupancy Count over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Peak occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Peak occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                reporter.startStep(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
                if (total_Peak_Time1 > 0) {
                    logger.info(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`)
                    expect(total_Peak_Time1 > 0).toBeTruthy();
                } else {
                    logger.error(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Lobby Foot Traffic Tiltle', async () => {
            reporter.startStep(`And Verify Lobby Foot Traffic Tiltle`);
            //Get environment configuration information.
            let configFile = await getEnvConfig()
            // Check if the average foot traffic data for the last 90 days is available in the configuration.
            if (configFile.Building[buildingName]['Lobby_FootTraffic_Tiltle'] == 'NA') {
                logger.error(`The Lobby Foot Traffic Tiltle is not available in ${buildingName}`)
                reporter.startStep(`The Lobby Foot Traffic Tiltle is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the foot traffic data from a web page element using an XPath selector.
                let lobby_Active_Txt_trim = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Txt, "textContent")
                const lobby_Active_Txt = lobby_Active_Txt_trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Lobby Active Title Text  - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
                // Check if the actual foot traffic count is greater than 0.
                if (lobby_Active_Txt === conFig.Building[buildingName].lobbyTitle) {
                    logger.info(`Expected Lobby Active Title Text   - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`)
                    expect(conFig.Building[buildingName].lobbyTitle).toBe(lobby_Active_Txt);
                } else {
                    // Log an error message and expect the condition to be false.
                    logger.error(`Expected Lobby Active Title Text   - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify The Lobby Foot Traffic Last upadte Time in Occupancy Yesterday Page
        and('Verify The Lobby Foot Traffic Last upadte Time in Occupancy Yesterday Page', async () => {
            reporter.startStep(`And Verify The Lobby Foot Traffic Last upadte Time in Occupancy Yesterday Page`);
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['LobbyTraffic_LastupadteTime'] == 'NA') {
                // Log an error message if the last update time is not available
                logger.error(`The Lobby Foot Traffic Last upadte Time is not available in ${buildingName}`)
                reporter.startStep(`The Lobby Foot Traffic Last upadte Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Time, "textContent")
                // Split the retrieved time to isolate the time portion.
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current date and time in the America/New_York time zone.
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
                // Calculate the time difference in minutes between EST and the retrieved time.
                let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
                reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //verify Real-time foot traffic is non zero in Occupancy Yesterday Page
        and('verify Real-time foot traffic is non zero in Occupancy Yesterday Page', async () => {
            reporter.startStep(`And verify Real-time foot traffic is non zero in Occupancy Yesterday Page`);
            let configFile = await getEnvConfig()
            // Check if Real-time foot traffic is available in the given building
            if (configFile.Building[buildingName]['RealTimefoot_traffic'] == 'NA') {
                logger.error(`The Real-time foot traffic is not available in ${buildingName}`)
                reporter.startStep(`The Real-time foot traffic is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let RealTime_FootTraffic_lobby = await getPropertyValueByXpath(tenantAdmin.p.RealTime_FootTraffic, "textContent")
                let RealTime_FootTraffic_lobbySplit = RealTime_FootTraffic_lobby.split(" ");
                let RealTime_FootTraffic = RealTime_FootTraffic_lobbySplit[0]
                // Get the current day and time in the New York timezone
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        reporter.startStep(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
                        if (RealTime_FootTraffic > 0) {
                            logger.info(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`)
                            expect(RealTime_FootTraffic > 0).toBeTruthy();
                        } else {
                            logger.error(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
                            expect(true).toBe(false)
                        }
                        reporter.endStep();

                    } else {
                        // Log that it's not a busy time and ignore the check
                        logger.info("Not busy time; Ignore The Real-time foot traffic is non zero")
                        reporter.startStep(`Not busy time;Ignore Real-time foot traffic is non zero`);
                        reporter.endStep();
                    }
                } else {
                    // Log that it's the weekend and ignore the check
                    logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
                    reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });

        //And verify the Average foot traffic over last 90 days in Occupancy Yesterday Page
        and('verify the Average foot traffic over last 90 days in Occupancy Yesterday Page', async () => {
            reporter.startStep(`And verify the Average foot traffic over last 90 days in Occupancy Yesterday Page`);
            let configFile = await getEnvConfig()
            // Check if Average foot traffic for the last 90 days is available for a specific building
            if (configFile.Building[buildingName]['Avgfoottraffic_90days'] == 'NA') {
                logger.error(`The Average foot traffic over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Average foot traffic over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average foot traffic over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average foot traffic over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                let lobby_90Days_FootTraffic = await getPropertyValueByXpath(tenantAdmin.div.lobby90Days_FootTraffic, "textContent")
                let lobby_90Days_FootTrafficSplit = lobby_90Days_FootTraffic.split(" ");
                let lobby_90Days_Foot_Traffic = lobby_90Days_FootTrafficSplit[0]
                    reporter.startStep(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
                    // Check if the actual foot traffic count is greater than 0
                    if (lobby_90Days_Foot_Traffic > 0) {
                        logger.info(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`)
                        // Use an assertion to check if the condition is true
                        expect(lobby_90Days_Foot_Traffic > 0).toBeTruthy();
                    } else {
                        logger.error(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
                        // Use an assertion to indicate test failure
                        expect(true).toBe(false)
                    }
                    reporter.endStep();
                 }
            }
        }
            reporter.endStep();
        });

        and('verify The Building Occupancy Details Title in Occupancy Yesterday Page', async () => {
            reporter.startStep(`And verify The Building Occupancy Details Title in Occupancy Yesterday Page`);
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_DetailsTitle'] == 'NA') {
                // Log an error message if the title is not available
                logger.error(`The Building Occupancy Details Title is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Details Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let occ_Detail_Title_trim = await getPropertyValueByXpath(occupancyPageVerify.h5.occ_Detail_Title, "textContent")
                const occ_Detail_Title_txt = occ_Detail_Title_trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`);
                // Check if the actual title matches the expected title from the configuration
                if (occ_Detail_Title_txt === conFig.Building[buildingName].buildOcc_Details_Title) {
                    // Log a success message if the titles match
                    logger.info(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`)
                    // Use an assertion to verify that the titles are equal
                    expect(conFig.Building[buildingName].buildOcc_Details_Title).toBe(occ_Detail_Title_txt);
                } else {
                    // Log an error message if the titles do not match
                    logger.error(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`);
                    // Use an assertion to fail the test
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('verify The Building Occupancy Details Last upadte Time in Occupancy Yesterday Page', async () => {
            reporter.startStep("verify The Building Occupancy Details Last upadte Time in Occupancy Yesterday Page");
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occ_Details_LastupadteTime'] == 'NA') {
                logger.error(`The Building Occupancy Details Last upadte Time is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Details Last upadte Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.span.building_Occupancy_lastTime, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
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
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify All Building Entrance Are non zero in Occupancy Yesterday Page
        and('Verify All Building Entrance Are non zero in Occupancy Yesterday Page', async () => {
            reporter.startStep("And Verify All Building Entrance Are non zero in Occupancy Yesterday Page");
            let configFile = await getEnvConfig()
            // Check if the building entrance data is available for the specified building
            if (configFile.Building[buildingName]['Building_Entrance'] == 'NA') {
                // Log an error if the data is not available
                logger.error(`The Building Entrance is not available in ${buildingName}`)
                reporter.startStep(`The Building Entrance is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        let highRaiseBuildOccupancy = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance1, "textContent")
                        let highRaiseBuildOccupancySplit = highRaiseBuildOccupancy.split(" ");
                        let entrance1 = highRaiseBuildOccupancySplit[0]

                        // Check if the data for Entrance 1 is available
                        if (configFile.Building[buildingName]['build_Entrance1'] == 'NA') {
                            logger.error(`The Building Entrance 1  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 1 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            reporter.startStep(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`);
                            // Log and assert that Entrance 1 occupancy is non-zero
                            if (entrance1 > 0) {
                                logger.info(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`)
                                expect(entrance1 > 0).toBeTruthy();
                            } else {
                                // Log an error and fail the test if Entrance 1 occupancy is zero
                                logger.error(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }

                        //verify The Entrance 2 Occupancy is non zero
                        // Check if the data for Entrance 2 is available
                        if (configFile.Building[buildingName]['build_Entrance2'] == 'NA') {
                            logger.error(`The Building Entrance 2  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 2 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let lowRaiseWest_BuildOcc = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance2, "textContent")
                            let lowRaiseWest_BuildOccSplit = lowRaiseWest_BuildOcc.split(" ");
                            let entrance2 = lowRaiseWest_BuildOccSplit[0]
                            reporter.startStep(`Expected The Entrance-2 is non zero and Actual  Count - ${entrance2}`);
                            // Log and assert that Entrance 2 occupancy is non-zero
                            if (entrance2 > 0) {
                                logger.info(`Expected TThe Entrance-2 is non zero and Actual  Count - ${entrance2}`)
                                expect(entrance2 > 0).toBeTruthy();
                            } else {
                                // Log an error and fail the test if Entrance 2 occupancy is zero
                                logger.error(`Expected The Entrance-2 is non zero and Actual  Count - ${entrance2}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 3 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance3'] == 'NA') {
                            logger.error(`The Building Entrance 3  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 3 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let lowRaiseEast_BuildOcc = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance3, "textContent")
                            let lowRaiseEast_BuildOccSplit = lowRaiseEast_BuildOcc.split(" ");
                            let entrance3 = lowRaiseEast_BuildOccSplit[0]
                            reporter.startStep(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`);
                            if (entrance3 > 0) {
                                logger.info(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`)
                                expect(entrance3 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();

                        }
                        // verify The Entrance 4 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance4'] == 'NA') {
                            logger.error(`The Building Entrance 4  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 4  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance4 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance4, "textContent")
                            let buidling_Entrance4Split = buidling_Entrance4.split(" ");
                            let entrance4 = buidling_Entrance4Split[0]
                            reporter.startStep(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`);
                            if (entrance4 > 0) {
                                logger.info(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`)
                                expect(entrance4 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 5 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance5'] == 'NA') {
                            logger.error(`The Building Entrance 5  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 5  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance5, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance5 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`);
                            if (entrance5 > 0) {
                                logger.info(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`)
                                expect(entrance5 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 6 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance6'] == 'NA') {
                            logger.error(`The Building Entrance 6  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 6  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance6, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance6 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`);
                            if (entrance6 > 0) {
                                logger.info(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`)
                                expect(entrance6 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 7 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance7'] == 'NA') {
                            logger.error(`The Building Entrance 7  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 7  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance7, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance7 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`);
                            if (entrance7 > 0) {
                                logger.info(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`)
                                expect(entrance7 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                    } else {
                        // Log that it's not a busy time and ignore the check
                        logger.info("Not busy time; Ignore Building Occupancy Count is non zero")
                        reporter.startStep(`Not busy time; Ignore Building Occupancy Count is non zero`);
                        reporter.endStep();
                    }
                } else {
                    // Log that it's the weekend and ignore the check
                    logger.info("It is weekend!; Ignore Building Occupancy Count is non zero")
                    reporter.startStep(`It is weekend!; Ignore Building Occupancy Count is non zero`);
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });
    });

    test('Navigate the <Building> and Verify The Occupancy Last 7 days Page', async ({
        given,
        when,
        then,
        and,
    }) => {
        let online_sensors, date, day, hours, buildingName
        givenIamLoggedIn(given)
        when(/^I select "(.*)"$/, async (building) => {
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`)
            buildingName = building
            await delay(3000)
            await performAction('click', commons.button.selectBuilding)
            await delay(4000)
            await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
            await Promise.all([
                performAction('click', `//ul[@role='menu']//li[span='${building}']`),
                waitForNetworkIdle(120000) //2mins
            ])
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            reporter.endStep();
        });

        then('Verify Last 7 days Occupancy Page last Update Time', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify Last 7 days Occupancy Page last Update Time");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['occ_last_Update_Time'] == 'NA') {
                // Log an error if not available
                logger.error(`Last 7 days Occupancy Page last Update Time is not available in ${buildingName}`)
                reporter.startStep(`Last 7 days Occupancy Page last Update Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                await delay(6000)
                // Click on the occupancy tab and wait for network idle
                await Promise.all([
                    performAction("click", buildingOverview.a.occupancyTab),
                    waitForNetworkIdle(120000)
                ])
                // Wait for 2 seconds
                await delay(2000)
                await Promise.all([
                    performAction("click", tenantAdmin.button.today),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000)
                // Click on the "last 7 days" button again and wait for network idle                          
                await Promise.all([
                    performAction("click", tenantAdmin.button.last7Days),
                    waitForNetworkIdle(120000)
                ])
                // Wait for 2 seconds
                await delay(2000)
                // Take a screenshot and attach it to the report
                let ss = await customScreenshot('env.png')
                reporter.addAttachment("env", ss, "image/png");
                // Get the last updated time from the web page
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.occupancy_LastUpDate, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
                // Calculate the time difference in minutes
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
                // Log and report the time comparison
                reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        // And Verify The Building Occupancy Title
        and('Verify The Building Occupancy Title in Occupancy last 7 days Page', async () => {
            reporter.startStep(`And Verify The Building Occupancy Title in Occupancy last 7 days Page`);
            // Load the environment configuration.
            let configFile = await getEnvConfig()
            // Check if Building Occupancy Title is available
            if (configFile.Building[buildingName]['Building_Occupancy_Title'] == 'NA') {
                logger.error(`The Building Occupancy Title is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // If the title is not 'NA', proceed to check it on the web page.
                let building_Occupancy_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.buildingOccupancyTxt, "textContent")
                const building_Occupancy_Txt = building_Occupancy_Txt_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Building Occupancy Title Text  - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
                // Compare the expected title text with the actual text on the web page.
                if (building_Occupancy_Txt === conFig.Building[buildingName].buildOccupancy_Txt) {
                    // Log a success message if the texts match.
                    logger.info(`Expected Building Occupancy Text   - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`)
                    expect(conFig.Building[buildingName].buildOccupancy_Txt).toBe(building_Occupancy_Txt);
                } else {
                    logger.error(`Expected Building Occupancy Text   - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Real Time Occupancy percentage in Occupancy last 7 days Page
        and('Verify The Real Time Occupancy percentage in Occupancy last 7 days Page', async () => {
            reporter.startStep(`And Verify The Real Time Occupancy percentage in Occupancy last 7 days Page`);
            // Get environment configuration.
            let configFile = await getEnvConfig()
            // Check if the Real Time Occupancy percentage is 'NA' in the configuration.
            if (configFile.Building[buildingName]['Real_Time_Occ_percentage'] == 'NA') {
                // If the Real Time Occupancy percentage is not available, log an error
                logger.error(`The Real Time Occupancy percentage is not available in ${buildingName}`)
                reporter.startStep(`The Real Time Occupancy percentage is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the current day and date in the America/New_York timezone.
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        let realTime_OccupancyPercent = await getPropertyValueByXpath(tenantAdmin.p.realTime_Occupancy_Percent, "textContent")
                        reporter.startStep(`Expected last 7 days Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
                        // Check if the Real Time Occupancy percentage is greater than 0%
                        if (realTime_OccupancyPercent > 0 + "%") {
                            logger.info(`Expected last 7 days Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`)
                            expect(realTime_OccupancyPercent > 0 + "%").toBeTruthy();
                        } else {
                            logger.error(`Expected last 7 days Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
                            // If the percentage is not greater than 0%, log an error and fail the test.
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    } else {
                        logger.info("Not busy time; Ignore Real Time Occupancy percentage")
                        // Log that it's not a busy time and skip the verification step.
                        reporter.startStep(`Not busy time; Ignore Real Time Occupancy percentage`);
                        reporter.endStep();
                    }
                } else {
                    logger.info("It is weekend!; Ignore Real Time Occupancy percentage")
                    // Log that it's the weekend and skip the verification step.
                    reporter.startStep(`It is weekend!; Ignore Real Time Occupancy percentage`);
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });

        //And Verify The Average occupancy over last 90 days in Occupancy last 7 days Page
        and('Verify The Average occupancy over last 90 days in Occupancy last 7 days Page', async () => {
            // Start a reporting step
            reporter.startStep(`And Verify The Average occupancy over last 90 days in Occupancy last 7 days Page`);
            // Get environment configuration
            let configFile = await getEnvConfig()
            // Check if Average occupancy over the last 90 days is available
            if (configFile.Building[buildingName]['Avg_Occ_overlast90days'] == 'NA') {
                // Log an error message and report it
                logger.error(`The Average occupancy over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Average occupancy over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average occupancy over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average occupancy over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                // If available, get the Average Occupancy value from a specific location (XPath)
                let AverageOccupancy = await getPropertyValueByXpath(tenantAdmin.p.Average_Occupancy, "textContent")
                // Start a reporting step with the expected and actual values
                reporter.startStep(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
                // Check if Average Occupancy is greater than 0%
                if (AverageOccupancy > 0 + "%") {
                    // Log an info message and use an assertion to ensure it's true
                    logger.info(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`)
                    expect(AverageOccupancy > 0 + "%").toBeTruthy();
                } else {
                    // If not greater than 0%, log an error and fail the assertion
                    logger.error(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            }
            }
            reporter.endStep();
        });

        and('Verify Peak occupancy over last 90 days in Occupancy last 7 days Page', async () => {
            reporter.startStep(`And Verify Peak occupancy over last 90 days in Occupancy last 7 days Page`);
            let configFile = await getEnvConfig()
            // Check if Peak Occupancy over the last 90 days is available 
            if (configFile.Building[buildingName]['Peak_Occ_overlast90days'] == 'NA') {
                // If not available, log an error and report it in the test report.
                logger.error(`The Peak occupancy over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Peak occupancy over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Peak occupancy over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Peak occupancy over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Peak occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Peak occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                // If available, get the peak occupancy value from the web page.
                let peak_Occupancy = await getPropertyValueByXpath(tenantAdmin.p.peakOccupancy, "textContent")
                reporter.startStep(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
                // Check if the peak occupancy is greater than 0%.
                if (peak_Occupancy > 0 + "%") {
                    // If it is greater than 0%, log it as expected and assert it's true in the test.
                    logger.info(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`)
                    expect(peak_Occupancy > 0 + "%").toBeTruthy();
                } else {
                    // If it's not greater than 0%, log it as an error and fail the test.
                    logger.error(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
                    expect(true).toBe(false);
                }
                // End the step in the test report.
                reporter.endStep();
            }
        }
    }
            // End the main step in the test report.
            reporter.endStep();
        });

        and('Verify The Total People Count in Occupancy last 7 days Page', async () => {
            reporter.startStep(`And Verify The Total People`);
            // Check the building if Total People Count is 'NA' in the configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Total_People_Count'] == 'NA') {
                // Log an error if Total People Count is not available
                logger.error(`The Total People Count is not available in ${buildingName}`)
                reporter.startStep(`The Total People Count is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the total real-time occupancy count from the web page 
                let totalRealTime = await getPropertyValueByXpath(tenantAdmin.p.total_RealTime, "textContent")
                let totalRealTimeSplit = totalRealTime.split("/");
                let total_Real_Time1 = totalRealTimeSplit[0]
                let total_Real_Time = totalRealTimeSplit[1]
                // Split the total real-time count to extract the numeric count
                let totalRealTimeSplits = total_Real_Time.split(" ");
                let total_Real_Time_Count = totalRealTimeSplits[0]
                let conFig = await getEnvConfig()
                reporter.startStep(`Verify The Real Time Occupancy Count `);
                reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
                // Check if the actual real-time count matches the expected count
                if (total_Real_Time_Count === conFig.Building[buildingName].total_People) {
                    // Log and assert if it matches
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Real_Time_Count);
                } else {
                    // Log an error and fail the test if it doesn't match
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
                // Get the EST current day and time
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        reporter.startStep(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
                        // Check if the Total People Count on Real Time Occupancy is greater than 0
                        if (total_Real_Time1 > 0) {
                            logger.info(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`)
                            expect(total_Real_Time1 > 0).toBeTruthy();
                        } else {
                            // If Total People Count on Real Time Occupancy is not greater than 0, log an error and fail the test.
                            logger.error(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
                            expect(true).toBe(false)
                        }
                        reporter.endStep();

                    } else {
                        logger.info("Not busy time; Ignore The Total People Count on Real Time Occupancy is Non Zero")
                        // Log that it's not a busy time and skip the verification step.
                        reporter.startStep(`Not busy time;Ignore The Total People Count on Real Time Occupancy is Non Zero`);
                        reporter.endStep();
                    }
                } else {
                    logger.info("It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero")
                    // Log that it's the weekend and skip the verification step.
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
                reporter.startStep(`Expected The Total People Count on Average occupancy over last 90 days - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
                if (total_Average_Time_Count === conFig.Building[buildingName].total_People) {
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Average_Time_Count);
                } else {
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();

                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average occupancy over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average occupancy over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average occupancy Count over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average occupancy Count over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                reporter.startStep(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
                if (total_Average_Time1 > 0) {
                    logger.info(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`)
                    expect(total_Average_Time1 > 0).toBeTruthy();
                } else {
                    logger.error(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            }
                reporter.endStep();

                let totalPeakTime = await getPropertyValueByXpath(tenantAdmin.p.total_PeakTime, "textContent")
                let totalPeakTimeSplit = totalPeakTime.split("/");
                let total_Peak_Time1 = totalPeakTimeSplit[0]
                let total_Peak_Time = totalPeakTimeSplit[1]
                let total_Peak_TimeSplits = total_Peak_Time.split(" ");
                let total_Peak_Time_Count = total_Peak_TimeSplits[0]
                reporter.startStep(`Verify The  Peak occupancy over last 90 days `);
                reporter.startStep(`Expected The Total People Count on Peak occupancy over last 90 days - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
                if (total_Peak_Time_Count === conFig.Building[buildingName].total_People) {
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Peak_Time_Count);
                } else {
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();

                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Peak occupancy Count over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Peak occupancy Count over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Peak occupancy Count over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Peak occupancy Count over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                reporter.startStep(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
                if (total_Peak_Time1 > 0) {
                    logger.info(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`)
                    expect(total_Peak_Time1 > 0).toBeTruthy();
                } else {
                    logger.error(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
        }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Lobby Foot Traffic Tiltle', async () => {
            reporter.startStep(`And Verify Lobby Foot Traffic Tiltle`);
            //Get environment configuration information.
            let configFile = await getEnvConfig()
            // Check if the average foot traffic data for the last 90 days is available in the configuration.
            if (configFile.Building[buildingName]['Lobby_FootTraffic_Tiltle'] == 'NA') {
                logger.error(`The Lobby Foot Traffic Tiltle is not available in ${buildingName}`)
                reporter.startStep(`The Lobby Foot Traffic Tiltle is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the foot traffic data from a web page element using an XPath selector.
                let lobby_Active_Txt_trim = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Txt, "textContent")
                const lobby_Active_Txt = lobby_Active_Txt_trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Lobby Active Title Text  - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
                // Check if the actual foot traffic count is greater than 0.
                if (lobby_Active_Txt === conFig.Building[buildingName].lobbyTitle) {
                    logger.info(`Expected Lobby Active Title Text   - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`)
                    expect(conFig.Building[buildingName].lobbyTitle).toBe(lobby_Active_Txt);
                } else {
                    // Log an error message and expect the condition to be false.
                    logger.error(`Expected Lobby Active Title Text   - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify The Lobby Foot Traffic Last upadte Time in Occupancy last 7 days Page
        and('Verify The Lobby Foot Traffic Last upadte Time in Occupancy last 7 days Page', async () => {
            reporter.startStep(`And Verify The Lobby Foot Traffic Last upadte Time in Occupancy last 7 days Page`);
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['LobbyTraffic_LastupadteTime'] == 'NA') {
                // Log an error message if the last update time is not available
                logger.error(`The Lobby Foot Traffic Last upadte Time is not available in ${buildingName}`)
                reporter.startStep(`The Lobby Foot Traffic Last upadte Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Time, "textContent")
                // Split the retrieved time to isolate the time portion.
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current date and time in the America/New_York time zone.
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
                // Calculate the time difference in minutes between EST and the retrieved time.
                let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
                reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //verify Real-time foot traffic is non zero in Occupancy last 7 days Page
        and('verify Real-time foot traffic is non zero in Occupancy last 7 days Page', async () => {
            reporter.startStep(`And verify Real-time foot traffic is non zero in Occupancy last 7 days Page`);
            let configFile = await getEnvConfig()
            // Check if Real-time foot traffic is available in the given building
            if (configFile.Building[buildingName]['RealTimefoot_traffic'] == 'NA') {
                logger.error(`The Real-time foot traffic is not available in ${buildingName}`)
                reporter.startStep(`The Real-time foot traffic is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                let PeakUserssplit = PeakUsers.split(" ");
                let avg_Day = PeakUserssplit[1]
                if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                    logger.error(`The Real foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                    reporter.startStep(`The Real foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                    reporter.endStep();
                } else {
                let RealTime_FootTraffic_lobby = await getPropertyValueByXpath(tenantAdmin.p.RealTime_FootTraffic, "textContent")
                let RealTime_FootTraffic_lobbySplit = RealTime_FootTraffic_lobby.split(" ");
                let RealTime_FootTraffic = RealTime_FootTraffic_lobbySplit[0]
                // Get the current day and time in the New York timezone
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        reporter.startStep(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
                        if (RealTime_FootTraffic > 0) {
                            logger.info(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`)
                            expect(RealTime_FootTraffic > 0).toBeTruthy();
                        } else {
                            logger.error(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
                            expect(true).toBe(false)
                        }
                        reporter.endStep();

                    } else {
                        // Log that it's not a busy time and ignore the check
                        logger.info("Not busy time; Ignore The Real-time foot traffic is non zero")
                        reporter.startStep(`Not busy time;Ignore Real-time foot traffic is non zero`);
                        reporter.endStep();
                    }
                } else {
                    // Log that it's the weekend and ignore the check
                    logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
                    reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
                    reporter.endStep();
                 }
                }
            }
            reporter.endStep();
        });

        //And verify the Average foot traffic over last 90 days in Occupancy last 7 days Page
        and('verify the Average foot traffic over last 90 days in Occupancy last 7 days Page', async () => {
            reporter.startStep(`And verify the Average foot traffic over last 90 days in Occupancy last 7 days Page`);
            let configFile = await getEnvConfig()
            // Check if Average foot traffic for the last 90 days is available for a specific building
            if (configFile.Building[buildingName]['Avgfoottraffic_90days'] == 'NA') {
                logger.error(`The Average foot traffic over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Average foot traffic over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average foot traffic over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average foot traffic over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                let lobby_90Days_FootTraffic = await getPropertyValueByXpath(tenantAdmin.div.lobby90Days_FootTraffic, "textContent")
                let lobby_90Days_FootTrafficSplit = lobby_90Days_FootTraffic.split(" ");
                let lobby_90Days_Foot_Traffic = lobby_90Days_FootTrafficSplit[0]
                // Get the current day and time in the New York timezone
                // day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                // date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                // // Check if it's not a weekend (Sat or Sun) 
                // if (day != 'Sat' && day != 'Sun') {
                    reporter.startStep(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
                    // Check if the actual foot traffic count is greater than 0
                    if (lobby_90Days_Foot_Traffic > 0) {
                        logger.info(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`)
                        // Use an assertion to check if the condition is true
                        expect(lobby_90Days_Foot_Traffic > 0).toBeTruthy();
                    } else {
                        logger.error(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
                        // Use an assertion to indicate test failure
                        expect(true).toBe(false)
                    }
                    reporter.endStep();
                // } else {
                //     // Log that it's the weekend and ignore the check
                //     logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
                //     reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
                //     reporter.endStep();
                }
            }
        }
            reporter.endStep();
        });

        and('verify The Building Occupancy Details Title in Occupancy last 7 days Page', async () => {
            reporter.startStep(`And verify The Building Occupancy Details Title in Occupancy last 7 days Page`);
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_DetailsTitle'] == 'NA') {
                // Log an error message if the title is not available
                logger.error(`The Building Occupancy Details Title is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Details Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let occ_Detail_Title_trim = await getPropertyValueByXpath(occupancyPageVerify.h5.occ_Detail_Title, "textContent")
                const occ_Detail_Title_txt = occ_Detail_Title_trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`);
                // Check if the actual title matches the expected title from the configuration
                if (occ_Detail_Title_txt === conFig.Building[buildingName].buildOcc_Details_Title) {
                    // Log a success message if the titles match
                    logger.info(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`)
                    // Use an assertion to verify that the titles are equal
                    expect(conFig.Building[buildingName].buildOcc_Details_Title).toBe(occ_Detail_Title_txt);
                } else {
                    // Log an error message if the titles do not match
                    logger.error(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`);
                    // Use an assertion to fail the test
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('verify The Building Occupancy Details Last upadte Time in Occupancy last 7 days Page', async () => {
            reporter.startStep("verify The Building Occupancy Details Last upadte Time in Occupancy last 7 days Page");
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occ_Details_LastupadteTime'] == 'NA') {
                logger.error(`The Building Occupancy Details Last upadte Time is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Details Last upadte Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.span.building_Occupancy_lastTime, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
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
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify All Building Entrance Are non zero in Occupancy last 7 days Page
        and('Verify All Building Entrance Are non zero in Occupancy last 7 days Page', async () => {
            reporter.startStep("And Verify All Building Entrance Are non zero in Occupancy last 7 days Page");
            let configFile = await getEnvConfig()
            // Check if the building entrance data is available for the specified building
            if (configFile.Building[buildingName]['Building_Entrance'] == 'NA') {
                // Log an error if the data is not available
                logger.error(`The Building Entrance is not available in ${buildingName}`)
                reporter.startStep(`The Building Entrance is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        let highRaiseBuildOccupancy = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance1, "textContent")
                        let highRaiseBuildOccupancySplit = highRaiseBuildOccupancy.split(" ");
                        let entrance1 = highRaiseBuildOccupancySplit[0]

                        // Check if the data for Entrance 1 is available
                        if (configFile.Building[buildingName]['build_Entrance1'] == 'NA') {
                            logger.error(`The Building Entrance 1  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 1 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            reporter.startStep(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`);
                            // Log and assert that Entrance 1 occupancy is non-zero
                            if (entrance1 > 0) {
                                logger.info(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`)
                                expect(entrance1 > 0).toBeTruthy();
                            } else {
                                // Log an error and fail the test if Entrance 1 occupancy is zero
                                logger.error(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }

                        //verify The Entrance 2 Occupancy is non zero
                        // Check if the data for Entrance 2 is available
                        if (configFile.Building[buildingName]['build_Entrance2'] == 'NA') {
                            logger.error(`The Building Entrance 2  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 2 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let lowRaiseWest_BuildOcc = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance2, "textContent")
                            let lowRaiseWest_BuildOccSplit = lowRaiseWest_BuildOcc.split(" ");
                            let entrance2 = lowRaiseWest_BuildOccSplit[0]
                            reporter.startStep(`Expected The Entrance-2 is non zero and Actual  Count - ${entrance2}`);
                            // Log and assert that Entrance 2 occupancy is non-zero
                            if (entrance2 > 0) {
                                logger.info(`Expected TThe Entrance-2 is non zero and Actual  Count - ${entrance2}`)
                                expect(entrance2 > 0).toBeTruthy();
                            } else {
                                // Log an error and fail the test if Entrance 2 occupancy is zero
                                logger.error(`Expected The Entrance-2 is non zero and Actual  Count - ${entrance2}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 3 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance3'] == 'NA') {
                            logger.error(`The Building Entrance 3  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 3 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let lowRaiseEast_BuildOcc = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance3, "textContent")
                            let lowRaiseEast_BuildOccSplit = lowRaiseEast_BuildOcc.split(" ");
                            let entrance3 = lowRaiseEast_BuildOccSplit[0]
                            reporter.startStep(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`);
                            if (entrance3 > 0) {
                                logger.info(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`)
                                expect(entrance3 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();

                        }
                        // verify The Entrance 4 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance4'] == 'NA') {
                            logger.error(`The Building Entrance 4  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 4  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance4 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance4, "textContent")
                            let buidling_Entrance4Split = buidling_Entrance4.split(" ");
                            let entrance4 = buidling_Entrance4Split[0]
                            reporter.startStep(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`);
                            if (entrance4 > 0) {
                                logger.info(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`)
                                expect(entrance4 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 5 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance5'] == 'NA') {
                            logger.error(`The Building Entrance 5  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 5  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance5, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance5 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`);
                            if (entrance5 > 0) {
                                logger.info(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`)
                                expect(entrance5 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 6 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance6'] == 'NA') {
                            logger.error(`The Building Entrance 6  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 6  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance6, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance6 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`);
                            if (entrance6 > 0) {
                                logger.info(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`)
                                expect(entrance6 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 7 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance7'] == 'NA') {
                            logger.error(`The Building Entrance 7  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 7  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance7, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance7 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`);
                            if (entrance7 > 0) {
                                logger.info(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`)
                                expect(entrance7 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                    } else {
                        // Log that it's not a busy time and ignore the check
                        logger.info("Not busy time; Ignore Building Occupancy Count is non zero")
                        reporter.startStep(`Not busy time; Ignore Building Occupancy Count is non zero`);
                        reporter.endStep();
                    }
                } else {
                    // Log that it's the weekend and ignore the check
                    logger.info("It is weekend!; Ignore Building Occupancy Count is non zero")
                    reporter.startStep(`It is weekend!; Ignore Building Occupancy Count is non zero`);
                    reporter.endStep();
                }
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
        givenIamLoggedIn(given)
        when(/^I select "(.*)"$/, async (building) => {
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`)
            buildingName = building
            await delay(3000)
            await performAction('click', commons.button.selectBuilding)
            await delay(4000)
            await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
            await Promise.all([
                performAction('click', `//ul[@role='menu']//li[span='${building}']`),
                waitForNetworkIdle(120000) //2mins
            ])
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            reporter.endStep();
        });

        then('Verify Last 30 days Occupancy Page last Update Time', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify Last 30 days Occupancy Page last Update Time");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['occ_last_Update_Time'] == 'NA') {
                // Log an error if not available
                logger.error(`Last 30 days Occupancy Page last Update Time is not available in ${buildingName}`)
                reporter.startStep(`Last 30 days Occupancy Page last Update Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                await delay(6000)
                // Click on the occupancy tab and wait for network idle
                await Promise.all([
                    performAction("click", buildingOverview.a.occupancyTab),
                    waitForNetworkIdle(120000)
                ])
                // Wait for 2 seconds
                await delay(2000)
                await Promise.all([
                    performAction("click", tenantAdmin.button.today),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000)
                // Click on the "last 30 days" button again and wait for network idle                          
                await Promise.all([
                    performAction("click", tenantAdmin.button.last30DaysClick),
                    waitForNetworkIdle(120000)
                ])
                // Wait for 2 seconds
                await delay(2000)
                // Take a screenshot and attach it to the report
                let ss = await customScreenshot('env.png')
                reporter.addAttachment("env", ss, "image/png");
                // Get the last updated time from the web page
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.div.occupancy_LastUpDate, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
                // Calculate the time difference in minutes
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
                // Log and report the time comparison
                reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        // And Verify The Building Occupancy Title
        and('Verify The Building Occupancy Title in Occupancy last 30 days Page', async () => {
            reporter.startStep(`And Verify The Building Occupancy Title in Occupancy last 30 days Page`);
            // Load the environment configuration.
            let configFile = await getEnvConfig()
            // Check if Building Occupancy Title is available
            if (configFile.Building[buildingName]['Building_Occupancy_Title'] == 'NA') {
                logger.error(`The Building Occupancy Title is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // If the title is not 'NA', proceed to check it on the web page.
                let building_Occupancy_Txt_Trim = await getPropertyValueByXpath(tenantAdmin.h5.buildingOccupancyTxt, "textContent")
                const building_Occupancy_Txt = building_Occupancy_Txt_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Building Occupancy Title Text  - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
                // Compare the expected title text with the actual text on the web page.
                if (building_Occupancy_Txt === conFig.Building[buildingName].buildOccupancy_Txt) {
                    // Log a success message if the texts match.
                    logger.info(`Expected Building Occupancy Text   - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`)
                    expect(conFig.Building[buildingName].buildOccupancy_Txt).toBe(building_Occupancy_Txt);
                } else {
                    logger.error(`Expected Building Occupancy Text   - ${conFig.Building[buildingName].buildOccupancy_Txt} and Actual  Status- ${building_Occupancy_Txt}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Real Time Occupancy percentage in Occupancy last 30 days Page
        and('Verify The Real Time Occupancy percentage in Occupancy last 30 days Page', async () => {
            reporter.startStep(`And Verify The Real Time Occupancy percentage in Occupancy last 30 days Page`);
            // Get environment configuration.
            let configFile = await getEnvConfig()
            // Check if the Real Time Occupancy percentage is 'NA' in the configuration.
            if (configFile.Building[buildingName]['Real_Time_Occ_percentage'] == 'NA') {
                // If the Real Time Occupancy percentage is not available, log an error
                logger.error(`The Real Time Occupancy percentage is not available in ${buildingName}`)
                reporter.startStep(`The Real Time Occupancy percentage is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the current day and date in the America/New_York timezone.
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        let realTime_OccupancyPercent = await getPropertyValueByXpath(tenantAdmin.p.realTime_Occupancy_Percent, "textContent")
                        reporter.startStep(`Expected last 30 days Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
                        // Check if the Real Time Occupancy percentage is greater than 0%
                        if (realTime_OccupancyPercent > 0 + "%") {
                            logger.info(`Expected last 30 days Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`)
                            expect(realTime_OccupancyPercent > 0 + "%").toBeTruthy();
                        } else {
                            logger.error(`Expected last 30 days Real Time Occupancy percentage Non Zero and Actual Status - ${realTime_OccupancyPercent}`);
                            // If the percentage is not greater than 0%, log an error and fail the test.
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    } else {
                        logger.info("Not busy time; Ignore Real Time Occupancy percentage")
                        // Log that it's not a busy time and skip the verification step.
                        reporter.startStep(`Not busy time; Ignore Real Time Occupancy percentage`);
                        reporter.endStep();
                    }
                } else {
                    logger.info("It is weekend!; Ignore Real Time Occupancy percentage")
                    // Log that it's the weekend and skip the verification step.
                    reporter.startStep(`It is weekend!; Ignore Real Time Occupancy percentage`);
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });

        //And Verify The Average occupancy over last 90 days in Occupancy last 30 days Page
        and('Verify The Average occupancy over last 90 days in Occupancy last 30 days Page', async () => {
            // Start a reporting step
            reporter.startStep(`And Verify The Average occupancy over last 90 days in Occupancy last 30 days Page`);
            // Get environment configuration
            let configFile = await getEnvConfig()
            // Check if Average occupancy over the last 90 days is available
            if (configFile.Building[buildingName]['Avg_Occ_overlast90days'] == 'NA') {
                // Log an error message and report it
                logger.error(`The Average occupancy over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Average occupancy over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average occupancy over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average occupancy over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average occupancy over last 90 days zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                // If available, get the Average Occupancy value from a specific location (XPath)
                let AverageOccupancy = await getPropertyValueByXpath(tenantAdmin.p.Average_Occupancy, "textContent")
                // Start a reporting step with the expected and actual values
                reporter.startStep(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
                // Check if Average Occupancy is greater than 0%
                if (AverageOccupancy > 0 + "%") {
                    // Log an info message and use an assertion to ensure it's true
                    logger.info(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`)
                    expect(AverageOccupancy > 0 + "%").toBeTruthy();
                } else {
                    // If not greater than 0%, log an error and fail the assertion
                    logger.error(`Expected The Average occupancy over last 90 days Non Zero and Actual Status - ${AverageOccupancy}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            }
        }
            reporter.endStep();
        });

        and('Verify Peak occupancy over last 90 days in Occupancy last 30 days Page', async () => {
            reporter.startStep(`And Verify Peak occupancy over last 90 days in Occupancy last 30 days Page`);
            let configFile = await getEnvConfig()
            // Check if Peak Occupancy over the last 90 days is available 
            if (configFile.Building[buildingName]['Peak_Occ_overlast90days'] == 'NA') {
                // If not available, log an error and report it in the test report.
                logger.error(`The Peak occupancy over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Peak occupancy over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Peak occupancy over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Peak occupancy over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Peak occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Peak occupancy over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                // If available, get the peak occupancy value from the web page.
                let peak_Occupancy = await getPropertyValueByXpath(tenantAdmin.p.peakOccupancy, "textContent")
                reporter.startStep(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
                // Check if the peak occupancy is greater than 0%.
                if (peak_Occupancy > 0 + "%") {
                    // If it is greater than 0%, log it as expected and assert it's true in the test.
                    logger.info(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`)
                    expect(peak_Occupancy > 0 + "%").toBeTruthy();
                } else {
                    // If it's not greater than 0%, log it as an error and fail the test.
                    logger.error(`Expected The Peak occupancy over last 90 days Non Zero and Actual Status - ${peak_Occupancy}`);
                    expect(true).toBe(false);
                }
                // End the step in the test report.
                reporter.endStep();
            }
            }
        }
            // End the main step in the test report.
            reporter.endStep();
        });

        and('Verify The Total People Count in Occupancy last 30 days Page', async () => {
            reporter.startStep(`And Verify The Total People`);
            // Check the building if Total People Count is 'NA' in the configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Total_People_Count'] == 'NA') {
                // Log an error if Total People Count is not available
                logger.error(`The Total People Count is not available in ${buildingName}`)
                reporter.startStep(`The Total People Count is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the total real-time occupancy count from the web page 
                let totalRealTime = await getPropertyValueByXpath(tenantAdmin.p.total_RealTime, "textContent")
                let totalRealTimeSplit = totalRealTime.split("/");
                let total_Real_Time1 = totalRealTimeSplit[0]
                let total_Real_Time = totalRealTimeSplit[1]
                // Split the total real-time count to extract the numeric count
                let totalRealTimeSplits = total_Real_Time.split(" ");
                let total_Real_Time_Count = totalRealTimeSplits[0]
                let conFig = await getEnvConfig()
                reporter.startStep(`Verify The Real Time Occupancy Count `);
                reporter.startStep(`Expected The Total People Count on Real Time Occupancy - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
                // Check if the actual real-time count matches the expected count
                if (total_Real_Time_Count === conFig.Building[buildingName].total_People) {
                    // Log and assert if it matches
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Real_Time_Count);
                } else {
                    // Log an error and fail the test if it doesn't match
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Real_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
                // Get the EST current day and time
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        reporter.startStep(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
                        // Check if the Total People Count on Real Time Occupancy is greater than 0
                        if (total_Real_Time1 > 0) {
                            logger.info(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`)
                            expect(total_Real_Time1 > 0).toBeTruthy();
                        } else {
                            // If Total People Count on Real Time Occupancy is not greater than 0, log an error and fail the test.
                            logger.error(`Expected The Total People Count on Real Time Occupancy is Non Zero and Actual  Count - ${total_Real_Time1}`);
                            expect(true).toBe(false)
                        }
                        reporter.endStep();

                    } else {
                        logger.info("Not busy time; Ignore The Total People Count on Real Time Occupancy is Non Zero")
                        // Log that it's not a busy time and skip the verification step.
                        reporter.startStep(`Not busy time;Ignore The Total People Count on Real Time Occupancy is Non Zero`);
                        reporter.endStep();
                    }
                } else {
                    logger.info("It is weekend!; Ignore The Total People Count on Real Time Occupancy is Non Zero")
                    // Log that it's the weekend and skip the verification step.
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
                reporter.startStep(`Expected The Total People Count on Average occupancy over last 90 days - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
                if (total_Average_Time_Count === conFig.Building[buildingName].total_People) {
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Average_Time_Count);
                } else {
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Average_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();

                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average occupancy Count over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average occupancy Count over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average occupancy Count over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The  Average occupancy Count over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                reporter.startStep(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
                if (total_Average_Time1 > 0) {
                    logger.info(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`)
                    expect(total_Average_Time1 > 0).toBeTruthy();
                } else {
                    logger.error(`Expected The Average occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Average_Time1}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
                }
            }
                reporter.endStep();

                let totalPeakTime = await getPropertyValueByXpath(tenantAdmin.p.total_PeakTime, "textContent")
                let totalPeakTimeSplit = totalPeakTime.split("/");
                let total_Peak_Time1 = totalPeakTimeSplit[0]
                let total_Peak_Time = totalPeakTimeSplit[1]
                let total_Peak_TimeSplits = total_Peak_Time.split(" ");
                let total_Peak_Time_Count = total_Peak_TimeSplits[0]
                reporter.startStep(`Verify The  Peak occupancy over last 90 days `);
                reporter.startStep(`Expected The Total People Count on Peak occupancy over last 90 days - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
                if (total_Peak_Time_Count === conFig.Building[buildingName].total_People) {
                    logger.info(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`)
                    expect(conFig.Building[buildingName].total_People).toBe(total_Peak_Time_Count);
                } else {
                    logger.error(`Expected The Total People Count  - ${conFig.Building[buildingName].total_People} and Actual  Count - ${total_Peak_Time_Count}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();

                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Peak occupancy Count over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average occupancy  Count over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Peak occupancy Count over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The  Peak occupancy Count over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                reporter.startStep(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
                if (total_Peak_Time1 > 0) {
                    logger.info(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`)
                    expect(total_Peak_Time1 > 0).toBeTruthy();
                } else {
                    logger.error(`Expected The Peak occupancy Count over last 90 days is Non Zero and Actual  Count - ${total_Peak_Time1}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
        }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Lobby Foot Traffic Tiltle', async () => {
            reporter.startStep(`And Verify Lobby Foot Traffic Tiltle`);
            //Get environment configuration information.
            let configFile = await getEnvConfig()
            // Check if the average foot traffic data for the last 90 days is available in the configuration.
            if (configFile.Building[buildingName]['Lobby_FootTraffic_Tiltle'] == 'NA') {
                logger.error(`The Lobby Foot Traffic Tiltle is not available in ${buildingName}`)
                reporter.startStep(`The Lobby Foot Traffic Tiltle is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the foot traffic data from a web page element using an XPath selector.
                let lobby_Active_Txt_trim = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Txt, "textContent")
                const lobby_Active_Txt = lobby_Active_Txt_trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Lobby Active Title Text  - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
                // Check if the actual foot traffic count is greater than 0.
                if (lobby_Active_Txt === conFig.Building[buildingName].lobbyTitle) {
                    logger.info(`Expected Lobby Active Title Text   - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`)
                    expect(conFig.Building[buildingName].lobbyTitle).toBe(lobby_Active_Txt);
                } else {
                    // Log an error message and expect the condition to be false.
                    logger.error(`Expected Lobby Active Title Text   - ${conFig.Building[buildingName].lobbyTitle} and Actual  Status- ${lobby_Active_Txt}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify The Lobby Foot Traffic Last upadte Time in Occupancy last 30 days Page
        and('Verify The Lobby Foot Traffic Last upadte Time in Occupancy last 30 days Page', async () => {
            reporter.startStep(`And Verify The Lobby Foot Traffic Last upadte Time in Occupancy last 30 days Page`);
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['LobbyTraffic_LastupadteTime'] == 'NA') {
                // Log an error message if the last update time is not available
                logger.error(`The Lobby Foot Traffic Last upadte Time is not available in ${buildingName}`)
                reporter.startStep(`The Lobby Foot Traffic Last upadte Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.h5.lobbyActive_Time, "textContent")
                // Split the retrieved time to isolate the time portion.
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current date and time in the America/New_York time zone.
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
                // Calculate the time difference in minutes between EST and the retrieved time.
                let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(totaltime)) / 60000);
                reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('verify Real-time foot traffic is non zero in Occupancy last 30 days Page', async () => {
            reporter.startStep(`And verify Real-time foot traffic is non zero in Occupancy last 30 days Page`);
            let configFile = await getEnvConfig()
            // Check if Real-time foot traffic is available in the given building
            if (configFile.Building[buildingName]['RealTimefoot_traffic'] == 'NA') {
                logger.error(`The Real-time foot traffic is not available in ${buildingName}`)
                reporter.startStep(`The Real-time foot traffic is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                let PeakUserssplit = PeakUsers.split(" ");
                let avg_Day = PeakUserssplit[1]
                if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                    logger.error(`The Real foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                    reporter.startStep(`The Real foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                    reporter.endStep();
                } else {
                let RealTime_FootTraffic_lobby = await getPropertyValueByXpath(tenantAdmin.p.RealTime_FootTraffic, "textContent")
                let RealTime_FootTraffic_lobbySplit = RealTime_FootTraffic_lobby.split(" ");
                let RealTime_FootTraffic = RealTime_FootTraffic_lobbySplit[0]
                // Get the current day and time in the New York timezone
                day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                hours = parseInt(date.split(' ')[1].split(':')[0])
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        reporter.startStep(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
                        if (RealTime_FootTraffic > 0) {
                            logger.info(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`)
                            expect(RealTime_FootTraffic > 0).toBeTruthy();
                        } else {
                            logger.error(`Expected Real-time foot traffic is non zero and Actual  Count - ${RealTime_FootTraffic}`);
                            expect(true).toBe(false)
                        }
                        reporter.endStep();

                    } else {
                        // Log that it's not a busy time and ignore the check
                        logger.info("Not busy time; Ignore The Real-time foot traffic is non zero")
                        reporter.startStep(`Not busy time;Ignore Real-time foot traffic is non zero`);
                        reporter.endStep();
                    }
                } else {
                    // Log that it's the weekend and ignore the check
                    logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
                    reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
                    reporter.endStep();
                 }
                }
            }
            reporter.endStep();
        });

      //And verify the Average foot traffic over last 90 days in Occupancy last 30 days Page
      and('verify the Average foot traffic over last 90 days in Occupancy last 30 days Page', async () => {
        reporter.startStep(`And verify the Average foot traffic over last 90 days in Occupancy last 30 days Page`);
            let configFile = await getEnvConfig()
            // Check if Average foot traffic for the last 90 days is available for a specific building
            if (configFile.Building[buildingName]['Avgfoottraffic_90days'] == 'NA') {
                logger.error(`The Average foot traffic over last 90 days is not available in ${buildingName}`)
                reporter.startStep(`The Average foot traffic over last 90 days is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Avg_Occ_overlast90days_Data'] == '0') {
                    // Log an error message and report it
                    logger.error(`The Average foot traffic over last 90 days are equal zero in ${buildingName}`)
                    reporter.startStep(`The Average foot traffic over last 90 days  are equal zero in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    if ((avg_Day == "Sunday")  || (avg_Day == "Saturday")) {
                        logger.error(`The Average foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`)
                        reporter.startStep(`The Average foot traffic over last 90 days are equal zero on Saturday or  Sunday in ${buildingName}`);
                        reporter.endStep();
                    } else {
                let lobby_90Days_FootTraffic = await getPropertyValueByXpath(tenantAdmin.div.lobby90Days_FootTraffic, "textContent")
                let lobby_90Days_FootTrafficSplit = lobby_90Days_FootTraffic.split(" ");
                let lobby_90Days_Foot_Traffic = lobby_90Days_FootTrafficSplit[0]
                // Get the current day and time in the New York timezone
                // day = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, weekday: "short" });
                // date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                // // Check if it's not a weekend (Sat or Sun) 
                // if (day != 'Sat' && day != 'Sun') {
                    reporter.startStep(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
                    // Check if the actual foot traffic count is greater than 0
                    if (lobby_90Days_Foot_Traffic > 0) {
                        logger.info(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`)
                        // Use an assertion to check if the condition is true
                        expect(lobby_90Days_Foot_Traffic > 0).toBeTruthy();
                    } else {
                        logger.error(`Expected The Average foot traffic over last 90 days is non zero and Actual  Count - ${lobby_90Days_Foot_Traffic}`);
                        // Use an assertion to indicate test failure
                        expect(true).toBe(false)
                    }
                    reporter.endStep();
                // } else {
                //     // Log that it's the weekend and ignore the check
                //     logger.info("It is weekend!; Ignore Real-time foot traffic is non zero")
                //     reporter.startStep(`It is weekend!; Ignore Real-time foot traffic is non zero`);
                //     reporter.endStep();
                }
            }
        }
            reporter.endStep();
        });

        and('verify The Building Occupancy Details Title in Occupancy last 30 days Page', async () => {
            reporter.startStep(`And verify The Building Occupancy Details Title in Occupancy last 30 days Page`);
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_DetailsTitle'] == 'NA') {
                // Log an error message if the title is not available
                logger.error(`The Building Occupancy Details Title is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Details Title is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let occ_Detail_Title_trim = await getPropertyValueByXpath(occupancyPageVerify.h5.occ_Detail_Title, "textContent")
                const occ_Detail_Title_txt = occ_Detail_Title_trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`);
                // Check if the actual title matches the expected title from the configuration
                if (occ_Detail_Title_txt === conFig.Building[buildingName].buildOcc_Details_Title) {
                    // Log a success message if the titles match
                    logger.info(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`)
                    // Use an assertion to verify that the titles are equal
                    expect(conFig.Building[buildingName].buildOcc_Details_Title).toBe(occ_Detail_Title_txt);
                } else {
                    // Log an error message if the titles do not match
                    logger.error(`Expected Building Occupancy Details Title Text  - ${conFig.Building[buildingName].buildOcc_Details_Title} and Actual  Status- ${occ_Detail_Title_txt}`);
                    // Use an assertion to fail the test
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('verify The Building Occupancy Details Last upadte Time in Occupancy last 30 days Page', async () => {
            reporter.startStep("verify The Building Occupancy Details Last upadte Time in Occupancy last 30 days Page");
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occ_Details_LastupadteTime'] == 'NA') {
                logger.error(`The Building Occupancy Details Last upadte Time is not available in ${buildingName}`)
                reporter.startStep(`The Building Occupancy Details Last upadte Time is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(tenantAdmin.span.building_Occupancy_lastTime, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
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
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify All Building Entrance Are non zero in Occupancy last 30 days Page
        and('Verify All Building Entrance Are non zero in Occupancy last 30 days Page', async () => {
            reporter.startStep("And Verify All Building Entrance Are non zero in Occupancy last 30 days Page");
            let configFile = await getEnvConfig()
            // Check if the building entrance data is available for the specified building
            if (configFile.Building[buildingName]['Building_Entrance'] == 'NA') {
                // Log an error if the data is not available
                logger.error(`The Building Entrance is not available in ${buildingName}`)
                reporter.startStep(`The Building Entrance is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Check if it's not a weekend (Sat or Sun) and if it's between 8 AM and 6 PM.
                if (day != 'Sat' && day != 'Sun') {
                    if ((hours >= 8 && hours <= 18)) {
                        logger.info("In Busy time")
                        let highRaiseBuildOccupancy = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance1, "textContent")
                        let highRaiseBuildOccupancySplit = highRaiseBuildOccupancy.split(" ");
                        let entrance1 = highRaiseBuildOccupancySplit[0]

                        // Check if the data for Entrance 1 is available
                        if (configFile.Building[buildingName]['build_Entrance1'] == 'NA') {
                            logger.error(`The Building Entrance 1  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 1 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            reporter.startStep(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`);
                            // Log and assert that Entrance 1 occupancy is non-zero
                            if (entrance1 > 0) {
                                logger.info(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`)
                                expect(entrance1 > 0).toBeTruthy();
                            } else {
                                // Log an error and fail the test if Entrance 1 occupancy is zero
                                logger.error(`Expected The Entrance-1 is non zero and Actual  Count - ${entrance1}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }

                        //verify The Entrance 2 Occupancy is non zero
                        // Check if the data for Entrance 2 is available
                        if (configFile.Building[buildingName]['build_Entrance2'] == 'NA') {
                            logger.error(`The Building Entrance 2  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 2 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let lowRaiseWest_BuildOcc = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance2, "textContent")
                            let lowRaiseWest_BuildOccSplit = lowRaiseWest_BuildOcc.split(" ");
                            let entrance2 = lowRaiseWest_BuildOccSplit[0]
                            reporter.startStep(`Expected The Entrance-2 is non zero and Actual  Count - ${entrance2}`);
                            // Log and assert that Entrance 2 occupancy is non-zero
                            if (entrance2 > 0) {
                                logger.info(`Expected TThe Entrance-2 is non zero and Actual  Count - ${entrance2}`)
                                expect(entrance2 > 0).toBeTruthy();
                            } else {
                                // Log an error and fail the test if Entrance 2 occupancy is zero
                                logger.error(`Expected The Entrance-2 is non zero and Actual  Count - ${entrance2}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 3 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance3'] == 'NA') {
                            logger.error(`The Building Entrance 3  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 3 is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let lowRaiseEast_BuildOcc = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance3, "textContent")
                            let lowRaiseEast_BuildOccSplit = lowRaiseEast_BuildOcc.split(" ");
                            let entrance3 = lowRaiseEast_BuildOccSplit[0]
                            reporter.startStep(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`);
                            if (entrance3 > 0) {
                                logger.info(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`)
                                expect(entrance3 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-3 is non zero and Actual  Count - ${entrance3}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();

                        }
                        // verify The Entrance 4 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance4'] == 'NA') {
                            logger.error(`The Building Entrance 4  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 4  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance4 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance4, "textContent")
                            let buidling_Entrance4Split = buidling_Entrance4.split(" ");
                            let entrance4 = buidling_Entrance4Split[0]
                            reporter.startStep(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`);
                            if (entrance4 > 0) {
                                logger.info(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`)
                                expect(entrance4 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-4 is non zero and Actual  Count - ${entrance4}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 5 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance5'] == 'NA') {
                            logger.error(`The Building Entrance 5  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 5  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance5, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance5 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`);
                            if (entrance5 > 0) {
                                logger.info(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`)
                                expect(entrance5 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-5 is non zero and Actual  Count - ${entrance5}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 6 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance6'] == 'NA') {
                            logger.error(`The Building Entrance 6  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 6  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance6, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance6 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`);
                            if (entrance6 > 0) {
                                logger.info(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`)
                                expect(entrance6 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-6 is non zero and Actual  Count - ${entrance6}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                        // verify The Entrance 7 Occupancy is non zero
                        if (configFile.Building[buildingName]['build_Entrance7'] == 'NA') {
                            logger.error(`The Building Entrance 7  is not available in ${buildingName}`)
                            reporter.startStep(`The Building Entrance 7  is not available in ${buildingName}`);
                            reporter.endStep();
                        } else {
                            let buidling_Entrance5 = await getPropertyValueByXpath(occupancyPageVerify.h5.buidlingEntrance7, "textContent")
                            let buidling_Entrance5Split = buidling_Entrance5.split(" ");
                            let entrance7 = buidling_Entrance5Split[0]
                            reporter.startStep(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`);
                            if (entrance7 > 0) {
                                logger.info(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`)
                                expect(entrance7 > 0).toBeTruthy();
                            } else {
                                logger.error(`Expected The Entrance-7 is non zero and Actual  Count - ${entrance7}`);
                                expect(true).toBe(false)
                            }
                            reporter.endStep();
                        }
                    } else {
                        // Log that it's not a busy time and ignore the check
                        logger.info("Not busy time; Ignore Building Occupancy Count is non zero")
                        reporter.startStep(`Not busy time; Ignore Building Occupancy Count is non zero`);
                        reporter.endStep();
                    }
                } else {
                    // Log that it's the weekend and ignore the check
                    logger.info("It is weekend!; Ignore Building Occupancy Count is non zero")
                    reporter.startStep(`It is weekend!; Ignore Building Occupancy Count is non zero`);
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });
    });
    //Navigate the <Building> and Verify The Last 7 Days Occupancy Usage Page
    test('Navigate the <Building> and Verify The Last 7 Days in Occupancy Usage Page', async ({
        given,
        when,
        then,
        and,
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

        then('Verify Last 7 Days Building Access Text in Occupancy Usage Page', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify Last 7 Days Building Access Text in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                await delay(4000)
                // Click on the occupancy tab and wait for network idle
                await Promise.all([
                    performAction("click", buildingOverview.a.occupancyTab),
                    waitForNetworkIdle(120000)
                ])
                let ss1 = await customScreenshot('building.png')
                reporter.addAttachment("building", ss1, "image/png");
                await delay(6000)
                // Click on the usageTab tab and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.usageTab),
                    waitForNetworkIdle(120000)
                ])
                //here attached the screen shot
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                await delay(2000)
                //Then Verify Last 7 Days Building Access Text in Occupancy Usage Page
                let build_Access_Text = await getPropertyValueByXpath(occupancyPageVerify.h5.buildingAccess_Text, "textContent")
                let conFig = await getEnvConfig()
                //here fletch the date from the config file
                reporter.startStep(`Expected The Building Access Title Text  - ${conFig.Building[buildingName].buildAccess_Text} and Actual  Status- ${build_Access_Text}`);
                //here  validate the data
                if (build_Access_Text === conFig.Building[buildingName].buildAccess_Text) {
                    logger.info(`Expected The Building Access Title Text  - ${conFig.Building[buildingName].buildAccess_Text} and Actual  Status- ${build_Access_Text}`)
                    expect(conFig.Building[buildingName].buildAccess_Text).toBe(build_Access_Text);
                } else {
                    logger.error(`Expected The Building Access Title Text  - ${conFig.Building[buildingName].buildAccess_Text} and Actual  Status- ${build_Access_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        // And Verify Last 7 Days Access Summary Text in Occupancy Usage Page
        then('Verify Last 7 Days Access Summary Text in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify Last 7 Days Access Summary Text in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            // Check if Access Summary Text is available
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let access_Summary_Trim = await getPropertyValueByXpath(occupancyPageVerify.h5.accessSummaryText, "textContent")
                const access_Summary = access_Summary_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The Access Summary Text  - ${conFig.Building[buildingName].access_Summary_Text} and Actual  Status- ${access_Summary}`);
                if (access_Summary === conFig.Building[buildingName].access_Summary_Text) {
                    logger.info(`Expected The Access Summary Text  - ${conFig.Building[buildingName].access_Summary_Text} and Actual  Status- ${access_Summary}`)
                    expect(conFig.Building[buildingName].access_Summary_Text).toBe(access_Summary);
                } else {
                    logger.error(`Expected The Access Summary Text  - ${conFig.Building[buildingName].access_Summary_Text} and Actual  Status- ${access_Summary}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify The Last 7 Days Access Summary Last Upadte Time in Occupancy Usage Page
        and('Verify The Last 7 Days Access Summary Last Upadte Time in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Last 7 Days Access Summary Last Upadte Time in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the last updated time from the web page
                let Last_updatedTime = await getPropertyValueByXpath(occupancyPageVerify.div.accessSummaryLastUpdate_Time, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
                // Calculate the time difference in minutes
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
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Total Swipes Count in Occupancy Usage Page
        and('Verify Total Swips are non zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify Total Swips are non zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let totalSwips = await getPropertyValueByXpath(occupancyPageVerify.p.total_Swips, "textContent")
                reporter.startStep(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
                if (parseInt(totalSwips) > 0) {
                    logger.info(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`)
                    expect(parseInt(totalSwips) > 0).toBeTruthy();
                } else {
                    logger.error(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify Total Unique Users Count are non zero in Occupancy Usage Page
        and('Verify Total Unique Users Count are non zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify Total Unique Users Count are non zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let total_UniqueUsers = await getPropertyValueByXpath(occupancyPageVerify.p.total_Unique_Users, "textContent")
                reporter.startStep(`Expected Total Unique Users Count are non zero and Actual  Status - ${total_UniqueUsers}`);
                if (parseInt(total_UniqueUsers) > 0) {
                    logger.info(`Expected Total Unique Users Count are non zero and Actual  Status - ${total_UniqueUsers}`)
                    expect(parseInt(total_UniqueUsers) > 0).toBeTruthy();
                } else {
                    logger.error(`Expected Total Unique Users Count are non zero and Actual  Status - ${total_UniqueUsers}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page
        and('Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the Highest Usage Intensity Score from the web page
                let highUsageIntensity_score_Occ = await getPropertyValueByXpath(occupancyPageVerify.p.high_UsageIntensity_score, "textContent")
                let highUsageIntensity_scoreSplit = highUsageIntensity_score_Occ.split(": ");
                let highUsageIntensity_score = highUsageIntensity_scoreSplit[1]
                reporter.startStep(`Expected The Highest Usage Intensity Score are non zero and Actual  Status - ${highUsageIntensity_score}`);
                if (parseFloat(highUsageIntensity_score) > 0.0) {
                    logger.info(`Expected The Highest Usage Intensity Score are non zero and Actual  Status - ${highUsageIntensity_score}`)
                    expect(parseFloat(highUsageIntensity_score) > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Highest Usage Intensity Score are non zero and Actual  Status - ${highUsageIntensity_score}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page
        and('Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                //here fletch the data from web page
                let low_UsageIntensity_score_Occ = await getPropertyValueByXpath(occupancyPageVerify.p.low_UsageIntensity_score, "textContent")
                let low_UsageIntensity_score_OccSplit = low_UsageIntensity_score_Occ.split(": ");
                let low_UsageIntensity_score = low_UsageIntensity_score_OccSplit[1]
                reporter.startStep(`Expected The Lowest Usage Intensity Score non zero and Actual  Status - ${low_UsageIntensity_score}`);
                if (parseFloat(low_UsageIntensity_score) >= 0.0) {
                    logger.info(`Expected The Lowest Usage Intensity Score are zero and Actual  Status - ${low_UsageIntensity_score}`)
                    expect(parseFloat(low_UsageIntensity_score) >= 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Lowest Usage Intensity Score are zero and Actual  Status - ${low_UsageIntensity_score}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Total Building Visit Frequency Text
        and('Verify The Total Building Visit Frequency Text', async () => {
            reporter.startStep("And Verify The Total Building Visit Frequency Text");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                //here fletch the data from web page
                let totalBuild_Visit_Frequency_Text_Trim = await getPropertyValueByXpath(occupancyPageVerify.h5.totalBuild_Visit_Frequency_Text, "textContent")
                const totalBuild_Visit_Frequency_Text = totalBuild_Visit_Frequency_Text_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The Total Building Visit Frequency Text  - ${conFig.Building[buildingName].total_BuildingVisitFrequency_Text} and Actual  Status- ${totalBuild_Visit_Frequency_Text}`);
                if (totalBuild_Visit_Frequency_Text === conFig.Building[buildingName].total_BuildingVisitFrequency_Text) {
                    logger.info(`Expected The Total Building Visit Frequency Text  - ${conFig.Building[buildingName].total_BuildingVisitFrequency_Text} and Actual  Status- ${totalBuild_Visit_Frequency_Text}`)
                    expect(conFig.Building[buildingName].total_BuildingVisitFrequency_Text).toBe(totalBuild_Visit_Frequency_Text);
                } else {
                    logger.error(`Expected The Total Building Visit Frequency Text  - ${conFig.Building[buildingName].total_BuildingVisitFrequency_Text} and Actual  Status- ${totalBuild_Visit_Frequency_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page
        and('Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(occupancyPageVerify.h5.occ_VisitFrequencyLastUpadteTime, "textContent")
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
                if (timeDifferenceInMinutes <= 16) {
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Tenant Usage Intensity Text in Occupancy Usage Page
        and('Verify The Tenant Usage Intensity Text in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Tenant Usage Intensity Text in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let tenant_Usage_Intensity_Text_Trim = await getPropertyValueByXpath(occupancyPageVerify.div.tenant_Usage_Text, "textContent")
                const tenant_Usage_Intensity_Text = tenant_Usage_Intensity_Text_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The  Tenant Usage Intensity Text  - ${conFig.Building[buildingName].tenant_Usage_IntensityText} and Actual  Status- ${tenant_Usage_Intensity_Text}`);
                if (tenant_Usage_Intensity_Text === conFig.Building[buildingName].tenant_Usage_IntensityText) {
                    logger.info(`Expected The  Tenant Usage Intensity Text - ${conFig.Building[buildingName].tenant_Usage_IntensityText} and Actual  Status- ${tenant_Usage_Intensity_Text}`)
                    expect(conFig.Building[buildingName].tenant_Usage_IntensityText).toBe(tenant_Usage_Intensity_Text);
                } else {
                    logger.error(`Expected The  Tenant Usage Intensity Text  - ${conFig.Building[buildingName].tenant_Usage_IntensityText} and Actual  Status- ${tenant_Usage_Intensity_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page
        and('Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(occupancyPageVerify.div.tenant_Usage_Intensity_lastUpdateTime, "textContent")
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
                if (timeDifferenceInMinutes <= 16) {
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify The Usage Intensity are non Zero in Average number of users per tenant area', async () => {
            reporter.startStep("And Verify The Usage Intensity are non Zero in Average number of users per tenant area");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the Highest Usage Intensity Score from the web page
                let UsageIntensity_score_Occ = await getPropertyValueByXpath(occupancyPageVerify.p.usageIntensity, "textContent")
                reporter.startStep(`Expected The Usage Intensity Score are non zero and Actual  Status - ${UsageIntensity_score_Occ}`);
                if (parseFloat(UsageIntensity_score_Occ) > 0.0) {
                    logger.info(`Expected The  Usage Intensity Score are non zero and Actual  Status - ${UsageIntensity_score_Occ}`)
                    expect(parseFloat(UsageIntensity_score_Occ) > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The  Usage Intensity Score are non zero and Actual  Status - ${UsageIntensity_score_Occ}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });
        
    });

    test('Navigate the <Building> and Verify The Last 14 Days in Occupancy Usage Page', async ({
        given,
        when,
        then,
        and,
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

        then('Verify Last 14 Days Building Access Text in Occupancy Usage Page', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify Last 14 Days Building Access Text in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                await delay(4000)
                // Click on the occupancy tab and wait for network idle
                await Promise.all([
                    performAction("click", buildingOverview.a.occupancyTab),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000)
                // Click on the usageTab tab and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.usageTab),
                    waitForNetworkIdle(120000)
                ])
                let ss1 = await customScreenshot('building.png')
                reporter.addAttachment("building", ss1, "image/png");
                await delay(4000)
                await Promise.all([
                    performAction("click", occupancyPageVerify.button.occ_UsagaePage_Last14Days),
                    waitForNetworkIdle(120000)
                ])
                //here attached the screen shot
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                await delay(2000)
                //Then Verify Last 14 Days Building Access Text in Occupancy Usage Page
                let build_Access_Text = await getPropertyValueByXpath(occupancyPageVerify.h5.buildingAccess_Text, "textContent")
                let conFig = await getEnvConfig()
                //here fletch the date from the config file
                reporter.startStep(`Expected The Building Access Title Text  - ${conFig.Building[buildingName].buildAccess_Text} and Actual  Status- ${build_Access_Text}`);
                //here  validate the data
                if (build_Access_Text === conFig.Building[buildingName].buildAccess_Text) {
                    logger.info(`Expected The Building Access Title Text  - ${conFig.Building[buildingName].buildAccess_Text} and Actual  Status- ${build_Access_Text}`)
                    expect(conFig.Building[buildingName].buildAccess_Text).toBe(build_Access_Text);
                } else {
                    logger.error(`Expected The Building Access Title Text  - ${conFig.Building[buildingName].buildAccess_Text} and Actual  Status- ${build_Access_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        // And Verify Last 14 Days Access Summary Text in Occupancy Usage Page
        then('Verify Last 14 Days Access Summary Text in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify Last 14 Days Access Summary Text in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            // Check if Access Summary Text is available
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let access_Summary_Trim = await getPropertyValueByXpath(occupancyPageVerify.h5.accessSummaryText, "textContent")
                const access_Summary = access_Summary_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The Access Summary Text  - ${conFig.Building[buildingName].access_Summary_Text} and Actual  Status- ${access_Summary}`);
                if (access_Summary === conFig.Building[buildingName].access_Summary_Text) {
                    logger.info(`Expected The Access Summary Text  - ${conFig.Building[buildingName].access_Summary_Text} and Actual  Status- ${access_Summary}`)
                    expect(conFig.Building[buildingName].access_Summary_Text).toBe(access_Summary);
                } else {
                    logger.error(`Expected The Access Summary Text  - ${conFig.Building[buildingName].access_Summary_Text} and Actual  Status- ${access_Summary}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify The Last 14 Days Access Summary Last Upadte Time in Occupancy Usage Page
        and('Verify The Last 14 Days Access Summary Last Upadte Time in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Last 14 Days Access Summary Last Upadte Time in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the last updated time from the web page
                let Last_updatedTime = await getPropertyValueByXpath(occupancyPageVerify.div.accessSummaryLastUpdate_Time, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
                // Calculate the time difference in minutes
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
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Total Swipes Count in Occupancy Usage Page
        and('Verify Total Swips are non zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify Total Swips are non zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let totalSwips = await getPropertyValueByXpath(occupancyPageVerify.p.total_Swips, "textContent")
                reporter.startStep(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
                if (parseInt(totalSwips) > 0) {
                    logger.info(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`)
                    expect(parseInt(totalSwips) > 0).toBeTruthy();
                } else {
                    logger.error(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify Total Unique Users Count are non zero in Occupancy Usage Page
        and('Verify Total Unique Users Count are non zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify Total Unique Users Count are non zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let total_UniqueUsers = await getPropertyValueByXpath(occupancyPageVerify.p.total_Unique_Users, "textContent")
                reporter.startStep(`Expected Total Unique Users Count are non zero and Actual  Status - ${total_UniqueUsers}`);
                if (parseInt(total_UniqueUsers) > 0) {
                    logger.info(`Expected Total Unique Users Count are non zero and Actual  Status - ${total_UniqueUsers}`)
                    expect(parseInt(total_UniqueUsers) > 0).toBeTruthy();
                } else {
                    logger.error(`Expected Total Unique Users Count are non zero and Actual  Status - ${total_UniqueUsers}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page
        and('Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the Highest Usage Intensity Score from the web page
                let highUsageIntensity_score_Occ = await getPropertyValueByXpath(occupancyPageVerify.p.high_UsageIntensity_score, "textContent")
                let highUsageIntensity_scoreSplit = highUsageIntensity_score_Occ.split(": ");
                let highUsageIntensity_score = highUsageIntensity_scoreSplit[1]
                reporter.startStep(`Expected The Highest Usage Intensity Score are non zero and Actual  Status - ${highUsageIntensity_score}`);
                if (parseFloat(highUsageIntensity_score) > 0.0) {
                    logger.info(`Expected The Highest Usage Intensity Score are non zero and Actual  Status - ${highUsageIntensity_score}`)
                    expect(parseFloat(highUsageIntensity_score) > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Highest Usage Intensity Score are non zero and Actual  Status - ${highUsageIntensity_score}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page
        and('Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                //here fletch the data from web page
                let low_UsageIntensity_score_Occ = await getPropertyValueByXpath(occupancyPageVerify.p.low_UsageIntensity_score, "textContent")
                let low_UsageIntensity_score_OccSplit = low_UsageIntensity_score_Occ.split(": ");
                let low_UsageIntensity_score = low_UsageIntensity_score_OccSplit[1]
                reporter.startStep(`Expected The Lowest Usage Intensity Score non zero and Actual  Status - ${low_UsageIntensity_score}`);
                if (parseFloat(low_UsageIntensity_score) >= 0.0) {
                    logger.info(`Expected The Lowest Usage Intensity Score are zero and Actual  Status - ${low_UsageIntensity_score}`)
                    expect(parseFloat(low_UsageIntensity_score) >= 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Lowest Usage Intensity Score are zero and Actual  Status - ${low_UsageIntensity_score}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Total Building Visit Frequency Text
        and('Verify The Total Building Visit Frequency Text', async () => {
            reporter.startStep("And Verify The Total Building Visit Frequency Text");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                //here fletch the data from web page
                let totalBuild_Visit_Frequency_Text_Trim = await getPropertyValueByXpath(occupancyPageVerify.h5.totalBuild_Visit_Frequency_Text, "textContent")
                const totalBuild_Visit_Frequency_Text = totalBuild_Visit_Frequency_Text_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The Total Building Visit Frequency Text  - ${conFig.Building[buildingName].total_BuildingVisitFrequency_Text} and Actual  Status- ${totalBuild_Visit_Frequency_Text}`);
                if (totalBuild_Visit_Frequency_Text === conFig.Building[buildingName].total_BuildingVisitFrequency_Text) {
                    logger.info(`Expected The Total Building Visit Frequency Text  - ${conFig.Building[buildingName].total_BuildingVisitFrequency_Text} and Actual  Status- ${totalBuild_Visit_Frequency_Text}`)
                    expect(conFig.Building[buildingName].total_BuildingVisitFrequency_Text).toBe(totalBuild_Visit_Frequency_Text);
                } else {
                    logger.error(`Expected The Total Building Visit Frequency Text  - ${conFig.Building[buildingName].total_BuildingVisitFrequency_Text} and Actual  Status- ${totalBuild_Visit_Frequency_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page
        and('Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(occupancyPageVerify.h5.occ_VisitFrequencyLastUpadteTime, "textContent")
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
                if (timeDifferenceInMinutes <= 16) {
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Tenant Usage Intensity Text in Occupancy Usage Page
        and('Verify The Tenant Usage Intensity Text in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Tenant Usage Intensity Text in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let tenant_Usage_Intensity_Text_Trim = await getPropertyValueByXpath(occupancyPageVerify.div.tenant_Usage_Text, "textContent")
                const tenant_Usage_Intensity_Text = tenant_Usage_Intensity_Text_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The  Tenant Usage Intensity Text  - ${conFig.Building[buildingName].tenant_Usage_IntensityText} and Actual  Status- ${tenant_Usage_Intensity_Text}`);
                if (tenant_Usage_Intensity_Text === conFig.Building[buildingName].tenant_Usage_IntensityText) {
                    logger.info(`Expected The  Tenant Usage Intensity Text - ${conFig.Building[buildingName].tenant_Usage_IntensityText} and Actual  Status- ${tenant_Usage_Intensity_Text}`)
                    expect(conFig.Building[buildingName].tenant_Usage_IntensityText).toBe(tenant_Usage_Intensity_Text);
                } else {
                    logger.error(`Expected The  Tenant Usage Intensity Text  - ${conFig.Building[buildingName].tenant_Usage_IntensityText} and Actual  Status- ${tenant_Usage_Intensity_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page
        and('Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(occupancyPageVerify.div.tenant_Usage_Intensity_lastUpdateTime, "textContent")
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
                if (timeDifferenceInMinutes <= 16) {
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

// And Verify The Usage Intensity are non Zero in Average number of users per tenant area
and('Verify The Usage Intensity are non Zero in Average number of users per tenant area', async () => {
    reporter.startStep("And Verify The Usage Intensity are non Zero in Average number of users per tenant area");
    // Get environment configuration
    let configFile = await getEnvConfig()
    if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
        // Log an error if not available
        logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
        reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
        reporter.endStep();
    } else {
        // Get the Highest Usage Intensity Score from the web page
        let UsageIntensity_score_Occ = await getPropertyValueByXpath(occupancyPageVerify.p.usageIntensity, "textContent")
        reporter.startStep(`Expected The Usage Intensity Score are non zero and Actual  Status - ${UsageIntensity_score_Occ}`);
        if (parseFloat(UsageIntensity_score_Occ) > 0.0) {
            logger.info(`Expected The  Usage Intensity Score are non zero and Actual  Status - ${UsageIntensity_score_Occ}`)
            expect(parseFloat(UsageIntensity_score_Occ) > 0.0).toBeTruthy();
        } else {
            logger.error(`Expected The  Usage Intensity Score are non zero and Actual  Status - ${UsageIntensity_score_Occ}`);
            expect(true).toBe(false)
        }
        reporter.endStep();
    }
    reporter.endStep();
});
    });

    test('Navigate the <Building> and Verify The Last 30 Days in Occupancy Usage Page', async ({
        given,
        when,
        then,
        and,
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

        then('Verify Last 30 Days Building Access Text in Occupancy Usage Page', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify Last 30 Days Building Access Text in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                await delay(4000)
                // Click on the occupancy tab and wait for network idle
                await Promise.all([
                    performAction("click", buildingOverview.a.occupancyTab),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000)
                // Click on the usageTab tab and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.usageTab),
                    waitForNetworkIdle(120000)
                ])
                let ss1 = await customScreenshot('building.png')
                reporter.addAttachment("building", ss1, "image/png");
                await delay(4000)
                await Promise.all([
                    performAction("click", occupancyPageVerify.button.occ_UsagePage_Last30Days),
                    waitForNetworkIdle(120000)
                ])
                //here attached the screen shot
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                await delay(2000)
                //Then Verify Last 30 Days Building Access Text in Occupancy Usage Page
                let build_Access_Text = await getPropertyValueByXpath(occupancyPageVerify.h5.buildingAccess_Text, "textContent")
                let conFig = await getEnvConfig()
                //here fletch the date from the config file
                reporter.startStep(`Expected The Building Access Title Text  - ${conFig.Building[buildingName].buildAccess_Text} and Actual  Status- ${build_Access_Text}`);
                //here  validate the data
                if (build_Access_Text === conFig.Building[buildingName].buildAccess_Text) {
                    logger.info(`Expected The Building Access Title Text  - ${conFig.Building[buildingName].buildAccess_Text} and Actual  Status- ${build_Access_Text}`)
                    expect(conFig.Building[buildingName].buildAccess_Text).toBe(build_Access_Text);
                } else {
                    logger.error(`Expected The Building Access Title Text  - ${conFig.Building[buildingName].buildAccess_Text} and Actual  Status- ${build_Access_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        // And Verify Last 30 Days Access Summary Text in Occupancy Usage Page
        then('Verify Last 30 Days Access Summary Text in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify Last 30 Days Access Summary Text in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            // Check if Access Summary Text is available
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let access_Summary_Trim = await getPropertyValueByXpath(occupancyPageVerify.h5.accessSummaryText, "textContent")
                const access_Summary = access_Summary_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The Access Summary Text  - ${conFig.Building[buildingName].access_Summary_Text} and Actual  Status- ${access_Summary}`);
                if (access_Summary === conFig.Building[buildingName].access_Summary_Text) {
                    logger.info(`Expected The Access Summary Text  - ${conFig.Building[buildingName].access_Summary_Text} and Actual  Status- ${access_Summary}`)
                    expect(conFig.Building[buildingName].access_Summary_Text).toBe(access_Summary);
                } else {
                    logger.error(`Expected The Access Summary Text  - ${conFig.Building[buildingName].access_Summary_Text} and Actual  Status- ${access_Summary}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify The Last 30 Days Access Summary Last Upadte Time in Occupancy Usage Page
        and('Verify The Last 30 Days Access Summary Last Upadte Time in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Last 30 Days Access Summary Last Upadte Time in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the last updated time from the web page
                let Last_updatedTime = await getPropertyValueByXpath(occupancyPageVerify.div.accessSummaryLastUpdate_Time, "textContent")
                let Last_updatedTimeSplit = Last_updatedTime.split(": ");
                let last__Update_Time_OverView = Last_updatedTimeSplit[1]
                // Get the current EST time
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let totaltime = splitvalueDate + ", " + last__Update_Time_OverView
                // Calculate the time difference in minutes
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
                // Check if the time difference is less than or equal to 16 minutes.
                if (timeDifferenceInMinutes <= 16) {
                    // Log success if the time difference is within the allowed range.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 16 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Total Swipes Count in Occupancy Usage Page
        and('Verify Total Swips are non zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify Total Swips are non zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let totalSwips = await getPropertyValueByXpath(occupancyPageVerify.p.total_Swips, "textContent")
                reporter.startStep(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
                if (parseInt(totalSwips) > 0) {
                    logger.info(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`)
                    expect(parseInt(totalSwips) > 0).toBeTruthy();
                } else {
                    logger.error(`Expected Total Swips are non zero and Actual  Status - ${totalSwips}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify Total Unique Users Count are non zero in Occupancy Usage Page
        and('Verify Total Unique Users Count are non zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify Total Unique Users Count are non zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let total_UniqueUsers = await getPropertyValueByXpath(occupancyPageVerify.p.total_Unique_Users, "textContent")
                reporter.startStep(`Expected Total Unique Users Count are non zero and Actual  Status - ${total_UniqueUsers}`);
                if (parseInt(total_UniqueUsers) > 0) {
                    logger.info(`Expected Total Unique Users Count are non zero and Actual  Status - ${total_UniqueUsers}`)
                    expect(parseInt(total_UniqueUsers) > 0).toBeTruthy();
                } else {
                    logger.error(`Expected Total Unique Users Count are non zero and Actual  Status - ${total_UniqueUsers}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page
        and('Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                // Get the Highest Usage Intensity Score from the web page
                let highUsageIntensity_score_Occ = await getPropertyValueByXpath(occupancyPageVerify.p.high_UsageIntensity_score, "textContent")
                let highUsageIntensity_scoreSplit = highUsageIntensity_score_Occ.split(": ");
                let highUsageIntensity_score = highUsageIntensity_scoreSplit[1]
                reporter.startStep(`Expected The Highest Usage Intensity Score are non zero and Actual  Status - ${highUsageIntensity_score}`);
                if (parseFloat(highUsageIntensity_score) > 0.0) {
                    logger.info(`Expected The Highest Usage Intensity Score are non zero and Actual  Status - ${highUsageIntensity_score}`)
                    expect(parseFloat(highUsageIntensity_score) > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Highest Usage Intensity Score are non zero and Actual  Status - ${highUsageIntensity_score}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page
        and('Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                //here fletch the data from web page
                let low_UsageIntensity_score_Occ = await getPropertyValueByXpath(occupancyPageVerify.p.low_UsageIntensity_score, "textContent")
                let low_UsageIntensity_score_OccSplit = low_UsageIntensity_score_Occ.split(": ");
                let low_UsageIntensity_score = low_UsageIntensity_score_OccSplit[1]
                reporter.startStep(`Expected The Lowest Usage Intensity Score non zero and Actual  Status - ${low_UsageIntensity_score}`);
                if (parseFloat(low_UsageIntensity_score) >= 0.0) {
                    logger.info(`Expected The Lowest Usage Intensity Score are zero and Actual  Status - ${low_UsageIntensity_score}`)
                    expect(parseFloat(low_UsageIntensity_score) >= 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Lowest Usage Intensity Score are zero and Actual  Status - ${low_UsageIntensity_score}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Total Building Visit Frequency Text
        and('Verify The Total Building Visit Frequency Text', async () => {
            reporter.startStep("And Verify The Total Building Visit Frequency Text");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                //here fletch the data from web page
                let totalBuild_Visit_Frequency_Text_Trim = await getPropertyValueByXpath(occupancyPageVerify.h5.totalBuild_Visit_Frequency_Text, "textContent")
                const totalBuild_Visit_Frequency_Text = totalBuild_Visit_Frequency_Text_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The Total Building Visit Frequency Text  - ${conFig.Building[buildingName].total_BuildingVisitFrequency_Text} and Actual  Status- ${totalBuild_Visit_Frequency_Text}`);
                if (totalBuild_Visit_Frequency_Text === conFig.Building[buildingName].total_BuildingVisitFrequency_Text) {
                    logger.info(`Expected The Total Building Visit Frequency Text  - ${conFig.Building[buildingName].total_BuildingVisitFrequency_Text} and Actual  Status- ${totalBuild_Visit_Frequency_Text}`)
                    expect(conFig.Building[buildingName].total_BuildingVisitFrequency_Text).toBe(totalBuild_Visit_Frequency_Text);
                } else {
                    logger.error(`Expected The Total Building Visit Frequency Text  - ${conFig.Building[buildingName].total_BuildingVisitFrequency_Text} and Actual  Status- ${totalBuild_Visit_Frequency_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page
        and('Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(occupancyPageVerify.h5.occ_VisitFrequencyLastUpadteTime, "textContent")
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
                if (timeDifferenceInMinutes <= 16) {
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Tenant Usage Intensity Text in Occupancy Usage Page
        and('Verify The Tenant Usage Intensity Text in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Tenant Usage Intensity Text in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let tenant_Usage_Intensity_Text_Trim = await getPropertyValueByXpath(occupancyPageVerify.div.tenant_Usage_Text, "textContent")
                const tenant_Usage_Intensity_Text = tenant_Usage_Intensity_Text_Trim.trim();
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected The  Tenant Usage Intensity Text  - ${conFig.Building[buildingName].tenant_Usage_IntensityText} and Actual  Status- ${tenant_Usage_Intensity_Text}`);
                if (tenant_Usage_Intensity_Text === conFig.Building[buildingName].tenant_Usage_IntensityText) {
                    logger.info(`Expected The  Tenant Usage Intensity Text - ${conFig.Building[buildingName].tenant_Usage_IntensityText} and Actual  Status- ${tenant_Usage_Intensity_Text}`)
                    expect(conFig.Building[buildingName].tenant_Usage_IntensityText).toBe(tenant_Usage_Intensity_Text);
                } else {
                    logger.error(`Expected The  Tenant Usage Intensity Text  - ${conFig.Building[buildingName].tenant_Usage_IntensityText} and Actual  Status- ${tenant_Usage_Intensity_Text}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page
        and('Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page', async () => {
            reporter.startStep("And Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page");
            // Get environment configuration
            let configFile = await getEnvConfig()
            if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
                // Log an error if not available
                logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
                reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
                reporter.endStep();
            } else {
                let Last_updatedTime = await getPropertyValueByXpath(occupancyPageVerify.div.tenant_Usage_Intensity_lastUpdateTime, "textContent")
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
                if (timeDifferenceInMinutes <= 16) {
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`)
                    expect(timeDifferenceInMinutes <= 16).toBeTruthy()
                } else {
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${totaltime}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        // And Verify The Usage Intensity are non Zero in Average number of users per tenant area
and('Verify The Usage Intensity are non Zero in Average number of users per tenant area', async () => {
    reporter.startStep("And Verify The Usage Intensity are non Zero in Average number of users per tenant area");
    // Get environment configuration
    let configFile = await getEnvConfig()
    if (configFile.Building[buildingName]['Occupancy_UsagePage'] == 'NA') {
        // Log an error if not available
        logger.error(`The Occupancy Usage Page is not available in ${buildingName}`)
        reporter.startStep(`The Occupancy Usage Page is not available in ${buildingName}`);
        reporter.endStep();
    } else {
        // Get the Highest Usage Intensity Score from the web page
        let UsageIntensity_score_Occ = await getPropertyValueByXpath(occupancyPageVerify.p.usageIntensity, "textContent")
        reporter.startStep(`Expected The Usage Intensity Score are non zero and Actual  Status - ${UsageIntensity_score_Occ}`);
        if (parseFloat(UsageIntensity_score_Occ) > 0.0) {
            logger.info(`Expected The  Usage Intensity Score are non zero and Actual  Status - ${UsageIntensity_score_Occ}`)
            expect(parseFloat(UsageIntensity_score_Occ) > 0.0).toBeTruthy();
        } else {
            logger.error(`Expected The  Usage Intensity Score are non zero and Actual  Status - ${UsageIntensity_score_Occ}`);
            expect(true).toBe(false)
        }
        reporter.endStep();
    }
    reporter.endStep();
});
    });

    test('Navigate the <Building> and Verify The Day and Building Entrance for Today in Occupancy Page', async ({
        given,
        when,
        then,
        and,
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

        then('Verify The Day for Average over last 90 days in Building Occupancy', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify The Day for Average over last 90 days in Building Occupancy");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Occ_average_Day'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    await delay(6000)
                    // Click on the occupancy tab and wait for network idle
                    await Promise.all([
                        performAction("click", buildingOverview.a.occupancyTab),
                        waitForNetworkIdle(120000)
                    ])
                    // Wait for 2 seconds
                    await delay(2000)
                    // Click on the "Today" button again and wait for network idle
                    await Promise.all([
                        performAction("click", tenantAdmin.button.today),
                        waitForNetworkIdle(120000)
                    ])
                    await delay(4000)
                    await Promise.all([
                        performAction("click", tenantAdmin.button.today),
                        waitForNetworkIdle(120000)
                    ])
                    // Wait for 2 seconds
                    await delay(2000)
                    // Take a screenshot and attach it to the report
                    let ss = await customScreenshot('env.png')
                    reporter.addAttachment("env", ss, "image/png");
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.average_Day_BuildOccupancy, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === avg_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`)
                        expect(splitvalueDate).toBe(avg_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        // And Verify The Day for Peak over last 90 days in Building Occupancy
        and('Verify The Day for Peak over last 90 days in Building Occupancy', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Peak The Day for Peak over last 90 days in Building Occupancy");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Occ_Peak_Day'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Peak over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Peak over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.peak_Day_BuildOccupancy, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let Peak_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === Peak_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`)
                        expect(splitvalueDate).toBe(Peak_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        //And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic
        and('Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                // Get environment configuration
                //  let configFile = await getEnvConfig()
                if (configFile.Building[buildingName]['LobbyFootTrafic_AvgDay'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === avg_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`)
                        expect(splitvalueDate).toBe(avg_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        // And Verify The Building Entrance Name List on Building Occupancy Details
        and('Verify The Building Entrance Name List on Building Occupancy Details', async () => {
            reporter.startStep("And Verify The Building Entrance Name List on Building Occupancy Details");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (conFig.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (conFig.Building[buildingName].Building_Entrance_Name_list == 'NA') {
                    logger.info(`Building Entrance Name is  not available in ${buildingName} building`);
                    reporter.startStep(`Building Entrance name is  not available in ${buildingName} building`);
                    reporter.endStep();
                } else {
                    let ss = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss, "image/png");
                    var building_Entrance_Name = conFig.Building[buildingName].Building_Entrance_Name_list
                    let building_Entrance_List_xp = await getElementHandleByXpath(occupancyPageVerify.div.building_Entrance_Name_List);
                    reporter.startStep(`The Building Entrance Expected count is ${parseInt(conFig.Building[buildingName].building_Entrance_Count)}   and Actual count is - ${building_Entrance_List_xp.length}`);
                    expect(parseInt(conFig.Building[buildingName].building_Entrance_Count)).toBe(building_Entrance_List_xp.length);
                    reporter.endStep();
                    for (let i = 0; i < building_Entrance_List_xp.length; i++) {
                        let building_Entrance_List = await getPropertyValue(building_Entrance_List_xp[i], "textContent");
                        reporter.startStep(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance  Name - ${building_Entrance_List}`);
                        if (building_Entrance_Name.includes(building_Entrance_List)) {
                            logger.info(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance Name - ${building_Entrance_List}`);
                            expect(building_Entrance_Name.includes(building_Entrance_List)).toBeTruthy();

                        } else {
                            logger.error(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance Name- ${building_Entrance_List}`);
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    }
                }
            }
            reporter.endStep();
        });
    });

    test('Navigate the <Building> and Verify The Day and Building Entrance for Yesterday in Occupancy Page', async ({
        given,
        when,
        then,
        and,
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

        then('Verify The Day for Average over last 90 days in Building Occupancy', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify The Day for Average over last 90 days in Building Occupancy");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Occ_average_Day'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    await delay(6000)
                    // Click on the occupancy tab and wait for network idle
                    await Promise.all([
                        performAction("click", buildingOverview.a.occupancyTab),
                        waitForNetworkIdle(120000)
                    ])
                    // Wait for 2 seconds
                    await delay(2000)
                    await Promise.all([
                        performAction("click", tenantAdmin.button.today),
                        waitForNetworkIdle(120000)
                    ])
                    await delay(4000)
                    await Promise.all([
                        performAction("click", tenantAdmin.button.yesterday),
                        waitForNetworkIdle(120000)
                    ])
                    // Wait for 2 seconds
                    await delay(2000)
                    // Take a screenshot and attach it to the report
                    let ss = await customScreenshot('env.png')
                    reporter.addAttachment("env", ss, "image/png");
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.average_Day_BuildOccupancy, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()-1];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === avg_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`)
                        expect(splitvalueDate).toBe(avg_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        // And Verify The Day for Peak over last 90 days in Building Occupancy
        and('Verify The Day for Peak over last 90 days in Building Occupancy', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Peak The Day for Peak over last 90 days in Building Occupancy");

            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Occ_Peak_Day'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Peak over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Peak over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.peak_Day_BuildOccupancy, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let Peak_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()-1];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === Peak_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`)
                        expect(splitvalueDate).toBe(Peak_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        //And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic
        and('Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                // Get environment configuration
                //  let configFile = await getEnvConfig()
                if (configFile.Building[buildingName]['LobbyFootTrafic_AvgDay'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()-1];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === avg_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`)
                        expect(splitvalueDate).toBe(avg_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        // And Verify The Building Entrance Name List on Building Occupancy Details
        and('Verify The Building Entrance Name List on Building Occupancy Details', async () => {
            reporter.startStep("And Verify The Building Entrance Name List on Building Occupancy Details");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (conFig.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (conFig.Building[buildingName].Building_Entrance_Name_list == 'NA') {
                    logger.info(`Building Entrance Name is  not available in ${buildingName} building`);
                    reporter.startStep(`Building Entrance name is  not available in ${buildingName} building`);
                    reporter.endStep();
                } else {
                    let ss = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss, "image/png");
                    var building_Entrance_Name = conFig.Building[buildingName].Building_Entrance_Name_list
                    let building_Entrance_List_xp = await getElementHandleByXpath(occupancyPageVerify.div.building_Entrance_Name_List);
                    reporter.startStep(`The Building Entrance Expected count is ${parseInt(conFig.Building[buildingName].building_Entrance_Count)}   and Actual count is - ${building_Entrance_List_xp.length}`);
                    expect(parseInt(conFig.Building[buildingName].building_Entrance_Count)).toBe(building_Entrance_List_xp.length);
                    reporter.endStep();
                    for (let i = 0; i < building_Entrance_List_xp.length; i++) {
                        let building_Entrance_List = await getPropertyValue(building_Entrance_List_xp[i], "textContent");
                        reporter.startStep(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance  Name - ${building_Entrance_List}`);
                        if (building_Entrance_Name.includes(building_Entrance_List)) {
                            logger.info(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance Name - ${building_Entrance_List}`);
                            expect(building_Entrance_Name.includes(building_Entrance_List)).toBeTruthy();

                        } else {
                            logger.error(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance Name- ${building_Entrance_List}`);
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    }
                }
            }
            reporter.endStep();
        });
    });

    test('Navigate the <Building> and Verify The Day and Building Entrance for Last 7 Days in Occupancy Page', async ({
        given,
        when,
        then,
        and,
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

        then('Verify The Day for Average over last 90 days in Building Occupancy', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify The Day for Average over last 90 days in Building Occupancy");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Occ_average_Day'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    await delay(6000)
                    // Click on the occupancy tab and wait for network idle
                    await Promise.all([
                        performAction("click", buildingOverview.a.occupancyTab),
                        waitForNetworkIdle(120000)
                    ])
                    // Wait for 2 seconds
                    await delay(2000)
                    await Promise.all([
                        performAction("click", tenantAdmin.button.today),
                        waitForNetworkIdle(120000)
                    ])
                    await delay(4000)
                    await Promise.all([
                        performAction("click", tenantAdmin.button.last7Days),
                        waitForNetworkIdle(120000)
                    ])
                    // Wait for 2 seconds
                    await delay(2000)
                    // Take a screenshot and attach it to the report
                    let ss = await customScreenshot('env.png')
                    reporter.addAttachment("env", ss, "image/png");
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.average_Day_BuildOccupancy, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                   currentDate.setDate(currentDate.getDate()-7);  // Subtract 30 to get the date 30 days ago
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === avg_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`)
                        expect(splitvalueDate).toBe(avg_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        // And Verify The Day for Peak over last 90 days in Building Occupancy
        and('Verify The Day for Peak over last 90 days in Building Occupancy', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Peak The Day for Peak over last 90 days in Building Occupancy");

            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Occ_Peak_Day'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Peak over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Peak over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.peak_Day_BuildOccupancy, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let Peak_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                    currentDate.setDate(currentDate.getDate()-7);  // Subtract 30 to get the date 30 days ago
                     var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                     var splitvalueDate = daysOfWeek[currentDate.getDay()];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === Peak_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`)
                        expect(splitvalueDate).toBe(Peak_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        //And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic
        and('Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                // Get environment configuration
                //  let configFile = await getEnvConfig()
                if (configFile.Building[buildingName]['LobbyFootTrafic_AvgDay'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                   currentDate.setDate(currentDate.getDate()-7);  // Subtract 30 to get the date 30 days ago
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === avg_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`)
                        expect(splitvalueDate).toBe(avg_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        // And Verify The Building Entrance Name List on Building Occupancy Details
        and('Verify The Building Entrance Name List on Building Occupancy Details', async () => {
            reporter.startStep("And Verify The Building Entrance Name List on Building Occupancy Details");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (conFig.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (conFig.Building[buildingName].Building_Entrance_Name_list == 'NA') {
                    logger.info(`Building Entrance Name is  not available in ${buildingName} building`);
                    reporter.startStep(`Building Entrance name is  not available in ${buildingName} building`);
                    reporter.endStep();
                } else {
                    let ss = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss, "image/png");
                    var building_Entrance_Name = conFig.Building[buildingName].Building_Entrance_Name_list
                    let building_Entrance_List_xp = await getElementHandleByXpath(occupancyPageVerify.div.building_Entrance_Name_List);
                    reporter.startStep(`The Building Entrance Expected count is ${parseInt(conFig.Building[buildingName].building_Entrance_Count)}   and Actual count is - ${building_Entrance_List_xp.length}`);
                    expect(parseInt(conFig.Building[buildingName].building_Entrance_Count)).toBe(building_Entrance_List_xp.length);
                    reporter.endStep();
                    for (let i = 0; i < building_Entrance_List_xp.length; i++) {
                        let building_Entrance_List = await getPropertyValue(building_Entrance_List_xp[i], "textContent");
                        reporter.startStep(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance  Name - ${building_Entrance_List}`);
                        if (building_Entrance_Name.includes(building_Entrance_List)) {
                            logger.info(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance Name - ${building_Entrance_List}`);
                            expect(building_Entrance_Name.includes(building_Entrance_List)).toBeTruthy();

                        } else {
                            logger.error(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance Name- ${building_Entrance_List}`);
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    }
                }
            }
            reporter.endStep();
        });
    });

    test('Navigate the <Building> and Verify The Day and Building Entrance for Last 30 Days in Occupancy Page', async ({
        given,
        when,
        then,
        and,
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

        then('Verify The Day for Average over last 90 days in Building Occupancy', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Verify The Day for Average over last 90 days in Building Occupancy");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Occ_average_Day'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    await delay(6000)
                    // Click on the occupancy tab and wait for network idle
                    await Promise.all([
                        performAction("click", buildingOverview.a.occupancyTab),
                        waitForNetworkIdle(120000)
                    ])
                    // Wait for 2 seconds
                    await delay(2000)
                    await Promise.all([
                        performAction("click", tenantAdmin.button.today),
                        waitForNetworkIdle(120000)
                    ])
                    await delay(4000)
                    await Promise.all([
                        performAction("click", tenantAdmin.button.last30DaysClick),
                        waitForNetworkIdle(120000)
                    ])
                    // Wait for 2 seconds
                    await delay(2000)
                    // Take a screenshot and attach it to the report
                    let ss = await customScreenshot('env.png')
                    reporter.addAttachment("env", ss, "image/png");
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.average_Day_BuildOccupancy, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                   currentDate.setDate(currentDate.getDate()-30);  // Subtract 30 to get the date 30 days ago
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === avg_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`)
                        expect(splitvalueDate).toBe(avg_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        // And Verify The Day for Peak over last 90 days in Building Occupancy
        and('Verify The Day for Peak over last 90 days in Building Occupancy', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("Then Peak The Day for Peak over last 90 days in Building Occupancy");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (configFile.Building[buildingName]['Occ_Peak_Day'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Peak over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Peak over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.peak_Day_BuildOccupancy, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let Peak_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                    currentDate.setDate(currentDate.getDate()-30);  // Subtract 30 to get the date 30 days ago
                     var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                     var splitvalueDate = daysOfWeek[currentDate.getDay()];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === Peak_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`)
                        expect(splitvalueDate).toBe(Peak_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${Peak_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        //And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic
        and('Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic', async () => {
            // This line starts a reporting step, indicating the beginning of the verification process.
            reporter.startStep("And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let configFile = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (configFile.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                // Get environment configuration
                //  let configFile = await getEnvConfig()
                if (configFile.Building[buildingName]['LobbyFootTrafic_AvgDay'] == 'NA') {
                    // Log an error if not available
                    logger.error(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`)
                    reporter.startStep(`The Day for Average over last 90 days in Building Occupancy is not available in ${buildingName}`);
                    reporter.endStep();
                } else {
                    let PeakUsers = await getPropertyValueByXpath(occupancyPageVerify.div.averageDay_Lobby_Foot_Traffic, "textContent")
                    let PeakUserssplit = PeakUsers.split(" ");
                    let avg_Day = PeakUserssplit[1]
                    var currentDate = new Date();
                   currentDate.setDate(currentDate.getDate()-30);  // Subtract 30 to get the date 30 days ago
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var splitvalueDate = daysOfWeek[currentDate.getDay()];
                    reporter.startStep(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                    reporter.endStep();
                    if (splitvalueDate === avg_Day) {
                        logger.info(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`)
                        expect(splitvalueDate).toBe(avg_Day);
                    } else {
                        logger.error(`Expected the Average day in 90 days - ${splitvalueDate} Actual Average day - ${avg_Day}`);
                        expect(true).toBe(false)
                    }
                }
            }
            reporter.endStep();
        });

        // And Verify The Building Entrance Name List on Building Occupancy Details
        and('Verify The Building Entrance Name List on Building Occupancy Details', async () => {
            reporter.startStep("And Verify The Building Entrance Name List on Building Occupancy Details");
            // Check the building if Occupancy_Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building Occupancy_Page is available
            if (conFig.Building[buildingName].Occupancy_Page == 'NA') {
                logger.info(`Occupancy Page not available`);
                reporter.startStep(`Occupancy Page not available`);
                reporter.endStep();
            } else {
                if (conFig.Building[buildingName].Building_Entrance_Name_list == 'NA') {
                    logger.info(`Building Entrance Name is  not available in ${buildingName} building`);
                    reporter.startStep(`Building Entrance name is  not available in ${buildingName} building`);
                    reporter.endStep();
                } else {
                    let ss = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss, "image/png");
                    var building_Entrance_Name = conFig.Building[buildingName].Building_Entrance_Name_list
                    let building_Entrance_List_xp = await getElementHandleByXpath(occupancyPageVerify.div.building_Entrance_Name_List);
                    reporter.startStep(`The Building Entrance Expected count is ${parseInt(conFig.Building[buildingName].building_Entrance_Count)}   and Actual count is - ${building_Entrance_List_xp.length}`);
                    expect(parseInt(conFig.Building[buildingName].building_Entrance_Count)).toBe(building_Entrance_List_xp.length);
                    reporter.endStep();
                    for (let i = 0; i < building_Entrance_List_xp.length; i++) {
                        let building_Entrance_List = await getPropertyValue(building_Entrance_List_xp[i], "textContent");
                        reporter.startStep(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance  Name - ${building_Entrance_List}`);
                        if (building_Entrance_Name.includes(building_Entrance_List)) {
                            logger.info(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance Name - ${building_Entrance_List}`);
                            expect(building_Entrance_Name.includes(building_Entrance_List)).toBeTruthy();
                        } else {
                            logger.error(`Expected The Building Entrance Name  - ${building_Entrance_Name} and Actual Entrance Name- ${building_Entrance_List}`);
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    }
                }
            }
            reporter.endStep();
        });
    });

});
