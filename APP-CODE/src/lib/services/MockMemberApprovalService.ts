import type { IMemberApprovalService } from "./IMemberApprovalService"
import type { ApprovalRecord, MemberApprovalStatus } from "@/types"
import { mockApprovalRecords } from "./mock-data"
import { delay } from "./shared-store"

const approvals = [...mockApprovalRecords]

export class MockMemberApprovalService implements IMemberApprovalService {
  async getApprovalRecord(memberId: string): Promise<ApprovalRecord | null> {
    await delay(100)
    return approvals.find((a) => a.memberId === memberId) || null
  }

  async listPendingApprovals(tenantId: string, _approverLevel?: string): Promise<ApprovalRecord[]> {
    await delay(200)
    return approvals.filter((a) => a.tenantId === tenantId && a.status === "in_progress")
  }

  async approveStage(recordId: string, stageOrder: number, approverId: string, comment?: string): Promise<void> {
    await delay(200)
    const rec = approvals.find((a) => a.id === recordId)
    if (!rec) return
    const stage = rec.stages.find((s) => s.order === stageOrder)
    if (!stage) return
    stage.status = "approved"
    stage.approverId = approverId
    stage.comment = comment
    stage.decidedAt = new Date().toISOString()
    if (stageOrder >= rec.stages.length) {
      rec.status = "approved"
    } else {
      rec.currentStage = stageOrder + 1
    }
    rec.updatedAt = new Date().toISOString()
  }

  async rejectStage(recordId: string, stageOrder: number, approverId: string, comment?: string): Promise<void> {
    await delay(200)
    const rec = approvals.find((a) => a.id === recordId)
    if (!rec) return
    const stage = rec.stages.find((s) => s.order === stageOrder)
    if (!stage) return
    stage.status = "rejected"
    stage.approverId = approverId
    stage.comment = comment
    stage.decidedAt = new Date().toISOString()
    rec.status = "rejected"
    rec.updatedAt = new Date().toISOString()
  }

  async updateMemberApprovalStatus(_memberId: string, _status: MemberApprovalStatus): Promise<void> {
    await delay(100)
  }
}
