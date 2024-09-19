import { logger } from '../e2e/log.setup';
import { leftpane, dashboard, allInodes, serialNumbers, modals, addUserForm, addRoleForm } from '../e2e/constants/locators'
import { specialChars, addiNodeFormConst, addUserFormConst, addNetworkFormConst, addOrgFormConst, addCSPFormConst, addSerialFormConst, addSSHKeyFormConst, addRoleFormConst, addClusterFormConst, addPullSecretConst, addVolumeConst, addAlertFormConst } from '../e2e/constants/const';
import { modalProperties } from '../e2e/constants/modals';

var tempCount=1
const tempDir = 'tempImages'
var mongoclient

export function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

 export function getText(linkText) {
    linkText = linkText.replace(/\r\n|\r/g, "\n");
    linkText = linkText.replace(/\ +/g, " ");
  
    // Replace &nbsp; with a space 
    var nbspPattern = new RegExp(String.fromCharCode(160), "g");
    return linkText.replace(nbspPattern, " ");
  }
  
  // find the link, by going over all links on the page
  export async function findByLink(page, linkString) {
    const links = await page.$$('a')
    for (var i=0; i < links.length; i++) {
      let valueHandle = await links[i].getProperty('innerText');
      let linkText = await valueHandle.jsonValue();
      const text = getText(linkText);
      if (linkString == text) {
        logger.info(linkString);
        logger.info(text);
        logger.info("Found");
        return links[i];
      }
    }
    return null;
  }

  // find the link, by going over all links on the page
  export async function findBySelector(handle, selector, linkString) {
    logger.info('In the utils findBySelector selector = ', selector);
    logger.info('In the utils findBySelector linkString = ', linkString);
    const links = await handle.$$(selector)
    logger.info('In the utils findBySelector length = ', links.length);
    for (var i=0; i < links.length; i++) {
      let valueHandle = await links[i].getProperty('innerText');
      let linkText = await valueHandle.jsonValue();
      const text = getText(linkText);
      if (linkString == text) {
        logger.info(linkString);
        logger.info(text);
        logger.info("Found");
        return links[i];
      }
    }
    return null;
  }

  export async function customScreenshot(path, width=parseInt(global.width), height=parseInt(global.height)) {
    var pathjoin = require('path');
    await page.setViewport({ width: width, height: height});
    const name = pathjoin.join(tempDir,'image'+tempCount+'_'+path)
    const buffer = await page.screenshot({path: name, fullPage: true})
    await page.setViewport({ width: parseInt(global.width), height: parseInt(global.height)});//reverting to defaults
    logger.info('Created custom screenshot ', path)
    tempCount = tempCount + 1
    return buffer
  }

  export async function pathJoin(path) {
    var pathjoin = require('path');
    const name = pathjoin.join(tempDir,'image'+tempCount+'_'+path)
    return name
  }

  export async function consoleRedirect(timestamp, prefix, data) {
    var fs = require('fs');
      for(var i=0;i<data.length;i++) {
        var obj = await data[i];
        //fs.appendFileSync("./reports/consolelog_"+prefix+"_"+timestamp+".log", obj.type+"--"+obj.value) 
        //fs.appendFileSync("recordconsole.txt", obj.type+"--"+obj.value) 
        
        await logger.info('JSON data = ', obj)
      }
      
      await logger.info('Succesfully console logs redirected');

  }

  export async function goTo(gotourl) {
    const { PendingXHR } = require('pending-xhr-puppeteer');
    const pendingXHR = new PendingXHR(page);
    //await delay(10000)
    logger.info("Navigating to "+gotourl );
    await page.goto(gotourl )
    await delay(2000)
    await pendingXHR.waitForAllXhrFinished()
    await page.setRequestInterception(false);
  }

  export async function expectToClick(selector, jsonStr) {
    const { PendingXHR } = require('pending-xhr-puppeteer');
    const pendingXHR = new PendingXHR(page);
    //await delay(10000)
    logger.info("Navigating to using expect click");
    await expect(page).toClick(selector, jsonStr)
    await delay(2000)
    await pendingXHR.waitForAllXhrFinished()
  }

  export async function createPDF(timestamp, prefix) {
    var fs = require('fs')

    logger.info('CALLING createPDF')
    //const files = await fileList('tempImages');
    const files = await (readdirChronoSorted('tempImages', -1));
    //logger.info(await readdirChronoSorted('tempImages', -1));
    const imagesToPdf = require("images-to-pdf")
    var process = require('process');
    await process.chdir('tempImages');
    await imagesToPdf(files, "../reports/testReport_"+prefix+"_"+timestamp+".pdf")
    await process.chdir('../');
    //after creating the pdf delete the image files part of cleanup
    await deleteTempImages()
   
  }
  export async function getEnvConfig()
  {
    var config
    var testbed
    if (global.testbed == "otedge"){
      testbed = "e2e"
    } else if (global.testbed == "ota"){
      testbed = "otae2e"
    } else if (global.testbed == "sbp") {
      testbed = "sbpe2e"
    } else if (global.testbed == "sbpauto") {
      testbed = "sbpe2e"
    } else if (global.testbed == "kastle") {
      testbed = "kastle"
    } else {
      logger.error("Testbed is unknown. Verify globals section")
    }
    var file = '../'+testbed+'/env/'+global.env+'_config.js'
            config  = require(file);
            return config
  }
  async function deleteTempImages()
  {
    const fs = require('fs');
    const path = require('path');
    const directory = tempDir;
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
    
      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err;
        });
      }
    });
  }
  async function fileList(dir) {
    var fs = require('fs');
    var path = require('path');
    return fs.readdirSync(dir).reduce(function(list, file) {
      var name = path.join(dir, file);
      var isDir = fs.statSync(name).isDirectory();
      return list.concat(isDir ? fileList(name) : [name]);
    }, []);
  }

  async function readdirChronoSorted(dirpath, order) {
    //This function allows us to get a record of pdf
    const fs = require('fs');
    const path = require('path');
    const util = require('util');
    
    const readdirAsync = util.promisify(fs.readdir);
    const statAsync = util.promisify(fs.stat);

    order = order || 1;
    const files = await readdirAsync(dirpath);
    const stats = await Promise.all(
      files.map((filename) => 
           statAsync(path.join(dirpath, filename))
          .then((stat) => ({ filename, stat }))
      )
    );
    return stats.sort((a, b) =>
      order * (b.stat.mtime.getTime() - a.stat.mtime.getTime())
    ).map((stat) => stat.filename);
  }

  
  export async function checkElementExists(type="css", handle=page, selector)
  {
    try {
      let element
      if (type=="css") {
      element = handle.querySelector(selector);
      }
      if (element)
          return element.innerText;
      return '';
    }
    catch(err) {
      logger.info(err);
    } 

  }

  export async function findElement(type="css", handle=page, selector)
  {
    try {
    let element
    if (type=="css") {
     element = handle.querySelector(selector);
    }
    if (element)
        return element.innerText;
    return '';
  }
  catch(err) {
    logger.info(err);
  } 

  }

  export async function findElements(type="css", handle=page, selector)
  {
    try {
    let element
    if (type=="css") {
     element = handle.querySelector(selector);
    }
    if (element)
        return element.innerText;
    return '';
  }
  catch(err) {
    logger.info(err);
  } 

  }

  export async function getElementAttributes(parent=page, selector, attribute)
  {
    try {
      logger.info('in getElementAttributes')
      logger.info('in getElementAttributes parent=', parent )
      logger.info('in getElementAttributes selector=', selector )
      
        //let elements = Array.from(parent.$$(selector));
        let elements = Array.from(await parent.$$(selector));
        logger.info('how many elements?', (elements.length))
        let values = await elements.map( async (element) => {
          logger.info('in getElementAttributes attribute=', attribute );
            const test =  await (await (element.getProperty(attribute))).jsonValue();
            //logger.info("Element = ", await element.getProperty( attribute).jsonValue() );
            return (test)
        }, attribute);
        return values; 
  }
  catch(err) {
    logger.info(err);
  } 

  }

  export async function checkConsoleErrors()
  {
    logger.info('Testing the console error');
    
    page.on('error', err=> {
        logger.info('error happen at the page: ', err);
      });
    
      page.on('pageerror', pageerr=> {
        logger.info('pageerror occurred: ', pageerr);
      })
      /*
      try {
        await page.evaluate(()=> {
          throw new Error('js throw some error');
        });
      } catch (e) {
        logger.info('an expection on page.evaluate ', e);
      }
      */
          
}

export async function portForward(hostName, mongoHost, privateKey, userName="ubuntu")
{   
    var config = {
    username:userName,
    host:hostName,
    agent : process.env.SSH_AUTH_SOCK,
    privateKey:require('fs').readFileSync(privateKey),
    port:22,
    dstHost:mongoHost,
    dstPort:27017
    //password:'mypassword'
  };
  var server = await tunnel(config, function (error, server) {
    if(error){
      console.log("SSH connection error: " + error);
    }
  });
  return server
}


export async function connectmongoDB()
{
      var connectionString
      var MongoClient = require('mongodb').MongoClient;
      if (global.env == 'staging') {
        let config = await getEnvConfig()
        let mongoHost = config.db.host_and_port.split(',')[0].split[':'][0]
        let privateKey = "pem/"+config.jumphost.pem
        logger.info("mongoHost:"+mongoHost)
        await portForward(config.jumphost.host, mongoHost, privateKey)
        connectionString = `mongodb://${config.db.username}:${config.db.password}@localhost:27017/${config.db.db_name}`
      } else {
        //mongodb://[username:password@]host1[:port1][,...hostN[:portN]]][/[database][?options]]
        //const connectionString = 'mongodb://admin:secret@192.170.200.8:27017,192.170.200.8:27018,192.170.200.8:27019/iotium?replicaSet=repset';
        connectionString = `mongodb://admin:secret@${global.orchIP}:27017/iotium`;
      }
      logger.info("connectionString:"+connectionString)
      mongoclient = await MongoClient.connect(connectionString, { useNewUrlParser: true }).catch(err => { logger.info("Complete connect error ",err); });
      logger.info("Mongo connected")
      const db =  await mongoclient.db('iotium');
      logger.info("Mongo connected to Iotium DB")
      return db
}


export async function closemongoDB()
{
  await mongoclient.close(true)
  logger.info("Mongo Disconnected")
}
export async function getNodeHSN(db, nodename)
{
  logger.info("IN rhe getNodeHSN");

  var myDocument = await db.collection('node').findOne(
    {'name':nodename})

if (myDocument) {
       let result = JSON.parse(JSON.stringify(myDocument))
       //await logger.info("The returned 1 entry for result", result);
       let hsn = result.pkiCertId.$id
       //logger.info("The returned 1 entry for hsn", hsn);
       return hsn

    } else 
    {
      logger.info("Failed to get the nodeid in getNodeHSN for this nodename ",nodename)
      return null
    }
    
}
export async function getNotification(db, hsn, date, alertname)
{
  logger.info("IN the getNotification");

  var myDocument = await db.collection('user_notification').findOne(
    {'hardwareSerialNumber':hsn, 'createdAt': { $gt: date } })

if (myDocument) {
       let result = JSON.parse(JSON.stringify(myDocument))
       await logger.info("The returned 1 entry from getNotification", result);
       let send = result.send
       //logger.info("The returned 1 entry for send", send);
       return send

    } else 
    {
      logger.info("Failed to get the alert.send in getNotification for this hsn ",hsn)
      return null
    }
    
}


export async function verifyUserNotification (db, to_verify, date)
{
  logger.info("IN the verifyUserNotification");
  logger.info(to_verify.AlertType,to_verify.AlertName,to_verify.NodeName,to_verify.NetworkName, to_verify.PeerNodeName, to_verify.PeerNetworkName, to_verify.SendStatus, date, Date.now())
  if (to_verify.AlertType == 'TUNNEL_STATE_CHANGE' ) {
    var myDocument = await db.collection('user_notification').findOne(
      {'type':to_verify.AlertType,
      'fields.alert.name':to_verify.AlertName,
      'fields.nodeName':to_verify.NodeName,
      'fields.networkName':to_verify.NetworkName,
      'fields.peerNodeName':to_verify.PeerNodeName,
      'fields.peerNetworkName':to_verify.PeerNetworkName,
      'fields.status':to_verify.State,
      'send':to_verify.SendStatus,
      'createdAt': { $gt: date } })
    

    if (!myDocument && (to_verify.RecordExists.toLowerCase() == "no"))
    {
      logger.info("Document not found as expected")
      return true
    }
    else if (!myDocument)
    {
      logger.info("No Document found matching query")
      return false
    }
    else 
    {
      let result = JSON.parse(JSON.stringify(myDocument))
      logger.info("The returned 1 entry", result);
      if (to_verify.RecordExists.toLowerCase() == "no"){return false} else {return true}
    }  
  }
}

export async function replaceEnvs (row)
{
  const envs = ['node1', 'node1_tan1', 'node1_service1', 'vnode1', 'vnode2', 'hsn1', 'org1']
  var config = await getEnvConfig()
  const keys = Object.keys(row)
  const values = Object.values(row)
  for (let i=0; i<values.length; i++)
  {
    if (envs.includes(values[i]))
    {
      row[keys[i]] = eval("config." + values[i])
    }
  }
  return row
}

export async function closeModal()
{
  try{
    const modal = await page.$$('div.ant-modal-content button.ant-modal-close')
    if (modal.length > 0){
      logger.info("Modal is open; Needs analysis ", modal.length)
      await expect(page).toClick('div.ant-modal-content button.ant-modal-close')
    }
  } catch(err) {
    logger.info(err);
    logger.info("Sometimes closed modal is caught and this exception can be ignored")
  } 
}

/**
 * Gets the elementhandle, given the xpath.
 * Return handle on success, false on failure
 * @param {String} path xpath of the elent
 * @param {*} searchOnHandle search on "page" or any element handle <object>
 * @param {Object} options timeout to wait for xpath/element
 */
export async function getElementHandleByXpath(path, searchOnHandle = "page", options = {timeout : 30000})
{
  try{
    logger.info("In getElementHandleByXpath ", path)
    var handles
    if (searchOnHandle == "page"){
      logger.info("in if")
      await page.waitForXPath(path, options)
      handles = await page.$x(path)
    } else {
      logger.info("in else")
      handles = await searchOnHandle.$x(path)
    }    
    return handles
  } catch(err) {
    logger.error(err);
    logger.error("Unable to get element handle by xpath {}", path)
    return false
  }
}

/**
 * This function performs action like click on the xpath given. 
 * Returns true on success and false on failure
 * @param {*} action action name like click, hover
 * @param {*} path xpath on which action needs to be performed
 * @param {*} searchOnHandle search xpath on elementHandle/page
 */
export async function performAction(action, path, searchOnHandle="page", text="",clearBeforeType=false)
{
  try{
    logger.info("In performAction")
    let handle = await getElementHandleByXpath(path, searchOnHandle=searchOnHandle)
    if (handle == false) {return false}
    switch (action) {
      case "click":
        logger.info("in click");
        await handle[0].click();
        break;
      case "hover":
        logger.info("in hover");
        await handle[0].hover();
        break;
      case "type":
        if (clearBeforeType) {
          await handle[0].click({clickCount: 3});
          await handle[0].press('Backspace');
        }
        logger.info(`in type ${handle.length} ${text}`);
        await handle[0].type(text);
        break;
      case "escape":
        await handle[0].press('Escape');
        break;
      default:
        logger.info(`Action ${action} not defined`);
        return false;
    }
    return true
  } catch(err) {
    logger.error(err);
    logger.error("Unable to perform action on xpath {}", path)
    return false
  } 
}

/**
 * Navigates page by clicking an element, given in path arg
 * Returns page metrics on success, false on failure
 * @param {String} path xpath of element to be clicked 
 * @param {*} options 
 */
export async function navigatePageByClick(path, options = { waitUntil: ['networkidle0'] })
{
  try{
    logger.info("In navigatePageByClick")
    //await page.click(path)
    await page.waitForXPath(path)
    let handle = await page.$x(path)
    logger.info(handle.length)
    var startDate = new Date();
    await Promise.all([
      handle[0].click(),
      waitForNetworkIdle()
     ])
    var endDate = new Date();
    //await handle[0].click()
    let metricsOp = await page.metrics()
    logger.info(metricsOp)
    //return metricsOp
    let duration = (endDate - startDate) / 1000
    logger.info(startDate, endDate, duration)
    return duration
  } catch(err) {
    logger.error(err);
    logger.error("Unable to get element handle by xpath {}", path)
    return false
  } 
}

/**
 * Gives the property value of an element, given the elementhandle. e.g. innerText
 * @param {Object} handle - Handle of the Element
 * @param {String} property - property of element to be fetched
 */
export async function getPropertyValue(handle, property){
  try {
    let valueHandle = await handle.getProperty(property)
    let value = await valueHandle.jsonValue()
    return value
  } catch (error) {
    logger.error(error);
    logger.error("Unable to get property ", property)
    return false
  }
}

/**
 * This function will return the property value, given the xpath
 * Returns false on failure
 * @param {*} path - xpath of element for which property needs to be fetched
 * @param {*} property - name of the property
 * @param {*} searchOnHandle - search xpath from handle(onject)/page - defaults page
 */
export async function getPropertyValueByXpath(path, property, searchOnHandle="page"){
  try{
    let handle = await getElementHandleByXpath(path, searchOnHandle=searchOnHandle)
    if (handle == false) {return false}
    let propValue = await getPropertyValue(handle[0], property)
    logger.info(propValue)
    return propValue
  } catch (error) {
    logger.error(error);
    logger.error("Unable to get property ", property)
    return false
  }
}

/**
 * Compares actual and expected value based on the operator given.
 * operator can be strings like ">", "<=" OR it can be an integer like 2.
 * When operator is int, actual value must be +/- int(operator) of expected value 
 * @param {*} actualValue 
 * @param {*} expectedValue 
 * @param {*} operator 
 */
export async function compareValue(actualValue, expectedValue, operator) {
  logger.info("in compareValue")
  logger.info(`Actual: ${actualValue}, Expected: ${expectedValue}, operator: ${operator}`)
  if (typeof(operator) == "string"){
    return eval(actualValue.toString().concat(operator, expectedValue.toString()))
  } else {
    //If operator is not string, check if diff is <= given value 
    return (Math.abs(actualValue - expectedValue) <=  operator)
  }
}

/**
 * This function is alternative for waitForNavigation
 * There is an openissue - https://github.com/puppeteer/puppeteer/issues/1353
 * @param {*} timeout 
 * @param {*} waitForFirstRequest 
 * @param {*} waitForLastRequest 
 * @param {*} maxInflightRequests 
 */
export function waitForNetworkIdle(timeout = 30000, waitForFirstRequest = 1000, waitForLastRequest = 1000, maxInflightRequests = 0) {
  let inflight = 0;
  let resolve;
  let reject;
  let firstRequestTimeoutId;
  let lastRequestTimeoutId;
  let timeoutId;
  maxInflightRequests = Math.max(maxInflightRequests, 0);

  function cleanup() {
    clearTimeout(timeoutId);
    clearTimeout(firstRequestTimeoutId);
    clearTimeout(lastRequestTimeoutId);
    /* eslint-disable no-use-before-define */
    page.removeListener('request', onRequestStarted);
    page.removeListener('requestfinished', onRequestFinished);
    page.removeListener('requestfailed', onRequestFinished);
    /* eslint-enable no-use-before-define */
  }

  function check() {
    if (inflight <= maxInflightRequests) {
      clearTimeout(lastRequestTimeoutId);
      lastRequestTimeoutId = setTimeout(onLastRequestTimeout, waitForLastRequest);
    }
  }

  function onRequestStarted() {
    clearTimeout(firstRequestTimeoutId);
    clearTimeout(lastRequestTimeoutId);
    inflight += 1;
  }

  function onRequestFinished() {
    inflight -= 1;
    check();
  }

  function onTimeout() {
    cleanup();
    reject(new Error('Timeout'));
  }

  function onFirstRequestTimeout() {
    cleanup();
    resolve();
  }

  function onLastRequestTimeout() {
    cleanup();
    resolve();
  }

  page.on('request', onRequestStarted);
  page.on('requestfinished', onRequestFinished);
  page.on('requestfailed', onRequestFinished);

  timeoutId = setTimeout(onTimeout, timeout); // Overall page timeout
  firstRequestTimeoutId = setTimeout(onFirstRequestTimeout, waitForFirstRequest);

  return new Promise((res, rej) => { resolve = res; reject = rej; });
}

/**
 * Gets scroll height of the handle and then scrolls to the maximum height.
 * scroll height changes dynamically on pagination. 
 * @param {*} handle - Element handle to be scrolled
 * @param {*} pathAfterScroll - xpath to wait after each scroll 
 */
export async function autoScroll(handle, pathAfterScroll=allInodes.div.scrollbar){
  logger.info("in autoScroll")
  var scrollHeight = await getPropertyValue(handle, "scrollHeight")
  var total = 0
  var distance = 100
  while (true) {
    /*
    await page.evaluate(() =>
      {
        var distance = 100
        document.querySelector('div[tabindex="-1"]').scrollBy(0,distance)
      }
    )
    */
    await page.evaluate((h) =>
      {
        var distance = 100
        h.scrollBy(0,distance)
      },
      handle
    )
    total += distance
    await page.waitForXPath(pathAfterScroll)
    await delay(1000)
    let scrollHeight = await getPropertyValue(handle, "scrollHeight")
    logger.info(`Total scroll height is ${scrollHeight},  scrolled: ${total}`)
    if (total >= scrollHeight) {
      break
    }
  }
}

/**
 * This function verifies the modal title, icon, and primary, secondary buttons
 * Returns true on success, false on failure
 * @param {*} modalName - Name of the modal defined in constants/modals.js 
 */
export async function verifyModal(modalName) {
  try{
    const title = modalProperties[modalName].title.text
    const primary = modalProperties[modalName].primaryButton.text
    const secondary = modalProperties[modalName].secondaryButton.text
    const titleIcon = modals.button.title+`//*[@type='${modalProperties[modalName].title.icon}']`
    const primaryIcon = modals.button.primary+`//*[@type='${modalProperties[modalName].primaryButton.icon}']`
    //verify title
    let observedTitle = await getPropertyValueByXpath(modals.div.title, 'innerText')
    expect(observedTitle.trim()).toBe(title.trim())
    //verify primary button
    let observedPrimaryButton = await getPropertyValueByXpath(modals.button.primary, 'innerText')
    expect(observedPrimaryButton.trim()).toBe(primary.trim())
    //verify secondary button
    let observedSecondaryButton = await getPropertyValueByXpath(modals.button.secondary, 'innerText')
    expect(observedSecondaryButton.trim()).toBe(secondary.trim())
    //verify title icon presence
    if (modalProperties[modalName].title.icon != ''){
      await page.$x(titleIcon)
    }
    //verify primary button icon presence
    if (modalProperties[modalName].primaryButton.icon != ''){
      await page.$x(primaryIcon)
    }
    //verify close button
    await page.$x(modals.button.close)
    return true
  } catch (error) {
    logger.error(error);
    logger.error("unable to verify modal")
    return false
  }
}

/**
 * Returns list of handles matching tag with given text
 * @param {*} tag name of the tag like a, div, button, strong
 * @param {*} text text in tag
 * @param {*} strictMatch if strictmatch is false, will check for contains
 */
export async function findTagByText(tag, text, strictMatch=true){
  logger.info("in findTagByText")
  var returnHandles = []
  const handles = await page.$x(`//${tag}`)
  logger.info(handles.length)
  for (let item of handles){
    let value = await getPropertyValue(item, 'innerText')
    if (strictMatch){
      if (value == text) { returnHandles.push(item) }
    } else {
      if (value.includes(text)) { returnHandles.push(item) }
    }
  }
  logger.info(returnHandles.length)
  return returnHandles
}

/**
 * Returns list of fields , given the table header
 * @param {*} headerHandle Handle of table header
 */
export async function getTableFields(headerHandle) {
  let fieldNames = []
  let fieldHandle = await getElementHandleByXpath("./tr/th", headerHandle)
  expect(fieldHandle).toBeTruthy()
  for (let i=0; i<fieldHandle.length; i+=1) {
    let value = await getPropertyValue(fieldHandle[i], 'innerText')
    if (value != "") {
      fieldNames.push(value.trim())
    } else {
      fieldNames.push(`_field${i}`)
    }
  }
  return fieldNames
}

/**
 * Parse a table row, provided by rowHandle & returns an object with keys provided in fieldList;
 * If expanded row(ant-table-expanded-row-level-1) is present, those values will also be parsed and added to object
 * @param {*} fieldList List of fields present in table header
 * @param {*} rowHandle row handle
 * @param {*} tableName LAT-14281/14639 innerTable of service has 2 tables for head & body after 14281 fix. Use 'service' as parameter
 *                      whereas others innerTables(network) have single table with head & body. Use 'default' as parameter for this.
 */
export async function parseTableRow(fieldList, rowHandle, tableName="default") {
  let parsedObj = {}
  let columns = await getElementHandleByXpath("./td", rowHandle)
  for (let i=0; i<columns.length; i+=1) {
    let key = fieldList[i]
    if (key.startsWith('_field')){
      continue;
    }
    let value = await getPropertyValue(columns[i],'innerText')
    parsedObj[key] = value.trim().replace(/\s/g," ") //Replace breaking line char with space
  }

  let extendedRow = await getElementHandleByXpath("./following-sibling::tr[position()=1]", rowHandle)
  logger.debug("Extended row length ", extendedRow.length)
  if (extendedRow.length > 0){
    let classValue = await getPropertyValue(extendedRow[0], 'classList')    
    let classValue1 = await getPropertyValue(extendedRow[0], 'innerText')
    logger.debug("Extended row value is ",classValue1)
    if (Object.values(classValue).includes('ant-table-expanded-row-level-1')){
      //Parse extended row elements
      let rows = await extendedRow[0].$x("./td//descendant::div[contains(@class, 'ant-row')]")
      logger.debug("Lines length in extended row ", rows.length)
      for (let row of rows){
        let containsTable = await row.$x(".//table")
        logger.debug("containsTable length ", containsTable.length)
        if (containsTable.length == 0){
          let value = await getPropertyValue(row, 'innerText')
          logger.debug("Inner row value is ", value)
          if (value.includes(":")){
            parsedObj[value.split(":")[0].trim()] = value.split(":")[1].trim()
          }
        } else {
          //parse inner table
          logger.info("Contains table; parse seperately")
          /*
          let head = await row.$x(".//table/thead")
          let body = await row.$x(".//table/tbody")
          parsedObj['innerTable'] = await tableToObjects(head[0], body[0])
          logger.debug("innerTable is ", parsedObj['innerTable'])
          */
        }
      }
      let findTable = await extendedRow[0].$x(".//table")
      if (findTable.length > 0){
        logger.info("Parse inner table")
        let head = await findTable[0].$x("./thead")
        var body
        if (tableName == 'service'){
          //finding second table for service
          body = await findTable[1].$x("./tbody")
        } else {
          body = await findTable[0].$x("./tbody")
        }
        parsedObj['innerTable'] = await tableToObjects(head[0], body[0])
        logger.debug("innerTable is ", parsedObj['innerTable'])
      }
    }
  }
  return parsedObj
}

/**
 * Returns a list of objects, given the table header and body handle
 * If expanded row(ant-table-expanded-row-level-1) is present, those values will also be parsed and returned
 * @param {*} headerHandle Table header handle
 * @param {*} bodyHandle Table body handle
 * @param {*} tableName  LAT-14281/14639 innerTable of service has 2 tables for head & body after 14281 fix. Use 'service' as parameter
 *                       whereas others innerTables(network) have single table with head & body. Use 'default' as parameter for this.
 */
export async function tableToObjects(headerHandle, bodyHandle, tableName="default"){
  try {
    //Get all fields
    let returnList = []
    let fieldNames = await getTableFields(headerHandle)
    logger.info(fieldNames)
    let tableRows = await getElementHandleByXpath("./tr[contains(@class, 'ant-table-row-level-0')]", bodyHandle)
    for (let row of tableRows) 
    {
      let parsedObj = await parseTableRow(fieldNames, row, tableName=tableName)
      returnList.push(parsedObj)
    }
    return returnList
  } catch(e) {
    logger.error(e)
    return false
  }
}

/**
 * Returns object in a list, that has key, value matching from a list of objects
 * @param {*} listOfObj List of objects on which search should be performed
 * @param {*} key match by Key
 * @param {*} value match value
 */
export async function matchByKey(listOfObj, key, value){
  logger.info(`Matching ${key}, ${value}`)
  for (let item of listOfObj){
    if (item[key] == value){
      return item
    }
  }
  logger.error(`None of the objects match key,value - ${key},${value}`)
  return false
}

/**
 * Returns true on success and false on failure
 * @param {*} tableHeaderPath Xpath of table header - xpath ending with thead
 * @param {*} fieldName Name of the field to be sorted
 * @param {*} order ascending or descending
 */
export async function sortTable(tableHeaderPath, fieldName, order){
  try{
    logger.info("in sortTable ", order)
    //max three clicks to sort any order 
    const maxCount = 3
    for (let i=0; i<maxCount; i+=1) {
      logger.info(`loop count is ${i}`)
      let head = await getElementHandleByXpath(tableHeaderPath)
      expect(head).toBeTruthy()
      let fieldPath = `.//th[span='${fieldName}']`
      let fieldHandle = await head[0].$x(fieldPath)
      let foundOrder = await getSortOrder(fieldHandle[0])
      logger.info("found order is ", foundOrder)
      expect(foundOrder).toBeTruthy()
      if (foundOrder == order){
        logger.info("Table is sorted ", order)
        return true
      }
      await Promise.all(
        [fieldHandle[0].click(),
        waitForNetworkIdle()]
      )
    }
  } catch(e) {
    logger.error(e)
    return false
  }
}


/**
 * Returns ascending, descending, unsorted. false on failure
 * @param {*} fieldHandle  Handle of the field (th)
 */
export async function getSortOrder(fieldHandle){
  try{
    var icons = await fieldHandle.$x(".//i[contains(@class, ' on')]")
    if (icons.length == 0){
      logger.info("unsorted found")
      return "unsorted"
    } else if (icons.length == 1) {
      let propValue = await getPropertyValue(icons[0], 'classList')
      expect(propValue).toBeTruthy()
      if (Object.values(propValue).includes('anticon-caret-up')) {
        logger.info("ascending order found")
        return 'ascending'
      } else if (Object.values(propValue).includes('anticon-caret-down')){
        logger.info("descending order found")
        return 'descending'
      } else {
        logger.error("None of the sort button is on")
        return false
      }
    } else {
      logger.error("sort on cannot be for more than one button")
      return false
    }
  } catch(e){
    logger.error(e)
    return false
  }
}

export async function waitforotaloader(){
  await page.waitForSelector("img.iotium-spin-img");
  logger.info("appeared")
    while (true) {
        let arr = await page.$$("img.iotium-spin-img");
        if (arr.length == 0) {
            logger.info("Disappeared")
            break;
            }
          }
}

export async function getErrorValues_addUser(field) {
  logger.info("Add User case")
  let pairs = []
  switch (field) {
    case "Full Name": {
      let disallowed = specialChars.all.filter(x => !addUserFormConst.name.allowed.includes(x));
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(252)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
      }
      break
    }
    case "Email Address": {
      let disallowed = specialChars.all.filter(x => !addUserFormConst.email.allowed.includes(x));
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "a".repeat(63) + disallowed[i] + "@ab.co"
        temp["error"] = "invalidEmail"
        pairs.push(temp)

        let temp1 = {}
        temp1["value"] = "a".repeat(64) + "@ab.co" + disallowed[i]
        temp1["error"] = "invalidEmail"
        pairs.push(temp1)

        let temp2 = {}
        temp2["value"] = "a".repeat(63) + "@ab" + disallowed[i] + ".co"
        temp2["error"] = "invalidEmail"
        pairs.push(temp2)
      }
      //Removed "abc@abc.a" due to LAT-11138
      //Removed "a".repeat(65)+"@ab.co" due to LAT-15075
      let bad_email = ["abc@abc.","abc@.a","abc.a","abcd", "a@"+"a".repeat(253)+".co"]
      for (let j = 0; j < bad_email.length; j++) {
        let temp = {}
        temp["value"] = bad_email[j]
        temp["error"] = "invalidEmail"
        pairs.push(temp)
      }
      break
    }
    case "Password": {
      let disallowed = specialChars.all.filter(x => !addUserFormConst.password.allowed.includes(x));
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "f@bIoT17291729"+ disallowed[i] + "x".repeat(86)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
      }
      let temp = {}
      temp["value"] = "f@bIoT1729"
      temp["error"] = "length"
      pairs.push(temp)

      let temp1 = {}
      temp1["value"] = "f@bIoTbbbbbb"
      temp1["error"] = "number"
      pairs.push(temp1)

      let temp2 = {}
      temp2["value"] = "f@baaobbbbb1"
      temp2["error"] = "upperCase"
      pairs.push(temp2)

      let temp3 = {}
      temp3["value"] = "fbIoT17291729"
      temp3["error"] = "specialCharacters"
      pairs.push(temp3)

      let temp4 = {}
      temp4["value"] = "a"
      temp4["error"] = "all"
      pairs.push(temp4)
      break
    }
    default: {
      logger.error("No match found in switch case")
      expect(true).toBe(false)
      break
    }
  }
  return pairs
}

export async function getErrorValues(form,field) {
  var pairs = []
  switch (form) {
    case "Add iNode": {
      logger.info("Add iNode case")
      switch (field) {
        case "iNode Name": {
          let temp = {}
          let disallowed = specialChars.all.filter(x => !addiNodeFormConst.name.allowed.includes(x));
          for (let i = 0; i < disallowed.length; i++) {
            temp["value"] = "A "+ disallowed[i] + "x".repeat(253)
            temp["error"] = "specialCharacters"
            pairs.push(temp)
          }
          let bad_names = ["A".repeat(256)]
          logger.info("bad_names length: {}",bad_names.length)
          temp = {}
          for (let j = 0; j < bad_names.length; j++) {
            temp["value"] = bad_names[j]
            temp["error"] = "length"
            pairs.push(temp)
          }
          break
        }
        case "Label Key": {
          let temp = {}
          temp["value"] = "A".repeat(addiNodeFormConst.labelKey.MAX_CHARACTERS_LABEL_KEY)+"1"
          temp["error"] = "commonError"
          pairs.push(temp)

          for (let i = 0; i < specialChars.all.length; i++) {
            let temp1 = {}
            temp1["value"] = specialChars.all[i]+"A"
            temp1["error"] = "commonError"
            pairs.push(temp1)
            let temp2 = {}
            temp2["value"] = "A"+specialChars.all[i]
            temp2["error"] = "commonError"
            pairs.push(temp2)
          }

          let disallowed = specialChars.all.filter(x => !addiNodeFormConst.labelKey.allowed.includes(x));
          for (let j = 0; j < disallowed.length; j++) {
            let temp3 = {}
            temp3["value"] = "A"+disallowed[j]+"A"
            temp3["error"] = "commonError"
            pairs.push(temp3)
          }
          logger.info("Error-value pairs generated: "+pairs)
          break
        }
        case "Label Value": {
          let temp = {}
          temp["value"] = "A".repeat(addiNodeFormConst.labelValue.MAX_CHARACTERS_LABEL_VALUE)+"1"
          temp["error"] = "commonError"
          pairs.push(temp)

          for (let i = 0; i < specialChars.all.length; i++) {
            let temp1 = {}
            temp1["value"] = specialChars.all[i]+"A"
            temp1["error"] = "commonError"
            pairs.push(temp1)
            let temp2 = {}
            temp2["value"] = "A"+specialChars.all[i]
            temp2["error"] = "commonError"
            pairs.push(temp2)
          }

          let disallowed = specialChars.all.filter(x => !addiNodeFormConst.labelValue.allowed.includes(x));
          for (let j = 0; j < disallowed.length; j++) {
            let temp3 = {}
            temp3["value"] = "A"+disallowed[j]+"A"
            temp3["error"] = "commonError"
            pairs.push(temp3)
          }
          break
        }
      }
      break
    }
    case "Add Network" : {
      pairs = await addNetworkFormValidations(field)
      break
    }
    case "Add User": {
      pairs = await getErrorValues_addUser(field)
      break
    }
    case "Add Org": {
      pairs = await addOrgFormValidations(field)
      break
    }
    case "Add Custom Security Policy": {
      pairs = await addCSPFormValidations(field)
      break
    }
    case "Add Serial": {
      pairs = await addSerialFormValidations(field)
      break
    }
    case "Add SSH Key": {
      pairs = await addSSHKeyFormValidations(field)
      break
    }
    case "Add Role": {
      pairs = await addRoleFormValidations(field)
      break
    }
    case "Add Cluster": {
      pairs = await addClusterFormValidations(field)
      break
    }
    case "Add Pull Secret": {
      pairs = await addPullSecretFormValidations(field)
      break
    }
    case "Add Volume": {
      pairs = await addVolumeFormValidations(field)
      break
    }
    case "Add Alert": {
      pairs = await addAlertFormValidations(field)
      break
    }
    default: {
      logger.error("No match found in switch case")
      expect(true).toBe(false)
      break
    }
  }
  logger.info("Number of error values generated: ", pairs.length)
  return pairs
}

async function addNetworkFormValidations(field) {
  var pairs = []
  logger.info("Add Network case")
  switch (field) {
    case "Name": {
      let disallowed = specialChars.all.filter(x => !addNetworkFormConst.name.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(253)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      let bad_names = ["A".repeat(256)]
      logger.info("bad_names length: {}",bad_names.length)
      for (let j = 0; j < bad_names.length; j++) {
        let temp = {}
        temp["value"] = bad_names[j]
        temp["error"] = "length"
        pairs.push(temp)
      }
      break
    }
    case "Label Key": {
      let temp = {}
      temp["value"] = "A".repeat(addNetworkFormConst.labelKey.MAX_CHARACTERS_LABEL_KEY)+"1"
      temp["error"] = "commonError"
      pairs.push(temp)

      for (let i = 0; i < specialChars.all.length; i++) {
        let temp1 = {}
        temp1["value"] = specialChars.all[i]+"A"
        temp1["error"] = "commonError"
        pairs.push(temp1)
        let temp2 = {}
        temp2["value"] = "A"+specialChars.all[i]
        temp2["error"] = "commonError"
        pairs.push(temp2)
      }

      let disallowed = specialChars.all.filter(x => !addNetworkFormConst.labelKey.allowed.includes(x));
      for (let j = 0; j < disallowed.length; j++) {
        let temp3 = {}
        temp3["value"] = "A"+disallowed[j]+"A"
        temp3["error"] = "commonError"
        pairs.push(temp3)
      }
      logger.info("Error-value pairs generated: "+pairs)
      break
    }
    case "Label Value": {
      let temp = {}
      temp["value"] = "A".repeat(addNetworkFormConst.labelValue.MAX_CHARACTERS_LABEL_VALUE)+"1"
      temp["error"] = "commonError"
      pairs.push(temp)

      for (let i = 0; i < specialChars.all.length; i++) {
        let temp1 = {}
        temp1["value"] = specialChars.all[i]+"A"
        temp1["error"] = "commonError"
        pairs.push(temp1)
        let temp2 = {}
        temp2["value"] = "A"+specialChars.all[i]
        temp2["error"] = "commonError"
        pairs.push(temp2)
      }

      let disallowed = specialChars.all.filter(x => !addNetworkFormConst.labelValue.allowed.includes(x));
      for (let j = 0; j < disallowed.length; j++) {
        let temp3 = {}
        temp3["value"] = "A"+disallowed[j]+"A"
        temp3["error"] = "commonError"
        pairs.push(temp3)
      }
      break
    }  
  }
  logger.info("Return addNetworkFormValidations")
  return pairs
}

async function addOrgFormValidations(field) {
  var pairs = []
  logger.info("Add Org case")
  switch (field) {
    case "Organization Name": {
      let disallowed = specialChars.all.filter(x => !addOrgFormConst.orgName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(253)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      let bad_names = ["A".repeat(256)]
      logger.info("bad_names length: {}",bad_names.length)
      for (let j = 0; j < bad_names.length; j++) {
        let temp = {}
        temp["value"] = bad_names[j]
        temp["error"] = "length"
        pairs.push(temp)
      }
      break
    }
    case "Billing Name": {
      let disallowed = specialChars.all.filter(x => !addOrgFormConst.billingName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(253)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      let bad_names = ["A".repeat(256)]
      logger.info("bad_names length: {}",bad_names.length)
      for (let j = 0; j < bad_names.length; j++) {
        let temp = {}
        temp["value"] = bad_names[j]
        temp["error"] = "length"
        pairs.push(temp)
      }
      break
    }
    case "Billing Email": {
      let disallowed = specialChars.all.filter(x => !addOrgFormConst.billingEmail.allowed.includes(x));
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "a".repeat(63) + disallowed[i] + "@ab.co"
        temp["error"] = "invalidEmail"
        pairs.push(temp)

        let temp1 = {}
        temp1["value"] = "a".repeat(64) + "@ab.co" + disallowed[i]
        temp1["error"] = "invalidEmail"
        pairs.push(temp1)

        let temp2 = {}
        temp2["value"] = "a".repeat(63) + "@ab" + disallowed[i] + ".co"
        temp2["error"] = "invalidEmail"
        pairs.push(temp2)
      }
      //Removed "abc@abc.a" due to LAT-11138
      //Removed "a".repeat(65)+"@ab.co" due to LAT-15075
      let bad_email = ["abc@abc.","abc@.a","abc.a","abcd", "a@"+"a".repeat(253)+".co"]
      for (let j = 0; j < bad_email.length; j++) {
        let temp = {}
        temp["value"] = bad_email[j]
        temp["error"] = "invalidEmail"
        pairs.push(temp)
      }
      break
    }
    case "Domain Name": {
      let disallowed = specialChars.all.filter(x => !addOrgFormConst.billingName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "a.a"+ disallowed[i]
        temp["error"] = "invalidDomain"
        pairs.push(temp)
        logger.info(temp)
      }
      break
    }
  }
  logger.info("Return addOrgFormValidations")
  return pairs
}

async function addCSPFormValidations(field) {
  var pairs = []
  logger.info("Add Custom Security Policy case")
  switch (field) {
    case "Name": {
      let disallowed = specialChars.all.filter(x => !addCSPFormConst.name.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(253)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      let bad_names = ["A".repeat(256)]
      logger.info("bad_names length: {}",bad_names.length)
      for (let j = 0; j < bad_names.length; j++) {
        let temp = {}
        temp["value"] = bad_names[j]
        temp["error"] = "length"
        pairs.push(temp)
      }
      break
    }
    case "Label Key": {
      let temp = {}
      temp["value"] = "A".repeat(addCSPFormConst.labelKey.MAX_CHARACTERS_LABEL_KEY)+"1"
      temp["error"] = "commonError"
      pairs.push(temp)

      for (let i = 0; i < specialChars.all.length; i++) {
        let temp1 = {}
        temp1["value"] = specialChars.all[i]+"A"
        temp1["error"] = "commonError"
        pairs.push(temp1)
        let temp2 = {}
        temp2["value"] = "A"+specialChars.all[i]
        temp2["error"] = "commonError"
        pairs.push(temp2)
      }

      let disallowed = specialChars.all.filter(x => !addCSPFormConst.labelKey.allowed.includes(x));
      for (let j = 0; j < disallowed.length; j++) {
        let temp3 = {}
        temp3["value"] = "A"+disallowed[j]+"A"
        temp3["error"] = "commonError"
        pairs.push(temp3)
      }
      logger.info("Error-value pairs generated: "+pairs)
      break
    }
    case "Label Value": {
      let temp = {}
      temp["value"] = "A".repeat(addCSPFormConst.labelValue.MAX_CHARACTERS_LABEL_VALUE)+"1"
      temp["error"] = "commonError"
      pairs.push(temp)

      for (let i = 0; i < specialChars.all.length; i++) {
        let temp1 = {}
        temp1["value"] = specialChars.all[i]+"A"
        temp1["error"] = "commonError"
        pairs.push(temp1)
        let temp2 = {}
        temp2["value"] = "A"+specialChars.all[i]
        temp2["error"] = "commonError"
        pairs.push(temp2)
      }

      let disallowed = specialChars.all.filter(x => !addCSPFormConst.labelValue.allowed.includes(x));
      for (let j = 0; j < disallowed.length; j++) {
        let temp3 = {}
        temp3["value"] = "A"+disallowed[j]+"A"
        temp3["error"] = "commonError"
        pairs.push(temp3)
      }
      break
    }  
  }
  logger.info("Return addCSPFormValidations")
  return pairs
}

async function addSerialFormValidations(field) {
  var pairs = []
  logger.info("Add Serial case")
  switch (field) {
    case "Serial Number": {
      let disallowed = specialChars.all.filter(x => !addSerialFormConst.serialNumber.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "RR4Y-W9C4"+ disallowed[i] + "MU1P-J1CJ"
        temp["error"] = "invalid"
        pairs.push(temp)
        logger.info(temp)
      }
      break
    }
  }
  logger.info("Return addSerialFormValidations")
  return pairs
}

async function addSSHKeyFormValidations(field) {
  var pairs = []
  logger.info("Add SSH Key case")
  switch (field) {
    case "SSH Key Name": {
      let disallowed = specialChars.all.filter(x => !addSSHKeyFormConst.sshKeyName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "My Key"+ disallowed[i]
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      break
    }
  }
  logger.info("Return addSerialFormValidations")
  return pairs
}

async function addRoleFormValidations(field) {
  var pairs = []
  logger.info("Add Role case")
  switch (field) {
    case "Role Name": {
      let disallowed = specialChars.all.filter(x => !addRoleFormConst.roleName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "My Role"+ disallowed[i]
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      break
    }
    case "Description": {
      let temp = {}
      temp["value"] = "D".repeat(1001)
      temp["error"] = "length"
      pairs.push(temp)
      logger.info(temp)  
      break
    }
  }
  logger.info("Return addSerialFormValidations")
  return pairs
}

async function addClusterFormValidations(field) {
  var pairs = []
  logger.info("Add Cluster case")
  switch (field) {
    case "Cluster Name": {
      let disallowed = specialChars.all.filter(x => !addClusterFormConst.clusterName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(253)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      let bad_names = ["A".repeat(256)]
      logger.info("bad_names length: {}",bad_names.length)
      for (let j = 0; j < bad_names.length; j++) {
        let temp = {}
        temp["value"] = bad_names[j]
        temp["error"] = "length"
        pairs.push(temp)
      }
      break
    }
    case "Label Key": {
      let temp = {}
      temp["value"] = "A".repeat(addNetworkFormConst.labelKey.MAX_CHARACTERS_LABEL_KEY)+"1"
      temp["error"] = "commonError"
      pairs.push(temp)

      for (let i = 0; i < specialChars.all.length; i++) {
        let temp1 = {}
        temp1["value"] = specialChars.all[i]+"A"
        temp1["error"] = "commonError"
        pairs.push(temp1)
        let temp2 = {}
        temp2["value"] = "A"+specialChars.all[i]
        temp2["error"] = "commonError"
        pairs.push(temp2)
      }

      let disallowed = specialChars.all.filter(x => !addNetworkFormConst.labelKey.allowed.includes(x));
      for (let j = 0; j < disallowed.length; j++) {
        let temp3 = {}
        temp3["value"] = "A"+disallowed[j]+"A"
        temp3["error"] = "commonError"
        pairs.push(temp3)
      }
      logger.info("Error-value pairs generated: "+pairs)
      break
    }
    case "Label Value": {
      let temp = {}
      temp["value"] = "A".repeat(addNetworkFormConst.labelValue.MAX_CHARACTERS_LABEL_VALUE)+"1"
      temp["error"] = "commonError"
      pairs.push(temp)

      for (let i = 0; i < specialChars.all.length; i++) {
        let temp1 = {}
        temp1["value"] = specialChars.all[i]+"A"
        temp1["error"] = "commonError"
        pairs.push(temp1)
        let temp2 = {}
        temp2["value"] = "A"+specialChars.all[i]
        temp2["error"] = "commonError"
        pairs.push(temp2)
      }

      let disallowed = specialChars.all.filter(x => !addNetworkFormConst.labelValue.allowed.includes(x));
      for (let j = 0; j < disallowed.length; j++) {
        let temp3 = {}
        temp3["value"] = "A"+disallowed[j]+"A"
        temp3["error"] = "commonError"
        pairs.push(temp3)
      }
      break
    }
  }
  return pairs
}

async function addPullSecretFormValidations(field) {
  var pairs = []
  logger.info("Add Pull Secret case")
  switch (field) {
    case "Pull Secret Name": {
      let disallowed = specialChars.all.filter(x => !addPullSecretConst.pullSecretName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(57)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      break
    }
  }
  return pairs
}

async function addVolumeFormValidations(field) {
  var pairs = []
  logger.info("Add Volume case")
  switch (field) {
    case "Volume Name": {
      let disallowed = specialChars.all.filter(x => !addVolumeConst.volumeName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(57)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      break
    }
    case "File Name": {
      let disallowed = specialChars.all.filter(x => !addVolumeConst.fileName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(57)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      break
    }
  }
  return pairs
}

async function addAlertFormValidations(field) {
  var pairs = []
  logger.info("Add Alert case")
  switch (field) {
    case "Alert Name": {
      let disallowed = specialChars.all.filter(x => !addAlertFormConst.alertName.allowed.includes(x));
      logger.info("disallowed chars ", disallowed)
      for (let i = 0; i < disallowed.length; i++) {
        let temp = {}
        temp["value"] = "A "+ disallowed[i] + "x".repeat(57)
        temp["error"] = "specialCharacters"
        pairs.push(temp)
        logger.info(temp)
      }
      break
    }
    case "Label Key": {
      let temp = {}
      temp["value"] = "A".repeat(addNetworkFormConst.labelKey.MAX_CHARACTERS_LABEL_KEY)+"1"
      temp["error"] = "commonError"
      pairs.push(temp)

      for (let i = 0; i < specialChars.all.length; i++) {
        let temp1 = {}
        temp1["value"] = specialChars.all[i]+"A"
        temp1["error"] = "commonError"
        pairs.push(temp1)
        let temp2 = {}
        temp2["value"] = "A"+specialChars.all[i]
        temp2["error"] = "commonError"
        pairs.push(temp2)
      }

      let disallowed = specialChars.all.filter(x => !addNetworkFormConst.labelKey.allowed.includes(x));
      for (let j = 0; j < disallowed.length; j++) {
        let temp3 = {}
        temp3["value"] = "A"+disallowed[j]+"A"
        temp3["error"] = "commonError"
        pairs.push(temp3)
      }
      logger.info("Error-value pairs generated: "+pairs)
      break
    }
    case "Label Value": {
      let temp = {}
      temp["value"] = "A".repeat(addNetworkFormConst.labelValue.MAX_CHARACTERS_LABEL_VALUE)+"1"
      temp["error"] = "commonError"
      pairs.push(temp)

      for (let i = 0; i < specialChars.all.length; i++) {
        let temp1 = {}
        temp1["value"] = specialChars.all[i]+"A"
        temp1["error"] = "commonError"
        pairs.push(temp1)
        let temp2 = {}
        temp2["value"] = "A"+specialChars.all[i]
        temp2["error"] = "commonError"
        pairs.push(temp2)
      }

      let disallowed = specialChars.all.filter(x => !addNetworkFormConst.labelValue.allowed.includes(x));
      for (let j = 0; j < disallowed.length; j++) {
        let temp3 = {}
        temp3["value"] = "A"+disallowed[j]+"A"
        temp3["error"] = "commonError"
        pairs.push(temp3)
      }
      break
    }
  }
  return pairs
}

export async function screenshot(path=(new Date()).getTime(), width=parseInt(global.width), height=parseInt(global.height)) {
  let reporter = global.reporter
  try {
    let screenshot = await customScreenshot(path+'.png', width, height)
    reporter.addAttachment(path, screenshot, "image/png");
  }
  catch(err) {
    logger.error("Exception caught in screenshot():"+err)
    return false
  }
  return true
}

export async function capturePageScreenshot(path=(new Date()).getTime()) {
  let reporter = global.reporter
  try {
    path = path+'.png'
    var pathjoin = require('path');
    const name = pathjoin.join(tempDir,'image'+tempCount+'_'+path)
    const buffer = await page.screenshot({path: name, fullPage: true, captureBeyondViewport: false})
    logger.info('Created custom screenshot ', path)
    tempCount = tempCount + 1
    reporter.addAttachment(path, buffer, "image/png");
  }
  catch(err) {
    logger.error("Exception caught in screenshot():"+err)
    return false
  }
  return true
}

export async function verifyLoadingSpinner(){
  logger.info("In verifyLoadingSpinner")
  try {
    await page.waitForSelector("span.iotium-spin-loading-icon");//"img.iotium-spin-img");
    logger.info("Loading spinner appeared")
    let i = 0;
    while (i < 30) {
      let arr = await page.$$("span.iotium-spin-loading-icon");//"img.iotium-spin-img");
      if (arr.length == 0) {
        logger.info("Loading spinner disappeared")
        return true
      }
      await delay(1000)
      i += 1
    }
    logger.error("Loading spinner not disappeared")
  }
  catch(err) {
    return false
  }
}


export async function verifyLoaginr(){
  logger.info("In verifyLoadingSpinner")
  try {
    await page.waitForSelector("//input[@id='kc-login']");//"img.iotium-spin-img");
    logger.info("Loading spinner appeared")
    let i = 0;
    while (i < 1000) {
      let arr = await page.$$("//input[@id='kc-login']");//"img.iotium-spin-img");
      if (arr.length == 1) {
        logger.info("Login seen ")
        return true
      }
      await delay(1000)
      i += 1
    }
    logger.error("Loading spinner not disappeared")
  }
  catch(err) {
    return false
  }
}