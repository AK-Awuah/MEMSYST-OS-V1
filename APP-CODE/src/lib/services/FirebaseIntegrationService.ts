import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IIntegrationService } from "./IIntegrationService"
import type { APIKey, Webhook, WebhookDelivery, ThirdPartyIntegration, IntegrationAuditLog } from "@/types"

const API_KEYS_COLLECTION = "api_keys"
const WEBHOOKS_COLLECTION = "webhooks"
const DELIVERIES_COLLECTION = "webhook_deliveries"
const INTEGRATIONS_COLLECTION = "integrations"
const AUDIT_COLLECTION = "integration_audit_logs"

function toAPIKey(id: string, data: Record<string, unknown>): APIKey {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    keyPrefix: (data.keyPrefix as string) || "",
    keyHash: (data.keyHash as string) || "",
    permissions: (data.permissions as string[]) || [],
    allowedIPs: (data.allowedIPs as string[]) || [],
    rateLimit: (data.rateLimit as number) || 100,
    status: (data.status as APIKey["status"]) || "active",
    expiresAt: (data.expiresAt as string) || undefined,
    lastUsedAt: (data.lastUsedAt as string) || undefined,
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toWebhook(id: string, data: Record<string, unknown>): Webhook {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    url: (data.url as string) || "",
    events: (data.events as string[]) || [],
    secret: (data.secret as string) || "",
    headers: (data.headers as Record<string, string>) || {},
    retryCount: (data.retryCount as number) || 3,
    timeout: (data.timeout as number) || 5000,
    status: (data.status as Webhook["status"]) || "active",
    lastTriggeredAt: (data.lastTriggeredAt as string) || undefined,
    lastSuccessAt: (data.lastSuccessAt as string) || undefined,
    lastFailureAt: (data.lastFailureAt as string) || undefined,
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toWebhookDelivery(id: string, data: Record<string, unknown>): WebhookDelivery {
  return {
    id,
    webhookId: (data.webhookId as string) || "",
    tenantId: (data.tenantId as string) || "",
    event: (data.event as string) || "",
    payload: (data.payload as string) || "",
    responseStatus: (data.responseStatus as number) || undefined,
    responseBody: (data.responseBody as string) || undefined,
    duration: (data.duration as number) || 0,
    attemptNumber: (data.attemptNumber as number) || 1,
    status: (data.status as WebhookDelivery["status"]) || "success",
    errorMessage: (data.errorMessage as string) || undefined,
    deliveredAt: (data.deliveredAt as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

function toIntegration(id: string, data: Record<string, unknown>): ThirdPartyIntegration {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    integrationType: (data.integrationType as ThirdPartyIntegration["integrationType"]) || "custom",
    provider: (data.provider as string) || "",
    config: (data.config as Record<string, string>) || {},
    isEnabled: (data.isEnabled as boolean) || false,
    lastSyncAt: (data.lastSyncAt as string) || undefined,
    syncStatus: (data.syncStatus as ThirdPartyIntegration["syncStatus"]) || "idle",
    errorMessage: (data.errorMessage as string) || undefined,
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toIntegrationAuditLog(id: string, data: Record<string, unknown>): IntegrationAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as IntegrationAuditLog["action"]) || "api_key_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: (data.previousValue as string) || undefined,
    newValue: (data.newValue as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseIntegrationService implements IIntegrationService {
  private db = getFirestoreDb()

  async listAPIKeys(tenantId: string): Promise<APIKey[]> {
    const col = collection(this.db, API_KEYS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAPIKey(d.id, d.data() as Record<string, unknown>))
  }

  async getAPIKey(id: string): Promise<APIKey | null> {
    const snap = await getDoc(doc(this.db, API_KEYS_COLLECTION, id))
    if (!snap.exists()) return null
    return toAPIKey(snap.id, snap.data() as Record<string, unknown>)
  }

  async createAPIKey(data: Omit<APIKey, "id" | "keyPrefix" | "keyHash" | "createdAt" | "updatedAt">): Promise<APIKey> {
    const keyPrefix = `mst_${Math.random().toString(36).slice(2, 8)}`
    const docData = { ...data, keyPrefix, keyHash: `hash_${keyPrefix}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    const ref = await addDoc(collection(this.db, API_KEYS_COLLECTION), docData)
    return this.getAPIKey(ref.id) as Promise<APIKey>
  }

  async revokeAPIKey(id: string): Promise<void> {
    await updateDoc(doc(this.db, API_KEYS_COLLECTION, id), { status: "revoked", updatedAt: new Date().toISOString() })
  }

  async listWebhooks(tenantId: string): Promise<Webhook[]> {
    const col = collection(this.db, WEBHOOKS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toWebhook(d.id, d.data() as Record<string, unknown>))
  }

  async getWebhook(id: string): Promise<Webhook | null> {
    const snap = await getDoc(doc(this.db, WEBHOOKS_COLLECTION, id))
    if (!snap.exists()) return null
    return toWebhook(snap.id, snap.data() as Record<string, unknown>)
  }

  async createWebhook(data: Omit<Webhook, "id" | "createdAt" | "updatedAt">): Promise<Webhook> {
    const ref = await addDoc(collection(this.db, WEBHOOKS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getWebhook(ref.id) as Promise<Webhook>
  }

  async updateWebhook(id: string, data: Partial<Webhook>): Promise<void> {
    await updateDoc(doc(this.db, WEBHOOKS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async toggleWebhook(id: string): Promise<void> {
    const snap = await getDoc(doc(this.db, WEBHOOKS_COLLECTION, id))
    if (!snap.exists()) return
    const current = snap.data().status as string
    const newStatus = current === "active" ? "paused" : "active"
    await updateDoc(doc(this.db, WEBHOOKS_COLLECTION, id), { status: newStatus, updatedAt: new Date().toISOString() })
  }

  async listDeliveries(webhookId: string): Promise<WebhookDelivery[]> {
    const col = collection(this.db, DELIVERIES_COLLECTION)
    const snap = await getDocs(query(col, where("webhookId", "==", webhookId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toWebhookDelivery(d.id, d.data() as Record<string, unknown>))
  }

  async listIntegrations(tenantId: string): Promise<ThirdPartyIntegration[]> {
    const col = collection(this.db, INTEGRATIONS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toIntegration(d.id, d.data() as Record<string, unknown>))
  }

  async getIntegration(id: string): Promise<ThirdPartyIntegration | null> {
    const snap = await getDoc(doc(this.db, INTEGRATIONS_COLLECTION, id))
    if (!snap.exists()) return null
    return toIntegration(snap.id, snap.data() as Record<string, unknown>)
  }

  async createIntegration(data: Omit<ThirdPartyIntegration, "id" | "createdAt" | "updatedAt">): Promise<ThirdPartyIntegration> {
    const ref = await addDoc(collection(this.db, INTEGRATIONS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getIntegration(ref.id) as Promise<ThirdPartyIntegration>
  }

  async updateIntegration(id: string, data: Partial<ThirdPartyIntegration>): Promise<void> {
    await updateDoc(doc(this.db, INTEGRATIONS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async toggleIntegration(id: string): Promise<void> {
    const snap = await getDoc(doc(this.db, INTEGRATIONS_COLLECTION, id))
    if (!snap.exists()) return
    const current = snap.data().isEnabled as boolean
    await updateDoc(doc(this.db, INTEGRATIONS_COLLECTION, id), { isEnabled: !current, updatedAt: new Date().toISOString() })
  }

  async syncIntegration(id: string): Promise<void> {
    await updateDoc(doc(this.db, INTEGRATIONS_COLLECTION, id), { syncStatus: "syncing", updatedAt: new Date().toISOString() })
    await updateDoc(doc(this.db, INTEGRATIONS_COLLECTION, id), { syncStatus: "success", lastSyncAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }

  async getAuditLogs(tenantId: string): Promise<IntegrationAuditLog[]> {
    const col = collection(this.db, AUDIT_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toIntegrationAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
