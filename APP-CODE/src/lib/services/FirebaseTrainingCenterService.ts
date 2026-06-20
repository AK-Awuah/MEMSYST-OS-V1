import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITrainingCenterService } from "./ITrainingCenterService"
import type { TrainingCenter, TrainingCenterStatus, TrainingCenterOperationalStatus } from "@/types"

const COLLECTION = "trainingCenters"

function toTrainingCenter(id: string, data: Record<string, unknown>): TrainingCenter {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    businessId: data.businessId as string | undefined,
    name: (data.name as string) || "",
    ownerId: (data.ownerId as string) || "",
    ownerName: (data.ownerName as string) || "",
    location: (data.location as string) || "",
    contactInfo: data.contactInfo as string | undefined,
    coursesOffered: (data.coursesOffered as string[]) || [],
    accreditationStatus: (data.accreditationStatus as TrainingCenterStatus) || "pending",
    status: (data.status as TrainingCenterOperationalStatus) || "active",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseTrainingCenterService implements ITrainingCenterService {
  private db = getFirestoreDb()

  async listTrainingCenters(tenantId: string, params?: {
    status?: string
    accreditationStatus?: TrainingCenterStatus
  }): Promise<TrainingCenter[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.accreditationStatus) constraints.unshift(where("accreditationStatus", "==", params.accreditationStatus))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toTrainingCenter(d.id, d.data() as Record<string, unknown>))
  }

  async getTrainingCenter(id: string): Promise<TrainingCenter | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toTrainingCenter(snap.id, snap.data() as Record<string, unknown>)
  }

  async createTrainingCenter(data: Omit<TrainingCenter, "id" | "createdAt" | "updatedAt">): Promise<TrainingCenter> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getTrainingCenter(ref.id) as Promise<TrainingCenter>
  }

  async updateTrainingCenter(id: string, data: Partial<TrainingCenter>): Promise<TrainingCenter> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getTrainingCenter(id) as Promise<TrainingCenter>
  }

  async approveCenter(id: string): Promise<TrainingCenter> {
    await updateDoc(doc(this.db, COLLECTION, id), { accreditationStatus: "active", updatedAt: new Date().toISOString() })
    return this.getTrainingCenter(id) as Promise<TrainingCenter>
  }

  async suspendCenter(id: string): Promise<TrainingCenter> {
    await updateDoc(doc(this.db, COLLECTION, id), { accreditationStatus: "suspended", updatedAt: new Date().toISOString() })
    return this.getTrainingCenter(id) as Promise<TrainingCenter>
  }

  async renewAccreditation(id: string): Promise<TrainingCenter> {
    await updateDoc(doc(this.db, COLLECTION, id), { accreditationStatus: "active", updatedAt: new Date().toISOString() })
    return this.getTrainingCenter(id) as Promise<TrainingCenter>
  }

  async deleteTrainingCenter(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
