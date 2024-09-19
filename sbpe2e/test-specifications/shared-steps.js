import { customScreenshot, delay, performAction, waitForNetworkIdle } from "../../utils/utils";
import { commons } from "../constants/locators";
import { verifyLogin } from "../helper/login";
import { logger } from "../log.setup";


export const givenIamLoggedIn = given => {
  given('I am logged as a Building Manager', async () => {
    reporter.startStep("Given I am logged as a Building Manager");
    logger.info("In givenIamLoggedIn")
    let retValue = await verifyLogin()
    expect(retValue).toBeTruthy()
    let ss = await customScreenshot('loggedin.png')
    reporter.addAttachment("loggedIn", ss, "image/png");
    reporter.endStep();
  });
};


export const whenIselectBuilding = when => {
  when(/^I select "(.*)"$/, async (building) => {
    reporter.startStep(`When I select ${building}`);
    logger.info(`When I select ${building}`)
    await delay(3000)
    await performAction('click', commons.button.selectBuilding)
    await delay(2000)
    await page.waitForXPath(`//ul[@role='menu']//li[span='${building}']`)
    await Promise.all([
      performAction('click', `//ul[@role='menu']//li[span='${building}']`),
      waitForNetworkIdle(120000) //2mins
    ])
    let ss = await customScreenshot('building.png')
    reporter.addAttachment("building", ss, "image/png");
    reporter.endStep();
  });
}

export const givenIamLoggedTn = given => {
  given('I am logged as a Tenant Admin', async () => {
    reporter.startStep("Given I am logged as a Tenant Admin");
    logger.info("In givenIamLoggedTn")
    let retValue = await verifyLogin()
    expect(retValue).toBeTruthy()
    let ss = await customScreenshot('loggedin.png')
    reporter.addAttachment("loggedIn", ss, "image/png");
    reporter.endStep();
  });
};

