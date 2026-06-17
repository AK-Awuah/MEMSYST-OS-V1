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
  QueryConstraint,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ILeadsService } from "./ILeadsService"
import type { Lead, Activity, LeadStatus } from "@/types"

const COLLECTION = "leads"

function toLead(id: string, data: Record<string, unknown>): Lead {
  return {
    id,
    organizationName: (data.organizationName as string) || "",
    contactPerson: (data.contactPerson as string) || "",
    email: (data.email as string) || "",
    phone: (data.phone as string) || "",
    organizationType: (data.organizationType as string) || "",
    country: (data.country as string) || "",
    expectedMembers: (data.expectedMembers as number) || 0,
    website: (data.website as string) || "",
    leadSource: (data.leadSource as string) || "",
    estimatedValue: (data.estimatedValue as number) || 0,
    expectedLaunchDate: (data.expectedLaunchDate as string) || undefined,
    assignedTo: (data.assignedTo as string) || undefined,
    status: (data.status as LeadStatus) || "new",
    activities: (data.activities as Activity[]) || [],
    attachments: (data.attachments as string[]) || [],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseLeadsService implements ILeadsService {
  private db = getFirestoreDb()

  async listLeads(params?: { status?: LeadStatus; assignedTo?: string; search?: string }): Promise<Lead[]> {
    const col = collection(this.db, COLLECTION)
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.assignedTo) constraints.unshift(where("assignedTo", "==", params.assignedTo))
    const snap = await getDocs(query(col, ...constraints))
    let leads = snap.docs.map((d) => toLead(d.id, d.data() as Record<string, unknown>))
    if (params?.search) {
      const s = params.search.toLowerCase()
      leads = leads.filter(
        (l) =>
          l.organizationName.toLowerCase().includes(s) ||
          l.contactPerson.toLowerCase().includes(s) ||
          l.email.toLowerCase().includes(s)
      )
    }
    return leads
  }

  async getLead(id: string): Promise<Lead | null> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return toLead(snap.id, snap.data() as Record<string, unknown>)
  }

  async createLead(data: Omit<Lead, "id" | "activities" | "attachments" | "createdAt" | "updatedAt">): Promise<Lead> {
    const now = new Date().toISOString()
    const payload = {
      ...data,
      activities: [],
      attachments: [],
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async updateStatus(id: string, status: LeadStatus): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { status, updatedAt: new Date().toISOString() })
  }

  async assignLead(id: string, userId: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { assignedTo: userId, updatedAt: new Date().toISOString() })
  }

  async addActivity(id: string, activity: Omit<Activity, "id" | "createdAt">): Promise<void> {
    const activitiesCol = collection(this.db, COLLECTION, id, "activities")
    await addDoc(activitiesCol, { ...activity, createdAt: new Date().toISOString() })
  }

  async getLeadStats(): Promise<{ total: number; new: number; qualified: number; won: number; lost: number }> {
    const snap = await getDocs(collection(this.db, COLLECTION))
    const leads = snap.docs.map((d) => d.data() as { status: LeadStatus })
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      qualified: leads.filter((l) => l.status === "qualified").length,
      won: leads.filter((l) => l.status === "won").length,
      lost: leads.filter((l) => l.status === "lost").length,
    }
  }
}
