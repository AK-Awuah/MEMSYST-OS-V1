import type { INotificationService } from "./INotificationService"
import type { Notification } from "@/types"
import { mockNotifications } from "./mock-data"

let notifications = [...mockNotifications]

export class MockNotificationService implements INotificationService {
  async listNotifications(userId: string): Promise<Notification[]> {
    await delay(200)
    return notifications
      .filter((n) => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getUnreadCount(userId: string): Promise<number> {
    await delay(100)
    return notifications.filter((n) => n.recipientId === userId && n.status === "unread").length
  }

  async markAsRead(id: string): Promise<void> {
    await delay(100)
    const notif = notifications.find((n) => n.id === id)
    if (notif) notif.status = "read"
  }

  async markAllAsRead(userId: string): Promise<void> {
    await delay(200)
    notifications
      .filter((n) => n.recipientId === userId && n.status === "unread")
      .forEach((n) => { n.status = "read" })
  }

  async archive(id: string): Promise<void> {
    await delay(100)
    const notif = notifications.find((n) => n.id === id)
    if (notif) notif.status = "archived"
  }

  async createNotification(data: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    await delay(200)
    const notif: Notification = {
      ...data,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    notifications.unshift(notif)
    return notif
  }

  async deleteNotification(id: string): Promise<void> {
    await delay(100)
    notifications = notifications.filter((n) => n.id !== id)
  }

  async listByType(userId: string, type: string): Promise<Notification[]> {
    await delay(200)
    return notifications
      .filter((n) => n.recipientId === userId && n.type === type)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    await delay(100)
    return notifications.find((n) => n.id === id) || null
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
