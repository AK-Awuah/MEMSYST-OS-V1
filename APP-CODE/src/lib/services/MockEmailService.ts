import { delay } from "./shared-store"
import { mockEmailMessages } from "./mock-data"
import type { EmailMessage } from "@/types"
import type { IEmailService } from "./IEmailService"

export class MockEmailService implements IEmailService {
  private items = [...mockEmailMessages]

  async sendEmail(tenantId: string, data: { recipientId: string; recipientEmail: string; recipientName: string; subject: string; body: string; senderId: string; senderName: string; templateId?: string }): Promise<EmailMessage> {
    await delay(300)
    const item: EmailMessage = {
      id: `email-${Date.now()}`,
      tenantId,
      senderId: data.senderId,
      senderName: data.senderName,
      recipientId: data.recipientId,
      recipientEmail: data.recipientEmail,
      recipientName: data.recipientName,
      subject: data.subject,
      body: data.body,
      templateId: data.templateId,
      status: "sent",
      sentAt: new Date().toISOString(),
      cost: 0.05,
      markup: 0.01,
      totalCharge: 0.06,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async sendBulkEmail(tenantId: string, data: { recipients: { recipientId: string; recipientEmail: string; recipientName: string }[]; subject: string; body: string; senderId: string; senderName: string; templateId?: string }): Promise<EmailMessage[]> {
    await delay(500)
    const results = data.recipients.map((r) => {
      const item: EmailMessage = {
        id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tenantId,
        senderId: data.senderId,
        senderName: data.senderName,
        recipientId: r.recipientId,
        recipientEmail: r.recipientEmail,
        recipientName: r.recipientName,
        subject: data.subject,
        body: data.body,
        templateId: data.templateId,
        status: "queued",
        cost: 0.05,
        markup: 0.01,
        totalCharge: 0.06,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.items.unshift(item)
      return item
    })
    return results
  }

  async scheduleEmail(tenantId: string, data: { recipientId: string; recipientEmail: string; recipientName: string; subject: string; body: string; senderId: string; senderName: string; scheduledAt: string }): Promise<EmailMessage> {
    await delay(200)
    const item: EmailMessage = {
      id: `email-${Date.now()}`,
      tenantId,
      senderId: data.senderId,
      senderName: data.senderName,
      recipientId: data.recipientId,
      recipientEmail: data.recipientEmail,
      recipientName: data.recipientName,
      subject: data.subject,
      body: data.body,
      status: "queued",
      cost: 0.05,
      markup: 0.01,
      totalCharge: 0.06,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async listEmails(tenantId: string, filters?: { status?: string; from?: string; to?: string }): Promise<EmailMessage[]> {
    await delay(200)
    let result = this.items.filter((e) => e.tenantId === tenantId)
    if (filters?.status) result = result.filter((e) => e.status === filters.status)
    if (filters?.from) result = result.filter((e) => new Date(e.createdAt) >= new Date(filters.from!))
    if (filters?.to) result = result.filter((e) => new Date(e.createdAt) <= new Date(filters.to!))
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getEmailById(id: string): Promise<EmailMessage | null> {
    await delay(100)
    return this.items.find((e) => e.id === id) || null
  }
}
