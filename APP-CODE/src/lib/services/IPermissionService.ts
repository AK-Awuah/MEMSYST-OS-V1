import type { Permission } from "@/types"

export interface IPermissionService {
  listPermissions(): Promise<Permission[]>
  listByGroup(): Promise<Record<string, Permission[]>>
  getRolePermissions(roleId: string): Promise<string[]>
  updateRolePermissions(roleId: string, permissions: string[]): Promise<void>
  getEffectivePermissions(userId: string, tenantId: string): Promise<string[]>
}
