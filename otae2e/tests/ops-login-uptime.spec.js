//const measureAndReport = require(`./utils/performanceTracker`).measureAndReport;
//const reporter = require(`./utils/reporter`);
import { delay, getEnvConfig } from '../../utils/utils';
import * as constant from '../../utils/constants';
import QrCode from 'qrcode-reader';
import * as Jimp from "jimp";
import * as OTPAuth from 'otpauth';
const puppeteer = require('puppeteer');
let browser, page, config;

const thresholds = { // define thresholds measures
    HEAP : 10000,
    DOM_ELEMENT : 20,
    DURATION : 1000 / 1000,
    TOTALLOADDURATION : 20,
    TOTALOTHERDURATION : 10
};

function console1 (s1) {
    var now = new Date();
    // convert date to a string in UTC timezone format:
    console.log(now.toUTCString()+s1);
}

describe(`OPS test for adminlogin`, () => {    

    // navigate to the page and wait until you see the menu button.
    beforeAll(async () => { // before every test, open new tab and navigate to google. 
        try {
        //page = await global.__BROWSER__.newPage();
        //var config = await getEnvConfig()
        //await page.goto(config.otaURL)
        //await reporter.createTable();
        jest.setTimeout(60000)
        browser = await puppeteer.launch({dumpio: true,
            //headless: process.env.HEADLESS !== 'false',
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/79.0.3945.117 Chrome/79.0.3945.117 Safari/537.36',
      
            headless: true,
            ignoreHTTPSErrors: true,
            defaultViewport: {
              width:1080,//1920,1080
              height: 768 //768, 1200
           },
           args:[
            '--start-maximized', // you can also use '--start-fullscreen'
            "--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox', '--disable-gpu'
               //, '--no-sandbox', '--disable-gpu'
            //'--disable-dev-shm-usage'
         ]}); //spinning up new browser instance
        page = await browser.newPage() 
        config = await getEnvConfig()
        global.orchIP = config.otaIP
        global.homeurl = config.otaURL

        await page.goto(config.otaURL)
        console.log("Done before all")
        }catch(err) {
            console1(err);
            }
    });
    afterAll(async () => {
        try {
          await console1('After ALL')
          await browser.close();
          await createPDF(global.testStart,'parallel-test1')
        } catch(err) {
            console(err);
            }
        });

    test('Login as admin', async () => {
        const error_xpath_selector = '//span[@class="kc-feedback-text"]';
        const errorclose_xpath_selector = '//span[@class="kc-feedback-text"]';
        const cluster_xpath_selector = '//span[@class="clusteringColorLegend"]';
        const userguide_xpath_selector = '//div[@class="userGuide"]';
        const logoutuserprofile_xpath_selector = '//svg[@type="user-circle"]'
        const button = await page.waitForSelector(constant.loginPage, {visible: true});//i am feeling lucky
        await expect(page).toFill(constant.loginFormNameByName,config.iotiumMonitor)
        await expect(page).toFill(constant.loginFormPasswordByName, config.iotiumMonitorPassword)
        

        console1(" Starting to login");
        await button.click({delay: 50}); // click on the menu button.
        
        //await page.waitForXPath(constant.userguide_xpath_selector, {visible: true});//Map is displayed
        //await page.waitForNavigation({
        //    waitUntil: 'networkidle0',
        //});
        await delay(5000)
        if (config.iotiumMonitorOTPSecret == 'first') {
            let abc = await expect(page).toMatchElement(constant.qrCodeImg)
            if (abc != false) {
                console1("image found" + abc)
            } else {
                console1("image not found" + abc)
            }
            const text123 = await (await abc.getProperty('src')).jsonValue();
            console1("image -----> " + text123)

            
            const buffer = Buffer.from(text123.substr("data:image/png;base64,".length), "base64");
            console1("buffer --- >" + buffer)
            console1("----------->" + text123.substr("data:image/png;base64,".length))
            const image = await (Jimp).read(buffer);
            console1("image123 --- >" + image)
            let test123
            let decoded = new Promise((resolve, reject) => {
                const qr = new QrCode();
                qr.callback = (error, value) => error ? reject(error) : resolve(value.result);
                qr.decode(image.bitmap);
            });
            console1("decoded value is ---> " + decoded)
            decoded.then(
                (result) => {
                    console1("result value is --->" + result)
                    test123 = result
                },
                (error) => {
                    console1("error" + error)
                }
            );
            await delay(20000)
            console1("value of test123 ---> " + test123)

            let splitted_string = test123.split("secret=")[1];
            var secret_string = splitted_string.substring(0, splitted_string.indexOf("&digits"));
            console1("value of secret_string ---> " + secret_string)      
            let totp = new OTPAuth.TOTP({
                issuer: 'ACME',
                label: 'AzureDiamond',
                algorithm: 'SHA1',
                digits: 6,
                period: 30,
                secret: secret_string 
            });

            // Generate a token.
            let token = totp.generate();
            console1("OTP is :" + token)
            await delay(2000)
            await expect(page).toFill(constant.otpForm, token)
            //let screenshot3 = await customScreenshot('Usenamecheck3.png', 1920, 1200)
            //reporter.addAttachment("MFA setup done and token generated", screenshot3, "image/png");
            await expect(page).toClick(constant.otpFirstSubmitButton)
            
        } else if(config.iotiumMonitorOTPSecret == ''){
            await expect(page).toMatchElement('div', constant.userProfileText)
            console1(" Dashboard loaded");
        } else {
            let totp = new OTPAuth.TOTP({
                issuer: 'ACME',
                label: 'AzureDiamond',
                algorithm: 'SHA1',
                digits: 6,
                period: 30,
                secret: config.iotiumMonitorOTPSecret // or "OTPAuth.Secret.fromB32('NB2W45DFOIZA')"
            });

            // Generate a token.
            let token = totp.generate();
            console1("OTP is :" + token)
            await delay(2000)
            await expect(page).toFill(constant.otpForm, token)
            //let screenshot3 = await customScreenshot('Usenamecheck3.png', 1920, 1200)
            //reporter.addAttachment("MFA setup done and token generated", screenshot3, "image/png");
            await expect(page).toClick(constant.otpLoginButton)
        }
        await delay(5000)
        await expect(page).toMatchElement('div', constant.userProfileText)
        console1(" Dashboard loaded");
       
    });

});