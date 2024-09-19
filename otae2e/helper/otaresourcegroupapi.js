import { logger } from "../log.setup";
import { _post, _get, _delete } from "../api/api"
const axios = require('axios');


export async function api_v1_groups_get() {
    logger.info("Entering: helper/otaapiuser.js/api_v1_groups_get");
    return new Promise((resolve, reject) => {
        _get('api/v1/groups').then(resp => {
            resolve(resp)
        }).catch(error => {
            logger.error(error)
            reject(error)
        })
    }
    )
}

export async function api_v1_resourcegroups_id_get(id) {
    logger.info("Entering: helper/otaapiuser.js/api_v1_resourcegroups_id_get");
    return new Promise((resolve, reject) => {
        _get('api/v1/resourcegroups/'+id).then(resp => {
            resolve(resp)
        }).catch(error => {
            logger.error(error)
            reject(error)
        })
    }
    )
}

export async function api_v1_resourcegroups_id_delete(id) {
    logger.info("Entering: helper/otaapiuser.js/api_v1_resourcegroups_id_delete");
    return new Promise((resolve, reject) => {
        _delete('api/v1/resourcegroups/'+id).then(resp => {
            resolve(resp)
        }).catch(error => {
            logger.error(error)
            reject(error)
        })
    }
    )
}


export async function api_v1_resourcegroups_post(data) {
    logger.info("Entering: helper/otaapiuser.js/api_v1_resourcegroups_post");
    return new Promise((resolve, reject) => {
        _post('api/v1/resourcegroups', data).then(resp => {
            resolve(resp)
        }).catch(error => {
            logger.error(error)
            reject(error)
        })
    }
    )
}


