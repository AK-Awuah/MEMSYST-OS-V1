import type { Apprentice, TransferRecord, UpgradeRequest, ApprenticeStatus, Member } from "@/types"

export interface IApprenticeService {
  listApprentices(tenantId: string, params?: { status?: string; parentMemberId?: string }): Promise<Apprentice[]>
  getApprentice(id: string): Promise<Apprentice | null>
  createApprentice(data: Omit<Apprentice, "id" | "createdAt" | "updatedAt">): Promise<Apprentice>
  updateApprentice(id: string, data: Partial<Apprentice>): Promise<void>
  updateApprenticeStatus(id: string, status: ApprenticeStatus): Promise<void>
  getApprenticesByMember(memberId: string): Promise<Apprentice[]>
  // Transfer
  requestTransfer(apprenticeId: string, newMemberId: string, reason: string, requestedBy: string): Promise<TransferRecord>
  approveTransfer(transferId: string, approver: string): Promise<void>
  rejectTransfer(transferId: string, approver: string): Promise<void>
  getTransferHistory(apprenticeId: string): Promise<TransferRecord[]>
  // Upgrade
  requestUpgrade(apprenticeId: string, requestedBy: string): Promise<UpgradeRequest>
  approveUpgrade(upgradeId: string, reviewedBy: string, notes?: string): Promise<Member>
  rejectUpgrade(upgradeId: string, reviewedBy: string, notes?: string): Promise<void>
  getUpgradeRequests(tenantId: string, status?: string): Promise<UpgradeRequest[]>
}
