"use client";

import { useEffect, useState } from "react"
import { Cloud, Droplet, History, Thermometer } from "lucide-react"

import { RiverSidebar } from "@/components/river-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { getRiverData, RiverInfoType } from "@/scripts/apiRequests";

export default function RiverDashboard() {
  const [info, setInfo] = useState<{ siteName: string; value: RiverInfoType; }[]>([]);
  const [currentRiverIndex, setCurrentRiverIndex] = useState(1);
  const [lastUpdated, setlastUpdated] = useState("");

  useEffect(() => {
    console.log("getting data...");
    getRiverData(setlastUpdated).then((data) => {
      let parsedData = Object.entries(data).map(([siteName, value]) => ({ siteName, value }));
      setInfo(parsedData);
    });
  }, []);

  // Auto-cycle through rivers every 5 seconds
  // useEffect(() => {
  //   if (info.length === 0) return;
  //   const interval = setInterval(() => {
  //     setCurrentRiverIndex((prevIndex) => (prevIndex + 1) % info.length)
  //   }, 5000)

  //   return () => clearInterval(interval)
  // }, [info])

  if (info.length === 0) {
    return (<h1>loading info please wait</h1>)
  }
  
  const selectedRiver = info[currentRiverIndex];
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      <SidebarProvider>
        <RiverSidebar
          rivers={info}
          selectedRiverId={selectedRiver.value.id}
        />
        <SidebarInset>
          <header className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm p-4">
            <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400">{selectedRiver.siteName}</h1>
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
                    {selectedRiver.value.flowRate} CFS
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
                  <div>
                    {selectedRiver.value.temperature != 0 ? 
                      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{selectedRiver.value.temperature}°F</p> : 
                      <p className="text-2xl font-bole text-red-500">Water temperature is not available for this site</p>}
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
                    {selectedRiver.value.forecast.map((day) => (
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
                    {selectedRiver.value.lastYearFlow} CFS
                  </div>
                  <div className="mt-2 flex items-center">
                    <span
                      className={`text-sm ${selectedRiver.value.flowRate > selectedRiver.value.lastYearFlow ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {selectedRiver.value.flowRate > selectedRiver.value.lastYearFlow
                        ? `+${selectedRiver.value.flowRate - selectedRiver.value.lastYearFlow} CFS increase`
                        : `-${selectedRiver.value.lastYearFlow - selectedRiver.value.flowRate} CFS decrease`}
                      from last year
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
        <footer className="fixed bottom-0 right-0 p-3 text-xs text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm rounded-tl-md border-t border-l border-green-200 dark:border-green-800">
          <p>Last updated: {lastUpdated}</p>
          <p>Info is gathered from the USGS and OpenMateo, all information is provisional and may (although unlikely) be incorrect.</p>
        </footer>
      </SidebarProvider>
    </div>
  )
}

