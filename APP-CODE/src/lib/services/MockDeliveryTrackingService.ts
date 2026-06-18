import { delay } from "./shared-store"
import { mockDeliveryLogs } from "./mock-data"
import type { DeliveryLog, DeliveryStatus } from "@/types"
import type { IDeliveryTrackingService } from "./IDeliveryTrackingService"

export class MockDeliveryTrackingService implements IDeliveryTrackingService {
  private items = [...mockDeliveryLogs]

  async getDeliveryLog(tenantId: string, messageId: string): Promise<DeliveryLog | null> {
    await delay(100)
    return this.items.find((d) => d.tenantId === tenantId && d.messageId === messageId) || null
  }

  async getDeliveryLogs(tenantId: string, filters?: { status?: string; channel?: string; from?: string; to?: string }): Promise<DeliveryLog[]> {
    await delay(200)
    let result = this.items.filter((d) => d.tenantId === tenantId)
    if (filters?.status) result = result.filter((d) => d.status === filters.status)
    if (filters?.channel) result = result.filter((d) => d.channel === filters.channel)
    if (filters?.from) result = result.filter((d) => new Date(d.createdAt) >= new Date(filters.from!))
    if (filters?.to) result = result.filter((d) => new Date(d.createdAt) <= new Date(filters.to!))
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async retryFailedDelivery(tenantId: string, messageId: string): Promise<DeliveryLog> {
    await delay(300)
    const idx = this.items.findIndex((d) => d.tenantId === tenantId && d.messageId === messageId)
    if (idx === -1) throw new Error(`Delivery log for message ${messageId} not found`)
    this.items[idx] = {
      ...this.items[idx],
      status: "processing",
      attempts: this.items[idx].attempts + 1,
      lastAttemptAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return this.items[idx]
  }

  async updateDeliveryStatus(id: string, status: DeliveryStatus, providerResponse?: string): Promise<void> {
    await delay(100)
    const log = this.items.find((d) => d.id === id)
    if (log) {
      log.status = status
      log.providerResponse = providerResponse
      log.updatedAt = new Date().toISOString()
    }
  }
}
