import type { IApprenticeService } from "./IApprenticeService"
import type { Apprentice, TransferRecord, UpgradeRequest, ApprenticeStatus, Member } from "@/types"
import { mockApprentices, mockTransferRecords, mockUpgradeRequests, mockMembers } from "./mock-data"
import { delay } from "./shared-store"

let apprentices = [...mockApprentices]
let transfers = [...mockTransferRecords]
let upgrades = [...mockUpgradeRequests]
let members = [...mockMembers]
let nextAId = apprentices.length + 1
let nextTId = transfers.length + 1
let nextUId = upgrades.length + 1

export class MockApprenticeService implements IApprenticeService {
  async listApprentices(tenantId: string, params?: { status?: string; parentMemberId?: string }): Promise<Apprentice[]> {
    await delay(200)
    let result = apprentices.filter((a) => a.tenantId === tenantId)
    if (params?.status && params.status !== "all") result = result.filter((a) => a.status === params.status)
    if (params?.parentMemberId) result = result.filter((a) => a.parentMemberId === params.parentMemberId)
    return result
  }

  async getApprentice(id: string): Promise<Apprentice | null> {
    await delay(100)
    return apprentices.find((a) => a.id === id) || null
  }

  async createApprentice(data: Omit<Apprentice, "id" | "createdAt" | "updatedAt">): Promise<Apprentice> {
    await delay(200)
    const appr: Apprentice = { ...data, id: `appr-${nextAId++}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    apprentices.push(appr)
    return appr
  }

  async updateApprentice(id: string, data: Partial<Apprentice>): Promise<void> {
    await delay(150)
    const idx = apprentices.findIndex((a) => a.id === id)
    if (idx !== -1) apprentices[idx] = { ...apprentices[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async updateApprenticeStatus(id: string, status: ApprenticeStatus): Promise<void> {
    await delay(150)
    const idx = apprentices.findIndex((a) => a.id === id)
    if (idx !== -1) apprentices[idx] = { ...apprentices[idx], status, updatedAt: new Date().toISOString() }
  }

  async getApprenticesByMember(memberId: string): Promise<Apprentice[]> {
    await delay(100)
    return apprentices.filter((a) => a.parentMemberId === memberId)
  }

  // Transfer
  async requestTransfer(apprenticeId: string, newMemberId: string, reason: string, requestedBy: string): Promise<TransferRecord> {
    await delay(200)
    const appr = apprentices.find((a) => a.id === apprenticeId)
    if (!appr) throw new Error("Apprentice not found")
    const tr: TransferRecord = {
      id: `tr-${nextTId++}`,
      tenantId: appr.tenantId,
      apprenticeId,
      previousMemberId: appr.parentMemberId,
      newMemberId,
      reason,
      approver: requestedBy,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    transfers.push(tr)
    return tr
  }

  async approveTransfer(transferId: string, _approver: string): Promise<void> {
    await delay(200)
    const tr = transfers.find((t) => t.id === transferId)
    if (!tr) return
    tr.status = "completed"
    tr.updatedAt = new Date().toISOString()
    const apprIdx = apprentices.findIndex((a) => a.id === tr.apprenticeId)
    if (apprIdx !== -1) {
      apprentices[apprIdx].parentMemberId = tr.newMemberId
      apprentices[apprIdx].status = "transferred"
      apprentices[apprIdx].updatedAt = new Date().toISOString()
    }
  }

  async rejectTransfer(transferId: string, _approver: string): Promise<void> {
    await delay(200)
    const tr = transfers.find((t) => t.id === transferId)
    if (!tr) return
    tr.status = "rejected"
    tr.updatedAt = new Date().toISOString()
  }

  async getTransferHistory(apprenticeId: string): Promise<TransferRecord[]> {
    await delay(100)
    return transfers.filter((t) => t.apprenticeId === apprenticeId)
  }

  // Upgrade
  async requestUpgrade(apprenticeId: string, _requestedBy: string): Promise<UpgradeRequest> {
    await delay(200)
    const appr = apprentices.find((a) => a.id === apprenticeId)
    if (!appr) throw new Error("Apprentice not found")
    const ur: UpgradeRequest = {
      id: `ur-${nextUId++}`,
      tenantId: appr.tenantId,
      apprenticeId,
      status: "pending_review",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    upgrades.push(ur)
    return ur
  }

  async approveUpgrade(upgradeId: string, _reviewedBy: string, _notes?: string): Promise<Member> {
    await delay(300)
    const ur = upgrades.find((u) => u.id === upgradeId)
    if (!ur) throw new Error("Upgrade request not found")
    ur.status = "approved"
    ur.reviewedBy = _reviewedBy
    ur.reviewNotes = _notes
    ur.updatedAt = new Date().toISOString()
    const appr = apprentices.find((a) => a.id === ur.apprenticeId)
    if (!appr) throw new Error("Apprentice not found")
    appr.status = "upgraded"
    appr.updatedAt = new Date().toISOString()
    const member: Member = {
      id: `mem-${Date.now()}`,
      tenantId: appr.tenantId,
      membershipNumber: `MEM-${Date.now()}`,
      branchId: appr.branchId,
      regionId: appr.regionId,
      category: "Full Member",
      type: "Full Member",
      status: "active",
      approvalStatus: "approved",
      renewalStatus: "current",
      firstName: appr.firstName,
      middleName: "",
      lastName: appr.lastName,
      gender: "",
      dateOfBirth: "",
      photo: appr.photo,
      phone: appr.phone,
      email: appr.email,
      address: appr.address,
      city: "",
      region: "",
      country: "",
      profession: appr.trade,
      specialization: "",
      businessName: "",
      yearsOfExperience: 0,
      dateRegistered: new Date().toISOString(),
      registeredBy: "executive",
      registeredById: _reviewedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    members.push(member)
    return member
  }

  async rejectUpgrade(upgradeId: string, _reviewedBy: string, _notes?: string): Promise<void> {
    await delay(200)
    const ur = upgrades.find((u) => u.id === upgradeId)
    if (!ur) return
    ur.status = "rejected"
    ur.reviewedBy = _reviewedBy
    ur.reviewNotes = _notes
    ur.updatedAt = new Date().toISOString()
  }

  async getUpgradeRequests(tenantId: string, _status?: string): Promise<UpgradeRequest[]> {
    await delay(200)
    return upgrades.filter((u) => u.tenantId === tenantId && (!_status || _status === "all" || u.status === _status))
  }
}
