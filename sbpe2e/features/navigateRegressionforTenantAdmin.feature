Feature: Validate The All Pages for Tenant Admin Users
    @Regression @TenantAmin @user1
    Scenario Outline: Navigate the <Building> and Verify The Overviewpage 
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify The Visit Frequency last Update Time
    And Verify Building Name and Building Address <TenantName>
    And validate Environment status Thermal and Air and Light and Sound
    And Verify The Environment see more option
    And Verify The Energy see more option
    And Click The Building Occupancy See More option
    
     
    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  
                    
    @Regression @TenantAmin @user2
    Scenario Outline: Navigate the <Building> and Validate the Visit Frequency in overview page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify The Title <TenantName>
    And Verify The Total Unique Users Title in visit frequency
    And Verify The Total Unique Users Count
    And verify the peak day in 90 days
    And Validate The last 7 Days Chart
    And Verify 90 Day Peak Unique Users Count
    And Verify The Visit Frequency see more option

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user3
    Scenario Outline: Navigate the <Building> and Verify The Energy in OverView Page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify The Title <TenantName>
    And Verify The OverView Page last Update Time in Energy
    And Verify The Average Monthly Usage Title on Energy
    And Verify The Average Monthly Usage consumption
    And Verify The Average Monthly EUI Text
    And Verify The Average Monthly EUI Data
    And Verify Month and Year in Average consumption
    And Verify Month and Year in Average EUI
    
    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user4
    Scenario Outline: Navigate the <Building> and Verify The Environment Page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify The Environment status <TenantName>
    And Verify The Environment Page last Update Time
    And Verify The Weather reports 
    And Verify Local Weather Forecast Today and Tomorrow and Day After Tomorrow

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user5
    Scenario Outline: Navigate the <Building> and Verify The Energy Page Last 13 Months
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify The High and Low Energy Using Tenant <TenantName>
    And Verify Last 13 Months Page last Update Time
    And Verify The Average monthly tenant usage Text
    And Verify The Energy consumption and EUI for Last 13 months
    And Verify Energy Usage Intensity Text
    And Verify The click box in last 13 months and calender Year and Last 37 months
    And Verify Highest Month_Year in Energy Usage
    And Verify Lowest Month_Year in Energy Usage
    And Verify Highest Month in Energy Use Intensity
    And Verify Lowest Month in Energy Use Intensity

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user6
    Scenario Outline: Navigate the <Building> and Verify The Energy Page Calendar Year 
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify The High and Low Energy Using Tenant <TenantName>
    And Verify Calendar Year Page last Update Time
    And Verify The Average monthly tenant usage Text
    And Verify The Energy consumption and EUI for Calendar year
    And Verify Energy Usage Intensity Text
    And Verify Highest Month_Year in Energy Usage
    And Verify Lowest Month_Year in Energy Usage
    And Verify Highest Month in Energy Use Intensity
    And Verify Lowest Month in Energy Use Intensity

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user7
    Scenario Outline: Navigate the <Building> and Verify The Energy Page Last 37 Months
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify The High and Low Energy Using Tenant <TenantName>
    And Verify The Last 37 Months last Update Time
    And Verify The Average monthly tenant usage Text
    And Verify The Energy consumption and EUI for Last 37 Months
    And Verify Energy Usage Intensity Text
    And Verify Highest Month_Year in Energy Usage
    And Verify Lowest Month_Year in Energy Usage
    And Verify Highest Month in Energy Use Intensity
    And Verify Lowest Month in Energy Use Intensity

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

   @Regression @TenantAmin @user8
    Scenario Outline: Navigate the <Building> and Verify The Occupancy Today Page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify Today Occupancy Page last Update Time
    And Verify The Real Time Occupancy percentage for Today
    And Verify The Average occupancy over last 90 days
    And Verify Peak occupancy over last 90 days
    And Verify The Total People Count <TenantName>
    And Verify Lobby Active label
    And Verify The Building Occupancy Details label
    And Verify The building Occupancy last Update Time
    And Verify The Building Entrance Details

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user9
    Scenario Outline: Navigate the <Building> and Verify The Occupancy Yesterday Page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify Yesterday Occupancy Page last Update Time
    And Verify The Real Time Occupancy percentage
    And Verify The Average occupancy over last 90 days
    And Verify Peak occupancy over last 90 days
    And Verify The Total People Count <TenantName>
    And Verify Lobby Active label
    And Verify The Building Occupancy Details label
    And Verify The building Occupancy last Update Time
    And Verify The Building Entrance Details

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  
                
    @Regression @TenantAmin @user10
    Scenario Outline: Navigate the <Building> and Verify The Occupancy Last 7 days Page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify Occupancy Page last Update Time
    And Verify The Real Time Occupancy percentage
    And Verify The Average occupancy over last 90 days
    And Verify Peak occupancy over last 90 days
    And Verify The Total People Count <TenantName>
    And Verify Lobby Active label
    And Verify The Building Occupancy Details label
    And Verify The building Occupancy last Update Time
    And Verify The Building Entrance Details

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user11
    Scenario Outline: Navigate the <Building> and Verify The Occupancy Last 30 days Page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify Occupancy Page last Update Time
    And Verify The Real Time Occupancy percentage
    And Verify The Average occupancy over last 90 days
    And Verify Peak occupancy over last 90 days
    And Verify The Total People Count <TenantName>
    And Verify Lobby Active label
    And Verify The Building Occupancy Details label
    And Verify The building Occupancy last Update Time
    And Verify The Entrance
    And Verify The Building Entrance Details

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user12
    Scenario Outline: Navigate the <Building> and Verify The Last 7 Days Occupancy Usage Page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify Last 7 Days OccupancyUsage Page
    And Verify The Visit Frequency Text <TenantName>
    And Verify The Usage Page Last Upadte Time 
    And Verify The Aggregate user swipes Text in Usage Page
    And Verify The Peak unique daily users Text in Usage Page

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user13
    Scenario Outline: Navigate the <Building> and Verify The Last 14 Days Occupancy Usage Page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify Last 14 Days OccupancyUsage Page
    And Verify The Visit Frequency Text <TenantName>
    And Verify The Usage Page Last Upadte Time 
    And Verify The Aggregate user swipes Text in Usage Page
    And Verify The Peak unique daily users Text in Usage Page

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user14
    Scenario Outline: Navigate the <Building> and Verify The Last 30 Days Occupancy Usage Page
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify Last 30 Days OccupancyUsage Page
    And Verify The Visit Frequency Text <TenantName>
    And Verify The Usage Page Last Upadte Time 
    And Verify The Aggregate user swipes Text in Usage Page
    And Verify The Peak unique daily users Text in Usage Page

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  

    @Regression @TenantAmin @user15
    Scenario Outline: Navigate the <Building> and Verify The Building Occupancy in Overviewpage
    Given I am logged as a Tenant Admin
    When I select <Building> 
    Then Verify The OverView Page last Update Time
    And Verify The Real Time Occupancy and 90 days Peak Occupancy in OverView page
    And Verify Total Real Time Occupancy and 90 Days Peak Occupancy <TenantName> 
    And Verify The Installed Occupancy Online and Offline Count
   

    Examples:
         | Building                   |    TenantName                  |          
         | "75 Rockefeller Plaza"     |    "Adverity Inc"              |  


    @Regression @TenantAmin @user16
    Scenario Outline: Navigate the Building and Verify User Page
    Given I am logged as a Building Manager
    When I select <Building>
    Then Create The New User in User Page
    And Enter The Name <FirstName>and<LastName>
    And Enter The Information <Email>and<PhoneNumber>
    And Enter The Passwords <Password1>and<Password2>
    And Select Add New User
    And Select The Company and Building 
    And Verify The New add User details <Email>


     Examples:
     | Building             |FirstName|LastName  |Email                     | PhoneNumber|Password1 |Password2 |
     |"75 Rockefeller Plaza"|"75Rock" |"Building"|"75rocknewuser1@gmail.com"|"1234567890"|"rock@123"|"rock@123"|     

    @Regression @TenantAmin @user17
    Scenario Outline: Navigate the Building and Verify The Edit User
    Given I am logged as a Building Manager
    When I select <Building>
    Then Click The Edit User <Email>
    And Edit The Name <EditFirstName>and<EditLastName>
    And Edit The User Contact Number <EditNumber>
    And Change The Building  and Company Name
    And Delete The New User <Email>

     Examples:
      | Building             |Email                     |EditFirstName |EditLastName|EditNumber  |
      |"75 Rockefeller Plaza"|"75rocknewuser1@gmail.com"|"User"        |"data"      |"9876543211"|