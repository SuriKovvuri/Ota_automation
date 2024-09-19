import { createPDF, customScreenshot, waitforotaloader, delay,  getEnvConfig, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, goTo } from '../../utils/utils';
import { logger } from "../log.setup";
import { add_auth_domain_page,otalogin, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage,deviceprofilepage,adddevice,addendpoint,addgroup,adduser,user_role_association,device_role_association,user_detail,device_detail,group_detail,endpoint_review, user_search, device_search,group_search } from '../constants/locators';
import { isExportAllDeclaration } from "@babel/types"; 
import { del } from 'openstack-client/lib/util';
//import { Terminal } from 'xterm';
//import { WebLinksAddon } from 'xterm-addon-web-links';


export const device_error = " Device name cannot contain special characters. Allowed characters: a-z A-Z 0-9 _ -"
export const ip_error = "IP is not valid"
export const host_error = "Host name is not valid"
export const city_error = "City is not valid"
export const country_error = "Country is not valid"

export async function gotoAddDevice()
{
    await gotoDevice()
    await getElementHandleByXpath(devicelist.button.add_device)
    await performAction("click",devicelist.button.add_device)
    await page.waitFor(1000)
}

export async function gotoDevice()
{
    await performAction("click",leftpane.a.devicedashboard)
    logger.info('clicked Device');
}

export async function verifyDevice(row)
{
    logger.debug("Verifying Device..")
    
    await delay(2000)
    await expect(page).toClick('svg[type="laptop"]')
    await delay(2000)
    await expect(page).toMatchElement('button[class="ant-btn ant-btn-circle ant-btn-sm ant-btn-block"]')
    const groupElem = await page.$x('//a[contains(text(),"'+ row.devicename +'")]')
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await groupElem[0].click()
        await delay(1000)
        await expect(page).toClick('svg[type="link"]')
        await delay(1000)
        let screenshot = await customScreenshot('verifyAddGroupButton.png', 1920, 1200)
        reporter.addAttachment("group page option is not available.", screenshot, "image/png");
        if(row.connectendpoint == 'SSH') {  
            var count = 1
            const enabled = await page.$x('//span[contains(text(), "Enabled")]')
            logger.debug(enabled.length)
            if(row.ftp == 'disable') {
                count = count - 1
            }
            if (enabled.length === count) {
                logger.info("One enabled found as expected")
            } else {
                logger.error("One enabled button not found")
                expect(true).toBe(false)
            }
        } else if (row.connectendpoint == 'RDP') {
            var count = 2
            const enabled = await page.$x('//span[contains(text(), "Enabled")]')
            logger.debug(enabled.length)
            if(row.ftp == 'disable') {
                count = count - 1
            }
            if(row.wallpaper == 'disable') {
                count = count - 1
            }
            if (enabled.length === count) {
                logger.info( "enabled count matched as expected")
            } else {
                logger.error("enabled count not matched")
                expect(true).toBe(false)
            }
        } 
        await delay(1000)
        await expect(page).toMatchElement('button[id="submitBtn"]')
        await expect(page).toClick('button[id="submitBtn"]')  
        await delay(1000)
        await expect(page).toMatchElement('button[id="submitBtn"]')
        await expect(page).toClick('button[id="submitBtn"]')  
        logger.info("verifying device passed")
    } else {
        logger.error("verifying device failed")
        expect(true).toBe(false)
    }

}

export async function deleteDevice(row)
{
    logger.debug("Deleting Device..")
    await delay(2000)
    await expect(page).toClick('svg[type="laptop"]')
    await delay(3000)
    await expect(page).toMatchElement('button[class="ant-btn ant-btn-circle ant-btn-sm ant-btn-block"]')
    const groupElem = await page.$x('//a[contains(text(),"'+ row.devicename +'")]')
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await groupElem[0].click()
        await delay(1000)
        await expect(page).toClick('svg[type="trash-alt"]')
        await expect(page).toMatchElement('button[id="submitBtnDeleteDevice"]')
        await expect(page).toClick('button[id="submitBtnDeleteDevice"]')  
    } else {
        logger.error("verifying device failed")
        expect(true).toBe(false)
    }

}

export const whenIAddDevice  = when => {
    when(/^I add device$/, async (table) => {
      logger.info("In Add Device")
      reporter.startStep("Adding Device");
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        logger.info("In Add Device Page")
        logger.debug("Adding Device..")
        let con_name = row.devicename + " " + row.connectendpoint
        logger.info("Username is : " + con_name)
        await performAction("click",leftpane.a.devicedashboard)
        await getElementHandleByXpath(devicelist.button.add_device)
        await performAction("click",devicelist.button.add_device)
        await getElementHandleByXpath(adddevice.details.name)
        await delay(5000)
        await performAction("type",adddevice.details.name,"page",row.devicename)
        await performAction("type",adddevice.details.ip_address,"page",row.ipaddr)
        await performAction("type",adddevice.details.hostname,"page",row.hostname)
        await performAction("type",adddevice.details.description,"page",row.description)
        await performAction("type",adddevice.details.street,"page",row.street)
        await performAction("type",adddevice.details.city,"page",row.city)
        await performAction("click","//label[@title='City']")
        await delay(2000)
        await performAction("click","//span//input[@id='state']//parent::span//following-sibling::span")
        await performAction("click","//span//input[@id='country']//parent::span//following-sibling::span")
        await performAction("type",adddevice.details.state,"page",row.state)
        await performAction("type",adddevice.details.country,"page",row.country)
        await performAction("type",adddevice.details.zipcode,"page",row.zipcode)
        await performAction("click",adddevice.details.submit_button)
        await delay(5000)
        if (row.connectendpoint != '') {      
            await getElementHandleByXpath(addendpoint.details.type)
            if(row.connectendpoint == 'SSH') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_ssh)
                await delay(2000)
                await performAction("type",addendpoint.details.name,"page",con_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.port)
                await delay(2000)
                if(row.ftp == 'enable') {
                    await performAction("click",addendpoint.details._ftp)
                }
                await delay(2000)
            } else if (row.connectendpoint == 'RDP') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_rdp)
                await performAction("type",addendpoint.details.name,"page",con_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.port)
                await delay(2000)
                if(row.ftp == 'enable') {
                    await performAction("click",addendpoint.details._ftp)            }
                if(row.wallpaper == 'enable') {
                    await performAction("click",addendpoint.details._wallpaper)
                }
                    logger.info("Two enabled found as expected")
            } else if (row.connectendpoint == 'HTTP') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_http)
                await performAction("type",addendpoint.details.name,"page",con_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.port)
                await delay(2000)
                if(row.subpath != '') {
                    await performAction("type",addendpoint.details._subpath,"page",row.subpath)            }
                    logger.info("Subpath added")
            } else if (row.connectendpoint == 'HTTPS') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_https)
                await performAction("type",addendpoint.details.name,"page",con_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.port)
                await delay(2000)
                if(row.subpath != '') {
                    await performAction("type",addendpoint.details._subpath,"page",row.subpath)            }
                    logger.info("Subpath added")
            }
            await performAction("click",addendpoint.details.review_button)
            await delay(2000)
            await getElementHandleByXpath("//div//h4[text()='New/Existing Connections']")
            await performAction("click","//button[@id='submitBtn']")
            await delay(2000)
            if (row.usergroup != '') {
                await waitforotaloader()
                await getElementHandleByXpath("//span[text()='PortId']")
                await performAction("type","//input[@value='"+row.port+"']//parent::div//following-sibling::div//div//span//input[contains(@class,'ant-select-selection-search-input')]","page",row.usergroup)
                await delay(1000)
                await performAction("click","//div[contains(@class,'ant-select-item-option-content')]//span[text()='"+row.usergroup+"']")
                await delay(1000)
                await performAction("click","//span[text()='PortId']")
                await delay(1000)
                await performAction("click","//button[@id='submitBtn']")
                let group_edit = await getElementHandleByXpath("//span[text()='Successfully Submitted']")
                    if (group_edit.length == 1) {
                        logger.info("User group associated successfully")
                    } else {
                        logger.error("User group association failed")
                    }
            } else {
                await performAction("click","//button//span[text()='Cancel']")
            }
        } else {
            await performAction("click",addendpoint.details.cancel_button)
        }
        reporter.endStep()
    }
})
}

export const thenIAddDevice  = then => {
    then(/^I add device$/, async (table) => {
      logger.info("In Add Device")
      reporter.startStep("Adding Device");
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        logger.info("In Add Device Page")
        logger.debug("Adding Device..")
        let con_name = row.devicename + " " + row.connectendpoint
        logger.info("Username is : " + con_name)
        await performAction("click",leftpane.a.devicedashboard)
        await getElementHandleByXpath(devicelist.button.add_device)
        await performAction("click",devicelist.button.add_device)
        await getElementHandleByXpath(adddevice.details.name)
        await delay(25000)
        await performAction("type",adddevice.details.name,"page",row.devicename)
        await performAction("type",adddevice.details.ip_address,"page",row.ipaddr)
        await performAction("type",adddevice.details.hostname,"page",row.hostname)
        await performAction("type",adddevice.details.description,"page",row.description)
        await performAction("type",adddevice.details.street,"page",row.street)
        await performAction("type",adddevice.details.city,"page",row.city)
        await performAction("click","//label[@title='City']")
        await delay(2000)
        await performAction("click","//span//input[@id='state']//parent::span//following-sibling::span")
        await performAction("click","//span//input[@id='country']//parent::span//following-sibling::span")
        await performAction("type",adddevice.details.state,"page",row.state)
        await performAction("type",adddevice.details.country,"page",row.country)
        await performAction("type",adddevice.details.zipcode,"page",row.zipcode)
        await performAction("click",adddevice.details.submit_button)
        await delay(3000)
        if (row.connectendpoint != '') {      
            await getElementHandleByXpath(addendpoint.details.type)
            if(row.connectendpoint == 'SSH') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_ssh)
                await performAction("type",addendpoint.details.name,"page",con_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.port)
                await delay(2000)
                if(row.ftp == 'enable') {
                    await performAction("click",addendpoint.details._ftp)
                }
                await delay(2000)
            } else if (row.connectendpoint == 'RDP') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_rdp)
                await performAction("type",addendpoint.details.name,"page",con_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.port)
                await delay(2000)
                if(row.ftp == 'enable') {
                    await performAction("click",addendpoint.details._ftp)            }
                if(row.wallpaper == 'enable') {
                    await performAction("click",addendpoint.details._wallpaper)
                }
                    logger.info("Two enabled found as expected")
            } else if (row.connectendpoint == 'HTTP') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_http)
                await performAction("type",addendpoint.details.name,"page",con_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.port)
                await delay(2000)
                if(row.subpath != '') {
                    await performAction("type",addendpoint.details._subpath,"page",row.subpath)            }
                    logger.info("Subpath added")
            } else if (row.connectendpoint == 'HTTPS') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_https)
                await performAction("type",addendpoint.details.name,"page",con_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.port)
                await delay(2000)
                if(row.subpath != '') {
                    await performAction("type",addendpoint.details._subpath,"page",row.subpath)            }
                    logger.info("Subpath added")
            }
            await performAction("click",addendpoint.details.review_button)
            await getElementHandleByXpath("//div//h4[text()='New/Existing Connections']")
            await performAction("click","//button[@id='submitBtn']")
            if (row.usergroup != '') {
                await waitforotaloader()
                await getElementHandleByXpath("//span[text()='PortId']")
                await performAction("type","//input[@value='"+row.port+"']//parent::div//following-sibling::div//div//span//input[contains(@class,'ant-select-selection-search-input')]","page",row.usergroup)
                await delay(1000)
                await performAction("click","//div[contains(@class,'ant-select-item-option-content')]//span[text()='"+row.usergroup+"']")
                await delay(1000)
                await performAction("click","//button[@id='submitBtn']")
                let group_edit = await getElementHandleByXpath("//span[text()='Successfully Submitted']")
                    if (group_edit.length == 1) {
                        logger.info("User group associated successfully")
                    } else {
                        logger.error("User group association failed")
                    }
            } else {
                await performAction("click","//button//span[text()='Cancel']")
            }
        } else {
            await performAction("click",addendpoint.details.cancel_button)
        }
        reporter.endStep()
    }
})
}

export const thenICheckDevice  = then => {
    then(/^Check Device$/, async (table) => {
      logger.info("Check Device ")
      reporter.startStep("Check Device ");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        logger.info("Devicename is : "+row.devicename)
        let con_name = row.devicename + " " + row.connectendpoint
        await navigatePageByClick(leftpane.a.devicedashboard)
        await delay(1000)
        await navigatePageByClick(devicelist.filter.device_name_search)
        let search = await getElementHandleByXpath(device_search.name.input)
        await search[0].click({clickCount: 3})
        await performAction("type", device_search.name.input, "page", row.devicename)
        await performAction("click",device_search.name.search_button)
        let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
        expect(handle.length).toBe(1)
        logger.info("handle.length ==",handle.length)
        if (handle.length == 1) {
        logger.info ("Device found")
        } else {
        logger.error("Device not found : FAILURE")
        }
        await delay(1000)
        await performAction("click","//a[text()='"+row.devicename+"']")
        await getElementHandleByXpath(deviceprofilepage.div.title)
        await performAction("click",deviceprofilepage.device.device_expand)
        await delay(1000)
        if (row.usergroup != '') {
            await getElementHandleByXpath(device_detail.action.edit_role)
            await performAction("click",device_detail.action.edit_role)
            await waitforotaloader()
            let group = await getElementHandleByXpath("//span[contains(@class,ant-select-selection-item-content)][text()='"+row.usergroup+"']")
            let portid = await getElementHandleByXpath("//input[@value='"+row.port+"']")
            if (group.length == 1 && portid.length == 1) {
                logger.info("Proper usergroup is found")
                let screenshot = await customScreenshot('groupcheck.png', 1920, 1200)
                reporter.addAttachment("Group  check_", screenshot, "image/png");
            } else {
                logger.error("Usergroup not Found")
            }
        await performAction("click",device_role_association.details.cancel_button)
        if (row.connectendpoint != '') {
            logger.info("Check Connection endpoint")
            await getElementHandleByXpath(device_detail.action.edit_endpoint)
            await performAction("click",device_detail.action.edit_endpoint)
            await delay(1000)
            let endpointname = await getElementHandleByXpath("//input[@value='"+con_name+"']")
            let endpointtype = await getElementHandleByXpath("//span[contains(@class,'ant-select-selection-item')][text()='"+row.connectendpoint+"']")
            let endpointport = await getElementHandleByXpath("//input[@placeholder='Port'][@value='"+row.port+"']")
            if (endpointname.length == 1 && endpointtype.length == 1 && endpointport.length == 1) {
                logger.info("Device endpoint found is proper")
                let screenshot = await customScreenshot('endpointcheck.png', 1920, 1200)
                reporter.addAttachment("Endpoint  check_", screenshot, "image/png");
            } else {
                logger.error("Device endpoint found is incorrect")
            }
            await performAction("click",addendpoint.details.cancel_button)
    }
    }
}
reporter.endStep()
})}


export const thenIRemoveDeviceUsergroup  = then => {
    then(/^Remove Device Usergroup$/, async (table) => {
      logger.info("Remove Device Usergroup ")
      reporter.startStep("Remove Device Usergroup ");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        logger.info("Devicename is : "+row.devicename)
        await navigatePageByClick(leftpane.a.devicedashboard)
        await delay(1000)
        await navigatePageByClick(devicelist.filter.device_name_search)
        let search = await getElementHandleByXpath(device_search.name.input)
        await search[0].click({clickCount: 3})
        await performAction("type", device_search.name.input, "page", row.devicename)
        await performAction("click",device_search.name.search_button)
        let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
        expect(handle.length).toBe(1)
        logger.info("handle.length ==",handle.length)
        await delay(1000)
        await performAction("click","//a[text()='"+row.devicename+"']")
        await getElementHandleByXpath(deviceprofilepage.div.title)
        await performAction("click",deviceprofilepage.device.device_expand)
        await delay(1000)
        if (row.usergroup != '') {
            await getElementHandleByXpath(device_detail.action.edit_role)
            await performAction("click",device_detail.action.edit_role)
            await waitforotaloader()
            let group = await getElementHandleByXpath("//span[contains(@class,ant-select-selection-item-content)][text()='"+row.usergroup+"']")
            if (group.length == 1) {
                logger.info("Proper usergroup is found")
                let screenshot = await customScreenshot('groupcheck.png', 1920, 1200)
                reporter.addAttachment("Group  check_", screenshot, "image/png");
            } else {
                logger.error("Usergroup not Found")
            }
            await performAction("click","//span//span[text()='"+row.usergroup+"']//following-sibling::span[contains(@class,'ant-select-selection-item-remove')]")
            await performAction("click",device_role_association.details.submit_button)
            let group_edit = await getElementHandleByXpath("//span[text()='Successfully Submitted']")
                    if (group_edit.length == 1) {
                        logger.info("User group associated successfully")
                    } else {
                        logger.error("User group association failed")
                    }
    }
    reporter.endStep()
}
})}

export const thenIAddDeviceUsergroup  = then => {
    then(/^Add Device Usergroup$/, async (table) => {
      logger.info("Add Device Usergroup ")
      reporter.startStep("Add Device Usergroup ");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        logger.info("Devicename is : "+row.devicename)
        await navigatePageByClick(leftpane.a.devicedashboard)
        await delay(1000)
        await navigatePageByClick(devicelist.filter.device_name_search)
        let search = await getElementHandleByXpath(device_search.name.input)
        await search[0].click({clickCount: 3})
        await performAction("type", device_search.name.input, "page", row.devicename)
        await performAction("click",device_search.name.search_button)
        let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
        expect(handle.length).toBe(1)
        logger.info("handle.length ==",handle.length)
        await delay(1000)
        await performAction("click","//a[text()='"+row.devicename+"']")
        await getElementHandleByXpath(deviceprofilepage.div.title)
        await performAction("click",deviceprofilepage.device.device_expand)
        await delay(1000)
        if (row.usergroup != '') {
            await getElementHandleByXpath(device_detail.action.edit_role)
            await performAction("click",device_detail.action.edit_role)
            await waitforotaloader()
            await getElementHandleByXpath("//span[text()='PortId']")
            await performAction("click",`//input[@value='${row.port}']//parent::div//following-sibling::div//div//div//div//div/span[@class='ant-select-selection-search-mirror']`)
            await delay(5000)
            await performAction("type",`//input[@value='${row.port}']//parent::div//following-sibling::div//div//div//div//div/span[@class='ant-select-selection-search-mirror']`,"page",row.usergroup)
            //await performAction("click",`//div[@class='ant-select-item-option-content']//span[text()=${row.usergroup}]`)
            await delay(1000)
            await performAction("click","//div[contains(@class,'ant-select-item-option-content')]//span[text()='"+row.usergroup+"']")
            await delay(1000)
            await performAction("click","//span[text()='PortId']")
            await delay(1000)
            await performAction("click","//button[@id='submitBtn']")
            let group_edit = await getElementHandleByXpath("//span[text()='Successfully Submitted']")
                if (group_edit.length == 1) {
                    logger.info("User group associated successfully")
                } else {
                    logger.error("User group association failed")
                }
            } else {
                await performAction("click","//button//span[text()='Cancel']")
            }
        reporter.endStep()
}
})}



export const thenIEditDevice  = then => {
    then(/^Edit Device$/, async (table) => {
      logger.info("Edit Device ")
      reporter.startStep("Edit Device ");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        logger.info("Devicename is : "+row.devicename)
        await navigatePageByClick(leftpane.a.devicedashboard)
        await delay(1000)
        await navigatePageByClick(devicelist.filter.device_name_search)
        let search = await getElementHandleByXpath(device_search.name.input)
        await search[0].click({clickCount: 3})
        await performAction("type", device_search.name.input, "page", row.devicename)
        await performAction("click",device_search.name.search_button)
        let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
        expect(handle.length).toBe(1)
        logger.info("handle.length ==",handle.length)
        await delay(1000)
        await performAction("click","//a[text()='"+row.devicename+"']")
        await getElementHandleByXpath(deviceprofilepage.div.title)
        await performAction("click",deviceprofilepage.device.device_expand)
        await delay(1000)
        await performAction("click",device_detail.action.edit_device)
        if (row.newdescription != '') {
            logger.info("I am here")
            await delay(2000)
            let search1 = await getElementHandleByXpath(adddevice.details.description)
            await search1[0].click({clickCount: 3})
            await performAction("type",adddevice.details.description,"page",row.newdescription)
        }
        if (row.newdevicename != '') {
            logger.info("I am here")
            await delay(2000)
            let search1 = await getElementHandleByXpath(adddevice.details.name)
            await search1[0].click({clickCount: 3})
            await performAction("type",adddevice.details.name,"page",row.newdevicename)
        }

        await performAction("click",addgroup.details.submit_button)
        await delay(10000)
}

reporter.endStep()
})}

export const whenIEditDevice  = when => {
    when(/^Edit Device$/, async (table) => {
      logger.info("Edit Device ")
      reporter.startStep("Edit Device ");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        logger.info("Devicename is : "+row.devicename)
        await navigatePageByClick(leftpane.a.devicedashboard)
        await delay(1000)
        await navigatePageByClick(devicelist.filter.device_name_search)
        let search = await getElementHandleByXpath(device_search.name.input)
        await search[0].click({clickCount: 3})
        await performAction("type", device_search.name.input, "page", row.devicename)
        await performAction("click",device_search.name.search_button)
        let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
        expect(handle.length).toBe(1)
        logger.info("handle.length ==",handle.length)
        await delay(1000)
        await performAction("click","//a[text()='"+row.devicename+"']")
        await getElementHandleByXpath(deviceprofilepage.div.title)
        await performAction("click",deviceprofilepage.device.device_expand)
        await delay(1000)
        await performAction("click",device_detail.action.edit_device)
        if (row.newdescription != '') {
            logger.info("I am here")
            await delay(2000)
            let search1 = await getElementHandleByXpath(adddevice.details.description)
            await search1[0].click({clickCount: 3})
            await performAction("type",adddevice.details.description,"page",row.newdescription)
        }
        if (row.newdevicename != '') {
            logger.info("I am here")
            await delay(2000)
            let search1 = await getElementHandleByXpath(adddevice.details.name)
            await search1[0].click({clickCount: 3})
            await performAction("type",adddevice.details.name,"page",row.newdevicename)
        }

        await performAction("click",addgroup.details.submit_button)
        await delay(10000)
}

reporter.endStep()
})}

export const whenIAddDeviceUsergroup  = when => {
    when(/^Add Device Usergroup$/, async (table) => {
      logger.info("Add Device Usergroup ")
      reporter.startStep("Add Device Usergroup ");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        logger.info("Devicename is : "+row.devicename)
        await navigatePageByClick(leftpane.a.devicedashboard)
        await delay(1000)
        await navigatePageByClick(devicelist.filter.device_name_search)
        let search = await getElementHandleByXpath(device_search.name.input)
        await search[0].click({clickCount: 3})
        await performAction("type", device_search.name.input, "page", row.devicename)
        await performAction("click",device_search.name.search_button)
        let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
        expect(handle.length).toBe(1)
        logger.info("handle.length ==",handle.length)
        await delay(1000)
        await performAction("click","//a[text()='"+row.devicename+"']")
        await getElementHandleByXpath(deviceprofilepage.div.title)
        await performAction("click",deviceprofilepage.device.device_expand)
        await delay(1000)
        if (row.usergroup != '') {
            await getElementHandleByXpath(device_detail.action.edit_role)
            await performAction("click",device_detail.action.edit_role)
            await waitforotaloader()
            await getElementHandleByXpath("//span[text()='PortId']")
            await performAction("click",`//input[@value='${row.port}']//parent::div//following-sibling::div//div//div//div//div/span[@class='ant-select-selection-search-mirror']`)
            await delay(5000)
            await performAction("type",`//input[@value='${row.port}']//parent::div//following-sibling::div//div//div//div//div/span[@class='ant-select-selection-search-mirror']`,"page",row.usergroup)
            //await performAction("click",`//div[@class='ant-select-item-option-content']//span[text()=${row.usergroup}]`)
            await delay(1000)
            await performAction("click","//div[contains(@class,'ant-select-item-option-content')]//span[text()='"+row.usergroup+"']")
            await delay(1000)
            await performAction("click","//span[text()='PortId']")
            await delay(1000)
            await performAction("click","//button[@id='submitBtn']")
            let group_edit = await getElementHandleByXpath("//span[text()='Successfully Submitted']")
                if (group_edit.length == 1) {
                    logger.info("User group associated successfully")
                } else {
                    logger.error("User group association failed")
                }
            } else {
                await performAction("click","//button//span[text()='Cancel']")
            }
        reporter.endStep()
}
})}



export const whenChangeConnectionendpoint  = when => {
    when(/^Change Device Endpoint$/, async (table) => {
      logger.info("Change Device Endpoint ")
      reporter.startStep("Change Device Endpoint ");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        let oldcon_name = row.devicename + " " + row.oldconnectendpoint
        let newcon_name = row.devicename + " " + row.newconnectendpoint
        logger.info("check and update device connection endpoint")
        if (row.oldendpoint != '' && row.newendpoint != '') {
            logger.info("Check Connection endpoint")
            await navigatePageByClick(leftpane.a.devicedashboard)
            await delay(1000)
            await navigatePageByClick(devicelist.filter.device_name_search)
            let search = await getElementHandleByXpath(device_search.name.input)
            await search[0].click({clickCount: 3})
            await performAction("type", device_search.name.input, "page", row.devicename)
            await performAction("click",device_search.name.search_button)
            let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
            expect(handle.length).toBe(1)
            logger.info("handle.length ==",handle.length)
            await delay(1000)
            await performAction("click","//a[text()='"+row.devicename+"']")
            await getElementHandleByXpath(deviceprofilepage.div.title)
            await performAction("click",deviceprofilepage.device.device_expand)
            await delay(1000)
            await getElementHandleByXpath(device_detail.action.edit_endpoint)
            await performAction("click",device_detail.action.edit_endpoint)
            await delay(1000)
            let endpointname = await getElementHandleByXpath("//input[@value='"+oldcon_name+"']")
            let endpointtype = await getElementHandleByXpath("//span[contains(@class,'ant-select-selection-item')][text()='"+row.oldconnectendpoint+"']")
            let endpointport = await getElementHandleByXpath("//input[@placeholder='Port'][@value='"+row.oldconnectendpointport+"']")
            if (endpointname.length == 1 && endpointtype.length == 1 && endpointport.length == 1) {
                logger.info("Device endpoint found is proper")
                let screenshot = await customScreenshot('endpointcheck.png', 1920, 1200)
                reporter.addAttachment("Endpoint  check_", screenshot, "image/png");
            } else {
                logger.error("Device endpoint found is incorrect")
            }
            logger.info("Now remove the oldendpoint and add new endpoint")
            await performAction("click",addendpoint.details.add_new_connection)
            //await performAction("click","//div[text()='"+oldcon_name+"']//child::span//*[name()='svg'][@data-icon='close']")
            await performAction("click",`//div[text()='${oldcon_name}']//parent::div[@class='ant-tabs-tab ant-tabs-tab-with-remove']//button//span//*[name()='svg'][@data-icon='close']`)
            await delay(2000)
            if(row.newconnectendpoint == 'SSH') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_ssh)
                await performAction("type",addendpoint.details.name,"page",newcon_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.newconnectendpointport)
                await delay(2000)
                if(row.ftp == 'enable') {
                    await performAction("click",addendpoint.details._ftp)
                }
                await delay(2000)
            } else if (row.newconnectendpoint == 'RDP') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_rdp)
                await performAction("type",addendpoint.details.name,"page",newcon_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.newconnectendpointport)
                await delay(2000)
                if(row.ftp == 'enable') {
                    await performAction("click",addendpoint.details._ftp)            }
                if(row.wallpaper == 'enable') {
                    await performAction("click",addendpoint.details._wallpaper)
                }
                    logger.info("Two enabled found as expected")
            } else if (row.newconnectendpoint == 'HTTP') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_http)
                await performAction("type",addendpoint.details.name,"page",newcon_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.newconnectendpointport)
                await delay(2000)
                if(row.subpath != '') {
                    await performAction("type",addendpoint.details._subpath,"page",row.subpath)            }
                    logger.info("Subpath added")
            } else if (row.newconnectendpoint == 'HTTPS') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_https)
                await performAction("type",addendpoint.details.name,"page",newcon_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.newconnectendpointport)
                await delay(2000)
                if(row.subpath != '') {
                    await performAction("type",addendpoint.details._subpath,"page",row.subpath)            }
                    logger.info("Subpath added")
            }
            await performAction("click",addendpoint.details.review_button)
            await delay(2000)
            await getElementHandleByXpath("//div//h4[text()='New/Existing Connections']")
            await performAction("click","//button[@id='submitBtn']")
            await delay(5000)
        } else {
            logger.error("Required Endpoints not provided, aborting update endpoint")
        }
        reporter.endStep()
    }
})}

export const thenChangeConnectionendpoint  = then => {
    then(/^Change Device Endpoint$/, async (table) => {
      logger.info("Change Device Endpoint ")
      reporter.startStep("Change Device Endpoint ");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        let oldcon_name = row.devicename + " " + row.oldconnectendpoint
        let newcon_name = row.devicename + " " + row.newconnectendpoint
        logger.info("check and update device connection endpoint")
        if (row.oldendpoint != '' && row.newendpoint != '') {
            logger.info("Check Connection endpoint")
            await navigatePageByClick(leftpane.a.devicedashboard)
            await delay(1000)
            await navigatePageByClick(devicelist.filter.device_name_search)
            let search = await getElementHandleByXpath(device_search.name.input)
            await search[0].click({clickCount: 3})
            await performAction("type", device_search.name.input, "page", row.devicename)
            await performAction("click",device_search.name.search_button)
            let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
            expect(handle.length).toBe(1)
            logger.info("handle.length ==",handle.length)
            await delay(1000)
            await performAction("click","//a[text()='"+row.devicename+"']")
            await getElementHandleByXpath(deviceprofilepage.div.title)
            await performAction("click",deviceprofilepage.device.device_expand)
            await delay(1000)
            await getElementHandleByXpath(device_detail.action.edit_endpoint)
            await performAction("click",device_detail.action.edit_endpoint)
            await delay(1000)
            let endpointname = await getElementHandleByXpath("//input[@value='"+oldcon_name+"']")
            let endpointtype = await getElementHandleByXpath("//span[contains(@class,'ant-select-selection-item')][text()='"+row.oldconnectendpoint+"']")
            let endpointport = await getElementHandleByXpath("//input[@placeholder='Port'][@value='"+row.oldconnectendpointport+"']")
            if (endpointname.length == 1 && endpointtype.length == 1 && endpointport.length == 1) {
                logger.info("Device endpoint found is proper")
                let screenshot = await customScreenshot('endpointcheck.png', 1920, 1200)
                reporter.addAttachment("Endpoint  check_", screenshot, "image/png");
            } else {
                logger.error("Device endpoint found is incorrect")
            }
            logger.info("Now remove the oldendpoint and add new endpoint")
            await performAction("click",addendpoint.details.add_new_connection)
            await performAction("click","//div[text()='"+oldcon_name+"']//parent::div//child::button//span//*[name()='svg'][@data-icon='close']")
            if(row.newconnectendpoint == 'SSH') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_ssh)
                await performAction("type",addendpoint.details.name,"page",newcon_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.newconnectendpointport)
                await delay(2000)
                if(row.ftp == 'enable') {
                    await performAction("click",addendpoint.details._ftp)
                }
                await delay(2000)
            } else if (row.newconnectendpoint == 'RDP') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_rdp)
                await performAction("type",addendpoint.details.name,"page",newcon_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.newconnectendpointport)
                await delay(2000)
                if(row.ftp == 'enable') {
                    await performAction("click",addendpoint.details._ftp)            }
                if(row.wallpaper == 'enable') {
                    await performAction("click",addendpoint.details._wallpaper)
                }
                    logger.info("Two enabled found as expected")
            } else if (row.newconnectendpoint == 'HTTP') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_http)
                await performAction("type",addendpoint.details.name,"page",newcon_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.newconnectendpointport)
                await delay(2000)
                if(row.subpath != '') {
                    await performAction("type",addendpoint.details._subpath,"page",row.subpath)            }
                    logger.info("Subpath added")
            } else if (row.newconnectendpoint == 'HTTPS') {
                await performAction("click",addendpoint.details.type)
                await delay(2000)
                await performAction("click",addendpoint.details._select_https)
                await performAction("type",addendpoint.details.name,"page",newcon_name)
                let search = await getElementHandleByXpath(addendpoint.details.port)
                await search[0].click({clickCount: 3})
                await performAction("type",addendpoint.details.port,"page",row.newconnectendpointport)
                await delay(2000)
                if(row.subpath != '') {
                    await performAction("type",addendpoint.details._subpath,"page",row.subpath)            }
                    logger.info("Subpath added")
            }
            await performAction("click",addendpoint.details.review_button)
            await delay(2000)
            await getElementHandleByXpath("//div//h4[text()='New/Existing Connections']")
            await performAction("click","//button[@id='submitBtn']")
            await delay(5000)
        } else {
            logger.error("Required Endpoints not provided, aborting update endpoint")
        }
        reporter.endStep()
    }
})}


export const thenDeleteDevice  = then => {
    then(/^Delete Device$/, async (table) => {
      logger.info("Delete Device")
      reporter.startStep("Delete Device");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        logger.info("Devicename is : "+row.devicename)
        await navigatePageByClick(leftpane.a.devicedashboard)
        await delay(1000)
        await navigatePageByClick(devicelist.filter.device_name_search)
        let search = await getElementHandleByXpath(device_search.name.input)
        await search[0].click({clickCount: 3})
        await performAction("type", device_search.name.input, "page", row.devicename)
        await performAction("click",device_search.name.search_button)
        let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
        expect(handle.length).toBe(1)
        logger.info("handle.length ==",handle.length)
        await delay(1000)
        await performAction("click","//a[text()='"+row.devicename+"']")
        await getElementHandleByXpath(deviceprofilepage.div.title)
        await performAction("click",deviceprofilepage.device.device_expand)
        await delay(1000)
        await getElementHandleByXpath(device_detail.action.delete)
        await performAction("click",device_detail.action.delete)
        await delay(1000)
        await getElementHandleByXpath("//button//span[text()='Submit']")
        await performAction("click","//button//span[text()='Submit']")
        let device_delete = await getElementHandleByXpath("//span[text()='Successfully deleted the device']")
            if (device_delete.length == 1) {
                logger.info("User group associated successfully")
            } else {
                logger.error("User group association failed")
            }
        reporter.endStep()
        }
    })}


    export const whenDeleteDevice  = when => {
        when(/^Delete Device$/, async (table) => {
          logger.info("Delete Device")
          reporter.startStep("Delete Device");
        let screenshot
        for (let i=0; i < table.length; i++) {
            let row = table[i]
            reporter.startStep("When I navigate to Device Page");
            logger.info("Devicename is : "+row.devicename)
            await navigatePageByClick(leftpane.a.devicedashboard)
            await delay(1000)
            await navigatePageByClick(devicelist.filter.device_name_search)
            let search = await getElementHandleByXpath(device_search.name.input)
            await search[0].click({clickCount: 3})
            await performAction("type", device_search.name.input, "page", row.devicename)
            await performAction("click",device_search.name.search_button)
            let handle  = await getElementHandleByXpath("//td//a[text()='"+row.devicename+"']")
            expect(handle.length).toBe(1)
            logger.info("handle.length ==",handle.length)
            await delay(1000)
            await performAction("click","//a[text()='"+row.devicename+"']")
            await getElementHandleByXpath(deviceprofilepage.div.title)
            await performAction("click",deviceprofilepage.device.device_expand)
            await delay(1000)
            await getElementHandleByXpath(device_detail.action.delete)
            await performAction("click",device_detail.action.delete)
            await delay(1000)
            await performAction("click","//button//span[text()='Submit']")
            let device_delete = await getElementHandleByXpath("//span[text()='Successfully deleted the device']")
                if (device_delete.length == 1) {
                    logger.info("User group associated successfully")
                } else {
                    logger.error("User group association failed")
                }
            reporter.endStep()
            }
        })}

export const whenIAccessDevice  = when => {
    when(/^I try to access a device$/, async (table) => {
      logger.info("I try to access a device")
      reporter.startStep("I try to access a device");
    let screenshot
    for (let i=0; i < table.length; i++) {
        let row = table[i]
        reporter.startStep("When I navigate to Device Page");
        //await expect(page).toClick('svg[type="chalkboard-teacher"]')
        //await delay(2000)
        await expect(page).toMatchElement('svg[type="laptop"]')
        await expect(page).toClick('svg[type="laptop"]')
        await page.waitFor(1000)
        await expect(page).toClick('svg[type="user-circle"]')
        await page.waitFor(2000)
        await expect(page).toClick('button[class="ant-table-row-expand-icon ant-table-row-expand-icon-collapsed"')
        let screenshot = await customScreenshot('Use2.png', 1920, 1200)
        reporter.addAttachment("User2", screenshot, "image/png");
        logger.info("Device access for :" +row.devicename)
        //expect(page).toClick('span', { text: row.devicename })
        let pathname = `//span[text()='${row.devicename}']//preceding-sibling::button`
        let device123 = await page.$x(pathname)
        logger.info("device123 ---- >"+device123)
        await device123[0].click()
        await delay(10000)
        //await expect(page).waitForNavigation();
        //const newPage123 = await browser.waitForTarget(target => target.ur() === link.textContent());
        if (row.type == "http" ) {
        logger.info("HTTP part")    
        let pages = await browser.pages();
        for (const page of pages) {
            logger.info(page.url())  
        }
        let newPage = pages[pages.length - 1];
        logger.info("Pages count is :" +pages.length)
        await newPage.bringToFront();
        //await expect(newPage).toMatchElement('input[id="loginButton"]')
        await expect(newPage).toFill('input[id="username"]', row.username)
        await expect(newPage).toFill('input[id="password"]', row.password)
        //let screenshot1 = await customScreenshot('Use21.png', 1920, 1200)
        //reporter.addAttachment("User21", screenshot1, "image/png");
        await expect(newPage).toClick('input[id="loginButton"]')
        await delay(10000)
        const res123 = await expect(newPage).toMatchElement('span, [class="domkit-control domkit-Label"]') ? true : false;
        if ( res123 == true ) {
            logger.info("HTTP Device access is sucessfull")
            let screenshot2 = await customScreenshot('Use22.png', 1920, 1200)
            reporter.addAttachment("User22", screenshot2, "image/png");
            
        } else {
            logger.error("HTTP Device access Failed")
            let screenshot3 = await customScreenshot('Use23.png', 1920, 1200)
            reporter.addAttachment("User23", screenshot3, "image/png");
        }

        newPage.close()
        }
        if(row.type == "rdp") {
            await expect(page).toFill('input[placeholder="User Name"]', row.username)
            await expect(page).toFill('input[placeholder="Password"]', row.password)
            await expect(page).toClick('button[class="ant-btn submitBtnDeviceUser"')
            await delay(10000)
            let pages = await browser.pages();
            for (const page of pages) {
                logger.info(page.url())  
            }
            let newPage = pages[pages.length - 1];
            logger.info("Pages count is :" +pages.length)
            await newPage.bringToFront();
            

        }
        if(row.type == "ssh") {
            await expect(page).toFill('input[placeholder="User Name"]', row.username)
            await expect(page).toFill('input[placeholder="Password"]', row.password)
            await expect(page).toClick('button[class="ant-btn submitBtnDeviceUser"')
            await delay(10000)
            let pages = await browser.pages();
            for (const page of pages) {
                logger.info(page.url())  
            }
            let newPage = pages[pages.length - 1];
            logger.info("Pages count is :" +pages.length)
            await newPage.bringToFront();
            

        }
        

    }}
)}
