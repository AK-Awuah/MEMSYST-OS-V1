import type { BusinessProfile, BusinessVerificationStatus, BusinessVerificationType } from "@/types"

export interface IBusinessProfileService {
  listBusinesses(tenantId: string, params?: { status?: string; categoryId?: string }): Promise<BusinessProfile[]>
  getBusiness(id: string): Promise<BusinessProfile | null>
  getBusinessByMember(memberId: string): Promise<BusinessProfile | null>
  createBusiness(data: Omit<BusinessProfile, "id" | "createdAt" | "updatedAt">): Promise<BusinessProfile>
  updateBusiness(id: string, data: Partial<BusinessProfile>): Promise<BusinessProfile>
  updateVerificationStatus(id: string, status: BusinessVerificationStatus, verifiedBy?: string, verificationType?: BusinessVerificationType): Promise<BusinessProfile>
  deleteBusiness(id: string): Promise<void>
}
