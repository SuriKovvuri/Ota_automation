Feature: Well IQ Reporting Validation

@Regression @AllWellReports @Report1
Scenario Outline: Validate report generation for one sensor
Given I am logged as a Building Manager
When I select <Building> 
When I naviagte to well qa reporting page
When I select <Building>
Then check report generation is proper

Examples:                                           
  | Building                                    |    
  | "1285 Avenue of Americas"                   | 



@Regression @AllWellReports @Report2
Scenario Outline: Validate report generation for 20 sensors
Given I am logged as a Building Manager
When I select <Building>
When I naviagte to well qa reporting page
When I select <Building>
Then check report generation is proper
Examples:
  | Building                                    |
  | "32 Old Slip"                               |  


@Regression @AllWellReports @Report3
Scenario Outline: Sensor selection limited to 20
Given I am logged as a Building Manager
When I naviagte to well qa reporting page
When I select <Building>
Then Verify that 21st sesnor selection is disabled
Examples:
  | Building                                    |
  | "1285 Avenue of Americas"                   | 




@Regression @AllWellReports @Report4
Scenario Outline: Delete a generated report
Given I am logged as a Building Manager
When I select <Building>
When I naviagte to well qa reporting page
When I select <Building>
Then check report generation is proper
And Delete a generated report
Examples:                                           
  | Building                                    |    
  | "1285 Avenue of Americas"                   |     


@Regression @AllWellReports @Report5
Scenario Outline: Validate Report Generation for the Time Period 2021-2022
Given I am logged as a Building Manager
When I select <Building> 
When I naviagte to well qa reporting page
When I select <Building>
Then check report generation is proper

Examples:                                           
  | Building                                    |    
  | "1285 Avenue of Americas"                   | 

