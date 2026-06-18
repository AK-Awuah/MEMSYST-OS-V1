import { delay } from "./shared-store"
import type { Notification } from "@/types"
import type { INotificationEngineService } from "./INotificationEngineService"

export class MockNotificationEngineService implements INotificationEngineService {
  private history: Notification[] = []

  async triggerNotification(tenantId: string, event: string, recipientId: string, data?: Record<string, unknown>): Promise<void> {
    await delay(200)
    const notif: Notification = {
      id: `ne-${Date.now()}`,
      type: event as Notification["type"],
      title: event,
      message: data?.message as string || `Event: ${event}`,
      recipientId,
      status: "unread",
      createdAt: new Date().toISOString(),
    }
    this.history.unshift(notif)
  }

  async getNotificationHistory(tenantId: string, filters?: { status?: string; channel?: string; from?: string; to?: string }): Promise<Notification[]> {
    await delay(200)
    let result = [...this.history].filter((n) => n.recipientId && n.recipientId.length > 0)
    if (filters?.status) result = result.filter((n) => n.status === filters.status)
    if (filters?.from) result = result.filter((n) => new Date(n.createdAt) >= new Date(filters.from!))
    if (filters?.to) result = result.filter((n) => new Date(n.createdAt) <= new Date(filters.to!))
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getNotificationStats(tenantId: string): Promise<{ total: number; sent: number; delivered: number; failed: number }> {
    await delay(100)
    const total = this.history.length
    const sent = this.history.filter((n) => n.status === "unread").length
    const delivered = this.history.filter((n) => n.status === "read").length
    const failed = 0
    return { total, sent, delivered, failed }
  }
}
