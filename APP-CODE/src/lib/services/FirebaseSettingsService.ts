import { doc, getDoc, setDoc } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ISettingsService, PlatformSettings } from "./ISettingsService"

const SETTINGS_ID = "platform"
const COLLECTION = "platformSettings"

const defaults: PlatformSettings = {
  organizationName: "MemSyst",
  supportEmail: "support@memsyst.com",
  notificationEmail: "notifications@memsyst.com",
  autoAssignLeads: true,
  leadAssignmentRule: "round-robin",
  defaultLeadStatus: "new",
  crmDefaultProbability: "10",
  requireApprovalForTenants: true,
  auditRetentionDays: "365",
  emailNotifications: true,
  leadNotifications: true,
  crmNotifications: true,
  auditDigest: false,
}

export class FirebaseSettingsService implements ISettingsService {
  private db = getFirestoreDb()

  async getSettings(): Promise<PlatformSettings | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, SETTINGS_ID))
    if (!snap.exists()) return null
    return snap.data() as PlatformSettings
  }

  async updateSettings(data: Partial<PlatformSettings>): Promise<void> {
    const existing = await this.getSettings()
    const merged = { ...defaults, ...existing, ...data }
    await setDoc(doc(this.db, COLLECTION, SETTINGS_ID), merged)
  }
}
