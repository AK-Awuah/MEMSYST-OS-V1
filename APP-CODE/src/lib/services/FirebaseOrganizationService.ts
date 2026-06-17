import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IOrganizationService } from "./IOrganizationService"
import type { OrganizationProspect, Tenant } from "@/types"

const PROSPECTS_COLLECTION = "organization_prospects"
const TENANTS_COLLECTION = "tenants"

function toProspect(id: string, data: Record<string, unknown>): OrganizationProspect {
  return {
    id,
    organizationName: (data.organizationName as string) || "",
    industryType: (data.industryType as string) || "",
    country: (data.country as string) || "",
    expectedMembers: (data.expectedMembers as number) || 0,
    currentChallenges: (data.currentChallenges as string) || "",
    desiredCapabilities: (data.desiredCapabilities as string[]) || [],
    commercialNotes: (data.commercialNotes as string) || undefined,
    assignedTo: (data.assignedTo as string) || undefined,
    status: (data.status as OrganizationProspect["status"]) || "prospect",
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt as string) || new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt as string) || new Date().toISOString(),
  }
}

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
    primaryColor: (data.primaryColor as string) || "#000000",
    secondaryColor: (data.secondaryColor as string) || "#ffffff",
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

export class FirebaseOrganizationService implements IOrganizationService {
  private db = getFirestoreDb()

  async listProspects(): Promise<OrganizationProspect[]> {
    const snap = await getDocs(query(collection(this.db, PROSPECTS_COLLECTION), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toProspect(d.id, d.data() as Record<string, unknown>))
  }

  async getProspect(id: string): Promise<OrganizationProspect | null> {
    const snap = await getDoc(doc(this.db, PROSPECTS_COLLECTION, id))
    if (!snap.exists()) return null
    return toProspect(snap.id, snap.data() as Record<string, unknown>)
  }

  async createProspect(
    data: Omit<OrganizationProspect, "id" | "createdAt" | "updatedAt">
  ): Promise<OrganizationProspect> {
    const now = new Date().toISOString()
    const payload = { ...data, createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(this.db, PROSPECTS_COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async updateProspect(id: string, data: Partial<OrganizationProspect>): Promise<void> {
    await updateDoc(doc(this.db, PROSPECTS_COLLECTION, id), {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  }

  async updateProspectStatus(id: string, status: OrganizationProspect["status"]): Promise<void> {
    await updateDoc(doc(this.db, PROSPECTS_COLLECTION, id), {
      status,
      updatedAt: new Date().toISOString(),
    })
  }

  async onboardTenant(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<Tenant> {
    const now = new Date().toISOString()
    const payload = { ...data, tenantId: data.tenantId || crypto.randomUUID(), createdAt: now, updatedAt: now }
    const ref = await addDoc(collection(this.db, TENANTS_COLLECTION), payload)
    return { id: ref.id, ...payload }
  }

  async listTenants(): Promise<Tenant[]> {
    const snap = await getDocs(query(collection(this.db, TENANTS_COLLECTION), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toTenant(d.id, d.data() as Record<string, unknown>))
  }

  async getTenant(id: string): Promise<Tenant | null> {
    const snap = await getDoc(doc(this.db, TENANTS_COLLECTION, id))
    if (!snap.exists()) return null
    return toTenant(snap.id, snap.data() as Record<string, unknown>)
  }
}
