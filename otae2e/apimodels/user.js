import { logger } from "../log.setup";

export class User {

    constructor() {
        logger.info('Class User Models Constructor.')
    }
    Payload(firstName, lastName, mail, orgId, password, scope, telephoneNumber, mfa) {
        this.firstName = firstName
        this.lastName = lastName
        this.mail = mail
        this.orgId = orgId
        this.password = password
        this.scope = scope
        this.telephoneNumber = telephoneNumber
    }

    get_firstName() {
        return this.firstName
    }
    get_lastName() {
        return this.lastName
    }
    get_mail() {
        return this.mail
    }
    get_orgId() {
        return this.orgId
    }
    get_password() {
        return this.password
    }
    get_scope() {
        return this.scope
    }
    get_telephoneNumber() {
        return this.telephoneNumber
    }

}