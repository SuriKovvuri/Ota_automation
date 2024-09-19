Feature: Misc features of 22.02 release
  @22_02_misc_features
  Scenario: Edit Device name
        Given I am logged in
        When I add device
        | devicename | ipaddr | hostname | description | street | city | state | country | zipcode | connectendpoint | usergroup |  ftp | wallpaper | port | subpath |
        | Dutotwod | 122.3.4.30 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | SSH || enable | disable | 22 ||
        And Edit Device
        | devicename | newdevicename | newdescription|
        | Dutotwod | Dutotwodnew        ||
        Then Check Device
        |devicename | usergroup | connectendpoint |
        | Dutotwodnew |||
        Then Delete Device
        | devicename |
        | Dutotwodnew |

  @22_02_misc_features
  Scenario: Login with email address
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Autothree | Bbbe | automationthreeee@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | OTAServiceGroupAdmin | internal | disable |
        Then emailverify
        | firstname | lastname |
        | Autothree | Bbbe |
        Then Login with email address
        | firstname | lastname | password | firstlogin | newpassword | email |
        | Autothree | Bbbe | Welcome@1234 | Yes | f@bIoT17291729 | automationthreeee@bbbe.com |
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Venkatesan | Sivanandan | Welcome@1234 |  No |
        Then Delete User
        | firstname | lastname |
        | Autothree | Bbbe |

 @22_02_misc_features
  Scenario: Verify user create with long email of 254 characters
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Butothre | Bbbe | ebcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcd@test.com | Welcome@1234 | Welcome@1234 | 8072191178 | OTAServiceGroupAdmin | internal | disable |
        Then emailverify
        | firstname | lastname |
        | Butothre | Bbbe |
        Then Login with email address
        | firstname | lastname | password | firstlogin | newpassword | email |
        | Butothre | Bbbe | Welcome@1234 | Yes | f@bIoT17291729 | ebcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcd@test.com |
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Venkatesan | Sivanandan | Welcome@1234 |  No |
        Then Delete User
        | firstname | lastname |
        | Butothre | Bbbe |


@22_02_misc_features
  Scenario: User create with long lastname
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Dutothre | Bbbbebbbbebbbb | dutomationth@Cbbbebbbbebbbb.com | Welcome@1234 | Welcome@1234 | 8072191178 | OTAServiceGroupAdmin | internal | disable |
        Then emailverify
        | firstname | lastname |
        | Dutothre | Bbbbebbbbebbbb |
        Then Login with email address
        | firstname | lastname | password | firstlogin | newpassword | email |
        | Dutothre | Bbbbebbbbebbbb | Welcome@1234 | Yes | f@bIoT17291729 | dutomationth@Cbbbebbbbebbbb.com |
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Venkatesan | Sivanandan | Welcome@1234 |  No |
        Then Delete User
        | firstname | lastname |
        | Dutothre | Bbbbebbbbebbbb |

@22_02_misc_features
  Scenario: User create with long firstname
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Dutothreeeeeee | Bbbb | eutomationth@Fbbbebbbbebbbb.com | Welcome@1234 | Welcome@1234 | 8072191178 | OTAServiceGroupAdmin | internal | disable |
        Then emailverify
        | firstname | lastname |
        | Dutothreeeeeee | Bbbb |
        Then Login with email address
        | firstname | lastname | password | firstlogin | newpassword | email |
        | Dutothreeeeeee | Bbbb | Welcome@1234 | Yes | f@bIoT17291729 | eutomationth@Fbbbebbbbebbbb.com |
        Then Login with new user without mfa
        | firstname | lastname | password | firstlogin |
        | Venkatesan | Sivanandan | Welcome@1234 |  No |
        Then Delete User
        | firstname | lastname |
        | Dutothreeeeeee | Bbbb |
