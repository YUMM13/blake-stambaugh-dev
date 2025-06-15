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

export async function getRiverData(setlastUpdated: { (value: SetStateAction<string>): void; (arg0: string): void; }) {
    // initialize riverInfo to be a dictionary of river info where the key = site name and value = info
    const riverInfo: { [siteName: string]: RiverInfoType } = {};
    const siteInfo = new Array();
    let id = 0;

    // get current river info and update river info
    await getSiteData(setlastUpdated, riverInfo, id, siteInfo);
    
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
  camelCaseWords[camelCaseWords.length - 1] = camelCaseWords[camelCaseWords.length - 1].toUpperCase();

  // Join the words back together
  return camelCaseWords.join(' ');
}

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


async function getWeatherData(riverInfo: { [siteName: string]: RiverInfoType }, siteInfo: any[]) {
  // get current date and date 2 days from now to be used in API call
  const startDate = new Date().toISOString().substring(0,10);
  let temp = new Date();
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
              (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000).toDateString().substring(0,3)
		        );

    // build forecast item
    const forecastItems = new Array<ForecastItem>(3);
    for (let i = 0; i < 3; i++) {
      var f: ForecastItem = {
        "day": time[i],
        "condition": getWeatherDescription(weatherCode[i]),
        "high": Math.floor(temperature2mMax[i]),
        "low": Math.floor(temperature2mMin[i])
      }
      forecastItems[index] = f;
    }

    let name = siteInfo[index][2];
    console.log(siteInfo[index]);
    riverInfo[name].forecast = forecastItems;
  }
}

async function getSiteData(setlastUpdated: (arg0: string) => void, riverInfo: { [siteName: string]: RiverInfoType }, id: number, siteInfo: any[]) {
  try {
    // get the name, flowRate, and water temp
    const response = await fetch('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=09180000,09165000,09166500,09211200,09234500,09261000,09346400,09379500,09260050,09058000,09085100,09163500,09180500,09380000,09405500,09406000,09415000,13290450,13334300,13135000,13022500,13317000,13309220,13235000,13246000&siteStatus=active&parameterCd=00060,00010')
    
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
        // bind lat and long to site name for weather later
        let lat = entry.sourceInfo.geoLocation.geogLocation.latitude;
        let long = entry.sourceInfo.geoLocation.geogLocation.longitude;
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

// "latitude": [40.03665248, 39.5549819, 39.13276047, 37.63888428, 37.47249296, 38.79720805, 38.81054095, 42.0209722, 40.90829296, 40.45163387, 40.4093915, 37.01361667, 37.15067778, 36.8643333, 37.2097046, 37.2041494, 36.8916437, 43.1961111, 42.84851319, 44.08527778, 44.11416667, 45.2544444, 44.7215194, 45.75027778, 46.09706985],
//     "longitude": [-106.4400324, -107.337554, -109.0270546, -108.0603517, -108.4975908, -109.1951142, -109.2934493, -110.0498056, -109.422914, -108.525101, -109.2354283, -107.312267, -109.8666889, -111.5878722, -112.9785512, -113.1807789, -113.9244098, -110.8894444, -114.9014473, -115.6222222, -116.1072222, -116.6969444, -115.0143472, -116.3238889, -116.9776916],
    