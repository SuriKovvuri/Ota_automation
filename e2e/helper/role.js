import { delay, customScreenshot, performAction, navigatePageByClick, getEnvConfig } from "../../utils/utils";
import { logger } from "../log.setup";
import { leftpane, addUserForm, changePasswordForm, userChangePasswordModal, addRoleForm } from "../constants/locators";

export const fullname_error = "Full name must not contain any special characters."
export const email_error = "Please enter your email address."
export const email_info = "An email will be sent to this address with a link to verify the email address. User must verify this email address before logging in."
export const password_error = "Password must at least be 12 characters long, contain at least one upper case alphabet, at least one number, and at least one special character. The only special characters allowed are ! @ # $ & * _"
export const confirmpsw_error = "Confirm Password does not match the password"

export async function addRoleError(roleAdd,error) {
    try {
        logger.info("In addRoleError:",roleAdd)
        var action;
        action = await performAction("type", addRoleForm.input.roleName, "page", roleAdd.getrolename())
        expect(action).toBeTruthy() 
        action = await performAction("type", addRoleForm.input.description, "page", roleAdd.getdescription())
        expect(action).toBeTruthy()
        action = await performAction("click", addRoleForm.div.permissions)
        expect(action).toBeTruthy()
        for(var i=0;i<roleAdd.getpermissions().length;i++) {
            action = await performAction("click", "//li[text()='"+roleAdd.getpermissions()[i]+"']")
            expect(action).toBeTruthy()
        }
        await performAction("escape", addRoleForm.div.permissions, "page")
        var navigated = await navigatePageByClick(addRoleForm.button.addRole)
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
