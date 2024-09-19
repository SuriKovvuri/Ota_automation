Feature: Navigate Specific Building

@BuildingOverview1 @BAT
Scenario Outline: Verify specific building <Building> online sensor is non-zero in overview page
    Given I am logged as a Building Manager
    When I select <Building>
    And I get online sensors count
    Then The value must be non-zero

    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |

@BuildingOverview2 @BAT
Scenario Outline: Verify specific building <Building> Real-time Occupancy is non-zero in overview page during Busy hours
    Given I am logged as a Building Manager
    When I select <Building>
    And I get Real-time Occupancy
    Then The value must be non-zero during busy hours

    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |

@BuildingOverview9 @BAT
Scenario Outline: Verify specific building <Building> Active Environment sensors is non-zero in overview page
    Given I am logged as a Building Manager
    When I select <Building>
    And I get active environment sensor count in overview page
    Then The value must be non-zero
    
    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |


