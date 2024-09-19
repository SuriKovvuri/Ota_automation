import { logger } from "../log.setup";
export class ClusterAdd {
    constructor() {
        logger.info('Class ClusterAdd constructor.')
    }

    setClusterAdd(name,nodes=[]) {
        this.name = name;
        this.nodes = nodes;      
    }

    getname() {
        return this.name
    }

    getnodes() {
        return this.nodes
    }
}