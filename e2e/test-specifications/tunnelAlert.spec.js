//jest.retryTimes(0)

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
var networkName
var nodeName

const testIotium = require('../src/testIotium');
const feature = loadFeature('./e2e/features/tunnelAlert.feature', 
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
        await makeAllNodesAlive(OStoken, ["node1"])
    })

    beforeEach(async () => {   
        logger.info("Before Each ");
        jest.setTimeout(1200000)           
    })

    afterAll(async () => {
        try {
          logger.info('After ALL')
          await goToNode(nodeName)
          await deleteAllNetworks()
          await har.stop();
          let login = new Login();
          let result = await login.logout()
          expect(result).toBe(true)
          await createPDF(global.testStart,'tunnelAlert')
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

            await har.start({ path: './reports/tunnelAlert'+global.testStart+'.har', saveResponse: true }); 
            let login
            login = new Login();
            logger.info("global.env = "+global.env)
            await login.launch(global.env, global.scope) 
    
            await (page
              .waitForXPath(leftpane.button.logout, { visible: true })
              .then(() => logger.info('Waiting In before ALL berfore proceeding')))
    
            reporter = global.reporter
            await customScreenshot('beforeAll.png', 1920, 1200) 

            nodeName = eval("config.node1")
            await goToNode(nodeName)
            await delay(2000)
            let networkObj = new NetworkAdd()
            networkName = eval("config.node1_tan1")
            networkObj.setNetworkAdd(networkName,"a:a","Static","11.1.1.0/24","11.1.1.1","11.1.1.100")
            await addTanNetwork(networkObj)
            await customScreenshot('beforeAll.png', 1920, 1200) 

          }
          catch(err) {
              logger.error(err);
          }
          })    

    test('Verify the editable tunnel state change alert', async ({
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
            await delay(5000)
            await goToAlertPage()
            for(let row of table){
                editInfo = row
                //row = await replaceEnvs(row);
                let rowPath = `//td[div[span='${row.SubscriptionName}']]//following-sibling::td//button[contains(@class,'ant-dropdown-trigger')]`
                let action = await performAction("click", rowPath, "page")
                expect(action).toBeTruthy()
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
                await expect(page).toClick('li', { text: 'My org'})
                screenshot = await customScreenshot('alertPage3.png', 1920, 1200)
                reporter.addAttachment("Alert page3", screenshot, "image/png");

                action = await performAction("click", addAlertForm.button.next, "page")
                expect(action).toBeTruthy()
                action = await performAction("click", addAlertForm.button.save, "page")
                expect(action).toBeTruthy()
                let status = await getElementHandleByXpath(addAlertForm.span.createSuccess)
                expect(status).toBeTruthy()
                screenshot = await customScreenshot('alertSuccess.png', 1920, 1200)
                reporter.addAttachment("Alert success", screenshot, "image/png");

            }
            reporter.endStep()
        })
        whenIConnectNetwork(when)
        whenTunnelStatusExists(when)
        then('Tunnel state change alert must be sent as per edited settings',  async () => {
            reporter.startStep('Then Tunnel state change alert must be sent as per edited setting')
            var config = await getEnvConfig()
            let nodename = eval("config.node1")
            let alertName = editInfo.SubscriptionName + "1"
            logger.info(alertName)
            logger.info(`date is ${global.connected_time}`)
            var myDocument = await db.collection('user_notification').findOne(
                {'type':'TUNNEL_STATE_CHANGE',
                'fields.alert.name':'autoTunnelAlert11',
                'fields.nodeName':nodename,
                'fields.status':'TUNNEL_CONNECTED',
                'createdAt': { $gt: global.connected_time } })
            logger.info(myDocument)

            reporter.startStep("Verifying Edited Alert duration is 1")
            logger.info(myDocument.fields.alert.settings)
            expect(myDocument.fields.alert.settings.duration).toBe("1")
            reporter.endStep()

            reporter.startStep("Verifying Edited Alert scope is My org")
            expect(myDocument.fields.alert.settings.include_child).toBe("false")
            reporter.endStep()
            
            reporter.startStep("Verifying Alert user notifcation record has alertAfterAt is 1 min from createdAt")
            logger.info(myDocument.createdAt)
            logger.info(myDocument.alertAfterAt)
            logger.info(~~(myDocument.alertAfterAt/1000000000) - ~~(myDocument.createdAt/1000000000))
            logger.info(~~((myDocument.alertAfterAt - myDocument.createdAt)/1000000000))
            let duration = ~~(myDocument.alertAfterAt/1000000000) - ~~(myDocument.createdAt/1000000000)
            expect(duration).toBe(60)
            await goToNode(nodeName)
            await disconnectAllTunnels(networkName)
            reporter.endStep()
            reporter.endStep()
        })
    })

})