"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, ShoppingBag, MapPin, Users, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "next-auth/react"

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

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      try {
        await signOut({
          callbackUrl: "/login",
          redirect: true,
        })
        toast.success("Logged out successfully")
      } catch (error) {
        toast.error("Error logging out")
      }
    }
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r">
      <div className="flex items-center p-6 border-b">
        <h1 className="text-xl font-bold text-gray-900">Preissler's Lunch</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-3 text-left font-normal rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-3 text-left font-normal text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
