Feature: Validate The Building Overview Page

    @BAT @AllBuildingSensor @BuildOverView1  
    Scenario Outline: Navigate to Building and validate <Building> overview page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Occupancy Online Sensor and Offline Sensor
    And Verify Environment Active device and Inactive device
    And Verify the user count Building Manager and Tenant Admin
    And Verify Building Address
    And validate Environment status Thermal and Air and Light and Sound 
    And Verify Floor details with Zone and devices 
    
  Examples:
    | Building                                    |
    | "100 Crossways Park North"                  |   
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "1330 Avenue of Americas"                   |   
    | "195net-Butlr"                              |   
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
    | "601 W 26th St - Starret-Lehigh Building"   |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |      
    |"88 Froehlich Farm Blvd "                    |


 @BAT @AllBuildingSensor @BuildEnvironment2 
 Scenario Outline: Navigate to Building and validate <Building> Environment page
 Given I am logged as a Building Manager
 When I select <Building> 
 Then Verify Building Overview Page Last updated time difference from current time shouldnt be more that 15 mins
 And Verify The Environment status
 
   Examples:
    | Building                                    |
    | "100 Crossways Park North"                  |   
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "1330 Avenue of Americas"                   |   
    | "195net-Butlr"                              |   
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
    | "601 W 26th St - Starret-Lehigh Building"   |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |      
    |"88 Froehlich Farm Blvd "                    |



@BAT @AllBuildingSensor @BuildOccupancy3 
Scenario Outline: Navigate to Building and validate <Building> Occupancy page
Given I am logged as a Building Manager
When I select <Building> 
Then Verify Lobby activity Last updated time
And Navigate to Occupancy Sensor page and verify Online Sensor and Offline sensor count

 Examples:
    | Building                                    |
    | "100 Crossways Park North"                  |   
    | "1000 Woodbury Rd"                          |      
    | "1285 Avenue of Americas"                   |     
    | "1330 Avenue of Americas"                   |   
    | "195net-Butlr"                              |   
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
    | "601 W 26th St - Starret-Lehigh Building"   |     
    | "61 Broadway"                               |     
    |"620 Avenue of Americas"                     |      
    |"625 Rxr Plz - RXR Plaza"                    |      
    |"68 South Service Rd"                        |      
    |"75 Rockefeller Plaza"                       |     
    |"825 8th Ave - Worldwide Plaza"              |      
    |"88 Froehlich Farm Blvd "                    |
