import type { LearningContent, ContentType } from "@/types"

export interface IContentService {
  listContent(tenantId: string, params?: { status?: string; contentType?: ContentType; courseId?: string }): Promise<LearningContent[]>
  getContent(id: string): Promise<LearningContent | null>
  createContent(data: Omit<LearningContent, "id" | "createdAt" | "updatedAt">): Promise<LearningContent>
  updateContent(id: string, data: Partial<LearningContent>): Promise<LearningContent>
  deleteContent(id: string): Promise<void>
}
