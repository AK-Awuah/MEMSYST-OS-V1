"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { useAuth } from "@/features/auth/AuthContext"
import { getNotificationService } from "@/lib/services"
import type { Notification } from "@/types"
import { Bell, CheckCheck, Archive } from "lucide-react"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getNotificationService().then((svc) => {
      svc.listNotifications(user.id).then((data) => {
        setNotifications(data)
        setLoading(false)
      })
    })
  }, [user])

  async function handleMarkRead(id: string) {
    const svc = await getNotificationService()
    await svc.markAsRead(id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, status: "read" } : n))
  }

  async function handleMarkAllRead() {
    if (!user) return
    const svc = await getNotificationService()
    await svc.markAllAsRead(user.id)
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })))
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" /></div>
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Notifications"
        description="Stay updated on platform activity"
        actions={
          <button onClick={handleMarkAllRead} className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white">
            <CheckCheck className="h-4 w-4" /> Mark All Read
          </button>
        }
      />

      <div className="space-y-2">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Bell className="mb-2 h-8 w-8" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
              n.status === "unread"
                ? "border-[#3CA4F9]/30 bg-[#3CA4F9]/5"
                : "border-[#1e3a5f] bg-[#012a42]"
            }`}
          >
            <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${n.status === "unread" ? "bg-[#3CA4F9]" : "bg-transparent"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{n.title}</p>
              <p className="text-sm text-gray-400">{n.message}</p>
              <p className="mt-1 text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {n.status === "unread" && (
                <button onClick={() => handleMarkRead(n.id)} className="rounded-lg p-2 text-gray-500 hover:bg-[#1e3a5f] hover:text-white">
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
