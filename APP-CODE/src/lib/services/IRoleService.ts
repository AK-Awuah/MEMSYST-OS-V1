import type { Role } from "@/types"

export interface IRoleService {
  listRoles(tenantId: string): Promise<Role[]>
  getRole(id: string): Promise<Role | null>
  createRole(data: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role>
  updateRole(id: string, data: Partial<Role>): Promise<void>
  deactivateRole(id: string): Promise<void>
  cloneRole(id: string, newName: string): Promise<Role>
  assignPermissions(id: string, permissions: string[]): Promise<void>
}
