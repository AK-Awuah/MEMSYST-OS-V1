import type { IAttendanceService } from "./IAttendanceService"
import type { Attendance, AttendanceStatus } from "@/types"
import { mockAttendanceRecords } from "./mock-data"
import { delay } from "./shared-store"

export class MockAttendanceService implements IAttendanceService {
  private items = [...mockAttendanceRecords]

  async listAttendance(tenantId: string, params?: { status?: AttendanceStatus; courseId?: string; learnerId?: string; date?: string }): Promise<Attendance[]> {
    await delay(200)
    let result = this.items.filter((a) => a.tenantId === tenantId)
    if (params?.status) result = result.filter((a) => a.status === params.status)
    if (params?.courseId) result = result.filter((a) => a.courseId === params.courseId)
    if (params?.learnerId) result = result.filter((a) => a.learnerId === params.learnerId)
    if (params?.date) result = result.filter((a) => a.date === params.date)
    return result
  }

  async getAttendance(id: string): Promise<Attendance | null> {
    await delay(100)
    return this.items.find((a) => a.id === id) || null
  }

  async recordAttendance(data: Omit<Attendance, "id" | "createdAt">): Promise<Attendance> {
    await delay(200)
    const record: Attendance = {
      ...data,
      id: `att-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.items.push(record)
    return record
  }

  async updateAttendance(id: string, data: Partial<Attendance>): Promise<Attendance> {
    await delay(150)
    const idx = this.items.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Attendance not found")
    this.items[idx] = { ...this.items[idx], ...data }
    return this.items[idx]
  }

  async getAttendanceByLearner(learnerId: string, tenantId: string): Promise<Attendance[]> {
    await delay(100)
    return this.items.filter((a) => a.learnerId === learnerId && a.tenantId === tenantId)
  }

  async getAttendanceByCourse(courseId: string, tenantId: string): Promise<Attendance[]> {
    await delay(100)
    return this.items.filter((a) => a.courseId === courseId && a.tenantId === tenantId)
  }

  async deleteAttendance(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((a) => a.id !== id)
  }
}
