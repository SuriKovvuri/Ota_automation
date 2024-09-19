import { logger } from '../log.setup';
import { customScreenshot, delay, expectToClick, getEnvConfig, goTo, performAction } from '../../utils/utils';
import * as constant from '../../utils/constants'
import { constants } from 'fs';
import { thenGetUsername } from './otauser';
import { add_auth_domain_page, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage,deviceprofilepage,adddevice,addendpoint,addgroup,adduser,user_role_association,device_role_association,user_detail,device_detail,group_detail,endpoint_review, user_search, device_search,group_search } from '../constants/locators';
import { user } from 'openstack-client/lib/keystone';

const axios = require('axios');

const PuppeteerHar = require('puppeteer-har');
const { PendingXHR } = require('pending-xhr-puppeteer');
const har = new PuppeteerHar(page);

export class Login {
    constructor() {

    }

    async launch(env, scope) {

        var config
        await har.start({ path: './reports/login_' + global.testStart + '.har', saveResponse: true });
        logger.info("env = " + env)
        config = await getEnvConfig()
        global.orchIP = config.otaIP
        global.homeurl = config.otaURL

        await goTo(config.otaURL)
        await expect(page.title()).resolves.toMatch('Login - View Remote Access');
        await customScreenshot('loginPage.png')
        var username, password;
        if (scope == 'orgAdmin') {
            username = config.otaAdmin
            password = config.otaAdminPassword
            await expect(page).toFill(constant.loginFormName, config.otaAdmin)
            await expect(page).toFill(constant.loginFormPassword, config.otaAdminPassword)
            await expectToClick(constant.loginFormButton)
            logger.info("Hit login")
            await delay(15000)
        } else {
            username = config.otaAccess
            password = config.otaAccessPassword
            await expect(page).toFill(constant.loginFormName, config.otaAccess)
            await expect(page).toFill(constant.loginFormPassword, config.otaAccessPassword)
            await expectToClick(constant.loginFormButton)
            logger.info("Hit login")
            await delay(2000)
        }
        if (global.mode == "API") {
            logger.info('calling API')
            axios.defaults.baseURL = "https://manage.qa2ot.smartsentry.io/";
            axios.defaults.headers.common['Content-Type'] = "application/json";
            axios.post('/api/v1/otalogin', {
                username: username,
                password: password
              })
              .then(function (response) {
                axios.defaults.headers.common['Authorization'] = "bearer " + response.data.data.access_token;
              })
              .catch(function (error) {
                logger.error(error);
              });
        }
        //const dashLogoAltXpath = "//img[@alt='iotium.io']"
        await expect(page).toMatchElement('svg[type="user-circle"]')
        //if (loginElem.length !== 0 ) {
        //    logger.info('dashLogoAltXpath xPath exist');
        //} else {
        //    logger.info('dashLogoAltXpath xPath not exist');
        //    expect(typeof loginElem).toBe('object')
        //}
        await delay(1000)
        await har.stop();

    }
    //Logout the existing loggedIn user, can be used only if already logged in
    async logout() {
      try {
        await page.setViewport({ width: 1300, height: 500})
        await delay(1000)
        let navigated = await performAction('hover', "//*[name()='svg'][@type='user-circle']//ancestor::a[@class='ant-dropdown-trigger ant-dropdown-link']")
        await delay(500)
        navigated = await performAction('click', "//a[@href='/logout']")
        expect(navigated).toBeTruthy()
        await delay(3000)
        await page.setViewport({ width: parseInt(global.width), height: parseInt(global.height)})
        await verifyLoadingSpinner()
      }
      catch(err) {
          logger.error("Exception caught: "+err);
          return false
      }
  }

  //Login to ota
  async login(username, password) {
    try {
      await delay(4000)
      await page.setViewport({ width: 1300, height: 500})
      await expect(page).toFill(constant.loginFormName, username)
      await expect(page).toFill(constant.loginFormPassword, password)
      await expectToClick(constant.loginFormButton)
      logger.info("Hit login")
      await delay(15000)
      await page.setViewport({ width: parseInt(global.width), height: parseInt(global.height)})
    }
    catch(err) {
        logger.error("Exception caught: "+err);
        return false
    }
}

}
