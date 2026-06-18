import type { EmailMessage } from "@/types"

export interface IEmailService {
  sendEmail(tenantId: string, data: { recipientId: string; recipientEmail: string; recipientName: string; subject: string; body: string; senderId: string; senderName: string; templateId?: string }): Promise<EmailMessage>
  sendBulkEmail(tenantId: string, data: { recipients: { recipientId: string; recipientEmail: string; recipientName: string }[]; subject: string; body: string; senderId: string; senderName: string; templateId?: string }): Promise<EmailMessage[]>
  scheduleEmail(tenantId: string, data: { recipientId: string; recipientEmail: string; recipientName: string; subject: string; body: string; senderId: string; senderName: string; scheduledAt: string }): Promise<EmailMessage>
  listEmails(tenantId: string, filters?: { status?: string; from?: string; to?: string }): Promise<EmailMessage[]>
  getEmailById(id: string): Promise<EmailMessage | null>
}
