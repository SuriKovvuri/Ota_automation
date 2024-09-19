import { delay, customScreenshot, performAction, navigatePageByClick, getEnvConfig, getPropertyValue } from "../../utils/utils";
import { logger } from "../log.setup";
import { leftpane, addUserForm, changePasswordForm, userChangePasswordModal, addRoleForm,addCSPForm, csp } from "../constants/locators";
import { goToOrg } from "./org"

export const fullname_error = "Full name must not contain any special characters."
export const email_error = "Please enter your email address."
export const email_info = "An email will be sent to this address with a link to verify the email address. User must verify this email address before logging in."
export const password_error = "Password must at least be 12 characters long, contain at least one upper case alphabet, at least one number, and at least one special character. The only special characters allowed are ! @ # $ & * _"
export const confirmpsw_error = "Confirm Password does not match the password"

export async function addCSP(cspAdd) {
    try {
        logger.info("In addCSPError:",cspAdd)
        var action;
        action = await performAction("type", addCSPForm.input.name, "page", cspAdd.getname())
        expect(action).toBeTruthy()
        action = await performAction("click", addCSPForm.input.fromNetwork)
        expect(action).toBeTruthy()
        action = await performAction("click", addCSPForm.li.addLabel)
        expect(action).toBeTruthy()
        action = await performAction("type", addCSPForm.input.fromNetworkLabel, "page", cspAdd.getfromnetworklabel())
        expect(action).toBeTruthy()
        action = await performAction("click", addCSPForm.button.addCSP)
        expect(action).toBeTruthy()
        const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-success']//span[text()='Custom Security Policy created successfully']", {timeout: 10000}) ? true : false;
        expect(elemExists).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function addCSPError(cspAdd,error) {
    try {
        logger.info("In addCSPError:",cspAdd)
        var action;
        action = await performAction("type", addCSPForm.input.name, "page", cspAdd.getname())
        expect(action).toBeTruthy()
        action = await performAction("click", addCSPForm.input.fromNetwork)
        expect(action).toBeTruthy()
        action = await performAction("click", addCSPForm.li.addLabel)
        expect(action).toBeTruthy()
        action = await performAction("type", addCSPForm.input.fromNetworkLabel, "page", cspAdd.getfromnetworklabel())
        expect(action).toBeTruthy()
        var navigated = await navigatePageByClick(addCSPForm.button.addCSP)
        expect(navigated).toBeTruthy()
        const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-error']//span[text()='"+error+"']", {timeout: 10000}) ? true : false;
        expect(elemExists).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function cleanupCustomSecurityPolicy(customSecurityPolicyName, orgName) {
    try {
        let result;
        var action;
        let navigated;

        if (orgName != "") {
            result = await goToOrg(orgName)
            expect(result).toBe(true)
        }

        //goto CSP list page
        let handle = await page.$x(leftpane.li.networks)
        logger.info(handle.length)
        if (handle.length > 0){
            let propValue = await getPropertyValue(handle[0], 'classList')
            logger.info(propValue)
            if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
                navigated = await navigatePageByClick(leftpane.li.networks)
                expect(navigated).toBeTruthy()
            }
        } else {
            logger.error("Unable to get Networks in left menu")
            expect(true).toBe(false)
        }
        navigated = await navigatePageByClick(leftpane.li.customSecurityPolicy)
        expect(navigated).toBeTruthy()

        //delete CSP     
        let elemXPath = "//td//span[text()='"+customSecurityPolicyName+"']//ancestor::tr//input[@class='ant-checkbox-input']"
        action = await performAction("click", elemXPath , "page")
        expect(action).toBeTruthy()
        action = await performAction("click", csp.button.deleteCustomSecurityPolicy , "page")
        expect(action).toBeTruthy()
        await delay(3000)
        action = await performAction("click", csp._delete_modal.delete , "page")
        expect(action).toBeTruthy()
        result = await page.waitForXPath(csp._delete_modal.success, {timeout: 10000}) ? true : false;
        expect(result).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}