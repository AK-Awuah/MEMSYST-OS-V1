import type { IWithdrawalService } from "./IWithdrawalService"
import type { Withdrawal, WithdrawalStatus } from "@/types"
import { sharedWithdrawals, pushAuditLog } from "./shared-store"
import { delay } from "./shared-store"

const withdrawals = [...sharedWithdrawals]

export class MockWithdrawalService implements IWithdrawalService {
  async listWithdrawals(params?: { tenantId?: string; walletId?: string; status?: WithdrawalStatus }): Promise<Withdrawal[]> {
    await delay(100)
    let result = [...withdrawals]
    if (params?.tenantId) result = result.filter((w) => w.tenantId === params.tenantId)
    if (params?.walletId) result = result.filter((w) => w.walletId === params.walletId)
    if (params?.status) result = result.filter((w) => w.status === params.status)
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getWithdrawal(id: string): Promise<Withdrawal | null> {
    await delay(50)
    return withdrawals.find((w) => w.id === id) || null
  }

  async createWithdrawal(data: Omit<Withdrawal, "id" | "createdAt" | "updatedAt">): Promise<Withdrawal> {
    await delay(200)
    const withdrawal: Withdrawal = { ...data, id: `wd-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    withdrawals.unshift(withdrawal)
    pushAuditLog({ actor: "System", role: "system", action: "CREATE", module: "FINANCE", recordType: "Withdrawal", recordId: withdrawal.id, newValue: `Withdrawal requested: GHS ${withdrawal.amount}`, ipAddress: "127.0.0.1" })
    return withdrawal
  }

  async updateStatus(id: string, status: WithdrawalStatus, data?: { reviewedBy?: string; rejectionReason?: string; referenceNumber?: string; transferId?: string; proofOfPayment?: string }): Promise<Withdrawal> {
    await delay(100)
    const idx = withdrawals.findIndex((w) => w.id === id)
    if (idx === -1) throw new Error("Withdrawal not found")
    const updates: Partial<Withdrawal> = { status, updatedAt: new Date().toISOString(), ...data }
    if (status === "completed") updates.completedAt = new Date().toISOString()
    if (status === "approved" || status === "processing") updates.lockedAt = new Date().toISOString()
    withdrawals[idx] = { ...withdrawals[idx], ...updates }
    pushAuditLog({ actor: "System", role: "system", action: "UPDATE", module: "FINANCE", recordType: "Withdrawal", recordId: id, newValue: `Withdrawal status: ${status}`, ipAddress: "127.0.0.1" })
    return withdrawals[idx]
  }

  async getWithdrawalStats(tenantId?: string): Promise<{ pending: number; approved: number; completed: number; totalRequested: number; totalFees: number }> {
    await delay(100)
    const filtered = tenantId ? withdrawals.filter((w) => w.tenantId === tenantId) : withdrawals
    return {
      pending: filtered.filter((w) => w.status === "submitted" || w.status === "under_review" || w.status === "platform_review").length,
      approved: filtered.filter((w) => w.status === "approved").length,
      completed: filtered.filter((w) => w.status === "completed").length,
      totalRequested: filtered.reduce((s, w) => s + w.amount, 0),
      totalFees: filtered.reduce((s, w) => s + w.fee, 0),
    }
  }
}
