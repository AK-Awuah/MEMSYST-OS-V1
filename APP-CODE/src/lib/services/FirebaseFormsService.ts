import type { IFormsService } from "./IFormsService"
import type { FormSubmission, Note } from "@/types"

export class FirebaseFormsService implements IFormsService {
  async listSubmissions(): Promise<FormSubmission[]> { return [] }
  async getSubmission(_id: string): Promise<FormSubmission | null> { return null }
  async updateStatus(_id: string, _status: FormSubmission["status"]): Promise<void> {}
  async assignSubmission(_id: string, _userId: string): Promise<void> {}
  async addNote(_id: string, _note: Omit<Note, "id" | "createdAt">): Promise<void> {}
  async convertToLead(_id: string): Promise<string> { throw new Error("Firebase not configured") }
  async getSubmissionStats(): Promise<{ new: number; total: number }> { return { new: 0, total: 0 } }
}
