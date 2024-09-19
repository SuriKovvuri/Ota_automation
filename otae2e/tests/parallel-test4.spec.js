const measureAndReport = require(`./utils/performanceTracker`).measureAndReport;
const reporter = require(`./utils/reporter`);
import { delay, getEnvConfig, performAction, getElementHandleByXpath } from '../../utils/utils';
import { logger } from '../log.setup';
import { auditlist, accesslist, dashboard, leftpane, orgpage, otalogin } from '../constants/locators';
import { retryReportData } from './utils/performanceTracker';

const puppeteer = require('puppeteer');
let browser, page, config;

const thresholds = { // define thresholds measures
    HEAP: 10000000, //10Mb
    DOM_ELEMENT: 1000,//1000 count
    DURATION: 10000 / 1000,
    TOTALLOADDURATION: 30
};

function console1(s1) {
    var now = new Date();
    // convert date to a string in UTC timezone format:
    logger.info(now.toUTCString() + s1);
}

describe(`Performance test for Parallel 4 adminlogin4`, () => {
    let lastMeasure, currentMeasure;
    let lastUserMeasure, currentUserMeasure;
    let lastUserNextMeasure, currentUserNextMeasure;
    let lastDeviceMeasure, currentDeviceMeasure;
    let lastDeviceNextMeasure, currentDeviceNextMeasure;
    let lastGroupMeasure, currentGroupMeasure;
    let lastGroupNextMeasure, currentGroupNextMeasure;
    let lastAuditMeasure, currentAuditMeasure;
    let lastAuditNextMeasure, currentAuditNextMeasure;
    let lastAccessMeasure, currentAccessMeasure;
    let lastAccessNextMeasure, currentAccessNextMeasure;
    let lastOrgMeasure, currentOrgMeasure;
    let lastOrgNextMeasure, currentOrgNextMeasure;
    let lastProfileMeasure, currentProfileMeasure;

    // navigate to the page and wait until you see the menu button.
    beforeAll(async () => { // before every test, open new tab and navigate to google. 
        try {
            await reporter.createTable();
            jest.setTimeout(60000)
            browser = await puppeteer.launch({
                dumpio: true,
                userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/79.0.3945.117 Chrome/79.0.3945.117 Safari/537.36',

                headless: true,
                ignoreHTTPSErrors: true,
                defaultViewport: {
                    //laptop - 1366 x 768
                    //large monitor - 1920 x 1200
                    width: 1366,
                    height: 768
                },
                args: [
                    '--start-maximized',
                    "--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox', '--disable-gpu'
                ]
            }); //spinning up new browser instance
            page = await browser.newPage()
            config = await getEnvConfig()
            global.orchIP = config.otaIP
            global.homeurl = config.otaURL

            await page.goto(config.otaURL)
        } catch (err) {
            logger.info(err);
        }
    });
    afterAll(async () => {
        try {
            console1('After ALL')
            await browser.close();
        } catch (err) {
            logger.info(err);
        }
    });

    test('Login as admin land in dashboard and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastMeasure = await reporter.getLastMeasures(`adminloginparallel4`);
        let action;

        //username & password
        action = await performAction("type", otalogin.details.username, page, config.otaAdmin)
        expect(action).toBeTruthy()
        action = await performAction("type", otalogin.details.password, page, config.otaAdminPassword)
        expect(action).toBeTruthy()

        // wrap the test and take measures.
        console1(" Starting to login");
        currentMeasure = await measureAndReport(page, `adminloginparallel4`, async () => {
            action = await performAction("click", otalogin.details.login_button, page)
            expect(action).toBeTruthy()
            await page.waitForXPath(dashboard.canvas.map)
            await page.waitForXPath(dashboard.small.totalActivity)
        })

        currentMeasure = await retryReportData(currentMeasure,'SQLITE_BUSY: database is locked')

    });

    // verify that new HEAP measure is greater than zero. 
    test(`should verify Memory ( > 0)`, async () => {
        expect(currentMeasure.JSHeapUsedSize).toBeGreaterThan(0)
        console1(" Heap checked");
    });

    // verify that new DOM_ELEMENT measure is greater than zero. 
    test(`should verify DOM elements count ( > 0)`, async () => {
        expect(currentMeasure.Nodes).toBeGreaterThan(0)
        console1(" DOM checked");
    });

    // verify that new DURATION measure is greater than zero. 
    test(`should verify DOM DURATION count ( > 0})`, async () => {
        expect(currentMeasure.Timestamp).toBeGreaterThan(0)
        console1(" DOM Timestamp checked");
    });

    // verify that page loads within thresholds.TOTALLOADDURATION. 
    test(`should verify Page loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Timestamp checked");
    });

    test('Logged in as admin Navigate to Userlisting and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastUserMeasure = await reporter.getLastMeasures(`userlistingfirstparallel4`);
        const leftmenu_userlisting_xpath_selector = "//aside//a[@href[contains(.,'userdashboard')]]";
        const usermenu = await page.waitForXPath(leftmenu_userlisting_xpath_selector, { visible: true });

        // wrap the test and take measures.
        console1(" Starting to Navigate to userlisting");
        currentUserMeasure = await measureAndReport(page, `userlistingfirstparallel4`, async () => {
            await usermenu.click({ delay: 50 }); // click on the menu button.
            console1("Clicked")
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Users')]", { visible: true, timeout: 30000 })
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Full Name')]", { visible: true, timeout: 30000 })
            await expect(page).toMatchElement('span', { text: 'Users' })
            console1(" User listing loaded");
        });
        currentUserMeasure = await retryReportData(currentUserMeasure,'SQLITE_BUSY: database is locked')

    });

    // verify that user listing loads within thresholds.TOTALLOADDURATION. 
    test(`should verify User Page loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentUserMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" User page Timestamp checked");
    });

    test('Logged in as admin Navigate to Userlisting and next page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastUserNextMeasure = await reporter.getLastMeasures(`userlistingnextparallel4`);
        const userpage_next_xpath_selector = "//div[@class='orgdashboard']//div[contains(@class,'userDetails')]//li[@title[contains(.,'Next Page')]]";
        const prevpage_next_xpath_selector = "//div[@class='orgdashboard']//div[contains(@class,'userDetails')]//li[@title[contains(.,'Previous Page')]]";
        //Check we are in users list page
        await expect(page).toMatchElement('span', { text: 'Users' })
        // wrap the test and take measures.
        console1(" FIRST Starting to Navigate to userlisting next page");
        const usernext = await page.waitForXPath(userpage_next_xpath_selector, { visible: true });
        console1(" Printinf usernext attributes", usernext.toString());
        console1(" Starting to Navigate to userlisting next page");
        currentUserNextMeasure = await measureAndReport(page, `userlistingnextparallel4`, async () => {
            await usernext.click({ delay: 50 }); // click on the next button.
            console1(" Clicked Next button");
            console1("Clicked")
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }

            // wait until Page is listed and Users header and table with full name visible is visible.
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Full Name')]", { visible: false, timeout: 30000 })
            console1(" First Name Disappeared");
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Full Name')]", { visible: true, timeout: 30000 })
            await page.$x(prevpage_next_xpath_selector, { visible: true, timeout: 30000 })
            console1(" First Name Appeared");
            await expect(page).toMatchElement('span', { text: 'Users' })
            console1(" User listing next loaded");
        });
        currentUserNextMeasure = await retryReportData(currentUserNextMeasure,'SQLITE_BUSY: database is locked')

    });

    // verify that user listing next loads within thresholds.TOTALLOADDURATION. 
    test(`should verify User Page NEXT loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentUserNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" User page next Timestamp checked");
    });

    test('Logged in as admin Navigate to Devicelisting and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastDeviceMeasure = await reporter.getLastMeasures(`devicelistingfirstparallel4`);
        const leftmenu_devicelisting_xpath_selector = "//aside//a[@href[contains(.,'devicedashboard')]]";
        const devicemenu = await page.waitForXPath(leftmenu_devicelisting_xpath_selector, { visible: true });

        // wrap the test and take measures.
        console1(" Starting to Navigate to devicelisting");
        currentDeviceMeasure = await measureAndReport(page, `devicelistingfirstparallel4`, async () => {
            await devicemenu.click({ delay: 50 }); // click on the menu button.
            console1("Clicked")
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Device Endpoints')]", { visible: true, timeout: 30000 })
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Device Name')]", { visible: true, timeout: 30000 })
            await expect(page).toMatchElement('span', { text: 'Device Endpoints' })
            console1(" Device listing loaded");
        });
        currentDeviceMeasure = await retryReportData(currentDeviceMeasure,'SQLITE_BUSY: database is locked')
    });

    test(`should verify Device Page loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentDeviceMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" User page Timestamp checked");
    });

    test('Logged in as admin Navigate to Devicelisting and next page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastDeviceNextMeasure = await reporter.getLastMeasures(`devicelistingnextparallel4`);
        const devicepage_next_xpath_selector = "//div[@class='orgdashboard']//div[contains(@class,'userDetails')]//li[@title[contains(.,'Next Page')]]";
        const prevpage_next_xpath_selector = "//div[@class='orgdashboard']//div[contains(@class,'userDetails')]//li[@title[contains(.,'Previous Page')]]";
        //Check we are in device list page
        await expect(page).toMatchElement('span', { text: 'Device Endpoints' })
        // wrap the test and take measures.
        console1(" FIRST Starting to Navigate to devicelisting next page");
        const devicenext = await page.waitForXPath(devicepage_next_xpath_selector, { visible: true });
        console1(" Printinf usernext attributes", devicenext.toString());
        console1(" Starting to Navigate to devicelisting next page");
        currentDeviceNextMeasure = await measureAndReport(page, `devicelistingnextparallel4`, async () => {
            await devicenext.click({ delay: 50 }); // click on the next button.
            console1(" Clicked Next button");

            // wait until Page is listed and devices header and table with full name visible is visible.
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Device Name')]", { visible: false, timeout: 30000 })
            console1(" Device Name Disappeared");
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Device Name')]", { visible: true, timeout: 30000 })
            await page.$x(prevpage_next_xpath_selector, { visible: true, timeout: 30000 })
            console1(" Device Name Appeared");
            await expect(page).toMatchElement('span', { text: 'Device Endpoints' })
            console1(" Device listing next loaded");
        });
        currentDeviceNextMeasure = await retryReportData(currentDeviceNextMeasure,'SQLITE_BUSY: database is locked')

    });

    // verify that device listing next loads within thresholds.TOTALLOADDURATION. 
    test(`should verify Device Page NEXT loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentDeviceNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Device page next Timestamp checked");
    });

    test('Logged in as admin Navigate to Grouplisting and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastGroupMeasure = await reporter.getLastMeasures(`grouplistingfirstparallel4`);
        const leftmenu_grouplisting_xpath_selector = "//aside//a[@href[contains(.,'groupdashboard')]]";
        const groupmenu = await page.waitForXPath(leftmenu_grouplisting_xpath_selector, { visible: true });

        // wrap the test and take measures.
        console1(" Starting to Navigate to grouplisting");
        currentGroupMeasure = await measureAndReport(page, `grouplistingfirstparallel4`, async () => {
            await groupmenu.click({ delay: 50 }); // click on the menu button.
            console1("Clicked")
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }

            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Groups')]", { visible: true, timeout: 30000 })
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Name')]", { visible: true, timeout: 30000 })
            await expect(page).toMatchElement('span', { text: 'Groups' })
            console1(" Group listing loaded");
        });
        currentGroupMeasure = await retryReportData(currentGroupMeasure,'SQLITE_BUSY: database is locked')

    });

    test(`should verify Group Page loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentGroupMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Group page Timestamp checked");
    });

    test('Logged in as admin Navigate to Grouplisting and next page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastGroupNextMeasure = await reporter.getLastMeasures(`grouplistingnextparallel4`);
        const grouppage_next_xpath_selector = "//div[@class='orgdashboard']//div[contains(@class,'userGroupDetails')]//li[@title[contains(.,'Next Page')]]";
        const prevpage_next_xpath_selector = "//div[@class='orgdashboard']//div[contains(@class,'userGroupDetails')]//li[@title[contains(.,'Previous Page')]]";
        //Check we are in group list page
        await expect(page).toMatchElement('span', { text: 'Groups' })
        // wrap the test and take measures.
        const groupnext = await page.waitForXPath(grouppage_next_xpath_selector, { visible: true });
        console1("Starting to Navigate to grouplisting next page");
        currentGroupNextMeasure = await measureAndReport(page, `grouplistingnextparallel4`, async () => {
            await groupnext.click({ delay: 50 }); // click on the next button.
            console1(" Clicked Next button");
            console1("Clicked")
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }
            
            // wait until Page is listed and Users header and table with full name visible is visible.
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Name')]", { visible: false, timeout: 30000 })
            console1(" Group Name Disappeared");
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Name')]", { visible: true, timeout: 30000 })
            await page.$x(prevpage_next_xpath_selector, { visible: true, timeout: 30000 })
            console1(" Group Name Appeared");
            await expect(page).toMatchElement('span', { text: 'Groups' })
            console1(" Groups listing next loaded");
        });
        currentGroupNextMeasure = await retryReportData(currentGroupNextMeasure,'SQLITE_BUSY: database is locked')

    });

    // verify that group listing next loads within thresholds.TOTALLOADDURATION. 
    test(`should verify Group Page NEXT loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentGroupNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Group page next Timestamp checked");
    });

    test('Logged in as admin Navigate to Audit Page and collect measures', async () => {
        let action, handle;

        // get last adminlogin measures from the DB.
        lastAuditMeasure = await reporter.getLastMeasures(`auditlistingfirstparallel4`);
        //account book icon in left menu
        action = await performAction("click", leftpane.span.accountBook, page)
        expect(action).toBeTruthy()
        await delay(1000) //Not working without this delay

        // wrap the test and take measures.
        console1(" Starting to Navigate to Audit Page");
        currentAuditMeasure = await measureAndReport(page, `auditlistingfirstparallel4`, async () => {
            action = await performAction("click", leftpane.a.auditdashboard, page)
            expect(action).toBeTruthy()
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }

            // wait until Page is listed and Users header visible is visible.
            handle = await getElementHandleByXpath(auditlist.user_activity_table.timestamp_name_sort_up, page)
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            console1(" Audit listing loaded");
        });
        currentAuditMeasure = await retryReportData(currentAuditMeasure,'SQLITE_BUSY: database is locked')

    });

    test(`should verify Audit Page loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentAuditMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Audit page Timestamp checked");
    });


    test('Logged in as admin Navigate to Auditlisting and next page and collect measures', async () => {
        let handle, action;
        // get last adminlogin measures from the DB.
        lastAuditNextMeasure = await reporter.getLastMeasures(`auditlistingnextparallel4`);

        handle = await getElementHandleByXpath(auditlist.user_activity_table.next, page)
        expect(handle).toBeTruthy()
        console1("Starting to Navigate the auditlisting next page");
        // wrap the test and take measures.
        currentAuditNextMeasure = await measureAndReport(page, `auditlistingnextparallel4`, async () => {
            action = await performAction("click", auditlist.user_activity_table.next, page)
            expect(action).toBeTruthy()
            console1("Clicked Next button");

            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }

            // wait until Page is listed and audit header and table with full name visible is visible.
            handle = await getElementHandleByXpath(auditlist.user_activity_table.timestamp_name_sort_up, page)
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            console1(" Audit listing next loaded");
        });
        currentAuditNextMeasure = await retryReportData(currentAuditNextMeasure,'SQLITE_BUSY: database is locked')

    });

    // verify that audit listing next loads within thresholds.TOTALLOADDURATION. 
    test(`should verify Audit Page NEXT loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentAuditNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Audit page next Timestamp checked");
    });

    test('Logged in as admin Navigate to AccessPage and collect measures', async () => {
        let action, handle;

        // get last adminlogin measures from the DB.
        lastAccessMeasure = await reporter.getLastMeasures(`accesslistingfirstparallel4`);
        //account book icon in left menu
        action = await performAction("click", leftpane.span.accountBook, page)
        expect(action).toBeTruthy()
        await delay(1000) //Not working without this delay

        // wrap the test and take measures.
        console1(" Starting to Navigate to AccessPage");
        currentAccessMeasure = await measureAndReport(page, `accesslistingfirstparallel4`, async () => {
            action = await performAction("click", leftpane.a.accessdashboard, page)
            expect(action).toBeTruthy()
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }

            // wait until Page is listed and Users header visible is visible.
            handle = await getElementHandleByXpath(accesslist.user_activity_table.session_time_sort_down, page)
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            console1(" Accesslisting loaded");
        });
        currentAccessMeasure = await retryReportData(currentAccessMeasure,'SQLITE_BUSY: database is locked')

    });

    test(`should verify AccessPage loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentAccessMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Accesspage Timestamp checked");
    });


    test('Logged in as admin Navigate to Accesslisting and next page and collect measures', async () => {
        let handle, action;
        // get last adminlogin measures from the DB.
        lastAccessNextMeasure = await reporter.getLastMeasures(`accesslistingnextparallel4`);

        handle = await getElementHandleByXpath(accesslist.user_activity_table.next, page)
        expect(handle).toBeTruthy()
        console1("Starting to Navigate the accesslisting next page");
        // wrap the test and take measures.
        currentAccessNextMeasure = await measureAndReport(page, `accesslistingnextparallel4`, async () => {
            action = await performAction("click", accesslist.user_activity_table.next, page)
            expect(action).toBeTruthy()
            console1("Clicked Next button");

            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }

            // wait until Page is listed and access header and table with full name visible is visible.
            handle = await getElementHandleByXpath(accesslist.user_activity_table.session_time_sort_down, page)
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            console1(" Accesslisting next loaded");
        });
        currentAccessNextMeasure = await retryReportData(currentAccessNextMeasure,'SQLITE_BUSY: database is locked')

    });

    // verify that access listing next loads within thresholds.TOTALLOADDURATION. 
    test(`should verify AccessPage NEXT loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentAccessNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Accesspage next Timestamp checked");
    });

    test('Logged in as admin Navigate to Org Page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastOrgMeasure = await reporter.getLastMeasures(`orglistingfirstparallel4`);
        const leftmenu_orglisting_xpath_selector = "//aside//a[@href[contains(.,'orginfo')]]";
        const orgmenu = await page.waitForXPath(leftmenu_orglisting_xpath_selector, { visible: true });

        // wrap the test and take measures.
        console1(" Starting to Navigate to Org Page");
        currentOrgMeasure = await measureAndReport(page, `orglistingfirstparallel4`, async () => {
            await orgmenu.click({ delay: 50 }); // click on the menu button.
            console1("Clicked")
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }

            // wait until Page is listed and Users header visible is visible.
            await page.$x('div[class="otacardtitle profilePageDeviceHeading"]', { text: 'Auth Domain' }, { visible: true, timeout: 30000 })
            await expect(page).toMatchElement('div[class="userNameValue"]', { text: 'Org Policy' })
            console1(" Org Page loaded");
        });
        currentOrgMeasure = await retryReportData(currentOrgMeasure,'SQLITE_BUSY: database is locked')

    });

    test(`should verify Org Page loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentOrgMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Org page Timestamp checked");
    });


    test('Logged in as admin Navigate to Org and next page and collect measures', async () => {
        let handle;
        // get last adminlogin measures from the DB.
        lastOrgNextMeasure = await reporter.getLastMeasures(`orglistingnextparallel4`);
        handle = await getElementHandleByXpath(orgpage.li.next_page_auth_domain, page)
        expect(handle).toBeTruthy()
        console1(" Starting to Navigate the orglisting next page");
        // wrap the test and take measures.
        currentOrgNextMeasure = await measureAndReport(page, `orglistingnextparallel4`, async () => {
            //OTQA- ISSUE JAWAHAR Ticket to be created
            /*
            action = await performAction("click", orgpage.li.next_page_auth_domain, page)
            expect(action).toBeTruthy()
            console1(" Clicked Next button");
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                    if (arr.length == 0) 
                    {
                        console1("Console disappeared")
                        break;
                    }
            }
            */
            handle = await getElementHandleByXpath(orgpage.auth_domain_table.display_name, page)
            logger.info(handle.length)
            expect(handle).toBeTruthy()
            console1(" Auth domain listing next loaded");
        });
        currentOrgNextMeasure = await retryReportData(currentOrgNextMeasure,'SQLITE_BUSY: database is locked')

    });

    // verify that org listing next loads within thresholds.TOTALLOADDURATION. 
    test(`should verify Org Page NEXT loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentOrgNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Org page next Timestamp checked");
    });

    test('Logged in as admin Navigate to Profile Page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastProfileMeasure = await reporter.getLastMeasures(`profilelistingfirstparallel4`);
        const leftmenu_profilelisting_xpath_selector = "//a[@href[contains(.,'userprofilepage')]]";
        const profilemenu = await page.waitForXPath(leftmenu_profilelisting_xpath_selector, { visible: true });

        // wrap the test and take measures.
        console1(" Starting to Navigate to Profile Page");
        currentProfileMeasure = await measureAndReport(page, `profilelistingfirstparallel4`, async () => {
            await profilemenu.click({ delay: 50 }); // click on the menu button.
            console1("Clicked")
            await page.waitForSelector("span.iotium-spin-loading-icon");
            console1("Spinner appeared")
            while (true) {
                let arr = await page.$$("span.iotium-spin-loading-icon");
                if (arr.length == 0) {
                    console1("Spinner disappeared")
                    break;
                }
            }

            // wait until Page is listed and Users header visible is visible.
            await page.$x('span', { text: 'User Activity' }, { visible: true, timeout: 30000 })
            await expect(page).toMatchElement('span', { text: 'User Activity' })
            console1(" Profile Page loaded");
        });
        currentProfileMeasure = await retryReportData(currentProfileMeasure,'SQLITE_BUSY: database is locked')

    });

    test(`should verify Profile Page loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentProfileMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Profile page Timestamp checked");
    });

    test(`should logout`, async () => {
        console1(" Logging out");
        const userguide_xpath_selector = '//div[@class="userGuide"]';
        await page.waitForXPath(userguide_xpath_selector, { visible: true });
        const guide = await page.$x(userguide_xpath_selector);
        console1("guide length=" + guide.length);
        //directly call logout
        await page.goto(global.homeurl+`/logout`);
        await page.waitFor(1000);
        console1(" Logged out");
    });
});
