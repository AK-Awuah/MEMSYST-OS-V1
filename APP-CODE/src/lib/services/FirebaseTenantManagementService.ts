import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, orderBy, where, Timestamp, type QueryConstraint } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITenantManagementService } from "./ITenantManagementService"
import type { Tenant, TenantProfile, TenantBranding, TenantAnalytics } from "@/types"

const COLLECTION = "tenants"

function toTenant(id: string, data: Record<string, unknown>): Tenant {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    organizationName: (data.organizationName as string) || "",
    shortName: (data.shortName as string) || "",
    abbreviation: (data.abbreviation as string) || "",
    domain: (data.domain as string) || "",
    subdomain: (data.subdomain as string) || "",
    organizationType: (data.organizationType as string) || "",
    country: (data.country as string) || "",
    region: (data.region as string) || "",
    industry: (data.industry as string) || "",
    logo: (data.logo as string) || "",
    primaryColor: (data.primaryColor as string) || "#3CA4F9",
    secondaryColor: (data.secondaryColor as string) || "#1e3a5f",
    plan: (data.plan as string) || "",
    subscription: (data.subscription as string) || "",
    commissionModel: (data.commissionModel as string) || "",
    revenueDistributionModel: (data.revenueDistributionModel as string) || "",
    adminName: (data.adminName as string) || "",
    adminEmail: (data.adminEmail as string) || "",
    adminPhone: (data.adminPhone as string) || "",
    status: (data.status as Tenant["status"]) || "prospect",
    commercialStatus: (data.commercialStatus as Tenant["commercialStatus"]) || "prospect",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseTenantManagementService implements ITenantManagementService {
  private db = getFirestoreDb()

  async listTenants(params?: { status?: string; search?: string }): Promise<Tenant[]> {
    const col = collection(this.db, COLLECTION)
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")]
    if (params?.status) constraints.unshift(where("commercialStatus", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    let tenants = snap.docs.map((d) => toTenant(d.id, d.data() as Record<string, unknown>))
    if (params?.search) {
      const q = params.search.toLowerCase()
      tenants = tenants.filter((t) => t.organizationName.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q))
    }
    return tenants
  }

  async getTenant(id: string): Promise<Tenant | null> {
    const ref = doc(this.db, COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return toTenant(snap.id, snap.data() as Record<string, unknown>)
  }

  async createTenant(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<Tenant> {
    const now = new Date().toISOString()
    const payload = { ...data, createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(this.db, COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async updateTenant(id: string, data: Partial<Tenant>): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async updateTenantStatus(id: string, status: Tenant["status"]): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { status, updatedAt: new Date().toISOString() })
  }

  async updateCommercialStatus(id: string, status: Tenant["commercialStatus"]): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { commercialStatus: status, updatedAt: new Date().toISOString() })
  }

  async getProfile(tenantId: string): Promise<TenantProfile | null> {
    const ref = doc(this.db, COLLECTION, tenantId, "profile", "main")
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    const d = snap.data() as Record<string, unknown>
    return {
      id: snap.id,
      tenantId,
      yearEstablished: (d.yearEstablished as number) || 0,
      description: (d.description as string) || "",
      mission: (d.mission as string) || "",
      vision: (d.vision as string) || "",
      objectives: (d.objectives as string) || "",
      website: (d.website as string) || "",
      socialMediaLinks: (d.socialMediaLinks as string[]) || [],
      createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate().toISOString() : (d.createdAt as string) || "",
      updatedAt: d.updatedAt instanceof Timestamp ? d.updatedAt.toDate().toISOString() : (d.updatedAt as string) || "",
    }
  }

  async updateProfile(tenantId: string, data: Partial<TenantProfile>): Promise<void> {
    const ref = doc(this.db, COLLECTION, tenantId, "profile", "main")
    const existing = await getDoc(ref)
    const now = new Date().toISOString()
    if (!existing.exists()) {
      await addDoc(collection(this.db, COLLECTION, tenantId, "profile"), {
        tenantId,
        ...data,
        socialMediaLinks: data.socialMediaLinks || [],
        createdAt: now,
        updatedAt: now,
      })
    } else {
      await updateDoc(ref, { ...data, updatedAt: now })
    }
  }

  async getBranding(tenantId: string): Promise<TenantBranding | null> {
    const ref = doc(this.db, COLLECTION, tenantId, "branding", "main")
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    const d = snap.data() as Record<string, unknown>
    return {
      id: snap.id,
      tenantId,
      logo: (d.logo as string) || "",
      coverImage: (d.coverImage as string) || "",
      primaryColor: (d.primaryColor as string) || "",
      secondaryColor: (d.secondaryColor as string) || "",
      accentColor: (d.accentColor as string) || "",
      typography: (d.typography as string) || "",
      themeSettings: (d.themeSettings as Record<string, string>) || {},
      createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate().toISOString() : (d.createdAt as string) || "",
      updatedAt: d.updatedAt instanceof Timestamp ? d.updatedAt.toDate().toISOString() : (d.updatedAt as string) || "",
    }
  }

  async updateBranding(tenantId: string, data: Partial<TenantBranding>): Promise<void> {
    const ref = doc(this.db, COLLECTION, tenantId, "branding", "main")
    const existing = await getDoc(ref)
    const now = new Date().toISOString()
    if (!existing.exists()) {
      await addDoc(collection(this.db, COLLECTION, tenantId, "branding"), {
        tenantId, ...data, themeSettings: data.themeSettings || {}, createdAt: now, updatedAt: now,
      })
    } else {
      await updateDoc(ref, { ...data, updatedAt: now })
    }
  }

  async activateTenant(id: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { status: "activated", commercialStatus: "active", updatedAt: new Date().toISOString() })
  }

  async suspendTenant(id: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { commercialStatus: "suspended", updatedAt: new Date().toISOString() })
  }

  async reactivateTenant(id: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { commercialStatus: "active", updatedAt: new Date().toISOString() })
  }

  async archiveTenant(id: string): Promise<void> {
    const ref = doc(this.db, COLLECTION, id)
    await updateDoc(ref, { commercialStatus: "archived", updatedAt: new Date().toISOString() })
  }

  async getAnalytics(): Promise<TenantAnalytics> {
    const snap = await getDocs(collection(this.db, COLLECTION))
    const tenants = snap.docs.map((d) => d.data() as { commercialStatus: string })
    const activeTenants = tenants.filter((t) => t.commercialStatus === "active").length
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return {
      totalTenants: tenants.length,
      activeTenants,
      totalRegions: 0,
      totalBranches: 0,
      totalExecutives: 0,
      growthTrends: months.slice(0, 7).map((month, i) => ({
        month,
        count: Math.max(0, Math.floor(tenants.length * (i + 1) / 7)),
      })),
    }
  }
}
