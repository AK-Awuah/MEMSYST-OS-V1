import type { TenantDocument } from "@/types"

export interface ITenantDocumentService {
  listDocuments(tenantId: string): Promise<TenantDocument[]>
  uploadDocument(data: Omit<TenantDocument, "id" | "createdAt" | "updatedAt">): Promise<TenantDocument>
  archiveDocument(id: string): Promise<void>
  deleteDocument(id: string): Promise<void>
}
