import type { IGovernanceService } from "./IGovernanceService"
import type { GovernanceConfig, ApprovalWorkflow } from "@/types"
import { mockGovernanceConfigs, mockApprovalWorkflows } from "./mock-data"

const configs = [...mockGovernanceConfigs]
const workflows = [...mockApprovalWorkflows]

export class MockGovernanceService implements IGovernanceService {
  async getGovernanceConfig(tenantId: string): Promise<GovernanceConfig | null> {
    await delay(100); return configs.find((c) => c.tenantId === tenantId) || null
  }
  async updateGovernanceConfig(tenantId: string, data: Partial<GovernanceConfig>): Promise<void> {
    await delay(300)
    let config = configs.find((c) => c.tenantId === tenantId)
    if (config) Object.assign(config, data, { updatedAt: new Date().toISOString() })
    else {
      config = { id: `gc-${Date.now()}`, tenantId, approvalLevels: [], governanceHierarchy: {}, executiveStructure: [], organizationalRules: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data }
      configs.push(config)
    }
  }

  async listWorkflows(tenantId: string): Promise<ApprovalWorkflow[]> {
    await delay(200); return workflows.filter((w) => w.tenantId === tenantId)
  }
  async getWorkflow(id: string): Promise<ApprovalWorkflow | null> {
    await delay(100); return workflows.find((w) => w.id === id) || null
  }
  async createWorkflow(data: Omit<ApprovalWorkflow, "id" | "createdAt" | "updatedAt">): Promise<ApprovalWorkflow> {
    await delay(400)
    const wf: ApprovalWorkflow = { ...data, id: `aw-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    workflows.push(wf); return wf
  }
  async updateWorkflow(id: string, data: Partial<ApprovalWorkflow>): Promise<void> {
    await delay(300); const w = workflows.find((wf) => wf.id === id); if (w) Object.assign(w, data, { updatedAt: new Date().toISOString() })
  }
  async activateWorkflow(id: string): Promise<void> {
    await delay(200); const w = workflows.find((wf) => wf.id === id); if (w) { w.status = "active"; w.updatedAt = new Date().toISOString() }
  }
  async deactivateWorkflow(id: string): Promise<void> {
    await delay(200); const w = workflows.find((wf) => wf.id === id); if (w) { w.status = "inactive"; w.updatedAt = new Date().toISOString() }
  }
}

function delay(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)) }
