import type { IMobileService } from "./IMobileService"
import type { PWAConfig, OfflineCacheRule, MobileAppVersion, MobileAuditLog } from "@/types"
import { delay, pushAuditLog } from "./shared-store"

const pwaConfigs: PWAConfig[] = []
const cacheRules: OfflineCacheRule[] = []
const versions: MobileAppVersion[] = []

export class MockMobileService implements IMobileService {
  async getPWAConfig(tenantId: string): Promise<PWAConfig | null> {
    await delay(100)
    return pwaConfigs.find((c) => c.tenantId === tenantId) || null
  }

  async updatePWAConfig(tenantId: string, data: Partial<PWAConfig>): Promise<PWAConfig> {
    await delay(200)
    const idx = pwaConfigs.findIndex((c) => c.tenantId === tenantId)
    const now = new Date().toISOString()
    if (idx === -1) {
      const config: PWAConfig = {
        id: `pwa-${Date.now()}`,
        tenantId,
        name: (data.name as string) || "",
        shortName: (data.shortName as string) || "",
        description: (data.description as string) || "",
        backgroundColor: (data.backgroundColor as string) || "#ffffff",
        themeColor: (data.themeColor as string) || "#000000",
        icon192: (data.icon192 as string) || "",
        icon512: (data.icon512 as string) || "",
        splashScreen: (data.splashScreen as string) || "",
        display: (data.display as PWAConfig["display"]) || "standalone",
        orientation: (data.orientation as PWAConfig["orientation"]) || "portrait",
        offlinePages: (data.offlinePages as string[]) || [],
        cacheStrategy: (data.cacheStrategy as PWAConfig["cacheStrategy"]) || "network_first",
        pushEnabled: (data.pushEnabled as boolean) || false,
        lastBuilt: "",
        createdAt: now,
        updatedAt: now,
      }
      pwaConfigs.push(config)
      return config
    }
    pwaConfigs[idx] = { ...pwaConfigs[idx], ...data, updatedAt: now }
    return pwaConfigs[idx]
  }

  async buildPWA(tenantId: string): Promise<PWAConfig> {
    await delay(500)
    const idx = pwaConfigs.findIndex((c) => c.tenantId === tenantId)
    const now = new Date().toISOString()
    if (idx === -1) {
      const config: PWAConfig = {
        id: `pwa-${Date.now()}`,
        tenantId,
        name: "",
        shortName: "",
        description: "",
        backgroundColor: "#ffffff",
        themeColor: "#000000",
        icon192: "",
        icon512: "",
        splashScreen: "",
        display: "standalone",
        orientation: "portrait",
        offlinePages: [],
        cacheStrategy: "network_first",
        pushEnabled: false,
        lastBuilt: now,
        createdAt: now,
        updatedAt: now,
      }
      pwaConfigs.push(config)
      pushAuditLog({ actor: "System", role: "system", action: "BUILD", module: "MOBILE", recordType: "PWAConfig", recordId: config.id, newValue: "PWA built", ipAddress: "127.0.0.1" })
      return config
    }
    pwaConfigs[idx] = { ...pwaConfigs[idx], lastBuilt: now, updatedAt: now }
    pushAuditLog({ actor: "System", role: "system", action: "BUILD", module: "MOBILE", recordType: "PWAConfig", recordId: pwaConfigs[idx].id, newValue: "PWA rebuilt", ipAddress: "127.0.0.1" })
    return pwaConfigs[idx]
  }

  async listCacheRules(tenantId: string): Promise<OfflineCacheRule[]> {
    await delay(200)
    return cacheRules.filter((r) => r.tenantId === tenantId)
  }

  async getCacheRule(id: string): Promise<OfflineCacheRule | null> {
    await delay(100)
    return cacheRules.find((r) => r.id === id) || null
  }

  async createCacheRule(tenantId: string, data: Omit<OfflineCacheRule, "id" | "createdAt" | "updatedAt">): Promise<OfflineCacheRule> {
    await delay(200)
    const now = new Date().toISOString()
    const rule: OfflineCacheRule = { ...data, id: `cr-${Date.now()}`, tenantId, createdAt: now, updatedAt: now }
    cacheRules.push(rule)
    return rule
  }

  async updateCacheRule(id: string, data: Partial<OfflineCacheRule>): Promise<void> {
    await delay(150)
    const idx = cacheRules.findIndex((r) => r.id === id)
    if (idx !== -1) cacheRules[idx] = { ...cacheRules[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async listVersions(tenantId: string): Promise<MobileAppVersion[]> {
    await delay(200)
    return versions.filter((v) => v.tenantId === tenantId)
  }

  async getVersion(id: string): Promise<MobileAppVersion | null> {
    await delay(100)
    return versions.find((v) => v.id === id) || null
  }

  async createVersion(tenantId: string, data: Omit<MobileAppVersion, "id" | "createdAt">): Promise<MobileAppVersion> {
    await delay(200)
    const version: MobileAppVersion = { ...data, id: `ver-${Date.now()}`, tenantId, createdAt: new Date().toISOString() }
    versions.push(version)
    return version
  }

  async deprecateVersion(id: string): Promise<void> {
    await delay(150)
    const idx = versions.findIndex((v) => v.id === id)
    if (idx !== -1) versions[idx] = { ...versions[idx], status: "deprecated" }
  }

  async getAuditLogs(tenantId: string): Promise<MobileAuditLog[]> {
    await delay(100)
    return []
  }
}
