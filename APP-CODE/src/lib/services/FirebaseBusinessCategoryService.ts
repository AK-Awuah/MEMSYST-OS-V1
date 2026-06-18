import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IBusinessCategoryService } from "./IBusinessCategoryService"
import type { BusinessCategory } from "@/types"

const COLLECTION = "businessCategories"

function toCategory(id: string, data: Record<string, unknown>): BusinessCategory {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    parentId: data.parentId as string | undefined,
    sortOrder: (data.sortOrder as number) || 0,
    status: (data.status as BusinessCategory["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseBusinessCategoryService implements IBusinessCategoryService {
  private db = getFirestoreDb()

  async listCategories(tenantId: string): Promise<BusinessCategory[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("sortOrder", "asc")))
    return snap.docs.map((d) => toCategory(d.id, d.data() as Record<string, unknown>))
  }

  async getCategory(id: string): Promise<BusinessCategory | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toCategory(snap.id, snap.data() as Record<string, unknown>)
  }

  async createCategory(data: Omit<BusinessCategory, "id" | "createdAt" | "updatedAt">): Promise<BusinessCategory> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getCategory(ref.id) as Promise<BusinessCategory>
  }

  async updateCategory(id: string, data: Partial<BusinessCategory>): Promise<BusinessCategory> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getCategory(id) as Promise<BusinessCategory>
  }

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }

  async reorderCategories(tenantId: string, orderedIds: string[]): Promise<void> {
    const batch = orderedIds.map((id, idx) =>
      updateDoc(doc(this.db, COLLECTION, id), { sortOrder: idx, updatedAt: new Date().toISOString() })
    )
    await Promise.all(batch)
  }
}