import { SetStateAction } from "react";
import { fetchWeatherApi } from 'openmeteo';

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

type siteInfoType = [string, string, string];

export async function getRiverData(setlastUpdated: { (value: SetStateAction<string>): void; (arg0: string): void; }) {
    // initialize riverInfo to be a dictionary of river info where the key = site name and value = info
    const riverInfo: { [siteName: string]: RiverInfoType } = {};
    const siteInfo = new Array<siteInfoType>();

    // get current river info and update river info
    await getSiteData(setlastUpdated, riverInfo, siteInfo);
    
    // get historic water data and update river info
    await getHistoricData(riverInfo);

    // get weather forcast
    await getWeatherData(riverInfo, siteInfo);
    
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
  for (const w in camelCaseWords) {
    const word = camelCaseWords[w];
    if (word === "Id" || word === "Co" || word === "Ut" || word === "Az" || word === "Wy" || word === "Wa") {
      camelCaseWords[w] = word.toUpperCase();
    }
  }

  // Join the words back together
  return camelCaseWords.join(' ');
}

/**
 * helper function that gets translates the weather code retrieved from the OpenMeteo API into its weather descriptions
 * @param code an int that represents the weather
 * @returns the correct weather description
 */
function getWeatherDescription(code: number) {
  const weatherDescriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light intensity",
    53: "Drizzle: Moderate intensity",
    55: "Drizzle: Dense intensity",
    56: "Freezing Drizzle: Light intensity",
    57: "Freezing Drizzle: Dense intensity",
    61: "Rain: Slight intensity",
    63: "Rain: Moderate intensity",
    65: "Rain: Heavy intensity",
    66: "Freezing Rain: Light intensity",
    67: "Freezing Rain: Heavy intensity",
    71: "Snow fall: Slight intensity",
    73: "Snow fall: Moderate intensity",
    75: "Snow fall: Heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",
    85: "Snow showers: Slight",
    86: "Snow showers: Heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };

  return weatherDescriptions[code] || "Unknown weather code";
}

/**
 * uses the OpenMeteo API to get weather info near the river sites
 * @param riverInfo the dictionary that keeps track of river info
 * @param siteInfo a list of coords and site names used for the API call and adding the forecast to the correct site
 */
async function getWeatherData(riverInfo: { [siteName: string]: RiverInfoType }, siteInfo: siteInfoType[]) {
  // get current date and date 2 days from now to be used in API call
  const startDate = new Date().toISOString().substring(0,10);
  const temp = new Date();
  temp.setDate(temp.getDate() + 2);
  const endDate = temp.toISOString().substring(0,10);

  const params = {
    "latitude": siteInfo.map(row => row[0]),
    "longitude": siteInfo.map(row => row[1]),
    "daily": ["temperature_2m_max", "temperature_2m_min", "weather_code"],
    "current": ["temperature_2m", "weather_code"],
    "timezone": ["auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
    "wind_speed_unit": "mph",
    "temperature_unit": "fahrenheit",
    "precipitation_unit": "inch",
    "start_date": [startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate, startDate],
    "end_date": [endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate, endDate]
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // loop through and process each site
  for (const index in responses) {
    const response = responses[index];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    // get arrays of daily temp data
    const daily = response.daily()!;
    const temperature2mMax = daily.variables(0)!.valuesArray()!;
    const temperature2mMin = daily.variables(1)!.valuesArray()!;
    const weatherCode = daily.variables(2)!.valuesArray()!;
    const time = [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
			(_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000).toUTCString().substring(0,3)
		);

    // build forecast item
    const forecastItems = new Array<ForecastItem>(3);
    for (let i = 0; i < 3; i++) {
      const f: ForecastItem = {
        "day": time[i],
        "condition": getWeatherDescription(weatherCode[i]),
        "high": Math.floor(temperature2mMax[i]),
        "low": Math.floor(temperature2mMin[i])
      }
      forecastItems[i] = f;
    }

    const name = siteInfo[index][2];
    riverInfo[name].forecast = forecastItems;
  }
}

/**
 * uses the USGS API to get basic site info like name, coords, flow rate, and water temp
 * @param setlastUpdated used to set when the river info was last updated on the website
 * @param riverInfo dictionary that will track site info
 * @param siteInfo empty array that will hold each site's coords and name
 */
async function getSiteData(setlastUpdated: (arg0: string) => void, riverInfo: { [siteName: string]: RiverInfoType }, siteInfo: siteInfoType[]) {
  try {
    // get the name, flowRate, and water temp
    const response = await fetch('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09180000,09165000,09166500,09211200,09234500,09261000,09346400,09379500,09260050,09058000,09085100,09163500,09180500,09380000,09405500,09406000,09415000,13290450,13334300,13135000,13022500,13317000,13309220,13235000,13246000&siteStatus=active&parameterCd=00060,00010')
    
    // turn response into JSON
    const data = await response.json(); 
    const dataList = data.value.timeSeries;
    
    // get last updated time
    const date = dataList[0].values[0].value[0].dateTime;
    setlastUpdated(date.substring(0, 10));

    let id = 0;
    
    for (const index in dataList) {
      const entry = dataList[index];
      const siteName = toNormalCase(entry.sourceInfo.siteName);

      // if we have not seen this site before, add it as a default value
      if (!riverInfo[siteName]) {
        // bind lat and long to site name for weather later
        const lat = entry.sourceInfo.geoLocation.geogLocation.latitude;
        const long = entry.sourceInfo.geoLocation.geogLocation.longitude;
        siteInfo.push([lat, long, siteName]);

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
}

/**
 * Uses the USGS API to get the historic info about a river, specifically what the average flow rate for a river was 1 year ago today
 * @param riverInfo dictionary that will track site info
 */
async function getHistoricData(riverInfo: { [siteName: string]: RiverInfoType }) {
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
}
