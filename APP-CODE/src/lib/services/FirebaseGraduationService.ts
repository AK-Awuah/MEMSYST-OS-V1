import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IGraduationService } from "./IGraduationService"
import type { Graduation, GraduationStatus } from "@/types"

const COLLECTION = "graduations"

function toGraduation(id: string, data: Record<string, unknown>): Graduation {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    apprenticeId: (data.apprenticeId as string) || "",
    apprenticeName: (data.apprenticeName as string) || "",
    trainingComplete: (data.trainingComplete as boolean) || false,
    assessmentComplete: (data.assessmentComplete as boolean) || false,
    executiveReviewComplete: (data.executiveReviewComplete as boolean) || false,
    graduationApproved: (data.graduationApproved as boolean) || false,
    upgradeEligible: (data.upgradeEligible as boolean) || false,
    graduationDate: data.graduationDate as string | undefined,
    status: (data.status as GraduationStatus) || "pending_review",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseGraduationService implements IGraduationService {
  private db = getFirestoreDb()

  async listGraduations(tenantId: string, params?: { status?: GraduationStatus; apprenticeId?: string }): Promise<Graduation[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.apprenticeId) constraints.unshift(where("apprenticeId", "==", params.apprenticeId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toGraduation(d.id, d.data() as Record<string, unknown>))
  }

  async getGraduation(id: string): Promise<Graduation | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toGraduation(snap.id, snap.data() as Record<string, unknown>)
  }

  async createGraduation(data: Omit<Graduation, "id" | "createdAt" | "updatedAt">): Promise<Graduation> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getGraduation(ref.id) as Promise<Graduation>
  }

  async updateGraduation(id: string, data: Partial<Graduation>): Promise<Graduation> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getGraduation(id) as Promise<Graduation>
  }

  async updateGraduationStatus(id: string, status: GraduationStatus): Promise<Graduation> {
    await updateDoc(doc(this.db, COLLECTION, id), { status, updatedAt: new Date().toISOString() })
    return this.getGraduation(id) as Promise<Graduation>
  }

  async approveGraduation(id: string): Promise<Graduation> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status: "graduated",
      graduationApproved: true,
      graduationDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getGraduation(id) as Promise<Graduation>
  }

  async getByApprentice(apprenticeId: string, tenantId: string): Promise<Graduation[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("apprenticeId", "==", apprenticeId), where("tenantId", "==", tenantId)))
    return snap.docs.map((d) => toGraduation(d.id, d.data() as Record<string, unknown>))
  }

  async deleteGraduation(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
