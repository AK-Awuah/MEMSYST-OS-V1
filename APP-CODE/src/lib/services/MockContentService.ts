import type { IContentService } from "./IContentService"
import type { LearningContent, ContentType } from "@/types"
import { mockLearningContent } from "./mock-data"
import { delay } from "./shared-store"

export class MockContentService implements IContentService {
  private items = [...mockLearningContent]

  async listContent(tenantId: string, params?: { status?: string; contentType?: ContentType; courseId?: string }): Promise<LearningContent[]> {
    await delay(200)
    let result = this.items.filter((c) => c.tenantId === tenantId)
    if (params?.status) result = result.filter((c) => c.status === params.status)
    if (params?.contentType) result = result.filter((c) => c.contentType === params.contentType)
    if (params?.courseId) result = result.filter((c) => c.courseId === params.courseId)
    return result
  }

  async getContent(id: string): Promise<LearningContent | null> {
    await delay(100)
    return this.items.find((c) => c.id === id) || null
  }

  async createContent(data: Omit<LearningContent, "id" | "createdAt" | "updatedAt">): Promise<LearningContent> {
    await delay(200)
    const item: LearningContent = {
      ...data,
      id: `lc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(item)
    return item
  }

  async updateContent(id: string, data: Partial<LearningContent>): Promise<LearningContent> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Content not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteContent(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((c) => c.id !== id)
  }
}
