import type { IWalletService } from "./IWalletService"
import type { Wallet, WalletType, WalletStatus } from "@/types"
import { sharedWallets } from "./shared-store"
import { delay } from "./shared-store"

let wallets = [...sharedWallets]

export class MockWalletService implements IWalletService {
  async listWallets(params?: { tenantId?: string; type?: WalletType; status?: WalletStatus }): Promise<Wallet[]> {
    await delay(100)
    let result = [...wallets]
    if (params?.tenantId) result = result.filter((w) => w.tenantId === params.tenantId)
    if (params?.type) result = result.filter((w) => w.type === params.type)
    if (params?.status) result = result.filter((w) => w.status === params.status)
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getWallet(id: string): Promise<Wallet | null> {
    await delay(50)
    return wallets.find((w) => w.id === id) || null
  }

  async createWallet(data: Omit<Wallet, "id" | "createdAt" | "updatedAt">): Promise<Wallet> {
    await delay(150)
    const wallet: Wallet = { ...data, id: `wallet-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    wallets.unshift(wallet)
    return wallet
  }

  async updateWallet(id: string, data: Partial<Wallet>): Promise<Wallet> {
    await delay(100)
    const idx = wallets.findIndex((w) => w.id === id)
    if (idx === -1) throw new Error("Wallet not found")
    wallets[idx] = { ...wallets[idx], ...data, updatedAt: new Date().toISOString() }
    return wallets[idx]
  }

  async getWalletBalance(id: string): Promise<{ balance: number; lockedBalance: number; availableBalance: number }> {
    await delay(50)
    const wallet = wallets.find((w) => w.id === id)
    if (!wallet) throw new Error("Wallet not found")
    return { balance: wallet.balance, lockedBalance: wallet.lockedBalance, availableBalance: wallet.balance - wallet.lockedBalance }
  }

  async suspendWallet(id: string): Promise<void> {
    await delay(100)
    const idx = wallets.findIndex((w) => w.id === id)
    if (idx === -1) throw new Error("Wallet not found")
    wallets[idx] = { ...wallets[idx], status: "suspended", updatedAt: new Date().toISOString() }
  }

  async activateWallet(id: string): Promise<void> {
    await delay(100)
    const idx = wallets.findIndex((w) => w.id === id)
    if (idx === -1) throw new Error("Wallet not found")
    wallets[idx] = { ...wallets[idx], status: "active", updatedAt: new Date().toISOString() }
  }

  async getWalletStats(tenantId?: string): Promise<{ totalWallets: number; activeWallets: number; totalBalance: number; totalLocked: number }> {
    await delay(100)
    const filtered = tenantId ? wallets.filter((w) => w.tenantId === tenantId) : wallets
    return {
      totalWallets: filtered.length,
      activeWallets: filtered.filter((w) => w.status === "active").length,
      totalBalance: filtered.reduce((s, w) => s + w.balance, 0),
      totalLocked: filtered.reduce((s, w) => s + w.lockedBalance, 0),
    }
  }
}
