import { createPDF, customScreenshot, delay, waitforotaloader, navigatePageByClick, getElementHandleByXpath, getPropertyValue, compareValue, autoScroll, performAction, getPropertyValueByXpath, verifyModal, goTo, verifyLoaginr, pathJoin } from '../../utils/utils';
import { logger } from "../log.setup";
import { isExportAllDeclaration } from "@babel/types";
import { Login, Logout, Launch, login } from '../helper/otalogin';
import { add_auth_domain_page, otalogin, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage, deviceprofilepage, adddevice, addendpoint, addgroup, adduser, user_role_association, device_role_association, user_detail, device_detail, group_detail, endpoint_review, user_search, device_search, group_search, accesslist, schedule_access, notification_banner } from '../constants/locators';
//import {OTPAuth} from "https://deno.land/x/otpauth/dist/otpauth.esm.js";
import * as OTPAuth from 'otpauth';
import * as Jimp from "jimp";
//import * as QrCode from "qrcode-reader";
import QrCode from 'qrcode-reader';
import { getEnvConfig } from '../../utils/utils';
export const firstname_error = "First name cannot contain digits or special characters"
export const lastname_error = "Last name cannot contain digits or special characters"
export const email_error = "Email is not valid"
export const password_error = "Password must have a minimum length of 8 with three of the four - one uppercase, one lowercase, one digit, one special character(!@#$%^&*) and may not contain spaces/name/login name"
export const confirmpsw_error = "Password must have a minimum length of 8 with three of the four - one uppercase, one lowercase, one digit, one special character(!@#$%^&*) and may not contain spaces/name/login name"
export const phone_error = "Phone number is not valid"
var formattedTimeOneMinuteLater;
var formattedTimeFifteenMinutesLater;
var formattedCurrentTime;
var oneMinuteLater;
var fifteenMinutesLater;
var currentTime;
var timePart;
var time;
var splitCurrentDate;
var spliTFutureDate;
var endOfTheMonthDate;
var formattedTodayCurrentDate;
var formattedEndOfMonthDate;
var weekType;
var currentDayOfWeek;
var suffix;
var dayName;
export async function gotoAddUser() {
    reporter.startStep("When I navigate to user Page");
    await performAction("click", leftpane.a.userdashboard)
    //await expect(page).toMatchElement('svg[type="Users"]')
    //await expect(page).toClick('svg[type="Users"]')
    await page.waitFor(1000)
    logger.info('clicked users');

    //await expect(page).toMatchElement('button[class="ant-btn ant-btn-primary ant-btn-sm"')
    //await expect(page).toClick('button[class="ant-btn ant-btn-primary ant-btn-sm"')
    await performAction("click", userlist.button.add_user)
    await page.waitFor(1000)
    reporter.endStep()
}

export const whenIAddUser = when => {
    when(/^I test add user$/, async (table) => {
        logger.info("In Add User")
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("Username is : " + user)
            gotoAddUser()
            reporter.startStep("Add User");
            await performAction("type", adduser.details.first_name, "page", row.firstname)
            await performAction("type", adduser.details.last_name, "page", row.lastname)
            await performAction("type", adduser.details.email, "page", row.email)
            await delay(1000)
            if (row.auth == 'internal') {
                await performAction("click", adduser.details.auth_domain)
                await performAction("click", "//div[text()='OTA Internal']")
                await delay(1000)
                await performAction("type", adduser.details._password, "page", row.password)
                await performAction("type", adduser.details._confirm_password, "page", row.confirmpsw)
            } else {
                await performAction("click", adduser.details.auth_domain)
                await performAction("click", "//div[text()='" + row.auth + "']")
            }
            if (row.mfa == 'enable') {
                await performAction("click", adduser.details.mfa)
            }
            await performAction("type", adduser.details.phone, row.phone)
            let screenshot = await customScreenshot('adduser.png', 1920, 1200)
            reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
            await performAction("click", adduser.details.submit_button)
            await delay(3000)
            //const userres = await expect(page).toMatchElement(div[class="ant-modal-title"]') ? true : false;
            logger.info("User Creation is successfull")
            if (row.usergroup != '') {
                logger.info("Try associating group")
                await getElementHandleByXpath("//div[text()='Role Association']")
                await delay(3000)
                await performAction("click", user_role_association.details.select_group)
                await delay(1000)
                await performAction("type", user_role_association.details.select_group, "page", row.usergroup)
                await delay(1000)
                await performAction("click", "//div[text()='" + row.usergroup + "']")
                await delay(2000)
                await performAction("click", "//div[text()='Role Association']")
                await performAction("click", user_role_association.details.submit_button)
                let screenshot = await customScreenshot('addusergroup.png', 1920, 1200)
                reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
                let group_edit = await getElementHandleByXpath("//span[text()='Successfully updated role association for user " + user + "']")
                if (group_edit.length == 1) {
                    logger.info("User group associated successfully")
                } else {
                    logger.error("User group association failed")
                }
            } else {
                await performAction("click", user_role_association.details.cancel_button)
            }
            await page.waitFor(2000)
            //let screenshot = await customScreenshot('UserAdd.png', 1920, 1200)
            //reporter.addAttachment("User Added_", screenshot, "image/png");
            reporter.endStep();

        }
    });
}

export const whenIAddExternalUser = when => {
    when(/^I test add external user$/, async (table) => {
        logger.info("I test add external user")
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("Username is : " + user)
            gotoAddUser()
            reporter.startStep("Add User");
            await performAction("type", adduser.details.first_name, "page", row.firstname)
            await performAction("type", adduser.details.last_name, "page", row.lastname)
            await performAction("type", adduser.details.email, "page", row.email)
            await delay(1000)
            if (row.auth == 'internal') {
                await performAction("click", adduser.details.auth_domain)
                await performAction("click", "//div[text()='OTA Internal']")
                await delay(1000)
                await performAction("type", adduser.details._password, "page", row.password)
                await performAction("type", adduser.details._confirm_password, "page", row.confirmpsw)
            } else {
                await performAction("click", adduser.details.auth_domain)
                await performAction("click", "//div[text()='" + row.auth + "']")
            }
            if (row.mfa == 'enable') {
                await performAction("click", adduser.details.mfa)
            }
            await performAction("type", adduser.details.phone, row.phone)
            let screenshot = await customScreenshot('adduser.png', 1920, 1200)
            reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
            await performAction("click", adduser.details.submit_button)
            await delay(3000)
            //const userres = await expect(page).toMatchElement(div[class="ant-modal-title"]') ? true : false;
            logger.info("User Creation is successfull")
            if (row.usergroup != '') {
                logger.info("Try associating group")
                await getElementHandleByXpath("//div[text()='Role Association']")
                await delay(3000)
                await performAction("click", user_role_association.details.select_group)
                await performAction("type", user_role_association.details.select_group, "page", row.usergroup)
                await performAction("click", "//div[text()='" + row.usergroup + "']")
                await delay(2000)
                await performAction("click", "//div[text()='Role Association']")
                await performAction("click", user_role_association.details.submit_button)
                let screenshot = await customScreenshot('addusergroup.png', 1920, 1200)
                reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
                let group_edit = await getElementHandleByXpath("//span[text()='Successfully updated role association for user " + user + "']")
                if (group_edit.length == 1) {
                    logger.info("User group associated successfully")
                } else {
                    logger.error("User group association failed")
                }
            } else {
                await performAction("click", user_role_association.details.cancel_button)
            }
            await page.waitFor(2000)
            //let screenshot = await customScreenshot('UserAdd.png', 1920, 1200)
            //reporter.addAttachment("User Added_", screenshot, "image/png");
            reporter.endStep();

        }
    });
}


export const thenIEditUser = then => {
    then(/^I test edit user$/, async (table) => {
        logger.info("In Edit User")
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("Username is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(5000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", user_detail.action.edit_user)
            if (row.firstname != '') {
                let search = await getElementHandleByXpath(adduser.details.first_name)
                await search[0].click({ clickCount: 3 })
                await performAction("type", adduser.details.first_name, "page", row.newfirstname)
            }
            if (row.lastname != '') {
                let search = await getElementHandleByXpath(adduser.details.last_name)
                await search[0].click({ clickCount: 3 })
                await performAction("type", adduser.details.last_name, "page", row.newlastname)
            }
            if (row.mfa != '') {
                if (row.mfa == 'enable') {
                    await performAction("click", adduser.details.mfa)
                }
            }
            if (row.phone != '') {
                await performAction("type", adduser.details.phone, row.phone)
            }
            let screenshot = await customScreenshot('adduser.png', 1920, 1200)
            reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
            await performAction("click", addgroup.details.submit_button)
            await delay(3000)
            //const userres = await expect(page).toMatchElement(div[class="ant-modal-title"]') ? true : false;
            logger.info("User Edit is successfull")
            await page.waitFor(2000)
            //let screenshot = await customScreenshot('UserAdd.png', 1920, 1200)
            //reporter.addAttachment("User Added_", screenshot, "image/png");

        }
    });
}


export const whenIEditUser = when => {
    when(/^I test edit user$/, async (table) => {
        logger.info("In Edit User")
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("Username is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(5000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", user_detail.action.edit_user)
            await delay(1000)
            if (row.firstname != '') {
                let search = await getElementHandleByXpath(adduser.details.first_name)
                await search[0].click({ clickCount: 3 })
                await performAction("type", adduser.details.first_name, "page", row.newfirstname)
            }
            if (row.lastname != '') {
                let search = await getElementHandleByXpath(adduser.details.last_name)
                await search[0].click({ clickCount: 3 })
                await performAction("type", adduser.details.last_name, "page", row.newlastname)
            }
            if (row.mfa != '') {
                if (row.mfa == 'enable') {
                    await performAction("click", adduser.details.mfa)
                }
            }
            if (row.phone != '') {
                await performAction("type", adduser.details.phone, row.phone)
            }
            let screenshot = await customScreenshot('adduser.png', 1920, 1200)
            reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
            await performAction("click", addgroup.details.submit_button)
            await delay(3000)
            //const userres = await expect(page).toMatchElement(div[class="ant-modal-title"]') ? true : false;
            logger.info("User Edit is successfull")
            await page.waitFor(2000)
            //let screenshot = await customScreenshot('UserAdd.png', 1920, 1200)
            //reporter.addAttachment("User Added_", screenshot, "image/png");
        }
    });
}

export const thenCheckUser = then => {
    then(/^check User$/, async (table) => {
        logger.info("check User")
        reporter.startStep("check User");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("Username is : " + user)
            reporter.startStep("Navigate to User details and very user groups");
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            if (row.usergroup != '') {
                await performAction("click", "//a[text()='" + user + "']")
                await performAction("click", userprofilepage.user.username_expand)
                await delay(1000)
                await performAction("click", user_detail.action.edit_role)
                let user_role = await getElementHandleByXpath("//span[text()='" + row.usergroup + "']")
                if (user_role.length == 1) {
                    logger.info("User group is associated properly")
                    let screenshot = await customScreenshot('Userrolecheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User group not Found")
                }
                await performAction("click", user_role_association.details.cancel_button)
            }
            reporter.endStep();

        }
    }
    )
}

export const thenGetUsername = then => {
    then(/^Get Username$/, async (table) => {
        logger.info("Get UserID")
        reporter.startStep("Get UserID");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
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
            const text = await (await element123[0].getProperty('innerText')).jsonValue();
            logger.info("Username -----> " + text)
            //await expect(page).toClick('svg[data-icon="close"]')
            return (text)
            reporter.endStep();

        }
    }
    )
}


export const thenChangeUserGroup = then => {
    then(/^Change UserGroup$/, async (table) => {
        logger.info("Change UserGroup")
        reporter.startStep("Change UserGroup");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            if (row.oldusergroup != '') {
                await navigatePageByClick(leftpane.a.userdashboard)
                await delay(1000)
                await navigatePageByClick(userlist.filter.full_name_search)
                await performAction("type", user_search.full_name.input, "page", user)
                await performAction("click", user_search.full_name.search_button)
                await waitforotaloader()
                let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
                expect(handle.length).toBe(1)
                if (handle.length == 1) {
                    logger.info("Found user, will check details")
                    let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User not Found")
                }
                await performAction("click", "//a[text()='" + user + "']")
                await performAction("click", userprofilepage.user.username_expand)
                await delay(1000)
                await performAction("click", user_detail.action.edit_role)
                await getElementHandleByXpath("//div[text()='Role Association']")
                let user_role = await getElementHandleByXpath("//span[text()='" + row.oldusergroup + "']")
                if (user_role.length == 1) {
                    logger.info("User group is associated properly")
                    let screenshot = await customScreenshot('Userrolecheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User group not Found")
                }
                await performAction("click", "//span[text()='" + row.oldusergroup + "']//following-sibling::span[@class='ant-select-selection-item-remove']")
                let screenshot = await customScreenshot('User1.png', 1920, 1200)
                reporter.addAttachment("User1", screenshot, "image/png");
                await delay(3000)
                await performAction("click", user_role_association.details.submit_button)
                await getElementHandleByXpath(user_detail.details.email)
                logger.info("Usergroup association done")
            }
            if (row.newusergroup != '') {
                await delay(2000)
                logger.info("Start new user group association")
                await navigatePageByClick(leftpane.a.userdashboard)
                await delay(1000)
                await navigatePageByClick(userlist.filter.full_name_search)
                await performAction("type", user_search.full_name.input, "page", user)
                await performAction("click", user_search.full_name.search_button)
                await waitforotaloader()
                let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
                expect(handle.length).toBe(1)
                if (handle.length == 1) {
                    logger.info("Found user, will check details")
                    let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User not Found")
                }
                await performAction("click", "//a[text()='" + user + "']")
                await performAction("click", userprofilepage.user.username_expand)
                await delay(1000)
                await performAction("click", user_detail.action.edit_role)
                logger.info("Try associating new group")
                await getElementHandleByXpath("//div[text()='Role Association']")
                await delay(3000)
                await performAction("click", user_role_association.details.select_group)
                await performAction("type", user_role_association.details.select_group, "page", row.newusergroup)
                await delay(1000)
                await performAction("click", "//div[text()='" + row.newusergroup + "']")
                await delay(2000)
                await performAction("click", "//div[text()='Role Association']")
                await performAction("click", user_role_association.details.submit_button)
                let screenshot = await customScreenshot('addusergroup.png', 1920, 1200)
                reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
                let group_edit = await getElementHandleByXpath("//span[text()='Successfully updated role association for user " + user + "']")
                if (group_edit.length == 1) {
                    logger.info("User group associated successfully")
                } else {
                    logger.error("User group association failed")
                }
            } else {
                await performAction("click", user_role_association.details.cancel_button)
            }
            reporter.endStep();
        }
    }
    )
}



export const whenChangeUserGroup = when => {
    when(/^Change UserGroup$/, async (table) => {
        logger.info("Change UserGroup")
        reporter.startStep("Change UserGroup");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            if (row.oldusergroup != '') {
                await navigatePageByClick(leftpane.a.userdashboard)
                await delay(1000)
                await navigatePageByClick(userlist.filter.full_name_search)
                await performAction("type", user_search.full_name.input, "page", user)
                await performAction("click", user_search.full_name.search_button)
                await waitforotaloader()
                let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
                expect(handle.length).toBe(1)
                if (handle.length == 1) {
                    logger.info("Found user, will check details")
                    let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User not Found")
                }
                await performAction("click", "//a[text()='" + user + "']")
                await performAction("click", userprofilepage.user.username_expand)
                await delay(1000)
                await performAction("click", user_detail.action.edit_role)
                await getElementHandleByXpath("//div[text()='Role Association']")
                let user_role = await getElementHandleByXpath("//span[text()='" + row.oldusergroup + "']")
                if (user_role.length == 1) {
                    logger.info("User group is associated properly")
                    let screenshot = await customScreenshot('Userrolecheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User group not Found")
                }
                await performAction("click", "//span[text()='" + row.oldusergroup + "']//following-sibling::span[@class='ant-select-selection-item-remove']")
                let screenshot = await customScreenshot('User1.png', 1920, 1200)
                reporter.addAttachment("User1", screenshot, "image/png");
                await delay(3000)
                await performAction("click", user_role_association.details.submit_button)
                await getElementHandleByXpath(user_detail.details.email)
                logger.info("Usergroup association done")
            }
            if (row.newusergroup != '') {
                await delay(2000)
                logger.info("Start new user group association")
                await navigatePageByClick(leftpane.a.userdashboard)
                await delay(1000)
                await navigatePageByClick(userlist.filter.full_name_search)
                await performAction("type", user_search.full_name.input, "page", user)
                await performAction("click", user_search.full_name.search_button)
                await waitforotaloader()
                let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
                expect(handle.length).toBe(1)
                if (handle.length == 1) {
                    logger.info("Found user, will check details")
                    let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User not Found")
                }
                await performAction("click", "//a[text()='" + user + "']")
                await performAction("click", userprofilepage.user.username_expand)
                await delay(1000)
                await performAction("click", user_detail.action.edit_role)
                logger.info("Try associating new group")
                await getElementHandleByXpath("//div[text()='Role Association']")
                await delay(3000)
                await performAction("click", user_role_association.details.select_group)
                await performAction("type", user_role_association.details.select_group, "page", row.newusergroup)
                await performAction("click", "//div[text()='" + row.newusergroup + "']")
                await delay(2000)
                await performAction("click", "//div[text()='Role Association']")
                await performAction("click", user_role_association.details.submit_button)
                let screenshot = await customScreenshot('addusergroup.png', 1920, 1200)
                reporter.addAttachment("Add device uivalidation Errors", screenshot, "image/png");
                let group_edit = await getElementHandleByXpath("//span[text()='Successfully updated role association for user " + user + "']")
                if (group_edit.length == 1) {
                    logger.info("User group associated successfully")
                } else {
                    logger.error("User group association failed")
                }
            } else {
                await performAction("click", user_role_association.details.cancel_button)
            }
            reporter.endStep();
        }
    }
    )
}

export const thenDeleteUser = then => {
    then(/^Delete User$/, async (table) => {
        logger.info("Delete User")
        reporter.startStep("Delete User");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            //await expect(page).toMatchElement('svg[type="Users"]')
            await delay(1000)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            await delay(1000)
            await performAction("click", user_detail.action.delete)
            await delay(1000)
            await performAction("click", "//button//span[text()='Delete']")
            await delay(2000)
            let del = await getElementHandleByXpath("//span[text()='" + user + " is deleted']")
            if (del.length == 1) {
                logger.info("User Deleted successfully")
            } else {
                logger.error("User Delete Failed")
            }
            let screenshot = await customScreenshot('Use2.png', 1920, 1200)
            reporter.addAttachment("User2", screenshot, "image/png");
            reporter.endStep();
            await delay(3000)
        }
    }
    )
}

export const whenDeleteUser = when => {
    when(/^Delete User$/, async (table) => {
        logger.info("Delete User")
        reporter.startStep("Delete User");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            //await expect(page).toMatchElement('svg[type="Users"]')
            await delay(1000)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            await delay(1000)
            await performAction("click", user_detail.action.delete)
            await delay(1000)
            await performAction("click", "//button//span[text()='Delete']")
            await delay(2000)
            let del = await getElementHandleByXpath("//span[text()='" + user + " is deleted']")
            if (del.length == 1) {
                logger.info("User Deleted successfully")
            } else {
                logger.error("User Delete Failed")
            }
            let screenshot = await customScreenshot('Use2.png', 1920, 1200)
            reporter.addAttachment("User2", screenshot, "image/png");
            reporter.endStep();
            await delay(3000)
        }
    }
    )
}



export const thenDisableMfaforuser = then => {
    then(/^DisableMfaforuser$/, async (table) => {
        logger.info("DisableMfaforuser")
        reporter.startStep("DisableMfaforuser");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await delay(2000)
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", "//div[strong='MFA']//following-sibling::div//div//div//span[text()='Disabled']")
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Change user level MFA config", screenshot, "image/png");
            reporter.endStep();

        }
    }
    )
}

export const whenResetMfaforuser = when => {
    when(/^ResetMfaforuser$/, async (table) => {
        logger.info("ResetMfaforuser")
        reporter.startStep("ResetMfaforuser");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await delay(2000)
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", "//div[strong='MFA']//following-sibling::div//div//div//span[text()='Reset']")
            await delay(1000)
            await performAction("click", "//span[text()='Yes-Reset']")
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Reset user level MFA config", screenshot, "image/png");
            reporter.endStep();

        }
    }
    )
}

export const whenDisableMfaforuser = when => {
    when(/^DisableMfaforuser$/, async (table) => {
        logger.info("DisableMfaforuser")
        reporter.startStep("DisableMfaforuser");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await delay(2000)
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", "//div[strong='MFA']//following-sibling::div//div//div//span[text()='Disabled']")
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Change user level MFA config", screenshot, "image/png");
            reporter.endStep();

        }
    }
    )
}

export const whenDisableuserstatus = when => {
    when(/^Disableuserstatus$/, async (table) => {
        logger.info("Disableuserstatus")
        reporter.startStep("Disableuserstatus");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await delay(2000)
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", "//div[strong='User Status']//following-sibling::div//div//div//span[text()='Disabled']")
            await delay(1000)
            await performAction("click", "//span[text()='Yes-Proceed']")
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Disable user status", screenshot, "image/png");
            reporter.endStep();

        }
    }
    )
}

export const whenEnableuserstatus = when => {
    when(/^Enableuserstatus$/, async (table) => {
        logger.info("Enableuserstatus")
        reporter.startStep("Enableuserstatus");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await delay(2000)
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", "//div[strong='User Status']//following-sibling::div//div//div//span[text()='Enabled']")
            await delay(1000)
            await performAction("click", "//span[text()='Yes-Proceed']")
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Enable user status", screenshot, "image/png");
            reporter.endStep();

        }
    }
    )
}

export const thenLoginandsetupMFA = then => {
    then(/^Login and setup mfa$/, async (table) => {
        try {
            logger.info("setup MFA")
            reporter.startStep("setup MFA");
            let screenshot
            for (let i = 0; i < table.length; i++) {
                let row = table[i]
                let user = row.firstname + " " + row.lastname
                logger.info("User name is : " + user)
                await delay(5000)
                await navigatePageByClick(leftpane.a.userdashboard)
                await delay(1000)
                await navigatePageByClick(userlist.filter.full_name_search)
                await performAction("type", user_search.full_name.input, "page", user)
                await performAction("click", user_search.full_name.search_button)
                await waitforotaloader()
                let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
                expect(handle.length).toBe(1)
                if (handle.length == 1) {
                    logger.info("Found user, will check details")
                    let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                    reporter.addAttachment("User  check_", screenshot, "image/png");
                } else {
                    logger.error("User not Found")
                }
                await performAction("click", "//a[text()='" + user + "']")
                await performAction("click", userprofilepage.user.username_expand)
                let element123 = await page.$x("//strong[text()='Username']//parent::div//following-sibling::div")
                if (element123 != []) {
                    logger.info("match found")
                }
                let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
                reporter.addAttachment("User name check_", screenshot, "image/png");
                logger.info("Element is ----> " + element123[0])
                const text = await (await element123[0].getProperty('innerText')).jsonValue();
                logger.info("Username -----> " + text)
                await performAction("click", leftpane.svg.myprofile)
                await delay(1000)
                await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
                await delay(5000)
                var config
                config = await getEnvConfig()
                await goTo(config.otaURL)
                //await expect(page.title()).resolves.toMatch('IoTium - OTAccess');
                logger.info("matched user element 20");
                await performAction("type", otalogin.details.username, "page", text)
                await performAction("type", otalogin.details.password, "page", row.password)
                let screenshot1 = await customScreenshot('Usenamecheck1.png', 1920, 1200)
                reporter.addAttachment("Login with new user", screenshot1, "image/png");
                await performAction("click", otalogin.details.login_button)
                logger.info("Hit login :")
                await delay(2000)
                if (row.firstlogin == 'Yes') {
                    //await getElementHandleByXpath("//span[text()='You need to change your password to activate your account.']")
                    await performAction("type", "//input[@id='password-new']", "page", row.newpassword)
                    await performAction("type", "//input[@id='password-confirm']", "page", row.newpassword)
                    await performAction("click", "//input[@type='submit']")
                    await delay(10000)
                }
                await expect(page).toMatchElement('img#kc-totp-secret-qr-code')
                let screenshot111 = await customScreenshot('Userlogin1.png', 1920, 1200)
                reporter.addAttachment("Login with new user", screenshot111, "image/png");
                //var abc = document.getElementById("kc-totp-secret-qr-code").getAttribute("src")
                //var abc = await page.evaluate(document.getElementById("kc-totp-secret-qr-code").getAttribute("src"))
                let abc = await expect(page).toMatchElement('img#kc-totp-secret-qr-code')
                if (abc != false) {
                    logger.info("image found" + abc)
                } else {
                    logger.error("image not found" + abc)
                }
                const text123 = await (await abc.getProperty('src')).jsonValue();
                logger.info("image -----> " + text123)
                let screenshot2 = await customScreenshot('Usenamecheck2.png', 1920, 1200)
                reporter.addAttachment("MFA setup request", screenshot2, "image/png");
                const buffer = Buffer.from(text123.substr("data:image/png;base64,".length), "base64");
                logger.info("buffer --- >" + buffer)
                logger.info("----------->" + text123.substr("data:image/png;base64,".length))
                const image = await (Jimp).read(buffer);
                logger.info("image123 --- >" + image)
                let test123
                let decoded = await new Promise((resolve, reject) => {
                    const qr = new QrCode();
                    qr.callback = (error, value) => error ? reject(error) : resolve(value.result);
                    qr.decode(image.bitmap);
                });
                logger.info("decoded value is ---> " + decoded)
                test123 = decoded
                logger.info("value of test123", test123)
                let splitted_string = test123.split("secret=")[1];
                var secret_string = splitted_string.substring(0, splitted_string.indexOf("&digits"));

                let totp = new OTPAuth.TOTP({
                    issuer: 'ACME',
                    label: 'AzureDiamond',
                    algorithm: 'SHA1',
                    digits: 6,
                    period: 30,
                    secret: secret_string // or "OTPAuth.Secret.fromB32('NB2W45DFOIZA')"
                });

                // Generate a token.
                let token = totp.generate();
                logger.info("OTP is :" + token)
                await delay(2000)
                await expect(page).toFill('input[id="totp"]', token)
                let screenshot3 = await customScreenshot('Usenamecheck3.png', 1920, 1200)
                reporter.addAttachment("MFA setup done and token generated", screenshot3, "image/png");
                await expect(page).toClick('input[value="Submit"]')
                await delay(10000)
                //await getElementHandleByXpath("//span[text()='You need to change your password to activate your account.']")
                await performAction("type", otalogin.details.username, "page", text)
                await performAction("type", otalogin.details.password, "page", row.newpassword)
                await performAction("click", otalogin.details.login_button)
                await delay(2000)
                let token1 = totp.generate();
                logger.info("OTP is :" + token1)
                await delay(2000)
                await expect(page).toFill('input[id="totp"]', token1)
                let screenshot4 = await customScreenshot('Usenamecheck4.png', 1920, 1200)
                reporter.addAttachment("MFA setup done and token generated", screenshot4, "image/png");
                await performAction("click", otalogin.details.login_button)

                let userlog = await getElementHandleByXpath("//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']")
                if (userlog.length == 1) {
                    logger.info("User login successfully")
                } else {
                    logger.error("User login Failed")
                }
                //reporter.endStep();

            }
        } catch (e) {
            logger.error(e)
            logger.error("Exception in user login with MFA")
        }
    }
    )
}




export const thenLoginwithnewUserMFAdisabled = then => {
    then(/^Login with new user without mfa$/, async (table) => {
        logger.info("Get Username")
        reporter.startStep("Get Username");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await getElementHandleByXpath(leftpane.a.userdashboard)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            let element123 = await page.$x("//strong[text()='Username']//parent::div//following-sibling::div")
            if (element123 != []) {
                logger.info("match found")
            }
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("User name check_", screenshot, "image/png");
            logger.info("Element is ----> " + element123[0])
            const text = await (await element123[0].getProperty('innerText')).jsonValue();
            logger.info("Username -----> " + text)
            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)
            var config
            config = await getEnvConfig()
            await goTo(config.otaURL)
            //await expect(page.title()).resolves.toMatch('Login - IoTium OTAccess');
            await performAction("type", otalogin.details.username, "page", text)
            await performAction("type", otalogin.details.password, "page", row.password)
            await performAction("click", otalogin.details.login_button)
            await delay(2000)
            if (row.firstlogin == 'Yes') {
                //await getElementHandleByXpath("//span[text()='You need to change your password to activate your account.']")
                await performAction("type", "//input[@id='password-new']", "page", row.newpassword)
                await performAction("type", "//input[@id='password-confirm']", "page", row.newpassword)
                await performAction("click", "//input[@type='submit']")
                await delay(10000)
                await performAction("type", otalogin.details.username, "page", text)
                await performAction("type", otalogin.details.password, "page", row.newpassword)
                await performAction("click", otalogin.details.login_button)
                await delay(2000)
            }
            logger.info("Hit login :")
            await delay(3000)
            let userlog = await getElementHandleByXpath("//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']")
            if (userlog.length == 1) {
                logger.info("User login successfully")
            } else {
                logger.error("User login Failed")
            }

        }
    }
    )
}


export const thenILoginwithEmail = then => {
    then(/^Login with email address$/, async (table) => {
        logger.info("Get Username")
        reporter.startStep("Get Username");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await getElementHandleByXpath(leftpane.a.userdashboard)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            let element123 = await page.$x("//strong[text()='Username']//parent::div//following-sibling::div")
            if (element123 != []) {
                logger.info("match found")
            }
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("User name check_", screenshot, "image/png");
            logger.info("Element is ----> " + element123[0])
            const text = await (await element123[0].getProperty('innerText')).jsonValue();
            logger.info("Username -----> " + text)
            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)
            var config
            config = await getEnvConfig()
            await goTo(config.otaURL)
            //await expect(page.title()).resolves.toMatch('Login - IoTium OTAccess');
            await performAction("type", otalogin.details.username, "page", row.email)
            await performAction("type", otalogin.details.password, "page", row.password)
            await performAction("click", otalogin.details.login_button)
            await delay(2000)
            if (row.firstlogin == 'Yes') {
                //await getElementHandleByXpath("//span[text()='You need to change your password to activate your account.']")
                await performAction("type", "//input[@id='password-new']", "page", row.newpassword)
                await performAction("type", "//input[@id='password-confirm']", "page", row.newpassword)
                await performAction("click", "//input[@type='submit']")
                let screenshot1 = await customScreenshot('Usenamecheck1.png', 1920, 1200)
                reporter.addAttachment("Login with new user", screenshot1, "image/png");
                await delay(10000)
                await performAction("type", otalogin.details.username, "page", row.email)
                await performAction("type", otalogin.details.password, "page", row.newpassword)
                await performAction("click", otalogin.details.login_button)
                await delay(2000)
            }
            logger.info("Hit login :")
            await delay(2000)
            let userlog = await getElementHandleByXpath("//*[name()='svg'][@type='UserCircle']//ancestor::a[@class='ant-dropdown-trigger']")
            if (userlog.length == 1) {
                logger.info("User login successfully")
            } else {
                logger.error("User login Failed")
            }

        }
    }
    )
}


export const thenEnableMfaforuser = then => {
    then(/^EnableMfaforuser$/, async (table) => {
        logger.info("EnableMfaforuser")
        reporter.startStep("EnableMfaforuser");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", "//div[strong='MFA']//following-sibling::div//div//div//span[text()='Enabled']")
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Change user level MFA config", screenshot, "image/png");
            await delay(5000)
            reporter.endStep();

        }
    }
    )
}

export const whenEnableMfaforuser = when => {
    when(/^EnableMfaforuser$/, async (table) => {
        logger.info("EnableMfaforuser")
        reporter.startStep("EnableMfaforuser");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", "//div[strong='MFA']//following-sibling::div//div//div//span[text()='Enabled']")
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Change user level MFA config", screenshot, "image/png");
            await delay(5000)
            reporter.endStep();

        }
    }
    )
}



export const thenDisableorgMfa = then => {
    then(/^Disable org Mfa$/, async () => {
        logger.info("Disable org Mfa")
        reporter.startStep("Disable org Mfa");
        await performAction("click", leftpane.a.orginfo)
        await delay(2000)
        await performAction("click", orgpage.title.policy_expand)
        await delay(1000)
        await performAction("click", "//input[@value='DISABLED']")
        await performAction("click", "//span[text()='Update']")
        await getElementHandleByXpath("//div[text()='Change Org OTP Authentication']")
        await delay(2000)
        await performAction("click", "//span[text()='Yes-Proceed']")
        let orgpolicy = await getElementHandleByXpath("//span[text()='Updated Successfully']")
        expect(orgpolicy.length).toBe(1)
        if (orgpolicy.length == 1) {
            logger.info("MFA config update is sucessful")
            let screenshot = await customScreenshot('mfa.png', 1920, 1200)
            reporter.addAttachment("MFA update_", screenshot, "image/png");
        } else {
            logger.error("MFA config update failed")
        }
        reporter.endStep();
    }
    )
}

export const thenEnableorgMfa = then => {
    then(/^Enable org Mfa$/, async () => {
        logger.info("Enable org Mfa")
        reporter.startStep("Enable org Mfa");
        await performAction("click", leftpane.a.orginfo)
        await delay(2000)
        await performAction("click", orgpage.title.policy_expand)
        await delay(1000)
        await performAction("click", "//input[@value='REQUIRED']")
        await performAction("click", "//span[text()='Update']")
        await getElementHandleByXpath("//div[text()='Change Org OTP Authentication']")
        await delay(2000)
        await performAction("click", "//span[text()='Yes-Proceed']")
        let orgpolicy = await getElementHandleByXpath("//span[text()='Updated Successfully']")
        expect(orgpolicy.length).toBe(1)
        if (orgpolicy.length == 1) {
            logger.info("MFA config update is sucessful")
            let screenshot = await customScreenshot('mfa.png', 1920, 1200)
            reporter.addAttachment("MFA update_", screenshot, "image/png");
        } else {
            logger.error("MFA config update failed")
        }
        reporter.endStep();
    }
    )
}
export const whenEnablelevelorgMfa = when => {
    when(/^Enable org level Mfa$/, async () => {
        logger.info("Enable org Mfa")
        reporter.startStep("Enable org Mfa");
        await performAction("click", leftpane.a.orginfo)
        await delay(2000)
        await performAction("click", orgpage.title.policy_expand)
        await delay(1000)
        await performAction("click", "//input[@value='REQUIRED']")
        await performAction("click", "//span[text()='Update']")
        await getElementHandleByXpath("//div[text()='Change Org OTP Authentication']")
        await delay(2000)
        await performAction("click", "//span[text()='Yes-Proceed']")
        let orgpolicy = await getElementHandleByXpath("//span[text()='Updated Successfully']")
        expect(orgpolicy.length).toBe(1)
        if (orgpolicy.length == 1) {
            logger.info("MFA config update is sucessful")
            let screenshot = await customScreenshot('mfa.png', 1920, 1200)
            reporter.addAttachment("MFA update_", screenshot, "image/png");
        } else {
            logger.error("MFA config update failed")
        }
        reporter.endStep();
    }
    )
}

export const whenOptionallevelorgMfa = when => {
    when(/^Optional org level Mfa$/, async () => {
        logger.info("Optional org Mfa")
        reporter.startStep("Optional org Mfa");
        await performAction("click", leftpane.a.orginfo)
        await delay(2000)
        await performAction("click", orgpage.title.policy_expand)
        await delay(1000)
        await performAction("click", "//input[@value='OPTIONAL']")
        await performAction("click", "//span[text()='Update']")
        await getElementHandleByXpath("//div[text()='Change Org OTP Authentication']")
        await delay(2000)
        await performAction("click", "//span[text()='Yes-Proceed']")
        let orgpolicy = await getElementHandleByXpath("//span[text()='Updated Successfully']")
        expect(orgpolicy.length).toBe(1)
        if (orgpolicy.length == 1) {
            logger.info("MFA config update is sucessful")
            let screenshot = await customScreenshot('mfa.png', 1920, 1200)
            reporter.addAttachment("MFA update_", screenshot, "image/png");
        } else {
            logger.error("MFA config update failed")
        }
        reporter.endStep();
    }
    )
}
export const thenOptionalorgMfa = then => {
    then(/^Optional org Mfa$/, async () => {
        logger.info("Optional org Mfa")
        reporter.startStep("Optional org Mfa");
        await performAction("click", leftpane.a.orginfo)
        await delay(2000)
        await performAction("click", orgpage.title.policy_expand)
        await delay(1000)
        await performAction("click", "//input[@value='OPTIONAL']")
        await performAction("click", "//span[text()='Update']")
        await getElementHandleByXpath("//div[text()='Change Org OTP Authentication']")
        await delay(2000)
        await performAction("click", "//span[text()='Yes-Proceed']")
        let orgpolicy = await getElementHandleByXpath("//span[text()='Updated Successfully']")
        expect(orgpolicy.length).toBe(1)
        if (orgpolicy.length == 1) {
            logger.info("MFA config update is sucessful")
            let screenshot = await customScreenshot('mfa.png', 1920, 1200)
            reporter.addAttachment("MFA update_", screenshot, "image/png");
        } else {
            logger.error("MFA config update failed")
        }
        reporter.endStep();
    }
    )
}
export const thenResetUserPassword = then => {
    then(/^Reset password for user$/, async (table) => {
        logger.info("Reset password for user")
        reporter.startStep("Reset password for user");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", user_detail.action.password_reset)
            await delay(2000)
            await getElementHandleByXpath(password_reset.input.new_password)
            await performAction("type", password_reset.input.new_password, "page", row.newpassword)
            await performAction("type", password_reset.input.confirm_password, "page", row.newpassword)
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Reset password", screenshot, "image/png");
            await performAction("click", password_reset.input.submit_button)
            await delay(2000)
            let del = await getElementHandleByXpath("//span[contains(text(),'Password has been reset successfully. Recent password update takes couple of minutes to reflect.')]")
            if (del.length == 1) {
                let screenshot1 = await customScreenshot('Usenamecheck1.png', 1920, 1200)
                reporter.addAttachment("Password reset result", screenshot1, "image/png")
                logger.info("User passwors reset is successful")
            } else {
                logger.error("User password reset failed")
            }
        }
        reporter.endStep();
    }
    )
}

export const whenResetUserPassword = when => {
    when(/^Reset password for user$/, async (table) => {
        logger.info("Reset password for user")
        reporter.startStep("Reset password for user");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", user_detail.action.password_reset)
            await delay(2000)
            await getElementHandleByXpath(password_reset.input.new_password)
            await performAction("type", password_reset.input.new_password, "page", row.newpassword)
            await performAction("type", password_reset.input.confirm_password, "page", row.newpassword)
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Reset password", screenshot, "image/png");
            await performAction("click", password_reset.input.submit_button)
            await delay(2000)
            let del = await getElementHandleByXpath("//span[text()='Password has been resetd successfully. Recent password update takes couple of minutes to reflect.']")
            if (del.length == 1) {
                let screenshot1 = await customScreenshot('Usenamecheck1.png', 1920, 1200)
                reporter.addAttachment("Password reset result", screenshot1, "image/png")
                logger.info("User passwors reset is successful")
            } else {
                logger.error("User password reset failed")
            }
        }
        reporter.endStep();
    }
    )
}

export const thenLoginwithwrongpassword = then => {
    then(/^Login with wrong password$/, async (table) => {
        logger.info("Get Username")
        reporter.startStep("Get Username");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await getElementHandleByXpath(leftpane.a.userdashboard)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            let element123 = await page.$x("//strong[text()='Username']//parent::div//following-sibling::div")
            if (element123 != []) {
                logger.info("match found")
            }
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("User name check_", screenshot, "image/png");
            logger.info("Element is ----> " + element123[0])
            const text = await (await element123[0].getProperty('innerText')).jsonValue();
            logger.info("Username -----> " + text)
            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)
            var config
            config = await getEnvConfig()
            await goTo(config.otaURL)
            //await expect(page.title()).resolves.toMatch('Login - IoTium OTAccess');
            await performAction("type", otalogin.details.username, "page", text)
            await performAction("type", otalogin.details.password, "page", row.password)
            let screenshot1 = await customScreenshot('Usenamecheck1.png', 1920, 1200)
            reporter.addAttachment("Login with new user", screenshot1, "image/png");
            await performAction("click", otalogin.details.login_button)
            logger.info("Hit login :")
            await delay(5000)
            let del = await getElementHandleByXpath("//span[text()='Invalid username or password.']")
            if (del.length == 1) {
                let screenshot1 = await customScreenshot('Usenamecheck1.png', 1920, 1200)
                reporter.addAttachment("Password reset result", screenshot1, "image/png")
                logger.info("User login fails with wrong password ")
            } else {
                logger.error("User login with wrong password test failed")
            }
        }
    }
    )
}

export const thenResetUserPasswordwithwrongcnfpwd = then => {
    then(/^Reset password for user with wrong confirm password$/, async (table) => {
        logger.info("Reset password for user")
        reporter.startStep("Reset password for user");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
            await performAction("click", userprofilepage.user.username_expand)
            await delay(2000)
            await performAction("click", user_detail.action.password_reset)
            await delay(2000)
            await getElementHandleByXpath(password_reset.input.new_password)
            await performAction("type", password_reset.input._current_password, "page", row.password)
            await performAction("type", password_reset.input.new_password, "page", row.newpassword)
            await performAction("type", password_reset.input.confirm_password, "page", "TestIoT@1234567")
            let screenshot = await customScreenshot('Usenamecheck.png', 1920, 1200)
            reporter.addAttachment("Reset password", screenshot, "image/png");
            await performAction("click", password_reset.input.submit_button)
            await delay(2000)
            let del = await getElementHandleByXpath("//div[text()='Confirm Password does not match the password']")
            if (del.length == 1) {
                let screenshot1 = await customScreenshot('Usenamecheck1.png', 1920, 1200)
                reporter.addAttachment("Password reset result", screenshot1, "image/png")
                logger.info("User password reset failed")
            } else {
                logger.error("User password reset success with wrong password")
            }
            await performAction("click", password_reset.input.cancel_button)
        }
        reporter.endStep();
    }
    )
}

import { api_v1_users_post, api_v1_users_get, getUserId, api_v1_users_user_id_delete } from './otauserapi'
import { api_v1_myauthgrouproles_get, getMyAuthGroupRolesId } from "./otagroupprofileapi";
import { group } from 'openstack-client/lib/keystone';
import { del } from 'openstack-client/lib/util';
const axios = require('axios');
var querystring = require('querystring');
var faker = require('faker');
const timer = ms => new Promise(res => setTimeout(res, ms))
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function api_AddUser(no) {
    logger.info("Entering: helper/otauser.js/api_AddUser");
    for (let i = 0; i < no; i++) {
        var data = {
            "firstName": "Api ",
            "lastName": faker.name.lastName(),
            "mail": faker.internet.email(),
            "telephoneNumber": faker.phone.phoneNumber('98400#####'),
            "orgId": "f5925050070b11ebadc10242ac120002",
            "authenticationDomains": ["ce571df32d7c11ebab7b0242ac110004"],
            "password": "Welcome@12345",
            "scope": "LOCAL"
        };
        await api_v1_users_post(data)
    }
}

export async function api_DeleteUser() {
    logger.info("Entering: helper/otauser.js/api_DeleteUser");
    var idList = await getUserId()
    if (idList.length > 0) {
        idList.forEach(id => {
            logger.info('Deleting User ID: ' + id)
            api_v1_users_user_id_delete(id).then(resp => {
                logger.info(resp)
            }).catch(error => {
                logger.error(error)
            })
        });
    }
}

async function updatePendingUsers() {
    logger.info("Entering: helper/otauser.js/updatePendingUsers");
    var id = []

    await api_v1_users_get().then(resp => {
        let obj = resp.data.data
        let aaa = obj.filter(element => {
            if (element.firstName === "Api" && element.fState === "updatePending") {
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
    return id
}
export async function WaitUntilAllUsersAreOnboarded() {
    logger.info("Entering: helper/otauser.js/WaitUntilAllUsersAreOnboarded");
    do {
        var aaa = await updatePendingUsers()
        logger.info('Inside while loop, updatePending: ' + aaa.length)
    } while (aaa.length > 0)
}

import { _post, _get, _delete } from "../api/api"

export const thenemailverify = then => {
    then(/^emailverify$/, async (table) => {
        logger.info("emailverify")
        reporter.startStep("emailverify");
        let screenshot
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            let user = row.firstname + " " + row.lastname
            logger.info("User name is : " + user)
            await navigatePageByClick(leftpane.a.userdashboard)
            await delay(1000)
            await navigatePageByClick(userlist.filter.full_name_search)
            await performAction("type", user_search.full_name.input, "page", user)
            await performAction("click", user_search.full_name.search_button)
            await waitforotaloader()
            let handle = await getElementHandleByXpath("//td//a[text()='" + user + "']")
            expect(handle.length).toBe(1)
            if (handle.length == 1) {
                logger.info("Found user, will check details")
                let screenshot = await customScreenshot('Usercheck.png', 1920, 1200)
                reporter.addAttachment("User  check_", screenshot, "image/png");
            } else {
                logger.error("User not Found")
            }
            await performAction("click", "//a[text()='" + user + "']")
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
            const text = await (await element123[0].getProperty('innerText')).jsonValue();
            logger.info("Username -----> " + text)
            var config = await getEnvConfig()
            logger.info(config.otakeyclockIP)
            logger.info(config.keycloak_user)
            logger.info(config.keycloak_password)
            //axios.defaults.baseURL = "http://3.81.200.13:8081/";
            axios.defaults.headers.common['Content-Type'] = "application/json";
            let output = await axios.post('http://' + config.otakeyclockIP + ':8081/auth/realms/master/protocol/openid-connect/token', querystring.stringify({
                username: config.keycloak_user,
                password: config.keycloak_password,
                grant_type: 'password',
                client_id: 'admin-cli'
            }))
                //.then(function (response) {
                //axios.defaults.headers.common['Authorization'] = "bearer " + response.data.data.access_token;
                //    logger.info(response.data.access_token)
                //})
                .catch(function (error) {
                    logger.error(error);
                })

            logger.info("response_token === ", output)
            logger.info("access_token", output.data.access_token)

            axios.defaults.headers.common['Content-Type'] = "application/json";
            axios.defaults.headers.common['Authorization'] = "bearer " + output.data.access_token + ""
            let uri = 'http://' + config.otakeyclockIP + ':8081/auth/admin/realms/OTAccess/users?username=' + text + ''
            let options = {}
            let res = await axios.get(uri, options).catch(error => {
                console.log(error);
                return error.response
            })
            logger.info("user ID ", res.data[0].id)

            //axios.defaults.headers.common['Content-Type'] = "application/json";
            //axios.defaults.headers.common['Authorization'] = "bearer "+output.data.access_token+""
            let output1 = await axios.put('http://' + config.otakeyclockIP + ':8081/auth/admin/realms/OTAccess/users/' + res.data[0].id + '', {
                emailVerified: true
                //requiredActions: []
            })
                //.then(function (response) {
                //axios.defaults.headers.common['Authorization'] = "bearer " + response.data.data.access_token;
                //    logger.info(response.data.access_token)
                //})
                .catch(function (error) {
                    logger.error(error);
                })
            logger.info("output1 === ", output1)

        }
    }
    )
}

export const givenAdminLoggedIn = given => {
    given('Admin logged in', async () => {
        try {
            logger.info("In givenAdminLoggedIn")
            reporter.startStep('Admin user logged in');
            const UsersElemExists = await page.$x(userlist.svg.loginuser_icon)
            if (UsersElemExists.length == 0) {
                let login
                login = new Login();
                logger.info("global.env = " + global.env)
                await login.launch(global.env, "orgAdmin")
            }
            let screenshot = await customScreenshot('givenAdminLoggedIn.png')
            reporter.addAttachment("Admin user logged in.", screenshot, "image/png");
            reporter.endStep();
        } catch (e) {
            let screenshot = await customScreenshot('givenAdminLoggedIn.png')
            reporter.addAttachment("Admin user logged in error.", screenshot, "image/png")
            expect(e).toMatch('error');
        }

    });

};

export const whenIEnableScheduleAccessUser = when => {
    when(/^I Enable schedule access$/, async (table) => {
        reporter.startStep("When I Enable schedule accees")
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])

            if (row.Repeat === "Daily") {
                //Navigate to user page
                reporter.startStep('I navigate to the user page');
                await performAction("click", leftpane.a.userdashboard)
                await delay(2000)
                reporter.endStep();

                // if (row.userid === "saccesstesting") {
                if (row.userid !== null) {
                    reporter.startStep('And I select user');
                    await delay(2000)
                    await performAction("click", schedule_access.button.search_button),
                        await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        await delay(2000)
                    await performAction("click", schedule_access.span.userid_search),
                        await delay(2000)
                }
                else {
                    logger.error("userid not found")
                }
                reporter.endStep();

                await delay(5000),
                    await performAction("click", schedule_access.div.user_account),
                    await delay(2000)
                let elemXPath1 = schedule_access.span.arrow_mark;
                await page.waitForXPath(elemXPath1, { timeout: 10000 })

                performAction("click", schedule_access.span.arrow_mark),
                    await delay(2000)
                performAction("click", schedule_access.div.configuration_edit),
                    await delay(20000)

                // schedule_access.label.schedule_access_view
                let elemXPath2 = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath2, { timeout: 10000 })

                reporter.startStep("And I enable the schedule access and submit the schedule access");
                if (row.scheduleaccess === "enable") {
                    delay(2000),
                        performAction("click", schedule_access.button.enable_sa),
                        delay(2000)
                } else {
                    logger.error("Schedule access not found");
                }

                let elemXPath = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath, { timeout: 10000 })

                // if (row.Repeat === "Daily") {
                //Here I select the Daily schedule access
                await delay(2000)
                performAction("click", schedule_access.span.Repeat_down),
                    await delay(5000)
                performAction("click", schedule_access.div.daily_access),
                    await delay(5000)
                // }
                // else {
                //     logger.error("Daily not found")
                // }
                reporter.endStep();
                // let formattedTimeOneMinuteLater;
                // let formattedTimeFifteenMinutesLater;
                //startday and endday           
                if (row.startday && row.endday === "Today") {
                    // Function to format time to include leading zeros and uppercase AM/PM
                    function formatTime(date) {
                        let hours = date.getHours();
                        const minutes = date.getMinutes().toString().padStart(2, '0');
                        const meridiem = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
                        return `${hours.toString().padStart(2, '0')}:${minutes} ${meridiem}`;
                    }

                    // Get the current time in the Indian time zone
                    currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                    // Extract the time part from the string and convert it to a Date object
                    timePart = currentTime.split(',')[1].trim();
                    time = new Date(`2000-01-01 ${timePart}`);

                    // Format the current time
                    formattedCurrentTime = formatTime(time);
                    logger.info("Current Time:", formattedCurrentTime);

                    // Add one minute to the current time
                    oneMinuteLater = new Date(time.getTime() + 1 * 60000); // 1 minute in milliseconds

                    // Add 15 minutes to the current time
                    fifteenMinutesLater = new Date(time.getTime() + 16 * 60000); // 15 minutes in milliseconds

                    // Format the times
                    formattedTimeOneMinuteLater = (formatTime(oneMinuteLater)).trim();
                    logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                    formattedTimeFifteenMinutesLater = (formatTime(fifteenMinutesLater)).trim();
                    logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                    logger.info("Current Time:", formattedCurrentTime);
                    logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                    logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);
                } else {
                    logger.error("startdate and enddate not found")
                }

                if (row.Time === "Custom" && row.timezone !== null) {
                    await delay(2000)
                    performAction("click", schedule_access.span.timezone_arrow)
                    await delay(2000)
                    if (row.timezone === "Asia/Kolkata") {
                        // Type the text into the input field
                        let partialText = row.timezone.slice(0, 6);
                        await performAction("type", schedule_access.span.search_zone, "page", partialText);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time),
                            await delay(2000)

                        let current_time = await getElementHandleByXpath(schedule_access.input.start_time, "page", { timeout: 10000 });
                        await Promise.all([
                            await delay(2000), // Wait for 2 seconds before clicking
                            current_time[0].click({ clickCount: 3 }), // Click on the element
                            await delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            await delay(2000), // Wait for 2 seconds before continuing
                            // await current_time[0].type(formattedTimeOneMinuteLater)
                        ]);
                        await performAction("type", schedule_access.input.start_time, "page", formattedTimeOneMinuteLater),
                            await delay(2000),
                            await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)

                        let after_fifteen_time = await getElementHandleByXpath(schedule_access.input.end_time, "page", { timeout: 1000 });
                        await Promise.all([
                            delay(2000), // Wait for 2 seconds before clicking
                            after_fifteen_time[0].click({ clickCount: 3 }), // Click on the element
                            delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            delay(2000), // Wait for 2 seconds before continuing
                            // await after_fifteen_time[0].type(formattedTimeFifteenMinutesLater)
                        ]);
                        await performAction("type", schedule_access.input.end_time, "page", formattedTimeFifteenMinutesLater),
                            await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)
                    }
                    else if (row.timezone === "America/Chicago") {
                        // Type the text into the input field
                        let partialTextzone = row.timezone.slice(0, 10);
                        await performAction("type", schedule_access.span.search_zone, "page", partialTextzone);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone_us)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time_hours),
                            await delay(2000)
                    }
                    else {
                        logger.error("Timezone NoT Found")
                    }
                }
                else {
                    logger.error("custom and time not found")
                }
                // Navigate to Notify now
                if (row.usernotification === "notify now") {
                    performAction("click", schedule_access.span.notify_me),
                        await delay(5000)
                }
                else {
                    logger.error("UserNotification Not found")
                }
                //Here i want to delete after expirt then select delete after expirt check box
                if (row.deleteuserafterexpiry === "No") {

                    performAction("click", schedule_access.button.sa_submit),
                        await delay(2000)
                }
                else {
                    logger.error("deleteuserafterexpiry not found")
                }


                let elemXPath3 = schedule_access.button.user_profile_sa_check;
                await page.waitForXPath(elemXPath3, { timeout: 20000 })
                let schedule_access_xpath = await getPropertyValueByXpath(schedule_access.button.user_profile_sa_check, "textContent");
                // Define the expected user schedule access text
                let actual_schedule_access = "Remove schedule access to change User Status";
                // reporter.startStep('Then Validate the user schedule access in user profile page');
                //Validate the expected result and actual result
                let schedule_access_xpath_sa = schedule_access_xpath.trim();
                reporter.startStep(`expected user schedule access is : ${schedule_access_xpath_sa} and actual user schedule access is : ${actual_schedule_access}`);
                expect(actual_schedule_access).toBe(schedule_access_xpath_sa);
                // Check if the comparison is successful
                if (schedule_access_xpath_sa === actual_schedule_access) {
                    logger.info("Validation successful: Values match");
                    // Additional validation steps, if needed
                } else {
                    logger.error(`Validation failed: Expected`);
                }
                reporter.endStep();
                reporter.endStep();
            }
            else if (row.Repeat === "Weeklyonce") {
                //Navigate to user page
                reporter.startStep('I navigate to the user page');
                await performAction("click", leftpane.a.userdashboard)
                await delay(2000)
                reporter.endStep();
                if (row.userid !== null) {
                    reporter.startStep('And I select user');
                    await delay(2000)
                    await performAction("click", schedule_access.button.search_button),
                        await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        await delay(2000)
                    await performAction("click", schedule_access.span.userid_search),
                        await delay(2000)
                }
                else {
                    logger.error("userid not found")
                }
                reporter.endStep();

                await delay(5000),
                    await performAction("click", schedule_access.div.weekly_user_account),
                    await delay(2000)

                let elemXPath1 = schedule_access.span.arrow_mark;
                await page.waitForXPath(elemXPath1, { timeout: 10000 })

                performAction("click", schedule_access.span.arrow_mark),
                    await delay(2000)
                performAction("click", schedule_access.div.configuration_edit),
                    await delay(20000)

                let elemXPath2 = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath2, { timeout: 10000 })

                reporter.startStep("And I enable the schedule access and submit the schedule access");

                if (row.scheduleaccess === "enable") {
                    delay(2000),
                        performAction("click", schedule_access.button.enable_sa),
                        delay(2000)
                } else {
                    logger.error("Schedule access not found");
                }
                reporter.endStep();
                let elemXPath = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath, { timeout: 10000 })

                //Here I select the Weekly schedule access
                await delay(2000)
                performAction("click", schedule_access.span.Repeat_down),
                    await delay(5000)
                performAction("click", schedule_access.div.weekly_schedule_access),
                    await delay(5000)


                let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let currentDate = new Date();
                logger.info("Current Date : ", currentDate)
                let todayDay = days[new Date().getDay()].slice(0, 3);
                logger.info(days[new Date().getDay()])
                logger.info("Today Day : ", todayDay)

                reporter.startStep(`when i select this day ${todayDay}`);
                logger.info(`when i select this day ${todayDay}`)
                await delay(2000)

                if (todayDay !== 'Mon') {
                    await page.waitForXPath(`//span[normalize-space()='${todayDay}']`)
                    await performAction('click', `//span[normalize-space()='${todayDay}']`);
                    await delay(2000);
                }
                await page.waitForXPath(`//span[normalize-space()='Mon']`);
                await performAction('click', `//span[normalize-space()='Mon']`);
                await delay(2000);

                reporter.endStep();


                function calculateFutureDate(startDate, durationInWeeks) {
                    const futureDate = new Date(startDate);
                    futureDate.setDate(futureDate.getDate() + durationInWeeks * 7); // Add weeks * 7 days
                    return futureDate.toISOString().split('T')[0]; // Return only the date part
                }

                // // Check if startday is "currentadate" and endday includes "weeks"
                if (row.startday === "currentadate" && row.endday.includes("weeks")) {
                    // Extract the number of weeks from row.endday
                    const durationInWeeks = parseInt(row.endday); // Assuming row.endday is something like "2 weeks" or "4 weeks"

                    // Get current date and calculate future date
                    let currentDate = new Date();
                    splitCurrentDate = currentDate.toISOString().split('T')[0];
                    spliTFutureDate = calculateFutureDate(currentDate, durationInWeeks);

                    // Log current date, future date, and duration
                    logger.info(splitCurrentDate);
                    logger.info("Date after adding " + durationInWeeks * 7 + " days:", spliTFutureDate);

                    await delay(2000)
                    performAction("click", schedule_access.input.start_date),
                        await delay(2000)
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${splitCurrentDate}']`)
                    await delay(2000)
                    await performAction("click", schedule_access.label.schedule_access_view),
                        await delay(2000)

                    performAction("click", schedule_access.input.end_date),
                        await delay(2000)
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${spliTFutureDate}']`)
                    await delay(2000)
                    await performAction("click", schedule_access.label.schedule_access_view),
                        await delay(2000)
                }

                else {
                    logger.info("startday and endday not found")
                }
                if (row.Time === "Custom" && row.timezone !== null) {
                    // if (row.Time === "Custom" && row.timezone === "Asia/Kolkata") {
                    await delay(2000)
                    performAction("click", schedule_access.span.timezone_arrow)
                    await delay(2000)
                    if (row.timezone === "Asia/Kolkata") {
                        // Type the text into the input field
                        let partialText = row.timezone.slice(0, 6);
                        await performAction("type", schedule_access.span.search_zone, "page", partialText);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time),
                            await delay(2000)

                        function formatTime(date) {
                            let hours = date.getHours();
                            const minutes = date.getMinutes().toString().padStart(2, '0');
                            const meridiem = hours >= 12 ? 'PM' : 'AM';
                            hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
                            return `${hours.toString().padStart(2, '0')}:${minutes} ${meridiem}`;
                        }

                        // Get the current time in the Indian time zone
                        currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                        // Extract the time part from the string and convert it to a Date object
                        timePart = currentTime.split(',')[1].trim();
                        time = new Date(`2000-01-01 ${timePart}`);

                        // Format the current time
                        formattedCurrentTime = formatTime(time);
                        logger.info("Current Time:", formattedCurrentTime);

                        // Add one minute to the current time
                        oneMinuteLater = new Date(time.getTime() + 1 * 60000); // 1 minute in milliseconds

                        // Add 15 minutes to the current time
                        fifteenMinutesLater = new Date(time.getTime() + 16 * 60000); // 15 minutes in milliseconds

                        // Format the times
                        formattedTimeOneMinuteLater = (formatTime(oneMinuteLater)).trim();
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        formattedTimeFifteenMinutesLater = (formatTime(fifteenMinutesLater)).trim();
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        logger.info("Current Time:", formattedCurrentTime);
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        let current_time = await getElementHandleByXpath(schedule_access.input.start_time, "page", { timeout: 10000 });
                        await Promise.all([
                            await delay(2000), // Wait for 2 seconds before clicking
                            current_time[0].click({ clickCount: 3 }), // Click on the element
                            await delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            await delay(2000), // Wait for 2 seconds before continuing
                            // await current_time[0].type(formattedTimeOneMinuteLater)
                        ]);
                        await performAction("type", schedule_access.input.start_time, "page", formattedTimeOneMinuteLater),
                            await delay(2000),
                            await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)

                        let after_fifteen_time = await getElementHandleByXpath(schedule_access.input.end_time, "page", { timeout: 1000 });
                        await Promise.all([
                            delay(2000), // Wait for 2 seconds before clicking
                            after_fifteen_time[0].click({ clickCount: 3 }), // Click on the element
                            delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            delay(2000), // Wait for 2 seconds before continuing
                            // await after_fifteen_time[0].type(formattedTimeFifteenMinutesLater)
                        ]);
                        await performAction("type", schedule_access.input.end_time, "page", formattedTimeFifteenMinutesLater),
                            await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)

                    }
                    else if (row.timezone === "America/Chicago") {
                        // Type the text into the input field
                        let partialTextzone = row.timezone.slice(0, 10);
                        await performAction("type", schedule_access.span.search_zone, "page", partialTextzone);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone_us)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time_hours),
                            await delay(2000)
                    }
                    else {
                        logger.error("Timezone Not Found")
                    }
                }
                else {
                    logger.error("custom and time not found")
                }

                // Navigate to Notify now
                if (row.usernotification === "notify now") {
                    performAction("click", schedule_access.span.notify_me),
                        await delay(5000)
                }
                else {
                    logger.error("UserNotification Not found")
                }
                //Here i want to delete after expirt then select delete after expirt check box
                if (row.deleteuserafterexpiry === "No") {

                    performAction("click", schedule_access.button.sa_submit),
                        await delay(2000)
                }
                else {
                    logger.error("deleteuserafterexpiry not found")
                }
                let elemXPath3 = schedule_access.button.user_profile_sa_check;
                await page.waitForXPath(elemXPath3, { timeout: 20000 })
                let schedule_access_xpath = await getPropertyValueByXpath(schedule_access.button.user_profile_sa_check, "textContent");
                // Define the expected user schedule access text
                let actual_schedule_access = "Remove schedule access to change User Status";
                // reporter.startStep('Then Validate the user schedule access in user profile page');
                //Validate the expected result and actual result
                let schedule_access_xpath_sa = schedule_access_xpath.trim();
                reporter.startStep(`expected user schedule access is : ${schedule_access_xpath_sa} and actual user schedule access is : ${actual_schedule_access}`);
                expect(actual_schedule_access).toBe(schedule_access_xpath_sa);
                // Check if the comparison is successful
                if (schedule_access_xpath_sa === actual_schedule_access) {
                    logger.info("Validation successful: Values match");
                    // Additional validation steps, if needed
                } else {
                    logger.error(`Validation failed: Expected`);
                }
                reporter.endStep();
                reporter.endStep();
            }
            else if (row.Repeat === "Weeklytwice") {
                //Navigate to user page
                reporter.startStep('I navigate to the user page');
                await performAction("click", leftpane.a.userdashboard)
                await delay(2000)
                reporter.endStep();
                if (row.userid !== null) {
                    reporter.startStep('And I select user');
                    await delay(2000)
                    await performAction("click", schedule_access.button.search_button),
                        await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        await delay(2000)
                    await performAction("click", schedule_access.span.userid_search),
                        await delay(2000)
                }
                else {
                    logger.error("userid not found")
                }
                reporter.endStep();

                await delay(5000),
                    await performAction("click", schedule_access.div.weekly_twice_user_account),
                    await delay(2000)

                let elemXPath1 = schedule_access.span.arrow_mark;
                await page.waitForXPath(elemXPath1, { timeout: 10000 })

                performAction("click", schedule_access.span.arrow_mark),
                    await delay(2000)
                performAction("click", schedule_access.div.configuration_edit),
                    await delay(20000)
                let elemXPath2 = '//label[@title="Scheduled Access"]'
                await page.waitForXPath(elemXPath2, { timeout: 10000 })

                reporter.startStep("And I enable the schedule access and submit the schedule access");

                if (row.scheduleaccess === "enable") {
                    delay(2000),
                        performAction("click", schedule_access.button.enable_sa),
                        delay(2000)
                } else {
                    logger.error("Schedule access not found");
                }
                reporter.endStep();
                let elemXPath = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath, { timeout: 10000 })

                // if (row.Repeat === "Weeklytwice") {
                //Here I select the Weekly schedule access
                await delay(2000)
                performAction("click", schedule_access.span.Repeat_down),
                    await delay(5000)
                performAction("click", schedule_access.div.weekly_schedule_access),
                    await delay(5000)

                let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let currentDate = new Date();
                logger.info("Current Date : ", currentDate)
                let todayDay = days[new Date().getDay()].slice(0, 3);
                let tomorrowDay = days[new Date().getDay() + 1].slice(0, 3);
                logger.info(days[new Date().getDay()])
                logger.info("Today Day : ", todayDay)
                logger.info("Tomorrow Day : ", tomorrowDay)

                reporter.startStep(`when i select this day ${todayDay}`);
                logger.info(`when i select this day ${todayDay}`)
                await delay(2000)

                // Check if today or tomorrow is Monday
                const isTodayMonday = todayDay === 'Mon';
                const isTomorrowMonday = tomorrowDay === 'Mon';

                // Click Monday first if either today or tomorrow is Monday
                if (isTodayMonday || isTomorrowMonday) {
                    await page.waitForXPath(`//span[normalize-space()='Mon']`);
                    await performAction('click', `//span[normalize-space()='Mon']`);
                    await delay(2000);
                    await page.waitForXPath(`//span[normalize-space()='${tomorrowDay}']`);
                    await performAction('click', `//span[normalize-space()='${tomorrowDay}']`);
                    await delay(2000);
                }

                // Click today if it's not Monday
                if (!isTodayMonday && !isTomorrowMonday) {
                    await page.waitForXPath(`//span[normalize-space()='${todayDay}']`);
                    await performAction('click', `//span[normalize-space()='${todayDay}']`);
                    await delay(2000);
                    await page.waitForXPath(`//span[normalize-space()='${tomorrowDay}']`);
                    await performAction('click', `//span[normalize-space()='${tomorrowDay}']`);
                    await delay(2000);
                    await page.waitForXPath(`//span[normalize-space()='Mon']`);
                    await performAction('click', `//span[normalize-space()='Mon']`);
                    await delay(2000);
                }
                reporter.endStep();

                function calculateFutureDate(startDate, durationInWeeks) {
                    const futureDate = new Date(startDate);
                    futureDate.setDate(futureDate.getDate() + durationInWeeks * 7); // Add weeks * 7 days
                    return futureDate.toISOString().split('T')[0]; // Return only the date part
                }

                // // Check if startday is "currentadate" and endday includes "weeks"
                if (row.startday === "currentadate" && row.endday.includes("weeks")) {
                    // Extract the number of weeks from row.endday
                    const durationInWeeks = parseInt(row.endday); // Assuming row.endday is something like "2 weeks" or "4 weeks"

                    // Get current date and calculate future date
                    const currentDate = new Date();
                    splitCurrentDate = currentDate.toISOString().split('T')[0];
                    spliTFutureDate = calculateFutureDate(currentDate, durationInWeeks);

                    // Log current date, future date, and duration
                    logger.info(splitCurrentDate);
                    logger.info("Date after adding " + durationInWeeks * 7 + " days:", spliTFutureDate);

                    await delay(2000)
                    performAction("click", schedule_access.input.start_date),
                        await delay(2000)
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${splitCurrentDate}']`)
                    await delay(2000)
                    await performAction("click", schedule_access.label.schedule_access_view),
                        await delay(2000)

                    performAction("click", schedule_access.input.end_date),
                        await delay(2000)
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${spliTFutureDate}']`)
                    await delay(2000)
                    await performAction("click", schedule_access.label.schedule_access_view),
                        await delay(2000)

                }

                else {
                    logger.info("startday and endday not found")
                }
                if (row.Time === "Custom" && row.timezone !== null) {
                    // if (row.Time === "Custom" && row.timezone === "Asia/Kolkata") {
                    await delay(2000)
                    performAction("click", schedule_access.span.timezone_arrow)
                    await delay(2000)
                    if (row.timezone === "Asia/Kolkata") {
                        // Type the text into the input field
                        let partialText = row.timezone.slice(0, 6);
                        await performAction("type", schedule_access.span.search_zone, "page", partialText);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time),
                            await delay(2000)

                        function formatTime(date) {
                            let hours = date.getHours();
                            const minutes = date.getMinutes().toString().padStart(2, '0');
                            const meridiem = hours >= 12 ? 'PM' : 'AM';
                            hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
                            return `${hours.toString().padStart(2, '0')}:${minutes} ${meridiem}`;
                        }

                        // Get the current time in the Indian time zone
                        currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                        // Extract the time part from the string and convert it to a Date object
                        timePart = currentTime.split(',')[1].trim();
                        time = new Date(`2000-01-01 ${timePart}`);

                        // Format the current time
                        formattedCurrentTime = formatTime(time);
                        logger.info("Current Time:", formattedCurrentTime);

                        // Add one minute to the current time
                        oneMinuteLater = new Date(time.getTime() + 1 * 60000); // 1 minute in milliseconds

                        // Add 15 minutes to the current time
                        fifteenMinutesLater = new Date(time.getTime() + 16 * 60000); // 15 minutes in milliseconds

                        // Format the times
                        formattedTimeOneMinuteLater = (formatTime(oneMinuteLater)).trim();
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        formattedTimeFifteenMinutesLater = (formatTime(fifteenMinutesLater)).trim();
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        logger.info("Current Time:", formattedCurrentTime);
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        let current_time = await getElementHandleByXpath(schedule_access.input.start_time, "page", { timeout: 10000 });
                        await Promise.all([
                            await delay(2000), // Wait for 2 seconds before clicking
                            current_time[0].click({ clickCount: 3 }), // Click on the element
                            await delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            await delay(2000), // Wait for 2 seconds before continuing
                            // await current_time[0].type(formattedTimeOneMinuteLater)
                        ]);
                        await performAction("type", schedule_access.input.start_time, "page", formattedTimeOneMinuteLater),
                            await delay(2000),
                            await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)

                        let after_fifteen_time = await getElementHandleByXpath(schedule_access.input.end_time, "page", { timeout: 1000 });
                        await Promise.all([
                            delay(2000), // Wait for 2 seconds before clicking
                            after_fifteen_time[0].click({ clickCount: 3 }), // Click on the element
                            delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            delay(2000), // Wait for 2 seconds before continuing
                            // await after_fifteen_time[0].type(formattedTimeFifteenMinutesLater)
                        ]);
                        await performAction("type", schedule_access.input.end_time, "page", formattedTimeFifteenMinutesLater),
                            await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)
                    }
                    else if (row.timezone === "America/Chicago") {
                        // Type the text into the input field
                        let partialTextzone = row.timezone.slice(0, 10);
                        await performAction("type", schedule_access.span.search_zone, "page", partialTextzone);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone_us)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time_hours),
                            await delay(2000)
                    }
                    else {
                        logger.error("Timezone Not Found")
                    }
                }
                else {
                    logger.error("custom and time not found")
                }

                // Navigate to Notify now
                if (row.usernotification === "notify now") {
                    performAction("click", schedule_access.span.notify_me),
                        await delay(5000)
                }
                else {
                    logger.error("UserNotification Not found")
                }
                //Here i want to delete after expirt then select delete after expirt check box
                if (row.deleteuserafterexpiry === "No") {

                    performAction("click", schedule_access.button.sa_submit),
                        await delay(2000)
                }
                else {
                    logger.error("deleteuserafterexpiry not found")
                }
                let elemXPath3 = schedule_access.button.user_profile_sa_check;
                await page.waitForXPath(elemXPath3, { timeout: 20000 })
                let schedule_access_xpath = await getPropertyValueByXpath(schedule_access.button.user_profile_sa_check, "textContent");
                // Define the expected user schedule access text
                let actual_schedule_access = "Remove schedule access to change User Status";
                // reporter.startStep('Then Validate the user schedule access in user profile page');
                //Validate the expected result and actual result
                let schedule_access_xpath_sa = schedule_access_xpath.trim();
                reporter.startStep(`expected user schedule access is : ${schedule_access_xpath_sa} and actual user schedule access is : ${actual_schedule_access}`);
                expect(actual_schedule_access).toBe(schedule_access_xpath_sa);
                // Check if the comparison is successful
                if (schedule_access_xpath_sa === actual_schedule_access) {
                    logger.info("Validation successful: Values match");
                    // Additional validation steps, if needed
                } else {
                    logger.error(`Validation failed: Expected`);
                }
                reporter.endStep();
                reporter.endStep();
                // else {
                //     logger.error("userid not found")
                // }
            }
            else if (row.Repeat === "WeeklyAllDays") {
                //Navigate to user page
                reporter.startStep('I navigate to the user page');
                await performAction("click", leftpane.a.userdashboard)
                await delay(2000)
                reporter.endStep();
                if (row.userid !== null) {
                    reporter.startStep('And I select user');
                    await delay(2000)
                    await performAction("click", schedule_access.button.search_button),
                        await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        await delay(2000)
                    await performAction("click", schedule_access.span.userid_search),
                        await delay(2000)
                }
                else {
                    logger.error("userid not found")
                }
                reporter.endStep();

                await delay(5000),
                    await performAction("click", schedule_access.div.weekly_all_days_user_account),
                    await delay(2000)

                let elemXPath1 = schedule_access.span.arrow_mark;
                await page.waitForXPath(elemXPath1, { timeout: 10000 })

                performAction("click", schedule_access.span.arrow_mark),
                    await delay(2000)
                performAction("click", schedule_access.div.configuration_edit),
                    await delay(20000)
                let elemXPath2 = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath2, { timeout: 10000 })

                reporter.startStep("And I enable the schedule access and submit the schedule access");

                if (row.scheduleaccess === "enable") {
                    delay(2000),
                        performAction("click", schedule_access.button.enable_sa),
                        delay(2000)
                } else {
                    logger.error("Schedule access not found");
                }
                reporter.endStep();
                let elemXPath = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath, { timeout: 10000 })

                // if (row.Repeat === "WeeklyAllDays") {
                //Here I select the Weekly schedule access
                await delay(2000)
                performAction("click", schedule_access.span.Repeat_down),
                    await delay(5000)
                performAction("click", schedule_access.div.weekly_schedule_access),
                    await delay(5000)


                let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                let currentDate = new Date();
                logger.info("Current Date : ", currentDate);
                let todayDay = days[new Date().getDay()].slice(0, 3);
                let tomorrowDay = days[(new Date().getDay() + 1) % 7].slice(0, 3);
                logger.info(days[new Date().getDay()]);
                // console.log(todayDay);
                // console.log(tomorrowDay);

                async function selectDay(day) {
                    await page.waitForXPath(`//span[normalize-space()='${day}']`);
                    await performAction('click', `//span[normalize-space()='${day}']`);
                    await delay(2000);
                }

                async function selectAllDays() {
                    // Select remaining days
                    for (let i = 0; i < days.length; i++) {
                        await selectDay(days[i].slice(0, 3));
                    }
                }

                reporter.startStep(`when I select all days of the week starting from ${todayDay}`);
                logger.info(`when I select all days of the week starting from ${todayDay}`);
                await delay(2000);
                reporter.endStep();

                await selectAllDays();

                // }
                // else {
                //     logger.error("Weekly not found")
                // }


                function calculateFutureDate(startDate, durationInWeeks) {
                    const futureDate = new Date(startDate);
                    futureDate.setDate(futureDate.getDate() + durationInWeeks * 7); // Add weeks * 7 days
                    return futureDate.toISOString().split('T')[0]; // Return only the date part
                }

                // // Check if startday is "currentadate" and endday includes "weeks"
                if (row.startday === "currentadate" && row.endday.includes("weeks")) {
                    // Extract the number of weeks from row.endday
                    const durationInWeeks = parseInt(row.endday); // Assuming row.endday is something like "2 weeks" or "4 weeks"

                    // Get current date and calculate future date
                    const currentDate = new Date();
                    splitCurrentDate = currentDate.toISOString().split('T')[0];
                    spliTFutureDate = calculateFutureDate(currentDate, durationInWeeks);

                    // Log current date, future date, and duration
                    logger.info(splitCurrentDate);
                    logger.info("Date after adding " + durationInWeeks * 7 + " days:", spliTFutureDate);

                    await delay(2000)
                    performAction("click", schedule_access.input.start_date),
                        await delay(2000)
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${splitCurrentDate}']`)
                    await delay(2000)
                    await performAction("click", schedule_access.label.schedule_access_view),
                        await delay(2000)

                    performAction("click", schedule_access.input.end_date),
                        await delay(2000)
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${spliTFutureDate}']`)
                    await delay(2000)
                    await performAction("click", schedule_access.label.schedule_access_view),
                        await delay(2000)

                }

                else {
                    logger.info("startday and endday not found")
                }
                if (row.Time === "Custom" && row.timezone !== null) {
                    // if (row.Time === "Custom" && row.timezone === "Asia/Kolkata") {
                    await delay(2000)
                    performAction("click", schedule_access.span.timezone_arrow)
                    await delay(2000)
                    if (row.timezone === "Asia/Kolkata") {
                        // Type the text into the input field
                        let partialText = row.timezone.slice(0, 6);
                        await performAction("type", schedule_access.span.search_zone, "page", partialText);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time),
                            await delay(2000)

                        function formatTime(date) {
                            let hours = date.getHours();
                            const minutes = date.getMinutes().toString().padStart(2, '0');
                            const meridiem = hours >= 12 ? 'PM' : 'AM';
                            hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
                            return `${hours.toString().padStart(2, '0')}:${minutes} ${meridiem}`;
                        }

                        // Get the current time in the Indian time zone
                        currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                        // Extract the time part from the string and convert it to a Date object
                        timePart = currentTime.split(',')[1].trim();
                        time = new Date(`2000-01-01 ${timePart}`);

                        // Format the current time
                        formattedCurrentTime = formatTime(time);
                        logger.info("Current Time:", formattedCurrentTime);

                        // Add one minute to the current time
                        oneMinuteLater = new Date(time.getTime() + 1 * 60000); // 1 minute in milliseconds

                        // Add 15 minutes to the current time
                        fifteenMinutesLater = new Date(time.getTime() + 16 * 60000); // 15 minutes in milliseconds

                        // Format the times
                        formattedTimeOneMinuteLater = (formatTime(oneMinuteLater)).trim();
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        formattedTimeFifteenMinutesLater = (formatTime(fifteenMinutesLater)).trim();
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        logger.info("Current Time:", formattedCurrentTime);
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        let current_time = await getElementHandleByXpath(schedule_access.input.start_time, "page", { timeout: 10000 });
                        await Promise.all([
                            await delay(2000), // Wait for 2 seconds before clicking
                            current_time[0].click({ clickCount: 3 }), // Click on the element
                            await delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            await delay(2000), // Wait for 2 seconds before continuing
                            // await current_time[0].type(formattedTimeOneMinuteLater)
                        ]);
                        await performAction("type", schedule_access.input.start_time, "page", formattedTimeOneMinuteLater),
                            await delay(2000),
                            await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)

                        let after_fifteen_time = await getElementHandleByXpath(schedule_access.input.end_time, "page", { timeout: 1000 });
                        await Promise.all([
                            delay(2000), // Wait for 2 seconds before clicking
                            after_fifteen_time[0].click({ clickCount: 3 }), // Click on the element
                            delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            delay(2000), // Wait for 2 seconds before continuing
                            // await after_fifteen_time[0].type(formattedTimeFifteenMinutesLater)
                        ]);
                        await performAction("type", schedule_access.input.end_time, "page", formattedTimeFifteenMinutesLater),
                            await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)

                    }
                    else if (row.timezone === "America/Chicago") {
                        // Type the text into the input field
                        let partialTextzone = row.timezone.slice(0, 10);
                        await performAction("type", schedule_access.span.search_zone, "page", partialTextzone);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone_us)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time_hours),
                            await delay(2000)
                    }
                    else {
                        logger.error("Timezone Not Found")
                    }
                }
                else {
                    logger.error("custom and time not found")
                }

                // Navigate to Notify now
                if (row.usernotification === "notify now") {
                    performAction("click", schedule_access.span.notify_me),
                        await delay(5000)
                }
                else {
                    logger.error("UserNotification Not found")
                }
                //Here i want to delete after expirt then select delete after expirt check box
                if (row.deleteuserafterexpiry === "No") {

                    performAction("click", schedule_access.button.sa_submit),
                        await delay(2000)
                }
                else {
                    logger.error("deleteuserafterexpiry not found")
                }
                let elemXPath3 = schedule_access.button.user_profile_sa_check;
                await page.waitForXPath(elemXPath3, { timeout: 20000 })
                let schedule_access_xpath = await getPropertyValueByXpath(schedule_access.button.user_profile_sa_check, "textContent");
                // Define the expected user schedule access text
                let actual_schedule_access = "Remove schedule access to change User Status";
                // reporter.startStep('Then Validate the user schedule access in user profile page');
                //Validate the expected result and actual result
                let schedule_access_xpath_sa = schedule_access_xpath.trim();
                reporter.startStep(`expected user schedule access is : ${schedule_access_xpath_sa} and actual user schedule access is : ${actual_schedule_access}`);
                expect(actual_schedule_access).toBe(schedule_access_xpath_sa);
                // Check if the comparison is successful
                if (schedule_access_xpath_sa === actual_schedule_access) {
                    logger.info("Validation successful: Values match");
                    // Additional validation steps, if needed
                } else {
                    logger.error(`Validation failed: Expected`);
                }
                reporter.endStep();
                reporter.endStep();
            }
            else if (row.Repeat === "Monthlyonce") {
                //Navigate to user page
                reporter.startStep('I navigate to the user page');
                await performAction("click", leftpane.a.userdashboard)
                await delay(2000)
                reporter.endStep();
                if (row.userid !== null) {
                    reporter.startStep('And I select user');
                    await delay(2000)
                    await performAction("click", schedule_access.button.search_button),
                        await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        await delay(2000)
                    await performAction("click", schedule_access.span.userid_search),
                        await delay(2000)
                }
                else {
                    logger.error("userid not found")
                }
                reporter.endStep();

                await delay(5000),
                    await performAction("click", schedule_access.div.monthly_once_user_account),
                    await delay(2000)

                let elemXPath1 = schedule_access.span.arrow_mark;
                await page.waitForXPath(elemXPath1, { timeout: 10000 })

                performAction("click", schedule_access.span.arrow_mark),
                    await delay(2000)
                performAction("click", schedule_access.div.configuration_edit),
                    await delay(20000)
                let elemXPath2 = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath2, { timeout: 10000 })

                reporter.startStep("And I enable the schedule access and submit the schedule access");

                if (row.scheduleaccess === "enable") {
                    delay(2000),
                        performAction("click", schedule_access.button.enable_sa),
                        delay(2000)
                } else {
                    logger.error("Schedule access not found");
                }
                reporter.endStep()
                let elemXPath = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath, { timeout: 10000 })

                // if (row.Repeat === "Monthlyonce") {
                await delay(2000)
                performAction("click", schedule_access.span.Repeat_down),
                    await delay(5000)
                performAction("click", schedule_access.div.monthly_schedule_access),
                    await delay(5000)


                // Get current date
                let currentDate = new Date();
                // Format the dates
                let year = currentDate.getFullYear();
                let month = currentDate.getMonth() + 1; // Adding 1 because months are zero-based
                let day = currentDate.getDate();
                // Construct the formatted date string
                let formattedCurrentDate = `${year}-${month}-${day}`;
                logger.info("Current Date:", formattedCurrentDate);
                // Extract only the day
                let formattedOnlYTodayDate = formattedCurrentDate.split("-")[2];
                logger.info(formattedOnlYTodayDate)

                if (formattedOnlYTodayDate !== "1") {
                    //Here i select the On days
                    performAction("click", schedule_access.span.On_Days)
                    await delay(2000)
                    //Here i select the On days
                    await performAction("type", schedule_access.span.On_days_search, "page", formattedOnlYTodayDate),
                        await delay(1000)
                    //div[@class='ant-select-item-option-content'][normalize-space()='26']
                    await page.waitForXPath(`//div[@class='ant-select-item-option-content'][normalize-space()='${formattedOnlYTodayDate}']`)
                    await performAction('click', `//div[@class='ant-select-item-option-content'][normalize-space()='${formattedOnlYTodayDate}']`);
                    await delay(2000);
                    await performAction("click", schedule_access.span.deselect_existing_date)
                    await delay(1000)
                }
                else {
                    logger.error("Formated date is one 1")
                }
                // }
                // else {
                //     logger.error("MonthlyOnce not Found")
                // }









                if (row.startday === "currentadate" && row.endday.includes("month")) {
                    let currentDate = new Date();
                    let endOfTheMonthDate;

                    // Extract the number of months from row.endday
                    const months = parseInt(row.endday.split(" ")[0]);

                    // Calculate the end date based on the number of months
                    endOfTheMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + months, 1);

                    // Format the dates
                    formattedTodayCurrentDate = currentDate.toISOString().split('T')[0];
                    logger.info("Current Date:", formattedTodayCurrentDate);

                    formattedEndOfMonthDate = endOfTheMonthDate.toISOString().split('T')[0];
                    logger.info(`End of the Month Date (${months} months):`, formattedEndOfMonthDate);

                    await delay(2000);
                    performAction("click", schedule_access.input.start_date);
                    await delay(2000);
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${formattedTodayCurrentDate}']`);
                    await delay(2000);
                    await performAction("click", schedule_access.label.schedule_access_view);
                    await delay(2000);

                    performAction("click", schedule_access.input.end_date);
                    await delay(2000);
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${formattedEndOfMonthDate}']`);
                    await delay(2000);
                    await performAction("click", schedule_access.label.schedule_access_view);
                    await delay(2000);
                }
                else {
                    logger.info("startday and endday not found");
                }





                // if (row.startday === "currentadate" && row.endday === "MonthEndDate") {
                //     // Get current date
                //     let currentDate = new Date();
                //     // Get the end of the month date
                //     endOfTheMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                //     // Format the dates
                //     formattedTodayCurrentDate = currentDate.toISOString().split('T')[0];
                //     console.log("Current Date:", formattedTodayCurrentDate);
                //     formattedEndOfMonthDate = endOfTheMonthDate.toISOString().split('T')[0];
                //     console.log("End of the Month Date:", formattedEndOfMonthDate);

                //     await delay(2000)
                //     performAction("click", schedule_access.input.start_date),
                //         await delay(2000)
                //     await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${formattedTodayCurrentDate}']`)
                //     await delay(2000)
                //     await performAction("click", schedule_access.label.schedule_access_view),
                //         await delay(2000)

                //     performAction("click", schedule_access.input.end_date),
                //         await delay(2000)
                //     await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${formattedEndOfMonthDate}']`)
                //     await delay(2000)
                //     await performAction("click", schedule_access.label.schedule_access_view),
                //         await delay(2000)
                // }
                // else {
                //     logger.info("startday and endday not found")
                // }

                if (row.Time === "Custom" && row.timezone !== null) {
                    await delay(2000)
                    performAction("click", schedule_access.span.timezone_arrow)
                    await delay(2000)

                    if (row.timezone === "Asia/Kolkata") {
                        // Type the text into the input field
                        let partialText = row.timezone.slice(0, 6);
                        await performAction("type", schedule_access.span.search_zone, "page", partialText);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time),
                            await delay(2000)

                        function formatTime(date) {
                            let hours = date.getHours();
                            const minutes = date.getMinutes().toString().padStart(2, '0');
                            const meridiem = hours >= 12 ? 'PM' : 'AM';
                            hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
                            return `${hours.toString().padStart(2, '0')}:${minutes} ${meridiem}`;
                        }

                        // Get the current time in the Indian time zone
                        currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                        // Extract the time part from the string and convert it to a Date object
                        timePart = currentTime.split(',')[1].trim();
                        time = new Date(`2000-01-01 ${timePart}`);
                        // Format the current time
                        formattedCurrentTime = formatTime(time);
                        logger.info("Current Time:", formattedCurrentTime);

                        // Add one minute to the current time
                        oneMinuteLater = new Date(time.getTime() + 1 * 60000); // 1 minute in milliseconds
                        // Add 15 minutes to the current time
                        fifteenMinutesLater = new Date(time.getTime() + 16 * 60000); // 15 minutes in milliseconds

                        // Format the times
                        formattedTimeOneMinuteLater = (formatTime(oneMinuteLater)).trim();
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        formattedTimeFifteenMinutesLater = (formatTime(fifteenMinutesLater)).trim();
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        logger.info("Current Time:", formattedCurrentTime);
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        let current_time = await getElementHandleByXpath(schedule_access.input.start_time, "page", { timeout: 10000 });
                        await Promise.all([
                            await delay(2000), // Wait for 2 seconds before clicking
                            current_time[0].click({ clickCount: 3 }), // Click on the element
                            await delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            await delay(2000), // Wait for 2 seconds before continuing
                            // await current_time[0].type(formattedTimeOneMinuteLater)
                        ]);
                        await performAction("type", schedule_access.input.start_time, "page", formattedTimeOneMinuteLater),
                            await delay(2000),
                            await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)

                        let after_fifteen_time = await getElementHandleByXpath(schedule_access.input.end_time, "page", { timeout: 1000 });
                        await Promise.all([
                            delay(2000), // Wait for 2 seconds before clicking
                            after_fifteen_time[0].click({ clickCount: 3 }), // Click on the element
                            delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            delay(2000), // Wait for 2 seconds before continuing
                            // await after_fifteen_time[0].type(formattedTimeFifteenMinutesLater)
                        ]);
                        await performAction("type", schedule_access.input.end_time, "page", formattedTimeFifteenMinutesLater),
                            await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)
                    }
                    else if (row.timezone === "America/Chicago") {
                        // Type the text into the input field
                        let partialTextzone = row.timezone.slice(0, 10);
                        await performAction("type", schedule_access.span.search_zone, "page", partialTextzone);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone_us)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time_hours),
                            await delay(2000)
                    }
                    else {
                        logger.error("timezone Not Found")
                    }
                }
                else {
                    logger.error("custom and time not found")
                }

                // Navigate to Notify now
                if (row.usernotification === "notify now") {
                    performAction("click", schedule_access.span.notify_me),
                        await delay(5000)
                }
                else {
                    logger.error("UserNotification Not found")
                }
                //Here i want to delete after expirt then select delete after expirt check box
                if (row.deleteuserafterexpiry === "No") {

                    performAction("click", schedule_access.button.sa_submit),
                        await delay(2000)
                }
                else {
                    logger.error("deleteuserafterexpiry not found")
                }
                let elemXPath3 = schedule_access.button.user_profile_sa_check;
                await page.waitForXPath(elemXPath3, { timeout: 20000 })
                let schedule_access_xpath = await getPropertyValueByXpath(schedule_access.button.user_profile_sa_check, "textContent");
                // Define the expected user schedule access text
                let actual_schedule_access = "Remove schedule access to change User Status";
                // reporter.startStep('Then Validate the user schedule access in user profile page');
                //Validate the expected result and actual result
                let schedule_access_xpath_sa = schedule_access_xpath.trim();
                reporter.startStep(`expected user schedule access is : ${schedule_access_xpath_sa} and actual user schedule access is : ${actual_schedule_access}`);
                expect(actual_schedule_access).toBe(schedule_access_xpath_sa);
                // Check if the comparison is successful
                if (schedule_access_xpath_sa === actual_schedule_access) {
                    logger.info("Validation successful: Values match");
                    // Additional validation steps, if needed
                } else {
                    logger.error(`Validation failed: Expected`);
                }
                reporter.endStep();
                reporter.endStep();
            }
            else if (row.Repeat === "MonthlyOnWeekDay") {
                //Navigate to user page
                reporter.startStep('I navigate to the user page');
                await performAction("click", leftpane.a.userdashboard)
                await delay(2000)
                reporter.endStep();
                if (row.userid !== null) {
                    reporter.startStep('And I select user');
                    await delay(2000)
                    await performAction("click", schedule_access.button.search_button),
                        await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        await delay(2000)
                    await performAction("click", schedule_access.span.userid_search),
                        await delay(2000)
                }
                else {
                    logger.error("userid not found")
                }
                reporter.endStep();

                await delay(5000),
                    await performAction("click", schedule_access.div.monthly_on_day_week),
                    await delay(2000)

                let elemXPath1 = schedule_access.span.arrow_mark;
                await page.waitForXPath(elemXPath1, { timeout: 10000 })

                performAction("click", schedule_access.span.arrow_mark),
                    await delay(2000)
                performAction("click", schedule_access.div.configuration_edit),
                    await delay(20000)
                let elemXPath2 = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath2, { timeout: 10000 })

                reporter.startStep("And I enable the schedule access and submit the schedule access");

                if (row.scheduleaccess === "enable") {
                    delay(2000),
                        performAction("click", schedule_access.button.enable_sa),
                        delay(2000)
                } else {
                    logger.error("Schedule access not found");
                }
                reporter.endStep()
                let elemXPath = schedule_access.label.schedule_access_view;
                await page.waitForXPath(elemXPath, { timeout: 10000 })

                // if (row.Repeat === "MonthlyOnDayWeek") {
                await delay(2000)
                performAction("click", schedule_access.span.Repeat_down),
                    await delay(5000)
                performAction("click", schedule_access.div.monthly_schedule_access),
                    await delay(5000)

                function getOccurrenceOfDayInMonth(dayName, dayOfMonth, monthName, occurrence) {
                    // Get the ordinal suffix for the day
                    const ordinalNumbers = ["First", "Second", "Third", "Fourth"];
                    suffix = ordinalNumbers[occurrence - 1] || 'Last';

                    // Format the output
                    let output = `Today expected date is: ${suffix} ${dayName} ${dayOfMonth}th ${monthName} month`;

                    return output;
                }

                // Example usage with specific date
                // const specificDate = new Date(2024, 4, 12); // May 14, 2024

                // Example usage with specific variables
                const today = new Date();
                const month = today.getMonth();
                const year = today.getFullYear();
                const dayOfMonth = today.getDate();
                const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                dayName = days[dayOfWeek];
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month));
                let occurrence = Math.ceil(dayOfMonth / 7);

                console.log("getOccurrenceOfDayInMonth :", getOccurrenceOfDayInMonth(dayName, dayOfMonth, monthName, occurrence));
                console.log(dayName)
                console.log(dayOfMonth)
                console.log(monthName)
                console.log(occurrence)
                console.log(suffix)

                // Now you can use weekType and currentDayOfWeek in the subsequent code
                await delay(2000);
                await performAction("click", schedule_access.span.on_days_week_search);

                // Navigate to weekly dropdown arrow
                await delay(1000);
                await performAction("click", schedule_access.span.week_dropdown_arrow);
                await delay(2000);
                await page.waitForXPath(`//div[@class='ant-select-item-option-content'][normalize-space()='${suffix}']`);
                await performAction('click', `//div[@class='ant-select-item-option-content'][normalize-space()='${suffix}']`);

                // Navigate to day dropdown arrow
                await delay(2000);
                await performAction("click", schedule_access.span.day_dropdown_arrow);
                await delay(1000);
                await page.waitForXPath(`//div[@class='ant-select-item-option-content'][normalize-space()='${dayName}']`);
                await delay(1000);
                await performAction('click', `//div[@class='ant-select-item-option-content'][normalize-space()='${dayName}']`);

                // }
                // else {
                //     logger.error("MonthlyOnce not Found")
                // }

                if (row.startday === "currentadate" && row.endday.includes("month")) {
                    let currentDate = new Date();
                    let endOfTheMonthDate;

                    // Extract the number of months from row.endday
                    const months = parseInt(row.endday.split(" ")[0]);

                    // Calculate the end date based on the number of months
                    endOfTheMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + months, 1);

                    // Format the dates
                    formattedTodayCurrentDate = currentDate.toISOString().split('T')[0];
                    logger.info("Current Date:", formattedTodayCurrentDate);

                    formattedEndOfMonthDate = endOfTheMonthDate.toISOString().split('T')[0];
                    logger.info(`End of the Month Date (${months} months):`, formattedEndOfMonthDate);

                    await delay(2000);
                    performAction("click", schedule_access.input.start_date);
                    await delay(2000);
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${formattedTodayCurrentDate}']`);
                    await delay(2000);
                    await performAction("click", schedule_access.label.schedule_access_view);
                    await delay(2000);

                    performAction("click", schedule_access.input.end_date);
                    await delay(2000);
                    await performAction("click", `//div[@class='ant-picker-cell-inner']//ancestor::td[@title='${formattedEndOfMonthDate}']`);
                    await delay(2000);
                    await performAction("click", schedule_access.label.schedule_access_view);
                    await delay(2000);
                }
                else {
                    logger.info("startday and endday not found");
                }

                if (row.Time === "Custom" && row.timezone !== null) {
                    await delay(2000)
                    performAction("click", schedule_access.span.timezone_arrow)
                    await delay(2000)

                    if (row.timezone === "Asia/Kolkata") {
                        // Type the text into the input field
                        let partialText = row.timezone.slice(0, 6);
                        await performAction("type", schedule_access.span.search_zone, "page", partialText);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time),
                            await delay(2000)

                        function formatTime(date) {
                            let hours = date.getHours();
                            const minutes = date.getMinutes().toString().padStart(2, '0');
                            const meridiem = hours >= 12 ? 'PM' : 'AM';
                            hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
                            return `${hours.toString().padStart(2, '0')}:${minutes} ${meridiem}`;
                        }

                        // Get the current time in the Indian time zone
                        currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                        // Extract the time part from the string and convert it to a Date object
                        timePart = currentTime.split(',')[1].trim();
                        time = new Date(`2000-01-01 ${timePart}`);

                        // Format the current time
                        formattedCurrentTime = formatTime(time);
                        logger.info("Current Time:", formattedCurrentTime);

                        // Add one minute to the current time
                        oneMinuteLater = new Date(time.getTime() + 1 * 60000); // 1 minute in milliseconds

                        // Add 15 minutes to the current time
                        fifteenMinutesLater = new Date(time.getTime() + 16 * 60000); // 15 minutes in milliseconds

                        // Format the times
                        formattedTimeOneMinuteLater = (formatTime(oneMinuteLater)).trim();
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        formattedTimeFifteenMinutesLater = (formatTime(fifteenMinutesLater)).trim();
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        logger.info("Current Time:", formattedCurrentTime);
                        logger.info("One Minute Later:", formattedTimeOneMinuteLater);
                        logger.info("Fifteen Minutes Later:", formattedTimeFifteenMinutesLater);

                        let current_time = await getElementHandleByXpath(schedule_access.input.start_time, "page", { timeout: 10000 });
                        await Promise.all([
                            await delay(2000), // Wait for 2 seconds before clicking
                            current_time[0].click({ clickCount: 3 }), // Click on the element
                            await delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            await delay(2000), // Wait for 2 seconds before continuing
                            // await current_time[0].type(formattedTimeOneMinuteLater)
                        ]);
                        await performAction("type", schedule_access.input.start_time, "page", formattedTimeOneMinuteLater),
                            await delay(2000),
                            await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)

                        let after_fifteen_time = await getElementHandleByXpath(schedule_access.input.end_time, "page", { timeout: 1000 });
                        await Promise.all([
                            delay(2000), // Wait for 2 seconds before clicking
                            after_fifteen_time[0].click({ clickCount: 3 }), // Click on the element
                            delay(2000), // Wait for 2 seconds before pressing backspace
                            page.keyboard.press('Backspace'), // Press backspace
                            delay(2000), // Wait for 2 seconds before continuing
                            // await after_fifteen_time[0].type(formattedTimeFifteenMinutesLater)
                        ]);
                        await performAction("type", schedule_access.input.end_time, "page", formattedTimeFifteenMinutesLater),
                            await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(2000)
                    }
                    else if (row.timezone === "America/Chicago") {
                        // Type the text into the input field
                        let partialTextzone = row.timezone.slice(0, 10);
                        await performAction("type", schedule_access.span.search_zone, "page", partialTextzone);
                        // await page.keyboard.press('Enter');
                        await delay(2000)
                        performAction("click", schedule_access.div.time_zone_us)
                        await delay(2000)
                        await performAction("click", schedule_access.label.schedule_access_view),
                            await delay(3000)
                        performAction("click", schedule_access.radio.sa_time_hours),
                            await delay(2000)
                    }
                    else {
                        logger.error("timezone Not Found")
                    }
                }
                else {
                    logger.error("custom and time not found")
                }

                if (row.deleteuserafterexpiry === "No" && row.usernotification === "notify now") {
                    performAction("click", schedule_access.span.notify_me),
                        await delay(5000)
                    performAction("click", schedule_access.button.sa_submit),
                        await delay(2000)
                }
                else {
                    logger.error("deleteuserafterexpiry and usernotification not found")
                }
                let elemXPath3 = schedule_access.button.user_profile_sa_check;
                await page.waitForXPath(elemXPath3, { timeout: 20000 })
                let schedule_access_xpath = await getPropertyValueByXpath(schedule_access.button.user_profile_sa_check, "textContent");
                // Define the expected user schedule access text
                let actual_schedule_access = "Remove schedule access to change User Status";
                // reporter.startStep('Then Validate the user schedule access in user profile page');
                //Validate the expected result and actual result
                let schedule_access_xpath_sa = schedule_access_xpath.trim();
                reporter.startStep(`expected user schedule access is : ${schedule_access_xpath_sa} and actual user schedule access is : ${actual_schedule_access}`);
                expect(actual_schedule_access).toBe(schedule_access_xpath_sa);
                // Check if the comparison is successful
                if (schedule_access_xpath_sa === actual_schedule_access) {
                    logger.info("Validation successful: Values match");
                    // Additional validation steps, if needed
                } else {
                    logger.error(`Validation failed: Expected`);
                }
                reporter.endStep();
                reporter.endStep();
            }
            else {
                logger.error("Repeat Not Found")
            }
        }
    })
}

export const whenCheckSceduleaccessEnableUI = when => {
    when(/^I check schedule access enable in UI$/, async (table) => {
        reporter.startStep('When I check schedule access enable in UI');
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])



            let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
            reporter.addAttachment("after schedule access form", screenshot, "image/png");


            let elemXPath4 = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath4, { timeout: 10000 })

            if (row.userid !== null) {
                //Verify the schedule access in UI
                await delay(2000)
                await performAction("click", leftpane.a.userdashboard),
                    await delay(5000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                logger.info("search user id...")
                performAction("click", schedule_access.span.userid_search),
                    await delay(5000)
                let ssscreenshot = await customScreenshot('userid.png', 1920, 1200)
                reporter.addAttachment("userid in UI", ssscreenshot, "image/png");
                await delay(3000)
                const sa_xpath_user_list_page_validation = schedule_access.button.user_list_sa_check;
                let isOptionEnabled = false;

                try {
                    await page.waitForXPath(sa_xpath_user_list_page_validation, { timeout: 5000 });
                    reporter.startStep('schedule access option is enabled with XPath');
                    isOptionEnabled = true;
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('schedule access option is disabled with XPath');
                    reporter.endStep();
                }

                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Schedule access option is enabled.")
                    reporter.startStep('Test case passed: Schedule access option is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Schedule access option is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Schedule access option is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    })
}

export const whenISearchuserGetEnabled = when => {
    when(/^I search with userid user get enabled state$/, async (table) => {
        reporter.startStep('When I search with userid user get enabled state');

        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.userid !== null) {
                logger.info("inside if condition.....")
                const maxTime = 10 * 60 * 1000; // 8 minutes in milliseconds
                const refreshInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
                const startTime = Date.now(); // Store the start time
                async function performCommonActions() {
                    await delay(10000);
                    reporter.startStep('search userid status');
                    logger.info("before clicking")
                    await performAction("click", leftpane.a.dashboardicon),
                        logger.info("navigate to the dashborad")
                    await delay(5000)
                    await performAction("click", leftpane.a.userdashboard),
                        logger.info("navigate to the userdashboard")
                    await delay(5000)
                    await performAction("click", schedule_access.button.search_button),
                        logger.info("navigate to the use search arrow")
                    await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        logger.info("printing the text")
                    await delay(1000)
                    await performAction("click", schedule_access.span.userid_search)
                    logger.info("navigate to the search button")
                    await delay(5000)
                    reporter.endStep();
                }
                logger.info(Date.now())
                logger.info(startTime)
                logger.info(maxTime)
                while (Date.now() - startTime < maxTime) {
                    try {
                        // Perform common actions
                        await performCommonActions();

                        // Get the user status
                        const userStatus = await getPropertyValueByXpath(schedule_access.td.user_status, "textContent");

                        // Check user status
                        if (userStatus.trim() === "Enabled") {
                            // Test case passed within the time limit
                            logger.info("User status is Enabled within the time limit.");
                            break; // Exit the loop as the test case passed
                        } else if (userStatus.trim() === "Disabled") {
                            // Wait for refresh interval before next attempt
                            logger.info("User status is still Disabled. Waiting for 2 minutes before next attempt.");
                            await delay(refreshInterval);

                        } else {
                            // Handle unexpected user status
                            logger.error("Unexpected user status:", userStatus);
                            // Optionally, you may choose to break the loop or handle it differently
                        }
                    } catch (error) {
                        // Handle any errors occurred during common actions or fetching user status
                        logger.error("Error occurred:", error);
                        // Optionally, you may choose to break the loop or handle it differently
                    }
                }

                // Check if the loop exited due to time limit exceeded
                if (Date.now() - startTime >= maxTime) {
                    logger.error("Time limit exceeded and test case failed.");
                    // Optionally, you may choose to perform additional actions or handle it differently
                }

            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    });
};

export const andVerifySAConfigAppliedAsconfigured = and => {
    and(/^Verify the schedule access config is applied as configured$/, async (table) => {
        reporter.startStep("And Verify the schedule access config is applied as configured");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            await performAction("click", leftpane.a.dashboardicon)
            let elemXPath = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath, { timeout: 10000 })
            await performAction("click", leftpane.a.userdashboard)
            await delay(2000)

            if (row.userid !== null) {
                reporter.startStep('And I select user');
                await delay(2000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                await performAction("click", schedule_access.span.userid_search),
                    await delay(2000)
            }
            else {
                logger.error("userid not found")
            }
            reporter.endStep();

            await delay(5000),
                await performAction("click", schedule_access.div.user_account),
                await delay(2000)
            let elemXPath1 = schedule_access.span.arrow_mark;
            await page.waitForXPath(elemXPath1, { timeout: 10000 })

            performAction("click", schedule_access.span.arrow_mark),
                await delay(2000)
            performAction("click", schedule_access.div.configuration_edit),
                await delay(20000)

            // schedule_access.label.schedule_access_view
            let elemXPath2 = schedule_access.label.schedule_access_view;
            await page.waitForXPath(elemXPath2, { timeout: 10000 })


            if (row.timezone === "Asia/Kolkata") {
                let currentDate = new Date();
                let calenderYear = currentDate.toISOString().split('T');
                logger.info("Full Current Date: ", calenderYear);
                let splitcurrentDate = calenderYear[0];
                logger.info("Current Date: ", splitcurrentDate);

                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(splitcurrentDate).toBe(checkCurrentDateXpath)
                if (splitcurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${splitcurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(splitcurrentDate).toBe(checkEndCurrentDateXpath)
                if (splitcurrentDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${splitcurrentDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }
                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.time_zone_text, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the start time
                let checkStartTimeXpath = await getPropertyValueByXpath(schedule_access.input.start_time, "defaultValue")
                expect(checkStartTimeXpath).toBe(formattedTimeOneMinuteLater)
                if (checkStartTimeXpath === formattedTimeOneMinuteLater) {
                    reporter.startStep(`Expected start time is : ${checkStartTimeXpath} and Actual start time is : ${formattedTimeOneMinuteLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //verify the end time
                let checkEndTimeXpath = await getPropertyValueByXpath(schedule_access.input.end_time, "defaultValue")
                expect(checkEndTimeXpath).toBe(formattedTimeFifteenMinutesLater)
                if (checkEndTimeXpath === formattedTimeFifteenMinutesLater) {
                    reporter.startStep(`Expected end time is : ${checkEndTimeXpath} and Actual end time is : ${formattedTimeFifteenMinutesLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat, "textContent")
                expect(row.Repeat).toBe(checkRepeatXpath)
                if (row.Repeat === checkRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${row.Repeat} and Actual repeat mode is : ${checkRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else if (row.timezone === "America/Chicago") {
                let currentDate = new Date();
                let calenderYear = currentDate.toISOString().split('T');
                logger.info("Full Current Date: ", calenderYear);
                let splitcurrentDate = calenderYear[0];
                logger.info("Current Date: ", splitcurrentDate);

                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(splitcurrentDate).toBe(checkCurrentDateXpath)
                if (splitcurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${splitcurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(splitcurrentDate).toBe(checkEndCurrentDateXpath)
                if (splitcurrentDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${splitcurrentDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }

                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.timezone_diff_country, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)
                // timezone_diff_country

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat, "textContent")
                expect(row.Repeat).toBe(checkRepeatXpath)
                if (row.Repeat === checkRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${row.Repeat} and Actual repeat mode is : ${checkRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();

            }
            else {
                logger.error("Time Zone Not Found")
            }
        }
    });
};

export const andILogoutAdminUserAndLoginSAUser = and => {
    and(/^I Logout Admin user and Login schedule access user$/, async (table) => {
        reporter.startStep("And I Logout Admin user and Login schedule access user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])

            let elemXPath6 = leftpane.svg.myprofile;
            await page.waitForXPath(elemXPath6, { timeout: 10000 })

            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)

            if (row.userid !== null && row.password !== null) {
                var config
                config = await getEnvConfig()
                await goTo(config.otaURL)
                logger.info("Schedule access user details");
                await performAction("type", otalogin.details.username, "page", row.userid),
                    await delay(1000)
                await performAction("type", otalogin.details.password, "page", row.password),
                    await delay(1000)
                await performAction("click", schedule_access.label.password_view),
                    await delay(1000)
                await performAction("click", otalogin.details.login_button),
                    await delay(20000)
                await performAction("click", leftpane.a.userprofilepage),
                    await delay(5000)
                let screenshot = await customScreenshot('scheduleuser.png', 1920, 1200)
                reporter.addAttachment("schedule access user", screenshot, "image/png");
                await delay(5000)
                await performAction("click", schedule_access.span.user_profile_navigate)
                await delay(1000)
                // let actual_user_id = "saccesstesting";
                let user_profile_username = await getPropertyValueByXpath(schedule_access.div.user_profile_user_name, "textContent");
                logger.info(user_profile_username)
                if (row.userid === user_profile_username) {
                    reporter.startStep(`Expected schedule USER ID : ${user_profile_username}. Actual schedule USER ID : ${row.userid}`);
                    logger.info("test case passed")
                    expect(row.userid).toBe(user_profile_username);
                    reporter.endStep();
                }
                else {
                    logger.error("test case failed : user id is not matched")
                }
            }
            else {
                logger.error("userid and password not found")
            }
            reporter.endStep();
        }
    });
}

export const thenVerifyHttpsDeviceAccess = then => {
    then(/^Verify the http device access$/, async (table) => {
        reporter.startStep("Then Verify the http device access");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.type == "http") {
                logger.info("enter in condition...")
                let http_xpathVariable = schedule_access.span.http_access_device;
                let device123 = await page.$x(http_xpathVariable);
                logger.info("device123 ---- >" + device123);
                await device123[0].click();
                logger.info("after clicking ....")
                // await page.waitForTimeout(10000); // Use waitForTimeout to wait for 10 seconds
                await new Promise(resolve => setTimeout(resolve, 10000));

                // Get all pages after opening a new tab/window
                let pages = await browser.pages();
                let newPage = pages[pages.length - 1];
                logger.info("HTTP part");
                logger.info("New page URL: " + newPage.url());


                delay(2000)
                //let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
                let newpath = await pathJoin("newpage.png")
                let ss = await newPage.screenshot({ path: newpath, fullPage: true })
                delay(2000)

                reporter.addAttachment("after schedule access form", ss, "image/png");

                let expected_http_device_access_connection = "Welcome to nginx!";
                try {
                    const actual_http_device_connection = await newPage.waitForXPath('//h1[text()="Welcome to nginx!"]', { visible: true });
                    if (actual_http_device_connection) {
                        const elements = await newPage.evaluate(() => {
                            const xpath = '//h1[text()="Welcome to nginx!"]';
                            const nodeList = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                            const elements = [];
                            for (let i = 0; i < nodeList.snapshotLength; i++) {
                                elements.push(nodeList.snapshotItem(i).textContent);
                            }
                            return elements;
                        });
                        logger.info("actual_http_device_connection: " + elements);
                        if (elements[0] === expected_http_device_access_connection) {
                            reporter.startStep(`Expected HTTPS device connection status: ${elements[0]}. Actual HTTPS device connection status: ${expected_http_device_access_connection}`);
                            logger.info("Values are matched: test case passed!");
                            expect(elements[0]).toBe(expected_http_device_access_connection);
                            reporter.endStep();
                        } else {
                            logger.error("Values are not matched: test case failed!");
                        }
                    } else {
                        logger.info("New page did not load properly.");
                    }
                } catch (error) {
                    logger.error("Error occurred: " + error);
                }
                // Close the new page
                await newPage.close();

                // let elemXPath7 = leftpane.svg.myprofile;
                // await page.waitForXPath(elemXPath7, { timeout: 10000 })

                // await performAction("click", leftpane.svg.myprofile)
                // await delay(1000)
                // await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
                // await delay(5000)
            }
            else {
                logger.info("Http port not working!!!")
            }
            reporter.endStep();
        }
    })
}

export const whenICheckWeeklySceduleaccessEnableUI = when => {
    when(/^I check weekly once schedule access enable in UI$/, async (table) => {
        reporter.startStep('When I check weekly once schedule access enable in UI');
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])



            let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
            reporter.addAttachment("after schedule access form", screenshot, "image/png");


            let elemXPath4 = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath4, { timeout: 10000 })

            if (row.userid !== null) {
                //Verify the schedule access in UI
                await delay(2000)
                await performAction("click", leftpane.a.userdashboard),
                    await delay(5000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                logger.info("search user id...")
                performAction("click", schedule_access.span.userid_search),
                    await delay(5000)
                let ssscreenshot = await customScreenshot('userid.png', 1920, 1200)
                reporter.addAttachment("userid in UI", ssscreenshot, "image/png");
                await delay(3000)
                const sa_xpath_user_list_page_validation = schedule_access.button.user_list_sa_check;
                let isOptionEnabled = false;

                try {
                    await page.waitForXPath(sa_xpath_user_list_page_validation, { timeout: 5000 });
                    reporter.startStep('schedule access option is enabled with XPath');
                    isOptionEnabled = true;
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('schedule access option is disabled with XPath');
                    reporter.endStep();
                }

                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Schedule access option is enabled.")
                    reporter.startStep('Test case passed: Schedule access option is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Schedule access option is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Schedule access option is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    })
}

export const whenISearchWeeklyScheduleUserGetEnabled = when => {
    when(/^I search weekly once schedule access with userid user get enabled state$/, async (table) => {
        reporter.startStep('When I search weekly once schedule access with userid user get enabled state');

        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.userid !== null) {
                logger.info("inside if condition.....")
                const maxTime = 10 * 60 * 1000; // 8 minutes in milliseconds
                const refreshInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
                const startTime = Date.now(); // Store the start time
                async function performCommonActions() {
                    await delay(10000);
                    reporter.startStep('search userid status');
                    logger.info("before clicking")
                    await performAction("click", leftpane.a.dashboardicon),
                        logger.info("navigate to the dashborad")
                    await delay(5000)
                    await performAction("click", leftpane.a.userdashboard),
                        logger.info("navigate to the userdashboard")
                    await delay(5000)
                    await performAction("click", schedule_access.button.search_button),
                        logger.info("navigate to the use search arrow")
                    await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        logger.info("printing the text")
                    await delay(1000)
                    await performAction("click", schedule_access.span.userid_search)
                    logger.info("navigate to the search button")
                    await delay(5000)
                    reporter.endStep();
                }
                logger.info(Date.now())
                logger.info(startTime)
                logger.info(maxTime)
                while (Date.now() - startTime < maxTime) {
                    try {
                        // Perform common actions
                        await performCommonActions();

                        // Get the user status
                        const userStatus = await getPropertyValueByXpath(schedule_access.td.user_status, "textContent");

                        // Check user status
                        if (userStatus.trim() === "Enabled") {
                            // Test case passed within the time limit
                            logger.info("User status is Enabled within the time limit.");
                            break; // Exit the loop as the test case passed
                        } else if (userStatus.trim() === "Disabled") {
                            // Wait for refresh interval before next attempt
                            logger.info("User status is still Disabled. Waiting for 2 minutes before next attempt.");
                            await delay(refreshInterval);
                        } else {
                            // Handle unexpected user status
                            logger.error("Unexpected user status:", userStatus);
                            // Optionally, you may choose to break the loop or handle it differently
                        }
                    } catch (error) {
                        // Handle any errors occurred during common actions or fetching user status
                        logger.error("Error occurred:", error);
                        // Optionally, you may choose to break the loop or handle it differently
                    }
                }

                // Check if the loop exited due to time limit exceeded
                if (Date.now() - startTime >= maxTime) {
                    logger.error("Time limit exceeded and test case failed.");
                    // Optionally, you may choose to perform additional actions or handle it differently
                }

            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    });
};

export const andIVerifyWeeklyOnceSAConfigAsConfigured = and => {
    and(/^Verify the weeklyonce schedule access config is applied as configured$/, async (table) => {
        reporter.startStep("And Verify the weeklyonce schedule access config is applied as configured");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            await performAction("click", leftpane.a.dashboardicon)
            let elemXPath = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath, { timeout: 10000 })
            await performAction("click", leftpane.a.userdashboard)
            await delay(2000)

            if (row.userid !== null) {
                reporter.startStep('And I select user');
                await delay(2000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                await performAction("click", schedule_access.span.userid_search),
                    await delay(2000)
            }
            else {
                logger.error("userid not found")
            }
            reporter.endStep();

            await delay(5000),
                await performAction("click", schedule_access.div.weekly_user_account),
                await delay(2000)
            let elemXPath1 = schedule_access.span.arrow_mark;
            await page.waitForXPath(elemXPath1, { timeout: 10000 })

            performAction("click", schedule_access.span.arrow_mark),
                await delay(2000)
            performAction("click", schedule_access.div.configuration_edit),
                await delay(20000)

            // schedule_access.label.schedule_access_view
            let elemXPath2 = schedule_access.label.schedule_access_view;
            await page.waitForXPath(elemXPath2, { timeout: 10000 })

            if (row.timezone === "Asia/Kolkata") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(splitCurrentDate).toBe(checkCurrentDateXpath)
                if (splitCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${splitCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(spliTFutureDate).toBe(checkEndCurrentDateXpath)
                if (spliTFutureDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${spliTFutureDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }
                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.time_zone_text, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the start time
                let checkStartTimeXpath = await getPropertyValueByXpath(schedule_access.input.start_time, "defaultValue")
                expect(checkStartTimeXpath).toBe(formattedTimeOneMinuteLater)
                if (checkStartTimeXpath === formattedTimeOneMinuteLater) {
                    reporter.startStep(`Expected start time is : ${checkStartTimeXpath} and Actual start time is : ${formattedTimeOneMinuteLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //verify the end time
                let checkEndTimeXpath = await getPropertyValueByXpath(schedule_access.input.end_time, "defaultValue")
                expect(checkEndTimeXpath).toBe(formattedTimeFifteenMinutesLater)
                if (checkEndTimeXpath === formattedTimeFifteenMinutesLater) {
                    reporter.startStep(`Expected end time is : ${checkEndTimeXpath} and Actual end time is : ${formattedTimeFifteenMinutesLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_weekly_once, "textContent")
                let Repeatmode = row.Repeat.slice(0, 6)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(checkRepeatXpath)
                if (Repeatmode === checkRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${checkRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else if (row.timezone === "America/Chicago") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(splitCurrentDate).toBe(checkCurrentDateXpath)
                if (splitCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${splitCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(spliTFutureDate).toBe(checkEndCurrentDateXpath)
                if (spliTFutureDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${spliTFutureDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }

                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.timezone_diff_country, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)
                // timezone_diff_country

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_weekly_once, "textContent")
                let Repeatmode = row.Repeat.slice(0, 6)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(checkRepeatXpath)
                if (Repeatmode === checkRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${checkRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else {
                logger.error("Time Zone Not Found")
            }
        }
    });
};

export const andILogoutAdminUserAndLoginweeklySAUser = and => {
    and(/^I Logout Admin user and Login with weeklyonce schedule access user$/, async (table) => {
        reporter.startStep("And I Logout Admin user and Login with weeklyonce schedule access user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            let elemXPath6 = leftpane.svg.myprofile;
            await page.waitForXPath(elemXPath6, { timeout: 10000 })

            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)

            if (row.userid !== null && row.password !== null) {
                var config
                config = await getEnvConfig()
                await goTo(config.otaURL)
                logger.info("Schedule access user details");
                await performAction("type", otalogin.details.username, "page", row.userid),
                    await delay(1000)
                await performAction("type", otalogin.details.password, "page", row.password),
                    await delay(1000)
                await performAction("click", schedule_access.label.password_view),
                    await delay(1000)
                await performAction("click", otalogin.details.login_button),
                    await delay(10000)
                await performAction("click", leftpane.a.userprofilepage),
                    await delay(5000)
                let screenshot = await customScreenshot('scheduleuser.png', 1920, 1200)
                reporter.addAttachment("schedule access user", screenshot, "image/png");
                await delay(2000)
                await performAction("click", schedule_access.span.user_profile_navigate)
                await delay(2000)
                // let actual_user_id = "saccesstesting";
                let user_profile_username = await getPropertyValueByXpath(schedule_access.div.weekly_user_profile_name, "textContent");
                logger.info(user_profile_username)
                if (row.userid === user_profile_username) {
                    reporter.startStep(`Expected schedule USER ID : ${user_profile_username}. Actual schedule USER ID : ${row.userid}`);
                    logger.info("test case passed")
                    expect(row.userid).toBe(user_profile_username);
                    reporter.endStep();
                }
                else {
                    logger.error("test case failed : user id is not matched")
                }
            }
            else {
                logger.error("userid and password not found")
            }
            reporter.endStep();
        }
    });
}

export const thenVerifyHttpsDeviceAccessWeeklySA = then => {
    then(/^Verify the http device access in weeklyonce schedule acess user$/, async (table) => {
        reporter.startStep("Then Verify the http device access in weeklyonce schedule acess user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.type == "http") {
                logger.info("enter in condition...")
                let http_xpathVariable = schedule_access.span.http_access_device;
                let device123 = await page.$x(http_xpathVariable);
                logger.info("device123 ---- >" + device123);
                await device123[0].click();
                logger.info("after clicking ....")
                // await page.waitForTimeout(10000); // Use waitForTimeout to wait for 10 seconds
                await new Promise(resolve => setTimeout(resolve, 10000));

                // Get all pages after opening a new tab/window
                let pages = await browser.pages();
                let newPage = pages[pages.length - 1];
                logger.info("HTTP part");
                logger.info("New page URL: " + newPage.url());

                delay(2000)
                //let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
                let newpath = await pathJoin("newpage.png")
                let ss = await newPage.screenshot({ path: newpath, fullPage: true })
                delay(2000)

                reporter.addAttachment("after schedule access form", ss, "image/png");

                let expected_http_device_access_connection = "Welcome to nginx!";
                try {
                    const actual_http_device_connection = await newPage.waitForXPath('//h1[text()="Welcome to nginx!"]', { visible: true });
                    if (actual_http_device_connection) {
                        const elements = await newPage.evaluate(() => {
                            const xpath = '//h1[text()="Welcome to nginx!"]';
                            const nodeList = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                            const elements = [];
                            for (let i = 0; i < nodeList.snapshotLength; i++) {
                                elements.push(nodeList.snapshotItem(i).textContent);
                            }
                            return elements;
                        });
                        logger.info("actual_http_device_connection: " + elements);
                        if (elements[0] === expected_http_device_access_connection) {
                            reporter.startStep(`Expected HTTPS device connection status: ${elements[0]}. Actual HTTPS device connection status: ${expected_http_device_access_connection}`);
                            logger.info("Values are matched: test case passed!");
                            expect(elements[0]).toBe(expected_http_device_access_connection);
                            reporter.endStep();
                        } else {
                            logger.error("Values are not matched: test case failed!");
                        }
                    } else {
                        logger.info("New page did not load properly.");
                    }
                } catch (error) {
                    logger.error("Error occurred: " + error);
                }
                // Close the new page
                await newPage.close();

                // let elemXPath7 = leftpane.svg.myprofile;
                // await page.waitForXPath(elemXPath7, { timeout: 10000 })

                // await performAction("click", leftpane.svg.myprofile)
                // await delay(1000)
                // await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
                // await delay(5000)
            }
            else {
                logger.info("Http port not working!!!")
            }
            reporter.endStep();
        }
    })
}

export const whenICheckWeeklyTwiceSceduleaccessEnableUI = when => {
    when(/^I check weekly twice schedule access enable in UI$/, async (table) => {
        reporter.startStep('When I check weekly schedule access enable in UI');
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
            reporter.addAttachment("after schedule access form", screenshot, "image/png");

            let elemXPath4 = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath4, { timeout: 10000 })

            if (row.userid !== null) {
                //Verify the schedule access in UI
                await delay(2000)
                await performAction("click", leftpane.a.userdashboard),
                    await delay(5000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                logger.info("search user id...")
                performAction("click", schedule_access.span.userid_search),
                    await delay(5000)
                let ssscreenshot = await customScreenshot('userid.png', 1920, 1200)
                reporter.addAttachment("userid in UI", ssscreenshot, "image/png");
                await delay(3000)
                const sa_xpath_user_list_page_validation = schedule_access.button.user_list_sa_check;
                let isOptionEnabled = false;

                try {
                    await page.waitForXPath(sa_xpath_user_list_page_validation, { timeout: 5000 });
                    reporter.startStep('schedule access option is enabled with XPath');
                    isOptionEnabled = true;
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('schedule access option is disabled with XPath');
                    reporter.endStep();
                }

                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Schedule access option is enabled.")
                    reporter.startStep('Test case passed: Schedule access option is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Schedule access option is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Schedule access option is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    })
}

export const whenISearchWeeklyTwiceScheduleUserGetEnabled = when => {
    when(/^I search weekly twice schedule access with userid user get enabled state$/, async (table) => {
        reporter.startStep('When I search weekly twice schedule access with userid user get enabled state');

        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.userid !== null) {
                logger.info("inside if condition.....")
                const maxTime = 10 * 60 * 1000; // 8 minutes in milliseconds
                const refreshInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
                const startTime = Date.now(); // Store the start time
                async function performCommonActions() {
                    await delay(10000);
                    reporter.startStep('search userid status');
                    logger.info("before clicking")
                    await performAction("click", leftpane.a.dashboardicon),
                        logger.info("navigate to the dashborad")
                    await delay(5000)
                    await performAction("click", leftpane.a.userdashboard),
                        logger.info("navigate to the userdashboard")
                    await delay(5000)
                    await performAction("click", schedule_access.button.search_button),
                        logger.info("navigate to the use search arrow")
                    await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        logger.info("printing the text")
                    await delay(1000)
                    await performAction("click", schedule_access.span.userid_search)
                    logger.info("navigate to the search button")
                    await delay(5000)
                    reporter.endStep();
                }
                logger.info(Date.now())
                logger.info(startTime)
                logger.info(maxTime)
                while (Date.now() - startTime < maxTime) {
                    try {
                        // Perform common actions
                        await performCommonActions();

                        // Get the user status
                        const userStatus = await getPropertyValueByXpath(schedule_access.td.user_status, "textContent");

                        // Check user status
                        if (userStatus.trim() === "Enabled") {
                            // Test case passed within the time limit
                            logger.info("User status is Enabled within the time limit.");
                            break; // Exit the loop as the test case passed
                        } else if (userStatus.trim() === "Disabled") {
                            // Wait for refresh interval before next attempt
                            logger.info("User status is still Disabled. Waiting for 2 minutes before next attempt.");
                            await delay(refreshInterval);
                        } else {
                            // Handle unexpected user status
                            logger.error("Unexpected user status:", userStatus);
                            // Optionally, you may choose to break the loop or handle it differently
                        }
                    } catch (error) {
                        // Handle any errors occurred during common actions or fetching user status
                        logger.error("Error occurred:", error);
                        // Optionally, you may choose to break the loop or handle it differently
                    }
                }

                // Check if the loop exited due to time limit exceeded
                if (Date.now() - startTime >= maxTime) {
                    logger.error("Time limit exceeded and test case failed.");
                    // Optionally, you may choose to perform additional actions or handle it differently
                }

            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    });
};

export const andIVerifyWeeklyTwiceSAConfigAsConfigured = and => {
    and(/^Verify the weeklytwice schedule access config is applied as configured$/, async (table) => {
        reporter.startStep("And Verify the weeklytwice schedule access config is applied as configured");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])

            await performAction("click", leftpane.a.dashboardicon)
            let elemXPath = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath, { timeout: 10000 })
            await performAction("click", leftpane.a.userdashboard)
            await delay(2000)

            if (row.userid !== null) {
                reporter.startStep('And I select user');
                await delay(2000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                await performAction("click", schedule_access.span.userid_search),
                    await delay(2000)
            }
            else {
                logger.error("userid not found")
            }
            reporter.endStep();

            await delay(5000),
                await performAction("click", schedule_access.div.weekly_twice_user_account),
                await delay(2000)
            let elemXPath1 = schedule_access.span.arrow_mark;
            await page.waitForXPath(elemXPath1, { timeout: 10000 })

            performAction("click", schedule_access.span.arrow_mark),
                await delay(2000)
            performAction("click", schedule_access.div.configuration_edit),
                await delay(20000)

            // schedule_access.label.schedule_access_view
            let elemXPath2 = schedule_access.label.schedule_access_view;
            await page.waitForXPath(elemXPath2, { timeout: 10000 })

            if (row.timezone === "Asia/Kolkata") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(splitCurrentDate).toBe(checkCurrentDateXpath)
                if (splitCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${splitCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(spliTFutureDate).toBe(checkEndCurrentDateXpath)
                if (spliTFutureDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${spliTFutureDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }
                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.time_zone_text, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the start time
                let checkStartTimeXpath = await getPropertyValueByXpath(schedule_access.input.start_time, "defaultValue")
                expect(checkStartTimeXpath).toBe(formattedTimeOneMinuteLater)
                if (checkStartTimeXpath === formattedTimeOneMinuteLater) {
                    reporter.startStep(`Expected start time is : ${checkStartTimeXpath} and Actual start time is : ${formattedTimeOneMinuteLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //verify the end time
                let checkEndTimeXpath = await getPropertyValueByXpath(schedule_access.input.end_time, "defaultValue")
                expect(checkEndTimeXpath).toBe(formattedTimeFifteenMinutesLater)
                if (checkEndTimeXpath === formattedTimeFifteenMinutesLater) {
                    reporter.startStep(`Expected end time is : ${checkEndTimeXpath} and Actual end time is : ${formattedTimeFifteenMinutesLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_weekly_once, "textContent")
                let Repeatmode = row.Repeat.slice(0, 6)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(checkRepeatXpath)
                if (Repeatmode === checkRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${checkRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else if (row.timezone === "America/Chicago") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(splitCurrentDate).toBe(checkCurrentDateXpath)
                if (splitCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${splitCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(spliTFutureDate).toBe(checkEndCurrentDateXpath)
                if (spliTFutureDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${spliTFutureDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }

                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.timezone_diff_country, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)
                // timezone_diff_country

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_weekly_once, "textContent")
                let Repeatmode = row.Repeat.slice(0, 6)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(checkRepeatXpath)
                if (Repeatmode === checkRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${checkRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else {
                logger.error("Time Zone Not Found")
            }
        }
    })
}

export const andILogoutAdminUserAndLoginweeklyTwiceSAUser = and => {
    and(/^I Logout Admin user and Login with weeklytwice schedule access user$/, async (table) => {
        reporter.startStep("And I Logout Admin user and Login with weeklytwice schedule access user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])

            let elemXPath6 = leftpane.svg.myprofile;
            await page.waitForXPath(elemXPath6, { timeout: 10000 })

            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)

            if (row.userid !== null && row.password !== null) {
                var config
                config = await getEnvConfig()
                await goTo(config.otaURL)
                logger.info("Schedule access user details");
                await performAction("type", otalogin.details.username, "page", row.userid),
                    await delay(1000)
                await performAction("type", otalogin.details.password, "page", row.password),
                    await delay(1000)
                await performAction("click", schedule_access.label.password_view),
                    await delay(1000)
                await performAction("click", otalogin.details.login_button),
                    await delay(10000)
                await performAction("click", leftpane.a.userprofilepage),
                    await delay(5000)
                let screenshot = await customScreenshot('scheduleuser.png', 1920, 1200)
                reporter.addAttachment("schedule access user", screenshot, "image/png");
                await delay(2000)
                await performAction("click", schedule_access.span.user_profile_navigate)
                await delay(1000)
                // let actual_user_id = "saccesstesting";
                let user_profile_username = await getPropertyValueByXpath(schedule_access.div.weekly_twice_user_profile_name, "textContent");
                logger.info(user_profile_username)
                if (row.userid === user_profile_username) {
                    reporter.startStep(`Expected schedule USER ID : ${user_profile_username}. Actual schedule USER ID : ${row.userid}`);
                    logger.info("test case passed")
                    expect(row.userid).toBe(user_profile_username);
                    reporter.endStep();
                }
                else {
                    logger.error("test case failed : user id is not matched")
                }
            }
            else {
                logger.error("userid and password not found")
            }
            reporter.endStep();
        }
    });
}

export const thenVerifyHttpsDeviceAccessWeeklyTwiceSA = then => {
    then(/^Verify the http device access in weeklytwice schedule acess user$/, async (table) => {
        reporter.startStep("Then Verify the http device access in weeklytwice schedule acess user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.type == "http") {
                logger.info("enter in condition...")
                let http_xpathVariable = schedule_access.span.http_access_device;
                let device123 = await page.$x(http_xpathVariable);
                logger.info("device123 ---- >" + device123);
                await device123[0].click();
                logger.info("after clicking ....")
                // await page.waitForTimeout(10000); // Use waitForTimeout to wait for 10 seconds
                await new Promise(resolve => setTimeout(resolve, 10000));

                // Get all pages after opening a new tab/window
                let pages = await browser.pages();
                let newPage = pages[pages.length - 1];
                logger.info("HTTP part");
                logger.info("New page URL: " + newPage.url());

                delay(2000)
                //let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
                let newpath = await pathJoin("newpage.png")
                let ss = await newPage.screenshot({ path: newpath, fullPage: true })
                delay(2000)

                reporter.addAttachment("after schedule access form", ss, "image/png");

                let expected_http_device_access_connection = "Welcome to nginx!";
                try {
                    const actual_http_device_connection = await newPage.waitForXPath('//h1[text()="Welcome to nginx!"]', { visible: true });
                    if (actual_http_device_connection) {
                        const elements = await newPage.evaluate(() => {
                            const xpath = '//h1[text()="Welcome to nginx!"]';
                            const nodeList = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                            const elements = [];
                            for (let i = 0; i < nodeList.snapshotLength; i++) {
                                elements.push(nodeList.snapshotItem(i).textContent);
                            }
                            return elements;
                        });
                        logger.info("actual_http_device_connection: " + elements);
                        if (elements[0] === expected_http_device_access_connection) {
                            reporter.startStep(`Expected HTTPS device connection status: ${elements[0]}. Actual HTTPS device connection status: ${expected_http_device_access_connection}`);
                            logger.info("Values are matched: test case passed!");
                            expect(elements[0]).toBe(expected_http_device_access_connection);
                            reporter.endStep();
                        } else {
                            logger.error("Values are not matched: test case failed!");
                        }
                    } else {
                        logger.info("New page did not load properly.");
                    }
                } catch (error) {
                    logger.error("Error occurred: " + error);
                }
                // Close the new page
                await newPage.close();
                // let elemXPath7 = leftpane.svg.myprofile;
                // await page.waitForXPath(elemXPath7, { timeout: 10000 })

                // await performAction("click", leftpane.svg.myprofile)
                // await delay(1000)
                // await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
                // await delay(5000)
            }
            else {
                logger.info("Http port not working!!!")
            }
            reporter.endStep();
        }
    })
}

export const whenICheckWeeklyAllDaysSceduleaccessEnableUI = when => {
    when(/^I check weekly all days schedule access enable in UI$/, async (table) => {
        reporter.startStep('When I check weekly all days schedule access enable in UI');
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
            reporter.addAttachment("after schedule access form", screenshot, "image/png");

            let elemXPath4 = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath4, { timeout: 10000 })

            if (row.userid !== null) {
                //Verify the schedule access in UI
                await delay(2000)
                await performAction("click", leftpane.a.userdashboard),
                    await delay(5000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                logger.info("search user id...")
                performAction("click", schedule_access.span.userid_search),
                    await delay(5000)
                let ssscreenshot = await customScreenshot('userid.png', 1920, 1200)
                reporter.addAttachment("userid in UI", ssscreenshot, "image/png");
                await delay(3000)
                const sa_xpath_user_list_page_validation = schedule_access.button.user_list_sa_check;
                let isOptionEnabled = false;

                try {
                    await page.waitForXPath(sa_xpath_user_list_page_validation, { timeout: 5000 });
                    reporter.startStep('schedule access option is enabled with XPath');
                    isOptionEnabled = true;
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('schedule access option is disabled with XPath');
                    reporter.endStep();
                }

                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Schedule access option is enabled.")
                    reporter.startStep('Test case passed: Schedule access option is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Schedule access option is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Schedule access option is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    })
}

export const whenISearchWeeklyAllDaysScheduleUserGetEnabled = when => {
    when(/^I search weekly all days schedule access with userid user get enabled state$/, async (table) => {
        reporter.startStep('When I search weekly all days schedule access with userid user get enabled state');

        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.userid !== null) {
                logger.info("inside if condition.....")
                const maxTime = 10 * 60 * 1000; // 8 minutes in milliseconds
                const refreshInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
                const startTime = Date.now(); // Store the start time
                async function performCommonActions() {
                    await delay(10000);
                    reporter.startStep('search userid status');
                    logger.info("before clicking")
                    await performAction("click", leftpane.a.dashboardicon),
                        logger.info("navigate to the dashborad")
                    await delay(5000)
                    await performAction("click", leftpane.a.userdashboard),
                        logger.info("navigate to the userdashboard")
                    await delay(5000)
                    await performAction("click", schedule_access.button.search_button),
                        logger.info("navigate to the use search arrow")
                    await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        logger.info("printing the text")
                    await delay(1000)
                    await performAction("click", schedule_access.span.userid_search)
                    logger.info("navigate to the search button")
                    await delay(5000)
                    reporter.endStep();
                }
                logger.info(Date.now())
                logger.info(startTime)
                logger.info(maxTime)
                while (Date.now() - startTime < maxTime) {
                    try {
                        // Perform common actions
                        await performCommonActions();

                        // Get the user status
                        const userStatus = await getPropertyValueByXpath(schedule_access.td.user_status, "textContent");

                        // Check user status
                        if (userStatus.trim() === "Enabled") {
                            // Test case passed within the time limit
                            logger.info("User status is Enabled within the time limit.");
                            break; // Exit the loop as the test case passed
                        } else if (userStatus.trim() === "Disabled") {
                            // Wait for refresh interval before next attempt
                            logger.info("User status is still Disabled. Waiting for 2 minutes before next attempt.");
                            await delay(refreshInterval);
                        } else {
                            // Handle unexpected user status
                            logger.error("Unexpected user status:", userStatus);
                            // Optionally, you may choose to break the loop or handle it differently
                        }
                    } catch (error) {
                        // Handle any errors occurred during common actions or fetching user status
                        logger.error("Error occurred:", error);
                        // Optionally, you may choose to break the loop or handle it differently
                    }
                }

                // Check if the loop exited due to time limit exceeded
                if (Date.now() - startTime >= maxTime) {
                    logger.error("Time limit exceeded and test case failed.");
                    // Optionally, you may choose to perform additional actions or handle it differently
                }

            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    });
};

export const andIVerifyWeeklyAllDaysSAConfigAsConfigured = and => {
    and(/^Verify the weeklyalldays schedule access config is applied as configured$/, async (table) => {
        reporter.startStep("And Verify the weeklyalldays schedule access config is applied as configured");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])

            await performAction("click", leftpane.a.dashboardicon)
            let elemXPath = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath, { timeout: 10000 })
            await performAction("click", leftpane.a.userdashboard)
            await delay(2000)

            if (row.userid !== null) {
                reporter.startStep('And I select user');
                await delay(2000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                await performAction("click", schedule_access.span.userid_search),
                    await delay(2000)
            }
            else {
                logger.error("userid not found")
            }
            reporter.endStep();

            await delay(5000),
                await performAction("click", schedule_access.div.weekly_all_days_user_account),
                await delay(2000)
            let elemXPath1 = schedule_access.span.arrow_mark;
            await page.waitForXPath(elemXPath1, { timeout: 10000 })

            performAction("click", schedule_access.span.arrow_mark),
                await delay(2000)
            performAction("click", schedule_access.div.configuration_edit),
                await delay(20000)

            // schedule_access.label.schedule_access_view
            let elemXPath2 = schedule_access.label.schedule_access_view;
            await page.waitForXPath(elemXPath2, { timeout: 10000 })

            if (row.timezone === "Asia/Kolkata") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(splitCurrentDate).toBe(checkCurrentDateXpath)
                if (splitCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${splitCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(spliTFutureDate).toBe(checkEndCurrentDateXpath)
                if (spliTFutureDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${spliTFutureDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }
                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.time_zone_text, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the start time
                let checkStartTimeXpath = await getPropertyValueByXpath(schedule_access.input.start_time, "defaultValue")
                expect(checkStartTimeXpath).toBe(formattedTimeOneMinuteLater)
                if (checkStartTimeXpath === formattedTimeOneMinuteLater) {
                    reporter.startStep(`Expected start time is : ${checkStartTimeXpath} and Actual start time is : ${formattedTimeOneMinuteLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //verify the end time
                let checkEndTimeXpath = await getPropertyValueByXpath(schedule_access.input.end_time, "defaultValue")
                expect(checkEndTimeXpath).toBe(formattedTimeFifteenMinutesLater)
                if (checkEndTimeXpath === formattedTimeFifteenMinutesLater) {
                    reporter.startStep(`Expected end time is : ${checkEndTimeXpath} and Actual end time is : ${formattedTimeFifteenMinutesLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_weekly_once, "textContent")
                let Repeatmode = row.Repeat.slice(0, 6)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(checkRepeatXpath)
                if (Repeatmode === checkRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${checkRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else if (row.timezone === "America/Chicago") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(splitCurrentDate).toBe(checkCurrentDateXpath)
                if (splitCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${splitCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(spliTFutureDate).toBe(checkEndCurrentDateXpath)
                if (spliTFutureDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${spliTFutureDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }

                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.timezone_diff_country, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)
                // timezone_diff_country

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_weekly_once, "textContent")
                let Repeatmode = row.Repeat.slice(0, 6)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(checkRepeatXpath)
                if (Repeatmode === checkRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${checkRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else {
                logger.error("Time Zone Not Found")
            }
        }
    })
}

export const andILogoutAdminUserAndLoginWeeklyAllDaysSAUser = and => {
    and(/^I Logout Admin user and Login with weeklyalldays schedule access user$/, async (table) => {
        reporter.startStep("And I Logout Admin user and Login with weeklyalldays schedule access user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])

            let elemXPath6 = leftpane.svg.myprofile;
            await page.waitForXPath(elemXPath6, { timeout: 10000 })

            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)

            if (row.userid !== null && row.password !== null) {
                var config
                config = await getEnvConfig()
                await goTo(config.otaURL)
                logger.info("Schedule access user details");
                await performAction("type", otalogin.details.username, "page", row.userid),
                    await delay(1000)
                await performAction("type", otalogin.details.password, "page", row.password),
                    await delay(1000)
                await performAction("click", schedule_access.label.password_view),
                    await delay(1000)
                await performAction("click", otalogin.details.login_button),
                    await delay(20000)
                await performAction("click", leftpane.a.userprofilepage),
                    await delay(5000)
                let screenshot = await customScreenshot('scheduleuser.png', 1920, 1200)
                reporter.addAttachment("schedule access user", screenshot, "image/png");
                await delay(2000)
                await performAction("click", schedule_access.span.user_profile_navigate)
                await delay(1000)
                // let actual_user_id = "saccesstesting";
                let user_profile_username = await getPropertyValueByXpath(schedule_access.div.weekly_all_days_user_profile_name, "textContent");
                logger.info(user_profile_username)
                if (row.userid === user_profile_username) {
                    reporter.startStep(`Expected schedule USER ID : ${user_profile_username}. Actual schedule USER ID : ${row.userid}`);
                    logger.info("test case passed")
                    expect(row.userid).toBe(user_profile_username);
                    reporter.endStep();
                }
                else {
                    logger.error("test case failed : user id is not matched")
                }
            }
            else {
                logger.error("userid and password not found")
            }
            reporter.endStep();
        }
    });
}

export const thenVerifyHttpsDeviceAccessWeeklyAllDaysSA = then => {
    then(/^Verify the http device access in weeklyalldays schedule acess user$/, async (table) => {
        reporter.startStep("Then Verify the http device access in weeklyalldays schedule acess user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.type == "http") {
                logger.info("enter in condition...")
                let http_xpathVariable = schedule_access.span.http_access_device;
                let device123 = await page.$x(http_xpathVariable);
                logger.info("device123 ---- >" + device123);
                await device123[0].click();
                logger.info("after clicking ....")
                // await page.waitForTimeout(10000); // Use waitForTimeout to wait for 10 seconds
                await new Promise(resolve => setTimeout(resolve, 10000));






                // Get all pages after opening a new tab/window
                let pages = await browser.pages();
                let newPage = pages[pages.length - 1];
                logger.info("HTTP part");
                logger.info("New page URL: " + newPage.url());

                delay(2000)
                //let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
                let newpath = await pathJoin("newpage.png")
                let ss = await newPage.screenshot({ path: newpath, fullPage: true })
                delay(2000)

                reporter.addAttachment("after schedule access form", ss, "image/png");

                let expected_http_device_access_connection = "Welcome to nginx!";
                try {
                    const actual_http_device_connection = await newPage.waitForXPath('//h1[text()="Welcome to nginx!"]', { visible: true });
                    if (actual_http_device_connection) {
                        const elements = await newPage.evaluate(() => {
                            const xpath = '//h1[text()="Welcome to nginx!"]';
                            const nodeList = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                            const elements = [];
                            for (let i = 0; i < nodeList.snapshotLength; i++) {
                                elements.push(nodeList.snapshotItem(i).textContent);
                            }
                            return elements;
                        });
                        logger.info("actual_http_device_connection: " + elements);
                        if (elements[0] === expected_http_device_access_connection) {
                            reporter.startStep(`Expected HTTPS device connection status: ${elements[0]}. Actual HTTPS device connection status: ${expected_http_device_access_connection}`);
                            logger.info("Values are matched: test case passed!");
                            expect(elements[0]).toBe(expected_http_device_access_connection);
                            reporter.endStep();
                        } else {
                            logger.error("Values are not matched: test case failed!");
                        }
                    } else {
                        logger.info("New page did not load properly.");
                    }
                } catch (error) {
                    logger.error("Error occurred: " + error);
                }
                // Close the new page
                await newPage.close();
                // let elemXPath7 = leftpane.svg.myprofile;
                // await page.waitForXPath(elemXPath7, { timeout: 10000 })

                // await performAction("click", leftpane.svg.myprofile)
                // await delay(1000)
                // await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
                // await delay(5000)
            }
            else {
                logger.info("Http port not working!!!")
            }
            reporter.endStep();
        }
    })
}

export const whenICheckMonthlyOnceSceduleaccessEnableUI = when => {
    when(/^I check Monthly once schedule access enable in UI$/, async (table) => {
        reporter.startStep('When I check Monthly once schedule access enable in UI');
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
            reporter.addAttachment("after schedule access form", screenshot, "image/png");

            let elemXPath4 = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath4, { timeout: 10000 })

            if (row.userid === "smonthlyonce") {
                //Verify the schedule access in UI
                await delay(2000)
                await performAction("click", leftpane.a.userdashboard),
                    await delay(5000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                logger.info("search user id...")
                performAction("click", schedule_access.span.userid_search),
                    await delay(5000)
                let ssscreenshot = await customScreenshot('userid.png', 1920, 1200)
                reporter.addAttachment("userid in UI", ssscreenshot, "image/png");
                await delay(3000)
                const sa_xpath_user_list_page_validation = schedule_access.button.user_list_sa_check;
                let isOptionEnabled = false;

                try {
                    await page.waitForXPath(sa_xpath_user_list_page_validation, { timeout: 5000 });
                    reporter.startStep('schedule access option is enabled with XPath');
                    isOptionEnabled = true;
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('schedule access option is disabled with XPath');
                    reporter.endStep();
                }

                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Schedule access option is enabled.")
                    reporter.startStep('Test case passed: Schedule access option is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Schedule access option is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Schedule access option is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    })
}

export const whenISearchMonthlyOnceScheduleUserGetEnabled = when => {
    when(/^I search Monthly once schedule access with userid user get enabled state$/, async (table) => {
        reporter.startStep('When I search Monthly once schedule access with userid user get enabled state');

        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.userid === "smonthlyonce") {
                logger.info("inside if condition.....")
                const maxTime = 10 * 60 * 1000; // 8 minutes in milliseconds
                const refreshInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
                const startTime = Date.now(); // Store the start time
                async function performCommonActions() {
                    await delay(10000);
                    reporter.startStep('search userid status');
                    logger.info("before clicking")
                    await performAction("click", leftpane.a.dashboardicon),
                        logger.info("navigate to the dashborad")
                    await delay(5000)
                    await performAction("click", leftpane.a.userdashboard),
                        logger.info("navigate to the userdashboard")
                    await delay(5000)
                    await performAction("click", schedule_access.button.search_button),
                        logger.info("navigate to the use search arrow")
                    await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        logger.info("printing the text")
                    await delay(1000)
                    await performAction("click", schedule_access.span.userid_search)
                    logger.info("navigate to the search button")
                    await delay(5000)
                    reporter.endStep();
                }
                logger.info(Date.now())
                logger.info(startTime)
                logger.info(maxTime)
                while (Date.now() - startTime < maxTime) {
                    try {
                        // Perform common actions
                        await performCommonActions();

                        // Get the user status
                        const userStatus = await getPropertyValueByXpath(schedule_access.td.user_status, "textContent");

                        // Check user status
                        if (userStatus.trim() === "Enabled") {
                            // Test case passed within the time limit
                            logger.info("User status is Enabled within the time limit.");
                            break; // Exit the loop as the test case passed
                        } else if (userStatus.trim() === "Disabled") {
                            // Wait for refresh interval before next attempt
                            logger.info("User status is still Disabled. Waiting for 2 minutes before next attempt.");
                            await delay(refreshInterval);
                        } else {
                            // Handle unexpected user status
                            logger.error("Unexpected user status:", userStatus);
                            // Optionally, you may choose to break the loop or handle it differently
                        }
                    } catch (error) {
                        // Handle any errors occurred during common actions or fetching user status
                        logger.error("Error occurred:", error);
                        // Optionally, you may choose to break the loop or handle it differently
                    }
                }

                // Check if the loop exited due to time limit exceeded
                if (Date.now() - startTime >= maxTime) {
                    logger.error("Time limit exceeded and test case failed.");
                    // Optionally, you may choose to perform additional actions or handle it differently
                }

            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    });
};

export const andIVerifyMonthlyOnceSAConfigAsConfigured = and => {
    and(/^Verify the Monthlyonce schedule access config is applied as configured$/, async (table) => {
        reporter.startStep("And Verify the Monthlyonce schedule access config is applied as configured");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            await performAction("click", leftpane.a.dashboardicon)
            let elemXPath = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath, { timeout: 10000 })
            await performAction("click", leftpane.a.userdashboard)
            await delay(2000)

            if (row.userid !== null) {
                reporter.startStep('And I select user');
                await delay(2000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                await performAction("click", schedule_access.span.userid_search),
                    await delay(2000)
            }
            else {
                logger.error("userid not found")
            }
            reporter.endStep();
            await delay(5000),
                await performAction("click", schedule_access.div.monthly_once_user_account),
                await delay(2000)
            let elemXPath1 = schedule_access.span.arrow_mark;
            await page.waitForXPath(elemXPath1, { timeout: 10000 })

            performAction("click", schedule_access.span.arrow_mark),
                await delay(2000)
            performAction("click", schedule_access.div.configuration_edit),
                await delay(20000)

            // schedule_access.label.schedule_access_view
            let elemXPath2 = schedule_access.label.schedule_access_view;
            await page.waitForXPath(elemXPath2, { timeout: 10000 })

            if (row.timezone === "Asia/Kolkata") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(formattedTodayCurrentDate).toBe(checkCurrentDateXpath)
                if (formattedTodayCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${formattedTodayCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(formattedEndOfMonthDate).toBe(checkEndCurrentDateXpath)
                if (formattedEndOfMonthDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${formattedEndOfMonthDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }
                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.time_zone_text, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the start time
                let checkStartTimeXpath = await getPropertyValueByXpath(schedule_access.input.start_time, "defaultValue")
                expect(checkStartTimeXpath).toBe(formattedTimeOneMinuteLater)
                if (checkStartTimeXpath === formattedTimeOneMinuteLater) {
                    reporter.startStep(`Expected start time is : ${checkStartTimeXpath} and Actual start time is : ${formattedTimeOneMinuteLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //verify the end time
                let checkEndTimeXpath = await getPropertyValueByXpath(schedule_access.input.end_time, "defaultValue")
                expect(checkEndTimeXpath).toBe(formattedTimeFifteenMinutesLater)
                if (checkEndTimeXpath === formattedTimeFifteenMinutesLater) {
                    reporter.startStep(`Expected end time is : ${checkEndTimeXpath} and Actual end time is : ${formattedTimeFifteenMinutesLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_monthly_once, "textContent")
                let splitCheckRepeatXpath = checkRepeatXpath.slice(0, 5)
                logger.info(splitCheckRepeatXpath)
                let Repeatmode = row.Repeat.slice(0, 5)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(splitCheckRepeatXpath)
                if (Repeatmode === splitCheckRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${splitCheckRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                //Verify the selected date
                let todaydate_schedule_access_xpath = await getPropertyValueByXpath(schedule_access.span.on_days_configured, "innerText");
                logger.info(todaydate_schedule_access_xpath)
                // Get current date
                let currentDate = new Date();
                // Format the dates
                let year = currentDate.getFullYear();
                let month = currentDate.getMonth() + 1; // Adding 1 because months are zero-based
                let day = currentDate.getDate();
                // Construct the formatted date string
                let formattedCurrentDate = `${year}-${month}-${day}`;
                logger.info("Current Date:", formattedCurrentDate);
                // Extract only the day
                let formattedOnlYTodayDate = formattedCurrentDate.split("-")[2];
                logger.info(formattedOnlYTodayDate)
                expect(formattedOnlYTodayDate).toBe(todaydate_schedule_access_xpath)
                if (formattedOnlYTodayDate === todaydate_schedule_access_xpath) {
                    reporter.startStep(`Expected Date is : '${formattedOnlYTodayDate}' and Actual Date is : '${todaydate_schedule_access_xpath}' `)
                    logger.info("Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Test case Failed")
                }

                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else if (row.timezone === "America/Chicago") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(formattedTodayCurrentDate).toBe(checkCurrentDateXpath)
                if (formattedTodayCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${formattedTodayCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(formattedEndOfMonthDate).toBe(checkEndCurrentDateXpath)
                if (formattedEndOfMonthDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${formattedEndOfMonthDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }
                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.timezone_diff_country, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)
                // timezone_diff_country

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_monthly_once, "textContent")
                let splitCheckRepeatXpath = checkRepeatXpath.slice(0, 5)
                logger.info(splitCheckRepeatXpath)
                let Repeatmode = row.Repeat.slice(0, 5)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(splitCheckRepeatXpath)
                if (Repeatmode === splitCheckRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${splitCheckRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                //Verify the selected date
                let todaydate_schedule_access_xpath = await getPropertyValueByXpath(schedule_access.span.on_days_configured, "innerText");
                logger.info(todaydate_schedule_access_xpath)
                // Get current date
                let currentDate = new Date();
                // Format the dates
                let year = currentDate.getFullYear();
                let month = currentDate.getMonth() + 1; // Adding 1 because months are zero-based
                let day = currentDate.getDate();
                // Construct the formatted date string
                let formattedCurrentDate = `${year}-${month}-${day}`;
                console.log("Current Date:", formattedCurrentDate);
                // Extract only the day
                let formattedOnlYTodayDate = formattedCurrentDate.split("-")[2];
                console.log(formattedOnlYTodayDate)
                expect(formattedOnlYTodayDate).toBe(todaydate_schedule_access_xpath)
                if (formattedOnlYTodayDate === todaydate_schedule_access_xpath) {
                    reporter.startStep(`Expected Date is : '${formattedOnlYTodayDate}' and Actual Date is : '${todaydate_schedule_access_xpath}' `)
                    logger.info("Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Test case Failed")
                }

                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();



            }
            else {
                logger.info("timezone Not Found")
            }
        }
    });
};

export const andILogoutAdminUserAndLoginMonthlyOnceSAUser = and => {
    and(/^I Logout Admin user and Login with Monthlyonce schedule access user$/, async (table) => {
        reporter.startStep("And I Logout Admin user and Login with Monthlyonce schedule access user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])

            let elemXPath6 = leftpane.svg.myprofile;
            await page.waitForXPath(elemXPath6, { timeout: 10000 })

            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)

            if (row.userid === "smonthlyonce" && row.password === "Kovvuri@21") {
                var config
                config = await getEnvConfig()
                await goTo(config.otaURL)
                logger.info("Schedule access user details");
                await performAction("type", otalogin.details.username, "page", row.userid),
                    await delay(1000)
                await performAction("type", otalogin.details.password, "page", row.password),
                    await delay(1000)
                await performAction("click", schedule_access.label.password_view),
                    await delay(1000)
                await performAction("click", otalogin.details.login_button),
                    await delay(20000)
                await performAction("click", leftpane.a.userprofilepage),
                    await delay(5000)
                let screenshot = await customScreenshot('scheduleuser.png', 1920, 1200)
                reporter.addAttachment("schedule access user", screenshot, "image/png");
                await delay(2000)
                await performAction("click", schedule_access.span.user_profile_navigate)
                await delay(1000)
                // let actual_user_id = "saccesstesting";
                let user_profile_username = await getPropertyValueByXpath(schedule_access.div.monthly_once_profile_name, "textContent");
                logger.info(user_profile_username)
                if (row.userid === user_profile_username) {
                    reporter.startStep(`Expected schedule USER ID : ${user_profile_username}. Actual schedule USER ID : ${row.userid}`);
                    logger.info("test case passed")
                    expect(row.userid).toBe(user_profile_username);
                    reporter.endStep();
                }
                else {
                    logger.error("test case failed : user id is not matched")
                }
            }
            else {
                logger.error("userid and password not found")
            }
            reporter.endStep();
        }
    });
}

export const thenVerifyHttpsDeviceAccessMonthlyOnceSA = then => {
    then(/^Verify the http device access in Monthlyonce schedule acess user$/, async (table) => {
        reporter.startStep("Then Verify the http device access in Monthlyonce schedule acess user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.type == "http") {
                logger.info("enter in condition...")
                let http_xpathVariable = schedule_access.span.http_access_device;
                let device123 = await page.$x(http_xpathVariable);
                logger.info("device123 ---- >" + device123);
                await device123[0].click();
                logger.info("after clicking ....")
                // await page.waitForTimeout(10000); // Use waitForTimeout to wait for 10 seconds
                await new Promise(resolve => setTimeout(resolve, 10000));

                // Get all pages after opening a new tab/window
                let pages = await browser.pages();
                let newPage = pages[pages.length - 1];
                logger.info("HTTP part");
                logger.info("New page URL: " + newPage.url());

                delay(2000)
                //let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
                let newpath = await pathJoin("newpage.png")
                let ss = await newPage.screenshot({ path: newpath, fullPage: true })
                delay(2000)

                reporter.addAttachment("after schedule access form", ss, "image/png");

                let expected_http_device_access_connection = "Welcome to nginx!";
                try {
                    const actual_http_device_connection = await newPage.waitForXPath('//h1[text()="Welcome to nginx!"]', { visible: true });
                    if (actual_http_device_connection) {
                        const elements = await newPage.evaluate(() => {
                            const xpath = '//h1[text()="Welcome to nginx!"]';
                            const nodeList = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                            const elements = [];
                            for (let i = 0; i < nodeList.snapshotLength; i++) {
                                elements.push(nodeList.snapshotItem(i).textContent);
                            }
                            return elements;
                        });
                        logger.info("actual_http_device_connection: " + elements);
                        if (elements[0] === expected_http_device_access_connection) {
                            reporter.startStep(`Expected HTTPS device connection status: ${elements[0]}. Actual HTTPS device connection status: ${expected_http_device_access_connection}`);
                            logger.info("Values are matched: test case passed!");
                            expect(elements[0]).toBe(expected_http_device_access_connection);
                            reporter.endStep();
                        } else {
                            logger.error("Values are not matched: test case failed!");
                        }
                    } else {
                        logger.info("New page did not load properly.");
                    }
                } catch (error) {
                    logger.error("Error occurred: " + error);
                }
                // Close the new page
                await newPage.close();
                // let elemXPath7 = leftpane.svg.myprofile;
                // await page.waitForXPath(elemXPath7, { timeout: 10000 })

                // await performAction("click", leftpane.svg.myprofile)
                // await delay(1000)
                // await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
                // await delay(5000)
            }
            else {
                logger.info("Http port not working!!!")
            }
            reporter.endStep();
        }
    })
}

export const whenICheckMonthlyOnWeekDaySceduleaccessEnableUI = when => {
    when(/^I check Monthly On Week Day schedule access enable in UI$/, async (table) => {
        reporter.startStep('When I check Monthly On Week Day schedule access enable in UI');
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
            reporter.addAttachment("after schedule access form", screenshot, "image/png");

            let elemXPath4 = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath4, { timeout: 10000 })

            if (row.userid !== null) {
                //Verify the schedule access in UI
                await delay(2000)
                await performAction("click", leftpane.a.userdashboard),
                    await delay(5000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                logger.info("search user id...")
                performAction("click", schedule_access.span.userid_search),
                    await delay(5000)
                let ssscreenshot = await customScreenshot('userid.png', 1920, 1200)
                reporter.addAttachment("userid in UI", ssscreenshot, "image/png");
                await delay(3000)
                const sa_xpath_user_list_page_validation = schedule_access.button.user_list_sa_check;
                let isOptionEnabled = false;

                try {
                    await page.waitForXPath(sa_xpath_user_list_page_validation, { timeout: 5000 });
                    reporter.startStep('schedule access option is enabled with XPath');
                    isOptionEnabled = true;
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('schedule access option is disabled with XPath');
                    reporter.endStep();
                }

                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Schedule access option is enabled.")
                    reporter.startStep('Test case passed: Schedule access option is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Schedule access option is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Schedule access option is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    })
}

export const whenISearchMonthlyOnWeekDayScheduleUserGetEnabled = when => {
    when(/^I search Monthly On Week Day schedule access with userid user get enabled state$/, async (table) => {
        reporter.startStep('When I search Monthly On Week Day schedule access with userid user get enabled state');

        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.userid !== null) {
                logger.info("inside if condition.....")
                const maxTime = 10 * 60 * 1000; // 8 minutes in milliseconds
                const refreshInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
                const startTime = Date.now(); // Store the start time
                async function performCommonActions() {
                    await delay(10000);
                    reporter.startStep('search userid status');
                    logger.info("before clicking")
                    await performAction("click", leftpane.a.dashboardicon),
                        logger.info("navigate to the dashborad")
                    await delay(5000)
                    await performAction("click", leftpane.a.userdashboard),
                        logger.info("navigate to the userdashboard")
                    await delay(5000)
                    await performAction("click", schedule_access.button.search_button),
                        logger.info("navigate to the use search arrow")
                    await delay(2000)
                    await performAction("type", schedule_access.input.user_id, "page", row.userid),
                        logger.info("printing the text")
                    await delay(1000)
                    await performAction("click", schedule_access.span.userid_search)
                    logger.info("navigate to the search button")
                    await delay(5000)
                    reporter.endStep();
                }
                logger.info(Date.now())
                logger.info(startTime)
                logger.info(maxTime)
                while (Date.now() - startTime < maxTime) {
                    try {
                        // Perform common actions
                        await performCommonActions();

                        // Get the user status
                        const userStatus = await getPropertyValueByXpath(schedule_access.td.user_status, "textContent");

                        // Check user status
                        if (userStatus.trim() === "Enabled") {
                            // Test case passed within the time limit
                            logger.info("User status is Enabled within the time limit.");
                            break; // Exit the loop as the test case passed
                        } else if (userStatus.trim() === "Disabled") {
                            // Wait for refresh interval before next attempt
                            logger.info("User status is still Disabled. Waiting for 2 minutes before next attempt.");
                            await delay(refreshInterval);
                        } else {
                            // Handle unexpected user status
                            logger.error("Unexpected user status:", userStatus);
                            // Optionally, you may choose to break the loop or handle it differently
                        }
                    } catch (error) {
                        // Handle any errors occurred during common actions or fetching user status
                        logger.error("Error occurred:", error);
                        // Optionally, you may choose to break the loop or handle it differently
                    }
                }

                // Check if the loop exited due to time limit exceeded
                if (Date.now() - startTime >= maxTime) {
                    logger.error("Time limit exceeded and test case failed.");
                    // Optionally, you may choose to perform additional actions or handle it differently
                }

            } else {
                logger.error("userid not found");
            }
            reporter.endStep();
        }
    });
};

export const andIVerifyMonthlyOnWeekDaySAConfigAsConfigured = and => {
    and(/^Verify the Monthly MonthlyOnWeekDay schedule access config is applied as configured$/, async (table) => {
        reporter.startStep("And Verify the Monthly MonthlyOnWeekDay schedule access config is applied as configured");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            await performAction("click", leftpane.a.dashboardicon)
            let elemXPath = leftpane.a.userdashboard;
            await page.waitForXPath(elemXPath, { timeout: 10000 })
            await performAction("click", leftpane.a.userdashboard)
            await delay(2000)

            if (row.userid !== null) {
                reporter.startStep('And I select user');
                await delay(2000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                await performAction("click", schedule_access.span.userid_search),
                    await delay(2000)
            }
            else {
                logger.error("userid not found")
            }
            reporter.endStep();

            await delay(5000),
                await performAction("click", schedule_access.div.monthly_on_day_week),
                await delay(2000)
            let elemXPath1 = schedule_access.span.arrow_mark;
            await page.waitForXPath(elemXPath1, { timeout: 10000 })

            performAction("click", schedule_access.span.arrow_mark),
                await delay(2000)
            performAction("click", schedule_access.div.configuration_edit),
                await delay(20000)

            // schedule_access.label.schedule_access_view
            let elemXPath2 = schedule_access.label.schedule_access_view;
            await page.waitForXPath(elemXPath2, { timeout: 10000 })

            if (row.timezone === "Asia/Kolkata") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(formattedTodayCurrentDate).toBe(checkCurrentDateXpath)
                if (formattedTodayCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${formattedTodayCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(formattedEndOfMonthDate).toBe(checkEndCurrentDateXpath)
                if (formattedEndOfMonthDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${formattedEndOfMonthDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }
                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.time_zone_text, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the start time
                let checkStartTimeXpath = await getPropertyValueByXpath(schedule_access.input.start_time, "defaultValue")
                expect(checkStartTimeXpath).toBe(formattedTimeOneMinuteLater)
                if (checkStartTimeXpath === formattedTimeOneMinuteLater) {
                    reporter.startStep(`Expected start time is : ${checkStartTimeXpath} and Actual start time is : ${formattedTimeOneMinuteLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                //verify the end time
                let checkEndTimeXpath = await getPropertyValueByXpath(schedule_access.input.end_time, "defaultValue")
                expect(checkEndTimeXpath).toBe(formattedTimeFifteenMinutesLater)
                if (checkEndTimeXpath === formattedTimeFifteenMinutesLater) {
                    reporter.startStep(`Expected end time is : ${checkEndTimeXpath} and Actual end time is : ${formattedTimeFifteenMinutesLater}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }
                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_monthly_once, "textContent")
                let splitCheckRepeatXpath = checkRepeatXpath.slice(0, 5)
                logger.info(splitCheckRepeatXpath)
                let Repeatmode = row.Repeat.slice(0, 5)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(splitCheckRepeatXpath)
                if (Repeatmode === splitCheckRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${splitCheckRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                //Verify the week on the month
                let checkWeekPositionXpath = await getPropertyValueByXpath(schedule_access.span.week_position, "textContent");
                logger.info(checkWeekPositionXpath)

                expect(suffix).toBe(checkWeekPositionXpath)
                if (suffix === checkWeekPositionXpath) {
                    reporter.startStep(`Expected Date is : '${suffix}' and Actual Date is : '${checkWeekPositionXpath}' `)
                    logger.info("Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Test case Failed")
                }


                let checkOnTheDayXpath = await getPropertyValueByXpath(schedule_access.span.on_the_day_xpath, "textContent");
                logger.info(checkOnTheDayXpath)

                expect(dayName).toBe(checkOnTheDayXpath)
                if (dayName === checkOnTheDayXpath) {
                    reporter.startStep(`Expected Date is : '${dayName}' and Actual Date is : '${checkOnTheDayXpath}' `)
                    logger.info("Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values not matched: Test case failed")
                }



                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else if (row.timezone === "America/Chicago") {
                //Verify the startdate 
                let checkCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.start_date, "defaultValue");

                expect(formattedTodayCurrentDate).toBe(checkCurrentDateXpath)
                if (formattedTodayCurrentDate === checkCurrentDateXpath) {
                    reporter.startStep(`Expected current date is : ${formattedTodayCurrentDate} and Actual date is : ${checkCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case failed")
                }
                //verify the end date
                let checkEndCurrentDateXpath = await getPropertyValueByXpath(schedule_access.input.end_date, "defaultValue");

                expect(formattedEndOfMonthDate).toBe(checkEndCurrentDateXpath)
                if (formattedEndOfMonthDate === checkEndCurrentDateXpath) {
                    reporter.startStep(`Expected end date is : ${formattedEndOfMonthDate} and Actual end date is : ${checkEndCurrentDateXpath}`)
                    logger.info("Values matched: Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched: Test case Failed")
                }
                //verify the time zone
                let checkTimeZoneXpath = await getPropertyValueByXpath(schedule_access.span.timezone_diff_country, "textContent")
                let splitcheckTimeZoneXpath = checkTimeZoneXpath.split(" ")[0]
                logger.info(splitcheckTimeZoneXpath)
                // timezone_diff_country

                expect(row.timezone).toBe(splitcheckTimeZoneXpath)
                if (row.timezone === splitcheckTimeZoneXpath) {
                    reporter.startStep(`Expected time zone is : ${row.timezone} and Actual time zone is : ${splitcheckTimeZoneXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                // Verify the repeat mode
                let checkRepeatXpath = await getPropertyValueByXpath(schedule_access.span.Repeat_monthly_once, "textContent")
                let splitCheckRepeatXpath = checkRepeatXpath.slice(0, 5)
                logger.info(splitCheckRepeatXpath)
                let Repeatmode = row.Repeat.slice(0, 5)
                logger.info(Repeatmode)
                expect(Repeatmode).toBe(splitCheckRepeatXpath)
                if (Repeatmode === splitCheckRepeatXpath) {
                    reporter.startStep(`Expected repeat mode is : ${Repeatmode} and Actual repeat mode is : ${splitCheckRepeatXpath}`)
                    logger.info("Values matched : Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values Not matched : Test case failed")
                }

                //Verify the week on the month
                let checkWeekPositionXpath = await getPropertyValueByXpath(schedule_access.span.week_position, "textContent");
                logger.info(checkWeekPositionXpath)

                expect(weekType).toBe(checkWeekPositionXpath)
                if (weekType === checkWeekPositionXpath) {
                    reporter.startStep(`Expected Date is : '${weekType}' and Actual Date is : '${checkWeekPositionXpath}' `)
                    logger.info("Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Test case Failed")
                }
                // Verify the on the day of week
                let checkOnTheDayXpath = await getPropertyValueByXpath(schedule_access.span.on_the_day_xpath, "textContent");
                logger.info(checkOnTheDayXpath)

                expect(currentDayOfWeek).toBe(checkOnTheDayXpath)
                if (currentDayOfWeek === checkOnTheDayXpath) {
                    reporter.startStep(`Expected Date is : '${currentDayOfWeek}' and Actual Date is : '${checkOnTheDayXpath}' `)
                    logger.info("Test case passed")
                    reporter.endStep();
                }
                else {
                    logger.error("Values not matched: Test case failed")
                }

                //Verify the check box
                let checkBoxXpath = schedule_access.input.check_box;
                let isOptionEnabled = true; // Forcefully set to true

                try {
                    await page.waitForXPath(checkBoxXpath, { timeout: 5000 });
                    reporter.startStep('Checkbox is enabled in configured area');
                    isOptionEnabled = true; // Redundant, but ensuring it's true
                    reporter.endStep();
                } catch (error) {
                    reporter.startStep('Checkbox is disabled in configured area');
                    isOptionEnabled = false; // Ensuring it's false if checkbox is not found
                    reporter.endStep();
                }
                // Now, based on the value of isOptionEnabled, you can determine whether the test should pass or fail.
                if (isOptionEnabled) {
                    // The option is enabled, so the test case fails
                    logger.info("Test case passed: Checkbox is enabled.")
                    reporter.startStep('Test case passed: Checkbox is enabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                } else {
                    // The option is disabled, so the test case passes
                    logger.info("Test case failed: Checkbox is unexpectedly disabled.")
                    reporter.startStep('Test case failed: Checkbox is unexpectedly disabled.');
                    expect(isOptionEnabled).toBe(true);
                    reporter.endStep();
                }
                await delay(2000)
                await performAction("click", schedule_access.button.cancel_button)
                reporter.endStep();
            }
            else {
                logger.error("timezone not found")
            }
        }
    });
};

export const andILogoutAdminUserAndLoginMonthlyOnWeekDaySAUser = and => {
    and(/^I Logout Admin user and Login with Monthly OnWeekDay schedule access user$/, async (table) => {
        reporter.startStep("And I Logout Admin user and Login with Monthly OnWeekDay schedule access user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])

            let elemXPath6 = leftpane.svg.myprofile;
            await page.waitForXPath(elemXPath6, { timeout: 10000 })

            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)

            if (row.userid === "sconthedayofweek" && row.password === "Kovvuri@21") {
                var config
                config = await getEnvConfig()
                await goTo(config.otaURL)
                logger.info("Schedule access user details");
                await performAction("type", otalogin.details.username, "page", row.userid),
                    await delay(1000)
                await performAction("type", otalogin.details.password, "page", row.password),
                    await delay(1000)
                await performAction("click", schedule_access.label.password_view),
                    await delay(1000)
                await performAction("click", otalogin.details.login_button),
                    await delay(20000)
                await performAction("click", leftpane.a.userprofilepage),
                    await delay(5000)
                let screenshot = await customScreenshot('scheduleuser.png', 1920, 1200)
                reporter.addAttachment("schedule access user", screenshot, "image/png");
                await delay(2000)
                await performAction("click", schedule_access.span.user_profile_navigate)
                await delay(1000)
                // let actual_user_id = "saccesstesting";
                let user_profile_username = await getPropertyValueByXpath(schedule_access.div.monthly_on_week_day_xpath, "textContent");
                logger.info(user_profile_username)
                expect(row.userid).toBe(user_profile_username)
                if (row.userid === user_profile_username) {
                    reporter.startStep(`Expected schedule USER ID : ${user_profile_username}. Actual schedule USER ID : ${row.userid}`);
                    logger.info("test case passed")
                    expect(row.userid).toBe(user_profile_username);
                    reporter.endStep();
                }
                else {
                    logger.error("test case failed : user id is not matched")
                }
            }
            else {
                logger.error("userid and password not found")
            }
            reporter.endStep();
        }
    });
}

export const thenVerifyHttpsDeviceAccessMonthlyOnWeekDaySA = then => {
    then(/^Verify the http device access in Monthly OnWeekDay schedule acess user$/, async (table) => {
        reporter.startStep("Then Verify the http device access in Monthly OnWeekDay schedule acess user");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])
            if (row.type == "http") {
                logger.info("enter in condition...")
                let http_xpathVariable = schedule_access.span.http_access_device;
                let device123 = await page.$x(http_xpathVariable);
                logger.info("device123 ---- >" + device123);
                await device123[0].click();
                logger.info("after clicking ....")
                // await page.waitForTimeout(10000); // Use waitForTimeout to wait for 10 seconds
                await new Promise(resolve => setTimeout(resolve, 10000));

                // Get all pages after opening a new tab/window
                let pages = await browser.pages();
                let newPage = pages[pages.length - 1];
                logger.info("HTTP part");
                logger.info("New page URL: " + newPage.url());

                delay(2000)
                //let screenshot = await customScreenshot('aftersaform.png', 1920, 1200)
                let newpath = await pathJoin("newpage.png")
                let ss = await newPage.screenshot({ path: newpath, fullPage: true })
                delay(2000)

                reporter.addAttachment("after schedule access form", ss, "image/png");

                let expected_http_device_access_connection = "Welcome to nginx!";
                try {
                    const actual_http_device_connection = await newPage.waitForXPath('//h1[text()="Welcome to nginx!"]', { visible: true });
                    if (actual_http_device_connection) {
                        const elements = await newPage.evaluate(() => {
                            const xpath = '//h1[text()="Welcome to nginx!"]';
                            const nodeList = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                            const elements = [];
                            for (let i = 0; i < nodeList.snapshotLength; i++) {
                                elements.push(nodeList.snapshotItem(i).textContent);
                            }
                            return elements;
                        });
                        logger.info("actual_http_device_connection: " + elements);
                        if (elements[0] === expected_http_device_access_connection) {
                            reporter.startStep(`Expected HTTPS device connection status: ${elements[0]}. Actual HTTPS device connection status: ${expected_http_device_access_connection}`);
                            logger.info("Values are matched: test case passed!");
                            expect(elements[0]).toBe(expected_http_device_access_connection);
                            reporter.endStep();
                        } else {
                            logger.error("Values are not matched: test case failed!");
                        }
                    } else {
                        logger.info("New page did not load properly.");
                    }
                } catch (error) {
                    logger.error("Error occurred: " + error);
                }
                // Close the new page
                await newPage.close();
                // let elemXPath7 = leftpane.svg.myprofile;
                // await page.waitForXPath(elemXPath7, { timeout: 10000 })

                // await performAction("click", leftpane.svg.myprofile)
                // await delay(1000)
                // await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
                // await delay(5000)
            }
            else {
                logger.info("Http port not working!!!")
            }
            reporter.endStep();
        }
    })
}

export const andIDisableTheScheduleAccess = and => {
    and(/^I Disable the schedule access$/, async (table) => {
        reporter.startStep("And I Disable the schedule access");
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
            logger.info(row)
            logger.info(table[i])

            //Here I Logout the schedule access user
            reporter.startStep('Here I logout the schedule access user')
            let elemXPath6 = leftpane.svg.myprofile;
            await page.waitForXPath(elemXPath6, { timeout: 10000 })

            await performAction("click", leftpane.svg.myprofile)
            await delay(1000)
            await performAction("click", "//*[name()='svg'][@type='SignOutAlt']")
            await delay(5000)
            reporter.endStep();




            //Here I login with Admin user and disable the schedule access user
            logger.info("In givenAdminLoggedIn")
            reporter.startStep('Admin user logged in');
            const UsersElemExists = await page.$x(userlist.svg.loginuser_icon)
            if (UsersElemExists.length == 0) {
                let login
                login = new Login();
                logger.info("global.env = " + global.env)
                await login.launch(global.env, "orgAdmin")
            }
            let screenshot = await customScreenshot('givenAdminLoggedIn.png')
            reporter.addAttachment("Admin user logged in.", screenshot, "image/png");
            reporter.endStep();

            //Navigate to user page
            reporter.startStep('I navigate to the user page');
            await performAction("click", leftpane.a.userdashboard)
            await delay(2000)
            reporter.endStep();

            // if (row.userid === "saccesstesting") {
            if (row.userid !== null) {
                reporter.startStep('And I select user');
                await delay(2000)
                await performAction("click", schedule_access.button.search_button),
                    await delay(2000)
                await performAction("type", schedule_access.input.user_id, "page", row.userid),
                    await delay(2000)
                await performAction("click", schedule_access.span.userid_search),
                    await delay(2000)
            }
            else {
                logger.error("userid not found")
            }
            reporter.endStep();
            // reporter.endStep();

            await delay(5000),
                await performAction("click", schedule_access.div.user_profile_links),
                await delay(2000)
            let elemXPath1 = schedule_access.span.arrow_mark;
            await page.waitForXPath(elemXPath1, { timeout: 10000 })

            performAction("click", schedule_access.span.arrow_mark),
                await delay(2000)
            performAction("click", schedule_access.div.configuration_edit),
                await delay(20000)

            //Disable the schedule access user
            if (row.scheduleaccess === "Disable") {
                await delay(2000),
                    performAction("click", schedule_access.button.disable_sa)
                await delay(2000)
                performAction("click", schedule_access.button.sa_submit),
                    await delay(2000)
            } else {
                logger.error("Schedule access not found");
            }

            //Search for user and check user status enable/disable
            await performAction("click", leftpane.a.userdashboard)
            await delay(2000)
            await performAction("click", schedule_access.button.search_button)
            await delay(1000);
            await performAction("type", schedule_access.input.user_id, "page", row.userid)
            await delay(1000);
            await performAction("click", schedule_access.span.userid_search)
            await delay(2000)

            //ScreenShot
            let userlistpage = await customScreenshot('userListPage.png')
            reporter.addAttachment("Admin user logged in.", userlistpage, "image/png");

            //Validate the Status of user access enable and disable 
            reporter.startStep('Validate the user status')
            let expectedUserStatusXpath = await getPropertyValueByXpath(schedule_access.td.user_status, "textContent");
            logger.info(expectedUserStatusXpath)
            await delay(2000)
            let actual_UserStatusXpath = "Enabled"
            expect(expectedUserStatusXpath).toBe(actual_UserStatusXpath)
            if (expectedUserStatusXpath === actual_UserStatusXpath) {
                reporter.startStep(`Expected User status is : ${expectedUserStatusXpath} - Actaul User Status is : ${actual_UserStatusXpath}`);
                logger.info("Values are Matched : Test case Passed")
                reporter.endStep();
            }
            else {
                logger.error("Values are Not Matched : Test case Failed")
            }
            await delay(2000)
            await performAction("click", schedule_access.a.dashboardicon)
            await delay(2000)
            reporter.endStep();
            reporter.endStep();
        }
    })
}


export const whenICreateNotificationBanner = when => {
    when(/^I create a notification banner$/, async (table) => {
        reporter.startStep("When I navigate to Org profile")
        for (let i = 0; i < table.length; i++) {
            let row = table[i]
        await performAction('click', leftpane.a.orginfo)
        await delay(2000)
        await performAction("click", notification_banner.div.org_profile_arrow)
        await delay(2000)
        await performAction("click", notification_banner.div.notification_banner_drop_down)
        await delay(2000)
        await performAction("click", notification_banner.div.create_banner_xpath)
        await delay(2000)
        await performAction("click", notification_banner.div.input_text)
        await delay(2000)
        await performAction("type", notification_banner.div.input_text, "page", row.text)
        await delay(2000)
        await performAction("click", notification_banner.div.save_button)
        await delay(2000)
        await performAction("click", notification_banner.div.enable_toggle_button)
        await delay(2000)
        await performAction("click", leftpane.a.dashboardicon)
        await delay(2000)
        await performAction("click", leftpane.a.userprofilepage)
        await delay(2000)
        await page.reload();
        await delay(10000)
        let dashboardNotificatioBannerXpath = await getPropertyValueByXpath(notification_banner.div.banner_message_layout, "textContent");
        }
    })
}



