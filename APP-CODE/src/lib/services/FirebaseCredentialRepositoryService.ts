import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICredentialRepositoryService } from "./ICredentialRepositoryService"
import type { CredentialFile } from "@/types"

const COLLECTION = "credentialFiles"

function toCredentialFile(id: string, data: Record<string, unknown>): CredentialFile {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    credentialId: (data.credentialId as string) || "",
    credentialType: (data.credentialType as CredentialFile["credentialType"]) || "id_card",
    fileName: (data.fileName as string) || "",
    fileType: (data.fileType as string) || "",
    fileSize: (data.fileSize as number) || 0,
    url: (data.url as string) || "",
    uploadedAt: data.uploadedAt instanceof Timestamp
      ? data.uploadedAt.toDate().toISOString()
      : (data.uploadedAt as string) || "",
  }
}

export class FirebaseCredentialRepositoryService implements ICredentialRepositoryService {
  private db = getFirestoreDb()

  async listFiles(tenantId: string, params?: { credentialId?: string; credentialType?: string }): Promise<CredentialFile[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("uploadedAt", "desc")]
    if (params?.credentialId) constraints.unshift(where("credentialId", "==", params.credentialId))
    if (params?.credentialType) constraints.unshift(where("credentialType", "==", params.credentialType))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toCredentialFile(d.id, d.data() as Record<string, unknown>))
  }

  async getFile(id: string): Promise<CredentialFile | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toCredentialFile(snap.id, snap.data() as Record<string, unknown>)
  }

  async uploadFile(data: Omit<CredentialFile, "id" | "uploadedAt">): Promise<CredentialFile> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      uploadedAt: new Date().toISOString(),
    })
    return this.getFile(ref.id) as Promise<CredentialFile>
  }

  async deleteFile(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }

  async searchFiles(tenantId: string, queryStr: string): Promise<CredentialFile[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("uploadedAt", "desc")))
    const lowerQuery = queryStr.toLowerCase()
    return snap.docs
      .map((d) => toCredentialFile(d.id, d.data() as Record<string, unknown>))
      .filter((f) =>
        f.fileName.toLowerCase().includes(lowerQuery) ||
        f.fileType.toLowerCase().includes(lowerQuery) ||
        f.credentialId.toLowerCase().includes(lowerQuery)
      )
  }
}
