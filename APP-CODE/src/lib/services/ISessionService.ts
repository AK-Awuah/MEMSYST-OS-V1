import type { Session } from "@/types"

export interface ISessionService {
  listActiveSessions(userId: string): Promise<Session[]>
  listAllActiveSessions(tenantId: string): Promise<Session[]>
  createSession(data: Omit<Session, "id" | "createdAt">): Promise<Session>
  terminateSession(sessionId: string): Promise<void>
  terminateAllUserSessions(userId: string): Promise<void>
  getSession(sessionId: string): Promise<Session | null>
  updateActivity(sessionId: string): Promise<void>
}
