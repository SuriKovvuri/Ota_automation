const {
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceMetrics,
} = require('./helper');

async function testIotium(page) {
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');

  await page.goto(global.homeurl);

  await page.waitFor(1000);
  const performanceMetrics = await client.send('Performance.getMetrics');

  return extractDataFromPerformanceMetrics(
    performanceMetrics,
    'FirstMeaningfulPaint'
  );
}

module.exports = testIotium;