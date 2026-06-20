import type { Enrollment, EnrollmentStatus } from "@/types"

export interface IEnrollmentService {
  listEnrollments(tenantId: string, params?: { status?: EnrollmentStatus; courseId?: string; learnerId?: string }): Promise<Enrollment[]>
  getEnrollment(id: string): Promise<Enrollment | null>
  createEnrollment(data: Omit<Enrollment, "id" | "createdAt" | "updatedAt">): Promise<Enrollment>
  updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<Enrollment>
  getEnrollmentsByLearner(learnerId: string, tenantId: string): Promise<Enrollment[]>
  deleteEnrollment(id: string): Promise<void>
}
