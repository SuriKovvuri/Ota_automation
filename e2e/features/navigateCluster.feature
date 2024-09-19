Feature: Navigate Cluster

@ClusterNavigation
Scenario: Navigate to Clusters page
    When I navigate to Clusters page
    Then All required web elements must be present

@ClusterNavigation
Scenario Outline: Navigate to Clusters as a(n) <Role> User
    When I navigate to cluster page
    Then All required web elements must be present depending on role <Role>

    Examples:
    | Role            |
    | "orgAdmin"      |

@ClusterNavigation
Scenario: Navigate Cluster inodes tab
    When I navigate to inodes tab of cluster
    Then All inodes must be present

@ClusterNavigation
Scenario: Navigate Cluster networks tab
    When I navigate to networks tab of cluster
    Then All networks must be present
