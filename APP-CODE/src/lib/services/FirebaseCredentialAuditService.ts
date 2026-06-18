import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICredentialAuditService } from "./ICredentialAuditService"
import type { CredentialAuditLog, CredentialAuditAction } from "@/types"

const COLLECTION = "credentialAuditLogs"

function toCredentialAuditLog(id: string, data: Record<string, unknown>): CredentialAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    credentialId: (data.credentialId as string) || "",
    credentialType: (data.credentialType as CredentialAuditLog["credentialType"]) || "id_card",
    action: (data.action as CredentialAuditAction) || "credential_generated",
    actor: (data.actor as string) || "",
    before: data.before as string | undefined,
    after: data.after as string | undefined,
    details: data.details as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
  }
}

export class FirebaseCredentialAuditService implements ICredentialAuditService {
  private db = getFirestoreDb()

  async listAuditLogs(tenantId: string, params?: { action?: CredentialAuditAction; credentialType?: string }): Promise<CredentialAuditLog[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.action) constraints.splice(1, 0, where("action", "==", params.action))
    if (params?.credentialType) constraints.splice(1, 0, where("credentialType", "==", params.credentialType))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toCredentialAuditLog(d.id, d.data() as Record<string, unknown>))
  }

  async getAuditLog(id: string): Promise<CredentialAuditLog | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toCredentialAuditLog(snap.id, snap.data() as Record<string, unknown>)
  }

  async logAction(data: Omit<CredentialAuditLog, "id" | "createdAt">): Promise<CredentialAuditLog> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    })
    return this.getAuditLog(ref.id) as Promise<CredentialAuditLog>
  }

  async getCredentialHistory(credentialId: string): Promise<CredentialAuditLog[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("credentialId", "==", credentialId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toCredentialAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
