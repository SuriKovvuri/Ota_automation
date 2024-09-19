jest.retryTimes(0)

import { defineFeature, loadFeature } from 'jest-cucumber';
import { addAlertSubscription, goToAlert, goToAlertPage, deleteAllAlertSubscription } from '../helper/alert';
import { addTanNetwork, getCountOfNetworks, goAllNetworks, goToNetwork, goToNetworkAction, expandTabsInNetworkPage, connectNetwork, getTunnelStatus, disconnectAllTunnels, deleteAllNetworks } from '../helper/networks';
import { connectOS, OSAction, goToNode, changeNodeState, makeAllNodesAlive, rebootiNode } from '../helper/node';
import { verifyServiceRestartCount, addService, serviceStatus, goToService, deleteAllServices, goToServiceAction} from '../helper/services';
import { AlertAdd } from '../src/alertAdd';
import { closemongoDB, connectmongoDB, createPDF, customScreenshot, delay, findBySelector, getNodeHSN, getNotification, verifyUserNotification, replaceEnvs, getEnvConfig, closeModal, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, tableToObjects, matchByKey, waitForNetworkIdle, sortTable } from '../../utils/utils';
import { andWhenNetworkIs, andWhenNodeIs, andWhenServiceIs, givenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenServiceShouldBeAdded, whenINavigateToAllScreens, whenOrgis, whenIAddTanNetwork, whenIConnectNetwork, whenTunnelStatusExists, givenIamLoggedInAs, whenIAddAlertSubscriptions } from './shared-steps';
import { del } from 'openstack-client/lib/util';
import { Login } from '../helper/login';
import { logger } from '../log.setup';
import { NetworkAdd } from '../src/networkAdd';
import { deleteNetworksInNode, deleteServicesInNode, getApi } from '../../utils/api_utils';
import { leftpane, dashboard, allInodes, serialNumbers, allNetworks, allServices, inodeDetails, pullSecrets, modals, volumes, networksTab, servicesTab, csp, allUsers, allRoles, onlineHelp, eventsTab, imagesTab, images, interfacesTab, events, apiKeys, sshKeys, downloadSoftware, downloadActivity, downloadEvents, manageAlerts, myProfile, addAlertForm} from '../constants/locators'
import { goToOrg } from '../helper/org';

const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
var assert = require('assert');
var OStoken, db

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/nodeAlert.feature', 
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
        logger.info("After Each ");
        await customScreenshot('afterEach.png', 1920, 1200)
        await deleteAllAlertSubscription()
        await makeAllNodesAlive(OStoken, ["node1", "vnode1"])
    })

    beforeEach(async () => {   
        logger.info("Before Each ");
        jest.setTimeout(1200000)           
    })

    afterAll(async () => {
        try {
          logger.info('After ALL')
          await closemongoDB()
          await har.stop();

          let login = new Login();
          let result = await login.logout()
          expect(result).toBe(true)
          await createPDF(global.testStart,'nodeAlert')
          await closemongoDB()
        }
        catch(err) {
            logger.error(err);
        }  
        })
  
    beforeAll(async() => {
        try {
            //page.waitForNavigation()
            jest.setTimeout(300000)
            await page.setDefaultNavigationTimeout(50000); 
            await page.waitFor(5000);
  
            let config = await getEnvConfig()
            global.orchIP = config.orchIP
            global.apiKey = config.apiKey
            
            OStoken = await connectOS()
            db = await connectmongoDB()

            await har.start({ path: './reports/nodealert'+global.testStart+'.har', saveResponse: true }); 
            let login
            login = new Login();
            logger.info("global.env = "+global.env)
            await login.launch(global.env, global.scope) 
    
            await (page
              .waitForXPath(leftpane.button.logout, { visible: true })
              .then(() => logger.info('Waiting In before ALL berfore proceeding')))
    
            reporter = global.reporter
            await customScreenshot('beforeAll.png', 1920, 1200) 
          }
          catch(err) {
              logger.error(err);
          }
          })    

    test('Verify the editable node state change alert', async ({
        given,
        when,
        and,
        then
    }) => {
        var editInfo
        var date
        givenIamLoggedIn(given)
        whenIAddAlertSubscriptions(when)
        when('I edit alert and change editable fields', async(table) =>{
            reporter.startStep("And I edit alert and change editable fields")
            await goToAlertPage()
            for(let row of table){
                editInfo = row
                //row = await replaceEnvs(row);
                let rowPath = `//td[div[span='${row.SubscriptionName}']]//following-sibling::td//button[contains(@class,'ant-dropdown-trigger')]`
                let action = await performAction("click", rowPath, "page")
                expect(action).toBeTruthy()
                await delay(2000)
                action = await performAction("click", manageAlerts.button.editAlert, "page") 
                expect(action).toBeTruthy()
                let screenshot = await customScreenshot('editalertPage1.png', 1920, 1200)
                reporter.addAttachment("Edit Alert page1", screenshot, "image/png");

                action = await performAction("type", addAlertForm.input.alertName, "page", `${row.SubscriptionName}1`, true)
                expect(action).toBeTruthy()
                screenshot = await customScreenshot('alertPage1.png', 1920, 1200)
                reporter.addAttachment("Alert page1", screenshot, "image/png");

                action = await performAction("click", addAlertForm.button.next, "page")
                expect(action).toBeTruthy()
                action = await performAction("type", addAlertForm.input.durationValue, "page", row.For.split(":")[0], true)
                expect(action).toBeTruthy()
                screenshot = await customScreenshot('alertPage2.png', 1920, 1200)
                reporter.addAttachment("Alert page2", screenshot, "image/png");

                action = await performAction("click", addAlertForm.button.next, "page")
                expect(action).toBeTruthy()
                action = await performAction("click", addAlertForm.input.subScope, "page")
                expect(action).toBeTruthy()
                await delay(2000)
                await expect(page).toClick('li', { text: 'My org'})
                await delay(2000)
                screenshot = await customScreenshot('alertPage3.png', 1920, 1200)
                reporter.addAttachment("Alert page3", screenshot, "image/png");

                //action = await performAction("click", addAlertForm.button.next, "page")
                //expect(action).toBeTruthy()
                action = await navigatePageByClick(addAlertForm.button.next)
                expect(action).toBeTruthy()
                action = await navigatePageByClick(addAlertForm.button.save)
                expect(action).toBeTruthy()
                //action = await performAction("click", addAlertForm.button.save, "page")
                //expect(action).toBeTruthy()
                let status = await getElementHandleByXpath(addAlertForm.span.createSuccess)
                expect(status).toBeTruthy()
                screenshot = await customScreenshot('alertSuccess.png', 1920, 1200)
                reporter.addAttachment("Alert success", screenshot, "image/png");

            }
            reporter.endStep()
        })
        when(/^I power off inode "(.*)"$/, async (nodename) => {
            reporter.startStep('And I power off inode ' + nodename)
            date = Date.now() * 1000000
            await delay(10000)
            logger.info("Stopping inode")
            var config = await getEnvConfig()
            nodename = eval("config." + nodename)
            let stopAction = await changeNodeState(nodename, OStoken, "os-stop")
            expect(stopAction).toBeTruthy()
            reporter.endStep()
        });
        then('Node state change alert must be sent as per edited settings',  async () => {
            reporter.startStep('Then Node state change alert must be sent as per edited setting')
            var config = await getEnvConfig()
            let nodename = eval("config.node1")
            let alertName = editInfo.SubscriptionName + "1"
            logger.info(alertName)
            logger.info(`date is ${date}`)
            var myDocument = await db.collection('user_notification').findOne(
                {'type':'NODE_STATE_CHANGE',
                'fields.alert.name':'autoNodeAlert11',
                'fields.nodeName':nodename,
                'fields.status':'NODE_UNREACHABLE',
                'createdAt': { $gt: date } })
            logger.info(myDocument)

            reporter.startStep("Verifying Edited Alert duration is 1")
            logger.info(myDocument.fields.alert.settings)
            expect(myDocument.fields.alert.settings.duration).toBe("1")
            reporter.endStep()

            reporter.startStep("Verifying Edited Alert scope is My org")
            expect(myDocument.fields.alert.settings.include_child).toBe("false")
            reporter.endStep()
            
            reporter.startStep("Verifying Alert user notifcation record has alertAfterAt is 1 min from eventTime")
            logger.info(myDocument.eventTime)
            logger.info(myDocument.alertAfterAt)
            logger.info(~~(myDocument.alertAfterAt/1000000000) - ~~(myDocument.createdAt/1000000000))
            let duration = ~~(myDocument.alertAfterAt/1000000000) - ~~(myDocument.createdAt/1000000000)
            expect(duration).toBe(60)
            reporter.endStep()
            reporter.endStep()
            reporter.endStep()
        })
    })

    test('Verify non editable fields in node state change alert', async ({
        given,
        when,
        and,
        then
    }) => {
        var editInfo
        givenIamLoggedIn(given)
        whenIAddAlertSubscriptions(when)
        when(/^I edit alert "(.*)"$/,  async (alertName) => {
            reporter.startStep(`When I edit alert ${alertName}`)
            let rowPath = `//td[div[span='${alertName}']]//following-sibling::td//button[contains(@class,'ant-dropdown-trigger')]`
            let action = await performAction("click", rowPath, "page")
            expect(action).toBeTruthy()
            await delay(2000)
            action = await performAction("click", manageAlerts.button.editAlert, "page")
            expect(action).toBeTruthy()
            let screenshot = await customScreenshot('editalertPage1.png', 1920, 1200)
            reporter.addAttachment("Edit Alert page1", screenshot, "image/png");
            reporter.endStep()
        })
        then('All non editable fields must be disabled',  async () => {
            reporter.startStep("All non editable fields must be disabled")
            let action = await performAction("click", addAlertForm.button.next, "page")
            expect(action).toBeTruthy()
            
            //Verify if monitor metrics select is disabled
            reporter.startStep("Verify non-editable select monitor metrics drop box")
            let screenshot = await customScreenshot('monitorMetrics.png', 1920, 1200)
            reporter.addAttachment("monitorMetrics", screenshot, "image/png");
            let metricsPathDisabled = addAlertForm.div.monitorMetric + "//ancestor::div[contains(@class, 'ant-select ant-select-disabled')]" 
            let status = await getElementHandleByXpath(metricsPathDisabled)
            expect(status).toBeTruthy()
            reporter.endStep()

            action = await performAction("click", addAlertForm.button.next, "page")
            expect(action).toBeTruthy()
            action = await performAction("click", addAlertForm.button.next, "page")
            expect(action).toBeTruthy()

            reporter.startStep("Verify non-editable emailid textbox")
            //Verify email id is not editable
            screenshot = await customScreenshot('emailid.png', 1920, 1200)
            reporter.addAttachment("emailid", screenshot, "image/png");
            let mailid = await getElementHandleByXpath(addAlertForm.input.emailId + "[@disabled]")
            expect(mailid).toBeTruthy()
            reporter.endStep()

            action = await performAction("click",addAlertForm.button.cancel,"page")          
            expect(action).toBeTruthy()

            reporter.endStep()
        })
    })

    test('Verify the node state change alert with scope node', async ({
        given,
        when,
        and,
        then
    }) => {
        var editInfo
        var date
        givenIamLoggedIn(given)
        whenIAddAlertSubscriptions(when)
        when(/^I power off inode "(.*)"$/, async (nodename) => {
            reporter.startStep('And I power off inode ' + nodename)
            date = Date.now() * 1000000
            await delay(10000)
            logger.info("Stopping inode")
            var config = await getEnvConfig()
            nodename = eval("config." + nodename)
            let stopAction = await changeNodeState(nodename, OStoken, "os-stop")
            expect(stopAction).toBeTruthy()
            reporter.endStep()
        });
        then('Node state change alert must be sent as per settings',  async () => {
            reporter.startStep('Then Node state change alert must be sent as per setting')
            var config = await getEnvConfig()
            let nodename = eval("config.node1")
            //let alertName = editInfo.SubscriptionName
            //logger.info(alertName)
            logger.info(`date is ${date}`)
            var myDocument = await db.collection('user_notification').findOne(
                {'type':'NODE_STATE_CHANGE',
                'fields.alert.name':'autoNodeAlert1',
                'fields.nodeName':nodename,
                'fields.status':'NODE_UNREACHABLE',
                'createdAt': { $gt: date } })
            logger.info(myDocument)
            expect(myDocument).toBeTruthy()
            reporter.endStep()
        })
    })


    test('Verify the node state change alert with scope node on a descoped node', async ({
        given,
        when,
        and,
        then
    }) => {
        var editInfo
        var date
        givenIamLoggedIn(given)
        whenIAddAlertSubscriptions(when)
        when('I edit alert and change editable fields', async(table) =>{
            reporter.startStep("And I edit alert and change editable fields")
            await goToAlertPage()
            for(let row of table){
                editInfo = row
                row = await replaceEnvs(row);
                let rowPath = `//td[div[span='${row.SubscriptionName}']]//following-sibling::td//button[contains(@class,'ant-dropdown-trigger')]`
                let action = await performAction("click", rowPath)
                expect(action).toBeTruthy()
                await delay(2000)
                action = await performAction("click", manageAlerts.button.editAlert) 
                expect(action).toBeTruthy()
            
                let screenshot = await customScreenshot('alertPage1.png', 1920, 1200)
                reporter.addAttachment("Alert page1", screenshot, "image/png");
                action = await performAction("click", addAlertForm.button.next)
                expect(action).toBeTruthy()

                screenshot = await customScreenshot('alertPage2.png', 1920, 1200)
                reporter.addAttachment("Alert page2", screenshot, "image/png");
                action = await performAction("click", addAlertForm.button.next, "page")
                expect(action).toBeTruthy()

                action = await performAction("click", addAlertForm.div.scope, "page")
                expect(action).toBeTruthy()
                await expect(page).toClick('li.ant-select-dropdown-menu-item', { text: 'iNode'})
                action = await performAction("click", addAlertForm.input.subScope, "page")
                expect(action).toBeTruthy()
                action = await performAction("click", "//li[text()='Select by Name']", "page")
                expect(action).toBeTruthy()
                await expect(page).toClick('li[class="ant-cascader-menu-item ant-cascader-menu-item-expand"]', { text: row.OrgName })
                //await delay(500)
                logger.info("node name is " + row.NodeName)
                let scopeNode = new RegExp(`^${row.NodeName}$`, 'i')
                await expect(page).toClick('li[class="ant-cascader-menu-item"]', { text: scopeNode})
                //await delay(500)

                //await expect(page).toClick('li', { text: 'My org'})
                screenshot = await customScreenshot('alertPage3.png', 1920, 1200)
                reporter.addAttachment("Alert page3", screenshot, "image/png");

                action = await performAction("click", addAlertForm.button.next, "page")
                expect(action).toBeTruthy()
                await delay(3000)

                action = await performAction("click", addAlertForm.button.save, "page")
                expect(action).toBeTruthy()
                let status = await getElementHandleByXpath(addAlertForm.span.createSuccess)
                expect(status).toBeTruthy()
                screenshot = await customScreenshot('alertSuccess.png', 1920, 1200)
                reporter.addAttachment("Alert success", screenshot, "image/png");

            }
            reporter.endStep()
        })
        when(/^I power off inode "(.*)"$/, async (nodename) => {
            reporter.startStep('And I power off inode ' + nodename)
            date = Date.now() * 1000000
            await delay(10000)
            logger.info("Stopping inode")
            var config = await getEnvConfig()
            nodename = eval("config." + nodename)
            let stopAction = await changeNodeState(nodename, OStoken, "os-stop")
            expect(stopAction).toBeTruthy()
            reporter.endStep()
        });
        then('Node state change alert must not be sent',  async () => {
            reporter.startStep('Then Node state change alert must not be sent')
            var config = await getEnvConfig()
            let nodename = eval("config.vnode1")
            logger.info(`date is ${date}`)
            var myDocument = await db.collection('user_notification').findOne(
                {'type':'NODE_STATE_CHANGE',
                'fields.alert.name':'autoNodeAlert1',
                'fields.nodeName':nodename,
                'fields.status':'NODE_UNREACHABLE',
                'createdAt': { $gt: date } })
            logger.info(myDocument)
            expect(myDocument).toBeFalsy()
            reporter.endStep()
        })
    })
})