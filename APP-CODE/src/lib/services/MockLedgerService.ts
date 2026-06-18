import type { ILedgerService } from "./ILedgerService"
import type { LedgerEntry } from "@/types"
import { sharedTransactions } from "./shared-store"
import { delay } from "./shared-store"

export class MockLedgerService implements ILedgerService {
  async listEntries(params?: { tenantId?: string; walletId?: string; limit?: number }): Promise<LedgerEntry[]> {
    await delay(100)
    let entries: LedgerEntry[] = sharedTransactions.map((t) => ({
      id: `ledger-${t.id}`,
      tenantId: t.tenantId,
      transactionId: t.id,
      referenceNumber: t.referenceNumber,
      debitWalletId: t.sourceWalletId || "",
      creditWalletId: t.destinationWalletId,
      amount: t.amount,
      description: t.description,
      createdAt: t.createdAt,
    }))
    if (params?.tenantId) entries = entries.filter((e) => e.tenantId === params.tenantId)
    if (params?.walletId) entries = entries.filter((e) => e.debitWalletId === params.walletId || e.creditWalletId === params.walletId)
    entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (params?.limit) entries = entries.slice(0, params.limit)
    return entries
  }

  async getEntry(id: string): Promise<LedgerEntry | null> {
    await delay(50)
    const entries = await this.listEntries()
    return entries.find((e) => e.id === id) || null
  }

  async getWalletLedger(walletId: string): Promise<LedgerEntry[]> {
    return this.listEntries({ walletId })
  }
}
