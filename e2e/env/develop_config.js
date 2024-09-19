module.exports = {
    orchIP : "develop.iotium.io",
    orchURL : 'https://develop.iotium.io',
    OSprefix : "sanityqae2e-",
    iotiumAdmin : "admin@iotium.io",
    iotiumAdminPassword : "f@bIoT17291729",
    orgName : "E2E",
    orgAdmin : "raja.baskaran+e2e1@iotium.io",
    orgAdminPassword : "f@bIoT17291729",
    navOrgAdmin : "raja.baskaran+nav@iotium.io",
    navOrgAdminPassword : "f@bIoT17291729",
    orgReadonly : "raja.baskaran+read@iotium.io",
    orgReadonlyPassword : "f@bIoT17291729",
    changepwd_username : "jawahar.a+changepwd@iotium.io",
    changepwd_password : "1f@bIoT172917295",
    workflowEdgeProvisioningHSN : "Y0YU-4L67",
    org1:'E2E',
    hsn1:'EJPM-RWRF',
    node1:'edge_0',
    node1_tan1: 'tan1',
    node1_service1: 'service1',
    vnode1:'virtual_0',
    OSprefix : "sanityqae2e-",
    apiKey:'OLo8I13CIei3TfEi0E3DsCT76iTDBWqF6AEaESqN',
    dashboard : { 
      //Has values of the numberCards in dashboard
      numberCard : {
        orgsValue : 1,
        clustersValue : 1,
        inodesValue : 7,
        serialNumbersValue : 0,
        networksValue : 14,
        customSecurityPolicyValue : 1,
        servicesValue : 0,
        serviceSecretsValue : 10,
        usersValue : 2,
        rolesValue : 2
      }
    },
    jumphost: {
      host: "develop.iotium.io",
      username: "ubuntu",
      pem: "rash-aws.pem",
      dbScriptPath: "/home/ubuntu/db_query.py"
    },
    db: {
      host_and_port: "localhost:27017",
      username: "admin",
      password: "secret",
      db_name: "iotium"
    },
    //Values of the node system info used in navigation testcase
    //If value is empty string '', only field will be verified and 
    //value verification will be skipped in testcase
    navigation : {
      clusters : {
        Name: 'cluster_e2e',
        cluster_e2e_networks:[
          {
            Name : 'WAN Network',
            Label : '-',
            'Network CIDR' : '-',
            'Remote Networks' : '-',
            'VLAN ID' : '-'
          }    
        ]
      },
      edge1 : { 
        Name : 'nav_edge_0', 
        Profile : 'Virtual Edge',
        'Public IP' : '',
        'Private IP' : '',
        'Health / Status' : 'ALIVE',
        Label : 'owner : e2elock : true',
        'Serial Number' : 'RK2A-0C2Q',
        'Version' : '',
        'Uptime' : '',
        'Last SSH Login' : '',
        'Last Console Login' : 'N/A',
        'CPU (Architecture)' : 'x86 64-bit',
        'CPU (Cores)' : '2',
        'CPU (Frequency)' : '2.10 GHz',
        'Memory' : '2.10 GB',
        'Vendor' : 'OpenStack Foundation/OpenStack Nova',
        'BIOS Serial Number' : '00000000-0000-0000-0000-ac1f6b75444c',
        'Time Servers' : ' 192.170.200.26'
      },
      edge1_networks : [{
        Name : 'tan2',
        Label : '-',
        'Network CIDR' : '121.12.1.0/24',
        'Remote Networks' : 'nav_virtual_0/default',
        'VLAN ID' : '112',
        'Internal Reserved IP Address Range': '121.12.1.100–121.12.1.110',
        'iNode IP Address': '121.12.1.1/24',
        //'Default Gateway': '121.12.1.1',    
        'innerTable' : [{
          'Remote Network' : 'nav_virtual_0  /  default',
          'Represent Remote Network Locally as' : '',
          'Connection Status': 'CONNECTED'
        }]
      },
      {
        Name : 'tan',
        Label : '-',
        'Network CIDR' : '12.2.2.0/24',
        'Remote Networks' : 'nav_virtual_0/default',
        'VLAN ID' : '-',
        'Internal Reserved IP Address Range': '12.2.2.100–12.2.2.110',
        'iNode IP Address': '12.2.2.1/24',
        //'Default Gateway': '12.2.2.1',    
        'innerTable' : [
         {
          'Remote Network' : 'nav_virtual_0  /  default',
          'Represent Remote Network Locally as' : '22.1.0.0/16',
          'Connection Status': 'CONNECTED'
         },
        ]
      },
      {
        Name : 'WAN Network',
        Label : '-',
        'Network CIDR' : '-',
        'Remote Networks' : '-',
        'VLAN ID' : '-'
      }
    ],
    edge1_services: [ { 
      Name: 'twx',
      Status: 'HEALTHY',
      Network: 'tan',
      'IP Address': '12.2.2.100/24',
      'Running Containers': '1/1',
      Hostname: 'twx',
      innerTable: [ 
        { 'Container Name': 'twx0',
          'Container Status': 'RUNNING',
          Image: 'docker.io/dtyagi/twedge' 
        } ] 
    } ],
    count : {
      network : {
        total : 21
      },
      tunnel : {
        total : 20,
        CONNECTED : 20,
        'NOT AVAILABLE' : 0
      },
      service :{
        total : 26,
        HEALTHY : 26,
        UNHEALTHY : 0,
        TERMINATED : 0,
        UNKNOWN : 0
      }
    }
  }   
  }
