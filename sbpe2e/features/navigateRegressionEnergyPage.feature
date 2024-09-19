Feature: Validate The Building Energy Page

    @Regression @EnergyPage @EnergyPage1
    Scenario Outline: Navigate to Building and validate <Building> Calendar Year in Energy page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Energy Usage Title in Calendar Year page
    And Verify Calendar Year Page last Update Time 
    And Verify The Average monthly tenant usage Text in Calendar Year page
    And Verify The Energy consumption and EUI for Calendar year
    And Verify Energy Usage Intensity Text in Calendar Year page
    And Verify Highest Month_Year in Energy Usage
    And Verify Lowest Month_Year in Energy Usage
    And Verify Highest Month in Energy Use Intensity
    And Verify Lowest Month in Energy Use Intensity
    And Verify The click box in last 13 months and calender Year and Last 37 months
   
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
    
    @Regression @EnergyPage @EnergyPage2
    Scenario Outline: Navigate to Building and validate <Building> Last 13 Months in Energy page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Energy Usage Title in Last 13 Months page
    And Verify Last 13 Months page last Update Time
    And Verify The Average monthly tenant usage Text in Last 13 Months page
    And Verify The Energy consumption and EUI for Last 13 Months page
    And Verify Energy Usage Intensity Text in Last 13 Months page
    And Verify Highest Month_Year in Energy Usage
    And Verify Lowest Month_Year in Energy Usage
    And Verify Highest Month in Energy Use Intensity
    And Verify Lowest Month in Energy Use Intensity
   
    Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |   
    | "1285 Avenue of Americas"                   |        
    | "237 Park Ave"                              |    
    | "230 Park Ave - The Hemsley Building"       |     
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

    @Regression @EnergyPage @EnergyPage3
    Scenario Outline: Navigate to Building and validate <Building> Last 37 Months in Energy page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Energy Usage Title in Last 37 Months page
    And Verify Last 37 Months page last Update Time
    And Verify The Average monthly tenant usage Text in Last 37 Months page
    And Verify The Energy consumption and EUI for Last 37 Months page
    And Verify Energy Usage Intensity Text in Last 37 Months page
    And Verify Highest Month_Year in Energy Usage
    And Verify Lowest Month_Year in Energy Usage
    And Verify Highest Month in Energy Use Intensity
    And Verify Lowest Month in Energy Use Intensity
   
    Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |  
    | "1285 Avenue of Americas"                   |         
    | "237 Park Ave"                              |    
    | "230 Park Ave - The Hemsley Building"       |     
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


    @Regression @EnergyPage @EnergyPage4
    Scenario Outline: Navigate to Building and validate <Building> Calendar Year to Verify The Tenant details in Energy page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Tenant Usage Count
    And Verify The Tenant Name List
    And Verify The Usage By Building Page is Disaplayed
    And Validate The x-axis of the graph in Energy Usage
    And Validate The x-axis of the graph in Energy Usage Intensity

 Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |  
    | "1285 Avenue of Americas"                   |         
    | "237 Park Ave"                              |    
    | "230 Park Ave - The Hemsley Building"       |     
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


    @Regression @EnergyPage @EnergyPage5
    Scenario Outline: Navigate to Building and validate <Building> Last 13 months to Verify The Tenant details in Energy page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Tenant Usage Count
    And Verify The Tenant Name List
    And Verify The Usage By Building Page is Disaplayed
    And Validate The x-axis of the graph in Energy Usage
    And Validate The x-axis of the graph in Energy Usage Intensity

Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |  
    | "1285 Avenue of Americas"                   |         
    | "237 Park Ave"                              |    
    | "230 Park Ave - The Hemsley Building"       |     
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


    @Regression @EnergyPage @EnergyPage6
    Scenario Outline: Navigate to Building and validate <Building> Last 37 months to Verify The Tenant details in Energy page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify The Tenant Usage Count
    And Verify The Tenant Name List
    And Verify The Usage By Building Page is Disaplayed
    And Validate The x-axis of the graph in Energy Usage
    And Validate The x-axis of the graph in Energy Usage Intensity
   
 Examples:
    | Building                                    |
    | "1000 Woodbury Rd"                          |  
    | "1285 Avenue of Americas"                   |         
    | "237 Park Ave"                              |    
    | "230 Park Ave - The Hemsley Building"       |     
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