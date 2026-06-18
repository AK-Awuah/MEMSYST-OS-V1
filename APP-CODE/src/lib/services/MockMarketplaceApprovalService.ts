import type { IMarketplaceApprovalService } from "./IMarketplaceApprovalService"
import type { MarketplaceApproval } from "@/types"
import { mockMarketplaceApprovals } from "./mock-data"
import { delay } from "./shared-store"

export class MockMarketplaceApprovalService implements IMarketplaceApprovalService {
  private items = [...mockMarketplaceApprovals]

  async listPendingApprovals(tenantId: string): Promise<MarketplaceApproval[]> {
    await delay(200)
    return this.items.filter((a) => a.tenantId === tenantId && a.status === "pending")
  }

  async getApproval(id: string): Promise<MarketplaceApproval | null> {
    await delay(100)
    return this.items.find((a) => a.id === id) || null
  }

  async createApproval(data: Omit<MarketplaceApproval, "id" | "createdAt">): Promise<MarketplaceApproval> {
    await delay(200)
    const approval: MarketplaceApproval = {
      ...data,
      id: `ma-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.items.push(approval)
    return approval
  }

  async approveListing(id: string, reviewerId: string, reviewerName: string): Promise<MarketplaceApproval> {
    await delay(150)
    const idx = this.items.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Approval not found")
    this.items[idx] = {
      ...this.items[idx],
      status: "approved",
      reviewerId,
      reviewerName,
      reviewedAt: new Date().toISOString(),
    }
    return this.items[idx]
  }

  async rejectListing(id: string, reviewerId: string, reviewerName: string, reason: string): Promise<MarketplaceApproval> {
    await delay(150)
    const idx = this.items.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Approval not found")
    this.items[idx] = {
      ...this.items[idx],
      status: "rejected",
      reviewerId,
      reviewerName,
      reviewNotes: reason,
      reviewedAt: new Date().toISOString(),
    }
    return this.items[idx]
  }

  async requestChanges(id: string, reviewerId: string, reviewerName: string, notes: string): Promise<MarketplaceApproval> {
    await delay(150)
    const idx = this.items.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Approval not found")
    this.items[idx] = {
      ...this.items[idx],
      status: "changes_requested",
      reviewerId,
      reviewerName,
      reviewNotes: notes,
      reviewedAt: new Date().toISOString(),
    }
    return this.items[idx]
  }

  async getPlatformPendingApprovals(): Promise<MarketplaceApproval[]> {
    await delay(100)
    return this.items.filter((a) => a.status === "pending")
  }
}
