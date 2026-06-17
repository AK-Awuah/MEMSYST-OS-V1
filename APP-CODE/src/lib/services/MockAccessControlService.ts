import type { IAccessControlService, AccessCheck } from "./IAccessControlService"
import type { MemsystUser } from "@/types"

export class MockAccessControlService implements IAccessControlService {
  async checkAccess(check: AccessCheck): Promise<boolean> {
    await delay(50)
    return true
  }

  async requireAccess(check: AccessCheck): Promise<void> {
    await delay(50)
  }

  hasPermission(user: MemsystUser, permission: string): boolean {
    if (user.permissions.includes("*")) return true
    return user.permissions.includes(permission)
  }

  hasAnyPermission(user: MemsystUser, permissions: string[]): boolean {
    if (user.permissions.includes("*")) return true
    return permissions.some((p) => user.permissions.includes(p))
  }

  filterByTenant<T extends { tenantId?: string }>(items: T[], tenantId: string): T[] {
    return items.filter((item) => !item.tenantId || item.tenantId === tenantId)
  }

  async getAccessibleTenants(user: MemsystUser): Promise<string[]> {
    await delay(100)
    if (user.permissions.includes("*")) return ["*"]
    return [user.tenantId]
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
