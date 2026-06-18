import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, updateDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICredentialSettingsService } from "./ICredentialSettingsService"
import type { CredentialSettings } from "@/types"

const COLLECTION = "credentialSettings"

function toCredentialSettings(id: string, data: Record<string, unknown>): CredentialSettings {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    idCardReprintFee: (data.idCardReprintFee as number) || 0,
    certificateReprintFee: (data.certificateReprintFee as number) || 0,
    idCardExpiryMonths: (data.idCardExpiryMonths as number) || 12,
    certificateExpiryMonths: (data.certificateExpiryMonths as number) || 12,
    autoGenerateOnApproval: (data.autoGenerateOnApproval as boolean) || false,
    autoGenerateOnUpgrade: (data.autoGenerateOnUpgrade as boolean) || false,
    verificationRequiresAuth: (data.verificationRequiresAuth as boolean) || false,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseCredentialSettingsService implements ICredentialSettingsService {
  private db = getFirestoreDb()

  async getSettings(tenantId: string): Promise<CredentialSettings | null> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    if (snap.empty) return null
    return toCredentialSettings(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>)
  }

  async updateSettings(tenantId: string, data: Partial<CredentialSettings>): Promise<CredentialSettings> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    if (snap.empty) throw new Error("Settings not found")
    const ref = doc(this.db, COLLECTION, snap.docs[0].id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
    return this.getSettings(tenantId) as Promise<CredentialSettings>
  }

  async initializeSettings(tenantId: string): Promise<CredentialSettings> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    if (!snap.empty) {
      return toCredentialSettings(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>)
    }
    const ref = await addDoc(col, {
      tenantId,
      idCardReprintFee: 0,
      certificateReprintFee: 0,
      idCardExpiryMonths: 12,
      certificateExpiryMonths: 12,
      autoGenerateOnApproval: false,
      autoGenerateOnUpgrade: false,
      verificationRequiresAuth: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getSettings(tenantId) as Promise<CredentialSettings>
  }
}
