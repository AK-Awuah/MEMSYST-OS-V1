import {
  collection, getDocs, doc, getDoc,
  query, where, Timestamp, addDoc,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICredentialVerificationService, VerificationResult } from "./ICredentialVerificationService"
import type { VerificationRecord, PublicVerificationStatus, VerificationMethod } from "@/types"

const ID_CARD_COL = "idCards"
const CERTIFICATE_COL = "certificates"
const HISTORY_COL = "verificationHistory"

function determineStatus(data: Record<string, unknown>): PublicVerificationStatus {
  const status = data.status as string
  if (status === "cancelled") return "cancelled"
  if (status === "expired") return "expired"
  if (status === "active" || status === "printed" || status === "unprinted") return "valid"
  return "invalid"
}

function toVerificationRecord(id: string, data: Record<string, unknown>): VerificationRecord {
  return {
    id,
    credentialId: (data.credentialId as string) || "",
    credentialType: (data.credentialType as VerificationRecord["credentialType"]) || "id_card",
    method: (data.method as VerificationMethod) || "verification_code",
    status: (data.status as PublicVerificationStatus) || "invalid",
    holderName: (data.holderName as string) || "",
    organization: (data.organization as string) || "",
    issueDate: (data.issueDate as string) || "",
    expiryDate: data.expiryDate as string | undefined,
    verifiedAt: data.verifiedAt instanceof Timestamp
      ? data.verifiedAt.toDate().toISOString()
      : (data.verifiedAt as string) || "",
    ipAddress: data.ipAddress as string | undefined,
  }
}

export class FirebaseCredentialVerificationService implements ICredentialVerificationService {
  private db = getFirestoreDb()

  async verifyByCode(code: string): Promise<VerificationResult> {
    const [idCardSnap, certSnap] = await Promise.all([
      getDocs(query(collection(this.db, ID_CARD_COL), where("verificationCode", "==", code))),
      getDocs(query(collection(this.db, CERTIFICATE_COL), where("verificationCode", "==", code))),
    ])
    let data: Record<string, unknown> | null = null
    let credentialType: "id_card" | "certificate" = "id_card"
    if (!idCardSnap.empty) {
      data = idCardSnap.docs[0].data() as Record<string, unknown>
      data.id = idCardSnap.docs[0].id
      credentialType = "id_card"
    } else if (!certSnap.empty) {
      data = certSnap.docs[0].data() as Record<string, unknown>
      data.id = certSnap.docs[0].id
      credentialType = "certificate"
    }
    if (!data) throw new Error("Credential not found")
    return this.buildVerificationResult(data, credentialType)
  }

  async verifyByNumber(credentialNumber: string): Promise<VerificationResult> {
    const [idCardSnap, certSnap] = await Promise.all([
      getDocs(query(collection(this.db, ID_CARD_COL), where("credentialNumber", "==", credentialNumber))),
      getDocs(query(collection(this.db, CERTIFICATE_COL), where("credentialNumber", "==", credentialNumber))),
    ])
    let data: Record<string, unknown> | null = null
    let credentialType: "id_card" | "certificate" = "id_card"
    if (!idCardSnap.empty) {
      data = idCardSnap.docs[0].data() as Record<string, unknown>
      data.id = idCardSnap.docs[0].id
      credentialType = "id_card"
    } else if (!certSnap.empty) {
      data = certSnap.docs[0].data() as Record<string, unknown>
      data.id = certSnap.docs[0].id
      credentialType = "certificate"
    }
    if (!data) throw new Error("Credential not found")
    return this.buildVerificationResult(data, credentialType)
  }

  async verifyByQR(qrData: string): Promise<VerificationResult> {
    const [idCardSnap, certSnap] = await Promise.all([
      getDocs(query(collection(this.db, ID_CARD_COL), where("qrCode", "==", qrData))),
      getDocs(query(collection(this.db, CERTIFICATE_COL), where("qrCode", "==", qrData))),
    ])
    let data: Record<string, unknown> | null = null
    let credentialType: "id_card" | "certificate" = "id_card"
    if (!idCardSnap.empty) {
      data = idCardSnap.docs[0].data() as Record<string, unknown>
      data.id = idCardSnap.docs[0].id
      credentialType = "id_card"
    } else if (!certSnap.empty) {
      data = certSnap.docs[0].data() as Record<string, unknown>
      data.id = certSnap.docs[0].id
      credentialType = "certificate"
    }
    if (!data) throw new Error("Credential not found")
    return this.buildVerificationResult(data, credentialType)
  }

  async getVerificationHistory(credentialId: string): Promise<VerificationRecord[]> {
    const col = collection(this.db, HISTORY_COL)
    const snap = await getDocs(query(col, where("credentialId", "==", credentialId)))
    return snap.docs.map((d) => toVerificationRecord(d.id, d.data() as Record<string, unknown>))
  }

  private async buildVerificationResult(data: Record<string, unknown>, credentialType: "id_card" | "certificate"): Promise<VerificationResult> {
    const status = determineStatus(data)
    const holderName = credentialType === "id_card"
      ? (data.fullName as string) || ""
      : (data.recipientName as string) || ""
    const credentialNumber = credentialType === "id_card"
      ? (data.cardNumber as string) || ""
      : (data.certificateNumber as string) || ""
    const result: VerificationResult = {
      status,
      holderName,
      organization: (data.organization as string) || "",
      issueDate: (data.issueDate as string) || "",
      expiryDate: data.expiryDate as string | undefined,
      credentialType,
      credentialNumber,
    }
    await addDoc(collection(this.db, HISTORY_COL), {
      credentialId: data.id as string || "",
      credentialType,
      method: "verification_code",
      status,
      holderName,
      organization: (data.organization as string) || "",
      issueDate: (data.issueDate as string) || "",
      expiryDate: data.expiryDate as string | undefined,
      verifiedAt: new Date().toISOString(),
    })
    return result
  }
}
