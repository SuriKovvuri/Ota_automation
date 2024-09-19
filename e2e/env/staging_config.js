module.exports = {
  orchIP : "qa.staging.secureedge.view.com",
  orchURL : 'https://qa.staging.secureedge.view.com',
  iotiumAdmin : "admin@iotium.io",
  iotiumAdminPassword : "st@GinG1729172999",
  orgName : "Regr_Production_Nodes",
  orgAdmin : "raja.baskaran+stagingsmoke@iotium.io",
  orgAdminPassword : "Welcome@1234555",
  navOrgAdmin : "raja.baskaran+nav@iotium.io",
  navOrgAdminPassword : "f@bIoT17291729999",
  orgReadonly : "raja.baskaran+read@iotium.io",
  orgReadonlyPassword : "Welcome@1234567",
  org1:' ',
  hsn1:'PFYR-9L3F',
  node1:'edge_4',
  node1_tan1: 'tan1',
  node1_service1: 'service1',
  vnode1:'vvirtual_1',
  apiKey:'jFMTFhlmhJwOkrcg29ejaV0RJkv9A925mGzfFRu2',
  OSprefix : "staginge2e-",
  dashboard : { 
    //bhgvhgvhgvgh
    //Has values of the numberCards in dashboard
    numberCard : {
      orgsValue : 1,
      clustersValue : 1,
      inodesValue : 15,
      serialNumbersValue : 29,
      networksValue : 27,
      customSecurityPolicyValue : 3,
      servicesValue : 0,
      serviceSecretsValue : 17,
      usersValue : 15,
      rolesValue : 2
    }
  },
  navigation : {
    edge1 : { 
      Name : 'supermicro', 
      Profile : 'Edge',
      'Public IP' : '',
      'Private IP' : '',
      'Health / Status' : 'ALIVE',
      Label : 'owner : e2e',
      'Serial Number' : 'TWE4-LD3F',
      'Version' : '',
      'Uptime' : '',
      'Last SSH Login' : '',
      'Last Console Login' : 'N/A',
      'CPU (Architecture)' : 'x86 64-bit',
      'CPU (Cores)' : '4',
      'CPU (Frequency)' : '1.80 GHz',
      'Memory' : '8.17 GB',
      'Vendor' : 'Supermicro/SYS-E50-9AP',
      'BIOS Serial Number' : 'A311286X9C09760',
      'Time Servers' : ' 192.170.0.152'
    },
    edge1_networks : [{
      Name : 'tan2',
      Label : '-',
      'Network CIDR' : '121.12.1.0/24',
      'Remote Networks' : 'e2evirtual1/default',
      'VLAN ID' : '113',
      'Internal Reserved IP Address Range': '121.12.1.100–121.12.1.110',
      'iNode IP Address': '121.12.1.1/24',
      //'Default Gateway': '121.12.1.1',    
      'innerTable' : [{
        'Remote Network' : 'e2evirtual1  /  default',
        'Represent Remote Network Locally as' : '',
        'Connection Status': 'CONNECTED'
      }]
    },
    {
      Name : 'tan',
      Label : '-',
      'Network CIDR' : '12.2.2.0/24',
      'Remote Networks' : '2 Networks',
      'VLAN ID' : '-',
      'Internal Reserved IP Address Range': '12.2.2.100–12.2.2.110',
      'iNode IP Address': '12.2.2.1/24',
      //'Default Gateway': '12.2.2.1',    
      'innerTable' : [{
        'Remote Network' : 'azurretool2103  /  default',
        'Represent Remote Network Locally as' : '',
        'Connection Status': 'NOT AVAILABLE'
       },
       {
        'Remote Network' : 'e2evirtual1  /  default',
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
      total : 39,
      CONNECTED : 20,
      'NOT AVAILABLE' : 19
    },
    service :{
      total : 26,
      HEALTHY : 26,
      UNHEALTHY : 0,
      TERMINATED : 0,
      UNKNOWN : 0
    }
  }
},
jumphost: {
  host: "istio-bastion.staging.iotium.io",
  username: "ubuntu",
  pem: "orch_stag_bastion.pem",
  dbScriptPath: "/home/ubuntu/db_query.py"
},
db: {
  host_and_port: "mongo0.stag-istio.iotium.io:27017,mongo1.stag-istio.iotium.io:27017,mongo2.stag-istio.iotium.io:27017",
  username: "admin",
  password: "secret",
  db_name: "iotium"
}
}
