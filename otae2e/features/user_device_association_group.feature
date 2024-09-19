Feature: Device and Group association in group
    
    @otaGroupAssociation
    Scenario: User Assocaition to Group
        Given Admin logged in
        When Create a Group
        | GroupName | Description |
        | TestAuto  | TestAuto    |
        And Associate User to Group
        | GroupName | FirstName | LastName |
        | TestAuto  | Venkatesan | Sivanandan |
        Then Verify User association to Group
        |GroupName | FirstName | LastName |
        | TestAuto | Venkatesan | Sivanandan |
        And Delete Group
        | TestAuto |

    @otaGroupAssociation
    Scenario: Device Assocaition to Group
        Given Admin logged in
        When Create a Group
        | GroupName | Description |
        | TestAuto1  | TestAuto    |
        And Associate Device to Group
        | GroupName | DeviceName |
        | TestAuto1  | Testone |
        Then Verify Device association to Group
        | GroupName | DeviceName |
        | TestAuto1 | Testone    |
        And Delete Group
        | TestAuto1 |

    @otaGroupAssociation
    Scenario: User Disassocaition from Group
        Given Admin logged in
        When Create a Group
        | GroupName | Description |
        | TestAuto2  | TestAuto2    |
        And Associate User to Group
        | GroupName | FirstName | LastName |
        | TestAuto2  | Venkatesan | Sivanandan |
        And Verify User association to Group
        |GroupName | FirstName | LastName |
        | TestAuto2 | Venkatesan | Sivanandan |
        Then Disassociate the User from Group
        | GroupName | FirstName | LastName |
        | TestAuto2 | Venkatesan | Sivanandan |
        And Verify User disassociation from Group
        | GroupName | FirstName | LastName |
        | TestAuto2 | Venkatesan | Sivanandan |
        And Delete Group
        | TestAuto1 |

    @otaGroupAssociation
    Scenario: Device Disassocaition from Group
        Given Admin logged in
        When Create a Group
        | GroupName | Description |
        | TestAuto3  | TestAuto3    |
        And Associate Device to Group
        | GroupName | DeviceName |
        | TestAuto3  | TestAuto |
        And Verify Device association to Group
        |GroupName | DeviceName|
        | TestAuto3 | TestAuto |
        Then Disassociate the Device from Group
        | GroupName | DeviceName |
        | TestAuto3 | TestAuto |
        And Verify Device disassociation from Group
        | GroupName | DeviceName |
        | TestAuto3 | TestAuto |
        And Delete Group
        | TestAuto3 |


    @otaGroupAssociation
    #Device having multiple connection endpoint and associate only one connection to a group
    Scenario: One Connection Assocaition to Group
        Given Admin logged in
        When Create a Group
        | GroupName | Description |
        | TestAuto4  | TestAuto    |
        And Associate One connection to Group
        | GroupName | DeviceName | ConnectionName |
        | TestAuto4  | Testone | Testone-ssh      |
        Then Verify connection association to Group
        | GroupName | DeviceName |
        | TestAuto4 | Testone    |
        And Delete Group
        | TestAuto4 |

    @otaGroupAssociation
    #Device having multiple connection endpoint, all connections are associated to group, try dissassociating only one connection endpoint
    Scenario: One Connection Disassocaition from Group
        Given Admin logged in
        When Create a Group
        | GroupName | Description |
        | TestAuto5  | TestAuto3    |
        And Associate Device to Group
        | GroupName | DeviceName |
        | TestAuto5  | TestAuto |
        And Verify Device association to Group
        |GroupName | DeviceName|
        | TestAuto5 | TestAuto |
        Then Disassociate one connection endpoint from Group
        | GroupName | DeviceName | ConnectionName |
        | TestAuto5 | TestAuto | Testone-ssh      |
        And Verify Connection disassociation from Group
        | GroupName | DeviceName |
        | TestAuto5 | TestAuto |
        And Delete Group
        | TestAuto5 |

    #Load Test
    @otaGroupAssociation
    Scenario: 50 Users Association and Disassocaition from Group
        Given Admin logged in
        When Create a Group
        | GroupName | Description |
        | TestAuto6  | TestAuto2    |
        And Associate User to Group
        | GroupName | FirstNamePerfix | LastNamePerfix | No. of Users|
        | TestAuto6  | User | Name | 50                              |
        And Verify 50 Users association to Group
        |GroupName | FirstNamePrefix | LastNamePrefix | No.of Users |
        | TestAuto6 | User | Name | 50                              |
        Then Disassociate 50 Users from Group
        | GroupName | FirstNamePrefix | LastNamePrefix | No. of Users |
        | TestAuto6 | User | Name | 50 |
        And Verify 50 Users disassociation from Group
        | GroupName | FirstNamePrefix | LastNamePrefix | No. of Users |
        | TestAuto6 | User | Name | 50                    |
        And Delete Group
        | TestAuto6 |

    @otaGroupAssociation
    Scenario: 50 Devices Association and Disassocaition from Group
        Given Admin logged in
        When Create a Group
        | GroupName | Description |
        | TestAuto7  | TestAuto3    |
        And Associate 50 Devices to Group
        | GroupName | DeviceNamePrefix | No. of Devices |
        | TestAuto7  | TestAuto | 50                    |
        And Verify 50 Devices association to Group
        |GroupName | DeviceNamePrefix| No. of Devices |
        | TestAuto7 | TestAuto | 50                   |
        Then Disassociate 50 Devices from Group
        | GroupName | DeviceNamePrefix | No. of Devices |
        | TestAuto7 | TestAuto | 50                     |
        And Verify 50 Devices disassociation from Group
        | GroupName | DeviceNamePrefix | No. of Devices |
        | TestAuto7 | TestAuto | 50                     |
        And Delete Group
        | TestAuto7 |






