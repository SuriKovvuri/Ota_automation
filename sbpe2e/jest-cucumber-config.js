const setJestCucumberConfiguration = require('jest-cucumber').setJestCucumberConfiguration;

setJestCucumberConfiguration({
  //tagFilter: '@ui and not @slow',
  tagFilter: '@Regression',
  scenarioNameTemplate: (vars) => {
      return ` ${vars.featureTitle} - ${vars.scenarioTitle}`;
  }
});
