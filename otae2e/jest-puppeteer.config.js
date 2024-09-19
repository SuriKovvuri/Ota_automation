
console.log("is this called")
module.exports = {
    launch: {
      dumpio: true,
      //headless: process.env.HEADLESS !== 'false',
      headless: true,
      ignoreHTTPSErrors: true,
      
    },
    browser: 'chromium',
    browserContext: 'default',
  }
