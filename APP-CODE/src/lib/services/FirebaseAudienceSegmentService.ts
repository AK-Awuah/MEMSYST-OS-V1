import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IAudienceSegmentService } from "./IAudienceSegmentService"
import type { AudienceSegment, AudienceFilter } from "@/types"

const COLLECTION = "audienceSegments"

function toAudienceSegment(id: string, data: Record<string, unknown>): AudienceSegment {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    filters: (data.filters as AudienceFilter[]) || [],
    estimatedCount: (data.estimatedCount as number) || 0,
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseAudienceSegmentService implements IAudienceSegmentService {
  private db = getFirestoreDb()

  async createSegment(tenantId: string, data: Omit<AudienceSegment, "id" | "createdAt" | "updatedAt" | "estimatedCount">): Promise<AudienceSegment> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = { ...data, tenantId, estimatedCount: 0, createdAt: now, updatedAt: now }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async updateSegment(tenantId: string, id: string, data: Partial<AudienceSegment>): Promise<AudienceSegment> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Segment ${id} not found`)
    const now = new Date().toISOString()
    await updateDoc(ref, { ...data, updatedAt: now })
    const updated = await getDoc(ref)
    return toAudienceSegment(updated.id, updated.data() as Record<string, unknown>)
  }

  async deleteSegment(tenantId: string, id: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await deleteDoc(ref)
  }

  async estimateSegmentCount(tenantId: string, filters: AudienceFilter[]): Promise<number> {
    return 0
  }

  async listSegments(tenantId: string): Promise<AudienceSegment[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAudienceSegment(d.id, d.data() as Record<string, unknown>))
  }

  async getSegmentById(id: string): Promise<AudienceSegment | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toAudienceSegment(snap.id, snap.data() as Record<string, unknown>)
  }
}
