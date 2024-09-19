import { performAction, getPropertyValue,navigatePageByClick, delay } from "../../utils/utils";
import { logger } from "../log.setup";
import { addPullSecretsForm, leftpane, pullSecrets } from "../constants/locators";
import { goToOrg } from "./org";


export async function addPullSecret(pullSecretAdd,error="") {
    try {
        logger.info("In pullSecretAdd:",pullSecretAdd)
        var action;
        action = await performAction("type", addPullSecretsForm.input.pullSecretName, "page", pullSecretAdd.getpullsecretname())
        expect(action).toBeTruthy()
        action = await performAction("type", addPullSecretsForm.textarea.dockerConfig, "page", pullSecretAdd.getdockerconfig())
        expect(action).toBeTruthy()
        action = await performAction("click", addPullSecretsForm.button.create)
        expect(action).toBeTruthy()
        var elemExists;
        if (error != "") {
            elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-error']//span[text()='"+error+"']", {timeout: 10000}) ? true : false;
            expect(elemExists).toBe(true)
        } else {
            elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-success']//span[text()=' Pull Secret  created successfully']", {timeout: 10000}) ? true : false;
            expect(elemExists).toBe(true)
        }
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function cleanupPullSecret(pullSecretName,orgName="") {
    try {
        //goto org
        let result;
        if (orgName != "") {
            result = await goToOrg(orgName)
            expect(result).toBe(true)
        }

        //goto pull secrets page
        let navigated;
        let handle = await page.$x(leftpane.li.services)
        logger.info(handle.length)
        if (handle.length > 0){
            let propValue = await getPropertyValue(handle[0], 'classList')
            logger.info(propValue)
            if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
                navigated = await navigatePageByClick(leftpane.li.services)
                expect(navigated).toBeTruthy()
            }
        } else {
            logger.error("Unable to get service secrets in left menu")
            expect(true).toBe(false)
        }
        navigated = await navigatePageByClick(leftpane.li.allServices)
        expect(navigated).toBeTruthy()

        //delete pull secret
        navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
        expect(navigated).toBeTruthy()
        let elemXPath = "//td//div[text()='"+pullSecretName+"']//ancestor::tr//input[@class='ant-checkbox-input']"
        let action = await performAction("click", elemXPath , "page")
        expect(action).toBeTruthy()
        action = await performAction("click", pullSecrets.button.deletePullSecret , "page")
        expect(action).toBeTruthy()
        await delay(3000)
        action = await performAction("click", pullSecrets._delete_modal.delete , "page")
        expect(action).toBeTruthy()
        result = await page.waitForXPath(pullSecrets._delete_modal.success, {timeout: 10000}) ? true : false;
        expect(result).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

