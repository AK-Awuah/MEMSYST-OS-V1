import { delay } from "./shared-store"
import { mockSubscriptions } from "./mock-data"
import type { Subscription, SubscriptionCategory, CommunicationChannel } from "@/types"
import type { ISubscriptionService } from "./ISubscriptionService"

export class MockSubscriptionService implements ISubscriptionService {
  private items = [...mockSubscriptions]

  async getSubscriptions(tenantId: string, userId: string): Promise<Subscription[]> {
    await delay(200)
    return this.items.filter((s) => s.tenantId === tenantId && s.userId === userId)
  }

  async updateSubscription(tenantId: string, userId: string, category: SubscriptionCategory, subscribed: boolean, channel: CommunicationChannel): Promise<Subscription> {
    await delay(200)
    const existing = this.items.find((s) => s.tenantId === tenantId && s.userId === userId && s.category === category && s.channel === channel)
    if (existing) {
      existing.subscribed = subscribed
      existing.updatedAt = new Date().toISOString()
      return existing
    }
    const sub: Subscription = {
      id: `sub-${Date.now()}`,
      tenantId,
      userId,
      memberId: "",
      category,
      subscribed,
      channel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.unshift(sub)
    return sub
  }

  async subscribe(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<Subscription> {
    return this.updateSubscription(tenantId, userId, category, true, channel)
  }

  async unsubscribe(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<void> {
    await delay(100)
    const existing = this.items.find((s) => s.tenantId === tenantId && s.userId === userId && s.category === category && s.channel === channel)
    if (existing) {
      existing.subscribed = false
      existing.updatedAt = new Date().toISOString()
    }
  }

  async isSubscribed(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<boolean> {
    await delay(100)
    const sub = this.items.find((s) => s.tenantId === tenantId && s.userId === userId && s.category === category && s.channel === channel)
    return sub ? sub.subscribed : true
  }
}
