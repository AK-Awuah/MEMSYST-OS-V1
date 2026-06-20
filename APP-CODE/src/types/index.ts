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
export type TrainingCenterStatus = "pending" | "active" | "suspended" | "expired" | "closed"
export type TrainingCenterOperationalStatus = "active" | "inactive"

export interface TrainingCenter {
  id: string
  tenantId: string
  businessId?: string
  name: string
  ownerId: string
  ownerName: string
  location: string
  contactInfo?: string
  coursesOffered: string[]
  accreditationStatus: TrainingCenterStatus
  status: TrainingCenterOperationalStatus
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

// ============================================
// STAGE 9 — TRAINING, LEARNING, APPRENTICESHIP & SKILLS DEVELOPMENT (TLASDP)
// ============================================

// --- Module 2: Course ---
export type CourseStatus = "draft" | "published" | "archived"

export interface Course {
  id: string
  tenantId: string
  programId?: string
  title: string
  description: string
  duration: string
  fees: number
  level: string
  status: CourseStatus
  createdAt: string
  updatedAt: string
}

// --- Module 3: Program ---
export interface Program {
  id: string
  tenantId: string
  name: string
  description: string
  levels: string[]
  requirements: string[]
  completionRules: string[]
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// --- Module 4: Enrollment ---
export type EnrollmentStatus = "pending" | "active" | "completed" | "withdrawn" | "failed"
export type EnrollmentSource = "self" | "executive" | "training_center"

export interface Enrollment {
  id: string
  tenantId: string
  learnerId: string
  learnerName: string
  courseId: string
  courseName?: string
  programId?: string
  source: EnrollmentSource
  status: EnrollmentStatus
  enrollmentDate: string
  completionDate?: string
  createdAt: string
  updatedAt: string
}

// --- Module 5: Apprenticeship Training ---
export type ApprenticeshipTrainingStatus = "registered" | "active" | "under_assessment" | "completed" | "graduated" | "upgraded"

export interface ApprenticeshipTraining {
  id: string
  tenantId: string
  apprenticeId: string
  apprenticeName: string
  mentorId: string
  mentorName: string
  trainingCenterId: string
  programId?: string
  skillsAcquired: string[]
  progress: number
  status: ApprenticeshipTrainingStatus
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

// --- Module 6: Attendance ---
export type AttendanceStatus = "present" | "absent" | "late" | "excused"

export interface Attendance {
  id: string
  tenantId: string
  learnerId: string
  learnerName: string
  courseId: string
  session: string
  date: string
  status: AttendanceStatus
  notes?: string
  createdAt: string
}

// --- Module 7: Assessment ---
export type AssessmentType = "practical" | "written" | "oral" | "project" | "portfolio"
export type AssessmentResult = "pass" | "fail" | "pending"

export interface Assessment {
  id: string
  tenantId: string
  learnerId: string
  learnerName: string
  courseId: string
  assessmentType: AssessmentType
  score: number
  maxScore: number
  result: AssessmentResult
  date: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// --- Module 8: Examination ---
export type ExaminationStatus = "scheduled" | "open" | "closed" | "published"

export interface Examination {
  id: string
  tenantId: string
  courseId: string
  title: string
  scheduledDate: string
  duration: string
  status: ExaminationStatus
  registeredCandidates: number
  resultsPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface ExaminationResult {
  id: string
  examinationId: string
  learnerId: string
  learnerName: string
  score?: number
  result?: AssessmentResult
  approved: boolean
  createdAt: string
}

// --- Module 9: Skill ---
export interface Skill {
  id: string
  tenantId: string
  name: string
  category: string
  description?: string
  createdAt: string
}

export interface LearnerSkill {
  id: string
  tenantId: string
  learnerId: string
  skillId: string
  skillName: string
  competencyLevel: string
  dateAchieved: string
  verifiedBy?: string
  createdAt: string
  updatedAt: string
}

// --- Module 10: Certification ---
export type TrainingCertificationType = "course_completion" | "program_completion" | "apprenticeship_completion" | "examination_success" | "executive_approval"
export type TrainingCertificationStatus = "active" | "expired" | "revoked"

export interface TrainingCertification {
  id: string
  tenantId: string
  learnerId: string
  learnerName: string
  courseId?: string
  programId?: string
  type: TrainingCertificationType
  credentialId?: string
  status: TrainingCertificationStatus
  issuedAt: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

// --- Module 11: Graduation ---
export type GraduationStatus = "pending_review" | "approved" | "graduated" | "rejected"

export interface Graduation {
  id: string
  tenantId: string
  apprenticeId: string
  apprenticeName: string
  trainingComplete: boolean
  assessmentComplete: boolean
  executiveReviewComplete: boolean
  graduationApproved: boolean
  upgradeEligible: boolean
  graduationDate?: string
  status: GraduationStatus
  createdAt: string
  updatedAt: string
}

// --- Module 12: Learning Content ---
export type ContentType = "document" | "video" | "image" | "assignment" | "reference"

export interface LearningContent {
  id: string
  tenantId: string
  courseId?: string
  title: string
  description: string
  contentType: ContentType
  url?: string
  fileSize?: number
  status: "published" | "archived"
  createdAt: string
  updatedAt: string
}

// --- Module 13: Professional Development ---
export interface ProfessionalDevelopment {
  id: string
  tenantId: string
  learnerId: string
  learnerName: string
  coursesTaken: number
  trainingHours: number
  certificationsEarned: number
  skillsAchieved: string[]
  professionalCredits: number
  updatedAt: string
}

// --- Module 17: Training Analytics ---
export interface TrainingAnalytics {
  totalEnrollments: number
  courseCompletions: number
  passRate: number
  graduations: number
  certifications: number
  activeCenters: number
  totalCourses: number
  byProgram: { program: string; count: number }[]
  byStatus: { status: string; count: number }[]
  recentActivity: { date: string; enrollments: number; completions: number }[]
}

// --- Module 18: Training Audit ---
export type TrainingAuditAction =
  | "course_created" | "course_updated" | "course_published" | "course_archived"
  | "enrollment_approved" | "enrollment_withdrawn"
  | "attendance_recorded"
  | "assessment_completed"
  | "certification_issued"
  | "graduation_approved"
  | "center_created" | "center_approved" | "center_suspended"

export interface TrainingAuditLog {
  id: string
  tenantId: string
  actor: string
  action: TrainingAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// --- Module 19: Training Settings ---
export interface TrainingSettings {
  id: string
  tenantId: string
  programs: string[]
  levels: string[]
  assessmentRules: string[]
  graduationRules: string[]
  certificationRules: string[]
  accreditationRules: string[]
  createdAt: string
  updatedAt: string
}

// ================================================================
// STAGE 10 — SUPPORT HUB PLATFORM (LOANS, SCHOLARSHIPS, SPONSORSHIPS, SUPPORT PROGRAMS)
// ================================================================

export type LoanStatus = "draft" | "pending" | "under_review" | "approved" | "disbursed" | "repaying" | "completed" | "defaulted" | "rejected" | "cancelled"
export type LoanType = "personal" | "business" | "emergency" | "education" | "equipment" | "welfare" | "custom"
export type LoanRepaymentFrequency = "weekly" | "biweekly" | "monthly" | "quarterly"

export interface Loan {
  id: string
  tenantId: string
  memberId: string
  memberName: string
  loanType: LoanType
  amountRequested: number
  amountApproved?: number
  interestRate: number
  repaymentPeriod: number
  repaymentFrequency: LoanRepaymentFrequency
  installmentAmount?: number
  totalRepayable?: number
  amountPaid: number
  balance: number
  purpose: string
  status: LoanStatus
  applicationDate: string
  approvalDate?: string
  disbursementDate?: string
  expectedCompletionDate?: string
  guarantorId?: string
  guarantorName?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface LoanRepayment {
  id: string
  loanId: string
  tenantId: string
  memberId: string
  amount: number
  principalPortion: number
  interestPortion: number
  dueDate: string
  paidDate?: string
  status: "pending" | "paid" | "overdue" | "partial"
  transactionId?: string
  createdAt: string
}

export type ScholarshipStatus = "draft" | "open" | "accepting_applications" | "closed" | "awarded" | "cancelled"
export type ScholarshipType = "merit" | "need_based" | "sports" | "vocational" | "general"

export interface Scholarship {
  id: string
  tenantId: string
  title: string
  description: string
  scholarshipType: ScholarshipType
  provider: string
  amount: number
  totalSlots: number
  slotsFilled: number
  eligibilityCriteria: string[]
  requirements: string[]
  applicationDeadline: string
  status: ScholarshipStatus
  createdAt: string
  updatedAt: string
}

export interface ScholarshipApplication {
  id: string
  scholarshipId: string
  tenantId: string
  memberId: string
  memberName: string
  applicationDate: string
  status: "submitted" | "under_review" | "shortlisted" | "awarded" | "rejected"
  documents: string[]
  reviewedBy?: string
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

export type SponsorshipStatus = "draft" | "active" | "fulfilled" | "cancelled"
export type SponsorshipCategory = "member" | "event" | "training" | "community" | "corporate"

export interface Sponsorship {
  id: string
  tenantId: string
  title: string
  description: string
  category: SponsorshipCategory
  sponsorName: string
  sponsorContact?: string
  beneficiaryId?: string
  beneficiaryName?: string
  amount: number
  inKindDetails?: string
  startDate: string
  endDate?: string
  status: SponsorshipStatus
  createdAt: string
  updatedAt: string
}

export type SupportProgramStatus = "draft" | "active" | "completed" | "cancelled"
export type SupportProgramCategory = "financial" | "medical" | "legal" | "counseling" | "emergency" | "career" | "housing" | "food" | "other"

export interface SupportProgram {
  id: string
  tenantId: string
  title: string
  description: string
  category: SupportProgramCategory
  provider: string
  eligibilityCriteria: string[]
  applicationProcess: string
  benefits: string[]
  fundingSource: string
  budget: number
  budgetSpent: number
  startDate: string
  endDate?: string
  maxBeneficiaries: number
  currentBeneficiaries: number
  status: SupportProgramStatus
  createdAt: string
  updatedAt: string
}

export interface SupportProgramEnrollment {
  id: string
  programId: string
  tenantId: string
  memberId: string
  memberName: string
  enrollmentDate: string
  status: "pending" | "approved" | "active" | "completed" | "withdrawn" | "rejected"
  benefitsReceived: string[]
  outcome?: string
  createdAt: string
  updatedAt: string
}

export type ResourceCategory = "financial" | "legal" | "health" | "education" | "career" | "housing" | "emergency" | "community" | "government"

export interface ResourceDirectory {
  id: string
  tenantId: string
  title: string
  description: string
  category: ResourceCategory
  provider: string
  contactPhone?: string
  contactEmail?: string
  website?: string
  address?: string
  eligibilitySummary?: string
  isVerified: boolean
  tags: string[]
  status: "published" | "draft" | "archived"
  createdAt: string
  updatedAt: string
}

export interface SupportHubAnalytics {
  totalLoans: number
  activeLoans: number
  totalLoanAmount: number
  outstandingBalance: number
  totalScholarships: number
  activeScholarships: number
  totalSponsorships: number
  activeSponsorships: number
  totalPrograms: number
  activePrograms: number
  totalBeneficiaries: number
  totalResources: number
  byCategory: { category: string; count: number }[]
  recentActivity: { date: string; action: string; item: string }[]
}

export type SupportHubAuditAction =
  | "loan_created" | "loan_approved" | "loan_disbursed" | "loan_repaid" | "loan_defaulted"
  | "scholarship_created" | "scholarship_awarded" | "scholarship_closed"
  | "sponsorship_created" | "sponsorship_fulfilled"
  | "program_created" | "program_enrolled" | "program_completed"
  | "resource_added" | "resource_updated" | "resource_archived"

export interface SupportHubAuditLog {
  id: string
  tenantId: string
  actor: string
  action: SupportHubAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// ================================================================
// STAGE 11 — EVENTS & PROGRAMS PLATFORM
// ================================================================

export type EventStatus = "draft" | "published" | "open_for_registration" | "closed" | "in_progress" | "completed" | "cancelled" | "postponed"
export type EventType = "conference" | "workshop" | "seminar" | "meeting" | "webinar" | "social" | "fundraiser" | "training" | "exhibition" | "networking" | "other"
export type EventFormat = "in_person" | "virtual" | "hybrid"

export interface Event {
  id: string
  tenantId: string
  title: string
  description: string
  eventType: EventType
  format: EventFormat
  startDate: string
  endDate: string
  timezone: string
  location?: string
  virtualLink?: string
  maxAttendees: number
  registeredCount: number
  attendedCount: number
  registrationDeadline?: string
  fee: number
  currency: string
  organizerId: string
  organizerName: string
  speakers: { name: string; title?: string; photo?: string }[]
  agenda: { time: string; title: string; description?: string; speaker?: string }[]
  sponsors: string[]
  coverImage?: string
  tags: string[]
  status: EventStatus
  createdAt: string
  updatedAt: string
}

export type EventRegistrationStatus = "registered" | "confirmed" | "attended" | "cancelled" | "no_show"

export interface EventRegistration {
  id: string
  eventId: string
  tenantId: string
  memberId: string
  memberName: string
  registrationDate: string
  status: EventRegistrationStatus
  ticketType?: string
  amountPaid: number
  checkedInAt?: string
  certificateIssued: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface EventCertificate {
  id: string
  eventId: string
  tenantId: string
  registrationId: string
  memberId: string
  memberName: string
  issuedAt: string
  certificateUrl?: string
  status: "issued" | "downloaded" | "revoked"
  createdAt: string
}

export type WorkshopStatus = "draft" | "scheduled" | "in_progress" | "completed" | "cancelled"

export interface Workshop {
  id: string
  tenantId: string
  title: string
  description: string
  facilitatorId: string
  facilitatorName: string
  maxParticipants: number
  registeredCount: number
  duration: string
  materials: string[]
  prerequisites: string[]
  status: WorkshopStatus
  startDate: string
  endDate?: string
  location?: string
  virtualLink?: string
  createdAt: string
  updatedAt: string
}

export interface EventsAnalytics {
  totalEvents: number
  upcomingEvents: number
  completedEvents: number
  totalRegistrations: number
  totalAttendance: number
  attendanceRate: number
  totalRevenue: number
  byType: { type: string; count: number }[]
  byStatus: { status: string; count: number }[]
  upcomingEventsList: { id: string; title: string; date: string; registrations: number }[]
}

export type EventsAuditAction =
  | "event_created" | "event_updated" | "event_published" | "event_cancelled"
  | "registration_confirmed" | "registration_cancelled" | "attendance_recorded"
  | "certificate_issued" | "workshop_created" | "workshop_completed"

export interface EventsAuditLog {
  id: string
  tenantId: string
  actor: string
  action: EventsAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// ================================================================
// STAGE 12 — GOVERNANCE PLATFORM (ELECTIONS, VOTING, COMMITTEES, RESOLUTIONS)
// ================================================================

export type ElectionStatus = "draft" | "nomination" | "campaign" | "voting" | "count" | "published" | "completed" | "cancelled"

export interface Election {
  id: string
  tenantId: string
  title: string
  description: string
  positionId: string
  positionName: string
  organizationalLevel: string
  nominationStartDate: string
  nominationEndDate: string
  votingStartDate: string
  votingEndDate: string
  maxCandidates: number
  minVotesPerVoter: number
  maxVotesPerVoter: number
  isAnonymous: boolean
  requiresTwoFactorAuth: boolean
  status: ElectionStatus
  totalVoters: number
  totalVotesCast: number
  voterTurnout: number
  createdAt: string
  updatedAt: string
}

export interface Candidate {
  id: string
  electionId: string
  tenantId: string
  memberId: string
  memberName: string
  photo?: string
  manifesto: string
  biography: string
  nominationDate: string
  nominationApproved: boolean
  approvedBy?: string
  voteCount: number
  status: "nominated" | "approved" | "disqualified" | "withdrawn"
  createdAt: string
}

export interface Vote {
  id: string
  electionId: string
  tenantId: string
  voterId: string
  candidateId: string
  votedAt: string
  transactionHash?: string
  isVerified: boolean
}

export type CommitteeType = "standing" | "ad_hoc" | "executive" | "advisory" | "subcommittee"

export interface Committee {
  id: string
  tenantId: string
  name: string
  description: string
  committeeType: CommitteeType
  parentCommitteeId?: string
  chairpersonId: string
  chairpersonName: string
  viceChairpersonId?: string
  viceChairpersonName?: string
  secretaryId?: string
  secretaryName?: string
  members: { memberId: string; memberName: string; role: string; appointedDate: string }[]
  meetingFrequency: string
  quorumRequired: number
  formationDate: string
  dissolutionDate?: string
  status: "active" | "dissolved" | "inactive"
  createdAt: string
  updatedAt: string
}

export type MeetingStatus = "scheduled" | "in_progress" | "adjourned" | "completed" | "cancelled"

export interface CommitteeMeeting {
  id: string
  committeeId: string
  committeeName: string
  tenantId: string
  title: string
  agenda: string
  minutes?: string
  meetingDate: string
  startTime: string
  endTime?: string
  location?: string
  virtualLink?: string
  status: MeetingStatus
  attendees: { memberId: string; memberName: string; attended: boolean }[]
  resolutions: { id: string; title: string; description: string; proposedBy: string; voteCount: number; status: "proposed" | "passed" | "rejected" | "implemented" }[]
  createdAt: string
  updatedAt: string
}

export type ResolutionStatus = "proposed" | "debated" | "passed" | "rejected" | "implemented" | "superseded"

export interface Resolution {
  id: string
  tenantId: string
  title: string
  description: string
  proposedById: string
  proposedByName: string
  meetingId?: string
  committeeId?: string
  voteCount: number
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  status: ResolutionStatus
  implementationNotes?: string
  implementedDate?: string
  createdAt: string
  updatedAt: string
}

export interface GovernanceDashboardMetrics {
  totalElections: number
  activeElections: number
  totalCandidates: number
  totalVotesCast: number
  totalCommittees: number
  activeCommittees: number
  totalMeetings: number
  upcomingMeetings: number
  totalResolutions: number
  passedResolutions: number
  voterTurnoutRate: number
}

export type GovernanceAuditAction =
  | "election_created" | "election_opened" | "election_closed" | "election_published"
  | "candidate_nominated" | "candidate_approved" | "candidate_disqualified"
  | "vote_cast" | "committee_created" | "committee_dissolved"
  | "meeting_scheduled" | "meeting_completed" | "resolution_proposed" | "resolution_passed"

export interface GovernanceAuditLog {
  id: string
  tenantId: string
  actor: string
  action: GovernanceAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// ================================================================
// STAGE 13 — ANALYTICS & REPORTING PLATFORM
// ================================================================

export type ReportType = "membership" | "financial" | "communication" | "marketplace" | "training" | "governance" | "events" | "support_hub" | "custom"
export type ReportFormat = "pdf" | "csv" | "excel" | "json" | "html"
export type ReportSchedule = "none" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly"

export interface Report {
  id: string
  tenantId: string
  title: string
  description: string
  reportType: ReportType
  format: ReportFormat
  filters: Record<string, unknown>
  dateRange?: { start: string; end: string }
  groupBy?: string
  schedule: ReportSchedule
  lastGenerated?: string
  recipients: string[]
  status: "draft" | "active" | "archived"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ReportExecution {
  id: string
  reportId: string
  tenantId: string
  executedAt: string
  completedAt?: string
  status: "queued" | "running" | "completed" | "failed"
  outputUrl?: string
  outputSize?: number
  rowCount?: number
  errorMessage?: string
  triggeredBy: "schedule" | "manual"
  createdAt: string
}

export interface DashboardWidget {
  id: string
  tenantId: string
  title: string
  widgetType: "stat" | "chart" | "table" | "list" | "metric"
  dataSource: string
  position: number
  width: 1 | 2 | 3
  height: 1 | 2
  config: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CustomDashboard {
  id: string
  tenantId: string
  name: string
  description?: string
  widgets: DashboardWidget[]
  isDefault: boolean
  sharedWith: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface AnalyticsDashboardMetrics {
  totalMembers: number
  activeMembers: number
  totalRevenue: number
  monthlyRevenue: number
  pendingApprovals: number
  openCampaigns: number
  upcomingEvents: number
  activeListings: number
  memberGrowthRate: number
  renewalRate: number
}

export type AnalyticsAuditAction =
  | "report_created" | "report_generated" | "report_scheduled" | "report_archived"
  | "dashboard_created" | "dashboard_updated" | "dashboard_shared"
  | "widget_added" | "widget_removed"

export interface AnalyticsAuditLog {
  id: string
  tenantId: string
  actor: string
  action: AnalyticsAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// ================================================================
// STAGE 14 — INTEGRATION PLATFORM
// ================================================================

export type APIKeyStatus = "active" | "revoked" | "expired"

export interface APIKey {
  id: string
  tenantId: string
  name: string
  keyPrefix: string
  keyHash: string
  permissions: string[]
  allowedIPs: string[]
  rateLimit: number
  status: APIKeyStatus
  expiresAt?: string
  lastUsedAt?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Webhook {
  id: string
  tenantId: string
  name: string
  url: string
  events: string[]
  secret: string
  headers: Record<string, string>
  retryCount: number
  timeout: number
  status: "active" | "paused" | "disabled"
  lastTriggeredAt?: string
  lastSuccessAt?: string
  lastFailureAt?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface WebhookDelivery {
  id: string
  webhookId: string
  tenantId: string
  event: string
  payload: string
  responseStatus?: number
  responseBody?: string
  duration: number
  attemptNumber: number
  status: "success" | "failed" | "retrying"
  errorMessage?: string
  deliveredAt?: string
  createdAt: string
}

export type IntegrationType = "payment_gateway" | "sms_provider" | "email_provider" | "crm" | "accounting" | "analytics" | "storage" | "custom"

export interface ThirdPartyIntegration {
  id: string
  tenantId: string
  name: string
  integrationType: IntegrationType
  provider: string
  config: Record<string, string>
  isEnabled: boolean
  lastSyncAt?: string
  syncStatus: "idle" | "syncing" | "success" | "failed"
  errorMessage?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type IntegrationAuditAction =
  | "api_key_created" | "api_key_revoked"
  | "webhook_created" | "webhook_updated" | "webhook_disabled"
  | "webhook_delivered" | "webhook_failed"
  | "integration_created" | "integration_enabled" | "integration_disabled" | "integration_synced"

export interface IntegrationAuditLog {
  id: string
  tenantId: string
  actor: string
  action: IntegrationAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// ================================================================
// STAGE 15 — MOBILE EXPERIENCE PLATFORM
// ================================================================

export interface PWAConfig {
  id: string
  tenantId: string
  name: string
  shortName: string
  description: string
  backgroundColor: string
  themeColor: string
  icon192: string
  icon512: string
  splashScreen: string
  display: "standalone" | "fullscreen" | "minimal-ui"
  orientation: "portrait" | "landscape" | "any"
  offlinePages: string[]
  cacheStrategy: "network_first" | "cache_first" | "stale_while_revalidate"
  pushEnabled: boolean
  lastBuilt: string
  createdAt: string
  updatedAt: string
}

export interface OfflineCacheRule {
  id: string
  tenantId: string
  urlPattern: string
  cacheStrategy: "network_first" | "cache_first" | "stale_while_revalidate"
  maxAge: number
  maxEntries: number
  prioritizePages: string[]
  createdAt: string
  updatedAt: string
}

export interface MobileAppVersion {
  id: string
  tenantId: string
  platform: "ios" | "android" | "pwa"
  version: string
  buildNumber: string
  releaseNotes: string
  minAppVersion: string
  downloadUrl: string
  isForced: boolean
  status: "development" | "beta" | "released" | "deprecated"
  releasedAt: string
  createdAt: string
}

export type MobileAuditAction =
  | "pwa_built" | "pwa_updated"
  | "cache_rule_created" | "cache_rule_updated"
  | "app_version_released" | "app_version_deprecated"

export interface MobileAuditLog {
  id: string
  tenantId: string
  actor: string
  action: MobileAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// ================================================================
// STAGE 16 — AI & AUTOMATION PLATFORM
// ================================================================

export type AIAssistantType = "membership" | "finance" | "communication" | "governance" | "training" | "general"

export interface AIAssistant {
  id: string
  tenantId: string
  name: string
  assistantType: AIAssistantType
  description: string
  systemPrompt: string
  model: string
  temperature: number
  maxTokens: number
  enabled: boolean
  trainingData: string[]
  useTenantContext: boolean
  suggestedQuestions: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface AIConversation {
  id: string
  tenantId: string
  assistantId: string
  userId: string
  userMessage: string
  assistantResponse: string
  tokensUsed: number
  processingTime: number
  feedback?: "helpful" | "not_helpful"
  createdAt: string
}

export interface SmartAnalytic {
  id: string
  tenantId: string
  name: string
  description: string
  dataSource: string
  query: string
  schedule: "hourly" | "daily" | "weekly" | "monthly" | "on_demand"
  lastRunAt?: string
  lastResult?: string
  recipients: string[]
  enabled: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface WorkflowSuggestion {
  id: string
  tenantId: string
  title: string
  description: string
  triggerEvent: string
  suggestedActions: string[]
  confidence: number
  status: "pending_review" | "approved" | "dismissed" | "active"
  reviewedBy?: string
  createdAt: string
  updatedAt: string
}

export type AIAuditAction =
  | "assistant_created" | "assistant_updated" | "assistant_toggled"
  | "conversation_logged"
  | "analytic_created" | "analytic_run"
  | "suggestion_created" | "suggestion_approved" | "suggestion_dismissed"

export interface AIAuditLog {
  id: string
  tenantId: string
  actor: string
  action: AIAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// ================================================================
// STAGE 17 — PLATFORM GOVERNANCE & SAAS OPERATIONS
// ================================================================

export type SubscriptionPlanStatus = "active" | "inactive" | "deprecated"
export type BillingCycle = "monthly" | "quarterly" | "biannual" | "annual"

export interface SubscriptionPlan {
  id: string
  name: string
  code: string
  description: string
  monthlyPrice: number
  quarterlyPrice?: number
  biannualPrice?: number
  annualPrice?: number
  currency: string
  features: { feature: string; included: boolean; limit?: number }[]
  maxMembers: number
  maxBranches: number
  maxAdmins: number
  includedSMS: number
  includedEmail: number
  storageGB: number
  status: SubscriptionPlanStatus
  createdAt: string
  updatedAt: string
}

export interface TenantSubscription {
  id: string
  tenantId: string
  planId: string
  planName: string
  billingCycle: BillingCycle
  amount: number
  startDate: string
  endDate?: string
  trialEndDate?: string
  status: "trial" | "active" | "past_due" | "cancelled" | "expired"
  autoRenew: boolean
  gracePeriodEnd?: string
  suspendedAt?: string
  cancelledAt?: string
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  tenantId: string
  subscriptionId: string
  invoiceNumber: string
  description: string
  amount: number
  currency: string
  issuedDate: string
  dueDate: string
  paidDate?: string
  status: "draft" | "issued" | "paid" | "overdue" | "cancelled" | "refunded"
  paymentMethod?: string
  transactionId?: string
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[]
  createdAt: string
  updatedAt: string
}

export interface SupportTicket {
  id: string
  tenantId: string
  subject: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  category: "technical" | "billing" | "feature_request" | "account" | "other"
  status: "open" | "in_progress" | "waiting_on_customer" | "resolved" | "closed"
  assignedTo?: string
  createdBy: string
  createdByName: string
  messages: { sender: string; message: string; attachments: string[]; createdAt: string }[]
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PlatformPartner {
  id: string
  name: string
  partnerType: "technology" | "implementation" | "training" | "financial" | "referral"
  contactName: string
  contactEmail: string
  contactPhone?: string
  commissionRate: number
  revenueShare: number
  status: "active" | "inactive" | "suspended"
  contractStart: string
  contractEnd?: string
  createdAt: string
  updatedAt: string
}

export interface PartnerTenant {
  id: string
  partnerId: string
  tenantId: string
  tenantName: string
  commissionRate: number
  revenueShare: number
  referredAt: string
  status: "active" | "inactive"
  createdAt: string
}

export type PlatformOpsAuditAction =
  | "plan_created" | "plan_updated" | "plan_deprecated"
  | "subscription_created" | "subscription_cancelled" | "subscription_updated"
  | "invoice_issued" | "invoice_paid" | "invoice_overdue"
  | "ticket_created" | "ticket_resolved" | "ticket_closed"
  | "partner_created" | "partner_suspended"

export interface PlatformOpsAuditLog {
  id: string
  tenantId: string
  actor: string
  action: PlatformOpsAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// ================================================================
// STAGE 18 — ADVERTISING, SPONSORSHIP & CAMPAIGN MANAGEMENT (ASCMP)
// ================================================================

export type AdStatus = "draft" | "pending_review" | "approved" | "rejected" | "active" | "paused" | "expired" | "cancelled"
export type AdPlacement = "homepage_banner" | "marketplace_sidebar" | "training_hub" | "directory_featured" | "announcement_promotion" | "event_sponsor" | "popup" | "footer"
export type AdPricingModel = "fixed" | "per_impression" | "per_click" | "per_duration" | "sponsorship"
export type AdTargetAudience = "all_members" | "by_membership_type" | "by_branch" | "by_region" | "by_trade" | "by_interest"

export interface Advertisement {
  id: string
  tenantId: string
  advertiserId: string
  advertiserName: string
  title: string
  description: string
  imageUrl?: string
  linkUrl: string
  placement: AdPlacement
  pricingModel: AdPricingModel
  rate: number
  totalBudget: number
  spentBudget: number
  currency: string
  impressions: number
  clicks: number
  conversions: number
  targetAudience: AdTargetAudience
  targetValue?: string
  startDate: string
  endDate: string
  status: AdStatus
  reviewedBy?: string
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

export interface AdCampaign {
  id: string
  tenantId: string
  name: string
  description: string
  advertiserId: string
  advertiserName: string
  ads: string[]
  totalBudget: number
  spentBudget: number
  startDate: string
  endDate: string
  status: "draft" | "active" | "paused" | "completed" | "cancelled"
  performance: { impressions: number; clicks: number; conversions: number; ctr: number; conversionRate: number }
  createdAt: string
  updatedAt: string
}

export interface SponsorDeal {
  id: string
  tenantId: string
  sponsorName: string
  sponsorContact: string
  sponsorEmail?: string
  sponsorshipTier: string
  amount: number
  currency: string
  benefits: string[]
  startDate: string
  endDate: string
  status: "active" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}

export type AdvertisingAuditAction =
  | "ad_created" | "ad_approved" | "ad_rejected" | "ad_paused" | "ad_expired"
  | "campaign_created" | "campaign_launched" | "campaign_completed"
  | "sponsor_deal_created" | "sponsor_deal_completed"

export interface AdvertisingAuditLog {
  id: string
  tenantId: string
  actor: string
  action: AdvertisingAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}

// ================================================================
// STAGE 19 — TIERING, DISCOVERY & VISIBILITY PLATFORM
// ================================================================

export type PremiumTier = "free" | "basic" | "premium" | "enterprise"
export type TierBenefitType = "visibility_boost" | "search_priority" | "badge" | "unlimited_listings" | "analytics_access" | "featured_placement" | "priority_support" | "custom_branding"

export interface PremiumAccount {
  id: string
  tenantId: string
  memberId: string
  memberName: string
  tier: PremiumTier
  benefits: { benefit: TierBenefitType; active: boolean; expiresAt?: string }[]
  subscriptionId?: string
  autoRenew: boolean
  startDate: string
  expiryDate?: string
  status: "active" | "expired" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface PremiumListing {
  id: string
  tenantId: string
  listingId: string
  listingType: string
  listingTitle: string
  ownerId: string
  tier: PremiumTier
  boostFactor: number
  placementPriority: number
  featuredUntil?: string
  isFeatured: boolean
  status: "active" | "expired" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface VisibilityRule {
  id: string
  tenantId: string
  name: string
  description: string
  entityType: "member" | "listing" | "business" | "training_center" | "event"
  criteria: Record<string, unknown>
  priority: number
  boostFactor: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type TieringAuditAction =
  | "account_upgraded" | "account_downgraded" | "account_expired"
  | "listing_featured" | "listing_boosted"
  | "visibility_rule_created" | "visibility_rule_updated" | "visibility_rule_toggled"

export interface TieringAuditLog {
  id: string
  tenantId: string
  actor: string
  action: TieringAuditAction
  recordType: string
  recordId: string
  previousValue?: string
  newValue?: string
  details?: string
  createdAt: string
}
