
//You can specify a jest-puppeteer.config.js at the root of the project 
//or define a custom path using JEST_PUPPETEER_CONFIG environment variable. It should export a config object or a Promise for a config object.
console.log("This is the first")
module.exports = {
    launch: {
      dumpio: true,
      //headless: process.env.HEADLESS !== 'false',
      userAgent: 'View Monitor',

      headless: false,
      ignoreHTTPSErrors: true,
      defaultViewport: {
        width:1360,//1920,1080
        height: 768
     },
     args:[
      '--start-maximized', // you can also use '--start-fullscreen'
      "--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox', '--disable-gpu'
	     //, '--no-sandbox', '--disable-gpu'
      //'--disable-dev-shm-usage'
   ]
   
    },
    browser: 'chromium',
    browserContext: 'default',
  }
