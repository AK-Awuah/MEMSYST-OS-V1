import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IAutomationService } from "./IAutomationService"
import type { AutomationRule, AutomationTriggerEvent, AutomationActionType, NotificationChannel } from "@/types"

const COLLECTION = "automationRules"

function toAutomationRule(id: string, data: Record<string, unknown>): AutomationRule {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    triggerEvent: (data.triggerEvent as AutomationTriggerEvent) || "new_submission",
    actionType: (data.actionType as AutomationActionType) || "send_email",
    templateId: data.templateId as string | undefined,
    channel: (data.channel as NotificationChannel) || "email",
    delayMinutes: (data.delayMinutes as number) || 0,
    isActive: (data.isActive as boolean) ?? true,
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseAutomationService implements IAutomationService {
  private db = getFirestoreDb()

  async createRule(tenantId: string, data: Omit<AutomationRule, "id" | "createdAt" | "updatedAt">): Promise<AutomationRule> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = { ...data, tenantId, createdAt: now, updatedAt: now }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async updateRule(tenantId: string, id: string, data: Partial<AutomationRule>): Promise<AutomationRule> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Automation rule ${id} not found`)
    const now = new Date().toISOString()
    await updateDoc(ref, { ...data, updatedAt: now })
    const updated = await getDoc(ref)
    return toAutomationRule(updated.id, updated.data() as Record<string, unknown>)
  }

  async toggleRule(tenantId: string, id: string): Promise<AutomationRule> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Automation rule ${id} not found`)
    const current = snap.data() as Record<string, unknown>
    const now = new Date().toISOString()
    await updateDoc(ref, { isActive: !(current.isActive as boolean), updatedAt: now })
    const updated = await getDoc(ref)
    return toAutomationRule(updated.id, updated.data() as Record<string, unknown>)
  }

  async deleteRule(tenantId: string, id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }

  async listRules(tenantId: string): Promise<AutomationRule[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAutomationRule(d.id, d.data() as Record<string, unknown>))
  }

  async getRuleById(id: string): Promise<AutomationRule | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toAutomationRule(snap.id, snap.data() as Record<string, unknown>)
  }

  async processTrigger(event: AutomationTriggerEvent, data: Record<string, unknown>): Promise<void> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("triggerEvent", "==", event), where("isActive", "==", true)))
    const now = new Date().toISOString()
    for (const ruleDoc of snap.docs) {
      const logCol = collection(this.db, "automationLogs")
      await addDoc(logCol, {
        ruleId: ruleDoc.id,
        event,
        data,
        processedAt: now,
      })
    }
  }
}
