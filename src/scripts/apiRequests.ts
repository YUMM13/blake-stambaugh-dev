export type ForecastItem = {
  day: string;
  condition: string;
  high: number;
  low: number;
};

export type RiverInfoType = {
  id: number,
  flowRate: number,
  temperature: number,
  lastYearFlow: number,
  forecast: ForecastItem[],
};

// var defaultVal = {
//             "id": 1,
//             "flowRate": 0,
//             "temperature": 0,
//             "lastYearFlow": 0,
//             "forecast": [
//               { day: "Today", condition: "Unknown", high: 0, low: 0 },
//             ],
//           }

export async function getRiverData() {
    // initialize riverInfo to be a dictionary of river info where the key = site name and value = info
    var riverInfo: { [id: string]: RiverInfoType } = {};
    try {
      // get the name, flowRate, and water temp
      fetch('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09180000,09165000,09166500,09211200,09234500,09261000,09346400,09379500,09260050,09058000,09085100,09163500,09180500,09380000,09405500,09406000,09415000,13290450,13334300,13135000,13022500,13317000,13309220,13235000,13246000&siteStatus=active&parameterCd=00060,00010') // will want to get all sites and pass them in using the site
        .then((response) => response.json()) // turn response into JSON
        .then((data) => { // parse data
          let dataList = data.value.timeSeries;
          for (let index in dataList) {
            let entry = dataList[index];
            let siteName = entry.sourceInfo.siteName;

            // check if river has already been added
            if (riverInfo.hasOwnProperty(siteName)) {
              // check if its stream flow, else its temperature
              if (entry.variable.variableCode[0].value == "00060") {
                riverInfo[siteName].flowRate = entry.values[0].value[0].value;
              }
              else {
                riverInfo[siteName].temperature = entry.values[0].value[0].value;
              }
            }
            else {
              // check if its stream flow
              if (entry.variable.variableCode[0].value == "00060") {
                riverInfo[siteName] = {
                  "id": 1,
                  "flowRate": entry.values[0].value[0].value,
                  "temperature": 0,
                  "lastYearFlow": 0,
                  "forecast": [
                    { day: "Today", condition: "Unknown", high: 0, low: 0 },
                  ],
                }
              }
              else {
                riverInfo[siteName] = {
                  "id": 1,
                  "flowRate": 0,
                  "temperature": entry.values[0].value[0].value,
                  "lastYearFlow": 0,
                  "forecast": [
                    { day: "Today", condition: "Unknown", high: 0, low: 0 },
                  ],
                }
              }
            }
          }
        });
    }
    catch(error) {
        console.error("Error fetching river data: ", error);
    }
    // get historic water data

    // get weather forcast

    return riverInfo;
  }