import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IIDCardService } from "./IIDCardService"
import type { IDCard, IDCardStatus } from "@/types"

const COLLECTION = "idCards"

function toIDCard(id: string, data: Record<string, unknown>): IDCard {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    ownerId: (data.ownerId as string) || "",
    ownerType: (data.ownerType as IDCard["ownerType"]) || "member",
    cardNumber: (data.cardNumber as string) || "",
    credentialNumber: (data.credentialNumber as string) || "",
    status: (data.status as IDCardStatus) || "unprinted",
    issueDate: (data.issueDate as string) || "",
    expiryDate: (data.expiryDate as string) || "",
    fullName: (data.fullName as string) || "",
    membershipNumber: (data.membershipNumber as string) || "",
    category: (data.category as string) || "",
    organization: (data.organization as string) || "",
    branch: (data.branch as string) || "",
    region: (data.region as string) || "",
    photo: (data.photo as string) || "",
    qrCode: (data.qrCode as string) || "",
    verificationCode: (data.verificationCode as string) || "",
    reprintCount: (data.reprintCount as number) || 0,
    lastPrintedAt: data.lastPrintedAt as string | undefined,
    cancelledAt: data.cancelledAt as string | undefined,
    cancellationReason: data.cancellationReason as string | undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseIDCardService implements IIDCardService {
  private db = getFirestoreDb()

  async listIDCards(tenantId: string, params?: { status?: IDCardStatus; ownerType?: string }): Promise<IDCard[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.ownerType) constraints.unshift(where("ownerType", "==", params.ownerType))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toIDCard(d.id, d.data() as Record<string, unknown>))
  }

  async getIDCard(id: string): Promise<IDCard | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toIDCard(snap.id, snap.data() as Record<string, unknown>)
  }

  async createIDCard(data: Omit<IDCard, "id" | "createdAt" | "updatedAt">): Promise<IDCard> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getIDCard(ref.id) as Promise<IDCard>
  }

  async updateIDCard(id: string, data: Partial<IDCard>): Promise<IDCard> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getIDCard(id) as Promise<IDCard>
  }

  async updateIDCardStatus(id: string, status: IDCardStatus, reason?: string): Promise<IDCard> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status, updatedAt: new Date().toISOString(),
      ...(reason ? { cancellationReason: reason } : {}),
    })
    return this.getIDCard(id) as Promise<IDCard>
  }

  async cancelIDCard(id: string, reason: string, cancelledBy: string): Promise<IDCard> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason,
      updatedAt: new Date().toISOString(),
    })
    return this.getIDCard(id) as Promise<IDCard>
  }

  async getIDCardsByOwner(ownerId: string, ownerType: string): Promise<IDCard[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("ownerId", "==", ownerId), where("ownerType", "==", ownerType)))
    return snap.docs.map((d) => toIDCard(d.id, d.data() as Record<string, unknown>))
  }
}
