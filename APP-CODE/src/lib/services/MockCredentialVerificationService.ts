import type { ICredentialVerificationService, VerificationResult } from "./ICredentialVerificationService"
import type { VerificationRecord, VerificationMethod } from "@/types"
import { mockIDCards, mockCertificates, mockVerificationRecords } from "./mock-data"
import { delay } from "./shared-store"

export class MockCredentialVerificationService implements ICredentialVerificationService {
  private idCards = [...mockIDCards]
  private certificates = [...mockCertificates]
  private records = [...mockVerificationRecords]

  async verifyByCode(code: string): Promise<VerificationResult> {
    await delay(200)
    const idCard = this.idCards.find((c) => c.verificationCode === code)
    if (idCard) return this.buildResult(idCard, "id_card", idCard.verificationCode, idCard.cardNumber)
    const cert = this.certificates.find((c) => c.verificationCode === code)
    if (cert) return this.buildResult(cert, "certificate", cert.verificationCode, cert.certificateNumber)
    return { status: "invalid", holderName: "", organization: "", issueDate: "", credentialType: "id_card", credentialNumber: "" }
  }

  async verifyByNumber(credentialNumber: string): Promise<VerificationResult> {
    await delay(200)
    const idCard = this.idCards.find((c) => c.cardNumber === credentialNumber || c.credentialNumber === credentialNumber)
    if (idCard) return this.buildResult(idCard, "id_card", idCard.verificationCode, idCard.cardNumber)
    const cert = this.certificates.find((c) => c.certificateNumber === credentialNumber || c.credentialNumber === credentialNumber)
    if (cert) return this.buildResult(cert, "certificate", cert.verificationCode, cert.certificateNumber)
    return { status: "invalid", holderName: "", organization: "", issueDate: "", credentialType: "id_card", credentialNumber: "" }
  }

  async verifyByQR(qrData: string): Promise<VerificationResult> {
    await delay(200)
    const idCard = this.idCards.find((c) => c.qrCode === qrData)
    if (idCard) return this.buildResult(idCard, "id_card", idCard.verificationCode, idCard.cardNumber)
    const cert = this.certificates.find((c) => c.qrCode === qrData)
    if (cert) return this.buildResult(cert, "certificate", cert.verificationCode, cert.certificateNumber)
    return { status: "invalid", holderName: "", organization: "", issueDate: "", credentialType: "id_card", credentialNumber: "" }
  }

  async getVerificationHistory(credentialId: string): Promise<VerificationRecord[]> {
    await delay(100)
    return this.records.filter((r) => r.credentialId === credentialId)
  }

  private buildResult(item: any, credentialType: "id_card" | "certificate", verificationCode: string, credentialNumber: string): VerificationResult {
    const now = new Date()
    const expiry = item.expiryDate ? new Date(item.expiryDate) : null
    let status: VerificationResult["status"]
    if (item.status === "cancelled") status = "cancelled"
    else if (item.status === "expired" || (expiry && expiry < now)) status = "expired"
    else status = "valid"
    return {
      status,
      holderName: item.fullName || item.recipientName || "",
      organization: item.organization,
      issueDate: item.issueDate,
      expiryDate: item.expiryDate,
      credentialType,
      credentialNumber,
    }
  }
}
