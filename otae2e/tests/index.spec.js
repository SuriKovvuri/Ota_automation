const measureAndReport = require(`./utils/performanceTracker`).measureAndReport;
const reporter = require(`./utils/reporter`);
import { getEnvConfig } from '../../utils/utils';

const thresholds = { // define thresholds measures
    HEAP : 10000,
    DOM_ELEMENT : 20,
    DURATION : 1000 / 1000,
    TOTALLOADDURATION : 20,
    TOTALOTHERDURATION : 10
};

function console1 (s1) {
    var now = new Date();
    // convert date to a string in UTC timezone format:
    console.log(now.toUTCString()+s1);
}

describe(`Performance test for adminlogin`, () => {
    //let page, lastMeasure, currentMeasure;
    let lastMeasure, currentMeasure;
    let lastUserMeasure, currentUserMeasure;
    let lastUserNextMeasure, currentUserNextMeasure;
    let lastDeviceMeasure, currentDeviceMeasure;
    let lastDeviceNextMeasure, currentDeviceNextMeasure;
    let lastGroupMeasure, currentGroupMeasure;
    let lastGroupNextMeasure, currentGroupNextMeasure;
    let lastAuditMeasure, currentAuditMeasure;
    let lastAuditNextMeasure, currentAuditNextMeasure;
    let lastOrgMeasure, currentOrgMeasure;
    let lastOrgNextMeasure, currentOrgNextMeasure;
    let lastProfileMeasure, currentProfileMeasure;

    // navigate to the page and wait until you see the menu button.
    beforeAll(async () => { // before every test, open new tab and navigate to google. 
        //page = await global.__BROWSER__.newPage();
        var config = await getEnvConfig()
        await page.goto(config.otaURL)
        await reporter.createTable();
        jest.setTimeout(60000)
    });

    test('Login as admin land in dashboard and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastMeasure = await reporter.getLastMeasures(`adminlogin`);
        const error_xpath_selector = '//span[@class="kc-feedback-text"]';
        const errorclose_xpath_selector = '//span[@class="kc-feedback-text"]';
        const cluster_xpath_selector = '//span[@class="clusteringColorLegend"]';
        const userguide_xpath_selector = '//div[@class="userGuide"]';
        const logoutuserprofile_xpath_selector = '//svg[@type="user-circle"]'

        
        const button = await page.waitForSelector('#kc-login', {visible: true});//i am feeling lucky
        const googlebutton = await page.waitForSelector('#zocial-Google', {visible: true});//i am feeling lucky
        //const error = await page.waitForXPath(xpath_selector, {visible: true});//i am feeling lucky
        //logger.info("env = "+env)
        var config = await getEnvConfig()
        await expect(page).toFill('#username', config.otaAdmin)
        await expect(page).toFill('#password', config.otaAdminPassword)
        

        // wrap the test and take measures.
        console1(" Starting to login");
        currentMeasure = await measureAndReport(page, `adminlogin`, async () => {
            await button.click({delay: 50}); // click on the menu button.
            
            // wait until menu is visible.
            await page.waitForXPath(userguide_xpath_selector, {visible: false});//Wait for map to display
            //used for incorrect login
            //const errorclose = await page.waitForXPath(errorclose_xpath_selector, {visible: true});//login error
            //await errorclose.click({delay: 50}); // click on the menu button.
            //const errorclose = await page.waitForXPath(errorclose_xpath_selector, {visible: false});//login error

            await page.waitForXPath(userguide_xpath_selector, {visible: true});//Map is displayed
            await page.waitForNavigation({
                waitUntil: 'networkidle0',
              });
              console1(" Dashboard loaded");
        });

        
        
        
    });

    // verify that new HEAP measure is not above the preivous HEAP measure (with threshold). 
    test(`should verify Memory (thresholds = ${thresholds.HEAP})`, async () => {
        expect(currentMeasure.JSHeapUsedSize).toBeLessThanOrEqual(lastMeasure.JSHeapUsedSize + thresholds.HEAP);;
        console1(" Heap checked");
    });

    // verify that new DOM_ELEMENT measure is not above the preivous DOM_ELEMENT measure (with threshold). 
    test(`should verify DOM elements count (thresholds = ${thresholds.DOM_ELEMENT})`, async () => {
        expect(currentMeasure.Nodes).toBeLessThanOrEqual(lastMeasure.Nodes + thresholds.DOM_ELEMENT);
        console1(" DOM checked");
    });

    // verify that new DURATION measure is not above the preivous DURATION measure (with threshold). 
    test(`should verify DOM DURATION count (thresholds = ${thresholds.DURATION})`, async () => {
        expect(currentMeasure.Timestamp).toBeLessThanOrEqual(lastMeasure.Timestamp + thresholds.DURATION);
        console1(" Timestamp checked");
    });


    // verify that page loads within thresholds.TOTALLOADDURATION. 
    test(`should verify Page loaded in less than ${thresholds.TOTALLOADDURATION} sec`, async () => {
        expect(currentMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALLOADDURATION);
        console1(" Timestamp checked");
    });

    test('Logged in as admin Navigate to Userlisting and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastUserMeasure = await reporter.getLastMeasures(`userlistingfirst`);
        const leftmenu_xpath_selector = '//aside';
        //"//input[@id[contains(.,'register')]]"
        const leftmenu_userlisting_xpath_selector = "//aside//a[@href[contains(.,'userdashboard')]]";
        
        //const userHeader_xpath_selector = "//div[@class='orgdashboard']//span[@class='headerTitleText']";
        const usermenu = await page.waitForXPath(leftmenu_userlisting_xpath_selector, {visible: true}); 
        
        //user icon in left menu


        // wrap the test and take measures.
        console1(" Starting to Navigate to userlisting");
        currentUserMeasure = await measureAndReport(page, `userlistingfirst`, async () => {
            await usermenu.click({delay: 50}); // click on the menu button.
            
            // wait until Page is listed and Users header visible is visible.
            //await page.waitForXPath(userHeader_xpath_selector, {visible: true});//Users in header
            //const userheader = page.$x(userHeader_xpath_selector);
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Users')]", { visible: true, timeout: 30000})
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Full Name')]", { visible: true, timeout: 30000})
            await expect(page).toMatchElement('span', { text: 'Users' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" User listing loaded");
        });
    });

    // verify that user listing loads within thresholds.TOTALOTHERDURATION. 
    test(`should verify User Page loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentUserMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" User page Timestamp checked");
    });

    test('Logged in as admin Navigate to Userlisting and next page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        await page.waitFor(5000);
        lastUserNextMeasure = await reporter.getLastMeasures(`userlistingnext`);
        //"//aside//a[@href[contains(.,'userdashboard')]]";
        const userpage_next_xpath_selector = "//div[@class='orgdashboard']//div[@class='userDetails']//li[@title[contains(.,'Next Page')]]";
        const prevpage_next_xpath_selector = "//div[@class='orgdashboard']//div[@class='userDetails']//li[@title[contains(.,'Previous Page')]]";
        //Check we are in users list page
        await expect(page).toMatchElement('span', { text: 'Users' })
        // wrap the test and take measures.
        console1(" FIRST Starting to Navigate to userlisting next page");
        const usernext = await page.waitForXPath(userpage_next_xpath_selector, {visible: true}); 
        console1(" Printinf usernext attributes", usernext.toString());
        console1(" Starting to Navigate to userlisting next page");
        currentUserNextMeasure = await measureAndReport(page, `userlistingnext`, async () => {
            await usernext.click({delay: 50}); // click on the next button.
            console1(" Clicked Next button");
            // wait until Page is listed and Users header and table with full name visible is visible.
            
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Full Name')]", { visible: false, timeout: 30000})
            console1(" First Name Disappeared");
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Full Name')]", { visible: true, timeout: 30000})
            await page.$x(prevpage_next_xpath_selector, { visible: true, timeout: 30000})
            console1(" First Name Appeared");
            await expect(page).toMatchElement('span', { text: 'Users' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" User listing next loaded");
        });
    });

    // verify that user listing next loads within thresholds.TOTALOTHERDURATION. 
    test(`should verify User Page NEXT loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentUserNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" User page next Timestamp checked");
    });



    test('Logged in as admin Navigate to Devicelisting and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastDeviceMeasure = await reporter.getLastMeasures(`devicelistingfirst`);
        const leftmenu_xpath_selector = '//aside';
        //"//input[@id[contains(.,'register')]]"
        const leftmenu_devicelisting_xpath_selector = "//aside//a[@href[contains(.,'devicedashboard')]]";
        
        //const userHeader_xpath_selector = "//div[@class='orgdashboard']//span[@class='headerTitleText']";
        const devicemenu = await page.waitForXPath(leftmenu_devicelisting_xpath_selector, {visible: true}); 
        
        //user icon in left menu


        // wrap the test and take measures.
        console1(" Starting to Navigate to devicelisting");
        currentDeviceMeasure = await measureAndReport(page, `devicelistingfirst`, async () => {
            await devicemenu.click({delay: 50}); // click on the menu button.
            
            // wait until Page is listed and Users header visible is visible.
            //await page.waitForXPath(userHeader_xpath_selector, {visible: true});//Users in header
            //const userheader = page.$x(userHeader_xpath_selector);
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Device Endpoints')]", { visible: true, timeout: 30000})
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Device Name')]", { visible: true, timeout: 30000})
            await expect(page).toMatchElement('span', { text: 'Device Endpoints' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" Device listing loaded");
        });
    });

    test(`should verify Device Page loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentDeviceMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" User page Timestamp checked");
    });


    test('Logged in as admin Navigate to Devicelisting and next page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        await page.waitFor(5000);
        lastDeviceNextMeasure = await reporter.getLastMeasures(`devicelistingnext`);
        //"//aside//a[@href[contains(.,'userdashboard')]]";
        const devicepage_next_xpath_selector = "//div[@class='orgdashboard']//div[@class='userDetails']//li[@title[contains(.,'Next Page')]]";
        const prevpage_next_xpath_selector = "//div[@class='orgdashboard']//div[@class='userDetails']//li[@title[contains(.,'Previous Page')]]";
        //Check we are in users list page
        await expect(page).toMatchElement('span', { text: 'Device Endpoints' })
        // wrap the test and take measures.
        console1(" FIRST Starting to Navigate to devicelisting next page");
        const devicenext = await page.waitForXPath(devicepage_next_xpath_selector, {visible: true}); 
        console1(" Printinf usernext attributes", devicenext.toString());
        console1(" Starting to Navigate to devicelisting next page");
        currentDeviceNextMeasure = await measureAndReport(page, `devicelistingnext`, async () => {
            await devicenext.click({delay: 50}); // click on the next button.
            console1(" Clicked Next button");
            // wait until Page is listed and Users header and table with full name visible is visible.
            
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Device Name')]", { visible: false, timeout: 30000})
            console1(" Device Name Disappeared");
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Device Name')]", { visible: true, timeout: 30000})
            await page.$x(prevpage_next_xpath_selector, { visible: true, timeout: 30000})
            console1(" Device Name Appeared");
            await expect(page).toMatchElement('span', { text: 'Device Endpoints' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" Device listing next loaded");
        });
    });

    // verify that user listing next loads within thresholds.TOTALOTHERDURATION. 
    test(`should verify Device Page NEXT loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentDeviceNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" Device page next Timestamp checked");
    });





    test('Logged in as admin Navigate to Grouplisting and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastGroupMeasure = await reporter.getLastMeasures(`grouplistingfirst`);
        const leftmenu_xpath_selector = '//aside';
        //"//input[@id[contains(.,'register')]]"
        const leftmenu_grouplisting_xpath_selector = "//aside//a[@href[contains(.,'groupdashboard')]]";
        
        //const userHeader_xpath_selector = "//div[@class='orgdashboard']//span[@class='headerTitleText']";
        const groupmenu = await page.waitForXPath(leftmenu_grouplisting_xpath_selector, {visible: true}); 
        
        //user icon in left menu


        // wrap the test and take measures.
        console1(" Starting to Navigate to grouplisting");
        currentGroupMeasure = await measureAndReport(page, `grouplistingfirst`, async () => {
            await groupmenu.click({delay: 50}); // click on the menu button.
            
            // wait until Page is listed and Users header visible is visible.
            //await page.waitForXPath(userHeader_xpath_selector, {visible: true});//Users in header
            //const userheader = page.$x(userHeader_xpath_selector);
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Groups')]", { visible: true, timeout: 30000})
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Name')]", { visible: true, timeout: 30000})
            await expect(page).toMatchElement('span', { text: 'Groups' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" Group listing loaded");
        });
    });

    test(`should verify Group Page loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentGroupMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" Group page Timestamp checked");
    });


    test('Logged in as admin Navigate to Grouplisting and next page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        await page.waitFor(5000);
        lastGroupNextMeasure = await reporter.getLastMeasures(`grouplistingnext`);
        //"//aside//a[@href[contains(.,'userdashboard')]]";
        const grouppage_next_xpath_selector = "//div[@class='orgdashboard']//div[@class='userGroupDetails']//li[@title[contains(.,'Next Page')]]";
        const prevpage_next_xpath_selector = "//div[@class='orgdashboard']//div[@class='userGroupDetails']//li[@title[contains(.,'Previous Page')]]";
        //Check we are in users list page
        await expect(page).toMatchElement('span', { text: 'Groups' })
        // wrap the test and take measures.
        console1(" FIRST Starting to Navigate to devicelisting next page");
        const groupnext = await page.waitForXPath(grouppage_next_xpath_selector, {visible: true}); 
        console1(" Printinf usernext attributes", groupnext.toString());
        console1(" Starting to Navigate to devicelisting next page");
        currentGroupNextMeasure = await measureAndReport(page, `grouplistingnext`, async () => {
            await groupnext.click({delay: 50}); // click on the next button.
            console1(" Clicked Next button");
            // wait until Page is listed and Users header and table with full name visible is visible.
            
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Name')]", { visible: false, timeout: 30000})
            console1(" Group Name Disappeared");
            await page.$x("//div[@class='orgdashboard']//span[contains(@text, 'Name')]", { visible: true, timeout: 30000})
            await page.$x(prevpage_next_xpath_selector, { visible: true, timeout: 30000})
            console1(" Group Name Appeared");
            await expect(page).toMatchElement('span', { text: 'Groups' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" Groups listing next loaded");
        });
    });

    // verify that user listing next loads within thresholds.TOTALOTHERDURATION. 
    test(`should verify Group Page NEXT loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentGroupNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" Group page next Timestamp checked");
    });




    test('Logged in as admin Navigate to Audit Page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastAuditMeasure = await reporter.getLastMeasures(`auditlistingfirst`);
        const leftmenu_xpath_selector = '//aside';
        //"//input[@id[contains(.,'register')]]"
        const leftmenu_auditlisting_xpath_selector = "//aside//a[@href[contains(.,'auditdashboard')]]";
        
        //const userHeader_xpath_selector = "//div[@class='orgdashboard']//span[@class='headerTitleText']";
        const auditmenu = await page.waitForXPath(leftmenu_auditlisting_xpath_selector, {visible: true}); 
        
        //user icon in left menu


        // wrap the test and take measures.
        console1(" Starting to Navigate to Audit Page");
        currentAuditMeasure = await measureAndReport(page, `auditlistingfirst`, async () => {
            await auditmenu.click({delay: 50}); // click on the menu button.
            
            // wait until Page is listed and Users header visible is visible.
            //await page.waitForXPath(userHeader_xpath_selector, {visible: true});//Users in header
            //const userheader = page.$x(userHeader_xpath_selector);
            await page.$x("//div[@class='auditdashboard']//li[@title[contains(.,'Next Page')]]", { visible: true, timeout: 30000})
            await expect(page).toMatchElement('span, [class="rv-discrete-color-legend-item__title"]', { text: 'Total Logins' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" Audit listing loaded");
        });
    });

    test(`should verify Audit Page loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentAuditMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" Audit page Timestamp checked");
    });


    test('Logged in as admin Navigate to Auditlisting and next page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        await page.waitFor(5000);
        lastAuditNextMeasure = await reporter.getLastMeasures(`auditlistingnext`);
        //"//aside//a[@href[contains(.,'userdashboard')]]";
        const auditpage_next_xpath_selector = "//div[@class='auditdashboard']//li[@title[contains(.,'Next Page')]]";
        const prevpage_next_xpath_selector = "//div[@class='auditdashboard']//li[@title[contains(.,'Previous Page')]]";
        //Check we are in users list page
        await expect(page).toMatchElement('span, [class="rv-discrete-color-legend-item__title"]', { text: 'Total Logins' })
        // wrap the test and take measures.
        console1(" FIRST Starting to Navigate to auditlisting next page");
        const auditnext = await page.waitForXPath(auditpage_next_xpath_selector, {visible: true}); 
        console1(" Printinf usernext attributes", auditnext.toString());
        console1(" Starting to Navigate the auditlisting next page");
        currentAuditNextMeasure = await measureAndReport(page, `auditlistingnext`, async () => {
            await auditnext.click({delay: 50}); // click on the next button.
            console1(" Clicked Next button");
            // wait until Page is listed and Users header and table with full name visible is visible.
            await expect(page).toMatchElement('span, [class="rv-discrete-color-legend-item__title"]', { text: 'Total Logins' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" Audit listing next loaded");
        });
    });

    // verify that user listing next loads within thresholds.TOTALOTHERDURATION. 
    test(`should verify Audit Page NEXT loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentAuditNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" Audit page next Timestamp checked");
    });







    test('Logged in as admin Navigate to Org Page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastOrgMeasure = await reporter.getLastMeasures(`orglistingfirst`);
        const leftmenu_xpath_selector = '//aside';
        //"//input[@id[contains(.,'register')]]"
        const leftmenu_orglisting_xpath_selector = "//aside//a[@href[contains(.,'orginfo')]]";
        
        //const userHeader_xpath_selector = "//div[@class='orgdashboard']//span[@class='headerTitleText']";
        const orgmenu = await page.waitForXPath(leftmenu_orglisting_xpath_selector, {visible: true}); 
        
        //user icon in left menu


        // wrap the test and take measures.
        console1(" Starting to Navigate to Org Page");
        currentOrgMeasure = await measureAndReport(page, `orglistingfirst`, async () => {
            await orgmenu.click({delay: 50}); // click on the menu button.
            
            // wait until Page is listed and Users header visible is visible.
            //await page.waitForXPath(userHeader_xpath_selector, {visible: true});//Users in header
            //const userheader = page.$x(userHeader_xpath_selector);
            await page.$x('div[class="otacardtitle profilePageDeviceHeading"]', { text: 'Auth Domain' }, { visible: true, timeout: 30000})
            await expect(page).toMatchElement('div[class="userNameValue"]', { text: 'Org Policy' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" Org Page loaded");
        });
    });

    test(`should verify Org Page loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentOrgMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" Org page Timestamp checked");
    });


    test('Logged in as admin Navigate to Org and next page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        await page.waitFor(5000);
        lastOrgNextMeasure = await reporter.getLastMeasures(`orglistingnext`);
        //"//aside//a[@href[contains(.,'userdashboard')]]";
        const orgpage_next_xpath_selector = "//div[@class='landingpagedetails']//li[@title[contains(.,'Next Page')]]";
        const prevpage_next_xpath_selector = "//div[@class='landingpagedetails']//li[@title[contains(.,'Previous Page')]]";
        //Check we are in users list page
        await expect(page).toMatchElement('div[class="userNameValue"]', { text: 'Org Policy' })
        // wrap the test and take measures.
        console1(" FIRST Starting to Navigate to orglisting next page");
        const orgnext = await page.waitForXPath(orgpage_next_xpath_selector, {visible: true}); 
        console1(" Printinf usernext attributes", orgnext.toString());
        console1(" Starting to Navigate the orglisting next page");
        currentOrgNextMeasure = await measureAndReport(page, `orglistingnext`, async () => {
            await orgnext.click({delay: 50}); // click on the next button.
            console1(" Clicked Next button");
            // wait until Page is listed and Users header and table with full name visible is visible.
            await expect(page).toMatchElement('div[class="userNameValue"]', { text: 'Org Policy' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" Auth domain listing next loaded");
        });
    });

    // verify that user listing next loads within thresholds.TOTALOTHERDURATION. 
    test(`should verify Org Page NEXT loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentOrgNextMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" Org page next Timestamp checked");
    });



    test('Logged in as admin Navigate to Profile Page and collect measures', async () => {
        // get last adminlogin measures from the DB.
        lastProfileMeasure = await reporter.getLastMeasures(`profilelistingfirst`);
        const leftmenu_xpath_selector = '//aside';
        //"//input[@id[contains(.,'register')]]"
        const leftmenu_profilelisting_xpath_selector = "//a[@href[contains(.,'userprofilepage')]]";
        
        //const userHeader_xpath_selector = "//div[@class='orgdashboard']//span[@class='headerTitleText']";
        const profilemenu = await page.waitForXPath(leftmenu_profilelisting_xpath_selector, {visible: true}); 
        
        //user icon in left menu


        // wrap the test and take measures.
        console1(" Starting to Navigate to Profile Page");
        currentProfileMeasure = await measureAndReport(page, `profilelistingfirst`, async () => {
            await profilemenu.click({delay: 50}); // click on the menu button.
            
            // wait until Page is listed and Users header visible is visible.
            //await page.waitForXPath(userHeader_xpath_selector, {visible: true});//Users in header
            //const userheader = page.$x(userHeader_xpath_selector);
            await page.$x('span', { text: 'User Activity' }, { visible: true, timeout: 30000})
            await expect(page).toMatchElement('span', { text: 'User Activity' })
            //await page.waitForNavigation({
            //    waitUntil: 'networkidle0',
            //  });
              console1(" Profile Page loaded");
        });
    });

    test(`should verify Profile Page loaded in less than ${thresholds.TOTALOTHERDURATION} sec`, async () => {
        expect(currentProfileMeasure.Timestamp).toBeLessThanOrEqual(thresholds.TOTALOTHERDURATION);
        console1(" Profile page Timestamp checked");
    });



    test(`should logout`, async () => {
        console1(" Logging out");
        const userguide_xpath_selector = '//div[@class="userGuide"]';
        const logoutuserprofile_xpath_selector = '//*[@type="user-circle"]'
        const logoutrow_xpath_selector = '//div[@class="ant-row"]'
        const logoutrowcol_xpath_selector = '//div[@class="ant-col ant-col-6"]'
        await page.waitForXPath(userguide_xpath_selector, {visible: true});//Map is displayed
        const guide  = await page.$x(userguide_xpath_selector);
        console1("guide length="+guide.length);
        /*
        const guide1  = await guide[0].$x(logoutrow_xpath_selector);
        console.log(guide1.length);
        const guide2  = await guide1[1].$x(logoutrowcol_xpath_selector);
        console.log(guide2.length);
        const check1 = await guide[0].$x(logoutuserprofile_xpath_selector); 
        console.log(check1.length);
        await check1[0].click({delay: 50}); // click on the menu button
        await page.waitFor(1000);
        //await expect(userguide_xpath_selector).toClick('svg[type="UserCircle"]') ? true : false;
        await expect(page).toClick('span', { text: 'Logout' })
        */
       //directly call logout
       await page.goto(`https://manage.qa2ot.smartsentry.io/logout`);
       await page.waitFor(1000);
       console1(" Logged out");
    });
});