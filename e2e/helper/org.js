import { logger } from "../log.setup";
import { customScreenshot, delay, getElementAttributes, getElementHandleByXpath } from '../../utils/utils';
import { Login } from '../helper/login';
import { addOrg, leftpane } from '../constants/locators';
import { navigatePageByClick, performAction } from '../../utils/utils';

export const font_family_url_error = "Please enter a valid Google Fonts URL"

export async function goToOrgs() {
    try {

        await expect(page).toClick('span.nav-text', { text: 'Orgs' })
        logger.info('Clicked on the Orgs');
        await page.waitFor(1000)
    }
    catch (err) {
        logger.info(err);
    }
}

export async function goToOrg(orgName) {
    try {
        /* var allOrgs = ''
    
        if (global.scope == "Admin") {
            //allOrgs = 'div > div.ant-layout-sider > div.ant-layout-sider-children > div:nth-child(3) > ul.ant-menu.ant-menu-inline.scrollable-menu.ant-menu-dark.ant-menu-root > li:nth-child(2)'
            allOrgs = await findBySelector(page, 'span', 'Orgs')
        }
        else 
        {
            //allOrgs = 'div > div.ant-layout-sider > div.ant-layout-sider-children > div:nth-child(3) > ul.ant-menu.ant-menu-inline.scrollable-menu.ant-menu-dark.ant-menu-root > li:nth-child(1)'
            allOrgs = await findBySelector(page, 'span', 'Orgs')
        }
        //await expect(page).toClick(allOrgs)
        //await expect(allOrgs).toClick() */
        let action = await navigatePageByClick(leftpane.li.orgs)
        expect(action).toBeTruthy()
        await page.waitFor(1000)
        var childOrgInput = "//span[text()='Also show child Orgs']//preceding-sibling::span/input[not(@disabled)]"
        let result = await getElementHandleByXpath(childOrgInput, page, {timeout : 100})
        if (result && result.length > 0){
            let action1 = await navigatePageByClick(childOrgInput)
            expect(action1).toBeTruthy()
        }
        logger.info('Clicked on the Also show child Orgs');
        //await expect(page).toClick('label.ant-checkbox-wrapper > span', { text: 'Also show child Orgs' })
        
        await page.waitFor(1000)
        //use the page filter to avoid scrolling
        logger.info('Searching for Orgs ', orgName);
        await expect(page).toFill('input[placeholder="Filter orgs by name"]', orgName)
        await page.waitFor(1000)
        try {
            await expect(page).toMatchElement('a', { text: orgName, timeout: '10000' })
            await expect(page).toClick('a', { text: orgName })
        } catch (err) {
            logger.info('Org name not found in current page, try to paginate');
            return false
        }
    }
    catch (err) {
        logger.info(err);
        return false
    }
    return true
}

export async function deleteOrg(orgName) {
    try {
        let action = await performAction('click',leftpane.li.orgs)
        expect(action).toBeTruthy()
        let navigated = await navigatePageByClick("//td//a[text()='"+orgName+"']//ancestor::tr//button[@class='ant-btn ant-dropdown-trigger']")
        expect(navigated).toBeTruthy()
        let screenshot = await customScreenshot('org_dropdown.png', 1920, 1200)
        reporter.addAttachment("Org Dropdown", screenshot, "image/png");

        action = await performAction('click',"//div[not(contains(@class,'ant-dropdown-hidden'))][contains(@class,'ant-dropdown')]//button[@title='Delete Org']")
        expect(action).toBeTruthy()
        screenshot = await customScreenshot('org_delete_modal.png', 1920, 1200)
        reporter.addAttachment("Org delete modal", screenshot, "image/png");

        navigated = await navigatePageByClick("//button[@class='ant-btn ant-btn-primary']//span[text()=' Delete']")
        expect(navigated).toBeTruthy()
        screenshot = await customScreenshot('org_delete.png', 1920, 1200)
        reporter.addAttachment("Org delete", screenshot, "image/png");
    }
    catch (err) {
        logger.error("Exception caught: "+err);
        return false
    }
    return true
}

export async function EditOrg(orgName, branding_policy) {
    logger.info('>>func:EditOrg, file: org.js')
    try {
        await expect(page).toClick('span.nav-text', { text: 'Orgs' })
        logger.info('Clicked on the Orgs');
        await page.waitFor(1000)
        logger.info('Searching for Orgs ', orgName);
        await expect(page).toClick('label.ant-checkbox-wrapper > span', { text: 'Also show child Orgs' })
        await expect(page).toFill('input[placeholder="Filter orgs by name"]', orgName)
        await page.waitFor(1000)
        try {
            await expect(page).toMatchElement('a', { text: orgName, timeout: '10000' })
            //await expect(page).toClick('a', { text: orgName })
            logger.info('org found')
        } catch (err) {
            logger.info('Org name not found in current page, try to paginate');
        }
        await delay(1000)
        try {
            await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger"')
            await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger"')
            await delay(1000)
            await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
            await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
            await delay(1000)
            logger.info('3dots found.')
            //let screenshot = await customScreenshot('EditOrg.png', 1366, 768)
            await (page
                .waitForXPath("//button[contains(@title, 'Edit Org')]", { visible: true })
                .then(() => logger.info('Waiting for gear button to show Edit Org')))
            const [view] = await page.$x(".//button[contains(@title, 'Edit Org')]", { visible: true })
            //reporter.addAttachment("EditOrg ", screenshot, "image/png");
            await view.click()
            logger.info('edit org clicked')
            try {
                const divButton = (await page.$x("//div[text()='Advanced Settings']"))
                expect(divButton).not.toEqual([])
                if (divButton.length > 0) {
                    await divButton[0].click()
                } else {
                    throw new Error('click me div not found')
                }
                logger.info('found Advanced Settings')
            } catch (err) {
                logger.error('Advanced Settings not found');
            }
            await page.waitFor(10000)
            let screenshot1 = await customScreenshot('EditOrg1.png', 1366, 768)
            try {
                const branding_ele = (await page.$x("//button[@id='branding']"))
                expect(branding_ele).not.toEqual([])
                if (branding_ele.length > 0) {
                    const obs_branding_policy = await page.evaluate(branding_ele => branding_ele.textContent, branding_ele[0]);
                    logger.info('Policy set to ' + obs_branding_policy)
                    if (obs_branding_policy == "On" && branding_policy == "Enable") {
                        logger.info('On+Enabled condition.')
                        logger.info('BRanding is already enabled.')
                    } else if (obs_branding_policy == "Off" && branding_policy == "Enable") {
                        logger.info('Off+Enabled condition.')
                        //await branding_ele[0].click()
                        const b = (await page.$x("//button[@id='branding']"))
                        expect(b).not.toEqual([])
                        if (b.length > 0) {
                            await b[0].click()
                            logger.info('BRanding is enabled.')
                        } else {
                            throw new Error('prob enabling branding')
                        }
                    } else if (obs_branding_policy == "Off" && branding_policy == "Disable") {
                        logger.info('Off+Disabled condition.')
                        logger.info('BRanding is already disabled..')
                    } else if (obs_branding_policy == "On" && branding_policy == "Disable") {
                        logger.info('On+Disabled condition.')
                        await branding_ele[0].click()
                        logger.info('BRanding is Disabled.')
                    }
                } else {
                    throw new Error('click me div not found')
                }
            } catch (err) {
                logger.error('catch on policy settings ' + err)
            }
            reporter.addAttachment("EditOrg1 ", screenshot1, "image/png");
            await expect(page).toMatchElement('span', { text: 'Update' })
            await expect(page).toClick('span', { text: 'Update' })
            logger.info('org edit form submitted')

            await page.waitFor(10000)
        } catch (err) {
            logger.error('some exception')
        }
    }
    catch (err) {
        logger.info(err);
    }

}

export async function HoverOrg(orgName) {
    logger.info('>>func:HoverOrg, file: org.js')
    let status
    await expect(page).toClick('span.nav-text', { text: 'Orgs' })
    logger.info('Clicked on the Orgs');
    logger.info('Searching for Orgs ', orgName);
    await expect(page).toClick('label.ant-checkbox-wrapper > span', { text: 'Also show child Orgs' })
    await expect(page).toFill('input[placeholder="Filter orgs by name"]', orgName)
    await page.waitFor(1000)
    try {
        await expect(page).toMatchElement('a', { text: orgName, timeout: '10000' })
        //await expect(page).toClick('a', { text: orgName })
        logger.info('org found')
    } catch (err) {
        logger.info('Org name not found in current page, try to paginate');
    }
    await page.waitFor(1000)

    try {
        //let screenshot1 = await customScreenshot('HoverOrg1.png', 1366, 768)
        await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger"')
        await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger"')
        await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
        await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
        //reporter.addAttachment("HoverOrg1 ", screenshot1, "image/png");
        await delay(1000)
        logger.info('3dots found.')
        let screenshot = await customScreenshot('HoverOrg.png', 1366, 768)
        const x = (await page.$x("//button[contains(@title, 'Customize Branding')]"))
        if (x.length == 0) {
            logger.info('Customize Branding not found in 3dot')
            reporter.addAttachment("HoverOrg ", screenshot, "image/png");
            return false
        } else if (x.length == 1) {
            logger.info('Customize Branding found in 3dot')
            reporter.addAttachment("HoverOrg ", screenshot, "image/png");
            return true
        } else {
            logger.info('>>>need to check what is this condition')
        }


    } catch (err) {
        logger.info(err)
        return false
    }
}

export async function ConfigureCustomBrand(orgName, branding) {
    logger.info('>>func:ConfigureCustomBrand, file: org.js')
    let status
    await expect(page).toClick('span.nav-text', { text: 'Orgs' })
    logger.info('Clicked on the Orgs');
    logger.info('Searching for Orgs ', orgName);
    await expect(page).toClick('label.ant-checkbox-wrapper > span', { text: 'Also show child Orgs' })
    await expect(page).toFill('input[placeholder="Filter orgs by name"]', orgName)
    await page.waitFor(1000)
    try {
        await expect(page).toMatchElement('a', { text: orgName, timeout: '10000' })
        //await expect(page).toClick('a', { text: orgName })
        logger.info('org found')
    } catch (err) {
        logger.info('Org name not found in current page, try to paginate');
    }
    await page.waitFor(1000)
    try {
        logger.info('looking for 3dots to click')
        await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger"')
        await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger"')
        //await page.waitFor(1000)
        await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
        await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
        await delay(1000)
        logger.info('3dots found.')
        const x = (await page.$x("//button[contains(@title, 'Customize Branding')]"))
        if (x.length == 0) {
            logger.info('Customize Branding not found in 3dot')
            return false
        } else if (x.length == 1) {
            logger.info('Customize Branding found in 3dot')
            await x[0].click()
            await delay(1000)
            await expect(page).toFill('input[placeholder="Enter dark logo URL"]', branding.get_dark_logo_url())
            await expect(page).toFill('input[placeholder="Enter light logo URL"]', branding.get_light_logo_url())
            await expect(page).toFill('input[placeholder="Enter favorite icon URL"]', branding.get_favo_icon_url())
            await expect(page).toFill('input[placeholder="Enter login background URL"]', branding.get_login_bg_url())
            await expect(page).toFill('input[placeholder="Enter from email address"]', branding.get_from_email_address())
            await expect(page).toFill('input[placeholder="Enter font family URL"]', branding.get_font_family_url())
            let screenshot2 = await customScreenshot('ConfigureCustomBrand2.png', 1366, 768)
            await delay(1000)
            reporter.addAttachment("ConfigureCustomBrand2", screenshot2, "image/png");
            await expect(page).toMatchElement('span', { text: 'Save' })
            await expect(page).toClick('span', { text: 'Save' })
            logger.info('Branding form submitted')
            await delay(1000)
            let screenshot3 = await customScreenshot('ConfigureCustomBrand3.png', 1366, 768)
            reporter.addAttachment("ConfigureCustomBrand3", screenshot3, "image/png");
            try {
                await expect(page).toMatchElement('.ant-message > span', { text: 'Branding customized successfully', timeout: 1000 })
                return true
            } catch (err) {
                //await expect(page).toMatchElement('span', { text: 'Cancel' })
                //await expect(page).toClick('span', { text: 'Cancel' })
                //logger.info('Branding form Cancelled')
                //await delay(1000)
                return false
            }            
        } else {
            logger.info('>>>need to check what is this condition')
        }
    } catch (err) {
        logger.info(err)
        return false
    }
}

export async function ConfigureDomainName(OrgName) {
    logger.info('into configuring domain name ' + OrgName)
}

export async function RevertBranding(orgName) {
    await expect(page).toClick('span.nav-text', { text: 'Orgs' })
    logger.info('Clicked on the Orgs');
    logger.info('Searching for Orgs ', orgName);
    await expect(page).toClick('label.ant-checkbox-wrapper > span', { text: 'Also show child Orgs' })
    await expect(page).toFill('input[placeholder="Filter orgs by name"]', orgName)
    await page.waitFor(1000)
    try {
        await expect(page).toMatchElement('a', { text: orgName, timeout: '10000' })
        //await expect(page).toClick('a', { text: orgName })
        logger.info('org found')
    } catch (err) {
        logger.info('Org name not found in current page, try to paginate');
    }
    await page.waitFor(1000)

    try {
        logger.info('looking for 3dots to click')
        await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger"')
        await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger"')
        await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
        await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
        await delay(1000)
        logger.info('3dots found.')
        const x = (await page.$x("//button[contains(@title, 'Customize Branding')]"))
        if (x.length == 0) {
            logger.info('Customize Branding not found in 3dot')
        } else if (x.length == 1) {
            logger.info('Customize Branding found in 3dot')
            await x[0].click()
            await delay(1000)

            const y = (await page.$x("//button[@title='Revert to ioTium Branding']"))
            if (y.length == 0) {
                logger.info('Revert to ioTium Branding not found')
                return false
            } else {
                await y[0].click()
                await delay(1000)
                let screenshot = await customScreenshot('RevertBranding1.png', 1366, 768)
                reporter.addAttachment("RevertBranding1", screenshot, "image/png");
                await delay(2000)
                await expect(page).toMatchElement('span', { text: 'Yes - Revert to ioTium Branding' })
                //let screenshot2 = await customScreenshot('RevertBranding2.png', 1366, 768)
                //reporter.addAttachment("RevertBranding2", screenshot2, "image/png");
                await expect(page).toClick('span', { text: 'Yes - Revert to ioTium Branding' })
                await delay(1000)
                /*
                const z = (await page.$x("//button[@title='Revert to ioTium Branding']"))
                if (z.length == 0) {
                    logger.info('NO Revert to ioTium Branding button not found')
                    return false
                } else {
                    logger.info('YES Revert to ioTium Branding button not found')
                    await z[0].click()
                    await delay(1000)
                }
                */
                logger.info('Reverted to ioTium Branding')
                let screenshot3 = await customScreenshot('RevertBranding3.png', 1366, 768)
                reporter.addAttachment("RevertBranding3", screenshot3, "image/png");
                await delay(1000)
                try {
                    await expect(page).toMatchElement('.ant-message > span', { text: 'Reverted to ioTium branding successfully', timeout: 1000 })
                    return true
                } catch (err) {
                    return false
                }            
 
                return true
            }
        } else {
            logger.info('>>>need to check what is this condition')
        }
    } catch (err) {
        logger.info(err)
        return false
    }
}

export async function EnableBranding(OrgName) {
    //return True if successfully enabled
    // return False if error
    logger.info('Enable Branding on ' + OrgName)
}

export async function DisableBranding(OrgName) {
    //return True if successfully disabled
    // return False if error
    logger.info('Disable Branding on ' + OrgName)
}

export async function VerifyForExpectedLogo(ExpectedLogo, ObservedLogo) {
    logger.info('VerifyForExpectedLogo ' + ExpectedLogo + ExpectedLogo.length)
    logger.info('VerifyForObservedLogo ' + ObservedLogo + ObservedLogo.length)
    try {
        //expect(ExpectedLogo.length).toBe(ObservedLogo.length)
        ExpectedLogo.forEach(x => expect(ObservedLogo).toContain(x))
        logger.info('logos found')
        return true
    } catch (err) {
        logger.info(err)
        return false
    }
}

export async function isDarkTheme() {
    logger.info('isDarkTheme')
    try {
        await (page
            .waitForXPath("(//aside[contains(@class,'ant-layout-sider ant-layout-sider-dark')]//div)[1]", { visible: true })
            .then(() => logger.info('yes dark theme found')))
    } catch (error) {
        logger.error("dark theme not found on the page.")
    }
}

export async function isLightTheme() {
    logger.info('isLightTheme')
    try {
        await (page
            .waitForXPath("(//aside[contains(@class,'ant-layout-sider ant-layout-sider-light')]//div)[1]", { visible: true })
            .then(() => logger.info('yes light theme found')))
    } catch (error) {
        logger.error("light theme not found on the page.")
    }
}

export async function ExpandSideBar() {
    reporter.startStep("Expanding SIde bar")
    try {
        logger.info('ExpandSideBar')
        await (page
            .waitForXPath("//div[@title='Expand']", { visible: true })
            .then(() => logger.info('Expand')))
        const [view] = await page.$x("//div[@title='Expand']", { visible: true })
        await view.click()
        let screenshot = await customScreenshot('ExpandSideBar.png', 1366, 768)
        reporter.addAttachment("ExpandSideBar ", screenshot, "image/png");
        await delay(10000)
    } catch (err) {
        logger.error(err)
    }
    reporter.endStep()
}

export async function CollapseSideBar() {
    reporter.startStep("Collapsing SIde bar")
    try {
        logger.info('CollapseSideBar')
        await (page
            .waitForXPath("//div[@title='Collapse']", { visible: true })
            .then(() => logger.info('Collapse'))
        )
        const [view] = await page.$x("//div[@title='Collapse']", { visible: true })

        await view.click()
        let screenshot = await customScreenshot('CollapseSideBar.png', 1366, 768)
        reporter.addAttachment("CollapseSideBar ", screenshot, "image/png");
        await delay(10000)
    } catch (err) {
        logger.error(err)
    }
    reporter.endStep()
}

export async function GetLogoImg() {
    reporter.startStep("Getting LOGO images from loaded page")
    logger.info('GetLogoImg')
    console.log(global.homeurl)
    //await page.reload()
    //page.goto(page.url())
    //page.goto(url)
    //logger.info('page reloaed')
    //await delay(1000)
    try {
        let screenshot = await customScreenshot('GetLogoImg.png', 1366, 768)
        const elemExists = await page.waitForXPath("//div[@class='logo']//img[1]", { timeout: 30000 }) ? true : false;
        //console.log(elemExists)
        if (elemExists == true) {
            let imgs = await page.$$eval('img.App-logo[src]', imgs => imgs.map(img => img.getAttribute('src')));
            await delay(1000)
            reporter.addAttachment("GetLogoImg", screenshot, "image/png");
            reporter.endStep()
            logger.info(imgs)
            return imgs
        } else {
            logger.info('no logo')
            return []
        }
    } catch (TimeOutException) {
        //logger.error(err)
        return []
    }
}

const testIotium = require('../src/testIotium');

export async function LoginAs(scope) {
    console.log('inside LoginAs ' + scope)
    try {
        const elemXPath = "//button[contains(@title, 'My Account')]"
        const elemExists = await page.waitForXPath(elemXPath, { timeout: 30000 }) ? true : false;
        console.log(elemExists)
        if (elemExists == true) {
            console.log('logging out current session')
            expect(elemExists).toBe(true)
            await expect(page).toClick('button[title="My Account"]')
            await page.waitFor(1000)

            await (page
                .waitForXPath("//span[text()='Logout']", { visible: true })
                .then(() => logger.info('logout seen, clicking...')))
            const [view] = await page.$x("//span[text()='Logout']", { visible: true })
            await view.click()

            //var jsonStr = "{ text: 'Logout' }"
            //await expectToClick('span', jsonStr)
            //await page.waitFor(2000)
            //perf
            logger.info(await testIotium(page));
            //perf
            //await customScreenshot('loggedout.png', 1366, 768)
            console.log('logout')
        }
        let login
        login = new Login();
        console.log("global.env = " + global.env)
        console.log("scope = " + scope)
        //let screenshot = await customScreenshot('LoginAs.png', 1366, 768)
        await login.launch(global.env, scope)
        //reporter.addAttachment("LoginAs ", screenshot, "image/png");
        await page.$x("//button[contains(@title, 'My Account')]", { visible: true, timeout: 30 })
    } catch (e) {
        console.log(e)
        expect(e).toMatch('error');
    }
}

export async function OpenEditOrg() {
    console.log('>>OpenEditOrg')
    try {

        reporter.startStep("Editing ORG")

        await expect(page).toClick('span.nav-text', { text: 'Orgs' })
        logger.info('Clicked on the Orgs');
        await page.waitFor(1000)
        /*
        logger.info('Searching for Orgs ', orgName);
        await expect(page).toFill('input[placeholder="Filter orgs by name"]', orgName)
        await page.waitFor(1000)
        try {
            await expect(page).toMatchElement('a', { text: orgName, timeout: '10000' })
            //await expect(page).toClick('a', { text: orgName })
            logger.info('org found')
        } catch (err) {
            logger.info('Org name not found in current page, try to paginate');
        }
        */
        try {
            await delay(1000)
            await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger"')
            await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger"')
            await delay(1000)
            await expect(page).toMatchElement('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
            await expect(page).toClick('button[class="ant-btn ant-dropdown-trigger ant-dropdown-open"')
            await delay(1000)
            logger.info('3dots found.')
            let screenshot = await customScreenshot('OpenEditOrg1.png', 1366, 768)
            await (page
                .waitForXPath("//button[contains(@title, 'Edit Org')]", { visible: true })
                .then(() => logger.info('Waiting for gear button to show Edit Org')))
            const [view] = await page.$x(".//button[contains(@title, 'Edit Org')]", { visible: true })
            await view.click()
            logger.info('edit org clicked')
            reporter.addAttachment("OpenEditOrg1 ", screenshot, "image/png");
            try {
                let screenshot1 = await customScreenshot('AdvancedSettings.png', 1366, 768)
                const divButton = (await page.$x("//div[text()='Advanced Settings']"))
                expect(divButton).not.toEqual([])
                if (divButton.length > 0) {
                    await divButton[0].click()
                } else {
                    throw new Error('click me div not found')
                }
                logger.info('found Advanced Settings')
                reporter.addAttachment("AdvancedSettings", screenshot1, "image/png");
            } catch (err) {
                logger.error('Advanced Settings not found');
            }
            let screenshot2 = await customScreenshot('BrandingButton.png', 1366, 768)
            const b = (await page.$x("//button[@id='branding']"))
            const className = await b[0].getProperty('className')
            const description = await b[0].getProperty('description')
            //console.log(className._remoteObject.value)
            var value = className._remoteObject.value
            //console.log(value)
            reporter.addAttachment("BrandingButton", screenshot2, "image/png");
            reporter.endStep()
            //await page.waitFor(10000)
            await expect(page).toMatchElement('span', { text: 'Cancel' })
            await expect(page).toClick('span', { text: 'Cancel' })
            logger.info('org edit form Cancel')
            await page.waitFor(10000)

            var value_array = value.trim().split(" ");
            //console.log(value_array)
            //expect(value_array).toContain('ant-switch-disabled')
            //console.log((value_array.indexOf('ant-switch-disabled') > -1))

            Array.prototype.contains = function (element) {
                return this.indexOf(element) > -1;
            };
            return (value_array.contains('ant-switch-disabled'))

        } catch (err) {
            logger.error(err)
            return false
        }
    }
    catch (err) {
        logger.info(err);
        return false
    }

}

export async function IsBrandingEnabled() {
    //return True if enabled
    // return False if disable
    // return null if error
    logger.info('To Check if branding icon is enabled or not')
    console.log('IsBrandingEnabled')
    //reporter.startStep("Editing ORG")
    var state = await OpenEditOrg()
    console.log('state=' + state)
    //reporter.endStep()
    return state
}

export async function addMyOrg(orgAdd) {
    try {
        reporter.startStep("Adding org")
        logger.info("In addOrg:",orgAdd)

        var action;
        action = await performAction("type", addOrg.input.name, "page", orgAdd.org_name)
        expect(action).toBeTruthy() 
        action = await performAction("type", addOrg.input.billing_name, "page", orgAdd.billing_name)
        expect(action).toBeTruthy()
        action = await performAction("type", addOrg.input.billing_email, "page", orgAdd.billing_email)
        expect(action).toBeTruthy() 
        action = await performAction("type", addOrg.input.domain_name, "page", orgAdd.domain_name)
        expect(action).toBeTruthy()
        var navigated = await navigatePageByClick(addOrg.button.addOrg)
        expect(navigated).toBeTruthy()
        reporter.endStep();
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function addOrgError(orgAdd,error) {
    try {
        reporter.startStep("Adding org")
        logger.info("In addOrg:",orgAdd)

        var action;
        action = await performAction("type", addOrg.input.name, "page", orgAdd.org_name)
        expect(action).toBeTruthy() 
        action = await performAction("type", addOrg.input.billing_name, "page", orgAdd.billing_name)
        expect(action).toBeTruthy()
        action = await performAction("type", addOrg.input.billing_email, "page", orgAdd.billing_email)
        expect(action).toBeTruthy() 
        action = await performAction("type", addOrg.input.domain_name, "page", orgAdd.domain_name)
        expect(action).toBeTruthy()
        var navigated = await navigatePageByClick(addOrg.button.addOrg)
        expect(navigated).toBeTruthy()
        const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-error']//span[text()='"+error+"']", {timeout: 10000}) ? true : false;
        expect(elemExists).toBe(true)
        reporter.endStep();
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function cleanupOrg(orgName) {
    try {
        let result = await goToOrg(orgName)
        expect(result).toBe(true)
        result = await deleteOrg(orgName)
        expect(result).toBe(true)
        await delay(5000)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}