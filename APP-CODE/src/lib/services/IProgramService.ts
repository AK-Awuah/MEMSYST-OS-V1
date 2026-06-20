import type { Program } from "@/types"

export interface IProgramService {
  listPrograms(tenantId: string, params?: { status?: string }): Promise<Program[]>
  getProgram(id: string): Promise<Program | null>
  createProgram(data: Omit<Program, "id" | "createdAt" | "updatedAt">): Promise<Program>
  updateProgram(id: string, data: Partial<Program>): Promise<Program>
  deleteProgram(id: string): Promise<void>
}
