import { USE_MOCK_SERVICES } from "@/lib/firebase/config"
import type { IAuthService } from "./IAuthService"
import type { IFormsService } from "./IFormsService"
import type { ILeadsService } from "./ILeadsService"
import type { ICRMService } from "./ICRMService"
import type { INotificationService } from "./INotificationService"
import type { IAuditService } from "./IAuditService"
import type { IOrganizationService } from "./IOrganizationService"
import type { IRoleService } from "./IRoleService"
import type { IPermissionService } from "./IPermissionService"
import type { ISessionService } from "./ISessionService"
import type { ISecurityAuditService } from "./ISecurityAuditService"
import type { IAccessControlService } from "./IAccessControlService"
import type { ITenantProvisioningService } from "./ITenantProvisioningService"
import type { ISettingsService } from "./ISettingsService"
import type { ITenantManagementService } from "./ITenantManagementService"
import type { IOrganizationStructureService } from "./IOrganizationStructureService"
import type { IExecutiveService } from "./IExecutiveService"
import type { IGovernanceService } from "./IGovernanceService"
import type { ITenantSettingsService } from "./ITenantSettingsService"
import type { ITenantDocumentService } from "./ITenantDocumentService"
import type { ITenantAuditService } from "./ITenantAuditService"
import type { IMemberService } from "./IMemberService"
import type { IMemberRegistrationService } from "./IMemberRegistrationService"
import type { IMemberApprovalService } from "./IMemberApprovalService"
import type { IApprenticeService } from "./IApprenticeService"
import type { IRenewalService } from "./IRenewalService"
import type { IMemberDocumentService } from "./IMemberDocumentService"
import type { IMemberAnalyticsService } from "./IMemberAnalyticsService"
import type { IMemberCommunicationService } from "./IMemberCommunicationService"
import type { IMembershipAuditService } from "./IMembershipAuditService"
import type { IWalletService } from "./IWalletService"
import type { ILedgerService } from "./ILedgerService"
import type { IPaymentService } from "./IPaymentService"
import type { IRevenueDistributionService } from "./IRevenueDistributionService"
import type { ICommissionService } from "./ICommissionService"
import type { IBillingService } from "./IBillingService"
import type { IWithdrawalService } from "./IWithdrawalService"
import type { IRefundService } from "./IRefundService"
import type { IFinancialSettingsService } from "./IFinancialSettingsService"
import type { IFinancialDashboardService } from "./IFinancialDashboardService"
import type { INotificationEngineService } from "./INotificationEngineService"
import type { IEmailService } from "./IEmailService"
import type { ISMSService } from "./ISMSService"
import type { IPushNotificationService } from "./IPushNotificationService"
import type { ICampaignService } from "./ICampaignService"
import type { ITemplateService } from "./ITemplateService"
import type { IAudienceSegmentService } from "./IAudienceSegmentService"
import type { ICommunicationPreferenceService } from "./ICommunicationPreferenceService"
import type { ISubscriptionService } from "./ISubscriptionService"
import type { IEngagementService } from "./IEngagementService"
import type { IDeliveryTrackingService } from "./IDeliveryTrackingService"
import type { ICommunicationAnalyticsService } from "./ICommunicationAnalyticsService"
import type { IAutomationService } from "./IAutomationService"
import type { ICommunicationAuditService } from "./ICommunicationAuditService"
import type { IIDCardService } from "./IIDCardService"
import type { ICertificateService } from "./ICertificateService"
import type { ICredentialTemplateService } from "./ICredentialTemplateService"
import type { ICredentialGenerationService } from "./ICredentialGenerationService"
import type { IPrintingService } from "./IPrintingService"
import type { ICredentialVerificationService } from "./ICredentialVerificationService"
import type { ICredentialRepositoryService } from "./ICredentialRepositoryService"
import type { ICredentialAnalyticsService } from "./ICredentialAnalyticsService"
import type { ICredentialAuditService } from "./ICredentialAuditService"
import type { ICredentialSettingsService } from "./ICredentialSettingsService"
import type { IMarketplaceListingService } from "./IMarketplaceListingService"
import type { IBusinessProfileService } from "./IBusinessProfileService"
import type { IBusinessCategoryService } from "./IBusinessCategoryService"
import type { IOpportunityService } from "./IOpportunityService"
import type { IMarketplaceApprovalService } from "./IMarketplaceApprovalService"
import type { IDirectorySearchService } from "./IDirectorySearchService"
import type { IMarketplaceAnalyticsService } from "./IMarketplaceAnalyticsService"
import type { IMarketplaceComplianceService } from "./IMarketplaceComplianceService"
import type { IMarketplaceAuditService } from "./IMarketplaceAuditService"

type ServiceInstance =
  | IAuthService
  | IFormsService
  | ILeadsService
  | ICRMService
  | INotificationService
  | IAuditService
  | IOrganizationService
  | IRoleService
  | IPermissionService
  | ISessionService
  | ISecurityAuditService
  | IAccessControlService
  | ITenantProvisioningService
  | ITenantManagementService
  | IOrganizationStructureService
  | IExecutiveService
  | IGovernanceService
  | ITenantSettingsService
  | ITenantDocumentService
  | ITenantAuditService
  | ISettingsService
  | IMemberService
  | IMemberRegistrationService
  | IMemberApprovalService
  | IApprenticeService
  | IRenewalService
  | IMemberDocumentService
  | IMemberAnalyticsService
  | IMemberCommunicationService
  | IMembershipAuditService
  | IWalletService
  | ILedgerService
  | IPaymentService
  | IRevenueDistributionService
  | ICommissionService
  | IBillingService
  | IWithdrawalService
  | IRefundService
  | IFinancialSettingsService
  | IFinancialDashboardService
  | INotificationEngineService
  | IEmailService
  | ISMSService
  | IPushNotificationService
  | ICampaignService
  | ITemplateService
  | IAudienceSegmentService
  | ICommunicationPreferenceService
  | ISubscriptionService
  | IEngagementService
  | IDeliveryTrackingService
  | ICommunicationAnalyticsService
  | IAutomationService
  | ICommunicationAuditService
  | IIDCardService
  | ICertificateService
  | ICredentialTemplateService
  | ICredentialGenerationService
  | IPrintingService
  | ICredentialVerificationService
  | ICredentialRepositoryService
  | ICredentialAnalyticsService
  | ICredentialAuditService
  | ICredentialSettingsService
  | IMarketplaceListingService
  | IBusinessProfileService
  | IBusinessCategoryService
  | IOpportunityService
  | IMarketplaceApprovalService
  | IDirectorySearchService
  | IMarketplaceAnalyticsService
  | IMarketplaceComplianceService
  | IMarketplaceAuditService

const instances = new Map<string, ServiceInstance>()

function createInstance<T extends ServiceInstance>(key: string, mock: T): T {
  if (!instances.has(key)) {
    instances.set(key, mock)
  }
  return instances.get(key) as T
}

export async function getAuthService(): Promise<IAuthService> {
  if (USE_MOCK_SERVICES) {
    const { MockAuthService } = await import("./MockAuthService")
    return createInstance("auth", new MockAuthService())
  }
  const { FirebaseAuthService } = await import("./FirebaseAuthService")
  return createInstance("auth", new FirebaseAuthService())
}

export async function getFormsService(): Promise<IFormsService> {
  if (USE_MOCK_SERVICES) {
    const { MockFormsService } = await import("./MockFormsService")
    return createInstance("forms", new MockFormsService())
  }
  const { FirebaseFormsService } = await import("./FirebaseFormsService")
  return createInstance("forms", new FirebaseFormsService())
}

export async function getLeadsService(): Promise<ILeadsService> {
  if (USE_MOCK_SERVICES) {
    const { MockLeadsService } = await import("./MockLeadsService")
    return createInstance("leads", new MockLeadsService())
  }
  const { FirebaseLeadsService } = await import("./FirebaseLeadsService")
  return createInstance("leads", new FirebaseLeadsService())
}

export async function getCRMService(): Promise<ICRMService> {
  if (USE_MOCK_SERVICES) {
    const { MockCRMService } = await import("./MockCRMService")
    return createInstance("crm", new MockCRMService())
  }
  const { FirebaseCRMService } = await import("./FirebaseCRMService")
  return createInstance("crm", new FirebaseCRMService())
}

export async function getNotificationService(): Promise<INotificationService> {
  if (USE_MOCK_SERVICES) {
    const { MockNotificationService } = await import("./MockNotificationService")
    return createInstance("notifications", new MockNotificationService())
  }
  const { FirebaseNotificationService } = await import("./FirebaseNotificationService")
  return createInstance("notifications", new FirebaseNotificationService())
}

export async function getAuditService(): Promise<IAuditService> {
  if (USE_MOCK_SERVICES) {
    const { MockAuditService } = await import("./MockAuditService")
    return createInstance("audit", new MockAuditService())
  }
  const { FirebaseAuditService } = await import("./FirebaseAuditService")
  return createInstance("audit", new FirebaseAuditService())
}

export async function getOrganizationService(): Promise<IOrganizationService> {
  if (USE_MOCK_SERVICES) {
    const { MockOrganizationService } = await import("./MockOrganizationService")
    return createInstance("organizations", new MockOrganizationService())
  }
  const { FirebaseOrganizationService } = await import("./FirebaseOrganizationService")
  return createInstance("organizations", new FirebaseOrganizationService())
}

export async function getRoleService(): Promise<IRoleService> {
  if (USE_MOCK_SERVICES) {
    const { MockRoleService } = await import("./MockRoleService")
    return createInstance("roles", new MockRoleService())
  }
  const { FirebaseRoleService } = await import("./FirebaseRoleService")
  return createInstance("roles", new FirebaseRoleService())
}

export async function getPermissionService(): Promise<IPermissionService> {
  if (USE_MOCK_SERVICES) {
    const { MockPermissionService } = await import("./MockPermissionService")
    return createInstance("permissions", new MockPermissionService())
  }
  const { FirebasePermissionService } = await import("./FirebasePermissionService")
  return createInstance("permissions", new FirebasePermissionService())
}

export async function getSessionService(): Promise<ISessionService> {
  if (USE_MOCK_SERVICES) {
    const { MockSessionService } = await import("./MockSessionService")
    return createInstance("sessions", new MockSessionService())
  }
  const { FirebaseSessionService } = await import("./FirebaseSessionService")
  return createInstance("sessions", new FirebaseSessionService())
}

export async function getSecurityAuditService(): Promise<ISecurityAuditService> {
  if (USE_MOCK_SERVICES) {
    const { MockSecurityAuditService } = await import("./MockSecurityAuditService")
    return createInstance("securityAudit", new MockSecurityAuditService())
  }
  const { FirebaseSecurityAuditService } = await import("./FirebaseSecurityAuditService")
  return createInstance("securityAudit", new FirebaseSecurityAuditService())
}

export async function getAccessControlService(): Promise<IAccessControlService> {
  if (USE_MOCK_SERVICES) {
    const { MockAccessControlService } = await import("./MockAccessControlService")
    return createInstance("accessControl", new MockAccessControlService())
  }
  const { FirebaseAccessControlService } = await import("./FirebaseAccessControlService")
  return createInstance("accessControl", new FirebaseAccessControlService())
}

export async function getTenantProvisioningService(): Promise<ITenantProvisioningService> {
  if (USE_MOCK_SERVICES) {
    const { MockTenantProvisioningService } = await import("./MockTenantProvisioningService")
    return createInstance("tenantProvisioning", new MockTenantProvisioningService())
  }
  const { FirebaseTenantProvisioningService } = await import("./FirebaseTenantProvisioningService")
  return createInstance("tenantProvisioning", new FirebaseTenantProvisioningService())
}

export async function getTenantManagementService(): Promise<ITenantManagementService> {
  if (USE_MOCK_SERVICES) {
    const { MockTenantManagementService } = await import("./MockTenantManagementService")
    return createInstance("tenantManagement", new MockTenantManagementService())
  }
  const { FirebaseTenantManagementService } = await import("./FirebaseTenantManagementService")
  return createInstance("tenantManagement", new FirebaseTenantManagementService())
}

export async function getOrganizationStructureService(): Promise<IOrganizationStructureService> {
  if (USE_MOCK_SERVICES) {
    const { MockOrganizationStructureService } = await import("./MockOrganizationStructureService")
    return createInstance("orgStructure", new MockOrganizationStructureService())
  }
  const { FirebaseOrganizationStructureService } = await import("./FirebaseOrganizationStructureService")
  return createInstance("orgStructure", new FirebaseOrganizationStructureService())
}

export async function getExecutiveService(): Promise<IExecutiveService> {
  if (USE_MOCK_SERVICES) {
    const { MockExecutiveService } = await import("./MockExecutiveService")
    return createInstance("executive", new MockExecutiveService())
  }
  const { FirebaseExecutiveService } = await import("./FirebaseExecutiveService")
  return createInstance("executive", new FirebaseExecutiveService())
}

export async function getGovernanceService(): Promise<IGovernanceService> {
  if (USE_MOCK_SERVICES) {
    const { MockGovernanceService } = await import("./MockGovernanceService")
    return createInstance("governance", new MockGovernanceService())
  }
  const { FirebaseGovernanceService } = await import("./FirebaseGovernanceService")
  return createInstance("governance", new FirebaseGovernanceService())
}

export async function getTenantSettingsService(): Promise<ITenantSettingsService> {
  if (USE_MOCK_SERVICES) {
    const { MockTenantSettingsService } = await import("./MockTenantSettingsService")
    return createInstance("tenantSettings", new MockTenantSettingsService())
  }
  const { FirebaseTenantSettingsService } = await import("./FirebaseTenantSettingsService")
  return createInstance("tenantSettings", new FirebaseTenantSettingsService())
}

export async function getTenantDocumentService(): Promise<ITenantDocumentService> {
  if (USE_MOCK_SERVICES) {
    const { MockTenantDocumentService } = await import("./MockTenantDocumentService")
    return createInstance("tenantDocuments", new MockTenantDocumentService())
  }
  const { FirebaseTenantDocumentService } = await import("./FirebaseTenantDocumentService")
  return createInstance("tenantDocuments", new FirebaseTenantDocumentService())
}

export async function getTenantAuditService(): Promise<ITenantAuditService> {
  if (USE_MOCK_SERVICES) {
    const { MockTenantAuditService } = await import("./MockTenantAuditService")
    return createInstance("tenantAudit", new MockTenantAuditService())
  }
  const { FirebaseTenantAuditService } = await import("./FirebaseTenantAuditService")
  return createInstance("tenantAudit", new FirebaseTenantAuditService())
}

export async function getSettingsService(): Promise<ISettingsService> {
  if (USE_MOCK_SERVICES) {
    const { MockSettingsService } = await import("./MockSettingsService")
    return createInstance("settings", new MockSettingsService())
  }
  const { FirebaseSettingsService } = await import("./FirebaseSettingsService")
  return createInstance("settings", new FirebaseSettingsService())
}

export async function getMemberService(): Promise<IMemberService> {
  if (USE_MOCK_SERVICES) {
    const { MockMemberService } = await import("./MockMemberService")
    return createInstance("member", new MockMemberService())
  }
  const { FirebaseMemberService } = await import("./FirebaseMemberService")
  return createInstance("member", new FirebaseMemberService())
}

export async function getMemberRegistrationService(): Promise<IMemberRegistrationService> {
  if (USE_MOCK_SERVICES) {
    const { MockMemberRegistrationService } = await import("./MockMemberRegistrationService")
    return createInstance("memberRegistration", new MockMemberRegistrationService())
  }
  const { FirebaseMemberRegistrationService } = await import("./FirebaseMemberRegistrationService")
  return createInstance("memberRegistration", new FirebaseMemberRegistrationService())
}

export async function getMemberApprovalService(): Promise<IMemberApprovalService> {
  if (USE_MOCK_SERVICES) {
    const { MockMemberApprovalService } = await import("./MockMemberApprovalService")
    return createInstance("memberApproval", new MockMemberApprovalService())
  }
  const { FirebaseMemberApprovalService } = await import("./FirebaseMemberApprovalService")
  return createInstance("memberApproval", new FirebaseMemberApprovalService())
}

export async function getApprenticeService(): Promise<IApprenticeService> {
  if (USE_MOCK_SERVICES) {
    const { MockApprenticeService } = await import("./MockApprenticeService")
    return createInstance("apprentice", new MockApprenticeService())
  }
  const { FirebaseApprenticeService } = await import("./FirebaseApprenticeService")
  return createInstance("apprentice", new FirebaseApprenticeService())
}

export async function getRenewalService(): Promise<IRenewalService> {
  if (USE_MOCK_SERVICES) {
    const { MockRenewalService } = await import("./MockRenewalService")
    return createInstance("renewal", new MockRenewalService())
  }
  const { FirebaseRenewalService } = await import("./FirebaseRenewalService")
  return createInstance("renewal", new FirebaseRenewalService())
}

export async function getMemberDocumentService(): Promise<IMemberDocumentService> {
  if (USE_MOCK_SERVICES) {
    const { MockMemberDocumentService } = await import("./MockMemberDocumentService")
    return createInstance("memberDocuments", new MockMemberDocumentService())
  }
  const { FirebaseMemberDocumentService } = await import("./FirebaseMemberDocumentService")
  return createInstance("memberDocuments", new FirebaseMemberDocumentService())
}

export async function getMemberAnalyticsService(): Promise<IMemberAnalyticsService> {
  if (USE_MOCK_SERVICES) {
    const { MockMemberAnalyticsService } = await import("./MockMemberAnalyticsService")
    return createInstance("memberAnalytics", new MockMemberAnalyticsService())
  }
  const { FirebaseMemberAnalyticsService } = await import("./FirebaseMemberAnalyticsService")
  return createInstance("memberAnalytics", new FirebaseMemberAnalyticsService())
}

export async function getMemberCommunicationService(): Promise<IMemberCommunicationService> {
  if (USE_MOCK_SERVICES) {
    const { MockMemberCommunicationService } = await import("./MockMemberCommunicationService")
    return createInstance("memberCommunication", new MockMemberCommunicationService())
  }
  const { FirebaseMemberCommunicationService } = await import("./FirebaseMemberCommunicationService")
  return createInstance("memberCommunication", new FirebaseMemberCommunicationService())
}

export async function getMembershipAuditService(): Promise<IMembershipAuditService> {
  if (USE_MOCK_SERVICES) {
    const { MockMembershipAuditService } = await import("./MockMembershipAuditService")
    return createInstance("membershipAudit", new MockMembershipAuditService())
  }
  const { FirebaseMembershipAuditService } = await import("./FirebaseMembershipAuditService")
  return createInstance("membershipAudit", new FirebaseMembershipAuditService())
}

export async function getWalletService(): Promise<IWalletService> {
  if (USE_MOCK_SERVICES) {
    const { MockWalletService } = await import("./MockWalletService")
    return createInstance("wallet", new MockWalletService())
  }
  const { FirebaseWalletService } = await import("./FirebaseWalletService")
  return createInstance("wallet", new FirebaseWalletService())
}

export async function getLedgerService(): Promise<ILedgerService> {
  if (USE_MOCK_SERVICES) {
    const { MockLedgerService } = await import("./MockLedgerService")
    return createInstance("ledger", new MockLedgerService())
  }
  const { FirebaseLedgerService } = await import("./FirebaseLedgerService")
  return createInstance("ledger", new FirebaseLedgerService())
}

export async function getPaymentService(): Promise<IPaymentService> {
  if (USE_MOCK_SERVICES) {
    const { MockPaymentService } = await import("./MockPaymentService")
    return createInstance("payment", new MockPaymentService())
  }
  const { FirebasePaymentService } = await import("./FirebasePaymentService")
  return createInstance("payment", new FirebasePaymentService())
}

export async function getRevenueDistributionService(): Promise<IRevenueDistributionService> {
  if (USE_MOCK_SERVICES) {
    const { MockRevenueDistributionService } = await import("./MockRevenueDistributionService")
    return createInstance("revenueDistribution", new MockRevenueDistributionService())
  }
  const { FirebaseRevenueDistributionService } = await import("./FirebaseRevenueDistributionService")
  return createInstance("revenueDistribution", new FirebaseRevenueDistributionService())
}

export async function getCommissionService(): Promise<ICommissionService> {
  if (USE_MOCK_SERVICES) {
    const { MockCommissionService } = await import("./MockCommissionService")
    return createInstance("commission", new MockCommissionService())
  }
  const { FirebaseCommissionService } = await import("./FirebaseCommissionService")
  return createInstance("commission", new FirebaseCommissionService())
}

export async function getBillingService(): Promise<IBillingService> {
  if (USE_MOCK_SERVICES) {
    const { MockBillingService } = await import("./MockBillingService")
    return createInstance("billing", new MockBillingService())
  }
  const { FirebaseBillingService } = await import("./FirebaseBillingService")
  return createInstance("billing", new FirebaseBillingService())
}

export async function getWithdrawalService(): Promise<IWithdrawalService> {
  if (USE_MOCK_SERVICES) {
    const { MockWithdrawalService } = await import("./MockWithdrawalService")
    return createInstance("withdrawal", new MockWithdrawalService())
  }
  const { FirebaseWithdrawalService } = await import("./FirebaseWithdrawalService")
  return createInstance("withdrawal", new FirebaseWithdrawalService())
}

export async function getRefundService(): Promise<IRefundService> {
  if (USE_MOCK_SERVICES) {
    const { MockRefundService } = await import("./MockRefundService")
    return createInstance("refund", new MockRefundService())
  }
  const { FirebaseRefundService } = await import("./FirebaseRefundService")
  return createInstance("refund", new FirebaseRefundService())
}

export async function getFinancialSettingsService(): Promise<IFinancialSettingsService> {
  if (USE_MOCK_SERVICES) {
    const { MockFinancialSettingsService } = await import("./MockFinancialSettingsService")
    return createInstance("financialSettings", new MockFinancialSettingsService())
  }
  const { FirebaseFinancialSettingsService } = await import("./FirebaseFinancialSettingsService")
  return createInstance("financialSettings", new FirebaseFinancialSettingsService())
}

export async function getFinancialDashboardService(): Promise<IFinancialDashboardService> {
  if (USE_MOCK_SERVICES) {
    const { MockFinancialDashboardService } = await import("./MockFinancialDashboardService")
    return createInstance("financialDashboard", new MockFinancialDashboardService())
  }
  const { FirebaseFinancialDashboardService } = await import("./FirebaseFinancialDashboardService")
  return createInstance("financialDashboard", new FirebaseFinancialDashboardService())
}

export async function getNotificationEngineService(): Promise<INotificationEngineService> {
  if (USE_MOCK_SERVICES) {
    const { MockNotificationEngineService } = await import("./MockNotificationEngineService")
    return createInstance("notificationEngine", new MockNotificationEngineService())
  }
  const { FirebaseNotificationEngineService } = await import("./FirebaseNotificationEngineService")
  return createInstance("notificationEngine", new FirebaseNotificationEngineService())
}

export async function getEmailService(): Promise<IEmailService> {
  if (USE_MOCK_SERVICES) {
    const { MockEmailService } = await import("./MockEmailService")
    return createInstance("email", new MockEmailService())
  }
  const { FirebaseEmailService } = await import("./FirebaseEmailService")
  return createInstance("email", new FirebaseEmailService())
}

export async function getSMSService(): Promise<ISMSService> {
  if (USE_MOCK_SERVICES) {
    const { MockSMSService } = await import("./MockSMSService")
    return createInstance("sms", new MockSMSService())
  }
  const { FirebaseSMSService } = await import("./FirebaseSMSService")
  return createInstance("sms", new FirebaseSMSService())
}

export async function getPushNotificationService(): Promise<IPushNotificationService> {
  if (USE_MOCK_SERVICES) {
    const { MockPushNotificationService } = await import("./MockPushNotificationService")
    return createInstance("push", new MockPushNotificationService())
  }
  const { FirebasePushNotificationService } = await import("./FirebasePushNotificationService")
  return createInstance("push", new FirebasePushNotificationService())
}

export async function getCampaignService(): Promise<ICampaignService> {
  if (USE_MOCK_SERVICES) {
    const { MockCampaignService } = await import("./MockCampaignService")
    return createInstance("campaign", new MockCampaignService())
  }
  const { FirebaseCampaignService } = await import("./FirebaseCampaignService")
  return createInstance("campaign", new FirebaseCampaignService())
}

export async function getTemplateService(): Promise<ITemplateService> {
  if (USE_MOCK_SERVICES) {
    const { MockTemplateService } = await import("./MockTemplateService")
    return createInstance("template", new MockTemplateService())
  }
  const { FirebaseTemplateService } = await import("./FirebaseTemplateService")
  return createInstance("template", new FirebaseTemplateService())
}

export async function getAudienceSegmentService(): Promise<IAudienceSegmentService> {
  if (USE_MOCK_SERVICES) {
    const { MockAudienceSegmentService } = await import("./MockAudienceSegmentService")
    return createInstance("audienceSegment", new MockAudienceSegmentService())
  }
  const { FirebaseAudienceSegmentService } = await import("./FirebaseAudienceSegmentService")
  return createInstance("audienceSegment", new FirebaseAudienceSegmentService())
}

export async function getCommunicationPreferenceService(): Promise<ICommunicationPreferenceService> {
  if (USE_MOCK_SERVICES) {
    const { MockCommunicationPreferenceService } = await import("./MockCommunicationPreferenceService")
    return createInstance("commPreference", new MockCommunicationPreferenceService())
  }
  const { FirebaseCommunicationPreferenceService } = await import("./FirebaseCommunicationPreferenceService")
  return createInstance("commPreference", new FirebaseCommunicationPreferenceService())
}

export async function getSubscriptionService(): Promise<ISubscriptionService> {
  if (USE_MOCK_SERVICES) {
    const { MockSubscriptionService } = await import("./MockSubscriptionService")
    return createInstance("subscription", new MockSubscriptionService())
  }
  const { FirebaseSubscriptionService } = await import("./FirebaseSubscriptionService")
  return createInstance("subscription", new FirebaseSubscriptionService())
}

export async function getEngagementService(): Promise<IEngagementService> {
  if (USE_MOCK_SERVICES) {
    const { MockEngagementService } = await import("./MockEngagementService")
    return createInstance("engagement", new MockEngagementService())
  }
  const { FirebaseEngagementService } = await import("./FirebaseEngagementService")
  return createInstance("engagement", new FirebaseEngagementService())
}

export async function getDeliveryTrackingService(): Promise<IDeliveryTrackingService> {
  if (USE_MOCK_SERVICES) {
    const { MockDeliveryTrackingService } = await import("./MockDeliveryTrackingService")
    return createInstance("deliveryTracking", new MockDeliveryTrackingService())
  }
  const { FirebaseDeliveryTrackingService } = await import("./FirebaseDeliveryTrackingService")
  return createInstance("deliveryTracking", new FirebaseDeliveryTrackingService())
}

export async function getCommunicationAnalyticsService(): Promise<ICommunicationAnalyticsService> {
  if (USE_MOCK_SERVICES) {
    const { MockCommunicationAnalyticsService } = await import("./MockCommunicationAnalyticsService")
    return createInstance("commAnalytics", new MockCommunicationAnalyticsService())
  }
  const { FirebaseCommunicationAnalyticsService } = await import("./FirebaseCommunicationAnalyticsService")
  return createInstance("commAnalytics", new FirebaseCommunicationAnalyticsService())
}

export async function getAutomationService(): Promise<IAutomationService> {
  if (USE_MOCK_SERVICES) {
    const { MockAutomationService } = await import("./MockAutomationService")
    return createInstance("automation", new MockAutomationService())
  }
  const { FirebaseAutomationService } = await import("./FirebaseAutomationService")
  return createInstance("automation", new FirebaseAutomationService())
}

export async function getCommunicationAuditService(): Promise<ICommunicationAuditService> {
  if (USE_MOCK_SERVICES) {
    const { MockCommunicationAuditService } = await import("./MockCommunicationAuditService")
    return createInstance("commAudit", new MockCommunicationAuditService())
  }
  const { FirebaseCommunicationAuditService } = await import("./FirebaseCommunicationAuditService")
  return createInstance("commAudit", new FirebaseCommunicationAuditService())
}

export async function getIDCardService(): Promise<IIDCardService> {
  if (USE_MOCK_SERVICES) {
    const { MockIDCardService } = await import("./MockIDCardService")
    return createInstance("idCard", new MockIDCardService())
  }
  const { FirebaseIDCardService } = await import("./FirebaseIDCardService")
  return createInstance("idCard", new FirebaseIDCardService())
}

export async function getCertificateService(): Promise<ICertificateService> {
  if (USE_MOCK_SERVICES) {
    const { MockCertificateService } = await import("./MockCertificateService")
    return createInstance("certificate", new MockCertificateService())
  }
  const { FirebaseCertificateService } = await import("./FirebaseCertificateService")
  return createInstance("certificate", new FirebaseCertificateService())
}

export async function getCredentialTemplateService(): Promise<ICredentialTemplateService> {
  if (USE_MOCK_SERVICES) {
    const { MockCredentialTemplateService } = await import("./MockCredentialTemplateService")
    return createInstance("credentialTemplate", new MockCredentialTemplateService())
  }
  const { FirebaseCredentialTemplateService } = await import("./FirebaseCredentialTemplateService")
  return createInstance("credentialTemplate", new FirebaseCredentialTemplateService())
}

export async function getCredentialGenerationService(): Promise<ICredentialGenerationService> {
  if (USE_MOCK_SERVICES) {
    const { MockCredentialGenerationService } = await import("./MockCredentialGenerationService")
    return createInstance("credentialGeneration", new MockCredentialGenerationService())
  }
  const { FirebaseCredentialGenerationService } = await import("./FirebaseCredentialGenerationService")
  return createInstance("credentialGeneration", new FirebaseCredentialGenerationService())
}

export async function getPrintingService(): Promise<IPrintingService> {
  if (USE_MOCK_SERVICES) {
    const { MockPrintingService } = await import("./MockPrintingService")
    return createInstance("printing", new MockPrintingService())
  }
  const { FirebasePrintingService } = await import("./FirebasePrintingService")
  return createInstance("printing", new FirebasePrintingService())
}

export async function getCredentialVerificationService(): Promise<ICredentialVerificationService> {
  if (USE_MOCK_SERVICES) {
    const { MockCredentialVerificationService } = await import("./MockCredentialVerificationService")
    return createInstance("credentialVerification", new MockCredentialVerificationService())
  }
  const { FirebaseCredentialVerificationService } = await import("./FirebaseCredentialVerificationService")
  return createInstance("credentialVerification", new FirebaseCredentialVerificationService())
}

export async function getCredentialRepositoryService(): Promise<ICredentialRepositoryService> {
  if (USE_MOCK_SERVICES) {
    const { MockCredentialRepositoryService } = await import("./MockCredentialRepositoryService")
    return createInstance("credentialRepository", new MockCredentialRepositoryService())
  }
  const { FirebaseCredentialRepositoryService } = await import("./FirebaseCredentialRepositoryService")
  return createInstance("credentialRepository", new FirebaseCredentialRepositoryService())
}

export async function getCredentialAnalyticsService(): Promise<ICredentialAnalyticsService> {
  if (USE_MOCK_SERVICES) {
    const { MockCredentialAnalyticsService } = await import("./MockCredentialAnalyticsService")
    return createInstance("credentialAnalytics", new MockCredentialAnalyticsService())
  }
  const { FirebaseCredentialAnalyticsService } = await import("./FirebaseCredentialAnalyticsService")
  return createInstance("credentialAnalytics", new FirebaseCredentialAnalyticsService())
}

export async function getCredentialAuditService(): Promise<ICredentialAuditService> {
  if (USE_MOCK_SERVICES) {
    const { MockCredentialAuditService } = await import("./MockCredentialAuditService")
    return createInstance("credentialAudit", new MockCredentialAuditService())
  }
  const { FirebaseCredentialAuditService } = await import("./FirebaseCredentialAuditService")
  return createInstance("credentialAudit", new FirebaseCredentialAuditService())
}

export async function getCredentialSettingsService(): Promise<ICredentialSettingsService> {
  if (USE_MOCK_SERVICES) {
    const { MockCredentialSettingsService } = await import("./MockCredentialSettingsService")
    return createInstance("credentialSettings", new MockCredentialSettingsService())
  }
  const { FirebaseCredentialSettingsService } = await import("./FirebaseCredentialSettingsService")
  return createInstance("credentialSettings", new FirebaseCredentialSettingsService())
}

export async function getMarketplaceListingService(): Promise<IMarketplaceListingService> {
  if (USE_MOCK_SERVICES) {
    const { MockMarketplaceListingService } = await import("./MockMarketplaceListingService")
    return createInstance("marketplaceListing", new MockMarketplaceListingService())
  }
  const { FirebaseMarketplaceListingService } = await import("./FirebaseMarketplaceListingService")
  return createInstance("marketplaceListing", new FirebaseMarketplaceListingService())
}

export async function getBusinessProfileService(): Promise<IBusinessProfileService> {
  if (USE_MOCK_SERVICES) {
    const { MockBusinessProfileService } = await import("./MockBusinessProfileService")
    return createInstance("businessProfile", new MockBusinessProfileService())
  }
  const { FirebaseBusinessProfileService } = await import("./FirebaseBusinessProfileService")
  return createInstance("businessProfile", new FirebaseBusinessProfileService())
}

export async function getBusinessCategoryService(): Promise<IBusinessCategoryService> {
  if (USE_MOCK_SERVICES) {
    const { MockBusinessCategoryService } = await import("./MockBusinessCategoryService")
    return createInstance("businessCategory", new MockBusinessCategoryService())
  }
  const { FirebaseBusinessCategoryService } = await import("./FirebaseBusinessCategoryService")
  return createInstance("businessCategory", new FirebaseBusinessCategoryService())
}

export async function getOpportunityService(): Promise<IOpportunityService> {
  if (USE_MOCK_SERVICES) {
    const { MockOpportunityService } = await import("./MockOpportunityService")
    return createInstance("opportunity", new MockOpportunityService())
  }
  const { FirebaseOpportunityService } = await import("./FirebaseOpportunityService")
  return createInstance("opportunity", new FirebaseOpportunityService())
}

export async function getMarketplaceApprovalService(): Promise<IMarketplaceApprovalService> {
  if (USE_MOCK_SERVICES) {
    const { MockMarketplaceApprovalService } = await import("./MockMarketplaceApprovalService")
    return createInstance("marketplaceApproval", new MockMarketplaceApprovalService())
  }
  const { FirebaseMarketplaceApprovalService } = await import("./FirebaseMarketplaceApprovalService")
  return createInstance("marketplaceApproval", new FirebaseMarketplaceApprovalService())
}

export async function getDirectorySearchService(): Promise<IDirectorySearchService> {
  if (USE_MOCK_SERVICES) {
    const { MockDirectorySearchService } = await import("./MockDirectorySearchService")
    return createInstance("directorySearch", new MockDirectorySearchService())
  }
  const { FirebaseDirectorySearchService } = await import("./FirebaseDirectorySearchService")
  return createInstance("directorySearch", new FirebaseDirectorySearchService())
}

export async function getMarketplaceAnalyticsService(): Promise<IMarketplaceAnalyticsService> {
  if (USE_MOCK_SERVICES) {
    const { MockMarketplaceAnalyticsService } = await import("./MockMarketplaceAnalyticsService")
    return createInstance("marketplaceAnalytics", new MockMarketplaceAnalyticsService())
  }
  const { FirebaseMarketplaceAnalyticsService } = await import("./FirebaseMarketplaceAnalyticsService")
  return createInstance("marketplaceAnalytics", new FirebaseMarketplaceAnalyticsService())
}

export async function getMarketplaceComplianceService(): Promise<IMarketplaceComplianceService> {
  if (USE_MOCK_SERVICES) {
    const { MockMarketplaceComplianceService } = await import("./MockMarketplaceComplianceService")
    return createInstance("marketplaceCompliance", new MockMarketplaceComplianceService())
  }
  const { FirebaseMarketplaceComplianceService } = await import("./FirebaseMarketplaceComplianceService")
  return createInstance("marketplaceCompliance", new FirebaseMarketplaceComplianceService())
}

export async function getMarketplaceAuditService(): Promise<IMarketplaceAuditService> {
  if (USE_MOCK_SERVICES) {
    const { MockMarketplaceAuditService } = await import("./MockMarketplaceAuditService")
    return createInstance("marketplaceAudit", new MockMarketplaceAuditService())
  }
  const { FirebaseMarketplaceAuditService } = await import("./FirebaseMarketplaceAuditService")
  return createInstance("marketplaceAudit", new FirebaseMarketplaceAuditService())
}

export type {
  IAuthService,
  IFormsService,
  ILeadsService,
  ICRMService,
  INotificationService,
  IAuditService,
  IOrganizationService,
  IRoleService,
  IPermissionService,
  ISessionService,
  ISecurityAuditService,
  IAccessControlService,
  ITenantProvisioningService,
  ITenantManagementService,
  IOrganizationStructureService,
  IExecutiveService,
  IGovernanceService,
  ITenantSettingsService,
  ITenantDocumentService,
  ITenantAuditService,
  IMemberService,
  IMemberRegistrationService,
  IMemberApprovalService,
  IApprenticeService,
  IRenewalService,
  IMemberDocumentService,
  IMemberAnalyticsService,
  IMemberCommunicationService,
  IMembershipAuditService,
  IWalletService,
  ILedgerService,
  IPaymentService,
  IRevenueDistributionService,
  ICommissionService,
  IBillingService,
  IWithdrawalService,
  IRefundService,
  IFinancialSettingsService,
  IFinancialDashboardService,
  INotificationEngineService,
  IEmailService,
  ISMSService,
  IPushNotificationService,
  ICampaignService,
  ITemplateService,
  IAudienceSegmentService,
  ICommunicationPreferenceService,
  ISubscriptionService,
  IEngagementService,
  IDeliveryTrackingService,
  ICommunicationAnalyticsService,
  IAutomationService,
  ICommunicationAuditService,
  IIDCardService,
  ICertificateService,
  ICredentialTemplateService,
  ICredentialGenerationService,
  IPrintingService,
  ICredentialVerificationService,
  ICredentialRepositoryService,
  ICredentialAnalyticsService,
  ICredentialAuditService,
  ICredentialSettingsService,
  IMarketplaceListingService,
  IBusinessProfileService,
  IBusinessCategoryService,
  IOpportunityService,
  IMarketplaceApprovalService,
  IDirectorySearchService,
  IMarketplaceAnalyticsService,
  IMarketplaceComplianceService,
  IMarketplaceAuditService,
}
export type { AuthState } from "./IAuthService"
