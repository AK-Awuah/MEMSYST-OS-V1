export type UserRole = "super_admin" | "operations_admin" | "sales_admin" | "support_admin"

export type UserStatus = "pending_verification" | "active" | "inactive" | "suspended" | "archived"

export interface MemsystUser {
  id: string
  tenantId: string
  email: string
  emailVerified: boolean
  firstName: string
  lastName: string
  phone: string
  username: string
  role: UserRole
  permissions: string[]
  status: UserStatus
  photoURL?: string
  createdAt: string
  lastLogin?: string
  updatedAt: string
}

export interface Role {
  id: string
  tenantId: string
  name: string
  description: string
  isSystem: boolean
  permissions: string[]
  userCount?: number
  createdAt: string
  updatedAt: string
}

export interface Permission {
  key: string
  label: string
  group: string
  description: string
}

export interface Session {
  id: string
  userId: string
  tenantId: string
  device: string
  ipAddress: string
  userAgent: string
  lastActiveAt: string
  expiresAt: string
  createdAt: string
  isActive: boolean
}

export interface SecurityEvent {
  id: string
  actorId: string
  actorName: string
  action: SecurityAction
  resource: string
  tenantId: string
  ipAddress: string
  device: string
  result: "success" | "failure"
  details?: string
  createdAt: string
}

export type SecurityAction =
  | "login"
  | "logout"
  | "failed_login"
  | "password_reset"
  | "password_changed"
  | "role_changed"
  | "permission_changed"
  | "user_created"
  | "user_suspended"
  | "user_activated"
  | "user_archived"
  | "session_terminated"
  | "account_locked"
  | "mfa_enabled"
  | "mfa_disabled"

export interface FormSubmission {
  id: string
  type: "contact" | "consultation" | "demo" | "partnership"
  data: Record<string, unknown>
  status: "new" | "assigned" | "in_progress" | "resolved" | "closed"
  assignedTo?: string
  sourcePage: string
  referralSource?: string
  ipAddress?: string
  notes: Note[]
  createdAt: string
  updatedAt: string
}

export interface Lead {
  id: string
  organizationName: string
  contactPerson: string
  email: string
  phone: string
  organizationType: string
  country: string
  expectedMembers: number
  website?: string
  leadSource: string
  estimatedValue: number
  expectedLaunchDate?: string
  assignedTo?: string
  status: LeadStatus
  activities: Activity[]
  attachments: string[]
  createdAt: string
  updatedAt: string
}

export type LeadStatus =
  | "new"
  | "qualified"
  | "meeting_scheduled"
  | "needs_assessment"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost"

export interface Activity {
  id: string
  type: "call" | "email" | "meeting" | "task" | "note" | "attachment"
  title: string
  description?: string
  performedBy: string
  createdAt: string
}

export interface Note {
  id: string
  content: string
  author: string
  createdAt: string
}

export interface CRMOpportunity {
  id: string
  leadId: string
  assignedTo: string
  value: number
  probability: number
  expectedCloseDate: string
  currentStage: CRMStage
  activities: Activity[]
  createdAt: string
  updatedAt: string
}

export type CRMStage =
  | "new_lead"
  | "contacted"
  | "discovery_meeting"
  | "needs_assessment"
  | "proposal_sent"
  | "negotiation"
  | "approved"
  | "tenant_creation"

export interface OrganizationProspect {
  id: string
  organizationName: string
  industryType: string
  country: string
  expectedMembers: number
  currentChallenges: string
  desiredCapabilities: string[]
  commercialNotes?: string
  assignedTo?: string
  status: ProspectStatus
  createdAt: string
  updatedAt: string
}

export type ProspectStatus =
  | "prospect"
  | "qualified"
  | "proposal_stage"
  | "negotiation"
  | "approved"
  | "rejected"

export interface Tenant {
  id: string
  tenantId: string
  organizationName: string
  shortName: string
  subdomain: string
  country: string
  industry: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  plan: string
  subscription: string
  commissionModel: string
  revenueDistributionModel: string
  adminName: string
  adminEmail: string
  adminPhone: string
  status: TenantStatus
  commercialStatus: "prospect" | "onboarding" | "active" | "trial" | "past_due" | "inactive" | "suspended" | "archived" | "cancelled"
  createdAt: string
  updatedAt: string
}

export type TenantStatus =
  | "prospect"
  | "qualified"
  | "proposal_accepted"
  | "contract_signed"
  | "setup"
  | "activated"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  recipientId: string
  relatedId?: string
  relatedModule?: string
  status: "unread" | "read" | "archived"
  createdAt: string
}

export type NotificationType =
  | "new_form_submission"
  | "new_lead"
  | "lead_assignment"
  | "meeting_scheduled"
  | "task_assigned"
  | "proposal_sent"
  | "tenant_approved"
  | "user_created"

export interface AuditLog {
  id: string
  actor: string
  role: string
  action: string
  module: string
  recordType: string
  recordId: string
  ipAddress: string
  previousValue?: string
  newValue?: string
  createdAt: string
}

export interface SecurityDashboardMetrics {
  totalUsers: number
  activeUsers: number
  failedLogins24h: number
  lockedAccounts: number
  activeSessions: number
  recentEvents: SecurityEvent[]
  recentLogins: SecurityEvent[]
  recentRoleChanges: SecurityEvent[]
}

export interface DashboardMetrics {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  activeOpportunities: number
  meetingsScheduled: number
  proposalsSent: number
  wonOpportunities: number
  lostOpportunities: number
  pendingOnboarding: number
  activeTenants: number
  newFormSubmissions: number
  unreadNotifications: number
}
