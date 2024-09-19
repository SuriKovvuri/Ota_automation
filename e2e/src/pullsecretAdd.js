import { logger } from "../log.setup";
export class PullSecretAdd {
    constructor() {
        logger.info('Class PullSecretAdd constructor.')
    }

    setPullSecretAdd(pullsecretname,dockerconfig) {
        this.pullsecretname = pullsecretname;
        this.dockerconfig = dockerconfig
    }

    getpullsecretname() {
        return this.pullsecretname
    }
    
    getdockerconfig() {
        return this.dockerconfig
    }
}