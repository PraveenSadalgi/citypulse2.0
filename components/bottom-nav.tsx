"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Plus, Home, MessageSquare, Search, BarChart2, User, Heart } from "lucide-react"

type Item = { 
  href: string 
  label: string 
  icon: LucideIcon 
  activeIcon?: LucideIcon
}

const navItems: Item[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/analytics", label: "", icon: BarChart2 }, // Empty label for the center button
  { href: "/donate", label: "Donate", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const isHome = pathname === '/home' || pathname === '/'
  
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 sm:hidden">
      <nav className="relative mx-auto max-w-md">
        <div className="relative rounded-2xl bg-white/95 px-4 shadow-xl shadow-black/5 backdrop-blur-lg border border-gray-100">
          <ul className="relative flex items-center justify-between">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const isCenter = item.href === "/analytics"
              const Icon = item.icon
              
              if (isCenter) {
                return (
                  <li key={item.href} className="relative -top-6">
                    <Link
                      href="/analytics"
                      aria-label="View leaderboard"
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200/80 transition-all hover:scale-105 hover:shadow-xl hover:shadow-green-200/50"
                    >
                      <BarChart2 className="h-6 w-6" strokeWidth={2.5} />
                    </Link>
                  </li>
                )
              }
              
              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex flex-col items-center py-3 px-1 text-xs font-medium transition-all",
                      isActive ? "text-green-600" : "text-gray-500 hover:text-green-600"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className={cn(
                      "mb-1.5 rounded-xl p-2 transition-all",
                      isActive 
                        ? "bg-green-100/80 text-green-600" 
                        : "text-gray-400 group-hover:bg-green-50 group-hover:text-green-500"
                    )}>
                      <Icon className={cn("h-5 w-5 transition-transform", isActive ? "scale-110" : "group-hover:scale-105")} />
                    </div>
                    <span className={cn("text-[10px] font-medium transition-all", isActive ? "text-green-600" : "text-gray-500")}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </div>
  )
}
