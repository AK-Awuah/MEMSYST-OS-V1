import type { IRefundService } from "./IRefundService"
import type { Refund, RefundStatus } from "@/types"
import { sharedRefunds, pushAuditLog } from "./shared-store"
import { delay } from "./shared-store"

let refunds = [...sharedRefunds]

export class MockRefundService implements IRefundService {
  async listRefunds(params?: { tenantId?: string; status?: RefundStatus }): Promise<Refund[]> {
    await delay(100)
    let result = [...refunds]
    if (params?.tenantId) result = result.filter((r) => r.tenantId === params.tenantId)
    if (params?.status) result = result.filter((r) => r.status === params.status)
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getRefund(id: string): Promise<Refund | null> {
    await delay(50)
    return refunds.find((r) => r.id === id) || null
  }

  async requestRefund(data: Omit<Refund, "id" | "createdAt" | "updatedAt">): Promise<Refund> {
    await delay(150)
    const refund: Refund = { ...data, id: `rfd-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    refunds.unshift(refund)
    pushAuditLog({ actor: "System", role: "system", action: "CREATE", module: "FINANCE", recordType: "Refund", recordId: refund.id, newValue: `Refund requested: GHS ${refund.amount}`, ipAddress: "127.0.0.1" })
    return refund
  }

  async reviewRefund(id: string, status: "approved" | "rejected", approverId: string, reason?: string): Promise<Refund> {
    await delay(100)
    const idx = refunds.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Refund not found")
    const updates: Partial<Refund> = { status, approverId, reviewedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    if (reason && status === "rejected") updates.reason = reason
    if (status === "approved") updates.status = "completed"
    refunds[idx] = { ...refunds[idx], ...updates }
    pushAuditLog({ actor: "System", role: "system", action: "UPDATE", module: "FINANCE", recordType: "Refund", recordId: id, newValue: `Refund ${status}`, ipAddress: "127.0.0.1" })
    return refunds[idx]
  }

  async getRefundStats(tenantId?: string): Promise<{ totalRequested: number; approved: number; completed: number; totalAmount: number }> {
    await delay(100)
    const filtered = tenantId ? refunds.filter((r) => r.tenantId === tenantId) : refunds
    return {
      totalRequested: filtered.length,
      approved: filtered.filter((r) => r.status === "approved").length,
      completed: filtered.filter((r) => r.status === "completed").length,
      totalAmount: filtered.reduce((s, r) => s + r.amount, 0),
    }
  }
}
