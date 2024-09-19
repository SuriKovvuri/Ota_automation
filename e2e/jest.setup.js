//import "jest-allure/dist/setup";
import { setDefaultOptions } from 'expect-puppeteer';
//import { registerAllureReporter } from 'jest-allure/dist/setup';
import { logger } from './log.setup';
import { ReporterWrapper } from '../utils/allure_wrapper';

//if folder does not exist create ./reports, ./tempImages
var fs = require('fs');
var reportdir = './reports';
var tempdir = './tempImages';

if (!fs.existsSync(tempdir)){
  fs.mkdirSync(tempdir);
}
if (!fs.existsSync(reportdir)){
    fs.mkdirSync(reportdir);
}

jest.setTimeout(600000)
setDefaultOptions({ timeout: 120000 })
page.setDefaultNavigationTimeout(120000); 
jest.retryTimes(1)

const reporter = new ReporterWrapper()
global.reporter = reporter

//logger.info("Registering the reporter globally");
//registerAllureReporter()

