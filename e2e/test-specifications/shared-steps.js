import { goToNetworkAction } from '../helper/networks';
import { goToNode, goToNodes, rebootiNode } from '../helper/node';
import { goToOrg, goToOrgs } from '../helper/org';
import { goToService } from '../helper/services';
import { Example } from '../src/example';
import { addTanNetwork, connectNetwork, expandTabsInNetworkPage, getTunnelStatus } from '../helper/networks';
import { NetworkAdd } from '../src/networkAdd';
import { NetworkConnect } from '../src/networkConnect';
import { customScreenshot, delay, getEnvConfig, replaceEnvs } from '../../utils/utils';
import { logger } from '../log.setup';
var assert = require('assert');
import { Login } from '../helper/login';
import { goToAlertPage, addAlertSubscription } from '../helper/alert';
import { AlertAdd } from '../src/alertAdd';
import { leftpane } from '../constants/locators';

const flushPromises = () => new Promise(setImmediate);
let eg;


export const givenIamExample = given => {
  given('I am Example', () => {
    eg = new Example();
    logger.info('within common steps')
  });
};

export const givenIHaveOrchCredentials = given => {
  given('I have orch credentials', async () => {
    await expect(page.title()).resolves.toMatch('Login - ioTium Orchestrator');

  });
};

export const givenIamLoggedIn = given => {
  given('I am logged in', async () => {
    try {
      console.log("In givenIamLoggedIn")
      reporter.startStep("Given I am logged in");
      try {
        //just to ensure in case of logout performed in other scenario, we will login again
        const elemXPath = "//button[contains(@title, 'Logout')]"
        const elemExists = await page.waitForXPath(elemXPath, { timeout: 30000 }) ? true : false;
        if (elemExists == false) {
          let login
          login = new Login();
          logger.info("global.env = " + global.env)
          await login.launch(global.env, global.scope)
          expect(elemExists).toBe(true)
          expect(await page.$x("//button[contains(., 'Login')]", { hidden: true }) ? true : false).toBe(true);
        } else {
          expect(elemExists).toBe(true)
          expect(await page.$x("//button[contains(., 'Login')]", { hidden: true }) ? true : false).toBe(true);
        }
      } catch (e) {
        expect(e).toMatch('error');
      }
      let screenshot = await customScreenshot('givenIamLoggedIn.png')
      reporter.addAttachment("givenIamLoggedIn", screenshot, "image/png");
      reporter.endStep();
    } catch (e) {
      expect(e).toMatch('error');
    }

  });

};

export const givenIamLoggedInAs = given => {
  given(/^I am logged in as "(.*?)"$/, async (scope) => {
    try {
      reporter.startStep(`Given I logout if logged in already`)
      const elemXPath = "//button[contains(@title, 'My Account')]"
      //const elemExists = await page.waitForXPath(elemXPath, { timeout: 30000 }) ? true : false;
      const elemExists = await page.$x(leftpane.button.logout)
      var login
      login = new Login();
      if (elemExists.length != 0) {
        logger.info("Already logged in; logging out")
        //await delay(15000)
        let result = await login.logout()
        expect(result).toBe(true)
        logger.info("Logout completed wait for networkidle")
        await delay(15000)
      }
      reporter.endStep()

      reporter.startStep(`Given I am logged in as ${scope}`)
      logger.info("In givenIamLoggedInAs " + scope)
      logger.info("In givenIamLoggedInAs global.env " + global.env)
      logger.info("global.env = " + global.env)
      logger.info("scope = " + scope)
      await login.launch(global.env, scope)
      await delay(15000)
      await page.$x(leftpane.button.logout, { visible: true, timeout: 30 })
      reporter.endStep()
    } catch (e) {
      expect(e).toMatch('error');
    }
  });

};




export const whenILaunchTheTest = when => {
  when('I launch the test', () => {
    eg.launch();
  });
};

export const whenIHitLogin = when => {
  when('I hit login', async () => {
    try {
      //Not need using expect-paupeeteer instead
      //just ensuring input text is cleared
      /*
      const username = await page.$('input[id=username]');
      const password = await page.$('input[id=password]');
      await username.click({clickCount: 3});
      await password.click({clickCount: 3});
      await page.type('input[id=username]', 'admin@iotium.io', {delay: 20})
      await page.type('input[id=password]', 'f@bIoT172917299', {delay: 20})
      await page.screenshot({path: '2.png', fullPage: true});
      const [button] = await page.$x("//button[contains(., 'Login')]");
      if (button) {
          await button.click();
      }
      */
      await expect(page).toFill('input[id="username"]', 'admin@iotium.io')
      await expect(page).toFill('input[id="password"]', 'f@bIoT172917299')
      await expect(page).toClick('button', { text: 'Login' })
    } catch (err) {
      logger.info(err);
    }
  });
};

export const thenTheTestShouldRun = then => {
  then('the test should run', () => {
    expect(eg.isInTest).toBe(true);
  });
};

export const thenIamLoggedIn = then => {
  then('I am logged in', async () => {
    try {
      reporter.startStep("name")
      const elemXPath = "//button[contains(@title, 'My Account')]"
      // @ts-ignore
      const elemExists = await page.waitForXPath(elemXPath, { timeout: 30000 }) ? true : false;
      expect(elemExists).toBe(true)
      await page.screenshot({ path: 'loggedIn.png', fullPage: true });

      expect(await page.$x("//button[contains(., 'Login')]", { hidden: true }) ? true : false).toBe(true);
      //page.waitForXPath(elemXPath, { hidden: true });

      //Clicking on the download page, expecting a console error
      await expect(page).toClick('.ant-layout-sider-children > div > .ant-menu > .ant-btn > a')
      //await page.waitForSelector('.ant-message-notice-content > .ant-message-custom-content > span > span > .portal-err-msg', { hidden: false })

      expect(await page.waitForSelector('.ant-message-notice-content > .ant-message-custom-content > span > span > .portal-err-msg', { hidden: false }) ? true : false).toBe(true);
      await page.screenshot({ path: 'consoleerror.png', fullPage: true });

      //closing the console error
      await expect(page).toClick('.ant-message-custom-content > span > span > span > .anticon')
      await page.screenshot({ path: 'consoleerror_Cancelled.png', fullPage: true });

      await page.waitFor(1000)
      reporter.endStep()
    } catch (err) {
      logger.info(err);
    }

  });
};

export const thenServiceShouldBeAdded = async (then, callback) => {
  then(/^Service should be Added "(.*?)"$/, async (serviceName) => {  
    try {

      await delay(60000)//waiting 1 minute before checking status

      reporter.startStep("Then Service is added " + serviceName);
      logger.info("I am in the and function thenServiceShouldBeAdded")

      let serviceHandle = await goToService(serviceName)

      let screenshot = await customScreenshot('serviceCreated.png', 1920, 1200)
      reporter.addAttachment("Service Created", screenshot, "image/png");
      reporter.endStep();
      await delay(3000)

      return callback(serviceHandle);

    } catch (err) {
      logger.info(err);
    }

  });

};

export const andWhenServiceIs = (and, callback) => {
  and(/^Service is "(.*?)"$/, async (serviceName) => {
    try {

      if (serviceName == 'node1_service1') {
        //here replace the node name from the env config file
        var config = await getEnvConfig()
        logger.info("config.node1_service1 = " + config.node1_service1)
        serviceName = config.node1_service1
      }
      reporter.startStep("And Service is " + serviceName);
      logger.info("I am in the and function andWhenServiceIs")
      //Service action view does not show the service status,need to just return the service handle
      //await goToServiceAction(serviceName, 'view')
      let serviceHandle = await goToService(serviceName)
      reporter.endStep();
      await delay(3000)

      return callback(serviceHandle);

    } catch (err) {
      logger.info(err);
    }

  });

};

export const andWhenNetworkIs = and => {
  and(/^Network is "(.*?)"$/, async (networkname) => {
    try {

      if (networkname == 'node1_tan1') {
        //here replace the node name from the env config file
        var config = await getEnvConfig()
        logger.info("config.node1_tan1 = " + config.node1_tan1)
        networkname = config.node1_tan1
      }

      reporter.startStep("And Network is " + networkname);
      logger.info("I am in the and function andWhenNetworkIs")
      await goToNetworkAction(networkname, 'view')
      reporter.endStep();
      await delay(3000)
    } catch (err) {
      logger.info(err);
    }

  });
};

export const andWhenNodeIs = and => {
  and(/^Node is "(.*?)"$/, async (nodename) => {
    try {

      //goToNodes()
      logger.info("I am in the and function andWhenNodeIs")
      if (nodename == 'node1') {
        //here replace the node name from the env config file
        var config = await getEnvConfig()
        logger.info("config.node1 = " + config.node1)
        nodename = config.node1
      }
      reporter.startStep("And Node is " + nodename);
      await goToNode(nodename)
      reporter.endStep();
      await delay(3000)
    } catch (err) {
      logger.info(err);
    }

  });
};

export const whenOrgis = when => {
  when(/^Org is "(.*?)"$/, async (org) => {
    try {
      if (org == 'orgName') {

        //here replace the node name from the env config file
        var config = await getEnvConfig()
        logger.info("config.orgName = " + config.orgName)
        org = config.orgName
      }
      reporter.startStep("When Org is " + org);
      logger.info("I am in the when function whenOrgis")
      await goToOrg(org)
      reporter.endStep();
      await delay(3000)
    }
    catch (err) {
      logger.info(err);
    }

  });
};



export const whenINavigateToAllScreens = when => {
  when('I navigate to left panel screens', async () => {
    try {
      //This is navigation

      //await page.goto('https://192.170.200.8/home')
      logger.info('in the whenINavigateToAllScreens');
      reporter.startStep("When I navigate to left panel screens");
      //await expect(page).toClick('div > div.ant-layout-sider > div.ant-layout-sider-children > div:nth-child(3) > ul.ant-menu.ant-menu-inline.scrollable-menu.ant-menu-dark.ant-menu-root > li:nth-child(2)')
      reporter.startStep("Goto left panel orgs");
      await goToOrgs()
      await page.waitFor(1000)
      reporter.endStep()

      //await expect(page).toClick('div > div.ant-layout-sider > div.ant-layout-sider-children > div:nth-child(3) > ul.ant-menu.ant-menu-inline.scrollable-menu.ant-menu-dark.ant-menu-root > li:nth-child(3)')
      reporter.startStep("Goto left panel iNodes");
      await goToNodes()
      await page.waitFor(1000)
      reporter.startStep("When I navigate to left panel screens iNodes All iNodes");
      await expect(page).toClick('#inodes\\$Menu > li:nth-child(1)')
      await page.waitFor(1000)
      reporter.endStep()
      logger.info('clicked the all inodes');
      reporter.startStep("When I navigate to left panel screens iNodes Serial Numbers");
      await expect(page).toClick('#inodes\\$Menu > li:nth-child(2)')
      await page.waitFor(1000)
      reporter.endStep()
      logger.info('clicked the Serial numbers');
      reporter.startStep("When I navigate to left panel screens iNodes SSH Keys");
      await expect(page).toClick('#inodes\\$Menu > li:nth-child(3)')
      await page.waitFor(1000)
      reporter.endStep()
      reporter.endStep()
      //await expect(page).toClick('div > div.ant-layout-sider > div.ant-layout-sider-children > div:nth-child(3) > ul.ant-menu.ant-menu-inline.scrollable-menu.ant-menu-dark.ant-menu-root > li:nth-child(4)')
      reporter.startStep("When I navigate to left panel screens Networks");
      await expect(page).toClick('span.nav-text', { text: 'Networks' })
      await page.waitFor(1000)
      logger.info('clicked the networks');
      reporter.startStep("When I navigate to left panel screens Networks All Networks");
      const elemXPath2 = "//span[contains(., 'All Networks')]"
      const elemExists2 = await page.waitForXPath(elemXPath2, { timeout: 10000 }) ? true : false;
      logger.info('elemExists2 = ', elemExists2);
      await expect(page).toClick('span', { text: 'All Networks' })
      logger.info('clicked the All Networks');
      reporter.endStep()
      //await expect(page.$x).toClick('//*[@id="networks\\$Menu"]/li[0]')
      await page.waitFor(1000)
      reporter.startStep("When I navigate to left panel screens Networks CustomSecurity Policy");
      await expect(page).toClick('span.nav-text', { text: 'Custom Security Policy' })
      await page.waitFor(1000)
      logger.info('clicked the Custom Security Policy');
      reporter.endStep()
      reporter.endStep()
      reporter.startStep("When I navigate to left panel screens Services");
      await expect(page).toClick('span', { text: 'Services' })
      await page.waitFor(1000)
      logger.info('clicked the Services');
      reporter.startStep("When I navigate to left panel screens Services All Services");
      await expect(page).toClick('span.nav-text', { text: 'All Services' })
      await page.waitFor(1000)
      logger.info('clicked the All Services');
      reporter.endStep()
      reporter.startStep("When I navigate to left panel screens Services Service Secrets");
      await expect(page).toClick('span.nav-text', { text: 'Service Secrets' })
      await page.waitFor(1000)
      logger.info('clicked the Service Secrets');
      reporter.endStep()
      reporter.endStep()

      reporter.startStep("When I navigate to left panel screens Users");
      await expect(page).toClick('span', { text: 'Users' })
      await page.waitFor(1000)

      logger.info('clicked the users');
      reporter.startStep("When I navigate to left panel screens Users All Users");
      await expect(page).toClick('span.nav-text', { text: 'All Users' })
      await page.waitFor(1000)
      logger.info('clicked the Add user and filling form and cancel');
      reporter.endStep()
      reporter.startStep("When I navigate to left panel screens Users All Users Add User for cancel data");
      await expect(page).toClick('button[title="Add User"]')
      await page.waitFor(1000)
      await expect(page).toFill('input[placeholder="Full Name"]', 'James')
      await expect(page).toFill('input[placeholder="Email Address"]', 'James')
      await expect(page).toFill('input[placeholder="Password"]', 'James')
      await expect(page).toFill('input[placeholder="Confirm Password"]', 'James')
      //await expect(page).toSelect('div[text="Select Role"]', 'Admin')
      await expect(page).toClick('#roles')
      logger.info('clicked the Select roles');
      await page.waitFor(1000)
      await expect(page).toClick('li', { text: 'Admin' })
      await page.waitFor(1000)
      await expect(page).toClick('span', { text: 'Cancel' })
      await page.waitFor(1000)
      logger.info('clicked the cancel in Add user');
      await expect(page).toClick('span', { text: 'Users' })
      await page.waitFor(1000)
      logger.info('clicked the users');
      reporter.endStep()
      reporter.startStep("When I navigate to left panel screens Users All Roles");
      await expect(page).toClick('span.nav-text', { text: 'All Roles' })
      await page.waitFor(1000)
      logger.info('clicked the All Roles');
      reporter.endStep()
      reporter.endStep()
      reporter.endStep()

    } catch (err) {
      logger.info(err);
    }

  });
};

export const thenIShouldSeeNoConsoleErrors = then => {
  then('I should see no console errors', async () => {

    await page.waitFor(1000)


    logger.info('Testing the console error');
    /*
    page.on('error', err=> {
        logger.info('error happen at the page: ', err);
      });
    
      page.on('pageerror', pageerr=> {
        logger.info('pageerror occurred: ', pageerr);
      })
      const three= await page.evaluate(()=> 1+2);
      logger.info('three value is: ', three);
      try {
        await page.evaluate(()=> {
          throw new Error('js throw some error');
        });
      } catch (e) {
        logger.info('an expection on page.evaluate ', e);
      }
      */



  });
};


export const whenIAddTanNetwork = when => {
  when(/^Add A TAN Network$/, async (table) => {
    reporter.startStep("When Add A TAN Network")
    logger.info("Navigate to node")
    logger.info("Starting to add a TAN Network")
    var nodename
    var network

    //table.forEach(row => {
    for (var row of table) {
      var config = await getEnvConfig()
      if (row.NetworkName == 'node1_tan1') {
        logger.info("config.node1_tan1 = " + config.node1_tan1)
        row.NetworkName = config.node1_tan1
      }
      if (row.NodeName == 'node1') {
        logger.info("config.node1 = " + config.node1)
        row.NodeName = config.node1
      }
      network = new NetworkAdd()
      network.setNetworkAdd(row.NetworkName, row.Label, row.Nw_Addressing, row.CIDR, row.Start_IP, row.end_IP,
        row.GW, row.VLAN, row.VLAN_ID, row.Default_Destination, row.Service_Addressing)
      nodename = row.NodeName

      await page.goto(global.homeurl + '/home')
      await delay(10000)
      await goToNode(nodename)
      await delay(3000)
      await addTanNetwork(network)
    }
    reporter.endStep();
  });
};


export const whenIConnectNetwork = when => {
  when(/^Connect network$/, async (table) => {
    logger.info("Connect network")
    var network_connect = []
    var nodename
    //table.forEach(row => {
    for (var row of table) {
      row = await replaceEnvs(row);
      var network
      network = new NetworkConnect()
      network.setNetworkConnect(row.NetworkName, row.PeerNodeName, row.PeerNetworkName, row.PeerRepNetwork)
      nodename = row.NodeName
      network_connect.push(network)
    }
    await page.goto(global.homeurl + '/home')
    await delay(10000)
    await goToNode(nodename)
    await delay(3000)
    global.connected_time = Date.now() * 1000000;
    console.log("global date is ", global.connected_time)
    await connectNetwork(network_connect)
    await delay(3000)
  })
}


  export const whenTunnelStatusExists  = when => {
    when(/^Tunnel status of network "(.*?)" in node "(.*?)" exists$/, async (network, node, table) => {
      //try{
        logger.info("Checking Tunnel status ")
        reporter.startStep("Verifying tunnel status");
        var tunnel
        let tunnels = []
        let expected_status = []
        var nodename
        if (network == 'node1_tan1')
        {
          var config = await getEnvConfig()
          logger.info("config.node1_tan1 = "+config.node1_tan1)
          network = config.node1_tan1
        }
        //table.forEach(row => {
        for (var row of table) {
          row = await replaceEnvs(row);
          let tunnel = new NetworkConnect()
          logger.info("in loop")
          tunnel.setNetworkConnect(row.NetworkName, row.PeerNodeName, row.PeerNetworkName, null)
          expected_status.push(row.ConnectionStatus)
          tunnels.push(tunnel)
          nodename = row.NodeName
        }
        logger.info("nodename" + nodename)
        await goToNode(nodename)
        await delay(3000)
        await goToNetworkAction(network, 'view')
        await delay(3000)
        await expandTabsInNetworkPage('Remote Networks')
        await delay(1000)
        await customScreenshot('ExpandedNetworkPage.png', 1920, 1200)

        for (var ii=0; ii<tunnels.length; ii++){
          let status = await getTunnelStatus(tunnels[ii],expected_status[ii] )
          logger.info("final" + status)
          await expect(status).not.toBeNull
          logger.info("Test expect is done")
          await assert((status!=null), "Tunnel Verify failed")
        }
        let screenshot = await customScreenshot('tunnelExist.png', 1920, 1200)
        reporter.addAttachment("Tunnel Status Exist_", screenshot, "image/png");
        reporter.endStep();    
      //} catch (err) {
      //logger.info("error is " + err);
      //}  
    });
  }

  export const thenTunnelStatusExists  = then => {
    then(/^Tunnel status of network "(.*?)" in node "(.*?)" exists$/, async (network, node, table) => {
      //try{
        logger.info("Checking Tunnel status ")
        reporter.startStep("Verifying tunnel status");
        var tunnel
        let tunnels = []
        let expected_status = []
        var nodename
        if (network == 'node1_tan1')
        {
          var config = await getEnvConfig()
          logger.info("config.node1_tan1 = "+config.node1_tan1)
          network = config.node1_tan1
        }
        //table.forEach(row => {
        for (var row of table) {
          row = await replaceEnvs(row);
          let tunnel = new NetworkConnect()
          logger.info("in loop")
          tunnel.setNetworkConnect(row.NetworkName, row.PeerNodeName, row.PeerNetworkName, null)
          expected_status.push(row.ConnectionStatus)
          tunnels.push(tunnel)
          nodename = row.NodeName
        }
        logger.info("nodename" + nodename)
        await goToNode(nodename)
        await delay(3000)
        await goToNetworkAction(network, 'view')
        await delay(3000)
        await expandTabsInNetworkPage('Remote Networks')
        await delay(1000)
        await customScreenshot('ExpandedNetworkPage.png', 1920, 1200)

        for (var ii=0; ii<tunnels.length; ii++){
          let status = await getTunnelStatus(tunnels[ii],expected_status[ii] )
          logger.info("final" + status)
          await expect(status).not.toBeNull
          logger.info("Test expect is done")
          await assert((status!=null), "Tunnel Verify failed")
        }
        let screenshot = await customScreenshot('tunnelExist.png', 1920, 1200)
        reporter.addAttachment("Tunnel Status Exist_", screenshot, "image/png");
        reporter.endStep();    
      //} catch (err) {
      //logger.info("error is " + err);
      //}  
    });
  }


  export const whenIRebootiNode  = when => {
    when(/^Reboot An iNode$/, async (table) => {
      logger.info("Navigate to node for Reboot")
      reporter.startStep("Rebboting iNode");
      var nodename
      var network

      //table.forEach(row => {
      for (var row of table) {
        var config = await getEnvConfig()
        if (row.NodeName == 'node1')
        {
          logger.info("config.node1 = "+config.node1)
          row.NodeName = config.node1
        }
        nodename = row.NodeName
      }
      await page.goto(global.homeurl+'/home' )
      await delay(10000)
      await goToNode(nodename)
      await delay(5000)
      await rebootiNode(nodename)
      await delay(5000)
      let screenshot = await customScreenshot('iNodeReboot.png', 1920, 1200)
      reporter.addAttachment("iNode Rebooted_", screenshot, "image/png");
      reporter.endStep();
    });
  }

  export const whenIAddAlertSubscriptions = when => {
    when(/^I Add Alert subscriptions$/, async (table) => {
      logger.info("Starting to add Alert subscriptions")
      var alerts = []
      var alert
      for (let i=0; i < table.length; i++) {
        let row = table[i]
        //add default channel as email, if channel is not in table
        if (Object.keys(row).includes('Channel') != true){
          row.Channel = "Email"
        }
        row = await replaceEnvs(row);
        let tunnel_name = row.TunnelName.split(':')
        var config = await getEnvConfig()
        for (let i=0;i<tunnel_name.length;i++)
        {
          if (tunnel_name[i] == 'node1' || tunnel_name[i] == 'vnode1' || tunnel_name[i] == 'vnode2')
          {
            tunnel_name[i] = config.node1
          } else if (tunnel_name[i] == 'node1_tan1') {
            tunnel_name[i] = config.node1_tan1
          }
        }
        row.TunnelName = tunnel_name.join(':')
        alert = new AlertAdd()
        alert.setAlertAdd(row.SubscriptionName, row.OrgName, row.NodeName, row.TunnelName, row.ServiceName, row.Label,
          row.If, row.Is, row.For,row.Scope,row.Channel)

        await goToAlertPage()
        //logger.info("in delay 5000")
        //await delay(5000)
        await addAlertSubscription(alert)
        alerts.push(alert.getname())
      }
      logger.info("Ending add Alert subscriptions ",alerts.length)
    });
    
  }
  
