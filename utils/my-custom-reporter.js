class MyCustomReporter {
    constructor(globalConfig, options) {
      this._globalConfig = globalConfig;
      this._options = options;
    }
  
    onRunComplete(contexts, results) {
      console.log('Custom reporter output:');
      console.log('GlobalConfig: ', this._globalConfig);
      console.log('Options: ', this._options);
    }

    getLastError() {
        if (this._shouldFail) {
          return new Error('my-custom-reporter.js reported an error');
        }
      }
  }
  
  module.exports = MyCustomReporter;