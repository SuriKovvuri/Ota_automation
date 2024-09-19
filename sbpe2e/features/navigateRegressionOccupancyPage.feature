Feature: Validate The Building Occupancy Page

 @Regression @OccupancyPage @OccupancyPage1
    Scenario Outline: Navigate the <Building> and Verify The Occupancy Today Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Today Occupancy Page last Update Time
    And Verify The Building Occupancy Title in Occupancy Today Page
    And Verify The Real Time Occupancy percentage in Occupancy Today Page
    And Verify The Average occupancy over last 90 days in Occupancy Today Page
    And Verify Peak occupancy over last 90 days in Occupancy Today Page
    And Verify The Total People Count in Occupancy Today Page
    And Verify Lobby Foot Traffic Tiltle
    And Verify The Lobby Foot Traffic Last upadte Time in Occupancy Today Page
    And verify Real-time foot traffic is non zero in Occupancy Today Page
    And verify the Average foot traffic over last 90 days in Occupancy Today Page
    And verify The Building Occupancy Details Title in Occupancy Today Page
    And verify The Building Occupancy Details Last upadte Time in Occupancy Today Page
    And Verify All Building Entrance Are non zero in Occupancy Today Page
    
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
   

    @Regression @OccupancyPage @OccupancyPage2
    Scenario Outline: Navigate the <Building> and Verify The Occupancy Yesterday Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Yesterday Occupancy Page last Update Time
    And Verify The Building Occupancy Title in Occupancy Yesterday Page
    And Verify The Real Time Occupancy percentage in Occupancy Yesterday Page
    And Verify The Average occupancy over last 90 days in Occupancy Yesterday Page
    And Verify Peak occupancy over last 90 days in Occupancy Yesterday Page
    And Verify The Total People Count in Occupancy Yesterday Page
    And Verify Lobby Foot Traffic Tiltle
    And Verify The Lobby Foot Traffic Last upadte Time in Occupancy Yesterday Page
    And verify Real-time foot traffic is non zero in Occupancy Yesterday Page
    And verify the Average foot traffic over last 90 days in Occupancy Yesterday Page
    And verify The Building Occupancy Details Title in Occupancy Yesterday Page
    And verify The Building Occupancy Details Last upadte Time in Occupancy Yesterday Page
    And Verify All Building Entrance Are non zero in Occupancy Yesterday Page
    
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
   
   
 @Regression @OccupancyPage @OccupancyPage3
    Scenario Outline: Navigate the <Building> and Verify The Occupancy Last 7 days Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Last 7 days Occupancy Page last Update Time
    And Verify The Building Occupancy Title in Occupancy Last 7 days Page
    And Verify The Real Time Occupancy percentage in Occupancy Last 7 days Page
    And Verify The Average occupancy over last 90 days in Occupancy Last 7 days Page
    And Verify Peak occupancy over last 90 days in Occupancy Last 7 days Page
    And Verify The Total People Count in Occupancy Last 7 days Page
    And Verify Lobby Foot Traffic Tiltle
    And Verify The Lobby Foot Traffic Last upadte Time in Occupancy Last 7 days Page
    And verify Real-time foot traffic is non zero in Occupancy Last 7 days Page
    And verify the Average foot traffic over last 90 days in Occupancy Last 7 days Page
    And verify The Building Occupancy Details Title in Occupancy Last 7 days Page
    And verify The Building Occupancy Details Last upadte Time in Occupancy Last 7 days Page
    And Verify All Building Entrance Are non zero in Occupancy Last 7 days Page
    
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
   
    @Regression @OccupancyPage @OccupancyPage4
    Scenario Outline: Navigate the <Building> and Verify The Occupancy Last 30 days Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Last 30 days Occupancy Page last Update Time
    And Verify The Building Occupancy Title in Occupancy Last 30 days Page
    And Verify The Real Time Occupancy percentage in Occupancy Last 30 days Page
    And Verify The Average occupancy over last 90 days in Occupancy Last 30 days Page
    And Verify Peak occupancy over last 90 days in Occupancy Last 30 days Page
    And Verify The Total People Count in Occupancy Last 30 days Page
    And Verify Lobby Foot Traffic Tiltle
    And Verify The Lobby Foot Traffic Last upadte Time in Occupancy Last 30 days Page
    And verify Real-time foot traffic is non zero in Occupancy Last 30 days Page
    And verify the Average foot traffic over last 90 days in Occupancy Last 30 days Page
    And verify The Building Occupancy Details Title in Occupancy Last 30 days Page
    And verify The Building Occupancy Details Last upadte Time in Occupancy Last 30 days Page
    And Verify All Building Entrance Are non zero in Occupancy Last 30 days Page
    
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

   @Regression @OccupancyPage @OccupancyPage5
    Scenario Outline: Navigate the <Building> and Verify The Last 7 Days in Occupancy Usage Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Last 7 Days Building Access Text in Occupancy Usage Page
    And Verify Last 7 Days Access Summary Text in Occupancy Usage Page
    And Verify The Last 7 Days Access Summary Last Upadte Time in Occupancy Usage Page
    And Verify Total Swips are non zero in Occupancy Usage Page
    And Verify Total Unique Users Count are non zero in Occupancy Usage Page
    And Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page
    And Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page
    And Verify The Total Building Visit Frequency Text
    And Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page
    And Verify The Tenant Usage Intensity Text in Occupancy Usage Page
    And Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page
    And Verify The Usage Intensity are non Zero in Average number of users per tenant area

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

   @Regression @OccupancyPage @OccupancyPage6
    Scenario Outline: Navigate the <Building> and Verify The Last 14 Days in Occupancy Usage Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Last 14 Days Building Access Text in Occupancy Usage Page
    And Verify Last 14 Days Access Summary Text in Occupancy Usage Page
    And Verify The Last 14 Days Access Summary Last Upadte Time in Occupancy Usage Page
    And Verify Total Swips are non zero in Occupancy Usage Page
    And Verify Total Unique Users Count are non zero in Occupancy Usage Page
    And Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page
    And Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page
    And Verify The Total Building Visit Frequency Text
    And Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page
    And Verify The Tenant Usage Intensity Text in Occupancy Usage Page
    And Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page
    And Verify The Usage Intensity are non Zero in Average number of users per tenant area

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
  

    @Regression @OccupancyPage @OccupancyPage7
    Scenario Outline: Navigate the <Building> and Verify The Last 30 Days in Occupancy Usage Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Last 30 Days Building Access Text in Occupancy Usage Page
    And Verify Last 30 Days Access Summary Text in Occupancy Usage Page
    And Verify The Last 30 Days Access Summary Last Upadte Time in Occupancy Usage Page
    And Verify Total Swips are non zero in Occupancy Usage Page
    And Verify Total Unique Users Count are non zero in Occupancy Usage Page
    And Verify The Highest Usage Intensity Score are non zero in Occupancy Usage Page
    And Verify The Lowest Usage Intensity Score zero in Occupancy Usage Page
    And Verify The Total Building Visit Frequency Text
    And Verify The Total Building Visit Frequency Last Upadte Time in Occupancy Usage Page
    And Verify The Tenant Usage Intensity Text in Occupancy Usage Page
    And Verify The Tenant Usage Intensity Last Upadte Time in Occupancy Usage Page
    And Verify The Usage Intensity are non Zero in Average number of users per tenant area

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

    @Regression @OccupancyPage @OccupancyPage8
    Scenario Outline: Navigate the <Building> and Verify The Day and Building Entrance for Today in Occupancy Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Day for Average over last 90 days in Building Occupancy
    And Verify The Day for Peak over last 90 days in Building Occupancy
    And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic
    And Verify The Building Entrance Name List on Building Occupancy Details

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


    @Regression @OccupancyPage @OccupancyPage9
    Scenario Outline: Navigate the <Building> and Verify The Day and Building Entrance for Yesterday in Occupancy Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Day for Average over last 90 days in Building Occupancy
    And Verify The Day for Peak over last 90 days in Building Occupancy
    And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic
    And Verify The Building Entrance Name List on Building Occupancy Details

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


    @Regression @OccupancyPage @OccupancyPage10
    Scenario Outline: Navigate the <Building> and Verify The Day and Building Entrance for Last 7 Days in Occupancy Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Day for Average over last 90 days in Building Occupancy
    And Verify The Day for Peak over last 90 days in Building Occupancy
    And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic
    And Verify The Building Entrance Name List on Building Occupancy Details

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


    @Regression @OccupancyPage @OccupancyPage11
    Scenario Outline: Navigate the <Building> and Verify The Day and Building Entrance for Last 30 Days in Occupancy Page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Day for Average over last 90 days in Building Occupancy
    And Verify The Day for Peak over last 90 days in Building Occupancy
    And Verify The Day for Average foot traffic over last 90 days in Lobby Foot Traffic
    And Verify The Building Entrance Name List on Building Occupancy Details

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