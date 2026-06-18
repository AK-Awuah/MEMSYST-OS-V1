import type { IBusinessProfileService } from "./IBusinessProfileService"
import type { BusinessProfile, BusinessVerificationStatus, BusinessVerificationType } from "@/types"
import { mockBusinessProfiles } from "./mock-data"
import { delay } from "./shared-store"

export class MockBusinessProfileService implements IBusinessProfileService {
  private items = [...mockBusinessProfiles]

  async listBusinesses(tenantId: string, params?: { status?: string; categoryId?: string }): Promise<BusinessProfile[]> {
    await delay(200)
    let result = this.items.filter((b) => b.tenantId === tenantId)
    if (params?.status) result = result.filter((b) => b.status === params.status)
    if (params?.categoryId) result = result.filter((b) => b.categoryId === params.categoryId)
    return result
  }

  async getBusiness(id: string): Promise<BusinessProfile | null> {
    await delay(100)
    return this.items.find((b) => b.id === id) || null
  }

  async getBusinessByMember(memberId: string): Promise<BusinessProfile | null> {
    await delay(100)
    return this.items.find((b) => b.memberId === memberId) || null
  }

  async createBusiness(data: Omit<BusinessProfile, "id" | "createdAt" | "updatedAt">): Promise<BusinessProfile> {
    await delay(200)
    const business: BusinessProfile = {
      ...data,
      id: `bp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(business)
    return business
  }

  async updateBusiness(id: string, data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    await delay(150)
    const idx = this.items.findIndex((b) => b.id === id)
    if (idx === -1) throw new Error("Business not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async updateVerificationStatus(id: string, status: BusinessVerificationStatus, verifiedBy?: string, verificationType?: BusinessVerificationType): Promise<BusinessProfile> {
    await delay(150)
    const idx = this.items.findIndex((b) => b.id === id)
    if (idx === -1) throw new Error("Business not found")
    const updated = {
      ...this.items[idx],
      verificationStatus: status,
      updatedAt: new Date().toISOString(),
    }
    if (verifiedBy) updated.verifiedBy = verifiedBy
    if (verificationType) updated.verificationType = verificationType
    if (status === "verified") updated.verifiedAt = new Date().toISOString()
    this.items[idx] = updated
    return this.items[idx]
  }

  async deleteBusiness(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((b) => b.id !== id)
  }
}
