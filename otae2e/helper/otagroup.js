import { logger } from "../log.setup";
import { isExportAllDeclaration } from "@babel/types";
import * as constant from '../../utils/constants'
import {GroupAdd} from '../src/groupAdd'
import { Login } from '../helper/otalogin';
import { createPDF, customScreenshot,expectToClick, delay,replaceEnvs, getEnvConfig,getElementAttributes, waitforotaloader, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, goTo, verifyLoadingSpinner } from '../../utils/utils';
import { add_auth_domain_page, otalogin, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage, deviceprofilepage, adddevice, addendpoint, adduser, user_role_association, device_role_association, user_detail, device_detail, group_detail, endpoint_review, user_search, device_search, group_search, accesslist, addgroup} from '../constants/locators';

const sprintf = require('sprintf-js').sprintf;

// Pass the port ID's as a list, if kept empty the topmost port is used
export async function associateDevice(device, group, portId="") 
{
    logger.info("Associating Group and device")    
    await expect(page).toClick('svg[type="laptop"]')
    await delay(8000)
    await expect(page).toMatchElement(device_detail.button._header_titile_expand)
    await performAction("click", devicelist.search.search_expand)
    await performAction("type", device_search.name.device_name_input, "page", device)
    await performAction("click", devicelist.search.search_button)
    await delay(3000)
    const groupElem = await page.$x(sprintf(groupprofilepage.role.groupname_title_text, device))
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await groupElem[0].click()
        await delay(1000) 
        await performAction("click", deviceprofilepage.device.device_expand) 
        await delay(2000)
        await expect(page).toClick(device_detail.action._edit_icon)
        await delay(2000) 
        if(portId==""){
            await performAction("type", groupprofilepage.group._textbox, "page", group)
            await delay(2000)   
            page.keyboard.press('Enter');
            page.keyboard.press('Escape');
        }
        else {
            for (let i=0; i < portId.length; i++) {
                await performAction("type", sprintf(groupprofilepage.group._portIdAssociateTextbox,portId[i]), "page", group)
                await delay(2000) 
                page.keyboard.press('Enter');
                page.keyboard.press('Escape');
                await delay(1000)
            }
        }
        await expect(page).toClick(constant.groupAddWindowSubmitButton)
        await delay(1000)
    } else {
        logger.error("Associating Group and device failed")
        expect(true).toBe(false)
    }

}
export async function associateUser(user, groupname) 
{
    logger.info("Associating Group and User") 
    const au = capitalize(groupname)+ " Access"
    logger.debug(au)
    
    // Navigate to group page and select the specified group
    let result;
    await navigatePageByClick(leftpane.a.groupdashboard)
    await delay(2000) 

    await page.waitForXPath(grouplist.search.search_expand)
    result = await navigatePageByClick(grouplist.search.search_expand)
    expect(result).toBeTruthy()

    result = await performAction("type", group_search.name.name_input, "page", groupname)
    expect(result).toBeTruthy()

    result = await performAction("click", grouplist.search.search_button)
    expect(result).toBeTruthy()
    
    //expect(await verifyLoadingSpinner()).toBe(true)
    await delay(5000)
    let handle = await getElementHandleByXpath(sprintf(group_search.name.display_name, groupname))
    expect(handle.length).toBe(1)
    // Click on the group name after search
    result = await performAction("click", sprintf(group_search.name.display_name, groupname))
    expect(result).toBeTruthy()

    await delay(10000)
    const groupElem = await page.$x(userprofilepage.user.username_val)
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await groupElem[0].click()
        await delay(5000)
        await expect(page).toClick(group_detail.action._groupadd_icon)
        await delay(1000)
        await performAction("type", user_search.full_name.search_input_box, "page", user)
        await delay(1000)
        page.keyboard.press('Enter')
        await delay(4000)
        await expect(page).toClick(userprofilepage.search._search_textbox, { text: user })
        //page.keyboard.press('Enter');
        await delay(1000)
        await expect(page).toClick(constant.groupAddWindowSubmitButton)
        await delay(1000)
    } else {
        logger.error("Associating Group and User failed")
        expect(true).toBe(false)
    }

}

export async function disassociateDevice(device, group) 
{
    logger.info("Disassociating Group and device")
    await expect(page).toClick(leftpane.svg._devicedashboard_icon)
    await delay(5000)
    await expect(page).toMatchElement(device_detail.button._header_titile_expand)
    await performAction("click", devicelist.search.search_expand)
    await performAction("type", device_search.name.device_name_input, "page", device)
    await performAction("click", devicelist.search.search_button)
    await delay(4000)
	
    const groupElem = await page.$x('//a[contains(text(),"'+ device +'")]')
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await groupElem[0].click()
        await delay(1000) 
        await performAction("click", deviceprofilepage.device.device_expand)  
        await delay(2000)
        await expect(page).toClick(device_detail.action._edit_icon)
        await delay(2000) 
        await performAction("type", groupprofilepage.group._textbox, "page", group)
        await delay(2000)
        page.keyboard.press('Enter');
        page.keyboard.press('Escape');
        await expect(page).toClick(constant.groupAddWindowSubmitButton)
        await delay(1000)
    } else {
        logger.error("Disassociating Group and device failed")
        expect(true).toBe(false)
    }

}

export async function disassociateUser(user, groupname) 
{
    logger.info("Disassociating Group and user")

    // Navigate to group page and select the specified group
    let result;
    await navigatePageByClick(leftpane.a.groupdashboard)
    await delay(2000) 

    await page.waitForXPath(grouplist.search.search_expand)
    result = await navigatePageByClick(grouplist.search.search_expand)
    expect(result).toBeTruthy()

    await delay(1000)
    result = await performAction("type", group_search.name.name_input, "page", groupname)
    expect(result).toBeTruthy()

    result = await performAction("click", grouplist.search.search_button)
    expect(result).toBeTruthy()
    
    //expect(await verifyLoadingSpinner()).toBe(true)
    await delay(3000)
    let handle = await getElementHandleByXpath(sprintf(userlist.user_profile._user_profile_td, groupname))
    expect(handle.length).toBe(1)

    result = await performAction("click", sprintf(userlist.user_profile._user_profile_text, groupname))
    expect(result).toBeTruthy()
    
    await delay(2000)
    const groupElem = await page.$x(userlist.div._userNameValue)
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await groupElem[0].click()
        await delay(1000)
        await expect(page).toClick(group_detail.action._groupadd_icon)
        await delay(6000)

        result = await performAction("click", sprintf(group_detail.action._groupdissociate_close, user))
        expect(result).toBeTruthy()

        await expect(page).toClick('button[id="submitBtn"]')
    } else {
        logger.error("Disassociating Group and user")
        expect(true).toBe(true)
    }

}

export async function verifyAssociation(device, user, password, group) 
{
    logger.info("Verifying association of User and Device") 
    var config
    var elemExists
    await expect(page).toClick('svg[type="laptop"]')   
    verifyAssociateUser(user, group)
    await delay(2000)  

}

export async function verifyAssociateUser(user, group) 
{
    let result;
    logger.info("Verifying association of Group and user") 
    logger.info("Username is : " + user)
    let handle = await getElementHandleByXpath(leftpane.a.userdashboard)
    expect(handle.length).toBe(1)
    await navigatePageByClick(leftpane.a.userdashboard)
    await delay(2000) 

    await page.waitForXPath(userlist.search.search_expand)
    result = await navigatePageByClick(userlist.search.search_expand)
    expect(result).toBeTruthy()

    handle = await getElementHandleByXpath(user_search.full_name.name_input)
    expect(handle.length).toBe(1)
    result = await performAction("type", user_search.full_name.name_input, "page", user)
    expect(result).toBeTruthy()

    result = await performAction("click", userlist.search.search_button)
    expect(result).toBeTruthy()

    //expect(await verifyLoadingSpinner()).toBeTruthy()

    await delay(2000)   

    handle = await getElementHandleByXpath(sprintf(userlist.user_profile._user_profile_td, user))
    expect(handle.length).toBe(1)

    result = await navigatePageByClick(sprintf(userlist.user_profile._user_profile_text, user))
    expect(result).toBeTruthy()
   
    const groupElem = await page.$x(userprofilepage.user.username_val)
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await delay(2000)
        await groupElem[0].click()
        await delay(4000)      
        
        result = await performAction("click", user_detail.action.edit_role)
        expect(result).toBeTruthy()
        await delay(4000)
        let groupAccess =  capitalize(group) + " Access"
        const groupElem1 = await page.$x(sprintf(grouplist.group_profile.group_profile_text, groupAccess))
        logger.debug(groupElem1.length)
        if (groupElem1.length !== 0) {
            logger.info("Verifying association of Group and User passed")
            let screenshot = await customScreenshot('verifyAssociateUser.png', 1920, 1200)
            reporter.addAttachment("Verifying association of Group and User", screenshot, "image/png")
            await delay(2000)
            await page.waitForXPath(userlist.button._cancel_button)
            expect(result).toBeTruthy()
            result = await navigatePageByClick(userlist.button._cancel_button)
            expect(result).toBeTruthy()
        } else {
            
            logger.error("Verifying association of Group and User failed")
            let screenshot = await customScreenshot('verifyAssociateUser.png', 1920, 1200)
            reporter.addAttachment("Verifying association of Group and User", screenshot, "image/png")
            await page.waitForXPath(userlist.button._cancel_button)
            result = await navigatePageByClick(userlist.button._cancel_button)
            expect(true).toBe(false)

            
        }
    } else {
        logger.error("Verifying association of Group and User failed")
        let screenshot = await customScreenshot('verifyAssociateUser.png', 1920, 1200)
        reporter.addAttachment("Verifying association of Group and User", screenshot, "image/png")
        expect(true).toBe(false)
    }

}

export async function verifyDisassociateUser(user, group) 
{
    let result;
    logger.info("Verifying association of Group and user") 
    logger.info("Username is : " + user)
    await navigatePageByClick(leftpane.a.userdashboard)
    await delay(2000) 
    

    await page.waitForXPath(userlist.search.search_expand)
    result = await navigatePageByClick(userlist.search.search_expand)
    expect(result).toBeTruthy()

    result = await performAction("type", user_search.full_name.name_input, "page", user)
    expect(result).toBeTruthy()

    result = await performAction("click", userlist.search.search_button)
    expect(result).toBeTruthy()

    //expect(await verifyLoadingSpinner()).toBeTruthy()

    await delay(2000)   

    let handle = await getElementHandleByXpath(sprintf(userlist.user_profile._user_profile_td, user))
    expect(handle.length).toBe(1)

    result = await navigatePageByClick(sprintf(userlist.user_profile._user_profile_text, user))
    expect(result).toBeTruthy()

    
    await delay(2000)   
    await delay(2000)    
    const groupElem = await page.$x(userlist.div._userNameValue)
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await groupElem[0].click()
        await delay(4000)      
        
        result = await performAction("click", user_detail.action.edit_role)
        expect(result).toBeTruthy()
        await delay(4000)
        let groupAccessText =  capitalize(group) + " Access"
        const groupElem1 = await page.$x(sprintf(grouplist.group_profile.group_profile_text, groupAccessText))
        logger.debug(groupElem1.length)
        if (groupElem1.length === 0) {
            logger.info("Verifying disassociation of Group and device passed")
            let screenshot = await customScreenshot('verifyDisassociateUser.png', 1920, 1200)
            reporter.addAttachment("Verifying disassociation of Group and device", screenshot, "image/png")
            await page.waitForXPath(userlist.button._cancel_button)
            result = await navigatePageByClick(userlist.button._cancel_button)
            expect(result).toBeTruthy()
            //expect(true).toBe(true)
        } else {
            expect(true).toBe(false)
            logger.error("Verifying disassociation of Group and device failed")
            await delay(2000)
            let screenshot = await customScreenshot('verifyDisassociateUser.png', 1920, 1200)
            reporter.addAttachment("Verifying disassociation of Group and device", screenshot, "image/png")
            await page.waitForXPath(userlist.button._cancel_button)
            result = await navigatePageByClick(userlist.button._cancel_button)
            expect(result).toBeTruthy()
        }
    } else {
        logger.error("Verifying association of Group and device failed")
        let screenshot = await customScreenshot('verifyDisassociateUser.png', 1920, 1200)
        reporter.addAttachment("Verifying disassociation of Group and device", screenshot, "image/png")
        expect(true).toBe(false)
    }

}

export async function verifyAssociateDevice(devicename, group) 
{
    let result;
    logger.info("Verifying association of Group and Device") 
    logger.info("Devicename is : " + devicename)
    await navigatePageByClick(leftpane.a.devicedashboard)
    await delay(2000) 
    await page.waitForXPath(devicelist.search.search_expand)
    result = await navigatePageByClick(devicelist.search.search_expand)
    expect(result).toBeTruthy()
    result = await performAction("type", device_search.name.device_name_input, "page", devicename)
    expect(result).toBeTruthy()
    result = await performAction("click", devicelist.search.search_button)
    expect(result).toBeTruthy()
    await delay(4000)
    let handle = await getElementHandleByXpath(sprintf(userlist.user_profile._user_profile_text, devicename))
    expect(handle.length).toBe(1)

    result = await navigatePageByClick(sprintf(userlist.user_profile._user_profile_text, devicename))
    expect(result).toBeTruthy()
    await delay(4000)

    const groupElem = await page.$x(userlist.div._userNameValue)
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await groupElem[0].click()
        await delay(4000)      
        result = await performAction("click", user_detail.action.edit_role)
        expect(result).toBeTruthy()
        await delay(5000)
        const groupElem1 = await page.$x(sprintf(grouplist.group_profile.group_profile_text, capitalize(group)))
        logger.debug(groupElem1.length)
        if (groupElem1.length !== 0) {
            let screenshot = await customScreenshot('verifyAssociateDevice.png')
            reporter.addAttachment("Verifying association of Group and device passed", screenshot, "image/png")
            logger.info("Verifying association of Group and device passed")
            await delay(2000)
            await page.waitForXPath(userlist.button._cancel_button)
            result = await navigatePageByClick(userlist.button._cancel_button)
            expect(result).toBeTruthy()
        } else {
            let screenshot = await customScreenshot('verifyAssociateDevice.png')//, 1920, 1200)
            reporter.addAttachment("Verifying association of Group and device failed", screenshot, "image/png")
            expect(true).toBe(false)
            logger.error("Verifying association of Group and device failed")
            await page.waitForXPath(userlist.button._cancel_button)
            result = await navigatePageByClick(userlist.button._cancel_button)
            expect(result).toBeTruthy()
        }
    } else {
        logger.error("Verifying association of Group and device failed")
        expect(true).toBe(false)
    }

}

export async function verifyDisassociateDevice(devicename, group) 
{
    let result;
    logger.info("Verifying association of Group and user") 
    logger.info("Devicename is : " + devicename)
    await navigatePageByClick(leftpane.a.devicedashboard)
    await delay(2000) 

    await page.waitForXPath(devicelist.search.search_expand)
    result = await navigatePageByClick(devicelist.search.search_expand)
    expect(result).toBeTruthy()

    result = await performAction("type", device_search.name.device_name_input, "page", devicename)
    expect(result).toBeTruthy()

    result = await performAction("click", devicelist.search.search_button)
    expect(result).toBeTruthy()

    await delay(2000)

    let handle = await getElementHandleByXpath(sprintf(userlist.user_profile._user_profile_td, devicename))
    expect(handle.length).toBe(1)

    result = await navigatePageByClick(sprintf(userlist.user_profile._user_profile_text, devicename))
    expect(result).toBeTruthy()
    
    await delay(4000)     
    const groupElem = await page.$x(userlist.div._userNameValue)
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await groupElem[0].click()
        await delay(4000)      
        
        result = await performAction("click", user_detail.action.edit_role)
        expect(result).toBeTruthy()
        await delay(4000)
        let groupAccessText =  capitalize(group) + " Access"
        const groupElem1 = await page.$x(sprintf(grouplist.group_profile.group_profile_text, groupAccessText))
        logger.debug(groupElem1.length)
        if (groupElem1.length === 0) {
            logger.info("Verifying disassociation of Group and device passed")
            let screenshot = await customScreenshot('verifyDisassociateDevice.png', 1920, 1200)
            reporter.addAttachment("Verifying disassociation of Group and device passed", screenshot, "image/png")
            await page.waitForXPath(userlist.button._cancel_button)
            result = await navigatePageByClick(userlist.button._cancel_button)
            expect(result).toBeTruthy()
        } else {
            expect(true).toBe(false)
            logger.error("Verifying disassociation of Group and device failed")
            let screenshot = await customScreenshot('verifyDisassociateDevice.png', 1920, 1200)
            reporter.addAttachment("Verifying disassociation of Group and device failed", screenshot, "image/png")
            await delay(2000)
            await page.waitForXPath(userlist.button._cancel_button)
            result = await navigatePageByClick(userlist.button._cancel_button)
            expect(result).toBeTruthy()
        }
    } else {
        logger.error("Verifying association of Group and device failed")
        expect(true).toBe(false)
    }

}

export async function verifyDisassociate(device, user, password, group) 
{
    logger.info("Verifying association of User and Device") 
    var config
    var elemExists
    await expect(page).toClick('svg[type="laptop"]')   
    await delay(2000)  
    
    elemExists = await expect(page).toMatchElement(constant.logoutuserprofile_xpath_selector) ? true : false;
    if (elemExists == true) {
      expect(elemExists).toBe(true)
      //const check = await expect(page).toMatchElement('svg[type="UserCircle"]') ? true : false;
      await expect(page).toClick('svg[class="anticon valign-sub"]')
      await page.waitFor(1000)
      //const check1 = await expect(page).toClick('svg[type="UserCircle"]') ? true : false;
      await expect(page).toClick('span', { text: 'Signout' })
      await page.waitFor(2000)
    }
    await delay(2000)   
    config = await getEnvConfig()   
    await goTo(config.otaURL)
    await expect(page.title()).resolves.toMatch('Login - IoTium OTAccess');
    await customScreenshot('loginPage.png', 1920, 1200)
    await expect(page).toFill(constant.loginFormName, user)
    //TO DO : Defaulting the user passord has to fix
    await expect(page).toFill(constant.loginFormPassword, password)
    await expectToClick(constant.loginFormButton)
    logger.info("Hit login")
    await delay(2000)
    //await expect(page).toMatchElement('svg[type="user-circle"]')
    await expect(page).toMatchElement(constant.logoutuserprofile_xpath_selector)

    await delay(3000)        
    const groupElem1 = await page.$x('//td[text()="' + capitalize(group) + '"]')
    logger.debug(groupElem1.length)
    if (groupElem1.length !== 0) {
        logger.error("Verifying association of User and Device failed")
        expect(true).toBe(false)
    } else {
        logger.info("Verifying association of User and Device Passed")
    }
    //TO DO : Move the login/logout codes to commom
    elemExists = await expect(page).toMatchElement('svg[type="UserCircle"]') ? true : false;
    if (elemExists == true) {
      expect(elemExists).toBe(true)
      await expect(page).toClick('svg[class="anticon valign-sub"]')
      await page.waitFor(1000)
      //const check1 = await expect(page).toClick('svg[type="UserCircle"]') ? true : false;
      await expect(page).toClick('span', { text: 'Signout' })
      await page.waitFor(2000)
    }
    await delay(2000)   
    config = await getEnvConfig()   
    await goTo(config.otaURL)
    await expect(page.title()).resolves.toMatch('Login - IoTium OTAccess');
    await customScreenshot('loginPage.png', 1920, 1200)
    await expect(page).toFill(constant.loginFormName, config.otaAdmin)
    //TO DO : Defaulting the user passord has to fix
    await expect(page).toFill(constant.loginFormPassword, config.otaAdminPassword)
    await expectToClick(constant.loginFormButton)
    logger.info("Hit login")
    await delay(2000)
    //await expect(page).toMatchElement('svg[type="user-circle"]')
    await expect(page).toMatchElement(constant.logoutuserprofile_xpath_selector)

}

export async function gotoGroupPage(verify=true)
{
    const groupElem = await page.$x(constant.dashSideBarGroupsSpan);
    //logger.info(groupElem) "Removing it as it casues confusion while debugging"
    logger.info(typeof groupElem) 
    if (groupElem.length !== 0) {
        if (verify == true ) {
            logger.info("Group option exist")
            await expect(page).toClick(constant.dashGroupSvg)
            await customScreenshot('GroupPage.png', 1920, 1200) 
        } else {
            logger.error("Group option exist")
            expect(groupElem).toBe(false)
        }
      } else {
        if (verify == true ) {
            logger.error('Group option not exist');
            expect(groupElem).toBe(false)
        }
        else {
            logger.info('Group option not exist');
            expect(true).toBe(true)
        }
    }
}

export async function verifyAddGroupButton()
{
    logger.info("verify add button group")
    const buttonExist = await expect(page).toMatchElement(constant.groupAddGroup) ? true : false;
    if (buttonExist == true ) {
        logger.info('Group add button exist');
    } else {
        logger.error('Group add button not exist');
        expect(buttonExist).toBe(false)
    }
    await page.waitFor(2000)
    await customScreenshot('AddGroupButton.png', 1920, 1200)    
}

export async function clickAddGroupButton()
{
    logger.info("verify and click add button group")
    await verifyAddGroupButton();     
    await expect(page).toClick(constant.groupAddGroup) 
    await page.waitFor(1000)   
    await customScreenshot('clickGroupButton.png', 1920, 1200)      
}

export function capitalize (s) {
    // TODO Add various other scenarios
    if (typeof s !== 'string') return s
    const list_string = s.split("_");
    let final_string = list_string[0]
    var arrayLength = list_string.length;
    for (var i = 1; i < arrayLength; i++) {
        
        final_string = final_string.concat("_", list_string[i].charAt(0).toUpperCase() + list_string[i].slice(1).toLowerCase())
    }
    return final_string
    //return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }

export async function submitGroup(name, desc, result=null)
{
    logger.info("Submitting group form")
    await delay(500)
    await performAction("type", constant.groupAddWindowName, "page", name)
    await performAction("type", constant.groupAddWindowDescription, "page", desc)
    await delay(1000)
    await expect(page).toClick(constant.groupAddWindowSubmitButton)   
    logger.debug("After clicking submit") 
    // While verifiying error message, spinner is not generated
    if(result===null) {
        expect(await verifyLoadingSpinner()).toBe(true)
    }
    else {
        let screenshot = await customScreenshot(result + '.png', 1920, 1200)
        reporter.addAttachment(result + "Screenshot", screenshot, "image/png");
        await delay(500)
    }
    if (result) {
        logger.debug(result.split(","))
        var res = result.split(",")
        var errorMsg;
        for (errorMsg in res) {
            logger.debug("Error :" + res[errorMsg])
            if (res[errorMsg] == "groupDescMandatory") {
                expect(expect(page).toMatchElement('div', { text: constant.groupDescMandatory, visible: true}) ? true : false).toBe(true);
            } else if (res[errorMsg] == "groupNameMandatory") {
                expect(expect(page).toMatchElement('div', { text: constant.groupNameMandatory, visible: true}) ? true : false).toBe(true);
            } else if (res[errorMsg] == "groupNameWrongInput") {
                expect(expect(page).toMatchElement('div', { text: constant.groupNameWrongInput, visible: true}) ? true : false).toBe(true);
            } else if (res[errorMsg] == "groupNameDigitOnlyError") {
                expect(expect(page).toMatchElement('span', { text: constant.groupNameDigitOnlyError, visible: true}) ? true : false).toBe(true);
                await delay(2000)
            } else if (res[errorMsg] == "groupDuplicateName") {
                expect(expect(page).toMatchElement('div', { text: constant.groupDuplicateName, visible: true}) ? true : false).toBe(true);
            }
        }
        let screenshot = await customScreenshot('verifyAddGroupButton.png', 1920, 1200)
        reporter.addAttachment("Submitting group form with input, Name : " + name + " Desc : " + desc, screenshot, "image/png");
        logger.debug("Clicking close") 
        await expect(page).toClick(constant.groupAddWindowClose)
        logger.debug("After clicking close")
        await delay(1000)
    }

    await delay(1000) 
}

export async function verifyRoles(name)
{
    logger.info("Verifying Roles")
    await gotoGroupPage()
    await delay(2000)
    const xPath = sprintf(groupprofilepage.role.groupname_title, name)
    logger.debug(xPath)
    const groupName = await page.$x(xPath)

    if (groupName.length !== 0) {
        await groupName[0].click()
        const accessRole = page.$x(sprintf(groupprofilepage.role.group_role_access, name))
        logger.info(accessRole)
        if (accessRole.lenght !==0 ) {
            logger.debug("Access Role For a group found")
            expect(true).toBe(true)
        } else {
            logger.error("Access Role For a group not found")
            expect(true).toBe(false)
        }
        const adminRole = await page.$x(sprintf(groupprofilepage.role.group_role_admin, name))
        if (adminRole.lenght !==0 ) {
            logger.debug("Admin Role For a group found")
            expect(true).toBe(true)
        } else {
            logger.error("Admin Role For a group not found")
            expect(true).toBe(false)
        }
        let screenshot = await customScreenshot('verifyRoles.png', 1920, 1200)
        reporter.addAttachment("Verifying Roles", screenshot, "image/png");
    } else {
        logger.error("Group Not Found on the table")
        let screenshot = await customScreenshot('verifyRoles.png', 1920, 1200)
        reporter.addAttachment("Verifying Roles", screenshot, "image/png");
        expect(true).toBe(false)
    }

}

export async function deleteGroup(groupname)
{
    logger.info("Deleting Group : " + groupname)
    await delay(1000)
    // Navigate to group page and select the specified group
    let result;
    await navigatePageByClick(leftpane.a.groupdashboard)
    await delay(2000) 

    await page.waitForXPath(grouplist.search.search_expand)
    result = await navigatePageByClick(grouplist.search.search_expand)
    expect(result).toBeTruthy()

    result = await performAction("type", group_search.name.name_input, "page", groupname)
    expect(result).toBeTruthy()

    result = await performAction("click", grouplist.search.search_button)
    expect(result).toBeTruthy()
    
    
    await delay(5000)
    let groupname_xpath = sprintf(group_search.name.display_name , groupname)
    let handle = await getElementHandleByXpath(groupname_xpath)
    expect(handle.length).toBe(1)
    // Click on the group name after search
    result = await performAction("click", groupname_xpath)
    expect(result).toBeTruthy()


    const groupElem = await page.$x(userprofilepage.user.username_val)
    logger.debug(groupElem.length)
    if (groupElem.length !== 0) {
        await delay(3000)
        await groupElem[0].click()
        await delay(4000)
        await expect(page).toClick(group_detail.action._delete_icon)
        await delay(5000)
        await expect(page).toClick(constant.groupAddWindowCloseButton)
    } else {
        logger.error("Group Not Found")
        expect(true).toBe(false)
    }

}
export async function verifyGroupOnboarded(groupname)
{
    logger.info("Verifiying Group Onboarded state : " + groupname)
    await delay(1000)
    // Navigate to group page and select the specified group
    let result;
    await navigatePageByClick(leftpane.a.groupdashboard)
    await delay(2000) 

    await page.waitForXPath(grouplist.search.search_expand)
    result = await navigatePageByClick(grouplist.search.search_expand)
    expect(result).toBeTruthy()

    result = await performAction("type", group_search.name.name_input, "page", groupname)
    expect(result).toBeTruthy()

    result = await performAction("click", grouplist.search.search_button)
    expect(result).toBeTruthy()
    
    
    await delay(5000)
    let groupname_xpath = sprintf(group_search.name.display_name , groupname)
    let handle = await getElementHandleByXpath(groupname_xpath)
    expect(handle.length).toBe(1)
    // Click on the group name after search
    result = await performAction("click", groupname_xpath)
    expect(result).toBeTruthy()

    // Wait time for group to be onboarded
    await delay(5000)
    const groupElem = await page.$x("//div[@class='userNameValue']//child::span[@type='check-circle']") 
    logger.debug(groupElem.length)
    if (groupElem.length != 0) {
        logger.info("Verifiying Group Onboarded state passed")
        let screenshot = await customScreenshot('verifyGroupOnboarded.png', 1920, 1200)
        reporter.addAttachment("Verifiying Group Onboarded state passed", screenshot, "image/png")
        expect(result).toBeTruthy()
    } else {
        expect(true).toBe(false)
        logger.error("Verifiying Group Onboarded state failed")
        let screenshot = await customScreenshot('verifyGroupOnboarded.png', 1920, 1200)
        reporter.addAttachment("Verifiying Group Onboarded state failed", screenshot, "image/png")
        expect(result).toBeTruthy()
    }

}
export async function add_Group(name, desc, result)
{
    logger.info("Add Group")
    let groupAddObj = new GroupAdd()
    groupAddObj.setGroupAdd(name, desc, result)
    await gotoGroupPage()
    await clickAddGroupButton()
    await submitGroup(groupAddObj.getName(), groupAddObj.getDescription(), result)
    return groupAddObj

}

export async function gotoAddGroup()
{
    reporter.startStep("When I navigate to gotoAddGroup Page");
    await expect(page).toClick(constant.dashSideBarDashSvg)
    await delay(2000)
    await expect(page).toMatchElement(constant.dashGroupSvg)
    await expect(page).toClick(constant.dashGroupSvg)
    await page.waitFor(1000)
    logger.info('clicked Group');

    await expect(page).toMatchElement(constant.groupAddGroup)
    await expect(page).toClick(constant.groupAddGroup)
    await page.waitFor(1000)
    reporter.endStep()
}

export const whenAdminAccessGroup  = when => {
    when(/^Admin access the group page$/, async (table) => {
        reporter.startStep('Admin User tries to access the group page.');
        await gotoGroupPage(true)
        let screenshot = await customScreenshot('whenAdminAccessGroup.png')
        reporter.addAttachment("Admin User tries to access the group page.", screenshot, "image/png");
        reporter.endStep()
})
}


export const thenICheckGroupAddButton  = then => {
    then(/^Admin navigate to group page and add group option is available$/, async (table) => {
      logger.info("Check Group ")
      reporter.startStep('Admin user is able to navigate to group page and add group option is available.');
      await verifyAddGroupButton()
      reporter.endStep()
})}


import { api_v1_myauthgrouproles_get } from '../helper/otagroupprofileapi'
import {api_v1_resourcegroups_post, api_v1_resourcegroups_id_delete} from '../helper/otaresourcegroupapi'
import {api_v1_groups_get} from '../helper/otaresourcegroupapi'

export async function getMyAuthGroupRolesId(rolename = []) {
    logger.info("Entering: helper/otagroupprofileapi.js/getMyAuthGroupRolesId");
    var id = []
    await api_v1_myauthgrouproles_get().then(resp => {
        let obj = resp.data.data.groupRoles.admin
        rolename.forEach(e => {
            obj.forEach(o => {
                if (o.groupRoleName === e.trim()) {
                    logger.info('Role Match Found.')
                    id.push(o.groupRoleObjectGUID)
                }
            })
        })
    }).catch(error => {
        logger.error(error)
    })
    return id
}


export async function api_AddResourceGroup(no) {
    logger.info("Entering: helper/otagroup.js/api_AddResourceGroup");
    for (let i = 1; i <= no; i++) {
        var suffix = "Api Group "+i
        var data = {
            "description": suffix,
            "name": suffix
        };
        await api_v1_resourcegroups_post(data).then(resp => {logger.info('Group Created.')}).catch(err => {logger.error(err)})
    }
}

export async function api_DeleteAllResourceGroup() {
    logger.info("Entering: helper/otagroup.js/api_DeleteAllResourceGroup");
    var id = []
    await api_v1_groups_get().then(resp => {
        let obj = resp.data.data
        let aaa = obj.filter(element => {
            if ((element.name).startsWith("Api Group") == true) {
                return element
            }
        });
        if (aaa.length > 0) {
            aaa.forEach(element => {
                id.push(element.objectGUID)
            });
        }
    }).catch(error => {
        logger.error(error)
    })
    
    id.forEach(_id => {
        api_v1_resourcegroups_id_delete(_id)
    })
    
}

export async function api_DeleteResourceGroupByName(name) {
    logger.info("Entering: helper/otagroup.js/api_DeleteResourceGroupByName");
    var id = []
    await api_v1_groups_get().then(resp => {
        let obj = resp.data.data
        let aaa = obj.filter(element => {
            if (element.name === name) {
                return element
            }
        });

        if (aaa.length > 0) {
            aaa.forEach(element => {
                api_v1_resourcegroups_id_delete(element.objectGUID)
            });
        }
    }).catch(error => {
        logger.error(error)
    })
}

export const whenIAddGroup = when => {
    when(/^I test add Group$/, async (table) => {
        logger.info("In Add Group")
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info("Groupname is : " + row.groupname)
            reporter.startStep("When I navigate to Group Page");
            await performAction("click", leftpane.a.groupdashboard)
            await page.waitFor(1000)
            await performAction("click", grouplist.button.add_group)
            reporter.startStep("Add User");
            await delay(1000)
            await performAction("type", addgroup.details.name, "page", row.groupname)
            await performAction("type", addgroup.details.description, "page", row.description)
            await performAction("click", addgroup.details.submit_button)
            }
           }
         )}

export const whenIEditGroup = when => {
    when(/^I test edit Group$/, async (table) => {
        logger.info("In edit Group")
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info("Groupname is : " + row.groupname)
            reporter.startStep("When I navigate to Group Page");
            await performAction("click", leftpane.a.groupdashboard)
            await page.waitFor(1000)
            await navigatePageByClick(grouplist.filter.group_name_search)
            await delay(1000)
            await performAction("type", group_search.name.input, "page", row.groupname)
            await delay(1000)
            await performAction("click", group_search.name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + row.groupname + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found group, will check details")
                let screenshot = await customScreenshot('Groupcheck.png', 1920, 1200)
                reporter.addAttachment("Group  check_", screenshot, "image/png");
            } else {
                logger.error("Group not Found")
            }
            await performAction("click", "//a[text()='" + row.groupname + "']")
            await performAction("click", groupprofilepage.group.group_expand)
            await delay(2000)
            await performAction("click",group_detail.action.edit_group)
            await delay(1000)
            let search = await getElementHandleByXpath(addgroup.details.description)
                await search[0].click({clickCount: 3})
            await performAction("type", addgroup.details.description, "page", row.newdescription)
            await performAction("click", addgroup.details.submit_button)
            }
           }
         )}

export const whenIDeleteGroup = when => {
    when(/^I test delete Group$/, async (table) => {
        logger.info("In delete Group")
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info("Groupname is : " + row.groupname)
            reporter.startStep("When I navigate to Group Page");
            await performAction("click", leftpane.a.groupdashboard)
            await page.waitFor(1000)
            await navigatePageByClick(grouplist.filter.group_name_search)
            await delay(1000)
            await performAction("type", group_search.name.input, "page", row.groupname)
            await delay(1000)
            await performAction("click", group_search.name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + row.groupname + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found group, will check details")
                let screenshot = await customScreenshot('Groupcheck.png', 1920, 1200)
                reporter.addAttachment("Group  check_", screenshot, "image/png");
            } else {
                logger.error("Group not Found")
            }
            await performAction("click", "//a[text()='" + row.groupname + "']")
            await performAction("click", groupprofilepage.group.group_expand)
            await delay(2000)
            await performAction("click",group_detail.action.delete)
            await delay(1000)
            await performAction("click", addgroup.details.submit_button)
            }
           }
         )}

// If user needs to be logged out after verification, send argument as "true"
// If connection for a seperate port needs to be verified, send the ID's as a list
export async function verifyDeviceUserAssociate(username, password, groupname, devicename, portId="", logout=false) {
    // Logging out and login again if verifiying for a new user
    let loginObj
    loginObj = new Login();
    if(logout) {
        await loginObj.logout()
        await loginObj.login(username, password)
    }
    // Expanding the respective group name
    logger.info("Verifiying device association available for user")
    let result
    result = await navigatePageByClick(leftpane.a.userprofilepage)
    await page.waitFor(1000)
    await performAction("type", userprofilepage.search._group_search_box, "page", groupname)
    page.keyboard.press('Enter');
    await performAction("hover", sprintf(userprofilepage.device._device_title, devicename))
    let popoverElement = await getElementHandleByXpath(userprofilepage.device._device_popover_elt)
    let connectionText = await getPropertyValueByXpath(userprofilepage.device._device_popover_elt+ "[" + (popoverElement.length-2).toString() + "]","textContent")
    let connectionport = connectionText.split('/')[1]
    var found = false
    for(let i=0;i<portId.length;i++) {
        if(connectionport == portId[i]) {
            found = true
            logger.info("Verifiying device association available for user: "+ username + " for groupname: "+ groupname + " and portID:" + portId[i] + " passed")
            let screenshot = await customScreenshot('verifyDeviceUserAssociate.png')
            reporter.addAttachment("Verifiying device association available for user: "+ username + " for groupname: "+ groupname + " and portID:" + portId[i], screenshot, "image/png");   
        }
    }
    if(!found) {
        logger.error("Verifiying device association is not available for user: "+ username + " for groupname: "+ groupname +" failed")
        let screenshot = await customScreenshot('verifyDeviceUserAssociate.png')
        reporter.addAttachment("Verifiying device association is not available for user: "+ username + " for groupname: "+ groupname+ " and portID:" + portId.toString(), screenshot, "image/png");  
    }
}

// If user needs to be logged out after verification, send argument as "true"
// If connection for a seperate port needs to be verified, send the ID's as a list
export async function verifyDeviceUserDisassociate(username, password, groupname, devicename, portId="", logout=false) {
    // Logging out and login again if verifiying for a new user
    let loginObj
    loginObj = new Login();
    if(logout) {
        await loginObj.logout()
        await loginObj.login(username, password)
    }
    // Expanding the respective group name
    logger.info("Verifiying device is not associated for user")
    let result
    result = await navigatePageByClick(leftpane.a.userprofilepage)
    await page.waitFor(1000)
    await performAction("type", userprofilepage.search._group_search_box, "page", groupname)
    page.keyboard.press('Enter');
    await performAction("hover", sprintf(userprofilepage.device._device_title, devicename))
    let popoverElement = await getElementHandleByXpath(userprofilepage.device._device_popover_elt)
    let connectionText = await getPropertyValueByXpath(userprofilepage.device._device_popover_elt+ "[" + (popoverElement.length-2).toString() + "]","textContent")
    let connectionport = connectionText.split('/')[1]
    var found = false
    for(let i=0;i<portId.length;i++) {
        if(connectionport == portId[i]) {
            found = true
            logger.error("Device association is available for user: "+ username + "for groupname: "+ groupname + " and portID:" + portId[i] + " failed")
            let screenshot = await customScreenshot('verifyDeviceUserAssociate.png')
            reporter.addAttachment("Device association is available for user: "+ username + "for groupname: "+ groupname + " and portID:" + portId[i], screenshot, "image/png");  
            break;
        }
    }
    if(!found) {
        logger.info("Verifiying device is not associated for user: "+ username + "for groupname: "+ groupname + " passed")
        let screenshot = await customScreenshot('verifyDeviceUserAssociate.png')
        reporter.addAttachment("Verifiying device is not associated for user: "+ username + "for groupname: "+ groupname+ " and portID:" + portId.toString(), screenshot, "image/png");  
    }
}