const NodeEnvironment = require('jest-environment-node');

const orchIP = "192.170.200.81"
const orchURL = 'https://' + orchIP 


const iotiumAdmin = "admin@iotium.io";
const iotiumAdminPassword = "f@bIoT172917299"



const orgName = "ThyagaINC"
const orgAdmin = "thyaga.krishnamurthy@iotium.io"
const orgAdminPassword = "f@bIoT172917299"

const orgReadonly = "readonly@iotium.io"
const orgReadonlyPassword = "f@bIoT172917299"

class CustomNodeEnvironment extends NodeEnvironment {
    constructor(config) {
        console.log("This is the third")
        super(config);
    }
    async setup() {
        await super.setup();
            
        await page.setDefaultNavigationTimeout(30000); 
        console.log("This is the fourth")
        await page.goto(orchURL)
        
        //await page.goto('https://192.170.200.8')
        await expect(page.title()).resolves.toMatch('Login - ioTium Orchestrator');
        const cookies = await page.cookies()
        console.log("Cookies print "+cookies);
        //await page.goto('http://www.google.com')
        console.log('Before ALL')
        jest.setTimeout(30000)
        jest.setTimeout.timeout = 30000

        if (jest.scope == 'Admin') {
            await expect(page).toFill('input[id="username"]', iotiumAdmin)
            await expect(page).toFill('input[id="password"]', iotiumAdminPassword)
            } else if (jest.scope == 'orgAdmin') {
                await expect(page).toFill('input[id="username"]', orgAdmin)
                await expect(page).toFill('input[id="password"]', orgAdminPassword)
            } else {
                await expect(page).toFill('input[id="username"]', orgReadonly)
                await expect(page).toFill('input[id="password"]', orgReadonlyPassword)
            }
        
        await expect(page).toClick('button', { text: 'Login' })
        expect(await page.$x("//button[contains(., 'Login')]", { hidden: true }) ? true : false).toBe(true);
    }
}
module.exports = CustomNodeEnvironment;