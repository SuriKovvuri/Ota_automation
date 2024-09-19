import { logger } from "../log.setup";

export class OrgAdd {

    constructor() {
        logger.info('CLass ORG constructor.')
    }
    setOrgAdd(org_name, billing_name, billing_email, domain_name) {
        this.org_name = org_name;
        this.billing_name = billing_name;
        this.billing_email = billing_email;
        this.domain_name = domain_name;
    }

    get_org_name() {
        return this.org_name
    }
    get_billing_name() {
        return this.billing_name
    }
    get_billing_email() {
        return this.billing_email
    }
    get_domain_name() {
        return this.domain_name
    }
}