import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage } from '../helper/alert';
import { Login } from '../helper/login';
import { addTanNetwork, expandAllTabsInNetworkPage, getCountOfNetworks, goAllNetworks, goToNetwork } from '../helper/networks';
import { connectOS, OSAction } from '../helper/node';
import { addService, serviceStatus } from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { NetworkAdd } from '../src/networkAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getEnvConfig, getNodeHSN, getNotification, closeModal } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis } from './shared-steps';
import { logger } from '../log.setup';


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);

let OStoken, db

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/status.feature',
  {
    errors: {
      missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
      missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
      missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
      missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
    }
    //tagFilter: '@status',
  });

let reporter;
defineFeature(feature, test => {

  afterEach(async () => {
    //await page.waitForNavigation()
    //perf
    await closeModal()
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    logger.info("After Each ");
    logger.info(performanceTiming);
    //perf
    //jest.setTimeout(60000)

    await page.goto(global.homeurl + '/home')
    await delay(5000)
    await customScreenshot('afterEach.png', 1920, 1200)
  })

  beforeEach(async () => {
    //await page.waitForNavigation()
    //perf

    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    logger.info("Before Each ");
    logger.info(performanceTiming);
    //perf
    jest.setTimeout(180000)


  })

  afterAll(async () => {
    try {
      logger.info('After ALL')
      const elemXPath = "//button[contains(@title, 'My Account')]"
      const elemExists = await page.waitForXPath(elemXPath, { timeout: 30000 }) ? true : false;
      expect(elemExists).toBe(true)
      await expect(page).toClick('button[title="My Account"]')
      await page.waitFor(1000)
      await expect(page).toClick('span', { text: 'Logout' })
      await page.waitFor(2000)
      //perf
      logger.info(await testIotium(page));
      await customScreenshot('loggedout.png', 1920, 1200)
      //perf
      //await checkConsoleErrors();
      //Make a PDF of the tests by merging all screenshots into the pdf
      await createPDF(global.testStart, 'status')

      if (global.env != 'staging') {
        await closemongoDB()
      }

      //Retrive the coverage objects
      //This is for stopping JS and CSS usages
      const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
      ]);


      //Stop perf tracing
      await page.tracing.stop();
      //trying HAR
      await har.stop();

    }
    catch (err) {
      logger.info("Exception caught in After ALL", err);
    }

  })

  beforeAll(async () => {

    try {
      //page.waitForNavigation()
      jest.setTimeout(120000)
      page.setDefaultNavigationTimeout(120000);

      reporter = global.reporter
      //await page.waitFor(5000);
      //moving the login from setup to each test
      let login
      login = new Login();
      logger.info("global.env = " + global.env)
      await login.launch(global.env, global.scope)
      //moving the login from setup to each test
      //logger.info("00"+Date.now())
      await delay(5000);
      //logger.info("FF"+Date.now())
      /*
      await (page
        .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
        .then(() => logger.info('Waiting In before ALL berfore proceeding')))
      */
      await page.$x("//button[contains(@title, 'My Account')]", { visible: true, timeout: 30 })


      await customScreenshot('beforeAll.png', 1920, 1200)

      //This is for openstack

      if (global.env != 'staging') {
        OStoken = await connectOS()
        db = await connectmongoDB()
      }

      //This is for recording JS and CSS usages
      await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
      ]);

      //performance tracing
      await page.tracing.start({ path: './reports/status' + global.testStart + '_tracing.json' });
      //trying HAR

      await har.start({ path: './reports/status' + global.testStart + '.har', saveResponse: true });


    }
    catch (err) {
      logger.info("Exception caught in Before ALL", err);
    }
  })

  test('Check status of an Alive node', ({
    given,
    when,
    and,
    then,

  }) => {
    logger.info(
      "Starting execution"
    )

    /* reporter
         .description("This test checks the status of the Node and expects it to be Alive")
         .severity(Severity.Critical)
         .feature("Feature.Betting")
         .story("BOND-007");  */


    givenIamLoggedIn(given)
    whenOrgis(when)
    andWhenNodeIs(and)
    then(/^Status should be "(.*?)"$/, async (status) => {

      logger.info('node status is ' + status);
      //await page.setViewport({ width: 1920, height: 1200});
      //await page.screenshot({path: 'test.png', fullPage: true})
      //await customScreenshot('test.png', 1920, 1200)
      //const screenshot = await page.screenshot({path: 'test2.png', fullPage: true})
      let screenshot = await customScreenshot('test2.png', 1920, 1200)
      //await page.setViewport({ width: 1920, height: 900});
      //await page.screenshot({path: 'test3.png', fullPage: true})
      //await customScreenshot('test3.png')
      reporter.startStep("Then Status should be " + status);
      reporter.startStep("Take a screenshot of node page");

      reporter.addAttachment("Home Page", screenshot, "image/png");

      logger.info('Allure snapshot created');
      reporter.endStep()

      reporter.startStep("Verify Node status is " + status);
      await expect(page).toMatchElement('span, [class="ant-tag"]', { text: status })
      const nodeStatus = await page.$('span.ant-tag', { text: status, visible: true }) //await findBySelector(page, 'span.ant-tag.tag-iotium-sucess', status) //
      await nodeStatus.click()
      await delay(1000)
      screenshot = await customScreenshot('nodeStatus.png', 1920, 1200)
      reporter.addAttachment("Node Status", screenshot, "image/png");
      logger.info('Verified Node status is ', status);
      reporter.endStep()

      reporter.endStep()


    });
  });
  test('Check status of a Connected Tunnel', ({
    given,
    when,
    and,
    then
  }) => {

    givenIamLoggedIn(given)
    whenOrgis(when)
    andWhenNodeIs(and)
    andWhenNetworkIs(and)
    then(/^Status should be "(.*?)"$/, async (status) => {

      logger.info('tunnelstatus is' + status);
      await customScreenshot('NetworkPage.png', 1920, 1200)
      await expandAllTabsInNetworkPage()
      await customScreenshot('ExpandedNetworkPage.png', 1920, 1200)
      reporter.startStep("Verify Tunnel status is ", status);
      const check = await expect(page).toMatchElement('span, [class="ant-tag"]', { text: status })
      expect(check).not.toBeNull();
      //const networkStatus = await findBySelector(page, 'span.ant-tag.tag-iotium-sucess', status) //await page.$('span.ant-tag', { text: status, visible: true }) 
      const networkStatus = await findBySelector(page, 'span.ant-tag', status)
      await networkStatus.click()
      await delay(1000)
      let screenshot = await customScreenshot('networkStatus.png', 1920, 1200)
      reporter.addAttachment("Network Status", screenshot, "image/png");
      logger.info('Verified Tunnel status is ', status);
      reporter.endStep()
    });
  });

  test('Check status of a Service', ({
    given,
    when,
    and,
    then
  }) => {

    var serviceHandle

    givenIamLoggedIn(given)
    whenOrgis(when)
    andWhenNodeIs(and)

    andWhenServiceIs(and, function (returnValue) {
      serviceHandle = returnValue
    })



    then(/^Status should be "(.*?)"$/, async (status) => {

      logger.info('Service status is' + status);
      //await serviceHandle.focus()
      await customScreenshot('ServicePage.png', 1920, 1200)
      reporter.startStep("Verify Service status is ", status);
      await expect(page).toMatchElement('span, [class="ant-tag"]', { text: status })
      //const serviceStatus = await findBySelector(getServiceHandle(), 'span.ant-tag', status) //await page.$('span.ant-tag', { text: status, visible: true }) 
      const serviceStatus = await findBySelector(serviceHandle, 'span.ant-tag', status) //await page.$('span.ant-tag', { text: status, visible: true }) 
      await serviceStatus.click()
      await delay(1000)
      let screenshot = await customScreenshot('serviceStatus.png', 1920, 1200)
      reporter.addAttachment("Service Status", screenshot, "image/png");
      logger.info('Verified Service status is ', status);
      reporter.endStep()

    });

  });


  test('Trigger a tech-dump', ({
    given,
    when,
    and,
    then
  }) => {

    var request_id
    givenIamLoggedIn(given)
    whenOrgis(when)
    andWhenNodeIs(and)

    and(/^Trigger techdump$/, async () => {
      logger.info('Triggering a tech-dump');
      await expect(page).toMatchElement('span', { text: 'Send Diagnostic Data' })
      reporter.startStep("Triggering the techDump");

      await expect(page).toClick('span', { text: 'Send Diagnostic Data' })

      await delay(2000)
      var header = 'Send Diagnostic Data'
      var text = "Please confirm you would like to collect and send your iNode's diagnostic data to the ioTium Support team."
      var text2 = "The diagnostic data will contain details such as logs, configuration, resource utilization, etc. and allow us to troubleshoot issues with the iNode."
      await expect(page).toMatch(header)
      await expect(page).toMatch(text)
      await expect(page).toMatch(text2)
      await expect(page).toMatchElement('div.ant-modal-footer span', { text: 'Cancel' })
      await expect(page).toMatchElement('div.ant-modal-footer span', { text: 'Send' })
      //Hitting send button
      await expect(page).toClick('div.ant-modal-footer span', { text: 'Send' })

      /* const finalResponse = await page.on('response', async (response) => 
       {
        if (response.url().endsWith("techdump") &&  response.request().method() === 'POST') {
          logger.info("response code: ", response.status());
          logger.info("response text: ", await response.text());
          logger.info("response json: ",await  response.json());
          requestID = response.json().request_id
          // do something here
          return response
        }
      }); */
      const finalResponse = await page.waitForResponse(response =>
        response.url().endsWith("techdump")
        && (response.request().method() === 'PATCH'
          || response.request().method() === 'POST'), 11);//in 11 seconds
      let responseJson = await finalResponse.json();
      logger.info('Log Triggering a tech-dump responseJson=', responseJson);
      logger.info('Log Triggering a tech-dump responseJson=', responseJson.request_id);
      request_id = responseJson.request_id
      await delay(2000)

      //Check for sending and Abort
      await expect(page).toMatchElement('span', { text: 'Sending...' })
      await expect(page).toMatchElement('span', { text: 'Abort' })
      let screenshot = await customScreenshot('techdumpInitiated.png', 1920, 1200)
      reporter.addAttachment("Techdump request_" + request_id, screenshot, "image/png");
      reporter.endStep()
    });



    then(/^Techdump should be available$/, async () => {

      logger.info('Waiting for the techdump download');
      await delay(90000)
      //Month Date Year
      const layout = await page.$x('.//div[contains(@class, "ant-col card-grid ant-col-xs-5 ant-col-sm-5 ant-col-md-6 ant-col-lg-7 ant-col-xl-8")]')
      //const layout = await page.$$('.ant-col card-grid ant-col-xs-5 ant-col-sm-5 ant-col-md-6 ant-col-lg-7 ant-col-xl-8')
      //logger.info('check 1', layout.length)
      const cardBodys = await layout[0].$x('.//div[contains(@class, "ant-card ant-card-bordered")]')
      //logger.info('check 2', cardBodys.length)
      const body = await cardBodys[1].$$('div.ant-card-body')
      //logger.info('check 3', body.length)
      const firstRow = await body[0].$$('tr.ant-table-row-level-0')
      //logger.info('check 4', firstRow.length)
      const col = await firstRow[0].$$('td.ant-table-row-cell-break-word')
      await col[0].hover()
      await delay(1000)
      'div.ant-popover-inner-content p'
      await expect(page).toMatchElement('div.ant-popover-inner-content p', { text: request_id })
      reporter.startStep("Verify Techdump is available for requestID " + request_id);
      let screenshot = await customScreenshot('techdumpAvailable.png', 1920, 1200)
      reporter.addAttachment("techdump Available_" + request_id, screenshot, "image/png");
      logger.info('Verify Techdump is available');
      reporter.endStep()

    });

  });

  test('Add a Custom Service', ({
    given,
    when,
    and,
    then
  }) => {
    var serviceHandle
    var name
    var networkName

    givenIamLoggedIn(given)
    whenOrgis(when)
    andWhenNodeIs(and)
    and(/^Network is "(.*?)"$/, async (networkname) => {
      if (networkname == 'node1_tan1') {
        var config = await getEnvConfig()
        logger.info("config.node1_tan1 = " + config.node1_tan1)
        networkname = config.node1_tan1
      }
      networkName = networkname
    })

    and(/^Add custom Service "(.*?)"$/, async (serviceName) => {
      logger.info("Starting to add a service")
      await addService(serviceName,'Custom',networkName, {'fileName':'custom.json'})
      name = serviceName

    });

    thenServiceShouldBeAdded(then, function (returnValue) {
      serviceHandle = returnValue
      logger.info("ServiceHandle thenServiceShouldBeAdded = ", serviceHandle)
    });

    and(/^Status should be "(.*?)"$/, async (status) => {
      await serviceStatus(name, status)

    });

  });

  test('Add A TAN Network', ({
    given,
    when,
    and,
    then
  }) => {


    givenIamLoggedIn(given)
    whenOrgis(when)
    andWhenNodeIs(and)

    and(/^Add A TAN Network$/, async (table) => {
      logger.info("Starting to add a TAN Network")
      var network
      table.forEach(row => {
        network = new NetworkAdd()
        network.setNetworkAdd(row.NetworkName, row.Label, row.Nw_Addressing, row.CIDR, row.Start_IP, row.end_IP,
          row.GW, row.VLAN, row.VLAN_ID, row.Default_Destination)
      })
      await addTanNetwork(network)

    });

    then(/^Network should be Added "(.*?)"$/, async (networkname) => {

      logger.info('Then Network Should be Added ' + networkname);
      reporter.startStep("Verifying Network is " + networkname);
      var exist = await goToNetwork(networkname)
      expect(exist).not.toBeNull
      let screenshot = await customScreenshot('networkCreated.png', 1920, 1200)
      reporter.addAttachment("Network created_" + networkname, screenshot, "image/png");
      reporter.endStep();


    });

  });

  test('Test PDF Generations', ({
    given,
    when,
    and,
    then
  }) => {


    givenIamLoggedIn(given)
    whenOrgis(when)

    and(/^I navigate$/, async () => {
      logger.info("PDF")
      await page.goto('https://192.170.200.8/orgs/100a1f67-36ca-4a12-8abf-e7859ee3e677/users')
      await delay(5000)
      let screenshot = await customScreenshot('user1.png', 1920, 1200)
      reporter.addAttachment("navigate1", screenshot, "image/png");
      await page.goto('https://192.170.200.8/orgs/100a1f67-36ca-4a12-8abf-e7859ee3e677/orgs')
      await delay(5000)
      screenshot = await customScreenshot('orgs1.png', 1920, 1200)
      reporter.addAttachment("navigate2", screenshot, "image/png");

      await page.goto('https://192.170.200.8/orgs/100a1f67-36ca-4a12-8abf-e7859ee3e677/inodes')
      await delay(5000)
      screenshot = await customScreenshot('home1.png', 1920, 1200)
      reporter.addAttachment("navigate3", screenshot, "image/png");





    });

    then(/^PDF is created$/, async () => {
      logger.info("created to PDF Generations")

    });
  });

  test('Add user Alert subscriptions', ({
    given,
    when,
    then
  }) => {
    var alerts = []

    givenIamLoggedIn(given)
    when(/^I Add Alert subscriptions$/, async (table) => {
      logger.info("Starting to add Alert subscriptions")
      var alert
      //table.forEach(row => {
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        alert = new AlertAdd()
        alert.setAlertAdd(row.SubscriptionName, row.NodeName, row.OrgName, row.TunnelName, row.ServiceName, row.Label,
          row.If, row.Is, row.For, row.Scope)

        await goToAlertPage()
        await addAlertSubscription(alert)
        alerts.push(alert.getname())
      }
      logger.info("Ending add Alert subscriptions ", alerts.length)
    });


    then(/^Alert subscription should be Added "(.*?)"$/, async (alertname) => {
      for (let j = 0; j < alerts.length; j++) {
        logger.info('Then Alert subscription  Should be Added ' + alerts[j]);
        reporter.startStep("Verifying Alert subscription  is " + alerts[j]);
        var exist = await goToAlert(alerts[j])
        expect(exist).not.toBeNull
        let screenshot = await customScreenshot('alertExist.png', 1920, 1200)
        reporter.addAttachment("Alert subscription Exist_" + alerts[j], screenshot, "image/png");
        reporter.endStep();
      }
    });
  });

  test('Delete user Alert subscriptions', ({
    given,
    when,
    then
  }) => {
    var alerts = []

    givenIamLoggedIn(given)
    when(/^I Delete Alert subscriptions$/, async (table) => {
      reporter.startStep("I Delete Alert subscriptions");
      logger.info("Starting to Delete Alert subscriptions")
      //table.forEach(row => {
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("Delete Alert subscription  is " + row.SubscriptionName);
        await goToAlertPage()
        var exist = await goToAlert(row.SubscriptionName)
        expect(exist).not.toBeNull
        logger.info("Alert subscription Exist", row.SubscriptionName)
        let screenshot = await customScreenshot('alertExist.png', 1920, 1200)
        reporter.addAttachment("Alert subscription Exist_" + row.SubscriptionName, screenshot, "image/png");
        alerts.push(row.SubscriptionName)

        const [del] = await exist.$x(".//button[contains(@title, 'Delete')]", { visible: true })
        await del.click()
        logger.info("Alert subscription Clicked Delete for", row.SubscriptionName)
        await delay(1000)
        screenshot = await customScreenshot('alertDelete.png', 1920, 1200)
        reporter.addAttachment("Alert subscription Delete_" + row.SubscriptionName, screenshot, "image/png");

        await expect(page).toMatchElement('div.ant-popover-buttons span', { text: 'Yes' })
        await expect(page).toClick('div.ant-popover-buttons span', { text: 'Yes' })
        await delay(2000) //waiting 2000 seconds for confirmation popup
        screenshot = await customScreenshot('alertDeleted.png', 1920, 1200)
        reporter.addAttachment("Alert subscription Delete_Response_" + row.SubscriptionName, screenshot, "image/png");
        logger.info("Alert subscription Clicked Yes in confirmation popup for", row.SubscriptionName)
        reporter.endStep();
      }
      logger.info("Ending add Alert subscriptions ", alerts.length)
      reporter.endStep();
    });


    then(/^Alert subscriptions should be Deleted "(.*?)"$/, async (alertname) => {
      reporter.startStep("Alert subscription should be Deleted");
      for (let j = 0; j < alerts.length; j++) {
        logger.info('Then Alert subscription  Should not exist ' + alerts[j]);
        reporter.startStep("Verifying Alert subscription Should not exist " + alerts[j]);
        var exist = await goToAlert(alerts[j])
        expect(exist).toBeNull
        let screenshot = await customScreenshot('alertNotExist.png', 1920, 1200)
        reporter.addAttachment("Alert subscription NotExist_" + alerts[j], screenshot, "image/png");
        reporter.endStep();
      }
      reporter.endStep();
    });


  });

  test('Connect Mongo', ({
    given,
    when,
    then
  }) => {
    var alerts = []

    givenIamLoggedIn(given)
    when(/^I connect$/, async () => {
      reporter.startStep("I am Connected to Mongo");
      logger.info("Iam Connected to Mongo")
      reporter.endStep();
    });



    then(/^I am Connected$/, async () => {
      let date = Date.now() * 1000000
      //date = 1580982706389 * 1000000

      logger.info("NOW date = ", date)


      let hsn = await getNodeHSN(db, 'Thyaga_test1_virtual2')
      await logger.info("In MAin Line", hsn);

      reporter.startStep("I am Connected");
      await OSAction('Thyaga_test1_virtual2', OStoken, 'os-stop')
      await delay(15000)


      //const collection = await db.collection('user_notification');
      //collection.find({'hardwareSerialNumber':'ZJG6-7RCB'}).toArray(function(err, docs) {
      //  logger.info(docs);
      //});

      var status = await getNotification(db, hsn, date, 'alertname')
      if (status == 'pending') {
        logger.info("Status is as expected pending =", status);
      }
      var date2 = Date.now() * 1000000
      logger.info("NOW date2 = ", date2)
      await OSAction('Thyaga_test1_virtual2', OStoken, 'os-start')
      await delay(150000)

      status = await getNotification(db, hsn, date2, 'alertname')
      if (status == 'cancel') {
        logger.info("Status is as expected cancel =", status);
      }

      status = await getNotification(db, hsn, date, 'alertname')
      if (status == 'cancel') {
        logger.info("Status is as expected cancel =", status);
      }

      reporter.endStep();
    });


  });

  test('Navigation test', ({ given, when, then }) => {
    logger.info('testing Navigation test')
    givenIamLoggedIn(given);
    whenINavigateToAllScreens(when);
    thenIShouldSeeNoConsoleErrors(then);

  });


  test('Check status of an Connected Tunnel table', ({
    given,
    when,
    then
  }) => {
    given('I am logged in', () => {

    });

    when('I check status of Network', (table) => {
      table.forEach(row => {
        logger.info("Network Name = " + row.networkName)
        logger.info("Node Name = " + row.nodeName)
        logger.info("Org Name = " + row.orgName)
      });
    });

    then(/^Status should be (.*)$/, (arg0) => {
      logger.info("Status  = " + arg0)
    });
  });

  test('Check status of an Alive node123', ({
    given,
    when,
    then
  }) => {
    given('I am logged in', () => {

    });

    when(/^I check status of Node "(.*?)" And Org is "(.*?)"$/, (arg0, arg1) => {
      logger.info(arg0)
      logger.info(arg1)
    });
    goAllNetworks, getCountOfNetworks, expandAllTabsInNetworkPage
    then(/^Status should be (.*)$/, (arg0) => {
      logger.info(arg0)
    });
  });


  test('Check status of an Alive node1234', ({
    given,
    when,
    then
  }) => {
    given('I am logged in', () => {

    });

    when(/^I check status of Node <(.*?)> And Org is <(.*?)>$/, (arg0, arg1) => {
      logger.info(arg0)
      logger.info(arg1)
    });

    then(/^Status should be <(.*?)>$/, (arg0) => {
      logger.info(arg0)
    });
  });


  test('Check status of an Alive node12345', ({
    given,
    when,
    then
  }) => {
    given('I am logged in', () => {

    });

    when(/^I check status of Node {Raja} And Org is {Raja(.*)}$/, (arg0) => {

    });

    then(/^Status should be (.*)$/, (arg0) => {

    });
  });

  test('Check status of an Connected Tunnel table123', ({
    given,
    when,
    then
  }) => {
    given('I am logged in', () => {

    });

    when('I check status of Network', (table) => {
      table.forEach(row => {
        row.networkName
      });
    });

    then('Status should be Tunnel-Connected', () => {

    });
  });

});