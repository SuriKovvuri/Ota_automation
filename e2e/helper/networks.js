import { goToTabsInNodePage } from '../helper/node';
import { customScreenshot, delay, getElementAttributes, performAction, navigatePageByClick, verifyModal, waitForNetworkIdle } from '../../utils/utils';
import { logger } from '../log.setup';
import expectPuppeteer from 'expect-puppeteer'
import { del } from 'openstack-client/lib/util';
import { NetworkAdd } from '../src/networkAdd';
import { addNetwork, modals, networksTab } from '../constants/locators';
import { modalProperties } from '../constants/modals';

//examples learning for xpath:
//const xpath = '//*[@class="elements"]//button[contains(text(), "Button text")]';
//const t2 = await page.$x('//*[@id="${variable}"]/a');
//const t3 = await page.$x('//*[@id="${variable}"]');
//logger.info(t2,t3);

//const [linkHandle] = await page.$x('//*[contains(@id, "postmessage_")]/a');
//const hrefHandle = await linkHandle.getProperty('href');
//const hrefValue = await hrefHandle.jsonValue();

export const networkname_error = "Network name may contain only the special characters . - _"
export const networkcidr_error = "The specified CIDR is invalid. Please provide a valid CIDR."
export const networkstartip_error = "Please enter a valid IP address"
export const networkendip_error = "Please enter a valid IP address"
export const networkgwip_error = "Please enter a valid IP address"


export async function goAllNetworks() {
    try {

        logger.info("Get all the networks available")
        const cardBodys = await page.$$('.ant-card-body')
        const cardBody = cardBodys.length
        logger.info('how many cardBodys?', (cardBody))
        for (var i = 0; i < cardBodys.length; i++) {
            //await logger.info("cardBody ",cardBodys[i])
            logger.info(i)
        }
        const cardGrids = await page.$$('.card-grid')
        const cardGrid = cardGrids.length
        logger.info('how many cardGrids?', (cardGrid))
        for (var ii = 0; ii < cardGrid.length; ii++) {
            await logger.info("cardGrids ", cardGrid[ii])
        }

        //first collapse all networks
        const networksTab_header = await cardBodys[3].$('.ant-row')
        //const collapseall = await page.waitForXPath( "//div[@class='ant-card-body'][3]/*/span[text()= 'Collapse All']", {timeout: 5000} );
        try {

            //await expect(cardBodys[3]).toMatchElement('span', { text: "Collapse All" })

            const collapseall = await page.waitForXPath("//div[@class='ant-card-body'][last()]//descendant::span[text()='Collapse All']", { timeout: 5000 }); //this thing might be flaky. Not sure it is a good idea!!!
            await collapseall.click();
            logger.info("Networks expanded,  collapsing the networks")
        } catch (e) {
            logger.info(e);
            logger.info("Networks all already collapsed")
        }



        const network_tab = await cardBodys[3].$('.ant-table-tbody')
        const networks = await network_tab.$$('.ant-table-row')
        const network = networks.length
        logger.info('how many network?', (network))

        const example = await network_tab.$$('span')
        for (var k = 0; k < example.length; k++) {
            //const test = await buttonHandle[k].getProperties()
            //await logger.info('network span?', (test))
            logger.info("example = ", await (await example[k].getProperty('innerText')).jsonValue());
        }



        const networkspath = await network_tab.$x('.//tr[contains(@class, "ant-table-row")]')
        const networkpath = networkspath.length
        logger.info('how many networkpath?', (networkpath))

        for (var j = 0; j < networks.length; j++) {
            //await logger.info("network ",networks[j])
            logger.info(j)
            const spans = await networks[j].$x('.//span')
            for (var jj = 0; jj < spans.length; jj++) {
                const test = await spans[jj].getProperties()
                //await logger.info('network span?', (test))
                logger.info(await (await spans[jj].getProperty('innerText')).jsonValue());

            }
            logger.info(j)
        }
        logger.info('New logic')

        const test = await getElementAttributes(network_tab, 'span', 'innerText')
        for (var kk = 0; kk < test.length; kk++) {
            //await logger.info("network ",networks[j])
            logger.info("tests = ", await test[kk])
        }


        return cardBody
    }
    catch (err) {
        logger.info(err);
    }
}

export async function getCountOfNetworks() {
    try {

        await goToTabsInNodePage("Networks")
        logger.info("Get getCountOfNetworks")
        const cardBodys = await page.$$('.ant-card-body')
        const cardBodysss = cardBodys.length
        logger.info('how many cardBodys?', (cardBodysss))
        try {
            const collapseall = await page.waitForXPath("//div[@class='ant-card-body'][last()]//descendant::span[text()='Collapse All']", { timeout: 5000 }); //this thing might be flaky. Not sure it is a good idea!!!
            await collapseall.click();
            logger.info("Networks expanded,  collapsing the networks")
        } catch (e) {
            logger.info(e);
            logger.info("Networks all already collapsed")
        }

        //const network_tab = await cardBodys.slice(-1).pop().$('.ant-table-tbody')
        const tabsContent = await page.$$('.ant-tabs-content')
        const tabsContentCount = tabsContent.length
        logger.info('how many tabs?', (tabsContentCount))
        for (var i = 0; i < tabsContentCount; i++) {
            let valueHandle = await tabsContent[i].getProperty('innerText');
            let linkText = await valueHandle.jsonValue();
            logger.info("tabs content = ", linkText)
        }
        const tabs = await tabsContent[0].$$('.ant-tabs-tabpane', { visible: true })
        const tabscount = tabs.length
        logger.info('how many tabs?', (tabscount))
        const networks = await tabs[0].$$('tr.ant-table-row-level-0', { visible: true })
        const networkCount = networks.length
        logger.info('how many network?', (networkCount))
        for (var ii = 0; ii < networkCount; ii++) {
            let valueHandle = await networks[ii].getProperty('innerText');
            let linkText = await valueHandle.jsonValue();
            logger.info("networks content = ", linkText)
        }
        const nnetworks = await tabs[0].$$('button.ant-dropdown-trigger', { visible: true })
        const nnetworkCount = nnetworks.length
        logger.info('how many Real network?', (nnetworkCount))

        const tan = await goToNetwork('tan23')
        if (tan !== null) {
            const checkbox = await tan.$('.ant-checkbox-input', { visible: true })
            await checkbox.focus()
            await checkbox.click()
            await delay(10000)
            await customScreenshot('test4.png', 1920, 1200)
        }
        else {
            logger.info("Missed the network name")
        }

        await goToNetworkAction('tan23', 'delete')
        await delay(2000)
        await customScreenshot('test8.png', 1920, 1200)
        await expect(page).toClick('button.ant-modal-close')

        await delay(2000)
        await customScreenshot('back.png', 1920, 1200)
        return nnetworkCount

    }
    catch (err) {
        logger.info(err);
    }
}


export async function expandAllTabsInNetworkPage() {
    try {
        logger.info("In the expandAllTabsInNetworkPage ")
        await expandTabsInNetworkPage('Remote Networks')
        await expandTabsInNetworkPage('Security')
        await expandTabsInNetworkPage('Services')
        await expandTabsInNetworkPage('Static Routes')
    }
    catch (err) {
        logger.info(err);
    }
}

export async function expandTabsInNetworkPage(tabname) {
    try {
        logger.info("In the expandTabsInNetworkPage =" + tabname)
        //await expect(page).toMatchElement('div[class$="ant-tabs-tab"] > span', { text: tabname })
        await expect(page).toMatchElement('.panel-header-text', { text: tabname })
        await expect(page).toClick('.panel-header-text', { text: tabname })
        logger.info("In the function Clicked expandTabsInNetworkPage tabname =" + tabname)
        await delay(1000)
    }
    catch (err) {
        logger.info(err);
    }

}

export async function goToNetwork(networkName) {
    try {
        await goToTabsInNodePage("Networks")
        logger.info("Get goToNetwork ", networkName)
        const tabsContent = await page.$$('.ant-tabs-content')
        const tabs = await tabsContent[0].$$('.ant-tabs-tabpane', { visible: true })
        const networks = await tabs[0].$$('button.ant-dropdown-trigger', { visible: true })
        const rows = await tabs[0].$$('tr.ant-table-row-level-0')
        //logger.info('how many ROWS?', (rows.length))
        for (var ii = 0; ii < rows.length; ii++) {
            let valueHandle = await rows[ii].getProperty('innerText');
            let linkText = await valueHandle.jsonValue();
            //logger.info("ROWS content = ", linkText)
            //expect(await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))).toEqual(['Hello!', 'Hi!']);
            const texts = await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))
            if (texts.includes(networkName)) {
                expect(await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))).toContain(networkName)

                //if (await rows[ii].$$('span', { text: networkName }) ? true : false) {
                logger.info("Returning Handle from goToNetwork")
                return rows[ii]
            }
        }
        return null
    }
    catch (err) {
        logger.info(err);
        return null
    }
}
export async function goToNetworkAction(networkName, action) {
    try {
        await goToTabsInNodePage("Networks")
        logger.info("Get goToNetworkAction ", networkName, action)

        const network = await goToNetwork(networkName)
        await delay(15000)
        const netGear = await network.$('button.ant-dropdown-trigger', { visible: true })
        await netGear.hover()
        //await expect(page).toClick('button', { title: 'View Network'}) 
        await delay(1000)
        if (action == "view") {
            await (page
                .waitForXPath("//button[contains(@title, 'View Network')]", { visible: true })
                .then(() => logger.info('Waiting for gear button to show View Network')))

            const [view] = await page.$x(".//button[contains(@title, 'View Network')]", { visible: true })
            await view.click()
        }
        else if (action == "edit") {
            await (page
                .waitForXPath("//button[contains(@title, 'Edit Network')]", { visible: true })
                .then(() => logger.info('Waiting for gear button to show Edit Network')))

            const [view] = await page.$x(".//button[contains(@title, 'Edit Network')]", { visible: true })
            await Promise.all([
                view.click(),
                waitForNetworkIdle()
              ])    
        }
        else if (action == "discovery") {
            await (page
                .waitForXPath("//button[contains(@title, ' Discovery')]", { visible: true })
                .then(() => logger.info('Waiting for gear button to show Discovery')))

            const [view] = await page.$x("//button[contains(@title, ' Discovery')]", { visible: true })
            await view.click()
        }
        else if (action == "delete") {
            await (page
                .waitForXPath("//button[contains(@title, 'Delete Network')]", { visible: true })
                .then(() => logger.info('Waiting for gear button to show Delete Network')))

            const [view] = await page.$x(".//button[@title='Delete Network']", { visible: true })
            await view.focus()
            //await view.click({clickCount: 2, button: "middle", delay:10})
            await view.click()
            logger.info('Clicked Delete Network')
            await delay(2000)
            await expect(page).toMatchElement('div.ant-modal-title span', { text: 'Delete Network' })
            await expect(page).toClick('div.ant-modal-footer span', { text: 'Delete' })
            await expect(page).toMatchElement('.ant-message > span', { text: 'Deleted successfully', timeout: 20000 })
            logger.info('Clicked Delete from popup')
        }

    } catch (err) {
        logger.info(err);
    }

}

export async function goToAddNetwork() {
    try {
        logger.info("In the goToAddNetwork function")
        await goToTabsInNodePage("Networks")
        reporter.startStep('Add Network ');
        await expect(page).toMatchElement('button[title="Add Network"]')
        await expect(page).toClick('button[title="Add Network"]')
        await delay(2000)
        reporter.endStep()

    } catch (err) {
        logger.info('Exception in goToAddNetwork ', err);
    }
}

export async function addTanNetwork(networkAdd) {
    try {
        logger.info("In the addTanNetwork function")
        logger.info("In the addTanNetwork networkADD details ", networkAdd.getname())
        await goToTabsInNodePage("Networks")
        reporter.startStep('Add Network ' + networkAdd.getname());

        await expect(page).toMatchElement('button[title="Add Network"]')
        await expect(page).toClick('button[title="Add Network"]')
        await delay(2000)

        await expect(page).toFill('#name', networkAdd.getname())
        //await expect(page).toMatchElement('span[text$="New Label"]')
        //await expect(page).toClick('span[text$="New Label"]')
        if (networkAdd.getlabel() != '') {
            await expect(page).toMatchElement('button[class="ant-btn ant-btn-dashed ant-btn-sm"')
            await expect(page).toClick('button[class="ant-btn ant-btn-dashed ant-btn-sm"')
            await delay(1000)
            //await expect(page).toMatchElement('span[class="ant-select-search__field__mirror"]')
            await expect(page).toFill('input[class="ant-input ant-select-search__field"]', networkAdd.getlabel().split(":")[0])
            await expect(page).toFill('input[placeholder="Value"]', networkAdd.getlabel().split(":")[1])
        }
        if (networkAdd.getnw_addr() != '') {
            let nw_addressing = await page.$$("div[id='network_type']")
            logger.info(nw_addressing.length)
            logger.info(nw_addressing)
            logger.info(networkAdd.getnw_addr())
            //let nw_addressing_value = await nw_addressing[0].$$("span", {text: networkAdd.getnw_addr()})
            let path = `//span[contains(text(), "${networkAdd.getnw_addr()}")]`
            let nw_addressing_value = await page.$x(path)
            logger.info(nw_addressing_value.length)
            await nw_addressing_value[0].hover()
            await nw_addressing_value[0].click()
        }

        if (networkAdd.getnw_addr() != 'Dynamic')
        {
            let address = await page.$$("input[placeholder='IP Address']")
            await address[0].type(networkAdd.getcidr().split('/')[0], {delay: 100}) 

            let mask = await page.$$("input[placeholder='Mask Length']")
            await mask[0].type(networkAdd.getcidr().split('/')[1], {delay: 100})

            //await expect(page).toFill('#cidr', networkAdd.getcidr())
            await expect(page).toFill("input[id='reserved.start']", networkAdd.getstart_ip())
            await expect(page).toFill("input[id='reserved.end']", networkAdd.getend_ip())
            //await expect(page).toFill('#gateway', networkAdd.getgw())
            if (networkAdd.getgw() != '') {
                await address[1].click({clickCount: 2})
                await address[1].type(networkAdd.getgw(), {delay: 100})
            }
        }
        if (networkAdd.getnw_addr() == 'Dynamic')
        {
            let address = await page.$$("input[placeholder='IP Address']")
            await address[0].type(networkAdd.getgw().split('/')[0], {delay: 100}) 

            let mask = await page.$$("input[placeholder='Mask Length']")
            await mask[0].type(networkAdd.getgw().split('/')[1], {delay: 100})
        }


        if (networkAdd.getvlan() == "Enabled") {
            //await expect(page).toClick('#vlan_enabled span', {text: 'Enabled', delay: 5,button:'middle'})
            const vlanHandlers = await page.$x("//span[contains(text(), 'Enabled')]");
            vlanHandlers[0].click()
            await delay(1000)
            await expect(page).toFill("input[id='vlan_id']", networkAdd.getvlan_id())
        }

        
        if (networkAdd.getdefault_destn() == "WAN") {
            await expect(page).toClick('#via_default')
            await expect(page).toClick('li', { text: 'WAN Network' })
        }

        if (networkAdd.getnw_addr() == 'Static')
        {
            await expect(page).toClick('.panel-header-text', {text: 'Services'})
            logger.info("clicked service addressing tab")
            let path = `//div[@id='service_addressing']//span[text()="${networkAdd.getservice_addr()}"]`
            let service_addressing_value = await page.$x(path)
            logger.info(service_addressing_value.length)
            await service_addressing_value[0].hover()
            await service_addressing_value[0].click()
        }

        await delay(2000)
        let screenshot = await customScreenshot('networkDetails.png', 1920, 1200)
        reporter.addAttachment("Network Details_" + networkAdd.name, screenshot, "image/png");

        logger.info('Clicked the Submit button ' + networkAdd.name);

        await expect(page).toMatchElement('span', { text: 'Save' })
        await expect(page).toClick('span', { text: 'Save' })


        const finalResponse = await page.waitForResponse(response =>
            response.url().endsWith("network")
            && (response.status() === 200
                && response.request().method() === 'POST')
            , 15);//wait for 15 sec
        if (finalResponse == null) {
            await expect(false).toBe(true);//fail the test
        }

        //Delay to get success 
        await delay(2000)
        screenshot = await customScreenshot('networkCreated.png', 1920, 1200)
        reporter.addAttachment("Network Created", screenshot, "image/png");

        let compare_result, input_fields, api_fields
        await finalResponse.json().then(result => {
            let input_fields = inputNetworkFields(networkAdd)
            let api_fields = parseNetworkApi(result)
            logger.info(input_fields)
            logger.info(api_fields)
            compare_result = verifyNetworkApiFields(input_fields, api_fields)
            compare_result.then(flag => {expect(flag).toBe(true)})
            logger.info(compare_result)
        })

        logger.info('Network is Created ');
        reporter.endStep()
        await delay(5000)//waiting for 5 seconds

    } catch (err) {
        logger.info(err);
        //force fully fail step if netwotk add fails
        await expect(false).toBe(true);
    }

}


export async function connectNetwork(networkConnect) {
    try {
        logger.info("In the connectNetwork function")
        await goToTabsInNodePage("Networks") 
        logger.info("Network Tab selected 123")
        reporter.startStep('Connect network from ' + networkConnect[0].getlocal_networkname())
            await goToNetworkAction(networkConnect[0].getlocal_networkname(), 'edit')
            await expandTabsInNetworkPage('Remote Networks')
            await delay(5000)
            for (var count=0; count < networkConnect.length; count++) {
                await expect(page).toMatchElement('button[title="Add Remote Network to connect"]')
                await expect(page).toClick('button[title="Add Remote Network to connect"]')
                await delay(1000)
                await expect(page).toClick('input[title="Select Remote Network"]')
                await delay(1000)
                await expect(page).toClick('li[class="ant-cascader-menu-item ant-cascader-menu-item-expand"]', { text: global.orgName })
                await delay(1000)
                //await expect(page).toClick('li[class="ant-cascader-menu-item ant-cascader-menu-item-expand"]', { text: networkConnect[count].getpeer_nodename()})
                let peerNodePath = `//li[contains(@class, 'ant-cascader-menu-item')][text()='${networkConnect[count].getpeer_nodename()}']`
                await performAction("click", peerNodePath)
                await delay(3000)
                let peerNetworkPath = `//li[contains(@class, 'ant-cascader-menu-item')][text()='${networkConnect[count].getpeer_networkname()}']`
                await performAction("click", peerNetworkPath)
                await delay(1000)
                //Representation Network To Be Done
            }
            let screenshot = await customScreenshot('networkConnect.png', 1920, 1200)
            reporter.addAttachment("Network Details_"+networkConnect[0].getlocal_networkname(), screenshot, "image/png");

        logger.info('Clicked the Update button ' + networkConnect[0].getlocal_networkname());

        await expect(page).toMatchElement('span', { text: 'Update' })
        await expect(page).toClick('span', { text: 'Update' })

        logger.info('Clicked the update button')
        await delay(2000)

        expect(await page.waitForSelector('.ant-message > span', { text: `${networkConnect[0].getlocal_networkname()} updated successfully` }) ? true : false).toBe(true);
        screenshot = await customScreenshot('networkConnected.png', 1920, 1200)
        reporter.addAttachment("Network Connected", screenshot, "image/png");
        logger.info('Network is Connected ');
        reporter.endStep()
        await delay(5000)//waiting for 5 seconds

    } catch (err) {
        logger.info(err);
        expect(true).toBe(false)
    }
}

export async function getTunnelStatus(tunnel, status) {
    try {
        logger.info("In Get Tunnel status")
        const tunnelContent = await page.$$('.ant-collapse-content-active')
        logger.info("tunnelContent", tunnelContent.length)
        //const tabs = await tabsContent[0].$$('.ant-tabs-tabpane', { visible: true })
        //const networks = await tunnelContent[0].$$('button.ant-dropdown-trigger', { visible: true })
        logger.info("In the remote networks ante")
        const rows = await tunnelContent[0].$$('tr.ant-table-row-level-0')
        logger.info("In the remote networks row")
        logger.info('how many ROWS?', (rows.length))
        for (var ii = 0; ii < rows.length; ii++) {
            //let valueHandle = await rows[ii].getProperty('innerText');
            //let linkText = await valueHandle.jsonValue();
            //logger.info("ROWS content = ", linkText)
            //expect(await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))).toEqual(['Hello!', 'Hi!']);
            const texts = await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))
            logger.info("texts " + texts)
            if (texts[0].includes(tunnel.getpeer_nodename()) && texts[0].includes(tunnel.getpeer_networkname())) {
                const op = expect(await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))).toContain(status) 
                logger.info("Returning Handle from getTunnelStatus")
                logger.info("output is   " + op)
                return true
            } else {
                return null
            }
        }
    } catch(err) {
        return null
        logger.info(err);
        expect(true).toBe(false)
    }
}



export async function disconnectAllTunnels(network_name) {
    try {
        logger.info("In disconnectAllTunnels " + network_name)
        await goToTabsInNodePage("Networks")
        await goToNetworkAction(network_name, 'edit')
        await expandTabsInNetworkPage('Remote Networks')
        await delay(3000)
        const tunnelContent = await page.$$('.ant-collapse-content-active')
        //const tabs = await tabsContent[0].$$('.ant-tabs-tabpane', { visible: true })
        //const networks = await tunnelContent[0].$$('button.ant-dropdown-trigger', { visible: true })
        logger.info("In the remote networks ante")
        const rows = await tunnelContent[0].$$('tr.ant-table-row-level-0')
        logger.info("In the remote networks row")
        logger.info('Number of tunnels', (rows.length))
        for (var ii = 0; ii < rows.length; ii++) {
            //let valueHandle = await rows[ii].getProperty('innerText');
            //let linkText = await valueHandle.jsonValue();
            //logger.info("ROWS content = ", linkText)
            //expect(await rows[ii].$$eval('span', nodes => nodes.map(n => n.innerText))).toEqual(['Hello!', 'Hi!']);
            logger.info("before disconnect")
            await expect(rows[ii]).toMatchElement('svg[data-icon="minus-circle"]')
            await expect(rows[ii]).toClick('svg[data-icon="minus-circle"]')
            logger.info("after disconnect")
        }
        await expect(page).toMatchElement('span', { text: 'Update' })
        await expect(page).toClick('span', { text: 'Update' })

        logger.info('Clicked the update button')

        await delay(2000)
        logger.info('Network is Disconnected ');
    } catch (err) {
        logger.info(err);
        expect(true).toBe(false)
    }
}

export async function deleteAllNetworks() {
    try {
        await goToTabsInNodePage("Networks")
        logger.info("Get all networks checkbox")
        const tabsContent = await page.$$('.ant-tabs-content')
        const tabs = await tabsContent[0].$$('.ant-tabs-tabpane-active', { visible: true })
        const networks = await tabs[0].$$('button.ant-dropdown-trigger', { visible: true })
        const checkAllNetworks = await tabs[0].$$('input.ant-checkbox-input')
        logger.info("In header")
        await expect(tabs[0]).toClick('input.ant-checkbox-input')
        let res = performAction("click", networksTab.button.deleteNetworks)
        expect(res).toBeTruthy()
        await delay(2000)
        await page.waitForXPath(modals.div.title)
        res = await verifyModal("deleteNetwork")
        expect(res).toBeTruthy()
        await performAction("click", modals.button.primary)
        await delay(3000)
    }
    catch (err) {
        logger.info(err);
        expect(true).toBe(false)
    }

}

export async function parseNetworkApi(network_api) {
    logger.info("in parseNetworkApi")
    let api_response = new NetworkAdd()
    let user_label = network_api['metadata']['labels']
    
    for (var key in user_label){
        if (key.startsWith("_iotium")){
          delete user_label[key]
        }
      }
    let user_label_str = JSON.stringify(user_label).slice(1,-1).replace(/\"/g,"")
    logger.info(user_label_str)
    let start_ip, end_ip
    if (network_api['type'] == 'DYNAMIC'){
        start_ip = ""
        end_ip = ""
    } else {
        start_ip = network_api['config']['network']['reserved'][0]['start']
        end_ip = network_api['config']['network']['reserved'][0]['end']
    }

    api_response.setNetworkAdd(network_api['name'],
                                user_label_str,
                                network_api['type'],
                                network_api['config']['network']['cidr'],
                                start_ip,
                                end_ip,
                                network_api['config']['network']['tan_interface_ip'],
                                "",
                                network_api['config']['network']['vlan_id'],
                                "",
                                network_api['config']['network']['service_addressing'],
                    )  
    return api_response
}

export async function inputNetworkFields(input_fields) {
    logger.info("in inputNetworkFields")
    let keys = Object.keys(input_fields)
    let retVal = {}
    for (var key of keys) {
        if (input_fields[key] != "" && key != 'vlan')
        {
            
            retVal[key] = input_fields[key]
        }
    }
    if (input_fields.vlan == 'Disabled'){
        retVal['vlan_id'] = '0'
    }
    if (input_fields.service_addr == 'Static'){
        retVal.service_addr = 'MANUAL'
    } else { retVal.service_addr = 'AUTO' }
    if (input_fields.nw_addr == 'Static'){
        retVal.gw = retVal.gw + "/" + retVal.cidr.split('/')[1]
    }
    retVal.nw_addr = retVal.nw_addr.toUpperCase()
    return retVal
}


export async function verifyNetworkApiFields(input_fields, api_fields) {
    logger.info("in verifyNetworkApiFields")
    logger.info(input_fields)
    logger.info(api_fields)
    let flag = true
    for (let key in input_fields){
        if(input_fields[key] != api_fields[key]){
            logger.error(`${key} did not match in api. Found ${api_fields[key]}. Expected ${input_fields[key]}`)
            flag = false
        }
    }
    logger.info(flag)
    return flag
}

export async function addNetworkError(networkObj,error) {
    try {
        reporter.startStep("Adding Network")
        logger.info("In addNetworkError:",networkObj)
        var action;
        action = await performAction("type", addNetwork.input.name, "page", networkObj.getname())
        expect(action).toBeTruthy()
        if (networkObj.getnw_addr() == 'Static') {
            action = await performAction("click", addNetwork.span.networkAddrStatic)
            expect(action).toBeTruthy()
        }
        if (networkObj.getnw_addr() == 'Dynamic') {
            action = await performAction("click", addNetwork.span.networkAddrDynamic)
            expect(action).toBeTruthy()
        }
        var ipAndLength = networkObj.getcidr().split('/')
        action = await performAction("type", addNetwork.input.networkCidrIP, "page", ipAndLength[0], true)
        expect(action).toBeTruthy()
        action = await performAction("type", addNetwork.input.networkCidrLength, "page", ipAndLength[1], true)
        expect(action).toBeTruthy()
        action = await performAction("type", addNetwork.input.startIP, "page", networkObj.getstart_ip(), true)
        expect(action).toBeTruthy()
        action = await performAction("type", addNetwork.input.endIP, "page", networkObj.getend_ip(), true)
        expect(action).toBeTruthy()
        action = await performAction("type", addNetwork.input.iNodeIPAddress, "page", networkObj.getgw(), true)
        expect(action).toBeTruthy()
        var navigated = await navigatePageByClick(addNetwork.button.save)
        expect(navigated).toBeTruthy()
        const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-error']//span[text()='"+error+"']", {timeout: 10000}) ? true : false;
        expect(elemExists).toBe(true)
        reporter.endStep();
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}