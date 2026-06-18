import { collection, addDoc, getDoc, doc } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMemberRegistrationService } from "./IMemberRegistrationService"
import type { Member } from "@/types"

const COLLECTION = "members"

export class FirebaseMemberRegistrationService implements IMemberRegistrationService {
  private db = getFirestoreDb()

  private async register(data: Record<string, unknown>): Promise<Member> {
    const now = new Date().toISOString()
    const payload = {
      ...data,
      membershipNumber: `MEM-${Date.now()}`,
      dateRegistered: now,
      createdAt: now,
      updatedAt: now,
    } as Record<string, unknown>
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload } as unknown as Member
  }

  async registerSelf(data: Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">): Promise<Member> {
    return this.register({ ...data, status: "pending", approvalStatus: "pending_verification", renewalStatus: "current", registeredBy: "self" })
  }

  async registerByExecutive(data: Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">, _executiveId: string): Promise<Member> {
    return this.register({ ...data, status: "active", approvalStatus: "approved", renewalStatus: "current", registeredBy: "executive", registeredById: _executiveId })
  }

  async registerByAdmin(data: Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">): Promise<Member> {
    return this.register({ ...data, status: "active", approvalStatus: "active", renewalStatus: "current", registeredBy: "admin" })
  }

  async verifyRegistration(_memberId: string): Promise<void> {}
}
