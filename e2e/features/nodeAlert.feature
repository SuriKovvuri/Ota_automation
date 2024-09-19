Feature: Test the Node status change alert

@NodeAlert @NodeAlert1
Scenario: Verify the editable node state change alert
    Given I am logged in
    When I Add Alert subscriptions
    | SubscriptionName | OrgName | NodeName | TunnelName | ServiceName | Label      | If     | Is      | For   | Scope   |
    | autoNodeAlert1   | ALL     | ALL      | ALL        | ALL         | Alert:Node | Node   | Default | 5:Min | Org:All |
    And I edit alert and change editable fields
    | SubscriptionName | Label      | If     | Is      | For   | Scope     |
    | autoNodeAlert1   | Alert:Edit | Node   | Default | 1:Min | Org:myorg |
    And I power off inode "node1"
    Then Node state change alert must be sent as per edited settings

@NodeAlert @NodeAlert2
Scenario: Verify non editable fields in node state change alert
    Given I am logged in
    When I Add Alert subscriptions
    | SubscriptionName | OrgName | NodeName | TunnelName | ServiceName | Label      | If     | Is      | For   | Scope   |
    | autoNodeAlert1   | ALL     | ALL      | ALL        | ALL         | Alert:Node | Node   | Default | 5:Min | Org:All |
    And I edit alert "autoNodeAlert1"
    Then All non editable fields must be disabled

@NodeAlert @NodeAlert3
Scenario: Verify the node state change alert with scope node
    Given I am logged in
    When I Add Alert subscriptions
    | SubscriptionName | OrgName | NodeName | TunnelName | ServiceName | Label      | If     | Is      | For   | Scope |
    | autoNodeAlert1   |   org1  |   node1  | ALL        | ALL         | Alert:Node | Node   | Default | 1:Min | iNode |
    And I power off inode "node1"
    Then Node state change alert must be sent as per settings

@NodeAlert @NodeAlert4
Scenario: Verify the node state change alert with scope node on a descoped node
    Given I am logged in
    When I Add Alert subscriptions
    | SubscriptionName | OrgName | NodeName | TunnelName | ServiceName | Label      | If     | Is      | For   | Scope   |
    | autoNodeAlert1   | ALL     | ALL      | ALL        | ALL         | Alert:Node | Node   | Default | 1:Min | Org:All |
    And I edit alert and change editable fields
    | SubscriptionName | OrgName | NodeName | TunnelName | ServiceName | Label      | If     | Is      | For   | Scope |
    | autoNodeAlert1   |   org1  |   node1  | ALL        | ALL         | Alert:Node | Node   | Default | 1:Min | iNode |
    And I power off inode "vnode1"
    Then Node state change alert must not be sent