import type { IProgramService } from "./IProgramService"
import type { Program } from "@/types"
import { mockPrograms } from "./mock-data"
import { delay } from "./shared-store"

export class MockProgramService implements IProgramService {
  private items = [...mockPrograms]

  async listPrograms(tenantId: string, params?: { status?: string }): Promise<Program[]> {
    await delay(200)
    let result = this.items.filter((p) => p.tenantId === tenantId)
    if (params?.status) result = result.filter((p) => p.status === params.status)
    return result
  }

  async getProgram(id: string): Promise<Program | null> {
    await delay(100)
    return this.items.find((p) => p.id === id) || null
  }

  async createProgram(data: Omit<Program, "id" | "createdAt" | "updatedAt">): Promise<Program> {
    await delay(200)
    const program: Program = {
      ...data,
      id: `prog-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(program)
    return program
  }

  async updateProgram(id: string, data: Partial<Program>): Promise<Program> {
    await delay(150)
    const idx = this.items.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error("Program not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteProgram(id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((p) => p.id !== id)
  }
}
