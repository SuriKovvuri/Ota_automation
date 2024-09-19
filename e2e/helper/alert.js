import { delay, findByLink, getElementAttributes, customScreenshot, performAction, navigatePageByClick, getElementHandleByXpath, verifyModal } from '../../utils/utils'
import { Severity } from 'jest-allure/dist/Reporter';
import { conditionalExpression } from '@babel/types';
import { logger } from '../log.setup'
import { addAlertForm, manageAlerts, leftpane, modals } from '../constants/locators';


export async function goToAlert(alertName)
{
    try {
        await goToAlertPage() 
        logger.info("Get goToAlert ", alertName)
        const alertContent =  await page.$$('tbody.ant-table-tbody')
        if (alertContent.length == 0){
            logger.info("No Alert records found")
            return null
        }
        const rows = await alertContent[0].$$('tr.ant-table-row-level-0')
        //logger.info('how many ROWS?', (rows.length))
        for (var ii=0; ii < rows.length; ii++) {
            let valueHandle = await rows[ii].getProperty('innerText');
            let linkText = await valueHandle.jsonValue();
            //logger.info("ROWS content = ", linkText)
            //expect(await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))).toEqual(['Hello!', 'Hi!']);
            const texts  = await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))
            if (texts.includes(alertName)) {
            expect(await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))).toContain(alertName) 

            //if (await rows[ii].$$('span', { text: alertName }) ? true : false) {
                logger.info("Returning Handle from goToAlert")
                await rows[ii].hover()
                return rows[ii]
            }
        }
        return null
    }
    catch(err) {
        logger.info(err);
        expect(true).toBe(false)
      }
}

export async function goToAlertPage()
{
    try {
        await (page
            .waitForXPath(leftpane.li.myAccount, { visible: true })
            .then(() => logger.info('Waiting for My Account')))
        const elemXPath1 = "//span[span= 'My Account']//ancestor::li[contains(@class, 'ant-menu-submenu-open')]"
        const elemExists1 = await page.$x(elemXPath1)
        logger.info(elemExists1)
        if (elemExists1.length == 0) {
            const [myAccount] = await page.$x(leftpane.li.myAccount, { visible: true })
            await myAccount.click()
            await delay(1000)
        }
        await navigatePageByClick(leftpane.li.manageAlerts)
        //await expect(page).toClick('span', { text: 'Manage Alerts' })
        await delay(2000)
        await (page
            .waitForXPath("//button[contains(@title, 'Add Alert')]", { visible: true })
            .then(() => logger.info('Waiting for Add Alert')))
        logger.info('Clicked on Manage Alerts')

}
catch(err) {
    logger.info(err);
    expect(true).toBe(false)
  }
}

export async function addAlertSubscription(alertAdd){
    try { 
        logger.info("In the addAlertSubscription function")
        logger.info("In the addAlertSubscription alertADD details ", alertAdd.getname())
        reporter.startStep('Add Alert Subscription '+ alertAdd.getname());
        //reporter.severity(Severity.Normal)
        await expect(page).toMatchElement('button[title="Add Alert"]', {timeout: 10000})
        logger.info("found alert add")
        await expect(page).toClick('button[title="Add Alert"]')
        logger.info("clicked add alert")
        var action = await performAction("type", addAlertForm.input.alertName, "page", alertAdd.getname())
        expect(action).toBeTruthy()
        let screenshot = await customScreenshot('alertpage1Name.png', 1920, 1200)
        reporter.addAttachment("Alert Page1_"+alertAdd.getname(), screenshot, "image/png");
        if (alertAdd.getlabel() != "") {
            action = await performAction("click", addAlertForm.button.newLabel, "page")
            expect(action).toBeTruthy()
            await delay(2000)
            action = await performAction("type", addAlertForm.input.labelKey, "page", alertAdd.getlabel().split(":")[0])
            expect(action).toBeTruthy()
            await delay(2000)
            action = await performAction("type", addAlertForm.input.labelValue, "page", alertAdd.getlabel().split(":")[1])
            expect(action).toBeTruthy()
            let screenshot = await customScreenshot('alertpage1.png', 1920, 1200)
            reporter.addAttachment("Alert Page1_"+alertAdd.getname(), screenshot, "image/png");
        }
        
        action = await performAction("click", addAlertForm.button.next, "page")
        expect(action).toBeTruthy()
        logger.info('Clicked the Next button 1 '+ alertAdd.getname());

        action = await performAction("click", addAlertForm.div.monitorMetric, "page")
        expect(action).toBeTruthy()
        await expect(page).toClick('li', { text: alertAdd.getAlertType(alertAdd.getalert_if())})

        if (alertAdd.getalert_is() == "Default") {
            //No action here, default selections are used
            } else {
                const page2formSelectionElem = await page2formRows[1]
            }

        if (alertAdd.getalert_for() == "Default") {
            //No action here, Default duration is set - 5 minutes
            } else {
                var time = alertAdd.getalert_for().split(":")[0]
                var duration = alertAdd.getalert_for().split(":")[1]
                logger.info('alertAdd.getalert_for().split(":")[0] =', alertAdd.getalert_for().split(":")[0])
                action = await performAction("type", addAlertForm.input.durationValue, "page", alertAdd.getalert_for().split(":")[0], true)
                expect(action).toBeTruthy()
                action = await performAction("click", addAlertForm.div.durationUnit, "page")
                expect(action).toBeTruthy()
                if (alertAdd.getalert_for().split(":")[1] == 'Min') {
                    await expect(page).toClick('li', { text: 'Minutes'})
                } if (alertAdd.getalert_for().split(":")[1] == 'Hour') {
                    await expect(page).toClick('li', { text: 'Hours'})
                } if (alertAdd.getalert_for().split(":")[1] == 'Days') { 
                    await expect(page).toClick('li', { text: 'Days'})
                } 
            }
        screenshot = await customScreenshot('alertpage2.png', 1920, 1200)
        reporter.addAttachment("Alert Page2_"+alertAdd.getname(), screenshot, "image/png");
        action = await performAction("click", addAlertForm.button.next, "page")
        expect(action).toBeTruthy()
        logger.info('Clicked the Next button 2 '+ alertAdd.getname());


        action = await performAction("click", addAlertForm.div.scope, "page")
        expect(action).toBeTruthy()
        if (alertAdd.getscope().split(":")[0] == 'Org') {
            logger.info('Clicking scope as =', alertAdd.getscope().split(":")[0])
            await expect(page).toClick('li.ant-select-dropdown-menu-item', { text: 'Org'})
            await delay(2000) //Wait for 2 sec for the next menu to be available
            logger.info('Waited 2 seconds Clicking scope as =', alertAdd.getscope().split(":")[0])
            
            //const scope = await page.$('li', { text: scopeText, visible: true })
            //await scope.click()
            action = await performAction("click", addAlertForm.input.subScope, "page")
            expect(action).toBeTruthy()
            if (alertAdd.getscope().split(":")[1] == 'All') {
                logger.info('Clicking sub scope as =', alertAdd.getscope().split(":")[1])
                await expect(page).toClick('li', { text: 'My org and my child orgs'})
            } else if ((alertAdd.getscope().split(":")[1]).toLowerCase() == 'myorg') {
                logger.info('Clicking sub scope as =', alertAdd.getscope().split(":")[1])
                await expect(page).toClick('li', { text: 'My org'})
            }
        } else if (alertAdd.getscope().split(":")[0] == 'iNode') {
            logger.info('Clicking scope as =', alertAdd.getscope().split(":")[0])
            await expect(page).toClick('li.ant-select-dropdown-menu-item', { text: 'iNode'})
            await delay(2000) //Wait for 2 sec for the next menu to be available
            logger.info('Waited 2 seconds Clicking scope as =', alertAdd.getscope().split(":")[0])
            const cpage3formRows = await page.$$('div.ant-form-item');
            logger.info('2nd row Again cpage3formRows =', await cpage3formRows.length)
            const page3formElemOrg = await cpage3formRows[1]
            await expect(page3formElemOrg).toClick('div[class="ant-form-item-control"]')
            //await performAction("click", "//input[@placeholder='Select iNode']")
            await performAction("click", "//li[text()='Select by Name']")
            await delay(1000)
                logger.info("org name is " + alertAdd.getorg_name())
                await expect(page).toClick('li[class="ant-cascader-menu-item ant-cascader-menu-item-expand"]', { text: alertAdd.getorg_name()})
                await delay(500)
                logger.info("node name is " + alertAdd.getnode_name())
                let scopeNode = new RegExp(`^${alertAdd.getnode_name()}$`, 'i')
                await expect(page).toClick('li[class="ant-cascader-menu-item"]', { text: scopeNode})
                await delay(500)
                //Third row is available for tunnel and service alerts
                logger.info("alert for" + alertAdd.getalert_if())
                if (alertAdd.getalert_if() == "Tunnel")
                {
                    const cpage3formRows = await page.$$('div.ant-form-item');
                    logger.info('3rd row Again cpage3formRows =', await cpage3formRows.length)
                    logger.info(alertAdd.gettunnel_name().split(":"))
                    const page3formElemOrg = await cpage3formRows[2]
                    await expect(page3formElemOrg).toClick('div[class="ant-form-item-control"]')
                    await delay(1000)
                    await expect(page).toClick('li[class="ant-cascader-menu-item ant-cascader-menu-item-expand"]', { text: alertAdd.gettunnel_name().split(":")[0]})
                    await delay(500)
                    let tunnel_name= ""
                    if (alertAdd.gettunnel_name().split(":").length == 3){
                        tunnel_name = alertAdd.gettunnel_name().split(":")[1]+" / "+alertAdd.gettunnel_name().split(":")[2] 
                        logger.info(tunnel_name) 
                    } else {
                        tunnel_name = alertAdd.gettunnel_name().split(":")[1]
                    }
                    await expect(page).toClick('li[class="ant-cascader-menu-item"]', { text: tunnel_name})
                    await delay(500)   
                } else if (alertAdd.getalert_if() == "Service")
                {
                    const cpage3formRows = await page.$$('div.ant-form-item');
                    logger.info('Again cpage3formRows =', await cpage3formRows.length)
                    const page3formElemOrg = await cpage3formRows[2]
                    await expect(page3formElemOrg).toClick('div[class="ant-select-selection__placeholder"]')
                    await delay(1000)
                    logger.info(alertAdd.getservice_name())
                    await performAction("click", `//li[contains(@class,'ant-select-dropdown-menu-item')][text()='${alertAdd.getservice_name()}']`)
                    //await expect(page).toClick('li[class="ant-select-dropdown-menu-item"]', { text: alertAdd.getservice_name()})
                    await delay(500)
                } 
        }  

        await delay(1000)
        screenshot = await customScreenshot('alertpage3.png', 1920, 1200)
        reporter.addAttachment("Alert Page3_"+alertAdd.getname(), screenshot, "image/png");
        logger.info('Clicked the Next button 3 '+ alertAdd.getname());
        await expect(page).toMatchElement('span', { text: 'Next'})
        await expect(page).toClick('span', { text: 'Next'})
        await delay(5000)
        

        if (alertAdd.getchannel().split(":")[0] == 'Webhook') {
            action = await performAction("click", addAlertForm.div.webhook , "page")
            expect(action).toBeTruthy()
            action = await performAction("click", addAlertForm.div.selectWebhook , "page")
            expect(action).toBeTruthy()
            await delay(5000)
            action = await performAction("click", "//li//span[text()='"+alertAdd.getchannel().split(":")[1]+"']" , "page")
            expect(action).toBeTruthy()
        }

        screenshot = await customScreenshot('alertpagesave.png', 1920, 1200)
        reporter.addAttachment("Alert Details_"+alertAdd.getname(), screenshot, "image/png");
        logger.info('Clicked the Save button '+ alertAdd.getname());
        await expect(page).toMatchElement('span', { text: 'Save'})
        await expect(page).toClick('span', { text: 'Save'})

        await delay(2000)//should see the notification in green
        //expect(await page.waitForSelector('.ant-message > span', { text: 'Alert created successfully' }) ? true : false).toBe(true);
        await expect(page).toMatchElement('.ant-message > span', { text: 'Alert created successfully', timeout: 5000 })
        screenshot = await customScreenshot('alertCreated.png', 1920, 1200)
        reporter.addAttachment("Alert Subscription Created", screenshot, "image/png");
        logger.info('Alert Subscription is Created ');
        reporter.endStep()
        await delay(5000)//waiting for 5 seconds
    
} catch(err) {
    logger.info(err);
    expect(true).toBe(false)
  }

}

export async function deleteAllAlertSubscription(){
    try { 
        logger.info("Get goToAlert ")
        await goToAlertPage()
        const alertContent =  await page.$$('tbody.ant-table-tbody')
        const rows = await alertContent[0].$$('tr.ant-table-row-level-0')
        //logger.info('how many ROWS?', (rows.length))
        //let disabled_count = 0
        for (var ii=0; ii < rows.length; ii++) {
            const alertContent =  await page.$$('tbody.ant-table-tbody')
            const rows = await alertContent[0].$$('tr.ant-table-row-level-0')
            //var texts  = await rows[disabled_count].$$eval('div', nodes => nodes.map(n => n.innerText))
            //logger.info("text1 " + texts)
            let action = await performAction("click", manageAlerts.button.dropDownTrigger, rows[0])
            expect(action).toBeTruthy()
            await delay(1000)
            action = await performAction("click", manageAlerts.button.deleteAlert, "page")
            expect(action).toBeTruthy()
            let result = await verifyModal("deleteAlert")
            expect(result).toBeTruthy()
            await performAction("click", modals.button.primary)
            logger.info("Alert subscription Clicked Delete in confirmation popup")
            await delay(5000)
        }
        return null  
    } catch(err) {
        logger.error(err);
        expect(true).toBe(false)
    }
}

export async function cleanupAlert(alertName) {
    try {
        let result;
        var action;
        //goto alerts page
        await goToAlertPage()
        //delete alert
        let elemXPath = "//td//span[text()='"+alertName+"']//ancestor::tr//button[@class='ant-btn ant-dropdown-trigger']"
        action = await performAction("hover", elemXPath , "page")
        expect(action).toBe(true)
        await delay(2000)
        action = await performAction("click", manageAlerts.button.deleteAlert , "page")
        expect(action).toBe(true)
        await delay(3000)
        action = await performAction("click", manageAlerts._delete_modal.delete , "page")
        expect(action).toBe(true)
        //LAT-15163
        //result = await page.waitForXPath(manageAlerts._delete_modal.success, {timeout: 10000}) ? true : false;
        //expect(result).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}
