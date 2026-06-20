import type { TrainingCertification } from "@/types"

export interface ITrainingCertificationService {
  listCertifications(tenantId: string, params?: { learnerId?: string; type?: string; status?: string }): Promise<TrainingCertification[]>
  getCertification(id: string): Promise<TrainingCertification | null>
  issueCertification(data: Omit<TrainingCertification, "id" | "createdAt" | "updatedAt">): Promise<TrainingCertification>
  revokeCertification(id: string): Promise<TrainingCertification>
  getByLearner(learnerId: string, tenantId: string): Promise<TrainingCertification[]>
  deleteCertification(id: string): Promise<void>
}
