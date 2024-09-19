import { logger } from "../log.setup";
import { _post, _get } from "../api/api"
const axios = require('axios');


export async function api_v1_myauthgrouproles_get() {
    logger.info("Entering: helper/otagroupprofileapi.js/api_v1_myauthgrouproles_get");
    return new Promise((resolve, reject) => {
        _get('api/v1/myauthgrouproles').then(resp => {
            resolve(resp)
        }).catch(error => {
            logger.error(error)
            reject(error)
        })
    }
    )
}
