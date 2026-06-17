import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ISecurityAuditService } from "./ISecurityAuditService"
import type { SecurityEvent, SecurityAction, SecurityDashboardMetrics } from "@/types"

const COLLECTION = "securityEvents"
const USERS_COLLECTION = "users"
const SESSIONS_COLLECTION = "sessions"

function toSecurityEvent(id: string, data: Record<string, unknown>): SecurityEvent {
  return {
    id,
    actorId: (data.actorId as string) || "",
    actorName: (data.actorName as string) || "",
    action: (data.action as SecurityAction) || "login",
    resource: (data.resource as string) || "",
    tenantId: (data.tenantId as string) || "",
    ipAddress: (data.ipAddress as string) || "",
    device: (data.device as string) || "",
    result: (data.result as "success" | "failure") || "success",
    details: (data.details as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
  }
}

export class FirebaseSecurityAuditService implements ISecurityAuditService {
  private db = getFirestoreDb()

  async listEvents(params?: {
    tenantId?: string
    action?: SecurityAction
    actorId?: string
    result?: "success" | "failure"
    fromDate?: string
    toDate?: string
  }): Promise<SecurityEvent[]> {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.action) constraints.unshift(where("action", "==", params.action))
    if (params?.actorId) constraints.unshift(where("actorId", "==", params.actorId))
    if (params?.result) constraints.unshift(where("result", "==", params.result))
    const snap = await getDocs(query(collection(this.db, COLLECTION), ...constraints))
    let events = snap.docs.map((d) => toSecurityEvent(d.id, d.data() as Record<string, unknown>))
    // Date range filter (client-side since Firestore doesn't allow range on multiple fields without composite index)
    if (params?.fromDate) events = events.filter((e) => e.createdAt >= params.fromDate!)
    if (params?.toDate) events = events.filter((e) => e.createdAt <= params.toDate!)
    return events
  }

  async recordEvent(event: Omit<SecurityEvent, "id" | "createdAt">): Promise<void> {
    await addDoc(collection(this.db, COLLECTION), {
      ...event,
      createdAt: new Date().toISOString(),
    })
  }

  async getDashboardMetrics(tenantId: string): Promise<SecurityDashboardMetrics> {
    const [usersSnap, sessionsSnap, eventsSnap] = await Promise.all([
      getDocs(query(collection(this.db, USERS_COLLECTION), where("tenantId", "==", tenantId))),
      getDocs(query(collection(this.db, SESSIONS_COLLECTION), where("tenantId", "==", tenantId), where("isActive", "==", true))),
      getDocs(query(collection(this.db, COLLECTION), where("tenantId", "==", tenantId), orderBy("createdAt", "desc"), firestoreLimit(50))),
    ])

    const users = usersSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const events = eventsSnap.docs.map((d) => toSecurityEvent(d.id, d.data() as Record<string, unknown>))

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const failedLogins24h = events.filter((e) => e.action === "failed_login" && e.createdAt >= yesterday).length
    const lockedAccounts = users.filter((u) => u.status === "suspended").length

    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      failedLogins24h,
      lockedAccounts,
      activeSessions: sessionsSnap.size,
      recentEvents: events.slice(0, 10),
      recentLogins: events.filter((e) => e.action === "login" || e.action === "failed_login").slice(0, 5),
      recentRoleChanges: events.filter((e) => e.action === "role_changed").slice(0, 5),
    }
  }

  async getFailedLogins(tenantId: string, since: string): Promise<SecurityEvent[]> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("tenantId", "==", tenantId),
        where("action", "==", "failed_login"),
        orderBy("createdAt", "desc")
      )
    )
    const events = snap.docs.map((d) => toSecurityEvent(d.id, d.data() as Record<string, unknown>))
    return events.filter((e) => e.createdAt >= since)
  }

  async getRecentActivity(tenantId: string, limitCount = 20): Promise<SecurityEvent[]> {
    const snap = await getDocs(
      query(
        collection(this.db, COLLECTION),
        where("tenantId", "==", tenantId),
        orderBy("createdAt", "desc"),
        firestoreLimit(limitCount)
      )
    )
    return snap.docs.map((d) => toSecurityEvent(d.id, d.data() as Record<string, unknown>))
  }
}
