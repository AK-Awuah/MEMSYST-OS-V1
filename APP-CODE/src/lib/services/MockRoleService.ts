import type { IRoleService } from "./IRoleService"
import type { Role } from "@/types"
import { mockRoles } from "./mock-data"

const roles = [...mockRoles]

export class MockRoleService implements IRoleService {
  async listRoles(tenantId: string): Promise<Role[]> {
    await delay(200)
    return roles.filter((r) => r.tenantId === tenantId || r.isSystem)
  }

  async getRole(id: string): Promise<Role | null> {
    await delay(100)
    return roles.find((r) => r.id === id) || null
  }

  async createRole(data: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role> {
    await delay(400)
    const role: Role = {
      ...data,
      id: `role-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    roles.push(role)
    return role
  }

  async updateRole(id: string, data: Partial<Role>): Promise<void> {
    await delay(300)
    const role = roles.find((r) => r.id === id)
    if (role) {
      Object.assign(role, data, { updatedAt: new Date().toISOString() })
    }
  }

  async deactivateRole(id: string): Promise<void> {
    await delay(300)
    const role = roles.find((r) => r.id === id)
    if (role) role.isSystem = false
  }

  async cloneRole(id: string, newName: string): Promise<Role> {
    await delay(400)
    const source = roles.find((r) => r.id === id)
    if (!source) throw new Error("Role not found")
    const cloned: Role = {
      ...source,
      id: `role-${Date.now()}`,
      name: newName,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    roles.push(cloned)
    return cloned
  }

  async assignPermissions(id: string, permissions: string[]): Promise<void> {
    await delay(200)
    const role = roles.find((r) => r.id === id)
    if (role) {
      role.permissions = permissions
      role.updatedAt = new Date().toISOString()
    }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
