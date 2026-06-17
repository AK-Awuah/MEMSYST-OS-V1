import type { IPermissionService } from "./IPermissionService"
import type { Permission } from "@/types"
import { allPermissions, mockRolePermissions } from "./mock-data"

export class MockPermissionService implements IPermissionService {
  async listPermissions(): Promise<Permission[]> {
    await delay(100)
    return [...allPermissions]
  }

  async listByGroup(): Promise<Record<string, Permission[]>> {
    await delay(100)
    const groups: Record<string, Permission[]> = {}
    for (const p of allPermissions) {
      if (!groups[p.group]) groups[p.group] = []
      groups[p.group].push(p)
    }
    return groups
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    await delay(100)
    return mockRolePermissions[roleId] || []
  }

  async updateRolePermissions(roleId: string, permissions: string[]): Promise<void> {
    await delay(200)
    mockRolePermissions[roleId] = permissions
  }

  async getEffectivePermissions(userId: string, _tenantId: string): Promise<string[]> {
    await delay(200)
    return ["*"]
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
