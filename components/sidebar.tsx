"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, Calendar, ShoppingBag, MapPin, Users, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Calendar, label: "Monday", href: "/monday" },
  { icon: Calendar, label: "Tuesday", href: "/tuesday" },
  { icon: Calendar, label: "Wednesday", href: "/wednesday" },
  { icon: Calendar, label: "Thursday", href: "/thursday" },
  { icon: Calendar, label: "Friday", href: "/friday" },
  { icon: ShoppingBag, label: "Order", href: "/orders" },
  { icon: MapPin, label: "Location", href: "/locations" },
  { icon: Users, label: "User Profile", href: "/users" },
  { icon: Settings, label: "Setting", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h1 className="text-xl font-bold text-gray-900">Preissler's Lunch</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Mr. Raja</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/professional-man.png" />
            <AvatarFallback>MR</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2 text-left font-normal",
                  isActive
                    ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2 text-left font-normal text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
