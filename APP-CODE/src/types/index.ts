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
  | "tenant_created"
  | "tenant_updated"
  | "tenant_activated"
  | "tenant_suspended"
  | "tenant_archived"
  | "region_created"
  | "branch_created"
  | "position_created"
  | "executive_appointed"
  | "config_changed"

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
  abbreviation: string
  domain: string
  subdomain: string
  organizationType: string
  country: string
  region: string
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
  recentFailedLogins: SecurityEvent[]
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

// ============================================
// STAGE 3 — TENANT MANAGEMENT PLATFORM (TMP)
// ============================================

// --- Tenant Profile (Module 2) ---
export interface TenantProfile {
  id: string
  tenantId: string
  yearEstablished: number
  description: string
  mission: string
  vision: string
  objectives: string
  website: string
  socialMediaLinks: string[]
  createdAt: string
  updatedAt: string
}

// --- Tenant Branding (Module 3) ---
export interface TenantBranding {
  id: string
  tenantId: string
  logo: string
  coverImage: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  typography: string
  themeSettings: Record<string, string>
  createdAt: string
  updatedAt: string
}

// --- Organizational Structure (Module 4) ---
export type OrgUnitType = "national" | "regional" | "branch" | "department"

export interface OrganizationalUnit {
  id: string
  tenantId: string
  parentId: string | null
  name: string
  type: OrgUnitType
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Regional Management (Module 5) ---
export interface Region {
  id: string
  tenantId: string
  name: string
  code: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Branch Management (Module 6) ---
export interface Branch {
  id: string
  tenantId: string
  regionId: string
  name: string
  code: string
  location: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Executive Structure (Module 7) ---
export interface ExecutivePosition {
  id: string
  tenantId: string
  title: string
  level: "national" | "regional" | "branch"
  termLength: number
  description: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export type AppointmentStatus = "active" | "expired" | "resigned" | "removed" | "completed"

// --- Executive Appointment (Module 8) ---
export interface ExecutiveAppointment {
  id: string
  tenantId: string
  executiveId: string
  positionId: string
  level: "national" | "regional" | "branch"
  unitId: string
  startDate: string
  endDate: string
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
}

// --- Governance Configuration (Module 9) ---
export interface GovernanceConfig {
  id: string
  tenantId: string
  approvalLevels: string[]
  governanceHierarchy: Record<string, string[]>
  executiveStructure: string[]
  organizationalRules: string[]
  createdAt: string
  updatedAt: string
}

// --- Approval Workflow (Module 12) ---
export interface ApprovalWorkflow {
  id: string
  tenantId: string
  name: string
  stages: ApprovalStage[]
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface ApprovalStage {
  order: number
  label: string
  approverLevel: string
  required: boolean
}

// --- Tenant Settings (Module 13) ---
export interface TenantSettings {
  id: string
  tenantId: string
  general: Record<string, unknown>
  branding: Record<string, unknown>
  governance: Record<string, unknown>
  membership: MembershipFrameworkConfig
  finance: Record<string, unknown>
  notifications: Record<string, unknown>
  training: Record<string, unknown>
  marketplace: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// --- Membership Framework Config (Module 11 - Stage 4 prep) ---
export interface MembershipFrameworkConfig {
  categories: MembershipCategory[]
  registrationRequirements: string[]
  approvalRules: string[]
  renewalRules: string[]
}

export interface MembershipCategory {
  id: string
  name: string
  description: string
  requiresApproval: boolean
  renewalPeriodMonths: number
  fee: number
}

// --- Tenant Document (Module 17) ---
export interface TenantDocument {
  id: string
  tenantId: string
  name: string
  type: string
  url: string
  status: "active" | "archived"
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

// --- Tenant Audit (Module 18) ---
export interface TenantAuditLog {
  id: string
  tenantId: string
  actor: string
  action: string
  module: string
  record: string
  recordId: string
  previousValue?: string
  newValue?: string
  createdAt: string
}

// --- Tenant Analytics Foundation (Module 16) ---
export interface TenantAnalytics {
  totalTenants: number
  activeTenants: number
  totalRegions: number
  totalBranches: number
  totalExecutives: number
  growthTrends: { month: string; count: number }[]
}

// ============================================
// STAGE 4 — MEMBERSHIP & APPRENTICE MANAGEMENT
// ============================================

// --- Membership Statuses ---
export type MembershipStatus =
  | "pending"
  | "active"
  | "inactive"
  | "suspended"
  | "expired"
  | "cancelled"
  | "deceased"

export type MemberApprovalStatus =
  | "invited"
  | "pending_verification"
  | "under_review"
  | "approved"
  | "active"
  | "rejected"
  | "inactive"

export type MemberRenewalStatus =
  | "current"
  | "due_soon"
  | "overdue"
  | "renewed"
  | "expired"

// --- Module 1: Member Record ---
export interface Member {
  id: string
  tenantId: string
  // Membership
  membershipNumber: string
  branchId: string
  regionId: string
  category: string
  type: string
  status: MembershipStatus
  approvalStatus: MemberApprovalStatus
  renewalStatus: MemberRenewalStatus
  // Personal
  firstName: string
  middleName: string
  lastName: string
  gender: string
  dateOfBirth: string
  photo: string
  // Contact
  phone: string
  email: string
  address: string
  city: string
  region: string
  country: string
  // Professional
  profession: string
  specialization: string
  businessName: string
  yearsOfExperience: number
  // Membership meta
  dateRegistered: string
  lastRenewalDate?: string
  nextRenewalDate?: string
  registeredBy: "self" | "executive" | "admin"
  registeredById?: string
  createdAt: string
  updatedAt: string
}

// --- Module 6: Apprentice ---
export type ApprenticeStatus =
  | "pending"
  | "active"
  | "transferred"
  | "completed"
  | "upgraded"
  | "suspended"

export interface Apprentice {
  id: string
  tenantId: string
  parentMemberId: string
  branchId: string
  regionId: string
  status: ApprenticeStatus
  dateRegistered: string
  // Personal
  firstName: string
  lastName: string
  photo: string
  phone: string
  email: string
  address: string
  // Training
  trade: string
  startDate: string
  expectedCompletionDate: string
  createdAt: string
  updatedAt: string
}

// --- Module 7: Transfer Record ---
export interface TransferRecord {
  id: string
  tenantId: string
  apprenticeId: string
  previousMemberId: string
  newMemberId: string
  reason: string
  approver: string
  status: "pending" | "approved" | "completed" | "rejected"
  createdAt: string
  updatedAt: string
}

// --- Module 8: Upgrade Request ---
export interface UpgradeRequest {
  id: string
  tenantId: string
  apprenticeId: string
  status: "pending_review" | "approved" | "rejected"
  reviewedBy?: string
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

// --- Module 4: Approval Record ---
export interface ApprovalRecord {
  id: string
  tenantId: string
  memberId: string
  workflowId: string
  currentStage: number
  stages: ApprovalStageInstance[]
  status: "in_progress" | "approved" | "rejected" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface ApprovalStageInstance {
  order: number
  label: string
  approverLevel: string
  approverId?: string
  status: "pending" | "approved" | "rejected"
  comment?: string
  decidedAt?: string
}

// --- Module 10: Renewal Record ---
export interface RenewalRecord {
  id: string
  tenantId: string
  memberId: string
  previousExpiryDate: string
  newExpiryDate: string
  status: "pending" | "verified" | "renewed" | "expired"
  amount: number
  paymentReference?: string
  verifiedAt?: string
  renewedAt?: string
  createdAt: string
  updatedAt: string
}

// --- Module 12: Member Document ---
export interface MemberDocument {
  id: string
  tenantId: string
  memberId: string
  name: string
  type: "photo" | "application" | "identification" | "training" | "supporting"
  url: string
  status: "active" | "archived"
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

// --- Module 14: Communication Preferences ---
export interface MemberCommunication {
  id: string
  tenantId: string
  memberId: string
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
  createdAt: string
  updatedAt: string
}

// --- Module 13: Membership Analytics ---
export interface MemberAnalytics {
  totalMembers: number
  activeMembers: number
  inactiveMembers: number
  totalApprentices: number
  pendingApprovals: number
  pendingRenewals: number
  recentRenewals: number
  growthTrends: { month: string; members: number; apprentices: number }[]
}

// --- Module 15: Membership Audit ---
export interface MembershipAuditLog {
  id: string
  tenantId: string
  memberId?: string
  apprenticeId?: string
  actor: string
  action: string
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  createdAt: string
}

// ============================================
// STAGE 5 — FINANCIAL INFRASTRUCTURE PLATFORM
// ============================================

export type WalletType = "platform" | "tenant" | "national" | "regional" | "branch" | "member" | "executive" | "system" | "reserve"
export type WalletStatus = "active" | "inactive" | "suspended" | "closed"

export interface Wallet {
  id: string
  tenantId: string
  type: WalletType
  ownerId: string
  ownerName: string
  balance: number
  lockedBalance: number
  currency: string
  status: WalletStatus
  createdAt: string
  updatedAt: string
}

export interface LedgerEntry {
  id: string
  tenantId: string
  transactionId: string
  referenceNumber: string
  debitWalletId: string
  creditWalletId: string
  amount: number
  description: string
  createdAt: string
}

export type TransactionType = "payment" | "withdrawal" | "transfer" | "refund" | "commission" | "adjustment" | "revenue_distribution"
export type TransactionStatus = "pending" | "processing" | "successful" | "failed" | "cancelled" | "refunded"

export interface Transaction {
  id: string
  tenantId: string
  referenceNumber: string
  sourceWalletId: string
  destinationWalletId: string
  amount: number
  fee: number
  commission: number
  netAmount: number
  type: TransactionType
  status: TransactionStatus
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export type PaymentMethod = "mobile_money" | "card" | "bank_transfer" | "wallet"
export type PaymentStatus = "pending" | "processing" | "successful" | "failed" | "cancelled" | "refunded"

export interface Payment {
  id: string
  tenantId: string
  transactionId: string
  memberId: string
  paymentMethod: PaymentMethod
  amount: number
  fee: number
  netAmount: number
  status: PaymentStatus
  channel: string
  reference: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface RevenueDistributionRule {
  id: string
  tenantId: string
  name: string
  sourceType: string
  rules: DistributionSplit[]
  effectiveDate: string
  status: "active" | "inactive" | "archived"
  createdAt: string
  updatedAt: string
}

export interface DistributionSplit {
  destinationWalletType: WalletType
  destinationOwnerId: string
  percentage: number
}

export interface RevenueDistribution {
  id: string
  tenantId: string
  transactionId: string
  sourceAmount: number
  distributions: { walletId: string; amount: number; percentage: number }[]
  createdAt: string
}

export interface CommissionConfig {
  id: string
  sourceType: string
  percentage: number
  effectiveDate: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Commission {
  id: string
  tenantId: string
  transactionId: string
  sourceType: string
  amount: number
  percentage: number
  createdAt: string
}

export type BillType = "membership_fee" | "renewal_fee" | "reprint_fee" | "certificate_fee" | "training_fee" | "custom_fee"
export type BillStatus = "draft" | "pending" | "due" | "paid" | "partially_paid" | "overdue" | "cancelled"

export interface Bill {
  id: string
  tenantId: string
  memberId: string
  type: BillType
  amount: number
  paidAmount: number
  dueDate: string
  paidDate?: string
  status: BillStatus
  description: string
  createdAt: string
  updatedAt: string
}

export type MessagingChannel = "email" | "sms" | "push" | "in_app"

export interface MessagingCharge {
  id: string
  tenantId: string
  messageId: string
  channel: MessagingChannel
  cost: number
  markup: number
  charge: number
  billedWalletId: string
  status: "pending" | "billed" | "failed"
  createdAt: string
}

export type WithdrawalStatus = "draft" | "submitted" | "under_review" | "platform_review" | "approved" | "rejected" | "cancelled" | "processing" | "completed"

export interface Withdrawal {
  id: string
  tenantId: string
  walletId: string
  walletType: WalletType
  ownerName: string
  amount: number
  fee: number
  netAmount: number
  status: WithdrawalStatus
  reason: string
  supportingDocs?: string[]
  payoutMethod: "bank_account" | "mobile_money"
  payoutDestination: string
  lockedAt?: string
  completedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  referenceNumber?: string
  transferId?: string
  proofOfPayment?: string
  createdAt: string
  updatedAt: string
}

export type RefundStatus = "requested" | "under_review" | "approved" | "rejected" | "completed"

export interface Refund {
  id: string
  tenantId: string
  transactionId: string
  amount: number
  reason: string
  status: RefundStatus
  requesterId: string
  approverId?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Receipt {
  id: string
  tenantId: string
  transactionId: string
  receiptNumber: string
  amount: number
  payerName: string
  paymentMethod: string
  status: "generated" | "sent" | "verified"
  createdAt: string
}

export interface MessagingCostConfig {
  emailCost: number
  smsCost: number
  pushCost: number
}

export interface FinancialSettings {
  id: string
  tenantId: string
  currency: string
  withdrawalFeePercent: number
  maxWithdrawalPercent: number
  monthlyWithdrawalLimit: number
  messagingCosts: MessagingCostConfig
  createdAt: string
  updatedAt: string
}

export interface FinancialDashboardMetrics {
  totalRevenue: number
  totalCommissions: number
  messagingRevenue: number
  activeWallets: number
  transactionVolume: number
  pendingWithdrawals: number
  totalLockedFunds: number
  totalWalletUnits: number
  totalCollections: number
  outstandingBills: number
}

export interface FinancialAuditLog {
  id: string
  tenantId: string
  actor: string
  action: string
  transactionId?: string
  amount?: number
  before?: string
  after?: string
  reference?: string
  createdAt: string
}

// ============================================
// STAGE 6 — COMMUNICATION & ENGAGEMENT PLATFORM (CNEP)
// ============================================

// --- Module 1: Notification Engine ---
export type NotificationChannel = "in_app" | "email" | "sms" | "push"

export type ExtendedNotificationStatus = "queued" | "processing" | "sent" | "delivered" | "read" | "failed" | "cancelled"

// --- Module 3: Email Messaging ---
export type EmailStatus = "queued" | "processing" | "sent" | "delivered" | "opened" | "clicked" | "failed" | "bounced" | "spam"

export interface EmailMessage {
  id: string
  tenantId: string
  campaignId?: string
  senderId: string
  senderName: string
  recipientId: string
  recipientEmail: string
  recipientName: string
  subject: string
  body: string
  templateId?: string
  status: EmailStatus
  sentAt?: string
  deliveredAt?: string
  openedAt?: string
  clickedAt?: string
  failedAt?: string
  failureReason?: string
  cost: number
  markup: number
  totalCharge: number
  createdAt: string
  updatedAt: string
}

// --- Module 4: SMS Messaging ---
export type SMSStatus = "queued" | "processing" | "sent" | "delivered" | "failed"

export interface SMSMessage {
  id: string
  tenantId: string
  campaignId?: string
  senderId: string
  recipientId: string
  recipientPhone: string
  message: string
  units: number
  status: SMSStatus
  sentAt?: string
  deliveredAt?: string
  failedAt?: string
  failureReason?: string
  cost: number
  markup: number
  totalCharge: number
  createdAt: string
  updatedAt: string
}

// --- Module 5: Push Notification ---
export type PushStatus = "queued" | "processing" | "sent" | "delivered" | "opened" | "failed"

export interface PushNotificationRecord {
  id: string
  tenantId: string
  campaignId?: string
  senderId: string
  recipientId: string
  title: string
  body: string
  data?: Record<string, string>
  status: PushStatus
  sentAt?: string
  deliveredAt?: string
  openedAt?: string
  failedAt?: string
  failureReason?: string
  createdAt: string
  updatedAt: string
}

// --- Module 6: Campaign ---
export type CampaignType = "awareness" | "membership_drive" | "renewal_campaign" | "training_campaign" | "event_promotion" | "announcement" | "other"

export type CampaignStatus = "draft" | "scheduled" | "running" | "completed" | "cancelled"

export interface Campaign {
  id: string
  tenantId: string
  title: string
  description: string
  type: CampaignType
  channel: NotificationChannel
  audience: CampaignAudience
  schedule: CampaignSchedule
  status: CampaignStatus
  templateId?: string
  createdBy: string
  sentCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  failedCount: number
  totalCost: number
  totalCharge: number
  createdAt: string
  updatedAt: string
}

export interface CampaignAudience {
  type: "all_members" | "all_apprentices" | "all_executives" | "all_branches" | "all_regions" | "specific_categories" | "specific_membership_types" | "segment"
  segmentId?: string
  filters?: AudienceFilter[]
}

export interface CampaignSchedule {
  type: "immediate" | "scheduled"
  scheduledAt?: string
  timezone?: string
}

export interface AudienceFilter {
  field: string
  operator: "eq" | "neq" | "in" | "nin" | "gt" | "gte" | "lt" | "lte" | "contains"
  value: string | string[] | number
}

// --- Module 7: Templates ---
export type TemplateType = "email" | "sms" | "push" | "notification"

export type TemplateStatus = "draft" | "active" | "archived"

export interface Template {
  id: string
  tenantId: string
  name: string
  description: string
  type: TemplateType
  subject?: string
  content: string
  variables: string[]
  status: TemplateStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

// --- Module 8: Audience Segmentation ---
export interface AudienceSegment {
  id: string
  tenantId: string
  name: string
  description: string
  filters: AudienceFilter[]
  estimatedCount: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

// --- Module 9: Communication Preferences ---
export type CommunicationChannel = "email" | "sms" | "push" | "in_app"

export interface CommunicationPreference {
  id: string
  tenantId: string
  userId: string
  memberId?: string
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
  emailAddress?: string
  phoneNumber?: string
  quietHoursStart?: string
  quietHoursEnd?: string
  updatedAt: string
}

// --- Module 10: Subscription Management ---
export type SubscriptionCategory = "announcements" | "events" | "training" | "marketplace" | "opportunities" | "general_updates"

export interface Subscription {
  id: string
  tenantId: string
  userId: string
  memberId?: string
  category: SubscriptionCategory
  subscribed: boolean
  channel: CommunicationChannel
  createdAt: string
  updatedAt: string
}

// --- Module 11: Engagement Center ---
export type EngagementEventType = "email_opened" | "link_clicked" | "notification_read" | "campaign_participation" | "communication_response"

export interface EngagementEvent {
  id: string
  tenantId: string
  userId: string
  memberId?: string
  eventType: EngagementEventType
  sourceId: string
  sourceType: string
  metadata?: Record<string, unknown>
  timestamp: string
}

export interface EngagementMetrics {
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  totalRead: number
  deliveryRate: number
  openRate: number
  clickRate: number
  engagementRate: number
  periodStart: string
  periodEnd: string
}

// --- Module 13: Delivery Tracking ---
export type DeliveryStatus = "queued" | "processing" | "sent" | "delivered" | "opened" | "clicked" | "read" | "failed"

export interface DeliveryLog {
  id: string
  tenantId: string
  messageId: string
  channel: NotificationChannel
  recipientId: string
  status: DeliveryStatus
  attempts: number
  maxAttempts: number
  lastAttemptAt?: string
  nextRetryAt?: string
  failureReason?: string
  providerResponse?: string
  createdAt: string
  updatedAt: string
}

// --- Module 14: Communication Analytics ---
export interface CommunicationAnalytics {
  totalMessagesSent: number
  totalMessagesDelivered: number
  totalMessagesFailed: number
  deliveryRate: number
  openRate: number
  clickRate: number
  engagementRate: number
  totalCost: number
  totalCharge: number
  smsCount: number
  emailCount: number
  pushCount: number
  inAppCount: number
  campaignCount: number
  activeCampaigns: number
  topCampaigns: { campaignId: string; title: string; engagementRate: number }[]
  dailyStats: { date: string; sent: number; delivered: number; opened: number }[]
}

// --- Module 16: Executive Communication ---
export type BroadcastScope = "platform" | "national" | "regional" | "branch" | "executive"

export interface BroadcastMessage {
  id: string
  tenantId: string
  title: string
  message: string
  scope: BroadcastScope
  scopeId?: string
  channel: NotificationChannel[]
  senderId: string
  senderName: string
  senderRole: string
  status: CampaignStatus
  sentCount: number
  createdAt: string
  updatedAt: string
}

// --- Module 17: Automation Engine ---
export type AutomationTriggerEvent =
  | "member.approved"
  | "member.registered"
  | "renewal.due"
  | "renewal.overdue"
  | "renewal.completed"
  | "payment.successful"
  | "payment.failed"
  | "certificate.issued"
  | "id_card.ready"
  | "transfer.approved"
  | "executive.appointed"
  | "apprentice.completed"
  | "apprentice.upgraded"

export type AutomationActionType = "send_email" | "send_sms" | "send_push" | "send_in_app" | "create_campaign"

export interface AutomationRule {
  id: string
  tenantId: string
  name: string
  description: string
  triggerEvent: AutomationTriggerEvent
  actionType: AutomationActionType
  templateId?: string
  channel: NotificationChannel
  delayMinutes: number
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

// --- Module 18: Communication Audit ---
export type CommunicationAuditAction =
  | "message_created"
  | "message_sent"
  | "campaign_created"
  | "campaign_sent"
  | "template_modified"
  | "preference_changed"
  | "subscription_changed"
  | "broadcast_sent"
  | "automation_created"
  | "automation_modified"
  | "automation_toggled"

export interface CommunicationAuditLog {
  id: string
  tenantId: string
  actor: string
  action: CommunicationAuditAction
  channel: NotificationChannel
  audience?: string
  targetId?: string
  details?: string
  result: "success" | "failure"
  createdAt: string
}

// ============================================
// STAGE 7 — DIGITAL IDENTITY, ID CARDS, CERTIFICATES & CREDENTIAL MANAGEMENT PLATFORM (DICP)
// ============================================

// --- Module 1: ID Card ---
export type IDCardType = "member" | "apprentice" | "executive" | "staff" | "custom"
export type IDCardStatus = "active" | "unprinted" | "printed" | "ordered" | "reprinted" | "cancelled" | "expired"

export interface IDCard {
  id: string
  tenantId: string
  ownerId: string
  ownerType: IDCardType
  cardNumber: string
  credentialNumber: string
  status: IDCardStatus
  issueDate: string
  expiryDate: string
  fullName: string
  membershipNumber: string
  category: string
  organization: string
  branch: string
  region: string
  photo: string
  qrCode: string
  verificationCode: string
  reprintCount: number
  lastPrintedAt?: string
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

// --- Module 3: Certificate ---
export type CertificateType = "membership" | "training" | "completion" | "executive_appointment" | "recognition" | "custom"
export type CertificateStatus = "active" | "unprinted" | "printed" | "ordered" | "reprinted" | "cancelled" | "expired"

export interface Certificate {
  id: string
  tenantId: string
  ownerId: string
  certificateType: CertificateType
  certificateNumber: string
  credentialNumber: string
  status: CertificateStatus
  issueDate: string
  expiryDate?: string
  recipientName: string
  organization: string
  program: string
  verificationCode: string
  qrCode: string
  reprintCount: number
  lastPrintedAt?: string
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

// --- Module 2: Credential Template ---
export type CredentialTemplateType = "id_card_front" | "id_card_back" | "certificate"
export type CredentialTemplateStatus = "draft" | "active" | "archived"

export interface CredentialTemplateField {
  id: string
  label: string
  key: string
  x: number
  y: number
  fontSize: number
  fontWeight: string
  color: string
}

export interface CredentialTemplate {
  id: string
  tenantId: string
  name: string
  description: string
  type: CredentialTemplateType
  logo: string
  primaryColor: string
  secondaryColor: string
  typography: string
  fields: CredentialTemplateField[]
  qrPlacement: { x: number; y: number }
  signaturePlacement?: { x: number; y: number }
  backgroundImage?: string
  version: number
  status: CredentialTemplateStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

// --- Module 5: Print Request ---
export type PrintRequestStatus = "pending" | "approved" | "processing" | "completed" | "rejected" | "cancelled"

export interface PrintRequest {
  id: string
  tenantId: string
  credentialId: string
  credentialType: "id_card" | "certificate"
  requestType: "print" | "reprint" | "order"
  status: PrintRequestStatus
  requestedBy: string
  requestedById: string
  reason?: string
  fee?: number
  billingId?: string
  reprintCount?: number
  completedAt?: string
  createdAt: string
  updatedAt: string
}

// --- Module 8: Verification ---
export type VerificationMethod = "qr_code" | "credential_number" | "verification_code"
export type PublicVerificationStatus = "valid" | "expired" | "cancelled" | "suspended" | "invalid"

export interface VerificationRecord {
  id: string
  credentialId: string
  credentialType: "id_card" | "certificate"
  method: VerificationMethod
  status: PublicVerificationStatus
  holderName: string
  organization: string
  issueDate: string
  expiryDate?: string
  verifiedAt: string
  ipAddress?: string
}

// --- Module 10: Credential Analytics ---
export interface CredentialAnalytics {
  totalCredentials: number
  totalIDCards: number
  totalCertificates: number
  activeCredentials: number
  totalReprints: number
  cancelledCredentials: number
  pendingPrintRequests: number
  byTenant: { tenantId: string; count: number }[]
  byType: { type: string; count: number }[]
  byStatus: { status: string; count: number }[]
  recentIssuances: { date: string; count: number }[]
}

// --- Module 13: Credential Audit ---
export type CredentialAuditAction =
  | "credential_generated"
  | "credential_printed"
  | "credential_ordered"
  | "credential_reprinted"
  | "credential_cancelled"
  | "credential_verified"
  | "credential_expired"

export interface CredentialAuditLog {
  id: string
  tenantId: string
  credentialId: string
  credentialType: "id_card" | "certificate"
  action: CredentialAuditAction
  actor: string
  before?: string
  after?: string
  details?: string
  createdAt: string
}

// --- Module 15: Credential Settings ---
export interface CredentialSettings {
  id: string
  tenantId: string
  idCardReprintFee: number
  certificateReprintFee: number
  idCardExpiryMonths: number
  certificateExpiryMonths: number
  autoGenerateOnApproval: boolean
  autoGenerateOnUpgrade: boolean
  verificationRequiresAuth: boolean
  createdAt: string
  updatedAt: string
}

// --- Module 9: Credential File ---
export interface CredentialFile {
  id: string
  tenantId: string
  credentialId: string
  credentialType: "id_card" | "certificate"
  fileName: string
  fileType: string
  fileSize: number
  url: string
  uploadedAt: string
}

// ============================================
// STAGE 8 — MARKETPLACE, BUSINESS DIRECTORY & COMMERCE PLATFORM (MBDCP)
// ============================================

// --- Module 1 & 2: Marketplace Listing ---
export type MarketplaceListingType = "product" | "service" | "business_promotion" | "opportunity" | "event" | "announcement"
export type MarketplaceListingStatus = "draft" | "pending_review" | "approved" | "rejected" | "active" | "expired" | "archived"

export interface MarketplaceListing {
  id: string
  tenantId: string
  memberId: string
  listingType: MarketplaceListingType
  title: string
  description: string
  status: MarketplaceListingStatus
  price?: number
  currency?: string
  location?: string
  images: string[]
  videos: string[]
  documents: string[]
  categoryId?: string
  tags: string[]
  viewCount: number
  createdDate: string
  expiryDate?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// --- Module 3 & 4: Business Profile ---
export interface BusinessProfile {
  id: string
  tenantId: string
  memberId: string
  businessName: string
  categoryId: string
  description: string
  status: "active" | "inactive" | "suspended"
  verificationStatus: BusinessVerificationStatus
  verificationType?: BusinessVerificationType
  verifiedAt?: string
  verifiedBy?: string
  address: string
  phone: string
  email: string
  website: string
  socialMedia: string[]
  operatingHours: Record<string, string>
  logo: string
  gallery: string[]
  promotionalImages: string[]
  services: string[]
  products: string[]
  createdAt: string
  updatedAt: string
}

// --- Module 8: Business Category ---
export interface BusinessCategory {
  id: string
  tenantId: string
  name: string
  description: string
  parentId?: string
  sortOrder: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Module 14: Business Verification ---
export type BusinessVerificationType = "verified_member_business" | "verified_training_center" | "verified_vendor" | "verified_service_provider"
export type BusinessVerificationStatus = "unverified" | "pending" | "verified" | "suspended" | "revoked"

// --- Module 5: Opportunity ---
export type OpportunityType = "employment" | "apprenticeship" | "partnership" | "tender" | "contract" | "business_opportunity"
export type OpportunityStatus = "open" | "closed" | "archived"

export interface Opportunity {
  id: string
  tenantId: string
  memberId: string
  opportunityType: OpportunityType
  title: string
  description: string
  requirements: string[]
  location: string
  applicationDeadline?: string
  status: OpportunityStatus
  viewCount: number
  applicationCount: number
  createdAt: string
  updatedAt: string
}

export interface OpportunityApplication {
  id: string
  tenantId: string
  opportunityId: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  message: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  createdAt: string
}

// --- Module 6: Marketplace Approval ---
export interface MarketplaceApproval {
  id: string
  tenantId: string
  listingId: string
  listingType: "listing" | "business" | "opportunity"
  status: "pending" | "approved" | "rejected" | "changes_requested"
  reviewerId?: string
  reviewerName?: string
  reviewNotes?: string
  reviewedAt?: string
  createdAt: string
}

// --- Module 11: Marketplace Analytics ---
export interface MarketplaceAnalytics {
  totalListings: number
  activeListings: number
  totalBusinessProfiles: number
  verifiedBusinesses: number
  totalOpportunities: number
  openOpportunities: number
  totalListingViews: number
  memberParticipation: number
  pendingApprovals: number
  byListingType: { type: string; count: number }[]
  byStatus: { status: string; count: number }[]
  byTenant: { tenantId: string; count: number }[]
  recentActivity: { date: string; listings: number; businesses: number }[]
}

// --- Module 12: Compliance & Moderation ---
export interface MarketplaceModerationRecord {
  id: string
  tenantId: string
  listingId?: string
  businessId?: string
  action: "flagged" | "suspended" | "warned" | "removed"
  reason: string
  performedBy: string
  performedById: string
  createdAt: string
}

// --- Module 15: Training Center Directory ---
export interface TrainingCenter {
  id: string
  tenantId: string
  businessId: string
  name: string
  ownerId: string
  ownerName: string
  location: string
  coursesOffered: string[]
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Module 13: Member Directory Enhancement ---
export interface MemberDirectoryProfile {
  id: string
  tenantId: string
  memberId: string
  displayBusinessName: boolean
  displayProfessionalCategory: boolean
  displayServices: boolean
  displayLocation: boolean
  displayContact: boolean
  businessName?: string
  professionalCategory?: string
  services: string[]
  location?: string
  contactInfo?: string
  createdAt: string
  updatedAt: string
}

// --- Module 16: Marketplace Audit ---
export type MarketplaceAuditAction =
  | "listing_created"
  | "listing_updated"
  | "listing_approved"
  | "listing_rejected"
  | "listing_archived"
  | "business_created"
  | "business_updated"
  | "business_verified"
  | "opportunity_posted"
  | "opportunity_closed"
  | "verification_granted"
  | "moderation_action"

export interface MarketplaceAuditLog {
  id: string
  tenantId: string
  actor: string
  action: MarketplaceAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// --- Module 17: Marketplace Settings ---
export interface MarketplaceSettings {
  id: string
  tenantId: string
  approvalRequired: boolean
  defaultListingDurationDays: number
  maxImagesPerListing: number
  allowMemberDirectoryVisibility: boolean
  businessVerificationRequired: boolean
  autoPublishVerifiedBusinesses: boolean
  marketplaceEnabled: boolean
  createdAt: string
  updatedAt: string
}
