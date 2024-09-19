Feature: Validate error cases in different forms

@ErrorValidation @AddNetworkValidation
Scenario: "Add Network" page validation
    Given I am logged in
    When I navigate to 'Add Network' page
    | NodeName              | Profile               | SSHKey            |
    | WorkflowVirtualEdge   | Virtual Edge          | sanityqa          |
    Then I expect proper error for incorrect value
    | FieldName             | Value                 | Error             | OtherInfo                 |
    | Name                  | My Network*           | specialCharacters |                           |
    | Name                  | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |               |
    | Name                  |                       | empty             |                           |
    | Label Key             | MyNode*               | commonError       |                           |
    | Label Key             | _MyNode               | commonError       |                           |
    | Label Key             | MyNode.               | commonError       |                           |
    | Label Key             | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |               |
    | Label Value           | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |               |
    | Label Value           | _one                  | commonError       |                           |
    | Label Value           | one-                  | commonError       |                           |
    | Label Value           | one.                  | commonError       |                           |
    | Network CIDR          | abc/16                | invalid           |                           |
    | Network CIDR          | 10.10.256.0/0         | invalid           |                           |
    | Network CIDR          | 10.0.0/16             | invalid           |                           |
    | Network CIDR          | -1.0.0.0/16           | invalid           |                           |
    | Network CIDR          | 0.0.0.0/24            | reserved          |                           |
    | Network CIDR          | 0.0.0.0/0             | reserved          |                           |
    | Network CIDR          | 1.0.0.0/7             | reserved          |                           |
    | Network CIDR          | 192.168.0.0/16        | reserved          |                           |
    | Network CIDR          | 192.168.192.0/24      | reserved          |                           |
    | Network CIDR          | /16                   | invalid           |                           |
    | Network CIDR          |                       | invalid           |                           |
    | Network CIDR          | 127.0.0.0/8           | reserved          |                           |
    | Network CIDR          | 172.16.0.0/12         | reserved          |                           |
    | Reserved IP Range     | 10.0.0.1,10.1.0.25    | notSameIPsubnet   | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     | 10.1.0.1,10.0.0.25    | startIPGreater    | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     | 10.1.0.1,10.1.0.25    | notSameIPsubnet   | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     | 10.0.0.2,10.0.255.255 | notSameIPsubnet   | Network CIDR:10.0.0.0/16  |
    #LAT-15039| Reserved IP Range   | 10.0.0.3,10.0.0.256               | notSameIPsubnet           | Network CIDR:10.0.0.0/16  |
    #LAT-15039| Reserved IP Range   | -10.0.0.1,10.0.0.25               | invalid                   | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     | 10.0.0.1,10.-0.0.25   | invalid           | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     | 1-0.0.0.1,10.0.0.25   | invalid           | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     | 10.25.0.2,10.25.0.2   | notSameIPsubnet   | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     | 10.0,10.0.0.25        | invalid           | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     | 10.0.0.1,10.0.0.      | invalid           | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     | 10.0.0.11,10.0.0.2    | startIPGreater    | Network CIDR:10.0.0.0/16  |
    | Reserved IP Range     |                       | invalid           | Network CIDR:10.0.0.0/16  |
    | iNode IP Address      | 12.0.0.1              | notSameIPsubnet   | Network CIDR:10.0.0.0/16  |
    | iNode IP Address      | -12.0.0.1             | invalid           | Network CIDR:10.0.0.0/16  |
    | iNode IP Address      | 10.0.0.256            | invalid           | Network CIDR:10.0.0.0/16  |
    | iNode IP Address      | 1-0.0.0.1             | invalid           | Network CIDR:10.0.0.0/16  |
    | iNode IP Address      | 10.0.0                | invalid           | Network CIDR:10.0.0.0/16  |
    | VLAN ID               | 0                     | invalid           |                           |
    | VLAN ID               | 4095                  | invalid           |                           |
    | VLAN ID               | -1                    | invalid           |                           |
    | VLAN ID               | 10-12                 | invalid           |                           |
    #LAT-15039| VLAN ID     | 10.11                 | invalid           |                           |
    | VLAN ID               |                       | empty             |                           |
    | Dest Network CIDR     | abc/16                | invalid           | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | 10.10.256.0/0         | invalid           | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | 10.0.0/16             | invalid           | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | -1.0.0.0/16           | invalid           | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | 0.0.0.0/24            | reserved          | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | 0.0.0.0/0             | reserved          | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | 1.0.0.0/7             | reserved          | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | 192.168.0.0/16        | reserved          | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | 192.168.192.0/24      | reserved          | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | /16                   | invalid           | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     |                       | invalid           | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | 127.0.0.0/8           | reserved          | Network CIDR:10.0.0.0/16  |
    | Dest Network CIDR     | 172.16.0.0/12         | reserved          | Network CIDR:10.0.0.0/16  |
    | Via                   | 12.0.0.1              | notSameIPsubnet   | Network CIDR:10.0.0.0/16  |
    | Via                   | -12.0.0.1             | invalid           | Network CIDR:10.0.0.0/16  |
    #LAT-15039| Via         | 10.0.0.256            | invalid           | Network CIDR:10.0.0.0/16  |
    | Via                   | 1-0.0.0.1             | invalid           | Network CIDR:10.0.0.0/16  |
    | Via                   | 10.0.0                | invalid           | Network CIDR:10.0.0.0/16  |
    | Via                   | 10.0.0                | invalid           | Network CIDR:10.0.0.0/16  |
    #LAT-15039| Via         |                       | empty             | Network CIDR:10.0.0.0/16  |
    | Default Dest IP       | 12.0.0.1              | notSameIPsubnet   | Network CIDR:10.0.0.0/16  |
    | Default Dest IP       | -12.0.0.1             | invalid           | Network CIDR:10.0.0.0/16  |
    #LAT-15039| Default Dest IP| 10.0.0.256         | invalid           | Network CIDR:10.0.0.0/16  |
    | Default Dest IP       | 1-0.0.0.1             | invalid           | Network CIDR:10.0.0.0/16  |
    | Default Dest IP       | 10.0.0                | invalid           | Network CIDR:10.0.0.0/16  |
    | Default Dest IP       | 10.0.0                | invalid           | Network CIDR:10.0.0.0/16  |
    #LAT-15039| Default Dest IP|                    | empty             | Network CIDR:10.0.0.0/16  |
    | Name                  | __POSSIBLE_ERROR_CASES|                   |                           |
    | Label Key             | __POSSIBLE_ERROR_CASES|                   |                           |
    | Label Value           | __POSSIBLE_ERROR_CASES|                   |                           |


@ErrorValidation @AddOrgValidation
Scenario: "Add Org" modal validation
    Given I am logged in
    When I open 'Add Org' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | Organization Name | My Org*               | specialCharacters |
    | Organization Name | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |
    | Organization Name |                       | empty             |
    | Billing Name      | My Name*              | specialCharacters |
    | Billing Name      | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |
    | Billing Name      |                       | empty             |
    | Billing Email     | myemail               | invalidEmail      |
    | Billing Email     | myemail@domain        | invalidEmail      |
    | Billing Email     | myemail@domain.a      | invalidEmail      |
    | Billing Email     | my email              | invalidEmail      |
    | Billing Email     | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | invalidEmail   |
    | Billing Email     |                       | empty             |
    | Domain Name       | mydomain*.com         | invalidDomain     |
    | Domain Name       | mydomain              | invalidDomain     |
    | Domain Name       | my domain             | invalidDomain     |
    | Domain Name       | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |
    | Organization Name | __POSSIBLE_ERROR_CASES|                   |
    | Billing Name      | __POSSIBLE_ERROR_CASES|                   |
    | Domain Name       | __POSSIBLE_ERROR_CASES|                   |
    | Billing Email     | __POSSIBLE_ERROR_CASES|                   |


@ErrorValidation @AddInodeValidation
Scenario: "Add iNode" modal validation
    Given I am logged in
    When I open 'Add iNode' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | iNode Name        | My iNode*             | specialCharacters |
    | iNode Name        | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |
    | iNode Name        |                       | empty             |
    | Label Key         | MyNode*               | commonError       |
    | Label Key         | _MyNode               | commonError       |
    | Label Key         | MyNode.               | commonError       |
    | Label Key         | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |
    | Label Value       | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |
    | Label Value       | _one                  | commonError       |
    | Label Value       | one-                  | commonError       |
    | Label Value       | one.                  | commonError       |
    | Serial Number     | ABCDE                 | notFound          |
    | SSH Key           | ABCDE                 | notFound          |
    | iNode Name        | __POSSIBLE_ERROR_CASES|                   |
    | Label Key         | __POSSIBLE_ERROR_CASES|                   |
    | Label Value       | __POSSIBLE_ERROR_CASES|                   |


@ErrorValidation @AddUserValidation
Scenario: "Add User" modal validation
    Given I am logged in
    When I open 'Add User' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | Full Name         | My User*              | specialCharacters |
    | Full Name         | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |
    | Full Name         |                       | empty             |
    | Email Address     | myemail               | invalidEmail      |
    | Email Address     | myemail@domain        | invalidEmail      |
    | Email Address     | myemail@domain.a      | invalidEmail      |
    | Email Address     | my email              | invalidEmail      |
    | Email Address     | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | invalidEmail   |
    | Email Address     |                       | empty             |
    | Role              | ABCDE                 | notFound          |
    | Time Zone         | ABCDE                 | notFound          |
    | Confirm Password  | f@bIoT17291729        | notMatching       |
    | Full Name         | __POSSIBLE_ERROR_CASES|                   |
    | Email Address     | __POSSIBLE_ERROR_CASES|                   |
    | Password          | __POSSIBLE_ERROR_CASES|                   |

@ErrorValidation @UniqueUserEmail @IoTiumUser
Scenario: User Email Address Unique Constraint 
    Given I am logged in
    When I create an user with any existing user email address
    Then I expect unique email address error

@ErrorValidation @UniqueOrgBillingEmail @IoTiumUser
Scenario: Org Billing Email Address Unique Constraint 
    Given I am logged in
    When I create an org with any existing org billing email address
    Then I expect unique billing email address error

@ErrorValidation @UniqueiNodeName @IoTiumUser
Scenario: iNode name Unique Constraint 
    Given I am logged in
    When I create an iNode with any existing iNode name
    Then I expect unique iNode name error
    | NodeName              | Profile               |
    | WorkflowVirtualEdge   | Virtual               |

@ErrorValidation @UniqueRoleName @IoTiumUser
Scenario: Role Name Unique Constraint 
    Given I am logged in
    When I create a role with any existing role name
    Then I expect unique role name error

@ErrorValidation @UniqueSSHKeyName @IoTiumUser
Scenario: SSH Key Name Unique Constraint 
    Given I am logged in
    When I create an SSH Key with any existing SSH Key name
    | SSHKeyName            |
    | ErrorValidationSSHKey |
    Then I expect unique SSH key name error
    | SSHKeyName            |
    | ErrorValidationSSHKey |

@ErrorValidation @UniqueClusterName @IoTiumUser
Scenario: Cluster Name Unique Constraint 
    Given I am logged in
    When I create a cluster with any existing cluster name
    | ClusterName            |
    | ErrorValidationCluster |
    Then I expect unique cluster name error
    | ClusterName            |
    | ErrorValidationCluster |

@ErrorValidation @UniqueNetworkName @IoTiumUser
Scenario: Network name Unique Constraint 
    Given I am logged in
    When I create a network with any existing network name
    | NodeName              | NetworkName       |
    | WorkflowVirtualEdge   | WAN Network       |    
    Then I expect unique network name error
    | NodeName              | NetworkName       |
    | WorkflowVirtualEdge   | WAN Network       |

@ErrorValidation @UniqueServiceName @IoTiumUser
Scenario: Service name Unique Constraint 
    Given I am logged in   
    When I create a service with any existing service name
    | ServiceName   | NetworkName   | AppName               | NodeName              | CIDR          | StartIP   | EndIP     |
    | MyService     | TAN           | ThingWorx             | WorkflowVirtualEdge   | 10.0.0.0/16   | 10.0.0.1  | 10.0.0.10 |
    Then I expect unique service name error

@ErrorValidation @AddCSPValidation
Scenario: "Add Custom Security Policy" modal validation
    Given I am logged in
    When I open 'Add Custom Security Policy' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | Name              | My CSP*               | specialCharacters |
    | Name              | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |
    | Name              |                       | empty             |
    | Name              | __POSSIBLE_ERROR_CASES|                   |           
    | Label Key         | MyCSP*                | commonError       |
    | Label Key         | _MyCSP                | commonError       |
    | Label Key         | MyCSP.                | commonError       |
    | Label Key         | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |
    | Label Key         | __POSSIBLE_ERROR_CASES|                   |           
    | Label Value       | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |
    | Label Value       | _one                  | commonError       |
    | Label Value       | one-                  | commonError       |
    | Label Value       | one.                  | commonError       |           
    | Label Value       | __POSSIBLE_ERROR_CASES|                   |          
    | Priority          | -1                    | outOfRange        |                           
    | Priority          | 999                   | outOfRange        |                           
    | Priority          | 10001                 | outOfRange        |                           
    | Priority          |                       | empty             |                
    | Source Port       | ABC                   | outOfRange        |                           
    | Source Port       | 1*                    | outOfRange        |                           
    | Source Port       | 65536                 | outOfRange        |                           
    | Source Port       | -1                    | invalid           |                           
    | Destination Port  | ABC                   | outOfRange        |                           
    | Destination Port  | 1*                    | outOfRange        |                           
    | Destination Port  | 65536                 | outOfRange        |                           
    | Destination Port  | -1                    | invalid           |                           
    | Source CIDR       | abc/16                | invalid           |                           
    | Source CIDR       | abc 16                | invalid           |                           
    | Source CIDR       | a*(bc/16              | invalid           |                           
    | Source CIDR       | 10.10.256.0/0         | invalid           |                          
    | Source CIDR       | 10.0.0/16             | invalid           |                          
    | Source CIDR       | -1.0.0.0/16           | invalid           |                          
    | Source CIDR       | /16                   | invalid           |                          
    | Destination CIDR  | abc/16                | invalid           |                     
    | Destination CIDR  | abc 16                | invalid           |                           
    | Destination CIDR  | a*(bc/16              | invalid           |                           
    | Destination CIDR  | 10.10.256.0/0         | invalid           |                           
    | Destination CIDR  | 10.0.0/16             | invalid           |                           
    | Destination CIDR  | -1.0.0.0/16           | invalid           |                           
    | Destination CIDR  | /16                   | invalid           |                           

@ErrorValidation @AddSerialValidation
Scenario: "Add Serial" modal validation
    Given I am logged in
    When I open 'Add Serial' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | Serial Number     | __POSSIBLE_ERROR_CASES|                   |

@ErrorValidation @AddSSHKeyValidation
Scenario: "Add SSH Key" modal validation
    Given I am logged in
    When I open 'Add SSH Key' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | SSH Key Name      | My Key*               | specialCharacters |
    #LAT-15107
    #| SSH Key Name     | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |
    | SSH Key Name      |                       | empty             |
    | SSH Key Name      | __POSSIBLE_ERROR_CASES|                   |
    | SSH Public Key    |                       | invalid           |

@ErrorValidation @AddRoleValidation
Scenario: "Add Role" modal validation
    Given I am logged in
    When I open 'Add Role' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | Role Name         | My Role*              | specialCharacters |
    | Role Name         | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |
    | Role Name         |                       | empty             |
    | Role Name         | __POSSIBLE_ERROR_CASES|                   |
    | Description       | __POSSIBLE_ERROR_CASES|                   |
    | Permissions       | ABC                   | notFound          |

@ErrorValidation @AddClusterValidation
Scenario: "Add Cluster" modal validation
    Given I am logged in
    When I open 'Add Cluster' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | iNode Name        | A_B_C                 | notFound          |
    | Cluster Name      | My Cluster*           | specialCharacters |
    | Cluster Name      | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatftbfcovotfklxkamkutlyoncrimzwucjkvgbkrpndtqeomqaftknaimfxzipjczmpdzdtjsyhulcwnjcflpsmjczhebhcbubnrdskerlvrukjzgoeygwfzkvulmvpmhejxrfxitdbboxvrmepzfjlzppbcgmlwoeadywuqsprhlkgslyfabhqygwlfzczoxbnbfyyfdqv | length         |
    | Cluster Name      |                       | empty             |
    | Cluster Name      | __POSSIBLE_ERROR_CASES|                   |
    | Label Key         | MyNode*               | commonError       |
    | Label Key         | _MyNode               | commonError       |
    | Label Key         | MyNode.               | commonError       |
    | Label Key         | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |
    | Label Key         | __POSSIBLE_ERROR_CASES|                   |
    | Label Value       | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |
    | Label Value       | _one                  | commonError       |
    | Label Value       | one-                  | commonError       |
    | Label Value       | one.                  | commonError       |
    | Label Value       | __POSSIBLE_ERROR_CASES|                   |

@ErrorValidation @AddPullSecretValidation
Scenario: "Add Pull Secret" modal validation
    Given I am logged in
    When I open 'Add Pull Secret' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | Pull Secret Name  | My Pull Secret*       | specialCharacters |
    #LAT-15129
    #| Pull Secret Name  | XqEUEy2IElJhVgoAgR9fHrfHqLuAIhNZaHIO9CnJNdCL6NrApfTUYM659IxmV | length         |
    | Pull Secret Name  |                       | empty             |
    | Pull Secret Name  | __POSSIBLE_ERROR_CASES|                   |
    | Docker Config     |                       | empty             |

@ErrorValidation @AddVolumeValidation
Scenario: "Add Volume" modal validation
    Given I am logged in
    When I open 'Add Volume' modal
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             |
    | Volume Name       | My Volume*            | specialCharacters |
    #LAT-15130
    #| Volume Name       | XqEUEy2IElJhVgoAgR9fHrfHqLuAIhNZaHIO9CnJNdCL6NrApfTUYM659IxmV | length         |
    | Volume Name       |                       | empty             |
    | Volume Name       | __POSSIBLE_ERROR_CASES|                   |
    | File Name         | My File*              | specialCharacters |
    #LAT-15130
    #| File Name         | XqEUEy2IElJhVgoAgR9fHrfHqLuAIhNZaHIO9CnJNdCL6NrApfTUYM659IxmV | length         |
    | File Name         |                       | empty             |
    | File Name         | __POSSIBLE_ERROR_CASES|                   |
    | File Contents     |                       | empty             |

@ErrorValidation @AddAlertValidation
Scenario: "Add Alert" form validation
    Given I am logged in
    When I open 'Add Alert' form
    Then I expect proper error for incorrect value
    | FieldName         | Value                 | Error             | OtherInfo                 |
    | Alert Name        | My Alert*             | specialCharacters |                           |
    | Alert Name        | knzmonfjkbxcpbauihggmgerzwmdojzulwfiqnypdrlusuttjcoacatfacvff | length         |                           |
    | Alert Name        |                       | empty             |                           |
    | Alert Name        | __POSSIBLE_ERROR_CASES|                   |                           |
    | Label Key         | MyAlert*              | commonError       |                           |
    | Label Key         | _MyAlert              | commonError       |                           |
    | Label Key         | MyAlert.              | commonError       |                           |
    | Label Key         | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |                           |
    | Label Key         | __POSSIBLE_ERROR_CASES|                   |                           |
    | Label Value       | abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca | commonError         |                           |
    | Label Value       | _one                  | commonError       |                           |
    | Label Value       | one-                  | commonError       |                           |
    | Label Value       | one.                  | commonError       |                           |
    | Label Value       | __POSSIBLE_ERROR_CASES|                   |                           |
    | For Minutes       | 1.1                   | invalid           | AlertName:MyAlert         |
    | For Minutes       | 1-                    | invalid           | AlertName:MyAlert         |
    | For Minutes       | 1_                    | invalid           | AlertName:MyAlert         |
    | For Minutes       | abc                   | invalid           | AlertName:MyAlert         |
    | For Minutes       | 1a                    | invalid           | AlertName:MyAlert         |
    | For Hours         | 1.1                   | invalid           | AlertName:MyAlert         |
    | For Hours         | 1-                    | invalid           | AlertName:MyAlert         |
    | For Hours         | 1_                    | invalid           | AlertName:MyAlert         |
    | For Hours         | abc                   | invalid           | AlertName:MyAlert         |
    | For Hours         | 1a                    | invalid           | AlertName:MyAlert         |
    | For Days          | 1.1                   | invalid           | AlertName:MyAlert         |
    | For Days          | 1-                    | invalid           | AlertName:MyAlert         |
    | For Days          | 1_                    | invalid           | AlertName:MyAlert         |
    | For Days          | abc                   | invalid           | AlertName:MyAlert         |
    | For Days          | 1a                    | invalid           | AlertName:MyAlert         |
