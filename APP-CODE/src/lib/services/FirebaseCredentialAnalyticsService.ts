import { collection, getDocs, query, where, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ICredentialAnalyticsService } from "./ICredentialAnalyticsService"
import type { CredentialAnalytics } from "@/types"

const ID_CARD_COL = "idCards"
const CERTIFICATE_COL = "certificates"
const PRINT_COL = "printRequests"

export class FirebaseCredentialAnalyticsService implements ICredentialAnalyticsService {
  private db = getFirestoreDb()

  async getAnalytics(tenantId?: string): Promise<CredentialAnalytics> {
    return this.computeAnalytics(tenantId)
  }

  async getTenantAnalytics(tenantId: string): Promise<CredentialAnalytics> {
    return this.computeAnalytics(tenantId)
  }

  async getPlatformAnalytics(): Promise<CredentialAnalytics> {
    return this.computeAnalytics()
  }

  private async computeAnalytics(tenantId?: string): Promise<CredentialAnalytics> {
    const idCardConstraints = tenantId ? [where("tenantId", "==", tenantId)] : []
    const certConstraints = tenantId ? [where("tenantId", "==", tenantId)] : []
    const printConstraints = tenantId ? [where("tenantId", "==", tenantId), where("status", "==", "pending")] : [where("status", "==", "pending")]

    const [idCardSnap, certSnap, printSnap] = await Promise.all([
      getDocs(query(collection(this.db, ID_CARD_COL), ...idCardConstraints)),
      getDocs(query(collection(this.db, CERTIFICATE_COL), ...certConstraints)),
      getDocs(query(collection(this.db, PRINT_COL), ...printConstraints)),
    ])

    const idCards = idCardSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const certificates = certSnap.docs.map((d) => d.data() as Record<string, unknown>)
    const allCredentials = [...idCards, ...certificates]

    const totalCredentials = allCredentials.length
    const totalIDCards = idCards.length
    const totalCertificates = certificates.length
    const activeCredentials = allCredentials.filter((c) => (c.status as string) === "active").length
    const totalReprints = allCredentials.reduce((sum, c) => sum + ((c.reprintCount as number) || 0), 0)
    const cancelledCredentials = allCredentials.filter((c) => (c.status as string) === "cancelled").length
    const pendingPrintRequests = printSnap.size

    const tenantMap = new Map<string, number>()
    const typeMap = new Map<string, number>()
    const statusMap = new Map<string, number>()
    const dateMap = new Map<string, number>()

    for (const c of allCredentials) {
      const t = (c.tenantId as string) || "unknown"
      tenantMap.set(t, (tenantMap.get(t) || 0) + 1)

      if (c.certificateType) {
        const ct = c.certificateType as string
        typeMap.set(ct, (typeMap.get(ct) || 0) + 1)
      }
      if (c.cardNumber) {
        typeMap.set("id_card", (typeMap.get("id_card") || 0) + 1)
      }

      const s = (c.status as string) || "unknown"
      statusMap.set(s, (statusMap.get(s) || 0) + 1)

      const date = (c.createdAt as string)?.substring(0, 10) || "unknown"
      dateMap.set(date, (dateMap.get(date) || 0) + 1)
    }

    return {
      totalCredentials,
      totalIDCards,
      totalCertificates,
      activeCredentials,
      totalReprints,
      cancelledCredentials,
      pendingPrintRequests,
      byTenant: Array.from(tenantMap.entries()).map(([k, v]) => ({ tenantId: k, count: v })),
      byType: Array.from(typeMap.entries()).map(([k, v]) => ({ type: k, count: v })),
      byStatus: Array.from(statusMap.entries()).map(([k, v]) => ({ status: k, count: v })),
      recentIssuances: Array.from(dateMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 30)
        .map(([k, v]) => ({ date: k, count: v })),
    }
  }
}
