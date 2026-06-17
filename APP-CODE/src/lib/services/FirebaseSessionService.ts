import type { ISessionService } from "./ISessionService"
import type { Session } from "@/types"

export class FirebaseSessionService implements ISessionService {
  async listActiveSessions(_userId: string): Promise<Session[]> { return [] }
  async listAllActiveSessions(_tenantId: string): Promise<Session[]> { return [] }
  async createSession(_data: Omit<Session, "id" | "createdAt">): Promise<Session> { throw new Error("Firebase not configured") }
  async terminateSession(_sessionId: string): Promise<void> {}
  async terminateAllUserSessions(_userId: string): Promise<void> {}
  async getSession(_sessionId: string): Promise<Session | null> { return null }
  async updateActivity(_sessionId: string): Promise<void> {}
}
