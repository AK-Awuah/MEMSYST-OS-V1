import type { Subscription, SubscriptionCategory, CommunicationChannel } from "@/types"

export interface ISubscriptionService {
  getSubscriptions(tenantId: string, userId: string): Promise<Subscription[]>
  updateSubscription(tenantId: string, userId: string, category: SubscriptionCategory, subscribed: boolean, channel: CommunicationChannel): Promise<Subscription>
  subscribe(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<Subscription>
  unsubscribe(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<void>
  isSubscribed(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<boolean>
}
