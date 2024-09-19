Feature: Workflow as IoTium User

@Workflow @OrgOnboarding @IoTiumUser
Scenario: Org onboarding
    Given I am logged in
    When I create an org
    | OrgName    | BillingName    | BillingEmail      | DomainName | TimeZone   | AdvSettings           |
    | MyOrg | My Org | myorg@gmail.com      |              |          |            |
    And I create an user
    | UserName    | Email    | Password      | TimeZone   | Role        | OrgName     |
    | My User | myuser@gmail.com      | f@bIoT17291729 |          | Read Only     | MyOrg      |
    And I verify user email address
    | Email                 |
    | myuser@gmail.com      |
    Then I login and change the password
    | UserName              | Password          | NewPassword       |
    | myuser@gmail.com      | f@bIoT17291729    | f@bIoT172917299    |

@Workflow @ChangePassword
Scenario: Change Password
    Given I am logged in as "changepwd"
    When I go to 'My Profile' page
    And I click 'Change Password' link
    And I change password
    | Password          | NewPassword       |
    |                   | 1f@bIoT172917296   |
    Then I am able to login with new password
    | Password          |
    | 1f@bIoT172917296    |
    And I reset the password to original
    | Password          | NewPassword       |
    | 1f@bIoT172917296    | 1f@bIoT172917297   |
    | 1f@bIoT172917297    | 1f@bIoT172917298  |
    | 1f@bIoT172917298    |                       |
    And I expect error for changing password to one of the last three passwords 
    | Password          | NewPassword       |
    |                   | 1f@bIoT172917297  |

@Workflow @EdgeOnboarding
Scenario: Edge iNode Onboarding
    Given I am logged in
    When I add HSN to org
    And I add an SSH Key
    | SSHKeyName            | PublicKey         |
    | WorkflowSSHKey        | ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCnYhYAMUInYccQemt/OQXVWU2bVlnCkAtCEwQkPp3EX8kzjpcjFmO+n5qvteyaBRoSNRMvAs4RPHsITmWAyxvVtn42aZmZu3LlKYgyv0VeW9SQnTjY5kSMbgogysu6rBfYj2b21dpL2RTSZ3eXcOHsp7/IBW4uXRLQGiz62x5DOYH5R1w1h9MfO5l5GS4/RN0ieSGKtje0wRk9G7RCtKuqWwzHJwXD+2doNyumzze1oMUgg5lXVVNKzn24cFEdpOQSL/IEpxZQO5nVwH5DrEucxY3yVFqllatC4PKBx6jU7KF0BdfWDaH7lQtlpkSHmL7hJAz8CH1cGcLvJ03AY907 |
    And I create a custom security policy
    | CSPName               | FromNetworkLabel  |
    | WorkflowCSP           | suite:workflow    |
    And I provision an edge iNode with HSN
    | NodeName              | Profile           | SSHKey        |
    | WorkflowEdgeiNode     | Edge              | WorkflowSSHKey|
    And I go to iNode details page
    | NodeName              |
    | WorkflowEdgeiNode     |
    And I associate custom security policy with network
    | NetworkName           | CSPName       |
    | WAN Network           | WorkflowCSP   |
    Then I expect iNode becomes ALIVE
    | NodeName              |
    | WorkflowEdgeiNode     |

@Workflow @DownloadEvents @IoTiumUser
Scenario: Download Events
    Given I am logged in
    When I go to 'Download Events' page
    And I select options in filter and request report
    Then Request is completed and I am able to download the report

@Workflow @DownloadActivity @IoTiumUser
Scenario: Download Activity
    Given I am logged in
    When I go to 'Download Activity' page
    And I select options in filter and request report
    Then Request is completed and I am able to download the report

@Workflow @ServiceSecrets
Scenario: Add Service Secrets
    Given I am logged in
    When I add a pull secret
    | PullSecretName        |
    | WorkflowPullSecret    |
    And I add a volume
    | VolumeName        |
    | WorkflowVolume    |
    Then I expect the created pull secret in list page
    And I expect the created volume in list page

@Workflow @AddCluster @IoTiumUser
Scenario: Add Cluster
    Given I am logged in
    When I create a cluster
    | ClusterName       | iNodeNames                   | Priority  | Candidate  |
    | WorkflowCluster   | clusteredge_0;behaveedge_0   | 100;101   | true;true  |
    Then I expect master is elected

@Workflow @AddWebhookAlert @IoTiumUser
Scenario: Add Webhook Alert Subscription
    Given I am logged in
    When I create an alert subscription using webhook
    | AlertName             | AlertType     | For   | Scope     | Channel                           |
    | WorkflowWebhookAlert  | Node          | 1:Min | Org:All   | Webhook:WorkflowWebhookChannel    |
    And I bring up an iNode to ALIVE state
    | NodeName              | Profile           | SSHKeyName    | PublicKey                 |
    | WorkflowEdgeiNode     | Edge              | WorkflowSSHKey| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCnYhYAMUInYccQemt/OQXVWU2bVlnCkAtCEwQkPp3EX8kzjpcjFmO+n5qvteyaBRoSNRMvAs4RPHsITmWAyxvVtn42aZmZu3LlKYgyv0VeW9SQnTjY5kSMbgogysu6rBfYj2b21dpL2RTSZ3eXcOHsp7/IBW4uXRLQGiz62x5DOYH5R1w1h9MfO5l5GS4/RN0ieSGKtje0wRk9G7RCtKuqWwzHJwXD+2doNyumzze1oMUgg5lXVVNKzn24cFEdpOQSL/IEpxZQO5nVwH5DrEucxY3yVFqllatC4PKBx6jU7KF0BdfWDaH7lQtlpkSHmL7hJAz8CH1cGcLvJ03AY907 |
    Then I expect a notification for the created alert