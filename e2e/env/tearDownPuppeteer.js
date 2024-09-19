const puppeteer = require('puppeteer');
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');
console.log('hi1234')
module.exports = async function() {
    await global.__BROWSER__.close();
    rimraf.sync(DIR);
};