import { delay, findByLink, getEnvConfig, customScreenshot, getElementHandleByXpath, performAction, navigatePageByClick } from '../../utils/utils';
import { logger } from '../log.setup';
import { addClusterForm, leftpane, clusters } from '../constants/locators';
import { ClusterAdd } from '../src/clusterAdd';
import { goToOrg } from "./org";

export async function goToClusters()
{
    try {
        
        await expect(page).toClick('span.nav-text', { text: 'Clusters' })
        logger.info('Clicked on the Clusters');
        await page.waitFor(1000)
    }
    catch(err) {
        logger.info(err);
      }
}


export async function goToCluster(clusterName)
{
    try {

    logger.info("in goToCluster")
    await expect(page).toClick('span', { text: 'Clusters' })

    //await page.waitForNavigation();
    logger.info('Clicked on Clusters waiting for Name to appear in Cluster table listing');
    await expect(page).toMatchElement('span.ant-table-column-title', { text: 'Name' })
    await expect(page).toMatchElement('label.ant-checkbox-wrapper > span', { text: "Also show child orgs' Clusters" })
    logger.info("In the function goToCluster clustername = "+clusterName)
    

    await page.waitFor(2000)
    //use the page filter to avoid scrolling
    await expect(page).toFill('input[placeholder="Filter Cluster by name"]', clusterName)
    //await page.waitFor(2000)
    await expect(page).toMatchElement('a', { text: clusterName })
    const cluster = await findByLink(page, clusterName)
    
    await cluster.focus()
    await cluster.click({waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'], delay:10})

    await expect(page).toMatchElement('.ant-card-head-title', { text: "Cluster Overview" })
    await expect(page).toMatchElement('.chartjs-size-monitor')
    await delay(2000)
    logger.info("In the function Clicked goToCluster clustername ="+clusterName)

    }
    catch(err) {
        logger.error(err);
        expect(true).toBe(false)
      }

}

export async function addCluster(clusterAdd) {
    try {
        logger.info("In addCluster:",clusterAdd)
        var action;
        let navigated;
        var handle;
        action = await performAction("type", addClusterForm.input.clusterName, "page", clusterAdd.getname())
        expect(action).toBeTruthy() 
        let nodes = clusterAdd.getnodes()
        for (let i=0;i<nodes.length;i++) {
            logger.info("Node details:"+nodes[i])
            let node = nodes[i]
            action = await performAction("click", addClusterForm.button.addiNode)
            expect(action).toBeTruthy()
            action = await performAction("click", addClusterForm.input.selectInode)
            expect(action).toBeTruthy()
            //clicking twice intentionally as search doesn't work sometimes
            action = await performAction("click", addClusterForm.input.selectInode)
            expect(action).toBeTruthy()
            action = await performAction("type", addClusterForm.input.selectInode, "page", node["name"])
            expect(action).toBeTruthy()
            action = await performAction("click", "//li[@class='ant-cascader-menu-item']//span[text()='"+node["name"]+"']")
            expect(action).toBeTruthy()
            let checked = "//input[contains(@title,'"+node["name"]+"')]//ancestor::tr//span[@class='ant-checkbox ant-checkbox-checked']//following-sibling::span[text()='Candidate']"
            let unchecked = "//input[contains(@title,'"+node["name"]+"')]//ancestor::tr//span[@class='ant-checkbox']//following-sibling::span[text()='Candidate']"

            if (node["isCandidate"] != "true") {
                handle = await getElementHandleByXpath(checked, page, {timeout : 100})
                if (handle && handle.length > 0) {
                    action = await performAction("click", checked)
                    expect(action).toBeTruthy()
                }
            } else {
                handle = await getElementHandleByXpath(unchecked, page, {timeout : 100})
                if (handle && handle.length > 0) {
                    action = await performAction("click", unchecked)
                    expect(action).toBeTruthy()
                }
                let priorityPath = "//input[contains(@title,'"+node["name"]+"')]//ancestor::tr//input[@value='100' and @role='spinbutton']"
                action = await performAction("type", priorityPath, "page", node["priority"], true)
                expect(action).toBeTruthy()
            }
        }
        navigated = await performAction("click", addClusterForm.button.save)
        expect(navigated).toBeTruthy()
        const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-success']//span[text()='"+clusterAdd.getname()+" created successfully']", {timeout: 10000}) ? true : false;
        expect(elemExists).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function addClusterError(clusterAdd,error) {
    try {
        logger.info("In addClusterError:",clusterAdd)
        var action;
        action = await performAction("type", addClusterForm.input.clusterName, "page", clusterAdd.getname())
        expect(action).toBeTruthy() 
        
        var navigated = await navigatePageByClick(addClusterForm.button.save)
        expect(navigated).toBeTruthy()
        const elemExists = await page.waitForXPath("//div[@class='ant-message-custom-content ant-message-error']//span[text()='"+error+"']", {timeout: 10000}) ? true : false;
        expect(elemExists).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}

export async function cleanupCluster(clusterName,orgName) {
    try {
        //goto org
        let result;
        var action;
        if (orgName != "") {
            result = await goToOrg(orgName)
            expect(result).toBe(true)
        }

        //goto clusters page
        let navigated = await navigatePageByClick(leftpane.li.clusters)
        expect(navigated).toBeTruthy()

        //delete cluster
        let elemXPath = "//td//a[text()='"+clusterName+"']//ancestor::tr//input[@class='ant-checkbox-input']"
        action = await performAction("click", elemXPath , "page")
        expect(action).toBeTruthy()
        action = await performAction("click", clusters.button.deleteClusters , "page")
        expect(action).toBeTruthy()
        await delay(3000)
        action = await performAction("click", clusters._delete_modal.delete , "page")
        expect(action).toBeTruthy()
        result = await page.waitForXPath(clusters._delete_modal.success, {timeout: 10000}) ? true : false;
        expect(result).toBe(true)
    }
    catch(err) {
        logger.error("Exception caught: "+err)
        return false
    }
    return true
}