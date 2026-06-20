import type { IMemberService } from "./IMemberService"
import type { Member, MembershipStatus } from "@/types"
import { mockMembers } from "./mock-data"
import { delay } from "./shared-store"

const members = [...mockMembers]
let nextId = members.length + 1

export class MockMemberService implements IMemberService {
  async listMembers(tenantId: string, params?: { search?: string; status?: string; category?: string; regionId?: string; branchId?: string }): Promise<Member[]> {
    await delay(200)
    let result = members.filter((m) => m.tenantId === tenantId)
    if (params?.search) {
      const s = params.search.toLowerCase()
      result = result.filter((m) => m.firstName.toLowerCase().includes(s) || m.lastName.toLowerCase().includes(s) || m.membershipNumber.toLowerCase().includes(s) || m.email.toLowerCase().includes(s))
    }
    if (params?.status && params.status !== "all") result = result.filter((m) => m.status === params.status)
    if (params?.category && params.category !== "all") result = result.filter((m) => m.category === params.category)
    if (params?.regionId && params.regionId !== "all") result = result.filter((m) => m.regionId === params.regionId)
    if (params?.branchId && params.branchId !== "all") result = result.filter((m) => m.branchId === params.branchId)
    return result
  }

  async getMember(id: string): Promise<Member | null> {
    await delay(100)
    return members.find((m) => m.id === id) || null
  }

  async createMember(data: Omit<Member, "id" | "createdAt" | "updatedAt">): Promise<Member> {
    await delay(200)
    const member: Member = { ...data, id: `mem-${nextId++}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    members.push(member)
    return member
  }

  async updateMember(id: string, data: Partial<Member>): Promise<void> {
    await delay(150)
    const idx = members.findIndex((m) => m.id === id)
    if (idx !== -1) members[idx] = { ...members[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async updateMemberStatus(id: string, status: MembershipStatus): Promise<void> {
    await delay(150)
    const idx = members.findIndex((m) => m.id === id)
    if (idx !== -1) members[idx] = { ...members[idx], status, updatedAt: new Date().toISOString() }
  }

  async getMembersByTenant(tenantId: string): Promise<Member[]> {
    await delay(100)
    return members.filter((m) => m.tenantId === tenantId)
  }

  async getMemberCount(tenantId: string): Promise<number> {
    await delay(50)
    return members.filter((m) => m.tenantId === tenantId).length
  }
}
