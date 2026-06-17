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
import type { ITenantManagementService } from "./ITenantManagementService"
import type { IOrganizationStructureService } from "./IOrganizationStructureService"
import type { IExecutiveService } from "./IExecutiveService"
import type { IGovernanceService } from "./IGovernanceService"
import type { ITenantSettingsService } from "./ITenantSettingsService"
import type { ITenantDocumentService } from "./ITenantDocumentService"
import type { ITenantAuditService } from "./ITenantAuditService"

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
  throw new Error("FirebaseTenantManagementService not yet implemented")
}

export async function getOrganizationStructureService(): Promise<IOrganizationStructureService> {
  if (USE_MOCK_SERVICES) {
    const { MockOrganizationStructureService } = await import("./MockOrganizationStructureService")
    return createInstance("orgStructure", new MockOrganizationStructureService())
  }
  throw new Error("FirebaseOrganizationStructureService not yet implemented")
}

export async function getExecutiveService(): Promise<IExecutiveService> {
  if (USE_MOCK_SERVICES) {
    const { MockExecutiveService } = await import("./MockExecutiveService")
    return createInstance("executive", new MockExecutiveService())
  }
  throw new Error("FirebaseExecutiveService not yet implemented")
}

export async function getGovernanceService(): Promise<IGovernanceService> {
  if (USE_MOCK_SERVICES) {
    const { MockGovernanceService } = await import("./MockGovernanceService")
    return createInstance("governance", new MockGovernanceService())
  }
  throw new Error("FirebaseGovernanceService not yet implemented")
}

export async function getTenantSettingsService(): Promise<ITenantSettingsService> {
  if (USE_MOCK_SERVICES) {
    const { MockTenantSettingsService } = await import("./MockTenantSettingsService")
    return createInstance("tenantSettings", new MockTenantSettingsService())
  }
  throw new Error("FirebaseTenantSettingsService not yet implemented")
}

export async function getTenantDocumentService(): Promise<ITenantDocumentService> {
  if (USE_MOCK_SERVICES) {
    const { MockTenantDocumentService } = await import("./MockTenantDocumentService")
    return createInstance("tenantDocuments", new MockTenantDocumentService())
  }
  throw new Error("FirebaseTenantDocumentService not yet implemented")
}

export async function getTenantAuditService(): Promise<ITenantAuditService> {
  if (USE_MOCK_SERVICES) {
    const { MockTenantAuditService } = await import("./MockTenantAuditService")
    return createInstance("tenantAudit", new MockTenantAuditService())
  }
  throw new Error("FirebaseTenantAuditService not yet implemented")
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
}
export type { AuthState } from "./IAuthService"
