import type { INotificationService } from "./INotificationService"
import type { Notification } from "@/types"

export class FirebaseNotificationService implements INotificationService {
  async listNotifications(_userId: string): Promise<Notification[]> { return [] }
  async getUnreadCount(_userId: string): Promise<number> { return 0 }
  async markAsRead(_id: string): Promise<void> {}
  async markAllAsRead(_userId: string): Promise<void> {}
  async archive(_id: string): Promise<void> {}
  async createNotification(_data: Omit<Notification, "id" | "createdAt">): Promise<Notification> { throw new Error("Firebase not configured") }
}
