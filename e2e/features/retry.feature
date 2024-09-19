Feature: Retry

@Retry @Retry1
Scenario: Retry test
    When Retry
    Then Pass

@Retry
Scenario: Retry test2
    When Retry
    Then Pass