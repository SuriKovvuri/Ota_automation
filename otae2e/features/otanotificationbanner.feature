Feature: Validate the notification banner

@NB @Regression @NB1
Scenario: Create a notification banner
    Given Admin logged in
    When I create a notification banner
        |text                    |
        |Hi This is a new Feature|
    #And I enable the notification banner

