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

// ============================================
// STAGE 7 — DIGITAL IDENTITY, ID CARDS, CERTIFICATES & CREDENTIAL MANAGEMENT (DICP)
// ============================================

export const ID_CARD_TYPES = ["member", "apprentice", "executive", "staff", "custom"] as const
export type IDCardType = (typeof ID_CARD_TYPES)[number]
export const ID_CARD_TYPE_LABELS: Record<IDCardType, string> = {
  member: "Member",
  apprentice: "Apprentice",
  executive: "Executive",
  staff: "Staff",
  custom: "Custom",
}

export const ID_CARD_STATUSES = ["active", "unprinted", "printed", "ordered", "reprinted", "cancelled", "expired"] as const
export type IDCardStatus = (typeof ID_CARD_STATUSES)[number]
export const ID_CARD_STATUS_LABELS: Record<IDCardStatus, string> = {
  active: "Active",
  unprinted: "Unprinted",
  printed: "Printed",
  ordered: "Ordered",
  reprinted: "Reprinted",
  cancelled: "Cancelled",
  expired: "Expired",
}

export const CERTIFICATE_TYPES = ["membership", "training", "completion", "executive_appointment", "recognition", "custom"] as const
export type CertificateType = (typeof CERTIFICATE_TYPES)[number]
export const CERTIFICATE_TYPE_LABELS: Record<CertificateType, string> = {
  membership: "Membership",
  training: "Training",
  completion: "Completion",
  executive_appointment: "Executive Appointment",
  recognition: "Recognition",
  custom: "Custom",
}

export const CERTIFICATE_STATUSES = ["active", "unprinted", "printed", "ordered", "reprinted", "cancelled", "expired"] as const
export type CertificateStatus = (typeof CERTIFICATE_STATUSES)[number]
export const CERTIFICATE_STATUS_LABELS: Record<CertificateStatus, string> = {
  active: "Active",
  unprinted: "Unprinted",
  printed: "Printed",
  ordered: "Ordered",
  reprinted: "Reprinted",
  cancelled: "Cancelled",
  expired: "Expired",
}

export const CREDENTIAL_TEMPLATE_TYPES = ["id_card_front", "id_card_back", "certificate"] as const
export type CredentialTemplateType = (typeof CREDENTIAL_TEMPLATE_TYPES)[number]
export const CREDENTIAL_TEMPLATE_TYPE_LABELS: Record<CredentialTemplateType, string> = {
  id_card_front: "ID Card Front",
  id_card_back: "ID Card Back",
  certificate: "Certificate",
}

export const CREDENTIAL_TEMPLATE_STATUSES = ["draft", "active", "archived"] as const
export type CredentialTemplateStatus = (typeof CREDENTIAL_TEMPLATE_STATUSES)[number]
export const CREDENTIAL_TEMPLATE_STATUS_LABELS: Record<CredentialTemplateStatus, string> = {
  draft: "Draft",
  active: "Active",
  archived: "Archived",
}

export const PRINT_REQUEST_STATUSES = ["pending", "approved", "processing", "completed", "rejected", "cancelled"] as const
export type PrintRequestStatus = (typeof PRINT_REQUEST_STATUSES)[number]
export const PRINT_REQUEST_STATUS_LABELS: Record<PrintRequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  processing: "Processing",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
}

export const VERIFICATION_METHODS = ["qr_code", "credential_number", "verification_code"] as const
export type VerificationMethod = (typeof VERIFICATION_METHODS)[number]
export const VERIFICATION_METHOD_LABELS: Record<VerificationMethod, string> = {
  qr_code: "QR Code",
  credential_number: "Credential Number",
  verification_code: "Verification Code",
}

export const PUBLIC_VERIFICATION_STATUSES = ["valid", "expired", "cancelled", "suspended", "invalid"] as const
export type PublicVerificationStatus = (typeof PUBLIC_VERIFICATION_STATUSES)[number]
export const PUBLIC_VERIFICATION_STATUS_LABELS: Record<PublicVerificationStatus, string> = {
  valid: "Valid",
  expired: "Expired",
  cancelled: "Cancelled",
  suspended: "Suspended",
  invalid: "Invalid",
}

export const CREDENTIAL_AUDIT_ACTIONS = [
  "credential_generated", "credential_printed", "credential_ordered",
  "credential_reprinted", "credential_cancelled", "credential_verified",
  "credential_expired",
] as const
export type CredentialAuditAction = (typeof CREDENTIAL_AUDIT_ACTIONS)[number]
export const CREDENTIAL_AUDIT_ACTION_LABELS: Record<CredentialAuditAction, string> = {
  credential_generated: "Credential Generated",
  credential_printed: "Credential Printed",
  credential_ordered: "Credential Ordered",
  credential_reprinted: "Credential Reprinted",
  credential_cancelled: "Credential Cancelled",
  credential_verified: "Credential Verified",
  credential_expired: "Credential Expired",
}

// ============================================
// STAGE 8 — MARKETPLACE, BUSINESS DIRECTORY & COMMERCE (MBDCP)
// ============================================

export const MARKETPLACE_LISTING_TYPES = ["product", "service", "business_promotion", "opportunity", "event", "announcement"] as const
export type MarketplaceListingType = (typeof MARKETPLACE_LISTING_TYPES)[number]
export const MARKETPLACE_LISTING_TYPE_LABELS: Record<MarketplaceListingType, string> = {
  product: "Product",
  service: "Service",
  business_promotion: "Business Promotion",
  opportunity: "Opportunity",
  event: "Event",
  announcement: "Announcement",
}

export const MARKETPLACE_LISTING_STATUSES = ["draft", "pending_review", "approved", "rejected", "active", "expired", "archived"] as const
export type MarketplaceListingStatus = (typeof MARKETPLACE_LISTING_STATUSES)[number]
export const MARKETPLACE_LISTING_STATUS_LABELS: Record<MarketplaceListingStatus, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  expired: "Expired",
  archived: "Archived",
}

export const BUSINESS_VERIFICATION_TYPES = ["verified_member_business", "verified_training_center", "verified_vendor", "verified_service_provider"] as const
export type BusinessVerificationType = (typeof BUSINESS_VERIFICATION_TYPES)[number]
export const BUSINESS_VERIFICATION_TYPE_LABELS: Record<BusinessVerificationType, string> = {
  verified_member_business: "Verified Member Business",
  verified_training_center: "Verified Training Center",
  verified_vendor: "Verified Vendor",
  verified_service_provider: "Verified Service Provider",
}

export const BUSINESS_VERIFICATION_STATUSES = ["unverified", "pending", "verified", "suspended", "revoked"] as const
export type BusinessVerificationStatus = (typeof BUSINESS_VERIFICATION_STATUSES)[number]
export const BUSINESS_VERIFICATION_STATUS_LABELS: Record<BusinessVerificationStatus, string> = {
  unverified: "Unverified",
  pending: "Pending",
  verified: "Verified",
  suspended: "Suspended",
  revoked: "Revoked",
}

export const OPPORTUNITY_TYPES = ["employment", "apprenticeship", "partnership", "tender", "contract", "business_opportunity"] as const
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]
export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  employment: "Employment",
  apprenticeship: "Apprenticeship",
  partnership: "Partnership",
  tender: "Tender",
  contract: "Contract",
  business_opportunity: "Business Opportunity",
}

export const OPPORTUNITY_STATUSES = ["open", "closed", "archived"] as const
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number]
export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  open: "Open",
  closed: "Closed",
  archived: "Archived",
}

export const MARKETPLACE_AUDIT_ACTIONS = [
  "listing_created", "listing_updated", "listing_approved", "listing_rejected",
  "listing_archived", "business_created", "business_updated", "business_verified",
  "opportunity_posted", "opportunity_closed", "verification_granted", "moderation_action",
] as const
export type MarketplaceAuditAction = (typeof MARKETPLACE_AUDIT_ACTIONS)[number]
export const MARKETPLACE_AUDIT_ACTION_LABELS: Record<MarketplaceAuditAction, string> = {
  listing_created: "Listing Created",
  listing_updated: "Listing Updated",
  listing_approved: "Listing Approved",
  listing_rejected: "Listing Rejected",
  listing_archived: "Listing Archived",
  business_created: "Business Created",
  business_updated: "Business Updated",
  business_verified: "Business Verified",
  opportunity_posted: "Opportunity Posted",
  opportunity_closed: "Opportunity Closed",
  verification_granted: "Verification Granted",
  moderation_action: "Moderation Action",
}

// ============================================
// STAGE 9 — TRAINING, LEARNING, APPRENTICESHIP & SKILLS (TLASDP)
// ============================================

export const TRAINING_CENTER_STATUSES = ["pending", "active", "suspended", "expired", "closed"] as const
export type TrainingCenterStatus = (typeof TRAINING_CENTER_STATUSES)[number]
export const TRAINING_CENTER_STATUS_LABELS: Record<TrainingCenterStatus, string> = {
  pending: "Pending",
  active: "Active",
  suspended: "Suspended",
  expired: "Expired",
  closed: "Closed",
}

export const COURSE_STATUSES = ["draft", "published", "archived"] as const
export type CourseStatus = (typeof COURSE_STATUSES)[number]
export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
}

export const ENROLLMENT_STATUSES = ["pending", "active", "completed", "withdrawn", "failed"] as const
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number]
export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  pending: "Pending",
  active: "Active",
  completed: "Completed",
  withdrawn: "Withdrawn",
  failed: "Failed",
}

export const ENROLLMENT_SOURCES = ["self", "executive", "training_center"] as const
export type EnrollmentSource = (typeof ENROLLMENT_SOURCES)[number]
export const ENROLLMENT_SOURCE_LABELS: Record<EnrollmentSource, string> = {
  self: "Self",
  executive: "Executive",
  training_center: "Training Center",
}

export const APPRENTICESHIP_TRAINING_STATUSES = ["registered", "active", "under_assessment", "completed", "graduated", "upgraded"] as const
export type ApprenticeshipTrainingStatus = (typeof APPRENTICESHIP_TRAINING_STATUSES)[number]
export const APPRENTICESHIP_TRAINING_STATUS_LABELS: Record<ApprenticeshipTrainingStatus, string> = {
  registered: "Registered",
  active: "Active",
  under_assessment: "Under Assessment",
  completed: "Completed",
  graduated: "Graduated",
  upgraded: "Upgraded",
}

export const ATTENDANCE_STATUSES = ["present", "absent", "late", "excused"] as const
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]
export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
}

export const ASSESSMENT_TYPES = ["practical", "written", "oral", "project", "portfolio"] as const
export type AssessmentType = (typeof ASSESSMENT_TYPES)[number]
export const ASSESSMENT_TYPE_LABELS: Record<AssessmentType, string> = {
  practical: "Practical",
  written: "Written",
  oral: "Oral",
  project: "Project",
  portfolio: "Portfolio",
}

export const ASSESSMENT_RESULTS = ["pass", "fail", "pending"] as const
export type AssessmentResult = (typeof ASSESSMENT_RESULTS)[number]
export const ASSESSMENT_RESULT_LABELS: Record<AssessmentResult, string> = {
  pass: "Pass",
  fail: "Fail",
  pending: "Pending",
}

export const EXAMINATION_STATUSES = ["scheduled", "open", "closed", "published"] as const
export type ExaminationStatus = (typeof EXAMINATION_STATUSES)[number]
export const EXAMINATION_STATUS_LABELS: Record<ExaminationStatus, string> = {
  scheduled: "Scheduled",
  open: "Open",
  closed: "Closed",
  published: "Published",
}

export const TRAINING_CERTIFICATION_TYPES = ["course_completion", "program_completion", "apprenticeship_completion", "examination_success", "executive_approval"] as const
export type TrainingCertificationType = (typeof TRAINING_CERTIFICATION_TYPES)[number]
export const TRAINING_CERTIFICATION_TYPE_LABELS: Record<TrainingCertificationType, string> = {
  course_completion: "Course Completion",
  program_completion: "Program Completion",
  apprenticeship_completion: "Apprenticeship Completion",
  examination_success: "Examination Success",
  executive_approval: "Executive Approval",
}

export const TRAINING_CERTIFICATION_STATUSES = ["active", "expired", "revoked"] as const
export type TrainingCertificationStatus = (typeof TRAINING_CERTIFICATION_STATUSES)[number]
export const TRAINING_CERTIFICATION_STATUS_LABELS: Record<TrainingCertificationStatus, string> = {
  active: "Active",
  expired: "Expired",
  revoked: "Revoked",
}

export const GRADUATION_STATUSES = ["pending_review", "approved", "graduated", "rejected"] as const
export type GraduationStatus = (typeof GRADUATION_STATUSES)[number]
export const GRADUATION_STATUS_LABELS: Record<GraduationStatus, string> = {
  pending_review: "Pending Review",
  approved: "Approved",
  graduated: "Graduated",
  rejected: "Rejected",
}

export const CONTENT_TYPES = ["document", "video", "image", "assignment", "reference"] as const
export type ContentType = (typeof CONTENT_TYPES)[number]
export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  document: "Document",
  video: "Video",
  image: "Image",
  assignment: "Assignment",
  reference: "Reference",
}

export const TRAINING_AUDIT_ACTIONS = [
  "course_created", "course_updated", "course_published", "course_archived",
  "enrollment_approved", "enrollment_withdrawn",
  "attendance_recorded",
  "assessment_completed",
  "certification_issued",
  "graduation_approved",
  "center_created", "center_approved", "center_suspended",
] as const
export type TrainingAuditAction = (typeof TRAINING_AUDIT_ACTIONS)[number]
export const TRAINING_AUDIT_ACTION_LABELS: Record<TrainingAuditAction, string> = {
  course_created: "Course Created",
  course_updated: "Course Updated",
  course_published: "Course Published",
  course_archived: "Course Archived",
  enrollment_approved: "Enrollment Approved",
  enrollment_withdrawn: "Enrollment Withdrawn",
  attendance_recorded: "Attendance Recorded",
  assessment_completed: "Assessment Completed",
  certification_issued: "Certification Issued",
  graduation_approved: "Graduation Approved",
  center_created: "Center Created",
  center_approved: "Center Approved",
  center_suspended: "Center Suspended",
}

// ============================================
// STAGE 10 — SUPPORT HUB PLATFORM
// ============================================

export const LOAN_STATUSES = ["draft", "pending", "under_review", "approved", "disbursed", "repaying", "completed", "defaulted", "rejected", "cancelled"] as const
export type LoanStatus = (typeof LOAN_STATUSES)[number]
export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  draft: "Draft", pending: "Pending", under_review: "Under Review", approved: "Approved",
  disbursed: "Disbursed", repaying: "Repaying", completed: "Completed", defaulted: "Defaulted",
  rejected: "Rejected", cancelled: "Cancelled",
}

export const LOAN_TYPES = ["personal", "business", "emergency", "education", "equipment", "welfare", "custom"] as const
export type LoanType = (typeof LOAN_TYPES)[number]
export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  personal: "Personal", business: "Business", emergency: "Emergency",
  education: "Education", equipment: "Equipment", welfare: "Welfare", custom: "Custom",
}

export const LOAN_REPAYMENT_FREQUENCIES = ["weekly", "biweekly", "monthly", "quarterly"] as const
export type LoanRepaymentFrequency = (typeof LOAN_REPAYMENT_FREQUENCIES)[number]
export const LOAN_REPAYMENT_FREQUENCY_LABELS: Record<LoanRepaymentFrequency, string> = {
  weekly: "Weekly", biweekly: "Bi-Weekly", monthly: "Monthly", quarterly: "Quarterly",
}

export const SCHOLARSHIP_STATUSES = ["draft", "open", "accepting_applications", "closed", "awarded", "cancelled"] as const
export type ScholarshipStatus = (typeof SCHOLARSHIP_STATUSES)[number]
export const SCHOLARSHIP_STATUS_LABELS: Record<ScholarshipStatus, string> = {
  draft: "Draft", open: "Open", accepting_applications: "Accepting Applications",
  closed: "Closed", awarded: "Awarded", cancelled: "Cancelled",
}

export const SCHOLARSHIP_TYPES = ["merit", "need_based", "sports", "vocational", "general"] as const
export type ScholarshipType = (typeof SCHOLARSHIP_TYPES)[number]
export const SCHOLARSHIP_TYPE_LABELS: Record<ScholarshipType, string> = {
  merit: "Merit", need_based: "Need Based", sports: "Sports", vocational: "Vocational", general: "General",
}

export const SPONSORSHIP_STATUSES = ["draft", "active", "fulfilled", "cancelled"] as const
export type SponsorshipStatus = (typeof SPONSORSHIP_STATUSES)[number]
export const SPONSORSHIP_STATUS_LABELS: Record<SponsorshipStatus, string> = {
  draft: "Draft", active: "Active", fulfilled: "Fulfilled", cancelled: "Cancelled",
}

export const SPONSORSHIP_CATEGORIES = ["member", "event", "training", "community", "corporate"] as const
export type SponsorshipCategory = (typeof SPONSORSHIP_CATEGORIES)[number]
export const SPONSORSHIP_CATEGORY_LABELS: Record<SponsorshipCategory, string> = {
  member: "Member", event: "Event", training: "Training", community: "Community", corporate: "Corporate",
}

export const SUPPORT_PROGRAM_STATUSES = ["draft", "active", "completed", "cancelled"] as const
export type SupportProgramStatus = (typeof SUPPORT_PROGRAM_STATUSES)[number]
export const SUPPORT_PROGRAM_STATUS_LABELS: Record<SupportProgramStatus, string> = {
  draft: "Draft", active: "Active", completed: "Completed", cancelled: "Cancelled",
}

export const SUPPORT_PROGRAM_CATEGORIES = ["financial", "medical", "legal", "counseling", "emergency", "career", "housing", "food", "other"] as const
export type SupportProgramCategory = (typeof SUPPORT_PROGRAM_CATEGORIES)[number]
export const SUPPORT_PROGRAM_CATEGORY_LABELS: Record<SupportProgramCategory, string> = {
  financial: "Financial", medical: "Medical", legal: "Legal", counseling: "Counseling",
  emergency: "Emergency", career: "Career", housing: "Housing", food: "Food", other: "Other",
}

export const RESOURCE_CATEGORIES = ["financial", "legal", "health", "education", "career", "housing", "emergency", "community", "government"] as const
export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number]
export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  financial: "Financial", legal: "Legal", health: "Health", education: "Education",
  career: "Career", housing: "Housing", emergency: "Emergency", community: "Community", government: "Government",
}

export const SUPPORT_HUB_AUDIT_ACTIONS = [
  "loan_created", "loan_approved", "loan_disbursed", "loan_repaid", "loan_defaulted",
  "scholarship_created", "scholarship_awarded", "scholarship_closed",
  "sponsorship_created", "sponsorship_fulfilled",
  "program_created", "program_enrolled", "program_completed",
  "resource_added", "resource_updated", "resource_archived",
] as const

export type SupportHubAuditAction = (typeof SUPPORT_HUB_AUDIT_ACTIONS)[number]

export const SUPPORT_HUB_AUDIT_ACTION_LABELS: Record<SupportHubAuditAction, string> = {
  loan_created: "Loan Created",
  loan_approved: "Loan Approved",
  loan_disbursed: "Loan Disbursed",
  loan_repaid: "Loan Repaid",
  loan_defaulted: "Loan Defaulted",
  scholarship_created: "Scholarship Created",
  scholarship_awarded: "Scholarship Awarded",
  scholarship_closed: "Scholarship Closed",
  sponsorship_created: "Sponsorship Created",
  sponsorship_fulfilled: "Sponsorship Fulfilled",
  program_created: "Program Created",
  program_enrolled: "Program Enrolled",
  program_completed: "Program Completed",
  resource_added: "Resource Added",
  resource_updated: "Resource Updated",
  resource_archived: "Resource Archived",
}

// ============================================
// STAGE 11 — EVENTS & PROGRAMS
// ============================================

export const EVENT_STATUSES = ["draft", "published", "open_for_registration", "closed", "in_progress", "completed", "cancelled", "postponed"] as const
export type EventStatus = (typeof EVENT_STATUSES)[number]
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Draft", published: "Published", open_for_registration: "Open for Registration",
  closed: "Closed", in_progress: "In Progress", completed: "Completed",
  cancelled: "Cancelled", postponed: "Postponed",
}

export const EVENT_TYPES = ["conference", "workshop", "seminar", "meeting", "webinar", "social", "fundraiser", "training", "exhibition", "networking", "other"] as const
export type EventType = (typeof EVENT_TYPES)[number]
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  conference: "Conference", workshop: "Workshop", seminar: "Seminar", meeting: "Meeting",
  webinar: "Webinar", social: "Social", fundraiser: "Fundraiser", training: "Training",
  exhibition: "Exhibition", networking: "Networking", other: "Other",
}

export const EVENT_FORMATS = ["in_person", "virtual", "hybrid"] as const
export type EventFormat = (typeof EVENT_FORMATS)[number]
export const EVENT_FORMAT_LABELS: Record<EventFormat, string> = {
  in_person: "In Person", virtual: "Virtual", hybrid: "Hybrid",
}

export const REGISTRATION_STATUSES = ["registered", "confirmed", "attended", "cancelled", "no_show"] as const
export type EventRegistrationStatus = (typeof REGISTRATION_STATUSES)[number]
export const REGISTRATION_STATUS_LABELS: Record<EventRegistrationStatus, string> = {
  registered: "Registered", confirmed: "Confirmed", attended: "Attended",
  cancelled: "Cancelled", no_show: "No Show",
}

export const WORKSHOP_STATUSES = ["draft", "scheduled", "in_progress", "completed", "cancelled"] as const
export type WorkshopStatus = (typeof WORKSHOP_STATUSES)[number]
export const WORKSHOP_STATUS_LABELS: Record<WorkshopStatus, string> = {
  draft: "Draft", scheduled: "Scheduled", in_progress: "In Progress",
  completed: "Completed", cancelled: "Cancelled",
}

export const EVENTS_AUDIT_ACTIONS = [
  "event_created", "event_updated", "event_published", "event_cancelled",
  "registration_confirmed", "registration_cancelled", "attendance_recorded",
  "certificate_issued", "workshop_created", "workshop_completed",
] as const

// ============================================
// STAGE 12 — GOVERNANCE PLATFORM
// ============================================

export const ELECTION_STATUSES = ["draft", "nomination", "campaign", "voting", "count", "published", "completed", "cancelled"] as const
export type ElectionStatus = (typeof ELECTION_STATUSES)[number]
export const ELECTION_STATUS_LABELS: Record<ElectionStatus, string> = {
  draft: "Draft", nomination: "Nomination", campaign: "Campaign", voting: "Voting",
  count: "Count", published: "Published", completed: "Completed", cancelled: "Cancelled",
}

export const CANDIDATE_STATUSES = ["nominated", "approved", "disqualified", "withdrawn"] as const
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number]
export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  nominated: "Nominated", approved: "Approved", disqualified: "Disqualified", withdrawn: "Withdrawn",
}

export const COMMITTEE_TYPES = ["standing", "ad_hoc", "executive", "advisory", "subcommittee"] as const
export type CommitteeType = (typeof COMMITTEE_TYPES)[number]
export const COMMITTEE_TYPE_LABELS: Record<CommitteeType, string> = {
  standing: "Standing", ad_hoc: "Ad Hoc", executive: "Executive",
  advisory: "Advisory", subcommittee: "Subcommittee",
}

export const COMMITTEE_STATUSES = ["active", "dissolved", "inactive"] as const
export type CommitteeStatus = (typeof COMMITTEE_STATUSES)[number]
export const COMMITTEE_STATUS_LABELS: Record<CommitteeStatus, string> = {
  active: "Active", dissolved: "Dissolved", inactive: "Inactive",
}

export const MEETING_STATUSES = ["scheduled", "in_progress", "adjourned", "completed", "cancelled"] as const
export type MeetingStatus = (typeof MEETING_STATUSES)[number]
export const MEETING_STATUS_LABELS: Record<MeetingStatus, string> = {
  scheduled: "Scheduled", in_progress: "In Progress", adjourned: "Adjourned",
  completed: "Completed", cancelled: "Cancelled",
}

export const RESOLUTION_STATUSES = ["proposed", "debated", "passed", "rejected", "implemented", "superseded"] as const
export type ResolutionStatus = (typeof RESOLUTION_STATUSES)[number]
export const RESOLUTION_STATUS_LABELS: Record<ResolutionStatus, string> = {
  proposed: "Proposed", debated: "Debated", passed: "Passed",
  rejected: "Rejected", implemented: "Implemented", superseded: "Superseded",
}

export const GOVERNANCE_AUDIT_ACTIONS = [
  "election_created", "election_opened", "election_closed", "election_published",
  "candidate_nominated", "candidate_approved", "candidate_disqualified",
  "vote_cast", "committee_created", "committee_dissolved",
  "meeting_scheduled", "meeting_completed", "resolution_proposed", "resolution_passed",
] as const

// ============================================
// STAGE 13 — ANALYTICS & REPORTING
// ============================================

export const REPORT_TYPES = ["membership", "financial", "communication", "marketplace", "training", "governance", "events", "support_hub", "custom"] as const
export type ReportType = (typeof REPORT_TYPES)[number]
export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  membership: "Membership", financial: "Financial", communication: "Communication",
  marketplace: "Marketplace", training: "Training", governance: "Governance",
  events: "Events", support_hub: "Support Hub", custom: "Custom",
}

export const REPORT_FORMATS = ["pdf", "csv", "excel", "json", "html"] as const
export type ReportFormat = (typeof REPORT_FORMATS)[number]
export const REPORT_FORMAT_LABELS: Record<ReportFormat, string> = {
  pdf: "PDF", csv: "CSV", excel: "Excel", json: "JSON", html: "HTML",
}

export const REPORT_SCHEDULES = ["none", "daily", "weekly", "monthly", "quarterly", "yearly"] as const
export type ReportSchedule = (typeof REPORT_SCHEDULES)[number]
export const REPORT_SCHEDULE_LABELS: Record<ReportSchedule, string> = {
  none: "None", daily: "Daily", weekly: "Weekly", monthly: "Monthly",
  quarterly: "Quarterly", yearly: "Yearly",
}

export const ANALYTICS_AUDIT_ACTIONS = [
  "report_created", "report_generated", "report_scheduled", "report_archived",
  "dashboard_created", "dashboard_updated", "dashboard_shared",
  "widget_added", "widget_removed",
] as const

// ============================================
// STAGE 14 — INTEGRATION PLATFORM
// ============================================

export const API_KEY_STATUSES = ["active", "revoked", "expired"] as const
export type APIKeyStatus = (typeof API_KEY_STATUSES)[number]
export const API_KEY_STATUS_LABELS: Record<APIKeyStatus, string> = {
  active: "Active", revoked: "Revoked", expired: "Expired",
}

export const WEBHOOK_STATUSES = ["active", "paused", "disabled"] as const
export type WebhookStatus = (typeof WEBHOOK_STATUSES)[number]
export const WEBHOOK_STATUS_LABELS: Record<WebhookStatus, string> = {
  active: "Active", paused: "Paused", disabled: "Disabled",
}

export const INTEGRATION_TYPES = ["payment_gateway", "sms_provider", "email_provider", "crm", "accounting", "analytics", "storage", "custom"] as const
export type IntegrationType = (typeof INTEGRATION_TYPES)[number]
export const INTEGRATION_TYPE_LABELS: Record<IntegrationType, string> = {
  payment_gateway: "Payment Gateway", sms_provider: "SMS Provider", email_provider: "Email Provider",
  crm: "CRM", accounting: "Accounting", analytics: "Analytics", storage: "Storage", custom: "Custom",
}

export const INTEGRATION_AUDIT_ACTIONS = [
  "api_key_created", "api_key_revoked",
  "webhook_created", "webhook_updated", "webhook_disabled",
  "webhook_delivered", "webhook_failed",
  "integration_created", "integration_enabled", "integration_disabled", "integration_synced",
] as const

// ============================================
// STAGE 15 — MOBILE EXPERIENCE
// ============================================

export const MOBILE_AUDIT_ACTIONS = [
  "pwa_built", "pwa_updated",
  "cache_rule_created", "cache_rule_updated",
  "app_version_released", "app_version_deprecated",
] as const

// ============================================
// STAGE 16 — AI & AUTOMATION
// ============================================

export const AI_ASSISTANT_TYPES = ["membership", "finance", "communication", "governance", "training", "general"] as const
export type AIAssistantType = (typeof AI_ASSISTANT_TYPES)[number]
export const AI_ASSISTANT_TYPE_LABELS: Record<AIAssistantType, string> = {
  membership: "Membership", finance: "Finance", communication: "Communication",
  governance: "Governance", training: "Training", general: "General",
}

export const AI_AUDIT_ACTIONS = [
  "assistant_created", "assistant_updated", "assistant_toggled",
  "conversation_logged",
  "analytic_created", "analytic_run",
  "suggestion_created", "suggestion_approved", "suggestion_dismissed",
] as const

// ============================================
// STAGE 17 — PLATFORM GOVERNANCE & SAAS OPS
// ============================================

export const SUBSCRIPTION_PLAN_STATUSES = ["active", "inactive", "deprecated"] as const
export type SubscriptionPlanStatus = (typeof SUBSCRIPTION_PLAN_STATUSES)[number]
export const SUBSCRIPTION_PLAN_STATUS_LABELS: Record<SubscriptionPlanStatus, string> = {
  active: "Active", inactive: "Inactive", deprecated: "Deprecated",
}

export const BILLING_CYCLES = ["monthly", "quarterly", "biannual", "annual"] as const
export type BillingCycle = (typeof BILLING_CYCLES)[number]
export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: "Monthly", quarterly: "Quarterly", biannual: "Bi-Annual", annual: "Annual",
}

export const TENANT_SUBSCRIPTION_STATUSES = ["trial", "active", "past_due", "cancelled", "expired"] as const
export type TenantSubscriptionStatus = (typeof TENANT_SUBSCRIPTION_STATUSES)[number]
export const TENANT_SUBSCRIPTION_STATUS_LABELS: Record<TenantSubscriptionStatus, string> = {
  trial: "Trial", active: "Active", past_due: "Past Due", cancelled: "Cancelled", expired: "Expired",
}

export const INVOICE_STATUSES = ["draft", "issued", "paid", "overdue", "cancelled", "refunded"] as const
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]
export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft", issued: "Issued", paid: "Paid", overdue: "Overdue",
  cancelled: "Cancelled", refunded: "Refunded",
}

export const SUPPORT_TICKET_PRIORITIES = ["low", "medium", "high", "critical"] as const
export type SupportTicketPriority = (typeof SUPPORT_TICKET_PRIORITIES)[number]
export const SUPPORT_TICKET_PRIORITY_LABELS: Record<SupportTicketPriority, string> = {
  low: "Low", medium: "Medium", high: "High", critical: "Critical",
}

export const SUPPORT_TICKET_STATUSES = ["open", "in_progress", "waiting_on_customer", "resolved", "closed"] as const
export type SupportTicketStatus = (typeof SUPPORT_TICKET_STATUSES)[number]
export const SUPPORT_TICKET_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  open: "Open", in_progress: "In Progress", waiting_on_customer: "Waiting on Customer",
  resolved: "Resolved", closed: "Closed",
}

export const SUPPORT_TICKET_CATEGORIES = ["technical", "billing", "feature_request", "account", "other"] as const
export type SupportTicketCategory = (typeof SUPPORT_TICKET_CATEGORIES)[number]
export const SUPPORT_TICKET_CATEGORY_LABELS: Record<SupportTicketCategory, string> = {
  technical: "Technical", billing: "Billing", feature_request: "Feature Request",
  account: "Account", other: "Other",
}

export const PARTNER_TYPES = ["technology", "implementation", "training", "financial", "referral"] as const
export type PartnerType = (typeof PARTNER_TYPES)[number]
export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  technology: "Technology", implementation: "Implementation", training: "Training",
  financial: "Financial", referral: "Referral",
}

export const PLATFORM_OPS_AUDIT_ACTIONS = [
  "plan_created", "plan_updated", "plan_deprecated",
  "subscription_created", "subscription_cancelled", "subscription_updated",
  "invoice_issued", "invoice_paid", "invoice_overdue",
  "ticket_created", "ticket_resolved", "ticket_closed",
  "partner_created", "partner_suspended",
] as const

// ============================================
// STAGE 18 — ADVERTISING & SPONSORSHIP
// ============================================

export const AD_STATUSES = ["draft", "pending_review", "approved", "rejected", "active", "paused", "expired", "cancelled"] as const
export type AdStatus = (typeof AD_STATUSES)[number]
export const AD_STATUS_LABELS: Record<AdStatus, string> = {
  draft: "Draft", pending_review: "Pending Review", approved: "Approved", rejected: "Rejected",
  active: "Active", paused: "Paused", expired: "Expired", cancelled: "Cancelled",
}

export const AD_PLACEMENTS = ["homepage_banner", "marketplace_sidebar", "training_hub", "directory_featured", "announcement_promotion", "event_sponsor", "popup", "footer"] as const
export type AdPlacement = (typeof AD_PLACEMENTS)[number]
export const AD_PLACEMENT_LABELS: Record<AdPlacement, string> = {
  homepage_banner: "Homepage Banner", marketplace_sidebar: "Marketplace Sidebar",
  training_hub: "Training Hub", directory_featured: "Directory Featured",
  announcement_promotion: "Announcement Promotion", event_sponsor: "Event Sponsor",
  popup: "Popup", footer: "Footer",
}

export const AD_PRICING_MODELS = ["fixed", "per_impression", "per_click", "per_duration", "sponsorship"] as const
export type AdPricingModel = (typeof AD_PRICING_MODELS)[number]
export const AD_PRICING_MODEL_LABELS: Record<AdPricingModel, string> = {
  fixed: "Fixed", per_impression: "Per Impression", per_click: "Per Click",
  per_duration: "Per Duration", sponsorship: "Sponsorship",
}

export const ADVERTISING_AUDIT_ACTIONS = [
  "ad_created", "ad_approved", "ad_rejected", "ad_paused", "ad_expired",
  "campaign_created", "campaign_launched", "campaign_completed",
  "sponsor_deal_created", "sponsor_deal_completed",
] as const

// ============================================
// STAGE 19 — TIERING, DISCOVERY & VISIBILITY
// ============================================

export const PREMIUM_TIERS = ["free", "basic", "premium", "enterprise"] as const
export type PremiumTier = (typeof PREMIUM_TIERS)[number]
export const PREMIUM_TIER_LABELS: Record<PremiumTier, string> = {
  free: "Free", basic: "Basic", premium: "Premium", enterprise: "Enterprise",
}

export const TIERING_AUDIT_ACTIONS = [
  "account_upgraded", "account_downgraded", "account_expired",
  "listing_featured", "listing_boosted",
  "visibility_rule_created", "visibility_rule_updated", "visibility_rule_toggled",
] as const

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
  "/app/credentials": "communication:read",
  "/app/credentials/id-cards": "communication:read",
  "/app/credentials/id-cards/new": "communication:write",
  "/app/credentials/certificates": "communication:read",
  "/app/credentials/certificates/new": "communication:write",
  "/app/credentials/templates": "communication:read",
  "/app/credentials/templates/new": "communication:write",
  "/app/credentials/printing": "communication:read",
  "/app/credentials/repository": "communication:read",
  "/app/credentials/analytics": "communication:read",
  "/app/credentials/audit": "communication:read",
  "/app/credentials/settings": "communication:write",
  "/app/marketplace": "marketplace:read",
  "/app/marketplace/listings": "marketplace:read",
  "/app/marketplace/listings/new": "marketplace:write",
  "/app/marketplace/businesses": "marketplace:read",
  "/app/marketplace/businesses/new": "marketplace:write",
  "/app/marketplace/categories": "marketplace:write",
  "/app/marketplace/opportunities": "marketplace:read",
  "/app/marketplace/opportunities/new": "marketplace:write",
  "/app/marketplace/approvals": "marketplace:write",
  "/app/marketplace/search": "marketplace:read",
  "/app/marketplace/analytics": "marketplace:read",
  "/app/marketplace/compliance": "admin:write",
  "/app/marketplace/audit": "marketplace:read",
  "/app/marketplace/settings": "marketplace:write",
  "/app/marketplace/training-centers": "marketplace:read",
  "/app/training": "training:read",
  "/app/training/centers": "training:read",
  "/app/training/centers/new": "training:write",
  "/app/training/courses": "training:read",
  "/app/training/courses/new": "training:write",
  "/app/training/programs": "training:read",
  "/app/training/programs/new": "training:write",
  "/app/training/enrollments": "training:read",
  "/app/training/enrollments/new": "training:write",
  "/app/training/apprenticeships": "training:read",
  "/app/training/attendance": "training:read",
  "/app/training/attendance/record": "training:write",
  "/app/training/assessments": "training:read",
  "/app/training/assessments/new": "training:write",
  "/app/training/examinations": "training:read",
  "/app/training/examinations/schedule": "training:write",
  "/app/training/skills": "training:read",
  "/app/training/certifications": "training:read",
  "/app/training/graduations": "training:read",
  "/app/training/content": "training:read",
  "/app/training/professional-development": "training:read",
  "/app/training/analytics": "training:read",
  "/app/training/audit": "training:read",
  "/app/training/settings": "training:write",
  "/app/support-hub": "support:read",
  "/app/support-hub/loans": "support:read",
  "/app/support-hub/loans/new": "support:write",
  "/app/support-hub/scholarships": "support:read",
  "/app/support-hub/scholarships/new": "support:write",
  "/app/support-hub/sponsorships": "support:read",
  "/app/support-hub/sponsorships/new": "support:write",
  "/app/support-hub/programs": "support:read",
  "/app/support-hub/resources": "support:read",
  "/app/support-hub/analytics": "support:read",
  "/app/support-hub/audit": "support:read",
  "/app/support-hub/settings": "support:write",
  "/app/events": "events:read",
  "/app/events/upcoming": "events:read",
  "/app/events/new": "events:write",
  "/app/events/registrations": "events:read",
  "/app/events/workshops": "events:read",
  "/app/events/analytics": "events:read",
  "/app/events/audit": "events:read",
  "/app/events/settings": "events:write",
  "/app/governance": "governance:read",
  "/app/governance/elections": "governance:read",
  "/app/governance/elections/new": "governance:write",
  "/app/governance/candidates": "governance:read",
  "/app/governance/committees": "governance:read",
  "/app/governance/committees/new": "governance:write",
  "/app/governance/meetings": "governance:read",
  "/app/governance/meetings/new": "governance:write",
  "/app/governance/resolutions": "governance:read",
  "/app/governance/analytics": "governance:read",
  "/app/governance/audit": "governance:read",
  "/app/analytics": "analytics:read",
  "/app/analytics/reports": "analytics:read",
  "/app/analytics/reports/new": "analytics:write",
  "/app/analytics/dashboards": "analytics:read",
  "/app/analytics/dashboards/new": "analytics:write",
  "/app/analytics/audit": "analytics:read",
  "/app/integrations": "integrations:read",
  "/app/integrations/api-keys": "integrations:read",
  "/app/integrations/api-keys/new": "integrations:write",
  "/app/integrations/webhooks": "integrations:read",
  "/app/integrations/webhooks/new": "integrations:write",
  "/app/integrations/connected": "integrations:read",
  "/app/integrations/audit": "integrations:read",
  "/app/mobile": "mobile:read",
  "/app/mobile/pwa": "mobile:write",
  "/app/mobile/cache-rules": "mobile:write",
  "/app/mobile/versions": "mobile:read",
  "/app/mobile/audit": "mobile:read",
  "/app/ai-assistant": "ai:read",
  "/app/ai-assistant/assistants": "ai:read",
  "/app/ai-assistant/conversations": "ai:read",
  "/app/ai-assistant/analytics": "ai:read",
  "/app/ai-assistant/audit": "ai:read",
  "/app/platform-ops": "admin:read",
  "/app/platform-ops/plans": "admin:write",
  "/app/platform-ops/subscriptions": "admin:read",
  "/app/platform-ops/invoices": "admin:read",
  "/app/platform-ops/support": "admin:read",
  "/app/platform-ops/partners": "admin:read",
  "/app/platform-ops/audit": "admin:read",
  "/app/advertising": "advertising:read",
  "/app/advertising/ads": "advertising:read",
  "/app/advertising/ads/new": "advertising:write",
  "/app/advertising/campaigns": "advertising:read",
  "/app/advertising/campaigns/new": "advertising:write",
  "/app/advertising/sponsors": "advertising:read",
  "/app/advertising/analytics": "advertising:read",
  "/app/advertising/audit": "advertising:read",
  "/app/advertising/settings": "advertising:write",
  "/app/tiering": "tiering:read",
  "/app/tiering/accounts": "tiering:read",
  "/app/tiering/listings": "tiering:read",
  "/app/tiering/rules": "tiering:write",
  "/app/tiering/audit": "tiering:read",
}

