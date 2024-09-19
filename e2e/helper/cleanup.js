import { logger } from "../log.setup";
import { cleanupPullSecret } from "./pullsecrets";
import { cleanupVolume } from "./volumes";
import { cleanupCluster } from "./cluster";
import { cleanupAlert } from "./alert";
import { cleanupNode } from "./node";
import { cleanupSSHKey } from "./sshkey";
import { cleanupSerialNumber } from "./serialnumbers";
import { cleanupCustomSecurityPolicy } from "./csp";
import { cleanupOrg } from "./org"

export async function cleanup(resources) {
    let failure = 0;
    logger.info("In cleanup:",resources)

    //pullsecret
    if ("pullSecrets" in resources) {
        let pullSecrets = resources["pullSecrets"]
        for (let i = 0; i < pullSecrets.length; i++) {
            let result = await cleanupPullSecret(pullSecrets[i]["pullSecretName"],pullSecrets[i]["orgName"])
            if (!result) {
                logger.error("Unable to delete pull secret: "+pullSecrets[i]["pullSecretName"]+" from org: "+pullSecrets[i]["orgName"])
                failure += 1
            } else {
                logger.info("Deleted pull secret: "+pullSecrets[i]["pullSecretName"]+" from org: "+pullSecrets[i]["orgName"])
            }
        }
    }
    
    //volume
    if ("volumes" in resources) {
        let volumes = resources["volumes"]
        for (let i = 0; i < volumes.length; i++) {
            let result = await cleanupVolume(volumes[i]["volumeName"],volumes[i]["orgName"])
            if (!result) {
                logger.error("Unable to delete volume: "+volumes[i]["volumeName"]+" from org: "+volumes[i]["orgName"])
                failure += 1
            } else {
                logger.info("Deleted volume: "+volumes[i]["volumeName"]+" from org: "+volumes[i]["orgName"])
            }
        }
    }

    //cluster
    if ("clusters" in resources) {
        let clusters = resources["clusters"]
        for (let i = 0; i < clusters.length; i++) {
            let result = await cleanupCluster(clusters[i]["clusterName"],clusters[i]["orgName"])
            if (!result) {
                logger.error("Unable to delete cluster: "+clusters[i]["clusterName"]+" from org: "+clusters[i]["orgName"])
                failure += 1
            } else {
                logger.info("Deleted cluster: "+clusters[i]["clusterName"]+" from org: "+clusters[i]["orgName"])
            }
        }
    }

    //node
    if ("nodes" in resources) {
        let nodes = resources["nodes"]
        for (let i = 0; i < nodes.length; i++) {
            let result = await cleanupNode(nodes[i]["nodeName"],nodes[i]["orgName"])
            if (!result) {
                logger.error("Unable to delete node: "+nodes[i]["nodeName"]+" from org: "+nodes[i]["orgName"])
                failure += 1
            } else {
                logger.info("Deleted node: "+nodes[i]["nodeName"]+" from org: "+nodes[i]["orgName"])
            }
        }
    }

    //ssh key
    if ("sshKeys" in resources) {
        let sshKeys = resources["sshKeys"]
        for (let i = 0; i < sshKeys.length; i++) {
            let result = await cleanupSSHKey(sshKeys[i]["sshKeyName"],sshKeys[i]["orgName"])
            if (!result) {
                logger.error("Unable to delete ssh key: "+sshKeys[i]["sshKeyName"]+" from org: "+sshKeys[i]["orgName"])
                failure += 1
            } else {
                logger.info("Deleted ssh key: "+sshKeys[i]["sshKeyName"]+" from org: "+sshKeys[i]["orgName"])
            }
        }
    }

    //serial numbers
    if ("serialNumbers" in resources) {
        let serialNumbers = resources["serialNumbers"]
        for (let i = 0; i < serialNumbers.length; i++) {
            let result = await cleanupSerialNumber(serialNumbers[i]["hsn"],serialNumbers[i]["orgName"])
            if (!result) {
                logger.error("Unable to delete HSN: "+serialNumbers[i]["hsn"]+" from org: "+serialNumbers[i]["orgName"])
                failure += 1
            } else {
                logger.info("Deleted HSN: "+serialNumbers[i]["hsn"]+" from org: "+serialNumbers[i]["orgName"])
            }
        }
    }

    //alert
    if ("alerts" in resources) {
        let alerts = resources["alerts"]
        for (let i = 0; i < alerts.length; i++) {
            let result = await cleanupAlert(alerts[i]["alertName"])
            if (!result) {
                logger.error("Unable to delete alert: "+alerts[i]["alertName"])
                failure += 1
            } else {
                logger.info("Deleted alert: "+alerts[i]["alertName"])
            }
        }
    }
    
    //CSP
    if ("customSecurityPolicies" in resources) {
        let customSecurityPolicies = resources["customSecurityPolicies"]
        for (let i = 0; i < customSecurityPolicies.length; i++) {
            let result = await cleanupCustomSecurityPolicy(customSecurityPolicies[i]["customSecurityPolicyName"],customSecurityPolicies[i]["orgName"])
            if (!result) {
                logger.error("Unable to delete CSP: "+customSecurityPolicies[i]["customSecurityPolicyName"]+" from org: "+customSecurityPolicies[i]["orgName"])
                failure += 1
            } else {
                logger.info("Deleted CSP: "+customSecurityPolicies[i]["customSecurityPolicyName"]+" from org: "+customSecurityPolicies[i]["orgName"])
            }
        }
    }

    //org
    if ("orgs" in resources) {
        let orgs = resources["orgs"]
        for (let i = 0; i < orgs.length; i++) {
            let result = await cleanupOrg(orgs[i]["orgName"])
            if (!result) {
                logger.error("Unable to delete org: "+orgs[i]["orgName"])
                failure += 1
            } else {
                logger.info("Deleted org: "+orgs[i]["orgName"])
            }
        }
    }

    if (failure > 0) {
        logger.error("Number of Cleanup errors:"+failure)
        return false
    } else {
        logger.info("Cleanup successful.")
        return true
    }
}
