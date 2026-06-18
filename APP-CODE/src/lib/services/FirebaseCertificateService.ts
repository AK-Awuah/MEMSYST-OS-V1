import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICertificateService } from "./ICertificateService"
import type { Certificate, CertificateStatus } from "@/types"

const COLLECTION = "certificates"

function toCertificate(id: string, data: Record<string, unknown>): Certificate {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    ownerId: (data.ownerId as string) || "",
    certificateType: (data.certificateType as Certificate["certificateType"]) || "membership",
    certificateNumber: (data.certificateNumber as string) || "",
    credentialNumber: (data.credentialNumber as string) || "",
    status: (data.status as CertificateStatus) || "unprinted",
    issueDate: (data.issueDate as string) || "",
    expiryDate: data.expiryDate as string | undefined,
    recipientName: (data.recipientName as string) || "",
    organization: (data.organization as string) || "",
    program: (data.program as string) || "",
    verificationCode: (data.verificationCode as string) || "",
    qrCode: (data.qrCode as string) || "",
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

export class FirebaseCertificateService implements ICertificateService {
  private db = getFirestoreDb()

  async listCertificates(tenantId: string, params?: { status?: CertificateStatus; certificateType?: string }): Promise<Certificate[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    if (params?.certificateType) constraints.unshift(where("certificateType", "==", params.certificateType))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toCertificate(d.id, d.data() as Record<string, unknown>))
  }

  async getCertificate(id: string): Promise<Certificate | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toCertificate(snap.id, snap.data() as Record<string, unknown>)
  }

  async createCertificate(data: Omit<Certificate, "id" | "createdAt" | "updatedAt">): Promise<Certificate> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getCertificate(ref.id) as Promise<Certificate>
  }

  async updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getCertificate(id) as Promise<Certificate>
  }

  async updateCertificateStatus(id: string, status: CertificateStatus, reason?: string): Promise<Certificate> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status, updatedAt: new Date().toISOString(),
      ...(reason ? { cancellationReason: reason } : {}),
    })
    return this.getCertificate(id) as Promise<Certificate>
  }

  async cancelCertificate(id: string, reason: string, cancelledBy: string): Promise<Certificate> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason,
      updatedAt: new Date().toISOString(),
    })
    return this.getCertificate(id) as Promise<Certificate>
  }

  async getCertificatesByOwner(ownerId: string): Promise<Certificate[]> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("ownerId", "==", ownerId)))
    return snap.docs.map((d) => toCertificate(d.id, d.data() as Record<string, unknown>))
  }
}
