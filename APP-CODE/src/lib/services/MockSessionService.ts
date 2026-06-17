import type { ISessionService } from "./ISessionService"
import type { Session } from "@/types"

let sessions: Session[] = [
  {
    id: "sess-1",
    userId: "user-1",
    tenantId: "memsyst",
    device: "Chrome 125 / Windows 11",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125",
    lastActiveAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isActive: true,
  },
  {
    id: "sess-2",
    userId: "user-2",
    tenantId: "memsyst",
    device: "Firefox 128 / Windows 11",
    ipAddress: "192.168.1.2",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/128",
    lastActiveAt: new Date(Date.now() - 300000).toISOString(),
    expiresAt: new Date(Date.now() + 5400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isActive: true,
  },
  {
    id: "sess-3",
    userId: "user-1",
    tenantId: "memsyst",
    device: "Safari 18 / macOS 15",
    ipAddress: "10.0.0.1",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Safari/18",
    lastActiveAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 14400000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isActive: true,
  },
]

export class MockSessionService implements ISessionService {
  async listActiveSessions(userId: string): Promise<Session[]> {
    await delay(200)
    return sessions.filter((s) => s.userId === userId && s.isActive)
  }

  async listAllActiveSessions(tenantId: string): Promise<Session[]> {
    await delay(300)
    return sessions.filter((s) => s.tenantId === tenantId && s.isActive)
  }

  async createSession(data: Omit<Session, "id" | "createdAt">): Promise<Session> {
    await delay(200)
    const session: Session = {
      ...data,
      id: `sess-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    sessions.push(session)
    return session
  }

  async terminateSession(sessionId: string): Promise<void> {
    await delay(200)
    const session = sessions.find((s) => s.id === sessionId)
    if (session) session.isActive = false
  }

  async terminateAllUserSessions(userId: string): Promise<void> {
    await delay(300)
    sessions
      .filter((s) => s.userId === userId)
      .forEach((s) => { s.isActive = false })
  }

  async getSession(sessionId: string): Promise<Session | null> {
    await delay(100)
    return sessions.find((s) => s.id === sessionId) || null
  }

  async updateActivity(sessionId: string): Promise<void> {
    await delay(100)
    const session = sessions.find((s) => s.id === sessionId)
    if (session) session.lastActiveAt = new Date().toISOString()
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
