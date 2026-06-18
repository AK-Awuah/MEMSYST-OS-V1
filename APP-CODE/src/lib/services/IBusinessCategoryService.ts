import type { BusinessCategory } from "@/types"

export interface IBusinessCategoryService {
  listCategories(tenantId: string): Promise<BusinessCategory[]>
  getCategory(id: string): Promise<BusinessCategory | null>
  createCategory(data: Omit<BusinessCategory, "id" | "createdAt" | "updatedAt">): Promise<BusinessCategory>
  updateCategory(id: string, data: Partial<BusinessCategory>): Promise<BusinessCategory>
  deleteCategory(id: string): Promise<void>
  reorderCategories(tenantId: string, orderedIds: string[]): Promise<void>
}
