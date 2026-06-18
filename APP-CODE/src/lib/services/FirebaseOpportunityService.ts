import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp, increment,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IOpportunityService } from "./IOpportunityService"
import type { Opportunity, OpportunityApplication, OpportunityType, OpportunityStatus } from "@/types"

const OPPORTUNITIES_COLLECTION = "opportunities"
const APPLICATIONS_COLLECTION = "opportunityApplications"

function toOpportunity(id: string, data: Record<string, unknown>): Opportunity {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    opportunityType: (data.opportunityType as OpportunityType) || "employment",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    requirements: (data.requirements as string[]) || [],
    location: (data.location as string) || "",
    applicationDeadline: data.applicationDeadline as string | undefined,
    status: (data.status as OpportunityStatus) || "open",
    viewCount: (data.viewCount as number) || 0,
    applicationCount: (data.applicationCount as number) || 0,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

function toOpportunityApplication(id: string, data: Record<string, unknown>): OpportunityApplication {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    opportunityId: (data.opportunityId as string) || "",
    applicantId: (data.applicantId as string) || "",
    applicantName: (data.applicantName as string) || "",
    applicantEmail: (data.applicantEmail as string) || "",
    message: (data.message as string) || "",
    status: (data.status as OpportunityApplication["status"]) || "pending",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
  }
}

export class FirebaseOpportunityService implements IOpportunityService {
  private db = getFirestoreDb()

  async listOpportunities(tenantId: string, params?: {
    status?: OpportunityStatus
    opportunityType?: string
  }): Promise<Opportunity[]> {
    const col = collection(this.db, OPPORTUNITIES_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.opportunityType) constraints.unshift(where("opportunityType", "==", params.opportunityType))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toOpportunity(d.id, d.data() as Record<string, unknown>))
  }

  async getOpportunity(id: string): Promise<Opportunity | null> {
    const snap = await getDoc(doc(this.db, OPPORTUNITIES_COLLECTION, id))
    if (!snap.exists()) return null
    return toOpportunity(snap.id, snap.data() as Record<string, unknown>)
  }

  async createOpportunity(data: Omit<Opportunity, "id" | "createdAt" | "updatedAt" | "viewCount" | "applicationCount">): Promise<Opportunity> {
    const ref = await addDoc(collection(this.db, OPPORTUNITIES_COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getOpportunity(ref.id) as Promise<Opportunity>
  }

  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    await updateDoc(doc(this.db, OPPORTUNITIES_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getOpportunity(id) as Promise<Opportunity>
  }

  async updateOpportunityStatus(id: string, status: OpportunityStatus): Promise<Opportunity> {
    await updateDoc(doc(this.db, OPPORTUNITIES_COLLECTION, id), { status, updatedAt: new Date().toISOString() })
    return this.getOpportunity(id) as Promise<Opportunity>
  }

  async deleteOpportunity(id: string): Promise<void> {
    await deleteDoc(doc(this.db, OPPORTUNITIES_COLLECTION, id))
  }

  async applyToOpportunity(data: Omit<OpportunityApplication, "id" | "createdAt">): Promise<OpportunityApplication> {
    const ref = await addDoc(collection(this.db, APPLICATIONS_COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    })
    await updateDoc(doc(this.db, OPPORTUNITIES_COLLECTION, data.opportunityId), {
      applicationCount: increment(1),
      updatedAt: new Date().toISOString(),
    })
    const snap = await getDoc(ref)
    return toOpportunityApplication(snap.id, snap.data() as Record<string, unknown>)
  }

  async getApplications(opportunityId: string): Promise<OpportunityApplication[]> {
    const col = collection(this.db, APPLICATIONS_COLLECTION)
    const snap = await getDocs(query(col, where("opportunityId", "==", opportunityId)))
    return snap.docs.map((d) => toOpportunityApplication(d.id, d.data() as Record<string, unknown>))
  }

  async updateApplicationStatus(id: string, status: string): Promise<OpportunityApplication> {
    await updateDoc(doc(this.db, APPLICATIONS_COLLECTION, id), { status })
    const snap = await getDoc(doc(this.db, APPLICATIONS_COLLECTION, id))
    return toOpportunityApplication(snap.id, snap.data() as Record<string, unknown>)
  }
}
