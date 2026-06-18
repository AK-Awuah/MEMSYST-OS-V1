import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IApprenticeService } from "./IApprenticeService"
import type { Apprentice, TransferRecord, UpgradeRequest, Member } from "@/types"

const APPRENTICE_COL = "apprentices"
const TRANSFER_COL = "apprenticeTransfers"
const UPGRADE_COL = "apprenticeUpgrades"

function toApprentice(id: string, data: Record<string, unknown>): Apprentice {
  return {
    id, tenantId: (data.tenantId as string) || "", parentMemberId: (data.parentMemberId as string) || "",
    branchId: (data.branchId as string) || "", regionId: (data.regionId as string) || "",
    status: (data.status as Apprentice["status"]) || "pending", dateRegistered: (data.dateRegistered as string) || "",
    firstName: (data.firstName as string) || "", lastName: (data.lastName as string) || "",
    photo: (data.photo as string) || "", phone: (data.phone as string) || "",
    email: (data.email as string) || "", address: (data.address as string) || "",
    trade: (data.trade as string) || "", startDate: (data.startDate as string) || "",
    expectedCompletionDate: (data.expectedCompletionDate as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseApprenticeService implements IApprenticeService {
  private db = getFirestoreDb()

  async listApprentices(tenantId: string, params?: { status?: string; parentMemberId?: string }): Promise<Apprentice[]> {
    const col = collection(this.db, APPRENTICE_COL)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    if (params?.parentMemberId) constraints.unshift(where("parentMemberId", "==", params.parentMemberId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toApprentice(d.id, d.data() as Record<string, unknown>))
  }

  async getApprentice(id: string): Promise<Apprentice | null> {
    const snap = await getDoc(doc(this.db, APPRENTICE_COL, id))
    if (!snap.exists()) return null
    return toApprentice(snap.id, snap.data() as Record<string, unknown>)
  }

  async createApprentice(data: Omit<Apprentice, "id" | "createdAt" | "updatedAt">): Promise<Apprentice> {
    const ref = await addDoc(collection(this.db, APPRENTICE_COL), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getApprentice(ref.id) as Promise<Apprentice>
  }

  async updateApprentice(id: string, data: Partial<Apprentice>): Promise<void> {
    await updateDoc(doc(this.db, APPRENTICE_COL, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async updateApprenticeStatus(id: string, status: Apprentice["status"]): Promise<void> {
    await updateDoc(doc(this.db, APPRENTICE_COL, id), { status, updatedAt: new Date().toISOString() })
  }

  async getApprenticesByMember(memberId: string): Promise<Apprentice[]> {
    const col = collection(this.db, APPRENTICE_COL)
    const snap = await getDocs(query(col, where("parentMemberId", "==", memberId)))
    return snap.docs.map((d) => toApprentice(d.id, d.data() as Record<string, unknown>))
  }

  async requestTransfer(apprenticeId: string, newMemberId: string, reason: string, requestedBy: string): Promise<TransferRecord> {
    const appr = await this.getApprentice(apprenticeId)
    if (!appr) throw new Error("Apprentice not found")
    const payload = {
      tenantId: appr.tenantId, apprenticeId, previousMemberId: appr.parentMemberId, newMemberId,
      reason, approver: requestedBy, status: "pending" as const,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    const ref = await addDoc(collection(this.db, TRANSFER_COL), payload)
    return { id: ref.id, ...payload }
  }

  async approveTransfer(transferId: string, _approver: string): Promise<void> {
    const ref = doc(this.db, TRANSFER_COL, transferId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return
    const data = snap.data() as Record<string, unknown>
    await updateDoc(ref, { status: "completed", updatedAt: new Date().toISOString() })
    await updateDoc(doc(this.db, APPRENTICE_COL, data.apprenticeId as string), { parentMemberId: data.newMemberId, status: "transferred", updatedAt: new Date().toISOString() })
  }

  async rejectTransfer(transferId: string, _approver: string): Promise<void> {
    await updateDoc(doc(this.db, TRANSFER_COL, transferId), { status: "rejected", updatedAt: new Date().toISOString() })
  }

  async getTransferHistory(apprenticeId: string): Promise<TransferRecord[]> {
    const col = collection(this.db, TRANSFER_COL)
    const snap = await getDocs(query(col, where("apprenticeId", "==", apprenticeId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as TransferRecord))
  }

  async requestUpgrade(apprenticeId: string, _requestedBy: string): Promise<UpgradeRequest> {
    const appr = await this.getApprentice(apprenticeId)
    if (!appr) throw new Error("Apprentice not found")
    const payload = {
      tenantId: appr.tenantId, apprenticeId, status: "pending_review" as const,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    const ref = await addDoc(collection(this.db, UPGRADE_COL), payload)
    return { id: ref.id, ...payload }
  }

  async approveUpgrade(upgradeId: string, _reviewedBy: string, _notes?: string): Promise<Member> {
    const ref = doc(this.db, UPGRADE_COL, upgradeId)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error("Upgrade request not found")
    const data = snap.data() as Record<string, unknown>
    await updateDoc(ref, { status: "approved", reviewedBy: _reviewedBy, reviewNotes: _notes || "", updatedAt: new Date().toISOString() })
    const appr = await this.getApprentice(data.apprenticeId as string)
    if (!appr) throw new Error("Apprentice not found")
    await this.updateApprenticeStatus(appr.id, "upgraded")
    const memberPayload = {
      tenantId: appr.tenantId, membershipNumber: `MEM-${Date.now()}`,
      branchId: appr.branchId, regionId: appr.regionId,
      category: "Full Member", type: "Full Member",
      status: "active" as const, approvalStatus: "approved" as const, renewalStatus: "current" as const,
      firstName: appr.firstName, middleName: "", lastName: appr.lastName,
      gender: "", dateOfBirth: "", photo: appr.photo,
      phone: appr.phone, email: appr.email, address: appr.address,
      city: "", region: "", country: "",
      profession: appr.trade, specialization: "", businessName: "", yearsOfExperience: 0,
      dateRegistered: new Date().toISOString(), registeredBy: "executive" as const, registeredById: _reviewedBy,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    const memberRef = await addDoc(collection(this.db, "members"), memberPayload)
    return { id: memberRef.id, ...memberPayload }
  }

  async rejectUpgrade(upgradeId: string, _reviewedBy: string, _notes?: string): Promise<void> {
    await updateDoc(doc(this.db, UPGRADE_COL, upgradeId), { status: "rejected", reviewedBy: _reviewedBy, reviewNotes: _notes || "", updatedAt: new Date().toISOString() })
  }

  async getUpgradeRequests(tenantId: string, _status?: string): Promise<UpgradeRequest[]> {
    const col = collection(this.db, UPGRADE_COL)
    const constraints = [where("tenantId", "==", tenantId)]
    if (_status && _status !== "all") constraints.push(where("status", "==", _status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as UpgradeRequest))
  }
}
