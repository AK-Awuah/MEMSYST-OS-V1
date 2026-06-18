import {
  collection, getDocs, getDoc, doc, addDoc, updateDoc,
  query, where, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICommunicationPreferenceService } from "./ICommunicationPreferenceService"
import type { CommunicationPreference, CommunicationChannel } from "@/types"

const COLLECTION = "communicationPreferences"

function toCommunicationPreference(id: string, data: Record<string, unknown>): CommunicationPreference {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    userId: (data.userId as string) || "",
    email: (data.email as boolean) || true,
    sms: (data.sms as boolean) || true,
    push: (data.push as boolean) || true,
    inApp: (data.inApp as boolean) || true,
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseCommunicationPreferenceService implements ICommunicationPreferenceService {
  private db = getFirestoreDb()

  async getPreferences(tenantId: string, userId: string): Promise<CommunicationPreference | null> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("tenantId", "==", tenantId),
        where("userId", "==", userId)
      )
    )
    if (snap.empty) return null
    const d = snap.docs[0]
    return toCommunicationPreference(d.id, d.data() as Record<string, unknown>)
  }

  async updatePreferences(tenantId: string, userId: string, data: Partial<CommunicationPreference>): Promise<CommunicationPreference> {
    const existing = await this.getPreferences(tenantId, userId)
    const now = new Date().toISOString()
    if (existing) {
      const ref = doc(this.db, COLLECTION, existing.id)
      await updateDoc(ref, { ...data, updatedAt: now })
      const updated = await getDoc(ref)
      return toCommunicationPreference(updated.id, updated.data() as Record<string, unknown>)
    } else {
      const payload = {
        tenantId,
        userId,
        email: true,
        sms: true,
        push: true,
        inApp: true,
        ...data,
        createdAt: now,
        updatedAt: now,
      }
      const ref = await addDoc(collection(this.db, COLLECTION), payload)
      return { id: ref.id, ...payload }
    }
  }

  async canSendTo(tenantId: string, userId: string, channel: CommunicationChannel): Promise<boolean> {
    const prefs = await this.getPreferences(tenantId, userId)
    if (!prefs) return true
    const channelPref = (prefs as unknown as Record<string, unknown>)[channel] as boolean | undefined
    return channelPref !== false
  }

  async getAllPreferences(tenantId: string): Promise<CommunicationPreference[]> {
    const snap = await getDocs(query(collection(this.db, COLLECTION), where("tenantId", "==", tenantId)))
    return snap.docs.map((d) => toCommunicationPreference(d.id, d.data() as Record<string, unknown>))
  }
}
