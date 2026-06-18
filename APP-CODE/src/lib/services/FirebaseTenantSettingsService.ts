import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITenantSettingsService } from "./ITenantSettingsService"
import type { TenantSettings } from "@/types"

const COLLECTION = "tenantSettings"

function toSettings(id: string, data: Record<string, unknown>): TenantSettings {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    general: (data.general as Record<string, unknown>) || {},
    branding: (data.branding as Record<string, unknown>) || {},
    governance: (data.governance as Record<string, unknown>) || {},
    membership: (data.membership as TenantSettings["membership"]) || { categories: [], registrationRequirements: [], approvalRules: [], renewalRules: [] },
    finance: (data.finance as Record<string, unknown>) || {},
    notifications: (data.notifications as Record<string, unknown>) || {},
    training: (data.training as Record<string, unknown>) || {},
    marketplace: (data.marketplace as Record<string, unknown>) || {},
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseTenantSettingsService implements ITenantSettingsService {
  private db = getFirestoreDb()

  async getSettings(tenantId: string): Promise<TenantSettings | null> {
    const col = collection(this.db, COLLECTION)
    const q = query(col, where("tenantId", "==", tenantId))
    const snap = await getDocs(q)
    if (snap.empty) return null
    return toSettings(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>)
  }

  async updateSettings(tenantId: string, data: Partial<TenantSettings>): Promise<void> {
    const col = collection(this.db, COLLECTION)
    const q = query(col, where("tenantId", "==", tenantId))
    const snap = await getDocs(q)
    const now = new Date().toISOString()
    if (snap.empty) {
      await addDoc(col, { tenantId, ...data, createdAt: now, updatedAt: now })
    } else {
      const ref = doc(this.db, COLLECTION, snap.docs[0].id)
      await updateDoc(ref, { ...data, updatedAt: now })
    }
  }

  async getMembershipConfig(tenantId: string): Promise<TenantSettings["membership"]> {
    const col = collection(this.db, COLLECTION)
    const q = query(col, where("tenantId", "==", tenantId))
    const snap = await getDocs(q)
    if (snap.empty) return { categories: [], registrationRequirements: [], approvalRules: [], renewalRules: [] }
    const d = snap.docs[0].data() as { membership?: TenantSettings["membership"] }
    return d.membership || { categories: [], registrationRequirements: [], approvalRules: [], renewalRules: [] }
  }

  async updateMembershipConfig(tenantId: string, data: Partial<TenantSettings["membership"]>): Promise<void> {
    const col = collection(this.db, COLLECTION)
    const q = query(col, where("tenantId", "==", tenantId))
    const snap = await getDocs(q)
    const now = new Date().toISOString()
    if (snap.empty) {
      await addDoc(col, {
        tenantId,
        membership: data,
        general: {},
        branding: {},
        governance: {},
        finance: {},
        notifications: {},
        training: {},
        marketplace: {},
        createdAt: now,
        updatedAt: now,
      })
    } else {
      const ref = doc(this.db, COLLECTION, snap.docs[0].id)
      const existing = (await getDoc(ref)).data() as { membership?: TenantSettings["membership"] }
      await updateDoc(ref, {
        membership: { ...(existing?.membership || {}), ...data },
        updatedAt: now,
      })
    }
  }
}
