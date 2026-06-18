import type { Notification } from "@/types"

export interface INotificationEngineService {
  triggerNotification(tenantId: string, event: string, recipientId: string, data?: Record<string, unknown>): Promise<void>
  getNotificationHistory(tenantId: string, filters?: { status?: string; channel?: string; from?: string; to?: string }): Promise<Notification[]>
  getNotificationStats(tenantId: string): Promise<{ total: number; sent: number; delivered: number; failed: number }>
}
