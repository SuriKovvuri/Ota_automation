Feature: Test the Tunnel status change

    @TunnelValidationCase
    Scenario: Verify tunnel status change
        Given I am logged in
        When Add A TAN Network
        | NetworkName | NodeName | Label | Nw_Addressing | CIDR            | Start_IP     | end_IP       | GW           | VLAN     | VLAN_ID | Default_Destination |
        | node1_tan1  | node1    | a:a   | Static        | 11.11.11.100/24 | 11.11.11.101 | 11.11.11.110 | 11.11.11.100 | Disabled | -       | -                   |
        When Connect network
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | PeerRepNetwork |
        | node1    | node1_tan1  | vnode1       | default         |                |
        Then Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        And Tunnel status of network "default" in node "vnode1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | vnode1    | default  | node1       | node1_tan1         | CONNECTED        |

    @TunnelValidationCase
    Scenario: Verify tunnel status change during iNode reboot
        Given I am logged in
        When Add A TAN Network
        | NetworkName | NodeName | Label | Nw_Addressing | CIDR            | Start_IP     | end_IP       | GW           | VLAN     | VLAN_ID | Default_Destination |
        | node1_tan1  | node1    | a:a   | Static        | 11.11.11.100/24 | 11.11.11.101 | 11.11.11.110 | 11.11.11.100 | Disabled | -       | -                   |
        When Connect network
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | PeerRepNetwork |
        | node1    | node1_tan1  | vnode1       | default         |                |
        When Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        When Reboot An iNode
        | NodeName | 
        | node1 |
        Then Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | NOT AVAILABLE        |
        And Tunnel status of network "default" in node "vnode1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | vnode1    | default  | node1       | node1_tan1         | NOT AVAILABLE        |


    @TunnelValidationCase
    Scenario: Verify tunnel status change during iNode shutdown
        Given I am logged in
        When Add A TAN Network
        | NetworkName | NodeName | Label | Nw_Addressing | CIDR            | Start_IP     | end_IP       | GW           | VLAN     | VLAN_ID | Default_Destination |
        | node1_tan1  | node1    | a:a   | Static        | 11.11.11.100/24 | 11.11.11.101 | 11.11.11.110 | 11.11.11.100 | Disabled | -       | -                   |
        When Connect network
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | PeerRepNetwork |
        | node1    | node1_tan1  | vnode1       | default         |                |
        When Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        And I power off virtual node "vnode1"
        When Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         |  NOT AVAILABLE       |
        And Tunnel status of network "default" in node "vnode1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | vnode1    | default  | node1       | node1_tan1         | NOT AVAILABLE        |
        And I power on virtual node "vnode1"
        Then Tunnel status of network "node1_tan1" in node "node1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | node1    | node1_tan1  | vnode1       | default         | CONNECTED        |
        And Tunnel status of network "default" in node "vnode1" exists
        | NodeName | NetworkName | PeerNodeName | PeerNetworkName | ConnectionStatus |
        | vnode1    | default  | node1       | node1_tan1         | CONNECTED        |

    
 

    
    
