import { getDoc, doc, setDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IFinancialSettingsService } from "./IFinancialSettingsService"
import type { FinancialSettings } from "@/types"

const COLLECTION = "financialSettings"

function toSettings(id: string, data: Record<string, unknown>): FinancialSettings {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    currency: (data.currency as string) || "GHS",
    withdrawalFeePercent: (data.withdrawalFeePercent as number) || 5,
    maxWithdrawalPercent: (data.maxWithdrawalPercent as number) || 80,
    monthlyWithdrawalLimit: (data.monthlyWithdrawalLimit as number) || 1,
    messagingCosts: (data.messagingCosts as FinancialSettings["messagingCosts"]) || { emailCost: 0.05, smsCost: 0.30, pushCost: 0.02 },
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseFinancialSettingsService implements IFinancialSettingsService {
  private db = getFirestoreDb()

  async getSettings(tenantId: string): Promise<FinancialSettings | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, tenantId))
    if (!snap.exists()) return null
    return toSettings(snap.id, snap.data() as Record<string, unknown>)
  }

  async updateSettings(tenantId: string, data: Partial<FinancialSettings>): Promise<FinancialSettings> {
    const ref = doc(this.db, COLLECTION, tenantId)
    const updates = { ...data, updatedAt: new Date().toISOString() }
    await setDoc(ref, updates, { merge: true })
    const snap = await getDoc(ref)
    return toSettings(snap.id, snap.data() as Record<string, unknown>)
  }

  getDefaultSettings(): FinancialSettings {
    return {
      id: "fin-set-default",
      tenantId: "default",
      currency: "GHS",
      withdrawalFeePercent: 5,
      maxWithdrawalPercent: 80,
      monthlyWithdrawalLimit: 1,
      messagingCosts: { emailCost: 0.05, smsCost: 0.30, pushCost: 0.02 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}
