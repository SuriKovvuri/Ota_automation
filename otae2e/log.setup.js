var log4js = require('log4js'); 

       
log4js.configure({
        appenders: {
            everything:{ type: 'stdout'  },
            file_log: { type: 'file' ,filename: './reports/logs_'+global.testStart+'.log' },
            logLevelFilter: {  type:'logLevelFilter',level: 'debug', appender: 'file_log' }   
        },
        categories: {
           default: {
               appenders: [ 'logLevelFilter','everything'], level: 'all'},            
        }
    });
export const logger = log4js.getLogger();
   