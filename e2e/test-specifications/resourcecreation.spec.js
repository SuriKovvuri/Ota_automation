import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage, deleteAllAlertSubscription } from '../helper/alert';
import { addTanNetwork, getCountOfNetworks, goAllNetworks, goToNetwork, goToNetworkAction, expandTabsInNetworkPage, connectNetwork, getTunnelStatus, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive, addNode, deleteNode, getNodeFromAllNodes } from '../helper/node';
import { verifyServiceRestartCount, addService, serviceStatus, goToService, deleteAllServices, goToServiceAction, deleteService, addVolume, goToVolume, deleteVolume} from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig, closeModal, goTo } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis, whenIAddTanNetwork, whenIConnectNetwork, whenTunnelStatusExists } from './shared-steps';
import { del } from 'openstack-client/lib/util';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { NetworkAdd } from '../src/networkAdd';
import { NodeAdd } from '../src/nodeAdd';
import { UserAdd } from '../src/userAdd';
import { addUser, goToUser, goToUserAction } from '../helper/user';
import { addSSHKey, gotoSSHKey, deleteSSHKey } from '../helper/sshkey'


const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');


const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/resourcecreation.feature', 
            {
              errors: {
                missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
                missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
                missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
                missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
              }
                //tagFilter: '@test',
            });

            let reporter;
        
            
defineFeature(feature, test => {

    afterEach(async () => {
        await closeModal()
        logger.info("after modal close")
        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        logger.info("After Each ");
        var config = await getEnvConfig()
        logger.info(performanceTiming);
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
        jest.setTimeout(1200000)
        await delay(5000)
           
    })

    afterAll(async () => {
      try {
        logger.info('After ALL')
        const elemXPath = "//button[contains(@title, 'My Account')]"
        const elemExists = await page.waitForXPath(elemXPath, {timeout: 10000}) ? true : false;
        expect(elemExists).toBe(true)
        await expect(page).toClick('button[title="My Account"]')
        await page.waitFor(1000)
        await expect(page).toClick('span', { text: 'Logout' })
        await page.waitFor(2000)
        //perf
        logger.info(await testIotium(page));
        await customScreenshot('loggedout.png', 1920, 1200) 

        await createPDF(global.testStart,'status')
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
      catch(err) {
          logger.info(err);
        }
  
      })

      beforeAll(async() => {

        try {
          //page.waitForNavigation()
          console.log("beforeall ", Date.now())
          jest.setTimeout(1200000)
          console.log("beforeall2 ", Date.now())
          await page.setDefaultNavigationTimeout(50000); 
          await page.waitFor(5000);

          let config = await getEnvConfig()
          global.orchIP = config.orchIP


          let login
          login = new Login();
          logger.info("global.env = "+global.env)
          await login.launch(global.env, global.scope) 
  
          await (page
            .waitForXPath("//button[contains(@title, 'My Account')]", { visible: true })
            .then(() => logger.info('Waiting In before ALL berfore proceeding')))
  
          await page.$x("//button[contains(@title, 'My Account')]", { visible: true })
          reporter = global.reporter
          await customScreenshot('beforeAll.png', 1920, 1200) 

           //This is for recording JS and CSS usages
          await Promise.all([
            page.coverage.startJSCoverage(),
            page.coverage.startCSSCoverage()
           ]);
           //performance tracing
           await page.tracing.start({ path: './reports/status'+global.testStart+'_tracing.json' });
           //trying HAR
           await har.start({ path: './reports/status'+global.testStart+'.har', saveResponse: true }); 
           logger.info("beforeall completed")
        }
        catch(err) {
            logger.error(err);
          }
        })    


  test('Add iNode', async ({
    given,
    when,
    then
  }) => {
    givenIamLoggedIn(given)
    when(/^I add iNode$/, async (table) => {
        logger.info("When I add iNode")
        reporter.startStep("When I add iNode");
        for (let i = 0; i < table.length; i++) {
          let row = table[i]
          row = await replaceEnvs(row);
          let node
          node = new NodeAdd()
          node.setNodeAdd(row.NodeName, row.Label, row.Profile, row.SerialNumber, row.SshKey, row.VirtualPlatform,
            row.AdvSettings)
          await addNode(node)
          await delay(5000)
        }
        reporter.endStep();
    });
    then(/^iNode should be added "(.*?)"$/, async (nodeName) => {
        logger.info('Then iNode Should be Added');
        reporter.startStep("Then iNode Should be Added");
        let node = nodeName.split(',')
        for(let i=0;i<node.length;i++){
            reporter.startStep("Node present ",node[i])
            var exist = await goToNode(node[i])
            expect(exist).not.toBeNull
            let screenshot = await customScreenshot('nodePresent'+ i + '.png', 1920, 1200)
            reporter.addAttachment("Node present_" + node[i], screenshot, "image/png");
            reporter.endStep();
        }
        reporter.endStep();
    });
  })

  test('Add a TAN Network', async ({
    when,
    then
  }) => {
    whenIAddTanNetwork(when)
    then(/^Network should be Added "(.*?)"$/, async (networkname) => {
        logger.info('Then Network Should be Added ' + networkname);
        reporter.startStep("Network should be Added " + networkname);
        let network = networkname.split(',')
        for(let i=0;i<network.length;i++){
            reporter.startStep("Network present ",network[i])
            var exist = await goToNetwork(network[i])
            logger.info("Network exists ",exist)
            expect(exist).toBeTruthy();
            let screenshot = await customScreenshot('networkPresent'+ i + '.png', 1920, 1200)
            reporter.addAttachment("Network present_" + network[i], screenshot, "image/png");
            reporter.endStep();
        }
        reporter.endStep();  
      });
  })

  test('Add a Custom Service', async ({
    given,
    when,
    then
  }) => {
    var networkname
    given(/^Node exists "(.*?)"$/, async (nodename) => {
        reporter.startStep("Given Node exists ", nodename);
        await goToNode(nodename)
        reporter.endStep();
    })
    given(/^Tan Network is "(.*?)"$/, async (network) => {
        reporter.startStep("And Tan Network is ", network);
        networkname = network
        reporter.endStep();
    })
    when(/^Add custom Service "(.*?)"$/, async (servicename) => {
        logger.info("Add custom Service")
        reporter.startStep("When Add custom Service");
        let created = await addService(servicename,'Custom',networkname, {'fileName':'custom_restart_never.json'})
        await expect(created).toBe(true)
        reporter.endStep();
    })
    then(/^Service should be Added "(.*?)"$/, async (servicename) => {
        logger.info('Then Service Should be Added ' + servicename);
        reporter.startStep("Then Service Should be Added " + servicename);
        var exist = await goToService(networkname)
        expect(exist).not.toBeNull
        let screenshot = await customScreenshot('servicePresent.png', 1920, 1200)
        reporter.addAttachment("Service present_" + servicename, screenshot, "image/png");
        reporter.endStep();  
      });
  })

  test('Add user Alert subscriptions', ({
    given,
    when,
    then
  }) => {
    var alerts = []
    when(/^I Add Alert subscriptions$/, async (table) => {
      logger.info("Starting to add Alert subscriptions")
      reporter.startStep("When I Add Alert subscriptions")
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
      reporter.endStep();
    });
    then(/^Alert subscription should be Added "(.*?)"$/, async (alertname) => {
      reporter.startStep("Then Alert subscription should be Added")
      for (let j = 0; j < alerts.length; j++) {
        logger.info('Then Alert subscription  Should be Added ' + alerts[j]);
        reporter.startStep("Verifying Alert subscription  is " + alerts[j]);
        var exist = await goToAlert(alerts[j])
        expect(exist).not.toBeNull
        let screenshot = await customScreenshot('alertExist.png', 1920, 1200)
        reporter.addAttachment("Alert subscription Exist_" + alerts[j], screenshot, "image/png");
        reporter.endStep();
      }
      reporter.endStep();
    });
  });

  test('Delete user Alert subscriptions', ({
    given,
    when,
    then
  }) => {
    var alerts = []

    when(/^I Delete Alert subscriptions$/, async (table) => {
      reporter.startStep("When I Delete Alert subscriptions");
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
      logger.info("Ending Delete Alert subscriptions ", alerts.length)
      reporter.endStep();
    });

    then(/^Alert subscriptions should be Deleted "(.*?)"$/, async (alertname) => {
      reporter.startStep("Then Alert subscription should be Deleted");
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


  test('Delete Service', async ({
    when,
    then
  }) => {
    when(/^I delete Service$/, async (table) => {
        reporter.startStep("When I delete Service");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            await goToNode(row.NodeName)
            await deleteService(row.ServiceName)
        }
        reporter.endStep();
    })
    then(/^Service should be deleted "(.*?)"$/, async (serviceName) => {
        logger.info('Then Service Should be deleted');
        reporter.startStep("Then Service Should be deleted");
        let service = serviceName.split(',')
        for(let i=0;i<service.length;i++){
            reporter.startStep("Service delete ",service[i])
            var exist = await goToService(service[i])
            logger.info("Service exists ",exist)
            expect(exist).toBe(null)
            let screenshot = await customScreenshot('serviceNotPresent'+ i + '.png', 1920, 1200)
            reporter.addAttachment("Service Not present_" + service[i], screenshot, "image/png");
            reporter.endStep();
        }
        reporter.endStep();
    });
  });


  test('Delete Tan Network', async ({
    when,
    then
  }) => {
    when(/^I delete Tan Network$/, async (table) => {
        reporter.startStep("When I delete Tan Network");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            await goToNode(row.NodeName)
            await goToNetworkAction(row.NetworkName, "delete")
            let screenshot = await customScreenshot('networkdeleted'+ i + '.png', 1920, 1200)
            reporter.addAttachment("Network deleted_" + row.NetworkName, screenshot, "image/png");
        }
        reporter.endStep();
    })
    then(/^Network should be deleted "(.*?)"$/, async (networkName) => {
        logger.info('Then Network Should be deleted');
        reporter.startStep("Then Network Should be deleted");
        let network = networkName.split(',')
        for(let i=0;i<network.length;i++){
            reporter.startStep("Network delete ",network[i])
            var exist = await goToNetwork(network[i])
            logger.info("Network exists ",exist)
            expect(exist).toBe(null)
            let screenshot = await customScreenshot('networkNotPresent'+ i + '.png', 1920, 1200)
            reporter.addAttachment("Network Not present_" + network[i], screenshot, "image/png");
            reporter.endStep();
        }
        reporter.endStep();
    });
  })

  test('Delete iNode', async ({
    when,
    then
  }) => {
    when(/^I delete iNode$/, async (table) => {
        reporter.startStep("When I delete iNode");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            await deleteNode(row.NodeName)
            await delay(7000)
        }
        reporter.endStep();
    })
    then(/^iNode should be deleted "(.*?)"$/, async (nodeName) => {
        logger.info('Then iNode Should be deleted');
        reporter.startStep("Then iNode Should be deleted");
        let node = nodeName.split(',')
        for(let i=0;i<node.length;i++){
            reporter.startStep("Node delete ",node[i])
            var exist = await getNodeFromAllNodes(node[i])
            expect(exist).toBe(false)
            let screenshot = await customScreenshot('nodeNotPresent'+ i + '.png', 1920, 1200)
            reporter.addAttachment("Node Not present_" + node[i], screenshot, "image/png");
            reporter.endStep();
        }
        reporter.endStep();
    });
  })

  test('Add a User', ({
    given,
    when,
    then
  }) => {
    when(/^Add a User$/, async (table) => {
      logger.info("When Add a User")
      reporter.startStep("When Add a User")
      var alert
      //table.forEach(row => {
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        let user = new UserAdd()
        await user.setUserAdd(row.FullName, row.Email, row.Password, row.Password, row.Role, row.TimeZone)
        await addUser(user)
      }
      reporter.endStep();
    });
    then(/^User should be Added "(.*?)"$/, async (userName) => {
      reporter.startStep("Then Alert subscription should be Added")
      let user = userName.split(',')
      for (let i=0; i<user.length; i++)
      {
          let userExists = await goToUser(user[i])
          let screenshot = await customScreenshot('userSearch'+ i + '.png', 1920, 1200)
          reporter.addAttachment("User search " + user[i], screenshot, "image/png");
          await expect(userExists).not.toBe(false)
      } 
      reporter.endStep();
    });
  });


  test('Delete User', async ({
    when,
    then
  }) => {
    when(/^I delete User$/, async (table) => {
        reporter.startStep("When I delete User");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            await goToUserAction(row.FullName, "delete")
            await delay(3000)
        }
        reporter.endStep();
    })
    then(/^User should be deleted "(.*?)"$/, async (userName) => {
        logger.info('Then User Should be deleted');
        reporter.startStep("Then User Should be deleted");
        let user = userName.split(',')
        for(let i=0;i<user.length;i++){
            reporter.startStep(`User search ${user[i]}`)
            var exist = await goToUser(user[i])
            expect(exist).toBe(false)
            let screenshot = await customScreenshot('userNotPresent'+ i + '.png', 1920, 1200)
            reporter.addAttachment("User Not present_" + user[i], screenshot, "image/png");
            reporter.endStep();
        }
        reporter.endStep();
    });
  })

  test('Add a ssh key', ({
    given,
    when,
    then
  }) => {
    when(/^Add a ssh key$/, async (table) => {
      logger.info("When Add a ssh key")
      reporter.startStep("When Add a ssh key")
      await goTo(global.homeurl)
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        await addSSHKey(row.KeyName,row.FileName)
      }
      reporter.endStep();
    });
    then(/^ssh key should be Added "(.*?)"$/, async (sshName) => {
      reporter.startStep("Then ssh key should be Added")
      let exists = await gotoSSHKey(sshName)
      await expect(exists).not.toBe(false)  
      let screenshot = await customScreenshot('sshPresent'+ sshName + '.png', 1920, 1200)
      reporter.addAttachment("SSH present_" + sshName, screenshot, "image/png");
      reporter.endStep();
    });
  });

  test('Delete a ssh key', async ({
    when,
    then
  }) => {
    when(/^Delete a ssh key$/, async (table) => {
        reporter.startStep("When Delete a ssh key");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            await deleteSSHKey(row.KeyName)
        }
        reporter.endStep();
    })
    then(/^ssh key should be deleted "(.*?)"$/, async (keyName) => {
        logger.info('Then ssh key should be deleted');
        reporter.startStep("Then ssh key should be deleted");
            var exist = await gotoSSHKey(keyName)
            expect(exist).toBe(false)
            let screenshot = await customScreenshot('sshNotPresent'+ keyName + '.png', 1920, 1200)
            reporter.addAttachment("SSH Not present_" + keyName, screenshot, "image/png");
        reporter.endStep();
    });
  })

  test('Add a service volume', ({
    given,
    when,
    then
  }) => {
    when(/^Add a service volume$/, async (table) => {
      logger.info("When Add a service volume")
      reporter.startStep("When Add a service volume")
      for (let i = 0; i < table.length; i++) {
        let row = table[i]
        await addVolume(row.VolumeName,row.FileName)
      }
      reporter.endStep();
    });
    then(/^service volume should be Added "(.*?)"$/, async (volumeName) => {
      reporter.startStep("Then service volume should be Added ")
      let exists = await goToVolume(volumeName)
      await expect(exists).not.toBe(false)  
      let screenshot = await customScreenshot('volumePresent'+ volumeName + '.png', 1920, 1200)
      reporter.addAttachment("Volume present_" + volumeName, screenshot, "image/png");
      reporter.endStep();
    });
  });

  test('Delete a service volume', async ({
    when,
    then
  }) => {
    when(/^Delete a service volume$/, async (table) => {
        reporter.startStep("When Delete a service volume");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            await deleteVolume(row.VolumeName)
        }
        reporter.endStep();
    })
    then(/^service volume should be deleted "(.*?)"$/, async (volumeName) => {
        logger.info('Then service volume should be deleted');
        reporter.startStep("Then service volume should be deleted");
            var exist = await goToVolume(volumeName)
            expect(exist).toBe(false)
            let screenshot = await customScreenshot('volumeNotPresent'+ volumeName + '.png', 1920, 1200)
            reporter.addAttachment("Volume Not present_" + volumeName, screenshot, "image/png");
        reporter.endStep();
    });
  })

  test('Trigger a techdump', async ({
    given,
    when,
    then
  }) => {
    var request_id
    var actual_scope
    given(/^I am logged in as an admin user$/, async () => {
        await expect(page).toClick('button[title="My Account"]')
        await expect(page).toClick('span', { text: 'Logout' })
        await delay(2000)
        logger.info("logout done")
        const username = await page.waitForSelector('input[id="username"]', {timeout: 30000,  visible: true}) ? true : false;
        expect(username).toBe(true)
        let login
        login = new Login();
        logger.info("global.env = "+global.env)
        actual_scope = global.scope
        global.scope = 'Admin'
        await login.launch(global.env, global.scope) 
        await page.$x("//button[contains(@title, 'My Account')]", { visible: true, timeout: 30})
    })
    whenOrgis(when)
    when(/^Trigger techdump in node "(.*?)"$/, async (nodeName) => {
        global.scope = actual_scope
        reporter.startStep("When Trigger techdump in node ");
        let config = await getEnvConfig()
        var node
        if (nodeName == "node1"){node = config.node1}
        await goToNode(node)
        await expect(page).toMatchElement('span', { text: 'Send Diagnostic Data' })
  
        await expect(page).toClick('span', { text: 'Send Diagnostic Data' })
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
        reporter.endStep();
    })
    then(/^Techdump should be available$/, async () => {
        logger.info('Then Techdump should be available');
        reporter.startStep("Then Techdump should be available");
        logger.info('Waiting for the techdump download');

        //await delay(90000)
        //Month Date Year
        for (let i = 0; i<10; i++){
            let layout = await page.$x('.//div[contains(@class, "ant-col card-grid ant-col-xs-5 ant-col-sm-5 ant-col-md-6 ant-col-lg-7 ant-col-xl-8")]')
            //const layout = await page.$$('.ant-col card-grid ant-col-xs-5 ant-col-sm-5 ant-col-md-6 ant-col-lg-7 ant-col-xl-8')
            //logger.info('check 1', layout.length)
            let cardBodys = await layout[0].$x('.//div[contains(@class, "ant-card ant-card-bordered")]')
            //logger.info('check 2', cardBodys.length)
            let body = await cardBodys[1].$$('div.ant-card-body')
            //logger.info('check 3', body.length)
            let firstRow = await body[0].$$('tr.ant-table-row-level-0')
            if (firstRow.length == 0){
                logger.info("No techdump records so far")
                continue;
            }
            //logger.info('check 4', firstRow.length)
            let col = await firstRow[0].$$('td.ant-table-row-cell-break-word')
            await col[0].hover()
            await delay(1000)
            let element = await page.$$("div.ant-popover-inner-content p");
            let elementText = await (await element[1].getProperty('textContent')).jsonValue();
            logger.info(elementText)
            if (elementText.includes(request_id)){
                logger.info("Techdump finished")
                break
            }
            if (i == 9){
                logger.error("Techdump not completed in given time")
                expect(true).toBe(false)
            }
            //List Techdump call in UI goes every 1 minute.
            await delay(30000)
        }
        let screenshot = await customScreenshot('techdumpAvailable.png', 1920, 1200)
        reporter.addAttachment("techdump Available_" + request_id, screenshot, "image/png");
        logger.info('Verify Techdump is available');
        reporter.endStep()

    });
})


})