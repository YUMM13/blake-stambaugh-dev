import { SetStateAction } from "react";

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

export async function getRiverData(setlastUpdated: { (value: SetStateAction<string>): void; (arg0: any): void; }) {
    // initialize riverInfo to be a dictionary of river info where the key = site name and value = info
    var riverInfo: { [siteName: string]: RiverInfoType } = {};
    var id = 0;
    try {
      // get the name, flowRate, and water temp
      const response = await fetch('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09180000,09165000,09166500,09211200,09234500,09261000,09346400,09379500,09260050,09058000,09085100,09163500,09180500,09380000,09405500,09406000,09415000,13290450,13334300,13135000,13022500,13317000,13309220,13235000,13246000&siteStatus=active&parameterCd=00060,00010') // will want to get all sites and pass them in using the site
      
      // turn response into JSON
      const data = await response.json(); 
      let dataList = data.value.timeSeries;

      // get last updated time
      let date = dataList[0].values[0].value[0].dateTime;
      setlastUpdated(date.substring(0, 10));

      for (let index in dataList) {
        let entry = dataList[index];
        let siteName = entry.sourceInfo.siteName;

        // if we have not seen this site before, add it as a default value
        if (!riverInfo[siteName]) {
          riverInfo[siteName] = {
            "id": id,
            "flowRate": 0,
            "temperature": 0,
            "lastYearFlow": 0,
            "forecast": [
              { day: "Today", condition: "Unknown", high: 0, low: 0 },
            ],
          }
          id = id + 1;
        }
        // check if its stream flow, else its temperature
        if (entry.variable.variableCode[0].value == "00060") {
          riverInfo[siteName].flowRate = entry.values[0].value[0].value;
        }
        else {
          let temp = Math.floor(entry.values[0].value[0].value * (9/5) + 32);
          riverInfo[siteName].temperature = temp;
        }
      }
    }
    catch(error) {
        console.error("Error fetching river data: ", error);
    }
    // get historic water data

    // get weather forcast

    return riverInfo;
  }