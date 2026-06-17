import type { GovernanceConfig, ApprovalWorkflow } from "@/types"

export interface IGovernanceService {
  getGovernanceConfig(tenantId: string): Promise<GovernanceConfig | null>
  updateGovernanceConfig(tenantId: string, data: Partial<GovernanceConfig>): Promise<void>

  listWorkflows(tenantId: string): Promise<ApprovalWorkflow[]>
  getWorkflow(id: string): Promise<ApprovalWorkflow | null>
  createWorkflow(data: Omit<ApprovalWorkflow, "id" | "createdAt" | "updatedAt">): Promise<ApprovalWorkflow>
  updateWorkflow(id: string, data: Partial<ApprovalWorkflow>): Promise<void>
  activateWorkflow(id: string): Promise<void>
  deactivateWorkflow(id: string): Promise<void>
}
