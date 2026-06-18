import type { SMSMessage } from "@/types"

export interface ISMSService {
  sendSMS(tenantId: string, data: { recipientId: string; recipientPhone: string; message: string; senderId: string }): Promise<SMSMessage>
  sendBulkSMS(tenantId: string, data: { recipients: { recipientId: string; recipientPhone: string }[]; message: string; senderId: string }): Promise<SMSMessage[]>
  scheduleSMS(tenantId: string, data: { recipientId: string; recipientPhone: string; message: string; senderId: string; scheduledAt: string }): Promise<SMSMessage>
  listSMS(tenantId: string, filters?: { status?: string; from?: string; to?: string }): Promise<SMSMessage[]>
  getSMSById(id: string): Promise<SMSMessage | null>
}
