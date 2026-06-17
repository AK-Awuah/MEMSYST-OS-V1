import type { IAccessControlService, AccessCheck } from "./IAccessControlService"
import type { MemsystUser } from "@/types"

export class FirebaseAccessControlService implements IAccessControlService {
  async checkAccess(_check: AccessCheck): Promise<boolean> { return false }
  async requireAccess(_check: AccessCheck): Promise<void> {}
  hasPermission(_user: MemsystUser, _permission: string): boolean { return false }
  hasAnyPermission(_user: MemsystUser, _permissions: string[]): boolean { return false }
  filterByTenant<T extends { tenantId?: string }>(items: T[], _tenantId: string): T[] { return items }
  async getAccessibleTenants(_user: MemsystUser): Promise<string[]> { return [] }
}
