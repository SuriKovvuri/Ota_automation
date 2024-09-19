import { performAction, getPropertyValue,navigatePageByClick, delay } from "../../utils/utils";
import { logger } from "../log.setup";
import { addVolumesForm, leftpane, volumes } from "../constants/locators";
import { goToOrg } from "./org";

export async function addVolume(volumeAdd,error="") {
    try {
        logger.info("In volumeAdd:",volumeAdd)
        var action;
        action = await performAction("type", addVolumesForm.input.volumeName, "page", volumeAdd.getvolumename())
        expect(action).toBeTruthy()
        action = await performAction("click", addVolumesForm.button.addFile)
        expect(action).toBeTruthy()
        action = await performAction("type", addVolumesForm.input.fileName, "page", volumeAdd.getfilename())
        expect(action).toBeTruthy()
        action = await performAction("click", addVolumesForm.checkbox.showFileContent)
        expect(action).toBeTruthy()
        action = await performAction("type", addVolumesForm.textarea.fileContent, "page", volumeAdd.getfilecontent())
        expect(action).toBeTruthy()
        action = await performAction("click", addVolumesForm.button.addVolume)
        expect(action).toBeTruthy()
        var elemExists;
        if (error != "") {
            elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-error']//span[text()='"+error+"']", {timeout: 10000}) ? true : false;
            expect(elemExists).toBe(true)
        } else {
            elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-success']//span[text()=' Volume created successfully']", {timeout: 10000}) ? true : false;
            expect(elemExists).toBe(true)
        }
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function cleanupVolume(volumeName,orgName) {
    try {
        //goto org
        let result;
        var action;
        if (orgName != "") {
            result = await goToOrg(orgName)
            expect(result).toBe(true)
        }

        //goto volumes page
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
        navigated = await navigatePageByClick(leftpane.li.serviceSecrets)
        expect(navigated).toBeTruthy()
        navigated = await navigatePageByClick(volumes.tab.volumes)
        expect(navigated).toBeTruthy()

        //delete volume
        let elemXPath = "//td//div[text()='"+volumeName+"']//ancestor::tr//input[@class='ant-checkbox-input']"
        action = await performAction("click", elemXPath , "page")
        expect(action).toBeTruthy()
        action = await performAction("click", volumes.button.deleteVolume , "page")
        expect(action).toBeTruthy()
        await delay(3000)
        action = await performAction("click", volumes._delete_modal.delete , "page")
        expect(action).toBeTruthy()
        result = await page.waitForXPath(volumes._delete_modal.success, {timeout: 10000}) ? true : false;
        expect(result).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}