import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IPrintingService } from "./IPrintingService"
import type { PrintRequest, PrintRequestStatus } from "@/types"

const COLLECTION = "printRequests"

function toPrintRequest(id: string, data: Record<string, unknown>): PrintRequest {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    credentialId: (data.credentialId as string) || "",
    credentialType: (data.credentialType as PrintRequest["credentialType"]) || "id_card",
    requestType: (data.requestType as PrintRequest["requestType"]) || "print",
    status: (data.status as PrintRequestStatus) || "pending",
    requestedBy: (data.requestedBy as string) || "",
    requestedById: (data.requestedById as string) || "",
    reason: data.reason as string | undefined,
    fee: data.fee as number | undefined,
    billingId: data.billingId as string | undefined,
    reprintCount: data.reprintCount as number | undefined,
    completedAt: data.completedAt as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebasePrintingService implements IPrintingService {
  private db = getFirestoreDb()

  async listPrintRequests(tenantId: string, params?: { status?: PrintRequestStatus; credentialType?: string }): Promise<PrintRequest[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.credentialType) constraints.unshift(where("credentialType", "==", params.credentialType))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toPrintRequest(d.id, d.data() as Record<string, unknown>))
  }

  async getPrintRequest(id: string): Promise<PrintRequest | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toPrintRequest(snap.id, snap.data() as Record<string, unknown>)
  }

  async createPrintRequest(data: Omit<PrintRequest, "id" | "createdAt" | "updatedAt">): Promise<PrintRequest> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getPrintRequest(ref.id) as Promise<PrintRequest>
  }

  async updatePrintRequestStatus(id: string, status: PrintRequestStatus): Promise<PrintRequest> {
    await updateDoc(doc(this.db, COLLECTION, id), { status, updatedAt: new Date().toISOString() })
    return this.getPrintRequest(id) as Promise<PrintRequest>
  }

  async approvePrintRequest(id: string): Promise<PrintRequest> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status: "approved", updatedAt: new Date().toISOString(),
    })
    return this.getPrintRequest(id) as Promise<PrintRequest>
  }

  async completePrintRequest(id: string): Promise<PrintRequest> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status: "completed", completedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    })
    return this.getPrintRequest(id) as Promise<PrintRequest>
  }

  async getPrintQueue(tenantId: string): Promise<PrintRequest[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(
      col,
      where("tenantId", "==", tenantId),
      where("status", "in", ["pending", "approved"]),
      orderBy("createdAt", "asc"),
    ))
    return snap.docs.map((d) => toPrintRequest(d.id, d.data() as Record<string, unknown>))
  }
}
