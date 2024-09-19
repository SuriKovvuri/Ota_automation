import { defineFeature, loadFeature } from 'jest-cucumber';
import { Example } from '../src/example';
import { givenIamExample, givenIamLoggedIn, givenIHaveOrchCredentials, thenIamLoggedIn, thenIShouldSeeNoConsoleErrors, thenTheTestShouldRun, whenIHitLogin, whenILaunchTheTest, whenINavigateToAllScreens } from './shared-steps';



const testIotium = require('../src/testIotium');

const fs = require('fs');
const unzipper = require('unzipper/unzip');

const feature = loadFeature('./e2e/features/example.feature');



defineFeature(feature, test => {

    afterEach(async () => {
        jest.setTimeout(30000)
        //perf
        const performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
        );
        console.log(performanceTiming);
        //perf
        
    })

    afterAll(async () => {
        console.log('After ALL')
        const elemXPath = "//button[contains(@title, 'My Account')]"
        const elemExists = await page.waitForXPath(elemXPath, {timeout: 10000}) ? true : false;
        expect(elemExists).toBe(true)
        await expect(page).toClick('button[title="My Account"]')
        await page.waitFor(1000)
        await expect(page).toClick('span', { text: 'Logout' })
        await page.waitFor(2000)
        //perf
        console.log(await testIotium(page));
        //perf
      })

    beforeAll(async () => {
        await page.setDefaultNavigationTimeout(30000); 
        
        await page.goto(global.homeurl)
        await expect(page.title()).resolves.toMatch('Login - ioTium Orchestrator');
        const cookies = await page.cookies()
        console.log(cookies);
        //await page.goto('http://www.google.com')
        console.log('Before ALL')
        jest.setTimeout(30000)
        jest.setTimeout.timeout = 30000
      })

  test('Launching a test', ({ given, when, then }) => {
      let eg;

        given('I am Example', () => {
            eg = new Example();
        });

        when('I launch the test', () => {
            eg.launch();
        });

        then('the test should run', () => {
            expect(eg.isInTest).toBe(true);
        });
  });

  test('Testing the login failure', ({ given, when, then }) => {
    

      given('I am at login page', async () => {
        await expect(page.title()).resolves.toMatch('Login - ioTium Orchestrator');
      });

      when('I give invalid login', async () => {
        await page.type('input[id=username]', 'test comment', {delay: 20})
        await page.type('input[id=password]', 'test comment', {delay: 20})
        await page.screenshot({path: '2.png', fullPage: true});
        const [button] = await page.$x("//button[contains(., 'Login')]");
        if (button) {
            await button.click();
        }
        
      });

      then('I should not log in', async () => {
        await page.waitFor(2000)
        await page.screenshot({path: '23.png', fullPage: true});
        console.log('hi DOne')
      });
    
    });
    test('Launching a test1', ({ given, when, then }) => {
        console.log('testing comon steps')
        givenIamExample(given);
        whenILaunchTheTest(when);
        thenTheTestShouldRun(then);
        
          
    });

    test('Launching a test22', ({ given, when, then }) => {
        console.log('testing comon steps1')
        let rash;

        given('I am rash', () => {
            rash = new Rash();
        });

        when('I launch the test to verify', () => {
            rash.create();
        });

        then('the test should run', () => {
            expect(rash.isInVerify).toBe(false);
        });
          
    });

    test('Regr Valid Login test', ({ given, when, then }) => {
        console.log('testing Valid login')
        givenIHaveOrchCredentials(given);
        whenIHitLogin(when);
        thenIamLoggedIn(then);
          
    });

    test('Regr Navigation test', ({ given, when, then }) => {
        console.log('testing Navigation test')
        givenIamLoggedIn(given);
        whenINavigateToAllScreens(when);
        thenIShouldSeeNoConsoleErrors(then);
          
    });

    test('Regr Add a virtual Node', ({ given, when, then }) => {
        console.log('Add a virtual Node')
        givenIamLoggedIn(given);
        when('I add a node', async() => {
          await expect(page).toClick('div > div.ant-layout-sider > div.ant-layout-sider-children > div:nth-child(3) > ul.ant-menu.ant-menu-inline.scrollable-menu.ant-menu-dark.ant-menu-root > li:nth-child(2)')
          await page.waitFor(1000)
          await expect(page).toClick('input.ant-checkbox-input', { type: 'checkbox' })
          await page.waitFor(1000)
          await expect(page).toClick('a', { text: 'ThyagaINC' })
          console.log('Trying to find the add node button')
          await expect(page).toClick('div > div.ant-layout-sider > div.ant-layout-sider-children > div:nth-child(3) > span > span > .ant-btn')
          await page.waitFor(1000)
          //await expect(page).toClick('span', { text: '&nbsp;Add iNode' })
          await expect(page).toClick('div.ant-dropdown-placement-bottomLeft > ul > li:nth-child(2)')
          await page.waitFor(3000)
          await expect(page).toClick('.ant-message-custom-content > span > span > span:nth-child(2) > .anticon')

          const form = "form.ant-form"
          const formElem = await page.waitForSelector(form, {timeout: 10000})
          console.log('Found add form element')
          await expect(formElem).toFill('#name', 'ThyagaNode')
          //const formRows = await formElem.waitForSelector('div.ant-form-item', {timeout: 10000})
          const divsCounts = await formElem.$$eval('div.ant-form-item', divs => divs.length);
          let formRows = await formElem.$$('div.ant-form-item');
          console.log('divsCounts =', divsCounts)
          const formProfileElem = await formRows[2]
          await expect(formProfileElem).toClick('span.ant-select-arrow')
          await page.waitFor(1000)
          await expect(page).toClick('li', { text: 'Virtual Edge'})

          //await expect(page).toClick('div', { text: 'Select Profile' })
          //await expect(page).toClick('li', { text: 'Virtual Edge' })
          formRows = await formElem.$$('div.ant-form-item');
          const formSSHKeyeElem = await formRows[3]
          //const formSSHKeyeElem = await formElem.waitForSelector('div.ant-form-item:nth-child(4)', {timeout: 10000})
          await expect(formSSHKeyeElem).toClick('span.ant-select-arrow')
          await page.waitFor(1000)
          await expect(page).toClick('li', { text: 'new'})
          
          //await expect(page).toClick('div', { text: 'Select SSH Key' })
          //await expect(page).toClick('li', { text: 'new' })

          await expect(page).toClick('#download_type')
          await page.waitFor(1000)
          await expect(page).toClick('div.ant-modal-footer > button.ant-btn-primary')
          await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './'});
          

          await page.waitFor(5000)
          const fsexist = fs.exists('./ThyagaNode.iso')
          if (fsexist) {
          fs.createReadStream('./ThyagaNode.iso')
            .pipe(unzipper.Extract({ path: './ThyagaNode' }));
          } else {
              console.log('The file path does not exist')
          }

        });
        then('node is added', async() => {
            console.log('Then portion to verify node added')
          await expect(page).toClick('div > div.ant-layout-sider > div.ant-layout-sider-children > div:nth-child(3) > ul.ant-menu.ant-menu-inline.scrollable-menu.ant-menu-dark.ant-menu-root > li:nth-child(3)')
          console.log('Then portion to verify node added2')
          await page.waitFor(5000)
          await expect(page).toClick('#inodes\\$Menu > li:nth-child(1)')
        //   jest.setTimeout(10000);
        //   const elemXPath2 = "//span[contains(., 'All iNodes')]"
        //   const elemExists2 = await page.waitForXPath(elemXPath2, {timeout: 10000}) ? true : false;
        //   console.log('elemExists2 = ', elemExists2);
        //   await expect(page).toClick('span', { text: 'All iNodes' })
          console.log('Then portion to verify node added3')
          await page.waitFor(1000)
          console.log('Then portion to verify node added4')
          await expect(page).toMatchElement('a', { text: 'ThyagaNode' })
        });
          
    });
});