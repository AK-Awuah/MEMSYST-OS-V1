import type { IPermissionService } from "./IPermissionService"
import type { Permission } from "@/types"

export class FirebasePermissionService implements IPermissionService {
  async listPermissions(): Promise<Permission[]> { return [] }
  async listByGroup(): Promise<Record<string, Permission[]>> { return {} }
  async getRolePermissions(_roleId: string): Promise<string[]> { return [] }
  async updateRolePermissions(_roleId: string, _permissions: string[]): Promise<void> {}
  async getEffectivePermissions(_userId: string, _tenantId: string): Promise<string[]> { return [] }
}
