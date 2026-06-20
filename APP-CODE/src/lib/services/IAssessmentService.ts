import type { Assessment } from "@/types"

export interface IAssessmentService {
  listAssessments(tenantId: string, params?: { learnerId?: string; courseId?: string; type?: string; result?: string }): Promise<Assessment[]>
  getAssessment(id: string): Promise<Assessment | null>
  createAssessment(data: Omit<Assessment, "id" | "createdAt" | "updatedAt">): Promise<Assessment>
  updateAssessment(id: string, data: Partial<Assessment>): Promise<Assessment>
  getAssessmentsByLearner(learnerId: string, tenantId: string): Promise<Assessment[]>
  getByCourse(courseId: string, tenantId: string): Promise<Assessment[]>
  deleteAssessment(id: string): Promise<void>
}
