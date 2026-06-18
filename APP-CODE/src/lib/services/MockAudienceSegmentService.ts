import { delay } from "./shared-store"
import { mockSegments } from "./mock-data"
import type { AudienceSegment, AudienceFilter } from "@/types"
import type { IAudienceSegmentService } from "./IAudienceSegmentService"

export class MockAudienceSegmentService implements IAudienceSegmentService {
  private items = [...mockSegments]

  async createSegment(tenantId: string, data: Omit<AudienceSegment, "id" | "createdAt" | "updatedAt" | "estimatedCount">): Promise<AudienceSegment> {
    await delay(300)
    const item: AudienceSegment = {
      ...data,
      id: `seg-${Date.now()}`,
      tenantId,
      estimatedCount: Math.floor(Math.random() * 100) + 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async updateSegment(tenantId: string, id: string, data: Partial<AudienceSegment>): Promise<AudienceSegment> {
    await delay(200)
    const idx = this.items.findIndex((s) => s.id === id && s.tenantId === tenantId)
    if (idx === -1) throw new Error(`Segment ${id} not found`)
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteSegment(tenantId: string, id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((s) => !(s.id === id && s.tenantId === tenantId))
  }

  async estimateSegmentCount(tenantId: string, filters: AudienceFilter[]): Promise<number> {
    await delay(200)
    return filters.length * 20 + Math.floor(Math.random() * 50)
  }

  async listSegments(tenantId: string): Promise<AudienceSegment[]> {
    await delay(200)
    return this.items.filter((s) => s.tenantId === tenantId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getSegmentById(id: string): Promise<AudienceSegment | null> {
    await delay(100)
    return this.items.find((s) => s.id === id) || null
  }
}
