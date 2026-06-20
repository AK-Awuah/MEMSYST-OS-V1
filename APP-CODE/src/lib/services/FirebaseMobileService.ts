import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp, deleteDoc } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMobileService } from "./IMobileService"
import type { PWAConfig, OfflineCacheRule, MobileAppVersion, MobileAuditLog } from "@/types"

const PWA_COLLECTION = "pwa_configs"
const CACHE_RULES_COLLECTION = "offline_cache_rules"
const VERSIONS_COLLECTION = "mobile_versions"
const AUDIT_COLLECTION = "mobile_audit_logs"

function toPWAConfig(id: string, data: Record<string, unknown>): PWAConfig {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    shortName: (data.shortName as string) || "",
    description: (data.description as string) || "",
    backgroundColor: (data.backgroundColor as string) || "",
    themeColor: (data.themeColor as string) || "",
    icon192: (data.icon192 as string) || "",
    icon512: (data.icon512 as string) || "",
    splashScreen: (data.splashScreen as string) || "",
    display: (data.display as PWAConfig["display"]) || "standalone",
    orientation: (data.orientation as PWAConfig["orientation"]) || "portrait",
    offlinePages: (data.offlinePages as string[]) || [],
    cacheStrategy: (data.cacheStrategy as PWAConfig["cacheStrategy"]) || "network_first",
    pushEnabled: (data.pushEnabled as boolean) || false,
    lastBuilt: (data.lastBuilt as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toCacheRule(id: string, data: Record<string, unknown>): OfflineCacheRule {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    urlPattern: (data.urlPattern as string) || "",
    cacheStrategy: (data.cacheStrategy as OfflineCacheRule["cacheStrategy"]) || "network_first",
    maxAge: (data.maxAge as number) || 0,
    maxEntries: (data.maxEntries as number) || 0,
    prioritizePages: (data.prioritizePages as string[]) || [],
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toVersion(id: string, data: Record<string, unknown>): MobileAppVersion {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    platform: (data.platform as MobileAppVersion["platform"]) || "pwa",
    version: (data.version as string) || "",
    buildNumber: (data.buildNumber as string) || "",
    releaseNotes: (data.releaseNotes as string) || "",
    minAppVersion: (data.minAppVersion as string) || "",
    downloadUrl: (data.downloadUrl as string) || "",
    isForced: (data.isForced as boolean) || false,
    status: (data.status as MobileAppVersion["status"]) || "development",
    releasedAt: (data.releasedAt as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

function toAuditLog(id: string, data: Record<string, unknown>): MobileAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as MobileAuditLog["action"]) || "pwa_built",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: data.previousValue as string | undefined,
    newValue: data.newValue as string | undefined,
    details: data.details as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseMobileService implements IMobileService {
  private db = getFirestoreDb()

  async getPWAConfig(tenantId: string): Promise<PWAConfig | null> {
    const col = collection(this.db, PWA_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    if (snap.empty) return null
    const d = snap.docs[0]
    return toPWAConfig(d.id, d.data() as Record<string, unknown>)
  }

  async updatePWAConfig(tenantId: string, data: Partial<PWAConfig>): Promise<PWAConfig> {
    const col = collection(this.db, PWA_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    const now = new Date().toISOString()
    if (snap.empty) {
      const ref = await addDoc(col, { tenantId, ...data, lastBuilt: "", createdAt: now, updatedAt: now })
      const created = await getDoc(ref)
      return toPWAConfig(created.id, created.data() as Record<string, unknown>)
    }
    const ref = snap.docs[0].ref
    await updateDoc(ref, { ...data, updatedAt: now })
    const updated = await getDoc(ref)
    return toPWAConfig(updated.id, updated.data() as Record<string, unknown>)
  }

  async buildPWA(tenantId: string): Promise<PWAConfig> {
    const col = collection(this.db, PWA_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    const now = new Date().toISOString()
    if (snap.empty) {
      const ref = await addDoc(col, { tenantId, name: "", shortName: "", description: "", backgroundColor: "#ffffff", themeColor: "#000000", icon192: "", icon512: "", splashScreen: "", display: "standalone", orientation: "portrait", offlinePages: [], cacheStrategy: "network_first", pushEnabled: false, lastBuilt: now, createdAt: now, updatedAt: now })
      const created = await getDoc(ref)
      return toPWAConfig(created.id, created.data() as Record<string, unknown>)
    }
    const ref = snap.docs[0].ref
    await updateDoc(ref, { lastBuilt: now, updatedAt: now })
    const updated = await getDoc(ref)
    return toPWAConfig(updated.id, updated.data() as Record<string, unknown>)
  }

  async listCacheRules(tenantId: string): Promise<OfflineCacheRule[]> {
    const col = collection(this.db, CACHE_RULES_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toCacheRule(d.id, d.data() as Record<string, unknown>))
  }

  async getCacheRule(id: string): Promise<OfflineCacheRule | null> {
    const snap = await getDoc(doc(this.db, CACHE_RULES_COLLECTION, id))
    if (!snap.exists()) return null
    return toCacheRule(snap.id, snap.data() as Record<string, unknown>)
  }

  async createCacheRule(tenantId: string, data: Omit<OfflineCacheRule, "id" | "createdAt" | "updatedAt">): Promise<OfflineCacheRule> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, CACHE_RULES_COLLECTION), { ...data, tenantId, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toCacheRule(created.id, created.data() as Record<string, unknown>)
  }

  async updateCacheRule(id: string, data: Partial<OfflineCacheRule>): Promise<void> {
    await updateDoc(doc(this.db, CACHE_RULES_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async listVersions(tenantId: string): Promise<MobileAppVersion[]> {
    const col = collection(this.db, VERSIONS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toVersion(d.id, d.data() as Record<string, unknown>))
  }

  async getVersion(id: string): Promise<MobileAppVersion | null> {
    const snap = await getDoc(doc(this.db, VERSIONS_COLLECTION, id))
    if (!snap.exists()) return null
    return toVersion(snap.id, snap.data() as Record<string, unknown>)
  }

  async createVersion(tenantId: string, data: Omit<MobileAppVersion, "id" | "createdAt">): Promise<MobileAppVersion> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, VERSIONS_COLLECTION), { ...data, tenantId, createdAt: now })
    const created = await getDoc(ref)
    return toVersion(created.id, created.data() as Record<string, unknown>)
  }

  async deprecateVersion(id: string): Promise<void> {
    await updateDoc(doc(this.db, VERSIONS_COLLECTION, id), { status: "deprecated" })
  }

  async getAuditLogs(tenantId: string): Promise<MobileAuditLog[]> {
    const col = collection(this.db, AUDIT_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
