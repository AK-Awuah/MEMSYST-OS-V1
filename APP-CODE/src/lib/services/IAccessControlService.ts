import type { MemsystUser } from "@/types"

export type AccessLevel = "platform" | "tenant" | "region" | "branch" | "personal"

export interface AccessCheck {
  userId: string
  tenantId: string
  resource: string
  action: string
  level?: AccessLevel
  resourceTenantId?: string
}

export interface IAccessControlService {
  checkAccess(check: AccessCheck): Promise<boolean>
  requireAccess(check: AccessCheck): Promise<void>
  hasPermission(user: MemsystUser, permission: string): boolean
  hasAnyPermission(user: MemsystUser, permissions: string[]): boolean
  filterByTenant<T extends { tenantId?: string }>(items: T[], tenantId: string): T[]
  getAccessibleTenants(user: MemsystUser): Promise<string[]>
}
