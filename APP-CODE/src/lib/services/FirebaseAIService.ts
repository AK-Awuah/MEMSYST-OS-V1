import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IAIService } from "./IAIService"
import type { AIAssistant, AIConversation, SmartAnalytic, WorkflowSuggestion, AIAuditLog } from "@/types"

const ASSISTANTS_COLLECTION = "ai_assistants"
const CONVERSATIONS_COLLECTION = "ai_conversations"
const ANALYTICS_COLLECTION = "smart_analytics"
const SUGGESTIONS_COLLECTION = "workflow_suggestions"
const AUDIT_COLLECTION = "ai_audit_logs"

function toAssistant(id: string, data: Record<string, unknown>): AIAssistant {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    assistantType: (data.assistantType as AIAssistant["assistantType"]) || "general",
    description: (data.description as string) || "",
    systemPrompt: (data.systemPrompt as string) || "",
    model: (data.model as string) || "",
    temperature: (data.temperature as number) || 0.7,
    maxTokens: (data.maxTokens as number) || 2048,
    enabled: (data.enabled as boolean) || false,
    trainingData: (data.trainingData as string[]) || [],
    useTenantContext: (data.useTenantContext as boolean) || false,
    suggestedQuestions: (data.suggestedQuestions as string[]) || [],
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toConversation(id: string, data: Record<string, unknown>): AIConversation {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    assistantId: (data.assistantId as string) || "",
    userId: (data.userId as string) || "",
    userMessage: (data.userMessage as string) || "",
    assistantResponse: (data.assistantResponse as string) || "",
    tokensUsed: (data.tokensUsed as number) || 0,
    processingTime: (data.processingTime as number) || 0,
    feedback: data.feedback as "helpful" | "not_helpful" | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

function toAnalytic(id: string, data: Record<string, unknown>): SmartAnalytic {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    dataSource: (data.dataSource as string) || "",
    query: (data.query as string) || "",
    schedule: (data.schedule as SmartAnalytic["schedule"]) || "on_demand",
    lastRunAt: data.lastRunAt as string | undefined,
    lastResult: data.lastResult as string | undefined,
    recipients: (data.recipients as string[]) || [],
    enabled: (data.enabled as boolean) || false,
    createdBy: (data.createdBy as string) || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toSuggestion(id: string, data: Record<string, unknown>): WorkflowSuggestion {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    triggerEvent: (data.triggerEvent as string) || "",
    suggestedActions: (data.suggestedActions as string[]) || [],
    confidence: (data.confidence as number) || 0,
    status: (data.status as WorkflowSuggestion["status"]) || "pending_review",
    reviewedBy: data.reviewedBy as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toAuditLog(id: string, data: Record<string, unknown>): AIAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as AIAuditLog["action"]) || "assistant_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: data.previousValue as string | undefined,
    newValue: data.newValue as string | undefined,
    details: data.details as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseAIService implements IAIService {
  private db = getFirestoreDb()

  async listAssistants(tenantId: string): Promise<AIAssistant[]> {
    const col = collection(this.db, ASSISTANTS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAssistant(d.id, d.data() as Record<string, unknown>))
  }

  async getAssistant(id: string): Promise<AIAssistant | null> {
    const snap = await getDoc(doc(this.db, ASSISTANTS_COLLECTION, id))
    if (!snap.exists()) return null
    return toAssistant(snap.id, snap.data() as Record<string, unknown>)
  }

  async createAssistant(tenantId: string, data: Omit<AIAssistant, "id" | "createdAt" | "updatedAt">): Promise<AIAssistant> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, ASSISTANTS_COLLECTION), { ...data, tenantId, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toAssistant(created.id, created.data() as Record<string, unknown>)
  }

  async updateAssistant(id: string, data: Partial<AIAssistant>): Promise<void> {
    await updateDoc(doc(this.db, ASSISTANTS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async toggleAssistant(id: string, enabled: boolean): Promise<void> {
    await updateDoc(doc(this.db, ASSISTANTS_COLLECTION, id), { enabled, updatedAt: new Date().toISOString() })
  }

  async listConversations(tenantId: string, assistantId?: string): Promise<AIConversation[]> {
    const col = collection(this.db, CONVERSATIONS_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (assistantId) constraints.unshift(where("assistantId", "==", assistantId))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toConversation(d.id, d.data() as Record<string, unknown>))
  }

  async logConversation(data: Omit<AIConversation, "id" | "createdAt">): Promise<AIConversation> {
    const ref = await addDoc(collection(this.db, CONVERSATIONS_COLLECTION), { ...data, createdAt: new Date().toISOString() })
    const created = await getDoc(ref)
    return toConversation(created.id, created.data() as Record<string, unknown>)
  }

  async listAnalytics(tenantId: string): Promise<SmartAnalytic[]> {
    const col = collection(this.db, ANALYTICS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAnalytic(d.id, d.data() as Record<string, unknown>))
  }

  async getAnalytic(id: string): Promise<SmartAnalytic | null> {
    const snap = await getDoc(doc(this.db, ANALYTICS_COLLECTION, id))
    if (!snap.exists()) return null
    return toAnalytic(snap.id, snap.data() as Record<string, unknown>)
  }

  async createAnalytic(tenantId: string, data: Omit<SmartAnalytic, "id" | "createdAt" | "updatedAt">): Promise<SmartAnalytic> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, ANALYTICS_COLLECTION), { ...data, tenantId, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toAnalytic(created.id, created.data() as Record<string, unknown>)
  }

  async runAnalytic(id: string): Promise<SmartAnalytic> {
    const ref = doc(this.db, ANALYTICS_COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Analytic ${id} not found`)
    const now = new Date().toISOString()
    await updateDoc(ref, { lastRunAt: now, lastResult: "Run completed", updatedAt: now })
    const updated = await getDoc(ref)
    return toAnalytic(updated.id, updated.data() as Record<string, unknown>)
  }

  async listSuggestions(tenantId: string): Promise<WorkflowSuggestion[]> {
    const col = collection(this.db, SUGGESTIONS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toSuggestion(d.id, d.data() as Record<string, unknown>))
  }

  async getSuggestion(id: string): Promise<WorkflowSuggestion | null> {
    const snap = await getDoc(doc(this.db, SUGGESTIONS_COLLECTION, id))
    if (!snap.exists()) return null
    return toSuggestion(snap.id, snap.data() as Record<string, unknown>)
  }

  async approveSuggestion(id: string, reviewedBy: string): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, SUGGESTIONS_COLLECTION, id), { status: "approved", reviewedBy, updatedAt: now })
  }

  async dismissSuggestion(id: string, reviewedBy: string): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, SUGGESTIONS_COLLECTION, id), { status: "dismissed", reviewedBy, updatedAt: now })
  }

  async getAuditLogs(tenantId: string): Promise<AIAuditLog[]> {
    const col = collection(this.db, AUDIT_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
