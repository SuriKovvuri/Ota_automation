const axios = require('axios');
import { logger } from "../log.setup";
const qs = require('qs')

export async function _post(url, payload) {
    logger.info("Entering: api/api.js/_post");
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: "POST",
            data: payload
        })
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error.response)
            });
    })
};

export async function _get(url) {
    logger.info("Entering: api/api.js/_get");
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: "GET"
        })
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error.response)
            });
    })
};

export async function _delete(url) {
    logger.info("Entering: api/api.js/_delete");
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: "DELETE"
        })
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error.response)
            });
    })
};