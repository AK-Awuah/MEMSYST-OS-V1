import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICourseService } from "./ICourseService"
import type { Course, CourseStatus } from "@/types"

const COLLECTION = "courses"

function toCourse(id: string, data: Record<string, unknown>): Course {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    programId: data.programId as string | undefined,
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    duration: (data.duration as string) || "",
    fees: (data.fees as number) || 0,
    level: (data.level as string) || "",
    status: (data.status as CourseStatus) || "draft",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseCourseService implements ICourseService {
  private db = getFirestoreDb()

  async listCourses(tenantId: string, params?: {
    status?: CourseStatus
    programId?: string
    level?: string
  }): Promise<Course[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.programId) constraints.unshift(where("programId", "==", params.programId))
    if (params?.level) constraints.unshift(where("level", "==", params.level))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toCourse(d.id, d.data() as Record<string, unknown>))
  }

  async getCourse(id: string): Promise<Course | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toCourse(snap.id, snap.data() as Record<string, unknown>)
  }

  async createCourse(data: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getCourse(ref.id) as Promise<Course>
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getCourse(id) as Promise<Course>
  }

  async publishCourse(id: string): Promise<Course> {
    await updateDoc(doc(this.db, COLLECTION, id), { status: "published", updatedAt: new Date().toISOString() })
    return this.getCourse(id) as Promise<Course>
  }

  async archiveCourse(id: string): Promise<Course> {
    await updateDoc(doc(this.db, COLLECTION, id), { status: "archived", updatedAt: new Date().toISOString() })
    return this.getCourse(id) as Promise<Course>
  }

  async deleteCourse(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
