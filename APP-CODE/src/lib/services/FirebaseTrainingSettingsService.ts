import {
  collection, getDocs, getDoc, doc,
  query, where, addDoc, updateDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITrainingSettingsService } from "./ITrainingSettingsService"
import type { TrainingSettings } from "@/types"

const COLLECTION = "trainingSettings"

function toSettings(id: string, data: Record<string, unknown>): TrainingSettings {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    programs: (data.programs as string[]) || [],
    levels: (data.levels as string[]) || [],
    assessmentRules: (data.assessmentRules as string[]) || [],
    graduationRules: (data.graduationRules as string[]) || [],
    certificationRules: (data.certificationRules as string[]) || [],
    accreditationRules: (data.accreditationRules as string[]) || [],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseTrainingSettingsService implements ITrainingSettingsService {
  private db = getFirestoreDb()

  async getSettings(tenantId: string): Promise<TrainingSettings | null> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    if (snap.empty) return null
    const d = snap.docs[0]
    return toSettings(d.id, d.data() as Record<string, unknown>)
  }

  async updateSettings(tenantId: string, data: Partial<TrainingSettings>): Promise<TrainingSettings> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    if (snap.empty) throw new Error("Training settings not found for tenant")
    const existing = snap.docs[0]
    await updateDoc(doc(this.db, COLLECTION, existing.id), { ...data, updatedAt: new Date().toISOString() })
    const updated = await getDoc(doc(this.db, COLLECTION, existing.id))
    return toSettings(updated.id, updated.data() as Record<string, unknown>)
  }

  async createSettings(data: Omit<TrainingSettings, "id" | "createdAt" | "updatedAt">): Promise<TrainingSettings> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getSettings(data.tenantId) as Promise<TrainingSettings>
  }
}
