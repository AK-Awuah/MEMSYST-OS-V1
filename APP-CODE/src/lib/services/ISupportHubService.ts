import type { Loan, LoanRepayment, Scholarship, ScholarshipApplication, Sponsorship, SupportProgram, SupportProgramEnrollment, ResourceDirectory, SupportHubAnalytics, SupportHubAuditLog } from "@/types"

export interface ISupportHubService {
  // Loans
  listLoans(tenantId: string, params?: { status?: string; memberId?: string; loanType?: string }): Promise<Loan[]>
  getLoan(id: string): Promise<Loan | null>
  createLoan(data: Omit<Loan, "id" | "createdAt" | "updatedAt">): Promise<Loan>
  updateLoan(id: string, data: Partial<Loan>): Promise<void>
  approveLoan(id: string, amountApproved: number): Promise<void>
  disburseLoan(id: string): Promise<void>
  recordRepayment(loanId: string, data: Omit<LoanRepayment, "id" | "createdAt">): Promise<LoanRepayment>
  getLoanRepayments(loanId: string): Promise<LoanRepayment[]>

  // Scholarships
  listScholarships(tenantId: string, params?: { status?: string; type?: string }): Promise<Scholarship[]>
  getScholarship(id: string): Promise<Scholarship | null>
  createScholarship(data: Omit<Scholarship, "id" | "createdAt" | "updatedAt">): Promise<Scholarship>
  updateScholarship(id: string, data: Partial<Scholarship>): Promise<void>
  listScholarshipApplications(scholarshipId: string): Promise<ScholarshipApplication[]>
  createScholarshipApplication(data: Omit<ScholarshipApplication, "id" | "createdAt" | "updatedAt">): Promise<ScholarshipApplication>
  reviewScholarshipApplication(id: string, status: "shortlisted" | "rejected", reviewNotes?: string): Promise<void>
  awardScholarship(id: string): Promise<void>

  // Sponsorships
  listSponsorships(tenantId: string, params?: { status?: string; category?: string }): Promise<Sponsorship[]>
  getSponsorship(id: string): Promise<Sponsorship | null>
  createSponsorship(data: Omit<Sponsorship, "id" | "createdAt" | "updatedAt">): Promise<Sponsorship>
  updateSponsorship(id: string, data: Partial<Sponsorship>): Promise<void>

  // Support Programs
  listPrograms(tenantId: string, params?: { status?: string; category?: string }): Promise<SupportProgram[]>
  getProgram(id: string): Promise<SupportProgram | null>
  createProgram(data: Omit<SupportProgram, "id" | "createdAt" | "updatedAt">): Promise<SupportProgram>
  updateProgram(id: string, data: Partial<SupportProgram>): Promise<void>
  listEnrollments(programId: string): Promise<SupportProgramEnrollment[]>
  createEnrollment(data: Omit<SupportProgramEnrollment, "id" | "createdAt" | "updatedAt">): Promise<SupportProgramEnrollment>
  updateEnrollment(id: string, data: Partial<SupportProgramEnrollment>): Promise<void>

  // Resources
  listResources(tenantId: string, params?: { status?: string; category?: string }): Promise<ResourceDirectory[]>
  getResource(id: string): Promise<ResourceDirectory | null>
  createResource(data: Omit<ResourceDirectory, "id" | "createdAt" | "updatedAt">): Promise<ResourceDirectory>
  updateResource(id: string, data: Partial<ResourceDirectory>): Promise<void>
  archiveResource(id: string): Promise<void>

  // Analytics
  getAnalytics(tenantId: string): Promise<SupportHubAnalytics>

  // Audit
  getAuditLogs(tenantId: string): Promise<SupportHubAuditLog[]>
}
