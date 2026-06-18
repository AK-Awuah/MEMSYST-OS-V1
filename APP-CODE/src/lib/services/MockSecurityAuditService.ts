import type { ISecurityAuditService } from "./ISecurityAuditService"
import type { SecurityEvent, SecurityAction, SecurityDashboardMetrics } from "@/types"
import { sharedSecurityEvents, recordIdentitySecurityEvent } from "./shared-store"

// Seed shared store on module load
const seedEvents: SecurityEvent[] = [
  { id: "sec-1", actorId: "user-1", actorName: "Kwame Asante", action: "login", resource: "session", tenantId: "memsyst", ipAddress: "192.168.1.1", device: "Chrome/Windows", result: "success", createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: "sec-2", actorId: "user-2", actorName: "Ama Osei", action: "login", resource: "session", tenantId: "memsyst", ipAddress: "192.168.1.2", device: "Firefox/Windows", result: "success", createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: "sec-3", actorId: "unknown", actorName: "Unknown", action: "failed_login", resource: "session", tenantId: "memsyst", ipAddress: "203.0.113.1", device: "Unknown", result: "failure", details: "Invalid password for admin@memsyst.com", createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: "sec-4", actorId: "user-1", actorName: "Kwame Asante", action: "role_changed", resource: "users", tenantId: "memsyst", ipAddress: "192.168.1.1", device: "Chrome/Windows", result: "success", details: "user-2 role changed from operations_admin to sales_admin", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "sec-5", actorId: "unknown", actorName: "Unknown", action: "failed_login", resource: "session", tenantId: "memsyst", ipAddress: "203.0.113.2", device: "Unknown", result: "failure", details: "Account not found: hacker@test.com", createdAt: new Date(Date.now() - 1200000).toISOString() },
  { id: "sec-6", actorId: "user-1", actorName: "Kwame Asante", action: "password_changed", resource: "profile", tenantId: "memsyst", ipAddress: "192.168.1.1", device: "Chrome/Windows", result: "success", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "sec-7", actorId: "user-3", actorName: "Yaw Mensah", action: "logout", resource: "session", tenantId: "memsyst", ipAddress: "192.168.1.3", device: "Chrome/Windows", result: "success", createdAt: new Date(Date.now() - 7200000).toISOString() },
]

if (sharedSecurityEvents.length === 0) {
  sharedSecurityEvents.push(...seedEvents)
}

export class MockSecurityAuditService implements ISecurityAuditService {
  async listEvents(params?: { tenantId?: string; action?: SecurityAction; actorId?: string; result?: "success" | "failure"; fromDate?: string; toDate?: string }): Promise<SecurityEvent[]> {
    await delay(200)
    let filtered = [...sharedSecurityEvents]
    if (params?.tenantId) filtered = filtered.filter((e) => e.tenantId === params.tenantId)
    if (params?.action) filtered = filtered.filter((e) => e.action === params.action)
    if (params?.actorId) filtered = filtered.filter((e) => e.actorId === params.actorId)
    if (params?.result) filtered = filtered.filter((e) => e.result === params.result)
    if (params?.fromDate) filtered = filtered.filter((e) => e.createdAt >= params.fromDate!)
    if (params?.toDate) filtered = filtered.filter((e) => e.createdAt <= params.toDate!)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async recordEvent(data: Omit<SecurityEvent, "id" | "createdAt">): Promise<void> {
    await delay(100)
    recordIdentitySecurityEvent(data)
  }

  async getDashboardMetrics(tenantId: string): Promise<SecurityDashboardMetrics> {
    await delay(300)
    const tenantEvents = sharedSecurityEvents.filter((e) => e.tenantId === tenantId)
    const now = Date.now()
    return {
      totalUsers: 5,
      activeUsers: 3,
      failedLogins24h: tenantEvents.filter((e) => e.action === "failed_login" && e.createdAt >= new Date(now - 86400000).toISOString()).length,
      lockedAccounts: 0,
      activeSessions: 3,
      recentEvents: tenantEvents.slice(0, 5),
      recentLogins: tenantEvents.filter((e) => e.action === "login").slice(0, 3),
      recentFailedLogins: tenantEvents.filter((e) => e.action === "failed_login").slice(0, 5),
      recentRoleChanges: tenantEvents.filter((e) => e.action === "role_changed").slice(0, 3),
    }
  }

  async getFailedLogins(tenantId: string, since: string): Promise<SecurityEvent[]> {
    await delay(200)
    return sharedSecurityEvents.filter((e) => e.tenantId === tenantId && e.action === "failed_login" && e.createdAt >= since)
  }

  async getRecentActivity(tenantId: string, limit = 10): Promise<SecurityEvent[]> {
    await delay(200)
    return sharedSecurityEvents
      .filter((e) => e.tenantId === tenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
