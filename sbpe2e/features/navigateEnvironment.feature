Feature: Navigate Environment tab

@Environment1 @BAT
Scenario Outline: Verify Todays temperature is nonzero in environment tab of <Building>
    Given I am logged as a Building Manager
    When I select <Building>
    And I navigate environment tab in building
    And I fetch todays temperature
    Then The value must be non-zero

    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |

@Environment2 @BAT
Scenario Outline: Verify Tomorrows temperature is nonzero in environment tab of <Building>
    Given I am logged as a Building Manager
    When I select <Building>
    And I navigate environment tab in building
    And I fetch tomorrows temperature
    Then The value must be non-zero

    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |

@Environment3 @BAT
Scenario Outline: Verify day after tomorrows temperature is nonzero in environment tab of <Building>
    Given I am logged as a Building Manager
    When I select <Building>
    And I navigate environment tab in building
    And I fetch day after tomorrows temperature
    Then The value must be non-zero

    Examples:
    | Building                   |
    | "75 Rockefeller Plaza"     |
    | "1330 Avenue of Americas"  |

@Environment4 @BAT
Scenario Outline: Verify all components of <Sensor> widget is present in environment tab of <Building>
    Given I am logged as a Building Manager
    When I select <Building>
    And I navigate environment tab in building
    And I locate <Sensor> widget
    Then All componetns must be populated in the widget

    Examples:
    | Building                   | Sensor             |
    | "75 Rockefeller Plaza"     | "Carbon Monoxide"  |
    | "1330 Avenue of Americas"  | "Carbon Monoxide"  |
    | "75 Rockefeller Plaza"     | "Carbon Dioxide"  |
    | "1330 Avenue of Americas"  | "Carbon Dioxide"  |
    | "75 Rockefeller Plaza"     | "Formaldehyde"  |
    | "1330 Avenue of Americas"  | "Formaldehyde"  |
    | "75 Rockefeller Plaza"     | "Relative Humidity"  |
    | "1330 Avenue of Americas"  | "Relative Humidity"  |
    | "75 Rockefeller Plaza"     | "Light Intensity"  |
    | "1330 Avenue of Americas"  | "Light Intensity"  |
    | "75 Rockefeller Plaza"     | "Ozone"  |
    | "1330 Avenue of Americas"  | "Ozone"  |
    | "75 Rockefeller Plaza"     | "PM 1.0"  |
    | "1330 Avenue of Americas"  | "PM 1.0"  |
    | "75 Rockefeller Plaza"     | "PM 10.0"  |
    | "1330 Avenue of Americas"  | "PM 10.0"  |
    | "75 Rockefeller Plaza"     | "PM 2.5"  |
    | "1330 Avenue of Americas"  | "PM 2.5"  |
    | "75 Rockefeller Plaza"     | "Temperature"  |
    | "1330 Avenue of Americas"  | "Temperature"  |
    | "75 Rockefeller Plaza"     | "VOC"  |
    | "1330 Avenue of Americas"  | "VOC"  |











