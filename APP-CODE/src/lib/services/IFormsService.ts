import type { FormSubmission, Note } from "@/types"

export interface IFormsService {
  listSubmissions(params?: {
    status?: string
    type?: string
    assignedTo?: string
  }): Promise<FormSubmission[]>
  getSubmission(id: string): Promise<FormSubmission | null>
  createSubmission(data: Omit<FormSubmission, "id" | "createdAt" | "updatedAt">): Promise<FormSubmission>
  updateStatus(id: string, status: FormSubmission["status"]): Promise<void>
  assignSubmission(id: string, userId: string): Promise<void>
  addNote(id: string, note: Omit<Note, "id" | "createdAt">): Promise<void>
  convertToLead(id: string): Promise<string>
  getSubmissionStats(): Promise<{ new: number; total: number }>
}
