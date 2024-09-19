const { logger } = require("../../log.setup");
const { delay } = require("../../../utils/utils");
const dbHelper = require(`./dbHelper`);

module.exports = {
    /**
     * get the last recorded measures of the given test name
     * @param testName - test name
     * @return {*|Promise<any>} - the measures
     */
    getLastMeasures: testName => dbHelper.getLastRow(testName),
    /**
     * report the given measures to DB.
     * @param measures - measures to insert
     * @param testName - test name
     * @return {Promise<*|Promise<any>>}
     */
    report: async function (measures, testName) {
        return dbHelper.reportData(Object.assign(measures, {testName}))
        .catch(function(rej) {
            logger.error("Reject error:"+rej)
            let result = {
                "measures" : measures,
                "testName" : testName,
                "error" : rej
            }
            logger.error("Return Value: "+result)
            return result
        })
    },
    createTable: table => dbHelper.createTable()
};