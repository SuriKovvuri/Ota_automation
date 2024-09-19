import { delay, customScreenshot, performAction, navigatePageByClick, getEnvConfig } from "../../utils/utils";
import { logger } from "../log.setup";
import { leftpane, addUserForm, changePasswordForm, userChangePasswordModal } from "../constants/locators";

export const fullname_error = "Full name must not contain any special characters."
export const email_error = "Please enter your email address."
export const email_info = "An email will be sent to this address with a link to verify the email address. User must verify this email address before logging in."
export const password_error = "Password must at least be 12 characters long, contain at least one upper case alphabet, at least one number, and at least one special character. The only special characters allowed are ! @ # $ & * _"
export const confirmpsw_error = "Confirm Password does not match the password"

export async function gotoAddUser()

{
    reporter.startStep("I click Add User button");
    await expect(page).toClick('span', { text: 'Users' })
    await page.waitFor(1000)
    
    logger.info('clicked the users');
    let navigated = await navigatePageByClick(leftpane.li.allUsers)
    expect(navigated).toBeTruthy()
    logger.info('clicked the Add user ALL Users');
    
    //reporter.startStep("Add User");
    await expect(page).toClick('button[title="Add User"]')
    await delay(1000)
    reporter.endStep()
}

export async function addUser(userAdd)
{
    await gotoAddUser()
    reporter.startStep(`Adding User ${userAdd.getfullname()}`)
    await expect(page).toFill('input[placeholder="Full Name"]', userAdd.getfullname())
    await expect(page).toFill('input[placeholder="Email Address"]', userAdd.getemail())
    await expect(page).toFill('input[placeholder="Password"]', userAdd.getpassword())
    await expect(page).toFill('input[placeholder="Confirm Password"]', userAdd.getconfirmpsw())
    await expect(page).toClick('div.ant-select-selection__placeholder',{text: 'Select Role'})
    logger.info("before select role ", userAdd.getrole())
    await expect(page).toClick('li', {text: userAdd.getrole()})
    logger.info("after select role ", userAdd.getrole())
    let timeZone = await page.$x("//div[text()='Time Zone'][@class='ant-select-selection__placeholder']//parent::div[@class='ant-select-selection__rendered']")
    logger.info(timeZone.length)
    await timeZone[0].click()
    //await expect(page).toClick('div.ant-select-selection__placeholder',{text: 'Time Zone'})
    logger.info("clicked dropdown of timezone")
    await expect(page).toClick('li', {text: userAdd.gettimezone()})
    await expect(page).toClick('div.ant-modal-footer span', { text: 'Add User', visible: true})
    await expect(page).toMatchElement('.ant-message > span', { text: 'Successfully created user and sent a link to verify the email address.', timeout: 20000 })
    let screenshot = await customScreenshot('useradd_'+ userAdd.getfullname() + '.png', 1920, 1200)
    reporter.addAttachment("Add User " + userAdd.getfullname(), screenshot, "image/png");
    reporter.endStep()
}

export async function goToUser(userName) {
    try{
        logger.info("in goToUser")
        //const elemXPath1 = "//ul[contains(@id, 'inodes$Menu') and contains(@class, 'ant-menu ant-menu-sub ant-menu-hidden ant-menu-inline')]"
        const elemXPath1 = "//span[span= 'Users']//ancestor::li[contains(@class, 'ant-menu-submenu-open')]"
        const elemExists1 = await page.$x(elemXPath1)
        logger.info(elemExists1)
        if (elemExists1.length == 0) {
            logger.info('All Users tab not open')
            await expect(page).toClick('span.nav-text', { text: 'Users' })
            //await page.waitFor(2000)
        }
        //const elemXPath2 = "//span[contains(., 'All Users')]"
        //const elemExists2 = await page.waitForXPath(elemXPath2, {timeout: 10000}) ? true : false;
        //logger.info('In function getNodeFromAllNodes all iNodes = ', elemExists2);
        await expect(page).toClick('span', { text: 'All Users' })
        //await page.waitForNavigation();
        logger.info('Clicked on All Users waiting for Name to appear in Users table listing');
        //await expect(page).toMatchElement('span.ant-table-column-title', { text: 'Name' })
        //await expect(page).toMatchElement('label.ant-checkbox-wrapper > span', { text: "Also show child orgs' iNodes" })
        logger.info("In the function goToUser userName = "+userName)
        await page.waitFor(2000)
        //use the page filter to avoid scrolling
        await expect(page).toFill('input[placeholder="Filter users by full name"]', userName)
        logger.info("In the function goToUser Matched userName = "+userName)
        //Match the row with that node and select delete button.
        let pathVar = `//strong[text()="${userName}"]//ancestor::tr[contains(@class,'ant-table-row-level-0')]`
        let rowExists = await page.waitForXPath(pathVar, {timeout: 3000})
        //logger.info("after xpath")

        if (rowExists != null){
            logger.info("User found ", userName)
            let row = await page.$x(pathVar)
            return row[0]
        } else {
            logger.info("User not found/deleted ", userName)
            return false
        }
        } catch(err) {
            logger.info(err)
            return false
        }
}

export async function goToUserAction(userName, action) {
    reporter.startStep(`Action ${action} on User ${userName}`)
    let user = await goToUser(userName)
    //const netGear = await user.$('button.ant-dropdown-trigger', { visible: true })
    //await netGear.hover()
    if (action == "delete") {

        await expect(user).toClick("span.ant-checkbox")
        await (page
            .waitForXPath("//button[contains(@title, 'Delete User?')]", { visible: true })
            .then(() => logger.info('Waiting for gear button to show Delete User')))

        const view = await page.$x(".//button[@title='Delete User?']", { visible: true })
        //await view.focus()
        //await view.click({clickCount: 2, button: "middle", delay:10})
        logger.info(view.length)
        await view[0].click()
        logger.info('Clicked Delete User ', view)
        await expect(page).toMatchElement('div.ant-modal-footer span', { text: 'Delete User' })
        await expect(page).toClick('div.ant-modal-footer span', { text: 'Delete User' })
        await expect(page).toMatchElement('.ant-message > span', { text: 'Deleted successfully', timeout: 20000 })
    } else {
        logger.error("action not defined", action)
        expect(true).toBe(false)
    }
    let screenshot = await customScreenshot('useraction_'+ userName + '.png', 1920, 1200)
    reporter.addAttachment("Action on User " + userName, screenshot, "image/png");
    reporter.endStep()
}

export async function addMyUser(userAdd) {
    try {
        reporter.startStep("Adding user")
        logger.info("In userAdd:",userAdd)
        var action;
        action = await performAction("type", addUserForm.input.name, "page", userAdd.getfullname())
        expect(action).toBeTruthy() 
        action = await performAction("type", addUserForm.input.email, "page", userAdd.getemail())
        expect(action).toBeTruthy()
        action = await performAction("type", addUserForm.input.password, "page", userAdd.getpassword())
        expect(action).toBeTruthy() 
        action = await performAction("type", addUserForm.input.confirm_password, "page", userAdd.getconfirmpsw())
        expect(action).toBeTruthy()
        action = await performAction("click", addUserForm.div.role)
        expect(action).toBeTruthy()
        action = await performAction("click", "//li[@name='"+userAdd.getrole()+"']")
        expect(action).toBeTruthy()
        var navigated = await navigatePageByClick(addUserForm.button.addUser)
        expect(navigated).toBeTruthy()
        reporter.endStep();
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function execute_cmd(host, username, cmds, pem=null) {
    try {
        var rexec = require('remote-exec');
        var connection_options = {
            port: 22,
            username: username,
            privateKey: require('fs').readFileSync(pem)
        };

        var hosts = [
            host
        ];

        rexec(hosts, cmds, connection_options, function(err, stdout){
            if(err) {
                logger.error(err);
                return false;
            } else {
                return true;
            }
        });
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
}

export async function verifyUserEmail(username, emailVerified=true, forceChangePassword=true) {
    try {
        let config = await getEnvConfig()
        logger.info(config)
        let scriptFilename = config.jumphost.dbScriptPath
        
        //Printing user document before modifying it
        var query = "{\\'username\\':\\'"+username+"\\'}"
        var cmd = 'python '+scriptFilename+' '+config.db.username+' '+config.db.password+' '+config.db.host_and_port+' '+config.db.db_name+' user find_one '+query
        var output = execute_cmd(config.jumphost.host,config.jumphost.username,[cmd],"pem/"+config.jumphost.pem)
        if(output == false) {
            logger.error("Unable to Execute find_one query on user document before modifying")
            return false
        }

        //Modifying user document for new user
        var email = 'False'
        var changepwd = 'False'
        if (emailVerified) {
            email = 'True'
        }
        if (forceChangePassword) {
            changepwd = 'True'
        }
        query = "{\\'username\\':\\'"+username+"\\'}"
        var setValues = "\{\\'\\$set\\':\\{\\'emailVerified\\':"+email+",\\'forceChangePassword\\':"+changepwd+"\\}\\}"
        cmd = 'python '+scriptFilename+' '+config.db.username+' '+config.db.password+' '+config.db.host_and_port+' '+config.db.db_name+' user update_one '+query+' '+setValues
        var output = execute_cmd(config.jumphost.host,config.jumphost.username,[cmd],"pem/"+config.jumphost.pem)
        if(output == false) {
            logger.error("Unable to Execute update_one query on user document")
            return false
        }

        //Printing user document after modifying it
        query = "{\\'username\\':\\'"+username+"\\'}"
        cmd = 'python '+scriptFilename+' '+config.db.username+' '+config.db.password+' '+config.db.host_and_port+' '+config.db.db_name+' user find_one '+query
        var output = execute_cmd(config.jumphost.host,config.jumphost.username,[cmd],"pem/"+config.jumphost.pem)
        if(output == false) {
            logger.error("Unable to Execute find_one query on user document after modifying")
            return false
        }

        return true
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }

}

export async function changeUserPassword(changePassword,userChangePassword=false,last3PasswordError=false) {
    try {
        var action;
        logger.info("Old password:"+changePassword.getOldPassword())
        logger.info("New password:"+changePassword.getNewPassword())
        if (userChangePassword = false) {
            action = await performAction("type", changePasswordForm.input.old_password, "page", changePassword.getOldPassword())
            expect(action).toBeTruthy() 
            action = await performAction("type", changePasswordForm.input.new_password, "page", changePassword.getNewPassword())
            expect(action).toBeTruthy()
            action = await performAction("type", changePasswordForm.input.confirm_password, "page", changePassword.getConfirmPassword())
            expect(action).toBeTruthy() 
            var navigated = await navigatePageByClick(changePasswordForm.button.change)
            expect(navigated).toBeTruthy()
        } else {
            action = await performAction("type", userChangePasswordModal.input.old_password, "page", changePassword.getOldPassword())
            expect(action).toBeTruthy() 
            action = await performAction("type", userChangePasswordModal.input.new_password, "page", changePassword.getNewPassword())
            expect(action).toBeTruthy()
            action = await performAction("type", userChangePasswordModal.input.confirm_password, "page", changePassword.getConfirmPassword())
            expect(action).toBeTruthy() 
            var navigated = await navigatePageByClick(userChangePasswordModal.button.change)
            expect(navigated).toBeTruthy()
        }
        if (last3PasswordError) {
            const elemExists = await page.waitForXPath(userChangePasswordModal.span.sameAsLast3Passwords, {timeout: 10000}) ? true : false;
            expect(elemExists).toBe(true)
        } else {
            const elemExists = await page.waitForXPath(userChangePasswordModal.span.success, {timeout: 10000}) ? true : false;
            expect(elemExists).toBe(true)
        }
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function addUserError(userAdd,error) {
    try {
        logger.info("In addUserError:",userAdd)
        var action;
        action = await performAction("type", addUserForm.input.name, "page", userAdd.getfullname())
        expect(action).toBeTruthy() 
        action = await performAction("type", addUserForm.input.email, "page", userAdd.getemail())
        expect(action).toBeTruthy()
        action = await performAction("type", addUserForm.input.password, "page", userAdd.getpassword())
        expect(action).toBeTruthy() 
        action = await performAction("type", addUserForm.input.confirm_password, "page", userAdd.getconfirmpsw())
        expect(action).toBeTruthy()
        action = await performAction("click", addUserForm.div.role)
        expect(action).toBeTruthy()
        action = await performAction("click", "//li[@name='"+userAdd.getrole()+"']")
        expect(action).toBeTruthy()
        var navigated = await navigatePageByClick(addUserForm.button.addUser)
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
