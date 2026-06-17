import type { Lead, FormSubmission, CRMOpportunity, Notification, AuditLog, SecurityEvent, SecurityAction } from "@/types"
import { mockLeads as initialLeads, mockSubmissions, mockOpportunities, mockNotifications as initialNotifications, mockAuditLogs } from "./mock-data"

export const sharedLeads: Lead[] = [...initialLeads]
export const sharedSubmissions: FormSubmission[] = [...mockSubmissions]
export const sharedOpportunities: CRMOpportunity[] = [...mockOpportunities]
export const sharedNotifications: Notification[] = [...initialNotifications]
export const sharedAuditLogs: AuditLog[] = [...mockAuditLogs]

export const sharedSecurityEvents: SecurityEvent[] = []

export function pushAuditLog(entry: Omit<AuditLog, "id" | "createdAt">) {
  sharedAuditLogs.unshift({
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  })
}

export function recordIdentitySecurityEvent(data: {
  actorId: string
  actorName: string
  action: SecurityAction
  resource: string
  tenantId: string
  ipAddress?: string
  device?: string
  result: "success" | "failure"
  details?: string
}) {
  const event: SecurityEvent = {
    id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    actorId: data.actorId,
    actorName: data.actorName,
    action: data.action,
    resource: data.resource,
    tenantId: data.tenantId,
    ipAddress: data.ipAddress || "127.0.0.1",
    device: data.device || "System",
    result: data.result,
    details: data.details,
    createdAt: new Date().toISOString(),
  }
  sharedSecurityEvents.unshift(event)
  return event
}
