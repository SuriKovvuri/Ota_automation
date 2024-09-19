Feature: Navigate inode Details Page

@NavigateInodeDetail @Navigation
Scenario Outline: Navigate to iNode details page as a(n) <Role> User
    Given I am logged in as <Role>
    When I navigate to inode details page
    Then All required web elements must be present depending on role <Role>
    And All fields must be displayed in system info card
    And Time server must be synchronised

    Examples:
    | Role            |
    | "orgAdmin"      |
    | "orgReadonly"   |

@NetworksTab @Navigation
Scenario: Navigate networks tab
    When I navigate to networks tab of inode
    Then All networks and tunnels must be present

@ServicesTab @Navigation
Scenario: Navigate services tab
    When I navigate to services tab of inode
    Then All services and containers must be present


@NavigateEventsTab @Navigation
Scenario: Navigate to Events tab in iNode details page
    Given I am logged in
    When I navigate to Events tab in iNode details page
    Then Events tab in iNode details page is active
    Then All required web elements must be present

@NavigateImagesTab @Navigation
Scenario: Navigate to Images tab in iNode details page
    Given I am logged in
    When I navigate to Images tab in iNode details page
    Then Images tab in iNode details page is active
    And All required web elements must be present

@NavigateImages @Navigation
Scenario: Navigate to Images page
    Given I am logged in
    When I navigate to Images page
    Then Images page is active
    And All required web elements must be present


@NavigateInterfacesTab @Navigation
Scenario: Navigate to Interfaces tab in iNode details page
    Given I am logged in
    When I navigate to Interfaces tab in iNode details page
    Then Interfaces tab in iNode details page is active 
    And All required web elements must be present

@NavigateEvents @Navigation
Scenario: Navigate to Events page
    Given I am logged in
    When I navigate to Events page
    Then Events page is active
    And All required web elements must be present

@TunnelStatus @Navigation
Scenario: Verify tunnel count and status
    When I navigate to networks tab of inode
    Then Networks count must match
    And Tunnel status count must match

@ServiceStatus @Navigation
Scenario: Verify service count and status
    When I navigate to services tab of inode
    Then Services count must match
    And Service status count must match

@NavigateRepNetwork @Navigation
Scenario: Verify Representational Network  
    Given I am logged in
    When I navigate to inode details page
    And I expand the network with Representational Network config
    Then All required web elements must be present