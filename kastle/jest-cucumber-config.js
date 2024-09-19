const setJestCucumberConfiguration = require('jest-cucumber').setJestCucumberConfiguration;

setJestCucumberConfiguration({
  // tagFilter: '@NavigateLeftpane or @AdminUIGroupNavigate',
    // tagFilter: '@associateDeviceGroup or @onBoardingGroup',
    // tagFilter: '@groupDeviceAccess',
   tagFilter: '@groupDeviceAssociation',
    // tagFilter: '@AdminUIGroupNavigate or @onBoardingGroup',
    // tagFilter: '@otaUIGroup',
  scenarioNameTemplate: (vars) => {
      return ` ${vars.featureTitle} - ${vars.scenarioTitle}}`;
  }
});
