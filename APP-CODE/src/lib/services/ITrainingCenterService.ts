import type { TrainingCenter, TrainingCenterStatus } from "@/types"

export interface ITrainingCenterService {
  listTrainingCenters(tenantId: string, params?: { status?: string; accreditationStatus?: TrainingCenterStatus }): Promise<TrainingCenter[]>
  getTrainingCenter(id: string): Promise<TrainingCenter | null>
  createTrainingCenter(data: Omit<TrainingCenter, "id" | "createdAt" | "updatedAt">): Promise<TrainingCenter>
  updateTrainingCenter(id: string, data: Partial<TrainingCenter>): Promise<TrainingCenter>
  approveCenter(id: string): Promise<TrainingCenter>
  suspendCenter(id: string): Promise<TrainingCenter>
  renewAccreditation(id: string): Promise<TrainingCenter>
  deleteTrainingCenter(id: string): Promise<void>
}
