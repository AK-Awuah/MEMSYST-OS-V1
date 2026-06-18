import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMemberService } from "./IMemberService"
import type { Member, MembershipStatus } from "@/types"

const COLLECTION = "members"

function toMember(id: string, data: Record<string, unknown>): Member {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    membershipNumber: (data.membershipNumber as string) || "",
    branchId: (data.branchId as string) || "",
    regionId: (data.regionId as string) || "",
    category: (data.category as string) || "",
    type: (data.type as string) || "",
    status: (data.status as MembershipStatus) || "pending",
    approvalStatus: (data.approvalStatus as Member["approvalStatus"]) || "pending_verification",
    renewalStatus: (data.renewalStatus as Member["renewalStatus"]) || "current",
    firstName: (data.firstName as string) || "",
    middleName: (data.middleName as string) || "",
    lastName: (data.lastName as string) || "",
    gender: (data.gender as string) || "",
    dateOfBirth: (data.dateOfBirth as string) || "",
    photo: (data.photo as string) || "",
    phone: (data.phone as string) || "",
    email: (data.email as string) || "",
    address: (data.address as string) || "",
    city: (data.city as string) || "",
    region: (data.region as string) || "",
    country: (data.country as string) || "",
    profession: (data.profession as string) || "",
    specialization: (data.specialization as string) || "",
    businessName: (data.businessName as string) || "",
    yearsOfExperience: (data.yearsOfExperience as number) || 0,
    dateRegistered: (data.dateRegistered as string) || "",
    lastRenewalDate: (data.lastRenewalDate as string) || undefined,
    nextRenewalDate: (data.nextRenewalDate as string) || undefined,
    registeredBy: (data.registeredBy as "self" | "executive" | "admin") || "self",
    registeredById: (data.registeredById as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseMemberService implements IMemberService {
  private db = getFirestoreDb()

  async listMembers(tenantId: string, params?: { search?: string; status?: string; category?: string; regionId?: string; branchId?: string }): Promise<Member[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    if (params?.category && params.category !== "all") constraints.unshift(where("category", "==", params.category))
    if (params?.regionId && params.regionId !== "all") constraints.unshift(where("regionId", "==", params.regionId))
    const snap = await getDocs(query(col, ...constraints))
    let members = snap.docs.map((d) => toMember(d.id, d.data() as Record<string, unknown>))
    if (params?.search) {
      const s = params.search.toLowerCase()
      members = members.filter((m) => m.firstName.toLowerCase().includes(s) || m.lastName.toLowerCase().includes(s) || m.membershipNumber.toLowerCase().includes(s) || m.email.toLowerCase().includes(s))
    }
    return members
  }

  async getMember(id: string): Promise<Member | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toMember(snap.id, snap.data() as Record<string, unknown>)
  }

  async createMember(data: Omit<Member, "id" | "createdAt" | "updatedAt">): Promise<Member> {
    const ref = await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getMember(ref.id) as Promise<Member>
  }

  async updateMember(id: string, data: Partial<Member>): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async updateMemberStatus(id: string, status: MembershipStatus): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), { status, updatedAt: new Date().toISOString() })
  }

  async getMembersByTenant(tenantId: string): Promise<Member[]> {
    return this.listMembers(tenantId)
  }

  async getMemberCount(tenantId: string): Promise<number> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId)))
    return snap.size
  }
}
