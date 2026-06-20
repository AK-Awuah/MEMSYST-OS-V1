import type { APIKey, Webhook, WebhookDelivery, ThirdPartyIntegration, IntegrationAuditLog } from "@/types"

export interface IIntegrationService {
  listAPIKeys(tenantId: string): Promise<APIKey[]>
  getAPIKey(id: string): Promise<APIKey | null>
  createAPIKey(data: Omit<APIKey, "id" | "keyPrefix" | "keyHash" | "createdAt" | "updatedAt">): Promise<APIKey>
  revokeAPIKey(id: string): Promise<void>

  listWebhooks(tenantId: string): Promise<Webhook[]>
  getWebhook(id: string): Promise<Webhook | null>
  createWebhook(data: Omit<Webhook, "id" | "createdAt" | "updatedAt">): Promise<Webhook>
  updateWebhook(id: string, data: Partial<Webhook>): Promise<void>
  toggleWebhook(id: string): Promise<void>

  listDeliveries(webhookId: string): Promise<WebhookDelivery[]>

  listIntegrations(tenantId: string): Promise<ThirdPartyIntegration[]>
  getIntegration(id: string): Promise<ThirdPartyIntegration | null>
  createIntegration(data: Omit<ThirdPartyIntegration, "id" | "createdAt" | "updatedAt">): Promise<ThirdPartyIntegration>
  updateIntegration(id: string, data: Partial<ThirdPartyIntegration>): Promise<void>
  toggleIntegration(id: string): Promise<void>
  syncIntegration(id: string): Promise<void>

  getAuditLogs(tenantId: string): Promise<IntegrationAuditLog[]>
}
