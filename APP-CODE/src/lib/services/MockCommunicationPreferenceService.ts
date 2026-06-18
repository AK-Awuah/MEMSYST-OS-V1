import { delay } from "./shared-store"
import { mockCommunicationPreferences } from "./mock-data"
import type { CommunicationPreference, CommunicationChannel } from "@/types"
import type { ICommunicationPreferenceService } from "./ICommunicationPreferenceService"

export class MockCommunicationPreferenceService implements ICommunicationPreferenceService {
  private items = [...mockCommunicationPreferences]

  async getPreferences(tenantId: string, userId: string): Promise<CommunicationPreference | null> {
    await delay(100)
    return this.items.find((p) => p.tenantId === tenantId && p.userId === userId) || null
  }

  async updatePreferences(tenantId: string, userId: string, data: Partial<CommunicationPreference>): Promise<CommunicationPreference> {
    await delay(200)
    let pref = this.items.find((p) => p.tenantId === tenantId && p.userId === userId)
    if (pref) {
      Object.assign(pref, data, { updatedAt: new Date().toISOString() })
      return pref
    }
    const newPref: CommunicationPreference = {
      id: `cp-${Date.now()}`,
      tenantId,
      userId,
      memberId: data.memberId || "",
      email: data.email ?? true,
      sms: data.sms ?? true,
      push: data.push ?? true,
      inApp: data.inApp ?? true,
      emailAddress: data.emailAddress || "",
      phoneNumber: data.phoneNumber || "",
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(newPref)
    return newPref
  }

  async canSendTo(tenantId: string, userId: string, channel: CommunicationChannel): Promise<boolean> {
    await delay(100)
    const pref = this.items.find((p) => p.tenantId === tenantId && p.userId === userId)
    if (!pref) return true
    const channelKey = channel === "in_app" ? "inApp" : channel
    return pref[channelKey] === true
  }

  async getAllPreferences(tenantId: string): Promise<CommunicationPreference[]> {
    await delay(200)
    return this.items.filter((p) => p.tenantId === tenantId)
  }
}
