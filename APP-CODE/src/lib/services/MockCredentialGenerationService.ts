import type { ICredentialGenerationService, GenerationTrigger } from "./ICredentialGenerationService"
import type { IDCard, Certificate } from "@/types"
import { mockMembers, mockIDCards, mockCertificates } from "./mock-data"
import { delay } from "./shared-store"

export class MockCredentialGenerationService implements ICredentialGenerationService {
  private idCards = [...mockIDCards]
  private certificates = [...mockCertificates]

  async generateIDCard(trigger: GenerationTrigger, ownerId: string, tenantId: string): Promise<IDCard> {
    await delay(300)
    const member = mockMembers.find((m) => m.id === ownerId)
    const now = new Date()
    const expiry = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate())
    const card: IDCard = {
      id: `idc-${Date.now()}`,
      tenantId,
      ownerId,
      ownerType: trigger === "member_approved" ? "member" : trigger === "apprentice_upgraded" ? "apprentice" : "executive",
      cardNumber: `GMA-ID-${String(this.idCards.length + 1).padStart(4, "0")}`,
      credentialNumber: `CRED-ID-${String(this.idCards.length + 1).padStart(4, "0")}`,
      status: "unprinted",
      issueDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
      fullName: member ? `${member.firstName} ${member.lastName}` : "Unknown",
      membershipNumber: member?.membershipNumber || "",
      category: member?.category || "",
      organization: member ? "Ghana Medical Association" : "",
      branch: member?.branchId || "",
      region: member?.regionId || "",
      photo: "",
      qrCode: `qr-gma-id-${Date.now()}`,
      verificationCode: `VER-ID-${Date.now()}`,
      reprintCount: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
    this.idCards.push(card)
    return card
  }

  async generateCertificate(trigger: GenerationTrigger, ownerId: string, tenantId: string, certificateType: string): Promise<Certificate> {
    await delay(300)
    const member = mockMembers.find((m) => m.id === ownerId)
    const now = new Date()
    const cert: Certificate = {
      id: `cert-${Date.now()}`,
      tenantId,
      ownerId,
      certificateType: certificateType as Certificate["certificateType"],
      certificateNumber: `GMA-CERT-${String(this.certificates.length + 1).padStart(4, "0")}`,
      credentialNumber: `CRED-CERT-${String(this.certificates.length + 1).padStart(4, "0")}`,
      status: "active",
      issueDate: now.toISOString(),
      recipientName: member ? `${member.firstName} ${member.lastName}` : "Unknown",
      organization: "Ghana Medical Association",
      program: certificateType === "membership" ? "Full Membership" : certificateType === "training" ? "Training Completion" : certificateType === "executive_appointment" ? "Executive Appointment" : certificateType,
      verificationCode: `VER-CERT-${Date.now()}`,
      qrCode: `qr-gma-cert-${Date.now()}`,
      reprintCount: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
    this.certificates.push(cert)
    return cert
  }

  async previewIDCard(ownerId: string, tenantId: string): Promise<Partial<IDCard>> {
    await delay(150)
    const member = mockMembers.find((m) => m.id === ownerId)
    return {
      tenantId,
      ownerId,
      ownerType: "member",
      fullName: member ? `${member.firstName} ${member.lastName}` : "Preview Name",
      membershipNumber: member?.membershipNumber || "MEM-XXXX",
      category: member?.category || "Standard",
      organization: "Ghana Medical Association",
      branch: member?.branchId || "Branch",
      region: member?.regionId || "Region",
      status: "unprinted",
      issueDate: new Date().toISOString(),
      expiryDate: new Date(new Date().getFullYear() + 2, new Date().getMonth(), new Date().getDate()).toISOString(),
    }
  }

  async previewCertificate(ownerId: string, tenantId: string, certificateType: string): Promise<Partial<Certificate>> {
    await delay(150)
    const member = mockMembers.find((m) => m.id === ownerId)
    return {
      tenantId,
      ownerId,
      certificateType: certificateType as Certificate["certificateType"],
      recipientName: member ? `${member.firstName} ${member.lastName}` : "Preview Name",
      organization: "Ghana Medical Association",
      program: "Preview Program",
      status: "active",
      issueDate: new Date().toISOString(),
    }
  }
}
