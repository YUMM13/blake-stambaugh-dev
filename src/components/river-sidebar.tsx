"use client";

import { Droplet } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { RiverInfoType } from "@/scripts/apiRequests";

// type River = {
//   id: string
//   name: string
//   flowRate: number
//   temperature: number
//   weather: string
//   lastYearFlow: number
//   forecast: Array<{
//     day: string
//     condition: string
//     high: number
//     low: number
//   }>
// }

interface RiverSidebarProps {
  rivers: { siteName: string; value: RiverInfoType; }[]
  selectedRiverId: number
}

export function RiverSidebar({ rivers, selectedRiverId }: RiverSidebarProps) {
  return (
    <Sidebar className="border-r border-blue-200 dark:border-blue-800">
      <SidebarHeader className="border-b border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-blue-500 dark:text-blue-400 flex items-center gap-2">
            <Droplet className="h-6 w-6" />
            The River Report
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">Local waterways status</p>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm">
        <SidebarMenu>
          {rivers.map((river) => (
            <SidebarMenuItem key={river.value.id}>
              <SidebarMenuButton
                isActive={river.value.id === selectedRiverId}
                className="hover:bg-green-100 dark:hover:bg-green-900/30 data-[active=true]:bg-green-200 dark:data-[active=true]:bg-green-800/40 py-6 px-4"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{river.siteName}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{river.value.flowRate} CFS</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
