import type { ITrainingAnalyticsService } from "./ITrainingAnalyticsService"
import type { TrainingAnalytics } from "@/types"
import {
  mockEnrollments, mockCourses, mockGraduations,
  mockTrainingCertifications, mockTrainingCenters,
} from "./mock-data"
import { delay } from "./shared-store"

export class MockTrainingAnalyticsService implements ITrainingAnalyticsService {
  private computeAnalytics(tenantId?: string): TrainingAnalytics {
    const enrollments = tenantId
      ? mockEnrollments.filter((e) => e.tenantId === tenantId)
      : mockEnrollments
    const courses = tenantId
      ? mockCourses.filter((c) => c.tenantId === tenantId)
      : mockCourses
    const graduations = tenantId
      ? mockGraduations.filter((g) => g.tenantId === tenantId)
      : mockGraduations
    const certifications = tenantId
      ? mockTrainingCertifications.filter((c) => c.tenantId === tenantId)
      : mockTrainingCertifications
    const centers = tenantId
      ? mockTrainingCenters.filter((c) => c.tenantId === tenantId)
      : mockTrainingCenters

    const totalEnrollments = enrollments.length
    const courseCompletions = enrollments.filter((e) => e.status === "completed").length
    const passRate = totalEnrollments > 0 ? Math.round((courseCompletions / totalEnrollments) * 100) : 0
    const graduationsCount = graduations.filter((g) => g.status === "graduated").length

    const programMap: Record<string, number> = {}
    courses.forEach((c) => {
      const p = c.programId || "unknown"
      programMap[p] = (programMap[p] || 0) + 1
    })

    const statusMap: Record<string, number> = {}
    enrollments.forEach((e) => {
      statusMap[e.status] = (statusMap[e.status] || 0) + 1
    })

    const today = new Date().toISOString().slice(0, 10)
    const recentActivity = [{ date: today, enrollments: totalEnrollments, completions: courseCompletions }]

    return {
      totalEnrollments,
      courseCompletions,
      passRate,
      graduations: graduationsCount,
      certifications: certifications.length,
      activeCenters: centers.filter((c) => c.status === "active").length || centers.length,
      totalCourses: courses.length,
      byProgram: Object.entries(programMap).map(([program, count]) => ({ program, count })),
      byStatus: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
      recentActivity,
    }
  }

  async getAnalytics(tenantId?: string): Promise<TrainingAnalytics> {
    await delay(200)
    return this.computeAnalytics(tenantId)
  }

  async getTenantAnalytics(tenantId: string): Promise<TrainingAnalytics> {
    await delay(200)
    return this.computeAnalytics(tenantId)
  }

  async getPlatformAnalytics(): Promise<TrainingAnalytics> {
    await delay(200)
    return this.computeAnalytics()
  }
}
