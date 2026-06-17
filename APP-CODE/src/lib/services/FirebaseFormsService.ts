import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  arrayUnion,
  Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IFormsService } from "./IFormsService"
import type { FormSubmission, Note } from "@/types"

const COLLECTION = "formSubmissions"

function toSubmission(id: string, data: Record<string, unknown>): FormSubmission {
  return {
    id,
    type: (data.type as FormSubmission["type"]) || "contact",
    data: (data.data as Record<string, unknown>) || {},
    status: (data.status as FormSubmission["status"]) || "new",
    assignedTo: (data.assignedTo as string) || undefined,
    sourcePage: (data.sourcePage as string) || "",
    referralSource: (data.referralSource as string) || undefined,
    ipAddress: (data.ipAddress as string) || undefined,
    notes: (data.notes as Note[]) || [],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseFormsService implements IFormsService {
  private db = getFirestoreDb()

  async listSubmissions(): Promise<FormSubmission[]> {
    const snap = await getDocs(query(collection(this.db, COLLECTION), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toSubmission(d.id, d.data() as Record<string, unknown>))
  }

  async getSubmission(id: string): Promise<FormSubmission | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toSubmission(snap.id, snap.data() as Record<string, unknown>)
  }

  async createSubmission(data: Omit<FormSubmission, "id" | "createdAt" | "updatedAt">): Promise<FormSubmission> {
    const now = new Date().toISOString()
    const payload = { ...data, createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async updateStatus(id: string, status: FormSubmission["status"]): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), { status, updatedAt: new Date().toISOString() })
  }

  async assignSubmission(id: string, userId: string): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), {
      assignedTo: userId,
      status: "assigned",
      updatedAt: new Date().toISOString(),
    })
  }

  async addNote(id: string, note: Omit<Note, "id" | "createdAt">): Promise<void> {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: note.content,
      author: note.author,
      createdAt: new Date().toISOString(),
    }
    await updateDoc(doc(this.db, COLLECTION, id), {
      notes: arrayUnion(newNote),
      updatedAt: new Date().toISOString(),
    })
  }

  async convertToLead(id: string): Promise<string> {
    const submission = await this.getSubmission(id)
    if (!submission) throw new Error("Form submission not found")

    // Create lead from form data
    const leadData = submission.data as Record<string, unknown>
    const leadsCol = collection(this.db, "leads")
    const now = new Date().toISOString()
    const leadRef = await addDoc(leadsCol, {
      organizationName: (leadData.organizationName as string) || (leadData.company as string) || "",
      contactPerson: (leadData.name as string) || (leadData.contactPerson as string) || "",
      email: (leadData.email as string) || "",
      phone: (leadData.phone as string) || "",
      organizationType: (leadData.organizationType as string) || "",
      country: (leadData.country as string) || "",
      expectedMembers: Number(leadData.expectedMembers) || 0,
      website: (leadData.website as string) || "",
      leadSource: `form:${submission.type}`,
      estimatedValue: 0,
      status: "new",
      activities: [],
      attachments: [],
      createdAt: now,
      updatedAt: now,
    })

    // Mark submission as converted
    await updateDoc(doc(this.db, COLLECTION, id), {
      status: "resolved",
      convertedToLeadId: leadRef.id,
      updatedAt: now,
    })

    return leadRef.id
  }

  async getSubmissionStats(): Promise<{ new: number; total: number }> {
    const snap = await getDocs(collection(this.db, COLLECTION))
    const docs = snap.docs.map((d) => d.data() as { status: string })
    return {
      total: docs.length,
      new: docs.filter((d) => d.status === "new").length,
    }
  }
}
