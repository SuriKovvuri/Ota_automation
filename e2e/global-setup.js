// global-setup.js
const { setup: setupPuppeteer } = require('jest-environment-puppeteer')

module.exports = async function globalSetup(globalConfig) {
  await setupPuppeteer(globalConfig)
}

