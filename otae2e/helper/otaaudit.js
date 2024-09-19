import { createPDF, customScreenshot, delay, waitforotaloader, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, goTo } from '../../e2e/utils/utils';
import { logger } from "../log.setup";
import { isExportAllDeclaration } from "@babel/types";
import { add_auth_domain_page, otalogin, password_reset, leftpane, dashboard, userlist, devicelist, grouplist,audit_page, auditlist, orgpage, userprofilepage, groupprofilepage, deviceprofilepage, adddevice, addendpoint, addgroup, adduser, user_role_association, device_role_association, user_detail, device_detail, group_detail, endpoint_review, user_search, device_search, group_search } from '../constants/locators';
//import {OTPAuth} from "https://deno.land/x/otpauth/dist/otpauth.esm.js";
import * as OTPAuth from 'otpauth';
import * as Jimp from "jimp";
//import * as QrCode from "qrcode-reader";
import QrCode from 'qrcode-reader';
import { getEnvConfig } from '../utils/utils';


export const thenVerifyAuditLogs = then => {
    then(/^Verify audit log$/, async (table) => {
        logger.info("In Verify Audit Logs")
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            if (row.type == "user") {
                // Get current user's Username
                let currentuser = row.currentuserfirstname + " " + row.currentuserlastname
                logger.info("User name is : " + currentuser)
                await navigatePageByClick(leftpane.a.userdashboard)
                await delay(1000)
                await navigatePageByClick(userlist.filter.full_name_search)
                await performAction("type", user_search.full_name.input, "page", currentuser)
                await performAction("click", user_search.full_name.search_button)
                await waitforotaloader()
                let handle = await getElementHandleByXpath("//td//a[text()='" + currentuser + "']")
                expect(handle.length).toBe(1)
                if (handle.length == 1) {
                    logger.info("Found user, will check details")
                    let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User not Found")
                }
                await performAction("click", "//a[text()='" + currentuser + "']")
                await performAction("click", userprofilepage.user.username_expand)
                let element123 = await page.$x("//strong[text()='Username']//parent::div//following-sibling::div")
                if (element123 != []) {
                    logger.info("match found")
                }
                let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
                reporter.addAttachment("User name check_", screenshot, "image/png");
                //const element = await expect(page).toMatchElement('div[class="ant-col ant-col-12"]');
                logger.info("Element is ----> " + element123[0])
                //try element(text)
                const currentusername = await (await element123[0].getProperty('innerText')).jsonValue();
                logger.info("Username -----> " + currentusername)

                // Get new User's Username
                let newuser = row.newuserfirstname + " " + row.newuserlastname
                logger.info("User name is : " + newuser)
                await navigatePageByClick(leftpane.a.userdashboard)
                await delay(1000)
                await navigatePageByClick(userlist.filter.full_name_search)
                await performAction("type", user_search.full_name.input, "page", newuser)
                await performAction("click", user_search.full_name.search_button)
                await waitforotaloader()
                let handle1 = await getElementHandleByXpath("//td//a[text()='" + newuser + "']")
                expect(handle1.length).toBe(1)
                if (handle1.length == 1) {
                    logger.info("Found user, will check details")
                    let screenshot2 = await customScreenshot('Usercheck2.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot2, "image/png");
                } else {
                    logger.error("User not Found")
                }
                await performAction("click", "//a[text()='" + newuser + "']")
                await performAction("click", userprofilepage.user.username_expand)
                let element1234 = await page.$x("//strong[text()='Username']//parent::div//following-sibling::div")
                if (element1234 != []) {
                    logger.info("match found")
                }
                let screenshot1 = await customScreenshot('Usenamecheck1.png', 1920, 1200)
                reporter.addAttachment("User name check_", screenshot1, "image/png");
                //const element = await expect(page).toMatchElement('div[class="ant-col ant-col-12"]');
                logger.info("Element is ----> " + element1234[0])
                //try element(text)
                const newusername = await (await element1234[0].getProperty('innerText')).jsonValue();
                logger.info("Username -----> " + newusername)

                // Goto Audit page
                await delay(5000)
                let action = await performAction("hover", leftpane.span.accountBook)
                expect(action).toBeTruthy()
                let screenshot3 = await customScreenshot('auditlist.png', 1920, 1200)
                reporter.addAttachment("auditlist", screenshot3, "image/png");
                await delay(2000)
                let navigated = await navigatePageByClick(leftpane.a.auditdashboard)
                expect(navigated).toBeTruthy()
                expect(navigated < 10.0).toBe(true)

                if (row.action == "create") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="User '`+newusername+`' is created by '`+currentusername+`' "]`
                    let out1 = await getElementHandleByXpath(match)
                    expect(out1.length).toBe(1)
                    if (out1.length == 1) {
                        logger.info("Found user create audit log")
                        let screenshot4 = await customScreenshot('Auditcheck4.png', 1920, 1200)
                        reporter.addAttachment("User create Audit log  check_", screenshot4, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user create")
                    }
                }
                if (row.action == "add_user_to_group") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Role '`+row.groupname+`' added to user '`+newusername+`' by '`+currentusername+`' "]`
                    let out2 = await getElementHandleByXpath(match)
                    expect(out2.length).toBe(1)
                    if (out2.length == 1) {
                        logger.info("Found user add to group audit log")
                        let screenshot5 = await customScreenshot('Auditcheck5.png', 1920, 1200)
                        reporter.addAttachment("User add to group Audit log  check_", screenshot5, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user add to group")
                    }
                }
                if (row.action == "remove_user_from_group") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Role '`+row.groupname+`' removed from user '`+newusername+`' by '`+currentusername+`' "]`
                    let out3 = await getElementHandleByXpath(match)
                    expect(out3.length).toBe(1)
                    if (out3.length == 1) {
                        logger.info("Found user remove from group audit log")
                        let screenshot6 = await customScreenshot('Auditcheck6.png', 1920, 1200)
                        reporter.addAttachment("User remove from group Audit log  check_", screenshot6, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user remove to group")
                    }
                }
                if (row.action == "edituser") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="User '`+newusername+`' is updated by '`+currentusername+`' "]`
                    let out4 = await getElementHandleByXpath(match)
                    expect(out4.length).toBe(1)
                    if (out4.length == 1) {
                        logger.info("Found user update audit log")
                        let screenshot7 = await customScreenshot('Auditcheck7.png', 1920, 1200)
                        reporter.addAttachment("User edit Audit log  check_", screenshot7, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user edit")
                    }
                }
                if (row.action == "passwordreset") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Password reset for user '`+newusername+`' by '`+currentusername+`' "]`
                    let out5 = await getElementHandleByXpath(match)
                    expect(out5.length).toBeGreaterThanOrEqual(1)
                    if (out5.length >= 1) {
                        logger.info("Found user password reset audit log")
                        let screenshot8 = await customScreenshot('Auditcheck8.png', 1920, 1200)
                        reporter.addAttachment("User password reset Audit log  check_", screenshot8, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user password reset")
                    }
                }
                if (row.action == "mfaenable") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="MFA enabled for user '`+newusername+`' by '`+currentusername+`' "]`
                    let out6 = await getElementHandleByXpath(match)
                    expect(out6.length).toBeGreaterThanOrEqual(1)
                    if (out6.length >= 1) {
                        logger.info("Found user mfa enable audit log")
                        let screenshot9 = await customScreenshot('Auditcheck9.png', 1920, 1200)
                        reporter.addAttachment("User mfa enable Audit log  check_", screenshot9, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user mfa enable")
                    }
                }
                if (row.action == "mfareset") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="MFA reset for user '`+newusername+`' by '`+currentusername+`' "]`
                    let out7 = await getElementHandleByXpath(match)
                    expect(out7.length).toBeGreaterThanOrEqual(1)
                    if (out7.length >= 1) {
                        logger.info("Found user mfa reset audit log")
                        let screenshot10 = await customScreenshot('Auditcheck10.png', 1920, 1200)
                        reporter.addAttachment("User mfa reset Audit log  check_", screenshot10, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user mfa reset")
                    }
                }
                if (row.action == "mfadisable") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="MFA disabled for user '`+newusername+`' by '`+currentusername+`' "]`
                    let out8 = await getElementHandleByXpath(match)
                    expect(out8.length).toBeGreaterThanOrEqual(1)
                    if (out8.length >= 1) {
                        logger.info("Found user mfa disable audit log")
                        let screenshot11 = await customScreenshot('Auditcheck11.png', 1920, 1200)
                        reporter.addAttachment("User mfa disable Audit log  check_", screenshot11, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user mfa disable")
                    }
                }
                if (row.action == "userstatusdisable") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="User '`+newusername+`' is disabled by '`+currentusername+`' "]`
                    let out9 = await getElementHandleByXpath(match)
                    expect(out9.length).toBeGreaterThanOrEqual(1)
                    if (out9.length >= 1) {
                        logger.info("Found user status disable audit log")
                        let screenshot12 = await customScreenshot('Auditcheck12.png', 1920, 1200)
                        reporter.addAttachment("User status disable Audit log  check_", screenshot12, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user status disable")
                    }
                }
                if (row.action == "userstatusenable") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="User '`+newusername+`' is enabled by '`+currentusername+`' "]`
                    let out10 = await getElementHandleByXpath(match)
                    expect(out10.length).toBeGreaterThanOrEqual(1)
                    if (out10.length >= 1) {
                        logger.info("Found user status enable audit log")
                        let screenshot13 = await customScreenshot('Auditcheck13.png', 1920, 1200)
                        reporter.addAttachment("User status enable Audit log  check_", screenshot13, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user status enable")
                    }
                }
                if (row.action == "delete") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="User '`+newusername+`' is deleted by '`+currentusername+`' "]`
                    let out11 = await getElementHandleByXpath(match)
                    expect(out11.length).toBeGreaterThanOrEqual(1)
                    if (out11.length >= 1) {
                        logger.info("Found user delete audit log")
                        let screenshot14 = await customScreenshot('Auditcheck14.png', 1920, 1200)
                        reporter.addAttachment("User delete Audit log  check_", screenshot14, "image/png");
                    } else {
                        logger.error("Audit Log not Found for user delete")
                    }
                }
        }
        if (row.type == "device") {
                // Get current user's Username
                let currentuser = row.currentuserfirstname + " " + row.currentuserlastname
                logger.info("User name is : " + currentuser)
                await navigatePageByClick(leftpane.a.userdashboard)
                await delay(1000)
                await navigatePageByClick(userlist.filter.full_name_search)
                await performAction("type", user_search.full_name.input, "page", currentuser)
                await performAction("click", user_search.full_name.search_button)
                await waitforotaloader()
                let handle = await getElementHandleByXpath("//td//a[text()='" + currentuser + "']")
                expect(handle.length).toBe(1)
                if (handle.length == 1) {
                    logger.info("Found user, will check details")
                    let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User not Found")
                }
                await performAction("click", "//a[text()='" + currentuser + "']")
                await performAction("click", userprofilepage.user.username_expand)
                let element123 = await page.$x("//strong[text()='Username']//parent::div//following-sibling::div")
                if (element123 != []) {
                    logger.info("match found")
                }
                let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
                reporter.addAttachment("User name check_", screenshot, "image/png");
                //const element = await expect(page).toMatchElement('div[class="ant-col ant-col-12"]');
                logger.info("Element is ----> " + element123[0])
                //try element(text)
                const currentusername = await (await element123[0].getProperty('innerText')).jsonValue();
                logger.info("Username -----> " + currentusername)
                // Goto Audit page
                await delay(5000)
                let action = await performAction("hover", leftpane.span.accountBook)
                expect(action).toBeTruthy()
                let screenshot3 = await customScreenshot('auditlist.png', 1920, 1200)
                reporter.addAttachment("auditlist", screenshot3, "image/png");
                await delay(2000)
                let navigated = await navigatePageByClick(leftpane.a.auditdashboard)
                expect(navigated).toBeTruthy()
                expect(navigated < 10.0).toBe(true)

                if (row.action == "create") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Device '`+row.devicename+`' is created by '`+currentusername+`' "]`
                    let out1 = await getElementHandleByXpath(match)
                    expect(out1.length).toBeGreaterThanOrEqual(1)
                    if (out1.length >= 1) {
                        logger.info("Found Device create audit log")
                        let screenshot1 = await customScreenshot('Auditcheck1.png', 1920, 1200)
                        reporter.addAttachment("Device create Audit log  check_", screenshot1, "image/png");
                    } else {
                        logger.error("Audit Log not Found for Device create")
                    }
                }
                if (row.action == "endpointcreate") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Connection '`+row.connectendpoint+`' is created on device '`+row.devicename+`' by '`+currentusername+`' "]`
                    let out2 = await getElementHandleByXpath(match)
                    expect(out2.length).toBeGreaterThanOrEqual(1)
                    if (out2.length >= 1) {
                        logger.info("Found connection endpoint create audit log")
                        let screenshot2 = await customScreenshot('Auditcheck2.png', 1920, 1200)
                        reporter.addAttachment("connection endpoint create Audit log  check_", screenshot2, "image/png");
                    } else {
                        logger.error("Audit Log not Found for connection endpoint create")
                    }
                }
                if (row.action == "endpointgroupassociation") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Group '`+row.usergroup+`' added to the connection '`+row.connectendpoint+`' on device '`+row.devicename+`' by '`+currentusername+`' "]`
                    let out3 = await getElementHandleByXpath(match)
                    expect(out3.length).toBeGreaterThanOrEqual(1)
                    if (out3.length >= 1) {
                        logger.info("Found connection endpoint and group association audit log")
                        let screenshot3 = await customScreenshot('Auditcheck3.png', 1920, 1200)
                        reporter.addAttachment("connection endpoint and group association Audit log  check_", screenshot3, "image/png");
                    } else {
                        logger.error("Audit Log not Found for connection endpoint and group association")
                    }
                }
                if (row.action == "endpointdelete") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Connection '`+row.connectendpoint+`' is deleted on device '`+row.devicename+`' by '`+currentusername+`' "]`
                    let out3 = await getElementHandleByXpath(match)
                    expect(out3.length).toBeGreaterThanOrEqual(1)
                    if (out3.length >= 1) {
                        logger.info("Found connection endpoint delete audit log")
                        let screenshot3 = await customScreenshot('Auditcheck3.png', 1920, 1200)
                        reporter.addAttachment("connection endpoint delete Audit log  check_", screenshot3, "image/png");
                    } else {
                        logger.error("Audit Log not Found for connection endpoint delete")
                    }
                }
                if (row.action == "delete") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Device '`+row.devicename+`' is deleted by '`+currentusername+`' "]`
                    let out3 = await getElementHandleByXpath(match)
                    expect(out3.length).toBeGreaterThanOrEqual(1)
                    if (out3.length >= 1) {
                        logger.info("Found Device delete audit log")
                        let screenshot3 = await customScreenshot('Auditcheck3.png', 1920, 1200)
                        reporter.addAttachment("device delete Audit log  check_", screenshot3, "image/png");
                    } else {
                        logger.error("Audit Log not Found for device delete")
                    }
                }
                }
        if (row.type == "group") {
                // Get current user's Username
                await delay(2000)
                let currentuser = row.currentuserfirstname + " " + row.currentuserlastname
                logger.info("User name is : " + currentuser)
                await navigatePageByClick(leftpane.a.userdashboard)
                await delay(1000)
                await navigatePageByClick(userlist.filter.full_name_search)
                await performAction("type", user_search.full_name.input, "page", currentuser)
                await performAction("click", user_search.full_name.search_button)
                await waitforotaloader()
                let handle = await getElementHandleByXpath("//td//a[text()='" + currentuser + "']")
                expect(handle.length).toBe(1)
                if (handle.length == 1) {
                    logger.info("Found user, will check details")
                    let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User not Found")
                }
                await performAction("click", "//a[text()='" + currentuser + "']")
                await performAction("click", userprofilepage.user.username_expand)
                let element123 = await page.$x("//strong[text()='Username']//parent::div//following-sibling::div")
                if (element123 != []) {
                    logger.info("match found")
                }
                let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
                reporter.addAttachment("User name check_", screenshot, "image/png");
                //const element = await expect(page).toMatchElement('div[class="ant-col ant-col-12"]');
                logger.info("Element is ----> " + element123[0])
                //try element(text)
                const currentusername = await (await element123[0].getProperty('innerText')).jsonValue();
                logger.info("Username -----> " + currentusername)
                // Goto Audit page
                await delay(5000)
                let action = await performAction("hover", leftpane.span.accountBook)
                expect(action).toBeTruthy()
                let screenshot3 = await customScreenshot('auditlist.png', 1920, 1200)
                reporter.addAttachment("auditlist", screenshot3, "image/png");
                await delay(2000)
                let navigated = await navigatePageByClick(leftpane.a.auditdashboard)
                expect(navigated).toBeTruthy()
                expect(navigated < 10.0).toBe(true)

                if (row.action == "create") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Group '`+row.groupname+`' created by '`+currentusername+`' "]`
                    let out3 = await getElementHandleByXpath(match)
                    expect(out3.length).toBeGreaterThanOrEqual(1)
                    if (out3.length >= 1) {
                        logger.info("Found Group Create audit log")
                        let screenshot3 = await customScreenshot('Auditcheck3.png', 1920, 1200)
                        reporter.addAttachment("Group Create Audit log  check_", screenshot3, "image/png");
                    } else {
                        logger.error("Audit Log not Found for Group Create")
                    }
                }
                if (row.action == "edit") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Group '`+row.groupname+`' updated by '`+currentusername+`' "]`
                    let out3 = await getElementHandleByXpath(match)
                    expect(out3.length).toBeGreaterThanOrEqual(1)
                    if (out3.length >= 1) {
                        logger.info("Found Group Edit audit log")
                        let screenshot3 = await customScreenshot('Auditcheck3.png', 1920, 1200)
                        reporter.addAttachment("Group Edit Audit log  check_", screenshot3, "image/png");
                    } else {
                        logger.error("Audit Log not Found for Group Edit")
                    }
                }
                if (row.action == "delete") {
                    await delay(2000)
                    await performAction("click",auditlist.user_activity_table.userid_name_search)
                    await delay(2000)
                    await performAction("type",audit_page.userid.input,"page",currentusername)
                    await performAction("click",audit_page.userid.search)
                    let match = `//tr//td[text()="Group '`+row.groupname+`' deleted by '`+currentusername+`' "]`
                    let out3 = await getElementHandleByXpath(match)
                    expect(out3.length).toBeGreaterThanOrEqual(1)
                    if (out3.length >= 1) {
                        logger.info("Found Group delete audit log")
                        let screenshot3 = await customScreenshot('Auditcheck3.png', 1920, 1200)
                        reporter.addAttachment("Group delete Audit log  check_", screenshot3, "image/png");
                    } else {
                        logger.error("Audit Log not Found for Group Delete")
                    }
                }



        }







        }
    });
}