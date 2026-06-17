import type { IFormsService } from "./IFormsService"
import type { FormSubmission, Note, Lead } from "@/types"
import { mockSubmissions, generateMockForm, mockLeads } from "./mock-data"

let submissions = [...mockSubmissions]

export class MockFormsService implements IFormsService {
  async listSubmissions(): Promise<FormSubmission[]> {
    await delay(300)
    return [...submissions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getSubmission(id: string): Promise<FormSubmission | null> {
    await delay(200)
    return submissions.find((s) => s.id === id) || null
  }

  async updateStatus(id: string, status: FormSubmission["status"]): Promise<void> {
    await delay(300)
    const sub = submissions.find((s) => s.id === id)
    if (sub) sub.status = status
  }

  async assignSubmission(id: string, userId: string): Promise<void> {
    await delay(300)
    const sub = submissions.find((s) => s.id === id)
    if (sub) sub.assignedTo = userId
  }

  async addNote(id: string, note: Omit<Note, "id" | "createdAt">): Promise<void> {
    await delay(200)
    const sub = submissions.find((s) => s.id === id)
    if (sub) {
      sub.notes.push({ ...note, id: `note-${Date.now()}`, createdAt: new Date().toISOString() })
    }
  }

  async convertToLead(id: string): Promise<string> {
    await delay(500)
    const sub = submissions.find((s) => s.id === id)
    if (!sub) throw new Error("Submission not found")
    sub.status = "resolved"
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      organizationName: (sub.data.organizationName as string) || (sub.data.name as string) || `From ${sub.type}`,
      contactPerson: (sub.data.contactPerson as string) || (sub.data.name as string) || "",
      email: (sub.data.email as string) || "",
      phone: (sub.data.phone as string) || "",
      organizationType: "",
      country: (sub.data.country as string) || "",
      expectedMembers: Number(sub.data.expectedMembers) || 0,
      website: "",
      leadSource: sub.type,
      estimatedValue: 0,
      expectedLaunchDate: "",
      assignedTo: sub.assignedTo || "",
      status: "new",
      activities: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockLeads.push(lead)
    return lead.id
  }

  async getSubmissionStats(): Promise<{ new: number; total: number }> {
    return {
      new: submissions.filter((s) => s.status === "new").length,
      total: submissions.length,
    }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
