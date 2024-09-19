import { logger } from "../log.setup";

export class ChangePassword {

    constructor() {
        logger.info('In Class ChangePassword constructor')
    }
    setChangePassword(old_password, new_password, confirm_password) {
        this.old_password= old_password;
        this.new_password = new_password;
        this.confirm_password = confirm_password;
    }
    getOldPassword () {
        return this.old_password
    }
    getNewPassword () {
        return this.new_password
    }
    getConfirmPassword () {
        return this.confirm_password
    }
   
}