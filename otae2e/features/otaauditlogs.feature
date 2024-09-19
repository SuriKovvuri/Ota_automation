Feature: Audit Logs Validation

  @otaAuditLogs
  Scenario: User Create Audit logs
        Given I am logged in
        When I test add user
        | firstname | lastname | email | password | confirmpsw | phone | usergroup | auth | mfa |
        | Automation | Bbbee | automation@Bbbee.com | Welcome@1234 | Welcome@1234 | 8072191178 | OTAServiceGroupAdmin | internal | disable |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |
        | Venkatesan | Sivanandan | Automation                          | Bbbee            | user | create |
        And Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |groupname |
        | Venkatesan | Sivanandan | Automation                          | Bbbee            | user | add_user_to_group | OTAServiceGroupAdmin |



  @otaAuditLogs
  Scenario: UserGroup Remove Audit logs
        Given I am logged in
        When Change UserGroup
        | firstname | lastname | oldusergroup | newusergroup |
        | Automation | Bbbee |  OTAServiceGroupAdmin ||
        Then Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |groupname |
        | Venkatesan | Sivanandan | Automation                          | Bbbee            | user | remove_user_from_group | OTAServiceGroupAdmin |



  @otaAuditLogs
  Scenario: User update Audit logs
        Given I am logged in
        When I test edit user
        | firstname | lastname | newfirstname |
        | Automation | Bbbee | Automationone   |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |
        | Venkatesan | Sivanandan | Automationone                          | Bbbee            | user | edituser |


  @otaAuditLogs
  Scenario: User Password reset Audit logs
        Given I am logged in
        When Reset password for user
        | firstname | lastname | newpassword |
        | Automationone | Bbbee | IoTium@1234 |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |
        | Venkatesan | Sivanandan | Automationone                          | Bbbee            | user | passwordreset |



  @otaAuditLogs
  Scenario: User MFA enable Audit logs
        Given I am logged in
        When EnableMfaforuser
        | firstname | lastname |
        | Automationone | Bbbee |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |
        | Venkatesan | Sivanandan | Automationone                          | Bbbee            | user | mfaenable |

  @otaAuditLogs
  Scenario: User MFA Disable Audit logs
        Given I am logged in
        When DisableMfaforuser
        | firstname | lastname |
        | Automationone | Bbbee |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |
        | Venkatesan | Sivanandan | Automationone                          | Bbbee            | user | mfadisable |

  @otaAuditLogs
  Scenario: User MFA reset Audit logs
        Given I am logged in
        When EnableMfaforuser
        | firstname | lastname |
        | Automationone | Bbbee |
        When ResetMfaforuser
        | firstname | lastname |
        | Automationone | Bbbee |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |
        | Venkatesan | Sivanandan | Automationone                          | Bbbee            | user | mfareset |

  @otaAuditLogs
  Scenario: User status Disable Audit logs
        Given I am logged in
        When Disableuserstatus
        | firstname | lastname |
        | Automationone | Bbbee |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |
        | Venkatesan | Sivanandan | Automationone                          | Bbbee            | user | userstatusdisable |


  @otaAuditLogs
  Scenario: User status Enable Audit logs
        Given I am logged in
        When Enableuserstatus
        | firstname | lastname |
        | Automationone | Bbbee |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname | newuserfirstname | newuserlastname | type | action |
        | Venkatesan | Sivanandan | Automationone                          | Bbbee            | user | userstatusenable |



  @otaAuditLogs
  Scenario: Device and connection endpoint create Audit logs
        Given I am logged in
        When I add device
        | devicename | ipaddr | hostname | description | street | city | state | country | zipcode | connectendpoint | usergroup |  ftp | wallpaper | port | subpath |
        | Autotwod | 122.3.4.30 | Testname | Testdescrip | teststreet | testcity | teststate | testcountry | 23456 | SSH || enable | disable | 22 ||
        Then Verify audit log
        | currentuserfirstname | currentuserlastname |  devicename | type | action |
        | Venkatesan | Sivanandan | Autotwod                    | device  | create |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname |  devicename | connectendpoint |type | action |
        | Venkatesan | Sivanandan | Autotwod                    |  Autotwod SSH   |device  | endpointcreate |


  @otaAuditLogs
  Scenario: Usergroup and connection endpoint association Audit logs
        Given I am logged in
        When Add Device Usergroup
        | devicename | usergroup | connectendpoint | port |
        | Autotwod | Qa Team | Autotwod SSH | 22 |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname |  devicename | connectendpoint |type | action | usergroup |
        | Venkatesan | Sivanandan | Autotwod                    |  Autotwod SSH   |device  | endpointgroupassociation | Qa Team |


  @otaAuditLogs
  Scenario: Device  Connection endpoint removal audit logs
        Given I am logged in
        When Change Device Endpoint
        | devicename | oldconnectendpoint | oldconnectendpointport | newconnectendpoint | newconnectendpointport | ftp | wallpaper |
        | Autotwod | SSH | 22 | RDP | 3389 | disable | disable |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname |  devicename | connectendpoint |type | action |
        | Venkatesan | Sivanandan | Autotwod                    |  Autotwod SSH   |device  | endpointdelete |



  @otaAuditLogs
  Scenario: Device Delete Audit logs
        Given I am logged in
        When Delete Device
        | devicename |
        | Autotwod |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname |  devicename  |type | action |
        | Venkatesan | Sivanandan | Autotwod         |device  | delete |


  @otaAuditLogs
  Scenario: Group Create Audit logs
        Given I am logged in
        When I test add Group
        | groupname | description |
        | Testgroupb     | Testgroup   |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname |  groupname  |type | action |
        | Venkatesan | Sivanandan | Testgroupb         |group  | create |


  @otaAuditLogs
  Scenario: Group Edit Audit logs
        Given I am logged in
        When I test edit Group
        | groupname | newdescription |
        | Testgroupb     | testgroupedit   |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname |  groupname  |type | action |
        | Venkatesan | Sivanandan | Testgroupb         | group  | edit |


  @otaAuditLogs
  Scenario: Group Delete Audit logs
        Given I am logged in
        When I test delete Group
        | groupname |
        | Testgroupb     |
        Then Verify audit log
        | currentuserfirstname | currentuserlastname |  groupname  |type | action |
        | Venkatesan | Sivanandan | Testgroupb        | group  | delete |




