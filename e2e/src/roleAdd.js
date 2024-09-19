import { logger } from "../log.setup";
export class RoleAdd {
    constructor() {
        logger.info('Class RoleAdd constructor.')
    }

    setRoleAdd(rolename, description, permissions) {
        this.rolename= rolename;
        this.description = description;
        this.permissions = permissions;
    }

    getrolename() {
        return this.rolename
    }

    getdescription() {
    return this.description
    }

    getpermissions() {
        return this.permissions
    }
}