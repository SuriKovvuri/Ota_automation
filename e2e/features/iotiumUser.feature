Feature: Navigate Orchestrator as IoTium User

@InodeLogs @Navigation @IoTiumUser
Scenario: Navigate to iNode Logs page
    Given I am logged in
    When I navigate to iNode Logs page
    Then All required web elements must be present

@ServiceLogs @Navigation @IoTiumUser
Scenario: Navigate to Service Logs page
    Given I am logged in
    When I navigate to Service Logs page
    Then All required web elements must be present