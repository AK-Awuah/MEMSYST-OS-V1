import type { Wallet, WalletType, WalletStatus } from "@/types"

export interface IWalletService {
  listWallets(params?: { tenantId?: string; type?: WalletType; status?: WalletStatus }): Promise<Wallet[]>
  getWallet(id: string): Promise<Wallet | null>
  createWallet(data: Omit<Wallet, "id" | "createdAt" | "updatedAt">): Promise<Wallet>
  updateWallet(id: string, data: Partial<Wallet>): Promise<Wallet>
  getWalletBalance(id: string): Promise<{ balance: number; lockedBalance: number; availableBalance: number }>
  suspendWallet(id: string): Promise<void>
  activateWallet(id: string): Promise<void>
  getWalletStats(tenantId?: string): Promise<{ totalWallets: number; activeWallets: number; totalBalance: number; totalLocked: number }>
}
