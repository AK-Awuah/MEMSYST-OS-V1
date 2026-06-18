import type {
  MemsystUser,
  FormSubmission,
  Lead,
  CRMOpportunity,
  OrganizationProspect,
  Tenant,
  Notification,
  AuditLog,
  Note,
  Activity,
  DashboardMetrics,
  Role,
  Permission,
  TenantProfile,
  TenantBranding,
  Region,
  Branch,
  OrganizationalUnit,
  ExecutivePosition,
  ExecutiveAppointment,
  GovernanceConfig,
  ApprovalWorkflow,
  TenantDocument,
  TenantAuditLog,
  TenantSettings,
  MembershipFrameworkConfig,
  Member,
  Apprentice,
  TransferRecord,
  UpgradeRequest,
  ApprovalRecord,
  RenewalRecord,
  MemberDocument,
  MemberCommunication,
  MemberAnalytics,
  MembershipAuditLog,
  Wallet,
  LedgerEntry,
  Transaction,
  Payment,
  RevenueDistributionRule,
  DistributionSplit,
  RevenueDistribution,
  CommissionConfig,
  Commission,
  Bill,
  Withdrawal,
  Refund,
  Receipt,
  FinancialSettings,
  EmailMessage,
  SMSMessage,
  PushNotificationRecord,
  Campaign,
  Template,
  AudienceSegment,
  CommunicationPreference,
  Subscription,
  EngagementEvent,
  DeliveryLog,
  CommunicationAnalytics,
  BroadcastMessage,
  AutomationRule,
  CommunicationAuditLog,
  NotificationChannel,
  CampaignStatus,
  CampaignType,
  TemplateType,
  TemplateStatus,
  CommunicationChannel,
  SubscriptionCategory,
  AutomationTriggerEvent,
  AutomationActionType,
  CommunicationAuditAction,
  BroadcastScope,
  IDCard,
  Certificate,
  CredentialTemplate,
  CredentialTemplateField,
  PrintRequest,
  VerificationRecord,
  CredentialAnalytics,
  CredentialAuditLog,
  CredentialSettings,
  CredentialFile,
  BusinessCategory,
  BusinessProfile,
  MarketplaceApproval,
  MarketplaceAuditLog,
  MarketplaceListing,
  MarketplaceModerationRecord,
  MarketplaceSettings,
  MemberDirectoryProfile,
  Opportunity,
  OpportunityApplication,
  TrainingCenter,
} from "@/types"

export const mockUsers: MemsystUser[] = [
  {
    id: "user-1",
    tenantId: "memsyst",
    email: "admin@memsyst.com",
    emailVerified: true,
    firstName: "Kwame",
    lastName: "Asante",
    phone: "+233 20 000 0001",
    username: "kwame.asante",
    role: "super_admin",
    permissions: ["*"],
    status: "active",
    photoURL: "",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-06-16T08:30:00Z",
    lastLogin: "2026-06-16T08:30:00Z",
  },
  {
    id: "user-2",
    tenantId: "memsyst",
    email: "operations@memsyst.com",
    emailVerified: true,
    firstName: "Ama",
    lastName: "Osei",
    phone: "+233 20 000 0002",
    username: "ama.osei",
    role: "operations_admin",
    permissions: ["leads:read", "leads:write", "forms:read", "forms:write", "organizations:read"],
    status: "active",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "user-3",
    tenantId: "memsyst",
    email: "sales@memsyst.com",
    emailVerified: true,
    firstName: "Yaw",
    lastName: "Mensah",
    phone: "+233 20 000 0003",
    username: "yaw.mensah",
    role: "sales_admin",
    permissions: ["leads:read", "leads:write", "crm:read", "crm:write"],
    status: "active",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
]

let formCounter = 0
export function generateMockForm(): FormSubmission {
  formCounter++
  const types = ["contact", "consultation", "demo", "partnership"] as const
  const statuses: FormSubmission["status"][] = ["new", "assigned", "in_progress", "resolved", "closed"]
  return {
    id: `form-${Date.now()}-${formCounter}`,
    type: types[formCounter % 4],
    data: {
      firstName: ["John", "Jane", "Kwame", "Ama"][formCounter % 4],
      lastName: ["Doe", "Smith", "Asante", "Osei"][formCounter % 4],
      email: `person${formCounter}@example.com`,
      phone: `+233 20 ${String(1000000 + formCounter).slice(1)}`,
      message: `This is inquiry number ${formCounter}. Interested in learning more about MemSyst capabilities.`,
    },
    status: statuses[formCounter % 5],
    assignedTo: formCounter % 2 === 0 ? "user-2" : undefined,
    sourcePage: ["/", "/consultation", "/contact", "/capabilities"][formCounter % 4],
    referralSource: formCounter % 3 === 0 ? "Google" : formCounter % 3 === 1 ? "LinkedIn" : "Direct",
    notes: [],
    createdAt: new Date(Date.now() - formCounter * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - formCounter * 1800000).toISOString(),
  }
}

export const mockSubmissions: FormSubmission[] = Array.from({ length: 12 }, (_, i) => generateMockForm())

let leadCounter = 0
export function generateMockLead(): Lead {
  leadCounter++
  const statuses: Lead["status"][] = [
    "new", "qualified", "meeting_scheduled", "needs_assessment",
    "proposal_sent", "negotiation", "won", "lost",
  ]
  const orgs = [
    "Ghana Medical Association", "Nigeria Bar Association", "Kenya Cooperative Union",
    "Accra Business Network", "West Africa Trade Alliance", "GH Institution of Engineers",
  ]
  return {
    id: `lead-${Date.now()}-${leadCounter}`,
    organizationName: orgs[leadCounter % orgs.length],
    contactPerson: ["Dr. Mensah", "Barrister Okonkwo", "Chairperson Wanjiku", "CEO Addae"][leadCounter % 4],
    email: `contact${leadCounter}@org${leadCounter}.org`,
    phone: `+233 20 ${String(3000000 + leadCounter).slice(1)}`,
    organizationType: ["Association", "Professional Body", "Cooperative", "Trade Association"][leadCounter % 4],
    country: ["Ghana", "Nigeria", "Kenya", "Ghana"][leadCounter % 4],
    expectedMembers: [500, 2000, 10000, 500, 50000][leadCounter % 5],
    website: `https://org${leadCounter}.org`,
    leadSource: ["Website", "Referral", "LinkedIn", "Conference", "Direct"][leadCounter % 5],
    estimatedValue: [5000, 15000, 50000, 10000, 100000][leadCounter % 5],
    expectedLaunchDate: new Date(Date.now() + leadCounter * 7 * 86400000).toISOString().split("T")[0],
    assignedTo: leadCounter % 2 === 0 ? "user-3" : undefined,
    status: statuses[leadCounter % 8],
    activities: [],
    attachments: [],
    createdAt: new Date(Date.now() - leadCounter * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - leadCounter * 43200000).toISOString(),
  }
}

export const mockLeads: Lead[] = Array.from({ length: 15 }, (_, i) => generateMockLead())

let oppCounter = 0
export function generateMockOpportunity(): CRMOpportunity {
  oppCounter++
  const stages: CRMOpportunity["currentStage"][] = [
    "new_lead", "contacted", "discovery_meeting", "needs_assessment",
    "proposal_sent", "negotiation", "approved", "tenant_creation",
  ]
  return {
    id: `opp-${Date.now()}-${oppCounter}`,
    leadId: mockLeads[oppCounter % mockLeads.length].id,
    assignedTo: "user-3",
    value: [5000, 15000, 25000, 50000, 100000][oppCounter % 5],
    probability: [10, 25, 50, 75, 90][oppCounter % 5],
    expectedCloseDate: new Date(Date.now() + oppCounter * 14 * 86400000).toISOString().split("T")[0],
    currentStage: stages[oppCounter % 8],
    activities: [],
    createdAt: new Date(Date.now() - oppCounter * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - oppCounter * 43200000).toISOString(),
  }
}

export const mockOpportunities: CRMOpportunity[] = Array.from({ length: 10 }, (_, i) => generateMockOpportunity())

export const mockProspects: OrganizationProspect[] = [
  {
    id: "prospect-1",
    organizationName: "Ghana Medical Association",
    industryType: "Association",
    country: "Ghana",
    expectedMembers: 5000,
    currentChallenges: "Manual dues collection, paper-based member records, limited member engagement",
    desiredCapabilities: ["Membership Management", "Financial Management", "Digital Portals"],
    assignedTo: "user-3",
    status: "qualified",
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-15T00:00:00Z",
  },
  {
    id: "prospect-2",
    organizationName: "Nigeria Institute of Architects",
    industryType: "Professional Body",
    country: "Nigeria",
    expectedMembers: 3500,
    currentChallenges: "Disconnected systems, no online presence for members, certification tracking issues",
    desiredCapabilities: ["Membership Management", "Training & Certification", "Website Management"],
    assignedTo: "user-3",
    status: "proposal_stage",
    createdAt: "2026-04-10T00:00:00Z",
    updatedAt: "2026-05-20T00:00:00Z",
  },
  {
    id: "prospect-3",
    organizationName: "East Africa Cooperatives Union",
    industryType: "Cooperative",
    country: "Kenya",
    expectedMembers: 25000,
    currentChallenges: "No digital infrastructure, manual financial tracking, member communication gaps",
    desiredCapabilities: ["Financial Management", "Communication & Engagement", "Data Analytics"],
    status: "prospect",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
]

export const mockTenants: Tenant[] = [
  {
    id: "tenant-1",
    tenantId: "memsyst",
    organizationName: "Ghana Medical Association",
    shortName: "GMA",
    abbreviation: "GMA",
    domain: "gma.memsyst.com",
    subdomain: "gma",
    organizationType: "Association",
    country: "Ghana",
    region: "Greater Accra",
    industry: "Healthcare",
    logo: "",
    primaryColor: "#1a73e8",
    secondaryColor: "#34a853",
    plan: "Enterprise",
    subscription: "annual",
    commissionModel: "percentage",
    revenueDistributionModel: "shared",
    adminName: "Dr. Kwame Asante",
    adminEmail: "admin@gma.org",
    adminPhone: "+233 20 111 1111",
    status: "activated",
    commercialStatus: "active",
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-20T00:00:00Z",
  },
]

export const mockNotifications: Notification[] = [
  { id: "notif-1", type: "new_form_submission", title: "New Form Submission", message: "A new consultation request has been submitted.", recipientId: "user-1", status: "unread", createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: "notif-2", type: "new_lead", title: "New Lead Created", message: "Ghana Medical Association has been added as a lead.", recipientId: "user-1", status: "unread", createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: "notif-3", type: "lead_assignment", title: "Lead Assigned", message: "Nigeria Bar Association has been assigned to Yaw Mensah.", recipientId: "user-3", status: "read", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "notif-4", type: "meeting_scheduled", title: "Meeting Scheduled", message: "Discovery meeting with Ghana Medical Association scheduled for June 20.", recipientId: "user-1", status: "unread", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "notif-5", type: "tenant_approved", title: "Tenant Activated", message: "Ghana Medical Association tenant has been activated.", recipientId: "user-1", status: "read", createdAt: new Date(Date.now() - 86400000).toISOString() },
]

export const mockAuditLogs: AuditLog[] = [
  { id: "audit-1", actor: "Kwame Asante", role: "super_admin", action: "create", module: "leads", recordType: "Lead", recordId: "lead-1", ipAddress: "192.168.1.1", newValue: "Created lead GMA", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "audit-2", actor: "Ama Osei", role: "operations_admin", action: "update_status", module: "forms", recordType: "FormSubmission", recordId: "form-1", ipAddress: "192.168.1.2", previousValue: "new", newValue: "in_progress", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "audit-3", actor: "Yaw Mensah", role: "sales_admin", action: "assign", module: "leads", recordType: "Lead", recordId: "lead-2", ipAddress: "192.168.1.3", previousValue: "unassigned", newValue: "assigned to user-3", createdAt: new Date(Date.now() - 10800000).toISOString() },
  { id: "audit-4", actor: "Kwame Asante", role: "super_admin", action: "create", module: "tenants", recordType: "Tenant", recordId: "tenant-1", ipAddress: "192.168.1.1", newValue: "Created tenant GMA", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "audit-5", actor: "Kwame Asante", role: "super_admin", action: "update", module: "users", recordType: "User", recordId: "user-2", ipAddress: "192.168.1.1", previousValue: "role: operations_admin", newValue: "role: operations_admin (permissions updated)", createdAt: new Date(Date.now() - 172800000).toISOString() },
]

export const mockDashboardMetrics: DashboardMetrics = {
  totalLeads: 128,
  newLeads: 14,
  qualifiedLeads: 42,
  activeOpportunities: 18,
  meetingsScheduled: 7,
  proposalsSent: 5,
  wonOpportunities: 23,
  lostOpportunities: 12,
  pendingOnboarding: 3,
  activeTenants: 1,
  newFormSubmissions: 8,
  unreadNotifications: 3,
}

export const mockRoles: Role[] = [
  {
    id: "role-1",
    tenantId: "memsyst",
    name: "Super Admin",
    description: "Full system access across all tenants",
    isSystem: true,
    permissions: ["*"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "role-2",
    tenantId: "memsyst",
    name: "Operations Admin",
    description: "Manage leads, forms, and organization data",
    isSystem: true,
    permissions: ["leads:read", "leads:write", "forms:read", "forms:write", "organizations:read"],
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "role-3",
    tenantId: "memsyst",
    name: "Sales Admin",
    description: "Manage leads and CRM pipeline",
    isSystem: true,
    permissions: ["leads:read", "leads:write", "crm:read", "crm:write"],
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "role-4",
    tenantId: "memsyst",
    name: "Support Admin",
    description: "Handle form submissions and support tickets",
    isSystem: true,
    permissions: ["forms:read", "forms:write", "notifications:read"],
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "role-5",
    tenantId: "tenant-1",
    name: "Tenant Admin",
    description: "Admin for a specific tenant organization",
    isSystem: true,
    permissions: ["leads:read", "leads:write", "crm:read", "members:read", "members:write", "finance:read", "notifications:read", "notifications:write"],
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
  },
]

export const allPermissions: Permission[] = [
  { key: "leads:read", label: "View Leads", group: "Leads", description: "View lead records and details" },
  { key: "leads:write", label: "Manage Leads", group: "Leads", description: "Create, edit, and delete leads" },
  { key: "leads:assign", label: "Assign Leads", group: "Leads", description: "Assign leads to team members" },
  { key: "forms:read", label: "View Submissions", group: "Forms", description: "View form submissions" },
  { key: "forms:write", label: "Manage Submissions", group: "Forms", description: "Update form submission status" },
  { key: "forms:delete", label: "Delete Submissions", group: "Forms", description: "Remove form submissions" },
  { key: "crm:read", label: "View Pipeline", group: "CRM", description: "View CRM pipeline stages" },
  { key: "crm:write", label: "Manage Pipeline", group: "CRM", description: "Update pipeline stage and opportunities" },
  { key: "members:read", label: "View Members", group: "Members", description: "View member records" },
  { key: "members:write", label: "Manage Members", group: "Members", description: "Create, edit, and delete members" },
  { key: "finance:read", label: "View Finance", group: "Finance", description: "View financial data and reports" },
  { key: "finance:write", label: "Manage Finance", group: "Finance", description: "Process transactions and manage billing" },
  { key: "settings:read", label: "View Settings", group: "Settings", description: "View system settings" },
  { key: "settings:write", label: "Manage Settings", group: "Settings", description: "Modify system settings" },
  { key: "users:read", label: "View Users", group: "Users", description: "View user accounts" },
  { key: "users:write", label: "Manage Users", group: "Users", description: "Create, edit, and deactivate users" },
  { key: "roles:read", label: "View Roles", group: "Roles", description: "View role definitions" },
  { key: "roles:write", label: "Manage Roles", group: "Roles", description: "Create, edit, and deactivate roles" },
  { key: "roles:assign", label: "Assign Roles", group: "Roles", description: "Assign roles to users" },
  { key: "tenants:read", label: "View Tenants", group: "Tenants", description: "View tenant organizations" },
  { key: "tenants:write", label: "Manage Tenants", group: "Tenants", description: "Provision and manage tenants" },
  { key: "notifications:read", label: "View Notifications", group: "Notifications", description: "View notification history" },
  { key: "notifications:write", label: "Send Notifications", group: "Notifications", description: "Send system notifications" },
  { key: "audit:read", label: "View Audit Logs", group: "Audit", description: "View security and audit logs" },
  { key: "audit:export", label: "Export Audit Logs", group: "Audit", description: "Export audit trail data" },
  { key: "organizations:read", label: "View Organizations", group: "Tenants", description: "View organization prospects" },
  { key: "organizations:write", label: "Manage Organizations", group: "Tenants", description: "Create and edit organization prospects" },
  { key: "members:read", label: "View Members", group: "Members", description: "View member records" },
  { key: "members:write", label: "Manage Members", group: "Members", description: "Create, edit, and manage members" },
  { key: "members:approve", label: "Approve Members", group: "Members", description: "Approve member registrations" },
  { key: "apprentices:read", label: "View Apprentices", group: "Members", description: "View apprentice records" },
  { key: "apprentices:write", label: "Manage Apprentices", group: "Members", description: "Create, transfer, and upgrade apprentices" },
  { key: "communication:read", label: "View Communication", group: "Communication", description: "View communication history and analytics" },
  { key: "communication:write", label: "Manage Communication", group: "Communication", description: "Send messages, manage campaigns and templates" },
  { key: "executive:write", label: "Executive Broadcasts", group: "Communication", description: "Send executive broadcasts" },
]

// ============================================
// STAGE 3 — TENANT MANAGEMENT PLATFORM MOCK DATA
// ============================================

export const mockTenantProfiles: TenantProfile[] = [
  {
    id: "tp-1",
    tenantId: "tenant-1",
    yearEstablished: 1995,
    description: "The Ghana Medical Association is the professional body for medical practitioners in Ghana.",
    mission: "To promote and protect the interests of the medical profession and the health of the people of Ghana.",
    vision: "A healthy nation through excellence in medical practice.",
    objectives: "Advance medical science, promote ethical practice, advocate for better healthcare.",
    website: "https://gma.org.gh",
    socialMediaLinks: ["https://twitter.com/GHMedicalAssoc", "https://linkedin.com/company/gma"],
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-20T00:00:00Z",
  },
]

export const mockTenantBrandings: TenantBranding[] = [
  {
    id: "tb-1",
    tenantId: "tenant-1",
    logo: "",
    coverImage: "",
    primaryColor: "#1a73e8",
    secondaryColor: "#34a853",
    accentColor: "#fbbc04",
    typography: "Inter",
    themeSettings: { layout: "default", sidebar: "dark" },
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-20T00:00:00Z",
  },
]

export const mockRegions: Region[] = [
  { id: "reg-1", tenantId: "tenant-1", name: "Greater Accra", code: "GA", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "reg-2", tenantId: "tenant-1", name: "Ashanti", code: "AH", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "reg-3", tenantId: "tenant-1", name: "Western", code: "WR", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
]

export const mockBranches: Branch[] = [
  { id: "br-1", tenantId: "tenant-1", regionId: "reg-1", name: "Accra Central", code: "ACC-C", location: "Accra", status: "active", createdAt: "2026-04-10T00:00:00Z", updatedAt: "2026-04-10T00:00:00Z" },
  { id: "br-2", tenantId: "tenant-1", regionId: "reg-1", name: "Tema", code: "TEM", location: "Tema", status: "active", createdAt: "2026-04-10T00:00:00Z", updatedAt: "2026-04-10T00:00:00Z" },
  { id: "br-3", tenantId: "tenant-1", regionId: "reg-2", name: "Kumasi", code: "KUM", location: "Kumasi", status: "active", createdAt: "2026-04-12T00:00:00Z", updatedAt: "2026-04-12T00:00:00Z" },
]

export const mockOrgUnits: OrganizationalUnit[] = [
  { id: "ou-1", tenantId: "tenant-1", parentId: null, name: "National Secretariat", type: "national", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ou-2", tenantId: "tenant-1", parentId: "ou-1", name: "Greater Accra Region", type: "regional", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ou-3", tenantId: "tenant-1", parentId: "ou-2", name: "Accra Central Branch", type: "branch", status: "active", createdAt: "2026-04-10T00:00:00Z", updatedAt: "2026-04-10T00:00:00Z" },
]

export const mockExecutivePositions: ExecutivePosition[] = [
  { id: "ep-1", tenantId: "tenant-1", title: "National President", level: "national", termLength: 24, description: "Highest elected office", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ep-2", tenantId: "tenant-1", title: "Vice President", level: "national", termLength: 24, description: "Deputy to the President", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ep-3", tenantId: "tenant-1", title: "National Secretary", level: "national", termLength: 24, description: "Responsible for records and correspondence", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ep-4", tenantId: "tenant-1", title: "National Treasurer", level: "national", termLength: 24, description: "Responsible for financial management", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ep-5", tenantId: "tenant-1", title: "Regional Chairman", level: "regional", termLength: 12, description: "Regional leadership", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ep-6", tenantId: "tenant-1", title: "Branch Chairman", level: "branch", termLength: 12, description: "Branch-level leadership", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
]

export const mockExecutiveAppointments: ExecutiveAppointment[] = [
  { id: "ea-1", tenantId: "tenant-1", executiveId: "user-3", positionId: "ep-1", level: "national", unitId: "ou-1", startDate: "2026-04-15T00:00:00Z", endDate: "2028-04-15T00:00:00Z", status: "active", createdAt: "2026-04-15T00:00:00Z", updatedAt: "2026-04-15T00:00:00Z" },
  { id: "ea-2", tenantId: "tenant-1", executiveId: "user-2", positionId: "ep-3", level: "national", unitId: "ou-1", startDate: "2026-04-15T00:00:00Z", endDate: "2028-04-15T00:00:00Z", status: "active", createdAt: "2026-04-15T00:00:00Z", updatedAt: "2026-04-15T00:00:00Z" },
]

export const mockGovernanceConfigs: GovernanceConfig[] = [
  {
    id: "gc-1",
    tenantId: "tenant-1",
    approvalLevels: ["branch", "regional", "national"],
    governanceHierarchy: { branch: ["regional"], regional: ["national"], national: [] },
    executiveStructure: ["national_president", "vice_president", "national_secretary", "national_treasurer"],
    organizationalRules: ["Two-term limit for president", "Annual general meeting required", "Financial audit every 6 months"],
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
]

export const mockApprovalWorkflows: ApprovalWorkflow[] = [
  {
    id: "aw-1",
    tenantId: "tenant-1",
    name: "Membership Approval",
    stages: [
      { order: 1, label: "Branch Review", approverLevel: "branch", required: true },
      { order: 2, label: "Regional Review", approverLevel: "regional", required: true },
      { order: 3, label: "National Approval", approverLevel: "national", required: true },
    ],
    status: "active",
    createdAt: "2026-04-05T00:00:00Z",
    updatedAt: "2026-04-05T00:00:00Z",
  },
  {
    id: "aw-2",
    tenantId: "tenant-1",
    name: "Expense Approval",
    stages: [
      { order: 1, label: "Branch Chairman Approval", approverLevel: "branch", required: true },
      { order: 2, label: "National Treasurer Approval", approverLevel: "national", required: true },
    ],
    status: "active",
    createdAt: "2026-04-05T00:00:00Z",
    updatedAt: "2026-04-05T00:00:00Z",
  },
]

export const mockTenantDocuments: TenantDocument[] = [
  { id: "td-1", tenantId: "tenant-1", name: "GMA Constitution", type: "policy", url: "/docs/gma-constitution.pdf", status: "active", uploadedBy: "user-1", createdAt: "2026-03-20T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z" },
  { id: "td-2", tenantId: "tenant-1", name: "Registration Certificate", type: "legal", url: "/docs/gma-registration.pdf", status: "active", uploadedBy: "user-1", createdAt: "2026-03-20T00:00:00Z", updatedAt: "2026-03-20T00:00:00Z" },
]

export const mockTenantAuditLogs: TenantAuditLog[] = [
  { id: "tal-1", tenantId: "tenant-1", actor: "Kwame Asante", action: "tenant_created", module: "tenants", record: "Tenant", recordId: "tenant-1", newValue: "Tenant created: Ghana Medical Association", createdAt: "2026-03-15T00:00:00Z" },
  { id: "tal-2", tenantId: "tenant-1", actor: "Kwame Asante", action: "region_created", module: "structure", record: "Region", recordId: "reg-1", newValue: "Region created: Greater Accra", createdAt: "2026-04-01T00:00:00Z" },
  { id: "tal-3", tenantId: "tenant-1", actor: "Kwame Asante", action: "branch_created", module: "structure", record: "Branch", recordId: "br-1", newValue: "Branch created: Accra Central", createdAt: "2026-04-10T00:00:00Z" },
  { id: "tal-4", tenantId: "tenant-1", actor: "Kwame Asante", action: "position_created", module: "executives", record: "ExecutivePosition", recordId: "ep-1", newValue: "Position created: National President", createdAt: "2026-04-01T00:00:00Z" },
  { id: "tal-5", tenantId: "tenant-1", actor: "Kwame Asante", action: "executive_appointed", module: "executives", record: "ExecutiveAppointment", recordId: "ea-1", newValue: "Yaw Mensah appointed as National President", createdAt: "2026-04-15T00:00:00Z" },
  { id: "tal-6", tenantId: "tenant-1", actor: "Kwame Asante", action: "config_changed", module: "governance", record: "GovernanceConfig", recordId: "gc-1", newValue: "Governance configuration updated", createdAt: "2026-04-05T00:00:00Z" },
]

export const mockTenantSettings: TenantSettings[] = [
  {
    id: "ts-1",
    tenantId: "tenant-1",
    general: { locale: "en-GH", timezone: "Africa/Accra", dateFormat: "DD/MM/YYYY" },
    branding: { primaryColor: "#1a73e8", secondaryColor: "#34a853" },
    governance: { approvalChain: "branch->regional->national" },
    membership: {
      categories: [
        { id: "mc-1", name: "Full Member", description: "Licensed medical practitioner", requiresApproval: true, renewalPeriodMonths: 12, fee: 500 },
        { id: "mc-2", name: "Associate Member", description: "Medical student or intern", requiresApproval: false, renewalPeriodMonths: 12, fee: 100 },
        { id: "mc-3", name: "Honorary Member", description: "Awarded for distinguished service", requiresApproval: true, renewalPeriodMonths: 0, fee: 0 },
      ],
      registrationRequirements: ["Valid medical license", "Proof of identity", "Two references"],
      approvalRules: ["Branch committee reviews application", "Regional chairperson approves", "National secretariat issues certificate"],
      renewalRules: ["Renewal notice sent 60 days before expiry", "Late renewal fee applies after 30 days", "Lapsed after 90 days without renewal"],
    },
    finance: { currency: "GHS", fiscalYearStart: "January" },
    notifications: { email: true, sms: false, inApp: true },
    training: { requiresApproval: true, maxParticipants: 100 },
    marketplace: { enabled: false },
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-20T00:00:00Z",
  },
]

// ============================================
// STAGE 4 — MEMBERSHIP MOCK DATA
// ============================================

export const mockMembers: Member[] = [
  {
    id: "mem-1",
    tenantId: "tenant-1",
    membershipNumber: "GMA-0001",
    branchId: "br-1",
    regionId: "reg-1",
    category: "Full Member",
    type: "Full Member",
    status: "active",
    approvalStatus: "active",
    renewalStatus: "current",
    firstName: "Kofi",
    middleName: "",
    lastName: "Ansah",
    gender: "Male",
    dateOfBirth: "1980-03-15",
    photo: "",
    phone: "+233 20 100 0001",
    email: "kofi.ansah@gma.org",
    address: "15 Independence Avenue",
    city: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    profession: "Medical Doctor",
    specialization: "Cardiology",
    businessName: "Ansah Cardiac Centre",
    yearsOfExperience: 15,
    dateRegistered: "2026-04-01T00:00:00Z",
    lastRenewalDate: "2026-04-01T00:00:00Z",
    nextRenewalDate: "2027-04-01T00:00:00Z",
    registeredBy: "self",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "mem-2",
    tenantId: "tenant-1",
    membershipNumber: "GMA-0002",
    branchId: "br-2",
    regionId: "reg-1",
    category: "Full Member",
    type: "Full Member",
    status: "active",
    approvalStatus: "active",
    renewalStatus: "current",
    firstName: "Akua",
    middleName: "Serwaa",
    lastName: "Mensah",
    gender: "Female",
    dateOfBirth: "1985-07-22",
    photo: "",
    phone: "+233 20 100 0002",
    email: "akua.mensah@gma.org",
    address: "42 Harbour Road",
    city: "Tema",
    region: "Greater Accra",
    country: "Ghana",
    profession: "Medical Doctor",
    specialization: "Pediatrics",
    businessName: "Tema Children's Clinic",
    yearsOfExperience: 12,
    dateRegistered: "2026-04-05T00:00:00Z",
    lastRenewalDate: "2026-04-05T00:00:00Z",
    nextRenewalDate: "2027-04-05T00:00:00Z",
    registeredBy: "executive",
    registeredById: "user-3",
    createdAt: "2026-04-05T00:00:00Z",
    updatedAt: "2026-04-05T00:00:00Z",
  },
  {
    id: "mem-3",
    tenantId: "tenant-1",
    membershipNumber: "GMA-0003",
    branchId: "br-3",
    regionId: "reg-2",
    category: "Associate Member",
    type: "Associate Member",
    status: "pending",
    approvalStatus: "under_review",
    renewalStatus: "current",
    firstName: "Yaw",
    middleName: "Boateng",
    lastName: "Asare",
    gender: "Male",
    dateOfBirth: "1998-11-10",
    photo: "",
    phone: "+233 20 100 0003",
    email: "yaw.asare@medstudent.org",
    address: "7 University Road",
    city: "Kumasi",
    region: "Ashanti",
    country: "Ghana",
    profession: "Medical Student",
    specialization: "",
    businessName: "",
    yearsOfExperience: 0,
    dateRegistered: "2026-06-01T00:00:00Z",
    registeredBy: "self",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
]

export const mockApprentices: Apprentice[] = [
  {
    id: "appr-1",
    tenantId: "tenant-1",
    parentMemberId: "mem-1",
    branchId: "br-1",
    regionId: "reg-1",
    status: "active",
    dateRegistered: "2026-05-01T00:00:00Z",
    firstName: "Adwoa",
    lastName: "Sarpong",
    photo: "",
    phone: "+233 20 200 0001",
    email: "adwoa.sarpong@learn.gma.org",
    address: "15 Independence Avenue",
    trade: "Nursing",
    startDate: "2026-05-01T00:00:00Z",
    expectedCompletionDate: "2028-05-01T00:00:00Z",
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "appr-2",
    tenantId: "tenant-1",
    parentMemberId: "mem-1",
    branchId: "br-1",
    regionId: "reg-1",
    status: "active",
    dateRegistered: "2026-05-15T00:00:00Z",
    firstName: "Kwesi",
    lastName: "Nyarko",
    photo: "",
    phone: "+233 20 200 0002",
    email: "kwesi.nyarko@learn.gma.org",
    address: "15 Independence Avenue",
    trade: "Medical Laboratory",
    startDate: "2026-05-15T00:00:00Z",
    expectedCompletionDate: "2028-05-15T00:00:00Z",
    createdAt: "2026-05-15T00:00:00Z",
    updatedAt: "2026-05-15T00:00:00Z",
  },
  {
    id: "appr-3",
    tenantId: "tenant-1",
    parentMemberId: "mem-2",
    branchId: "br-2",
    regionId: "reg-1",
    status: "pending",
    dateRegistered: "2026-06-10T00:00:00Z",
    firstName: "Esi",
    lastName: "Acquah",
    photo: "",
    phone: "+233 20 200 0003",
    email: "esi.acquah@learn.gma.org",
    address: "42 Harbour Road",
    trade: "Pediatric Nursing",
    startDate: "2026-06-10T00:00:00Z",
    expectedCompletionDate: "2028-06-10T00:00:00Z",
    createdAt: "2026-06-10T00:00:00Z",
    updatedAt: "2026-06-10T00:00:00Z",
  },
]

export const mockTransferRecords: TransferRecord[] = []

export const mockUpgradeRequests: UpgradeRequest[] = []

export const mockApprovalRecords: ApprovalRecord[] = [
  {
    id: "ar-1",
    tenantId: "tenant-1",
    memberId: "mem-3",
    workflowId: "aw-1",
    currentStage: 1,
    stages: [
      { order: 1, label: "Branch Review", approverLevel: "branch", status: "pending" },
      { order: 2, label: "Regional Review", approverLevel: "regional", status: "pending" },
      { order: 3, label: "National Approval", approverLevel: "national", status: "pending" },
    ],
    status: "in_progress",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
]

export const mockRenewalRecords: RenewalRecord[] = [
  {
    id: "rr-1",
    tenantId: "tenant-1",
    memberId: "mem-1",
    previousExpiryDate: "2027-04-01T00:00:00Z",
    newExpiryDate: "2028-04-01T00:00:00Z",
    status: "pending",
    amount: 500,
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
]

export const mockMemberDocuments: MemberDocument[] = [
  {
    id: "md-1",
    tenantId: "tenant-1",
    memberId: "mem-1",
    name: "Medical License",
    type: "identification",
    url: "/docs/mem-1/license.pdf",
    status: "active",
    uploadedBy: "mem-1",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "md-2",
    tenantId: "tenant-1",
    memberId: "mem-1",
    name: "Application Form",
    type: "application",
    url: "/docs/mem-1/application.pdf",
    status: "active",
    uploadedBy: "mem-1",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
]

export const mockMemberCommunications: MemberCommunication[] = [
  {
    id: "mc-1",
    tenantId: "tenant-1",
    memberId: "mem-1",
    email: true,
    sms: true,
    push: false,
    inApp: true,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "mc-2",
    tenantId: "tenant-1",
    memberId: "mem-2",
    email: true,
    sms: false,
    push: true,
    inApp: true,
    createdAt: "2026-04-05T00:00:00Z",
    updatedAt: "2026-04-05T00:00:00Z",
  },
]

export const mockMembershipAuditLogs: MembershipAuditLog[] = [
  {
    id: "mal-1",
    tenantId: "tenant-1",
    memberId: "mem-1",
    actor: "Kofi Ansah",
    action: "member_registered",
    recordType: "Member",
    recordId: "mem-1",
    newValue: "Member registered via self-registration",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "mal-2",
    tenantId: "tenant-1",
    memberId: "mem-2",
    actor: "Yaw Mensah",
    action: "member_registered",
    recordType: "Member",
    recordId: "mem-2",
    newValue: "Member registered by executive (Yaw Mensah)",
    createdAt: "2026-04-05T00:00:00Z",
  },
  {
    id: "mal-3",
    tenantId: "tenant-1",
    apprenticeId: "appr-1",
    actor: "Kofi Ansah",
    action: "apprentice_created",
    recordType: "Apprentice",
    recordId: "appr-1",
    newValue: "Apprentice Adwoa Sarpong created under Kofi Ansah",
    createdAt: "2026-05-01T00:00:00Z",
  },
]

export const mockMemberAnalytics: MemberAnalytics = {
  totalMembers: 3,
  activeMembers: 2,
  inactiveMembers: 0,
  totalApprentices: 3,
  pendingApprovals: 1,
  pendingRenewals: 1,
  recentRenewals: 2,
  growthTrends: [
    { month: "Apr", members: 2, apprentices: 0 },
    { month: "May", members: 2, apprentices: 2 },
    { month: "Jun", members: 3, apprentices: 3 },
  ],
}

export const mockRolePermissions: Record<string, string[]> = {
  "role-1": ["*"],
  "role-2": ["leads:read", "leads:write", "leads:assign", "forms:read", "forms:write", "organizations:read"],
  "role-3": ["leads:read", "leads:write", "crm:read", "crm:write"],
  "role-4": ["forms:read", "forms:write", "notifications:read"],
  "role-5": ["leads:read", "leads:write", "crm:read", "members:read", "members:write", "finance:read", "notifications:read", "notifications:write"],
}

// ============================================
// STAGE 5 — FINANCIAL INFRASTRUCTURE MOCK DATA
// ============================================

export const mockWallets: Wallet[] = [
  { id: "wallet-1", tenantId: "memsyst", type: "platform", ownerId: "memsyst", ownerName: "MemSyst Platform", balance: 150000, lockedBalance: 5000, currency: "GHS", status: "active", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "wallet-2", tenantId: "tenant-1", type: "tenant", ownerId: "tenant-1", ownerName: "GHABA", balance: 85000, lockedBalance: 3000, currency: "GHS", status: "active", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-06-10T00:00:00Z" },
  { id: "wallet-3", tenantId: "tenant-1", type: "national", ownerId: "org-unit-1", ownerName: "GHABA National", balance: 40000, lockedBalance: 2000, currency: "GHS", status: "active", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-06-05T00:00:00Z" },
  { id: "wallet-4", tenantId: "tenant-1", type: "regional", ownerId: "region-1", ownerName: "Greater Accra Region", balance: 25000, lockedBalance: 1000, currency: "GHS", status: "active", createdAt: "2026-02-15T00:00:00Z", updatedAt: "2026-06-08T00:00:00Z" },
  { id: "wallet-5", tenantId: "tenant-1", type: "branch", ownerId: "branch-1", ownerName: "Accra Central Branch", balance: 15000, lockedBalance: 500, currency: "GHS", status: "active", createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-06-12T00:00:00Z" },
  { id: "wallet-6", tenantId: "tenant-1", type: "member", ownerId: "mem-1", ownerName: "Kofi Ansah", balance: 5000, lockedBalance: 0, currency: "GHS", status: "active", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-05-20T00:00:00Z" },
  { id: "wallet-7", tenantId: "tenant-1", type: "member", ownerId: "mem-2", ownerName: "Akua Serwaa", balance: 3000, lockedBalance: 0, currency: "GHS", status: "active", createdAt: "2026-04-10T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z" },
  { id: "wallet-8", tenantId: "tenant-1", type: "executive", ownerId: "exec-1", ownerName: "Yaw Mensah", balance: 2000, lockedBalance: 0, currency: "GHS", status: "active", createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "wallet-9", tenantId: "tenant-2", type: "tenant", ownerId: "tenant-2", ownerName: "Teachers Association", balance: 120000, lockedBalance: 4000, currency: "GHS", status: "active", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-06-10T00:00:00Z" },
  { id: "wallet-10", tenantId: "tenant-2", type: "member", ownerId: "mem-3", ownerName: "Ama Danso", balance: 1500, lockedBalance: 0, currency: "GHS", status: "active", createdAt: "2026-04-15T00:00:00Z", updatedAt: "2026-05-25T00:00:00Z" },
]

export const mockTransactions: Transaction[] = [
  { id: "txn-1", tenantId: "tenant-1", referenceNumber: "PAY-2026-001", sourceWalletId: "wallet-6", destinationWalletId: "wallet-2", amount: 500, fee: 25, commission: 50, netAmount: 425, type: "payment", status: "successful", description: "Membership registration fee", createdAt: "2026-04-01T10:00:00Z", updatedAt: "2026-04-01T10:05:00Z" },
  { id: "txn-2", tenantId: "tenant-1", referenceNumber: "PAY-2026-002", sourceWalletId: "wallet-7", destinationWalletId: "wallet-2", amount: 300, fee: 15, commission: 30, netAmount: 255, type: "payment", status: "successful", description: "Annual renewal fee", createdAt: "2026-04-15T14:30:00Z", updatedAt: "2026-04-15T14:35:00Z" },
  { id: "txn-3", tenantId: "tenant-1", referenceNumber: "DIST-2026-001", sourceWalletId: "wallet-2", destinationWalletId: "wallet-4", amount: 100, fee: 0, commission: 0, netAmount: 100, type: "revenue_distribution", status: "successful", description: "Revenue distribution — branch share", createdAt: "2026-04-16T00:00:00Z", updatedAt: "2026-04-16T00:00:00Z" },
  { id: "txn-4", tenantId: "tenant-1", referenceNumber: "WD-2026-001", sourceWalletId: "wallet-5", destinationWalletId: "wallet-1", amount: 2000, fee: 100, commission: 0, netAmount: 1900, type: "withdrawal", status: "successful", description: "Branch withdrawal — Accra Central", createdAt: "2026-05-01T09:00:00Z", updatedAt: "2026-05-03T15:00:00Z" },
  { id: "txn-5", tenantId: "tenant-1", referenceNumber: "COMM-2026-001", sourceWalletId: "wallet-2", destinationWalletId: "wallet-1", amount: 50, fee: 0, commission: 0, netAmount: 50, type: "commission", status: "successful", description: "Platform commission on registration", createdAt: "2026-04-01T10:06:00Z", updatedAt: "2026-04-01T10:06:00Z" },
  { id: "txn-6", tenantId: "tenant-1", referenceNumber: "PAY-2026-003", sourceWalletId: "", destinationWalletId: "wallet-6", amount: 500, fee: 0, commission: 0, netAmount: 500, type: "payment", status: "pending", description: "Wallet funding via Paystack", createdAt: "2026-06-17T08:00:00Z", updatedAt: "2026-06-17T08:00:00Z" },
  { id: "txn-7", tenantId: "tenant-2", referenceNumber: "PAY-2026-004", sourceWalletId: "wallet-10", destinationWalletId: "wallet-9", amount: 200, fee: 10, commission: 20, netAmount: 170, type: "payment", status: "successful", description: "Certificate fee payment", createdAt: "2026-05-10T11:00:00Z", updatedAt: "2026-05-10T11:05:00Z" },
]

export const mockPayments: Payment[] = [
  { id: "pmt-1", tenantId: "tenant-1", transactionId: "txn-1", memberId: "mem-1", paymentMethod: "mobile_money", amount: 500, fee: 25, netAmount: 475, status: "successful", channel: "Paystack", reference: "PS-REF-001", createdAt: "2026-04-01T10:00:00Z", updatedAt: "2026-04-01T10:05:00Z" },
  { id: "pmt-2", tenantId: "tenant-1", transactionId: "txn-2", memberId: "mem-2", paymentMethod: "card", amount: 300, fee: 15, netAmount: 285, status: "successful", channel: "Paystack", reference: "PS-REF-002", createdAt: "2026-04-15T14:30:00Z", updatedAt: "2026-04-15T14:35:00Z" },
  { id: "pmt-3", tenantId: "tenant-2", transactionId: "txn-7", memberId: "mem-3", paymentMethod: "mobile_money", amount: 200, fee: 10, netAmount: 190, status: "successful", channel: "Paystack", reference: "PS-REF-003", createdAt: "2026-05-10T11:00:00Z", updatedAt: "2026-05-10T11:05:00Z" },
]

export const mockRevenueRules: RevenueDistributionRule[] = [
  {
    id: "rule-1", tenantId: "tenant-1", name: "Standard Membership Split", sourceType: "registration", rules: [
      { destinationWalletType: "branch", destinationOwnerId: "branch-1", percentage: 20 },
      { destinationWalletType: "regional", destinationOwnerId: "region-1", percentage: 20 },
      { destinationWalletType: "national", destinationOwnerId: "org-unit-1", percentage: 40 },
      { destinationWalletType: "reserve", destinationOwnerId: "tenant-1", percentage: 10 },
      { destinationWalletType: "platform", destinationOwnerId: "memsyst", percentage: 10 },
    ], effectiveDate: "2026-04-01", status: "active", createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "rule-2", tenantId: "tenant-1", name: "Renewal Split", sourceType: "renewal", rules: [
      { destinationWalletType: "branch", destinationOwnerId: "branch-1", percentage: 30 },
      { destinationWalletType: "national", destinationOwnerId: "org-unit-1", percentage: 50 },
      { destinationWalletType: "platform", destinationOwnerId: "memsyst", percentage: 20 },
    ], effectiveDate: "2026-04-01", status: "active", createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z",
  },
]

export const mockCommissions: Commission[] = [
  { id: "comm-1", tenantId: "tenant-1", transactionId: "txn-1", sourceType: "registration", amount: 50, percentage: 10, createdAt: "2026-04-01T10:06:00Z" },
  { id: "comm-2", tenantId: "tenant-1", transactionId: "txn-2", sourceType: "renewal", amount: 30, percentage: 10, createdAt: "2026-04-15T14:36:00Z" },
  { id: "comm-3", tenantId: "tenant-2", transactionId: "txn-7", sourceType: "certificate", amount: 20, percentage: 10, createdAt: "2026-05-10T11:06:00Z" },
]

export const mockCommissionConfigs: CommissionConfig[] = [
  { id: "cc-1", sourceType: "registration", percentage: 10, effectiveDate: "2026-01-01", status: "active", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "cc-2", sourceType: "renewal", percentage: 10, effectiveDate: "2026-01-01", status: "active", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "cc-3", sourceType: "certificate", percentage: 10, effectiveDate: "2026-01-01", status: "active", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "cc-4", sourceType: "transfer", percentage: 10, effectiveDate: "2026-01-01", status: "active", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "cc-5", sourceType: "marketplace", percentage: 10, effectiveDate: "2026-01-01", status: "inactive", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "cc-6", sourceType: "wallet_funding", percentage: 5, effectiveDate: "2026-01-01", status: "active", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "cc-7", sourceType: "wallet_withdrawal", percentage: 5, effectiveDate: "2026-01-01", status: "active", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
]

export const mockBills: Bill[] = [
  { id: "bill-1", tenantId: "tenant-1", memberId: "mem-1", type: "membership_fee", amount: 500, paidAmount: 500, dueDate: "2026-04-01", paidDate: "2026-04-01", status: "paid", description: "GHABA annual membership fee", createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "bill-2", tenantId: "tenant-1", memberId: "mem-2", type: "renewal_fee", amount: 300, paidAmount: 300, dueDate: "2026-04-15", paidDate: "2026-04-15", status: "paid", description: "Annual renewal", createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-04-15T00:00:00Z" },
  { id: "bill-3", tenantId: "tenant-1", memberId: "mem-1", type: "renewal_fee", amount: 300, paidAmount: 0, dueDate: "2027-04-01", status: "pending", description: "Next annual renewal", createdAt: "2027-03-01T00:00:00Z", updatedAt: "2027-03-01T00:00:00Z" },
  { id: "bill-4", tenantId: "tenant-1", memberId: "mem-3", type: "certificate_fee", amount: 200, paidAmount: 0, dueDate: "2026-07-01", status: "due", description: "Certificate issuance fee", createdAt: "2026-06-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "bill-5", tenantId: "tenant-2", memberId: "mem-3", type: "membership_fee", amount: 400, paidAmount: 200, dueDate: "2026-06-01", status: "partially_paid", description: "Teachers Association membership fee", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-10T00:00:00Z" },
]

export const mockWithdrawals: Withdrawal[] = [
  { id: "wd-1", tenantId: "tenant-1", walletId: "wallet-5", walletType: "branch", ownerName: "Accra Central Branch", amount: 2000, fee: 100, netAmount: 1900, status: "completed", reason: "Branch operational expenses", payoutMethod: "bank_account", payoutDestination: "GH-1234567890-ACCRA", lockedAt: "2026-05-01T09:00:00Z", completedAt: "2026-05-03T15:00:00Z", reviewedBy: "Super Admin", referenceNumber: "REF-WD-001", transferId: "TRF-001", proofOfPayment: "proof-001.pdf", createdAt: "2026-05-01T08:00:00Z", updatedAt: "2026-05-03T15:00:00Z" },
  { id: "wd-2", tenantId: "tenant-1", walletId: "wallet-5", walletType: "branch", ownerName: "Accra Central Branch", amount: 1000, fee: 50, netAmount: 950, status: "under_review", reason: "Quarterly meeting expenses", payoutMethod: "mobile_money", payoutDestination: "233201234567", createdAt: "2026-06-15T10:00:00Z", updatedAt: "2026-06-16T08:00:00Z" },
  { id: "wd-3", tenantId: "tenant-2", walletId: "wallet-9", walletType: "tenant", ownerName: "Teachers Association", amount: 5000, fee: 250, netAmount: 4750, status: "submitted", reason: "National conference budget", payoutMethod: "bank_account", payoutDestination: "GH-9876543210-ACCRA", createdAt: "2026-06-17T09:00:00Z", updatedAt: "2026-06-17T09:00:00Z" },
]

export const mockRefunds: Refund[] = [
  { id: "rfd-1", tenantId: "tenant-1", transactionId: "txn-1", amount: 500, reason: "Member requested cancellation within grace period", status: "completed", requesterId: "user-2", approverId: "user-1", reviewedAt: "2026-04-02T10:00:00Z", createdAt: "2026-04-01T16:00:00Z", updatedAt: "2026-04-02T10:00:00Z" },
  { id: "rfd-2", tenantId: "tenant-1", transactionId: "txn-2", amount: 300, reason: "Duplicate payment", status: "under_review", requesterId: "user-2", createdAt: "2026-06-10T14:00:00Z", updatedAt: "2026-06-10T14:00:00Z" },
]

export const mockReceipts: Receipt[] = [
  { id: "rcpt-1", tenantId: "tenant-1", transactionId: "txn-1", receiptNumber: "RCT-2026-001", amount: 500, payerName: "Kofi Ansah", paymentMethod: "Mobile Money", status: "verified", createdAt: "2026-04-01T10:06:00Z" },
  { id: "rcpt-2", tenantId: "tenant-1", transactionId: "txn-2", receiptNumber: "RCT-2026-002", amount: 300, payerName: "Akua Serwaa", paymentMethod: "Card", status: "verified", createdAt: "2026-04-15T14:36:00Z" },
  { id: "rcpt-3", tenantId: "tenant-2", transactionId: "txn-7", receiptNumber: "RCT-2026-003", amount: 200, payerName: "Ama Danso", paymentMethod: "Mobile Money", status: "generated", createdAt: "2026-05-10T11:06:00Z" },
]

export const mockFinancialSettings: FinancialSettings = {
  id: "fin-set-1", tenantId: "memsyst", currency: "GHS", withdrawalFeePercent: 5, maxWithdrawalPercent: 80, monthlyWithdrawalLimit: 1, messagingCosts: { emailCost: 0.05, smsCost: 0.30, pushCost: 0.02 }, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
}

// ============================================
// STAGE 6 — COMMUNICATION MOCK DATA
// ============================================

export const mockEmailMessages: EmailMessage[] = [
  { id: "email-1", tenantId: "tenant-1", senderId: "user-1", senderName: "Kwame Asante", recipientId: "mem-1", recipientEmail: "kofi.ansah@email.com", recipientName: "Kofi Ansah", subject: "Welcome to GHABA", body: "<h1>Welcome!</h1><p>Dear Kofi, welcome to the Ghana Hairdressers and Barbers Association.</p>", templateId: "tpl-1", status: "delivered", sentAt: "2026-04-01T10:00:00Z", deliveredAt: "2026-04-01T10:00:05Z", openedAt: "2026-04-01T10:30:00Z", cost: 0.05, markup: 0.01, totalCharge: 0.06, createdAt: "2026-04-01T09:00:00Z", updatedAt: "2026-04-01T10:00:05Z" },
  { id: "email-2", tenantId: "tenant-1", senderId: "user-1", senderName: "Kwame Asante", recipientId: "mem-2", recipientEmail: "akua.serwaa@email.com", recipientName: "Akua Serwaa", subject: "Renewal Reminder", body: "<p>Dear Akua, your membership renewal is due soon.</p>", templateId: "tpl-2", status: "sent", sentAt: "2026-06-15T08:00:00Z", cost: 0.05, markup: 0.01, totalCharge: 0.06, createdAt: "2026-06-15T07:00:00Z", updatedAt: "2026-06-15T08:00:00Z" },
  { id: "email-3", tenantId: "tenant-1", campaignId: "camp-1", senderId: "user-1", senderName: "Kwame Asante", recipientId: "mem-1", recipientEmail: "kofi.ansah@email.com", recipientName: "Kofi Ansah", subject: "Upcoming Training Workshop", body: "<p>Join our upcoming braiding techniques workshop.</p>", status: "queued", cost: 0.05, markup: 0.01, totalCharge: 0.06, createdAt: "2026-06-17T12:00:00Z", updatedAt: "2026-06-17T12:00:00Z" },
]

export const mockSMSMessages: SMSMessage[] = [
  { id: "sms-1", tenantId: "tenant-1", senderId: "user-1", recipientId: "mem-1", recipientPhone: "+233201234567", message: "Welcome to GHABA! Your membership is now active.", units: 1, status: "delivered", sentAt: "2026-04-01T10:00:00Z", deliveredAt: "2026-04-01T10:00:03Z", cost: 0.30, markup: 0.05, totalCharge: 0.35, createdAt: "2026-04-01T09:00:00Z", updatedAt: "2026-04-01T10:00:03Z" },
  { id: "sms-2", tenantId: "tenant-1", senderId: "user-1", recipientId: "mem-2", recipientPhone: "+233205567890", message: "Reminder: Your membership renewal is due in 7 days.", units: 1, status: "sent", sentAt: "2026-06-15T08:00:00Z", cost: 0.30, markup: 0.05, totalCharge: 0.35, createdAt: "2026-06-15T07:00:00Z", updatedAt: "2026-06-15T08:00:00Z" },
]

export const mockPushNotifications: PushNotificationRecord[] = [
  { id: "push-1", tenantId: "tenant-1", senderId: "system", recipientId: "mem-1", title: "Welcome!", body: "Welcome to GHABA. Complete your profile to get started.", status: "delivered", sentAt: "2026-04-01T10:00:00Z", deliveredAt: "2026-04-01T10:00:02Z", createdAt: "2026-04-01T09:00:00Z", updatedAt: "2026-04-01T10:00:02Z" },
  { id: "push-2", tenantId: "tenant-1", senderId: "system", recipientId: "mem-2", title: "Renewal Due", body: "Your membership renewal is due in 7 days.", status: "sent", sentAt: "2026-06-15T08:00:00Z", createdAt: "2026-06-15T07:00:00Z", updatedAt: "2026-06-15T08:00:00Z" },
]

export const mockCampaigns: Campaign[] = [
  { id: "camp-1", tenantId: "tenant-1", title: "Membership Drive 2026", description: "Q2 membership recruitment campaign targeting new apprentices", type: "membership_drive", channel: "email", audience: { type: "all_members" }, schedule: { type: "immediate" }, status: "running", templateId: "tpl-1", createdBy: "user-1", sentCount: 150, deliveredCount: 142, openedCount: 89, clickedCount: 45, failedCount: 8, totalCost: 7.50, totalCharge: 9.00, createdAt: "2026-04-01T08:00:00Z", updatedAt: "2026-06-01T08:00:00Z" },
  { id: "camp-2", tenantId: "tenant-1", title: "Renewal Reminder Campaign", description: "Automated renewal reminders for members due in 30 days", type: "renewal_campaign", channel: "sms", audience: { type: "specific_categories", filters: [{ field: "renewalStatus", operator: "eq", value: "due_soon" }] }, schedule: { type: "scheduled", scheduledAt: "2026-07-01T08:00:00Z" }, status: "draft", createdBy: "user-1", sentCount: 0, deliveredCount: 0, openedCount: 0, clickedCount: 0, failedCount: 0, totalCost: 0, totalCharge: 0, createdAt: "2026-06-10T10:00:00Z", updatedAt: "2026-06-10T10:00:00Z" },
  { id: "camp-3", tenantId: "tenant-1", title: "Training Workshop Announcement", description: "Promote upcoming braiding techniques workshop", type: "training_campaign", channel: "email", audience: { type: "all_members" }, schedule: { type: "scheduled", scheduledAt: "2026-06-20T09:00:00Z" }, status: "scheduled", templateId: "tpl-3", createdBy: "user-1", sentCount: 0, deliveredCount: 0, openedCount: 0, clickedCount: 0, failedCount: 0, totalCost: 0, totalCharge: 0, createdAt: "2026-06-17T12:00:00Z", updatedAt: "2026-06-17T12:00:00Z" },
]

export const mockTemplates: Template[] = [
  { id: "tpl-1", tenantId: "tenant-1", name: "Welcome Email", description: "Welcome message sent to new members", type: "email", subject: "Welcome to {{OrganizationName}}", content: "<h1>Welcome {{MemberName}}!</h1><p>Thank you for joining {{OrganizationName}}. Your membership number is {{MembershipNumber}}.</p>", variables: ["MemberName", "OrganizationName", "MembershipNumber"], status: "active", createdBy: "user-1", createdAt: "2026-01-15T10:00:00Z", updatedAt: "2026-01-15T10:00:00Z" },
  { id: "tpl-2", tenantId: "tenant-1", name: "Renewal Reminder Email", description: "Reminder for members approaching renewal date", type: "email", subject: "Membership Renewal Reminder", content: "<p>Dear {{MemberName}}, your membership is due for renewal on {{RenewalDate}}. Amount: {{Amount}}.</p>", variables: ["MemberName", "RenewalDate", "Amount"], status: "active", createdBy: "user-1", createdAt: "2026-02-01T10:00:00Z", updatedAt: "2026-02-01T10:00:00Z" },
  { id: "tpl-3", tenantId: "tenant-1", name: "Training Announcement", description: "Template for training event announcements", type: "email", subject: "Training: {{TrainingName}}", content: "<p>Dear {{MemberName}}, we are pleased to announce {{TrainingName}} on {{TrainingDate}}.</p>", variables: ["MemberName", "TrainingName", "TrainingDate"], status: "active", createdBy: "user-1", createdAt: "2026-03-01T10:00:00Z", updatedAt: "2026-03-10T10:00:00Z" },
  { id: "tpl-4", tenantId: "tenant-1", name: "SMS Welcome", description: "Short welcome SMS", type: "sms", content: "Welcome to {{OrganizationName}}! Your membership is now active.", variables: ["OrganizationName"], status: "active", createdBy: "user-1", createdAt: "2026-01-15T10:00:00Z", updatedAt: "2026-01-15T10:00:00Z" },
  { id: "tpl-5", tenantId: "tenant-1", name: "Payment Receipt", description: "Payment confirmation notification", type: "notification", subject: "Payment Received", content: "Your payment of {{Amount}} has been received successfully.", variables: ["Amount"], status: "active", createdBy: "user-1", createdAt: "2026-02-15T10:00:00Z", updatedAt: "2026-02-15T10:00:00Z" },
]

export const mockSegments: AudienceSegment[] = [
  { id: "seg-1", tenantId: "tenant-1", name: "Active Members in Accra", description: "All active members in the Accra region", filters: [{ field: "status", operator: "eq", value: "active" }, { field: "region", operator: "eq", value: "Greater Accra" }], estimatedCount: 85, createdBy: "user-1", createdAt: "2026-03-01T10:00:00Z", updatedAt: "2026-03-01T10:00:00Z" },
  { id: "seg-2", tenantId: "tenant-1", name: "Pending Renewals", description: "Members with renewal due or overdue", filters: [{ field: "renewalStatus", operator: "in", value: ["due_soon", "overdue"] }], estimatedCount: 42, createdBy: "user-1", createdAt: "2026-04-01T10:00:00Z", updatedAt: "2026-04-01T10:00:00Z" },
  { id: "seg-3", tenantId: "tenant-1", name: "All Apprentices", description: "All active apprentices across all branches", filters: [{ field: "type", operator: "eq", value: "apprentice" }], estimatedCount: 30, createdBy: "user-1", createdAt: "2026-05-01T10:00:00Z", updatedAt: "2026-05-01T10:00:00Z" },
]

export const mockCommunicationPreferences: CommunicationPreference[] = [
  { id: "cp-1", tenantId: "tenant-1", userId: "user-2", memberId: "mem-1", email: true, sms: true, push: true, inApp: true, emailAddress: "kofi.ansah@email.com", phoneNumber: "+233201234567", updatedAt: "2026-04-01T10:00:00Z" },
  { id: "cp-2", tenantId: "tenant-1", userId: "user-3", memberId: "mem-2", email: true, sms: false, push: true, inApp: true, emailAddress: "akua.serwaa@email.com", phoneNumber: "+233205567890", updatedAt: "2026-04-15T14:00:00Z" },
]

export const mockSubscriptions: Subscription[] = [
  { id: "sub-1", tenantId: "tenant-1", userId: "user-2", memberId: "mem-1", category: "announcements", subscribed: true, channel: "email", createdAt: "2026-04-01T10:00:00Z", updatedAt: "2026-04-01T10:00:00Z" },
  { id: "sub-2", tenantId: "tenant-1", userId: "user-2", memberId: "mem-1", category: "events", subscribed: true, channel: "email", createdAt: "2026-04-01T10:00:00Z", updatedAt: "2026-04-01T10:00:00Z" },
  { id: "sub-3", tenantId: "tenant-1", userId: "user-2", memberId: "mem-1", category: "training", subscribed: true, channel: "sms", createdAt: "2026-04-01T10:00:00Z", updatedAt: "2026-04-01T10:00:00Z" },
  { id: "sub-4", tenantId: "tenant-1", userId: "user-3", memberId: "mem-2", category: "announcements", subscribed: true, channel: "email", createdAt: "2026-04-15T14:00:00Z", updatedAt: "2026-04-15T14:00:00Z" },
  { id: "sub-5", tenantId: "tenant-1", userId: "user-3", memberId: "mem-2", category: "events", subscribed: false, channel: "email", createdAt: "2026-04-15T14:00:00Z", updatedAt: "2026-04-15T14:00:00Z" },
]

export const mockEngagementEvents: EngagementEvent[] = [
  { id: "ee-1", tenantId: "tenant-1", userId: "user-2", memberId: "mem-1", eventType: "email_opened", sourceId: "email-1", sourceType: "email", timestamp: "2026-04-01T10:30:00Z" },
  { id: "ee-2", tenantId: "tenant-1", userId: "user-2", memberId: "mem-1", eventType: "notification_read", sourceId: "notif-1", sourceType: "notification", timestamp: "2026-04-01T11:00:00Z" },
  { id: "ee-3", tenantId: "tenant-1", userId: "user-3", memberId: "mem-2", eventType: "email_opened", sourceId: "email-2", sourceType: "email", timestamp: "2026-06-15T08:30:00Z" },
]

export const mockDeliveryLogs: DeliveryLog[] = [
  { id: "dl-1", tenantId: "tenant-1", messageId: "email-1", channel: "email", recipientId: "mem-1", status: "delivered", attempts: 1, maxAttempts: 3, lastAttemptAt: "2026-04-01T10:00:05Z", createdAt: "2026-04-01T09:00:00Z", updatedAt: "2026-04-01T10:00:05Z" },
  { id: "dl-2", tenantId: "tenant-1", messageId: "sms-1", channel: "sms", recipientId: "mem-1", status: "delivered", attempts: 1, maxAttempts: 3, lastAttemptAt: "2026-04-01T10:00:03Z", createdAt: "2026-04-01T09:00:00Z", updatedAt: "2026-04-01T10:00:03Z" },
  { id: "dl-3", tenantId: "tenant-1", messageId: "email-2", channel: "email", recipientId: "mem-2", status: "sent", attempts: 1, maxAttempts: 3, lastAttemptAt: "2026-06-15T08:00:00Z", createdAt: "2026-06-15T07:00:00Z", updatedAt: "2026-06-15T08:00:00Z" },
]

export const mockBroadcastMessages: BroadcastMessage[] = [
  { id: "bc-1", tenantId: "tenant-1", title: "National Executive Announcement", message: "We are pleased to announce the appointment of new regional executives for the upcoming term.", scope: "national", scopeId: "org-unit-1", channel: ["email", "sms"], senderId: "user-1", senderName: "Kwame Asante", senderRole: "super_admin", status: "completed", sentCount: 250, createdAt: "2026-05-01T10:00:00Z", updatedAt: "2026-05-01T12:00:00Z" },
  { id: "bc-2", tenantId: "tenant-1", title: "Branch Meeting Notice", message: "Monthly branch meeting scheduled for Friday at 3pm.", scope: "branch", scopeId: "branch-1", channel: ["push", "in_app"], senderId: "user-1", senderName: "Kwame Asante", senderRole: "super_admin", status: "completed", sentCount: 45, createdAt: "2026-06-01T09:00:00Z", updatedAt: "2026-06-01T10:00:00Z" },
]

export const mockAutomationRules: AutomationRule[] = [
  { id: "auto-1", tenantId: "tenant-1", name: "Welcome New Member", description: "Send welcome email when member is approved", triggerEvent: "member.approved", actionType: "send_email", templateId: "tpl-1", channel: "email", delayMinutes: 0, isActive: true, createdBy: "user-1", createdAt: "2026-01-15T10:00:00Z", updatedAt: "2026-01-15T10:00:00Z" },
  { id: "auto-2", tenantId: "tenant-1", name: "Renewal Reminder", description: "Send SMS reminder when renewal is due", triggerEvent: "renewal.due", actionType: "send_sms", templateId: "tpl-4", channel: "sms", delayMinutes: 0, isActive: true, createdBy: "user-1", createdAt: "2026-02-01T10:00:00Z", updatedAt: "2026-02-01T10:00:00Z" },
  { id: "auto-3", tenantId: "tenant-1", name: "Payment Receipt", description: "Send payment receipt notification", triggerEvent: "payment.successful", actionType: "send_in_app", channel: "in_app", delayMinutes: 0, isActive: false, createdBy: "user-1", createdAt: "2026-03-01T10:00:00Z", updatedAt: "2026-03-01T10:00:00Z" },
]

export const mockCommunicationAuditLogs: CommunicationAuditLog[] = [
  { id: "caud-1", tenantId: "tenant-1", actor: "Kwame Asante", action: "campaign_created", channel: "email", audience: "all_members", targetId: "camp-1", details: "Created membership drive campaign", result: "success", createdAt: "2026-04-01T08:00:00Z" },
  { id: "caud-2", tenantId: "tenant-1", actor: "Kwame Asante", action: "template_modified", channel: "email", targetId: "tpl-3", details: "Updated training announcement template", result: "success", createdAt: "2026-03-10T10:00:00Z" },
  { id: "caud-3", tenantId: "tenant-1", actor: "System", action: "message_sent", channel: "email", audience: "Kofi Ansah", targetId: "email-1", details: "Welcome email sent to new member", result: "success", createdAt: "2026-04-01T10:00:00Z" },
  { id: "caud-4", tenantId: "tenant-1", actor: "Ama Osei", action: "preference_changed", channel: "sms", targetId: "cp-2", details: "Disabled SMS notifications", result: "success", createdAt: "2026-04-15T14:00:00Z" },
  { id: "caud-5", tenantId: "tenant-1", actor: "Kwame Asante", action: "broadcast_sent", channel: "email", audience: "National", targetId: "bc-1", details: "National executive announcement broadcast", result: "success", createdAt: "2026-05-01T10:00:00Z" },
]

// ============================================
// STAGE 7 — DIGITAL IDENTITY, ID CARDS & CREDENTIAL PLATFORM MOCK DATA
// ============================================

export const mockIDCards: IDCard[] = [
  {
    id: "idc-1",
    tenantId: "tenant-1",
    ownerId: "mem-1",
    ownerType: "member",
    cardNumber: "GMA-ID-0001",
    credentialNumber: "CRED-ID-0001",
    status: "active",
    issueDate: "2026-04-01T00:00:00Z",
    expiryDate: "2028-04-01T00:00:00Z",
    fullName: "Kofi Ansah",
    membershipNumber: "GMA-0001",
    category: "Full Member",
    organization: "Ghana Medical Association",
    branch: "Accra Central",
    region: "Greater Accra",
    photo: "",
    qrCode: "qr-gma-id-0001",
    verificationCode: "VER-ID-0001",
    reprintCount: 0,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "idc-2",
    tenantId: "tenant-1",
    ownerId: "appr-1",
    ownerType: "apprentice",
    cardNumber: "GMA-ID-0002",
    credentialNumber: "CRED-ID-0002",
    status: "unprinted",
    issueDate: "2026-05-01T00:00:00Z",
    expiryDate: "2028-05-01T00:00:00Z",
    fullName: "Adwoa Sarpong",
    membershipNumber: "GMA-APPR-0001",
    category: "Apprentice",
    organization: "Ghana Medical Association",
    branch: "Accra Central",
    region: "Greater Accra",
    photo: "",
    qrCode: "qr-gma-id-0002",
    verificationCode: "VER-ID-0002",
    reprintCount: 0,
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "idc-3",
    tenantId: "tenant-1",
    ownerId: "user-3",
    ownerType: "executive",
    cardNumber: "GMA-ID-0003",
    credentialNumber: "CRED-ID-0003",
    status: "active",
    issueDate: "2026-04-15T00:00:00Z",
    expiryDate: "2028-04-15T00:00:00Z",
    fullName: "Yaw Mensah",
    membershipNumber: "GMA-EXEC-0001",
    category: "Executive",
    organization: "Ghana Medical Association",
    branch: "National Secretariat",
    region: "Greater Accra",
    photo: "",
    qrCode: "qr-gma-id-0003",
    verificationCode: "VER-ID-0003",
    reprintCount: 1,
    lastPrintedAt: "2026-05-01T00:00:00Z",
    createdAt: "2026-04-15T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
]

export const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    tenantId: "tenant-1",
    ownerId: "mem-1",
    certificateType: "membership",
    certificateNumber: "GMA-CERT-0001",
    credentialNumber: "CRED-CERT-0001",
    status: "active",
    issueDate: "2026-04-01T00:00:00Z",
    expiryDate: "2027-04-01T00:00:00Z",
    recipientName: "Kofi Ansah",
    organization: "Ghana Medical Association",
    program: "Full Membership",
    verificationCode: "VER-CERT-0001",
    qrCode: "qr-gma-cert-0001",
    reprintCount: 0,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "cert-2",
    tenantId: "tenant-1",
    ownerId: "mem-2",
    certificateType: "training",
    certificateNumber: "GMA-CERT-0002",
    credentialNumber: "CRED-CERT-0002",
    status: "active",
    issueDate: "2026-06-15T00:00:00Z",
    recipientName: "Akua Serwaa",
    organization: "Ghana Medical Association",
    program: "Braiding Techniques Workshop",
    verificationCode: "VER-CERT-0002",
    qrCode: "qr-gma-cert-0002",
    reprintCount: 0,
    createdAt: "2026-06-15T00:00:00Z",
    updatedAt: "2026-06-15T00:00:00Z",
  },
  {
    id: "cert-3",
    tenantId: "tenant-1",
    ownerId: "user-3",
    certificateType: "executive_appointment",
    certificateNumber: "GMA-CERT-0003",
    credentialNumber: "CRED-CERT-0003",
    status: "active",
    issueDate: "2026-04-15T00:00:00Z",
    expiryDate: "2028-04-15T00:00:00Z",
    recipientName: "Yaw Mensah",
    organization: "Ghana Medical Association",
    program: "National President Appointment",
    verificationCode: "VER-CERT-0003",
    qrCode: "qr-gma-cert-0003",
    reprintCount: 0,
    createdAt: "2026-04-15T00:00:00Z",
    updatedAt: "2026-04-15T00:00:00Z",
  },
]

export const mockCredentialTemplates: CredentialTemplate[] = [
  {
    id: "ct-1",
    tenantId: "tenant-1",
    name: "Standard ID Card Front",
    description: "Front face template for member ID cards",
    type: "id_card_front",
    logo: "",
    primaryColor: "#1a73e8",
    secondaryColor: "#34a853",
    typography: "Inter",
    fields: [
      { id: "fld-1", label: "Full Name", key: "fullName", x: 50, y: 180, fontSize: 18, fontWeight: "bold", color: "#000000" },
      { id: "fld-2", label: "Membership Number", key: "membershipNumber", x: 50, y: 220, fontSize: 12, fontWeight: "normal", color: "#555555" },
      { id: "fld-3", label: "Category", key: "category", x: 50, y: 240, fontSize: 12, fontWeight: "normal", color: "#555555" },
    ],
    qrPlacement: { x: 350, y: 160 },
    version: 1,
    status: "active",
    createdBy: "user-1",
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "ct-2",
    tenantId: "tenant-1",
    name: "Standard ID Card Back",
    description: "Back face template for member ID cards",
    type: "id_card_back",
    logo: "",
    primaryColor: "#1a73e8",
    secondaryColor: "#34a853",
    typography: "Inter",
    fields: [
      { id: "fld-4", label: "Organization", key: "organization", x: 50, y: 100, fontSize: 14, fontWeight: "bold", color: "#000000" },
      { id: "fld-5", label: "Branch", key: "branch", x: 50, y: 130, fontSize: 12, fontWeight: "normal", color: "#555555" },
    ],
    qrPlacement: { x: 300, y: 80 },
    version: 1,
    status: "draft",
    createdBy: "user-1",
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "ct-3",
    tenantId: "tenant-1",
    name: "Membership Certificate",
    description: "Standard membership certificate template",
    type: "certificate",
    logo: "",
    primaryColor: "#1a73e8",
    secondaryColor: "#fbbc04",
    typography: "Merriweather",
    fields: [
      { id: "fld-6", label: "Recipient Name", key: "recipientName", x: 200, y: 200, fontSize: 24, fontWeight: "bold", color: "#000000" },
      { id: "fld-7", label: "Program", key: "program", x: 200, y: 250, fontSize: 16, fontWeight: "normal", color: "#333333" },
      { id: "fld-8", label: "Issue Date", key: "issueDate", x: 200, y: 300, fontSize: 14, fontWeight: "normal", color: "#555555" },
    ],
    qrPlacement: { x: 450, y: 400 },
    signaturePlacement: { x: 200, y: 400 },
    version: 2,
    status: "active",
    createdBy: "user-1",
    createdAt: "2026-02-15T00:00:00Z",
    updatedAt: "2026-03-01T00:00:00Z",
  },
]

export const mockPrintRequests: PrintRequest[] = [
  {
    id: "pr-1",
    tenantId: "tenant-1",
    credentialId: "idc-2",
    credentialType: "id_card",
    requestType: "print",
    status: "pending",
    requestedBy: "System",
    requestedById: "system",
    createdAt: "2026-06-17T00:00:00Z",
    updatedAt: "2026-06-17T00:00:00Z",
  },
  {
    id: "pr-2",
    tenantId: "tenant-1",
    credentialId: "idc-3",
    credentialType: "id_card",
    requestType: "reprint",
    status: "approved",
    requestedBy: "Yaw Mensah",
    requestedById: "user-3",
    reason: "Lost card replacement",
    fee: 20,
    reprintCount: 2,
    createdAt: "2026-05-10T00:00:00Z",
    updatedAt: "2026-05-11T00:00:00Z",
  },
  {
    id: "pr-3",
    tenantId: "tenant-1",
    credentialId: "cert-1",
    credentialType: "certificate",
    requestType: "print",
    status: "completed",
    requestedBy: "System",
    requestedById: "system",
    completedAt: "2026-04-02T00:00:00Z",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-02T00:00:00Z",
  },
]

export const mockVerificationRecords: VerificationRecord[] = [
  {
    id: "vr-1",
    credentialId: "idc-1",
    credentialType: "id_card",
    method: "qr_code",
    status: "valid",
    holderName: "Kofi Ansah",
    organization: "Ghana Medical Association",
    issueDate: "2026-04-01T00:00:00Z",
    expiryDate: "2028-04-01T00:00:00Z",
    verifiedAt: "2026-06-01T10:00:00Z",
    ipAddress: "192.168.1.10",
  },
  {
    id: "vr-2",
    credentialId: "cert-1",
    credentialType: "certificate",
    method: "credential_number",
    status: "valid",
    holderName: "Kofi Ansah",
    organization: "Ghana Medical Association",
    issueDate: "2026-04-01T00:00:00Z",
    expiryDate: "2027-04-01T00:00:00Z",
    verifiedAt: "2026-06-15T14:30:00Z",
  },
]

export const mockCredentialFiles: CredentialFile[] = [
  {
    id: "cf-1",
    tenantId: "tenant-1",
    credentialId: "idc-1",
    credentialType: "id_card",
    fileName: "idc-1-front.png",
    fileType: "image/png",
    fileSize: 245760,
    url: "/repos/idc-1-front.png",
    uploadedAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "cf-2",
    tenantId: "tenant-1",
    credentialId: "cert-1",
    credentialType: "certificate",
    fileName: "cert-1.pdf",
    fileType: "application/pdf",
    fileSize: 512000,
    url: "/repos/cert-1.pdf",
    uploadedAt: "2026-04-01T10:00:00Z",
  },
]

export const mockCredentialAuditLogs: CredentialAuditLog[] = [
  {
    id: "caudl-1",
    tenantId: "tenant-1",
    credentialId: "idc-1",
    credentialType: "id_card",
    action: "credential_generated",
    actor: "System",
    after: '{"status":"unprinted"}',
    details: "ID card generated for Kofi Ansah upon member approval",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "caudl-2",
    tenantId: "tenant-1",
    credentialId: "idc-1",
    credentialType: "id_card",
    action: "credential_printed",
    actor: "System",
    before: '{"status":"unprinted"}',
    after: '{"status":"printed"}',
    details: "Initial print completed",
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "caudl-3",
    tenantId: "tenant-1",
    credentialId: "idc-1",
    credentialType: "id_card",
    action: "credential_verified",
    actor: "System",
    details: "ID card verified via QR code",
    createdAt: "2026-06-01T10:00:00Z",
  },
]

export const mockCredentialSettings: CredentialSettings = {
  id: "cs-1",
  tenantId: "tenant-1",
  idCardReprintFee: 20,
  certificateReprintFee: 15,
  idCardExpiryMonths: 24,
  certificateExpiryMonths: 12,
  autoGenerateOnApproval: true,
  autoGenerateOnUpgrade: true,
  verificationRequiresAuth: false,
  createdAt: "2026-03-15T00:00:00Z",
  updatedAt: "2026-03-15T00:00:00Z",
}

export const mockMarketplaceListings: MarketplaceListing[] = [
  {
    id: "ml-1",
    tenantId: "tenant-1",
    memberId: "mem-1",
    listingType: "product",
    title: "GMA Branded Scrubs",
    description: "High-quality medical scrubs embroidered with the GMA logo. Available in all sizes.",
    status: "active",
    price: 120,
    currency: "GHS",
    location: "Accra",
    images: [],
    videos: [],
    documents: [],
    categoryId: "bc-1",
    tags: ["scrubs", "uniform", "medical"],
    viewCount: 45,
    createdDate: "2026-05-01T00:00:00Z",
    expiryDate: "2026-12-31T00:00:00Z",
    publishedAt: "2026-05-01T00:00:00Z",
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "ml-2",
    tenantId: "tenant-1",
    memberId: "mem-1",
    listingType: "service",
    title: "Cardiology Consultation",
    description: "Expert cardiology consultation services by Dr. Kofi Ansah. Specializing in preventive cardiac care.",
    status: "active",
    price: 350,
    currency: "GHS",
    location: "Accra",
    images: [],
    videos: [],
    documents: [],
    tags: ["cardiology", "consultation", "health"],
    viewCount: 120,
    createdDate: "2026-05-10T00:00:00Z",
    expiryDate: "2026-12-31T00:00:00Z",
    publishedAt: "2026-05-10T00:00:00Z",
    createdAt: "2026-05-10T00:00:00Z",
    updatedAt: "2026-05-10T00:00:00Z",
  },
  {
    id: "ml-3",
    tenantId: "tenant-1",
    memberId: "mem-1",
    listingType: "business_promotion",
    title: "Ansah Cardiac Centre Grand Opening",
    description: "Celebrating the grand opening of Ansah Cardiac Centre. Special discounts on first consultations.",
    status: "active",
    images: [],
    videos: [],
    documents: [],
    tags: ["promotion", "cardiac", "grand-opening"],
    viewCount: 78,
    createdDate: "2026-05-15T00:00:00Z",
    expiryDate: "2026-07-15T00:00:00Z",
    publishedAt: "2026-05-15T00:00:00Z",
    createdAt: "2026-05-15T00:00:00Z",
    updatedAt: "2026-05-15T00:00:00Z",
  },
  {
    id: "ml-4",
    tenantId: "tenant-1",
    memberId: "mem-1",
    listingType: "event",
    title: "Annual Medical Conference 2026",
    description: "The Ghana Medical Association's annual conference featuring keynote speakers, workshops, and networking.",
    status: "pending_review",
    price: 500,
    currency: "GHS",
    location: "Kumasi",
    images: [],
    videos: [],
    documents: [],
    tags: ["conference", "medical", "annual"],
    viewCount: 200,
    createdDate: "2026-06-01T00:00:00Z",
    publishedAt: "2026-06-01T00:00:00Z",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "ml-5",
    tenantId: "tenant-1",
    memberId: "mem-2",
    listingType: "announcement",
    title: "New Partnership with City Hospital",
    description: "Tema Children's Clinic announces a new partnership with City Hospital for paediatric referrals.",
    status: "approved",
    images: [],
    videos: [],
    documents: [],
    tags: ["partnership", "paediatric", "announcement"],
    viewCount: 32,
    createdDate: "2026-06-10T00:00:00Z",
    publishedAt: "2026-06-10T00:00:00Z",
    createdAt: "2026-06-10T00:00:00Z",
    updatedAt: "2026-06-10T00:00:00Z",
  },
]

export const mockBusinessProfiles: BusinessProfile[] = [
  {
    id: "bp-1",
    tenantId: "tenant-1",
    memberId: "mem-1",
    businessName: "Ansah Cardiac Centre",
    categoryId: "bc-1",
    description: "Leading cardiac care centre in Accra specialising in preventive cardiology, diagnostics, and treatment.",
    status: "active",
    verificationStatus: "verified",
    verificationType: "verified_member_business",
    verifiedAt: "2026-05-15T00:00:00Z",
    verifiedBy: "user-1",
    address: "15 Independence Avenue, Accra",
    phone: "+233 20 100 0001",
    email: "info@ansahcardiac.com",
    website: "https://ansahcardiac.com",
    socialMedia: ["@ansahcardiac", "Ansah Cardiac Centre"],
    operatingHours: { "Monday-Friday": "8:00-17:00", "Saturday": "9:00-13:00" },
    logo: "",
    gallery: [],
    promotionalImages: [],
    services: ["Cardiology Consultation", "ECG", "Echocardiography", "Stress Testing"],
    products: [],
    createdAt: "2026-04-15T00:00:00Z",
    updatedAt: "2026-05-15T00:00:00Z",
  },
  {
    id: "bp-2",
    tenantId: "tenant-1",
    memberId: "mem-2",
    businessName: "Tema Children's Clinic",
    categoryId: "bc-1",
    description: "Dedicated paediatric clinic providing comprehensive healthcare for children in Tema.",
    status: "active",
    verificationStatus: "pending",
    address: "42 Harbour Road, Tema",
    phone: "+233 20 100 0002",
    email: "info@temachildrensclinic.com",
    website: "",
    socialMedia: [],
    operatingHours: { "Monday-Friday": "8:00-18:00", "Saturday": "9:00-14:00" },
    logo: "",
    gallery: [],
    promotionalImages: [],
    services: ["Paediatric Consultation", "Vaccination", "Child Health Screening"],
    products: [],
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
]

export const mockBusinessCategories: BusinessCategory[] = [
  {
    id: "bc-1",
    tenantId: "tenant-1",
    name: "Hair Salon",
    description: "Professional hair styling, cutting, and treatment services",
    sortOrder: 1,
    status: "active",
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "bc-2",
    tenantId: "tenant-1",
    name: "Barber Shop",
    description: "Traditional and modern barbering services for men",
    sortOrder: 2,
    status: "active",
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "bc-3",
    tenantId: "tenant-1",
    name: "Makeup Studio",
    description: "Professional makeup application and beauty services",
    sortOrder: 3,
    status: "active",
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "bc-4",
    tenantId: "tenant-1",
    name: "Beauty Training Center",
    description: "Accredited training programs for beauty and cosmetology professionals",
    sortOrder: 4,
    status: "active",
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "bc-5",
    tenantId: "tenant-1",
    name: "Nail Studio",
    description: "Professional nail care, art, and enhancement services",
    sortOrder: 5,
    status: "active",
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
  },
]

export const mockMarketplaceOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    tenantId: "tenant-1",
    memberId: "mem-1",
    opportunityType: "employment",
    title: "Senior Cardiologist",
    description: "Seeking an experienced cardiologist to join Ansah Cardiac Centre. Full-time position with competitive benefits.",
    requirements: ["MBChB or equivalent", "Specialisation in Cardiology", "Minimum 5 years experience", "GMA membership"],
    location: "Accra",
    applicationDeadline: "2026-08-31T00:00:00Z",
    status: "open",
    viewCount: 150,
    applicationCount: 1,
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "opp-2",
    tenantId: "tenant-1",
    memberId: "mem-2",
    opportunityType: "partnership",
    title: "Medical Equipment Supply Partnership",
    description: "Tema Children's Clinic seeks a reliable medical equipment supplier for ongoing partnership.",
    requirements: ["Registered supplier", "Medical equipment certification", "Proven track record"],
    location: "Tema",
    status: "open",
    viewCount: 67,
    applicationCount: 0,
    createdAt: "2026-06-05T00:00:00Z",
    updatedAt: "2026-06-05T00:00:00Z",
  },
  {
    id: "opp-3",
    tenantId: "tenant-1",
    memberId: "mem-2",
    opportunityType: "tender",
    title: "Hospital Renovation Tender",
    description: "Tenders invited for the renovation of paediatric ward at Tema Children's Clinic.",
    requirements: ["Licensed contractor", "Health facility experience", "Valid insurance"],
    location: "Tema",
    applicationDeadline: "2026-07-15T00:00:00Z",
    status: "open",
    viewCount: 89,
    applicationCount: 0,
    createdAt: "2026-06-10T00:00:00Z",
    updatedAt: "2026-06-10T00:00:00Z",
  },
]

export const mockMarketplaceOpportunityApplications: OpportunityApplication[] = [
  {
    id: "oa-1",
    tenantId: "tenant-1",
    opportunityId: "opp-1",
    applicantId: "mem-2",
    applicantName: "Akua Mensah",
    applicantEmail: "akua.mensah@gma.org",
    message: "I am a paediatrician with 12 years of experience and I am interested in transitioning to adult cardiology. I believe my skills would be an asset to Ansah Cardiac Centre.",
    status: "pending",
    createdAt: "2026-06-12T00:00:00Z",
  },
]

export const mockMarketplaceApprovals: MarketplaceApproval[] = [
  {
    id: "ma-1",
    tenantId: "tenant-1",
    listingId: "ml-4",
    listingType: "listing",
    status: "pending",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "ma-2",
    tenantId: "tenant-1",
    listingId: "bp-2",
    listingType: "business",
    status: "pending",
    createdAt: "2026-05-01T00:00:00Z",
  },
]

export const mockMarketplaceModerationRecords: MarketplaceModerationRecord[] = [
  {
    id: "mmr-1",
    tenantId: "tenant-1",
    listingId: "ml-1",
    action: "flagged",
    reason: "Reported for potentially misleading pricing information",
    performedBy: "Kwame Asante",
    performedById: "user-1",
    createdAt: "2026-06-15T00:00:00Z",
  },
]

export const mockMarketplaceAuditLogs: MarketplaceAuditLog[] = [
  {
    id: "mal-1",
    tenantId: "tenant-1",
    actor: "Kofi Ansah",
    action: "listing_created",
    recordType: "listing",
    recordId: "ml-1",
    details: "Created product listing: GMA Branded Scrubs",
    createdAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "mal-2",
    tenantId: "tenant-1",
    actor: "Kwame Asante",
    action: "listing_approved",
    recordType: "listing",
    recordId: "ml-3",
    previousValue: "pending_review",
    newValue: "approved",
    details: "Approved business promotion listing for Ansah Cardiac Centre",
    createdAt: "2026-05-16T00:00:00Z",
  },
  {
    id: "mal-3",
    tenantId: "tenant-1",
    actor: "Kofi Ansah",
    action: "business_created",
    recordType: "business",
    recordId: "bp-1",
    details: "Created business profile: Ansah Cardiac Centre",
    createdAt: "2026-04-15T00:00:00Z",
  },
]

export const mockMarketplaceSettings: MarketplaceSettings = {
  id: "ms-1",
  tenantId: "tenant-1",
  approvalRequired: true,
  defaultListingDurationDays: 30,
  maxImagesPerListing: 10,
  allowMemberDirectoryVisibility: true,
  businessVerificationRequired: true,
  autoPublishVerifiedBusinesses: true,
  marketplaceEnabled: true,
  createdAt: "2026-03-15T00:00:00Z",
  updatedAt: "2026-03-15T00:00:00Z",
}

export const mockTrainingCenters: TrainingCenter[] = [
  {
    id: "tc-1",
    tenantId: "tenant-1",
    businessId: "bp-1",
    name: "Ansah Cardiac Training Academy",
    ownerId: "mem-1",
    ownerName: "Kofi Ansah",
    location: "Accra",
    coursesOffered: ["Advanced Cardiac Life Support", "ECG Interpretation", "Basic Life Support"],
    status: "active",
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
]

export const mockMemberDirectoryProfiles: MemberDirectoryProfile[] = [
  {
    id: "mdp-1",
    tenantId: "tenant-1",
    memberId: "mem-1",
    displayBusinessName: true,
    displayProfessionalCategory: true,
    displayServices: true,
    displayLocation: true,
    displayContact: true,
    businessName: "Ansah Cardiac Centre",
    professionalCategory: "Cardiology",
    services: ["Cardiology Consultation", "ECG", "Echocardiography", "Stress Testing"],
    location: "Accra",
    contactInfo: "+233 20 100 0001",
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
]
