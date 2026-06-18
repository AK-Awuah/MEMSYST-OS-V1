import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, orderBy, where, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IOrganizationStructureService } from "./IOrganizationStructureService"
import type { OrganizationalUnit, Region, Branch } from "@/types"

const REGIONS_COL = "regions"
const BRANCHES_COL = "branches"
const ORG_UNITS_COL = "organizationalUnits"

function toOrgUnit(id: string, data: Record<string, unknown>): OrganizationalUnit {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    parentId: (data.parentId as string) || null,
    name: (data.name as string) || "",
    type: (data.type as OrganizationalUnit["type"]) || "branch",
    status: (data.status as OrganizationalUnit["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toRegion(id: string, data: Record<string, unknown>): Region {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    code: (data.code as string) || "",
    status: (data.status as Region["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toBranch(id: string, data: Record<string, unknown>): Branch {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    regionId: (data.regionId as string) || "",
    name: (data.name as string) || "",
    code: (data.code as string) || "",
    location: (data.location as string) || "",
    status: (data.status as Branch["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseOrganizationStructureService implements IOrganizationStructureService {
  private db = getFirestoreDb()

  async listOrgUnits(tenantId: string): Promise<OrganizationalUnit[]> {
    const col = collection(this.db, ORG_UNITS_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "asc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toOrgUnit(d.id, d.data() as Record<string, unknown>))
  }

  async createOrgUnit(data: Omit<OrganizationalUnit, "id" | "createdAt" | "updatedAt">): Promise<OrganizationalUnit> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, ORG_UNITS_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async updateOrgUnit(id: string, data: Partial<OrganizationalUnit>): Promise<void> {
    const ref = doc(this.db, ORG_UNITS_COL, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async deactivateOrgUnit(id: string): Promise<void> {
    const ref = doc(this.db, ORG_UNITS_COL, id)
    await updateDoc(ref, { status: "inactive", updatedAt: new Date().toISOString() })
  }

  async listRegions(tenantId: string): Promise<Region[]> {
    const col = collection(this.db, REGIONS_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "asc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toRegion(d.id, d.data() as Record<string, unknown>))
  }

  async createRegion(data: Omit<Region, "id" | "createdAt" | "updatedAt">): Promise<Region> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, REGIONS_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async updateRegion(id: string, data: Partial<Region>): Promise<void> {
    const ref = doc(this.db, REGIONS_COL, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async deactivateRegion(id: string): Promise<void> {
    const ref = doc(this.db, REGIONS_COL, id)
    await updateDoc(ref, { status: "inactive", updatedAt: new Date().toISOString() })
  }

  async listBranches(tenantId: string): Promise<Branch[]> {
    const col = collection(this.db, BRANCHES_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "asc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toBranch(d.id, d.data() as Record<string, unknown>))
  }

  async getBranchesByRegion(regionId: string): Promise<Branch[]> {
    const col = collection(this.db, BRANCHES_COL)
    const q = query(col, where("regionId", "==", regionId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toBranch(d.id, d.data() as Record<string, unknown>))
  }

  async createBranch(data: Omit<Branch, "id" | "createdAt" | "updatedAt">): Promise<Branch> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, BRANCHES_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async updateBranch(id: string, data: Partial<Branch>): Promise<void> {
    const ref = doc(this.db, BRANCHES_COL, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async deactivateBranch(id: string): Promise<void> {
    const ref = doc(this.db, BRANCHES_COL, id)
    await updateDoc(ref, { status: "inactive", updatedAt: new Date().toISOString() })
  }
}
