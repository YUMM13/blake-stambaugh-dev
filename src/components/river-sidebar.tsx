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

type River = {
  id: string
  name: string
  flowRate: number
  temperature: number
  weather: string
  lastYearFlow: number
  forecast: Array<{
    day: string
    condition: string
    high: number
    low: number
  }>
}

interface RiverSidebarProps {
  rivers: River[]
  selectedRiverId: string
  onSelectRiver: (river: River) => void
}

export function RiverSidebar({ rivers, selectedRiverId, onSelectRiver }: RiverSidebarProps) {
  return (
    <Sidebar className="border-r border-blue-200 dark:border-blue-800">
      <SidebarHeader className="border-b border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-blue-500 dark:text-blue-400 flex items-center gap-2">
            <Droplet className="h-5 w-5" />
            The River Report
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Local waterways status</p>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm">
        <SidebarMenu className="space-y-2">
          {rivers.map((river) => (
            <SidebarMenuItem key={river.id}>
              <SidebarMenuButton
                isActive={river.id === selectedRiverId}
                onClick={() => onSelectRiver(river)}
                className="hover:bg-green-100 dark:hover:bg-green-900/30 data-[active=true]:bg-green-200 dark:data-[active=true]:bg-green-800/40 py-3 px-4"
              >
                <div className="flex flex-col py-1">
                  <span className="font-medium">{river.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{river.flowRate} CFS</span>
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
