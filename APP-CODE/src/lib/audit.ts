import type { AuditLog } from "@/types"
import { getAuditService } from "@/lib/services"

export async function logAuditEvent(entry: Omit<AuditLog, "id" | "createdAt">): Promise<void> {
  try {
    const svc = await getAuditService()
    await svc.log(entry)
  } catch {
    console.warn("Audit logging failed (service may be in mock mode)")
  }
}

export function createAuditEntry(params: {
  actor: string
  role: string
  action: string
  module: string
  recordType: string
  recordId: string
  ipAddress?: string
  previousValue?: string
  newValue?: string
}): Omit<AuditLog, "id" | "createdAt"> {
  return {
    actor: params.actor,
    role: params.role,
    action: params.action,
    module: params.module,
    recordType: params.recordType,
    recordId: params.recordId,
    ipAddress: params.ipAddress || "127.0.0.1",
    previousValue: params.previousValue,
    newValue: params.newValue,
  }
}
