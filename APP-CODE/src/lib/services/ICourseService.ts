import type { Course, CourseStatus } from "@/types"

export interface ICourseService {
  listCourses(tenantId: string, params?: { status?: CourseStatus; programId?: string; level?: string }): Promise<Course[]>
  getCourse(id: string): Promise<Course | null>
  createCourse(data: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course>
  updateCourse(id: string, data: Partial<Course>): Promise<Course>
  publishCourse(id: string): Promise<Course>
  archiveCourse(id: string): Promise<Course>
  deleteCourse(id: string): Promise<void>
}
