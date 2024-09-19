//import "jest-allure/dist/setup";
import { setDefaultOptions } from 'expect-puppeteer';
import { registerAllureReporter } from 'jest-allure/dist/setup';
import { logger } from './log.setup';

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

jest.setTimeout(1800000)
setDefaultOptions({ timeout: 1800000 })
//page.setDefaultNavigationTimeout(120000); 

logger.info("Registering the reporter globally");
registerAllureReporter()
