import type { Refund, RefundStatus } from "@/types"

export interface IRefundService {
  listRefunds(params?: { tenantId?: string; status?: RefundStatus }): Promise<Refund[]>
  getRefund(id: string): Promise<Refund | null>
  requestRefund(data: Omit<Refund, "id" | "createdAt" | "updatedAt">): Promise<Refund>
  reviewRefund(id: string, status: "approved" | "rejected", approverId: string, reason?: string): Promise<Refund>
  getRefundStats(tenantId?: string): Promise<{ totalRequested: number; approved: number; completed: number; totalAmount: number }>
}
