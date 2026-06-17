import type { IAuditService } from "./IAuditService"
import type { AuditLog } from "@/types"

export class FirebaseAuditService implements IAuditService {
  async listLogs(): Promise<AuditLog[]> { return [] }
  async log(_entry: Omit<AuditLog, "id" | "createdAt">): Promise<void> {}
  async getLogsByRecord(_recordType: string, _recordId: string): Promise<AuditLog[]> { return [] }
}
