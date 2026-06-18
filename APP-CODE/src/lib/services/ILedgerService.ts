import type { LedgerEntry } from "@/types"

export interface ILedgerService {
  listEntries(params?: { tenantId?: string; walletId?: string; limit?: number }): Promise<LedgerEntry[]>
  getEntry(id: string): Promise<LedgerEntry | null>
  getWalletLedger(walletId: string): Promise<LedgerEntry[]>
}
