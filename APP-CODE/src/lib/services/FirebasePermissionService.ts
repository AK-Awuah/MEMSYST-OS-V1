import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IPermissionService } from "./IPermissionService"
import type { Permission } from "@/types"

// Static permission registry — defined in code, not DB
// These represent all granular permissions in the system
const ALL_PERMISSIONS: Permission[] = [
  // Users
  { key: "users:read",    label: "View Users",       group: "Users",         description: "View user profiles and lists" },
  { key: "users:write",   label: "Manage Users",     group: "Users",         description: "Create, update, or deactivate users" },
  // Roles
  { key: "roles:read",    label: "View Roles",       group: "Roles",         description: "View roles and their permissions" },
  { key: "roles:write",   label: "Manage Roles",     group: "Roles",         description: "Create, update, or deactivate roles" },
  // Leads
  { key: "leads:read",    label: "View Leads",       group: "Leads",         description: "View lead records" },
  { key: "leads:write",   label: "Manage Leads",     group: "Leads",         description: "Create, update, and assign leads" },
  // Forms
  { key: "forms:read",    label: "View Forms",       group: "Forms",         description: "View form submissions" },
  { key: "forms:write",   label: "Manage Forms",     group: "Forms",         description: "Process and assign form submissions" },
  // CRM
  { key: "crm:read",      label: "View CRM",         group: "CRM",           description: "View CRM opportunities" },
  { key: "crm:write",     label: "Manage CRM",       group: "CRM",           description: "Create and update CRM opportunities" },
  // Organizations
  { key: "organizations:read",  label: "View Organizations",  group: "Organizations", description: "View organization prospects" },
  { key: "organizations:write", label: "Manage Organizations", group: "Organizations", description: "Create and update organization prospects" },
  // Tenants
  { key: "tenants:read",  label: "View Tenants",     group: "Tenants",       description: "View tenant records" },
  { key: "tenants:write", label: "Manage Tenants",   group: "Tenants",       description: "Create and update tenants" },
  // Settings
  { key: "settings:read", label: "View Settings",    group: "Settings",      description: "View platform settings" },
  { key: "settings:write", label: "Manage Settings", group: "Settings",      description: "Update platform settings" },
  // Sessions
  { key: "sessions:read",  label: "View Sessions",   group: "Security",      description: "View active user sessions" },
  { key: "sessions:write", label: "Manage Sessions", group: "Security",      description: "Terminate user sessions" },
  // Audit
  { key: "audit:read",    label: "View Audit Logs",  group: "Security",      description: "View audit logs and security events" },
  // Notifications
  { key: "notifications:read", label: "View Notifications", group: "Notifications", description: "View system notifications" },
]

export class FirebasePermissionService implements IPermissionService {
  private db = getFirestoreDb()

  async listPermissions(): Promise<Permission[]> {
    return ALL_PERMISSIONS
  }

  async listByGroup(): Promise<Record<string, Permission[]>> {
    const groups: Record<string, Permission[]> = {}
    for (const perm of ALL_PERMISSIONS) {
      if (!groups[perm.group]) groups[perm.group] = []
      groups[perm.group].push(perm)
    }
    return groups
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    const snap = await getDoc(doc(this.db, "roles", roleId))
    if (!snap.exists()) return []
    return ((snap.data() as Record<string, unknown>).permissions as string[]) || []
  }

  async updateRolePermissions(roleId: string, permissions: string[]): Promise<void> {
    await updateDoc(doc(this.db, "roles", roleId), {
      permissions,
      updatedAt: new Date().toISOString(),
    })
  }

  async getEffectivePermissions(userId: string, _tenantId: string): Promise<string[]> {
    const userSnap = await getDoc(doc(this.db, "users", userId))
    if (!userSnap.exists()) return []
    const userData = userSnap.data() as Record<string, unknown>
    return (userData.permissions as string[]) || []
  }
}
