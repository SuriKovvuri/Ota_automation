Feature: Test the Service status change alert

@ServiceAlert @ServiceAlert1
Scenario: Verify the editable service state change alert
    Given I am logged in
    When I Add Alert subscriptions
    | SubscriptionName  | OrgName | NodeName | TunnelName | ServiceName | Label         | If        | Is      | For   | Scope   |
    | autoServiceAlert1 | ALL     | ALL      | ALL        | ALL         | Alert:Service | Service   | Default | 5:Min | Org:All |
    And I edit alert and change editable fields
    | SubscriptionName  | Label      | If       | Is      | For   | Scope     |
    | autoServiceAlert1 | Alert:Edit | Service  | Default | 1:Min | Org:myorg |
    And Service state changes to healthy state
    Then Service state change alert must be sent as per edited settings

@ServiceAlert @ServiceAlert2
Scenario: Verify the service state change alert for node scope
    Given I am logged in
    When I Add Alert subscriptions
    | SubscriptionName  | OrgName | NodeName | TunnelName | ServiceName  | Label          | If        | Is      | For   | Scope  |
    | autoServiceAlert1 | org1    | node1    | ALL        | All Services | Alert:Services | Service   | Default | 1:Min | iNode  |
    And Service state changes to healthy state
    Then Service state change alert must be sent