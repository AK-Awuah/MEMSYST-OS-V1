import type { PushNotificationRecord } from "@/types"

export interface IPushNotificationService {
  sendPush(tenantId: string, data: { recipientId: string; title: string; body: string; data?: Record<string, string>; senderId: string }): Promise<PushNotificationRecord>
  sendBulkPush(tenantId: string, data: { recipients: string[]; title: string; body: string; senderId: string }): Promise<PushNotificationRecord[]>
  schedulePush(tenantId: string, data: { recipientId: string; title: string; body: string; senderId: string; scheduledAt: string }): Promise<PushNotificationRecord>
  listPushNotifications(tenantId: string, filters?: { status?: string; from?: string; to?: string }): Promise<PushNotificationRecord[]>
  getPushNotificationById(id: string): Promise<PushNotificationRecord | null>
}
