import { collection, getDocs, query, where } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IMemberAnalyticsService } from "./IMemberAnalyticsService"
import type { MemberAnalytics } from "@/types"

export class FirebaseMemberAnalyticsService implements IMemberAnalyticsService {
  private db = getFirestoreDb()

  async getAnalytics(tenantId: string): Promise<MemberAnalytics> {
    const [memberSnap, apprenticeSnap] = await Promise.all([
      getDocs(query(collection(this.db, "members"), where("tenantId", "==", tenantId))),
      getDocs(query(collection(this.db, "apprentices"), where("tenantId", "==", tenantId))),
    ])
    const members = memberSnap.docs.map((d) => d.data())
    const apprentices = apprenticeSnap.docs.map((d) => d.data())
    return {
      totalMembers: members.length,
      activeMembers: members.filter((m: Record<string, unknown>) => m.status === "active").length,
      inactiveMembers: members.filter((m: Record<string, unknown>) => m.status === "inactive" || m.status === "suspended" || m.status === "expired").length,
      totalApprentices: apprentices.length,
      pendingApprovals: members.filter((m: Record<string, unknown>) => m.approvalStatus === "under_review" || m.approvalStatus === "pending_verification").length,
      pendingRenewals: members.filter((m: Record<string, unknown>) => m.renewalStatus === "due_soon" || m.renewalStatus === "overdue").length,
      recentRenewals: members.filter((m: Record<string, unknown>) => m.renewalStatus === "renewed" || m.renewalStatus === "current").length,
      growthTrends: [],
    }
  }
}
