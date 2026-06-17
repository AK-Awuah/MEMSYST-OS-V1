import type { MemsystUser, UserRole } from "@/types"

export interface AuthState {
  user: MemsystUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface IAuthService {
  login(email: string, password: string): Promise<MemsystUser>
  logout(): Promise<void>
  getCurrentUser(): Promise<MemsystUser | null>
  onAuthStateChanged(callback: (user: MemsystUser | null) => void): () => void
  sendEmailVerification(): Promise<void>
  resetPassword(email: string): Promise<void>
  confirmPasswordReset(oobCode: string, newPassword: string): Promise<void>
  changePassword(currentPassword: string, newPassword: string): Promise<void>
  updateProfile(data: Partial<MemsystUser>): Promise<MemsystUser>
  createUser(email: string, password: string, name: string, role: UserRole): Promise<MemsystUser>
  updateUser(userId: string, data: Partial<MemsystUser>): Promise<MemsystUser>
  deactivateUser(userId: string): Promise<void>
  adminResetPassword(userId: string, newPassword: string): Promise<void>
  listUsers(): Promise<MemsystUser[]>
  hasPermission(user: MemsystUser, permission: string): boolean
}
