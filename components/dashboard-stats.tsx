"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { getDashboardStats } from "@/lib/api"
import { DollarSign, Users, ShoppingBag } from "lucide-react"
import { useState } from "react"

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  })

  console.log(stats)

  const [revenueFilter, setRevenueFilter] = useState<"day" | "week" | "month">("day")
  const [userFilter, setUserFilter] = useState<"day" | "week" | "month">("month")

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
            <DollarSign className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats?.totalRevenue || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total User</CardTitle>
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
            <Users className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          <div className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs inline-block">
            {stats?.totalUsers || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Today Order</CardTitle>
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
            <ShoppingBag className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.todaysOrders || 0}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export function RevenueChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  })

  const [filter, setFilter] = useState<"day" | "week" | "month">("day")

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-16" />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Mock chart data for demonstration
  const chartData = [
    { day: "1 D", value: 55 },
    { day: "2 D", value: 70 },
    { day: "3 D", value: 55 },
    { day: "4 D", value: 80 },
    { day: "5 D", value: 70 },
    { day: "6 D", value: 85 },
    { day: "7 D", value: 75 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue report</CardTitle>
        <div className="flex gap-2">
          {(["day", "week", "month"] as const).map((period) => (
            <Button
              key={period}
              variant={filter === period ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(period)}
              className={filter === period ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="bg-red-500 w-8 rounded-t" style={{ height: `${(item.value / 100) * 200}px` }} />
              <span className="text-xs text-gray-600">{item.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function NewUserChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  })

  const [filter, setFilter] = useState<"day" | "week" | "month">("month")

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-16" />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Mock line chart data
  const lineData = [
    { month: "Jan", value: 0 },
    { month: "Feb", value: 1500 },
    { month: "Mar", value: 1200 },
    { month: "Apr", value: 3000 },
    { month: "May", value: 3800 },
    { month: "Jun", value: 3200 },
    { month: "July", value: 2000 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>New User</CardTitle>
        <div className="flex gap-2">
          {(["day", "week", "month"] as const).map((period) => (
            <Button
              key={period}
              variant={filter === period ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(period)}
              className={filter === period ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <svg className="w-full h-full">
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points={lineData
                .map((item, index) => `${(index / (lineData.length - 1)) * 100}%,${100 - (item.value / 4000) * 100}%`)
                .join(" ")}
            />
            {lineData.map((item, index) => (
              <circle
                key={index}
                cx={`${(index / (lineData.length - 1)) * 100}%`}
                cy={`${100 - (item.value / 4000) * 100}%`}
                r="4"
                fill="#10b981"
              />
            ))}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
            {lineData.map((item, index) => (
              <span key={index}>{item.month}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
