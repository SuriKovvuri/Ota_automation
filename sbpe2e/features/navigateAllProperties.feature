Feature: Navigate All Properties Overview Page

@AllOverview @RTOccupancyAll @BAT @P1 @P2 @P3 
Scenario: Verify Overall Property RealTime Occupancy is non-zero during 7AM-7PM EST 
    Given I am logged as a Building Manager
    When I fetch the Overall real-time occupancy
    Then The value must be non-zero during 7AM-7PM EST

@PeopleAtBuilding @BAT
Scenario Outline: Itemized list of <Building> shows non-zero numbers for numerators during 7AM-7PM EST
    When I fetch numerator of <Building>
    Then The value must be non-zero during 7AM-7PM EST

    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |
