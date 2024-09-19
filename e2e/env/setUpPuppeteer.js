
const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

console.log('hi123')
module.exports = async function() {
    
      
    const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors:true });
    global.__BROWSER__ = browser;
    mkdirp.sync(DIR);
    fs.writeFileSync(
        path.join(DIR, 'wsEndpoint'),     
        browser.wsEndpoint()
    );
};