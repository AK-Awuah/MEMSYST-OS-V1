import type { IIntegrationService } from "./IIntegrationService"
import type { APIKey, Webhook, WebhookDelivery, ThirdPartyIntegration, IntegrationAuditLog } from "@/types"
import { delay } from "./shared-store"

const apiKeys: APIKey[] = [
  {
    id: "ak-1",
    tenantId: "tenant-1",
    name: "Production API Key",
    keyPrefix: "mst_prod",
    keyHash: "hash_mst_prod",
    permissions: ["members:read", "members:write"],
    allowedIPs: ["192.168.1.0/24"],
    rateLimit: 1000,
    status: "active",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const webhooks: Webhook[] = [
  {
    id: "wh-1",
    tenantId: "tenant-1",
    name: "Member Created Webhook",
    url: "https://example.com/webhooks/member-created",
    events: ["member.created", "member.updated"],
    secret: "whsec_test",
    headers: { "X-Custom-Header": "value" },
    retryCount: 3,
    timeout: 5000,
    status: "active",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const deliveries: WebhookDelivery[] = [
  {
    id: "del-1",
    webhookId: "wh-1",
    tenantId: "tenant-1",
    event: "member.created",
    payload: JSON.stringify({ memberId: "mem-1" }),
    responseStatus: 200,
    responseBody: "OK",
    duration: 120,
    attemptNumber: 1,
    status: "success",
    deliveredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
]

const integrations: ThirdPartyIntegration[] = [
  {
    id: "int-1",
    tenantId: "tenant-1",
    name: "Stripe Payments",
    integrationType: "payment_gateway",
    provider: "stripe",
    config: { apiKey: "sk_test_***" },
    isEnabled: true,
    lastSyncAt: new Date().toISOString(),
    syncStatus: "success",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let nextApiKeyId = apiKeys.length + 1
let nextWebhookId = webhooks.length + 1
const nextDeliveryId = deliveries.length + 1
let nextIntegrationId = integrations.length + 1

export class MockIntegrationService implements IIntegrationService {
  async listAPIKeys(tenantId: string): Promise<APIKey[]> {
    await delay(150)
    return apiKeys.filter((k) => k.tenantId === tenantId)
  }

  async getAPIKey(id: string): Promise<APIKey | null> {
    await delay(100)
    return apiKeys.find((k) => k.id === id) || null
  }

  async createAPIKey(data: Omit<APIKey, "id" | "keyPrefix" | "keyHash" | "createdAt" | "updatedAt">): Promise<APIKey> {
    await delay(200)
    const keyPrefix = `mst_${Math.random().toString(36).slice(2, 8)}`
    const key: APIKey = {
      ...data,
      id: `ak-${nextApiKeyId++}`,
      keyPrefix,
      keyHash: `hash_${keyPrefix}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    apiKeys.push(key)
    return key
  }

  async revokeAPIKey(id: string): Promise<void> {
    await delay(100)
    const idx = apiKeys.findIndex((k) => k.id === id)
    if (idx !== -1) apiKeys[idx] = { ...apiKeys[idx], status: "revoked", updatedAt: new Date().toISOString() }
  }

  async listWebhooks(tenantId: string): Promise<Webhook[]> {
    await delay(150)
    return webhooks.filter((w) => w.tenantId === tenantId)
  }

  async getWebhook(id: string): Promise<Webhook | null> {
    await delay(100)
    return webhooks.find((w) => w.id === id) || null
  }

  async createWebhook(data: Omit<Webhook, "id" | "createdAt" | "updatedAt">): Promise<Webhook> {
    await delay(200)
    const webhook: Webhook = { ...data, id: `wh-${nextWebhookId++}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    webhooks.push(webhook)
    return webhook
  }

  async updateWebhook(id: string, data: Partial<Webhook>): Promise<void> {
    await delay(150)
    const idx = webhooks.findIndex((w) => w.id === id)
    if (idx !== -1) webhooks[idx] = { ...webhooks[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async toggleWebhook(id: string): Promise<void> {
    await delay(100)
    const idx = webhooks.findIndex((w) => w.id === id)
    if (idx !== -1) {
      webhooks[idx] = {
        ...webhooks[idx],
        status: webhooks[idx].status === "active" ? "paused" : "active",
        updatedAt: new Date().toISOString(),
      }
    }
  }

  async listDeliveries(webhookId: string): Promise<WebhookDelivery[]> {
    await delay(100)
    return deliveries.filter((d) => d.webhookId === webhookId)
  }

  async listIntegrations(tenantId: string): Promise<ThirdPartyIntegration[]> {
    await delay(150)
    return integrations.filter((i) => i.tenantId === tenantId)
  }

  async getIntegration(id: string): Promise<ThirdPartyIntegration | null> {
    await delay(100)
    return integrations.find((i) => i.id === id) || null
  }

  async createIntegration(data: Omit<ThirdPartyIntegration, "id" | "createdAt" | "updatedAt">): Promise<ThirdPartyIntegration> {
    await delay(200)
    const integration: ThirdPartyIntegration = {
      ...data,
      id: `int-${nextIntegrationId++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    integrations.push(integration)
    return integration
  }

  async updateIntegration(id: string, data: Partial<ThirdPartyIntegration>): Promise<void> {
    await delay(150)
    const idx = integrations.findIndex((i) => i.id === id)
    if (idx !== -1) integrations[idx] = { ...integrations[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async toggleIntegration(id: string): Promise<void> {
    await delay(100)
    const idx = integrations.findIndex((i) => i.id === id)
    if (idx !== -1) {
      integrations[idx] = {
        ...integrations[idx],
        isEnabled: !integrations[idx].isEnabled,
        updatedAt: new Date().toISOString(),
      }
    }
  }

  async syncIntegration(id: string): Promise<void> {
    await delay(300)
    const idx = integrations.findIndex((i) => i.id === id)
    if (idx !== -1) {
      integrations[idx] = {
        ...integrations[idx],
        syncStatus: "success",
        lastSyncAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  }

  async getAuditLogs(tenantId: string): Promise<IntegrationAuditLog[]> {
    await delay(100)
    return [
      {
        id: "ial-1",
        tenantId,
        actor: "user-1",
        action: "api_key_created",
        recordType: "api_key",
        recordId: "ak-1",
        details: "Created production API key",
        createdAt: new Date().toISOString(),
      },
    ]
  }
}
