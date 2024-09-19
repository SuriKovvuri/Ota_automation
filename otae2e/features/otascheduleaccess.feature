Feature: Validate the schedule access

@SAA @Regression @SA1
Scenario: Enable the schedule access
    Given Admin logged in
    When I Enable schedule access
     | userid          | scheduleaccess| Repeat | startday | endday | timezone            | Time   | deleteuserafterexpiry | usernotification|
     | saccesstesting  | enable        | Daily  | Today    | Today  | Asia/Kolkata        | Custom | No                    |  notify now     |
    When I check schedule access enable in UI
     | userid          |
     | saccesstesting  |
    When I search with userid user get enabled state
     | userid          |
     | saccesstesting  |
    And Verify the schedule access config is applied as configured 
     | userid         | timezone      | Repeat  |
     | saccesstesting | Asia/Kolkata  | Daily   |
    And I Logout Admin user and Login schedule access user
     | userid         | password    | 
     | saccesstesting | Kovvuri@21  |
    Then Verify the http device access
     | type  |
     | http  |
    And I Disable the schedule access
     | userid         | scheduleaccess |
     | saccesstesting | Disable        |


@SAA @Regression @SA2
Scenario: Enable the schedule access weeklyOnce
    Given Admin logged in
    When I Enable schedule access
     | userid          | scheduleaccess| Repeat     | startday        | endday       | timezone      | Time   | deleteuserafterexpiry | usernotification|
     | tscheduleaccess | enable        | Weeklyonce | currentadate    | 2 weeks      | Asia/Kolkata  | Custom | No                    |  notify now     |
    When I check weekly once schedule access enable in UI
     | userid         |
     | tscheduleaccess|
    When I search weekly once schedule access with userid user get enabled state
     | userid         |
     | tscheduleaccess| 
     And Verify the weeklyonce schedule access config is applied as configured 
     | userid          | timezone      | Repeat     |
     | tscheduleaccess | Asia/Kolkata  | Weeklyonce |
    And I Logout Admin user and Login with weeklyonce schedule access user
     | userid         | password    | 
     | tscheduleaccess| Kovvuri@21  |
   Then Verify the http device access in weeklyonce schedule acess user
     | type  |
     | http  |
   And I Disable the schedule access
     | userid          | scheduleaccess |
     | tscheduleaccess | Disable        |


@SAA @Regression @SA3
Scenario: Enable the schedule access Weeklytwice
    Given Admin logged in
    When I Enable schedule access
     | userid          | scheduleaccess| Repeat      | startday        | endday       | timezone      | Time   | deleteuserafterexpiry | usernotification|
     | sweekly         | enable        | Weeklytwice | currentadate    | 2 weeks      | Asia/Kolkata  | Custom | No                    |  notify now     |
    When I check weekly twice schedule access enable in UI
     | userid         |
     | sweekly        |
    When I search weekly twice schedule access with userid user get enabled state
     | userid         |
     | sweekly        | 
     And Verify the weeklytwice schedule access config is applied as configured 
     | userid      | timezone      | Repeat      |
     | sweekly     | Asia/Kolkata  | Weeklytwice |
    And I Logout Admin user and Login with weeklytwice schedule access user
     | userid         | password    | 
     | sweekly        | Kovvuri@21  |
    Then Verify the http device access in weeklytwice schedule acess user
     | type  |
     | http  |
    And I Disable the schedule access
     | userid    | scheduleaccess |
     | sweekly   | Disable        |



@SAA @Regression @SA4
Scenario: Enable the schedule access WeeklyAllDays
    Given Admin logged in
    When I Enable schedule access
     | userid      | scheduleaccess| Repeat        | startday        | endday       | timezone      | Time   | deleteuserafterexpiry | usernotification|
     | daceesstest | enable        | WeeklyAllDays | currentadate    | 2 weeks      | Asia/Kolkata  | Custom | No                    |  notify now     |
    When I check weekly all days schedule access enable in UI
     | userid      |
     | daceesstest |
    When I search weekly all days schedule access with userid user get enabled state
     | userid      |
     | daceesstest | 
     And Verify the weeklyalldays schedule access config is applied as configured 
     | userid      | timezone      | Repeat        |
     | daceesstest | Asia/Kolkata  | WeeklyAllDays |
    And I Logout Admin user and Login with weeklyalldays schedule access user
     | userid      | password    | 
     | daceesstest | Kovvuri@21  |
    Then Verify the http device access in weeklyalldays schedule acess user
     | type  |
     | http  |
    And I Disable the schedule access
     | userid       | scheduleaccess |
     | daceesstest  | Disable        |

@SAA @Regression @SA5
Scenario: Enable the schedule access MonthlyOnce
    Given Admin logged in
    When I Enable schedule access
     | userid         | scheduleaccess| Repeat      | startday        | endday       | timezone      | Time   | deleteuserafterexpiry | usernotification|
     | smonthlyonce   | enable        | Monthlyonce | currentadate    | 2 month      | Asia/Kolkata  | Custom | No                    |  notify now     |
    When I check Monthly once schedule access enable in UI
     | userid         |
     | smonthlyonce   |
    When I search Monthly once schedule access with userid user get enabled state
     | userid         |
     | smonthlyonce   | 
    And Verify the Monthlyonce schedule access config is applied as configured 
     | userid         | timezone      | Repeat      |
     | smonthlyonce   | Asia/Kolkata  | Monthlyonce |
    And I Logout Admin user and Login with Monthlyonce schedule access user
     | userid         | password    | 
     | smonthlyonce   | Kovvuri@21  |
    Then Verify the http device access in Monthlyonce schedule acess user
     | type  |
     | http  |
    And I Disable the schedule access
     | userid        | scheduleaccess |
     | smonthlyonce  | Disable        |


#Asia/Kolkata
#America/Chicago

@SAA @Regression @SA6
Scenario: Enable the schedule access on the week and day
    Given Admin logged in
    When I Enable schedule access
     | userid            | scheduleaccess| Repeat            | startday        | endday       | timezone      | Time   | deleteuserafterexpiry | usernotification|
     | sconthedayofweek  | enable        | MonthlyOnWeekDay  | currentadate    | 1 month      | Asia/Kolkata  | Custom | No                    |  notify now     |
    When I check Monthly On Week Day schedule access enable in UI
     | userid            |
     | sconthedayofweek  |
    When I search Monthly On Week Day schedule access with userid user get enabled state
     | userid            |
     | sconthedayofweek  |
    And Verify the Monthly MonthlyOnWeekDay schedule access config is applied as configured
     | userid            | timezone     | Repeat           |
     | sconthedayofweek  | Asia/Kolkata | MonthlyOnWeekDay |
    And I Logout Admin user and Login with Monthly OnWeekDay schedule access user
     | userid            | password    | 
     | sconthedayofweek  | Kovvuri@21  |
    Then Verify the http device access in Monthly OnWeekDay schedule acess user
     | type  |
     | http  |
    And I Disable the schedule access
     | userid           | scheduleaccess |
     | sconthedayofweek | Disable        |