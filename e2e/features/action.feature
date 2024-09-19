Feature: Perform actions from orchestrator  

@RebootInode @Action
Scenario: Reboot inode
    Given I am logged in
    When I reboot the inode
    Then iNode must be rebooted

@RebootEvents @Action
Scenario: Verify events for iNode reboot
    Given I am logged in
    When I navigate to Events page
    And I reboot the iNode
    Then iNode must be rebooted
    And iNode reboot related events must be present in Events page