Feature: OTA-2963 Group OnBoarding

@AdminUIGroupNavigate  @otaUIGroup @Regression
Scenario: Availability of Create Group Option for admin user
    # Sample comment
    Given Admin logged in
    When Admin access the group page
    Then Admin navigate to group page and add group option is available

@AccessUIGroupNavigate @otaUIGroup @Regression
Scenario: Availability of Create Group Option for access user
    Given Access user logged in
    When Access user access the group page
    Then Group page option is not available

@groupNameMandatory  @otaUIGroup @Regression
Scenario: Mandatory fields and field policies on the create group UI
    Given Admin logged in
    When Admin user tries to create a group with invalid character on name
    | name      | description   | error |
    | null      | null          | groupNameMandatory, groupDescMandatory |
    | null      | digitOnly     | groupNameMandatory |
    | char,4    | null          | groupDescMandatory |
    | splChar   | char          | groupNameWrongInput |
    | space     | char          | groupNameMandatory |
    | digitOnly | char          | groupNameDigitOnlyError |
    Then Appropriate error should be thrown

@createNewGroup  @otaUIGroup @Regression
Scenario: Create a group and verify the roles auto created under a group
    Given Admin logged in
    When Admin user creates a group
    Then Group created should have two roles admin and access associated to it

@createDuplicateGroup  @otaUIGroup @Regression
Scenario: Create duplicate group
    Given Admin logged in
    When Admin User tries to create a group with duplicate name
    Then Group name already exists error should thrown

@associateDeviceGroup  @otaUIGroup @Regression
Scenario: Associate or Dissociate of device or user from group profile page
    Given Admin logged in
    When Admin User tries to associate the device or user in the group profile page
    | user | login | password | device |
    | Test Jay | tsa | Welcome@123 | grafanaHTTP |
    Then Associated devices or users should be in a group detail page and disassociate should work
    | user | login | password | device |
    | Test Jay | tsa | Welcome@123 | grafanaHTTP |

@onBoardingGroup @otaUIGroup @Regression
Scenario: Group is onboarded once created
    Given Admin logged in
    When Admin user creates a group
    Then Created group should move from OnBoarding to onboarded state

@groupDeviceAssociation @otaUIGroup
Scenario: Device association by users in groups
    Given Admin logged in
    When I add device and associate user
    | userIDInConfig |
    |user1 |
    |user2 |
    |user3 |
    Then User and device should be associated
    | userIDInConfig |
    |user1 |
    |user2 |
    |user3 |

@onBoardingGroup @otaUIGroup
Scenario: Delete connections and device workflow
    Given Admin logged in
    When Admin user creates a group
    Then Created group should move from OnBoarding to onboarded state
