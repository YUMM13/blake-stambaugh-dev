export type ForecastItem = {
  day: string;
  condition: string;
  high: number;
  low: number;
};

export type RiverInfoType = {
  id: number,
  name: string,
  flowRate: number,
  temperature: number,
  lastYearFlow: number,
  forecast: ForecastItem[],
};

export var defaultVal = {
            "id": 1,
            "name": "Error fetching river data",
            "flowRate": 0,
            "temperature": 0,
            "lastYearFlow": 0,
            "forecast": [
              { day: "Today", condition: "Unknown", high: 0, low: 0 },
            ],
          }

export async function getRiverData() {
    var riverInfo = {
            "id": 1,
            "name": "Error fetching river data",
            "flowRate": 0,
            "temperature": 0,
            "lastYearFlow": 0,
            "forecast": [
              { day: "Today", condition: "Unknown", high: 0, low: 0 },
            ],
          };
    try {
      // get the name, flowRate, and water temp
      fetch('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=13154500&siteStatus=all') // will want to get all sites and pass them in using the site
        .then((response) => response.json()) // turn response into JSON
        .then((data) => { // parse data
          riverInfo = {
            "id": 1,
            "name": data.value.timeSeries[0].sourceInfo.siteName,
            "flowRate": data.value.timeSeries[1].values[0].value[0].value,
            "temperature": data.value.timeSeries[0].values[0].value[0].value,
            "lastYearFlow": 1000,
            "forecast": [
              { day: "Today", condition: "Rain", high: 60, low: 48 },
              { day: "Tomorrow", condition: "Cloudy", high: 64, low: 50 },
              { day: "Wednesday", condition: "Partly Cloudy", high: 68, low: 52 },
            ],
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