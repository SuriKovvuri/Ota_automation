Feature: Service Validation

    @servicecase1 @servicevalidation
    Scenario: Skyspark Service create with existing license
        Given Skyspark Service create with existing license
        When I edit the service
        Then Verify Skyspark service config

    @servicecase2 @servicevalidation
    Scenario: Niagra Service Create
        Given Niagra Service Create
        When I edit the service
        Then Verify Niagara service config

    @template
    Scenario: Create Service with All Components
        Given I am logged in as "orgAdmin"
        When Create QA Service
        Then Verify service is "HEALTHY"

    @template
    Scenario: Edit QA Service
        Given I am logged in as "orgAdmin"
        When I edit the service
        Then Verify service is "HEALTHY"
