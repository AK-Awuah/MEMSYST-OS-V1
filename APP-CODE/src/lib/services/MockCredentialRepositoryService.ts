import type { ICredentialRepositoryService } from "./ICredentialRepositoryService"
import type { CredentialFile } from "@/types"
import { mockCredentialFiles } from "./mock-data"
import { delay } from "./shared-store"

export class MockCredentialRepositoryService implements ICredentialRepositoryService {
  private items = [...mockCredentialFiles]

  async listFiles(tenantId: string, params?: { credentialId?: string; credentialType?: string }): Promise<CredentialFile[]> {
    await delay(200)
    let result = this.items.filter((f) => f.tenantId === tenantId)
    if (params?.credentialId) result = result.filter((f) => f.credentialId === params.credentialId)
    if (params?.credentialType) result = result.filter((f) => f.credentialType === params.credentialType)
    return result
  }

  async getFile(id: string): Promise<CredentialFile | null> {
    await delay(100)
    return this.items.find((f) => f.id === id) || null
  }

  async uploadFile(data: Omit<CredentialFile, "id" | "uploadedAt">): Promise<CredentialFile> {
    await delay(200)
    const file: CredentialFile = { ...data, id: `cf-${Date.now()}`, uploadedAt: new Date().toISOString() }
    this.items.push(file)
    return file
  }

  async deleteFile(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((f) => f.id !== id)
  }

  async searchFiles(tenantId: string, query: string): Promise<CredentialFile[]> {
    await delay(150)
    const q = query.toLowerCase()
    return this.items.filter((f) => f.tenantId === tenantId && (f.fileName.toLowerCase().includes(q) || f.fileType.toLowerCase().includes(q)))
  }
}
