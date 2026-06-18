import { delay } from "./shared-store"
import { mockPushNotifications } from "./mock-data"
import type { PushNotificationRecord } from "@/types"
import type { IPushNotificationService } from "./IPushNotificationService"

export class MockPushNotificationService implements IPushNotificationService {
  private items = [...mockPushNotifications]

  async sendPush(tenantId: string, data: { recipientId: string; title: string; body: string; data?: Record<string, string>; senderId: string }): Promise<PushNotificationRecord> {
    await delay(300)
    const item: PushNotificationRecord = {
      id: `push-${Date.now()}`,
      tenantId,
      senderId: data.senderId,
      recipientId: data.recipientId,
      title: data.title,
      body: data.body,
      status: "sent",
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async sendBulkPush(tenantId: string, data: { recipients: string[]; title: string; body: string; senderId: string }): Promise<PushNotificationRecord[]> {
    await delay(500)
    const results = data.recipients.map((r) => {
      const item: PushNotificationRecord = {
        id: `push-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tenantId,
        senderId: data.senderId,
        recipientId: r,
        title: data.title,
        body: data.body,
        status: "queued",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.items.unshift(item)
      return item
    })
    return results
  }

  async schedulePush(tenantId: string, data: { recipientId: string; title: string; body: string; senderId: string; scheduledAt: string }): Promise<PushNotificationRecord> {
    await delay(200)
    const item: PushNotificationRecord = {
      id: `push-${Date.now()}`,
      tenantId,
      senderId: data.senderId,
      recipientId: data.recipientId,
      title: data.title,
      body: data.body,
      status: "queued",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async listPushNotifications(tenantId: string, filters?: { status?: string; from?: string; to?: string }): Promise<PushNotificationRecord[]> {
    await delay(200)
    let result = this.items.filter((p) => p.tenantId === tenantId)
    if (filters?.status) result = result.filter((p) => p.status === filters.status)
    if (filters?.from) result = result.filter((p) => new Date(p.createdAt) >= new Date(filters.from!))
    if (filters?.to) result = result.filter((p) => new Date(p.createdAt) <= new Date(filters.to!))
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getPushNotificationById(id: string): Promise<PushNotificationRecord | null> {
    await delay(100)
    return this.items.find((p) => p.id === id) || null
  }
}
