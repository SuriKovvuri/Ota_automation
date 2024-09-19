import { assert } from 'console';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, delay, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab, envTab, verifyBuildPage, tenantAdmin, commons, VerifyOccupancySensors, energyPage } from '../constants/locators';
import { environment_Sensor } from '../constants/environment_sensor';

import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding } from './shared-steps';
import exp from 'constants';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./sbpe2e/features/navigateRegressionEnergyPage.feature',
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

    test('Navigate to Building and validate <Building> Calendar Year in Energy page', async ({
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

        // Verify The Energy Usage Title in Calendar Year page
        then('Verify The Energy Usage Title in Calendar Year page', async () => {
            reporter.startStep("Then Verify The Energy Usage Title in Calendar Year page");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig()
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // Take a screenshot and attach it to the report
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                await delay(6000)
                // Click on the "energy_Page" tab and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(90000)
                ])
                // Click on the "calender_Year" button again and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.calender_Year),
                    waitForNetworkIdle(120000)
                ])
                // Compare the expected title text with the actual text on the web page.
                let energyPageTitle = await getPropertyValueByXpath(energyPage.h5.energyPage_Title, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Title  - ${conFig.Building[buildingName].energypage_Title} and Actual Title - ${energyPageTitle}`);
                if (energyPageTitle === conFig.Building[buildingName].energypage_Title) {
                    // Log a success message if the texts match.
                    logger.info(`Expected Title  - ${conFig.Building[buildingName].energypage_Title} and Actual Title - ${energyPageTitle}`)
                    expect(conFig.Building[buildingName].energypage_Title).toBe(energyPageTitle);
                } else {
                    logger.error(`Expected Title  - ${conFig.Building[buildingName].energypage_Title} and Actual Title - ${energyPageTitle}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify Calendar Year Page last Update Time 
        and('Verify Calendar Year Page last Update Time', async () => {
            reporter.startStep("And Verify Calendar Year Page last Update Time");
            // Get environment configuration
            let conFig = await getEnvConfig()
            // Log an error if not available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // let configFile = await getEnvConfig()
                // if ('Last_updated_time' in configFile.Building[buildingName] && configFile.Building[buildingName]['Last_updated_time'] == 'NA') {
                //     logger.error(`Last updated time not available in ${buildingName}`)
                //     reporter.startStep(`Last updated time not available in ${buildingName}`);
                //     reporter.endStep();
                // } else {
                let portal_Last_Update = await getPropertyValueByXpath(energyPage.div.energy_LastUpdate_Time, "textContent")
                let portalDatesplit = portal_Last_Update.split(": ");
                let last_Update = portalDatesplit[1]
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                await delay(2000)
                // Get the current EST time
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let last__Update_Time_OverView = splitvalueDate + "," + last_Update
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
                let timeDifferenceInMinutes = Math.round((new Date(strTimeEST) - new Date(last__Update_Time_OverView)) / 60000);
                // Log and report the time comparison
                reporter.startStep(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`);
                // Check if the time difference is less than or equal to 15 minutes.
                if (timeDifferenceInMinutes <= 15) {
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`)
                    expect(timeDifferenceInMinutes <= 15).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 15 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify The Average monthly tenant usage Text in Calendar Year page
        and('Verify The Average monthly tenant usage Text in Calendar Year page', async () => {
            // Start a reporting step
            reporter.startStep(`And Verify The Average monthly tenant usage Text in Calendar Year page`);
            // Get environment configuration
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // Log an error message and report it
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // If available, get the Average monthly tenant usage Text from a specific location (XPath)
                let averageUsageTxt = await getPropertyValueByXpath(tenantAdmin.div.averageUsage_Txt, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Average monthly tenant usage Text  - ${conFig.Building[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
                // Log an info message and use an assertion to ensure it's true
                if (averageUsageTxt === conFig.Building[buildingName].averageUsage_Txt) {
                    logger.info(`Expected Average monthly tenant usage text  - ${conFig.Building[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`)
                    expect(conFig.Building[buildingName].averageUsage_Txt).toBe(averageUsageTxt);
                } else {
                    //log an error and fail the assertion
                    logger.error(`Expected Average monthly tenant usage text  - ${conFig.Building[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify The Energy consumption and EUI for Calendar year', async () => {
            reporter.startStep(`And Verify The Energy consumption and EUI for Calendar year`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // Get the Average Monthly Usage consumption from the web page 
                let averageMonthConsum = await getPropertyValueByXpath(tenantAdmin.div.average_Month_Consum, "textContent")
                reporter.startStep(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
                reporter.endStep();
                if (averageMonthConsum > 0 + " KWH") {
                    // Log an info message and use an assertion to ensure it's true
                    logger.info(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`)
                    expect(averageMonthConsum > 0 + " KWH").toBeTruthy();
                } else {
                    //log an error and fail the assertion
                    logger.error(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
                    expect(true).toBe(false);
                }
                // Get the Lowest Monthly Usage consumption from the web page 
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
                // Get the Highest Monthly Usage consumption from the web page 
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
                // Get the Average Monthly EUI from the web page 
                let averageMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.average_Month_EUI, "textContent")
                reporter.startStep(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
                reporter.endStep();
                if (averageMonthEUI > 0.0) {
                    logger.info(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`)
                    expect(averageMonthEUI > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
                    expect(true).toBe(false);
                }
                // Get the Highest Monthly EUI from the web page 
                let highestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.highest_Month_EUI, "textContent")
                reporter.startStep(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
                reporter.endStep();
                if (highestMonthEUI > 0.0) {
                    logger.info(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`)
                    expect(highestMonthEUI > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
                    expect(true).toBe(false);
                }

                // EUI value is zero, so here added the condition 
                let conFig = await getEnvConfig()
                if (conFig.Building[buildingName].lowestMonthEUI == '0') {
                    logger.info(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - Zero`)
                    reporter.startStep(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - Zero`);
                    reporter.endStep();
                } else {
                    let lowestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.lowest_Month_EUI, "textContent")
                    reporter.startStep(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - ${lowestMonthEUI}`);
                    reporter.endStep();
                    if (lowestMonthEUI >= 0.0) {
                        logger.info(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - ${lowestMonthEUI}`)
                        expect(lowestMonthEUI >= 0.0).toBeTruthy();
                    } else {
                        logger.error(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - ${lowestMonthEUI}`);
                        expect(true).toBe(false);
                    }
                }
            }
            reporter.endStep();
        });

        //Verify Energy Usage Intensity Text in Calendar Year page
        and('Verify Energy Usage Intensity Text in Calendar Year page', async () => {
            reporter.startStep(`And Verify Energy Usage Intensity Text in Calendar Year page`);
            // Get environment configuration
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page is not available`)
                reporter.startStep(`Energy Page is not available`);
                reporter.endStep();
            } else {
                // Get the Energy Usage Intensity Text from the web page 
                let energyUsage_IntensityTxt = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Intensity_Txt, "textContent")
                let conFig = await getEnvConfig()

                reporter.startStep(`Expected Energy Usage Intensity Text  - ${conFig.Building[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
                if (energyUsage_IntensityTxt === conFig.Building[buildingName].energy_Intensity_Txt) {
                    logger.info(`Expected Energy Usage Intensity Text  - ${conFig.Building[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`)
                    expect(conFig.Building[buildingName].energy_Intensity_Txt).toBe(energyUsage_IntensityTxt);
                } else {
                    // Log an error message and report it
                    logger.error(`Expected Energy Usage Intensity Text  - ${conFig.Building[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
                    //log an error and fail the assertion
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Highest Month_Year in Energy Usage', async () => {
            reporter.startStep(`And Verify Highest Month_Year in Energy Usage`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.high_AverageMonthYear, "textContent")
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                let averageYearVal = averageMonthYearValSplit[2]
                const averageYear = parseInt(averageYearVal);
                // Define an array of valid month abbreviations
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                // Check if the extracted month is in the validMonths array
                const isValidMonth = validMonths.includes(averageMonthYear);
                // the expected validity as true
                const expectedValidity = true;
                // Start a step in the reporter to display information about the expected and actual values
                reporter.startStep(`Expected Highest Month in Energy Usage : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                // Compare the expectedValidity and isValidMonth
                if (expectedValidity == isValidMonth) {
                    // Log an informational message 
                    logger.info(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
                    expect(expectedValidity).toBe(isValidMonth);
                } else {
                    // Log an error message
                    logger.error(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                    // Use the expect function to indicate a failed expectation
                    expect(true).toBe(false);
                }
                // Capture a screenshot with the name 'building.png'
                let ss = await customScreenshot('building.png')
                // Add the screenshot as an attachment to the reporter
                reporter.addAttachment("building", ss, "image/png");
                reporter.endStep();
                const today = new Date();
                // Get the current year
                const currentYearVal = today.getFullYear() % 100;
                const currentYear = parseInt(currentYearVal);
                reporter.startStep(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);
                // Compare the currentYear with the extracted averageYear
                if (currentYear == averageYear) {
                    logger.info(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
                    expect(currentYear).toBe(averageYear);
                } else {
                    logger.error(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
                    // Use the expect function to indicate a failed expectation
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify Lowest Month_Year in Energy Usage
        and('Verify Lowest Month_Year in Energy Usage', async () => {
            reporter.startStep(`And Verify Lowest Month_Year in Energy Usage`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // If the energy page is not available, log this information and end the test step.
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // If the energy page is available, proceed with further validation.
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.low_AverageMonthYear, "textContent")
                // Split the retrieved value into month and year components.
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                let averageYearVal = averageMonthYearValSplit[2]
                // Parse the average year as an integer.
                const averageYear = parseInt(averageYearVal);
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                // Check if the retrieved month is one of the valid months.
                const isValidMonth = validMonths.includes(averageMonthYear);
                // the expected validity of the month as true
                const expectedValidity = true;
                reporter.startStep(`Expected Lowest Month in Energy Usage : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                if (expectedValidity == isValidMonth) {
                    // If the month validity matches the expectation, log and pass the test.
                    logger.info(`Expected Lowest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
                    expect(expectedValidity).toBe(isValidMonth);
                } else {
                    // If the month validity does not match the expectation, log an error and fail the test.
                    logger.error(`Expected Lowest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                    expect(true).toBe(false);
                }
                // Capture a screenshot and attach it to the report.
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                reporter.endStep();
                const today = new Date();
                const currentYearVal = today.getFullYear() % 100;
                const currentYear = parseInt(currentYearVal);
                reporter.startStep(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);
                if (currentYear == averageYear) {
                    // If the year matches the expectation, log and pass the test.
                    logger.info(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
                    expect(currentYear).toBe(averageYear);
                } else {
                    // If the year does not match the expectation, log an error and fail the test.
                    logger.error(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Highest Month in Energy Use Intensity', async () => {
            reporter.startStep(`And Verify Highest Month in Energy Use Intensity`);
            let conFig = await getEnvConfig()
            // If the energy page is not available, log this information and end the test step.
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // If the energy page is available, proceed with further validation.
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.highmonthInten, "textContent")
                // Split the retrieved value into month and year components.
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                const isValidMonth = validMonths.includes(averageMonthYear);
                // the expected validity of the month as true
                const expectedValidity = true;
                reporter.startStep(`Expected Highest Month in Energy Use Intensity : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                if (expectedValidity == isValidMonth) {
                    // If the month validity matches the expectation, log and pass the test.
                    logger.info(`Expected Highest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
                    expect(expectedValidity).toBe(isValidMonth);
                } else {
                    // If the month validity does not match the expectation, log an error and fail the test.
                    logger.error(`Expected Highest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                    expect(true).toBe(false);
                }
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify Lowest Month in Energy Use Intensity
        and('Verify Lowest Month in Energy Use Intensity', async () => {
            reporter.startStep(`And Verify Lowest Month in Energy Use Intensity`);
            //fletch the dat from  env config file
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // If the energy page is not available, log this information and end the test step.
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // If the energy page is available, proceed with further validation.
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.lowMonthInten, "textContent")
                // Split the retrieved value into month and year components.
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                // Parse the average year as an integer.
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                // Check if the retrieved month is one of the valid months.
                const isValidMonth = validMonths.includes(averageMonthYear);
                //  the expected validity of the month as true
                const expectedValidity = true;
                reporter.startStep(`Expected Lowest Month in Energy Use Intensity : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                if (expectedValidity == isValidMonth) {
                    // If the month validity matches the expectation, log and pass the test.
                    logger.info(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
                    expect(expectedValidity).toBe(isValidMonth);
                } else {
                    // If the month validity does not match the expectation, log an error and fail the test.
                    logger.error(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                    expect(true).toBe(false);
                }
                // take screen shot and attached the report
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify The click box in last 13 months and calender Year and Last 37 months', async () => {
            reporter.startStep(`And Verify The click box in last 13 months and calender Year and Last 37 months`);
            let conFig = await getEnvConfig()
            // Check if the energy page is available for the specified building.
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // If the energy page is not available, log this information, report it, and end the test step.
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                await Promise.all([
                    performAction("click", tenantAdmin.button.last_13_Months),
                    waitForNetworkIdle(120000)
                ])
                // If the energy page is available, proceed with further validation.
                let energyUsage_Intensity_Button = await getPropertyValueByXpath(tenantAdmin.button.last_13_Months, "textContent")
                let energyUsage = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Click, "textContent")
                let energyUsageSplit = energyUsage.split(" ");
                let energyUsage_last = energyUsageSplit[5]
                let energyUsage_Teen = energyUsageSplit[6]
                let energyUsage_Month = energyUsageSplit[7]
                let energy_Usage_Txt = energyUsage_last + " " + energyUsage_Teen + " " + energyUsage_Month
                // Compare the expected and actual values, and report the results.
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
                // function convertToLowercase(calenderYear_cap) {
                //   var modifiedText = calenderYear_cap.toLowerCase();
                //   return modifiedText;
                // }
                // var calenderYear = convertToLowercase(calenderYear_cap);

                var calenderYear = calenderYear_cap.toLowerCase();

                let energyUsage_CalYear = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Click, "textContent")
                let energyUsagecalSplit = energyUsage_CalYear.split(" ");
                let energyUsage_cal = energyUsagecalSplit[5]
                let energyUsage_year = energyUsagecalSplit[6]
                let energy_Usage_calender_cap = energyUsage_cal + " " + energyUsage_year
                // function convertToLowercase(energy_Usage_calender_cap) {
                //   var modifiedText = energy_Usage_calender_cap.toLowerCase();
                //   return modifiedText;
                // }
                // var energy_Usage_calender = convertToLowercase(energy_Usage_calender_cap);
                var energy_Usage_calender = energy_Usage_calender_cap.toLowerCase();

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
                // function convertToLowercase(energyIntensityCal_Year_cap) {
                //   var modifiedText = energyIntensityCal_Year_cap.toLowerCase();
                //   return modifiedText;
                // }
                // var energyIntensityCal_Year = convertToLowercase(energyIntensityCal_Year_cap);

                var energyIntensityCal_Year = energyIntensityCal_Year_cap.toLowerCase();

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
                reporter.endStep();
                if (energyUsage_last37Month === energyIntensity_Last37_Mon_Text) {
                    logger.info(`Expected The Energy Usage Intensity Last 37 months Page Text  - ${energyUsage_last37Month} and Actual  Status- ${energyIntensity_Last37_Mon_Text}`)
                    expect(energyUsage_last37Month).toBe(energyIntensity_Last37_Mon_Text);
                } else {
                    logger.error(`Expected The Energy Usage Intensity Last 37 months Page Text  - ${energyUsage_last37Month} and Actual  Status- ${energyIntensity_Last37_Mon_Text}`);
                    expect(true).toBe(false)
                }
            }
            reporter.endStep();
        });
    });

    test('Navigate to Building and validate <Building> Last 13 Months in Energy page', async ({
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

        // Then Verify The Energy Usage Title in Last 13 Months page
        then('Verify The Energy Usage Title in Last 13 Months page', async () => {
            reporter.startStep("Then Verify The Energy Usage Title in Last 13 Months page");
            // Get the environment configuration
            let conFig = await getEnvConfig()
            // Check if the Energy Page is available for the specified building
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // Log a message if the Energy Page is not available
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // Capture a screenshot named "building.png"
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                await delay(6000)
                // Click on the Energy Page and wait for network activity to settle
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(90000)
                ])
                // Click on the Last 13 Months  Page and wait for network activity to settle
                await Promise.all([
                    performAction("click", tenantAdmin.button.last_13_Months),
                    waitForNetworkIdle(120000)
                ])
                let energyPageTitle = await getPropertyValueByXpath(energyPage.h5.energyPage_Title, "textContent")
                let conFig = await getEnvConfig()
                // Compare the expected and actual titles
                reporter.startStep(`Expected Title  - ${conFig.Building[buildingName].energypage_Title} and Actual Title - ${energyPageTitle}`);
                // Log and assert if titles match
                if (energyPageTitle === conFig.Building[buildingName].energypage_Title) {
                    logger.info(`Expected Title  - ${conFig.Building[buildingName].energypage_Title} and Actual Title - ${energyPageTitle}`)
                    expect(conFig.Building[buildingName].energypage_Title).toBe(energyPageTitle);
                } else {
                    // Log an error if titles do not match
                    logger.error(`Expected Title  - ${conFig.Building[buildingName].energypage_Title} and Actual Title - ${energyPageTitle}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify Last 13 Months page last Update Time 
        and('Verify Last 13 Months page last Update Time', async () => {
            reporter.startStep("And Verify Last 13 Months page last Update Time ");
            // Get the environment configuration
            let conFig = await getEnvConfig()
            // Check if the Energy Page is available for the specified building
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // Log a message if the Energy Page is not available
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // let configFile = await getEnvConfig()
                // if ('Last_updated_time' in configFile.Building[buildingName] && configFile.Building[buildingName]['Last_updated_time'] == 'NA') {
                //     logger.error(`Last updated time not available in ${buildingName}`)
                //     reporter.startStep(`Last updated time not available in ${buildingName}`);
                //     reporter.endStep();
                // } else {
                let portal_Last_Update = await getPropertyValueByXpath(energyPage.div.energy_LastUpdate_Time, "textContent")
                let portalDatesplit = portal_Last_Update.split(": ");
                let last_Update = portalDatesplit[1]
                // Capture a screenshot named "building.png"
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                await delay(2000)
                // Get the current time in EST (Eastern Standard Time) and format it
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let last__Update_Time_OverView = splitvalueDate + "," + last_Update
                // Calculate the time difference in minutes between the current time and the last update time.
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
                // Start a step in the test report to compare the expected and actual times.
                if (timeDifferenceInMinutes <= 15) {
                    // Check if the time difference is less than or equal to 15 minutes.
                    logger.info(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`)
                    expect(timeDifferenceInMinutes <= 15).toBeTruthy()
                } else {
                    // Log an error if the time difference exceeds 15 minutes.
                    logger.error(`Expected EST current time is - ${strTimeEST} and Actual time is ${last__Update_Time_OverView}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Average monthly tenant usage Text in Last 13 Months page
        and('Verify The Average monthly tenant usage Text in Last 13 Months page', async () => {
            reporter.startStep(`And Verify The Average monthly tenant usage Text in Last 13 Months page`);
            let conFig = await getEnvConfig()
            // Check if the Energy Page is available for the specified building.
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // Log a message if the Energy Page is not available.
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                /* If the Energy Page is available, proceed with the verification.
                  Get the average monthly tenant usage text from the web page using an XPath selector. */
                let averageUsageTxt = await getPropertyValueByXpath(tenantAdmin.div.averageUsage_Txt, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Average monthly tenant usage Text  - ${conFig.Building[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
                if (averageUsageTxt === conFig.Building[buildingName].averageUsage_Txt) {
                    // Check if the actual usage text matches the expected value and log the result.
                    logger.info(`Expected Average monthly tenant usage text  - ${conFig.Building[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`)
                    expect(conFig.Building[buildingName].averageUsage_Txt).toBe(averageUsageTxt);
                } else {
                    logger.error(`Expected Average monthly tenant usage text  - ${conFig.Building[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Energy consumption and EUI for Last 13 Months page
        and('Verify The Energy consumption and EUI for Last 13 Months page', async () => {
            reporter.startStep(`And Verify The Energy consumption and EUI for Last 13 Months page`);
            //fletch the data from the config file
            let conFig = await getEnvConfig()
            // Check if the Energy Page is available for the specified building.
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // Log a message if the Energy Page is not available.
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // If the Energy Page is available, proceed with the verification.
                let averageMonthConsum = await getPropertyValueByXpath(tenantAdmin.div.average_Month_Consum, "textContent")
                reporter.startStep(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
                reporter.endStep();
                //here validate the Average Monthly Usage consumption is - Non Zero
                if (averageMonthConsum > 0 + " KWH") {
                    // Log and assert if test match
                    logger.info(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`)
                    expect(averageMonthConsum > 0 + " KWH").toBeTruthy();
                } else {
                    // Log and assert if test does not  match
                    logger.error(`Expected The Average Monthly Usage consumption is - Non Zero and Actual consumption is - ${averageMonthConsum}`);
                    expect(true).toBe(false);
                }
                // Repeat the same process for the Lowest Monthly Usage consumption.
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
                // Repeat the same process for the Highest Monthly Usage consumption.
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
                // Repeat the same process for the Average Monthly EUI.
                let averageMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.average_Month_EUI, "textContent")
                reporter.startStep(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
                reporter.endStep();
                if (averageMonthEUI > 0.0) {
                    logger.info(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`)
                    expect(averageMonthEUI > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
                    expect(true).toBe(false);
                }
                // Repeat the same process for the Highest Monthly EUI.
                let highestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.highest_Month_EUI, "textContent")
                reporter.startStep(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
                reporter.endStep();
                if (highestMonthEUI > 0.0) {
                    logger.info(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`)
                    expect(highestMonthEUI > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
                    expect(true).toBe(false);
                }

                // EUI value is zero, so here added the condition 
                let conFig = await getEnvConfig()
                if (conFig.Building[buildingName].lowestMonthEUI == '0') {
                    logger.info(`Expected The Lowest Monthly EUI - "zero" or "greater than zero"  and Actual EUI is - Zero`)
                    reporter.startStep(`Expected The Lowest Monthly EUI - "zero" or "greater than zero"  and Actual EUI is - Zero`);
                    reporter.endStep();
                } else {
                    let lowestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.lowest_Month_EUI, "textContent")
                    reporter.startStep(`Expected The Lowest Monthly EUI - "zero" or "greater than zero"  and Actual EUI is - ${lowestMonthEUI}`);
                    reporter.endStep();
                    if (lowestMonthEUI >= 0.0) {
                        logger.info(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - ${lowestMonthEUI}`)
                        expect(lowestMonthEUI >= 0.0).toBeTruthy();
                    } else {
                        logger.error(`Expected The Lowest Monthly EUI - "zero" or "greater than zero"  and Actual EUI is - ${lowestMonthEUI}`);
                        expect(true).toBe(false);
                    }
                }
            }
            reporter.endStep();
        });

        //And Verify Energy Usage Intensity Text in Last 13 Months page
        and('Verify Energy Usage Intensity Text in Last 13 Months page', async () => {
            reporter.startStep(`And Verify Energy Usage Intensity Text in Last 13 Months page`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page is not available`)
                reporter.startStep(`Energy Page is not available`);
                reporter.endStep();
            } else {
                let energyUsage_IntensityTxt = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Intensity_Txt, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Energy Usage Intensity Text  - ${conFig.Building[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
                if (energyUsage_IntensityTxt === conFig.Building[buildingName].energy_Intensity_Txt) {
                    logger.info(`Expected Energy Usage Intensity Text  - ${conFig.Building[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`)
                    expect(conFig.Building[buildingName].energy_Intensity_Txt).toBe(energyUsage_IntensityTxt);
                } else {
                    logger.error(`Expected Energy Usage Intensity Text  - ${conFig.Building[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Highest Month_Year in Energy Usage', async () => {
            reporter.startStep(`And Verify Highest Month_Year in Energy Usage`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // Log a message if the Energy Page is not available.
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.high_AverageMonthYear, "textContent")
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                let averageYearVal = averageMonthYearValSplit[2]
                const averageYear = parseInt(averageYearVal);
                // here get the array for list of valid month names.
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                // Check if the extracted month is valid by checking if it's in the list of valid months.
                const isValidMonth = validMonths.includes(averageMonthYear);
                //here check expected validity value as true
                const expectedValidity = true;
                reporter.startStep(`Expected Highest Month in Energy Usage : ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                if (expectedValidity == isValidMonth) {
                    logger.info(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
                    expect(expectedValidity).toBe(isValidMonth);
                } else {
                    logger.error(`Expected Highest Month in Energy Usage: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                    expect(true).toBe(false);
                }
                //here take screen shot and added the report
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                reporter.endStep();
                // Compare the expected and actual highest year values.
                const today = new Date();
                const currentYearVal = today.getFullYear() % 100;
                const currentYear = parseInt(currentYearVal);
                // Start a step to compare the expected and actual highest year values.
                reporter.startStep(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);
                if (currentYear == averageYear) {
                    logger.info(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
                    expect(currentYear).toBe(averageYear);
                } else {
                    logger.error(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify Lowest Month_Year in Energy Usage
        and('Verify Lowest Month_Year in Energy Usage', async () => {
            reporter.startStep(`And Verify Lowest Month_Year in Energy Usage`);

            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.low_AverageMonthYear, "textContent")
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                let averageYearVal = averageMonthYearValSplit[2]
                const averageYear = parseInt(averageYearVal);
                // here get the array for list of valid month names.
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                // Check if the extracted month is valid by checking if it's in the list of valid months.
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
                // Get the full year
                const today = new Date();
                // Calculate the current year as the last two digits of the full year.
                const currentYearVal = today.getFullYear() % 100;
                // Convert the currentYearVal to an integer to ensure it's a numeric value.
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
            }
            reporter.endStep();
        });

        and('Verify Highest Month in Energy Use Intensity', async () => {
            reporter.startStep(`And Verify Highest Month in Energy Use Intensity`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.highmonthInten, "textContent")
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                // here get the array for list of valid month names.
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                // Check if the extracted month is valid by checking if it's in the list of valid months.
                const isValidMonth = validMonths.includes(averageMonthYear);
                //here check expected validity value as true
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
            }
            reporter.endStep();
        });

        //And Verify Lowest Month in Energy Use Intensity
        and('Verify Lowest Month in Energy Use Intensity', async () => {
            reporter.startStep(`And Verify Lowest Month in Energy Use Intensity`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.lowMonthInten, "textContent")
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                // here get the array for list of valid month names.
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                // Check if the extracted month is valid by checking if it's in the list of valid months.
                const isValidMonth = validMonths.includes(averageMonthYear);
                //here check expected validity value as true
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
            }
            reporter.endStep();
        });


    });

    test('Navigate to Building and validate <Building> Last 37 Months in Energy page', async ({
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

        // Then Verify The Energy Usage Title in Last 37 Months page
        then('Verify The Energy Usage Title in Last 37 Months page', async () => {
            reporter.startStep("Then Verify The Energy Usage Title in Last 37 Months page");
            // fletch the data from the env config file
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                await delay(6000)
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(90000)
                ])
                await Promise.all([
                    performAction("click", tenantAdmin.button.last_37_Months),
                    waitForNetworkIdle(120000)
                ])
                let energyPageTitle = await getPropertyValueByXpath(energyPage.h5.energyPage_Title, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Title  - ${conFig.Building[buildingName].energypage_Title} and Actual Title - ${energyPageTitle}`);
                // Compare the expected and actual titlesin Last 37 Months page
                if (energyPageTitle === conFig.Building[buildingName].energypage_Title) {
                    // Log and assert if titles match
                    logger.info(`Expected Title  - ${conFig.Building[buildingName].energypage_Title} and Actual Title - ${energyPageTitle}`)
                    expect(conFig.Building[buildingName].energypage_Title).toBe(energyPageTitle);
                } else {
                    // Log an error if titles do not match
                    logger.error(`Expected Title  - ${conFig.Building[buildingName].energypage_Title} and Actual Title - ${energyPageTitle}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //Verify Last 37 Months page last Update Time 
        and('Verify Last 37 Months page last Update Time', async () => {
            reporter.startStep("And Verify Last 37 Months page last Update Time ");
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // let configFile = await getEnvConfig()
                // if ('Last_updated_time' in configFile.Building[buildingName] && configFile.Building[buildingName]['Last_updated_time'] == 'NA') {
                //     logger.error(`Last updated time not available in ${buildingName}`)
                //     reporter.startStep(`Last updated time not available in ${buildingName}`);
                //     reporter.endStep();
                // } else {
                let portal_Last_Update = await getPropertyValueByXpath(energyPage.div.energy_LastUpdate_Time, "textContent")
                let portalDatesplit = portal_Last_Update.split(": ");
                let last_Update = portalDatesplit[1]
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                await delay(2000)
                // Get the current time in EST (Eastern Standard Time) and format it
                const date = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
                let datesplit = date.split(",");
                let splitvalueDate = datesplit[0]
                let last__Update_Time_OverView = splitvalueDate + "," + last_Update
                // Calculate the time difference in minutes between the current time and the last update time.
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

        //And Verify The Average monthly tenant usage Text in Last 37 Months page
        and('Verify The Average monthly tenant usage Text in Last 37 Months page', async () => {
            reporter.startStep(`And Verify The Average monthly tenant usage Text in Last 37 Months page`);
            let conFig = await getEnvConfig()
            // Check if the Energy Page is available for the specified building.
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // Log a message if the Energy Page is not available.
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let averageUsageTxt = await getPropertyValueByXpath(tenantAdmin.div.averageUsage_Txt, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Average monthly tenant usage Text  - ${conFig.Building[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
                if (averageUsageTxt === conFig.Building[buildingName].averageUsage_Txt) {
                    logger.info(`Expected Average monthly tenant usage text  - ${conFig.Building[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`)
                    expect(conFig.Building[buildingName].averageUsage_Txt).toBe(averageUsageTxt);
                } else {
                    logger.error(`Expected Average monthly tenant usage text  - ${conFig.Building[buildingName].averageUsage_Txt} and Actual  Status- ${averageUsageTxt}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify The Energy consumption and EUI for Last 37 Months page
        and('Verify The Energy consumption and EUI for Last 37 Months page', async () => {
            reporter.startStep(`And Verify The Energy consumption and EUI for Last 37 Months page`);
            //fletch the data from the config file
            let conFig = await getEnvConfig()
            // Check if the Energy Page is available for the specified building.
            if (conFig.Building[buildingName].energyPage == 'NA') {
                // Log a message if the Energy Page is not available.
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // If the Energy Page is available, proceed with the verification.
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
                // Repeat the same process for the Lowest Monthly Usage consumption.
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
                // Repeat the same process for the Highest Monthly Usage consumption.
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
                // Repeat the same process for the Average Monthly EUI
                let averageMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.average_Month_EUI, "textContent")
                reporter.startStep(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
                reporter.endStep();
                if (averageMonthEUI > 0.0) {
                    logger.info(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`)
                    expect(averageMonthEUI > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Average Monthly EUI - Non Zero and Actual EUI is - ${averageMonthEUI}`);
                    expect(true).toBe(false);
                }
                // Repeat the same process for the Highest Monthly EUI
                let highestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.highest_Month_EUI, "textContent")
                reporter.startStep(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
                reporter.endStep();
                if (highestMonthEUI > 0.0) {
                    logger.info(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`)
                    expect(highestMonthEUI > 0.0).toBeTruthy();
                } else {
                    logger.error(`Expected The Highest Monthly EUI - Non Zero and Actual EUI is - ${highestMonthEUI}`);
                    expect(true).toBe(false);
                }

                // EUI value is zero, so here added the condition 
                let conFig = await getEnvConfig()
                if (conFig.Building[buildingName].lowestMonthEUI == '0') {
                    logger.info(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - Zero`)
                    reporter.startStep(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - Zero`);
                    reporter.endStep();
                } else {
                    let lowestMonthEUI = await getPropertyValueByXpath(tenantAdmin.div.lowest_Month_EUI, "textContent")
                    reporter.startStep(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - ${lowestMonthEUI}`);
                    reporter.endStep();
                    if (lowestMonthEUI >= 0.0) {
                        logger.info(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - ${lowestMonthEUI}`)
                        expect(lowestMonthEUI >= 0.0).toBeTruthy();
                    } else {
                        logger.error(`Expected The Lowest Monthly EUI - "zero" or "greater than zero" and Actual EUI is - ${lowestMonthEUI}`);
                        expect(true).toBe(false);
                    }
                }
            }
            reporter.endStep();
        });

        //And Verify Energy Usage Intensity Text in Last 37 Months page
        and('Verify Energy Usage Intensity Text in Last 37 Months page', async () => {
            reporter.startStep(`And Verify Energy Usage Intensity Text in Last 37 Months page`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page is not available`)
                reporter.startStep(`Energy Page is not available`);
                reporter.endStep();
            } else {
                let energyUsage_IntensityTxt = await getPropertyValueByXpath(tenantAdmin.div.energy_Usage_Intensity_Txt, "textContent")
                let conFig = await getEnvConfig()
                reporter.startStep(`Expected Energy Usage Intensity Text  - ${conFig.Building[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
                if (energyUsage_IntensityTxt === conFig.Building[buildingName].energy_Intensity_Txt) {
                    logger.info(`Expected Energy Usage Intensity Text  - ${conFig.Building[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`)
                    expect(conFig.Building[buildingName].energy_Intensity_Txt).toBe(energyUsage_IntensityTxt);
                } else {
                    logger.error(`Expected Energy Usage Intensity Text  - ${conFig.Building[buildingName].energy_Intensity_Txt} and Actual  Status- ${energyUsage_IntensityTxt}`);
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Highest Month_Year in Energy Usage', async () => {
            reporter.startStep(`And Verify Highest Month_Year in Energy Usage`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.p.high_AverageMonthYear, "textContent")
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                let averageYearVal = averageMonthYearValSplit[2]
                const averageYear = parseInt(averageYearVal);
                // here get the array for list of valid month names.
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                // Check if the extracted month is valid by checking if it's in the list of valid months.
                const isValidMonth = validMonths.includes(averageMonthYear);
                //here check expected validity value as true
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
                // Compare the expected and actual highest year values.
                const today = new Date();
                const currentYearVal = today.getFullYear() % 100;
                const currentYear = parseInt(currentYearVal);
                // Start a step to compare the expected and actual highest year values.
                reporter.startStep(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);
                if (currentYear == averageYear) {
                    logger.info(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
                    expect(currentYear).toBe(averageYear);
                } else {
                    logger.error(`Expected Highest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        //And Verify Lowest Month_Year in Energy Usage
        and('Verify Lowest Month_Year in Energy Usage', async () => {
            reporter.startStep(`And Verify Lowest Month_Year in Energy Usage`);
            //fletch the data from the config file
            let conFig = await getEnvConfig()
            // Check if the Energy Page is available for the specified building.
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
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
                // Check if the retrieved month is one of the valid months.
                const isValidMonth = validMonths.includes(averageMonthYear);
                //  the expected validity of the month as true
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
                // Start a step to compare the expected and actual Lowest year values.
                reporter.startStep(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear} `);
                if (currentYear == averageYear) {
                    logger.info(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`)
                    expect(currentYear).toBe(averageYear);
                } else {
                    logger.error(`Expected Lowest Year in Energy Usage - ${currentYear} and Actaul Year  ${averageYear}`);
                    expect(true).toBe(false);
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify Highest Month in Energy Use Intensity', async () => {
            reporter.startStep(`And Verify Highest Month in Energy Use Intensity`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let averageMonthYearVal = await getPropertyValueByXpath(tenantAdmin.div.highmonthInten, "textContent")
                let averageMonthYearValSplit = averageMonthYearVal.split(" ");
                let averageMonthYear = averageMonthYearValSplit[1]
                const validMonths = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                // Check if the retrieved month is one of the valid months.
                const isValidMonth = validMonths.includes(averageMonthYear);
                //  the expected validity of the month as true
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
            }
            reporter.endStep();
        });

        //And Verify Lowest Month in Energy Use Intensity
        and('Verify Lowest Month in Energy Use Intensity', async () => {
            reporter.startStep(`And Verify Lowest Month in Energy Use Intensity`);
            let conFig = await getEnvConfig()
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
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
                // If the month validity matches the expectation, log and pass the test.
                if (expectedValidity == isValidMonth) {
                    logger.info(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`)
                    expect(expectedValidity).toBe(isValidMonth);
                } else {
                    // If the month validity does not match the expectation, log an error and fail the test.
                    logger.error(`Expected Lowest Month in Energy Use Intensity: ${averageMonthYear}, Expected Validity: ${expectedValidity}, Actual Validity: ${isValidMonth}`);
                    expect(true).toBe(false);
                }
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                reporter.endStep();
            }
            reporter.endStep();
        });
    });

    test('Navigate to Building and validate <Building> Calendar Year to Verify The Tenant details in Energy page', async ({
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

        // Then Verify The Tenant Usage Count 
        then('Verify The Tenant Usage Count', async () => {
            reporter.startStep("Then Verify The Tenant Usage Count");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig()
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // Take a screenshot and attach it to the report

                await delay(6000)
                // Click on the "energy_Page" tab and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(90000)
                ])
                // Click on the "calender_Year" button again and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.calender_Year),
                    waitForNetworkIdle(120000)
                ])

                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                let tenant_UsageCount = await getPropertyValueByXpath(energyPage.div.tenantUsageCount, "textContent")
                let tenant_UsageCountSplit = tenant_UsageCount.split(" ");
                let tenant_Usage_Count1 = tenant_UsageCountSplit[0];
                let tenant_Usage_Count2 = tenant_UsageCountSplit[2];
                let conFig = await getEnvConfig()

                //here i just validate 5 of 5 tenants
                reporter.startStep(`Expected The Tenant Usage Count 1 - ${conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count} and Actual Count - ${tenant_Usage_Count1}`);
                if (tenant_Usage_Count1 === conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count) {
                    // Log a success message if the texts match.
                    logger.info(`Expected The Tenant Usage Count  1- ${conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count} and Actual Count - ${tenant_Usage_Count1}`)
                    expect(conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count).toBe(tenant_Usage_Count1);
                } else {
                    logger.error(`Expected The Tenant Usage Count  1- ${conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count} and Actual Count - ${tenant_Usage_Count1}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();

                reporter.startStep(`Expected The Tenant Usage Count 2 - ${conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count} and Actual Count - ${tenant_Usage_Count2}`);
                if (tenant_Usage_Count2 === conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count) {
                    // Log a success message if the texts match.
                    logger.info(`Expected The Tenant Usage Count 2 - ${conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count} and Actual Count - ${tenant_Usage_Count2}`)
                    expect(conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count).toBe(tenant_Usage_Count2);
                } else {
                    logger.error(`Expected The Tenant Usage Count  2- ${conFig.Building[buildingName].tenantUsageCount_CalendarYear_Count} and Actual Count - ${tenant_Usage_Count2}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });


        and('Verify The Tenant Name List', async () => {
            reporter.startStep("And Verify The Tenant Name List");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                if (conFig.Building[buildingName].Usage_tenantName_List_In_CalendarYear == 'NA') {
                    logger.info(`Tenant is  not available in ${buildingName} building`);
                    reporter.startStep(`Tenant is  not available in ${buildingName} building`);
                    reporter.endStep();
                } else {
                    await delay(2000);
                    await Promise.all([
                        performAction("click", energyPage.ul.tenantName_List_click),
                        waitForNetworkIdle(90000)
                    ]);
                    let ss = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss, "image/png");
                    let tenant_UsageCount = await getPropertyValueByXpath(energyPage.div.tenantUsageCount, "textContent");
                    let tenant_UsageCountSplit = tenant_UsageCount.split(" ");
                    let tenant_Usage_Count1 = tenant_UsageCountSplit[0];
                    for (let i = 0; i < tenant_Usage_Count1; i++) {
                        let tenantName_Xpath = `${energyPage.ul.tenantName_List}[${i + 1}]`; // Note: XPath indexes are 1-based
                        let tenantName = await getPropertyValueByXpath(tenantName_Xpath, "textContent");
                        var UsagetenantName_List = conFig.Building[buildingName].Usage_tenantName_List_In_CalendarYear
                        reporter.startStep(`Expected The Tenant Name  - ${UsagetenantName_List} and Actual Tenant Name - ${tenantName}`);
                        if (UsagetenantName_List.includes(tenantName)) {
                            logger.info(`Expected The Tenant Name  - ${UsagetenantName_List} and Actual Tenant Name - ${tenantName}`);
                            expect(UsagetenantName_List.includes(tenantName)).toBeTruthy();

                        } else {
                            logger.error(`Expected The Tenant Name  - ${UsagetenantName_List} and Actual Tenant Name- ${tenantName}`);
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    }
                    let ss1 = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss1, "image/png");
                    await delay(4000);
                    await Promise.all([
                        performAction("click", buildingOverview.a.overviewTab),//overviewTab
                        waitForNetworkIdle(120000)
                    ])
                    await delay(2000);
                }
            }
            reporter.endStep();
        });


        // And Verify The Usage By Building Page is Disaplayed
        and('Verify The Usage By Building Page is Disaplayed', async () => {
            reporter.startStep("And Verify The Usage By Building Page is Disaplayed");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(90000)
                ])
                // Click on the "calender_Year" button again and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.calender_Year),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000);
                var Usage_by_Building = conFig.Building[buildingName].Usage_by_Building
                let usageByBuildingX = await getPropertyValueByXpath(energyPage.button.usageByBuilding, "textContent");
                if ((usageByBuildingX) === (Usage_by_Building)) {
                    reporter.startStep(`Expected The Usage By Building Page name  - ${Usage_by_Building} and Actual Tenant Name - ${usageByBuildingX}`);
                    // Click on "Usage By Building" page
                    await Promise.all([
                        performAction("click", energyPage.button.usageByBuilding),
                        waitForNetworkIdle(120000)
                    ]);
                    let ss = await customScreenshot('building.png');
                    reporter.addAttachment("building", ss, "image/png");
                    expect(conFig.Building[buildingName].Usage_by_Building).toBe(usageByBuildingX);
                    reporter.endStep();
                } else {
                    // Handle the case when the text is not displayed
                    reporter.startStep("Usage By Building Page Not Displayed", "Usage By Building Page text was not displayed as expected.");
                    reporter.endStep();
                    expect(true).toBe(false);
                }
            }
            reporter.endStep();
        });



        and('Validate The x-axis of the graph in Energy Usage', async () => {
            reporter.startStep('And Validate The x-axis of the graph in Energy Usage');
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(120000)
                ]);
                await Promise.all([
                    performAction("click", tenantAdmin.button.calender_Year),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000);
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                let eui_x_array = await getElementHandleByXpath(energyPage.div.energyUsageGraph)

                let energyUsageX = []; // Initialize an array to store values
                for (let i = 0; i < eui_x_array.length; i++) {
                    let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                    energyUsageX.push(energyUsageXpath);
                }
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonthIndex = now.getMonth(); //current month index example oct - '10'
                const monthNames = [
                    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                ];

                let allEstMonths = [];
                for (let i2 = 0; i2 <= currentMonthIndex; i2++) {
                    let month = monthNames[i2];
                    let year = currentYear.toString().slice(-2); // Get the last two digits of the year
                    let label = `${month} ${year}`;
                    allEstMonths.push(label);
                }

                for (let i = 0; i < allEstMonths.length; i++) {
                    reporter.startStep(`Expected The Energy Usage Calendar Year status  : ${allEstMonths[i]} and Actual Status is : ${energyUsageX[i]}`);
                    if (allEstMonths[i] == energyUsageX[i]) {
                        logger.info(`Expected The Energy Usage Calendar Year status : ${allEstMonths[i]} and  Actual Status is : ${energyUsageX[i]}`);
                        expect(allEstMonths[i]).toBe(energyUsageX[i]);
                    } else {
                        logger.error(`Expected The Energy Usage Calendar Year status : ${allEstMonths[i]} and  Actual Status is : ${energyUsageX[i]}`);
                        expect(true).toBe(false);
                    }
                    reporter.endStep();
                }
            }
            reporter.endStep();

        });

        and('Validate The x-axis of the graph in Energy Usage Intensity', async () => {
            reporter.startStep('And Validate The x-axis of the graph in Energy Usage Intensity');
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let eui_x_array = await getElementHandleByXpath(energyPage.div.energyUsageIntensityGraph);
                let energyUsageX = []; // Initialize an array to store values
                for (let i = 0; i < eui_x_array.length; i++) {
                    let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                    energyUsageX.push(energyUsageXpath);
                }
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonthIndex = now.getMonth(); //current month index example oct - '10'
                const monthNames = [
                    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                ];

                let allEstMonths = [];

                for (let i2 = 0; i2 <= currentMonthIndex; i2++) {
                    let month = monthNames[i2];
                    let year = currentYear.toString().slice(-2); // Get the last two digits of the year
                    let label = `${month} ${year}`;
                    allEstMonths.push(label);
                }

                for (let i = 0; i < allEstMonths.length; i++) {
                    reporter.startStep(`Expected The Energy Usage Intensity Calendar Year status  : ${allEstMonths[i]} and Actual Staus : ${energyUsageX[i]}`);
                    if (allEstMonths[i] == energyUsageX[i]) {
                        logger.info(`Expected The Energy Usage Intensity Calendar Year status : ${allEstMonths[i]} and Actual Staus : ${energyUsageX[i]}`);
                        expect(allEstMonths[i]).toBe(energyUsageX[i]);
                    } else {
                        logger.error(`Expected The Energy Usage Intensity Calendar Year status : ${allEstMonths[i]} and Actual Staus : ${energyUsageX[i]}`);
                        expect(true).toBe(false);
                    }
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });

    });

    test('Navigate to Building and validate <Building> Last 13 months to Verify The Tenant details in Energy page', async ({
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

        // Then Verify The Tenant Usage Count 
        then('Verify The Tenant Usage Count', async () => {
            reporter.startStep("Then Verify The Tenant Usage Count");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig()
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // Take a screenshot and attach it to the report

                await delay(6000)
                // Click on the "energy_Page" tab and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(90000)
                ])
                // Click on the "calender_Year" button again and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.last_13_Months),
                    waitForNetworkIdle(120000)
                ])

                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");

                let tenant_UsageCount = await getPropertyValueByXpath(energyPage.div.tenantUsageCount, "textContent")
                let tenant_UsageCountSplit = tenant_UsageCount.split(" ");
                let tenant_Usage_Count1 = tenant_UsageCountSplit[0];
                let tenant_Usage_Count2 = tenant_UsageCountSplit[2];
                let conFig = await getEnvConfig()

                //here i just validate 5 of 5 tenants
                reporter.startStep(`Expected The Tenant Usage Count 1 - ${conFig.Building[buildingName].tenantUsageCount_Last13months_Count} and Actual Count - ${tenant_Usage_Count1}`);
                if (tenant_Usage_Count1 === conFig.Building[buildingName].tenantUsageCount_Last13months_Count) {
                    // Log a success message if the texts match.
                    logger.info(`Expected The Tenant Usage Count  1- ${conFig.Building[buildingName].tenantUsageCount_Last13months_Count} and Actual Count - ${tenant_Usage_Count1}`)
                    expect(conFig.Building[buildingName].tenantUsageCount_Last13months_Count).toBe(tenant_Usage_Count1);
                } else {
                    logger.error(`Expected The Tenant Usage Count  1- ${conFig.Building[buildingName].tenantUsageCount_Last13months_Count} and Actual Count - ${tenant_Usage_Count1}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();

                reporter.startStep(`Expected The Tenant Usage Count 2 - ${conFig.Building[buildingName].tenantUsageCount_Last13months_Count} and Actual Count - ${tenant_Usage_Count2}`);
                if (tenant_Usage_Count2 === conFig.Building[buildingName].tenantUsageCount_Last13months_Count) {
                    // Log a success message if the texts match.
                    logger.info(`Expected The Tenant Usage Count 2 - ${conFig.Building[buildingName].tenantUsageCount_Last13months_Count} and Actual Count - ${tenant_Usage_Count2}`)
                    expect(conFig.Building[buildingName].tenantUsageCount_Last13months_Count).toBe(tenant_Usage_Count2);
                } else {
                    logger.error(`Expected The Tenant Usage Count  2- ${conFig.Building[buildingName].tenantUsageCount_Last13months_Count} and Actual Count - ${tenant_Usage_Count2}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });


        and('Verify The Tenant Name List', async () => {
            reporter.startStep("And Verify The Tenant Name List");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                if (conFig.Building[buildingName].Usage_tenantName_List_In_last13months == 'NA') {
                    logger.info(`Tenant is  not available in ${buildingName} building`);
                    reporter.startStep(`Tenant is  not available in ${buildingName} building`);
                    reporter.endStep();
                } else {

                    await delay(2000);
                    await Promise.all([
                        performAction("click", energyPage.ul.tenantName_List_click),
                        waitForNetworkIdle(90000)
                    ]);
                    let ss = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss, "image/png");
                    let tenant_UsageCount = await getPropertyValueByXpath(energyPage.div.tenantUsageCount, "textContent");
                    let tenant_UsageCountSplit = tenant_UsageCount.split(" ");
                    let tenant_Usage_Count1 = tenant_UsageCountSplit[0];

                    for (let i = 0; i < tenant_Usage_Count1; i++) {
                        let tenantName_Xpath = `${energyPage.ul.tenantName_List}[${i + 1}]`; // Note: XPath indexes are 1-based
                        let tenantName = await getPropertyValueByXpath(tenantName_Xpath, "textContent");
                        var UsagetenantName_List = conFig.Building[buildingName].Usage_tenantName_List_In_last13months
                        reporter.startStep(`Expected The Tenant Name  - ${UsagetenantName_List} and Actual Tenant Name - ${tenantName}`);
                        if (UsagetenantName_List.includes(tenantName)) {
                            logger.info(`Expected The Tenant Name  - ${UsagetenantName_List} and Actual Tenant Name - ${tenantName}`);
                            expect(UsagetenantName_List.includes(tenantName)).toBeTruthy();
                        } else {
                            logger.error(`Expected The Tenant Name  - ${UsagetenantName_List} and Actual Tenant Name- ${tenantName}`);
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    }
                    let ss1 = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss1, "image/png");
                    await delay(4000);
                    await Promise.all([
                        performAction("click", buildingOverview.a.overviewTab),//overviewTab
                        waitForNetworkIdle(120000)
                    ])
                    await delay(2000);
                }
            }
            reporter.endStep();
        });

        // And Verify The Usage By Building Page is Disaplayed
        and('Verify The Usage By Building Page is Disaplayed', async () => {
            reporter.startStep("And Verify The Usage By Building Page is Disaplayed");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(90000)
                ])
                // Click on the "calender_Year" button again and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.last_13_Months),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000);

                var Usage_by_Building = conFig.Building[buildingName].Usage_by_Building
                let usageByBuildingX = await getPropertyValueByXpath(energyPage.button.usageByBuilding, "textContent");
                if ((usageByBuildingX) === (Usage_by_Building)) {
                    reporter.startStep(`Expected The Usage By Building Page name  - ${Usage_by_Building} and Actual Tenant Name - ${usageByBuildingX}`);
                    // Click on "Usage By Building" page
                    await Promise.all([
                        performAction("click", energyPage.button.usageByBuilding),
                        waitForNetworkIdle(120000)
                    ]);
                    let ss = await customScreenshot('building.png');
                    reporter.addAttachment("building", ss, "image/png");
                    expect(conFig.Building[buildingName].Usage_by_Building).toBe(usageByBuildingX);
                    reporter.endStep();
                } else {
                    // Handle the case when the text is not displayed
                    reporter.startStep("Usage By Building Page Not Displayed", "Usage By Building Page text was not displayed as expected.");
                    reporter.endStep();
                    expect(true).toBe(false);
                }
            }
            reporter.endStep();
        });

        and('Validate The x-axis of the graph in Energy Usage', async () => {
            reporter.startStep('And Validate The x-axis of the graph in Energy Usage');
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(120000)
                ]);
                await Promise.all([
                    performAction("click", tenantAdmin.button.last_13_Months),
                    waitForNetworkIdle(120000)
                ]);
                await delay(2000);
                let ss = await customScreenshot('building.png');
                reporter.addAttachment("building", ss, "image/png");
                let eui_x_array = await getElementHandleByXpath(energyPage.div.energyUsageGraph);
                let energyUsageIntensityArray = []; // Initialize an array to store values
                for (let i = 0; i < eui_x_array.length; i++) {
                    let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                    energyUsageIntensityArray.push(energyUsageXpath);
                }
                const currentYear = new Date().getFullYear();
                const currentMonthIndex = new Date().getMonth() - 1;
                const year20 = currentYear.toString().slice(-2);
                const monthNames = [
                    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                ];

                let allEstMonths = [];
                // Generate x-axis labels from '22 to '23
                for (let i = 0; i < 13; i++) {
                    const monthIndex = (currentMonthIndex + i) % 12;
                    const year = (currentMonthIndex + i >= 12) ? year20 : (year20 - 1);
                    const month = monthNames[monthIndex];
                    const label = `${month} ${year}`;
                    allEstMonths.push(label);
                }

                for (let i = 1; i < allEstMonths.length + 1; i++) {
                    reporter.startStep(`Expected The Energy Usage Last 13 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                    if (allEstMonths[i - 1] == energyUsageIntensityArray[i - 1]) {
                        logger.info(`Expected The Energy Usage Last 13 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                        expect(allEstMonths[i - 1]).toBe(energyUsageIntensityArray[i - 1]);
                    } else {
                        logger.error(`Expected The Energy Usage Last 13 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                        expect(true).toBe(false);
                    }
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });

        // And Validate The x-axis of the graph in Energy Usage Intensity
        and('Validate The x-axis of the graph in Energy Usage Intensity', async () => {
            reporter.startStep('And Validate The x-axis of the graph in Energy Usage Intensity');
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                let eui_x_array = await getElementHandleByXpath(energyPage.div.energyUsageIntensityGraph);
                let energyUsageIntensityArray = []; // Initialize an array to store values
                for (let i = 0; i < eui_x_array.length; i++) {
                    let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                    energyUsageIntensityArray.push(energyUsageXpath);
                }
                const currentYear = new Date().getFullYear();
                const currentMonthIndex = new Date().getMonth() - 1;
                const year20 = currentYear.toString().slice(-2);
                const monthNames = [
                    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                ];
                let allEstMonths = [];
                // Generate x-axis labels from '22 to '23
                for (let i = 0; i < 13; i++) {
                    const monthIndex = (currentMonthIndex + i) % 12;
                    const year = (currentMonthIndex + i >= 12) ? year20 : (year20 - 1);
                    const month = monthNames[monthIndex];
                    const label = `${month} ${year}`;
                    allEstMonths.push(label);
                  //  console.log(label);
                }

                for (let i = 1; i < allEstMonths.length + 1; i++) {
                    reporter.startStep(`Expected The Energy Usage Intensity Last 13 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                    if (allEstMonths[i - 1] == energyUsageIntensityArray[i - 1]) {
                        logger.info(`Expected The Energy Usage Intensity Last 13 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                        expect(allEstMonths[i - 1]).toBe(energyUsageIntensityArray[i - 1]);
                    } else {
                        logger.error(`Expected The Energy Usage Intensity Last 13 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                        expect(true).toBe(false);
                    }
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });


    });

    test('Navigate to Building and validate <Building> Last 37 months to Verify The Tenant details in Energy page', async ({
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

        // Then Verify The Tenant Usage Count 
        then('Verify The Tenant Usage Count', async () => {
            reporter.startStep("Then Verify The Tenant Usage Count");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig()
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`)
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                // Take a screenshot and attach it to the report
                await delay(6000)
                // Click on the "energy_Page" tab and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(90000)
                ])
                await delay(4000)
                // Click on the "calender_Year" button again and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.last_37_Months),
                    waitForNetworkIdle(120000)
                ])
                let ss = await customScreenshot('building.png')
                reporter.addAttachment("building", ss, "image/png");
                let tenant_UsageCount = await getPropertyValueByXpath(energyPage.div.tenantUsageCount, "textContent")
                let tenant_UsageCountSplit = tenant_UsageCount.split(" ");
                let tenant_Usage_Count1 = tenant_UsageCountSplit[0];
                let tenant_Usage_Count2 = tenant_UsageCountSplit[2];
                let conFig = await getEnvConfig()

                //here i just validate 5 of 5 tenants
                reporter.startStep(`Expected The Tenant Usage Count 1 - ${conFig.Building[buildingName].tenantUsageCount_Last37months_Count} and Actual Count - ${tenant_Usage_Count1}`);
                if (tenant_Usage_Count1 === conFig.Building[buildingName].tenantUsageCount_Last37months_Count) {
                    // Log a success message if the texts match.
                    logger.info(`Expected The Tenant Usage Count  1- ${conFig.Building[buildingName].tenantUsageCount_Last37months_Count} and Actual Count - ${tenant_Usage_Count1}`)
                    expect(conFig.Building[buildingName].tenantUsageCount_Last37months_Count).toBe(tenant_Usage_Count1);
                } else {
                    logger.error(`Expected The Tenant Usage Count  1- ${conFig.Building[buildingName].tenantUsageCount_Last37months_Count} and Actual Count - ${tenant_Usage_Count1}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();
                reporter.startStep(`Expected The Tenant Usage Count 2 - ${conFig.Building[buildingName].tenantUsageCount_Last37months_Count} and Actual Count - ${tenant_Usage_Count2}`);
                if (tenant_Usage_Count2 === conFig.Building[buildingName].tenantUsageCount_Last37months_Count) {
                    // Log a success message if the texts match.
                    logger.info(`Expected The Tenant Usage Count 2 - ${conFig.Building[buildingName].tenantUsageCount_Last37months_Count} and Actual Count - ${tenant_Usage_Count2}`)
                    expect(conFig.Building[buildingName].tenantUsageCount_Last37months_Count).toBe(tenant_Usage_Count2);
                } else {
                    logger.error(`Expected The Tenant Usage Count  2- ${conFig.Building[buildingName].tenantUsageCount_Last37months_Count} and Actual Count - ${tenant_Usage_Count2}`);
                    // Use an assertion library to fail the test.
                    expect(true).toBe(false)
                }
                reporter.endStep();
            }
            reporter.endStep();
        });

        and('Verify The Tenant Name List', async () => {
            reporter.startStep("And Verify The Tenant Name List");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                if (conFig.Building[buildingName].Usage_tenantName_List_In_last37months == 'NA') {
                    logger.info(`Tenant is  not available in ${buildingName} building`);
                    reporter.startStep(`Tenant is  not available in ${buildingName} building`);
                    reporter.endStep();
                } else {
                    await delay(2000);
                    await Promise.all([
                        performAction("click", energyPage.ul.tenantName_List_click),
                        waitForNetworkIdle(90000)
                    ]);
                    let ss = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss, "image/png");
                    let tenant_UsageCount = await getPropertyValueByXpath(energyPage.div.tenantUsageCount, "textContent");
                    let tenant_UsageCountSplit = tenant_UsageCount.split(" ");
                    let tenant_Usage_Count1 = tenant_UsageCountSplit[0];
                    for (let i = 0; i < tenant_Usage_Count1; i++) {
                        let tenantName_Xpath = `${energyPage.ul.tenantName_List}[${i + 1}]`; // Note: XPath indexes are 1-based
                        let tenantName = await getPropertyValueByXpath(tenantName_Xpath, "textContent");
                        var UsagetenantName_List = conFig.Building[buildingName].Usage_tenantName_List_In_last37months
                        reporter.startStep(`Expected The Tenant Name  - ${UsagetenantName_List} and Actual Tenant Name - ${tenantName}`);
                        if (UsagetenantName_List.includes(tenantName)) {
                            logger.info(`Expected The Tenant Name  - ${UsagetenantName_List} and Actual Tenant Name - ${tenantName}`);
                            expect(UsagetenantName_List.includes(tenantName)).toBeTruthy();

                        } else {
                            logger.error(`Expected The Tenant Name  - ${UsagetenantName_List} and Actual Tenant Name- ${tenantName}`);
                            expect(true).toBe(false);
                        }
                        reporter.endStep();
                    }
                    let ss1 = await customScreenshot('building.png')
                    reporter.addAttachment("building", ss1, "image/png");
                    await delay(4000);
                    await Promise.all([
                        performAction("click", buildingOverview.a.overviewTab),//overviewTab
                        waitForNetworkIdle(120000)
                    ])
                    await delay(2000);
                }
            }
            reporter.endStep();
        });

        // And Verify The Usage By Building Page is Disaplayed
        and('Verify The Usage By Building Page is Disaplayed', async () => {
            reporter.startStep("And Verify The Usage By Building Page is Disaplayed");
            // Check the building if energy Page is 'NA' in the configuration
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(90000)
                ])
                // Click on the "calender_Year" button again and wait for network idle
                await Promise.all([
                    performAction("click", tenantAdmin.button.last_37_Months),
                    waitForNetworkIdle(120000)
                ])
                await delay(2000);
                var Usage_by_Building = conFig.Building[buildingName].Usage_by_Building
                let usageByBuildingX = await getPropertyValueByXpath(energyPage.button.usageByBuilding, "textContent");
                if ((usageByBuildingX) === (Usage_by_Building)) {
                    reporter.startStep(`Expected The Usage By Building Page name  - ${Usage_by_Building} and Actual Tenant Name - ${usageByBuildingX}`);
                    // Click on "Usage By Building" page
                    await Promise.all([
                        performAction("click", energyPage.button.usageByBuilding),
                        waitForNetworkIdle(120000)
                    ]);

                    let ss = await customScreenshot('building.png');
                    reporter.addAttachment("building", ss, "image/png");

                    expect(conFig.Building[buildingName].Usage_by_Building).toBe(usageByBuildingX);
                    reporter.endStep();
                } else {
                    // Handle the case when the text is not displayed
                    reporter.startStep("Usage By Building Page Not Displayed", "Usage By Building Page text was not displayed as expected.");
                    reporter.endStep();
                    expect(true).toBe(false);
                }
            }
            reporter.endStep();
        });

        and('Validate The x-axis of the graph in Energy Usage', async () => {
            reporter.startStep('And Validate The x-axis of the graph in Energy Usage');
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                    await Promise.all([
                        performAction("click", tenantAdmin.a.energy_Page),
                        waitForNetworkIdle(120000)
                    ]);
                    await Promise.all([
                        performAction("click", tenantAdmin.button.last_37_Months),
                        waitForNetworkIdle(120000)
                    ]);
                    let maxTime = 60000; // Maximum time to wait for the page to load (adjust as needed)
                    let elapsedTime = 0;
            
                    while (elapsedTime < maxTime) {
                    // Add a delay to ensure the page is fully loaded before taking a screenshot
                    await delay(4000);
                    let ss = await customScreenshot('building.png');
                    reporter.addAttachment("building", ss, "image/png");
                    
                    // Simulate page refresh by reloading the page
                    await page.evaluate(() => {
                        window.location.reload();
                    });
                    
                    // Add a delay after refreshing the page
                    await delay(4000);
                    let ss1 = await customScreenshot('building.png');
                    reporter.addAttachment("building", ss1, "image/png");
                    await delay(4000);
                    await Promise.all([
                        performAction("click", tenantAdmin.button.last_37_Months),
                        waitForNetworkIdle(120000)
                    ]);
                    await delay(4000);

                    let ss2 = await customScreenshot('building.png');
                    reporter.addAttachment("building", ss2, "image/png");
                    await delay(8000);

                    let eui_x_array = await getElementHandleByXpath(energyPage.div.energyUsageGraph);
                    let energyUsageIntensityArray = [];
        
                    for (let i = 0; i < eui_x_array.length; i++) {
                        let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                        let EnergyUsageXpath = energyUsageXpath.split(' ')[0];
                        energyUsageIntensityArray.push(EnergyUsageXpath);
                    }
        
                    const currentMonthIndex = new Date().getMonth() - 1;
                    const monthNames = [
                        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                    ];
        
                    let allEstMonths = [];
        
                    for (let i = 0; i < 37; i++) {
                        if (i % 2 === 0) {
                            const monthIndex = (currentMonthIndex + i) % 12; // Forward order
                            const month = monthNames[monthIndex];
                            allEstMonths.push(month);
                        }
                    }
        
                    for (let i = 1; i < allEstMonths.length + 1; i++) {
                        reporter.startStep(`Expected The Energy Usage Last 37 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                        
                        if (allEstMonths[i - 1] == energyUsageIntensityArray[i - 1]) {
                            logger.info(`Expected The Energy Usage Last 37 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                            expect(allEstMonths[i - 1]).toBe(energyUsageIntensityArray[i - 1]);
                        } else {
                            logger.error(`Expected The Energy Usage Last 37 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                            expect(true).toBe(false);
                        }
                        
                        reporter.endStep();
                    }
        
                    elapsedTime += 8000; // Adjust the delay value based on your specific case
                }
            }
        
            reporter.endStep();
        });
        
        and('Validate The x-axis of the graph in Energy Usage Intensity', async () => {
            reporter.startStep('And Validate The x-axis of the graph in Energy Usage Intensity');
            let conFig = await getEnvConfig();
            // Check if Building energyPage is available
            if (conFig.Building[buildingName].energyPage == 'NA') {
                logger.info(`Energy Page not available`);
                reporter.startStep(`Energy Page not available`);
                reporter.endStep();
            } else {
                await Promise.all([
                    performAction("click", tenantAdmin.a.energy_Page),
                    waitForNetworkIdle(120000)
                ]);
                await Promise.all([
                    performAction("click", tenantAdmin.button.last_37_Months),
                    waitForNetworkIdle(120000)
                ]);
                await delay(2000);
                let ss = await customScreenshot('building.png');
                reporter.addAttachment("building", ss, "image/png");
                let eui_x_array = await getElementHandleByXpath(energyPage.div.energyUsageIntensityGraph);
                let energyUsageIntensityArray = []; // Initialize an array to store values
                for (let i = 0; i < eui_x_array.length; i++) {
                    let energyUsageXpath = await getPropertyValue(eui_x_array[i], "textContent");
                    let EnergyUsageXpath = energyUsageXpath.split(' ')[0];
                    energyUsageIntensityArray.push(EnergyUsageXpath);
                }
                const currentMonthIndex = new Date().getMonth() - 1;
                //const currentMonthIndex = 9; // October (0-based index)
                const monthNames = [
                    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                ];
                let allEstMonths = [];
                // Generate x-axis labels for every other month in ascending order starting from "OCT"
                for (let i = 0; i < 37; i++) {
                    if (i % 2 === 0) {
                        const monthIndex = (currentMonthIndex + i) % 12; // Forward order
                        const month = monthNames[monthIndex];
                        allEstMonths.push(month);
                       // console.log(month);
                    }
                }
                for (let i = 1; i < allEstMonths.length + 1; i++) {
                    reporter.startStep(`Expected The Energy Usage Intensity Last 37 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                    if (allEstMonths[i - 1] == energyUsageIntensityArray[i - 1]) {
                        logger.info(`Expected The Energy Usage Intensity Last 37 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                        expect(allEstMonths[i - 1]).toBe(energyUsageIntensityArray[i - 1]);
                    } else {
                        logger.error(`Expected The Energy Usage Intensity Last 37 months Status : ${allEstMonths[i - 1]} and Actual Status is : ${energyUsageIntensityArray[i - 1]}`);
                        expect(true).toBe(false);
                    }
                    reporter.endStep();
                }
            }
            reporter.endStep();
        });
    });
});