import type { IAuditService } from "./IAuditService"
import type { AuditLog } from "@/types"
import { mockAuditLogs } from "./mock-data"

let logs = [...mockAuditLogs]

export class MockAuditService implements IAuditService {
  async listLogs(params?: { module?: string; action?: string; actor?: string; limit?: number }): Promise<AuditLog[]> {
    await delay(300)
    let filtered = [...logs]
    if (params?.module) filtered = filtered.filter((l) => l.module === params.module)
    if (params?.action) filtered = filtered.filter((l) => l.action === params.action)
    if (params?.actor) filtered = filtered.filter((l) => l.actor === params.actor)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (params?.limit) filtered = filtered.slice(0, params.limit)
    return filtered
  }

  async log(entry: Omit<AuditLog, "id" | "createdAt">): Promise<void> {
    await delay(100)
    const log: AuditLog = {
      ...entry,
      id: `audit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    logs.unshift(log)
  }

  async getLogsByRecord(recordType: string, recordId: string): Promise<AuditLog[]> {
    await delay(200)
    return logs
      .filter((l) => l.recordType === recordType && l.recordId === recordId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
