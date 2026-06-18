import { collection, addDoc, getDocs, getDoc, doc, query, where, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMemberApprovalService } from "./IMemberApprovalService"
import type { ApprovalRecord, MemberApprovalStatus } from "@/types"

const COLLECTION = "memberApprovals"

function toApproval(id: string, data: Record<string, unknown>): ApprovalRecord {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    workflowId: (data.workflowId as string) || "",
    currentStage: (data.currentStage as number) || 0,
    stages: (data.stages as ApprovalRecord["stages"]) || [],
    status: (data.status as ApprovalRecord["status"]) || "in_progress",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseMemberApprovalService implements IMemberApprovalService {
  private db = getFirestoreDb()

  async getApprovalRecord(memberId: string): Promise<ApprovalRecord | null> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("memberId", "==", memberId)))
    if (snap.empty) return null
    const d = snap.docs[0]
    return toApproval(d.id, d.data() as Record<string, unknown>)
  }

  async listPendingApprovals(tenantId: string, _approverLevel?: string): Promise<ApprovalRecord[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), where("status", "==", "in_progress")))
    return snap.docs.map((d) => toApproval(d.id, d.data() as Record<string, unknown>))
  }

  async approveStage(recordId: string, stageOrder: number, approverId: string, comment?: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, recordId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return
    const data = snap.data() as Record<string, unknown>
    const stages = (data.stages as ApprovalRecord["stages"]) || []
    const idx = stages.findIndex((s) => s.order === stageOrder)
    if (idx === -1) return
    stages[idx] = { ...stages[idx], status: "approved", approverId, comment, decidedAt: new Date().toISOString() }
    const isLast = stageOrder >= stages.length
    await updateDoc(ref, { stages, currentStage: isLast ? stageOrder : stageOrder + 1, status: isLast ? "approved" : "in_progress", updatedAt: new Date().toISOString() })
  }

  async rejectStage(recordId: string, stageOrder: number, approverId: string, comment?: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, recordId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return
    const data = snap.data() as Record<string, unknown>
    const stages = (data.stages as ApprovalRecord["stages"]) || []
    const idx = stages.findIndex((s) => s.order === stageOrder)
    if (idx === -1) return
    stages[idx] = { ...stages[idx], status: "rejected", approverId, comment, decidedAt: new Date().toISOString() }
    await updateDoc(ref, { stages, status: "rejected", updatedAt: new Date().toISOString() })
  }

  async updateMemberApprovalStatus(_memberId: string, _status: MemberApprovalStatus): Promise<void> {}
}
