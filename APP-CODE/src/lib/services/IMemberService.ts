import type { Member, MembershipStatus } from "@/types"

export interface IMemberService {
  listMembers(tenantId: string, params?: { search?: string; status?: string; category?: string; regionId?: string; branchId?: string }): Promise<Member[]>
  getMember(id: string): Promise<Member | null>
  createMember(data: Omit<Member, "id" | "createdAt" | "updatedAt">): Promise<Member>
  updateMember(id: string, data: Partial<Member>): Promise<void>
  updateMemberStatus(id: string, status: MembershipStatus): Promise<void>
  getMembersByTenant(tenantId: string): Promise<Member[]>
  getMemberCount(tenantId: string): Promise<number>
}
