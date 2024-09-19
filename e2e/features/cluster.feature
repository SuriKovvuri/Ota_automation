Feature: Cluster

@Cluster
Scenario: Add a TAN Network in cluster
    Given Cluster exists "cluster_e2e"
    When Add A TAN Network in the cluster
    | NetworkName | Label | Nw_Addressing | CIDR          | Start_IP     | end_IP       | GW              | VLAN     | VLAN_ID | Default_Destination | Service_Addressing|
    | clustertan1 |  a:a  | Dynamic       |               |              |              | 17.1.1.1/24     | Disabled |         |                     |                   |
    Then Network should be Added "clustertan1"

@Cluster
Scenario: Add Services in cluster
    Given Cluster exists "cluster_e2e"
    When I add service
    | ServiceName    | AppName             | NetworkName | ServiceFields   |
    |   DB           | PostgreSQLDevelop   | tan         |   postgresql    |
    |   Dhcp         | KeaDevelop          | tan         |     dhcp        |
    |   Dns          | PowerDNSDevelop     | tan         |     pdns        |
    |   Ntp          | NTPDevelop          | tan         |     ntp         |
    Then Services should be healthy "DB,Dhcp,Dns,Ntp"