"use client";

import { useEffect, useState } from "react"
import { Cloud, Droplet, History, Thermometer } from "lucide-react"

import { RiverSidebar } from "@/components/river-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

// Mock data for rivers
const rivers = [
  {
    id: "2",
    name: "Blue Creek",
    flowRate: 450,
    temperature: 62,
    weather: "Sunny",
    lastYearFlow: 520,
    forecast: [
      { day: "Today", condition: "Sunny", high: 75, low: 58 },
      { day: "Tomorrow", condition: "Partly Cloudy", high: 73, low: 57 },
      { day: "Wednesday", condition: "Sunny", high: 78, low: 59 },
    ],
  },
  {
    id: "3",
    name: "Cedar River",
    flowRate: 890,
    temperature: 56,
    weather: "Cloudy",
    lastYearFlow: 750,
    forecast: [
      { day: "Today", condition: "Cloudy", high: 65, low: 52 },
      { day: "Tomorrow", condition: "Rain", high: 62, low: 50 },
      { day: "Wednesday", condition: "Partly Cloudy", high: 68, low: 53 },
    ],
  },
  {
    id: "4",
    name: "Maple Stream",
    flowRate: 320,
    temperature: 60,
    weather: "Sunny",
    lastYearFlow: 290,
    forecast: [
      { day: "Today", condition: "Sunny", high: 74, low: 56 },
      { day: "Tomorrow", condition: "Sunny", high: 76, low: 58 },
      { day: "Wednesday", condition: "Partly Cloudy", high: 72, low: 55 },
    ],
  },
  {
    id: "5",
    name: "Pine Creek",
    flowRate: 680,
    temperature: 54,
    weather: "Rain",
    lastYearFlow: 720,
    forecast: [
      { day: "Today", condition: "Rain", high: 60, low: 48 },
      { day: "Tomorrow", condition: "Cloudy", high: 64, low: 50 },
      { day: "Wednesday", condition: "Partly Cloudy", high: 68, low: 52 },
    ],
  },
]

type ForecastItem = {
  day: string;
  condition: string;
  high: number;
  low: number;
};

type RiverInfoType = {
  id: number,
  name: string,
  flowRate: number,
  temperature: number,
  lastYearFlow: number,
  forecast: ForecastItem[],
};

export default function RiverDashboard() {
  const [selectedRiver, setSelectedRiver] = useState(rivers[0])
  let defaultVal = {
            "id": 1,
            "name": "Error fetching river data",
            "flowRate": 0,
            "temperature": 0,
            "lastYearFlow": 0,
            "forecast": [
              { day: "Today", condition: "Unknown", high: 0, low: 0 },
            ],
          }
  const [info, setInfo] = useState<RiverInfoType>(defaultVal);

  async function getRiverData() {
    try {
      // get the river info
      fetch('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=13154500&siteStatus=all') // will want to get all sites and pass them in using the site
        .then((response) => response.json()) // turn response into JSON
        .then((data) => { // parse data
          let riverInfo = {
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
          setInfo(riverInfo);
        });
    }
    catch(error) {
      console.error("Error fetching river data: ", error);
      let riverInfo = {
            "id": 1,
            "name": "Error fetching river data",
            "flowRate": 0,
            "temperature": 0,
            "lastYearFlow": 0,
            "forecast": [
              { day: "Today", condition: "Unknown", high: 0, low: 0 },
            ],
          }
          setInfo(riverInfo);
    }
  }

  useEffect(() => {
    getRiverData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      <SidebarProvider>
        <RiverSidebar
          rivers={rivers}
          selectedRiverId={selectedRiver.id}
          onSelectRiver={(river) => setSelectedRiver(river)}
        />
        <SidebarInset>
          <header className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm p-4">
            <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400">{info.name}</h1>
          </header>
          <main className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Current Flow Rate */}
              <Card className="border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                    <Droplet className="h-5 w-5" />
                    Current Flow Rate
                  </CardTitle>
                  <CardDescription>Live measurement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {info.flowRate} CFS
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Cubic feet per second (CFS) measures the volume of water passing a point in one second
                  </p>
                </CardContent>
              </Card>

              {/* Water Temperature */}
              <Card className="border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Water Temperature
                  </CardTitle>
                  <CardDescription>Current reading</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {info.temperature}°C
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Water temperature affects oxygen levels and aquatic life
                  </p>
                </CardContent>
              </Card>

              {/* Weather Forecast */}
              <Card className="border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Weather Forecast
                  </CardTitle>
                  <CardDescription>3-day outlook</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {info.forecast.map((day) => (
                      <div
                        key={day.day}
                        className="flex justify-between items-center border-b border-blue-100 dark:border-blue-900 pb-2"
                      >
                        <div className="font-medium">{day.day}</div>
                        <div className="text-gray-600 dark:text-gray-300">{day.condition}</div>
                        <div className="text-sm">
                          {day.high}°F / {day.low}°F
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Historical Flow Rate */}
              <Card className="border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historical Flow Rate
                  </CardTitle>
                  <CardDescription>Same day last year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {info.lastYearFlow} CFS
                  </div>
                  <div className="mt-2 flex items-center">
                    <span
                      className={`text-sm ${info.flowRate > info.lastYearFlow ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {info.flowRate > info.lastYearFlow
                        ? `+${info.flowRate - info.lastYearFlow} CFS increase`
                        : `-${info.lastYearFlow - info.flowRate} CFS decrease`}
                      from last year
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
        <footer className="fixed bottom-0 right-0 p-3 text-xs text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm rounded-tl-md border-t border-l border-green-200 dark:border-green-800">
          <p>Last updated: 01/01/2025</p>
          <p>Info is gathered from the USGS and NOAA, all information is provisional and may (although unlikely) be incorrect.</p>
        </footer>
      </SidebarProvider>
    </div>
  )
}
