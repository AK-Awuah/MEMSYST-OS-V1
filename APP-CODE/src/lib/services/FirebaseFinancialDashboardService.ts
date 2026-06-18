import { collection, getDocs, query, where, orderBy, limit, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IFinancialDashboardService } from "./IFinancialDashboardService"
import type { FinancialDashboardMetrics, Transaction } from "@/types"

export class FirebaseFinancialDashboardService implements IFinancialDashboardService {
  private db = getFirestoreDb()

  async getPlatformMetrics(): Promise<FinancialDashboardMetrics> {
    const [walletSnap, txnSnap, commSnap, bSnap, wdSnap] = await Promise.all([
      getDocs(collection(this.db, "wallets")),
      getDocs(collection(this.db, "transactions")),
      getDocs(collection(this.db, "commissions")),
      getDocs(collection(this.db, "bills")),
      getDocs(collection(this.db, "withdrawals")),
    ])
    const wallets = walletSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const txns = txnSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const commissions = commSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const bills = bSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const withdrawals = wdSnap.docs.map((d) => d.data() as Record<string, unknown>)
    return this.computeMetrics(wallets, txns, commissions, bills, withdrawals)
  }

  async getTenantMetrics(tenantId: string): Promise<FinancialDashboardMetrics> {
    const [walletSnap, txnSnap, commSnap, bSnap, wdSnap] = await Promise.all([
      getDocs(query(collection(this.db, "wallets"), where("tenantId", "==", tenantId))),
      getDocs(query(collection(this.db, "transactions"), where("tenantId", "==", tenantId))),
      getDocs(query(collection(this.db, "commissions"), where("tenantId", "==", tenantId))),
      getDocs(query(collection(this.db, "bills"), where("tenantId", "==", tenantId))),
      getDocs(query(collection(this.db, "withdrawals"), where("tenantId", "==", tenantId))),
    ])
    const wallets = walletSnap.docs.map((d) => ({ id: d.id, ...d.data() as Record<string, unknown> }))
    const txns = txnSnap.docs.map((d) => ({ id: d.id, ...d.data() as Record<string, unknown> }))
    const commissions = commSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const bills = bSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const withdrawals = wdSnap.docs.map((d) => d.data() as Record<string, unknown>)
    return this.computeMetrics(wallets, txns, commissions, bills, withdrawals)
  }

  async getBranchMetrics(tenantId: string, branchId: string): Promise<FinancialDashboardMetrics> {
    const walletSnap = await getDocs(query(collection(this.db, "wallets"), where("ownerId", "==", branchId), where("type", "==", "branch"), limit(1)))
    const wallet = walletSnap.docs[0]
    if (!wallet) return this.emptyMetrics()
    const txnSnap = await getDocs(query(collection(this.db, "transactions"), where("sourceWalletId", "==", wallet.id)))
    const txns = txnSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const wData = wallet.data() as Record<string, unknown>
    return {
      totalRevenue: txns.filter((t) => (t.status as string) === "successful").reduce((s, t) => s + ((t.amount as number) || 0), 0),
      totalCommissions: 0,
      messagingRevenue: 0,
      activeWallets: 1,
      transactionVolume: txns.length,
      pendingWithdrawals: 0,
      totalLockedFunds: (wData.lockedBalance as number) || 0,
      totalWalletUnits: (wData.balance as number) || 0,
      totalCollections: txns.filter((t) => (t.status as string) === "successful").reduce((s, t) => s + ((t.amount as number) || 0), 0),
      outstandingBills: 0,
    }
  }

  async getRecentTransactions(params?: { tenantId?: string; limit?: number }): Promise<Transaction[]> {
    const col = collection(this.db, "transactions")
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.limit) constraints.push(limit(params.limit))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>
      return {
        id: d.id,
        tenantId: (data.tenantId as string) || "",
        referenceNumber: (data.referenceNumber as string) || "",
        sourceWalletId: (data.sourceWalletId as string) || "",
        destinationWalletId: (data.destinationWalletId as string) || "",
        amount: (data.amount as number) || 0,
        fee: (data.fee as number) || 0,
        commission: (data.commission as number) || 0,
        netAmount: (data.netAmount as number) || 0,
        type: (data.type as Transaction["type"]) || "payment",
        status: (data.status as Transaction["status"]) || "pending",
        description: (data.description as string) || "",
        metadata: (data.metadata as Record<string, unknown>) || undefined,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
      }
    })
  }

  private computeMetrics(wallets: Record<string, unknown>[], txns: Record<string, unknown>[], commissions: Record<string, unknown>[], bills: Record<string, unknown>[], withdrawals: Record<string, unknown>[]): FinancialDashboardMetrics {
    const wMap = (d: Record<string, unknown>) => ({ status: d.status as string, balance: d.balance as number, lockedBalance: d.lockedBalance as number })
    const tMap = (d: Record<string, unknown>) => ({ status: d.status as string, amount: d.amount as number })
    const cMap = (d: Record<string, unknown>) => ({ amount: d.amount as number })
    const bMap = (d: Record<string, unknown>) => ({ status: d.status as string, amount: d.amount as number, paidAmount: d.paidAmount as number })
    const wdMap = (d: Record<string, unknown>) => ({ status: d.status as string })
    return {
      totalRevenue: txns.map(tMap).filter((t) => t.status === "successful").reduce((s, t) => s + t.amount, 0),
      totalCommissions: commissions.map(cMap).reduce((s, c) => s + c.amount, 0),
      messagingRevenue: 0,
      activeWallets: wallets.map(wMap).filter((w) => w.status === "active").length,
      transactionVolume: txns.length,
      pendingWithdrawals: withdrawals.map(wdMap).filter((w) => ["submitted", "under_review", "platform_review"].includes(w.status)).length,
      totalLockedFunds: wallets.map(wMap).reduce((s, w) => s + w.lockedBalance, 0),
      totalWalletUnits: wallets.map(wMap).reduce((s, w) => s + w.balance, 0),
      totalCollections: txns.map(tMap).filter((t) => t.status === "successful").reduce((s, t) => s + t.amount, 0),
      outstandingBills: bills.map(bMap).filter((b) => ["due", "overdue", "partially_paid"].includes(b.status)).reduce((s, b) => s + (b.amount - b.paidAmount), 0),
    }
  }

  private emptyMetrics(): FinancialDashboardMetrics {
    return { totalRevenue: 0, totalCommissions: 0, messagingRevenue: 0, activeWallets: 0, transactionVolume: 0, pendingWithdrawals: 0, totalLockedFunds: 0, totalWalletUnits: 0, totalCollections: 0, outstandingBills: 0 }
  }
}
