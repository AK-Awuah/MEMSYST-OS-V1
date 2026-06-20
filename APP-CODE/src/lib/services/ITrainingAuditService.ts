import type { TrainingAuditLog, TrainingAuditAction } from "@/types"

export interface ITrainingAuditService {
  listAuditLogs(tenantId: string, params?: { action?: TrainingAuditAction; recordType?: string; dateFrom?: string; dateTo?: string }): Promise<TrainingAuditLog[]>
  getAuditLog(id: string): Promise<TrainingAuditLog | null>
  createAuditLog(data: Omit<TrainingAuditLog, "id" | "createdAt">): Promise<TrainingAuditLog>
  deleteAuditLog(id: string): Promise<void>
}
