import { goToTabsInNodePage } from '../helper/node';
import { delay, customScreenshot, findBySelector, performAction, verifyModal } from '../../utils/utils'
import { logger } from '../log.setup';
import { del } from 'openstack-client/lib/util';
import { isVariableDeclaration } from '@babel/types';
import { modals, servicesTab } from '../constants/locators';
import { modalProperties } from '../constants/modals';

const fs = require('fs');

export async function serviceStatus(name, status)
{

    try {
        logger.info('Service status is '+ status);
        logger.info('Service name is '+ name);
            //await goToTabsInNodePage("Networks") //A way to overcome the service tab called twice

            const serviceHandle = await goToService(name)
            //await serviceHandle.focus()
            await customScreenshot('ServicePage.png', 1920, 1200)
            reporter.startStep(`Verify Service status is ${status}`);
            //await expect(page).toMatchElement('span, [class="ant-tag"]', { text: status })
            //const serviceStatus = await findBySelector(getServiceHandle(), 'span.ant-tag', status) //await page.$('span.ant-tag', { text: status, visible: true }) 
            //Find Replica services
            let replicaStatus = await findBySelector(serviceHandle, 'a', "Show Status") //await page.$('span.ant-tag', { text: status, visible: true })
            logger.info(`replica status is ${replicaStatus}`)
            if (replicaStatus != null)
            { 
                await replicaStatus.click()
                let replicas = await serviceHandle.$x("./following-sibling::tr[contains(@class,'ant-table-expanded-row-level-1')]")
                //let replicas = await serviceHandle.$$(".ant-table-expanded-row-level-1")
                logger.info(`Got replicas tr ${replicas.length}`)
                if (replicas.length != 0){
                    let retStatus = await verifyReplicaServiceStatus(replicas[0], status)
                    logger.info(retStatus)
                    let screenshot2 = await customScreenshot('serviceStatus.png', 1920, 1200)
                    reporter.addAttachment("Service Status", screenshot2, "image/png");
                    logger.info('Verified Service status is ', status);
                    reporter.endStep()
                    return retStatus
                } else {return false}
            }
            for (var count=1; count<=20; count++)
            { 
                let serviceStatus = await findBySelector(serviceHandle, 'span.ant-tag', status) //await page.$('span.ant-tag', { text: status, visible: true })
                if (serviceStatus != null)
                { 
                    await serviceStatus.click()
                    await delay(1000)
                    break
                } else {
                    logger.info("Loop Count is" + count + "/20. Waiting for 15 seconds")
                    await delay(15000)
                }
            }
            let screenshot = await customScreenshot('serviceStatus.png', 1920, 1200)
            reporter.addAttachment("Service Status", screenshot, "image/png");
            logger.info('Verified Service status is ', status);
            reporter.endStep()

            if (count == 21){return false}
            return true
    }
    catch(err) {
        logger.info(err);
        return false
      }
}

export async function addService(serviceName, appName, networkName, appAttributes = {}, error="")
{

    try {
        logger.info('Add Service '+ serviceName);
        await goToTabsInNodePage("Services") 
            //await serviceHandle.focus()
            reporter.startStep('Add Service '+ serviceName);
            await expect(page).toMatchElement('button[title="Add Service"]')
            await expect(page).toClick('button[title="Add Service"]')
            await delay(5000)
            if (appName == 'All Components of Service Template') {
                console.log('Onto QA service block')
                await expect(page).toMatchElement('div[title="All Components of Service Template"]')    
                await expect(page).toClick('div[title="All Components of Service Template"]')    
                await delay(1000)
                await expect(page).toFill('input[placeholder="Service Name"]', serviceName)
                await expect(page).toClick('div[id$="_networkid"]')
                await delay(1000)
                logger.info('Waiting for network dropdown '+ serviceName);
                await expect(page).toClick('li', { text: networkName})

                await expect(page).toMatchElement('span', { text: 'Select a previously uploaded License'})
                await expect(page).toClick('span', { text: 'Select a previously uploaded License'})
                await delay(2000)
                await expect(page).toClick('div[id$="_license"]')
                await delay(1000)
                logger.info('Waiting for license dropdown ');
                await expect(page).toClick('li', { text: appAttributes.license})

                await expect(page).toMatchElement('span', { text: 'Iam EULA no default value'})
                await expect(page).toClick('span', { text: 'Iam EULA no default value'})
                await delay(2000)
                
                const elemExists = await page.waitForXPath("(//div[@class='ant-select-selection__rendered'])[5]", { timeout: 30000 }) ? true : false;
                console.log(elemExists)
                const [view] = await page.$x("(//div[@class='ant-select-selection__rendered'])[5]", { visible: true })
                console.log(view)
                await view.click()
                await expect(page).toClick('li', { text: "config.json"})
        

            }
            if (appName == 'SkySpark')
            {
                await expect(page).toMatchElement(`div[title=${appName}]`)
                await expect(page).toClick(`div[title=${appName}]`)
                await delay(1000)
                await addSkySpark(serviceName, appName, networkName, appAttributes)
            }  
            if(appName == 'ThingWorx') {
                await expect(page).toMatchElement(`div[title=${appName}]`)
                await expect(page).toClick(`div[title=${appName}]`)
                await delay(2000)
                await expect(page).toFill('input[placeholder="Service Name"]', serviceName)
                /*
                await expect(page).toClick('div[id$="_networkid"]')
                await delay(1000)
                logger.info('Waiting for network dropdown '+ serviceName);
                //await expect(page).toClick('li[text^=" '+networkName+'"]')
                await expect(page).toClick('li', { text: networkName})
                //const serviceStatus = await findBySelector(getServiceHandle(), 'span.ant-tag', status) //await page.$('span.ant-tag', { text: status, visible: true }) 
                */
                await delay(2000)
                let action = await performAction("click", "//div[contains(@id,'_networkid')]//div[contains(@class,'ant-select-selection__rendered')]")
                expect(action).toBeTruthy()
                await delay(5000)
                let screenshot = await customScreenshot('networkdropdown.png', 1920, 1200)
                reporter.addAttachment("networkdropdown", screenshot, "image/png");
                action = await performAction("click", "//li[contains(text(),'"+networkName+"')]")
                expect(action).toBeTruthy()
            }
            //If version is different for Niagara, use this.
            if (appName == 'Niagara 4') {
            // && (appAttributes != {})) {
                await expect(page).toMatchElement(`div[id$="niagara4"]`)
                await expect(page).toClick(`div[id$="niagara4"]`)
                await delay(1000)
                await expect(page).toFill('input[placeholder="Service Name"]', serviceName)
                await expect(page).toClick('div[id$="_networkid"]')
                await delay(1000)
                logger.info('Waiting for network dropdown '+ serviceName);
                //await expect(page).toClick('li[text^=" '+networkName+'"]')
                await expect(page).toClick('li', { text: networkName})
                await delay(2000)
                logger.info('Network selected');
                //if(appAttributes != {}) {
                //await expect(page).toClick('div[id="vKGfh"]')
                //await delay(1000)
                //logger.info('Waiting for Version dropdown '+ appAttributes.version);
                //await expect(page).toClick('li[text^=" '+networkName+'"]')
                //await expect(page).toClick('li', { text: appAttributes.version})
            //}
                await expect(page).toClick("span.ant-checkbox")
                //let agreeHandle = await page.$$("span.ant-checkbox")
                //logger.info("agree handle ")
                //await agreeHandle[1].click()
                logger.info("Agreed the license")
                await delay(1000)
            }
            if (appName == 'Custom') {
                await expect(page).toMatchElement(`div[title=${appName}]`)
                await expect(page).toClick(`div[title=${appName}]`)
                await delay(1000)
                await expect(page).toFill('input[placeholder="Service Name"]', serviceName)
                await expect(page).toClick('div[id$="_networkid"]')
                await delay(1000)
                logger.info('Waiting for network dropdown '+ serviceName);
                //await expect(page).toClick('li[text^=" '+networkName+'"]')
                await expect(page).toClick('li', { text: networkName})
                await expect(page).toMatchElement('span', { text: 'Next'})
                await expect(page).toClick('span', { text: 'Next'})
                await delay(1000)
                logger.info('Clicked the next button '+ serviceName);

                let filePath = `./utils/${appAttributes.fileName}`
                let rawdata = fs.readFileSync(filePath,  'utf8');
                logger.info(rawdata);

                await expect(page).toFill('textarea[placeholder="Input a valid service template"]', rawdata)
                await delay(1000)
            }
            if (appName == 'PostgreSQLDevelop')
            {
                await expect(page).toMatchElement(`div[title=${appName}]`)
                await expect(page).toClick(`div[title=${appName}]`)
                await page.setViewport({width:1300, height:650});
                await delay(1000)
                await addPostgreSQL(serviceName, networkName, appAttributes)
            } 
            else if (appName == 'KeaDevelop')
            {
                await expect(page).toMatchElement(`div[title=${appName}]`)
                await expect(page).toClick(`div[title=${appName}]`)
                await delay(1000)
                await addKea(serviceName, networkName, appAttributes)
            } 
            else if (appName == 'PowerDNSDevelop')
            {
                await expect(page).toMatchElement(`div[title=${appName}]`)
                await expect(page).toClick(`div[title=${appName}]`)
                await delay(1000)
                await addPowerDNS(serviceName, networkName, appAttributes)
            } 
            else if (appName == 'NTPDevelop')
            {
                await expect(page).toMatchElement(`div[title=${appName}]`)
                await expect(page).toClick(`div[title=${appName}]`)
                await delay(1000)
                await addNTP(serviceName, networkName, appAttributes)
            } 

            await expect(page).toMatchElement('span', { text: 'Submit'})
            await expect(page).toClick('span', { text: 'Submit'})
            await delay(2000)
            if (error == "") {
                await expect(page).toMatchElement('.ant-message > span', { text: 'Service created successfully', timeout: 20000 })
                let screenshot = await customScreenshot('serviceCreated.png', 1366, 768)
                reporter.addAttachment("Service Created ", screenshot, "image/png");
                logger.info('Service is Created successfully');
            } else {
                const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-error']//span[text()='"+error+"']", {timeout: 10000}) ? true : false;
                expect(elemExists).toBe(true)
                let action = await performAction("click", "//button//span[text()='Cancel']")
                expect(action).toBeTruthy()
            }
            reporter.endStep()
            await delay(15000)//waiting for 5 seconds

            return true
    }
    catch(err) {
        logger.info(err);
        return false
      }
}

export async function goToService(serviceName)
{
    try {
        await goToTabsInNodePage("Services")
        logger.info("Get goToService ", serviceName)
        const tabsContent =  await page.$$('.ant-tabs-content')
        const tabs = await tabsContent[0].$$('.ant-tabs-tabpane-active', { visible: true })
        const services = await tabs[0].$$('button.ant-dropdown-trigger', { visible: true })
        const rows = await tabs[0].$$('tr.ant-table-row-level-0')
        logger.info('how many Services?', (rows.length))
        for (var ii=0; ii < rows.length; ii++) {
            let valueHandle = await rows[ii].getProperty('innerText');
            let linkText = await valueHandle.jsonValue();
            logger.info("Services ROWS content = ", linkText)
            //expect(await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))).toEqual(['Hello!', 'Hi!']);
            const texts  = await rows[ii].$$eval('td', nodes => nodes.map(n => n.innerText))
            if (texts.includes(serviceName)) {
            expect(await rows[ii].$$eval('td', nodes => nodes.map(n => n.innerText))).toContain(serviceName) 

            //if (await rows[ii].$$('span', { text: networkName }) ? true : false) {
                logger.info("Returning Handle from goToService")
                return rows[ii]
            }
        }
        return null
    }
    catch(err) {
        logger.info(err);
      }
}
export async function goToServiceAction(serviceName, action){
    try { 
        await goToTabsInNodePage("Services")
        logger.info("Get goToServiceAction ", serviceName, action)

        const service = await goToService(serviceName)
        const netGear = await service.$('button.ant-dropdown-trigger', { visible: true }) 
        await netGear.hover()
        //await expect(page).toClick('button', { title: 'View Network'}) 
        await delay(1000)
        if (action == "view") {
        await (page
            .waitForXPath("//button[contains(@title, 'View Service')]", { visible: true })
            .then(() => logger.info('Waiting for gear button to show View Service')))
        
        const [view] = await page.$x(".//button[contains(@title, 'View Service')]", { visible: true })
        await view.click()
        }
        else if (action == "edit") {
                await (page
                    .waitForXPath("//button[contains(@title, 'Edit Service')]", { visible: true })
                    .then(() => logger.info('Waiting for gear button to show Edit Service')))
                
                const [view] = await page.$x(".//button[contains(@title, 'Edit Service')]", { visible: true })
                await view.click()
        }
        else if (action == "logs") {
                await (page
                    .waitForXPath("//button[contains(@title, 'Service Logs')]", { visible: true })
                    .then(() => logger.info('Waiting for gear button to show Service Logs')))
                
                const [view] = await page.$x("//button[contains(@title, 'Service Logs')]", { visible: true })
                await view.click()
        }
        else if (action == "restart") {
            await logger.info("Restarting service")
            let handle = await page.$("button[title='Restart Service']")
            await handle.click()
            await delay(1000)
            const confirmRestart = await page.$$('.ant-modal-title', { text: 'Restart Service?' })
            logger.info("Waiting for modal - Confirm Restart " + confirmRestart.length)
            if (confirmRestart.length > 0) {
                await expect(page).toClick('div.ant-modal-footer span', { text: 'Yes - Restart Service' })
                await delay(3000)
            }
        }

    } catch(err) {
        logger.info(err);
      }

}

export async function deleteAllServices(){
    try {
        await goToTabsInNodePage("Services") 
        logger.info("Get all Services checkbox")
        //const tabsContent =  await page.$('.ant-tabs-content')
        //const tableContent =  await tabsContent.$('.ant-table-content')
        //const thead = await tableContent.$('.ant-table-thead')
        //const checkAllNetworks = await thead.$('input.ant-checkbox-input')
        const tabsContent =  await page.$$('.ant-tabs-content')
        logger.info("tabsContent", tabsContent.length)
        const tabs = await tabsContent[0].$$('.ant-tabs-tabpane-active', { visible: true })
        //const networks = await tabs[1].$$('button.ant-dropdown-trigger', { visible: true })
        const head = await tabs[0].$('div.ant-table-selection')
        if (head == null){
            logger.info("No services found")
            return
        }
        await head.click()
        await delay(2000)
        logger.info("Checked check box All services")
        let res = await performAction("click", servicesTab.button.deleteNetworks)
        expect(res).toBeTruthy()
        //await expect(page).toClick('button[title=" Delete Services"]')
        await delay(2000)
        await page.waitForXPath(modals.div.title)
        res = await verifyModal("deleteService")
        expect(res).toBeTruthy()
        await performAction("click", modals.button.primary)
        await delay(5000)
    }
    catch(err) {
        logger.info(err);
        expect(true).toBe(false)
      }

}

export async function deleteService(serviceName){
    try {
        reporter.startStep(`Delete service ${serviceName}`)
        const service = await goToService(serviceName)
        let checkbox = await service.$('span.ant-checkbox-inner')
        await checkbox.click()
        await expect(page).toClick('button[title=" Delete Services"]')
        await expect(page).toClick('div.ant-modal-footer span', { text: 'Delete' })
        await expect(page).toMatchElement('.ant-message > span', { text: 'Deleted successfully', timeout: 20000 })
        let screenshot = await customScreenshot('serviceDeleted_'+ serviceName + '.png', 1920, 1200)
        reporter.addAttachment("Service deleted_" + serviceName, screenshot, "image/png");
        reporter.endStep();
    }
    catch(err) {
        logger.info(err);
        expect(true).toBe(false)
      }

}


export async function addSkySpark(serviceName, appName, networkName, appAttributes = {})
{

    await expect(page).toFill('input[placeholder="Service Name"]', serviceName)
    await expect(page).toFill('input[placeholder="Super User Password"]', appAttributes.password)
    if(appAttributes.httpPort != undefined) {
        await expect(page).toFill('input[placeholder="HTTP Port"]', appAttributes.httpPort)
    }
    await expect(page).toMatchElement('span', { text: 'Next'})
    await expect(page).toClick('span', { text: 'Next'})
    await delay(1000)

    await expect(page).toClick('div[id$="_networkid"]')
    await delay(1000)
    logger.info('Waiting for network dropdown ');
    //await expect(page).toClick('li[text^=" '+networkName+'"]')
    await expect(page).toClick('li', { text: networkName})
    await expect(page).toMatchElement('span', { text: 'Next'})
    await expect(page).toClick('span', { text: 'Next'})
    await delay(1000)


    await expect(page).toMatchElement('span', { text: 'Select a previously uploaded License'})
    await expect(page).toClick('span', { text: 'Select a previously uploaded License'})
    await delay(2000)
    await expect(page).toClick('div[id$="_license"]')
    await delay(1000)
    logger.info('Waiting for license dropdown ');
    await expect(page).toClick('li', { text: appAttributes.license})

    if (appAttributes.ssh != undefined) {
        logger.info("Selecting ssh")
        await expect(page).toMatchElement('span', { text: 'Enable Secure Shell'})
        await expect(page).toClick('span', { text: 'Enable Secure Shell'})
        await delay(1000)
        await expect(page).toMatchElement('span', { text: 'Select a previously specified SSH public key'})
        await expect(page).toClick('span', { text: 'Select a previously specified SSH public key'})
        await delay(2000)
        await expect(page).toClick('div[id$="_ssh"]')
        await delay(2000)
        logger.info('Waiting for ssh dropdown ');
        let dropdown = await page.$$(".ant-select-dropdown")
        await expect(dropdown[2]).toClick('li', { text: appAttributes.ssh})
        logger.info("Selected ssh")
        await delay(1000)        
        //let listhandle = await page.$(`li[text=${appAttributes.ssh}]`)
        //await listhandle.click()
    }


    await expect(page).toMatchElement('span', { text: 'Next'})
    await expect(page).toClick('span', { text: 'Next'})
    await delay(1000)

    if (appAttributes.version != undefined) {
        logger.info("in version")
            let version = await page.$x("//label[contains(@title, 'Select Version')]//ancestor::div[contains(@class, 'ant-form-item-label')]/following-sibling::div")
            logger.info(version.length)
            if (version.length > 0 )
                {await version[0].click()} 
            else 
                {logger.error("Version dropdown not found")}
            await delay(2000)
            await expect(page).toClick('li', { text: appAttributes.version})
    }

    let agreeHandle = await page.$$("span.ant-checkbox")
    logger.info("agree handle ", agreeHandle.length)
    await agreeHandle[1].click()
    logger.info("Agreed the license")
    await delay(1000)
    //await expect(page).toClick('span', { text: 'Accept the '})
    //await delay(1000)
}

export async function verifyServiceRestartCount (serviceName, expectedCount) {
    reporter.startStep("Restart count is incremented");

    logger.info("in verifyServiceRestartCount")
    await goToTabsInNodePage("Services")
    const service = await goToService(serviceName)
    var expandHandle = await service.$('div.ant-table-row-expand-icon',{ visible: true })
    //logger.info("service expand ", expandHandle)
    await expandHandle.click()
    logger.info("clicked expand")
    await delay(1000)
    for(let loop=0; loop<6; loop++){
        const containerPane = await page.$$('tr.ant-table-expanded-row-level-1',{ visible: true })
        logger.info("pane ", containerPane.length)
        const containerTable = await containerPane[1].$('tbody.ant-table-tbody')
        const containers = await containerTable.$$('tr.ant-table-row-level-0')
        logger.info("container length ", containers.length)
        var restStatus = true
        for (let count=0; count<containers.length; count++)
        {
            logger.info("Container", count)
            let containerColumns = await containers[count].$$('td')
            let restartCount = await containerColumns[3].getProperty("innerText")
            let value = await restartCount.jsonValue();
            if (value != expectedCount){
                restStatus = false
                logger.info("Restart count did not match expected count - ", expectedCount )
            }
            logger.info("Restart count is ", value)
        } 
        if (restStatus){break}
        await delay(10000)
    }

    let screenshot = await customScreenshot('restart_counter.png', 1920, 1500)
    reporter.addAttachment("Service Restart counter", screenshot, "image/png");

    expandHandle = await service.$('div.ant-table-row-expand-icon',{ visible: true })
    await expandHandle.click()
    await delay(1000)
    reporter.endStep();
    return restStatus
}

export async function goToServiceSecrets(tabName)
{
    const elemXPath1 = "//span[span= 'Services']//ancestor::li[contains(@class, 'ant-menu-submenu-open')]"
    const elemExists1 = await page.$x(elemXPath1)
    logger.info(elemExists1)
    if (elemExists1.length == 0) {
        logger.info('Services submenu not open')
        await expect(page).toClick('span.nav-text', { text: 'Services' })
        //await page.waitFor(2000)
    }
    await expect(page).toMatchElement('span', { text: 'Service Secrets' })
    await expect(page).toClick('span', { text: 'Service Secrets' })
    logger.info("clicked service secrets")
    await delay(2000)
    await expect(page).toMatchElement('div.ant-tabs-tab',{text: tabName})
    await expect(page).toClick('div.ant-tabs-tab',{text: tabName})
    logger.info("clicked ", tabName)
    await delay(2000)
}

export async function addVolume (volumeName, fileName) {
    reporter.startStep(`Add Volume ${volumeName}`)
    await goToServiceSecrets("Volumes")
    await expect(page).toClick('button[title="Add Volume"]')
    await expect(page).toFill('input[placeholder="volume Name"]', volumeName)
    await expect(page).toClick('button span', {text: 'Add File'})
    await expect(page).toFill('input[placeholder="File Name"]', fileName)
    await expect(page).toClick('label span', {text: 'Show File Contents'})
    let filePath = `./utils/${fileName}`
    let rawdata = fs.readFileSync(filePath,  'utf8');
    logger.info(rawdata);
    await expect(page).toFill('textarea[placeholder="Your file contents."]', rawdata)
    await expect(page).toClick('div.ant-modal-footer span', { text: 'Add Volume' })
    await expect(page).toMatchElement('.ant-message > span', { text: 'Volume created successfully', timeout: 20000 })
    let screenshot = await customScreenshot('volumeadded_'+ volumeName + '.png', 1920, 1200)
    reporter.addAttachment("Added Volume " + volumeName , screenshot, "image/png");
    reporter.endStep()
}

export async function goToVolume(name)
{
    try{
    await goToServiceSecrets("Volumes")
    await expect(page).toFill('input[placeholder="Filter Volumes by name"]', name)
    await page.waitForResponse(response =>
        response.url().includes(name)
        && (response.status() === 200
        && response.request().method() === 'GET')
        , 10);//wait for 10 sec
    await delay(2000)
    let pathVar = `//strong[text()="${name}"]//ancestor::tr[contains(@class,'ant-table-row-level-0')]`
    let rowExists = await page.waitForXPath(pathVar, {timeout: 3000})
    if (rowExists != null){
        logger.info("Volume found ", name)
        let row = await page.$x(pathVar)
        logger.info(row.length)
        return row[0]
    } else {
        logger.info("Volume not found/deleted ", name)
        return false
    }
    } catch(err) {
        logger.info(err)
        return false
    }
}

export async function deleteVolume(name)
{
    reporter.startStep(`Delete Volume ${name}`)
    let row = await goToVolume(name)
    await expect(row).toClick('span.ant-checkbox')
    await expect(page).toClick("button[title='Delete Volumes']")
    await expect(page).toClick(".ant-modal-footer button span", {text: 'Delete'})
    await expect(page).toMatchElement('.ant-message > span', { text: 'Deleted successfully', timeout: 20000 })
    let screenshot = await customScreenshot('volumedelete_'+ name + '.png', 1920, 1200)
    reporter.addAttachment("Delete Volume " + name , screenshot, "image/png");
    reporter.endStep()
}
export async function editSkySpark(serviceName, appName, networkName, appAttributes = {})
{
    await expect(page).toMatchElement('span', { text: 'Next'})
    await expect(page).toClick('span', { text: 'Next'})
    await delay(1000)
    logger.info("In Network setting Page")
    if (appAttributes.dns != undefined) {
        if (appAttributes.dns == 'default') {
            await expect(page).toClick('span', { text: 'Default'})            
        } else {
            await expect(page).toClick('span', { text: 'Custom'})
            await expect(page).toFill('input.dns-field-style', appAttributes.dns)
        }
    }
    await expect(page).toMatchElement('span', { text: 'Next'})
    await expect(page).toClick('span', { text: 'Next'})
    await delay(1000)

    await expect(page).toMatchElement('span', { text: 'Select a previously uploaded License'})
    await expect(page).toClick('span', { text: 'Select a previously uploaded License'})
    await delay(2000)
    await expect(page).toClick('div[id$="_license"]')
    await delay(1000)
    logger.info('Waiting for license dropdown ');
    await expect(page).toClick('li', { text: appAttributes.license})

    if (appAttributes.ssh != undefined) {
        logger.info("Selecting ssh")
        if (appAttributes.lastssh != 'enabled'){
        await expect(page).toMatchElement('span', { text: 'Enable Secure Shell'})
        await expect(page).toClick('span', { text: 'Enable Secure Shell'})
        await delay(1000)
        }
        await expect(page).toMatchElement('span', { text: 'Select a previously specified SSH public key'})
        await expect(page).toClick('span', { text: 'Select a previously specified SSH public key'})
        await delay(2000)
        await expect(page).toClick('div[id$="_ssh"]')
        await delay(2000)
        logger.info('Waiting for ssh dropdown ');
        //let dropdown = await page.$$(".ant-select-dropdown")
        //await expect(dropdown[2]).toClick('li', { text: appAttributes.ssh})
        await expect(page).toClick('li', { text: appAttributes.ssh, visible: true})
        logger.info("Selected ssh")
        await delay(1000)        
        //let listhandle = await page.$(`li[text=${appAttributes.ssh}]`)
        //await listhandle.click()
    }


    await expect(page).toMatchElement('span', { text: 'Next'})
    await expect(page).toClick('span', { text: 'Next'})
    await delay(1000)
    if (appAttributes.version != undefined) {
            logger.info("in version")
            let version = await page.$x("//label[contains(@title, 'Select Version')]//ancestor::div[contains(@class, 'ant-form-item-label')]/following-sibling::div")
            logger.info(version.length)
            if (version.length > 0 )
                {await version[0].click()} 
            else 
                {logger.error("Version dropdown not found")}
            await delay(2000)
            await expect(page).toClick('li', { text: appAttributes.version})
        }
    

    //let agreeHandle = await page.$$("span.ant-checkbox")
    //logger.info("agree handle ", agreeHandle.length)
    //await agreeHandle[1].click()
    //logger.info("Agreed the license")
    //await delay(1000)
    //await expect(page).toClick('span', { text: 'Accept the '})
    //await delay(1000)
    await expect(page).toMatchElement('span', { text: 'Submit'})
    await expect(page).toClick('span', { text: 'Submit'})
}

export async function verifySkySparkconfig(serviceName, appName, networkName, appAttributes = {})
{
    await expect(page).toMatchElement('span', { text: 'Next'})
    await expect(page).toClick('span', { text: 'Next'})
    await delay(1000)
    logger.info("In Network setting Page")
    if (appAttributes.dns != undefined) {
        if (appAttributes.dns == 'default') {
            const dnsresp = await expect(page).toMatchElement('span, [class="ant-radio ant-radio-checked"]', { text: 'Default'}) ? true : false;
            if (dnsresp == true) {
                logger.info("DNS config is proper")
            } else {
                logger.error("DNS config is improper")
            }
        } else {
            const dnsresp1 = await expect(page).toMatchElement('span, [class="ant-input-group"]', { value: appAttributes.dns }) ? true : false;
            if (dnsresp1 == true) {
                logger.info("DNS config is proper")
            } else {
                logger.error("DNS config is improper")
            }            
        }
    }
    await expect(page).toMatchElement('span', { text: 'Next'})
    await expect(page).toClick('span', { text: 'Next'})
    await delay(1000)
    const licensersp = await expect(page).toMatchElement('div[class="ant-select-selection-selected-value"]', { title: appAttributes.license}) ? true : false;
    if (licensersp == true) {
        logger.info("License config is proper")
    } else {
        logger.error("License config is improper")
    }   
    if (appAttributes.ssh != undefined) {
        const sshrsp = await expect(page).toMatchElement('div[class="ant-select-selection-selected-value"]', { title: appAttributes.ssh}) ? true : false;
    if (sshrsp == true) {
        logger.info("SSH config is proper")
    } else {
        logger.error("SSH config is improper")
    }   
    }
    await expect(page).toMatchElement('span', { text: 'Next'})
    await expect(page).toClick('span', { text: 'Next'})
    await delay(1000)
    if (appAttributes.version != undefined) {
        const versionrsp = await expect(page).toMatchElement('div[class="ant-select-selection-selected-value"]', { title: appAttributes.version}) ? true : false;
        if (versionrsp == true) {
            logger.info("Version config is proper")
        } else {
            logger.error("Version config is improper")
        }
        }
    

    //let agreeHandle = await page.$$("span.ant-checkbox")
    //logger.info("agree handle ", agreeHandle.length)
    //await agreeHandle[1].click()
    //logger.info("Agreed the license")
    //await delay(1000)
    //await expect(page).toClick('span', { text: 'Accept the '})
    //await delay(1000)
    await expect(page).toMatchElement('span', { text: 'Cancel'})
    await expect(page).toClick('span', { text: 'Cancel'})
}

export async function editniagara(serviceName, appName, networkName, appAttributes = {})
{
    logger.info("In Network setting Page")
    if (appAttributes.dns != undefined) {
        if (appAttributes.dns == 'default') {
            await expect(page).toClick('span', { text: 'Default'})            
        } else {
            await expect(page).toClick('span', { text: 'Custom'})
            await expect(page).toFill('input.dns-field-style', appAttributes.dns)
        }
    }
    await delay(1000)
    await expect(page).toMatchElement('span', { text: 'Submit'})
    await expect(page).toClick('span', { text: 'Submit'})
}

export async function verifyniagaraconfig(serviceName, appName, networkName, appAttributes = {})
{
    logger.info("In Network setting Page")
    if (appAttributes.dns != undefined) {
        if (appAttributes.dns == 'default') {
            const dnsresp = await expect(page).toMatchElement('span, [class="ant-radio ant-radio-checked"]', { text: 'Default'}) ? true : false;
            if (dnsresp == true) {
                logger.info("DNS config is proper")
            } else {
                logger.error("DNS config is improper")
            }
        } else {
            const dnsresp1 = await expect(page).toMatchElement('span, [class="ant-input-group"]', { value: appAttributes.dns }) ? true : false;
            if (dnsresp1 == true) {
                logger.info("DNS config is proper")
            } else {
                logger.error("DNS config is improper")
            }            
        }
    }
    await expect(page).toMatchElement('span', { text: 'Cancel'})
    await expect(page).toClick('span', { text: 'Cancel'})
}

export async function editqaservice(serviceName, appName, networkName, appAttributes = {})
{
    logger.info("In Network setting Page")
    await delay(1000)
    await expect(page).toMatchElement('span', { text: 'Submit'})
    await expect(page).toClick('span', { text: 'Submit'})
}

export async function addPostgreSQL(serviceName, networkName, appAttributes = {})
{
    await expect(page).toFill('input[placeholder="Service Name"]', serviceName)
    await expect(page).toFill('input[placeholder="Superuser Password"]', appAttributes.General.SuperuserPassword)
    await expect(page).toClick('div[id$="_networkid"]')
    await delay(1000)
    logger.info('Waiting for network dropdown ');
    await expect(page).toClick('li', { text: networkName})
    await expect(page).toFill('input[placeholder="IP Address"]', appAttributes.General.IPAddress)
    let kind = await page.$x(`//span[text()="${appAttributes.General.Kind}"]`)
    logger.info("kind is " + kind.length + `${appAttributes.General.Kind}`)
    await kind[0].click()

    await expect(page).toClick("span.ant-select-selection__choice__remove")
    logger.info("Removed candiate")
    await delay(2000)
    await expect(page).toClick("div.ant-select-selection__placeholder", {text: 'Please select iNodes by label or adding new key/value pair'})
    await expect(page).toClick("span.isreserved", {text: 'Candidate'})
    logger.info("clicked candiate")
    await expect(page).toClick("label[title='Run Services in iNodes']")
    await delay(2000)
    await expect(page).toClick('span', { text: 'Next'})

    await expect(page).toFill('input[placeholder="Database Name"]', appAttributes.DHCP.DatabaseName)
    await expect(page).toFill('input[placeholder="User Name"]', appAttributes.DHCP.UserName)
    await expect(page).toFill('input[placeholder="Password"]', appAttributes.DHCP.Password)
    await expect(page).toClick('span', { text: 'Next'})
    await delay(2000)
    logger.info("in dns tab")
    let dnstab = await page.$(".ant-tabs-tabpane-active")
    await expect(dnstab).toFill('input[placeholder="Database Name"]', appAttributes.DNS.DatabaseName)
    await expect(dnstab).toFill('input[placeholder="User Name"]', appAttributes.DNS.UserName)
    await expect(dnstab).toFill('input[placeholder="Password"]', appAttributes.DNS.Password)
    await expect(page).toClick('span', { text: 'Next'})

    let version_handle = await page.$x("//label[@title='Select Version']//parent::div//following-sibling::div/div")
    await version_handle[0].click()
    await expect(page).toClick('li', { text: appAttributes.Service.SelectVersion})

}

export async function addKea(serviceName, networkName, appAttributes = {})
{
    await expect(page).toFill('input[placeholder="Service Name"]', serviceName)
    await expect(page).toClick('div[id$="_networkid"]')
    await delay(1000)
    logger.info('Waiting for network dropdown ');
    await expect(page).toClick('li', { text: networkName})
    await expect(page).toFill('input[placeholder="IP Address"]', appAttributes.General.IPAddress)
    let kind = await page.$x(`//span[text()="${appAttributes.General.Kind}"]`)
    logger.info("kind is " + kind.length + `${appAttributes.General.Kind}`)
    await kind[0].click()
    await expect(page).toClick('span', { text: 'Next'})
    //await page.setViewport({width:1300, height:650});

    await expect(page).toClick('span', { text: 'Select a previously uploaded Kea DHCPv4 configuration'})
    await delay(3000)
    let dhcp_config = await page.$x("//label[@title='Select Kea DHCPv4 configuration']//parent::div//following-sibling::div/div")
    logger.info(`in dhcp ${dhcp_config.length}`)
    await dhcp_config[0].click()
    await expect(page).toClick('li', { text: appAttributes.Configuration.DhcpConfig})
    await delay(3000)
   
    await expect(page).toClick('span', { text: 'Select a previously uploaded Kea DDNS configuration'})
    await delay(3000)
    let ddns_config = await page.$x("//label[@title='Select Kea DDNS configuration']//parent::div//following-sibling::div/div")
    logger.info(`in ddns ${ddns_config.length}`)
    await ddns_config[0].click()
    await delay(3000)
    let dropdown = await page.$$(".ant-select-dropdown")
    await expect(dropdown[2]).toClick('li', { text: appAttributes.Configuration.DdnsConfig})
    //await expect(page).toClick('li', { text: appAttributes.Configuration.DdnsConfig})
    logger.info("Updated ddns")
    await expect(page).toClick('span', { text: 'Next'})
    logger.info("clicked next")

    let version_handle = await page.$x("//label[@title='Select Version']//parent::div//following-sibling::div/div")
    await version_handle[0].click()
    await expect(page).toClick('li', { text: appAttributes.Service.SelectVersion})
}


export async function addPowerDNS(serviceName, networkName, appAttributes = {})
{
    await expect(page).toFill('input[placeholder="Service Name"]', serviceName)
    await expect(page).toClick('div[id$="_networkid"]')
    await delay(1000)
    logger.info('Waiting for network dropdown ');
    await expect(page).toClick('li', { text: networkName})
    await expect(page).toFill('input[placeholder="IP Address"]', appAttributes.General.IPAddress)
    let kind = await page.$x(`//span[text()="${appAttributes.General.Kind}"]`)
    logger.info("kind is " + kind.length + `${appAttributes.General.Kind}`)
    await kind[0].click()
    await expect(page).toClick('span', { text: 'Next'})

    await expect(page).toFill('input[placeholder="PostgreSQL Service IP Address"]', appAttributes.Database.PostgreSQLServiceIPAddress)
    await expect(page).toFill('input[placeholder="Database Name"]', appAttributes.Database.DatabaseName)
    await expect(page).toFill('input[placeholder="User Name"]', appAttributes.Database.UserName)
    await expect(page).toFill('input[placeholder="Password"]', appAttributes.Database.Password)
    await expect(page).toClick('span', { text: 'Next'})

    await expect(page).toClick('span', { text: 'Select a previously uploaded DNS zone configuration'})
    await delay(2000)
    let zone_file = await page.$x("//label[@title='Select DNS zone configuration']//parent::div//following-sibling::div/div")
    logger.info(`in dhcp ${zone_file.length}`)
    await zone_file[0].click()
    await expect(page).toClick('li', { text: appAttributes.DNSZone.ZoneFile})
    await expect(page).toClick('span', { text: 'Next'})

    let version_handle = await page.$x("//label[@title='Select Version']//parent::div//following-sibling::div/div")
    await version_handle[0].click()
    await expect(page).toClick('li', { text: appAttributes.Service.SelectVersion})
    await expect(page).toFill('input[placeholder="Allow DNS Updates From"]', appAttributes.Service.AllowDNSUpdatesFrom)
    await expect(page).toFill('input[placeholder="Allow API Access From"]', appAttributes.Service.AllowAPIAccessFrom)
    await expect(page).toFill('input[placeholder="API Key"]', appAttributes.Service.APIKey)
    await expect(page).toClick('span', { text: 'Next'})
}

export async function addNTP(serviceName, networkName, appAttributes = {})
{
    await expect(page).toFill('input[placeholder="Service Name"]', serviceName)
    await expect(page).toClick('div[id$="_networkid"]')
    await delay(1000)
    logger.info('Waiting for network dropdown ');
    await expect(page).toClick('li', { text: networkName})
    await expect(page).toFill('input[placeholder="IP Address"]', appAttributes.General.IPAddress)
    let kind = await page.$x(`//span[text()="${appAttributes.General.Kind}"]`)
    logger.info("kind is " + kind.length + `${appAttributes.General.Kind}`)
    await kind[0].click()
    let version_handle = await page.$x("//label[@title='Select Version']//parent::div//following-sibling::div/div")
    await version_handle[0].click()
    await expect(page).toClick('li', { text: appAttributes.General.SelectVersion})
}

export async function verifyReplicaServiceStatus(handle, status)
{
    try{
    await delay(5000)
    const replicaTable = await handle.$$('tbody')
    //const replicaTable = await page.$$('tbody tbody', { visible: true })
    logger.info("replicaTable is ", replicaTable.length)
    let rows = await replicaTable[0].$$('.ant-table-row-level-0')

    logger.info(rows.length)
    if (rows.length == 0){
        return false
    }
    
    for (let i=0; i<rows.length; i++){
        for (var count=1; count<=20; count++)
        { 
            let serviceStatus = await findBySelector(rows[i], 'span.ant-tag', status) //await page.$('span.ant-tag', { text: status, visible: true })
            if (serviceStatus != null)
            { 
                await serviceStatus.click()
                await delay(1000)
                break
            } else {
                logger.info("Loop Count is" + count + "/20. Waiting for 15 seconds")
                await delay(15000)
            }
        }
        if (count == 21) {return false}
    }
    return true
    }
    catch(err) {
        logger.info(err);
        return false
    }
}