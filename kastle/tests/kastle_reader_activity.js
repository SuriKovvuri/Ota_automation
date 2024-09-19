import { delay, getEnvConfig, performAction, getElementHandleByXpath } from '../../utils/utils';
import { logger } from '../log.setup';
import { login, reports } from '../constants/locators'

const puppeteer = require('puppeteer');
let browser, page, config;

console.log("test")
function console1(s1) {
    var now = new Date();
    // convert date to a string in UTC timezone format:
    logger.info(now.toUTCString() + s1);
}

describe(`Scrape kastle data`, () => {

    // navigate to the page and wait until you see the menu button.
    beforeAll(async () => { // before every test, open new tab and navigate to google. 
        try {
            //await reporter.createTable();
            jest.setTimeout(120000)
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


            await page.goto(config.URL)
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

    test('Mail Reader activity', async () => {
        // get last adminlogin measures from the DB.
        let action;

        //username & password
        await page.waitForXPath(login.input.email)
        action = await performAction("type", login.input.email, page, config.username)
        expect(action).toBeTruthy()

        action = await performAction("click", login.input.next, page)
        expect(action).toBeTruthy()

        await page.waitForXPath(login.input.password)
        action = await performAction("type", login.input.password, page, config.password)
        expect(action).toBeTruthy()

        action = await performAction("click", login.input.login, page)
        expect(action).toBeTruthy()        
        console1("Logged in");
        await delay(3000)

        await page.waitForXPath(reports.a.goto_reports_link)
        action = await performAction("click", reports.a.goto_reports_link, page)
        expect(action).toBeTruthy()
        await delay(3000)


        await page.waitForXPath(reports.a.reader_activity_report_yesterday)
        action = await performAction("click", reports.a.reader_activity_report_yesterday, page)
        expect(action).toBeTruthy()  
        const finalResponse = await page.waitForResponse(response =>
            response.url().endsWith("GetReportResults")
            && (response.status() === 200
                && response.request().method() === 'POST')
            , 120);//wait for 15 sec
        if (finalResponse == null) {
            await expect(false).toBe(true);//fail the test
        }
        await delay(3000)


        action = await performAction("click", reports.a.mail, page)
        expect(action).toBeTruthy()
        action = await performAction("type", reports.input.email, page, config.report_mail, true)
        expect(action).toBeTruthy()
        await delay(3000)

        action = await performAction("click", reports.input.send, page)
        expect(action).toBeTruthy()
        await delay(3000)

    });

});
