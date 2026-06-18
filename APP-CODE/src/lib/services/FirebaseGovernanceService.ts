import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, orderBy, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IGovernanceService } from "./IGovernanceService"
import type { GovernanceConfig, ApprovalWorkflow } from "@/types"

const CONFIG_COL = "governanceConfigs"
const WORKFLOWS_COL = "approvalWorkflows"

function toConfig(id: string, data: Record<string, unknown>): GovernanceConfig {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    approvalLevels: (data.approvalLevels as string[]) || [],
    governanceHierarchy: (data.governanceHierarchy as Record<string, string[]>) || {},
    executiveStructure: (data.executiveStructure as string[]) || [],
    organizationalRules: (data.organizationalRules as string[]) || [],
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toWorkflow(id: string, data: Record<string, unknown>): ApprovalWorkflow {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    name: (data.name as string) || "",
    stages: (data.stages as ApprovalWorkflow["stages"]) || [],
    status: (data.status as ApprovalWorkflow["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseGovernanceService implements IGovernanceService {
  private db = getFirestoreDb()

  async getGovernanceConfig(tenantId: string): Promise<GovernanceConfig | null> {
    const col = collection(this.db, CONFIG_COL)
    const q = query(col, where("tenantId", "==", tenantId))
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]
    return toConfig(d.id, d.data() as Record<string, unknown>)
  }

  async updateGovernanceConfig(tenantId: string, data: Partial<GovernanceConfig>): Promise<void> {
    const col = collection(this.db, CONFIG_COL)
    const q = query(col, where("tenantId", "==", tenantId))
    const snap = await getDocs(q)
    const now = new Date().toISOString()
    if (snap.empty) {
      await addDoc(col, { tenantId, ...data, createdAt: now, updatedAt: now })
    } else {
      const ref = doc(this.db, CONFIG_COL, snap.docs[0].id)
      await updateDoc(ref, { ...data, updatedAt: now })
    }
  }

  async listWorkflows(tenantId: string): Promise<ApprovalWorkflow[]> {
    const col = collection(this.db, WORKFLOWS_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toWorkflow(d.id, d.data() as Record<string, unknown>))
  }

  async getWorkflow(id: string): Promise<ApprovalWorkflow | null> {
    const ref = doc(this.db, WORKFLOWS_COL, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return toWorkflow(snap.id, snap.data() as Record<string, unknown>)
  }

  async createWorkflow(data: Omit<ApprovalWorkflow, "id" | "createdAt" | "updatedAt">): Promise<ApprovalWorkflow> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, WORKFLOWS_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async updateWorkflow(id: string, data: Partial<ApprovalWorkflow>): Promise<void> {
    const ref = doc(this.db, WORKFLOWS_COL, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async activateWorkflow(id: string): Promise<void> {
    const ref = doc(this.db, WORKFLOWS_COL, id)
    await updateDoc(ref, { status: "active", updatedAt: new Date().toISOString() })
  }

  async deactivateWorkflow(id: string): Promise<void> {
    const ref = doc(this.db, WORKFLOWS_COL, id)
    await updateDoc(ref, { status: "inactive", updatedAt: new Date().toISOString() })
  }
}
