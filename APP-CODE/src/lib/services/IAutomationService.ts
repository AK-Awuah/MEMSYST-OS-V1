import type { AutomationRule, AutomationTriggerEvent } from "@/types"

export interface IAutomationService {
  createRule(tenantId: string, data: Omit<AutomationRule, "id" | "createdAt" | "updatedAt">): Promise<AutomationRule>
  updateRule(tenantId: string, id: string, data: Partial<AutomationRule>): Promise<AutomationRule>
  toggleRule(tenantId: string, id: string): Promise<AutomationRule>
  deleteRule(tenantId: string, id: string): Promise<void>
  listRules(tenantId: string): Promise<AutomationRule[]>
  getRuleById(id: string): Promise<AutomationRule | null>
  processTrigger(event: AutomationTriggerEvent, data: Record<string, unknown>): Promise<void>
}
