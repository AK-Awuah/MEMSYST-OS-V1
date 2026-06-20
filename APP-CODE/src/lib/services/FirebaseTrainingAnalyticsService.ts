import { collection, getDocs, query, where } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITrainingAnalyticsService } from "./ITrainingAnalyticsService"
import type { TrainingAnalytics } from "@/types"

export class FirebaseTrainingAnalyticsService implements ITrainingAnalyticsService {
  private db = getFirestoreDb()

  private async computeAnalytics(tenantId?: string): Promise<TrainingAnalytics> {
    const coursesSnap = await getDocs(collection(this.db, "courses"))
    const enrollmentsSnap = await getDocs(collection(this.db, "enrollments"))
    const graduationsSnap = await getDocs(collection(this.db, "graduations"))
    const certificationsSnap = await getDocs(collection(this.db, "trainingCertifications"))
    const centersSnap = await getDocs(collection(this.db, "trainingCenters"))

    const courses = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>))
    const enrollments = enrollmentsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>))
    const graduations = graduationsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>))
    const certifications = certificationsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>))
    const centers = centersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>))

    const filtered = (items: Record<string, unknown>[], key: string, val: unknown) =>
      tenantId ? items.filter((i) => i[key] === val) : items
    const fc = filtered(courses, "tenantId", tenantId)
    const fe = filtered(enrollments, "tenantId", tenantId)
    const fg = filtered(graduations, "tenantId", tenantId)
    const fcert = filtered(certifications, "tenantId", tenantId)
    const fcenters = filtered(centers, "tenantId", tenantId)

    const totalEnrollments = fe.length
    const courseCompletions = fe.filter((e) => (e.status as string) === "completed").length
    const passRate = totalEnrollments > 0 ? Math.round((courseCompletions / totalEnrollments) * 100) : 0
    const graduationsCount = fg.filter((g) => (g.status as string) === "graduated").length

    const programMap: Record<string, number> = {}
    fc.forEach((c) => {
      const p = (c.programId as string) || "unknown"
      programMap[p] = (programMap[p] || 0) + 1
    })

    const statusMap: Record<string, number> = {}
    fe.forEach((e) => {
      const s = (e.status as string) || "unknown"
      statusMap[s] = (statusMap[s] || 0) + 1
    })

    const today = new Date().toISOString().slice(0, 10)
    const recentActivity = [{ date: today, enrollments: totalEnrollments, completions: courseCompletions }]

    return {
      totalEnrollments,
      courseCompletions,
      passRate,
      graduations: graduationsCount,
      certifications: fcert.length,
      activeCenters: fcenters.filter((c) => (c.status as string) === "active").length || fcenters.length,
      totalCourses: fc.length,
      byProgram: Object.entries(programMap).map(([program, count]) => ({ program, count })),
      byStatus: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
      recentActivity,
    }
  }

  async getAnalytics(tenantId?: string): Promise<TrainingAnalytics> {
    return this.computeAnalytics(tenantId)
  }

  async getTenantAnalytics(tenantId: string): Promise<TrainingAnalytics> {
    return this.computeAnalytics(tenantId)
  }

  async getPlatformAnalytics(): Promise<TrainingAnalytics> {
    return this.computeAnalytics()
  }
}
