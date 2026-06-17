import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ITenantProvisioningService } from "./ITenantProvisioningService"
import type { Tenant } from "@/types"

const TENANTS_COLLECTION = "tenants"
const SETTINGS_COLLECTION = "tenantSettings"

function toTenant(id: string, data: Record<string, unknown>): Tenant {
  return {
    id,
    tenantId: (data.tenantId as string) || id,
    organizationName: (data.organizationName as string) || "",
    shortName: (data.shortName as string) || "",
    abbreviation: (data.abbreviation as string) || "",
    domain: (data.domain as string) || "",
    subdomain: (data.subdomain as string) || "",
    organizationType: (data.organizationType as string) || "",
    country: (data.country as string) || "",
    region: (data.region as string) || "",
    industry: (data.industry as string) || "",
    logo: (data.logo as string) || undefined,
    primaryColor: (data.primaryColor as string) || "#1a1a2e",
    secondaryColor: (data.secondaryColor as string) || "#16213e",
    plan: (data.plan as string) || "",
    subscription: (data.subscription as string) || "",
    commissionModel: (data.commissionModel as string) || "",
    revenueDistributionModel: (data.revenueDistributionModel as string) || "",
    adminName: (data.adminName as string) || "",
    adminEmail: (data.adminEmail as string) || "",
    adminPhone: (data.adminPhone as string) || "",
    status: (data.status as Tenant["status"]) || "prospect",
    commercialStatus: (data.commercialStatus as Tenant["commercialStatus"]) || "prospect",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

export class FirebaseTenantProvisioningService implements ITenantProvisioningService {
  private db = getFirestoreDb()

  async getTenant(tenantId: string): Promise<Tenant | null> {
    const snap = await getDoc(doc(this.db, TENANTS_COLLECTION, tenantId))
    if (!snap.exists()) return null
    return toTenant(snap.id, snap.data() as Record<string, unknown>)
  }

  async listTenants(params?: { status?: string; search?: string }): Promise<Tenant[]> {
    const snap = await getDocs(query(collection(this.db, TENANTS_COLLECTION), orderBy("createdAt", "desc")))
    let tenants = snap.docs.map((d) => toTenant(d.id, d.data() as Record<string, unknown>))
    if (params?.status) {
      tenants = tenants.filter((t) => t.commercialStatus === params.status || t.status === params.status)
    }
    if (params?.search) {
      const s = params.search.toLowerCase()
      tenants = tenants.filter(
        (t) =>
          t.organizationName.toLowerCase().includes(s) ||
          t.adminEmail.toLowerCase().includes(s) ||
          t.subdomain.toLowerCase().includes(s)
      )
    }
    return tenants
  }

  async updateTenantStatus(tenantId: string, status: Tenant["commercialStatus"]): Promise<void> {
    await updateDoc(doc(this.db, TENANTS_COLLECTION, tenantId), {
      commercialStatus: status,
      updatedAt: new Date().toISOString(),
    })
  }

  async getTenantSettings(tenantId: string): Promise<Record<string, unknown>> {
    const snap = await getDoc(doc(this.db, SETTINGS_COLLECTION, tenantId))
    if (!snap.exists()) return {}
    return snap.data() as Record<string, unknown>
  }

  async updateTenantSettings(tenantId: string, settings: Record<string, unknown>): Promise<void> {
    const ref = doc(this.db, SETTINGS_COLLECTION, tenantId)
    await setDoc(
      ref,
      { ...settings, tenantId, updatedAt: new Date().toISOString() },
      { merge: true }
    )
  }

  async prepareTenantProvisioning(tenantId: string): Promise<{
    brandingReady: boolean
    structureReady: boolean
    membershipReady: boolean
    financialReady: boolean
  }> {
    const [tenant, settings] = await Promise.all([
      this.getTenant(tenantId),
      this.getTenantSettings(tenantId),
    ])

    if (!tenant) {
      return { brandingReady: false, structureReady: false, membershipReady: false, financialReady: false }
    }

    const brandingReady = !!(tenant.logo && tenant.primaryColor && tenant.secondaryColor)
    const structureReady = !!(settings.structure)
    const membershipReady = !!(settings.membership)
    const financialReady = !!(tenant.commissionModel && tenant.revenueDistributionModel && tenant.plan)

    return { brandingReady, structureReady, membershipReady, financialReady }
  }
}
