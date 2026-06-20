import type { Examination, ExaminationResult } from "@/types"

export interface IExaminationService {
  listExaminations(tenantId: string, params?: { courseId?: string; status?: string }): Promise<Examination[]>
  getExamination(id: string): Promise<Examination | null>
  createExamination(data: Omit<Examination, "id" | "createdAt" | "updatedAt">): Promise<Examination>
  updateExamination(id: string, data: Partial<Examination>): Promise<Examination>
  scheduleExam(data: Omit<Examination, "id" | "createdAt" | "updatedAt">): Promise<Examination>
  publishResults(id: string): Promise<Examination>
  registerCandidate(examinationId: string, learnerId: string, learnerName: string): Promise<void>
  getResults(examinationId: string): Promise<ExaminationResult[]>
  deleteExamination(id: string): Promise<void>
}
