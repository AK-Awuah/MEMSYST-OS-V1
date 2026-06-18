import type { IDCard, Certificate } from "@/types"

export type GenerationTrigger = "member_approved" | "apprentice_upgraded" | "training_completed" | "executive_appointed" | "certificate_approved"

export interface ICredentialGenerationService {
  generateIDCard(trigger: GenerationTrigger, ownerId: string, tenantId: string): Promise<IDCard>
  generateCertificate(trigger: GenerationTrigger, ownerId: string, tenantId: string, certificateType: string): Promise<Certificate>
  previewIDCard(ownerId: string, tenantId: string): Promise<Partial<IDCard>>
  previewCertificate(ownerId: string, tenantId: string, certificateType: string): Promise<Partial<Certificate>>
}
