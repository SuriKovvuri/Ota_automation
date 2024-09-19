import { delay, customScreenshot, getElementHandleByXpath, navigatePageByClick, performAction, getPropertyValue, screenshot } from "../../utils/utils";
import { logger } from "../log.setup";
import { addSSHKeyForm, leftpane, sshKeys } from "../constants/locators";
import { goToOrg } from './org'

export const name_error = 'SSH key name may contain only the special characters . - _'
export const name_del_error = 'Please give a name for the SSH Public Key'
export const sshkey_error = 'Please enter a valid SSH public key'
const fs = require('fs');


export async function gotoAddSSHKey() {
    reporter.startStep("When I navigate to left panel screens SSH Keys");
    const elemXPath1 = "//span[span= 'iNodes']//ancestor::li[contains(@class, 'ant-menu-submenu-open')]"
    const elemExists1 = await page.$x(elemXPath1)
    logger.info(elemExists1)
    if (elemExists1.length == 0) {
        logger.info('iNode list not active')
        await expect(page).toClick('span.nav-text', { text: 'iNodes' })
        await page.waitFor(2000)
    }

    logger.info('clicked the iNodes');
    let navigated = await navigatePageByClick(leftpane.li.sshKeys)
    expect(navigated).toBeTruthy()
    logger.info('clicked the SSH Keys');


    await expect(page).toClick('button[title="Add SSH Key"]')
    await delay(1000)
    logger.info('clicked the Add SSH Keys');
    reporter.endStep()
}

export async function addSSHKey(name, fileName, publicKeyInFile = true, openAddSSHKeyModal = true) {
    if (openAddSSHKeyModal) {
        await gotoAddSSHKey()
    }
    reporter.startStep(`Adding ssh key ${name}`)
    await expect(page).toFill('textarea[placeholder="SSH Key Name"]', name)
    let rawdata = ''
    if (publicKeyInFile) {
        let filePath = `./utils/${fileName}`
        rawdata = fs.readFileSync(filePath, 'utf8');
        logger.info(rawdata);
    } else {
        rawdata = fileName
    }

    await expect(page).toFill('textarea[placeholder="Paste a valid SSH (RSA) public key"]', rawdata)
    let screenshot1 = await customScreenshot('sshdetails_' + name + '.png', 1920, 1200)
    reporter.addAttachment("Details SSH Key " + name, screenshot1, "image/png");
    await expect(page).toClick('div.ant-modal-footer span', { text: 'Add SSH Key' })
    await expect(page).toMatchElement('.ant-message > span', { text: 'SSH Key created successfully', timeout: 20000 })
    let screenshot = await customScreenshot('sshadd_' + name + '.png', 1920, 1200)
    reporter.addAttachment("Add SSH Key " + name, screenshot, "image/png");
    reporter.endStep()
}

export async function gotoSSHKey(name) {
    try {
        logger.info("in gotoSSHKey")
        //const elemXPath1 = "//ul[contains(@id, 'inodes$Menu') and contains(@class, 'ant-menu ant-menu-sub ant-menu-hidden ant-menu-inline')]"
        const elemXPath1 = "//span[span= 'iNodes']//ancestor::li[contains(@class, 'ant-menu-submenu-open')]"
        const elemExists1 = await page.$x(elemXPath1)
        logger.info(elemExists1)
        if (elemExists1.length == 0) {
            logger.info('iNode list not active')
            await expect(page).toClick('span.nav-text', { text: 'iNodes' })
            //await page.waitFor(2000)
        }
        await expect(page).toClick('span.nav-text', { text: 'SSH Keys' })
        await expect(page).toFill('input[placeholder="Filter SSH Keys"]', name)
        await page.waitForResponse(response =>
            response.url().includes(name)
            && (response.status() === 200
                && response.request().method() === 'GET')
            , 10);//wait for 10 sec
        //await delay(2000)
        let pathVar = `//strong[text()="${name}"]//ancestor::tr[contains(@class,'ant-table-row-level-0')]`
        let rowExists = await page.waitForXPath(pathVar, { timeout: 3000 })
        if (rowExists != null) {
            logger.info("SSH Key found ", name)
            let row = await page.$x(pathVar)
            logger.info(row.length)
            return row[0]
        } else {
            logger.info("SSH Key not found/deleted ", name)
            return false
        }
    } catch (err) {
        logger.info(err)
        return false
    }
}

export async function deleteSSHKey(name) {
    logger.info("in deleteSSHKey")
    let sshRow = await gotoSSHKey(name)
    reporter.startStep(`Delete ssh key ${name}`)

    //Getting Delete button in the ssh table row
    let delButton = await sshRow.$$("button[title=' Delete SSH Key']:not([disabled])")
    logger.info(delButton.length)
    await delButton[0].click()
    logger.info("clicked delete")

    await expect(page).toMatchElement('h4', { text: 'Do you really want to delete?' })
    logger.info("match done h4")
    //await expect(page).toClick('div.ant-modal-footer span', {text: ' Delete'})

    let footerDel = await page.$x("//span[text()=' Delete']")
    await footerDel[0].click()
    logger.info("click footer delete done")
    await expect(page).toMatchElement('.ant-message > span', { text: 'Deleted successfully', timeout: 20000 })
    let screenshot = await customScreenshot('sshdelete_' + name + '.png', 1920, 1200)
    reporter.addAttachment("Delete SSH " + name, screenshot, "image/png");
    reporter.endStep()
}

export async function addSSHKeyError(name, publicKey, error) {
    try {
        logger.info("In addSSHKeyError:", name)
        var action;
        action = await performAction("type", addSSHKeyForm.textarea.sshKeyName, "page", name)
        expect(action).toBeTruthy()
        action = await performAction("type", addSSHKeyForm.textarea.sshPublicKey, "page", publicKey)
        expect(action).toBeTruthy()
        var navigated = await navigatePageByClick(addSSHKeyForm.button.addSSHKey)
        expect(navigated).toBeTruthy()
        const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-error']//span[text()='" + error + "']", { timeout: 10000 }) ? true : false;
        expect(elemExists).toBe(true)
    }
    catch (err) {
        logger.error("Exception caught: " + err)
        return false
    }
    return true
}

export async function addSSHKeyNew(name, publicKey) {
    try {
        logger.info("In addSSHKeyNew:", name)
        var action;
        action = await performAction("type", addSSHKeyForm.textarea.sshKeyName, "page", name)
        expect(action).toBeTruthy()
        action = await performAction("type", addSSHKeyForm.textarea.sshPublicKey, "page", publicKey)
        expect(action).toBeTruthy()
        var navigated = await navigatePageByClick(addSSHKeyForm.button.addSSHKey)
        expect(navigated).toBeTruthy()
        const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-success']//span[text()='SSH Key created successfully']", { timeout: 10000 }) ? true : false;
        expect(elemExists).toBe(true)
    }
    catch (err) {
        logger.error("Exception caught: " + err)
        return false
    }
    return true
}

export async function cleanupSSHKey(sshKeyName, orgName) {
    try {
        let result;
        var action;
        let navigated;

        if (orgName != "") {
            result = await goToOrg(orgName)
            expect(result).toBe(true)
        }
        //goto dashboard
        action = await performAction("click", leftpane.li.dashboard, "page")
        expect(action).toBeTruthy()

        //goto ssh key list page
        let handle = await page.$x(leftpane.li.inodes)
        logger.info(handle.length)
        if (handle.length > 0) {
            let propValue = await getPropertyValue(handle[0], 'classList')
            logger.info(propValue)
            if (Object.values(propValue).includes('ant-menu-submenu-open') == false) {
                navigated = await performAction("click", leftpane.li.inodes, "page")
                expect(navigated).toBeTruthy()
            }
        } else {
            logger.error("Unable to get iNodes in left menu")
            expect(true).toBe(false)
        }
        action = await performAction("click", leftpane.li.sshKeys, "page")
        expect(action).toBeTruthy()
        expect(await screenshot("sshKeysPage")).toBeTruthy()

        //delete ssh key
        let elemXPath = "//td//div[text()='" + sshKeyName + "']//ancestor::tr//input[@class='ant-checkbox-input']"
        action = await performAction("click", elemXPath, "page")
        expect(action).toBeTruthy()
        action = await performAction("click", sshKeys.button.deleteSSHKey, "page")
        expect(action).toBeTruthy()
        await delay(3000)
        action = await performAction("click", sshKeys._delete_modal.delete, "page")
        expect(action).toBeTruthy()
        result = await page.waitForXPath(sshKeys._delete_modal.success, { timeout: 10000 }) ? true : false;
        expect(result).toBe(true)
    }
    catch (err) {
        logger.error("Exception caught: " + err)
        return false
    }
    return true
}