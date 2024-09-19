var reporter = require('cucumber-html-reporter');
var d = new Date()
var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + "_" +
d.getHours() + "_" + d.getMinutes();

var options = {
        theme: 'bootstrap',
        jsonFile: './reports/cucumber_report-test-report.json',
        output: './reports/cucumber_report-'+datestring+'.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: true,
        metadata: {
            "App Version":"20.02",
            "Test Environment": "Automation",
            "Browser": "Chrome  54.0.2840.98",
            "Platform": "Windows 10",
            "Parallel": "Scenarios",
            "Executed": "Remote"
        }
    };
 
    reporter.generate(options);