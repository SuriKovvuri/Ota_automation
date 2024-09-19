Feature: Whitelabling Phase I and II

    @branding
    Scenario: Login with ORG_ADMIN
        Given I am logged in as "orgAdmin"
        When Org is "orgName"
        Then Branding in Advanced settings is "Disable"

    @branding
    Scenario: Login with IOTIUM_ADMIN
        Given I am logged in as "Admin"
        When Org is "orgName"
        Then Branding in Advanced settings is "Enable"

    @branding
    Scenario: Enable Branding
        Given I am logged in as "Admin"
        When Org is "orgName"
            And "Enable" Branding "orgName"
        Then Branding Enabled "orgName"

    @branding
    Scenario: Configure Branding
        Given I am logged in as "orgAdmin"
        When Org is "orgName"
            And Customize Branding
            | DarkLogoURL       | LightLogoUrl      | FavoIconUrl       | LoginBgUrl        | Theme | FromEmailAddress | FontFamilyUrl                                                              |
            | https://test1.png | https://test2.png | https://test3.png | https://test4.png |       |                  | https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap |
        Then "home" Page should have "https://test2.png" "https://test3.png"
            And Font Family is "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap"

    @branding
    Scenario: Delete Branding
        Given I am logged in as "orgAdmin"
        When Org is "orgName"
            And Revert Branding
        Then Config get removed

    @branding
    Scenario: Configure Branding2
        Given I am logged in as "orgAdmin"
        When Org is "orgName"
            And Customize Branding
            | DarkLogoURL | LightLogoUrl | FavoIconUrl       | LoginBgUrl        | Theme | FromEmailAddress | FontFamilyUrl |
            |             |              | https://test3.png | https://test4.png |       |                  |               |
        Then Error seen "Please specify the dark logo URL or the light  logo URL, or both."

    @branding
    Scenario: Branding Error Scenario I
        Given I am logged in as "orgAdmin"
        When Org is "orgName"
            And Customize Branding
            | DarkLogoURL      | LightLogoUrl | FavoIconUrl | LoginBgUrl | Theme | FromEmailAddress | FontFamilyUrl                                                                          |
            | https://test.png |              |             |            |       |                  | https://fonts.google.com/specimen/Roboto?sidebar.open&selection.family=Roboto:wght@300 |
        Then Error seen "Please enter a valid Google Fonts URL"

    @branding
    Scenario: Branding Error Scenario II
        Given I am logged in as "orgAdmin"
        When Org is "orgName"
            And Customize Branding
            | DarkLogoURL   | LightLogoUrl | FavoIconUrl | LoginBgUrl | Theme | FromEmailAddress | FontFamilyUrl |
            | https://1.png |              |             |            |       |                  |               |
        Then Error seen "Please enter a valid URL"
