export const USER_ROLES = ["super_admin", "operations_admin", "sales_admin", "support_admin"] as const
export type UserRole = (typeof USER_ROLES)[number]

export const USER_STATUSES = ["pending_verification", "active", "inactive", "suspended", "archived"] as const
export type UserStatus = (typeof USER_STATUSES)[number]

export const LEAD_STATUSES = ["new", "qualified", "meeting_scheduled", "needs_assessment", "proposal_sent", "negotiation", "won", "lost"] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const FORM_STATUSES = ["new", "assigned", "in_progress", "resolved", "closed"] as const
export type FormStatus = (typeof FORM_STATUSES)[number]

export const FORM_TYPES = ["contact", "consultation", "demo", "partnership"] as const
export type FormType = (typeof FORM_TYPES)[number]

export const CRM_STAGES = ["new_lead", "contacted", "discovery_meeting", "needs_assessment", "proposal_sent", "negotiation", "approved", "tenant_creation"] as const
export type CRMStage = (typeof CRM_STAGES)[number]

export const CRM_STAGE_LABELS: Record<CRMStage, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  discovery_meeting: "Discovery Meeting",
  needs_assessment: "Needs Assessment",
  proposal_sent: "Proposal Sent",
  negotiation: "Negotiation",
  approved: "Approved",
  tenant_creation: "Tenant Creation",
}

export const PROSPECT_STATUSES = ["prospect", "qualified", "proposal_stage", "negotiation", "approved", "rejected"] as const
export type ProspectStatus = (typeof PROSPECT_STATUSES)[number]

export const TENANT_STATUSES = ["prospect", "qualified", "proposal_accepted", "contract_signed", "setup", "activated"] as const
export type TenantStatus = (typeof TENANT_STATUSES)[number]

export const TENANT_COMMERCIAL_STATUSES = ["prospect", "onboarding", "active", "trial", "past_due", "inactive", "suspended", "archived", "cancelled"] as const
export type TenantCommercialStatus = (typeof TENANT_COMMERCIAL_STATUSES)[number]

export const NOTIFICATION_TYPES = ["new_form_submission", "new_lead", "lead_assignment", "meeting_scheduled", "task_assigned", "proposal_sent", "tenant_approved", "user_created"] as const
export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export const NOTIFICATION_STATUSES = ["unread", "read", "archived"] as const
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number]

export const ACTIVITY_TYPES = ["call", "email", "meeting", "task", "note", "attachment"] as const
export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export const SECURITY_ACTIONS = [
  "login", "logout", "failed_login", "password_reset", "password_changed",
  "role_changed", "permission_changed", "user_created", "user_suspended",
  "user_activated", "user_archived", "session_terminated", "account_locked",
  "mfa_enabled", "mfa_disabled", "tenant_created", "tenant_updated",
  "tenant_activated", "tenant_suspended", "tenant_archived",
  "region_created", "branch_created", "position_created",
  "executive_appointed", "config_changed",
] as const
export type SecurityAction = (typeof SECURITY_ACTIONS)[number]

export const AUDIT_MODULES = ["LEADS", "FORMS", "TENANTS", "USERS", "CRM", "ORGANIZATIONS", "ONBOARDING", "SETTINGS", "AUTH"] as const
export type AuditModule = (typeof AUDIT_MODULES)[number]

export const AUDIT_ACTIONS = ["CREATE", "UPDATE", "DELETE", "ASSIGN", "STATUS_CHANGE", "CONVERT", "LOGIN", "LOGOUT"] as const
export type AuditAction = (typeof AUDIT_ACTIONS)[number]

export const ROUTE_PERMISSIONS: Record<string, string | null> = {
  "/app/dashboard": null,
  "/app/forms": "forms:read",
  "/app/leads": "leads:read",
  "/app/crm": "crm:read",
  "/app/notifications": "notifications:read",
  "/app/organizations": "organizations:read",
  "/app/tenants": "tenants:read",
  "/app/onboarding": "tenants:write",
  "/app/users": "users:read",
  "/app/roles": "roles:read",
  "/app/sessions": null,
  "/app/security": null,
  "/app/settings": "settings:read",
  "/app/audit-logs": "audit:read",
  "/app/profile": null,
  "/app/change-password": null,
}

export const PIPELINE_STAGES: CRMStage[] = [
  "new_lead", "contacted", "discovery_meeting", "needs_assessment",
  "proposal_sent", "negotiation", "approved", "tenant_creation",
]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  qualified: "Qualified",
  meeting_scheduled: "Meeting Scheduled",
  needs_assessment: "Needs Assessment",
  proposal_sent: "Proposal Sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
}

export const FORM_STATUS_LABELS: Record<FormStatus, string> = {
  new: "New",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  operations_admin: "Operations Admin",
  sales_admin: "Sales Admin",
  support_admin: "Support Admin",
}

export const PROSPECT_STATUS_LABELS: Record<ProspectStatus, string> = {
  prospect: "Prospect",
  qualified: "Qualified",
  proposal_stage: "Proposal Stage",
  negotiation: "Negotiation",
  approved: "Approved",
  rejected: "Rejected",
}
