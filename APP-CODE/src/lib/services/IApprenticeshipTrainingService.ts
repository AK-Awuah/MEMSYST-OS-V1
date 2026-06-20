import type { ApprenticeshipTraining, ApprenticeshipTrainingStatus } from "@/types"

export interface IApprenticeshipTrainingService {
  listApprenticeshipTrainings(tenantId: string, params?: { status?: ApprenticeshipTrainingStatus; apprenticeId?: string; mentorId?: string }): Promise<ApprenticeshipTraining[]>
  getApprenticeshipTraining(id: string): Promise<ApprenticeshipTraining | null>
  createApprenticeshipTraining(data: Omit<ApprenticeshipTraining, "id" | "createdAt" | "updatedAt">): Promise<ApprenticeshipTraining>
  updateApprenticeshipTraining(id: string, data: Partial<ApprenticeshipTraining>): Promise<ApprenticeshipTraining>
  updateApprenticeshipProgress(id: string, progress: number): Promise<ApprenticeshipTraining>
  updateApprenticeshipStatus(id: string, status: ApprenticeshipTrainingStatus): Promise<ApprenticeshipTraining>
  getByApprentice(apprenticeId: string, tenantId: string): Promise<ApprenticeshipTraining[]>
  deleteApprenticeshipTraining(id: string): Promise<void>
}
