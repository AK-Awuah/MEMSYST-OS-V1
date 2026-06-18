import { collection, addDoc, getDocs, doc, query, where, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMemberDocumentService } from "./IMemberDocumentService"
import type { MemberDocument } from "@/types"

const COLLECTION = "memberDocuments"

function toDoc(id: string, data: Record<string, unknown>): MemberDocument {
  return {
    id, tenantId: (data.tenantId as string) || "", memberId: (data.memberId as string) || "",
    name: (data.name as string) || "", type: (data.type as MemberDocument["type"]) || "identification",
    url: (data.url as string) || "", status: (data.status as MemberDocument["status"]) || "active",
    uploadedBy: (data.uploadedBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseMemberDocumentService implements IMemberDocumentService {
  private db = getFirestoreDb()

  async listDocuments(_tenantId: string, memberId: string): Promise<MemberDocument[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("memberId", "==", memberId)))
    return snap.docs.map((d) => toDoc(d.id, d.data() as Record<string, unknown>))
  }

  async uploadDocument(data: Omit<MemberDocument, "id" | "createdAt" | "updatedAt">): Promise<MemberDocument> {
    const now = new Date().toISOString()
    const payload = { ...data, createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async archiveDocument(id: string): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), { status: "archived", updatedAt: new Date().toISOString() })
  }

  async deleteDocument(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
