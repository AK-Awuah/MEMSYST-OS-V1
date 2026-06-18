"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/AuthContext"
import { getNotificationService } from "@/lib/services"
import { Bell, LogOut, Settings, Search, User, KeyRound } from "lucide-react"

export function TopNav() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      getNotificationService().then((svc) => {
        svc.getUnreadCount(user.id).then(setUnreadCount)
      })
    }
  }, [user])

  function handleClickOutside(e: MouseEvent) {
    if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
      setShowProfile(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#1e3a5f] bg-[#011B2B]/95 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                router.push(`/app/leads?search=${encodeURIComponent(searchQuery.trim())}`)
                setSearchQuery("")
              }
            }}
            className="w-64 rounded-lg border border-[#1e3a5f] bg-[#012a42] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9]/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/app/notifications" className="relative text-gray-400 hover:text-white">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#3CA4F9]/20 text-sm font-semibold text-[#3CA4F9] hover:bg-[#3CA4F9]/30"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
            ) : (
              user ? `${user.firstName[0]}${user.lastName[0]}` : "?"
            )}
          </button>

          {showProfile && (
            <div className="absolute right-0 top-10 w-56 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-2 shadow-xl">
              <div className="border-b border-[#1e3a5f] p-3">
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="p-1">
                <Link
                  href="/app/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-[#1e3a5f]/50 hover:text-white"
                  onClick={() => setShowProfile(false)}
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <Link
                  href="/app/change-password"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-[#1e3a5f]/50 hover:text-white"
                  onClick={() => setShowProfile(false)}
                >
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </Link>
                <Link
                  href="/app/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-[#1e3a5f]/50 hover:text-white"
                  onClick={() => setShowProfile(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <hr className="my-1 border-[#1e3a5f]" />
                <button
                  onClick={() => { setShowProfile(false); logout() }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-[#1e3a5f]/50 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
