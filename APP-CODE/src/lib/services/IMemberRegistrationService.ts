import type { Member } from "@/types"

export interface IMemberRegistrationService {
  registerSelf(data: Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">): Promise<Member>
  registerByExecutive(data: Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">, executiveId: string): Promise<Member>
  registerByAdmin(data: Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">): Promise<Member>
  verifyRegistration(memberId: string): Promise<void>
}
