import type { Certificate, CertificateStatus } from "@/types"

export interface ICertificateService {
  listCertificates(tenantId: string, params?: { status?: CertificateStatus; certificateType?: string }): Promise<Certificate[]>
  getCertificate(id: string): Promise<Certificate | null>
  createCertificate(data: Omit<Certificate, "id" | "createdAt" | "updatedAt">): Promise<Certificate>
  updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate>
  updateCertificateStatus(id: string, status: CertificateStatus, reason?: string): Promise<Certificate>
  cancelCertificate(id: string, reason: string, cancelledBy: string): Promise<Certificate>
  getCertificatesByOwner(ownerId: string): Promise<Certificate[]>
}
