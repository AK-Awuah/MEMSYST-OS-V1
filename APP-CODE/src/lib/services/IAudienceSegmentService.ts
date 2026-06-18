import type { AudienceSegment, AudienceFilter } from "@/types"

export interface IAudienceSegmentService {
  createSegment(tenantId: string, data: Omit<AudienceSegment, "id" | "createdAt" | "updatedAt" | "estimatedCount">): Promise<AudienceSegment>
  updateSegment(tenantId: string, id: string, data: Partial<AudienceSegment>): Promise<AudienceSegment>
  deleteSegment(tenantId: string, id: string): Promise<void>
  estimateSegmentCount(tenantId: string, filters: AudienceFilter[]): Promise<number>
  listSegments(tenantId: string): Promise<AudienceSegment[]>
  getSegmentById(id: string): Promise<AudienceSegment | null>
}
