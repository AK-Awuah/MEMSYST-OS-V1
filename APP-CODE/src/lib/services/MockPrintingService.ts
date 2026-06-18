import type { IPrintingService } from "./IPrintingService"
import type { PrintRequest, PrintRequestStatus } from "@/types"
import { mockPrintRequests } from "./mock-data"
import { delay } from "./shared-store"

export class MockPrintingService implements IPrintingService {
  private items = [...mockPrintRequests]

  async listPrintRequests(tenantId: string, params?: { status?: PrintRequestStatus; credentialType?: string }): Promise<PrintRequest[]> {
    await delay(200)
    let result = this.items.filter((r) => r.tenantId === tenantId)
    if (params?.status) result = result.filter((r) => r.status === params.status)
    if (params?.credentialType) result = result.filter((r) => r.credentialType === params.credentialType)
    return result
  }

  async getPrintRequest(id: string): Promise<PrintRequest | null> {
    await delay(100)
    return this.items.find((r) => r.id === id) || null
  }

  async createPrintRequest(data: Omit<PrintRequest, "id" | "createdAt" | "updatedAt">): Promise<PrintRequest> {
    await delay(200)
    const request: PrintRequest = { ...data, id: `pr-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    this.items.push(request)
    return request
  }

  async updatePrintRequestStatus(id: string, status: PrintRequestStatus): Promise<PrintRequest> {
    await delay(150)
    const idx = this.items.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Print request not found")
    this.items[idx] = { ...this.items[idx], status, updatedAt: new Date().toISOString() }
    if (status === "completed") this.items[idx].completedAt = new Date().toISOString()
    return this.items[idx]
  }

  async approvePrintRequest(id: string): Promise<PrintRequest> {
    await delay(150)
    const idx = this.items.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Print request not found")
    this.items[idx] = { ...this.items[idx], status: "approved", updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async completePrintRequest(id: string): Promise<PrintRequest> {
    await delay(150)
    const idx = this.items.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Print request not found")
    this.items[idx] = { ...this.items[idx], status: "completed", completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async getPrintQueue(tenantId: string): Promise<PrintRequest[]> {
    await delay(100)
    return this.items.filter((r) => r.tenantId === tenantId && (r.status === "pending" || r.status === "approved"))
  }
}
