import { Example } from '../src/example';
import { customScreenshot, delay, getEnvConfig, replaceEnvs } from '../../utils/utils';
import { logger } from '../log.setup';
import { launch } from '../helper/otalogin';
import { Login } from '../helper/otalogin';
import { PostApiCall } from '../helper/otauserapi';
import { add_auth_domain_page, otalogin, password_reset, leftpane, dashboard, userlist, devicelist, grouplist, auditlist, orgpage, userprofilepage, groupprofilepage, deviceprofilepage, adddevice, addendpoint, addgroup, adduser, user_role_association, device_role_association, user_detail, device_detail, group_detail, endpoint_review, user_search, device_search, group_search, accesslist } from '../constants/locators';

var assert = require('assert');

const flushPromises = () => new Promise(setImmediate);
let eg;

const axios = require('axios');
const sprintf = require('sprintf-js').sprintf;


export const givenIamExample = given => {
  given('I am Example', () => {
    eg = new Example();
    logger.info('within common steps')
  });
};

export function userLogin(userName, password) {
  //placeHolder
}
export const givenIamLoggedIn = given => {
  given('I am logged in', async () => {
    try {
      console.log("In givenIamLoggedIn")
      reporter.startStep("Given I am logged in");
      try {
        //just to ensure in case of logout performed in other scenario, we will login again
        //const elemExists = await expect(page).toMatchElement('svg','type="Users"') ? true : false;
        const elemExists = await expect(page).toMatchElement('svg[type="Users"]') ? true : false;
        if (elemExists == false) {
          let login
          login = new Login();
          logger.info("global.env = " + global.env)
          await login.launch(global.env, global.scope)
          expect(elemExists).toBe(true)
        } else {
          expect(elemExists).toBe(true)
          logger.info("User is logged in")
        }
      } catch (e) {
        expect(e).toMatch('error');
      }
      reporter.endStep();
    } catch (e) {
      expect(e).toMatch('error');
    }

  });

};

export const givenAccessUserLoggedIn = given => {
  given('Access user logged in', async () => {
    try {
      reporter.startStep('Access user logged in');
      let login
      login = new Login();
      const UsersElemExists = await page.$x(userlist.svg.loginuser_icon)
      if (UsersElemExists.length != 0) {
        await login.logout()
      }
      logger.info("global.env = " + global.env)
      await login.launch(global.env, "access")

      let screenshot = await customScreenshot('givenAccessUserLoggedIn.png')
      reporter.addAttachment("Access user logged in.", screenshot, "image/png");
      reporter.endStep();
    } catch (e) {
      let screenshot = await customScreenshot('givenAccessUserLoggedIn.png')
      reporter.addAttachment("Access user logged in error.", screenshot, "image/png")
      expect(e).toMatch('error');
    }

  });

};

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

