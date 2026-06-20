import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IProgramService } from "./IProgramService"
import type { Program } from "@/types"

const COLLECTION = "programs"

function toProgram(id: string, data: Record<string, unknown>): Program {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    levels: (data.levels as string[]) || [],
    requirements: (data.requirements as string[]) || [],
    completionRules: (data.completionRules as string[]) || [],
    status: (data.status as "active" | "inactive") || "active",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseProgramService implements IProgramService {
  private db = getFirestoreDb()

  async listPrograms(tenantId: string, params?: { status?: string }): Promise<Program[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toProgram(d.id, d.data() as Record<string, unknown>))
  }

  async getProgram(id: string): Promise<Program | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toProgram(snap.id, snap.data() as Record<string, unknown>)
  }

  async createProgram(data: Omit<Program, "id" | "createdAt" | "updatedAt">): Promise<Program> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getProgram(ref.id) as Promise<Program>
  }

  async updateProgram(id: string, data: Partial<Program>): Promise<Program> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getProgram(id) as Promise<Program>
  }

  async deleteProgram(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
