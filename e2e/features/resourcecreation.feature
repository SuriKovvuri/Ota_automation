Feature: Resource creation

@ResourceCreation @AddNode @ResourceCreation1
Scenario: Add iNode
    Given I am logged in
    When I add iNode
    | NodeName    | Label    | Profile      | SerialNumber | SshKey   | VirtualPlatform | AdvSettings           |
    | autovirtual | rc:node1 | Virtual      |              |          | azure           |                       |
    | autoedge    | rc:node2 | Edge         | hsn1         | sanityqa |                 | standalone            |
    | autovedge   | rc:node3 | Virtual Edge |              | sanityqa | vmware          | standalone,datasaving |
    Then iNode should be added "autovirtual,autoedge,autovedge"

@ResourceCreation @AddTan @ResourceCreation2
Scenario: Add a TAN Network
    When Add A TAN Network
    | NetworkName | NodeName | Label | Nw_Addressing | CIDR          | Start_IP     | end_IP       | GW              | VLAN     | VLAN_ID | Default_Destination | Service_Addressing|
    | autotan1    | autoedge | a:a   | Static        | 11.11.11.0/24 | 11.11.11.100 | 11.11.11.110 | 11.11.11.100    | Disabled |         |                     |      Static       |
    | autotan2    | autoedge | a:a   | Static        | 12.12.12.0/24 | 12.12.12.100 | 12.12.12.100 |  12.12.12.1     | Enabled  |  120    |                     |      Static       |
    | autotan3    | autoedge | a:a   | Static        | 13.12.12.0/24 | 13.12.12.100 | 13.12.12.100 |  13.12.12.1     | Enabled  |  130    |                     |      Dynamic      |
    | autotan4    | autoedge | a:a   | Dynamic       |               |              |              | 14.14.14.100/24 | Enabled  |  140    |                     |                   |
    Then Network should be Added "autotan1,autotan2,autotan3,autotan4"

@ResourceCreation @AddService @ResourceCreation3
Scenario: Add a Custom Service
    Given Node exists "autoedge"
    And Tan Network is "autotan3"
    When Add custom Service "custom"
    Then Service should be Added "custom"

@ResourceCreation @AddAlert @ResourceCreation4
Scenario: Add user Alert subscriptions
    When I Add Alert subscriptions
    | SubscriptionName | NodeName | OrgName | TunnelName | ServiceName | Label      | If      | Is      | For    | Scope   |
    | Test1            | ALL      | ALL     | ALL        | ALL         | test:Alert | Node    | Default | 5:Min  | Org:All |
    | Test2            | ALL      | ALL     | ALL        | ALL         | test:Alert | Tunnel  | Default | 5:Min  | Org:All |
    | Test3            | ALL      | ALL     | ALL        | ALL         | test:Alert | Service | Default | 10:Min | Org:All |
    Then Alert subscription should be Added "Test1, Test2, Test3"

@ResourceCreation @DeleteAlert @ResourceCreation5
Scenario: Delete user Alert subscriptions
    When I Delete Alert subscriptions 
    | SubscriptionName |
    | Test1            |
    | Test2            |
    | Test3            |
    Then Alert subscriptions should be Deleted "Test1, Test2, Test3"

@ResourceCreation @DeleteService @ResourceCreation6
Scenario: Delete Service
    When I delete Service
    | NodeName | ServiceName |
    | autoedge | custom      |
    Then Service should be deleted "custom"

@ResourceCreation @DeleteTan @ResourceCreation7
Scenario: Delete Tan Network
    When I delete Tan Network
    | NodeName | NetworkName |
    | autoedge | autotan1    |
    | autoedge | autotan2    |
    | autoedge | autotan3    |
    | autoedge | autotan4    |
    Then Network should be deleted "autotan1,autotan2,autotan3,autotan4"

@ResourceCreation @DeleteNode @ResourceCreation8
Scenario: Delete iNode
    When I delete iNode
    | NodeName    |
    | autovirtual |
    | autoedge    |
    | autovedge   |
    Then iNode should be deleted "autovirtual,autoedge,autovedge"


@ResourceCreation @UserAdd @ResourceCreation9
Scenario: Add a User
    When Add a User
    | FullName     | Email                          | Password    | Role      | TimeZone |
    | AutoAdmin    | raja.baskaran+e2erc1@iotium.io | Welcome@12345 | Admin     | Kolkata  |
    | AutoReadonly | raja.baskaran+e2erc2@iotium.io | Welcome@12345 | Read Only | New_York |
    Then User should be Added "AutoAdmin,AutoReadonly"

@ResourceCreation @DeleteUser @ResourceCreation10
Scenario: Delete User
    When I delete User
    | FullName    |
    | AutoAdmin   |
    | AutoReadonly|
    Then User should be deleted "AutoAdmin,AutoReadonly"

@ResourceCreation @SshAdd @ResourceCreation11
Scenario: Add a ssh key
    When Add a ssh key
    | KeyName     | FileName    |
    | AutoSshKey1 | autossh.pub |
    Then ssh key should be Added "AutoSshKey1"


@ResourceCreation @SshDelete @ResourceCreation12
Scenario: Delete a ssh key
    When Delete a ssh key
    | KeyName     |
    | AutoSshKey1 |
    Then ssh key should be deleted "AutoSshKey1"

@ResourceCreation @VolumeAdd @ResourceCreation13
Scenario: Add a service volume
    When Add a service volume
    | VolumeName  | FileName    |
    | AutoRC14    | autossh.pub |
    Then service volume should be Added "AutoRC14"

@ResourceCreation @VolumeDelete @ResourceCreation14
Scenario: Delete a service volume
    When Delete a service volume
    | VolumeName  |
    |  AutoRC14   |
    Then service volume should be deleted "AutoRC14"

@ResourceCreation @Techdump @ResourceCreation15
Scenario: Trigger a techdump
    Given I am logged in as an admin user
    When Org is "orgName"
    And Trigger techdump in node "node1"
    Then Techdump should be available