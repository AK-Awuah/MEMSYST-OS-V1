import type { AuditLog } from "@/types"

export interface IAuditService {
  listLogs(params?: {
    module?: string
    action?: string
    actor?: string
    limit?: number
  }): Promise<AuditLog[]>
  log(entry: Omit<AuditLog, "id" | "createdAt">): Promise<void>
  getLogsByRecord(recordType: string, recordId: string): Promise<AuditLog[]>
}
