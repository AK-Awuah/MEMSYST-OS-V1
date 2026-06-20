import type { Attendance, AttendanceStatus } from "@/types"

export interface IAttendanceService {
  listAttendance(tenantId: string, params?: { status?: AttendanceStatus; courseId?: string; learnerId?: string; date?: string }): Promise<Attendance[]>
  getAttendance(id: string): Promise<Attendance | null>
  recordAttendance(data: Omit<Attendance, "id" | "createdAt">): Promise<Attendance>
  updateAttendance(id: string, data: Partial<Attendance>): Promise<Attendance>
  getAttendanceByLearner(learnerId: string, tenantId: string): Promise<Attendance[]>
  getAttendanceByCourse(courseId: string, tenantId: string): Promise<Attendance[]>
  deleteAttendance(id: string): Promise<void>
}
