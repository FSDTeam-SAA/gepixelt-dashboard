"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-end bg-white border-b px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Mr. Raja</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/professional-man.png" />
          <AvatarFallback>MR</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
