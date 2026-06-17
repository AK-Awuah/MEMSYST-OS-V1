import type { IAuthService, AuthState } from "./IAuthService"
import type { MemsystUser, UserRole } from "@/types"
import { mockUsers } from "./mock-data"
import { pushAuditLog } from "./shared-store"

let currentUser: MemsystUser | null = null
let authListeners: Array<(user: MemsystUser | null) => void> = []

export class MockAuthService implements IAuthService {
  async login(email: string, _password: string): Promise<MemsystUser> {
    await delay(800)
    const user = mockUsers.find((u) => u.email === email)
    if (!user) throw new Error("Invalid email or password")
    currentUser = { ...user, lastLogin: new Date().toISOString() }
    notifyListeners(currentUser)
    return currentUser
  }

  async logout(): Promise<void> {
    await delay(200)
    currentUser = null
    notifyListeners(null)
  }

  async getCurrentUser(): Promise<MemsystUser | null> {
    return currentUser
  }

  onAuthStateChanged(callback: (user: MemsystUser | null) => void): () => void {
    authListeners.push(callback)
    callback(currentUser)
    return () => {
      authListeners = authListeners.filter((l) => l !== callback)
    }
  }

  async sendEmailVerification(): Promise<void> {
    await delay(300)
  }

  async resetPassword(_email: string): Promise<void> {
    await delay(500)
  }

  async confirmPasswordReset(_oobCode: string, _newPassword: string): Promise<void> {
    await delay(500)
  }

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    await delay(500)
  }

  async updateProfile(data: Partial<MemsystUser>): Promise<MemsystUser> {
    await delay(400)
    if (!currentUser) throw new Error("Not authenticated")
    currentUser = { ...currentUser, ...data }
    return currentUser
  }

  async createUser(email: string, _password: string, name: string, role: UserRole): Promise<MemsystUser> {
    await delay(600)
    const [firstName, lastName] = name.split(" ")
    const newUser: MemsystUser = {
      id: `user-${Date.now()}`,
      tenantId: "memsyst",
      email,
      emailVerified: false,
      firstName: firstName || name,
      lastName: lastName || "",
      phone: "",
      username: `${(firstName || name).toLowerCase()}.${(lastName || "user").toLowerCase()}`,
      role,
      permissions: getDefaultPermissions(role),
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    pushAuditLog({ actor: currentUser?.firstName || "System", role: currentUser?.role || "system", action: "create", module: "users", recordType: "User", recordId: newUser.id, ipAddress: "", newValue: `Created user ${email}` })
    return newUser
  }

  async updateUser(userId: string, data: Partial<MemsystUser>): Promise<MemsystUser> {
    await delay(400)
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) throw new Error("User not found")
    const prev = { ...user }
    Object.assign(user, data)
    pushAuditLog({ actor: currentUser?.firstName || "System", role: currentUser?.role || "system", action: "update", module: "users", recordType: "User", recordId: userId, ipAddress: "", previousValue: `Role: ${prev.role}, Status: ${prev.status}`, newValue: `Role: ${user.role}, Status: ${user.status}` })
    return { ...user }
  }

  async deactivateUser(userId: string): Promise<void> {
    await delay(400)
    const user = mockUsers.find((u) => u.id === userId)
    if (user) {
      user.status = "inactive"
      pushAuditLog({ actor: currentUser?.firstName || "System", role: currentUser?.role || "system", action: "deactivate", module: "users", recordType: "User", recordId: userId, ipAddress: "", previousValue: "active", newValue: "inactive" })
    }
  }

  async adminResetPassword(userId: string, _newPassword: string): Promise<void> {
    await delay(300)
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) throw new Error("User not found")
    pushAuditLog({ actor: currentUser?.firstName || "System", role: currentUser?.role || "system", action: "reset_password", module: "users", recordType: "User", recordId: userId, ipAddress: "", newValue: "Password reset by admin" })
  }

  async listUsers(): Promise<MemsystUser[]> {
    return [...mockUsers]
  }

  hasPermission(user: MemsystUser, permission: string): boolean {
    if (user.permissions.includes("*")) return true
    return user.permissions.includes(permission)
  }
}

function getDefaultPermissions(role: UserRole): string[] {
  switch (role) {
    case "super_admin":
      return ["*"]
    case "operations_admin":
      return ["leads:read", "leads:write", "forms:read", "forms:write", "organizations:read"]
    case "sales_admin":
      return ["leads:read", "leads:write", "crm:read", "crm:write"]
    case "support_admin":
      return ["forms:read", "forms:write", "notifications:read"]
  }
}

function notifyListeners(user: MemsystUser | null) {
  authListeners.forEach((l) => l(user))
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getAuthState(): AuthState {
  return {
    user: currentUser,
    isLoading: false,
    isAuthenticated: currentUser !== null,
  }
}
