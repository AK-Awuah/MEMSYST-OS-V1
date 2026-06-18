import type { IMemberRegistrationService } from "./IMemberRegistrationService"
import type { Member } from "@/types"
import { delay } from "./shared-store"
import { MockMemberService } from "./MockMemberService"

const memberSvc = new MockMemberService()

export class MockMemberRegistrationService implements IMemberRegistrationService {
  async registerSelf(data: Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">): Promise<Member> {
    await delay(300)
    return memberSvc.createMember({
      ...data,
      membershipNumber: `MEM-${Date.now()}`,
      status: "pending",
      approvalStatus: "pending_verification",
      renewalStatus: "current",
      dateRegistered: new Date().toISOString(),
      memberId: "" as never,
    } as unknown as Omit<Member, "id" | "createdAt" | "updatedAt">)
  }

  async registerByExecutive(data: Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">, _executiveId: string): Promise<Member> {
    await delay(300)
    return memberSvc.createMember({
      ...data,
      membershipNumber: `MEM-${Date.now()}`,
      status: "active",
      approvalStatus: "approved",
      renewalStatus: "current",
      dateRegistered: new Date().toISOString(),
      registeredBy: "executive",
      registeredById: _executiveId,
      memberId: "" as never,
    } as unknown as Omit<Member, "id" | "createdAt" | "updatedAt">)
  }

  async registerByAdmin(data: Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">): Promise<Member> {
    await delay(300)
    return memberSvc.createMember({
      ...data,
      membershipNumber: `MEM-${Date.now()}`,
      status: "active",
      approvalStatus: "active",
      renewalStatus: "current",
      dateRegistered: new Date().toISOString(),
      registeredBy: "admin",
      memberId: "" as never,
    } as unknown as Omit<Member, "id" | "createdAt" | "updatedAt">)
  }

  async verifyRegistration(_memberId: string): Promise<void> {
    await delay(200)
  }
}
