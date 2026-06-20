import type { ISupportHubService } from "./ISupportHubService"
import type { Loan, LoanRepayment, Scholarship, ScholarshipApplication, Sponsorship, SupportProgram, SupportProgramEnrollment, ResourceDirectory, SupportHubAnalytics, SupportHubAuditLog } from "@/types"
import { delay } from "./shared-store"

const now = new Date().toISOString()

let loans: Loan[] = [
  { id: "loan-1", tenantId: "tenant-1", memberId: "mem-1", memberName: "Kwame Ansah", loanType: "business", amountRequested: 5000, amountApproved: 4500, interestRate: 5, repaymentPeriod: 12, repaymentFrequency: "monthly", installmentAmount: 393.75, totalRepayable: 4725, amountPaid: 787.50, balance: 3937.50, purpose: "Business expansion", status: "repaying", applicationDate: "2026-01-15T00:00:00Z", approvalDate: "2026-01-20T00:00:00Z", disbursementDate: "2026-01-25T00:00:00Z", expectedCompletionDate: "2027-01-25T00:00:00Z", guarantorName: "Akua Sarpong", createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-01-25T00:00:00Z" },
  { id: "loan-2", tenantId: "tenant-1", memberId: "mem-2", memberName: "Ama Serwaa", loanType: "personal", amountRequested: 2000, amountApproved: 2000, interestRate: 3, repaymentPeriod: 6, repaymentFrequency: "monthly", installmentAmount: 343.33, totalRepayable: 2060, amountPaid: 0, balance: 2060, purpose: "Medical expenses", status: "approved", applicationDate: "2026-03-01T00:00:00Z", approvalDate: "2026-03-05T00:00:00Z", createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-03-05T00:00:00Z" },
  { id: "loan-3", tenantId: "tenant-1", memberId: "mem-3", memberName: "Yaw Asante", loanType: "education", amountRequested: 3000, amountApproved: 2500, interestRate: 4, repaymentPeriod: 10, repaymentFrequency: "monthly", installmentAmount: 260, totalRepayable: 2600, amountPaid: 260, balance: 2340, purpose: "Tuition fees", status: "disbursed", applicationDate: "2026-02-10T00:00:00Z", approvalDate: "2026-02-15T00:00:00Z", disbursementDate: "2026-02-20T00:00:00Z", expectedCompletionDate: "2026-12-20T00:00:00Z", createdAt: "2026-02-10T00:00:00Z", updatedAt: "2026-02-20T00:00:00Z" },
]

let repayments: LoanRepayment[] = [
  { id: "rep-1", loanId: "loan-1", tenantId: "tenant-1", memberId: "mem-1", amount: 393.75, principalPortion: 375, interestPortion: 18.75, dueDate: "2026-02-25T00:00:00Z", paidDate: "2026-02-24T00:00:00Z", status: "paid", transactionId: "txn-1", createdAt: "2026-02-24T00:00:00Z" },
  { id: "rep-2", loanId: "loan-1", tenantId: "tenant-1", memberId: "mem-1", amount: 393.75, principalPortion: 375, interestPortion: 18.75, dueDate: "2026-03-25T00:00:00Z", paidDate: "2026-03-23T00:00:00Z", status: "paid", transactionId: "txn-2", createdAt: "2026-03-23T00:00:00Z" },
]

let scholarships: Scholarship[] = [
  { id: "schol-1", tenantId: "tenant-1", title: "Future Leaders Scholarship", description: "For outstanding young professionals in business and leadership", scholarshipType: "merit", provider: "Memsyst Foundation", amount: 10000, totalSlots: 5, slotsFilled: 2, eligibilityCriteria: ["Age 20-35", "Active member for 2+ years", "Minimum GPA 3.5"], requirements: ["Application form", "Academic transcripts", "Recommendation letter", "Personal statement"], applicationDeadline: "2026-07-31T00:00:00Z", status: "accepting_applications", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "schol-2", tenantId: "tenant-1", title: "Women in STEM Grant", description: "Supporting women pursuing science and technology careers", scholarshipType: "need_based", provider: "Tech Her Foundation", amount: 8000, totalSlots: 3, slotsFilled: 3, eligibilityCriteria: ["Female members", "Enrolled in STEM program", "Demonstrated financial need"], requirements: ["Application", "Proof of enrollment", "Financial statement"], applicationDeadline: "2026-05-15T00:00:00Z", status: "awarded", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
]

let scholarshipApplications: ScholarshipApplication[] = [
  { id: "app-1", scholarshipId: "schol-1", tenantId: "tenant-1", memberId: "mem-4", memberName: "Esi Mensah", applicationDate: "2026-06-10T00:00:00Z", status: "submitted", documents: ["transcript.pdf", "recommendation.pdf"], createdAt: "2026-06-10T00:00:00Z", updatedAt: "2026-06-10T00:00:00Z" },
  { id: "app-2", scholarshipId: "schol-1", tenantId: "tenant-1", memberId: "mem-5", memberName: "Kojo Boateng", applicationDate: "2026-06-12T00:00:00Z", status: "under_review", documents: ["transcript.pdf", "statement.pdf", "letter.pdf"], createdAt: "2026-06-12T00:00:00Z", updatedAt: "2026-06-15T00:00:00Z" },
]

let sponsorships: Sponsorship[] = [
  { id: "spon-1", tenantId: "tenant-1", title: "Annual Conference Sponsor", description: "Sponsorship for the 2026 National Conference", category: "event", sponsorName: "Ghana Tech Hub", sponsorContact: "info@ghanatech.com", amount: 25000, startDate: "2026-01-01T00:00:00Z", endDate: "2026-12-31T00:00:00Z", status: "active", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "spon-2", tenantId: "tenant-1", title: "Member Welfare Fund", description: "Corporate sponsorship for member welfare initiatives", category: "member", sponsorName: "First National Bank", sponsorContact: "corporate@fnb.com", beneficiaryName: "General Membership", amount: 15000, startDate: "2026-03-01T00:00:00Z", endDate: "2026-09-01T00:00:00Z", status: "active", createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z" },
]

let programs: SupportProgram[] = [
  { id: "prog-1", tenantId: "tenant-1", title: "Emergency Financial Assistance", description: "Short-term financial support for members facing emergencies", category: "emergency", provider: "Memsyst Welfare Desk", eligibilityCriteria: ["Active member for 6+ months", "Proof of emergency"], applicationProcess: "Submit application with supporting documents to welfare desk", benefits: ["Up to GHS 2,000 grant", "Counseling support"], fundingSource: "Member Welfare Fund", budget: 100000, budgetSpent: 25000, startDate: "2026-01-01T00:00:00Z", maxBeneficiaries: 50, currentBeneficiaries: 12, status: "active", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: "prog-2", tenantId: "tenant-1", title: "Legal Aid Clinic", description: "Free legal consultation for members", category: "legal", provider: "Justice Partners LLP", eligibilityCriteria: ["Active member"], applicationProcess: "Book appointment via member portal", benefits: ["Free 30-min consultation", "Discounted legal services"], fundingSource: "Partnership", budget: 50000, budgetSpent: 12000, startDate: "2026-02-01T00:00:00Z", maxBeneficiaries: 200, currentBeneficiaries: 45, status: "active", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-02-01T00:00:00Z" },
]

let enrollments: SupportProgramEnrollment[] = [
  { id: "enr-1", programId: "prog-1", tenantId: "tenant-1", memberId: "mem-6", memberName: "Adwoa Nyarko", enrollmentDate: "2026-03-15T00:00:00Z", status: "active", benefitsReceived: ["Grant disbursed"], createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-03-15T00:00:00Z" },
  { id: "enr-2", programId: "prog-2", tenantId: "tenant-1", memberId: "mem-7", memberName: "Kofi Asare", enrollmentDate: "2026-04-01T00:00:00Z", status: "approved", benefitsReceived: [], createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
]

let resources: ResourceDirectory[] = [
  { id: "res-1", tenantId: "tenant-1", title: "National Health Insurance Guide", description: "Step-by-step guide to registering for NHIS", category: "health", provider: "Ministry of Health", contactPhone: "+233 30 200 0000", website: "https://nhis.gov.gh", eligibilitySummary: "Open to all Ghanaian residents", isVerified: true, tags: ["health", "insurance", "nhis"], status: "published", createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-01-10T00:00:00Z" },
  { id: "res-2", tenantId: "tenant-1", title: "Small Business Grants Portal", description: "Directory of available grants for small businesses", category: "financial", provider: "Ghana Enterprise Agency", contactEmail: "grants@gea.gov.gh", website: "https://gea.gov.gh/grants", isVerified: true, tags: ["grants", "business", "funding"], status: "published", createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-02-01T00:00:00Z" },
]

let auditLogs: SupportHubAuditLog[] = [
  { id: "audit-1", tenantId: "tenant-1", actor: "John Admin", action: "loan_approved", recordType: "Loan", recordId: "loan-2", newValue: "approved", createdAt: "2026-03-05T00:00:00Z" },
  { id: "audit-2", tenantId: "tenant-1", actor: "System", action: "scholarship_awarded", recordType: "Scholarship", recordId: "schol-2", details: "All slots filled", createdAt: "2026-06-01T00:00:00Z" },
]

let nextLoanId = loans.length + 1
let nextRepaymentId = repayments.length + 1
let nextScholarshipId = scholarships.length + 1
let nextAppId = scholarshipApplications.length + 1
let nextSponsorshipId = sponsorships.length + 1
let nextProgramId = programs.length + 1
let nextEnrollmentId = enrollments.length + 1
let nextResourceId = resources.length + 1
let nextAuditId = auditLogs.length + 1

export class MockSupportHubService implements ISupportHubService {
  // ==================== LOANS ====================

  async listLoans(tenantId: string, params?: { status?: string; memberId?: string; loanType?: string }): Promise<Loan[]> {
    await delay(200)
    let result = loans.filter((l) => l.tenantId === tenantId)
    if (params?.status && params.status !== "all") result = result.filter((l) => l.status === params.status)
    if (params?.memberId) result = result.filter((l) => l.memberId === params.memberId)
    if (params?.loanType) result = result.filter((l) => l.loanType === params.loanType)
    return result
  }

  async getLoan(id: string): Promise<Loan | null> {
    await delay(100)
    return loans.find((l) => l.id === id) || null
  }

  async createLoan(data: Omit<Loan, "id" | "createdAt" | "updatedAt">): Promise<Loan> {
    await delay(200)
    const loan: Loan = { ...data, id: `loan-${nextLoanId++}`, createdAt: now, updatedAt: now }
    loans.push(loan)
    return loan
  }

  async updateLoan(id: string, data: Partial<Loan>): Promise<void> {
    await delay(150)
    const idx = loans.findIndex((l) => l.id === id)
    if (idx !== -1) loans[idx] = { ...loans[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async approveLoan(id: string, amountApproved: number): Promise<void> {
    await delay(150)
    const idx = loans.findIndex((l) => l.id === id)
    if (idx !== -1) loans[idx] = { ...loans[idx], status: "approved", amountApproved, approvalDate: new Date().toISOString(), updatedAt: new Date().toISOString() }
  }

  async disburseLoan(id: string): Promise<void> {
    await delay(150)
    const idx = loans.findIndex((l) => l.id === id)
    if (idx !== -1) {
      const loan = loans[idx]
      const amountApproved = loan.amountApproved || loan.amountRequested
      const totalRepayable = amountApproved + (amountApproved * loan.interestRate / 100)
      const installmentAmount = totalRepayable / loan.repaymentPeriod
      loans[idx] = { ...loan, status: "disbursed", amountApproved, totalRepayable, installmentAmount, balance: totalRepayable, disbursementDate: new Date().toISOString(), updatedAt: new Date().toISOString() }
    }
  }

  async recordRepayment(loanId: string, data: Omit<LoanRepayment, "id" | "createdAt">): Promise<LoanRepayment> {
    await delay(150)
    const repayment: LoanRepayment = { ...data, id: `rep-${nextRepaymentId++}`, createdAt: new Date().toISOString() }
    repayments.push(repayment)
    const li = loans.findIndex((l) => l.id === loanId)
    if (li !== -1) {
      const amountPaid = loans[li].amountPaid + data.amount
      const balance = loans[li].balance - data.amount
      const status = balance <= 0 ? "completed" : "repaying"
      loans[li] = { ...loans[li], amountPaid, balance, status, updatedAt: new Date().toISOString() }
    }
    return repayment
  }

  async getLoanRepayments(loanId: string): Promise<LoanRepayment[]> {
    await delay(100)
    return repayments.filter((r) => r.loanId === loanId)
  }

  // ==================== SCHOLARSHIPS ====================

  async listScholarships(tenantId: string, params?: { status?: string; type?: string }): Promise<Scholarship[]> {
    await delay(200)
    let result = scholarships.filter((s) => s.tenantId === tenantId)
    if (params?.status && params.status !== "all") result = result.filter((s) => s.status === params.status)
    if (params?.type) result = result.filter((s) => s.scholarshipType === params.type)
    return result
  }

  async getScholarship(id: string): Promise<Scholarship | null> {
    await delay(100)
    return scholarships.find((s) => s.id === id) || null
  }

  async createScholarship(data: Omit<Scholarship, "id" | "createdAt" | "updatedAt">): Promise<Scholarship> {
    await delay(200)
    const scholarship: Scholarship = { ...data, id: `schol-${nextScholarshipId++}`, createdAt: now, updatedAt: now }
    scholarships.push(scholarship)
    return scholarship
  }

  async updateScholarship(id: string, data: Partial<Scholarship>): Promise<void> {
    await delay(150)
    const idx = scholarships.findIndex((s) => s.id === id)
    if (idx !== -1) scholarships[idx] = { ...scholarships[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async listScholarshipApplications(scholarshipId: string): Promise<ScholarshipApplication[]> {
    await delay(100)
    return scholarshipApplications.filter((a) => a.scholarshipId === scholarshipId)
  }

  async createScholarshipApplication(data: Omit<ScholarshipApplication, "id" | "createdAt" | "updatedAt">): Promise<ScholarshipApplication> {
    await delay(200)
    const app: ScholarshipApplication = { ...data, id: `app-${nextAppId++}`, createdAt: now, updatedAt: now }
    scholarshipApplications.push(app)
    return app
  }

  async reviewScholarshipApplication(id: string, status: "shortlisted" | "rejected", reviewNotes?: string): Promise<void> {
    await delay(150)
    const idx = scholarshipApplications.findIndex((a) => a.id === id)
    if (idx !== -1) scholarshipApplications[idx] = { ...scholarshipApplications[idx], status, reviewNotes, reviewedBy: "system", updatedAt: new Date().toISOString() }
  }

  async awardScholarship(id: string): Promise<void> {
    await delay(150)
    const idx = scholarshipApplications.findIndex((a) => a.id === id)
    if (idx !== -1) {
      scholarshipApplications[idx] = { ...scholarshipApplications[idx], status: "awarded", updatedAt: new Date().toISOString() }
      const sIdx = scholarships.findIndex((s) => s.id === scholarshipApplications[idx].scholarshipId)
      if (sIdx !== -1) {
        const slotsFilled = scholarships[sIdx].slotsFilled + 1
        const newStatus = slotsFilled >= scholarships[sIdx].totalSlots ? "awarded" : scholarships[sIdx].status
        scholarships[sIdx] = { ...scholarships[sIdx], slotsFilled, status: newStatus, updatedAt: new Date().toISOString() }
      }
    }
  }

  // ==================== SPONSORSHIPS ====================

  async listSponsorships(tenantId: string, params?: { status?: string; category?: string }): Promise<Sponsorship[]> {
    await delay(200)
    let result = sponsorships.filter((s) => s.tenantId === tenantId)
    if (params?.status && params.status !== "all") result = result.filter((s) => s.status === params.status)
    if (params?.category) result = result.filter((s) => s.category === params.category)
    return result
  }

  async getSponsorship(id: string): Promise<Sponsorship | null> {
    await delay(100)
    return sponsorships.find((s) => s.id === id) || null
  }

  async createSponsorship(data: Omit<Sponsorship, "id" | "createdAt" | "updatedAt">): Promise<Sponsorship> {
    await delay(200)
    const sponsorship: Sponsorship = { ...data, id: `spon-${nextSponsorshipId++}`, createdAt: now, updatedAt: now }
    sponsorships.push(sponsorship)
    return sponsorship
  }

  async updateSponsorship(id: string, data: Partial<Sponsorship>): Promise<void> {
    await delay(150)
    const idx = sponsorships.findIndex((s) => s.id === id)
    if (idx !== -1) sponsorships[idx] = { ...sponsorships[idx], ...data, updatedAt: new Date().toISOString() }
  }

  // ==================== SUPPORT PROGRAMS ====================

  async listPrograms(tenantId: string, params?: { status?: string; category?: string }): Promise<SupportProgram[]> {
    await delay(200)
    let result = programs.filter((p) => p.tenantId === tenantId)
    if (params?.status && params.status !== "all") result = result.filter((p) => p.status === params.status)
    if (params?.category) result = result.filter((p) => p.category === params.category)
    return result
  }

  async getProgram(id: string): Promise<SupportProgram | null> {
    await delay(100)
    return programs.find((p) => p.id === id) || null
  }

  async createProgram(data: Omit<SupportProgram, "id" | "createdAt" | "updatedAt">): Promise<SupportProgram> {
    await delay(200)
    const program: SupportProgram = { ...data, id: `prog-${nextProgramId++}`, createdAt: now, updatedAt: now }
    programs.push(program)
    return program
  }

  async updateProgram(id: string, data: Partial<SupportProgram>): Promise<void> {
    await delay(150)
    const idx = programs.findIndex((p) => p.id === id)
    if (idx !== -1) programs[idx] = { ...programs[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async listEnrollments(programId: string): Promise<SupportProgramEnrollment[]> {
    await delay(100)
    return enrollments.filter((e) => e.programId === programId)
  }

  async createEnrollment(data: Omit<SupportProgramEnrollment, "id" | "createdAt" | "updatedAt">): Promise<SupportProgramEnrollment> {
    await delay(200)
    const enrollment: SupportProgramEnrollment = { ...data, id: `enr-${nextEnrollmentId++}`, createdAt: now, updatedAt: now }
    enrollments.push(enrollment)
    const pIdx = programs.findIndex((p) => p.id === data.programId)
    if (pIdx !== -1) programs[pIdx] = { ...programs[pIdx], currentBeneficiaries: programs[pIdx].currentBeneficiaries + 1, updatedAt: new Date().toISOString() }
    return enrollment
  }

  async updateEnrollment(id: string, data: Partial<SupportProgramEnrollment>): Promise<void> {
    await delay(150)
    const idx = enrollments.findIndex((e) => e.id === id)
    if (idx !== -1) enrollments[idx] = { ...enrollments[idx], ...data, updatedAt: new Date().toISOString() }
  }

  // ==================== RESOURCES ====================

  async listResources(tenantId: string, params?: { status?: string; category?: string }): Promise<ResourceDirectory[]> {
    await delay(200)
    let result = resources.filter((r) => r.tenantId === tenantId)
    if (params?.status && params.status !== "all") result = result.filter((r) => r.status === params.status)
    if (params?.category) result = result.filter((r) => r.category === params.category)
    return result
  }

  async getResource(id: string): Promise<ResourceDirectory | null> {
    await delay(100)
    return resources.find((r) => r.id === id) || null
  }

  async createResource(data: Omit<ResourceDirectory, "id" | "createdAt" | "updatedAt">): Promise<ResourceDirectory> {
    await delay(200)
    const resource: ResourceDirectory = { ...data, id: `res-${nextResourceId++}`, createdAt: now, updatedAt: now }
    resources.push(resource)
    return resource
  }

  async updateResource(id: string, data: Partial<ResourceDirectory>): Promise<void> {
    await delay(150)
    const idx = resources.findIndex((r) => r.id === id)
    if (idx !== -1) resources[idx] = { ...resources[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async archiveResource(id: string): Promise<void> {
    await delay(100)
    const idx = resources.findIndex((r) => r.id === id)
    if (idx !== -1) resources[idx] = { ...resources[idx], status: "archived", updatedAt: new Date().toISOString() }
  }

  // ==================== ANALYTICS ====================

  async getAnalytics(tenantId: string): Promise<SupportHubAnalytics> {
    await delay(200)
    const tenantLoans = loans.filter((l) => l.tenantId === tenantId)
    const activeLoans = tenantLoans.filter((l) => l.status === "repaying" || l.status === "disbursed")
    const totalLoanAmount = tenantLoans.reduce((sum, l) => sum + (l.amountApproved || 0), 0)
    const outstandingBalance = tenantLoans.reduce((sum, l) => sum + l.balance, 0)

    const tenantScholarships = scholarships.filter((s) => s.tenantId === tenantId)
    const activeScholarships = tenantScholarships.filter((s) => s.status === "open" || s.status === "accepting_applications")

    const tenantSponsorships = sponsorships.filter((s) => s.tenantId === tenantId)
    const activeSponsorships = tenantSponsorships.filter((s) => s.status === "active")

    const tenantPrograms = programs.filter((p) => p.tenantId === tenantId)
    const activePrograms = tenantPrograms.filter((p) => p.status === "active")

    const tenantEnrollments = enrollments.filter((e) => e.tenantId === tenantId)
    const totalBeneficiaries = tenantEnrollments.filter((e) => e.status === "approved" || e.status === "active").length

    const tenantResources = resources.filter((r) => r.tenantId === tenantId)

    const categoryCounts = new Map<string, number>()
    tenantLoans.forEach((l) => categoryCounts.set(l.loanType, (categoryCounts.get(l.loanType) || 0) + 1))
    tenantScholarships.forEach((s) => categoryCounts.set(s.scholarshipType, (categoryCounts.get(s.scholarshipType) || 0) + 1))
    tenantSponsorships.forEach((s) => categoryCounts.set(s.category, (categoryCounts.get(s.category) || 0) + 1))
    tenantPrograms.forEach((p) => categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1))
    const byCategory = Array.from(categoryCounts.entries()).map(([category, count]) => ({ category, count }))

    return {
      totalLoans: tenantLoans.length,
      activeLoans: activeLoans.length,
      totalLoanAmount,
      outstandingBalance,
      totalScholarships: tenantScholarships.length,
      activeScholarships: activeScholarships.length,
      totalSponsorships: tenantSponsorships.length,
      activeSponsorships: activeSponsorships.length,
      totalPrograms: tenantPrograms.length,
      activePrograms: activePrograms.length,
      totalBeneficiaries,
      totalResources: tenantResources.length,
      byCategory,
      recentActivity: [],
    }
  }

  // ==================== AUDIT ====================

  async getAuditLogs(tenantId: string): Promise<SupportHubAuditLog[]> {
    await delay(100)
    return auditLogs.filter((l) => l.tenantId === tenantId)
  }
}
