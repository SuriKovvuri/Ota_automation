Feature: Test status and feature file parameter
    
    @status
    Scenario: Check status of an Alive node
        Given I am logged in
        When Org is "orgName"
        And Node is "node1"
        Then Status should be "ALIVE"

    @status
    Scenario: Check status of a Connected Tunnel
        Given I am logged in
        When Org is "orgName"
        And Node is "node1"
        And Network is "node1_tan1"
        Then Status should be "CONNECTED"

    @status
    Scenario: Check status of a Service
        Given I am logged in
        When Org is "orgName"
        And Node is "node1"
        And Service is "node1_service1"
        Then Status should be "HEALTHY"

    @status
    Scenario: Trigger a tech-dump
        Given I am logged in
        When Org is "orgName"
        And Node is "node1"
        And Trigger techdump
        Then Techdump should be available

    @Add
    Scenario: Add a TAN Network
        Given I am logged in
        When Org is "orgName"
        And Node is "node1"
        And Add A TAN Network
        | NetworkName     | NodeName | OrgName | Label | Nw_Addressing | CIDR | Start_IP | end_IP | GW | VLAN | VLAN_ID | Default_Destination |
        | tan1 | node1 | orgName| label:wip | Static | 64.64.64.100/24 | 64.64.64.101 | 64.64.64.110 | 64.64.64.100 | Enabled | 1010 | WAN |
        Then Network should be Added "tan1"
    
    @Add
    Scenario: Add a Custom Service
        Given I am logged in
        When Org is "orgName"
        And Node is "node1"
        And Network is "node1_tan1"
        And Add custom Service "custom"
        Then Service should be Added "custom"
        And Status should be "HEALTHY"

    
    @ALERT
    Scenario: Add user Alert subscriptions
        Given I am logged in
        When I Add Alert subscriptions
        | SubscriptionName | NodeName | OrgName | TunnelName | ServiceName | Label | If | Is | For | Scope |
        | Test1 | ALL | ALL| ALL | ALL | test:Alert | Node | Default | 5:Min | Org:All |
        | Test2 | ALL | ALL| ALL | ALL | test:Alert | Tunnel | Default | 5:Min | Org:All |
        | Test3 | ALL | ALL| ALL | ALL | test:Alert | Service | Default | 10:Min | Org:All |
        Then Alert subscription should be Added "Test1, Test2, Test3"

    @ALERT
    Scenario: Delete user Alert subscriptions
        Given I am logged in
        When I Delete Alert subscriptions 
        | SubscriptionName |
        | Test3 |
        | Test2 |
        | Test1 |
        
        Then Alert subscriptions should be Deleted "Test1, Test2, Test3"

    @Mongo
    Scenario: Connect Mongo
        Given I am logged in
        When I connect 
        Then I am Connected

    @PDF
    Scenario: Test PDF Generations
        Given I am logged in
        When Org is "ThyagaINC"
        And I navigate
        Then PDF is created

    @Navigation
    Scenario: Navigation test
    Given I am logged in
    When I navigate to left panel screens
    Then I should see no console errors 
    

    Scenario: Check status of an Connected Tunnel table
        Given I am logged in
        When I check status of Network
        | networkName     | nodeName | orgName |
        | tan1   | test1_vedge     | ThyagaINC|
        Then Status should be Tunnel-Connected

    Scenario: Check status of an Alive node123
        Given I am logged in
        When I check status of Node "Raja" And Org is "Raja1"
        Then Status should be "Rash1"

    Scenario: Check status of an Alive node1234
        Given I am logged in
        When I check status of Node <Raja> And Org is <Raja1>
        Then Status should be <Rash1>

    Scenario: Check status of an Alive node12345
        Given I am logged in
        When I check status of Node {Raja} And Org is {Raja1}
        Then Status should be <Rash1>

    Scenario: Check status of an Connected Tunnel table123
        Given I am logged in
        When I check status of Network
        | networkName     | nodeName | orgName |
        | tan1   | test1_vedge     | ThyagaINC|
        Then Status should be Tunnel-Connected



