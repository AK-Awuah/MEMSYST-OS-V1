import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  getCountFromServer,
  Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { INotificationService } from "./INotificationService"
import type { Notification } from "@/types"

const COLLECTION = "notifications"

function toNotification(id: string, data: Record<string, unknown>): Notification {
  return {
    id,
    type: (data.type as Notification["type"]) || "new_lead",
    title: (data.title as string) || "",
    message: (data.message as string) || "",
    recipientId: (data.recipientId as string) || "",
    relatedId: (data.relatedId as string) || undefined,
    relatedModule: (data.relatedModule as string) || undefined,
    status: (data.status as Notification["status"]) || "unread",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
  }
}

export class FirebaseNotificationService implements INotificationService {
  private db = getFirestoreDb()

  async listNotifications(userId: string): Promise<Notification[]> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("recipientId", "==", userId),
        orderBy("createdAt", "desc")
      )
    )
    return snap.docs.map((d) => toNotification(d.id, d.data() as Record<string, unknown>))
  }

  async getUnreadCount(userId: string): Promise<number> {
    const q = query(
      collection(this.db, COLLECTION),
      where("recipientId", "==", userId),
      where("status", "==", "unread")
    )
    const snap = await getCountFromServer(q)
    return snap.data().count
  }

  async markAsRead(id: string): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), { status: "read" })
  }

  async markAllAsRead(userId: string): Promise<void> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("recipientId", "==", userId),
        where("status", "==", "unread")
      )
    )
    const updates = snap.docs.map((d) => updateDoc(doc(this.db, COLLECTION, d.id), { status: "read" }))
    await Promise.all(updates)
  }

  async archive(id: string): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, id), { status: "archived" })
  }

  async createNotification(data: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    const now = new Date().toISOString()
    const payload = { ...data, createdAt: now }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }
}
