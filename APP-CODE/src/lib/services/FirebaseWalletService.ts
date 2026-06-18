import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IWalletService } from "./IWalletService"
import type { Wallet, WalletType, WalletStatus } from "@/types"

const COLLECTION = "wallets"

function toWallet(id: string, data: Record<string, unknown>): Wallet {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    type: (data.type as WalletType) || "tenant",
    ownerId: (data.ownerId as string) || "",
    ownerName: (data.ownerName as string) || "",
    balance: (data.balance as number) || 0,
    lockedBalance: (data.lockedBalance as number) || 0,
    currency: (data.currency as string) || "GHS",
    status: (data.status as WalletStatus) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseWalletService implements IWalletService {
  private db = getFirestoreDb()

  async listWallets(params?: { tenantId?: string; type?: WalletType; status?: WalletStatus }): Promise<Wallet[]> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.type) constraints.unshift(where("type", "==", params.type))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toWallet(d.id, d.data() as Record<string, unknown>))
  }

  async getWallet(id: string): Promise<Wallet | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toWallet(snap.id, snap.data() as Record<string, unknown>)
  }

  async createWallet(data: Omit<Wallet, "id" | "createdAt" | "updatedAt">): Promise<Wallet> {
    const ref = await addDoc(collection(this.db, COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getWallet(ref.id) as Promise<Wallet>
  }

  async updateWallet(id: string, data: Partial<Wallet>): Promise<Wallet> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getWallet(id) as Promise<Wallet>
  }

  async getWalletBalance(id: string): Promise<{ balance: number; lockedBalance: number; availableBalance: number }> {
    const wallet = await this.getWallet(id)
    if (!wallet) throw new Error("Wallet not found")
    return { balance: wallet.balance, lockedBalance: wallet.lockedBalance, availableBalance: wallet.balance - wallet.lockedBalance }
  }

  async suspendWallet(id: string): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), { status: "suspended", updatedAt: new Date().toISOString() })
  }

  async activateWallet(id: string): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), { status: "active", updatedAt: new Date().toISOString() })
  }

  async getWalletStats(tenantId?: string): Promise<{ totalWallets: number; activeWallets: number; totalBalance: number; totalLocked: number }> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = []
    if (tenantId) constraints.push(where("tenantId", "==", tenantId))
    const snap = await getDocs(query(col, ...constraints))
    const wallets = snap.docs.map((d) => toWallet(d.id, d.data() as Record<string, unknown>))
    return {
      totalWallets: wallets.length,
      activeWallets: wallets.filter((w) => w.status === "active").length,
      totalBalance: wallets.reduce((s, w) => s + w.balance, 0),
      totalLocked: wallets.reduce((s, w) => s + w.lockedBalance, 0),
    }
  }
}
