import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, orderBy, updateDoc, deleteDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICredentialTemplateService } from "./ICredentialTemplateService"
import type { CredentialTemplate, CredentialTemplateType, CredentialTemplateStatus } from "@/types"

const COLLECTION = "credentialTemplates"

function toCredentialTemplate(id: string, data: Record<string, unknown>): CredentialTemplate {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    type: (data.type as CredentialTemplateType) || "id_card_front",
    logo: (data.logo as string) || "",
    primaryColor: (data.primaryColor as string) || "",
    secondaryColor: (data.secondaryColor as string) || "",
    typography: (data.typography as string) || "",
    fields: (data.fields as CredentialTemplate["fields"]) || [],
    qrPlacement: (data.qrPlacement as CredentialTemplate["qrPlacement"]) || { x: 0, y: 0 },
    signaturePlacement: data.signaturePlacement as CredentialTemplate["signaturePlacement"] | undefined,
    backgroundImage: data.backgroundImage as string | undefined,
    version: (data.version as number) || 1,
    status: (data.status as CredentialTemplateStatus) || "draft",
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || "",
  }
}

export class FirebaseCredentialTemplateService implements ICredentialTemplateService {
  private db = getFirestoreDb()

  async listTemplates(tenantId: string, params?: { type?: CredentialTemplateType; status?: CredentialTemplateStatus }): Promise<CredentialTemplate[]> {
    const col = collection(this.db, COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.type) constraints.unshift(where("type", "==", params.type))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toCredentialTemplate(d.id, d.data() as Record<string, unknown>))
  }

  async getTemplate(id: string): Promise<CredentialTemplate | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id))
    if (!snap.exists()) return null
    return toCredentialTemplate(snap.id, snap.data() as Record<string, unknown>)
  }

  async createTemplate(data: Omit<CredentialTemplate, "id" | "createdAt" | "updatedAt">): Promise<CredentialTemplate> {
    const ref = await addDoc(collection(this.db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return this.getTemplate(ref.id) as Promise<CredentialTemplate>
  }

  async updateTemplate(id: string, data: Partial<CredentialTemplate>): Promise<CredentialTemplate> {
    await updateDoc(doc(this.db, COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
    return this.getTemplate(id) as Promise<CredentialTemplate>
  }

  async deleteTemplate(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COLLECTION, id))
  }

  async setActiveTemplate(id: string): Promise<CredentialTemplate> {
    const template = await this.getTemplate(id)
    if (!template) throw new Error("Template not found")
    const col = collection(this.db, COLLECTION)
    const activeSnap = await getDocs(query(col, where("type", "==", template.type), where("status", "==", "active")))
    const batchWrites = activeSnap.docs.map((d) =>
      updateDoc(doc(this.db, COLLECTION, d.id), { status: "archived", updatedAt: new Date().toISOString() })
    )
    await Promise.all(batchWrites)
    await updateDoc(doc(this.db, COLLECTION, id), { status: "active", updatedAt: new Date().toISOString() })
    return this.getTemplate(id) as Promise<CredentialTemplate>
  }

  async getActiveTemplates(tenantId: string, type: CredentialTemplateType): Promise<CredentialTemplate | null> {
    const col = collection(this.db, COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), where("type", "==", type), where("status", "==", "active"), orderBy("updatedAt", "desc")))
    if (snap.empty) return null
    return toCredentialTemplate(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>)
  }
}
