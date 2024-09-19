import { logger } from "../log.setup";
import { _post, _get, _delete } from "../api/api"
const axios = require('axios');


export async function api_v1_users_get() {
    logger.info("Entering: helper/otaapiuser.js/api_v1_users_get");
    return new Promise((resolve, reject) => {
        _get('api/v1/users').then(resp => {
            logger.info('Returning resp object')
            resolve(resp)
        }).catch(error => {
            logger.error(error)
            reject(error)
        })
    }
    )
}

export async function api_v1_users_id_grouproles_get(id) {
    logger.info("Entering: helper/otaapiuser.js/api_v1_users_id_grouproles_get");
    return new Promise((resolve, reject) => {
        _get('api/v1/users/' + id + '/grouproles').then(resp => {
            logger.info('Returning resp object')
            resolve(resp)
        }).catch(error => {
            logger.error(error)
            reject(error)
        })
    }
    )
}

export async function api_v1_users_post(data) {
    logger.info("Entering: helper/otaapiuser.js/api_v1_users_post");
    await _post('api/v1/users', data).then(resp => {
        logger.info('Returning resp object')
        return resp
    }).catch(error => {
        logger.error(error)
    })
}

export async function api_v1_users_id_grouproles_post(id, data) {
    logger.info("Entering: helper/otaapiuser.js/api_v1_users_id_grouproles_post");
    await _post('api/v1/users/' + id + '/grouproles', data).then(resp => {
        logger.info('Returning resp object ' + resp.data)
        return resp
    }).catch(error => {
        logger.error(error)
    })
}

export async function api_v1_users_user_id_delete(id) {
    logger.info("Entering: helper/otaapiuser.js/api_v1_users_user_id_delete");
    return new Promise((resolve, reject) => {
        _delete('api/v1/users/' + id).then(resp => {
            logger.info('Returning resp object')
            resolve(resp)
        }).catch(error => {
            logger.error(error)
            reject(error)
        })
    }
    )
}

export async function api_v1_users_user_id_get(id) {
    logger.info("Entering: helper/otaapiuser.js/api_v1_users_user_id_get");
    return new Promise((resolve, reject) => {
        _get('api/v1/users/' + id).then(resp => {
            logger.info('Returning resp object')
            resolve(resp)
        }).catch(error => {
            logger.error(error)
            reject(error)
        })
    }
    )
}

export async function getUserId() {
    logger.info("Entering: helper/otaapiuser.js/getUserId");
    var id = []
    await api_v1_users_get().then(resp => {
        let obj = resp.data.data
        let aaa = obj.filter(element => {
            if (element.firstName === "Api") {
                return element
            }
        });

        if (aaa.length > 0) {
            aaa.forEach(element => {
                //logger.info(element.objectGUID)
                id.push(element.objectGUID)
            });
        }
    }).catch(error => {
        logger.error(error)
    })
    return id
}


export async function getUserIdGroupRoles(id) {
    logger.info("Entering: helper/otaapiuser.js/getUserIdGroupRoles");
}

