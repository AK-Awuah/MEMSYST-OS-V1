import {
  collection, addDoc, getDocs, getDoc, doc, updateDoc,
  query, where, orderBy, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITemplateService } from "./ITemplateService"
import type { Template, TemplateType, TemplateStatus } from "@/types"

const COLLECTION = "templates"

function toTemplate(id: string, data: Record<string, unknown>): Template {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    type: (data.type as TemplateType) || "email",
    subject: (data.subject as string) || "",
    content: (data.content as string) || "",
    variables: (data.variables as string[]) || [],
    description: (data.description as string) || "",
    createdBy: (data.createdBy as string) || "",
    status: (data.status as TemplateStatus) || "draft",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseTemplateService implements ITemplateService {
  private db = getFirestoreDb()

  async createTemplate(tenantId: string, data: Omit<Template, "id" | "createdAt" | "updatedAt">): Promise<Template> {
    const col = collection(this.db, COLLECTION)
    const now = new Date().toISOString()
    const payload = { ...data, tenantId, createdAt: now, updatedAt: now }
    const ref = await addDoc(col, payload)
    return { id: ref.id, ...payload }
  }

  async updateTemplate(tenantId: string, id: string, data: Partial<Template>): Promise<Template> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Template ${id} not found`)
    const now = new Date().toISOString()
    await updateDoc(ref, { ...data, updatedAt: now })
    const updated = await getDoc(ref)
    return toTemplate(updated.id, updated.data() as Record<string, unknown>)
  }

  async activateTemplate(tenantId: string, id: string): Promise<Template> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Template ${id} not found`)
    const now = new Date().toISOString()
    await updateDoc(ref, { status: "active", updatedAt: now })
    const updated = await getDoc(ref)
    return toTemplate(updated.id, updated.data() as Record<string, unknown>)
  }

  async archiveTemplate(tenantId: string, id: string): Promise<Template> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Template ${id} not found`)
    const now = new Date().toISOString()
    await updateDoc(ref, { status: "archived", updatedAt: now })
    const updated = await getDoc(ref)
    return toTemplate(updated.id, updated.data() as Record<string, unknown>)
  }

  async cloneTemplate(tenantId: string, id: string, newName: string): Promise<Template> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) throw new Error(`Template ${id} not found`)
    const data = snap.data() as Record<string, unknown>
    const now = new Date().toISOString()
    const payload = {
      tenantId,
      name: newName,
      type: (data.type as TemplateType) || "email",
      subject: (data.subject as string) || "",
      content: (data.content as string) || "",
      variables: (data.variables as string[]) || [],
      description: (data.description as string) || "",
      createdBy: (data.createdBy as string) || "",
      status: "draft" as TemplateStatus,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async listTemplates(tenantId: string, filters?: { type?: string; status?: string }): Promise<Template[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (filters?.type) constraints.splice(1, 0, where("type", "==", filters.type))
    if (filters?.status) constraints.splice(1, 0, where("status", "==", filters.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toTemplate(d.id, d.data() as Record<string, unknown>))
  }

  async getTemplateById(id: string): Promise<Template | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toTemplate(snap.id, snap.data() as Record<string, unknown>)
  }

  async previewTemplate(id: string, variables: Record<string, string>): Promise<string> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) throw new Error(`Template ${id} not found`)
    const data = snap.data() as Record<string, unknown>
    let body = (data.body as string) || ""
    for (const [key, value] of Object.entries(variables)) {
      body = body.replace(new RegExp(`{{${key}}}`, "g"), value)
    }
    return body
  }
}
