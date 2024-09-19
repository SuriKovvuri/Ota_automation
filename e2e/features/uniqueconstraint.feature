Feature: Test the UI valaidation flows
    
    @Test
    Scenario: Check for errors in add user
        Given I am logged in
        When Org is "ThyagaINC"
        And Node is "test1_vedge1234"
        And Service is "fg"
        And Add custom Service "fg"
        Then Service should be not be Added constraint violation
        
    



