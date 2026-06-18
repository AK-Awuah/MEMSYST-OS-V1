import {
  collection, getDocs, getDoc, doc, addDoc,
  query, where, updateDoc, Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ISubscriptionService } from "./ISubscriptionService"
import type { Subscription, SubscriptionCategory, CommunicationChannel } from "@/types"

const COLLECTION = "subscriptions"

function toSubscription(id: string, data: Record<string, unknown>): Subscription {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    userId: (data.userId as string) || "",
    category: (data.category as SubscriptionCategory) || "general",
    channel: (data.channel as CommunicationChannel) || "email",
    subscribed: (data.subscribed as boolean) ?? true,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseSubscriptionService implements ISubscriptionService {
  private db = getFirestoreDb()

  async getSubscriptions(tenantId: string, userId: string): Promise<Subscription[]> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("tenantId", "==", tenantId),
        where("userId", "==", userId)
      )
    )
    return snap.docs.map((d) => toSubscription(d.id, d.data() as Record<string, unknown>))
  }

  async updateSubscription(tenantId: string, userId: string, category: SubscriptionCategory, subscribed: boolean, channel: CommunicationChannel): Promise<Subscription> {
    const existing = await this._findSubscription(tenantId, userId, category, channel)
    const now = new Date().toISOString()
    if (existing) {
      const ref = doc(this.db, COLLECTION, existing.id)
      await updateDoc(ref, { subscribed, updatedAt: now })
      const updated = await getDoc(ref)
      return toSubscription(updated.id, updated.data() as Record<string, unknown>)
    }
    return this.subscribe(tenantId, userId, category, channel)
  }

  async subscribe(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<Subscription> {
    const existing = await this._findSubscription(tenantId, userId, category, channel)
    const now = new Date().toISOString()
    if (existing) {
      const ref = doc(this.db, COLLECTION, existing.id)
      await updateDoc(ref, { subscribed: true, updatedAt: now })
      const updated = await getDoc(ref)
      return toSubscription(updated.id, updated.data() as Record<string, unknown>)
    }
    const payload = {
      tenantId, userId, category, channel,
      subscribed: true,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async unsubscribe(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<void> {
    const existing = await this._findSubscription(tenantId, userId, category, channel)
    if (existing) {
      const ref = doc(this.db, COLLECTION, existing.id)
      await updateDoc(ref, { subscribed: false, updatedAt: new Date().toISOString() })
    }
  }

  async isSubscribed(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<boolean> {
    const existing = await this._findSubscription(tenantId, userId, category, channel)
    if (!existing) return true
    return existing.subscribed
  }

  private async _findSubscription(tenantId: string, userId: string, category: SubscriptionCategory, channel: CommunicationChannel): Promise<Subscription | null> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("tenantId", "==", tenantId),
        where("userId", "==", userId),
        where("category", "==", category),
        where("channel", "==", channel)
      )
    )
    if (snap.empty) return null
    return toSubscription(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>)
  }
}
