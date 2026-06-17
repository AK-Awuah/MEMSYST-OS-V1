import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICRMService } from "./ICRMService"
import type { CRMOpportunity, CRMStage, Activity } from "@/types"

const COLLECTION = "crm_opportunities"

function toOpportunity(id: string, data: Record<string, unknown>): CRMOpportunity {
  return {
    id,
    leadId: (data.leadId as string) || "",
    assignedTo: (data.assignedTo as string) || "",
    value: (data.value as number) || 0,
    probability: (data.probability as number) || 0,
    expectedCloseDate: data.expectedCloseDate instanceof Timestamp
      ? data.expectedCloseDate.toDate().toISOString()
      : (data.expectedCloseDate as string) || "",
    currentStage: (data.currentStage as CRMStage) || "new_lead",
    activities: (data.activities as Activity[]) || [],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseCRMService implements ICRMService {
  private db = getFirestoreDb()

  async listOpportunities(): Promise<CRMOpportunity[]> {
    const snap = await getDocs(query(collection(this.db, COLLECTION), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toOpportunity(d.id, d.data() as Record<string, unknown>))
  }

  async getOpportunity(id: string): Promise<CRMOpportunity | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toOpportunity(snap.id, snap.data() as Record<string, unknown>)
  }

  async createOpportunity(
    data: Omit<CRMOpportunity, "id" | "activities" | "createdAt" | "updatedAt">
  ): Promise<CRMOpportunity> {
    const now = new Date().toISOString()
    const payload = { ...data, activities: [], createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async updateStage(id: string, stage: CRMStage): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      currentStage: stage,
      updatedAt: new Date().toISOString(),
    })
  }

  async updateOpportunity(id: string, data: Partial<CRMOpportunity>): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  }

  async addActivity(id: string, activity: Omit<Activity, "id" | "createdAt">): Promise<void> {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      ...activity,
      createdAt: new Date().toISOString(),
    }
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error("Opportunity not found")
    const existing = ((snap.data() as Record<string, unknown>).activities as Activity[]) || []
    await updateDoc(ref, {
      activities: [...existing, newActivity],
      updatedAt: new Date().toISOString(),
    })
  }

  async getPipelineStats(): Promise<Record<CRMStage, number>> {
    const snap = await getDocs(collection(this.db, COLLECTION))
    const stages: Record<string, number> = {}
    snap.docs.forEach((d) => {
      const stage = (d.data() as Record<string, unknown>).currentStage as string
      stages[stage] = (stages[stage] || 0) + 1
    })
    return stages as Record<CRMStage, number>
  }
}
