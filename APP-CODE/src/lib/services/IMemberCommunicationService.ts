import type { MemberCommunication } from "@/types"

export interface IMemberCommunicationService {
  getPreferences(memberId: string): Promise<MemberCommunication | null>
  updatePreferences(memberId: string, data: Partial<MemberCommunication>): Promise<void>
}
