import type { Lead, FormSubmission, CRMOpportunity, Notification, AuditLog, SecurityEvent, SecurityAction, Wallet, Transaction, Payment, RevenueDistributionRule, RevenueDistribution, CommissionConfig, Commission, Bill, Withdrawal, Refund, Receipt, FinancialSettings, Assessment, Examination, ExaminationResult, Skill, LearnerSkill, TrainingCertification } from "@/types"
import { mockLeads as initialLeads, mockSubmissions, mockOpportunities, mockNotifications as initialNotifications, mockAuditLogs, mockWallets as initialWallets, mockTransactions as initialTransactions, mockPayments as initialPayments, mockRevenueRules as initialRevenueRules, mockCommissions as initialCommissions, mockCommissionConfigs as initialCommissionConfigs, mockBills as initialBills, mockWithdrawals as initialWithdrawals, mockRefunds as initialRefunds, mockReceipts as initialReceipts, mockFinancialSettings as initialFinancialSettings, mockAssessments as initialAssessments, mockExaminations as initialExaminations, mockExaminationResults as initialExaminationResults, mockSkills as initialSkills, mockLearnerSkills as initialLearnerSkills, mockTrainingCertifications as initialTrainingCertifications } from "./mock-data"

export const sharedLeads: Lead[] = [...initialLeads]
export const sharedSubmissions: FormSubmission[] = [...mockSubmissions]
export const sharedOpportunities: CRMOpportunity[] = [...mockOpportunities]
export const sharedNotifications: Notification[] = [...initialNotifications]
export const sharedAuditLogs: AuditLog[] = [...mockAuditLogs]

export const sharedSecurityEvents: SecurityEvent[] = []

export function pushAuditLog(entry: Omit<AuditLog, "id" | "createdAt">) {
  sharedAuditLogs.unshift({
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  })
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function recordIdentitySecurityEvent(data: {
  actorId: string
  actorName: string
  action: SecurityAction
  resource: string
  tenantId: string
  ipAddress?: string
  device?: string
  result: "success" | "failure"
  details?: string
}) {
  const event: SecurityEvent = {
    id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    actorId: data.actorId,
    actorName: data.actorName,
    action: data.action,
    resource: data.resource,
    tenantId: data.tenantId,
    ipAddress: data.ipAddress || "127.0.0.1",
    device: data.device || "System",
    result: data.result,
    details: data.details,
    createdAt: new Date().toISOString(),
  }
  sharedSecurityEvents.unshift(event)
  return event
}

export const sharedWallets: Wallet[] = [...initialWallets]
export const sharedTransactions: Transaction[] = [...initialTransactions]
export const sharedPayments: Payment[] = [...initialPayments]
export const sharedRevenueRules: RevenueDistributionRule[] = [...initialRevenueRules]
export const sharedRevenueDistributions: RevenueDistribution[] = []
export const sharedCommissionConfigs: CommissionConfig[] = [...initialCommissionConfigs]
export const sharedCommissions: Commission[] = [...initialCommissions]
export const sharedBills: Bill[] = [...initialBills]
export const sharedWithdrawals: Withdrawal[] = [...initialWithdrawals]
export const sharedRefunds: Refund[] = [...initialRefunds]
export const sharedReceipts: Receipt[] = [...initialReceipts]
export const sharedFinancialSettings: FinancialSettings = { ...initialFinancialSettings }

export const sharedAssessments: Assessment[] = [...initialAssessments]
export const sharedExaminations: Examination[] = [...initialExaminations]
export const sharedExaminationResults: ExaminationResult[] = [...initialExaminationResults]
export const sharedSkills: Skill[] = [...initialSkills]
export const sharedLearnerSkills: LearnerSkill[] = [...initialLearnerSkills]
export const sharedTrainingCertifications: TrainingCertification[] = [...initialTrainingCertifications]
