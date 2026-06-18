import type { DeliveryLog, DeliveryStatus } from "@/types"

export interface IDeliveryTrackingService {
  getDeliveryLog(tenantId: string, messageId: string): Promise<DeliveryLog | null>
  getDeliveryLogs(tenantId: string, filters?: { status?: string; channel?: string; from?: string; to?: string }): Promise<DeliveryLog[]>
  retryFailedDelivery(tenantId: string, messageId: string): Promise<DeliveryLog>
  updateDeliveryStatus(id: string, status: DeliveryStatus, providerResponse?: string): Promise<void>
}
