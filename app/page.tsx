"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { PageHeader } from "@/components/layout/page-header"
import { DashboardStats, RevenueChart, NewUserChart } from "@/components/dashboard-stats"
import { AuthWrapper } from "@/components/auth/auth-wrapper"

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <AppLayout>
        <PageHeader title="Overview" breadcrumbs={["Dashboard", "Overview"]} />

        <div className="p-6">
          {/* Stats Cards */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <RevenueChart />
            <NewUserChart />
          </div>
        </div>
      </AppLayout>
    </AuthWrapper>
  )
}
