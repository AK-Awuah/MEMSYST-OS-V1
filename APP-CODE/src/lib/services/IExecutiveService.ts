import type { ExecutivePosition, ExecutiveAppointment } from "@/types"

export interface IExecutiveService {
  listPositions(tenantId: string): Promise<ExecutivePosition[]>
  createPosition(data: Omit<ExecutivePosition, "id" | "createdAt" | "updatedAt">): Promise<ExecutivePosition>
  updatePosition(id: string, data: Partial<ExecutivePosition>): Promise<void>
  deactivatePosition(id: string): Promise<void>

  listAppointments(tenantId: string): Promise<ExecutiveAppointment[]>
  getAppointmentsByPosition(positionId: string): Promise<ExecutiveAppointment[]>
  createAppointment(data: Omit<ExecutiveAppointment, "id" | "createdAt" | "updatedAt">): Promise<ExecutiveAppointment>
  updateAppointment(id: string, data: Partial<ExecutiveAppointment>): Promise<void>
  endAppointment(id: string): Promise<void>
  renewAppointment(id: string, endDate: string): Promise<void>
}
