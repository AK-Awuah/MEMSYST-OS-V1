import type { ICourseService } from "./ICourseService"
import type { Course, CourseStatus } from "@/types"
import { mockCourses } from "./mock-data"
import { delay } from "./shared-store"

export class MockCourseService implements ICourseService {
  private items = [...mockCourses]

  async listCourses(tenantId: string, params?: { status?: CourseStatus; programId?: string; level?: string }): Promise<Course[]> {
    await delay(200)
    let result = this.items.filter((c) => c.tenantId === tenantId)
    if (params?.status) result = result.filter((c) => c.status === params.status)
    if (params?.programId) result = result.filter((c) => c.programId === params.programId)
    if (params?.level) result = result.filter((c) => c.level === params.level)
    return result
  }

  async getCourse(id: string): Promise<Course | null> {
    await delay(100)
    return this.items.find((c) => c.id === id) || null
  }

  async createCourse(data: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course> {
    await delay(200)
    const course: Course = {
      ...data,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(course)
    return course
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Course not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async publishCourse(id: string): Promise<Course> {
    await delay(100)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Course not found")
    this.items[idx] = { ...this.items[idx], status: "published" as CourseStatus, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async archiveCourse(id: string): Promise<Course> {
    await delay(100)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Course not found")
    this.items[idx] = { ...this.items[idx], status: "archived" as CourseStatus, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteCourse(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((c) => c.id !== id)
  }
}
