import { logger } from "../log.setup";
export class CSPAdd {
    constructor() {
        logger.info('Class CSPAdd constructor.')
    }

    setCSPAdd(name,fromNetworkLabel) {
        this.name = name;
        this.fromNetworkLabel = fromNetworkLabel
    }

    getname() {
        return this.name
    }
    
    getfromnetworklabel() {
        return this.fromNetworkLabel
    }
}