import { USE_MOCK_SERVICES } from "@/lib/firebase/config"
import type { IAuthService } from "./IAuthService"
import type { IFormsService } from "./IFormsService"
import type { ILeadsService } from "./ILeadsService"
import type { ICRMService } from "./ICRMService"
import type { INotificationService } from "./INotificationService"
import type { IAuditService } from "./IAuditService"
import type { IOrganizationService } from "./IOrganizationService"

type ServiceInstance =
  | IAuthService
  | IFormsService
  | ILeadsService
  | ICRMService
  | INotificationService
  | IAuditService
  | IOrganizationService

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

export type {
  IAuthService,
  IFormsService,
  ILeadsService,
  ICRMService,
  INotificationService,
  IAuditService,
  IOrganizationService,
}
export type { AuthState } from "./IAuthService"
