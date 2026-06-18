import type { CredentialTemplate, CredentialTemplateType, CredentialTemplateStatus } from "@/types"

export interface ICredentialTemplateService {
  listTemplates(tenantId: string, params?: { type?: CredentialTemplateType; status?: CredentialTemplateStatus }): Promise<CredentialTemplate[]>
  getTemplate(id: string): Promise<CredentialTemplate | null>
  createTemplate(data: Omit<CredentialTemplate, "id" | "createdAt" | "updatedAt">): Promise<CredentialTemplate>
  updateTemplate(id: string, data: Partial<CredentialTemplate>): Promise<CredentialTemplate>
  deleteTemplate(id: string): Promise<void>
  setActiveTemplate(id: string): Promise<CredentialTemplate>
  getActiveTemplates(tenantId: string, type: CredentialTemplateType): Promise<CredentialTemplate | null>
}
