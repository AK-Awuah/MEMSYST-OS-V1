import type { IExaminationService } from "./IExaminationService"
import type { Examination, ExaminationResult } from "@/types"
import { mockExaminations, mockExaminationResults } from "./mock-data"
import { delay } from "./shared-store"

export class MockExaminationService implements IExaminationService {
  private exams = [...mockExaminations]
  private results = [...mockExaminationResults]

  async listExaminations(tenantId: string, params?: { courseId?: string; status?: string }): Promise<Examination[]> {
    await delay(200)
    let result = this.exams.filter((e) => e.tenantId === tenantId)
    if (params?.courseId) result = result.filter((e) => e.courseId === params.courseId)
    if (params?.status) result = result.filter((e) => e.status === params.status)
    return result
  }

  async getExamination(id: string): Promise<Examination | null> {
    await delay(100)
    return this.exams.find((e) => e.id === id) || null
  }

  async createExamination(data: Omit<Examination, "id" | "createdAt" | "updatedAt">): Promise<Examination> {
    await delay(200)
    const exam: Examination = {
      ...data,
      id: `exam-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.exams.push(exam)
    return exam
  }

  async updateExamination(id: string, data: Partial<Examination>): Promise<Examination> {
    await delay(150)
    const idx = this.exams.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error("Examination not found")
    this.exams[idx] = { ...this.exams[idx], ...data, updatedAt: new Date().toISOString() }
    return this.exams[idx]
  }

  async scheduleExam(data: Omit<Examination, "id" | "createdAt" | "updatedAt">): Promise<Examination> {
    return this.createExamination(data)
  }

  async publishResults(id: string): Promise<Examination> {
    await delay(100)
    const idx = this.exams.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error("Examination not found")
    this.exams[idx] = { ...this.exams[idx], resultsPublished: true, updatedAt: new Date().toISOString() }
    return this.exams[idx]
  }

  async registerCandidate(examinationId: string, _learnerId: string, _learnerName: string): Promise<void> {
    await delay(100)
    const idx = this.exams.findIndex((e) => e.id === examinationId)
    if (idx === -1) throw new Error("Examination not found")
    this.exams[idx].registeredCandidates++
    this.results.push({
      id: `er-${Date.now()}`,
      examinationId,
      learnerId: _learnerId,
      learnerName: _learnerName,
      approved: false,
      createdAt: new Date().toISOString(),
    })
  }

  async getResults(examinationId: string): Promise<ExaminationResult[]> {
    await delay(100)
    return this.results.filter((r) => r.examinationId === examinationId)
  }

  async deleteExamination(id: string): Promise<void> {
    await delay(100)
    this.exams = this.exams.filter((e) => e.id !== id)
    this.results = this.results.filter((r) => r.examinationId !== id)
  }
}
