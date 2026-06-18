import type { CredentialFile } from "@/types"

export interface ICredentialRepositoryService {
  listFiles(tenantId: string, params?: { credentialId?: string; credentialType?: string }): Promise<CredentialFile[]>
  getFile(id: string): Promise<CredentialFile | null>
  uploadFile(data: Omit<CredentialFile, "id" | "uploadedAt">): Promise<CredentialFile>
  deleteFile(id: string): Promise<void>
  searchFiles(tenantId: string, query: string): Promise<CredentialFile[]>
}
