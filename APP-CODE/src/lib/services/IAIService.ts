import type { AIAssistant, AIConversation, SmartAnalytic, WorkflowSuggestion, AIAuditLog } from "@/types"

export interface IAIService {
  listAssistants(tenantId: string): Promise<AIAssistant[]>
  getAssistant(id: string): Promise<AIAssistant | null>
  createAssistant(tenantId: string, data: Omit<AIAssistant, "id" | "createdAt" | "updatedAt">): Promise<AIAssistant>
  updateAssistant(id: string, data: Partial<AIAssistant>): Promise<void>
  toggleAssistant(id: string, enabled: boolean): Promise<void>
  listConversations(tenantId: string, assistantId?: string): Promise<AIConversation[]>
  logConversation(data: Omit<AIConversation, "id" | "createdAt">): Promise<AIConversation>
  listAnalytics(tenantId: string): Promise<SmartAnalytic[]>
  getAnalytic(id: string): Promise<SmartAnalytic | null>
  createAnalytic(tenantId: string, data: Omit<SmartAnalytic, "id" | "createdAt" | "updatedAt">): Promise<SmartAnalytic>
  runAnalytic(id: string): Promise<SmartAnalytic>
  listSuggestions(tenantId: string): Promise<WorkflowSuggestion[]>
  getSuggestion(id: string): Promise<WorkflowSuggestion | null>
  approveSuggestion(id: string, reviewedBy: string): Promise<void>
  dismissSuggestion(id: string, reviewedBy: string): Promise<void>
  getAuditLogs(tenantId: string): Promise<AIAuditLog[]>
}
