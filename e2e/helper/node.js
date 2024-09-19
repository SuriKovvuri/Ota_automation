import { delay, findByLink, getEnvConfig, customScreenshot, performAction, verifyModal, getPropertyValue, getPropertyValueByXpath, navigatePageByClick, findTagByText, waitForNetworkIdle } from '../../utils/utils';
import { logger } from '../log.setup';
import { leftpane, dashboard, allInodes, serialNumbers, modals, inodeDetails, addiNodeForm } from '../constants/locators'
import { modalProperties } from '../constants/modals';
import { goToOrg } from './org'

let client = require("openstack-client");

const pagetitle = "page-title" //h2 class



export async function goToNodes()
{
    try {
        
        await expect(page).toClick('span.nav-text', { text: 'iNodes' })
        logger.info('Clicked on the iNodes');
        await page.waitFor(1000)
    }
    catch(err) {
        logger.info(err);
      }
}


export async function goToNode(nodeName)
{
    try {
        logger.info("in goToNode")
        //check inodes list is open or not
        let propValue = await getPropertyValueByXpath(leftpane.li.inodes,'classList')
        if (Object.values(propValue).includes('ant-menu-submenu-open') != true) {
            logger.info('iNode list not active')
            let listed = await performAction('click',leftpane.li.inodes)
            expect(listed).toBeTruthy()
            await page.waitFor(2000)
        }

        let navigated = await navigatePageByClick(leftpane.li.allInodes)
        expect(navigated).toBeTruthy()

        logger.info('Clicked on All Inodes waiting for Name to appear in Nodes table listing');
        logger.info("In the function goToNode nodename = "+nodeName)
        await page.waitFor(2000)
        //use the page filter to avoid scrolling
        let action = await performAction("type", allInodes.input.filter, "page", nodeName)
        expect(action).toBeTruthy() 
        const finalResponse = await page.waitForResponse(response =>
        response.url().includes(`search=${nodeName}`)
        && (response.status() === 200
            && response.request().method() === 'GET')
        , 15);//wait for 15 sec  
        if (finalResponse == null) {  
            logger.error("search api did not get 200 response")
        }
        const node = await findTagByText('a',nodeName)
        expect(node.length > 0).toBe(true)
        await node[0].focus()
        await Promise.all([
            node[0].click(),
            waitForNetworkIdle()
           ])
        await delay(2000)
        let skipnow = await page.$x(modals.div.content)
        logger.info("Waiting for modal ", skipnow.length)
        if (skipnow.length == 0){
        const finalResponse = await page.waitForResponse(response =>
            response.url().includes("api/v1/node")
            && (response.status() === 200
                && response.request().method() === 'GET')
            , 20);//wait for 20 sec  
            if (finalResponse == null) {  
                logger.error("search api did not get 200 response")
            }
        }
        await delay(3000)
        logger.info("Checking for the network add pop up")
        skipnow = await page.$x(modals.div.content)
        logger.info("Checking for the network add pop up length =", skipnow.length)
        if (skipnow.length > 0) {
            logger.info("Skipping the network add pop up")
            let skipAction = await performAction("click", modals.button.secondary)
            expect(skipAction).toBe(true)
            await delay(2000);
        }
        await expect(page).toMatchElement('span', { text: "Networks" })
        await expect(page).toMatchElement('span', { text: "WAN Network" })
        await delay(2000);
        logger.info("In the function Clicked goToNode nodename ="+nodeName)

    } catch(err) {
        logger.error(err);
        expect(true).toBe(false)
    }

}

export async function goToTabsInNodePage(tabname)
{
    try {
        logger.info("In the goToTabsInNodePage ="+tabname)

        //await expect(page).toMatchElement('div[class$="ant-tabs-tab"] > span', { text: tabname })
        await expect(page).toMatchElement('.ant-tabs-tab > span', { text: tabname })

        await expect(page).toClick('.ant-tabs-tab > span', { text: tabname })

        logger.info("In the function Clicked goToTabsInNodePage tabname ="+tabname)
        await delay(3000)
    }
    catch(err) {
        logger.info(err);
        expect(true).toBe(false)
      }

}

export async function connectOS()
{
    try {
        const region = "RegionOne"
        let id = ''
        logger.info("In the connectOS")
        let token = await client.authenticate({
            endpoint: "http://192.170.0.55:5000",
            name:"qa",
            password: "_idomnar1709",
            userDomainName:"Default",
            projectName:"qa",
            projectDomainName:"Default"
        });
        logger.info("In the connectOS connected")
        return token
    }
    catch(err) {
        logger.info(err);
        return null
      }

}

export async function OSAction(instanceName, token, action)
{
    try {

            const region = "RegionOne"

            logger.info("In the OSAction for instance ", instanceName)
            /* await client.nova.server.list(token, "RegionOne").then(function(servers) {
                console.dir(servers);
            }); */
            //let servers = await client.nova.server.list(token,region, {name: 'Thyaga_test1_vedge2'} ).then(function(servers) {
            //    console.dir(servers);
            //});
                let servers = await client.nova.server.list(token,region, {name: instanceName} )
                console.dir(servers);
                let id = servers[0].id;
                logger.info('server id = ', id);
             

                if (action == 'interface') {
                    await client.nova.server.listInterface(token, region, id).then(function(interfaceAttachments) {
                        logger.info("In the connectOS Successfully listing interfaces");
                        console.dir(interfaceAttachments);
                    });
                } else if (action == 'pause') {
                 await client.nova.serverAction.create(token, region, id, {"pause": null})
                 logger.info("In the connectOS Successfully Paused")
                } else if (action == 'unpause') {
                await client.nova.serverAction.create(token, region, id, {"unpause": null})
                logger.info("In the connectOS Successfully UN-Paused")
                } else if (action == 'suspend') {
                await client.nova.serverAction.create(token, region, id, {"suspend": null})
                logger.info("In the connectOS Successfully Suspended")
                } else if (action == 'resume') {
                await client.nova.serverAction.create(token, region, id, {"resume": null})
                logger.info("In the connectOS Successfully Resumed")
                } else if (action == 'os-stop') {
                await client.nova.serverAction.create(token, region, id, {"os-stop": null})
                logger.info("In the connectOS Successfully Stopped")
                } else if (action == 'os-start') {
                await client.nova.serverAction.create(token, region, id, {"os-start": null})
                logger.info("In the connectOS Successfully Started")
                } else if (action == 'hard') {
                await client.nova.serverAction.create(token, region, id, {"reboot": {type: "HARD"}})
                logger.info("In the connectOS Successfully rebooted")
                }
                await delay(5000) 

    }
    catch(err) {
        logger.info("Error caught in the OPENSTACK ",err);
        expect(true).toBe(false)
      }

}
export async function  changeNodeState(nodeName, token, action) 
{
    const unreachable_actions = ['pause', 'suspend', 'os-stop'];
    const alive_actions = ['unpause', 'resume', 'os-start', 'hard']
    const instanceName = global.OSprefix + nodeName
    var nodeState = ""
    if( unreachable_actions.includes(action) ) {
        nodeState = "UNREACHABLE"
    } else if( alive_actions.includes(action) ) {
        nodeState = "ALIVE"
    } else {
        logger.info("openstack action not defined")
        return false
    }
    await OSAction(instanceName,token, action)
    logger.info("OS Instance action taken")
    await page.goto(global.homeurl+'/home' )
    await delay(10000)
    //await expect(page).toMatchElement('span, [class="org-selector-menu org-selector-menu-padding"]', { text: global.orgName, timeout: 30000 })
    await goToNode(nodeName)
    //await delay(3000)
    let row
    if( unreachable_actions.includes(action) ) {
        row = await expect(page).toMatchElement('span, [class="tag-iotium-danger"]', { text: nodeState, timeout: 60000 })
    } else if( alive_actions.includes(action) ) {
        logger.info("Wait for openstack instance to start")
        //someopenstack gen3 nodes take longer time to come up & 30 seconds more to show up status
        await delay(60000*3)
        row = await expect(page).toMatchElement('span, [class="tag-iotium-sucess"]', { text: nodeState, timeout: 60000 })
    }
    logger.info("got node state " + row)
    const retStatus = row ? true : false
    return retStatus
}

export async function  makeAllNodesAlive(token, nodeList=[])
{
    logger.info("In makeAllNodesAlive")
    var config = await getEnvConfig()
    var nodes = ['node1', 'vnode1', 'vnode2']
    if (nodeList != []) {
        nodes = nodeList
    }
    for (let vnode of nodes){
        //If the node is defined in env, process it.
        //var testnode = eval("config." + vnode)
        //logger.info("test node is " + testnode)
        if (eval("config." + vnode)) {
            let nodeName = eval("config." + vnode)
            logger.info("Node name is "+nodeName)
            await page.goto(global.homeurl+'/home' )
            await delay(10000)
            //await expect(page).toMatchElement('span, [class="org-selector-menu org-selector-menu-padding"]', { text: global.orgName, timeout: 30000 })
            await goToNode(nodeName)
            let status = await page.$$eval('h4', nodes => nodes.map(n => n.innerText))
            logger.info("after node " + status)
            //logger.info(status.jsonValue())
            if (status.includes("UNREACHABLE")){await changeNodeState(nodeName,token,"os-start")}
        } else {
            logger.info(vnode + " is not defined in env")
        }
    }
}

/**
 * Reboots the node and returns true on success. false on failure
 * @param {*} nodename - name of the node to reboot
 */
export async function rebootiNode(nodename){
    try {
        logger.info("Node name is "+nodename)
        //If already in inode details page, don't navigate again
        let breadCrumb = await page.$x(allInodes.div.breadcrumb)
        if (breadCrumb.length == 1){
            var value = await getPropertyValue(breadCrumb[0], 'innerText')
            logger.info("breadcrumb value is ", value)
        
            let config = await getEnvConfig
            if (value.toString() == `Home/${config.orgName}/iNodes/${nodename}`)
            {
                await goToNode(nodename)
            }
        } else {
            await goToNode(nodename)
        }
        let action = await performAction("click", inodeDetails.button.manageInode)
        expect(action).toBe(true)
        action = await performAction("click", inodeDetails.button.reboot)
        expect(action).toBe(true)
        let status = await verifyModal("reboot")
        expect(status).toBe(true)
        action = await performAction("click", modals.button.primary)
        expect(action).toBe(true)
        const finalResponse = await page.waitForResponse(response =>
          response.url().endsWith("reboot")
          && (response.status() === 200
              && response.request().method() === 'POST')
          , 15);//wait for 15 sec  
        if (finalResponse == null) {  
          logger.error("search api did not get 200 response")
          return false
        }
        return true
        } catch(err) {
          logger.error(err);
          return false
      }
    }

export async function addNode(nodeAdd) {
    reporter.startStep("Adding node ", nodeAdd.getname())
    logger.info("In addNode")
    await expect(page).toMatchElement('button[title="Add"]', {visible: true})
    await expect(page).toClick('button[title="Add"]')
    logger.info("Clicked Add button")

    await expect(page).toMatchElement('span',{text:'Add iNode'})
    await expect(page).toClick('span',{text:'Add iNode'})

    logger.info("clicked inode done", nodeAdd.getname())
    //await expect(page).toClick('button.ant-btn span')
    await expect(page).toFill('input[placeholder="iNode Name"]', nodeAdd.getname())
    logger.info("filled name")
    await expect(page).toMatchElement('button[class~="ant-btn-dashed"]')
    await expect(page).toClick('button[class~="ant-btn-dashed"]')
    await delay(1000)
    await expect(page).toFill('input[class~="ant-select-search__field"]', nodeAdd.getlabel().split(":")[0])
    await expect(page).toFill('input[placeholder="Value"]', nodeAdd.getlabel().split(":")[1])
    await logger.info("Selected label")
    await logger.info(nodeAdd.getprofile())
    await expect(page).toClick('div[class="ant-select-selection__placeholder"]', { text: 'Select Profile' })
    await expect(page).toClick('li[class~="ant-select-dropdown-menu-item"]', {text: nodeAdd.getprofile()})
    await logger.info("profile selected")
    if (nodeAdd.getprofile() == 'Edge'){
        logger.info("in Serial Number for Edge")
        await expect(page).toClick('div[class="ant-select-selection__placeholder"]', { text: 'Select Serial Number' })
        await expect(page).toClick('li[class~="ant-select-dropdown-menu-item"]', {text: nodeAdd.getserial_number()})
    }
    if (nodeAdd.getprofile() == 'Edge' || nodeAdd.getprofile() == 'Virtual Edge'){
        logger.info("in ssh key for edge")
        await expect(page).toClick('div[class="ant-select-selection__placeholder"]', { text: 'Select SSH Key' })
        await expect(page).toClick('li[class~="ant-select-dropdown-menu-item"]', {text: nodeAdd.getssh_key()})
    }
    if (nodeAdd.getprofile() != 'Edge'){
        logger.info("in platform")
        let platforms = await page.$x('//label[text()="I Agree. Download credentials for"]//parent::div//following-sibling::div')
        logger.info(platforms.length)
        if (platforms.length == 1) {
            let buttons = await platforms[0].$$('button')
            logger.info(buttons.length)
            if (nodeAdd.getvirtual_platform() == "vmware") { 
                await buttons[buttons.length - 1].click()
            } else if (nodeAdd.getvirtual_platform() == "azure") {
                await buttons[1].click()
            } else {
                logger.info("choose aws")
                await buttons[0].click()
                logger.info("clicked aws")
            }
        }
        logger.info("selected platform")
    }
    if (nodeAdd.getadv_settings() != "") {
        logger.info("adv settings ", nodeAdd.getadv_settings())
        await expect(page).toClick('div.panel-header-text', { text: 'Advanced Settings'})
        let settings = nodeAdd.getadv_settings().split(',')
        for (let i =0; i<settings.length; i++)
        {
            if (settings[i].toLowerCase() == "standalone"){
                logger.info("in standalone")
                await expect(page).toMatchElement('span',{text:'Standalone Mode :'})
                await expect(page).toMatchElement('span.ant-switch-inner', {text:'Not Active'})
                await expect(page).toClick('span[id="headeless_mode"] > button')
                //let standalone_button = await page.$$("span[id='headeless_mode'] > button")
                //await standalone_button[0].click()
                //TODO - Standalone duration
            } 
            if (settings[i].toLowerCase() == "datasaving"){
                logger.info("in datasaving")
                await expect(page).toMatchElement('span.ant-switch-inner', {text:'Off'})
                await expect(page).toClick('span[id="interface_mode"] > button')
                //TODO - Frequency
            }
        }
    } 
    let screenshot1 = await customScreenshot('nodeDetails_'+ nodeAdd.getname() + '.png', 1920, 1200)
    reporter.addAttachment("Node Details_" + nodeAdd.getname(), screenshot1, "image/png"); 
    await expect(page).toClick('div.ant-modal-footer span', { text: 'Add iNode' })
    await expect(page).toMatchElement('.ant-message > span', { text: 'iNode created successfully', timeout: 20000 })
    let screenshot = await customScreenshot('nodeAdded_'+ nodeAdd.getname() + '.png', 1920, 1200)
    reporter.addAttachment("Node added_" + nodeAdd.getname(), screenshot, "image/png");
    reporter.endStep();
}

export async function deleteNode(nodeName) {
    logger.info("in deleteNode")
    reporter.startStep("Deleting node ", nodeName)
    //const elemXPath1 = "//ul[contains(@id, 'inodes$Menu') and contains(@class, 'ant-menu ant-menu-sub ant-menu-hidden ant-menu-inline')]"
    const elemXPath1 = "//span[span= 'iNodes']//ancestor::li[contains(@class, 'ant-menu-submenu-open')]"
    const elemExists1 = await page.$x(elemXPath1)
    logger.info(elemExists1)
    if (elemExists1.length == 0) {
        logger.info('iNode list not active')
        await expect(page).toClick('span.nav-text', { text: 'iNodes' })
        await page.waitFor(2000)
    }
    const elemXPath2 = "//span[contains(., 'All iNodes')]"
    const elemExists2 = await page.waitForXPath(elemXPath2, {timeout: 10000}) ? true : false;
    logger.info('In function deleteNode all iNodes = ', elemExists2);
    await expect(page).toClick('span', { text: 'All iNodes' })
    //await page.waitForNavigation();
    logger.info('Clicked on All Inodes waiting for Name to appear in Nodes table listing');
    //await expect(page).toMatchElement('span.ant-table-column-title', { text: 'Name' })
    await expect(page).toMatchElement('label.ant-checkbox-wrapper > span', { text: "Also show child orgs' iNodes" })
    logger.info("In the function deleteNode nodename = "+nodeName)
    await page.waitFor(2000)
    //use the page filter to avoid scrolling
    await expect(page).toFill('input[placeholder="Filter iNodes by name"]', nodeName)
    await page.waitFor(2000)
    await expect(page).toMatchElement('a', { text: nodeName })
    logger.info("In the function deleteNode Matched nodename = "+nodeName)
    //Match the row with that node and select delete button.
    let pathVar = `//strong[text()="${nodeName}"]//ancestor::tr[contains(@class,'ant-table-row-level-0')]//following::button[@title='Delete iNode']`
    let delButton = await page.$x(pathVar)
    logger.info("delButton length is ",delButton.length)
    if (delButton.length > 0) {
        logger.info("Focussed the delete inode button")
        await delButton[0].click()
    } else {
        logger.error("Unable to get delete inode button")
        expect(true).toBe(false)
    }
    await expect(page).toMatchElement('div.ant-modal-footer span', { text: 'Delete', timeout: 5000})
    let screenshot1 = await customScreenshot('nodeDeletedetails_'+ nodeName + '.png', 1920, 1200)
    reporter.addAttachment("Node deletedetails_" + nodeName, screenshot1, "image/png");
    await expect(page).toClick('div.ant-modal-footer span', { text: 'Delete' })
    await expect(page).toMatchElement('.ant-message > span', { text: 'Deleted successfully', timeout: 20000 })
    let screenshot = await customScreenshot('nodeDeleted_'+ nodeName + '.png', 1920, 1200)
    reporter.addAttachment("Node deleted_" + nodeName, screenshot, "image/png");
    reporter.endStep();
    logger.info("Deleted iNode")

}

export async function getNodeFromAllNodes(nodeName) {
    try{
    logger.info("in getNodeFromAllNodes")
    //const elemXPath1 = "//ul[contains(@id, 'inodes$Menu') and contains(@class, 'ant-menu ant-menu-sub ant-menu-hidden ant-menu-inline')]"
    const elemXPath1 = "//span[span= 'iNodes']//ancestor::li[contains(@class, 'ant-menu-submenu-open')]"
    const elemExists1 = await page.$x(elemXPath1)
    logger.info(elemExists1)
    if (elemExists1.length == 0) {
        logger.info('iNode list not active')
        await expect(page).toClick('span.nav-text', { text: 'iNodes' })
        //await page.waitFor(2000)
    }
    const elemXPath2 = "//span[contains(., 'All iNodes')]"
    const elemExists2 = await page.waitForXPath(elemXPath2, {timeout: 10000}) ? true : false;
    logger.info('In function getNodeFromAllNodes all iNodes = ', elemExists2);
    await expect(page).toClick('span', { text: 'All iNodes' })
    //await page.waitForNavigation();
    logger.info('Clicked on All Inodes waiting for Name to appear in Nodes table listing');
    //await expect(page).toMatchElement('span.ant-table-column-title', { text: 'Name' })
    await expect(page).toMatchElement('label.ant-checkbox-wrapper > span', { text: "Also show child orgs' iNodes" })
    logger.info("In the function getNodeFromAllNodes nodename = "+nodeName)
    //await page.waitFor(2000)
    //use the page filter to avoid scrolling
    await expect(page).toFill('input[placeholder="Filter iNodes by name"]', nodeName)
    logger.info("In the function deleteNode Matched nodename = "+nodeName)
    //Match the row with that node and select delete button.
    let pathVar = `//strong[text()="${nodeName}"]//ancestor::tr[contains(@class,'ant-table-row-level-0')]`
    let rowExists = await page.waitForXPath(pathVar, {timeout: 3000})
    if (rowExists != null){
        logger.info("Node found ", nodeName)
        let row = await page.$x(pathVar)
        return row[0]
    } else {
        logger.info("Node not found/deleted ", nodeName)
        return false
    }
    } catch(err) {
        logger.info("err")
        return false
    }
}

export async function addMyiNode(nodeAdd) {
    try {
        reporter.startStep("Adding iNode")
        logger.info("In nodeAdd:",nodeAdd)
        var action;
        action = await performAction("type", addiNodeForm.input.name, "page", nodeAdd.getname())
        expect(action).toBeTruthy()
        action = await performAction("click", addiNodeForm.div.profile)
        expect(action).toBeTruthy()
        action = await performAction("click", "//li[contains(@class,'ant-select-dropdown-menu-item')][text()='"+nodeAdd.getprofile()+"']")
        expect(action).toBeTruthy()
        if (nodeAdd.getprofile() == 'Edge') {
            action = await performAction("click", addiNodeForm.div.serialNumber)
            expect(action).toBeTruthy()
            action = await performAction("click", "//li[contains(@class,'ant-select-dropdown-menu-item')][text()='"+nodeAdd.getserial_number()+"']")
            expect(action).toBeTruthy()
        }
        if (nodeAdd.getprofile() == 'Edge' || nodeAdd.getprofile() == 'Virtual Edge') {
            action = await performAction("click", addiNodeForm.div.sshKey)
            expect(action).toBeTruthy()
            action = await performAction("click", "//li[contains(@class,'ant-select-dropdown-menu-item')][text()='"+nodeAdd.getssh_key()+"']")
            expect(action).toBeTruthy()
        }

        var navigated = await navigatePageByClick(addiNodeForm.button.addiNode)
        expect(navigated).toBeTruthy()
        reporter.endStep();
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function addiNodeError(nodeAdd,error) {
    try {
        reporter.startStep("Adding iNode")
        logger.info("In nodeAdd:",nodeAdd)
        var action;
        action = await performAction("type", addiNodeForm.input.name, "page", nodeAdd.getname())
        expect(action).toBeTruthy()
        action = await performAction("click", addiNodeForm.div.profile)
        expect(action).toBeTruthy()
        action = await performAction("click", "//li[contains(@class,'ant-select-dropdown-menu-item')][text()='"+nodeAdd.getprofile()+"']")
        expect(action).toBeTruthy()
        if (nodeAdd.getprofile() == 'Edge') {
            action = await performAction("click", addiNodeForm.div.serialNumber)
            expect(action).toBeTruthy()
            action = await performAction("click", "//li[contains(@class,'ant-select-dropdown-menu-item')][text()='"+nodeAdd.getserial_number()+"']")
            expect(action).toBeTruthy()
        }
        if (nodeAdd.getprofile() == 'Edge' || nodeAdd.getprofile() == 'Virtual Edge') {
            action = await performAction("click", addiNodeForm.div.sshKey)
            expect(action).toBeTruthy()
            action = await performAction("click", "//li[contains(@class,'ant-select-dropdown-menu-item')][text()='"+nodeAdd.getssh_key()+"']")
            expect(action).toBeTruthy()
        }
        if (nodeAdd.getvirtual_platform() == 'aws') {
            action = await performAction("click", addiNodeForm.button.aws)
            expect(action).toBeTruthy()
        }
        if (nodeAdd.getvirtual_platform() == 'azure') {
            action = await performAction("click", addiNodeForm.button.azure)
            expect(action).toBeTruthy()
        }
        if (nodeAdd.getvirtual_platform() == 'vmware') {
            action = await performAction("click", addiNodeForm.button.vmware)
            expect(action).toBeTruthy()
        }
        var navigated = await navigatePageByClick(addiNodeForm.button.addiNode)
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

export async function cleanupNode(nodeName, orgName) {
    try {
        let result;
        var action;
        let navigated;

        if (orgName != "") {
            result = await goToOrg(orgName)
            expect(result).toBe(true)
        }

        //goto node list page
        let handle = await page.$x(leftpane.li.inodes)
        logger.info(handle.length)
        if (handle.length > 0){
            let propValue = await getPropertyValue(handle[0], 'classList')
            logger.info(propValue)
            if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
            navigated = await navigatePageByClick(leftpane.li.inodes)
            expect(navigated).toBeTruthy()
            }
        } else {
            logger.error("Unable to get iNodes in left menu")
            expect(true).toBe(false)
        }
        navigated = await navigatePageByClick(leftpane.li.allInodes)
        expect(navigated).toBeTruthy()

        //delete node
        let elemXPath = "//td//a[text()='"+nodeName+"']//ancestor::tr//input[@class='ant-checkbox-input']"
        action = await performAction("click", elemXPath , "page")
        expect(action).toBeTruthy()
        action = await performAction("click", allInodes.button.deleteInode , "page")
        expect(action).toBeTruthy()
        await delay(3000)
        action = await performAction("click", allInodes._delete_modal.delete , "page")
        expect(action).toBeTruthy()
        result = await page.waitForXPath(allInodes._delete_modal.success, {timeout: 10000}) ? true : false;
        expect(result).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}