Feature: Validate The Building Overview Page

    @Regression @AllBuildingSensor @BuildOverView1  
    Scenario Outline: Navigate to Building and validate <Building> overview page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Occupancy Online Sensor and Offline Sensor
    And Verify Environment Active device and Inactive device
    And Verify Building Address
    And validate Environment status Thermal and Air and Light and Sound 

    Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "230 Park Ave - The Hemsley Building"       |   
    | "237 Park Ave"                              |      
    | "32 Old Slip"                               | 
    |"333 Earle Ovington Blvd - The Omni"         |
    | "340 Madison Ave"                           |   
    |"37-18 Northern Blvd - Standard Motors"      |
    | "450 Lexington Ave"                         |  
    |"470 Vanderbilt Ave"                         |
    | "48 South Service Rd"                       |    
    | "5 Times Square"                            |     
    | "50 Charles Lindbergh Blvd"                 |     
    | "530 5th Ave"                               |     
    | "58 South Service Rd"                       |     
    | "601 W 26th St - Starrett-Lehigh Building"  |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |  
    | "View Chennai"                              |
  
    
   
 @Regression @AllBuildingSensor @BuildEnvironment2 
 Scenario Outline: Navigate to Building and validate <Building> Environment page
 Given I am logged as a Building Manager
 When I select <Building> 
 Then Verify Building Overview Page Last updated time difference from current time shouldnt be more that 15 mins
 And Verify The Environment status
 
    Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "230 Park Ave - The Hemsley Building"       |   
    | "237 Park Ave"                              |      
    | "32 Old Slip"                               | 
    |"333 Earle Ovington Blvd - The Omni"         |
    | "340 Madison Ave"                           |   
    |"37-18 Northern Blvd - Standard Motors"      |
    | "450 Lexington Ave"                         |  
    |"470 Vanderbilt Ave"                         |
    | "48 South Service Rd"                       |    
    | "5 Times Square"                            |     
    | "50 Charles Lindbergh Blvd"                 |     
    | "530 5th Ave"                               |     
    | "58 South Service Rd"                       |     
    | "601 W 26th St - Starrett-Lehigh Building"  |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |  
    | "View Chennai"                              |
    

@Regression @AllBuildingSensor @BuildOccupancy3 
Scenario Outline: Navigate to Building and validate <Building> Occupancy page
Given I am logged as a Building Manager
When I select <Building> 
Then Verify Lobby activity Last updated time
And Navigate to Occupancy Sensor page and verify Online Sensor and Offline sensor count

    Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "230 Park Ave - The Hemsley Building"       |   
    | "237 Park Ave"                              |      
    | "32 Old Slip"                               | 
    |"333 Earle Ovington Blvd - The Omni"         |
    | "340 Madison Ave"                           |   
    |"37-18 Northern Blvd - Standard Motors"      |
    | "450 Lexington Ave"                         |  
    |"470 Vanderbilt Ave"                         |
    | "48 South Service Rd"                       |    
    | "5 Times Square"                            |     
    | "50 Charles Lindbergh Blvd"                 |     
    | "530 5th Ave"                               |     
    | "58 South Service Rd"                       |     
    | "601 W 26th St - Starrett-Lehigh Building"  |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |  
    | "View Chennai"                              |
  

@Regression @AllBuildingSensor @VisitFrequency4  
Scenario Outline: Navigate to Building and validate <Building> Visit Frequency in Overview Page
Given I am logged as a Building Manager
When I select <Building> 
Then Verify The Visit Frequency last Update Time
And Verify The Title <Building>
And Verify The Total Unique Users Title in visit frequency
And Verify The Total Unique Users Count
And Verify The Total Swips Title in visit frequency
And Verify The Total Swips Count
And Verify Total swipes Text into building and tenant spaces
And Verify Installed Visit Frequency Devices Title
And Verify Installed Visit Frequency Devices Count

  Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "230 Park Ave - The Hemsley Building"       |   
    | "237 Park Ave"                              |      
    | "32 Old Slip"                               | 
    |"333 Earle Ovington Blvd - The Omni"         |
    | "340 Madison Ave"                           |   
    |"37-18 Northern Blvd - Standard Motors"      |
    | "450 Lexington Ave"                         |  
    |"470 Vanderbilt Ave"                         |
    | "48 South Service Rd"                       |    
    | "5 Times Square"                            |     
    | "50 Charles Lindbergh Blvd"                 |     
    | "530 5th Ave"                               |     
    | "58 South Service Rd"                       |     
    | "601 W 26th St - Starrett-Lehigh Building"  |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |  
    | "View Chennai"                              |
  

@Regression @AllBuildingSensor @BuildingOccupancy5 
Scenario Outline: Navigate to Building and validate <Building> Occupancy in Overview Page
Given I am logged as a Building Manager
When I select <Building> 
Then Verify The Building Occupancy last Update Time
And Verify The Building Occupancy Title <Building>
And Verify The Real Time Occupancy Percentage
And Verify peak Occupancy Percentage
And Verify 90 Day Peak Unique Users
And Verify The Real Time Occupancy and 90 days Peak Occupancy in OverView page
And Verify Total Real Time Occupancy and 90 Days Peak Occupancy <Building> 

    Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "230 Park Ave - The Hemsley Building"       |   
    | "237 Park Ave"                              |      
    | "32 Old Slip"                               | 
    |"333 Earle Ovington Blvd - The Omni"         |
    | "340 Madison Ave"                           |   
    |"37-18 Northern Blvd - Standard Motors"      |
    | "450 Lexington Ave"                         |  
    |"470 Vanderbilt Ave"                         |
    | "48 South Service Rd"                       |    
    | "5 Times Square"                            |     
    | "50 Charles Lindbergh Blvd"                 |     
    | "530 5th Ave"                               |     
    | "58 South Service Rd"                       |     
    | "601 W 26th St - Starrett-Lehigh Building"  |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |  
    | "View Chennai"                              |
  
@Regression @AllBuildingSensor @BuildingOverviewPage6 
Scenario Outline: Navigate to Building and validate <Building> Environment in Overview Page
Given I am logged as a Building Manager
When I select <Building> 
And Verify The Visit Frequency see more option
And Click The Building Occupancy See More option
And Verify The Environment see more option
And Validate The last 7 Days Chart in VisitFrequency

  Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "230 Park Ave - The Hemsley Building"       |   
    | "237 Park Ave"                              |      
    | "32 Old Slip"                               | 
    |"333 Earle Ovington Blvd - The Omni"         |
    | "340 Madison Ave"                           |   
    |"37-18 Northern Blvd - Standard Motors"      |
    | "450 Lexington Ave"                         |  
    |"470 Vanderbilt Ave"                         |
    | "48 South Service Rd"                       |    
    | "5 Times Square"                            |     
    | "50 Charles Lindbergh Blvd"                 |     
    | "530 5th Ave"                               |     
    | "58 South Service Rd"                       |     
    | "601 W 26th St - Starrett-Lehigh Building"  |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |  
    | "View Chennai"                              |
  


@Regression @AllBuildingSensor @OccLastUpdated7
Scenario Outline: Navigate to Building and validate <Building> Occupancy Sensor page 
Given I am logged as a Building Manager
When I select <Building> 
Then verify Occupancy sensor last updated time

 Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "230 Park Ave - The Hemsley Building"       |   
    | "237 Park Ave"                              |      
    | "32 Old Slip"                               | 
    |"333 Earle Ovington Blvd - The Omni"         |
    | "340 Madison Ave"                           |   
    |"37-18 Northern Blvd - Standard Motors"      |
    | "450 Lexington Ave"                         |  
    |"470 Vanderbilt Ave"                         |
    | "48 South Service Rd"                       |    
    | "5 Times Square"                            |     
    | "50 Charles Lindbergh Blvd"                 |     
    | "530 5th Ave"                               |     
    | "58 South Service Rd"                       |     
    | "601 W 26th St - Starrett-Lehigh Building"  |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |  
    | "View Chennai"                              |
  