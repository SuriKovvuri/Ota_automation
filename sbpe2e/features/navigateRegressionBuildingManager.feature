Feature: validate all pages in Building Manager

    @Bat @BuildingManager @page1  
    Scenario Outline: Navigate to <Building> and validate overview page
    Given I am logged as a Building Manager
    When I select <Building> 
    Then Verify Occupancy Online Sensor and Offline Sensor
    And Verify Environment Active device and Inactive device
    And Verify Building Address
    And validate Environment status Thermal and Air and Light and Sound 

    Examples:
    | Building                                    |
    | "75 Rockefeller Plaza"                      |

    
 @Bat @BuildingManager @page2
 Scenario Outline: Navigate to <Building> and validate Environment page
 Given I am logged as a Building Manager
 When I select <Building> 
 Then Verify Building Overview Page Last updated time difference from current time shouldnt be more that 15 mins
 And Verify The Environment status

 Examples:
    | Building                                    |
    | "75 Rockefeller Plaza"                      |



@Bat @BuildingManager @page3 
Scenario Outline: Navigate to <Building> and validate Occupancy page
Given I am logged as a Building Manager
When I select <Building> 
Then Verify Lobby activity Last updated time
And Navigate to Occupancy Sensor page and verify Online Sensor and Offline sensor count

Examples:
    | Building                                    |
    | "75 Rockefeller Plaza"                      |

    
@Bat @BuildingManager @page4
Scenario Outline: Navigate to <Building> and validate Visit Frequency in Overview Page
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
    | "75 Rockefeller Plaza"                      |


@Bat @BuildingManager @page5
Scenario Outline: Navigate to <Building> and validate Occupancy in Overview Page
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
    | "75 Rockefeller Plaza"                      |


@Bat @BuildingManager @page6
Scenario Outline: Navigate to <Building> and validate Environment in Overview Page
Given I am logged as a Building Manager
When I select <Building> 
And Verify The Visit Frequency see more option
And Click The Building Occupancy See More option
And Verify The Environment see more option
And Validate The last 7 Days Chart in VisitFrequency

Examples:
    | Building                                    |
    | "75 Rockefeller Plaza"                      |


@Bat @BuildingManager @page7
Scenario Outline: Navigate to <Building> and validate the Occupancy page
Given I am logged as a Building Manager
When I select <Building> 
And verify Occupancy sensor last updated time

Examples:
    | Building                                    |
    | "75 Rockefeller Plaza"                      |



@Bat @BuildingManager @page8
Scenario Outline: Navigate the <Building> and validate The Environment Page
Given I am logged as a Building Manager
When I select <Building> 
Then Verify The Environment status
And Verify The Environment Page last Update Time
And Verify The Weather reports 
And Verify Local Weather Forecast Today and Tomorrow and Day After Tomorrow

Examples:
    | Building                                    |
    | "75 Rockefeller Plaza"                      |
    

@Bat @BuildingManager @page9
Scenario Outline: Navigate the <Building> and validate The Energy Page Last 13 Months
Given I am logged as a Building Manager
When I select <Building> 
Then Verify The High and Low Energy using Building Manager
And Verify Last 13 Months Page last Update Time
And Verify The Average monthly tenant usage Text
And Verify The Energy consumption and EUI for Last 13 months
And Verify Energy Usage Intensity Text
And Verify The click box in last 13 months and calender Year and Last 37 months
And Verify Highest Month_Year in Energy Usage
And Verify Lowest Month_Year in Energy Usage
And Verify Highest Month in Energy Use Intensity
And Verify Lowest Month in Energy Use Intensity
And Verify the Tenant count
And Verify the last Updated tenant usage month
And Verify the energy usage graph
And Verify the energy use Intensity graph




Examples:
    | Building                                    |
    | "75 Rockefeller Plaza"                      |


@Bat @BuildingManager @page10
Scenario Outline: Navigate the <Building> and validate The Energy Page Calendar Year 
Given I am logged as a Building Manager
When I select <Building> 
Then Verify The High and Low Energy Using Building Manager
And Verify Calendar Year Page last Update Time
And Verify The Average monthly tenant usage Text
And Verify The Energy consumption and EUI for Calendar year
And Verify Energy Usage Intensity Text
And Verify Highest Month_Year in Energy Usage
And Verify Lowest Month_Year in Energy Usage
And Verify Highest Month in Energy Use Intensity
And Verify Lowest Month in Energy Use Intensity
And Verify the Tenant count
And Verify the last Updated tenant usage month
And Verify the energy usage graph
And Verify the energy use Intensity graph



Examples:
    | Building                                    |
    | "75 Rockefeller Plaza"                      |


@Bat @BuildingManager @page11
Scenario Outline: Navigate the <Building> and Verify The Energy Page Last 37 Months
Given I am logged as a Building Manager
When I select <Building> 
Then Verify The High and Low Energy Using Building Manager
And Verify The Last 37 Months last Update Time
And Verify The Average monthly tenant usage Text
And Verify The Energy consumption and EUI for Last 37 Months
And Verify Energy Usage Intensity Text
And Verify Highest Month_Year in Energy Usage
And Verify Lowest Month_Year in Energy Usage
And Verify Highest Month in Energy Use Intensity
And Verify Lowest Month in Energy Use Intensity
And Verify the Tenant count
And Verify the last Updated tenant usage month
And Verify the energy usage graph
And Verify the energy use Intensity graph

Examples:
    | Building                                    |
    | "75 Rockefeller Plaza"                      |
	 