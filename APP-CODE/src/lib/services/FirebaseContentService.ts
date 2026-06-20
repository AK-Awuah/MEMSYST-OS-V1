import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IContentService } from "./IContentService"
import type { LearningContent, ContentType } from "@/types"

const COLLECTION = "learningContent"

function toContent(id: string, data: Record<string, unknown>): LearningContent {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    courseId: data.courseId as string | undefined,
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    contentType: (data.contentType as ContentType) || "document",
    url: data.url as string | undefined,
    fileSize: data.fileSize as number | undefined,
    status: (data.status as "published" | "archived") || "published",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseContentService implements IContentService {
  private db = getFirestoreDb()

  async listContent(tenantId: string, params?: { status?: string; contentType?: ContentType; courseId?: string }): Promise<LearningContent[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.contentType) constraints.unshift(where("contentType", "==", params.contentType))
    if (params?.courseId) constraints.unshift(where("courseId", "==", params.courseId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toContent(d.id, d.data() as Record<string, unknown>))
  }

  async getContent(id: string): Promise<LearningContent | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toContent(snap.id, snap.data() as Record<string, unknown>)
  }

  async createContent(data: Omit<LearningContent, "id" | "createdAt" | "updatedAt">): Promise<LearningContent> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getContent(ref.id) as Promise<LearningContent>
  }

  async updateContent(id: string, data: Partial<LearningContent>): Promise<LearningContent> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getContent(id) as Promise<LearningContent>
  }

  async deleteContent(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
