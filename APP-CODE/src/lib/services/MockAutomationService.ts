import { delay } from "./shared-store"
import { mockAutomationRules } from "./mock-data"
import type { AutomationRule, AutomationTriggerEvent } from "@/types"
import type { IAutomationService } from "./IAutomationService"

export class MockAutomationService implements IAutomationService {
  private items = [...mockAutomationRules]

  async createRule(tenantId: string, data: Omit<AutomationRule, "id" | "createdAt" | "updatedAt">): Promise<AutomationRule> {
    await delay(300)
    const item: AutomationRule = {
      ...data,
      id: `auto-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(item)
    return item
  }

  async updateRule(tenantId: string, id: string, data: Partial<AutomationRule>): Promise<AutomationRule> {
    await delay(200)
    const idx = this.items.findIndex((r) => r.id === id && r.tenantId === tenantId)
    if (idx === -1) throw new Error(`Rule ${id} not found`)
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async toggleRule(tenantId: string, id: string): Promise<AutomationRule> {
    await delay(200)
    const idx = this.items.findIndex((r) => r.id === id && r.tenantId === tenantId)
    if (idx === -1) throw new Error(`Rule ${id} not found`)
    this.items[idx] = { ...this.items[idx], isActive: !this.items[idx].isActive, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async deleteRule(tenantId: string, id: string): Promise<void> {
    await delay(100)
    this.items = this.items.filter((r) => !(r.id === id && r.tenantId === tenantId))
  }

  async listRules(tenantId: string): Promise<AutomationRule[]> {
    await delay(200)
    return this.items.filter((r) => r.tenantId === tenantId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getRuleById(id: string): Promise<AutomationRule | null> {
    await delay(100)
    return this.items.find((r) => r.id === id) || null
  }

  async processTrigger(event: AutomationTriggerEvent, data: Record<string, unknown>): Promise<void> {
    await delay(200)
    const matchedRules = this.items.filter((r) => r.triggerEvent === event && r.isActive)
    for (const rule of matchedRules) {
      console.log(`[Automation] Triggered rule "${rule.name}" for event "${event}"`, data)
    }
  }
}
