import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IAttendanceService } from "./IAttendanceService"
import type { Attendance, AttendanceStatus } from "@/types"

const COLLECTION = "attendance"

function toAttendance(id: string, data: Record<string, unknown>): Attendance {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    learnerId: (data.learnerId as string) || "",
    learnerName: (data.learnerName as string) || "",
    courseId: (data.courseId as string) || "",
    session: (data.session as string) || "",
    date: (data.date as string) || "",
    status: (data.status as AttendanceStatus) || "present",
    notes: data.notes as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
  }
}

export class FirebaseAttendanceService implements IAttendanceService {
  private db = getFirestoreDb()

  async listAttendance(tenantId: string, params?: { status?: AttendanceStatus; courseId?: string; learnerId?: string; date?: string }): Promise<Attendance[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("date", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.courseId) constraints.unshift(where("courseId", "==", params.courseId))
    if (params?.learnerId) constraints.unshift(where("learnerId", "==", params.learnerId))
    if (params?.date) constraints.unshift(where("date", "==", params.date))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toAttendance(d.id, d.data() as Record<string, unknown>))
  }

  async getAttendance(id: string): Promise<Attendance | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toAttendance(snap.id, snap.data() as Record<string, unknown>)
  }

  async recordAttendance(data: Omit<Attendance, "id" | "createdAt">): Promise<Attendance> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    })
    return this.getAttendance(ref.id) as Promise<Attendance>
  }

  async updateAttendance(id: string, data: Partial<Attendance>): Promise<Attendance> {
    await updateDoc(doc(this.db, COLLECTION, id), data)
    return this.getAttendance(id) as Promise<Attendance>
  }

  async getAttendanceByLearner(learnerId: string, tenantId: string): Promise<Attendance[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("learnerId", "==", learnerId), where("tenantId", "==", tenantId)))
    return snap.docs.map((d) => toAttendance(d.id, d.data() as Record<string, unknown>))
  }

  async getAttendanceByCourse(courseId: string, tenantId: string): Promise<Attendance[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("courseId", "==", courseId), where("tenantId", "==", tenantId)))
    return snap.docs.map((d) => toAttendance(d.id, d.data() as Record<string, unknown>))
  }

  async deleteAttendance(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
