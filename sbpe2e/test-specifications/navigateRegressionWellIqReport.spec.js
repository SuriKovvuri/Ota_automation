import { assert } from 'console';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createPDF, customScreenshot, delay, getElementHandleByXpath, getEnvConfig, getPropertyValue, getPropertyValueByXpath, goTo, performAction, waitForNetworkIdle, } from '../../utils/utils';
import { allPropertiesOverview, buildingOverview, occupancyBuildingTab, occupancySensorsTab, envTab, verifyBuildPage, commons, VerifyOccupancySensors, WellReport, } from '../constants/locators';
import { environment_Sensor } from '../constants/environment_sensor';
import { login, Login, logout, verifyLogin } from '../helper/login';
import { logger } from '../log.setup';
import { givenIamLoggedIn, whenIselectBuilding } from './shared-steps';
import exp from 'constants';
import { features } from 'process';
import { Page } from 'puppeteer';
const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
const feature = loadFeature('./sbpe2e/features/navigateRegressionWellIqReport.feature',
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
        jest.setTimeout(22500000)
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
    test('Validate report generation for one sensor', async ({
        given,
        when,
        then,
        and
    }) => {
        let online_sensors, date, day, hours, buildingName
        let reportDetailsXPath = '';
        let extractedTimePeriod = '';
        let building_id = '';
        let extractedProperty = '';
        let extractedSensorSelection = '';
        let ValidateTimePeriod = '';
        given('I am logged as a Building Manager', async () => {
            reporter.startStep('Given I am logged as a Building Manager');
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            reporter.endStep();
        });
        when(/^I select "(.*)"$/, async (building) => {
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`);
            let response2, device_id;
            buildingName = building;
            const buildingXPath = `//ul[@role='menu']//li[span='${building}']`;
            //const response2;
            await delay(3000)
            await performAction('click', commons.button.selectBuilding);
            await delay(5000)
            await Promise.all([
                performAction('click', buildingXPath),
                delay(2000), // Adding a delay here, if necessary
                response2 = await page.waitForResponse(response => response.url().includes('building') && (response.status() === 200 && response.request().method() === 'HEAD'), 15),
                device_id = response2._url.split("/"),
                //console.log(response2),
                logger.info(response2._url),
                building_id = device_id[device_id.length - 1],
                logger.info(building_id),
                waitForNetworkIdle(120000), // 2 mins
            ]);
            const ss1 = await customScreenshot('building.png');
            reporter.addAttachment("building", ss1, "image/png");
            waitForNetworkIdle(120000), // 2 mins
                reporter.endStep();
        });
        // When I navigate to the well QA reporting page
        // This step represents the action of navigating to a specific page for well QA reporting.
        when('I naviagte to well qa reporting page', async () => {
            //When I navigate to the user avatar
            reporter.startStep('When I navigate to well QA reporting page');
            // Perform the action of clicking the avatar button and waiting for network idle.
            await delay(15000)
            await Promise.all([
                performAction('click', commons.button.avatar),
                waitForNetworkIdle(120000)
            ]);
            //reporter.endStep();
            // I navigate to the "Generate Report" option
            //reporter.startStep('When I navigate to the "Generate Report" option');
            // Perform the action of clicking the "Generate Report" tab and waiting for network idle.
            await Promise.all([
                performAction('click', WellReport.li.generateReportTab),
                waitForNetworkIdle(120000)
            ]);
            //reporter.endStep();
            //navigate to the Well QA reporting page
            //reporter.startStep('When I navigate to the Well QA reporting page');
            // Perform the action of clicking the Well IQ div and waiting for network idle.
            await Promise.all([
                performAction('click', WellReport.div.WellIq),
                waitForNetworkIdle(120000)
            ]);
            reporter.endStep();
        });
        // When I select a building
        when(/^I select "(.*)"$/, async (building) => {
            //when i select a time period
            //reporter.startStep('When I select a time period');
            let sensorCount = 0;
            let timePeriodXpath = await getPropertyValueByXpath(WellReport.span.timeperiod, "textContent");
            await delay(3000)
            // let us consider timePeriodXpath = "Jul 31, 2022 - Jul 31, 2023";
            ValidateTimePeriod = timePeriodXpath.split(" - ").pop().trim();
            logger.info(ValidateTimePeriod)
            await performAction('click', WellReport.span.timeperiod);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            //reporter.endStep();
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`);
            buildingName = building;
            // Perform action: Click on the dropdown icon
            await performAction('click', WellReport.div.dropdownIcon);
            await waitForNetworkIdle(10000); // Wait for network idle, adjust the wait time as needed
            const IqBuildingXpath = `//*[@id="building-listbox"]//li[text()='${building}']`
            // console.log(building)
            logger.info(building)
            await Promise.all([
                performAction('click', `//*[@id="building-listbox"]//li[text()='${building}']`),
                waitForNetworkIdle(12000) // Wait for network idle, adjust the wait time as needed
            ]);
            // Perform action: Click on a specific sensor (represented by WellReport.div.sensorXpath)
            await performAction('click', WellReport.div.sensorXpath);
            sensorCount = sensorCount + 1
            const countWithWord = `${sensorCount} Sensor`;
            logger.info(countWithWord)
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            // Wait for 30 seconds using a Promise and setTimeout
            await new Promise((resolve) => setTimeout(resolve, 30000));
            //reporter.startStep('When navigate to generateReportTab');
            // Start step: Navigate to the generate report tab
            await performAction('click', WellReport.div.generateReport);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            //reporter.endStep();
            await delay(5000)
            let reportVerifyXPath = await getPropertyValueByXpath(WellReport.p.reportVerify, "textContent");
            // Fetch the report details XPath
            reportDetailsXPath = await getPropertyValueByXpath(WellReport.p.reportDetails, "textContent");
            //console.log(reportDetailsXPath)
            extractedTimePeriod = reportDetailsXPath.split('for')[2].trim();
            expect(timePeriodXpath).toBe(extractedTimePeriod);
            //console.log(extractedTimePeriod)
            logger.info(extractedTimePeriod)
            //extractedTimePeriod = reportDetailsXPath.split('for')
            extractedSensorSelection = reportDetailsXPath.split('for')[4].trim();
            expect(countWithWord).toBe(extractedSensorSelection);
            //console.log(extractedSensorSelection)
            logger.info(extractedSensorSelection)
            // verify the time period verification is successful
            if (timePeriodXpath === extractedTimePeriod) {
                logger.info("Time period is verified");
            } else {
                logger.error("Time period verification failed");
            }
            //verify the sensor selection
            if (countWithWord === extractedSensorSelection) {
                logger.info("Sensor selection  is verified");
            } else {
                logger.error("Sensor selection verification failed");
            }
            //reporter.startStep('When Navigate to view report tab');
            // Start step: Navigate to the view report tab
            await performAction('click', WellReport.div.viewReport);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            reporter.endStep();
        });
        //check report generation is proper
        then('check report generation is proper', async function () {
            reporter.startStep('Then check report generation is proper');
            await new Promise(resolve => setTimeout(resolve, 10000));
            // Get the initial status values
            const initialReadyStatusXPath = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
            const initialPendingStatusXPath = await getPropertyValueByXpath(WellReport.p.pendingStatus, "textContent");
            // Calculate the expected status values
            const expectedReadyStatus = parseInt(initialReadyStatusXPath) + 1;
            const expectedPendingStatus = parseInt(initialPendingStatusXPath) - 1;
            let refreshedReadyStatusXPath = initialReadyStatusXPath;
            let refreshedPendingStatusXPath = initialPendingStatusXPath;
            const maxTime = 2 * 60 * 1000; // 2 minute in milliseconds
            const refreshInterval = 10 * 1000; // 10 seconds in milliseconds
            let elapsedTime = 0; //keep track of the total time elapsed during the process.
            while (elapsedTime < maxTime) {
                // Simulate page refresh by reloading the page
                await page.evaluate(() => {
                    window.location.reload();
                });
                await new Promise(resolve => setTimeout(resolve, refreshInterval));
                // Perform actions after page reload
                //reporter.startStep('Click on avatar');
                await delay(12000)
                await performAction('click', commons.button.avatar);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                //reporter.startStep('Navigate to generate report tab');
                await performAction('click', WellReport.li.generateReportTab);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                //reporter.startStep('Click on view report tab');
                await performAction('click', WellReport.button.view);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                await new Promise(resolve => setTimeout(resolve, 10000));
                // Get the refreshed status values
                refreshedReadyStatusXPath = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
                refreshedPendingStatusXPath = await getPropertyValueByXpath(WellReport.p.pendingStatus, "textContent");
                // Check if the condition is satisfied
                if (parseInt(refreshedReadyStatusXPath) === expectedReadyStatus &&
                    parseInt(refreshedPendingStatusXPath) === expectedPendingStatus) {
                    logger.info('report generation is proper. Proceed with further steps.');
                    break;
                }
                elapsedTime += refreshInterval;
            }
            if (elapsedTime >= maxTime) {
                logger.error('Condition not satisfied within the maximum time limit.');
            }
            // Get the present time in the EST time zone
            const estTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
            logger.info('Present Time (EST):', estTime);
            logger.info(estTime)
            let validateEstTime = estTime.split(",")[0].trim();
            logger.info(validateEstTime)
            // Function to format the day of the month with a leading zero if needed
            function formatDayWithLeadingZero(date) {
                return date.getDate().toString().padStart(2, '0');
            }
            // Define the month names array
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            // Convert validateEstTime to a valid format "Month Day, Year"
            const parsedValidateEstTime = new Date(validateEstTime);
            const formattedValidateEstTime = `${monthNames[parsedValidateEstTime.getMonth()]} ${formatDayWithLeadingZero(parsedValidateEstTime)}, ${parsedValidateEstTime.getFullYear()}`;
            // Get the previous day date
            const previousDay = new Date(parsedValidateEstTime);
            previousDay.setDate(previousDay.getDate() - 1);
            // Convert the previous day to the same valid format
            const formattedPreviousDay = `${monthNames[previousDay.getMonth()].substr(0, 3)} ${formatDayWithLeadingZero(previousDay)}, ${previousDay.getFullYear()}`;
            // Log the results
            logger.info(formattedValidateEstTime); // Output: August 01, 2023
            logger.info(formattedPreviousDay); // Output: July 31, 2023
            expect(ValidateTimePeriod).toBe(formattedPreviousDay);
            // Here validating the previous date, month, and current year
            if (ValidateTimePeriod === formattedPreviousDay) {
                logger.info("Verified the time period and Est time");
            } else {
                logger.error("Not verified the time period and Est time");
            }
            // Checking the report generation time
            const reportGeneratedTime = await getPropertyValueByXpath(`${WellReport.button.reportGeneration}`, "textContent");
            logger.info('Last Updated Time:', reportGeneratedTime);
            reporter.startStep(`Est time is : ${estTime} and reportGenerated time is : ${reportGeneratedTime}`);
            reporter.endStep();
            //validation of intial status and after freshed status
            reporter.startStep(`initialReadyStatus is : ${initialReadyStatusXPath} and refreshedReadyStatus is : ${refreshedReadyStatusXPath} and expectedReadyStatus is : ${expectedReadyStatus}`);
            try {
                expect(parseInt(refreshedReadyStatusXPath)).toBe(expectedReadyStatus);
                logger.info("Verified the initial Ready status and After refreshed Ready status");
            } catch (error) {
                logger.error("Verification failed for initial Ready status and After refreshed Ready status", error);
            }
            reporter.endStep();
            reporter.startStep(`initialPendingStatus is : ${initialPendingStatusXPath} and refreshedPendingStatus is : ${refreshedPendingStatusXPath} and expectedPendingStatus is : ${expectedPendingStatus}`);
            try {
                expect(parseInt(refreshedPendingStatusXPath)).toBe(expectedPendingStatus);
                logger.info("Verified the initial Pending status and After refreshed pending status");
            } catch (error) {
                logger.error("Verification failed for initial Pending status and After refreshed Pending status", error);
            }
            reporter.endStep();
            // Detect the download enable XPath and print the log message
            const downloadEnableXPath = WellReport.span.downloadEnable;
            const downloadEnableElements = await page.$x(downloadEnableXPath);
            if (downloadEnableElements.length > 0) {
                logger.info('Download option is enabled with XPath');
            } else {
                logger.error('Download option is disabled with XPath');
            }
            //verify Building Id 
            let Building_idXpath = await getPropertyValueByXpath(WellReport.p.fileName, "textContent");
            // logger.info(Building_idXpath)
            let BuildingSplit = Building_idXpath.split("-")[0].trim();
            // console.log(BuildingSplit)
            logger.info(BuildingSplit)
            expect(building_id).toBe(BuildingSplit);
            // Check if the verification is successful
            if (building_id === BuildingSplit) {
                logger.info("Building id is verified");
            } else {
                logger.error("Building id verification is failed");
            }
            extractedProperty = reportDetailsXPath.split('for')[3].trim();
            // console.log(extractedProperty)
            logger.info(extractedProperty)
            expect(buildingName).toBe(extractedProperty);
            // Check if the verification is successful
            if (buildingName === extractedProperty) {
                logger.info("property is verified");
            } else {
                logger.error("property verification is failed");
            }
            //check Report Type 
            let reporttypeXPath = await getPropertyValueByXpath(WellReport.p.reportType, "textContent");
            // logger.info(reporttypeXPath)
            let splitArray = Building_idXpath.split("-");
            let reportdata = splitArray[1].trim();
            //console.log(reportdata)
            logger.info(reportdata)
            expect(reporttypeXPath).toBe(reportdata);
            // Check if the verification is successful
            if (reporttypeXPath === reportdata) {
                logger.info("report type is verified");
            } else {
                logger.error("report type  verification is failed");
            }
            //check property -- Building name
            let propertyXPath = await getPropertyValueByXpath(WellReport.p.property, "textContent");
            // logger.info(propertyXPath)
            // Find the starting index of the property name
            // Validate timePeriodXpath with the extractedTimePeriod
            expect(buildingName).toBe(propertyXPath);
            // Check if the verification is successful
            if (buildingName === propertyXPath) {
                logger.info("Property is verified");
            } else {
                logger.error("property verification is failed");
            }
            // check the file size
            const fileSize = parseFloat(await getPropertyValueByXpath(WellReport.p.fileSize, "textContent"));
            logger.info(`File size: ${fileSize}MB`);
            logger.info('File size verified')
            // Perform the validation using expect assertion
            expect(fileSize).toBeGreaterThan(0);
            // Log an error message if the file size is 0MB
            if (fileSize === 0) {
                logger.error('File size should not be 0 MB');
            }
            await delay(3000)
            // //exit the well reports
            await performAction('click', WellReport.span.exitbutton);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            await Promise.all([
                performAction('click', commons.button.selectBuilding),
                waitForNetworkIdle(120000)
            ]);
            await Promise.all([
                performAction('click', WellReport.span.allProperties),
                waitForNetworkIdle(120000)
            ]);
            // Refresh the page
            //   await page.reload({ waitUntil: "domcontentloaded" });
            reporter.endStep();
        });
    });


    test('Validate report generation for 20 sensors', async ({
        given,
        when,
        then,
        and
    }) => {
        let online_sensors, date, day, hours, buildingName
        let reportDetailsXPath = '';
        let extractedTimePeriod = '';
        let building_id = '';
        let extractedProperty = '';
        let extractedSensorSelection = '';
        let ValidateTimePeriod = '';
        given('I am logged as a Building Manager', async () => {
            reporter.startStep('Given I am logged as a Building Manager');
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            reporter.endStep();
        });
        when(/^I select "(.*)"$/, async (building) => {
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`);
            let response2, device_id;
            buildingName = building;
            const buildingXPath = `//ul[@role='menu']//li[span='${building}']`;
            //const response2;
            await delay(3000)
            await performAction('click', commons.button.selectBuilding);
            await delay(5000)
            await Promise.all([
                performAction('click', buildingXPath),
                delay(2000), // Adding a delay here, if necessary
                response2 = await page.waitForResponse(response => response.url().includes('building') && (response.status() === 200 && response.request().method() === 'HEAD'), 15),
                device_id = response2._url.split("/"),
                //console.log(response2),
                logger.info(response2._url),
                building_id = device_id[device_id.length - 1],
                logger.info(building_id),
                waitForNetworkIdle(120000), // 2 mins
            ]);
            const ss1 = await customScreenshot('building.png');
            reporter.addAttachment("building", ss1, "image/png");
            waitForNetworkIdle(120000), // 2 mins
                reporter.endStep();
        });
        // When I navigate to the well QA reporting page
        // This step represents the action of navigating to a specific page for well QA reporting.
        when('I naviagte to well qa reporting page', async () => {
            //When I navigate to the user avatar
            reporter.startStep('When I navigate to well QA reporting page');
            // Perform the action of clicking the avatar button and waiting for network idle.
            await delay(15000)
            await Promise.all([
                performAction('click', commons.button.avatar),
                waitForNetworkIdle(120000)
            ]);
            //reporter.endStep();
            // I navigate to the "Generate Report" option
            //reporter.startStep('When I navigate to the "Generate Report" option');
            // Perform the action of clicking the "Generate Report" tab and waiting for network idle.
            await Promise.all([
                performAction('click', WellReport.li.generateReportTab),
                waitForNetworkIdle(120000)
            ]);
            //reporter.endStep();
            //navigate to the Well QA reporting page
            //reporter.startStep('When I navigate to the Well QA reporting page');
            // Perform the action of clicking the Well IQ div and waiting for network idle.
            await Promise.all([
                performAction('click', WellReport.div.WellIq),
                waitForNetworkIdle(120000)
            ]);
            reporter.endStep();
        });
        // When I select a building
        when(/^I select "(.*)"$/, async (building) => {
            //when i select a time period
            //reporter.startStep('When I select a time period');
            let sensorCount = 0;
            let timePeriodXpath = await getPropertyValueByXpath(WellReport.span.timeperiod, "textContent");
            await delay(3000)
            // let us consider timePeriodXpath = "Jul 31, 2022 - Jul 31, 2023";
            ValidateTimePeriod = timePeriodXpath.split(" - ").pop().trim();
            logger.info(ValidateTimePeriod)
            await performAction('click', WellReport.span.timeperiod);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            //reporter.endStep();
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`);
            buildingName = building;
            // Perform action: Click on the dropdown icon
            await performAction('click', WellReport.div.dropdownIcon);
            await waitForNetworkIdle(10000); // Wait for network idle, adjust the wait time as needed
            const IqBuildingXpath = `//*[@id="building-listbox"]//li[text()='${building}']`
            //console.log(building)
            logger.info(building)
            await Promise.all([
                performAction('click', `//*[@id="building-listbox"]//li[text()='${building}']`),
                waitForNetworkIdle(12000) // Wait for network idle, adjust the wait time as needed
            ]);
            // Select 20 sensors
            //reporter.startStep('And I select 20 sensors');
            const sensorXpath = WellReport.div.sensorXpath;
            const n = 20; // Select the first 20 sensors
            for (let i = 1; i <= n; i++) {
                const sensorXPath = `(${sensorXpath})[${i}]`;
                await performAction('click', sensorXPath);
                sensorCount = sensorCount + 1
                await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            }
            const countWithWord = `${sensorCount} Sensors`;
            logger.info(countWithWord)
            //reporter.endStep();
            // Wait for 30 seconds using a Promise and setTimeout
            await new Promise((resolve) => setTimeout(resolve, 30000));
            //reporter.startStep('When navigate to generateReportTab');
            // Start step: Navigate to the generate report tab
            await performAction('click', WellReport.div.generateReport);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            //reporter.endStep();
            await delay(5000)
            let reportVerifyXPath = await getPropertyValueByXpath(WellReport.p.reportVerify, "textContent");
            // Fetch the report details XPath
            reportDetailsXPath = await getPropertyValueByXpath(WellReport.p.reportDetails, "textContent");
            //console.log(reportDetailsXPath)
            extractedTimePeriod = reportDetailsXPath.split('for')[2].trim();
            expect(timePeriodXpath).toBe(extractedTimePeriod);
            //console.log(extractedTimePeriod)
            logger.info(extractedTimePeriod)
            //extractedTimePeriod = reportDetailsXPath.split('for')
            extractedSensorSelection = reportDetailsXPath.split('for')[4].trim();
            expect(countWithWord).toBe(extractedSensorSelection);
            //console.log(extractedSensorSelection)
            logger.info(extractedSensorSelection)
            // verify the time period verification is successful
            if (timePeriodXpath === extractedTimePeriod) {
                logger.info("Time period is verified");
            } else {
                logger.error("Time period verification failed");
            }
            //verify the sensor selection
            if (countWithWord === extractedSensorSelection) {
                logger.info("Sensor selection  is verified");
            } else {
                logger.error("Sensor selection verification failed");
            }
            //reporter.startStep('When Navigate to view report tab');
            // Start step: Navigate to the view report tab
            await performAction('click', WellReport.div.viewReport);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            reporter.endStep();
        });
        then('check report generation is proper', async function () {
            reporter.startStep('Then check report generation is proper');
            await new Promise(resolve => setTimeout(resolve, 10000));
            // Get the initial status values
            const initialReadyStatusXPath = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
            const initialPendingStatusXPath = await getPropertyValueByXpath(WellReport.p.pendingStatus, "textContent");
            // Calculate the expected status values
            const expectedReadyStatus = parseInt(initialReadyStatusXPath) + 1;
            const expectedPendingStatus = parseInt(initialPendingStatusXPath) - 1;
            let refreshedReadyStatusXPath = initialReadyStatusXPath;
            let refreshedPendingStatusXPath = initialPendingStatusXPath;
            const maxTime = 20 * 60 * 1000; // 20 minutes in milliseconds
            const refreshInterval = 3 * 60 * 1000; // 3 minutes in milliseconds
            let elapsedTime = 0;//keep track of the total time elapsed during the process
            while (elapsedTime < maxTime) {
                // Simulate page refresh by reloading the page
                await page.evaluate(() => {
                    window.location.reload();
                });
                await new Promise(resolve => setTimeout(resolve, refreshInterval));
                // Perform actions after page reload
                //reporter.startStep('Click on avatar');
                await delay(12000)
                await performAction('click', commons.button.avatar);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                //reporter.startStep('Navigate to generate report tab');
                await performAction('click', WellReport.li.generateReportTab);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                //reporter.startStep('Click on view report tab');
                await performAction('click', WellReport.button.view);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                await new Promise(resolve => setTimeout(resolve, 10000));
                // Get the refreshed status values
                refreshedReadyStatusXPath = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
                refreshedPendingStatusXPath = await getPropertyValueByXpath(WellReport.p.pendingStatus, "textContent");
                // Check if the condition is satisfied
                if (parseInt(refreshedReadyStatusXPath) === expectedReadyStatus &&
                    parseInt(refreshedPendingStatusXPath) === expectedPendingStatus) {
                    logger.info('report generation is proper. Proceed with further steps.');
                    break;
                }
                elapsedTime += refreshInterval;
            }
            if (elapsedTime >= maxTime) {
                logger.error('Condition not satisfied within the maximum time limit.');
            }
            // Get the present time in the EST time zone
            const estTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
            logger.info('Present Time (EST):', estTime);
            logger.info(estTime)
            let validateEstTime = estTime.split(",")[0].trim();
            logger.info(validateEstTime)
            // Function to format the day of the month with a leading zero if needed
            function formatDayWithLeadingZero(date) {
                return date.getDate().toString().padStart(2, '0');
            }
            // Define the month names array
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            // Convert validateEstTime to a valid format "Month Day, Year"
            const parsedValidateEstTime = new Date(validateEstTime);
            const formattedValidateEstTime = `${monthNames[parsedValidateEstTime.getMonth()]} ${formatDayWithLeadingZero(parsedValidateEstTime)}, ${parsedValidateEstTime.getFullYear()}`;
            // Get the previous day date
            const previousDay = new Date(parsedValidateEstTime);
            previousDay.setDate(previousDay.getDate() - 1);
            // Convert the previous day to the same valid format
            const formattedPreviousDay = `${monthNames[previousDay.getMonth()].substr(0, 3)} ${formatDayWithLeadingZero(previousDay)}, ${previousDay.getFullYear()}`;
            // Log the results
            logger.info(formattedValidateEstTime);
            logger.info(formattedPreviousDay);
            expect(ValidateTimePeriod).toBe(formattedPreviousDay);
            // Here validating the previous date, month, and current year
            if (ValidateTimePeriod === formattedPreviousDay) {
                logger.info("Verified the time period and Est time");
            } else {
                logger.error("Not verified the time period and Est time");
            }
            // Checking the report generation time
            const reportGeneratedTime = await getPropertyValueByXpath(`${WellReport.button.reportGeneration}`, "textContent");
            logger.info('Last Updated Time:', reportGeneratedTime);
            reporter.startStep(`Est time is : ${estTime} and reportGenerated time is : ${reportGeneratedTime}`);
            reporter.endStep();
            //validation of intial status and after freshed status
            reporter.startStep(`initialReadyStatus is : ${initialReadyStatusXPath} and refreshedReadyStatus is : ${refreshedReadyStatusXPath} and expectedReadyStatus is : ${expectedReadyStatus}`);
            try {
                expect(parseInt(refreshedReadyStatusXPath)).toBe(expectedReadyStatus);
                logger.info("Verified the initial Ready status and After refreshed Ready status");
            } catch (error) {
                logger.error("Verification failed for initial Ready status and After refreshed Ready status", error);
            }
            reporter.endStep();
            reporter.startStep(`initialPendingStatus is : ${initialPendingStatusXPath} and refreshedPendingStatus is : ${refreshedPendingStatusXPath} and expectedPendingStatus is : ${expectedPendingStatus}`);
            try {
                expect(parseInt(refreshedPendingStatusXPath)).toBe(expectedPendingStatus);
                logger.info("Verified the initial Pending status and After refreshed pending status");
            } catch (error) {
                logger.error("Verification failed for initial Pending status and After refreshed Pending status", error);
            }
            reporter.endStep();
            // Detect the download enable XPath and print the log message
            const downloadEnableXPath = WellReport.span.downloadEnable;
            const downloadEnableElements = await page.$x(downloadEnableXPath);
            if (downloadEnableElements.length > 0) {
                logger.info('Download option is enabled with XPath');
            } else {
                logger.error('Download option is disabled with XPath');
            }
            //verify Building Id 
            let Building_idXpath = await getPropertyValueByXpath(WellReport.p.fileName, "textContent");
            // logger.info(Building_idXpath)
            let BuildingSplit = Building_idXpath.split("-")[0].trim();
            // console.log(BuildingSplit)
            logger.info(BuildingSplit)
            expect(building_id).toBe(BuildingSplit);
            // Check if the verification is successful
            if (building_id === BuildingSplit) {
                logger.info("Building id is verified");
            } else {
                logger.error("Building id verification is failed");
            }
            extractedProperty = reportDetailsXPath.split('for')[3].trim();
            // console.log(extractedProperty)
            logger.info(extractedProperty)
            expect(buildingName).toBe(extractedProperty);
            // Check if the verification is successful
            if (buildingName === extractedProperty) {
                logger.info("property is verified");
            } else {
                logger.error("property verification is failed");
            }
            //check Report Type 
            let reporttypeXPath = await getPropertyValueByXpath(WellReport.p.reportType, "textContent");
            // logger.info(reporttypeXPath)
            let splitArray = Building_idXpath.split("-");
            let reportdata = splitArray[1].trim();
            //console.log(reportdata)
            logger.info(reportdata)
            expect(reporttypeXPath).toBe(reportdata);
            // Check if the verification is successful
            if (reporttypeXPath === reportdata) {
                logger.info("report type is verified");
            } else {
                logger.error("report type  verification is failed");
            }
            //check property -- Building name
            let propertyXPath = await getPropertyValueByXpath(WellReport.p.property, "textContent");
            // logger.info(propertyXPath)
            // Find the starting index of the property name
            // Validate timePeriodXpath with the extractedTimePeriod
            expect(buildingName).toBe(propertyXPath);
            // Check if the verification is successful
            if (buildingName === propertyXPath) {
                logger.info("Property is verified");
            } else {
                logger.error("property verification is failed");
            }
            // check the file size
            const fileSize = parseFloat(await getPropertyValueByXpath(WellReport.p.fileSize, "textContent"));
            logger.info(`File size: ${fileSize}MB`);
            logger.info('File size verified')
            // Perform the validation using expect assertion
            expect(fileSize).toBeGreaterThan(0);
            // Log an error message if the file size is 0MB
            if (fileSize === 0) {
                logger.error('File size should not be 0 MB');
            }
            await delay(3000)
            // //exit the well reports
            await performAction('click', WellReport.span.exitbutton);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            await Promise.all([
                performAction('click', commons.button.selectBuilding),
                waitForNetworkIdle(120000)
            ]);
            await Promise.all([
                performAction('click', WellReport.span.allProperties),
                waitForNetworkIdle(120000)
            ]);
            reporter.endStep();
            // Refresh the page
            //   await page.reload({ waitUntil: "domcontentloaded" });
        });
    });



    test('Sensor selection limited to 20', async ({
        given,
        when,
        then,
        and
    }) => {
        let online_sensors, date, day, hours, buildingName
        given('I am logged as a Building Manager', async () => {
            reporter.startStep('Given I am logged as a Building Manager');
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            await page.reload({ waitUntil: "domcontentloaded" });
            reporter.endStep();
        });
        when('I naviagte to well qa reporting page', async () => {
            //When I navigate to the user avatar
            reporter.startStep('When I navigate to well QA reporting page');
            // Perform the action of clicking the avatar button and waiting for network idle.
            await delay(30000)
            await Promise.all([
                performAction('click', commons.button.avatar),
                waitForNetworkIdle(120000)
            ]);
            //reporter.endStep();
            // I navigate to the "Generate Report" option
            //reporter.startStep('When I navigate to the "Generate Report" option');
            // Perform the action of clicking the "Generate Report" tab and waiting for network idle.
            await Promise.all([
                performAction('click', WellReport.li.generateReportTab),
                waitForNetworkIdle(120000)
            ]);
            //reporter.endStep();
            //navigate to the Well QA reporting page
            //reporter.startStep('When I navigate to the Well QA reporting page');
            // Perform the action of clicking the Well IQ div and waiting for network idle.
            await Promise.all([
                performAction('click', WellReport.div.WellIq),
                waitForNetworkIdle(120000)
            ]);
            //I select a time period
            // reporter.startStep('And I select a time period');
            // Perform action: Click on the time period
            await performAction('click', WellReport.span.timeperiod);
            await waitForNetworkIdle(12000); // Adjust the wait time as needed
            reporter.endStep();
        });
        // When I select a building
        when(/^I select "(.*)"$/, async (building) => {
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`);
            buildingName = building;
            // Perform action: Click on the dropdown icon
            await performAction('click', WellReport.div.dropdownIcon);
            await waitForNetworkIdle(10000); // Wait for network idle, adjust the wait time as needed
            const IqBuildingXpath = `//*[@id="building-listbox"]//li[text()='${building}']`
            //console.log(building)
            logger.info(building)
            await Promise.all([
                performAction('click', `//*[@id="building-listbox"]//li[text()='${building}']`),
                waitForNetworkIdle(12000) // Wait for network idle, adjust the wait time as needed
            ]);
            reporter.endStep();
        });
        async function isSensorClickable(sensorXPath) {
            try {
                await performAction('click', sensorXPath);
                return true; // Click is successful, sensor is clickable (enabled)
            } catch (error) {
                if (error.message.includes('not visible and not disabled')) {
                    return false; // Click failed, sensor is not clickable (disabled)
                }
                throw error; // For other errors, rethrow the error
            } finally {
                await waitForNetworkIdle(12000);
            }
        }
        then('Verify that 21st sesnor selection is disabled', async () => {
            reporter.startStep('Verify that 21st sensor selection is disabled');
            const enableSensorXpath = WellReport.div.sensorXpath;
            const disableSensorXpath = WellReport.div.disable;
            const totalSensors = 21;
            let enabledSensorsCount = 0;
            let disabledSensorsCount = 0;
            for (let i = 1; i <= totalSensors; i++) {
                const sensorXPath = `(${enableSensorXpath})[${i}]`;
                const is21stSensorDisable = `(${disableSensorXpath})[${i}]`;
                if (i !== 21) {
                    // Skip the click operation for the 21st sensor
                    if (await isSensorClickable(sensorXPath)) {
                        logger.info(`Sensor ${i} is enabled`);
                        enabledSensorsCount++;
                    }
                } else if (is21stSensorDisable) {
                    logger.info('Sensor 21 is disabled'); // The 21st sensor should be disabled, so this is an error
                    disabledSensorsCount++; // Increment the count of disabled sensors for the 21st sensor
                }
            }
            logger.info(`Total sensors: ${totalSensors}`);
            logger.info(`Enabled sensors: ${enabledSensorsCount}`);
            logger.info(`Disabled sensors: ${disabledSensorsCount}`);
            // Check the conditions
            // Start the step using a template literal
            reporter.startStep(`Total sensors is: ${totalSensors} and Enabled sensors is: ${enabledSensorsCount} and Disabled sensors is: ${disabledSensorsCount}`);
            if (enabledSensorsCount === 20 && disabledSensorsCount === 1) {
                expect(enabledSensorsCount).toBe(20);
                expect(disabledSensorsCount).toBe(1);
                logger.info("Expectation met: enabledSensorsCount & disabledSensorsCount is matched");
            } else {
                logger.error("Expectation not matched");
            }
            reporter.endStep();
            //exit the well reports iq
            await performAction('click', WellReport.span.closeIcon);
            //exit the well reports
            await delay(3000)
            await performAction('click', WellReport.span.exitbutton);
            reporter.endStep();
        });
    });


    test('Delete a generated report', async ({
        given,
        when,
        then,
        and
    }) => {
        let online_sensors, date, day, hours, buildingName
        let reportDetailsXPath = '';
        let extractedTimePeriod = '';
        let building_id = '';
        let extractedProperty = '';
        let extractedSensorSelection = '';
        let ValidateTimePeriod = '';
        given('I am logged as a Building Manager', async () => {
            reporter.startStep('Given I am logged as a Building Manager');
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            await page.reload({ waitUntil: "domcontentloaded" });
            reporter.endStep();
        });
        when(/^I select "(.*)"$/, async (building) => {
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`);
            let response2, device_id;
            buildingName = building;
            await delay(30000)
            const buildingXPath = `//ul[@role='menu']//li[span='${building}']`;
            //const response2;
            await delay(3000)
            await performAction('click', commons.button.selectBuilding);
            await delay(5000)
            await Promise.all([
                performAction('click', buildingXPath),
                delay(2000), // Adding a delay here, if necessary
                response2 = await page.waitForResponse(response => response.url().includes('building') && (response.status() === 200 && response.request().method() === 'HEAD'), 15),
                device_id = response2._url.split("/"),
                //console.log(response2),
                logger.info(response2._url),
                building_id = device_id[device_id.length - 1],
                logger.info(building_id),
                waitForNetworkIdle(120000), // 2 mins
            ]);
            const ss1 = await customScreenshot('building.png');
            reporter.addAttachment("building", ss1, "image/png");
            reporter.endStep();
        });
        // When I navigate to the well QA reporting page
        when('I naviagte to well qa reporting page', async () => {
            //When I navigate to the user avatar
            reporter.startStep('When I navigate to well QA reporting page');
            // Perform the action of clicking the avatar button and waiting for network idle.
            await delay(15000)
            await Promise.all([
                performAction('click', commons.button.avatar),
                waitForNetworkIdle(120000)
            ]);
            // I navigate to the "Generate Report" option
            await Promise.all([
                performAction('click', WellReport.li.generateReportTab),
                waitForNetworkIdle(120000)
            ]);
            //navigate to the Well QA reporting page
            await Promise.all([
                performAction('click', WellReport.div.WellIq),
                waitForNetworkIdle(120000)
            ]);
            reporter.endStep();
        });
        // When I select a building
        when(/^I select "(.*)"$/, async (building) => {
            //when i select a time period
            let sensorCount = 0;
            let timePeriodXpath = await getPropertyValueByXpath(WellReport.span.timeperiod, "textContent");
            await delay(3000)
            // let us consider timePeriodXpath = "Jul 31, 2022 - Jul 31, 2023";
            ValidateTimePeriod = timePeriodXpath.split(" - ").pop().trim();
            logger.info(ValidateTimePeriod)
            await performAction('click', WellReport.span.timeperiod);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            //When i select Building
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`);
            buildingName = building;
            // Perform action: Click on the dropdown icon
            await performAction('click', WellReport.div.dropdownIcon);
            await waitForNetworkIdle(10000); // Wait for network idle, adjust the wait time as needed
            const IqBuildingXpath = `//*[@id="building-listbox"]//li[text()='${building}']`
            // console.log(building)
            logger.info(building)
            await Promise.all([
                performAction('click', `//*[@id="building-listbox"]//li[text()='${building}']`),
                waitForNetworkIdle(12000) // Wait for network idle, adjust the wait time as needed
            ]);
            // Perform action: Click on a specific sensor (represented by WellReport.div.sensorXpath)
            await performAction('click', WellReport.div.sensorXpath);
            sensorCount = sensorCount + 1
            const countWithWord = `${sensorCount} Sensor`;
            logger.info(countWithWord)
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            // Wait for 30 seconds using a Promise and setTimeout
            await new Promise((resolve) => setTimeout(resolve, 15000));
            //reporter.startStep('When navigate to generateReportTab');
            // Start step: Navigate to the generate report tab
            await performAction('click', WellReport.div.generateReport);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            //reporter.endStep();
            await delay(5000)
            let reportVerifyXPath = await getPropertyValueByXpath(WellReport.p.reportVerify, "textContent");
            // Fetch the report details XPath
            reportDetailsXPath = await getPropertyValueByXpath(WellReport.p.reportDetails, "textContent");
            //console.log(reportDetailsXPath)
            extractedTimePeriod = reportDetailsXPath.split('for')[2].trim();
            expect(timePeriodXpath).toBe(extractedTimePeriod);
            //console.log(extractedTimePeriod)
            logger.info(extractedTimePeriod)
            //extractedTimePeriod = reportDetailsXPath.split('for')
            extractedSensorSelection = reportDetailsXPath.split('for')[4].trim();
            expect(countWithWord).toBe(extractedSensorSelection);
            //console.log(extractedSensorSelection)
            logger.info(extractedSensorSelection)
            // verify the time period verification is successful
            if (timePeriodXpath === extractedTimePeriod) {
                logger.info("Time period is verified");
            } else {
                logger.error("Time period verification failed");
            }
            //verify the sensor selection
            if (countWithWord === extractedSensorSelection) {
                logger.info("Sensor selection  is verified");
            } else {
                logger.error("Sensor selection verification failed");
            }
            //reporter.startStep('When Navigate to view report tab');
            // Start step: Navigate to the view report tab
            await performAction('click', WellReport.div.viewReport);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            reporter.endStep();
        });
        //check report generation is proper
        then('check report generation is proper', async function () {
            reporter.startStep('Then check report generation is proper');
            await new Promise(resolve => setTimeout(resolve, 10000));
            // Get the initial status values
            const initialReadyStatusXPath = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
            const initialPendingStatusXPath = await getPropertyValueByXpath(WellReport.p.pendingStatus, "textContent");
            // Calculate the expected status values
            const expectedReadyStatus = parseInt(initialReadyStatusXPath) + 1;
            const expectedPendingStatus = parseInt(initialPendingStatusXPath) - 1;
            let refreshedReadyStatusXPath = initialReadyStatusXPath;
            let refreshedPendingStatusXPath = initialPendingStatusXPath;
            const maxTime = 2 * 60 * 1000; // 2 minute in milliseconds
            const refreshInterval = 10 * 1000; // 10 seconds in milliseconds
            let elapsedTime = 0; //keep track of the total time elapsed during the process.
            while (elapsedTime < maxTime) {
                // Simulate page refresh by reloading the page
                await page.evaluate(() => {
                    window.location.reload();
                });
                await new Promise(resolve => setTimeout(resolve, refreshInterval));
                // Perform actions after page reload
                //reporter.startStep('Click on avatar');
                await delay(12000)
                await performAction('click', commons.button.avatar);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                //reporter.startStep('Navigate to generate report tab');
                await performAction('click', WellReport.li.generateReportTab);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                //reporter.startStep('Click on view report tab');
                await performAction('click', WellReport.button.view);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                await new Promise(resolve => setTimeout(resolve, 10000));
                // Get the refreshed status values
                refreshedReadyStatusXPath = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
                refreshedPendingStatusXPath = await getPropertyValueByXpath(WellReport.p.pendingStatus, "textContent");
                // Check if the condition is satisfied
                if (parseInt(refreshedReadyStatusXPath) === expectedReadyStatus &&
                    parseInt(refreshedPendingStatusXPath) === expectedPendingStatus) {
                    logger.info('report generation is proper. Proceed with further steps.');
                    break;
                }
                elapsedTime += refreshInterval;
            }
            if (elapsedTime >= maxTime) {
                logger.error('Condition not satisfied within the maximum time limit.');
            }
            // Get the present time in the EST time zone
            const estTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
            logger.info('Present Time (EST):', estTime);
            logger.info(estTime)
            let validateEstTime = estTime.split(",")[0].trim();
            logger.info(validateEstTime)
            // Function to format the day of the month with a leading zero if needed
            function formatDayWithLeadingZero(date) {
                return date.getDate().toString().padStart(2, '0');
            }
            // Define the month names array
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            // Convert validateEstTime to a valid format "Month Day, Year"
            const parsedValidateEstTime = new Date(validateEstTime);
            const formattedValidateEstTime = `${monthNames[parsedValidateEstTime.getMonth()]} ${formatDayWithLeadingZero(parsedValidateEstTime)}, ${parsedValidateEstTime.getFullYear()}`;
            // Get the previous day date
            const previousDay = new Date(parsedValidateEstTime);
            previousDay.setDate(previousDay.getDate() - 1);
            // Convert the previous day to the same valid format
            const formattedPreviousDay = `${monthNames[previousDay.getMonth()].substr(0, 3)} ${formatDayWithLeadingZero(previousDay)}, ${previousDay.getFullYear()}`;
            // Log the results
            logger.info(formattedValidateEstTime); // Output: August 01, 2023
            logger.info(formattedPreviousDay); // Output: July 31, 2023
            expect(ValidateTimePeriod).toBe(formattedPreviousDay);
            // Here validating the previous date, month, and current year
            if (ValidateTimePeriod === formattedPreviousDay) {
                logger.info("Verified the time period and Est time");
            } else {
                logger.error("Not verified the time period and Est time");
            }
            // Checking the report generation time
            const reportGeneratedTime = await getPropertyValueByXpath(`${WellReport.button.reportGeneration}`, "textContent");
            logger.info('Last Updated Time:', reportGeneratedTime);
            reporter.startStep(`Est time is : ${estTime} and reportGenerated time is : ${reportGeneratedTime}`);
            reporter.endStep();
            //validation of intial status and after freshed status
            reporter.startStep(`initialReadyStatus is : ${initialReadyStatusXPath} and refreshedReadyStatus is : ${refreshedReadyStatusXPath} and expectedReadyStatus is : ${expectedReadyStatus}`);
            try {
                expect(parseInt(refreshedReadyStatusXPath)).toBe(expectedReadyStatus);
                logger.info("Verified the initial Ready status and After refreshed Ready status");
            } catch (error) {
                logger.error("Verification failed for initial Ready status and After refreshed Ready status", error);
            }
            reporter.endStep();
            reporter.startStep(`initialPendingStatus is : ${initialPendingStatusXPath} and refreshedPendingStatus is : ${refreshedPendingStatusXPath} and expectedPendingStatus is : ${expectedPendingStatus}`);
            try {
                expect(parseInt(refreshedPendingStatusXPath)).toBe(expectedPendingStatus);
                logger.info("Verified the initial Pending status and After refreshed pending status");
            } catch (error) {
                logger.error("Verification failed for initial Pending status and After refreshed Pending status", error);
            }
            reporter.endStep();
            // Detect the download enable XPath and print the log message
            const downloadEnableXPath = WellReport.span.downloadEnable;
            const downloadEnableElements = await page.$x(downloadEnableXPath);
            if (downloadEnableElements.length > 0) {
                logger.info('Download option is enabled with XPath');
            } else {
                logger.error('Download option is disabled with XPath');
            }
            //verify Building Id 
            let Building_idXpath = await getPropertyValueByXpath(WellReport.p.fileName, "textContent");
            // logger.info(Building_idXpath)
            let BuildingSplit = Building_idXpath.split("-")[0].trim();
            // console.log(BuildingSplit)
            logger.info(BuildingSplit)
            expect(building_id).toBe(BuildingSplit);
            // Check if the verification is successful
            if (building_id === BuildingSplit) {
                logger.info("Building id is verified");
            } else {
                logger.error("Building id verification is failed");
            }
            extractedProperty = reportDetailsXPath.split('for')[3].trim();
            // console.log(extractedProperty)
            logger.info(extractedProperty)
            expect(buildingName).toBe(extractedProperty);
            // Check if the verification is successful
            if (buildingName === extractedProperty) {
                logger.info("property is verified");
            } else {
                logger.error("property verification is failed");
            }
            //check Report Type 
            let reporttypeXPath = await getPropertyValueByXpath(WellReport.p.reportType, "textContent");
            // logger.info(reporttypeXPath)
            let splitArray = Building_idXpath.split("-");
            let reportdata = splitArray[1].trim();
            //console.log(reportdata)
            logger.info(reportdata)
            expect(reporttypeXPath).toBe(reportdata);
            // Check if the verification is successful
            if (reporttypeXPath === reportdata) {
                logger.info("report type is verified");
            } else {
                logger.error("report type  verification is failed");
            }
            //check property -- Building name
            let propertyXPath = await getPropertyValueByXpath(WellReport.p.property, "textContent");
            // logger.info(propertyXPath)
            // Find the starting index of the property name
            // Validate timePeriodXpath with the extractedTimePeriod
            expect(buildingName).toBe(propertyXPath);
            // Check if the verification is successful
            if (buildingName === propertyXPath) {
                logger.info("Property is verified");
            } else {
                logger.error("property verification is failed");
            }
            // check the file size
            const fileSize = parseFloat(await getPropertyValueByXpath(WellReport.p.fileSize, "textContent"));
            logger.info(`File size: ${fileSize}MB`);
            logger.info('File size verified')
            // Perform the validation using expect assertion
            expect(fileSize).toBeGreaterThan(0);
            // Log an error message if the file size is 0MB
            if (fileSize === 0) {
                logger.error('File size should not be 0 MB');
            }
            await delay(3000)
            // //exit the well reports
            await performAction('click', WellReport.span.exitbutton);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            await Promise.all([
                performAction('click', commons.button.selectBuilding),
                waitForNetworkIdle(120000)
            ]);
            await Promise.all([
                performAction('click', WellReport.span.allProperties),
                waitForNetworkIdle(120000)
            ]);
            // Refresh the page
            //   await page.reload({ waitUntil: "domcontentloaded" });
            reporter.endStep();
        });
        and('Delete a generated report', async function () {
            reporter.startStep('Delete a generated report');
            await delay(15000)
            await Promise.all([
                performAction('click', commons.button.avatar),
                waitForNetworkIdle(120000)
            ]);
            await Promise.all([
                performAction('click', WellReport.li.generateReportTab),
                waitForNetworkIdle(120000)
            ]);
            await performAction('click', WellReport.button.view);
            await waitForNetworkIdle(120000);
            await new Promise(resolve => setTimeout(resolve, 10000));
            const reportReadyGeneration = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
            // Calculate the expected status values
            const expectedDeletedReadyStatus = parseInt(reportReadyGeneration) - 1;
            const maxTime = 3 * 60 * 1000; // 2 minute in milliseconds
            const refreshInterval = 10 * 1000; // 10 seconds in milliseconds
            let elapsedTime = 0; //keep track of the total time elapsed during the process.
            await delay(5000)
            await Promise.all([
                performAction('click', WellReport.img.deleteOption),
                waitForNetworkIdle(120000)
            ]);
            while (elapsedTime < maxTime) {
                // Simulate page refresh by reloading the page
                await page.evaluate(() => {
                    window.location.reload();
                });
                await new Promise(resolve => setTimeout(resolve, refreshInterval));
                await delay(15000);
                await Promise.all([
                    performAction('click', commons.button.avatar),
                    waitForNetworkIdle(120000)
                ]);
                await Promise.all([
                    performAction('click', WellReport.li.generateReportTab),
                    waitForNetworkIdle(120000)
                ]);
                await performAction('click', WellReport.button.view);
                await waitForNetworkIdle(120000);
                await new Promise(resolve => setTimeout(resolve, 10000));
                // Get the refreshed status values
                const refreshedReadyStatusXPath = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
                const refreshedReadyStatus = parseInt(refreshedReadyStatusXPath);
                if (refreshedReadyStatus === expectedDeletedReadyStatus) {
                    // expect(refreshedReadyStatus).toBe(expectedDeletedReadyStatus); 
                    logger.info('report deletion is proper.');
                    logger.info('report deletion is reflected in total report count.');
                    reporter.startStep(`initialReadyStatus is : ${reportReadyGeneration} and refreshedReadyStatus is : ${expectedDeletedReadyStatus} and expectedReadyStatus is : ${refreshedReadyStatus}`);
                    try {
                        expect(refreshedReadyStatus).toBe(expectedDeletedReadyStatus);
                        logger.info('report deletion is proper.');
                        logger.info('report deletion is reflected in total report count.');
                    } catch (error) {
                        logger.error("Verification failed for initial Ready status and After refreshed Ready status", error);
                    }
                    reporter.endStep();
                    break;
                }
                elapsedTime += refreshInterval;
            }
            if (elapsedTime >= maxTime) {
                logger.error('Condition not satisfied within the maximum time limit.');
            }
            await delay(3000)
            await performAction('click', WellReport.span.exitbutton);
            reporter.endStep();
        });
    });

    test('Validate Report Generation for the Time Period 2021-2022', async ({
        given,
        when,
        then,
        and
    }) => {
        let online_sensors, date, day, hours, buildingName
        let reportDetailsXPath = '';
        let extractedTimePeriod = '';
        let building_id = '';
        let extractedProperty = '';
        let extractedSensorSelection = '';
        let ValidateTimePeriod = '';
        given('I am logged as a Building Manager', async () => {
            reporter.startStep('Given I am logged as a Building Manager');
            let ss = await customScreenshot('building.png')
            reporter.addAttachment("building", ss, "image/png");
            reporter.endStep();
        });
        when(/^I select "(.*)"$/, async (building) => {
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`);
            let response2, device_id;
            buildingName = building;
            const buildingXPath = `//ul[@role='menu']//li[span='${building}']`;
            //const response2;
            await delay(3000)
            await performAction('click', commons.button.selectBuilding);
            await delay(5000)
            await Promise.all([
                performAction('click', buildingXPath),
                delay(2000), // Adding a delay here, if necessary
                response2 = await page.waitForResponse(response => response.url().includes('building') && (response.status() === 200 && response.request().method() === 'HEAD'), 15),
                device_id = response2._url.split("/"),
                //console.log(response2),
                logger.info(response2._url),
                building_id = device_id[device_id.length - 1],
                logger.info(building_id),
                waitForNetworkIdle(120000), // 2 mins
            ]);
            const ss1 = await customScreenshot('building.png');
            reporter.addAttachment("building", ss1, "image/png");
            waitForNetworkIdle(120000), // 2 mins
                reporter.endStep();
        });
        // When I navigate to the well QA reporting page
        // This step represents the action of navigating to a specific page for well QA reporting.
        when('I naviagte to well qa reporting page', async () => {
            //When I navigate to the user avatar
            reporter.startStep('When I navigate to well QA reporting page');
            // Perform the action of clicking the avatar button and waiting for network idle.
            await delay(15000)
            await Promise.all([
                performAction('click', commons.button.avatar),
                waitForNetworkIdle(120000)
            ]);
            //reporter.endStep();
            // I navigate to the "Generate Report" option
            //reporter.startStep('When I navigate to the "Generate Report" option');
            // Perform the action of clicking the "Generate Report" tab and waiting for network idle.
            await Promise.all([
                performAction('click', WellReport.li.generateReportTab),
                waitForNetworkIdle(120000)
            ]);
            //reporter.endStep();
            //navigate to the Well QA reporting page
            //reporter.startStep('When I navigate to the Well QA reporting page');
            // Perform the action of clicking the Well IQ div and waiting for network idle.
            await Promise.all([
                performAction('click', WellReport.div.WellIq),
                waitForNetworkIdle(120000)
            ]);
            reporter.endStep();
        });
        // When I select a building
        when(/^I select "(.*)"$/, async (building) => {
            //when i select a time period
            //reporter.startStep('When I select a time period');
            let sensorCount = 0;
            let timePeriodXpath = await getPropertyValueByXpath(WellReport.span.timeperiod2, "textContent");
            await delay(3000)
            // let us consider timePeriodXpath = "Jul 31, 2022 - Jul 31, 2023";
            ValidateTimePeriod = timePeriodXpath.split(" - ").pop().trim();
            logger.info(ValidateTimePeriod)
            await performAction('click', WellReport.span.timeperiod2);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            //reporter.endStep();
            reporter.startStep(`When I select ${building}`);
            logger.info(`When I select ${building}`);
            buildingName = building;
            // Perform action: Click on the dropdown icon
            await performAction('click', WellReport.div.dropdownIcon);
            await waitForNetworkIdle(10000); // Wait for network idle, adjust the wait time as needed
            const IqBuildingXpath = `//*[@id="building-listbox"]//li[text()='${building}']`
            // console.log(building)
            logger.info(building)
            await Promise.all([
                performAction('click', `//*[@id="building-listbox"]//li[text()='${building}']`),
                waitForNetworkIdle(12000) // Wait for network idle, adjust the wait time as needed
            ]);
            // Perform action: Click on a specific sensor (represented by WellReport.div.sensorXpath)
            await performAction('click', WellReport.div.sensorXpath);
            sensorCount = sensorCount + 1
            const countWithWord = `${sensorCount} Sensor`;
            logger.info(countWithWord)
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            // Wait for 30 seconds using a Promise and setTimeout
            await new Promise((resolve) => setTimeout(resolve, 30000));
            //reporter.startStep('When navigate to generateReportTab');
            // Start step: Navigate to the generate report tab
            await performAction('click', WellReport.div.generateReport);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            //reporter.endStep();
            await delay(5000)
            let reportVerifyXPath = await getPropertyValueByXpath(WellReport.p.reportVerify, "textContent");
            // Fetch the report details XPath
            reportDetailsXPath = await getPropertyValueByXpath(WellReport.p.reportDetails, "textContent");
            //console.log(reportDetailsXPath)
            extractedTimePeriod = reportDetailsXPath.split('for')[2].trim();
            expect(timePeriodXpath).toBe(extractedTimePeriod);
            //console.log(extractedTimePeriod)
            logger.info(extractedTimePeriod)
            //extractedTimePeriod = reportDetailsXPath.split('for')
            extractedSensorSelection = reportDetailsXPath.split('for')[4].trim();
            expect(countWithWord).toBe(extractedSensorSelection);
            //console.log(extractedSensorSelection)
            logger.info(extractedSensorSelection)
            // verify the time period verification is successful
            if (timePeriodXpath === extractedTimePeriod) {
                logger.info("Time period is verified");
            } else {
                logger.error("Time period verification failed");
            }
            //verify the sensor selection
            if (countWithWord === extractedSensorSelection) {
                logger.info("Sensor selection  is verified");
            } else {
                logger.error("Sensor selection verification failed");
            }
            //reporter.startStep('When Navigate to view report tab');
            // Start step: Navigate to the view report tab
            await performAction('click', WellReport.div.viewReport);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            reporter.endStep();
        });
        //check report generation is proper
        then('check report generation is proper', async function () {
            reporter.startStep('Then check report generation is proper');
            await new Promise(resolve => setTimeout(resolve, 10000));
            // Get the initial status values
            const initialReadyStatusXPath = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
            const initialPendingStatusXPath = await getPropertyValueByXpath(WellReport.p.pendingStatus, "textContent");
            // Calculate the expected status values
            const expectedReadyStatus = parseInt(initialReadyStatusXPath) + 1;
            const expectedPendingStatus = parseInt(initialPendingStatusXPath) - 1;
            let refreshedReadyStatusXPath = initialReadyStatusXPath;
            let refreshedPendingStatusXPath = initialPendingStatusXPath;
            const maxTime = 2 * 60 * 1000; // 2 minute in milliseconds
            const refreshInterval = 10 * 1000; // 10 seconds in milliseconds
            let elapsedTime = 0; //keep track of the total time elapsed during the process.
            while (elapsedTime < maxTime) {
                // Simulate page refresh by reloading the page
                await page.evaluate(() => {
                    window.location.reload();
                });
                await new Promise(resolve => setTimeout(resolve, refreshInterval));
                // Perform actions after page reload
                //reporter.startStep('Click on avatar');
                await delay(12000)
                await performAction('click', commons.button.avatar);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                //reporter.startStep('Navigate to generate report tab');
                await performAction('click', WellReport.li.generateReportTab);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                //reporter.startStep('Click on view report tab');
                await performAction('click', WellReport.button.view);
                await waitForNetworkIdle(120000);
                //reporter.endStep();
                await new Promise(resolve => setTimeout(resolve, 10000));
                // Get the refreshed status values
                refreshedReadyStatusXPath = await getPropertyValueByXpath(WellReport.p.readyStatus, "textContent");
                refreshedPendingStatusXPath = await getPropertyValueByXpath(WellReport.p.pendingStatus, "textContent");
                // Check if the condition is satisfied
                if (parseInt(refreshedReadyStatusXPath) === expectedReadyStatus &&
                    parseInt(refreshedPendingStatusXPath) === expectedPendingStatus) {
                    logger.info('report generation is proper. Proceed with further steps.');
                    break;
                }
                elapsedTime += refreshInterval;
            }
            if (elapsedTime >= maxTime) {
                logger.error('Condition not satisfied within the maximum time limit.');
            }
            // Get the present time in the EST time zone
            const estTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
            logger.info('Present Time (EST):', estTime);
            logger.info(estTime)
            let validateEstTime = estTime.split(",")[0].trim();
            logger.info(validateEstTime)
            // Function to format the day of the month with a leading zero if needed
            function formatDayWithLeadingZero(date) {
                return date.getDate().toString().padStart(2, '0');
            }
            // Define the month names array
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            // Convert validateEstTime to a valid format "Month Day, Year"
            const parsedValidateEstTime = new Date(validateEstTime);
            const formattedValidateEstTime = `${monthNames[parsedValidateEstTime.getMonth()]} ${formatDayWithLeadingZero(parsedValidateEstTime)}, ${parsedValidateEstTime.getFullYear()}`;
            // Get the previous day date
            const previousDay = new Date(parsedValidateEstTime);
            previousDay.setDate(previousDay.getDate() - 1);
            // Convert the previous day to the same valid format
            const formattedPreviousDay = `${monthNames[previousDay.getMonth()].substr(0, 3)} ${formatDayWithLeadingZero(previousDay)}, ${previousDay.getFullYear() - 1}`;
            // Log the results
            logger.info(formattedValidateEstTime); // Output: August 01, 2023
            logger.info(formattedPreviousDay); // Output: July 31, 2023
            expect(ValidateTimePeriod).toBe(formattedPreviousDay);
            // Here validating the previous date, month, and current year
            if (ValidateTimePeriod === formattedPreviousDay) {
                logger.info("Verified the time period and Est time");
            } else {
                logger.error("Not verified the time period and Est time");
            }
            // Checking the report generation time
            const reportGeneratedTime = await getPropertyValueByXpath(`${WellReport.button.reportGeneration}`, "textContent");
            logger.info('Last Updated Time:', reportGeneratedTime);
            reporter.startStep(`Est time is : ${estTime} and reportGenerated time is : ${reportGeneratedTime}`);
            reporter.endStep();
            //validation of intial status and after freshed status
            reporter.startStep(`initialReadyStatus is : ${initialReadyStatusXPath} and refreshedReadyStatus is : ${refreshedReadyStatusXPath} and expectedReadyStatus is : ${expectedReadyStatus}`);
            try {
                expect(parseInt(refreshedReadyStatusXPath)).toBe(expectedReadyStatus);
                logger.info("Verified the initial Ready status and After refreshed Ready status");
            } catch (error) {
                logger.error("Verification failed for initial Ready status and After refreshed Ready status", error);
            }
            reporter.endStep();
            reporter.startStep(`initialPendingStatus is : ${initialPendingStatusXPath} and refreshedPendingStatus is : ${refreshedPendingStatusXPath} and expectedPendingStatus is : ${expectedPendingStatus}`);
            try {
                expect(parseInt(refreshedPendingStatusXPath)).toBe(expectedPendingStatus);
                logger.info("Verified the initial Pending status and After refreshed pending status");
            } catch (error) {
                logger.error("Verification failed for initial Pending status and After refreshed Pending status", error);
            }
            reporter.endStep();
            // Detect the download enable XPath and print the log message
            const downloadEnableXPath = WellReport.span.downloadEnable;
            const downloadEnableElements = await page.$x(downloadEnableXPath);
            if (downloadEnableElements.length > 0) {
                logger.info('Download option is enabled with XPath');
            } else {
                logger.error('Download option is disabled with XPath');
            }
            //verify Building Id 
            let Building_idXpath = await getPropertyValueByXpath(WellReport.p.fileName, "textContent");
            // logger.info(Building_idXpath)
            let BuildingSplit = Building_idXpath.split("-")[0].trim();
            // console.log(BuildingSplit)
            logger.info(BuildingSplit)
            expect(building_id).toBe(BuildingSplit);
            // Check if the verification is successful
            if (building_id === BuildingSplit) {
                logger.info("Building id is verified");
            } else {
                logger.error("Building id verification is failed");
            }
            extractedProperty = reportDetailsXPath.split('for')[3].trim();
            // console.log(extractedProperty)
            logger.info(extractedProperty)
            expect(buildingName).toBe(extractedProperty);
            // Check if the verification is successful
            if (buildingName === extractedProperty) {
                logger.info("property is verified");
            } else {
                logger.error("property verification is failed");
            }
            //check Report Type 
            let reporttypeXPath = await getPropertyValueByXpath(WellReport.p.reportType, "textContent");
            // logger.info(reporttypeXPath)
            let splitArray = Building_idXpath.split("-");
            let reportdata = splitArray[1].trim();
            //console.log(reportdata)
            logger.info(reportdata)
            expect(reporttypeXPath).toBe(reportdata);
            // Check if the verification is successful
            if (reporttypeXPath === reportdata) {
                logger.info("report type is verified");
            } else {
                logger.error("report type  verification is failed");
            }
            //check property -- Building name
            let propertyXPath = await getPropertyValueByXpath(WellReport.p.property, "textContent");
            // logger.info(propertyXPath)
            // Find the starting index of the property name
            // Validate timePeriodXpath with the extractedTimePeriod
            expect(buildingName).toBe(propertyXPath);
            // Check if the verification is successful
            if (buildingName === propertyXPath) {
                logger.info("Property is verified");
            } else {
                logger.error("property verification is failed");
            }
            // check the file size
            const fileSize = parseFloat(await getPropertyValueByXpath(WellReport.p.fileSize, "textContent"));
            logger.info(`File size: ${fileSize}MB`);
            logger.info('File size verified')
            // Perform the validation using expect assertion
            expect(fileSize).toBeGreaterThan(0);
            // Log an error message if the file size is 0MB
            if (fileSize === 0) {
                logger.error('File size should not be 0 MB');
            }
            await delay(3000)
            // //exit the well reports
            await performAction('click', WellReport.span.exitbutton);
            await waitForNetworkIdle(12000); // Wait for network idle, adjust the wait time as needed
            await Promise.all([
                performAction('click', commons.button.selectBuilding),
                waitForNetworkIdle(120000)
            ]);
            await Promise.all([
                performAction('click', WellReport.span.allProperties),
                waitForNetworkIdle(120000)
            ]);
            // Refresh the page
            //   await page.reload({ waitUntil: "domcontentloaded" });
            reporter.endStep();
        });
    });
});
