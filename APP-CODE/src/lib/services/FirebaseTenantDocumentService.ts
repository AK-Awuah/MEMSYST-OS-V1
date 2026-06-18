import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITenantDocumentService } from "./ITenantDocumentService"
import type { TenantDocument } from "@/types"

const COLLECTION = "tenantDocuments"

function toDocument(id: string, data: Record<string, unknown>): TenantDocument {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    type: (data.type as string) || "",
    url: (data.url as string) || "",
    status: (data.status as TenantDocument["status"]) || "active",
    uploadedBy: (data.uploadedBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseTenantDocumentService implements ITenantDocumentService {
  private db = getFirestoreDb()

  async listDocuments(tenantId: string): Promise<TenantDocument[]> {
    const col = collection(this.db, COLLECTION)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toDocument(d.id, d.data() as Record<string, unknown>))
  }

  async uploadDocument(data: Omit<TenantDocument, "id" | "createdAt" | "updatedAt">): Promise<TenantDocument> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async archiveDocument(id: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { status: "archived", updatedAt: new Date().toISOString() })
  }

  async deleteDocument(id: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await deleteDoc(ref)
  }
}
