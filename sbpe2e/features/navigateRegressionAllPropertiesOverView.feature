Feature: Validate All Properties Overview Page
 @Regression @AllProperties @OverviewPage1
 Scenario: Navigate All Properties Overview Page
    Given I am logged as a Building Manager
    When I Click Days in All Properties OverView Page
    Then I fetch The Yesterday Occupancy List
    And fetch The Last 7 days Occupancy List
    And fetch The Last 14 Days Occupancy List
    And fetch The Last 30 Days Occupancy List
    And fetch The Today Occupancy List
   
@Regression @AllProperties @OverviewPage2
Scenario: Validate The Occupancy and Building Count in Overview Page
    Given I am logged as a Building Manager
    When I Click Days in All Properties OverView Page
    Then Verify The OverView Page Time
    And Verify The Real Time Occupancy Percentage in Overview page
    And Verify The Building Count in Overview page
    And fetch all Occupancy List in Overview page
    And Verify The OverView Page last Update Time

 @Regression @AllProperties @OverviewPage3
 Scenario: Navigate All Properties Overview Page and Verify the chart
    Given I am logged as a Building Manager
    When I Click Days in All Properties OverView Page
    Then verify last 7 days in last 14 days
    And verify last 14 days in last 30 days

    