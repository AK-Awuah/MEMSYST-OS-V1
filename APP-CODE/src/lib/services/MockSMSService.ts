import { delay } from "./shared-store"
import { mockSMSMessages } from "./mock-data"
import type { SMSMessage } from "@/types"
import type { ISMSService } from "./ISMSService"

export class MockSMSService implements ISMSService {
  private items = [...mockSMSMessages]

  async sendSMS(tenantId: string, data: { recipientId: string; recipientPhone: string; message: string; senderId: string }): Promise<SMSMessage> {
    await delay(300)
    const item: SMSMessage = {
      id: `sms-${Date.now()}`,
      tenantId,
      senderId: data.senderId,
      recipientId: data.recipientId,
      recipientPhone: data.recipientPhone,
      message: data.message,
      units: 1,
      status: "sent",
      sentAt: new Date().toISOString(),
      cost: 0.30,
      markup: 0.05,
      totalCharge: 0.35,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async sendBulkSMS(tenantId: string, data: { recipients: { recipientId: string; recipientPhone: string }[]; message: string; senderId: string }): Promise<SMSMessage[]> {
    await delay(500)
    const results = data.recipients.map((r) => {
      const item: SMSMessage = {
        id: `sms-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tenantId,
        senderId: data.senderId,
        recipientId: r.recipientId,
        recipientPhone: r.recipientPhone,
        message: data.message,
        units: 1,
        status: "queued",
        cost: 0.30,
        markup: 0.05,
        totalCharge: 0.35,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.items.unshift(item)
      return item
    })
    return results
  }

  async scheduleSMS(tenantId: string, data: { recipientId: string; recipientPhone: string; message: string; senderId: string; scheduledAt: string }): Promise<SMSMessage> {
    await delay(200)
    const item: SMSMessage = {
      id: `sms-${Date.now()}`,
      tenantId,
      senderId: data.senderId,
      recipientId: data.recipientId,
      recipientPhone: data.recipientPhone,
      message: data.message,
      units: 1,
      status: "queued",
      cost: 0.30,
      markup: 0.05,
      totalCharge: 0.35,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async listSMS(tenantId: string, filters?: { status?: string; from?: string; to?: string }): Promise<SMSMessage[]> {
    await delay(200)
    let result = this.items.filter((s) => s.tenantId === tenantId)
    if (filters?.status) result = result.filter((s) => s.status === filters.status)
    if (filters?.from) result = result.filter((s) => new Date(s.createdAt) >= new Date(filters.from!))
    if (filters?.to) result = result.filter((s) => new Date(s.createdAt) <= new Date(filters.to!))
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getSMSById(id: string): Promise<SMSMessage | null> {
    await delay(100)
    return this.items.find((s) => s.id === id) || null
  }
}
