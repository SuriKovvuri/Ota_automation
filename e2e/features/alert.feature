Feature: Test the Tunnel status change alert

    Background:
        Given I am logged in
        When I Add Alert subscriptions
        | SubscriptionName | OrgName | NodeName | TunnelName                             | ServiceName | Label      | If     | Is      | For   | Scope   |
        | Test1            | ALL     | ALL      | ALL                                    | ALL         | test:Alert | Tunnel | Default | 5:Min | Org:All |
        | Test2            | Master  | node1    | All Local Networks:All Remote Networks | ALL         | test:Alert | Tunnel | Default | 5:Min | iNode   |
       	And Add A TAN Network
        | NetworkName | NodeName | Label | Nw_Addressing | CIDR            | Start_IP     | end_IP       | GW           | VLAN     | VLAN_ID | Default_Destination |
        | node1_tan1  | node1    | a:a   | Static        | 11.11.11.100/24 | 11.11.11.101 | 11.11.11.110 | 11.11.11.100 | Disabled | -       | -                   |
        And Connect network
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | PeerRepNetwork |
        | node1    | node1_tan1  | vnode1       | default         |                |
        | node1    | node1_tan1  | vnode2       | default         |                |

    @TunnelAlert @TunnelAlertCase1
    Scenario: Verify tunnel status change alert for connected tunnels
        When Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        | node1    | node1_tan1  | vnode2       | default         | CONNECTED        |
        Then Verify alert records
        | AlertName | AlertType           | State            | NodeName | NetworkName | PeerNodeName | PeerNetworkName | SendStatus | Duration | RecordExists |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode1       | default         | pending    |          | YES          |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode2       | default         | pending    |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode1       | default         | pending    |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode2       | default         | pending    |          | YES          |

    
    @TunnelAlert @TunnelAlertCase2
    Scenario: Verify alert is not sent for old state when tunnel state changes
        When Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        | node1    | node1_tan1  | vnode2       | default         | CONNECTED        |
        And I power off virtual node "vnode2"
        Then Verify alert records
        | AlertName | AlertType           | State             | NodeName | NetworkName | PeerNodeName | PeerNetworkName | SendStatus | Duration | RecordExists |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | cancel     |          | NO           |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode2       | default         | cancel     |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | cancel     |          | NO           |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode2       | default         | cancel     |          | YES          |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | pending    |          | YES          |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | pending    |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | pending    |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | pending    |          | YES          |


    @TunnelAlert @TunnelAlertCase3
    Scenario: Verify tunnel status change alert for specific tunnel subscription
        When Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        | node1    | node1_tan1  | vnode2       | default         | CONNECTED        |
        And I Add Alert subscriptions
        | SubscriptionName | OrgName | NodeName | TunnelName                             | ServiceName | Label      | If     | Is      | For    | Scope   |
        | Test3            | Master  | node1    | node1_tan1:vnode2:default              | ALL         | test:Alert | Tunnel | Default | 5:Min  | Org:All |
        And I power off virtual node "vnode2"
        Then Verify alert records
        | AlertName | AlertType           | State             | NodeName | NetworkName | PeerNodeName | PeerNetworkName | SendStatus | Duration | RecordExists |
        | Test3     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | pending    |          | NO           |
        | Test3     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode1       | default         | pending    |          | NO           |
        | Test3     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | pending    |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | pending    |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | pending    |          | YES          |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | pending    |          | YES          |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | pending    |          | YES          |
        

    @TunnelAlert @TunnelAlertCase4
    Scenario: Verify tunnel status change alert is not sent for tunnel flap case C---T-C.
        Given Alert is sent for connected tunnels
        | AlertName | AlertType           | State            | NodeName | NetworkName | PeerNodeName | PeerNetworkName | SendStatus | Duration | RecordExists |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode1       | default         | done       |          | YES          |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode2       | default         | done       |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode1       | default         | done       |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode2       | default         | done       |          | YES          |
        When I power off virtual node "vnode2"
        And I power on virtual node "vnode2"
        And Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        | node1    | node1_tan1  | vnode2       | default         | CONNECTED        |
        Then Verify alert records
        | AlertName | AlertType           | State             | NodeName | NetworkName | PeerNodeName | PeerNetworkName | SendStatus | Duration | RecordExists |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | cancel     |          | NO           |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode1       | default         | cancel     |          | NO           |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | cancel     |          | YES          |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode2       | default         | cancel     |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | cancel     |          | NO           |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode1       | default         | cancel     |          | NO           |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | cancel     |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode2       | default         | cancel     |          | YES          |
    
    @TunnelAlert @TunnelAlertCase5
    Scenario: Verify tunnel status change alert is not sent after node reboot.
        Given Alert is sent for connected tunnels
        | AlertName | AlertType           | State            | NodeName | NetworkName | PeerNodeName | PeerNetworkName | SendStatus | Duration | RecordExists |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode1       | default         | done       |          | YES          |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode2       | default         | done       |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode1       | default         | done       |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED | node1    | node1_tan1  | vnode2       | default         | done       |          | YES          |
        When I reboot the node "node1"
        And Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        | node1    | node1_tan1  | vnode2       | default         | CONNECTED        |
        Then Verify alert records
        | AlertName | AlertType           | State             | NodeName | NetworkName | PeerNodeName | PeerNetworkName | SendStatus | Duration | RecordExists |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | pending    |          | NO           |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode1       | default         | pending    |          | NO           |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | pending    |          | NO           |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode2       | default         | pending    |          | NO           |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | pending    |          | NO           |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode1       | default         | pending    |          | NO           |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | pending    |          | NO           |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode2       | default         | pending    |          | NO           |

    @TunnelAlert @TunnelAlertCase6
    Scenario: Verify tunnel status change alert for a terminated tunnel.
        When I disconnect all tunnels in the network "node1_tan1"
        And I power off virtual node "vnode2"
        And Connect network
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | PeerRepNetwork |
        | node1    | node1_tan1  | vnode1       | default         |                |
        | node1    | node1_tan1  | vnode2       | default         |                |
        And Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        | node1    | node1_tan1  | vnode2       | default         | NOT AVAILABLE    |
        Then Verify alert records
        | AlertName | AlertType           | State             | NodeName | NetworkName | PeerNodeName | PeerNetworkName | SendStatus | Duration | RecordExists |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | pending    |          | YES          |
        | Test1     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | pending    |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_CONNECTED  | node1    | node1_tan1  | vnode1       | default         | pending    |          | YES          |
        | Test2     | TUNNEL_STATE_CHANGE | TUNNEL_TERMINATED | node1    | node1_tan1  | vnode2       | default         | pending    |          | YES          |
