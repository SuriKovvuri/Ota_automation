export const commons = {
    button: {
        avatar: "//div[contains(@class,'account-menu_userName')]//ancestor::button",
        selectBuilding: "//button[@id='select-building-button']"
    },
    li: {
        logout: "//li[text()='Logout']"
    }
}

export const loginPage = {
    input: {
        email: "//input[@placeholder='Email Address']",
        password: "//input[@placeholder='Password']"
    },
    button: {
        signIn: "//button[text()='SIGN IN']"
    }
}

export const allPropertiesOverview = {
    div: {
        overallOccupancyValue: "//div[contains(@class,'portfolio-common_portfolioOccupancy')]"
    }
}

export const buildingOverview = {
    h6: {

        activeEnvSensors: "//div[contains(@class, 'environment-card')]//span[text()='Active']//preceding-sibling::h6"
    },
    div: {
        realTimeOccupancy: "//div[p='Real-time Occupancy']//preceding-sibling::div"
    },
    a: {
        occupancyTab: "//a[text()='Occupancy']",
        overviewTab: "//a[text()='Overview']",
        environmentTab: "//a[text()='Environment']"
    }
}

export const occupancyBuildingTab = {
    div: {
        buildingTab: "//div[contains(@class, 'occupancy-layout_container')]//div[text()='Building']"
    },
    h5: {
        realTimeOccupancy: "//div[contains(@class,'building-occupancy_snapshot')]//p[text()='Real-time occupancy']//preceding-sibling::h5",
        averageDayOccupancy: "//div[contains(@class,'building-occupancy_snapshot')]//p[contains(text(),'Average')]//preceding-sibling::h5",
        peakDayOccupancy: "//div[contains(@class,'building-occupancy_snapshot')]//p[contains(text(),'Peak')]//preceding-sibling::h5",
        RealTimeLobby: "//div[contains(@class, 'lobby-activity_snapshot')]//p[text()='Real-time foot traffic']//preceding-sibling::h5",
        AverageDayLobby: "//div[contains(@class, 'lobby-activity_snapshot')]//p[contains(text(), 'Average')]//preceding-sibling::h5"

    }
}


export const occupancySensorsTab = {
    div: {
        sensorsTab: "//div[contains(@class, 'occupancy-layout_container')]//div[text()='Sensors']"
    },
    p: {
        totalSensors: "//div[contains(@class, 'occupancy-sensors_container')]//p[text()=' Sensors:']",
        onlineSensors: "//div[contains(@class, 'occupancy-sensors_container')]//p[text()=' Online']",
        offlineSensors: "//div[contains(@class, 'occupancy-sensors_container')]//p[text()=' Offline']"
    }
}

export const envTab = {
    span: {
        todayTemp: "//div[contains(@class, 'weather-forecast-chart_chartContainer')]//div[span='TODAY']//following-sibling::span",
        tomorrowTemp: "//div[contains(@class, 'weather-forecast-chart_chartContainer')]//div[span='TOMORROW']//following-sibling::span",
        dayAftertomorrowTemp: "//div[contains(@class, 'chart-meta_dayBlock')]//div[not(span[contains(.,'TOMORROW')] or span[contains(.,'TODAY')])]//following-sibling::span",
        sliderThumb: "//span[contains(@class, 'MuiSlider-thumbColorPrimary')]",
        slider: "//span[contains(@class, 'MuiSlider-colorPrimary')]"
    },
    div: {
        safetyBand: "//div[contains(@class, 'sensor-building-averages_safetyBand')]",
        sensorWidget: "//div[h6='sensorName']//ancestor::div[contains(@class, 'sensor-building-averages_container')]"
    },
    h6: {
        sensorAverage: "//h6[contains(@class, 'sensor-building-averages_insideCount')]",

    }
}


export const allOverviewDemo = {
    button: {
        OverviewDemox: "//button[@id='select-building-button']"
    }
}

export const verifyBuildPage = {
    span: {

        appTime: "//span[contains(@class,'MuiTypography-root MuiTypography')]/following-sibling::span",
        allEnvironment_ArrowRight: ".//span[text()='keyboard_arrow_right']",
        overViewPageDrop: "//span[text()='All Properties Overview']",
    },

    h6: {
        thermalQuality: "//h6[text()='Thermal Quality']//ancestor::div[contains(@class,'environment-card-widget_zoneItems')]//span[contains(@class,'label MuiChip-labelSmall')]",
        airQauality: "//h6[text()='Air Quality']//ancestor::div[contains(@class,'environment-card-widget_zoneItems')]//span[contains(@class,'label MuiChip-labelSmall')]",
        lightQuality: "//h6[text()='Light']//ancestor::div[contains(@class,'environment-card-widget_zoneItems')]//span[contains(@class,'label MuiChip-labelSmall')]",
        soundQuality: "//h6[text()='Sound']//ancestor::div[contains(@class,'environment-card-widget_zoneItems')]//span[text()='N/A']",
        environmentSensorTitle: ".//h6[contains(@class,'sensor-building-averages_title')]",
        environmentSensorCount: ".//h6[contains(@class,'sensor-building-averages_insideCount')]",
    },

    div: {
        onlineSensors: "//h4[text()='Building Occupancy']//ancestor::div[contains(@class,'occupancy')]//p[text()='Online']",
        offlineSensors: "//h4[text()='Building Occupancy']//ancestor::div[contains(@class,'occupancy')]//p[text()='Offline']",
        onlineDevice: "//h4[text()='Environment']//ancestor::div[contains(@class,'rounded MuiPaper-elevation0')]//p[text()='Online']",
        offlineDevice: "//h4[text()='Environment']//ancestor::div[contains(@class,'rounded MuiPaper-elevation0')]//p[text()='Offline']",
        buildAddress: "//*[text()='Portfolio Overview']//ancestor::div[contains(@class,'internal-layout_content')]//div[contains(@class,'overview-header_buildingAddress')]",
        environmentStatus: "//div[contains(@class,'MuiGrid-root MuiGrid-item MuiGrid')]//span[contains(@class,'MuiChip-label MuiChip')]",
        environmentAllSensors: "//div[contains(@class,'sensor-building-averages_container')]",
        allEnironmentStatus: ".//div[contains(@class,'sensor-building-averages_safetyBand')]",
        // lobbyTime       : "//div//h5[text()='Lobby Activity ']//following-sibling::span[contains(@class,'MuiTypography')]",
        lobbyTime: "//div//h5[text()='Lobby']//following-sibling::span[contains(@class,'MuiTypography')]",
        buildManager: "//div[p='Building Manager']//following-sibling::div//p",
        buildAdmin: "//div[p='Tenant Admin']//following-sibling::div//p",
        areaLocate: "//div[contains(@class, 'building-card_buildomgRow__clLxk')]/following-sibling::p",
        total_Unique_Users: "//div[contains(text(),'Total Unique Users')]",
        total_users_Count: "//div[contains(text(),'Total Unique Users')]//ancestor::div[contains(@class,'frequency-card_cardContainer')]//div[contains(@class,'frequency-card_cardData')]",
        totalSwipsx: "//div[text()='Total SWIPES']",
        totalSwipsCount: "//div[text()='Total SWIPES']//ancestor::div[contains(@class,'frequency-card_cardContainer')]//div[contains(@class,'frequency-card_cardData')]",
        buildandSpace: "//div[text()='Total swipes into building and tenant spaces']",
        realTimeOcc_Count: "//div[text()='Real-time occupancy']//ancestor::div[contains(@class,'occupancy-widget_cardContainer')]//div[contains(@class,'occupancy-widget_cardData')]",
        buildOCC_PeakOcc: "//div[contains(text(),'90 Day')]//ancestor::div[contains(@class,'occupancy-widget_cardContainer')]//div[contains(@class,'occupancy-widget_cardData')]",
        peakOccTodaydate: "//div[contains(text(),'90 Day')]",
        real_TimeOcc_count: "//div[text()='Real-time occupancy']//ancestor::div[contains(@class,'occupancy-widget_cardContainer')]//div[contains(text(),'People')]",
        peak_TimeOcc_count: "//div[contains(text(),'90 Day')]//ancestor::div[contains(@class,'occupancy-widget_cardContainer')]//div[contains(text(),'People')]",
        visit_Frequency_Chat_Date: "//div[contains(@class,'bm-frequency-card_tooltip')]//div[contains(@class,'frequency-card_date')]",
        VisitFrequency_Chat_Count: "//div[contains(@class,'bm-frequency-card_tooltip')]//div[contains(@class,'frequency-card_data')]",
        build_Occ_percentage_chart: "//div[text()='OCCUPANCY ']//following-sibling::p",
    },

    h5: {

        onlineSensor: "//h5[text()='Occupancy Sensors']//ancestor::div[contains(@class,'elevation1 sensors_paper')]//p[text()=' Online']",
        offlineSensor: "//h5[text()='Occupancy Sensors']//ancestor::div[contains(@class,'elevation1 sensors_paper')]//p[text()=' Offline']",
        // buildingOccupancyTxt_SeeMore : "//h5[text()='Building Occupancy ']",
        buildingOccupancyTxt_SeeMore: "//h5[normalize-space()='Building Occupancy']",
        env_SeeMore_Txt: "//h5[text()='Local Weather Forecast']",
    },

    h4: {

        // vistFrequencyLastTime   : "//h4[text()='Visit Frequency']//ancestor::div[contains(@class,'header_leftSection')]//following-sibling::span[contains(text(),'LAST UPDATED')]",
        vistFrequencyLastTime: "(//span[contains(@class, 'bm-card-header_lastUpdated')][contains(text(), 'LAST UPDATED')])[1]",
        visitFrequencyTitle: "//h4[text()='Visit Frequency']",
        installvisitFrequenceText: "//h4[contains(text(),'Visit Frequency')]//ancestor::div[contains(@class,'frequency-card_container')]//p",
        installVisitCount: "//h4[contains(text(),'Visit Frequency')]//ancestor::div[contains(@class,'frequency-card_container')]//p//following-sibling::div[contains(@class,'device-installed_cardData')]",
        buildingOccupancyLastTime: "//h4[text()='Building Occupancy']//ancestor::div[contains(@class,'header_leftSection')]//following-sibling::span[contains(text(),'LAST UPDATED')]",
        buildingOccupancyTitle: "//h4[text()='Building Occupancy']",
        buildEnvLastTime: "//h4[text()='Environment']//ancestor::div[contains(@class,'header_leftSection')]//following-sibling::span[contains(text(),'LAST UPDATED')]",
        env_Seemore_Option: "//h4[text()='Environment']//ancestor::div[contains(@class,'environment-card_container')]//span[text()='chevron_right']",
        total_Frequency_Txt: "//h5[text()='Total Building Visit Frequency']",
        buildOcc_SeeMore_option: "//h4[text()='Building Occupancy']//ancestor::div[contains(@class,'occupancy-widget_container')]//span[text()='See More']",
        visitFrequency_Seemore_Option: "//h4[text()='Visit Frequency']//ancestor::div[contains(@class,'frequency-card_container')]//span[text()='See More']",
        visit_Frequency_chat: "//h4[text()='Visit Frequency']//ancestor::div[contains(@class,'frequency-card_container')]//div[contains(@class,'recharts-wrapper')]//*[contains(@class,'recharts-bar-rectangle')]",
        visitFrequency_allChartDtae: "//h4[text()='Visit Frequency']//ancestor::div[contains(@class,'frequency-card_container')]//*[contains(@class,' recharts-xAxis xAxis')]//*[contains(@class,'text recharts-cartesian-axis-tick-value')]",
        buildOcc_Chart: "//h4[text()='Building Occupancy']//ancestor::div[contains(@class,'occupancy-widget_container')]//*[contains(@class,'layer recharts-bar')]//*[contains(@class,'recharts-bar-rectangle')]",
    },

}

export const rockBuilding = {
    p: {
        visitFrequencyOnline: "//h4[text()='Visit Frequency']//ancestor::div[contains(@class,'bm-frequency-card_container')]//p[text()='Online']",
        visitFrequencyOffline: "//h4[text()='Visit Frequency']//ancestor::div[contains(@class,'bm-frequency-card_container')]//p[text()='Offline']",
        occupancyOnline: "//h4[text()='Building Occupancy']//ancestor::div[contains(@class,'occupancy')]//p[text()='Online']",
        occupancyOffline: "//h4[text()='Building Occupancy']//ancestor::div[contains(@class,'occupancy')]//p[text()='Offline']",
        energyOnline: "//h4[text()='Energy']//ancestor::div[contains(@class,'rounded MuiPaper-elevation0')]//p[text()='Online']",
        energyOffline: "//h4[text()='Energy']//ancestor::div[contains(@class,'rounded MuiPaper-elevation0')]//p[text()='Offline']",
        environmentOnline: "//h4[text()='Environment']//ancestor::div[contains(@class,'rounded MuiPaper-elevation0')]//p[text()='Online']",
        environmentOffline: "//h4[text()='Environment']//ancestor::div[contains(@class,'rounded MuiPaper-elevation0')]//p[text()='Offline']",
    },
}

export const tenantAdmin = {

    div: {

        overViewPage_CornerTime: "//div[contains(@class,'visit-frequency_leftSection')]//span[contains(@class,'visit-frequency_lastUpdated')]",
        building_Address: "//div[contains(@class,'overview-header_buildingDetails')]//div[contains(@class,'overview-header_buildingAddress')]",
        environmentPage_Text: "//div[contains(@class,'weather-forecast-chart_chartHeader')]//h5[text()='Local Weather Forecast']",
        occupancy_Usagepage_Text: "//div[contains(@class,'tenant_pageHeading')]//h5[text()='Visit Frequency']",
        energyPage_Text: "//div[contains(@class,'energy-usage_header')]//div[text()='Energy Usage']",
        buildingName: "//div[contains(@class,'overview-header_buildingDetails')]//div[contains(@class,'overview-header_buildingName')]",
        overViewPage_Title1: "//div[contains(@class,'visit-frequency_header')]//h4[text()='Visit Frequency']",
        total_Unique_Users: "//div[contains(@class,'visit-frequency_cardContainer')]//div[contains(text(),'Total Unique Users')]",
        total_users_Count: "//div[contains(@class,'visit-frequency_cardContainer')]//div[contains(text(),'Total Unique Users')]//following-sibling::div[contains(@class,'visit-frequency_cardData')]",
        peak_users: "(//div[contains(@class,'visit-frequency_cardSection')]//div[contains(@class,'visit-frequency_cardTitle')])[2]",
        peak_Users_Count: "//div[contains(@class,'visit-frequency_cardContainer')]//div[contains(text(),'90 Day ')]//following-sibling::div[contains(@class,'visit-frequency_cardData')]",
        visit_Frequency_Chat_Date: "//div[contains(@class,'visit-frequency_tooltip')]//div[contains(@class,'visit-frequency_date')]",
        VisitFrequency_Chat_Count: "//div[contains(@class,'visit-frequency_tooltip')]//div[contains(@class,'visit-frequency_data')]",
        energy_Tiltle: "//div[contains(@class,'energy-card_header')]//h4[text()='Energy']",
        energy_LastUpdate_Time: "//div[contains(@class,'energy-card_header')]//span[contains(@class,'energy-card_lastUpdated')]",
        averageMonthUsage_text: "//div[contains(@class,'energy-card_cardContainer')]//div[contains(text(),'Average Monthly Usage')]",
        energy_Consum: "//div[text()='Average Monthly Usage']//ancestor::div[contains(@class,'energy-card_cardContainer')]//div[contains(@class,'energy-card_cardData')]",
        energy_EUI: "//div[contains(@class,'energy-card_cardContainer')]//div[text()='Average Monthly EUI']",
        energy_EUI_Data: "//div[text()='Average Monthly EUI']//ancestor::div[contains(@class,'energy-card_cardContainer')]//div[contains(@class,'energy-card_cardData')]",
        env_LastUpdate_Time: "//div[contains(@class,'weather-forecast-chart_chartHeade')]//p[contains(text(),'Last updated')]",
        weather_AllReports: "//div[contains(@class,'recharts-wrapper')]//*[contains(@class,'recharts-layer recharts-cartesian-axis-tick')]",
        Weather_AllTime: "//div[contains(@class,'weather-forecast-chart_customTooltip')]//span[1]",
        weather_AllDate: "//div[contains(@class,'weather-forecast-chart_customTooltip')]//span[2]",
        weather_AllTemp: "//div[contains(@class,'weather-forecast-chart_customTooltip')]//span[contains(@class,'eather-forecast-chart_customTooltip_value')]",
        high_Energy_Usage: "//div[contains(@class,'energy-usage_container')]//div[contains(text(),'Highest')]",
        low_Energy_Usage: "//div[contains(@class,'energy-usage_container')]//div[contains(text(),'Lowest')]",
        energyPage_LastUpdate: "//div[contains(@class,'energy_tenantHeader')]//span[contains(text(),'LAST UPDATED: ')]",
        averageUsage_Txt: "//div[contains(text(),'Average monthly tenant usage')]",
        average_Month_Consum: "//div[text()='Average monthly tenant usage']//preceding-sibling::div/p",
        lowest_Usage: "//div[contains(text(),'Highest ') and text()=' usage:']//preceding-sibling::div/p",
        highest_Usage: "//div[contains(text(),'Highest ') and text()=' usage:']//preceding-sibling::div/p",
        average_Month_EUI: "//div[contains(text(),'Average monthly EUI')]//preceding-sibling::div",
        highest_Month_EUI: "//div[contains(text(),'Highest ') and text()=' EUI:']//preceding-sibling::div",
        lowest_Month_EUI: "//div[contains(text(),'Lowest ') and text()=' EUI:']//preceding-sibling::div",
        high_Energy_Tenant_EUI: "//div[contains(text(),'Highest ') and text()=' usage:']",
        // high_Energy_Tenant_EUI: "(//div[contains(@class, 'energy-use-intensity') and contains(., 'Highest')])[3]",
        low_Energy_Tenant_EUI: "//div[contains(text(),'Lowest') and text()=' EUI:']",
        energy_Usage_Intensity_Txt: "//div[contains(text(),'Energy Use Intensity')]",
        occ_RealTimeOcc_Count: "//div[contains(@class,'occupancy-widget_cardContainer')]//div[contains(text(),'Real-time occupancy')]//following-sibling::div[2]",
        occ_90Days_Peak: "//div[contains(@class,'occupancy-widget_cardContainer')]//div[contains(text(),'Peak')]//following-sibling::div[1]",
        energy_Usage_Click: "//div[contains(@class,'energy-usage_header')]//p[contains(@class,'energy-usage_subTitle')]",
        energy_Intensity_Click: "//div[contains(@class,'energy-use-intensity_header')]//p[contains(@class,'energy-use-intensity_subTitle')]",
        occupancy_LastUpDate: "//div[contains(@class,'building-occupancy_titleContainer')]//span[contains(text(),'LAST UPDATED:')]",
        occ_90DaysPeak_Count: "//div[contains(@class,'occupancy-widget_cardContainer')]//div[contains(text(),'Peak')]//following-sibling::div[2]",
        allDaysClick: "//div//ul[contains(@class,'-padding MuiMenu-list')]//li",
        lobby90Days_FootTraffic: "//div[contains(@class,'obby-activity_containe')]//p[contains(text(),'Average ')]//preceding-sibling::h5",
        visitFrequencyLastUpadteTime: "//div[contains(@class,'tenant_pageHeading')]//following-sibling::span[(text()=' • LAST UPDATED: ')]",
        aggregate_User_Txt: "//div[text()='Aggregate user swipes into your spaces']",
        usagePage_PeakUser: "//div[text()='Peak unique daily users']",
        enter1: "(//div[contains(@class,'usage-card_stack')]//p[contains(@class,'MuiTypography-body2 css')])[1]",
        enter2: "(//div[contains(@class,'usage-card_stack')]//p[contains(@class,'MuiTypography-body2 css')])[2]",
        enter3: "(//div[contains(@class,'usage-card_stack')]//p[contains(@class,'MuiTypography-body2 css')])[3]",
        selectCompanyClick: "//div[contains(@class,'MuiAutocomplete-popper ')]",
        addClickUser: "//div[contains(@class,'tenant-info-form_addUserButton')]//button[text()='Add User']",
        buildOccLastUpdate: "//div[contains(@class,'occupancy-widget_container')]//span[contains(text(),'LAST UPDATED')]",
        occ_RealTimeOcc: "//div[contains(@class,'occupancy-widget_cardContainer')]//div[text()='Real-time occupancy']//following-sibling::div[1]",
        average_Month_Year: "//div[contains(text(),'Usage')]//ancestor::div[contains(@class,'energy-card_cardContainer')]//div[contains(@class,'energy-card_cardDifference')]",
        highmonthInten: "//div[text()='Energy Use Intensity']//ancestor::div[contains(@class,'energy-use-intensity_container')]//div[contains(text(),'Highest ')]",
        lowMonthInten: "//div[text()='Energy Use Intensity']//ancestor::div[contains(@class,'energy-use-intensity_container')]//div[contains(text(),'Lowest ')]",
        averageMonthYear_EUI: "//div[contains(text(),'Average Monthly EUI')]//ancestor::div[contains(@class,'energy-card_cardContainer')]//div[contains(@class,'energy-card_cardDifference')]",
        userNameVerify: "//div[contains(@class,'data-table_cellContainer')]//p[contains(@class,'users_tableNameCell')]",
        userEmailVerify: "//div[contains(@class,'data-table_cellContainer')]//p[contains(@class,'users_tableEmailCell')]",
        userNumberVerify: "//tr[contains(@class,'data-table_tr__CQJQx undefined')]//td[4]",
        userPersona: "//tr[contains(@class,'data-table_tr__CQJQx undefined')]//td[5]",
    },

    h4: {

        environment_Seemore_Option: "//h4[text()='Environment']//ancestor::div[contains(@class,'environment-card_container')]//span[text()='chevron_right']",
        visitFrequency_Seemore_Option: "//h4[text()='Visit Frequency']//ancestor::div[contains(@class,'visit-frequency_container')]//span[text()='chevron_right']",
        energy_Seemore_Option: "//h4[text()='Energy']//ancestor::div[contains(@class,'energy-card_header')]//span[text()='chevron_right']",
        visit_Frequency_chat: "//h4[text()='Visit Frequency']//ancestor::div[contains(@class,'visit-frequency_containe')]//div[contains(@class,'recharts-wrapper')]//*[contains(@class,'layer recharts-bar-rectangle')]",
        energyChartB_Hour: "//h4[text()='Energy']//ancestor::div[contains(@class,'energy-card_container')]//*[contains(@class,'layer recharts-line')]",
        visitFrequencyDate: "//h4[text()='Visit Frequency']//ancestor::div[contains(@class,'visit-frequency_con')]//*[contains(@class,'cartesian-axis recharts-xAxis')]//*[@class='recharts-layer recharts-cartesian-axis-tick']",
        seeMoreOption_Occ: "//h4[text()='Building Occupancy']//ancestor::div[contains(@class,'occupancy-widget_container')]//span[text()='See More']",
    },

    h6: {

        allSensors: "//h6[text()='Sensor Building Averages']//ancestor::div[contains(@class,'environment_envPageContainer')]//div[contains(@class,'MuiGrid-root MuiGrid-item MuiGrid')]",
        thermalQuality: "(//h6[text()='Thermal Quality']//ancestor::div[contains(@class,'environment-card')]//span[contains(@class,'labelSmall css-1pjtbja')])[1]",
        airQuality: "(//h6[text()='Thermal Quality']//ancestor::div[contains(@class,'environment-card')]//span[contains(@class,'labelSmall css-1pjtbja')])[2]",
        lightQuality: "(//h6[text()='Thermal Quality']//ancestor::div[contains(@class,'environment-card')]//span[contains(@class,'labelSmall css-1pjtbja')])[3]",
        soundQuality: "(//h6[text()='Thermal Quality']//ancestor::div[contains(@class,'environment-card')]//span[contains(@class,'labelSmall css-1pjtbja')])[4]",

    },

    p: {

        environmentSensorTitle: ".//p[contains(@class,'tenant-env-card_titleText')]",
        environmentSensorCount: ".//p[contains(@class,'tenant-env-card_value')]",
        realTime_Occupancy_Percent: "//p[contains(text(),'Real-time occupancy')]//preceding-sibling::h5",
        Average_Occupancy: "//p[contains(text(),'People')]//preceding-sibling::p[contains(text(),'Average')]//preceding-sibling::h5",
        peakOccupancy: "//p[contains(text(),'People')]//preceding-sibling::p[contains(text(),'Peak')]//preceding-sibling::h5",
        total_RealTime: "//p[contains(text(),'Real-time occupancy')]//following-sibling::p",
        total_AverageTime: "//p[contains(text(),'Average')]//following-sibling::p",
        total_PeakTime: "//p[contains(text(),'Peak')]//following-sibling::p",
        RealTime_FootTraffic: "//p[contains(text(),'Real-time foot traffic')]//preceding-sibling::h5",
        highRaiseBuildOccupancy: "(//h5[text()='Building Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5)[2]",
        lowRaiseWestBuildOcc: "(//h5[text()='Building Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5)[3]",
        lowRaiseEastBuildOcc: "(//h5[text()='Building Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5)[4]",
        energy_Usage_Intensity_Score: "//p[contains(text(),'Usage Intensity Score:')]//ancestor::div[contains(@class,'tenant-widget_cardContainer')]//h5",
        total_Swips: "//p[contains(text(),'Total Swipes:')]//ancestor::div[contains(@class,'tenant-widget_cardContainer')]//h5",
        total_Unique_Users: "//p[contains(text(),'Total Unique Users:')]//ancestor::div[contains(@class,'tenant-widget_cardContainer')]//h5",
        install_OccOnline_Count: "//p[contains(text(),'Installed ')]//ancestor::div[contains(@class,'MuiBox-root')]//*[text()='Online']",
        install_OccOffline_count: "//p[contains(text(),'Installed ')]//ancestor::div[contains(@class,'MuiBox-root')]//*[text()='Offline']",
        high_AverageMonthYear: "//p[text()=' kWh']//ancestor::div[contains(@class,'energy-usage_dataContainer')]//div[contains(text(),'Highest ')]",
        low_AverageMonthYear: "//p[text()=' kWh']//ancestor::div[contains(@class,'energy-usage_dataContainer')]//div[contains(text(),'Lowest ')]",

    },

    span: {

        allEnironmentStatus: ".//span[contains(@class,'label MuiChip-labelMedium')]",
        weatherStatus_Today: "//span[contains(text(),'TODAY')]",
        weatherStatus_Tomorrow: "//span[contains(text(),'TOMORROW')]",
        today_Temp: "//span[contains(text(),'TODAY')]//ancestor::div[contains(@class,'chart-meta_dayBlock')]//span[contains(@class,'chart-meta_temp')]",
        tomorrow_Temp: "//span[contains(text(),'TOMORROW')]//ancestor::div[contains(@class,'chart-meta_dayBlock')]//span[contains(@class,'chart-meta_temp')]",
        dayAfterTomorrow: "(//span[contains(@class,'MuiTypography-overline')])[3]",
        todayStatus: "//span[text()='TODAY']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Precipitation: ')]",
        tomorrowStatus: "//span[text()='TOMORROW']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Precipitation: ')]",
        dayAfterTomorrow_Temp: "(//span[contains(@class,'MuiTypography-overline')])[3]//ancestor::div[contains(@class,'chart-meta_dayBlock')]//span[contains(@class,'chart-meta_temp')]",
        dayAftertomorrow_Pre: "(//span[contains(@class,'MuiTypography-overline')])[3]//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Precipitation: ')]",
        today_Humidity: "//span[text()='TODAY']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Humidity:')]",
        tomorrow_Humidity: "//span[text()='TOMORROW']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Humidity:')]",
        dayAfterTomorrow_Humidity: "(//span[contains(@class,'MuiTypography-overline')])[3]//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Humidity:')]",
        today_Wind: "//span[text()='TODAY']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Wind:')]",
        dayAfterTomorrow_wind: "(//span[contains(@class,'MuiTypography-overline')])[3]//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Wind')]",
        tomorrow_Wind: "//span[text()='TOMORROW']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Wind:')]",
        building_Occupancy_lastTime: "//span[contains(text(),'REAL-TIME USAGE TOTAL')]",
        buildingSelectAndClick: "//span[contains(@class,'MuiListItemText-primary')]",
        userDelete: "//span[text()='delete']",
        editUser: "//span[text()='edit']",
    },

    a: {

        energy_Page: "//a[text()='Energy']",
    },

    button: {

        last_13_Months: "//button[text()='Last 13 months']",
        calender_Year: "//button[text()='Calendar year']",
        last_37_Months: "//button[text()='Last 37 months']",
        today: "//div[text()='Today']",
        yesterday: "//li[text()='Yesterday']",
        last7Days: "//li[text()='Last 7 days']",
        last30DaysClick: "//li[text()='Last 30 days']",
        usageTab: "//div[text()='Usage']",
        last14Days: "//button[text()='14 Days']",
        last30Days: "//button[text()='30 Days']",
        userTab: "//a[text()='Users']",
        addUser: "//button[text()='Add User']",
        tenantAdminTab: "//label[text()='Select Persona']//ancestor::div[contains(@class,'MuiDialog-paper MuiDialog-paperScrollPaper')]//div[@aria-haspopup='listbox']",
        tenantAdminClick: "//li[text()='Tenant Admin']",
        changeBuilding: "(//ul[@role='listbox']//span[contains(@class,'body1 MuiListItemText-primary')])[1]",
        nextTab: "//button[text()='Next']",
        clickcompanyBm: "//ul[@id='company-listbox']//li[@id='company-option-0']",
        selectBuildingDrop: "//label[text()='Select Building ']//ancestor::div[contains(@class,'MuiFormControl-fullWidth')]//*[contains(@data-testid,'ArrowDropDownIcon')]",
        clickBuilding: "(//ul[@role='listbox']//span[contains(@class,'body1 MuiListItemText-primary')])[22]",
        companySelect: "//label[text()='Select Company']//ancestor::div[contains(@class,'MuiAutocomplete-hasPopupIcon')]//*[contains(@data-testid,'ArrowDropDownIcon')]",
        deleteOk: "//button[text()='OK']",
        saveEdit: "//button[@type='submit']",


    },


    h5: {

        lobbyActive_Txt: "//div[contains(@class,'lobby-activity_titleContainer')]//h5[text()='Lobby']",
        lobbyActive_Time: "//div[contains(@class,'lobby-activity_titleContainer')]//h5[contains(text(),'Lobby')]//following-sibling::span[contains(text(),'LAST UPDATED:')]",
        buildingOccupancyTxt: "//div[contains(@class,'building-occupancy_titleContainer')]//h5[contains(text(),'Building')]",
        visit_Frequency_Txt_xpath: "//h5[text()='Visit Frequency']",
        buildingOccupancyTxt_SeeMore: "//div[contains(@class,'building-occupancy_titleContainer')]//h5[text()='Building']",
    },


    label: {

        firstName: "//label[text()='First Name']",
        lastName: "//label[text()='Last Name']",
        email: "//label[text()='Email']",
        phone: "//label[text()='Phone']",
        password: "//label[text()='Password']",
        confirmPassword: "//label[text()='Confirm Password']",
        modifyCompanySelectDrop: "//label[text()='Select Building']//ancestor::div[contains(@class,'MuiFormControl-fullWidt')]//*[@data-testid='ArrowDropDownIcon']"

    },

    input: {

        searchUsers: "//input[@placeholder='Search users']",
        searchText: "//input[@id=':r3:']",
        editFirstName: "//input[@name='firstName']",
        editMobileNo: "//input[@name='mobilePhone']",

    },

    h2: {

        checkboxText: "//h2[text()='New User']//ancestor::div[contains(@class,'MuiDialog-paper MuiDialog-paperScrollPaper')]//div[@aria-haspopup='listbox']",
        selectPersona: "//label[text()='Select Persona']",
    },
}




export const allPropertiesOverviewPage = {
    button: {

        days: "//div[contains(@class,'MuiInputBase-formControl duration-filter_select__VZVln css')]",
        today: "//li[text()='Today']",
        yesterday: "//li[text()='Yesterday']",
        last7Days: "//li[text()='Last 7 days']",
        last14Days: "//li[text()='Last 14 days']",
        last30Days: "//li[text()='Last 30 days']",
    },



    div: {

        chat_AllData_Today: "//div[contains(@class,'common_barGraphContainer')]//*[contains(@class,'recharts-layer recharts-bar-rectangle')]",
        chat_Hover_Time: "//div[contains(@class,'wrapper recharts-tooltip-wrapper')]//p[contains(@class,'portfolio-common_time__XW_RD')]",
        chat_Hover_Title: "//div[contains(@class,'wrapper recharts-tooltip-wrapper')]//p[text()='portfolio occupancy']",
        chat_Hover_OccupancyPercentage: "//div[contains(@class,'wrapper recharts-tooltip-wrapper')]//p[contains(@class,'portfolio-common_percentage')]",
        chat_Hover_Occupancy: "//div[contains(@class,'wrapper recharts-tooltip-wrapper')]//span[contains(@class,'portfolio-common_highlight')]",
        overall_Time: "//div[contains(@class,'portfolio-common_doughnutInfo')]//span[contains(@class,'portfolio-common_timeValue')]",
        realTime_OccupancyPercentage: "//div[contains(@class,'portfolio-common_doughnutInfo')]//div[contains(@class,'portfolio-common_portfolioOccupancy')]",
        build_count: "//div[contains(@class,'portfolio-common_doughnutInfo')]//span[contains(@class,'portfolio-common_buildingCount')]",
        all_BuildingName: ".//div[contains(@class,'data-table_cellContainer')]//abbr//p[contains(@class,'MuiTypography-root MuiTypography')]",
        chat_AllData: "//div[contains(@class,'common_barGraphContainer')]//*[contains(@cursor,'pointer')]",
        overViewPage_CornerTime: "//div[contains(@class,'overview_header')]//span[contains(@class,'caption overview_lastUpdated')]",
    },

    tbody: {

        all_BuildOccupancy: "//tbody[contains(@class,'MuiTableBody-root css')]//tr[contains(@class,'MuiTableRow-root data-table_tr')]",
        occupancy_Count_NonZero: ".//p[contains(@class,'MuiTypography-root MuiTypography-body2 css')]",
        list_Occupancy_Percent: ".//div[contains(@class,'data-table_cellContainer')]//p[text()='%']",
    }

}

export const VerifyOccupancySensors = {
    div: {
        lastUpdated: "//tbody[contains(@class,'MuiTableBody-root')]//div[contains(@class,'data-table_cellContainer')]//div[contains(@class,'MuiBox-root')]",
        offStatus: "//div[@aria-label='Offline']",
        onlineStatus: "//div[@aria-label='Online']",
    },

    p: {
        OccupancyId: "//p[contains(text(),'OCCUPANCY_SENSOR-O')]",
        OffOccupancyId: "//p[contains(text(),'OCCUPANCY_SENSOR-OCC-hella')]",
    },

    button: {
        gotonextpage: "//button[@aria-label='Go to next page']//*[name()='svg']",
    },
};

export const WellReport = {
    li: {
        generateReportTab: "//li[text()='Generate Report']",
        buildingXpath: "//li[text()='1285 Avenue of Americas']",
    },
    div: {
        enableDownload: "(//div[contains(@class,'report-list_actions')]/span)[1]",
        WellIq: "(//*[@id='simple-tabpanel-0']//section[contains(@class,'card_card')])[1]",
        dropdownIcon: "//div[contains(@class,'MuiAutocomplete-root')]",
        sensorXpath: "//label[contains(@class, 'MuiFormControlLabel-labelPlacementEnd')]//span[contains(@class, 'MuiTypography-root')][contains(@class, 'MuiFormControlLabel-label')][contains(text(), 'ENVIRONMENT_SENSOR-ENV')]",
        generateReport: "//button[text()='Generate Report']",
        viewReport: "//button[text()='View Reports']",
        disable: "(//span[contains(@class, 'Mui-disabled')][contains(text(), 'ENVIRONMENT_SENSOR-ENV')])",
        closetab: "(//button[contains(@class, 'MuiIconButton-root')]//span[contains(@class, 'MuiIcon-root') and text()='close'])[2]",
    },
    span: {
        timeperiod: "(//label[contains(@class, 'MuiFormControlLabel-root') and contains(@class, 'MuiFormControlLabel-labelPlacementEnd')])[2]",
        timeperiod2: "(//label[contains(@class, 'MuiFormControlLabel-root') and contains(@class, 'MuiFormControlLabel-labelPlacementEnd')])[1]",
        downloadEnable: "(//img[contains(@alt, 'download')])[1]",
        exitbutton: '//*[@id="Generate Reports"]/button/span[2]',
        closeIcon: "(//span[@aria-hidden='true' and text()='close'])[2]",
        allProperties: "//span[text()='All Properties Overview']",
    },
    p: {
        readyStatus: "(//div[contains(@class,'report-list_tableLegendStatus')]//p[contains(@class,'report-list')])[1]",
        pendingStatus: "(//div[contains(@class,'report-list_tableLegendStatus')]//p[contains(@class,'report-list')])[2]",
        failedStatus: "(//div[contains(@class,'report-list_tableLegendStatus')]//p[contains(@class,'report-list')])[3]",
        downloadedStatus: "(//div[contains(@class,'report-list_tableLegendStatus')]//p[contains(@class,'report-list')])[4]",
        fileName: "(//div[contains(@class,'report-list_actions')])[1]",
        reportType: "(//p[ @title='environment'])[1]",
        property: "(//tr[contains(@class,'MuiTableRow-root data-table_tr')]//td[4]//div[contains(@class,'data-table_cellContainer')])[1]",
        fileSize: "(//p[contains(@class,'report-list_fileSize')])[1]",
        reportVerify: "//*[contains(text(),'The report is being generated')]",
        reportDetails: "//span[text()='REPORT DETAILS:']/following-sibling::p",
        // loadingText: "//div[text()='Loading...']",
        loadingBuffer: "//p[text()='Select Sensor(s): ']",
        selectLocators: "//p[text()='Select a time period ']",
        selectBuilding: "//p[text()='Select ']",
        // chooseBuilding: '//*[@id="building-label"]',
        chooseBuilding: '//label[text()="Choose an option"]',
    },
    button: {
        Generate: "//button[text()='Generate']",
        view: "//button[text()='View']",
        reportGeneration: "(//td[contains(@class, 'MuiTableCell-sizeSmall')]//p)[6]",
    },
    img: {
        deleteOption: '(//img[@alt="delete"])[1]',
    }
}

export const occupancyPageVerify = {

    h5 : {
        occ_Detail_Title    : "//h5[text()=' Occupancy Details']",
        totalBuild_Visit_Frequency_Text : "//h5[text()='Total Building Visit Frequency']",
        occ_VisitFrequencyLastUpadteTime: "//h5[text()='Total Building Visit Frequency']//ancestor::div[contains(@class,'access_titleContainer')]//span[contains(@class,'MuiTypography-overline ')]",
        buidlingEntrance1    : "(//h5[text()=' Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5[contains(@class,'MuiTypography-root MuiTypo')])[2]",
        buidlingEntrance2    : "(//h5[text()=' Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5[contains(@class,'MuiTypography-root MuiTypo')])[3]",
        buidlingEntrance3    : "(//h5[text()=' Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5[contains(@class,'MuiTypography-root MuiTypo')])[4]",
        buidlingEntrance4   : "(//h5[text()=' Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5[contains(@class,'MuiTypography-root MuiTypo')])[5]",
        buidlingEntrance5   : "(//h5[text()=' Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5[contains(@class,'MuiTypography-root MuiTypo')])[6]",
        buidlingEntrance6   : "(//h5[text()=' Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5[contains(@class,'MuiTypography-root MuiTypo')])[7]",
        buidlingEntrance7   : "(//h5[text()=' Occupancy Details']//ancestor::div[contains(@class,'usage-card_paper')]//h5[contains(@class,'MuiTypography-root MuiTypo')])[8]",
        buildingAccess_Text : "//h5[text()='Building Access']",
        accessSummaryText   : "//h5[text()='Access Summary']",
        
    },

    div : {
        accessSummaryLastUpdate_Time : "//div[contains(@class,'access-summary_widgetHeading')]//span[contains(@class,'MuiTypography-overline')]",
        tenant_Usage_Text            : "//div[text()='Tenant Usage Intensity']",
        tenant_Usage_Intensity_lastUpdateTime : "//div[text()='Tenant Usage Intensity']//ancestor::div[contains(@class,'access_titleContainer')]//span[contains(@class,'MuiTypography-overline')]",
        averageDay_Lobby_Foot_Traffic : "//div[contains(@class,'lobby-activity_titleContainer')]//ancestor::div[contains(@class,'elevation0 lobby-activity_container')]//p[contains(text(),'Average ')]",
        average_Day_BuildOccupancy : "//div[contains(@class,'building-occupancy_titleContainer')]//ancestor::div[contains(@class,'elevation0 building-occupancy_container')]//p[contains(text(),'Average ')]",
        peak_Day_BuildOccupancy  : "//div[contains(@class,'building-occupancy_titleContainer')]//ancestor::div[contains(@class,'elevation0 building-occupancy_container')]//p[contains(text(),'Peak ')]",
        building_Entrance_Name_List : "//div[contains(@class,'rounded MuiPaper-elevation0 usage-card_paper')]//div[contains(@class,'usage-card_stack')]//div//p",
        occupancyUsage_TenantName : "//div[contains(@class,'progress_tenantName')]",
},

p : {
   total_Swips : "//p[contains(text(),'Total Swipes:')]//ancestor::div[contains(@class,'access-summary_cardContainer')]//h5",
   total_Unique_Users : "//p[contains(text(),'Total Unique Users:')]//ancestor::div[contains(@class,'access-summary_cardContainer')]//h5",
   usageIntensity : "//p[contains(text(),'Usage Intensity:')]//ancestor::div[contains(@class,'access-summary_cardContainer')]//h5",
   high_UsageIntensity_score : "//p[contains(text(),'Highest Usage:')]//ancestor::div[contains(@class,'access-summary_cardContainer')]//div[contains(@class,'access-summary_cardDetail')]",
   low_UsageIntensity_score : "//p[contains(text(),'Lowest Usage:')]//ancestor::div[contains(@class,'access-summary_cardContainer')]//div[contains(@class,'access-summary_cardDetail')]",
   
},

button : {

    occ_UsagaePage_Last14Days : "//button[text()='14 Days']",
    occ_UsagePage_Last30Days  : "//button[text()='30 Days']",
},

}
export const energyPage = {

    h5: {
        energyPage_Title: "//h5[text()='Energy Usage']",
    },

    div : {
        energy_LastUpdate_Time : "//div[contains(@class,'energy_tabsContainer')]//span[contains(@class,'energy_lastUpdate')]",  
        tenantUsageCount       : "//div[contains(@class,'tenant_header')]//p[1]",
        energyUsageGraph: "//div[contains(@class,'energy-usage_graph')]//*[contains(@class, 'recharts-xAxis') and name() ='g']//*[name()='g' and contains(@class,'recharts-layer recharts-cartesian-axis-tick')]",
        energyUsageIntensityGraph : "//div[contains(@class,'energy-use-intensity_container')]//*[contains(@class, 'recharts-xAxis') and name() ='g']//*[name()='g' and contains(@class,'recharts-layer recharts-cartesian-axis-tick')]",

    },

    ul : {

        tenantName_List  : "//ul[contains(@class,'MuiList-padding MuiMenu-list')]//li[contains(@class,'MuiMenuItem-gutters Mui-selected')]",
        tenantName_List_click : "//*[@data-testid='ArrowDropDownIcon']",
        
    },


    button : {


        usageByBuilding : "//button[text()='Usage by Building']",
    },
}

export const BuildingManager = {
    
    div: {
        tenant_info:"//div[contains(@class,'tenant_info')]",
        environmentSensorTitle: "//h6[contains(@class, 'MuiTypography-root MuiTypography-h6 sensor-building-averages_title')]",
        env_LastUpdate_Time: "//div[contains(@class,'weather-forecast-chart_chartHeade')]//p[contains(text(),'Last updated')]",
        weather_AllReports: "//div[contains(@class,'recharts-wrapper')]//*[contains(@class,'recharts-layer recharts-cartesian-axis-tick')]",
        weather_AllDate: "//div[contains(@class,'weather-forecast-chart_customTooltip')]//span[2]",
        Weather_AllTime: "//div[contains(@class,'weather-forecast-chart_customTooltip')]//span[1]",
        weather_AllTemp: "//div[contains(@class,'weather-forecast-chart_customTooltip')]//span[contains(@class,'eather-forecast-chart_customTooltip_value')]",
        high_Energy_Usage: "//div[contains(@class,'energy-usage_container')]//div[contains(text(),'Highest')]",
        low_Energy_Usage: "//div[contains(@class,'energy-usage_container')]//div[contains(text(),'Lowest')]",
        // high_Energy_Tenant_EUI: "//div[contains(text(),'Highest ') and text()=' usage:']",
        high_Energy_Tenant_EUI: "(//div[contains(@class, 'energy-use-intensity') and contains(., 'Highest')])[3]",
        low_Energy_Tenant_EUI: "//div[contains(text(),'Lowest') and text()=' EUI:']",
        averageUsage_Txt: "//div[contains(text(),'Average monthly tenant usage')]",
        average_Month_Consum: "//div[text()='Average monthly tenant usage']//preceding-sibling::div/p",
        lowest_Usage: "//div[contains(text(),'Highest ') and text()=' usage:']//preceding-sibling::div/p",
        highest_Usage: "//div[contains(text(),'Highest ') and text()=' usage:']//preceding-sibling::div/p",
        average_Month_EUI: "//div[contains(text(),'Average monthly EUI')]//preceding-sibling::div",
        highest_Month_EUI: "//div[contains(text(),'Highest ') and text()=' EUI:']//preceding-sibling::div",
        lowest_Month_EUI: "//div[contains(text(),'Lowest ') and text()=' EUI:']//preceding-sibling::div",
        energyPage_LastUpdate: "//span[contains(text(),'LAST UPDATED: ')]",
        energy_Usage_Intensity_Txt: "//div[contains(text(),'Energy Use Intensity')]",
        energy_Usage_Click: "//div[contains(@class,'energy-usage_header')]//p[contains(@class,'energy-usage_subTitle')]",
        energy_Intensity_Click: "//div[contains(@class,'energy-use-intensity_header')]//p[contains(@class,'energy-use-intensity_subTitle')]",
        energy_Usage_Click: "//div[contains(@class,'energy-usage_header')]//p[contains(@class,'energy-usage_subTitle')]",
        // energy_Intensity_Click: "//div[contains(@class,'energy-use-intensity_header')]//p[contains(@class,'energy-use-intensity_subTitle')]",
        highmonthInten: "//div[text()='Energy Use Intensity']//ancestor::div[contains(@class,'energy-use-intensity_container')]//div[contains(text(),'Highest ')]",
        lowMonthInten: "//div[text()='Energy Use Intensity']//ancestor::div[contains(@class,'energy-use-intensity_container')]//div[contains(text(),'Lowest ')]",
        lastUpdated: "//tbody[contains(@class,'MuiTableBody-root')]//div[contains(@class,'data-table_cellContainer')]//div[contains(@class,'MuiBox-root')]",
    },
    h6: {
        allSensors: "//h6[text()='Sensor Building Averages']//ancestor::div[contains(@class,'environment_envPageContainer')]//div[contains(@class,'MuiGrid-root MuiGrid-item MuiGrid')]",
        environmentSensorCount: "//h6[contains(@class,'subtitle1 sensor-building-averages_insideCount')]",
    },
    span: {
        allEnironmentStatus: "//span[contains(@class,'label MuiChip-labelMedium')]",
        weatherStatus_Today: "//span[contains(text(),'TODAY')]",
        todayStatus: "//span[text()='TODAY']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Precipitation: ')]",
        today_Humidity: "//span[text()='TODAY']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Humidity:')]",
        today_Wind: "//span[text()='TODAY']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Wind:')]",
        today_Temp: "//span[contains(text(),'TODAY')]//ancestor::div[contains(@class,'chart-meta_dayBlock')]//span[contains(@class,'chart-meta_temp')]",
        weatherStatus_Tomorrow: "//span[contains(text(),'TOMORROW')]",
        tomorrowStatus: "//span[text()='TOMORROW']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Precipitation: ')]",
        tomorrow_Humidity: "//span[text()='TOMORROW']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Humidity:')]",
        tomorrow_Wind: "//span[text()='TOMORROW']//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Wind:')]",
        tomorrow_Temp: "//span[contains(text(),'TOMORROW')]//ancestor::div[contains(@class,'chart-meta_dayBlock')]//span[contains(@class,'chart-meta_temp')]",
        dayAfterTomorrow: "(//span[contains(@class,'MuiTypography-overline')])[3]",
        dayAftertomorrow_Pre: "(//span[contains(@class,'MuiTypography-overline')])[3]//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Precipitation: ')]",
        dayAfterTomorrow_Humidity: "(//span[contains(@class,'MuiTypography-overline')])[3]//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Humidity:')]",
        dayAfterTomorrow_wind: "(//span[contains(@class,'MuiTypography-overline')])[3]//ancestor::div[contains(@class,'chart-meta_metaItem')]//p[contains(text(),'Wind')]",
        dayAfterTomorrow_Temp: "(//span[contains(@class,'MuiTypography-overline')])[3]//ancestor::div[contains(@class,'chart-meta_dayBlock')]//span[contains(@class,'chart-meta_temp')]",
        weather_AllDate: "//div[contains(@class,'weather-forecast-chart_customTooltip')]//span[2]",
        Weather_AllTime: "//div[contains(@class,'weather-forecast-chart_customTooltip')]//span[1]",
        weather_AllTemp: "//div[contains(@class,'weather-forecast-chart_customTooltip')]//span[contains(@class,'eather-forecast-chart_customTooltip_value')]",
        energyPage_LastUpdate: "//span[text()='LAST UPDATED: ']",
        envSensorXpath: "(//span[ contains(@class, 'sensor-building')])[1]",
    },
    a: {
        energy_Page: "//a[text()='Energy']",
    },
    p: {
        high_AverageMonthYear: "//p[text()=' kWh']//ancestor::div[contains(@class,'energy-usage_dataContainer')]//div[contains(text(),'Highest ')]",
        low_AverageMonthYear: "//p[text()=' kWh']//ancestor::div[contains(@class,'energy-usage_dataContainer')]//div[contains(text(),'Lowest ')]",
        online_Env: "(//p[contains(@class,'MuiTypography-root MuiTypography-body')])[3]",
        offline_Env: "(//p[contains(@class,'MuiTypography-root MuiTypography-body')])[4]",
        all_Sensors: "(//p[contains(@class,'MuiTypography-root MuiTypography-body')])[2]",
        env_Id: "//p[contains(text(),'ENV')]",
    },
    button: {

        last_13_Months: "//button[text()='Last 13 months']",
        calender_Year: "//button[text()='Calendar year']",
        last_37_Months: "//button[text()='Last 37 months']",
        energy_Usage_Click: "//div[contains(@class,'energy-usage_header')]//p[contains(@class,'energy-usage_subTitle')]",
    },
    img: {
        off_Status: '//img[contains(@src, "/_next/static/media/sensor-offline")]',
        Online_Status: '//img[contains(@src, "/_next/static/media/sensor-online")]',
        all_Status: '//img[contains(@src, "/_next/static/media/sensor")]',
        selectX: "//select[@id=':rms:']",
        // energyUsageGraph: "//*[name()='g' and contains(@class,'recharts-layer recharts-cartesian-axis-tick')]",
        energyUsageGraph: "//div[contains(@class,'energy-usage_graph')]//*[contains(@class, 'recharts-xAxis') and name() ='g']//*[name()='g' and contains(@class,'recharts-layer recharts-cartesian-axis-tick')]",
        energyUseIntensity: "//div[contains(@class,'energy-use-intensity_graph')]//*[contains(@class, 'recharts-xAxis') and name() ='g']//*[name()='g' and contains(@class,'recharts-layer recharts-cartesian-axis-tick')]",
    }
}