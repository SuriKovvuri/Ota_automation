import { logger } from "../log.setup";
export class VolumeAdd {
    constructor() {
        logger.info('Class VolumeAdd constructor.')
    }

    setVolumeAdd(volumename,filename,filecontent) {
        this.volumename = volumename;
        this.filename = filename;
        this.filecontent = filecontent;
    }

    getvolumename() {
        return this.volumename
    }
    getfilename() {
        return this.filename
    }
    getfilecontent() {
        return this.filecontent
    }
}