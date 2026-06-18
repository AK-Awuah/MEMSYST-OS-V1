import type { RenewalRecord, MemberRenewalStatus } from "@/types"

export interface IRenewalService {
  listRenewals(tenantId: string, params?: { status?: string }): Promise<RenewalRecord[]>
  getRenewal(id: string): Promise<RenewalRecord | null>
  createRenewal(data: Omit<RenewalRecord, "id" | "createdAt" | "updatedAt">): Promise<RenewalRecord>
  updateRenewalStatus(id: string, status: RenewalRecord["status"]): Promise<void>
  getMemberRenewals(memberId: string): Promise<RenewalRecord[]>
  updateMemberRenewalStatus(memberId: string, status: MemberRenewalStatus): Promise<void>
}
