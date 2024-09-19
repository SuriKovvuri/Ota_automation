Feature: Test the Tunnel status change alert

@TunnelAlert
Scenario: Verify the editable tunnel state change alert
    Given I am logged in
    When I Add Alert subscriptions
    | SubscriptionName  | OrgName | NodeName | TunnelName | ServiceName | Label        | If       | Is      | For   | Scope   |
    | autoTunnelAlert1  | ALL     | ALL      | ALL        | ALL         | Alert:Tunnel | Tunnel   | Default | 5:Min | Org:All |
    And I edit alert and change editable fields
    | SubscriptionName  | Label      | If     | Is      | For   | Scope     |
    | autoTunnelAlert1 | Alert:Edit | Node   | Default | 1:Min | Org:myorg |
    And Connect network
    | NodeName | NetworkName | PeerNodeName | PeerNetworkName | PeerRepNetwork |
    | node1    | node1_tan1  | vnode1       | default         |                |
    And Tunnel status of network "node1_tan1" in node "node1" exists
    | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
    | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
    Then Tunnel state change alert must be sent as per edited settings
