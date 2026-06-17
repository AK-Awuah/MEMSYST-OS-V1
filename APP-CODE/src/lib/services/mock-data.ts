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
    subdomain: "gma",
    country: "Ghana",
    industry: "Association",
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
]

export const mockRolePermissions: Record<string, string[]> = {
  "role-1": ["*"],
  "role-2": ["leads:read", "leads:write", "leads:assign", "forms:read", "forms:write", "organizations:read"],
  "role-3": ["leads:read", "leads:write", "crm:read", "crm:write"],
  "role-4": ["forms:read", "forms:write", "notifications:read"],
  "role-5": ["leads:read", "leads:write", "crm:read", "members:read", "members:write", "finance:read", "notifications:read", "notifications:write"],
}
