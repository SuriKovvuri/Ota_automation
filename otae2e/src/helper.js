// Normalizing the text
function getText(linkText) {
    linkText = linkText.replace(/\r\n|\r/g, "\n");
    linkText = linkText.replace(/\ +/g, " ");
  
    // Replace &nbsp; with a space 
    var nbspPattern = new RegExp(String.fromCharCode(160), "g");
    return linkText.replace(nbspPattern, " ");
  }
  
  // find the link, by going over all links on the page
  export async function findByLink(page, linkString) {
    const links = await page.$$('a')
    for (var i=0; i < links.length; i++) {
      let valueHandle = await links[i].getProperty('innerText');
      let linkText = await valueHandle.jsonValue();
      const text = getText(linkText);
      if (linkString == text) {
        console.log(linkString);
        console.log(text);
        console.log("Found");
        return links[i];
      }
    }
    return null;
  }

  const getTimeFromPerformanceMetrics = (metrics, name) =>
  metrics.metrics.find(x => x.name === name).value * 1000;

const extractDataFromPerformanceMetrics = (metrics, ...dataNames) => {
  const navigationStart = getTimeFromPerformanceMetrics(
    metrics,
    'NavigationStart'
  );

  const extractedData = {};
  dataNames.forEach(name => {
    extractedData[name] =
      getTimeFromPerformanceMetrics(metrics, name) - navigationStart;
  });

  return extractedData;
};

module.exports = {
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceMetrics,
};