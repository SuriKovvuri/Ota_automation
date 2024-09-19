Feature: Test Launching

Scenario: Launching a test
    Given I am example
    When I launch the test
    Then the test should run

Scenario: Testing the login failure
    Given I am at login page
    When I give invalid login
    Then I should not log in

Scenario: Launching a test1
    Given I am example
    When I launch the test
    Then the test should run

Scenario: Regr Valid Login test
    Given I have orch credentials
    When I hit login
    Then I am logged in  

Scenario: Regr Navigation test
    Given I am logged in
    When I navigate to left panel screens
    Then I should see no console errors 

Scenario: Regr Add a virtual Node
    Given I am logged in
    When I add a node
    Then node is added   
    