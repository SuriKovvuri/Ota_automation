import { defineFeature, loadFeature } from 'jest-cucumber';
import { verifyLoadingSpinner, createPDF, customScreenshot, delay, getEnvConfig, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, screenshot, capturePageScreenshot, waitForNetworkIdle, expectToClick, goTo, } from '../../utils/utils';
import { thenDeleteUser, whenEnableMfaforuser, thenILoginwithEmail, whenDeleteUser, whenEnableuserstatus, whenDisableuserstatus, whenResetMfaforuser, thenChangeUserGroup, whenResetUserPassword, whenDisableMfaforuser, whenChangeUserGroup, thenResetUserPasswordwithwrongcnfpwd, thenLoginwithwrongpassword, thenResetUserPassword, thenDisableMfaforuser, whenOptionallevelorgMfa, whenEnablelevelorgMfa, thenLoginandsetupMFA, thenOptionalorgMfa, thenemailverify, thenEnableMfaforuser, thenGetUsername, thenDisableorgMfa, thenEnableorgMfa, whenIAddUser, thenLoginwithnewUserMFA, thenLoginwithnewUserMFAdisabled, confirmpsw_error, email_error, firstname_error, lastname_error, phone_error, gotoAddUser, password_error, thenCheckUser, whenIEditUser, givenAdminLoggedIn, whenIEnableScheduleAccessUser, whenCheckSceduleaccessEnableUI, whenISearchuserGetEnabled, andILogoutAdminUserAndLoginSAUser, thenVerifyHttpsDeviceAccess, whenIEnableScheduleAccessUserWeeklyOnce, whenICheckWeeklySceduleaccessEnableUI, whenISearchWeeklyScheduleUserGetEnabled, andILogoutAdminUserAndLoginweeklySAUser, thenVerifyHttpsDeviceAccessWeeklySA, whenIEnableScheduleAccessUserWeeklyTwice, whenICheckWeeklyTwiceSceduleaccessEnableUI, whenISearchWeeklyTwiceScheduleUserGetEnabled, andILogoutAdminUserAndLoginweeklyTwiceSAUser, thenVerifyHttpsDeviceAccessWeeklyTwiceSA, andVerifySAConfigAppliedAsconfigured, whenIEnableScheduleAccessUserWeeklyAllDays, whenICheckWeeklyAllDaysSceduleaccessEnableUI, whenISearchWeeklyAllDaysScheduleUserGetEnabled, andIVerifyWeeklyAllDaysSAConfigAsConfigured, andILogoutAdminUserAndLoginWeeklyAllDaysSAUser, thenVerifyHttpsDeviceAccessWeeklyAllDaysSA, andIVerifyWeeklyOnceSAConfigAsConfigured, andIVerifyWeeklyTwiceSAConfigAsConfigured, whenIEnableScheduleAccessUserMonthlyOnce, andIVerifyMonthlyOnceSAConfigAsConfigured, whenICheckMonthlyOnceSceduleaccessEnableUI, whenISearchMonthlyOnceScheduleUserGetEnabled, andILogoutAdminUserAndLoginMonthlyOnceSAUser, thenVerifyHttpsDeviceAccessMonthlyOnceSA, whenIEnableScheduleAccessUserOnTheWeekDay, andIVerifyMonthlyOnWeekDaySAConfigAsConfigured, whenICheckMonthlyOnWeekDaySceduleaccessEnableUI, whenISearchMonthlyOnWeekDayScheduleUserGetEnabled, andILogoutAdminUserAndLoginMonthlyOnWeekDaySAUser, thenVerifyHttpsDeviceAccessMonthlyOnWeekDaySA, andIDisableTheScheduleAccess } from '../helper/otauser';
import { logger } from '../log.setup';
import { Login, Logout, Launch, login } from '../helper/otalogin';
import { add_auth_domain_page, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage, deviceprofilepage, adddevice, addendpoint, addgroup, adduser, user_role_association, device_role_association, user_detail, device_detail, group_detail, endpoint_review, user_search, device_search, group_search, accesslist, schedule_access, otalogin } from '../constants/locators';
import { givenIamLoggedIn, givenIamLoggedInas } from './otashared-steps';
import { start } from 'repl';

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

const feature = loadFeature('./otae2e/features/otascheduleaccess.feature',
    {
        errors: {
            missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
            missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
            missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
            missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
        },

    });

defineFeature(feature, test => {

    afterEach(async () => {
        logger.info("After Each ");
        await customScreenshot('afterEach.png')
    })

    beforeEach(async () => {
        logger.info("Before Each ");
    })

    afterAll(async () => {
        try {
            await logger.info('After ALL')
            try {
                const elemExists = await page.$('svg[type="Users"]');
                if (elemExists) {
                    await expect(elemExists).toBeTruthy();
                    await page.waitForSelector('svg[type="UserCircle"]');
                    await page.click('svg[class="anticon valign-sub"]');
                    await page.waitForTimeout(10000);
                    await page.click('svg[type="user-circle"]');

                    // Wait for the logout link to appear
                    await page.waitForSelector('a[href*="logout"]');

                    // Click on the logout link
                    await page.click('a[href*="logout"]');

                    // Optional: Wait for the logout process to complete
                    // await page.waitForNavigation();

                    await page.waitForTimeout(20000);
                }
            } catch (err) {
                logger.info("Ignorable exception, possibly have already logged out");
                logger.info(err)
            }
            //Make a PDF of the tests by merging all screenshots into the pdf
            //await createPDF(global.testStart, 'otauinavigationvalidation')
            await har.stop();
            logger.info('Ending After all')
        }
        catch (err) {
            logger.error(err);
        }


    })
    beforeAll(async () => {
        try {
            logger.info('Before all')
            //await delay(120000)

            // jest.setTimeout(300000)
            await page.setDefaultNavigationTimeout(120000);
            // await page.waitFor(5000);

            let login
            login = new Login();
            logger.info("global.env = " + global.env)
            await login.launch(global.env, "orgAdmin")
            reporter = global.reporter
            await har.start({ path: './reports/otauinavigationvalidation' + global.testStart + '.har', saveResponse: true });
        }
        catch (err) {
            logger.error(err);
        }
    })



    test('Enable the schedule access', ({
        given,
        when,
        and,
        then
    }) => {
        let schedule_access_xpath;
        givenAdminLoggedIn(given)
        whenIEnableScheduleAccessUser(when)
        whenCheckSceduleaccessEnableUI(when)
        whenISearchuserGetEnabled(when)
        andVerifySAConfigAppliedAsconfigured(and)
        andILogoutAdminUserAndLoginSAUser(and)
        thenVerifyHttpsDeviceAccess(then)
        andIDisableTheScheduleAccess(and)
    });

    test('Enable the schedule access weeklyOnce', ({
        given,
        when,
        and,
        then
    }) => {
        givenAdminLoggedIn(given)
        whenIEnableScheduleAccessUser(when)
        whenICheckWeeklySceduleaccessEnableUI(when)
        whenISearchWeeklyScheduleUserGetEnabled(when)
        andIVerifyWeeklyOnceSAConfigAsConfigured(and)
        andILogoutAdminUserAndLoginweeklySAUser(and)
        thenVerifyHttpsDeviceAccessWeeklySA(then)
        andIDisableTheScheduleAccess(and)
    })

    test('Enable the schedule access Weeklytwice', ({
        given,
        when,
        and,
        then
    }) => {
        givenAdminLoggedIn(given)
        whenIEnableScheduleAccessUser(when)
        whenICheckWeeklyTwiceSceduleaccessEnableUI(when)
        whenISearchWeeklyTwiceScheduleUserGetEnabled(when)
        andIVerifyWeeklyTwiceSAConfigAsConfigured(and)
        andILogoutAdminUserAndLoginweeklyTwiceSAUser(and)
        thenVerifyHttpsDeviceAccessWeeklyTwiceSA(then)
        andIDisableTheScheduleAccess(and)
    })

    test('Enable the schedule access WeeklyAllDays', ({
        given,
        when,
        and,
        then
    }) => {
        givenAdminLoggedIn(given)
        whenIEnableScheduleAccessUser(when)
        whenICheckWeeklyAllDaysSceduleaccessEnableUI(when)
        whenISearchWeeklyAllDaysScheduleUserGetEnabled(when)
        andIVerifyWeeklyAllDaysSAConfigAsConfigured(and)
        andILogoutAdminUserAndLoginWeeklyAllDaysSAUser(and)
        thenVerifyHttpsDeviceAccessWeeklyAllDaysSA(then)
        andIDisableTheScheduleAccess(and)
    })

    test('Enable the schedule access MonthlyOnce', ({
        given,
        when,
        and,
        then
    }) => {
        givenAdminLoggedIn(given)
        whenIEnableScheduleAccessUser(when)
        whenICheckMonthlyOnceSceduleaccessEnableUI(when)
        whenISearchMonthlyOnceScheduleUserGetEnabled(when)
        andIVerifyMonthlyOnceSAConfigAsConfigured(and)
        andILogoutAdminUserAndLoginMonthlyOnceSAUser(and)
        thenVerifyHttpsDeviceAccessMonthlyOnceSA(then)
        andIDisableTheScheduleAccess(and)
    })

    test('Enable the schedule access on the week and day', ({
        given,
        when,
        and,
        then
    }) => {
        givenAdminLoggedIn(given)
        whenIEnableScheduleAccessUser(when)
        whenICheckMonthlyOnWeekDaySceduleaccessEnableUI(when)
        whenISearchMonthlyOnWeekDayScheduleUserGetEnabled(when)
        andIVerifyMonthlyOnWeekDaySAConfigAsConfigured(and)
        andILogoutAdminUserAndLoginMonthlyOnWeekDaySAUser(and)
        thenVerifyHttpsDeviceAccessMonthlyOnWeekDaySA(then)
        andIDisableTheScheduleAccess(and)
    })
})

