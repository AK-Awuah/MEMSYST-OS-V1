import type { IRoleService } from "./IRoleService"
import type { Role } from "@/types"

export class FirebaseRoleService implements IRoleService {
  async listRoles(_tenantId: string): Promise<Role[]> { return [] }
  async getRole(_id: string): Promise<Role | null> { return null }
  async createRole(_data: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role> { throw new Error("Firebase not configured") }
  async updateRole(_id: string, _data: Partial<Role>): Promise<void> {}
  async deactivateRole(_id: string): Promise<void> {}
  async cloneRole(_id: string, _newName: string): Promise<Role> { throw new Error("Firebase not configured") }
  async assignPermissions(_id: string, _permissions: string[]): Promise<void> {}
}
