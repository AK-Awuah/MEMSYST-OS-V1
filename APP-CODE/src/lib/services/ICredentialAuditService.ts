import type { CredentialAuditLog, CredentialAuditAction } from "@/types"

export interface ICredentialAuditService {
  listAuditLogs(tenantId: string, params?: { action?: CredentialAuditAction; credentialType?: string }): Promise<CredentialAuditLog[]>
  getAuditLog(id: string): Promise<CredentialAuditLog | null>
  logAction(data: Omit<CredentialAuditLog, "id" | "createdAt">): Promise<CredentialAuditLog>
  getCredentialHistory(credentialId: string): Promise<CredentialAuditLog[]>
}
