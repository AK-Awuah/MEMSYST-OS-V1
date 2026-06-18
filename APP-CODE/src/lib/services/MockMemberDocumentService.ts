import type { IMemberDocumentService } from "./IMemberDocumentService"
import type { MemberDocument } from "@/types"
import { mockMemberDocuments } from "./mock-data"
import { delay } from "./shared-store"

let docs = [...mockMemberDocuments]
let nextId = docs.length + 1

export class MockMemberDocumentService implements IMemberDocumentService {
  async listDocuments(_tenantId: string, memberId: string): Promise<MemberDocument[]> {
    await delay(150)
    return docs.filter((d) => d.memberId === memberId)
  }

  async uploadDocument(data: Omit<MemberDocument, "id" | "createdAt" | "updatedAt">): Promise<MemberDocument> {
    await delay(200)
    const doc: MemberDocument = { ...data, id: `md-${nextId++}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    docs.push(doc)
    return doc
  }

  async archiveDocument(id: string): Promise<void> {
    await delay(150)
    const idx = docs.findIndex((d) => d.id === id)
    if (idx !== -1) docs[idx] = { ...docs[idx], status: "archived", updatedAt: new Date().toISOString() }
  }

  async deleteDocument(id: string): Promise<void> {
    await delay(150)
    docs = docs.filter((d) => d.id !== id)
  }
}
