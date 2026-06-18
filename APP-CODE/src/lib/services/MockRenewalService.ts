import type { IRenewalService } from "./IRenewalService"
import type { RenewalRecord, MemberRenewalStatus } from "@/types"
import { mockRenewalRecords } from "./mock-data"
import { delay } from "./shared-store"

let renewals = [...mockRenewalRecords]
let nextId = renewals.length + 1

export class MockRenewalService implements IRenewalService {
  async listRenewals(tenantId: string, params?: { status?: string }): Promise<RenewalRecord[]> {
    await delay(200)
    let result = renewals.filter((r) => r.tenantId === tenantId)
    if (params?.status && params.status !== "all") result = result.filter((r) => r.status === params.status)
    return result
  }

  async getRenewal(id: string): Promise<RenewalRecord | null> {
    await delay(100)
    return renewals.find((r) => r.id === id) || null
  }

  async createRenewal(data: Omit<RenewalRecord, "id" | "createdAt" | "updatedAt">): Promise<RenewalRecord> {
    await delay(200)
    const rec: RenewalRecord = { ...data, id: `rr-${nextId++}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    renewals.push(rec)
    return rec
  }

  async updateRenewalStatus(id: string, status: RenewalRecord["status"]): Promise<void> {
    await delay(150)
    const idx = renewals.findIndex((r) => r.id === id)
    if (idx !== -1) renewals[idx] = { ...renewals[idx], status, updatedAt: new Date().toISOString() }
  }

  async getMemberRenewals(memberId: string): Promise<RenewalRecord[]> {
    await delay(100)
    return renewals.filter((r) => r.memberId === memberId)
  }

  async updateMemberRenewalStatus(_memberId: string, _status: MemberRenewalStatus): Promise<void> {
    await delay(100)
  }
}
