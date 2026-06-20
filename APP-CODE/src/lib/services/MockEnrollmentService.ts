import type { IEnrollmentService } from "./IEnrollmentService"
import type { Enrollment, EnrollmentStatus } from "@/types"
import { mockEnrollments } from "./mock-data"
import { delay } from "./shared-store"

export class MockEnrollmentService implements IEnrollmentService {
  private items = [...mockEnrollments]

  async listEnrollments(tenantId: string, params?: { status?: EnrollmentStatus; courseId?: string; learnerId?: string }): Promise<Enrollment[]> {
    await delay(200)
    let result = this.items.filter((e) => e.tenantId === tenantId)
    if (params?.status) result = result.filter((e) => e.status === params.status)
    if (params?.courseId) result = result.filter((e) => e.courseId === params.courseId)
    if (params?.learnerId) result = result.filter((e) => e.learnerId === params.learnerId)
    return result
  }

  async getEnrollment(id: string): Promise<Enrollment | null> {
    await delay(100)
    return this.items.find((e) => e.id === id) || null
  }

  async createEnrollment(data: Omit<Enrollment, "id" | "createdAt" | "updatedAt">): Promise<Enrollment> {
    await delay(200)
    const enrollment: Enrollment = {
      ...data,
      id: `enr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(enrollment)
    return enrollment
  }

  async updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<Enrollment> {
    await delay(150)
    const idx = this.items.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error("Enrollment not found")
    this.items[idx] = {
      ...this.items[idx],
      status,
      completionDate: status === "completed" ? new Date().toISOString() : this.items[idx].completionDate,
      updatedAt: new Date().toISOString(),
    }
    return this.items[idx]
  }

  async getEnrollmentsByLearner(learnerId: string, tenantId: string): Promise<Enrollment[]> {
    await delay(100)
    return this.items.filter((e) => e.learnerId === learnerId && e.tenantId === tenantId)
  }

  async deleteEnrollment(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((e) => e.id !== id)
  }
}
