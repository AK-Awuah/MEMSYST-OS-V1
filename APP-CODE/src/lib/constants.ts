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

// ============================================
// STAGE 4 — MEMBERSHIP CONSTANTS
// ============================================

export const MEMBERSHIP_STATUSES = ["pending", "active", "inactive", "suspended", "expired", "cancelled", "deceased"] as const
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number]

export const MEMBER_APPROVAL_STATUSES = ["invited", "pending_verification", "under_review", "approved", "active", "rejected", "inactive"] as const
export type MemberApprovalStatus = (typeof MEMBER_APPROVAL_STATUSES)[number]

export const MEMBER_RENEWAL_STATUSES = ["current", "due_soon", "overdue", "renewed", "expired"] as const
export type MemberRenewalStatus = (typeof MEMBER_RENEWAL_STATUSES)[number]

export const APPRENTICE_STATUSES = ["pending", "active", "transferred", "completed", "upgraded", "suspended"] as const
export type ApprenticeStatus = (typeof APPRENTICE_STATUSES)[number]

export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, string> = {
  pending: "Pending",
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  expired: "Expired",
  cancelled: "Cancelled",
  deceased: "Deceased",
}

export const MEMBER_APPROVAL_STATUS_LABELS: Record<MemberApprovalStatus, string> = {
  invited: "Invited",
  pending_verification: "Pending Verification",
  under_review: "Under Review",
  approved: "Approved",
  active: "Active",
  rejected: "Rejected",
  inactive: "Inactive",
}

export const MEMBER_RENEWAL_STATUS_LABELS: Record<MemberRenewalStatus, string> = {
  current: "Current",
  due_soon: "Due Soon",
  overdue: "Overdue",
  renewed: "Renewed",
  expired: "Expired",
}

export const APPRENTICE_STATUS_LABELS: Record<ApprenticeStatus, string> = {
  pending: "Pending",
  active: "Active",
  transferred: "Transferred",
  completed: "Completed",
  upgraded: "Upgraded",
  suspended: "Suspended",
}

export const MEMBER_DOCUMENT_TYPES = ["photo", "application", "identification", "training", "supporting"] as const
export type MemberDocumentType = (typeof MEMBER_DOCUMENT_TYPES)[number]

export const MEMBER_DOCUMENT_TYPE_LABELS: Record<MemberDocumentType, string> = {
  photo: "Photo",
  application: "Application",
  identification: "Identification",
  training: "Training",
  supporting: "Supporting",
}

export const ROUTE_PERMISSIONS: Record<string, string | null> = {
  "/app/dashboard": null,
  "/app/forms": "forms:read",
  "/app/leads": "leads:read",
  "/app/leads/new": "leads:write",
  "/app/crm": "crm:read",
  "/app/notifications": "notifications:read",
  "/app/organizations": "organizations:read",
  "/app/tenants": "tenants:read",
  "/app/directory": "tenants:read",
  "/app/onboarding": "tenants:write",
  "/app/users": "users:read",
  "/app/roles": "roles:read",
  "/app/sessions": null,
  "/app/security": null,
  "/app/settings": "settings:read",
  "/app/audit-logs": "audit:read",
  "/app/profile": null,
  "/app/change-password": null,
  "/app/members": "members:read",
  "/app/members/new": "members:write",
  "/app/apprentices": "members:read",
  "/app/member-dashboard": null,
  "/app/apprentice-dashboard": null,
  "/app/finance": "finance:read",
  "/app/finance/wallets": "finance:read",
  "/app/finance/wallets/new": "finance:write",
  "/app/finance/transactions": "finance:read",
  "/app/finance/billing": "finance:read",
  "/app/finance/withdrawals": "finance:read",
  "/app/finance/revenue-distribution": "finance:read",
  "/app/finance/commissions": "finance:read",
  "/app/finance/receipts": "finance:read",
  "/app/finance/refunds": "finance:read",
  "/app/finance/settings": "finance:write",
  "/app/finance/dashboard": "finance:read",
  "/app/communication": "communication:read",
  "/app/communication/campaigns": "communication:write",
  "/app/communication/templates": "communication:write",
  "/app/communication/segments": "communication:write",
  "/app/communication/preferences": "communication:read",
  "/app/communication/subscriptions": "communication:read",
  "/app/communication/broadcasts": "executive:write",
  "/app/communication/automation": "communication:write",
  "/app/communication/analytics": "communication:read",
  "/app/communication/audit": "communication:read",
  "/app/communication/email": "communication:write",
  "/app/communication/sms": "communication:write",
  "/app/communication/push": "communication:write",
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

// ============================================
// STAGE 5 — FINANCIAL INFRASTRUCTURE
// ============================================

export const WALLET_TYPES = [
  "platform", "tenant", "national", "regional", "branch", "member", "executive", "system", "reserve",
] as const
export type WalletType = (typeof WALLET_TYPES)[number]
export const WALLET_TYPE_LABELS: Record<WalletType, string> = {
  platform: "Platform",
  tenant: "Tenant",
  national: "National",
  regional: "Regional",
  branch: "Branch",
  member: "Member",
  executive: "Executive",
  system: "System",
  reserve: "Reserve",
}

export const WALLET_STATUSES = ["active", "inactive", "suspended", "closed"] as const
export type WalletStatus = (typeof WALLET_STATUSES)[number]
export const WALLET_STATUS_LABELS: Record<WalletStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  closed: "Closed",
}

export const TRANSACTION_TYPES = ["payment", "withdrawal", "transfer", "refund", "commission", "adjustment", "revenue_distribution"] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  payment: "Payment",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  refund: "Refund",
  commission: "Commission",
  adjustment: "Adjustment",
  revenue_distribution: "Revenue Distribution",
}

export const TRANSACTION_STATUSES = ["pending", "processing", "successful", "failed", "cancelled", "refunded"] as const
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number]
export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  successful: "Successful",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
}

export const PAYMENT_METHODS = ["mobile_money", "card", "bank_transfer", "wallet"] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mobile_money: "Mobile Money",
  card: "Card",
  bank_transfer: "Bank Transfer",
  wallet: "Wallet",
}

export const BILL_STATUSES = ["draft", "pending", "due", "paid", "partially_paid", "overdue", "cancelled"] as const
export type BillStatus = (typeof BILL_STATUSES)[number]
export const BILL_STATUS_LABELS: Record<BillStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  due: "Due",
  paid: "Paid",
  partially_paid: "Partially Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
}

export const BILL_TYPES = ["membership_fee", "renewal_fee", "reprint_fee", "certificate_fee", "training_fee", "custom_fee"] as const
export type BillType = (typeof BILL_TYPES)[number]
export const BILL_TYPE_LABELS: Record<BillType, string> = {
  membership_fee: "Membership Fee",
  renewal_fee: "Renewal Fee",
  reprint_fee: "Reprint Fee",
  certificate_fee: "Certificate Fee",
  training_fee: "Training Fee",
  custom_fee: "Custom Fee",
}

export const WITHDRAWAL_STATUSES = ["draft", "submitted", "under_review", "platform_review", "approved", "rejected", "cancelled", "processing", "completed"] as const
export type WithdrawalStatus = (typeof WITHDRAWAL_STATUSES)[number]
export const WITHDRAWAL_STATUS_LABELS: Record<WithdrawalStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  platform_review: "Platform Review",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
  processing: "Processing",
  completed: "Completed",
}

export const REFUND_STATUSES = ["requested", "under_review", "approved", "rejected", "completed"] as const
export type RefundStatus = (typeof REFUND_STATUSES)[number]
export const REFUND_STATUS_LABELS: Record<RefundStatus, string> = {
  requested: "Requested",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
}

// ============================================
// STAGE 6 — COMMUNICATION & ENGAGEMENT CONSTANTS
// ============================================

export const NOTIFICATION_CHANNELS = ["in_app", "email", "sms", "push"] as const
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number]
export const NOTIFICATION_CHANNEL_LABELS: Record<NotificationChannel, string> = {
  in_app: "In-App",
  email: "Email",
  sms: "SMS",
  push: "Push",
}

export const EXTENDED_NOTIFICATION_STATUSES = ["queued", "processing", "sent", "delivered", "read", "failed", "cancelled"] as const
export type ExtendedNotificationStatus = (typeof EXTENDED_NOTIFICATION_STATUSES)[number]
export const EXTENDED_NOTIFICATION_STATUS_LABELS: Record<ExtendedNotificationStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Failed",
  cancelled: "Cancelled",
}

export const EMAIL_STATUSES = ["queued", "processing", "sent", "delivered", "opened", "clicked", "failed", "bounced", "spam"] as const
export type EmailStatus = (typeof EMAIL_STATUSES)[number]
export const EMAIL_STATUS_LABELS: Record<EmailStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  sent: "Sent",
  delivered: "Delivered",
  opened: "Opened",
  clicked: "Clicked",
  failed: "Failed",
  bounced: "Bounced",
  spam: "Spam",
}

export const SMS_STATUSES = ["queued", "processing", "sent", "delivered", "failed"] as const
export type SMSStatus = (typeof SMS_STATUSES)[number]
export const SMS_STATUS_LABELS: Record<SMSStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  sent: "Sent",
  delivered: "Delivered",
  failed: "Failed",
}

export const PUSH_STATUSES = ["queued", "processing", "sent", "delivered", "opened", "failed"] as const
export type PushStatus = (typeof PUSH_STATUSES)[number]
export const PUSH_STATUS_LABELS: Record<PushStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  sent: "Sent",
  delivered: "Delivered",
  opened: "Opened",
  failed: "Failed",
}

export const CAMPAIGN_TYPES = ["awareness", "membership_drive", "renewal_campaign", "training_campaign", "event_promotion", "announcement", "other"] as const
export type CampaignType = (typeof CAMPAIGN_TYPES)[number]
export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  awareness: "Awareness",
  membership_drive: "Membership Drive",
  renewal_campaign: "Renewal Campaign",
  training_campaign: "Training Campaign",
  event_promotion: "Event Promotion",
  announcement: "Announcement",
  other: "Other",
}

export const CAMPAIGN_STATUSES = ["draft", "scheduled", "running", "completed", "cancelled"] as const
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number]
export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  running: "Running",
  completed: "Completed",
  cancelled: "Cancelled",
}

export const TEMPLATE_TYPES = ["email", "sms", "push", "notification"] as const
export type TemplateType = (typeof TEMPLATE_TYPES)[number]
export const TEMPLATE_TYPE_LABELS: Record<TemplateType, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push",
  notification: "Notification",
}

export const TEMPLATE_STATUSES = ["draft", "active", "archived"] as const
export type TemplateStatus = (typeof TEMPLATE_STATUSES)[number]
export const TEMPLATE_STATUS_LABELS: Record<TemplateStatus, string> = {
  draft: "Draft",
  active: "Active",
  archived: "Archived",
}

export const COMMUNICATION_CHANNELS = ["email", "sms", "push", "in_app"] as const
export type CommunicationChannel = (typeof COMMUNICATION_CHANNELS)[number]
export const COMMUNICATION_CHANNEL_LABELS: Record<CommunicationChannel, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push",
  in_app: "In-App",
}

export const SUBSCRIPTION_CATEGORIES = ["announcements", "events", "training", "marketplace", "opportunities", "general_updates"] as const
export type SubscriptionCategory = (typeof SUBSCRIPTION_CATEGORIES)[number]
export const SUBSCRIPTION_CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  announcements: "Announcements",
  events: "Events",
  training: "Training",
  marketplace: "Marketplace",
  opportunities: "Opportunities",
  general_updates: "General Updates",
}

export const ENGAGEMENT_EVENT_TYPES = ["email_opened", "link_clicked", "notification_read", "campaign_participation", "communication_response"] as const
export type EngagementEventType = (typeof ENGAGEMENT_EVENT_TYPES)[number]
export const ENGAGEMENT_EVENT_TYPE_LABELS: Record<EngagementEventType, string> = {
  email_opened: "Email Opened",
  link_clicked: "Link Clicked",
  notification_read: "Notification Read",
  campaign_participation: "Campaign Participation",
  communication_response: "Communication Response",
}

export const DELIVERY_STATUSES = ["queued", "processing", "sent", "delivered", "opened", "clicked", "read", "failed"] as const
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number]
export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  sent: "Sent",
  delivered: "Delivered",
  opened: "Opened",
  clicked: "Clicked",
  read: "Read",
  failed: "Failed",
}

export const BROADCAST_SCOPES = ["platform", "national", "regional", "branch", "executive"] as const
export type BroadcastScope = (typeof BROADCAST_SCOPES)[number]
export const BROADCAST_SCOPE_LABELS: Record<BroadcastScope, string> = {
  platform: "Platform",
  national: "National",
  regional: "Regional",
  branch: "Branch",
  executive: "Executive",
}

export const AUTOMATION_TRIGGER_EVENTS = [
  "member.approved", "member.registered", "renewal.due", "renewal.overdue",
  "renewal.completed", "payment.successful", "payment.failed",
  "certificate.issued", "id_card.ready", "transfer.approved",
  "executive.appointed", "apprentice.completed", "apprentice.upgraded",
] as const
export type AutomationTriggerEvent = (typeof AUTOMATION_TRIGGER_EVENTS)[number]
export const AUTOMATION_TRIGGER_LABELS: Record<AutomationTriggerEvent, string> = {
  "member.approved": "Member Approved",
  "member.registered": "Member Registered",
  "renewal.due": "Renewal Due",
  "renewal.overdue": "Renewal Overdue",
  "renewal.completed": "Renewal Completed",
  "payment.successful": "Payment Successful",
  "payment.failed": "Payment Failed",
  "certificate.issued": "Certificate Issued",
  "id_card.ready": "ID Card Ready",
  "transfer.approved": "Transfer Approved",
  "executive.appointed": "Executive Appointed",
  "apprentice.completed": "Apprentice Completed",
  "apprentice.upgraded": "Apprentice Upgraded",
}

export const AUTOMATION_ACTION_TYPES = ["send_email", "send_sms", "send_push", "send_in_app", "create_campaign"] as const
export type AutomationActionType = (typeof AUTOMATION_ACTION_TYPES)[number]
export const AUTOMATION_ACTION_LABELS: Record<AutomationActionType, string> = {
  send_email: "Send Email",
  send_sms: "Send SMS",
  send_push: "Send Push",
  send_in_app: "Send In-App",
  create_campaign: "Create Campaign",
}

export const COMMUNICATION_AUDIT_ACTIONS = [
  "message_created", "message_sent", "campaign_created", "campaign_sent",
  "template_modified", "preference_changed", "subscription_changed",
  "broadcast_sent", "automation_created", "automation_modified", "automation_toggled",
] as const
export type CommunicationAuditAction = (typeof COMMUNICATION_AUDIT_ACTIONS)[number]
export const COMMUNICATION_AUDIT_ACTION_LABELS: Record<CommunicationAuditAction, string> = {
  message_created: "Message Created",
  message_sent: "Message Sent",
  campaign_created: "Campaign Created",
  campaign_sent: "Campaign Sent",
  template_modified: "Template Modified",
  preference_changed: "Preference Changed",
  subscription_changed: "Subscription Changed",
  broadcast_sent: "Broadcast Sent",
  automation_created: "Automation Created",
  automation_modified: "Automation Modified",
  automation_toggled: "Automation Toggled",
}


