
module.exports = async function() {
    //Retrive the coverage objects
        //This is for stopping JS and CSS usages
        const [jsCoverage, cssCoverage] = await Promise.all([
            page.coverage.stopJSCoverage(),
            page.coverage.stopCSSCoverage(),
        ]);

        //Stop perf tracing
        await page.tracing.stop();
        //trying HAR
        await global.__HAR__.stop();
};