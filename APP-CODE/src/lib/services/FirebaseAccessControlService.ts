import { collection, getDocs } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IAccessControlService, AccessCheck } from "./IAccessControlService"
import type { MemsystUser } from "@/types"

export class FirebaseAccessControlService implements IAccessControlService {
  private db = getFirestoreDb()

  hasPermission(user: MemsystUser, permission: string): boolean {
    if (!user?.permissions) return false
    // Wildcard grants all access
    if (user.permissions.includes("*")) return true
    return user.permissions.includes(permission)
  }

  hasAnyPermission(user: MemsystUser, permissions: string[]): boolean {
    if (!user?.permissions) return false
    if (user.permissions.includes("*")) return true
    return permissions.some((p) => user.permissions.includes(p))
  }

  async checkAccess(check: AccessCheck): Promise<boolean> {
    // This is a client-side guard — actual enforcement is in Firestore rules
    // Here we check the user doc in Firestore for their permissions
    const { getDoc, doc } = await import("firebase/firestore")
    const snap = await getDoc(doc(this.db, "users", check.userId))
    if (!snap.exists()) return false
    const user = snap.data() as MemsystUser
    const permission = `${check.resource}:${check.action}`
    // Super admin gets all access
    if (user.permissions?.includes("*")) return true
    // Tenant scope check
    if (check.resourceTenantId && user.tenantId !== check.resourceTenantId) return false
    return this.hasPermission(user, permission)
  }

  async requireAccess(check: AccessCheck): Promise<void> {
    const hasAccess = await this.checkAccess(check)
    if (!hasAccess) {
      throw new Error(`Access denied: you do not have permission to ${check.action} ${check.resource}`)
    }
  }

  filterByTenant<T extends { tenantId?: string }>(items: T[], tenantId: string): T[] {
    return items.filter((item) => item.tenantId === tenantId || item.tenantId === undefined)
  }

  async getAccessibleTenants(user: MemsystUser): Promise<string[]> {
    // Super admin can access all tenants
    if (user.permissions?.includes("*")) {
      const snap = await getDocs(collection(this.db, "tenants"))
      return snap.docs.map((d) => d.id)
    }
    // Regular users can only access their own tenant
    return user.tenantId ? [user.tenantId] : []
  }
}
