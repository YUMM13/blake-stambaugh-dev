import { SetStateAction } from "react";

export type ForecastItem = {
  day: string;
  condition: string;
  high: number;
  low: number;
};

export type RiverInfoType = {
  id: number,
  flowRate: string,
  temperature: number,
  lastYearFlow: string,
  forecast: ForecastItem[],
};

export async function getRiverData(setlastUpdated: { (value: SetStateAction<string>): void; (arg0: string): void; }) {
    // initialize riverInfo to be a dictionary of river info where the key = site name and value = info
    const riverInfo: { [siteName: string]: RiverInfoType } = {};
    let id = 0;
    try {
      // get the name, flowRate, and water temp
      const response = await fetch('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09180000,09165000,09166500,09211200,09234500,09261000,09346400,09379500,09260050,09058000,09085100,09163500,09180500,09380000,09405500,09406000,09415000,13290450,13334300,13135000,13022500,13317000,13309220,13235000,13246000&siteStatus=active&parameterCd=00060,00010') // will want to get all sites and pass them in using the site
      
      // turn response into JSON
      const data = await response.json(); 
      const dataList = data.value.timeSeries;

      // get last updated time
      const date = dataList[0].values[0].value[0].dateTime;
      setlastUpdated(date.substring(0, 10));

      for (const index in dataList) {
        const entry = dataList[index];
        const siteName = toNormalCase(entry.sourceInfo.siteName);

        // if we have not seen this site before, add it as a default value
        if (!riverInfo[siteName]) {
          riverInfo[siteName] = {
            "id": id,
            "flowRate": "0",
            "temperature": 0,
            "lastYearFlow": "0",
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
          // if water temp <= 0, then it is probably a mistake and should be excluded
          if (temp <= 0 ? temp = 0 : 1)
          riverInfo[siteName].temperature = temp;
        }
      }
    }
    catch(error) {
        console.error("Error fetching river data: ", error);
    }
    // get historic water data
    try {
      // get the date a year ago from today
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1)
      const isoDate = date.toISOString().substring(0, 10);

      // call api to get avg flow from 1 year ago today
      const response = await fetch(`https://waterservices.usgs.gov/nwis/dv/?format=json&sites=09180000,09165000,09166500,09211200,09234500,09261000,09346400,09379500,09260050,09058000,09085100,09163500,09180500,09380000,09405500,09406000,09415000,13290450,13334300,13135000,13022500,13317000,13309220,13235000,13246000&statCd=00003&startDT=${isoDate}&endDT=${isoDate}&siteStatus=all&parameterCd=00060`);
      const data = await response.json();
      const dataList = data.value.timeSeries;

      // update river info
      for (const index in dataList) {
        const entry = dataList[index];
        const siteName = toNormalCase(entry.sourceInfo.siteName);
        riverInfo[siteName].lastYearFlow = entry.values[0].value[0].value;
      }
    }
    catch (error) {
      console.error("Error fetching historic river data: ", error);
    }
    // get weather forcast

    return riverInfo;
  }

  /**
   * helper function that converts a string into a normal case (the first letter of all words is capitalized)
   * @param str the string to be converted
   * @returns the normalized string
   */
  function toNormalCase(str: string) {
  // Convert the string to lowercase and replace hyphens/underscores with spaces
  const processedStr = str.toLowerCase();

  // Split the string into words
  const words = processedStr.split(' ');

  // Capitalize the first letter of subsequent words
  const camelCaseWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  // capitalize the last two letters (for the states)
  camelCaseWords[camelCaseWords.length - 1] = camelCaseWords[camelCaseWords.length - 1].toUpperCase();

  // Join the words back together
  return camelCaseWords.join(' ');
}