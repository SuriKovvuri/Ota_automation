module.exports = {
    measure: async (page, testFunction) => {
        /** part (1) - garbage collect and get metrics from the page **/
        await page._client.send(`HeapProfiler.enable`);
        await page._client.send(`HeapProfiler.collectGarbage`);
        const startMetrics = await page.metrics();

        /** part (2) - execute the test function **/
        await testFunction.apply(null, arguments);

        /** part (3) - garbage collect and get metrics from the page again **/
        await page._client.send(`HeapProfiler.collectGarbage`);
        const metrics = await page.metrics();

        /** part (4) - calculate diifrences before and after excuting the test function **/
        const measures = [`JSHeapUsedSize`, `LayoutCount`, `RecalcStyleCount`, `JSEventListeners`,
            `Nodes`, `ScriptDuration`, `TaskDuration`, `Timestamp`, `LayoutDuration`, `RecalcStyleDuration`]
            .reduce((accumulator, metric) => ({...accumulator, [metric]: metrics[metric] - startMetrics[metric]}),
                {screenshot: await page.screenshot()});

        return measures;
    }
};