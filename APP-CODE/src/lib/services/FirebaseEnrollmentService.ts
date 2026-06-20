import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IEnrollmentService } from "./IEnrollmentService"
import type { Enrollment, EnrollmentStatus } from "@/types"

const COLLECTION = "enrollments"

function toEnrollment(id: string, data: Record<string, unknown>): Enrollment {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    learnerId: (data.learnerId as string) || "",
    learnerName: (data.learnerName as string) || "",
    courseId: (data.courseId as string) || "",
    courseName: data.courseName as string | undefined,
    programId: data.programId as string | undefined,
    source: (data.source as Enrollment["source"]) || "self",
    status: (data.status as EnrollmentStatus) || "pending",
    enrollmentDate: (data.enrollmentDate as string) || "",
    completionDate: data.completionDate as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseEnrollmentService implements IEnrollmentService {
  private db = getFirestoreDb()

  async listEnrollments(tenantId: string, params?: { status?: EnrollmentStatus; courseId?: string; learnerId?: string }): Promise<Enrollment[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.courseId) constraints.unshift(where("courseId", "==", params.courseId))
    if (params?.learnerId) constraints.unshift(where("learnerId", "==", params.learnerId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toEnrollment(d.id, d.data() as Record<string, unknown>))
  }

  async getEnrollment(id: string): Promise<Enrollment | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toEnrollment(snap.id, snap.data() as Record<string, unknown>)
  }

  async createEnrollment(data: Omit<Enrollment, "id" | "createdAt" | "updatedAt">): Promise<Enrollment> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getEnrollment(ref.id) as Promise<Enrollment>
  }

  async updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<Enrollment> {
    const payload: Record<string, unknown> = { status, updatedAt: new Date().toISOString() }
    if (status === "completed") payload.completionDate = new Date().toISOString()
    await updateDoc(doc(this.db, COLLECTION, id), payload)
    return this.getEnrollment(id) as Promise<Enrollment>
  }

  async getEnrollmentsByLearner(learnerId: string, tenantId: string): Promise<Enrollment[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("learnerId", "==", learnerId), where("tenantId", "==", tenantId)))
    return snap.docs.map((d) => toEnrollment(d.id, d.data() as Record<string, unknown>))
  }

  async deleteEnrollment(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
