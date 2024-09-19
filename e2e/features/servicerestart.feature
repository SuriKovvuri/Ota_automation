Feature: Service restart

@ServiceRestart1 @ServiceRestart
Scenario: Service restart with single container
    Given A sevice is healthy on iNode with single container
    When I restart the service
    Then Service must go to Restarting state
    And Restart count is incremented
    And Service must come back to healthy state


@ServiceRestart2 @ServiceRestart
Scenario: Service restart with multiple containers
    Given A sevice is healthy on iNode with multi container
    When I restart the service
    Then Service must go to Restarting state
    And Restart count is incremented
    And Service must come back to healthy state
    

@ServiceRestart3 @ServiceRestart
Scenario: Service restart with restart policy as never
    Given A sevice is healthy on iNode with restart policy never
    When I try restarting the service
    Then Restart service button must be disabled