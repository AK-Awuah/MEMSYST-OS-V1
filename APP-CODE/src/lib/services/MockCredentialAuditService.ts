import type { ICredentialAuditService } from "./ICredentialAuditService"
import type { CredentialAuditLog, CredentialAuditAction } from "@/types"
import { mockCredentialAuditLogs } from "./mock-data"
import { delay } from "./shared-store"

export class MockCredentialAuditService implements ICredentialAuditService {
  private items = [...mockCredentialAuditLogs]

  async listAuditLogs(tenantId: string, params?: { action?: CredentialAuditAction; credentialType?: string }): Promise<CredentialAuditLog[]> {
    await delay(200)
    let result = this.items.filter((l) => l.tenantId === tenantId)
    if (params?.action) result = result.filter((l) => l.action === params.action)
    if (params?.credentialType) result = result.filter((l) => l.credentialType === params.credentialType)
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getAuditLog(id: string): Promise<CredentialAuditLog | null> {
    await delay(100)
    return this.items.find((l) => l.id === id) || null
  }

  async logAction(data: Omit<CredentialAuditLog, "id" | "createdAt">): Promise<CredentialAuditLog> {
    await delay(100)
    const log: CredentialAuditLog = {
      ...data,
      id: `caudl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    }
    this.items.unshift(log)
    return log
  }

  async getCredentialHistory(credentialId: string): Promise<CredentialAuditLog[]> {
    await delay(100)
    return this.items.filter((l) => l.credentialId === credentialId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}
