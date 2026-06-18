import type { IBusinessCategoryService } from "./IBusinessCategoryService"
import type { BusinessCategory } from "@/types"
import { mockBusinessCategories } from "./mock-data"
import { delay } from "./shared-store"

export class MockBusinessCategoryService implements IBusinessCategoryService {
  private items = [...mockBusinessCategories]

  async listCategories(tenantId: string): Promise<BusinessCategory[]> {
    await delay(200)
    return this.items.filter((c) => c.tenantId === tenantId).sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async getCategory(id: string): Promise<BusinessCategory | null> {
    await delay(100)
    return this.items.find((c) => c.id === id) || null
  }

  async createCategory(data: Omit<BusinessCategory, "id" | "createdAt" | "updatedAt">): Promise<BusinessCategory> {
    await delay(200)
    const category: BusinessCategory = {
      ...data,
      id: `bc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(category)
    return category
  }

  async updateCategory(id: string, data: Partial<BusinessCategory>): Promise<BusinessCategory> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Category not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteCategory(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((c) => c.id !== id)
  }

  async reorderCategories(tenantId: string, orderedIds: string[]): Promise<void> {
    await delay(150)
    const tenantCategories = this.items.filter((c) => c.tenantId === tenantId)
    const otherCategories = this.items.filter((c) => c.tenantId !== tenantId)
    const reordered = orderedIds.map((id, idx) => {
      const category = tenantCategories.find((c) => c.id === id)
      if (!category) throw new Error(`Category ${id} not found`)
      return { ...category, sortOrder: idx, updatedAt: new Date().toISOString() }
    })
    this.items = [...otherCategories, ...reordered]
  }
}
