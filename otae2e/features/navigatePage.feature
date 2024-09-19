Feature: Navigate OTA

@NavigateLeftpane @Navigation @Regression
Scenario: Verify Leftpane
    #Given I am logged in
    Given Admin logged in
    When I land in Dashboard page
    Then All layouts must be present

@NavigateDashboard @Navigation @Regression
Scenario: Verify Dashboard
    Given Admin logged in
    When I land in Dashboard page
    Then All layouts must be present

@Navigateuserlist @Navigation @Regression
Scenario: Verify UserlistPage
    Given Admin logged in
    When I navigate to userlist page
    Then All layouts must be present

@Navigatedevicelist @Navigation @Regression
Scenario: Verify DevicelistPage
    Given Admin logged in
    When I navigate to devicelist page
    Then All layouts must be present

@Navigategrouplist @Navigation @Regression
Scenario: Verify GrouplistPage
    Given Admin logged in
    When I navigate to grouplist page
    Then All layouts must be present

@Navigateauditlist @Navigation @Regression
Scenario: Verify AuditPage
    Given Admin logged in
    When I navigate to audit page
    Then All layouts must be present

@Navigateaccesspage @Navigation @Regression
Scenario: Verify AccessPage
    Given Admin logged in
    When I navigate to access page
    Then All layouts must be present

@Navigateorgpage @Navigation @Regression
Scenario: Verify OrgPage
    Given Admin logged in
    When I navigate to org page
    Then All layouts must be present

@Navigateuserprofile @Navigation @Regression
Scenario: Verify UserProfilePage
    Given Admin logged in
    When I navigate to userprofile page
    Then All layouts must be present

@Navigatespecificuserprofile @Navigation @Regression
Scenario Outline: Verify SpecificUserProfilePage for <Name>
    Given Admin logged in
    When I navigate to specificuserprofile page of <Name>
    Then All layouts must be present
Examples:
    | Name               |
    | env_users.user1    |
    | env_users.user2    |
    
@Navigatedeviceprofile @Navigation @Regression
Scenario Outline: Verify DeviceProfilePage for <devicename>
    Given Admin logged in
    When I navigate to deviceprofile page of <devicename>
    Then All layouts must be present
Examples:
    | devicename    |
    | env_devices.device1     |
    | env_devices.device2     |

@Navigategroupprofile @Navigation @Regression
Scenario Outline: Verify GroupProfilePage for <groupname>
    Given Admin logged in
    When I navigate to groupprofile page of <groupname>
    Then All layouts must be present
Examples:
    | groupname |
    | env_groups.group1    |
    | env_groups.group2    |

@Navigateuserdetail @Navigation @Regression
Scenario Outline: Verify UserDetail for <Name>
    Given Admin logged in
    When I navigate to userdetail page of <Name>
    Then All layouts must be present
Examples:
    | Name          |
    | env_users.user1    |
    | env_users.user2    |
    

@Navigatedevicedetail @Navigation @Regression
Scenario Outline: Verify DeviceDetailPage for <devicename>
    Given Admin logged in
    When I navigate to devicedetail page of <devicename>
    Then All layouts must be present
Examples:
    | devicename    |
    | env_devices.device1     |
    | env_devices.device2     |
    

@Navigategroupdetail @Navigation @Regression
Scenario Outline: Verify GroupDetailPage for <groupname>
    Given Admin logged in
    When I navigate to groupdetail page of <groupname>
    Then All layouts must be present
Examples:
    | groupname     |
    | env_groups.group1    |
    | env_groups.group2    |

@NavigateAdduser @Navigation @Regression
Scenario: Verify AddUser
    Given Admin logged in
    When I navigate to add user page
    Then All layouts must be present

@NavigateAdddevice @Navigation @Regression
Scenario: Verify AddDevice
    Given Admin logged in
    When I navigate to add device page
    Then All layouts must be present

@NavigateAddgroup @Navigation @Regression
Scenario: Verify AddGroup
    Given Admin logged in
    When I navigate to add group page
    Then All layouts must be present

@Navigateaddendpoint @Navigation @Regression
Scenario Outline: Verify AddEndpointPage for <devicename>
    Given Admin logged in
    When I navigate to add endpoint page of <devicename>
    Then All layouts must be present
Examples:
    | devicename    |
    | env_devices.device1     |
    | env_devices.device2     |

@Navigateuserroleassociation @Navigation @Regression
Scenario Outline: Verify UserRoleAssociationPage for <Name>
    Given Admin logged in
    When I navigate to user role association page of <Name>
    Then All layouts must be present
Examples:
    | Name          |
    | env_users.user1    |
    | env_users.user2    |

@Navigatedeviceroleassociation @Navigation @Regression
Scenario Outline: Verify DeviceRoleAssociationPage for <devicename>
    Given Admin logged in
    When I navigate to device role association page of <devicename>
    Then All layouts must be present
Examples:
    | devicename    |
    | env_devices.device1     |
    | env_devices.device2     |

@Navigatepasswordreset @Navigation @Regression
Scenario Outline: Verify UserPasswordResetPage for <Name>
    Given Admin logged in
    When I navigate to user password reset page of <Name>
    Then All layouts must be present
Examples:
    | Name                       |
    | env_users_group_2.user1    |
    | env_users_group_2.user2    |

@Navigateaddauthdomain @Navigation @Regression
Scenario: Verify AddAuthDomainPage
    Given Admin logged in
    When I navigate to Add Auth Domain Page
    Then All layouts must be present



    



