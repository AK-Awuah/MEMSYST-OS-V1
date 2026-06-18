import type { Template } from "@/types"

export interface ITemplateService {
  createTemplate(tenantId: string, data: Omit<Template, "id" | "createdAt" | "updatedAt">): Promise<Template>
  updateTemplate(tenantId: string, id: string, data: Partial<Template>): Promise<Template>
  activateTemplate(tenantId: string, id: string): Promise<Template>
  archiveTemplate(tenantId: string, id: string): Promise<Template>
  cloneTemplate(tenantId: string, id: string, newName: string): Promise<Template>
  listTemplates(tenantId: string, filters?: { type?: string; status?: string }): Promise<Template[]>
  getTemplateById(id: string): Promise<Template | null>
  previewTemplate(id: string, variables: Record<string, string>): Promise<string>
}
