import type { ICredentialTemplateService } from "./ICredentialTemplateService"
import type { CredentialTemplate, CredentialTemplateType, CredentialTemplateStatus } from "@/types"
import { mockCredentialTemplates } from "./mock-data"
import { delay } from "./shared-store"

export class MockCredentialTemplateService implements ICredentialTemplateService {
  private items = [...mockCredentialTemplates]

  async listTemplates(tenantId: string, params?: { type?: CredentialTemplateType; status?: CredentialTemplateStatus }): Promise<CredentialTemplate[]> {
    await delay(200)
    let result = this.items.filter((t) => t.tenantId === tenantId)
    if (params?.type) result = result.filter((t) => t.type === params.type)
    if (params?.status) result = result.filter((t) => t.status === params.status)
    return result
  }

  async getTemplate(id: string): Promise<CredentialTemplate | null> {
    await delay(100)
    return this.items.find((t) => t.id === id) || null
  }

  async createTemplate(data: Omit<CredentialTemplate, "id" | "createdAt" | "updatedAt">): Promise<CredentialTemplate> {
    await delay(200)
    const template: CredentialTemplate = { ...data, id: `ct-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    this.items.push(template)
    return template
  }

  async updateTemplate(id: string, data: Partial<CredentialTemplate>): Promise<CredentialTemplate> {
    await delay(150)
    const idx = this.items.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error("Template not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteTemplate(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((t) => t.id !== id)
  }

  async setActiveTemplate(id: string): Promise<CredentialTemplate> {
    await delay(150)
    const idx = this.items.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error("Template not found")
    const target = this.items[idx]
    const sameType = target.type
    this.items = this.items.map((t) =>
      t.tenantId === target.tenantId && t.type === sameType
        ? { ...t, status: "draft" as CredentialTemplateStatus, updatedAt: new Date().toISOString() }
        : t
    )
    const newIdx = this.items.findIndex((t) => t.id === id)
    this.items[newIdx] = { ...this.items[newIdx], status: "active", updatedAt: new Date().toISOString() }
    return this.items[newIdx]
  }

  async getActiveTemplates(tenantId: string, type: CredentialTemplateType): Promise<CredentialTemplate | null> {
    await delay(100)
    return this.items.find((t) => t.tenantId === tenantId && t.type === type && t.status === "active") || null
  }
}
