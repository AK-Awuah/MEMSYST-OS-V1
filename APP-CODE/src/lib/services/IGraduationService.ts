import type { Graduation, GraduationStatus } from "@/types"

export interface IGraduationService {
  listGraduations(tenantId: string, params?: { status?: GraduationStatus; apprenticeId?: string }): Promise<Graduation[]>
  getGraduation(id: string): Promise<Graduation | null>
  createGraduation(data: Omit<Graduation, "id" | "createdAt" | "updatedAt">): Promise<Graduation>
  updateGraduation(id: string, data: Partial<Graduation>): Promise<Graduation>
  updateGraduationStatus(id: string, status: GraduationStatus): Promise<Graduation>
  approveGraduation(id: string): Promise<Graduation>
  getByApprentice(apprenticeId: string, tenantId: string): Promise<Graduation[]>
  deleteGraduation(id: string): Promise<void>
}
