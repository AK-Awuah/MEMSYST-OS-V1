import type { IAIService } from "./IAIService"
import type { AIAssistant, AIConversation, SmartAnalytic, WorkflowSuggestion, AIAuditLog } from "@/types"
import { delay, pushAuditLog } from "./shared-store"

const assistants: AIAssistant[] = []
const conversations: AIConversation[] = []
const analytics: SmartAnalytic[] = []
const suggestions: WorkflowSuggestion[] = []

export class MockAIService implements IAIService {
  async listAssistants(tenantId: string): Promise<AIAssistant[]> {
    await delay(200)
    return assistants.filter((a) => a.tenantId === tenantId)
  }

  async getAssistant(id: string): Promise<AIAssistant | null> {
    await delay(100)
    return assistants.find((a) => a.id === id) || null
  }

  async createAssistant(tenantId: string, data: Omit<AIAssistant, "id" | "createdAt" | "updatedAt">): Promise<AIAssistant> {
    await delay(200)
    const now = new Date().toISOString()
    const assistant: AIAssistant = { ...data, id: `ai-${Date.now()}`, tenantId, createdAt: now, updatedAt: now }
    assistants.push(assistant)
    pushAuditLog({ actor: "System", role: "system", action: "CREATE", module: "AI", recordType: "AIAssistant", recordId: assistant.id, newValue: `Assistant created: ${assistant.name}`, ipAddress: "127.0.0.1" })
    return assistant
  }

  async updateAssistant(id: string, data: Partial<AIAssistant>): Promise<void> {
    await delay(150)
    const idx = assistants.findIndex((a) => a.id === id)
    if (idx !== -1) assistants[idx] = { ...assistants[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async toggleAssistant(id: string, enabled: boolean): Promise<void> {
    await delay(150)
    const idx = assistants.findIndex((a) => a.id === id)
    if (idx !== -1) assistants[idx] = { ...assistants[idx], enabled, updatedAt: new Date().toISOString() }
  }

  async listConversations(tenantId: string, assistantId?: string): Promise<AIConversation[]> {
    await delay(200)
    let result = conversations.filter((c) => c.tenantId === tenantId)
    if (assistantId) result = result.filter((c) => c.assistantId === assistantId)
    return result
  }

  async logConversation(data: Omit<AIConversation, "id" | "createdAt">): Promise<AIConversation> {
    await delay(100)
    const conversation: AIConversation = { ...data, id: `conv-${Date.now()}`, createdAt: new Date().toISOString() }
    conversations.push(conversation)
    return conversation
  }

  async listAnalytics(tenantId: string): Promise<SmartAnalytic[]> {
    await delay(200)
    return analytics.filter((a) => a.tenantId === tenantId)
  }

  async getAnalytic(id: string): Promise<SmartAnalytic | null> {
    await delay(100)
    return analytics.find((a) => a.id === id) || null
  }

  async createAnalytic(tenantId: string, data: Omit<SmartAnalytic, "id" | "createdAt" | "updatedAt">): Promise<SmartAnalytic> {
    await delay(200)
    const now = new Date().toISOString()
    const analytic: SmartAnalytic = { ...data, id: `sa-${Date.now()}`, tenantId, createdAt: now, updatedAt: now }
    analytics.push(analytic)
    return analytic
  }

  async runAnalytic(id: string): Promise<SmartAnalytic> {
    await delay(300)
    const idx = analytics.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error(`Analytic ${id} not found`)
    const now = new Date().toISOString()
    analytics[idx] = { ...analytics[idx], lastRunAt: now, lastResult: "Run completed", updatedAt: now }
    return analytics[idx]
  }

  async listSuggestions(tenantId: string): Promise<WorkflowSuggestion[]> {
    await delay(200)
    return suggestions.filter((s) => s.tenantId === tenantId)
  }

  async getSuggestion(id: string): Promise<WorkflowSuggestion | null> {
    await delay(100)
    return suggestions.find((s) => s.id === id) || null
  }

  async approveSuggestion(id: string, reviewedBy: string): Promise<void> {
    await delay(150)
    const idx = suggestions.findIndex((s) => s.id === id)
    if (idx !== -1) suggestions[idx] = { ...suggestions[idx], status: "approved", reviewedBy, updatedAt: new Date().toISOString() }
  }

  async dismissSuggestion(id: string, reviewedBy: string): Promise<void> {
    await delay(150)
    const idx = suggestions.findIndex((s) => s.id === id)
    if (idx !== -1) suggestions[idx] = { ...suggestions[idx], status: "dismissed", reviewedBy, updatedAt: new Date().toISOString() }
  }

  async getAuditLogs(tenantId: string): Promise<AIAuditLog[]> {
    await delay(100)
    return []
  }
}
