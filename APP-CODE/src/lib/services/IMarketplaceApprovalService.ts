import type { MarketplaceApproval } from "@/types"

export interface IMarketplaceApprovalService {
  listPendingApprovals(tenantId: string): Promise<MarketplaceApproval[]>
  getApproval(id: string): Promise<MarketplaceApproval | null>
  createApproval(data: Omit<MarketplaceApproval, "id" | "createdAt">): Promise<MarketplaceApproval>
  approveListing(id: string, reviewerId: string, reviewerName: string): Promise<MarketplaceApproval>
  rejectListing(id: string, reviewerId: string, reviewerName: string, reason: string): Promise<MarketplaceApproval>
  requestChanges(id: string, reviewerId: string, reviewerName: string, notes: string): Promise<MarketplaceApproval>
  getPlatformPendingApprovals(): Promise<MarketplaceApproval[]>
}
