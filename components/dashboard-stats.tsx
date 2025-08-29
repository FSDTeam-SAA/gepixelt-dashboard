"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api";
import { DollarSign, Users, ShoppingBag } from "lucide-react";

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

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
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Revenue
          </CardTitle>
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
          <CardTitle className="text-sm font-medium text-gray-600">
            Total User
          </CardTitle>
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
            <Users className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Today Order
          </CardTitle>
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
            <ShoppingBag className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.todaysOrders || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RevenueChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { period: "Day", value: stats?.revenueReport?.day || 0 },
    { period: "Week", value: stats?.revenueReport?.week || 0 },
    { period: "Month", value: stats?.revenueReport?.month || 0 },
  ];

  const maxValue = Math.max(...chartData.map((item) => item.value), 100); // Ensure non-zero max for scaling

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Report</CardTitle>
      </CardHeader>
      <CardContent>
        <style jsx>{`
          .tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            transform: translate(-50%, -100%);
          }
          .bar-container:hover .tooltip {
            opacity: 1;
          }
        `}</style>
        <div className="h-64 flex items-end justify-between gap-2">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 bar-container relative"
            >
              <div
                className="bg-red-500 w-16 rounded-t relative"
                style={{ height: `${(item.value / maxValue) * 200}px` }}
              >
                <div className="tooltip" style={{ left: "50%", top: "-8px" }}>
                  {item.period}: ${item.value}
                </div>
              </div>
              <span className="text-xs text-gray-600">{item.period}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function NewUserChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const lineData = [
    { period: "Day", value: stats?.newUsers?.day || 0 },
    { period: "Week", value: stats?.newUsers?.week || 0 },
    { period: "Month", value: stats?.newUsers?.month || 0 },
  ];

  const maxValue = Math.max(...lineData.map((item) => item.value), 100); // Ensure non-zero max for scaling

  return (
    <Card>
      <CardHeader>
        <CardTitle>New User</CardTitle>
      </CardHeader>
      <CardContent>
        <style jsx>{`
          .tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            transform: translate(-50%, -100%);
          }
          .point-container:hover .tooltip {
            opacity: 1;
          }
        `}</style>
        <div className="h-64 relative">
          <svg className="w-full h-full">
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points={lineData
                .map(
                  (item, index) =>
                    `${(index / (lineData.length - 1)) * 100}%,${
                      100 - (item.value / maxValue) * 100
                    }%`
                )
                .join(" ")}
            />
            {lineData.map((item, index) => (
              <g key={index} className="point-container">
                <circle
                  cx={`${(index / (lineData.length - 1)) * 100}%`}
                  cy={`${100 - (item.value / maxValue) * 100}%`}
                  r="4"
                  fill="#10b981"
                />
                <foreignObject
                  x={`calc(${(index / (lineData.length - 1)) * 100}% - 50px)`}
                  y={`calc(${100 - (item.value / maxValue) * 100}% - 30px)`}
                  width="100"
                  height="20"
                >
                  <div className="tooltip" style={{ left: "50%", top: "0" }}>
                    {item.period}: {item.value}
                  </div>
                </foreignObject>
              </g>
            ))}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
            {lineData.map((item, index) => (
              <span key={index}>{item.period}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
