Feature: Test the  UI valaidation flows
    
    @otauivalidation
    Scenario: Check for errors in Add User page
        Given I am logged in
        When I test add user errors
        | fieldName | condition | error |
        | firstname | splchar | error |
        | lastname | splchar | error |
        | email | no@ | error |
        | password  | length | error |
        | confirmpsw | length | error |
        | phone | alphanum | error |

        Then UI should throw validation errors

    @otauivalidation
    Scenario: Check for mandatory fields in Add User page
        Given I am logged in
        When I test add user for mandatory fields
        Then UI should throw validation errors

    @otauivalidation
    Scenario: Check for errors in Add Device page
        Given I am logged in
        When I test add device errors
        | fieldName | condition | error |
        | device | splchar | error |
        | ip | splchar | error |
        | host | splchar | error |
        | city  | splchar | error |
        | country | splchar | error |

        Then UI should throw validation errors

    @otauivalidation
    Scenario: Check for mandatory fields in Add Device page
        Given I am logged in
        When I test add device for mandatory fields
        Then UI should throw validation errors

    @otauivalidation
    Scenario: UserWorkflow
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Auto | Bbbe | autoo@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | OTAServiceGroupAdmin | internal | disable |
        Then check User
        | firstname | lastname | usergroup |
        | Auto | Bbbe | OTAServiceGroupAdmin |
        Then Get Username 
        | firstname | lastname |
        | Auto | Bbbe |
        Then Change UserGroup
        | firstname | lastname | oldusergroup | newusergroup |
        | Auto | Bbbe |  OTAServiceGroupAdmin | Check Access |
        Then Delete User
        | firstname | lastname | 
        | Auto | Bbbe |


    @otauivalidation
    Scenario: DeviceWorkflow
        Given I am logged in
        When I add device
        | devicename | ipaddr | hostname | description | street | city | state | country | zipcode | connectendpoint | usergroup |  ftp | wallpaper | port | subpath |
        | Auteone | 122.3.4.30 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | SSH || enable | disable | 22 ||
        Then Add Device Usergroup
        | devicename | usergroup | connectendpoint | port |
        | Auteone | Qa Team | SSH | 22 |
        Then Check Device
        | devicename | usergroup | connectendpoint | port |
        | Auteone | Qa Team | SSH | 22 |
        Then Change Device Endpoint
        | devicename | oldconnectendpoint | oldconnectendpointport | newconnectendpoint | newconnectendpointport | ftp | wallpaper |
        | Auteone | SSH | 22 | RDP | 3389 | disable | disable |
        Then Add Device Usergroup
        | devicename | usergroup | connectendpoint | port |
        | Auteone | Qa Team | RDP | 3389 |
        Then Delete Device
        | devicename | 
        | Auteone |

    @otauivalidation
    Scenario: MfaWorkflow
        Given I am logged in
        When Optional org level Mfa
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Veng | Eight | veng@eight.com | Welcome@1234 | Welcome@1234 | 8072191178 |OTAServiceGroupAdmin| internal | disable |
        Then EnableMfaforuser
        | firstname | lastname |
        | Veng | Eight |
        Then emailverify
        | firstname | lastname | 
        | Veng | Eight |
        Then Login and setup mfa
        | firstname | lastname | password | newpassword | firstlogin |
        | Veng| Eight | Welcome@1234 | f@bIoT17291729 | Yes |
        


    @otauivalidation
    Scenario: Mfauserdisable
        Given I am logged in 
        Then DisableMfaforuser
        | firstname | lastname |
        | Veng | Eight |
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Veng | Eight | f@bIoT17291729 |  No |
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Venkatesan | Sivanandan | Welcome@1234 |  No |
        Then Delete User
        | firstname | lastname | 
        | Veng | Eight |

    @otauivalidation
    Scenario: Mfauserenable
        Given I am logged in 
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Vena | Seven | vena@seven.com | Welcome@1234 | Welcome@1234 | 8072191178 |OTAServiceGroupAdmin| internal | disable |
        Then emailverify
        | firstname | lastname | 
        | Vena | Seven |
        Then EnableMfaforuser
        | firstname | lastname |
        | Vena | Seven |
        Then Login and setup mfa
        | firstname | lastname | password | firstlogin | newpassword |
        | Vena | Seven | Welcome@1234 | Yes | f@bIoT17291729 |
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Venkatesan | Sivanandan | Welcome@1234 |  No |
        Then Delete User
        | firstname | lastname | 
        | Vena | Seven |
         


    @otauivalidation
    Scenario: Mfadisable
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | mfa | auth |
        | Venb | Nine | venb@nine.com | Welcome@1234 | Welcome@1234 | 8072191178 |OTAServiceGroupAdmin| disable | internal |
        Then emailverify
        | firstname | lastname | 
        | Venb | Nine |
        Then EnableMfaforuser
        | firstname | lastname |
        | Venb | Nine |
        Then Disable org Mfa
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin | newpassword |
        | Venb | Nine | Welcome@1234 | Yes | f@bIoT17291729 |
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Venkatesan | Sivanandan | Welcome@1234 |  No |
        Then Delete User
        | firstname | lastname | 
        | Venb | Nine |
        
        

    @otauivalidation
    Scenario: Mfaenable
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | mfa | auth |
        | Vena | Ten | vena@ten.com | Welcome@1234 | Welcome@1234 | 8072191178 |OTAServiceGroupAdmin| disable | internal |
        Then emailverify
        | firstname | lastname | 
        | Vena | Ten |
        Then Enable org Mfa
        Then Login and setup mfa
        | firstname | lastname | password | firstlogin | newpassword |
        | Vena | Ten | Welcome@1234 | Yes | f@bIoT17291729 |
        Then Disable org Mfa
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Venkatesan | Sivanandan | Welcome@1234 |  No |
        Then Delete User
        | firstname | lastname | 
        | Vena | Ten |
        

    @otauivalidation
    Scenario: PasswordReset
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | mfa | auth |
        | Venc | Eleven | venc@Eleven.com | Welcome@1234 | Welcome@1234 | 8072191178 |OTAServiceGroupAdmin| disable | internal |
        Then emailverify
        | firstname | lastname |
        | Venc | Eleven |
        Then Reset password for user
        | firstname | lastname | password | newpassword |
        | Venc | Eleven | Welcome@1234 | IoTium@1234 |
        Then Login with new user without mfa
        | firstname | lastname | password | newpassword | firstlogin |
        | Venc | Eleven | IoTium@1234 | f@bIoT17291729 | Yes |
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Venkatesan | Sivanandan | Welcome@1234 |  No |
        Then Delete User
        | firstname | lastname | 
        | Venc | Eleven |
        
        
    @otauivalidation
    Scenario: Check for mandatory fields in Password Reset
        Given I am logged in
        When I test password reset for mandatory fields
        Then UI should throw validation errors

    @otauivalidation
    Scenario: PasswordResetwithwrongconfirmpassword
        Given I am logged in
        Then Reset password for user with wrong confirm password
        | firstname | lastname | password | newpassword |
        | Venkatesan | Sivanandan | Welcome@1234 | IoTium@1234 |
    
    Scenario: Password reset without old password
        Given I am logged in
        When I test password reset without old password
        Then UI should throw validation errors
    
    Scenario: Deviceaccess
        Given I am logged in
        When I try to access a device
        | devicename | type | username | password |
        | venkatpcssh | ssh | venkatesan | venkat123 |
        | video-rdp | rdp | rdp | test123 |
        | Device 2 | http | su | 1234 |
    



