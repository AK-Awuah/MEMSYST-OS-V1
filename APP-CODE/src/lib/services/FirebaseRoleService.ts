import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IRoleService } from "./IRoleService"
import type { Role } from "@/types"

const COLLECTION = "roles"

function toRole(id: string, data: Record<string, unknown>): Role {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    isSystem: (data.isSystem as boolean) || false,
    permissions: (data.permissions as string[]) || [],
    userCount: (data.userCount as number) || undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseRoleService implements IRoleService {
  private db = getFirestoreDb()

  async listRoles(tenantId: string): Promise<Role[]> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("tenantId", "==", tenantId),
        orderBy("createdAt", "desc")
      )
    )
    return snap.docs.map((d) => toRole(d.id, d.data() as Record<string, unknown>))
  }

  async getRole(id: string): Promise<Role | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toRole(snap.id, snap.data() as Record<string, unknown>)
  }

  async createRole(data: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role> {
    const now = new Date().toISOString()
    const payload = { ...data, createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async updateRole(id: string, data: Partial<Role>): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  }

  async deactivateRole(id: string): Promise<void> {
    // Roles don't have a status field in the type; mark with a custom field
    await updateDoc(doc(this.db, COLLECTION, id), {
      isActive: false,
      updatedAt: new Date().toISOString(),
    })
  }

  async cloneRole(id: string, newName: string): Promise<Role> {
    const source = await this.getRole(id)
    if (!source) throw new Error("Role not found")
    return this.createRole({
      ...source,
      name: newName,
      isSystem: false,
    })
  }

  async assignPermissions(id: string, permissions: string[]): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      permissions,
      updatedAt: new Date().toISOString(),
    })
  }
}
