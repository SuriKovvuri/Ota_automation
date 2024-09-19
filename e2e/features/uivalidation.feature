Feature: Test the UI valaidation flows
    
    @UIValidation
    Scenario: Check for errors in Add User page
        Given I am logged in
        When Org is "orgName"
        And I test add user errors
        | fieldName | condition | error |
        | fullname | splchar | error |
        | email | no@ | error |
        | email | valid | info |
        | password  | length | error |
        | confirmpsw | length | error |

        Then UI should throw validation errors
        
    @UIValidation
    Scenario: Check for errors in Add Network page
        Given I am logged in
        When Org is "orgName"
        And Node is "node1"
        And I test add network errors
        | fieldName | condition | error |
        | name | splchar | error |
        | cidr | invalid | error |
        | startip | invalid | error |
        | endip  | invalid | error |
        | gatewayip | invalid | error |

        Then UI should throw validation errors

    @UIValidation
    Scenario: Check for errors in Add SSH Key
        Given I am logged in
        When Org is "orgName"
        And I test add ssh key errors
        | fieldName | condition | error |
        | name | splchar | error |
        | sshkey | del | error |
        
        Then UI should throw validation errors

    @UIValidation
    Scenario: Check invalid routes redirect to login
        Given I am not logged in
        When I try invalid routes
        | url | condition | 
        | name | login | 
        | aaaa | login | 
        | help | login | 
        | about | login | 
        | inodes | login | 
        | dashboard | login |
        | networks | login | 
        
        Then UI should throw validation errors
        