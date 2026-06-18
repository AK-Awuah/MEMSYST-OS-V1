import type { VerificationRecord, PublicVerificationStatus, VerificationMethod } from "@/types"

export interface VerificationResult {
  status: PublicVerificationStatus
  holderName: string
  organization: string
  issueDate: string
  expiryDate?: string
  credentialType: "id_card" | "certificate"
  credentialNumber: string
}

export interface ICredentialVerificationService {
  verifyByCode(code: string): Promise<VerificationResult>
  verifyByNumber(credentialNumber: string): Promise<VerificationResult>
  verifyByQR(qrData: string): Promise<VerificationResult>
  getVerificationHistory(credentialId: string): Promise<VerificationRecord[]>
}
