Feature: Navigate Orchestraor

@NavigateDashboard @Navigation
Scenario: Navigate to dashboard
    Given I am logged in
    When I land in dashboard page
    Then All layouts must be present

@NavigateAllInodes @Navigation
Scenario: Navigate to all inodes page
    Given I am logged in
    When I navigate to all inodes page
    Then All required web elements must be present

@NavigateAllSerialNumbers @Navigation
Scenario: Navigate to all Serial Numbers page
    Given I am logged in
    When I navigate to all serial numbers page
    Then All required web elements must be present

@NavigateAllNetworks @Navigation
Scenario: Navigate to all networks page
    Given I am logged in
    When I navigate to all networks page
    Then All required web elements must be present

@NavigateAllServices @Navigation
Scenario: Navigate to all services page
    Given I am logged in
    When I navigate to all services page
    Then All required web elements must be present

@NavigatePullSecrets @Navigation
Scenario: Navigate to Pull Secrets Page
    Given I am logged in
    When I land in Pull Secrets page
    Then All layouts must be present

@NavigateVolumes @Navigation
Scenario: Navigate to Volumes Page
    Given I am logged in
    When I land in Volumes page
    Then All layouts must be present

@NavigateCSP @Navigation
Scenario: Navigate to csp page
    Given I am logged in
    When I navigate to csp page
    Then All required web elements must be present

@NavigateUsers @Navigation
Scenario: Navigate to users page
    Given I am logged in
    When I navigate to users page
    Then All required web elements must be present

@NavigateRoles @Navigation
Scenario: Navigate to roles page
    Given I am logged in
    When I navigate to roles page
    Then All required web elements must be present

@SortNetworks @Navigation
Scenario Outline: Sort the all networks table
    Given I am logged in
    When I navigate to all networks page
    And Sort networks table by name in <Order> order
    Then Networks table must be sorted by name in <Order> order

    Examples:
    | Order           |
    | "ascending"     |

@OnlineHelp @Navigation
Scenario: Navigate to online help page
    Given I am logged in
    When I navigate to online help page
    Then All required web elements must be present
    
@NavigateApiKeys @Navigation
Scenario: Navigate to API Keys page
    Given I am logged in
    When I navigate to API Keys page
    Then All required web elements must be present

@NavigateSshKeys @Navigation
Scenario: Navigate to SSH Keys page
    Given I am logged in
    When I navigate to SSH Keys page
    Then All required web elements must be present

@DownloadSoftware @Navigation
Scenario: Navigate to download software page
    Given I am logged in
    When I navigate to download software page
    Then All required web elements must be present
    And Latest release software must be present

@NavigateDownloadEvents @Navigation
Scenario: Navigate to Download Events page
    Given I am logged in
    When I navigate to Download Events page
    Then All required web elements must be present

@NavigateDownloadActivity @Navigation
Scenario: Navigate to Download Activity page
    Given I am logged in
    When I navigate to Download Activity page
    Then All required web elements must be present

@NavigateManageAlerts @Navigation
Scenario: Navigate to Manage Alerts page
    Given I am logged in
    When I navigate to Manage Alerts page   
    And I hover on an alert dropdown
    Then All required web elements must be present

@NavigateMyProfile @Navigation
Scenario: Navigate to My Profile page
    Given I am logged in
    When I navigate to My Profile page
    Then All required web elements must be present

@NavigateCollapseLeftMenu @Navigation
Scenario: Collapse Left Menu
    Given I am logged in
    When I collapse left menu
    Then All required web elements must be present

@NavigateExpandLeftMenu @Navigation
Scenario: Expand Left Menu
    Given I am logged in
    When I expand left menu
    Then All required web elements must be present
