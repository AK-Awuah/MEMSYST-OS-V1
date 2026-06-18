import type { CommunicationPreference, CommunicationChannel } from "@/types"

export interface ICommunicationPreferenceService {
  getPreferences(tenantId: string, userId: string): Promise<CommunicationPreference | null>
  updatePreferences(tenantId: string, userId: string, data: Partial<CommunicationPreference>): Promise<CommunicationPreference>
  canSendTo(tenantId: string, userId: string, channel: CommunicationChannel): Promise<boolean>
  getAllPreferences(tenantId: string): Promise<CommunicationPreference[]>
}
