import type { IExecutiveService } from "./IExecutiveService"
import type { ExecutivePosition, ExecutiveAppointment } from "@/types"
import { mockExecutivePositions, mockExecutiveAppointments } from "./mock-data"

const positions = [...mockExecutivePositions]
const appointments = [...mockExecutiveAppointments]

export class MockExecutiveService implements IExecutiveService {
  async listPositions(tenantId: string): Promise<ExecutivePosition[]> {
    await delay(200); return positions.filter((p) => p.tenantId === tenantId)
  }
  async createPosition(data: Omit<ExecutivePosition, "id" | "createdAt" | "updatedAt">): Promise<ExecutivePosition> {
    await delay(400)
    const pos: ExecutivePosition = { ...data, id: `ep-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    positions.push(pos); return pos
  }
  async updatePosition(id: string, data: Partial<ExecutivePosition>): Promise<void> {
    await delay(300); const p = positions.find((pos) => pos.id === id); if (p) Object.assign(p, data, { updatedAt: new Date().toISOString() })
  }
  async deactivatePosition(id: string): Promise<void> {
    await delay(200); const p = positions.find((pos) => pos.id === id); if (p) { p.status = "inactive"; p.updatedAt = new Date().toISOString() }
  }

  async listAppointments(tenantId: string): Promise<ExecutiveAppointment[]> {
    await delay(200); return appointments.filter((a) => a.tenantId === tenantId)
  }
  async getAppointmentsByPosition(positionId: string): Promise<ExecutiveAppointment[]> {
    await delay(100); return appointments.filter((a) => a.positionId === positionId)
  }
  async createAppointment(data: Omit<ExecutiveAppointment, "id" | "createdAt" | "updatedAt">): Promise<ExecutiveAppointment> {
    await delay(400)
    const appt: ExecutiveAppointment = { ...data, id: `ea-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    appointments.push(appt); return appt
  }
  async updateAppointment(id: string, data: Partial<ExecutiveAppointment>): Promise<void> {
    await delay(300); const a = appointments.find((appt) => appt.id === id); if (a) Object.assign(a, data, { updatedAt: new Date().toISOString() })
  }
  async endAppointment(id: string): Promise<void> {
    await delay(200); const a = appointments.find((appt) => appt.id === id); if (a) { a.status = "completed"; a.updatedAt = new Date().toISOString() }
  }
  async renewAppointment(id: string, endDate: string): Promise<void> {
    await delay(200); const a = appointments.find((appt) => appt.id === id); if (a) { a.endDate = endDate; a.updatedAt = new Date().toISOString() }
  }
}

function delay(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)) }
