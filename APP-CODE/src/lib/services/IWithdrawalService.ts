import type { Withdrawal, WithdrawalStatus } from "@/types"

export interface IWithdrawalService {
  listWithdrawals(params?: { tenantId?: string; walletId?: string; status?: WithdrawalStatus }): Promise<Withdrawal[]>
  getWithdrawal(id: string): Promise<Withdrawal | null>
  createWithdrawal(data: Omit<Withdrawal, "id" | "createdAt" | "updatedAt">): Promise<Withdrawal>
  updateStatus(id: string, status: WithdrawalStatus, data?: { reviewedBy?: string; rejectionReason?: string; referenceNumber?: string; transferId?: string; proofOfPayment?: string }): Promise<Withdrawal>
  getWithdrawalStats(tenantId?: string): Promise<{ pending: number; approved: number; completed: number; totalRequested: number; totalFees: number }>
}
