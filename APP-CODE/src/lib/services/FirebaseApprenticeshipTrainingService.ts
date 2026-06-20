import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IApprenticeshipTrainingService } from "./IApprenticeshipTrainingService"
import type { ApprenticeshipTraining, ApprenticeshipTrainingStatus } from "@/types"

const COLLECTION = "apprenticeshipTrainings"

function toApprenticeshipTraining(id: string, data: Record<string, unknown>): ApprenticeshipTraining {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    apprenticeId: (data.apprenticeId as string) || "",
    apprenticeName: (data.apprenticeName as string) || "",
    mentorId: (data.mentorId as string) || "",
    mentorName: (data.mentorName as string) || "",
    trainingCenterId: (data.trainingCenterId as string) || "",
    programId: data.programId as string | undefined,
    skillsAcquired: (data.skillsAcquired as string[]) || [],
    progress: (data.progress as number) || 0,
    status: (data.status as ApprenticeshipTrainingStatus) || "registered",
    startDate: (data.startDate as string) || "",
    endDate: data.endDate as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseApprenticeshipTrainingService implements IApprenticeshipTrainingService {
  private db = getFirestoreDb()

  async listApprenticeshipTrainings(tenantId: string, params?: { status?: ApprenticeshipTrainingStatus; apprenticeId?: string; mentorId?: string }): Promise<ApprenticeshipTraining[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.apprenticeId) constraints.unshift(where("apprenticeId", "==", params.apprenticeId))
    if (params?.mentorId) constraints.unshift(where("mentorId", "==", params.mentorId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toApprenticeshipTraining(d.id, d.data() as Record<string, unknown>))
  }

  async getApprenticeshipTraining(id: string): Promise<ApprenticeshipTraining | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toApprenticeshipTraining(snap.id, snap.data() as Record<string, unknown>)
  }

  async createApprenticeshipTraining(data: Omit<ApprenticeshipTraining, "id" | "createdAt" | "updatedAt">): Promise<ApprenticeshipTraining> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getApprenticeshipTraining(ref.id) as Promise<ApprenticeshipTraining>
  }

  async updateApprenticeshipTraining(id: string, data: Partial<ApprenticeshipTraining>): Promise<ApprenticeshipTraining> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getApprenticeshipTraining(id) as Promise<ApprenticeshipTraining>
  }

  async updateApprenticeshipProgress(id: string, progress: number): Promise<ApprenticeshipTraining> {
    await updateDoc(doc(this.db, COLLECTION, id), { progress, updatedAt: new Date().toISOString() })
    return this.getApprenticeshipTraining(id) as Promise<ApprenticeshipTraining>
  }

  async updateApprenticeshipStatus(id: string, status: ApprenticeshipTrainingStatus): Promise<ApprenticeshipTraining> {
    await updateDoc(doc(this.db, COLLECTION, id), { status, updatedAt: new Date().toISOString() })
    return this.getApprenticeshipTraining(id) as Promise<ApprenticeshipTraining>
  }

  async getByApprentice(apprenticeId: string, tenantId: string): Promise<ApprenticeshipTraining[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("apprenticeId", "==", apprenticeId), where("tenantId", "==", tenantId)))
    return snap.docs.map((d) => toApprenticeshipTraining(d.id, d.data() as Record<string, unknown>))
  }

  async deleteApprenticeshipTraining(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
