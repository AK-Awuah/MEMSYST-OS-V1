import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IAssessmentService } from "./IAssessmentService"
import type { Assessment, AssessmentType, AssessmentResult } from "@/types"

const COLLECTION = "assessments"

function toAssessment(id: string, data: Record<string, unknown>): Assessment {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    learnerId: (data.learnerId as string) || "",
    learnerName: (data.learnerName as string) || "",
    courseId: (data.courseId as string) || "",
    assessmentType: (data.assessmentType as AssessmentType) || "written",
    score: (data.score as number) || 0,
    maxScore: (data.maxScore as number) || 100,
    result: (data.result as AssessmentResult) || "pending",
    date: (data.date as string) || "",
    notes: data.notes as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseAssessmentService implements IAssessmentService {
  private db = getFirestoreDb()

  async listAssessments(tenantId: string, params?: { learnerId?: string; courseId?: string; type?: string; result?: string }): Promise<Assessment[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("date", "desc")]
    if (params?.learnerId) constraints.unshift(where("learnerId", "==", params.learnerId))
    if (params?.courseId) constraints.unshift(where("courseId", "==", params.courseId))
    if (params?.type) constraints.unshift(where("assessmentType", "==", params.type))
    if (params?.result) constraints.unshift(where("result", "==", params.result))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toAssessment(d.id, d.data() as Record<string, unknown>))
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toAssessment(snap.id, snap.data() as Record<string, unknown>)
  }

  async createAssessment(data: Omit<Assessment, "id" | "createdAt" | "updatedAt">): Promise<Assessment> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getAssessment(ref.id) as Promise<Assessment>
  }

  async updateAssessment(id: string, data: Partial<Assessment>): Promise<Assessment> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getAssessment(id) as Promise<Assessment>
  }

  async getAssessmentsByLearner(learnerId: string, tenantId: string): Promise<Assessment[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), where("learnerId", "==", learnerId)))
    return snap.docs.map((d) => toAssessment(d.id, d.data() as Record<string, unknown>))
  }

  async getByCourse(courseId: string, tenantId: string): Promise<Assessment[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), where("courseId", "==", courseId)))
    return snap.docs.map((d) => toAssessment(d.id, d.data() as Record<string, unknown>))
  }

  async deleteAssessment(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
