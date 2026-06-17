import type { ITenantDocumentService } from "./ITenantDocumentService"
import type { TenantDocument } from "@/types"
import { mockTenantDocuments } from "./mock-data"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
let docs = [...mockTenantDocuments]

export class MockTenantDocumentService implements ITenantDocumentService {
  async listDocuments(tenantId: string): Promise<TenantDocument[]> {
    await delay(200); return docs.filter((d) => d.tenantId === tenantId)
  }
  async uploadDocument(data: Omit<TenantDocument, "id" | "createdAt" | "updatedAt">): Promise<TenantDocument> {
    await delay(400)
    const doc: TenantDocument = { ...data, id: `td-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    docs.push(doc); return doc
  }
  async archiveDocument(id: string): Promise<void> {
    await delay(200); const d = docs.find((doc) => doc.id === id); if (d) { d.status = "archived"; d.updatedAt = new Date().toISOString() }
  }
  async deleteDocument(id: string): Promise<void> {
    await delay(200); docs = docs.filter((d) => d.id !== id)
  }
}
