import type { MemberDocument } from "@/types"

export interface IMemberDocumentService {
  listDocuments(tenantId: string, memberId: string): Promise<MemberDocument[]>
  uploadDocument(data: Omit<MemberDocument, "id" | "createdAt" | "updatedAt">): Promise<MemberDocument>
  archiveDocument(id: string): Promise<void>
  deleteDocument(id: string): Promise<void>
}
