import { delay, getElementHandleByXpath, getEnvConfig, performAction } from '../../utils/utils';
import { commons, loginPage } from '../constants/locators';
import { logger } from '../log.setup';

const PuppeteerHar = require('puppeteer-har');
const { PendingXHR } = require('pending-xhr-puppeteer');
const har = new PuppeteerHar(page);


export async function login(env, scope, credentials=null, password=null) {
    let action;
    logger.info("env = " + env)
    let config = await getEnvConfig()
    global.sbpIP = config.sbpIP
    global.sbpURL = config.sbpURL

    const cookies = await page.cookies()
    logger.info("Cookies print " + cookies);
    logger.info('Before ALL')

    logger.info("scope is ",scope)
    var username, password
    if (scope == 'BM') {
        username = config.sbpBM
        password = config.sbpBMPassword
    } else if (scope == 'TA') {
        username = config.sbpTA
        password = config.sbpTAPassword
    } else if (scope == 'SBC') {
        username = config.sbcBM
        password = config.sbcBMPassword
    } else if (scope == 'custom') {
        username = credentials.username
        password = credentials.password
    } else {
        logger.error("Scope is invalid" + scope);
    }
    //username & password
    action = await performAction("type", loginPage.input.email, "page", username)
    expect(action).toBeTruthy()
    action = await performAction("type", loginPage.input.password, "page", password)
    expect(action).toBeTruthy()
    logger.info(" Starting to login");
    action = await performAction("click", loginPage.button.signIn)
    await page.waitForXPath("//div[contains(@class,'account-menu_account')]//button//div[contains(@class,'MuiAvatar-root')]")
    await delay(5000)
    logger.info("login completed")
}

export async function logout() {
    await performAction("click", commons.button.avatar)
    await performAction("click",commons.li.logout)
    await page.waitForXPath(loginPage.button.signIn)
}

export async function verifyLogin() {
    try{
        let present = await getElementHandleByXpath(commons.button.avatar)
        expect(present).toBeTruthy()
        logger.info("Avatar present. User is logged in")
        return true
    } catch {
        logger.error("Avatar not present. USer not logged in")
        return false
    }
    
}