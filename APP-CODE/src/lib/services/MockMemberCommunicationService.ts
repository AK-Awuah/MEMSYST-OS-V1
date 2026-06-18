import type { IMemberCommunicationService } from "./IMemberCommunicationService"
import type { MemberCommunication } from "@/types"
import { mockMemberCommunications } from "./mock-data"
import { delay } from "./shared-store"

let prefs = [...mockMemberCommunications]

export class MockMemberCommunicationService implements IMemberCommunicationService {
  async getPreferences(memberId: string): Promise<MemberCommunication | null> {
    await delay(100)
    return prefs.find((p) => p.memberId === memberId) || null
  }

  async updatePreferences(memberId: string, data: Partial<MemberCommunication>): Promise<void> {
    await delay(150)
    const idx = prefs.findIndex((p) => p.memberId === memberId)
    if (idx !== -1) {
      prefs[idx] = { ...prefs[idx], ...data, updatedAt: new Date().toISOString() }
    } else {
      prefs.push({
        id: `mc-${Date.now()}`,
        tenantId: "",
        memberId,
        email: true,
        sms: false,
        push: false,
        inApp: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as MemberCommunication)
    }
  }
}
