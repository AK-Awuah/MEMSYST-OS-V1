import { collection, addDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICredentialGenerationService, GenerationTrigger } from "./ICredentialGenerationService"
import type { IDCard, Certificate } from "@/types"

const ID_CARD_COL = "idCards"
const CERTIFICATE_COL = "certificates"

function generateVerificationCode(): string {
  return `V${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

export class FirebaseCredentialGenerationService implements ICredentialGenerationService {
  private db = getFirestoreDb()

  async generateIDCard(trigger: GenerationTrigger, ownerId: string, tenantId: string): Promise<IDCard> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, ID_CARD_COL), {
      tenantId,
      ownerId,
      ownerType: trigger === "apprentice_upgraded" ? "apprentice" : trigger === "executive_appointed" ? "executive" : "member",
      cardNumber: `ID-${Date.now()}`,
      credentialNumber: `CRED-${Date.now()}`,
      status: "unprinted",
      issueDate: now,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      fullName: "",
      membershipNumber: "",
      category: "",
      organization: "",
      branch: "",
      region: "",
      photo: "",
      qrCode: "",
      verificationCode: generateVerificationCode(),
      reprintCount: 0,
      createdAt: now,
      updatedAt: now,
    })
    const snap = await this.getIDCardById(ref.id)
    return snap!
  }

  async generateCertificate(trigger: GenerationTrigger, ownerId: string, tenantId: string, certificateType: string): Promise<Certificate> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, CERTIFICATE_COL), {
      tenantId,
      ownerId,
      certificateType,
      certificateNumber: `CERT-${Date.now()}`,
      credentialNumber: `CRED-${Date.now()}`,
      status: "unprinted",
      issueDate: now,
      recipientName: "",
      organization: "",
      program: "",
      verificationCode: generateVerificationCode(),
      qrCode: "",
      reprintCount: 0,
      createdAt: now,
      updatedAt: now,
    })
    const snap = await this.getCertificateById(ref.id)
    return snap!
  }

  async previewIDCard(ownerId: string, tenantId: string): Promise<Partial<IDCard>> {
    return {
      ownerId,
      tenantId,
      cardNumber: `ID-${Date.now()}`,
      credentialNumber: `CRED-${Date.now()}`,
      status: "unprinted",
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      verificationCode: generateVerificationCode(),
      reprintCount: 0,
    }
  }

  async previewCertificate(ownerId: string, tenantId: string, certificateType: string): Promise<Partial<Certificate>> {
    return {
      ownerId,
      tenantId,
      certificateType: certificateType as Certificate["certificateType"],
      certificateNumber: `CERT-${Date.now()}`,
      credentialNumber: `CRED-${Date.now()}`,
      status: "unprinted",
      issueDate: new Date().toISOString(),
      verificationCode: generateVerificationCode(),
      reprintCount: 0,
    }
  }

  private async getIDCardById(id: string): Promise<IDCard | null> {
    const { getDoc, doc } = await import("firebase/firestore")
    const snap = await getDoc(doc(this.db, ID_CARD_COL, id))
    if (!snap.exists()) return null
    const data = snap.data() as Record<string, unknown>
    return {
      id: snap.id,
      tenantId: (data.tenantId as string) || "",
      ownerId: (data.ownerId as string) || "",
      ownerType: (data.ownerType as IDCard["ownerType"]) || "member",
      cardNumber: (data.cardNumber as string) || "",
      credentialNumber: (data.credentialNumber as string) || "",
      status: (data.status as IDCard["status"]) || "unprinted",
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
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
    }
  }

  private async getCertificateById(id: string): Promise<Certificate | null> {
    const { getDoc, doc } = await import("firebase/firestore")
    const snap = await getDoc(doc(this.db, CERTIFICATE_COL, id))
    if (!snap.exists()) return null
    const data = snap.data() as Record<string, unknown>
    return {
      id: snap.id,
      tenantId: (data.tenantId as string) || "",
      ownerId: (data.ownerId as string) || "",
      certificateType: (data.certificateType as Certificate["certificateType"]) || "membership",
      certificateNumber: (data.certificateNumber as string) || "",
      credentialNumber: (data.credentialNumber as string) || "",
      status: (data.status as Certificate["status"]) || "unprinted",
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
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
    }
  }
}
