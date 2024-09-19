const setJestCucumberConfiguration = require('jest-cucumber').setJestCucumberConfiguration;

setJestCucumberConfiguration({
  //tagFilter: '@ui and not @slow',
  tagFilter: '@TunnelValidationCase',
  scenarioNameTemplate: (vars) => {
      return ` ${vars.featureTitle} - ${vars.scenarioTitle}`;
  }
});
