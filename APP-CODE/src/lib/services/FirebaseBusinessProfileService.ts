import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IBusinessProfileService } from "./IBusinessProfileService"
import type { BusinessProfile, BusinessVerificationStatus, BusinessVerificationType } from "@/types"

const COLLECTION = "businessProfiles"

function toBusinessProfile(id: string, data: Record<string, unknown>): BusinessProfile {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    businessName: (data.businessName as string) || "",
    categoryId: (data.categoryId as string) || "",
    description: (data.description as string) || "",
    status: (data.status as BusinessProfile["status"]) || "active",
    verificationStatus: (data.verificationStatus as BusinessVerificationStatus) || "unverified",
    verificationType: data.verificationType as BusinessVerificationType | undefined,
    verifiedAt: data.verifiedAt as string | undefined,
    verifiedBy: data.verifiedBy as string | undefined,
    address: (data.address as string) || "",
    phone: (data.phone as string) || "",
    email: (data.email as string) || "",
    website: (data.website as string) || "",
    socialMedia: (data.socialMedia as string[]) || [],
    operatingHours: (data.operatingHours as Record<string, string>) || {},
    logo: (data.logo as string) || "",
    gallery: (data.gallery as string[]) || [],
    promotionalImages: (data.promotionalImages as string[]) || [],
    services: (data.services as string[]) || [],
    products: (data.products as string[]) || [],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseBusinessProfileService implements IBusinessProfileService {
  private db = getFirestoreDb()

  async listBusinesses(tenantId: string, params?: {
    status?: string
    categoryId?: string
  }): Promise<BusinessProfile[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.categoryId) constraints.unshift(where("categoryId", "==", params.categoryId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toBusinessProfile(d.id, d.data() as Record<string, unknown>))
  }

  async getBusiness(id: string): Promise<BusinessProfile | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toBusinessProfile(snap.id, snap.data() as Record<string, unknown>)
  }

  async getBusinessByMember(memberId: string): Promise<BusinessProfile | null> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("memberId", "==", memberId)))
    if (snap.empty) return null
    return toBusinessProfile(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>)
  }

  async createBusiness(data: Omit<BusinessProfile, "id" | "createdAt" | "updatedAt">): Promise<BusinessProfile> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getBusiness(ref.id) as Promise<BusinessProfile>
  }

  async updateBusiness(id: string, data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getBusiness(id) as Promise<BusinessProfile>
  }

  async updateVerificationStatus(
    id: string,
    status: BusinessVerificationStatus,
    verifiedBy?: string,
    verificationType?: BusinessVerificationType,
  ): Promise<BusinessProfile> {
    const updateData: Record<string, unknown> = {
      verificationStatus: status,
      updatedAt: new Date().toISOString(),
    }
    if (status === "verified" && verifiedBy) {
      updateData.verifiedBy = verifiedBy
      updateData.verifiedAt = new Date().toISOString()
      if (verificationType) updateData.verificationType = verificationType
    }
    await updateDoc(doc(this.db, COLLECTION, id), updateData)
    return this.getBusiness(id) as Promise<BusinessProfile>
  }

  async deleteBusiness(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }
}
