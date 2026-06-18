import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ILedgerService } from "./ILedgerService"
import type { LedgerEntry } from "@/types"

const COLLECTION = "transactions"

function toEntry(id: string, data: Record<string, unknown>): LedgerEntry {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    transactionId: (data.id as string) || id,
    referenceNumber: (data.referenceNumber as string) || "",
    debitWalletId: (data.sourceWalletId as string) || "",
    creditWalletId: (data.destinationWalletId as string) || "",
    amount: (data.amount as number) || 0,
    description: (data.description as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseLedgerService implements ILedgerService {
  private db = getFirestoreDb()

  async listEntries(params?: { tenantId?: string; walletId?: string; limit?: number }): Promise<LedgerEntry[]> {
    const col = collection(this.db, COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.walletId) constraints.unshift(where("sourceWalletId", "==", params.walletId))
    if (params?.limit) constraints.push(limit(params.limit))
    const snap = await getDocs(query(col, ...constraints))
    let entries = snap.docs.map((d) => toEntry(d.id, d.data() as Record<string, unknown>))
    if (params?.walletId) {
      const q2 = query(col, where("destinationWalletId", "==", params.walletId), orderBy("createdAt", "desc"))
      const snap2 = await getDocs(q2)
      entries = [...entries, ...snap2.docs.map((d) => toEntry(d.id, d.data() as Record<string, unknown>))]
      entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      if (params?.limit) entries = entries.slice(0, params.limit)
    }
    return entries
  }

  async getEntry(id: string): Promise<LedgerEntry | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toEntry(snap.id, snap.data() as Record<string, unknown>)
  }

  async getWalletLedger(walletId: string): Promise<LedgerEntry[]> {
    return this.listEntries({ walletId })
  }
}
