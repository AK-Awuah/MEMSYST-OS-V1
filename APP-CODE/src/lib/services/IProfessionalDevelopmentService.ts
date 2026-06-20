import type { ProfessionalDevelopment } from "@/types"

export interface IProfessionalDevelopmentService {
  listProfessionalDevelopments(tenantId: string): Promise<ProfessionalDevelopment[]>
  getProfessionalDevelopment(id: string): Promise<ProfessionalDevelopment | null>
  getByLearner(learnerId: string, tenantId: string): Promise<ProfessionalDevelopment[]>
  createProfessionalDevelopment(data: Omit<ProfessionalDevelopment, "id">): Promise<ProfessionalDevelopment>
  updateProfessionalDevelopment(id: string, data: Partial<ProfessionalDevelopment>): Promise<ProfessionalDevelopment>
}
