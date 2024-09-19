Feature: Test the  UI valaidation Misc flows
    
    @otauivalidation_misc
    Scenario: AddDeleteUserWorkflow
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | automation@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | CustomerOrgGroupAdmin | internal | disable |
        And Delete User
        | firstname | lastname | 
        | Automation | Bbbe |
        And I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | automation@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | CustomerOrgGroupAdmin | internal | disable |
        Then check User
        | firstname | lastname | usergroup |
        | Automation | Bbbe | CustomerOrgGroupAdmin |
        And Delete User
        | firstname | lastname | 
        | Automation | Bbbe |

    @otauivalidation_misc
    Scenario: AddDeleteExternalUserWorkflow
        Given I am logged in
        When I test add external user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | auto@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | CustomerOrgGroupAdmin | Google | disable |
        And Delete User
        | firstname | lastname | 
        | Automation | Bbbe |
        And I test add external user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | auto@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | CustomerOrgGroupAdmin | Google | disable |
        Then check User
        | firstname | lastname | usergroup |
        | Automation | Bbbe | CustomerOrgGroupAdmin |
        And Delete User
        | firstname | lastname | 
        | Automation | Bbbe |

    @otauivalidation_misc
    Scenario: AddDeleteExternaltoInternalUserWorkflow
        Given I am logged in
        When I test add external user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | auto@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | CustomerOrgGroupAdmin | Google | disable |
        And Delete User
        | firstname | lastname | 
        | Automation | Bbbe |
        And I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | auto@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | CustomerOrgGroupAdmin | internal | disable |
        Then check User
        | firstname | lastname | usergroup |
        | Automation | Bbbe | CustomerOrgGroupAdmin |
        And Delete User
        | firstname | lastname | 
        | Automation | Bbbe |

    @otauivalidation_misc
    Scenario: AddDeleteInternaltoExternalUserWorkflow
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | auto@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | CustomerOrgGroupAdmin | internal | disable |
        And Delete User
        | firstname | lastname | 
        | Automation | Bbbe |
        And I test add external user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | auto@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | CustomerOrgGroupAdmin | Google | disable |
        Then check User
        | firstname | lastname | usergroup |
        | Automation | Bbbe | CustomerOrgGroupAdmin |
        And Delete User
        | firstname | lastname | 
        | Automation | Bbbe |
    
    @otauivalidation_misc
    Scenario: DeviceAddDeleteWorkflow
        Given I am logged in
        When I add device
        | devicename | ipaddr | hostname | description | street | city | state | country | zipcode | connectendpoint | usergroup |  ftp | wallpaper | port | subpath |
        | autoone | 122.3.4.30 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | SSH || enable | disable | 22 ||
        And Add Device Usergroup
        | devicename | usergroup | connectendpoint | port |
        | autoone | QA Team | SSH | 22 |
        And Delete Device
        | devicename | 
        | autoone |
        Then I add device
        | devicename | ipaddr | hostname | description | street | city | state | country | zipcode | connectendpoint | usergroup |  ftp | wallpaper | port | subpath |
        | autoone | 122.3.4.30 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | SSH || enable | disable | 22 ||
        And Add Device Usergroup
        | devicename | usergroup | connectendpoint | port |
        | autoone | QA Team | SSH | 22 |
        And Delete Device
        | devicename | 
        | autoone |
    
    @otauivalidation_misc
    Scenario: GroupAddDeleteWorkflow
        Given I am logged in
        When Admin user creates a group
        When Admin user deletes the group
        Then Admin user creates a group
        Then Admin user deletes the group
    

    @otauivalidation_misc
    Scenario: AddEditUserWorkflow
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | autoauto@bbbe.com | Welcome@1234 | Welcome@1234 | 8072191178 | CustomerOrgGroupAdmin | internal | disable | 
        Then I test edit user
        | firstname | lastname | newfirstname | newlastname |
        | Automation | Bbbe | one | e |
        And Delete User
        | firstname | lastname | 
        | Automationone | Bbbee |
    
    @otauivalidation_misc
    Scenario: DeviceAddEditWorkflow
        Given I am logged in
        When I add device
        | devicename | ipaddr | hostname | description | street | city | state | country | zipcode | connectendpoint | usergroup |  ftp | wallpaper | port | subpath |
        | autoone | 122.3.4.30 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | SSH || enable | disable | 22 ||
        Then Edit Device
        |devicename| newdescription |
        | autoone | New |
        And Delete Device
        | devicename | 
        | autoone |

     @otauivalidation_misc
     Scenario: Associatedisassociategrouptouser
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbe | automation@bbb.com | Welcome@1234 | Welcome@1234 | 8072191178 | QA Remote Access | internal | disable | 
        Then Change UserGroup
        | firstname | lastname | oldusergroup | newusergroup |
        | Automation | Bbbe |  QA Remote Access ||
        And Change UserGroup
        | firstname | lastname | oldusergroup | newusergroup |
        | Automation | Bbbe || QA Remote Access |
        And Change UserGroup
        | firstname | lastname | oldusergroup | newusergroup |
        | Automation | Bbbe | QA Remote Access ||
        And Change UserGroup
        | firstname | lastname | oldusergroup | newusergroup |
        | Automation | Bbbe || QA Remote Access |
        And Delete User
        | firstname | lastname | 
        | Automationone | Bbbee |

    @otauivalidation_misc1
    Scenario: Associatedisassociategrouptodevice
        Given I am logged in
        When I add device
        | devicename | ipaddr | hostname | description | street | city | state | country | zipcode | connectendpoint | usergroup |  ftp | wallpaper | port | subpath |
        | autoone | 122.3.4.30 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | SSH || enable | disable | 22 ||
        Then Add Device Usergroup
        | devicename | usergroup | connectendpoint | port |
        | autoone | QA Team | SSH | 22 |
        And Remove Device Usergroup 
        | devicename | usergroup |
        | autoone | QA Team |
        And Add Device Usergroup
        | devicename | usergroup | connectendpoint | port |
        | autoone | QA Team | SSH | 22 |
        And Remove Device Usergroup 
        | devicename | usergroup |
        | autoone | QA Team |
        And Add Device Usergroup
        | devicename | usergroup | connectendpoint | port |
        | autoone | QA Team | SSH | 22 |
        And Delete Device
        | devicename | 
        | autoone |