import type { ApprovalRecord, MemberApprovalStatus } from "@/types"

export interface IMemberApprovalService {
  getApprovalRecord(memberId: string): Promise<ApprovalRecord | null>
  listPendingApprovals(tenantId: string, approverLevel?: string): Promise<ApprovalRecord[]>
  approveStage(recordId: string, stageOrder: number, approverId: string, comment?: string): Promise<void>
  rejectStage(recordId: string, stageOrder: number, approverId: string, comment?: string): Promise<void>
  updateMemberApprovalStatus(memberId: string, status: MemberApprovalStatus): Promise<void>
}
