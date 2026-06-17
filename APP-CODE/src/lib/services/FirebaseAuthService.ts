import type { IAuthService } from "./IAuthService"
import type { MemsystUser, UserRole } from "@/types"

export class FirebaseAuthService implements IAuthService {
  async login(_email: string, _password: string): Promise<MemsystUser> { throw new Error("Firebase not configured") }
  async logout(): Promise<void> {}
  async getCurrentUser(): Promise<MemsystUser | null> { return null }
  onAuthStateChanged(_callback: (user: MemsystUser | null) => void): () => void { return () => {} }
  async resetPassword(_email: string): Promise<void> {}
  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {}
  async updateProfile(_data: Partial<MemsystUser>): Promise<MemsystUser> { throw new Error("Firebase not configured") }
  async createUser(_email: string, _password: string, _name: string, _role: UserRole): Promise<MemsystUser> { throw new Error("Firebase not configured") }
  async updateUser(_userId: string, _data: Partial<MemsystUser>): Promise<MemsystUser> { throw new Error("Firebase not configured") }
  async deactivateUser(_userId: string): Promise<void> {}
  async adminResetPassword(_userId: string, _newPassword: string): Promise<void> {}
  async listUsers(): Promise<MemsystUser[]> { return [] }
  hasPermission(_user: MemsystUser, _permission: string): boolean { return false }
}
