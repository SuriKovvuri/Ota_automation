Feature: Navigate Occupancy

@BuildingOverview3 @BAT
Scenario Outline: Verify specific building <Building> Real-time Occupancy is non-zero in occupancy page during Busy hours
    Given I am logged as a Building Manager
    When I select <Building>
    And I get Real-time Occupancy in occupancy page
    Then The value must be non-zero during busy hours

    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |


@BuildingOverview4 @BAT
Scenario Outline: Verify specific building <Building> Average Day Occupancy over 90days  is non-zero during Busy hours
    Given I am logged as a Building Manager
    When I select <Building>
    And I get Average Day Occupancy
    Then The value must be non-zero during busy hours

    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |

@BuildingOverview5 @BAT
Scenario Outline: Verify specific building <Building> Peak Day Occupancy over 90days is non-zero during Busy hours
    Given I am logged as a Building Manager
    When I select <Building>
    And I get Peak Day Occupancy
    Then The value must be non-zero during busy hours

    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |

@BuildingOverview6 @BAT
Scenario Outline: Verify specific building <Building> Real-time Lobby is non-zero during Busy hours
    Given I am logged as a Building Manager
    When I select <Building>
    And I get Real-time Lobby
    Then The value must be non-zero during busy hours
    
    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |

@BuildingOverview7 @BAT
Scenario Outline: Verify specific building <Building> Average Lobby for 90 days is non-zero during Busy hours
    Given I am logged as a Building Manager
    When I select <Building>
    And I get Average Lobby
    Then The value must be non-zero during busy hours
    
    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |

@BuildingOverview8 @BAT
Scenario Outline: Verify specific building <Building> online sensor is non-zero in occuancy sensor page
    Given I am logged as a Building Manager
    When I select <Building>
    And I get online sensor count in occupancy page
    Then The value must be non-zero
    
    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |
