import type { Lead, FormSubmission, CRMOpportunity, Notification, AuditLog } from "@/types"
import { mockLeads as initialLeads, mockSubmissions, mockOpportunities, mockNotifications as initialNotifications, mockAuditLogs } from "./mock-data"

export const sharedLeads: Lead[] = [...initialLeads]
export const sharedSubmissions: FormSubmission[] = [...mockSubmissions]
export const sharedOpportunities: CRMOpportunity[] = [...mockOpportunities]
export const sharedNotifications: Notification[] = [...initialNotifications]
export const sharedAuditLogs: AuditLog[] = [...mockAuditLogs]
