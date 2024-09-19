
const PuppeteerHar = require('puppeteer-har');
const har = new PuppeteerHar(page);
global.__HAR__ = har;
//This is for recording JS and CSS usages

module.exports = async function() {
await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
   ]);

   //performance tracing
await page.tracing.start({ path: 'status.json' });
//trying HAR

await har.start({ path: 'results_'+global.testStart+'.har', saveResponse: true });
}