import type { ICertificateService } from "./ICertificateService"
import type { Certificate, CertificateStatus } from "@/types"
import { mockCertificates } from "./mock-data"
import { delay } from "./shared-store"

export class MockCertificateService implements ICertificateService {
  private items = [...mockCertificates]

  async listCertificates(tenantId: string, params?: { status?: CertificateStatus; certificateType?: string }): Promise<Certificate[]> {
    await delay(200)
    let result = this.items.filter((c) => c.tenantId === tenantId)
    if (params?.status) result = result.filter((c) => c.status === params.status)
    if (params?.certificateType) result = result.filter((c) => c.certificateType === params.certificateType)
    return result
  }

  async getCertificate(id: string): Promise<Certificate | null> {
    await delay(100)
    return this.items.find((c) => c.id === id) || null
  }

  async createCertificate(data: Omit<Certificate, "id" | "createdAt" | "updatedAt">): Promise<Certificate> {
    await delay(200)
    const cert: Certificate = { ...data, id: `cert-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    this.items.push(cert)
    return cert
  }

  async updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Certificate not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async updateCertificateStatus(id: string, status: CertificateStatus, reason?: string): Promise<Certificate> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Certificate not found")
    this.items[idx] = { ...this.items[idx], status, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async cancelCertificate(id: string, reason: string, cancelledBy: string): Promise<Certificate> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Certificate not found")
    this.items[idx] = {
      ...this.items[idx],
      status: "cancelled",
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return this.items[idx]
  }

  async getCertificatesByOwner(ownerId: string): Promise<Certificate[]> {
    await delay(100)
    return this.items.filter((c) => c.ownerId === ownerId)
  }
}
