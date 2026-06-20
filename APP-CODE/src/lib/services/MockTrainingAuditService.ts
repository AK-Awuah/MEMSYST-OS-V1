import type { ITrainingAuditService } from "./ITrainingAuditService"
import type { TrainingAuditLog, TrainingAuditAction } from "@/types"
import { mockTrainingAuditLogs } from "./mock-data"
import { delay } from "./shared-store"

export class MockTrainingAuditService implements ITrainingAuditService {
  private items = [...mockTrainingAuditLogs]

  async listAuditLogs(tenantId: string, params?: { action?: TrainingAuditAction; recordType?: string; dateFrom?: string; dateTo?: string }): Promise<TrainingAuditLog[]> {
    await delay(200)
    let result = this.items.filter((l) => l.tenantId === tenantId)
    if (params?.action) result = result.filter((l) => l.action === params.action)
    if (params?.recordType) result = result.filter((l) => l.recordType === params.recordType)
    if (params?.dateFrom) result = result.filter((l) => l.createdAt >= params.dateFrom!)
    if (params?.dateTo) result = result.filter((l) => l.createdAt <= params.dateTo!)
    return result
  }

  async getAuditLog(id: string): Promise<TrainingAuditLog | null> {
    await delay(100)
    return this.items.find((l) => l.id === id) || null
  }

  async createAuditLog(data: Omit<TrainingAuditLog, "id" | "createdAt">): Promise<TrainingAuditLog> {
    await delay(150)
    const log: TrainingAuditLog = {
      ...data,
      id: `taudit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.items.unshift(log)
    return log
  }

  async deleteAuditLog(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((l) => l.id !== id)
  }
}
