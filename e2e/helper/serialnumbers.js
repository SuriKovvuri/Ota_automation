import { delay, customScreenshot, performAction, navigatePageByClick, getEnvConfig, getPropertyValue } from "../../utils/utils";
import { logger } from "../log.setup";
import { leftpane, addUserForm, changePasswordForm, userChangePasswordModal, addRoleForm, serialNumbers } from "../constants/locators";
import { goToOrg } from './org'

export const fullname_error = "Full name must not contain any special characters."
export const email_error = "Please enter your email address."
export const email_info = "An email will be sent to this address with a link to verify the email address. User must verify this email address before logging in."
export const password_error = "Password must at least be 12 characters long, contain at least one upper case alphabet, at least one number, and at least one special character. The only special characters allowed are ! @ # $ & * _"
export const confirmpsw_error = "Confirm Password does not match the password"

export async function cleanupSerialNumber(hsn, orgName) {
    try {
        let result;
        var action;
        let navigated;

        if (orgName != "") {
            result = await goToOrg(orgName)
            expect(result).toBe(true)
        }

        //goto serial number list page
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
        navigated = await navigatePageByClick(leftpane.li.serialNumbers)
        expect(navigated).toBeTruthy()

        //delete serial number
        let elemXPath = "//td//div[text()='"+hsn+"']//ancestor::tr//input[@class='ant-checkbox-input']"
        action = await performAction("click", elemXPath , "page")
        expect(action).toBeTruthy()
        action = await performAction("click", serialNumbers._button.delete , "page")
        expect(action).toBeTruthy()
        await delay(3000)
        action = await performAction("click", serialNumbers._delete_modal.delete , "page")
        expect(action).toBeTruthy()
        result = await page.waitForXPath(serialNumbers._delete_modal.success, {timeout: 10000}) ? true : false;
        expect(result).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}
