import { logger } from '../e2e/log.setup';
import { getEnvConfig, delay } from './utils';
import { network } from 'openstack-client/lib/neutron';
import { nullableTypeAnnotation } from '@babel/types';

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//require("tls").DEFAULT_ECDH_CURVE = "auto"

const https = require('https')
const axios = require('axios');
var config = getEnvConfig()
const header = {'Content-Type': 'application/json', 'Accept': 'application/json', 'X-API-KEY': ''}
const agent = new https.Agent({  
 rejectUnauthorized: false
});
export async function getApi(resource, filter=null, fullResponse=false, version="v2") {
    header["X-API-KEY"] = global.apiKey
    let options = {headers:header, httpsAgent:agent}
    let uri
    if (filter == null) {
        uri = `https://${global.orchIP}/api/${version}/${resource}?own=true&size=100`
    } else {
        uri = `https://${global.orchIP}/api/${version}/${resource}?${filter}&size=100`
    }
    logger.info(uri)
    logger.info(header)
    let res = await axios.get(uri, options).catch(error => {
        console.log(error);
        return error.response
    })
    //logger.info(res.data.results)
    if (fullResponse == true)
    {
        return res.data
    }
    return res
}

export async function deleteApi(resource, resource_id) {
    header["X-API-KEY"] = global.apiKey
    let options = {headers:header, httpsAgent:agent}
    let res = await axios.delete(`https://${global.orchIP}/api/v1/${resource}/${resource_id}`, options).catch(error => {
        console.log(error);
        return error.response
    })    
    return res
}

export async function deleteNetworksInNode(node_name){
    logger.info("in deleteNetworksInNode")
    logger.info(node_name)
    let retStatus = []
    let node_list = await getApi("node")
    var exp_node
    for (let node of node_list.data.results) {
        if (node.name == node_name){
            logger.info(node.networks)
            exp_node = node
            break}
    } 
    for (let network of exp_node.networks){
        if (network.name != "WAN Network"){
            let del = await deleteApi("network", network.id)
            retStatus.push(del.status)
        }
    } 
    logger.info(retStatus)
    let result = retStatus.every( e  => e == 200 )
    return result
}

export async function deleteServicesInNode(node_name){
    let retStatus = []
    let node_list = await getApi("node")
    var exp_node
    for (let node of node_list.data.results) {
        if (node.name == node_name){
            exp_node = node
            break}
    } 
    let service_list = await getApi("service", `node_id=${exp_node.id}`)
    for (let service of service_list.data.results){
        let del = await deleteApi("service", service.id)
        retStatus.push(del.status)
    }
    logger.info(retStatus)
    let result = retStatus.every( e  => e == 200 )
    await delay(5000)
    return result
}
