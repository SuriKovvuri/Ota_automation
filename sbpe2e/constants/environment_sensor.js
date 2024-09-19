export const environment_Sensor = {
    "Carbon Monoxide" : {
        bands:[
                { min: 0, max: 4.4, band: "Excellent" },
                { min: 4.4, max: 9.4, band: "Good" },
                { min: 9.4, max: 12.4, band: "Moderate"},
                { min: 12.4, band: "Poor" },
            ],
        unit: "PPM"
    },

    "Carbon Dioxide" : {
        bands:[
            { min: 0, max: 650, band: "Excellent" },
            { min: 650, max: 950, band: "Good" },
            { min: 950, max: 1500, band: "Moderate" },
            { min: 1500, band: "Poor" },
            ],
        unit: "PPM"
    },

    "Formaldehyde" : {
        bands:[
            { min: 0, max: 27, band: "Excellent" },
            { min: 27, max: 2000, band: "Good"  },
            { min: 2000, max: 5000, band: "Moderate" },
            { min: 5000,  band: "Poor" },
        ],
        unit: "PPB"
    },

    "Relative Humidity" : {
        bands:[
         { min: 0, max: 10, band: "Poor" },
        { min: 10, max: 20, band: "Moderate" },
        { min: 20, max: 30, band: "Good" },
        { min: 30, max: 60, band: "Excellent" },
        { min: 60, max: 70, band: "Good" },
        { min: 70, max: 80, band: "Moderate" },
        { min: 80, band: "Poor" },
        ],
        unit: "%"
    },

    "Light Intensity" : {
        bands:[
        { min: 0, max: 200, band: "Moderate" },
        { min: 200, max: 3000, band: "Excellent" },
        { min: 3000,  band: "Moderate" },
        ],
        unit: "lux"
    },

    "Ozone" : {
        bands:[
            { min: 0, max: 54, band: "Excellent" },
            { min: 54, max: 70, band: "Good" },
            { min: 70, max: 85, band: "Moderate" },
            { min: 85,  band: "Poor" },
        ],
        unit: "PPB"
    },

    "PM 1.0" : {
        bands:[
            { min: 0, max: 15, band: "Excellent" },
            { min: 15, max: 35.4, band: "Good" },
            { min: 35.4, max: 55.4, band: "Moderate" },
            { min: 55.4,  band: "Poor" },
        ],
        unit: "µg/m³"
    },

    "PM 10.0" : {
        bands:[
        { min: 0, max: 54, band: "Excellent" },
        { min: 54, max: 154, band: "Good" },
        { min: 154, max: 254, band: "Moderate" },
        { min: 254, band: "Poor" },
        ],
        unit: "µg/m³"
    },

    "PM 2.5" : {
        bands:[
            { min: 0, max: 12, band: "Excellent" },
            { min: 12, max: 22, band: "Good" },
            { min: 22, max: 35, band: "Moderate" },
            { min: 35,  band: "Poor" },
        ],
        unit: "µg/m³"
    },

    "Temperature" : {
        bands:[
            { min: 0, max: 64, band: "Poor" },
        { min: 64, max: 68, band: "Moderate" },
        { min: 68, max: 70, band: "Good" },
        { min: 70, max: 74, band: "Excellent" },
        { min: 74, max: 76, band: "Good" },
        { min: 76, max: 80, band: "Moderate" },
        { min: 80, band: "Poor" },
        ],
        unit: "˚F"
    },

    "VOC" : {
        bands:[
            { min: 0, max: 500, band: "Excellent"  },
            { min: 500, max: 1000, band: "Good"  },
            { min: 1000, max: 2000, band: "Moderate" },
            { min: 2000, band: "Poor" },
        ],
        unit: "index"
    }

}

