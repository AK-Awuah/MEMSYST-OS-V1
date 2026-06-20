import type { IFormsService } from "./IFormsService"
import type { FormSubmission, Note, Lead } from "@/types"
import { mockSubmissions, generateMockForm, mockLeads } from "./mock-data"
import { pushAuditLog } from "./shared-store"

const submissions = [...mockSubmissions]

export class MockFormsService implements IFormsService {
  async listSubmissions(): Promise<FormSubmission[]> {
    await delay(300)
    return [...submissions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getSubmission(id: string): Promise<FormSubmission | null> {
    await delay(200)
    return submissions.find((s) => s.id === id) || null
  }

  async createSubmission(data: Omit<FormSubmission, "id" | "createdAt" | "updatedAt">): Promise<FormSubmission> {
    await delay(300)
    const now = new Date().toISOString()
    const submission: FormSubmission = {
      ...data,
      id: `form-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    }
    submissions.unshift(submission)
    pushAuditLog({ actor: "System", role: "system", action: "create", module: "forms", recordType: "FormSubmission", recordId: submission.id, ipAddress: (data.data?.ipAddress as string) || "", newValue: `${submission.type} submission from ${submission.sourcePage}` })
    return submission
  }

  async updateStatus(id: string, status: FormSubmission["status"]): Promise<void> {
    await delay(300)
    const sub = submissions.find((s) => s.id === id)
    if (sub) {
      const prev = sub.status
      sub.status = status
      pushAuditLog({ actor: "System", role: "system", action: "update_status", module: "forms", recordType: "FormSubmission", recordId: id, ipAddress: "", previousValue: prev, newValue: status })
    }
  }

  async assignSubmission(id: string, userId: string): Promise<void> {
    await delay(300)
    const sub = submissions.find((s) => s.id === id)
    if (sub) {
      sub.assignedTo = userId
      pushAuditLog({ actor: "System", role: "system", action: "assign", module: "forms", recordType: "FormSubmission", recordId: id, ipAddress: "", previousValue: "unassigned", newValue: userId })
    }
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
    pushAuditLog({ actor: "System", role: "system", action: "convert", module: "forms", recordType: "FormSubmission", recordId: id, ipAddress: "", previousValue: sub.type, newValue: `Converted to lead ${lead.id}` })
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
