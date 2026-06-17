import type { Notification } from "@/types"

export interface INotificationService {
  listNotifications(userId: string): Promise<Notification[]>
  getUnreadCount(userId: string): Promise<number>
  markAsRead(id: string): Promise<void>
  markAllAsRead(userId: string): Promise<void>
  archive(id: string): Promise<void>
  createNotification(data: Omit<Notification, "id" | "createdAt">): Promise<Notification>
}
