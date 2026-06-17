import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ISessionService } from "./ISessionService"
import type { Session } from "@/types"

const COLLECTION = "sessions"

function toSession(id: string, data: Record<string, unknown>): Session {
  return {
    id,
    userId: (data.userId as string) || "",
    tenantId: (data.tenantId as string) || "",
    device: (data.device as string) || "",
    ipAddress: (data.ipAddress as string) || "",
    userAgent: (data.userAgent as string) || "",
    lastActiveAt: data.lastActiveAt instanceof Timestamp
      ? data.lastActiveAt.toDate().toISOString()
      : (data.lastActiveAt as string) || new Date().toISOString(),
    expiresAt: data.expiresAt instanceof Timestamp
      ? data.expiresAt.toDate().toISOString()
      : (data.expiresAt as string) || new Date().toISOString(),
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    isActive: (data.isActive as boolean) ?? true,
  }
}

export class FirebaseSessionService implements ISessionService {
  private db = getFirestoreDb()

  async listActiveSessions(userId: string): Promise<Session[]> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("userId", "==", userId),
        where("isActive", "==", true)
      )
    )
    return snap.docs.map((d) => toSession(d.id, d.data() as Record<string, unknown>))
  }

  async listAllActiveSessions(tenantId: string): Promise<Session[]> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("tenantId", "==", tenantId),
        where("isActive", "==", true),
        orderBy("lastActiveAt", "desc")
      )
    )
    return snap.docs.map((d) => toSession(d.id, d.data() as Record<string, unknown>))
  }

  async createSession(data: Omit<Session, "id" | "createdAt">): Promise<Session> {
    const now = new Date().toISOString()
    const payload = { ...data, createdAt: now }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async terminateSession(sessionId: string): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, sessionId), {
      isActive: false,
      lastActiveAt: new Date().toISOString(),
    })
  }

  async terminateAllUserSessions(userId: string): Promise<void> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("userId", "==", userId),
        where("isActive", "==", true)
      )
    )
    const updates = snap.docs.map((d) =>
      updateDoc(doc(this.db, COLLECTION, d.id), {
        isActive: false,
        lastActiveAt: new Date().toISOString(),
      })
    )
    await Promise.all(updates)
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, sessionId))
    if (!snap.exists()) return null
    return toSession(snap.id, snap.data() as Record<string, unknown>)
  }

  async updateActivity(sessionId: string): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, sessionId), {
      lastActiveAt: new Date().toISOString(),
    })
  }
}
