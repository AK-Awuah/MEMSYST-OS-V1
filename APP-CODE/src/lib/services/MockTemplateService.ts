import { delay } from "./shared-store"
import { mockTemplates } from "./mock-data"
import type { Template } from "@/types"
import type { ITemplateService } from "./ITemplateService"

export class MockTemplateService implements ITemplateService {
  private items = [...mockTemplates]

  async createTemplate(tenantId: string, data: Omit<Template, "id" | "createdAt" | "updatedAt">): Promise<Template> {
    await delay(300)
    const item: Template = {
      ...data,
      id: `tpl-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async updateTemplate(tenantId: string, id: string, data: Partial<Template>): Promise<Template> {
    await delay(200)
    const idx = this.items.findIndex((t) => t.id === id && t.tenantId === tenantId)
    if (idx === -1) throw new Error(`Template ${id} not found`)
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async activateTemplate(tenantId: string, id: string): Promise<Template> {
    await delay(200)
    const idx = this.items.findIndex((t) => t.id === id && t.tenantId === tenantId)
    if (idx === -1) throw new Error(`Template ${id} not found`)
    this.items[idx] = { ...this.items[idx], status: "active", updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async archiveTemplate(tenantId: string, id: string): Promise<Template> {
    await delay(200)
    const idx = this.items.findIndex((t) => t.id === id && t.tenantId === tenantId)
    if (idx === -1) throw new Error(`Template ${id} not found`)
    this.items[idx] = { ...this.items[idx], status: "archived", updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async cloneTemplate(tenantId: string, id: string, newName: string): Promise<Template> {
    await delay(300)
    const original = this.items.find((t) => t.id === id && t.tenantId === tenantId)
    if (!original) throw new Error(`Template ${id} not found`)
    const cloned: Template = {
      ...original,
      id: `tpl-${Date.now()}`,
      name: newName,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(cloned)
    return cloned
  }

  async listTemplates(tenantId: string, filters?: { type?: string; status?: string }): Promise<Template[]> {
    await delay(200)
    let result = this.items.filter((t) => t.tenantId === tenantId)
    if (filters?.type) result = result.filter((t) => t.type === filters.type)
    if (filters?.status) result = result.filter((t) => t.status === filters.status)
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getTemplateById(id: string): Promise<Template | null> {
    await delay(100)
    return this.items.find((t) => t.id === id) || null
  }

  async previewTemplate(id: string, variables: Record<string, string>): Promise<string> {
    await delay(150)
    const template = this.items.find((t) => t.id === id)
    if (!template) return ""
    let content = template.content
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value)
    }
    return content
  }
}
