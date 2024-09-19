const { logger } = require("../../log.setup");
const measure = require(`./measure`);
const reporter = require(`./reporter`);
import { delay } from "../../../utils/utils";

module.exports = {
    measureAndReport: (page, testName, testFunction) =>
        measure.measure(page, testFunction)
            .then(measures => reporter.report(measures, testName)),
    reportData: (measures, testName) =>
        reporter.report(measures, testName),
    retryReportData: async function (currentMeasure,error='SQLITE_BUSY: database is locked') {
        if ("error" in currentMeasure && currentMeasure.error == error) {
            logger.error("currentMeasure measures: "+currentMeasure.measures+"\ncurrentMeasure testName: "+currentMeasure.testName+"\ncurrentMeasure error: "+currentMeasure.error)
            let retry = 1
            while (retry <= 50) {
                logger.info("Current retry count: "+retry)
                await delay(100)
                currentMeasure = await reporter.report(currentMeasure.measures, currentMeasure.testName)
                if (!("error" in currentMeasure && currentMeasure.error == error)) {
                    return currentMeasure
                } else {
                    logger.error("currentMeasure measures: "+currentMeasure.measures+"\ncurrentMeasure testName: "+currentMeasure.testName+"\ncurrentMeasure error: "+currentMeasure.error)
                }
                retry++;
            }
        } else {
            return currentMeasure
        }
    }
};