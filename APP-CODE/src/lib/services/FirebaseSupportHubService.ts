import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { ISupportHubService } from "./ISupportHubService"
import type { Loan, LoanRepayment, Scholarship, ScholarshipApplication, Sponsorship, SupportProgram, SupportProgramEnrollment, ResourceDirectory, SupportHubAnalytics, SupportHubAuditLog } from "@/types"

const LOANS_COLLECTION = "loans"
const REPAYMENTS_COLLECTION = "loanRepayments"
const SCHOLARSHIPS_COLLECTION = "scholarships"
const APPLICATIONS_COLLECTION = "scholarshipApplications"
const SPONSORSHIPS_COLLECTION = "sponsorships"
const PROGRAMS_COLLECTION = "supportPrograms"
const ENROLLMENTS_COLLECTION = "supportProgramEnrollments"
const RESOURCES_COLLECTION = "resourceDirectory"
const AUDIT_COLLECTION = "supportHubAuditLogs"

function toLoan(id: string, data: Record<string, unknown>): Loan {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    memberName: (data.memberName as string) || "",
    loanType: (data.loanType as Loan["loanType"]) || "personal",
    amountRequested: (data.amountRequested as number) || 0,
    amountApproved: (data.amountApproved as number) || undefined,
    interestRate: (data.interestRate as number) || 0,
    repaymentPeriod: (data.repaymentPeriod as number) || 0,
    repaymentFrequency: (data.repaymentFrequency as Loan["repaymentFrequency"]) || "monthly",
    installmentAmount: (data.installmentAmount as number) || undefined,
    totalRepayable: (data.totalRepayable as number) || undefined,
    amountPaid: (data.amountPaid as number) || 0,
    balance: (data.balance as number) || 0,
    purpose: (data.purpose as string) || "",
    status: (data.status as Loan["status"]) || "draft",
    applicationDate: (data.applicationDate as string) || "",
    approvalDate: (data.approvalDate as string) || undefined,
    disbursementDate: (data.disbursementDate as string) || undefined,
    expectedCompletionDate: (data.expectedCompletionDate as string) || undefined,
    guarantorId: (data.guarantorId as string) || undefined,
    guarantorName: (data.guarantorName as string) || undefined,
    notes: (data.notes as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toRepayment(id: string, data: Record<string, unknown>): LoanRepayment {
  return {
    id,
    loanId: (data.loanId as string) || "",
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    amount: (data.amount as number) || 0,
    principalPortion: (data.principalPortion as number) || 0,
    interestPortion: (data.interestPortion as number) || 0,
    dueDate: (data.dueDate as string) || "",
    paidDate: (data.paidDate as string) || undefined,
    status: (data.status as LoanRepayment["status"]) || "pending",
    transactionId: (data.transactionId as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

function toScholarship(id: string, data: Record<string, unknown>): Scholarship {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    scholarshipType: (data.scholarshipType as Scholarship["scholarshipType"]) || "general",
    provider: (data.provider as string) || "",
    amount: (data.amount as number) || 0,
    totalSlots: (data.totalSlots as number) || 0,
    slotsFilled: (data.slotsFilled as number) || 0,
    eligibilityCriteria: (data.eligibilityCriteria as string[]) || [],
    requirements: (data.requirements as string[]) || [],
    applicationDeadline: (data.applicationDeadline as string) || "",
    status: (data.status as Scholarship["status"]) || "draft",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toScholarshipApplication(id: string, data: Record<string, unknown>): ScholarshipApplication {
  return {
    id,
    scholarshipId: (data.scholarshipId as string) || "",
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    memberName: (data.memberName as string) || "",
    applicationDate: (data.applicationDate as string) || "",
    status: (data.status as ScholarshipApplication["status"]) || "submitted",
    documents: (data.documents as string[]) || [],
    reviewedBy: (data.reviewedBy as string) || undefined,
    reviewNotes: (data.reviewNotes as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toSponsorship(id: string, data: Record<string, unknown>): Sponsorship {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    category: (data.category as Sponsorship["category"]) || "member",
    sponsorName: (data.sponsorName as string) || "",
    sponsorContact: (data.sponsorContact as string) || undefined,
    beneficiaryId: (data.beneficiaryId as string) || undefined,
    beneficiaryName: (data.beneficiaryName as string) || undefined,
    amount: (data.amount as number) || 0,
    inKindDetails: (data.inKindDetails as string) || undefined,
    startDate: (data.startDate as string) || "",
    endDate: (data.endDate as string) || undefined,
    status: (data.status as Sponsorship["status"]) || "draft",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toProgram(id: string, data: Record<string, unknown>): SupportProgram {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    category: (data.category as SupportProgram["category"]) || "other",
    provider: (data.provider as string) || "",
    eligibilityCriteria: (data.eligibilityCriteria as string[]) || [],
    applicationProcess: (data.applicationProcess as string) || "",
    benefits: (data.benefits as string[]) || [],
    fundingSource: (data.fundingSource as string) || "",
    budget: (data.budget as number) || 0,
    budgetSpent: (data.budgetSpent as number) || 0,
    startDate: (data.startDate as string) || "",
    endDate: (data.endDate as string) || undefined,
    maxBeneficiaries: (data.maxBeneficiaries as number) || 0,
    currentBeneficiaries: (data.currentBeneficiaries as number) || 0,
    status: (data.status as SupportProgram["status"]) || "draft",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toEnrollment(id: string, data: Record<string, unknown>): SupportProgramEnrollment {
  return {
    id,
    programId: (data.programId as string) || "",
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    memberName: (data.memberName as string) || "",
    enrollmentDate: (data.enrollmentDate as string) || "",
    status: (data.status as SupportProgramEnrollment["status"]) || "pending",
    benefitsReceived: (data.benefitsReceived as string[]) || [],
    outcome: (data.outcome as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toResource(id: string, data: Record<string, unknown>): ResourceDirectory {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    category: (data.category as ResourceDirectory["category"]) || "community",
    provider: (data.provider as string) || "",
    contactPhone: (data.contactPhone as string) || undefined,
    contactEmail: (data.contactEmail as string) || undefined,
    website: (data.website as string) || undefined,
    address: (data.address as string) || undefined,
    eligibilitySummary: (data.eligibilitySummary as string) || undefined,
    isVerified: (data.isVerified as boolean) || false,
    tags: (data.tags as string[]) || [],
    status: (data.status as ResourceDirectory["status"]) || "published",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toAuditLog(id: string, data: Record<string, unknown>): SupportHubAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as SupportHubAuditLog["action"]) || "loan_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: (data.previousValue as string) || undefined,
    newValue: (data.newValue as string) || undefined,
    details: (data.details as string) || undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseSupportHubService implements ISupportHubService {
  private db = getFirestoreDb()

  // ==================== LOANS ====================

  async listLoans(tenantId: string, params?: { status?: string; memberId?: string; loanType?: string }): Promise<Loan[]> {
    const col = collection(this.db, LOANS_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    if (params?.memberId) constraints.unshift(where("memberId", "==", params.memberId))
    if (params?.loanType) constraints.unshift(where("loanType", "==", params.loanType))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toLoan(d.id, d.data() as Record<string, unknown>))
  }

  async getLoan(id: string): Promise<Loan | null> {
    const snap = await getDoc(doc(this.db, LOANS_COLLECTION, id))
    if (!snap.exists()) return null
    return toLoan(snap.id, snap.data() as Record<string, unknown>)
  }

  async createLoan(data: Omit<Loan, "id" | "createdAt" | "updatedAt">): Promise<Loan> {
    const ref = await addDoc(collection(this.db, LOANS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getLoan(ref.id) as Promise<Loan>
  }

  async updateLoan(id: string, data: Partial<Loan>): Promise<void> {
    await updateDoc(doc(this.db, LOANS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async approveLoan(id: string, amountApproved: number): Promise<void> {
    await updateDoc(doc(this.db, LOANS_COLLECTION, id), { status: "approved", amountApproved, approvalDate: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }

  async disburseLoan(id: string): Promise<void> {
    const snap = await getDoc(doc(this.db, LOANS_COLLECTION, id))
    if (!snap.exists()) return
    const data = snap.data() as Record<string, unknown>
    const amountApproved = (data.amountApproved as number) || 0
    const interestRate = (data.interestRate as number) || 0
    const repaymentPeriod = (data.repaymentPeriod as number) || 1
    const totalRepayable = amountApproved + (amountApproved * interestRate / 100)
    const installmentAmount = totalRepayable / repaymentPeriod
    await updateDoc(doc(this.db, LOANS_COLLECTION, id), {
      status: "disbursed",
      totalRepayable,
      installmentAmount,
      balance: totalRepayable,
      disbursementDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  async recordRepayment(loanId: string, data: Omit<LoanRepayment, "id" | "createdAt">): Promise<LoanRepayment> {
    const ref = await addDoc(collection(this.db, REPAYMENTS_COLLECTION), { ...data, createdAt: new Date().toISOString() })
    const repaymentSnap = await getDoc(ref)
    const repayment = toRepayment(ref.id, repaymentSnap.data() as Record<string, unknown>)

    const loanSnap = await getDoc(doc(this.db, LOANS_COLLECTION, loanId))
    if (loanSnap.exists()) {
      const loan = loanSnap.data() as Record<string, unknown>
      const amountPaid = (loan.amountPaid as number) + data.amount
      const balance = (loan.balance as number) - data.amount
      const status = balance <= 0 ? "completed" : "repaying"
      await updateDoc(doc(this.db, LOANS_COLLECTION, loanId), { amountPaid, balance, status, updatedAt: new Date().toISOString() })
    }

    return repayment
  }

  async getLoanRepayments(loanId: string): Promise<LoanRepayment[]> {
    const col = collection(this.db, REPAYMENTS_COLLECTION)
    const snap = await getDocs(query(col, where("loanId", "==", loanId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toRepayment(d.id, d.data() as Record<string, unknown>))
  }

  // ==================== SCHOLARSHIPS ====================

  async listScholarships(tenantId: string, params?: { status?: string; type?: string }): Promise<Scholarship[]> {
    const col = collection(this.db, SCHOLARSHIPS_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    if (params?.type) constraints.unshift(where("scholarshipType", "==", params.type))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toScholarship(d.id, d.data() as Record<string, unknown>))
  }

  async getScholarship(id: string): Promise<Scholarship | null> {
    const snap = await getDoc(doc(this.db, SCHOLARSHIPS_COLLECTION, id))
    if (!snap.exists()) return null
    return toScholarship(snap.id, snap.data() as Record<string, unknown>)
  }

  async createScholarship(data: Omit<Scholarship, "id" | "createdAt" | "updatedAt">): Promise<Scholarship> {
    const ref = await addDoc(collection(this.db, SCHOLARSHIPS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getScholarship(ref.id) as Promise<Scholarship>
  }

  async updateScholarship(id: string, data: Partial<Scholarship>): Promise<void> {
    await updateDoc(doc(this.db, SCHOLARSHIPS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async listScholarshipApplications(scholarshipId: string): Promise<ScholarshipApplication[]> {
    const col = collection(this.db, APPLICATIONS_COLLECTION)
    const snap = await getDocs(query(col, where("scholarshipId", "==", scholarshipId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toScholarshipApplication(d.id, d.data() as Record<string, unknown>))
  }

  async createScholarshipApplication(data: Omit<ScholarshipApplication, "id" | "createdAt" | "updatedAt">): Promise<ScholarshipApplication> {
    const ref = await addDoc(collection(this.db, APPLICATIONS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    const snap = await getDoc(ref)
    return toScholarshipApplication(ref.id, snap.data() as Record<string, unknown>)
  }

  async reviewScholarshipApplication(id: string, status: "shortlisted" | "rejected", reviewNotes?: string): Promise<void> {
    await updateDoc(doc(this.db, APPLICATIONS_COLLECTION, id), { status, reviewNotes, reviewedBy: "system", updatedAt: new Date().toISOString() })
  }

  async awardScholarship(id: string): Promise<void> {
    await updateDoc(doc(this.db, APPLICATIONS_COLLECTION, id), { status: "awarded", updatedAt: new Date().toISOString() })
    const snap = await getDoc(doc(this.db, APPLICATIONS_COLLECTION, id))
    if (snap.exists()) {
      const app = snap.data() as Record<string, unknown>
      const scholarshipId = app.scholarshipId as string
      const scholarshipSnap = await getDoc(doc(this.db, SCHOLARSHIPS_COLLECTION, scholarshipId))
      if (scholarshipSnap.exists()) {
        const scholarship = scholarshipSnap.data() as Record<string, unknown>
        const slotsFilled = (scholarship.slotsFilled as number) + 1
        const newStatus = slotsFilled >= (scholarship.totalSlots as number) ? "awarded" : scholarship.status
        await updateDoc(doc(this.db, SCHOLARSHIPS_COLLECTION, scholarshipId), { slotsFilled, status: newStatus, updatedAt: new Date().toISOString() })
      }
    }
  }

  // ==================== SPONSORSHIPS ====================

  async listSponsorships(tenantId: string, params?: { status?: string; category?: string }): Promise<Sponsorship[]> {
    const col = collection(this.db, SPONSORSHIPS_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    if (params?.category) constraints.unshift(where("category", "==", params.category))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toSponsorship(d.id, d.data() as Record<string, unknown>))
  }

  async getSponsorship(id: string): Promise<Sponsorship | null> {
    const snap = await getDoc(doc(this.db, SPONSORSHIPS_COLLECTION, id))
    if (!snap.exists()) return null
    return toSponsorship(snap.id, snap.data() as Record<string, unknown>)
  }

  async createSponsorship(data: Omit<Sponsorship, "id" | "createdAt" | "updatedAt">): Promise<Sponsorship> {
    const ref = await addDoc(collection(this.db, SPONSORSHIPS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getSponsorship(ref.id) as Promise<Sponsorship>
  }

  async updateSponsorship(id: string, data: Partial<Sponsorship>): Promise<void> {
    await updateDoc(doc(this.db, SPONSORSHIPS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  // ==================== SUPPORT PROGRAMS ====================

  async listPrograms(tenantId: string, params?: { status?: string; category?: string }): Promise<SupportProgram[]> {
    const col = collection(this.db, PROGRAMS_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    if (params?.category) constraints.unshift(where("category", "==", params.category))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toProgram(d.id, d.data() as Record<string, unknown>))
  }

  async getProgram(id: string): Promise<SupportProgram | null> {
    const snap = await getDoc(doc(this.db, PROGRAMS_COLLECTION, id))
    if (!snap.exists()) return null
    return toProgram(snap.id, snap.data() as Record<string, unknown>)
  }

  async createProgram(data: Omit<SupportProgram, "id" | "createdAt" | "updatedAt">): Promise<SupportProgram> {
    const ref = await addDoc(collection(this.db, PROGRAMS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getProgram(ref.id) as Promise<SupportProgram>
  }

  async updateProgram(id: string, data: Partial<SupportProgram>): Promise<void> {
    await updateDoc(doc(this.db, PROGRAMS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async listEnrollments(programId: string): Promise<SupportProgramEnrollment[]> {
    const col = collection(this.db, ENROLLMENTS_COLLECTION)
    const snap = await getDocs(query(col, where("programId", "==", programId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toEnrollment(d.id, d.data() as Record<string, unknown>))
  }

  async createEnrollment(data: Omit<SupportProgramEnrollment, "id" | "createdAt" | "updatedAt">): Promise<SupportProgramEnrollment> {
    const ref = await addDoc(collection(this.db, ENROLLMENTS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    const snap = await getDoc(ref)
    const enrollment = toEnrollment(ref.id, snap.data() as Record<string, unknown>)

    const programSnap = await getDoc(doc(this.db, PROGRAMS_COLLECTION, data.programId))
    if (programSnap.exists()) {
      const program = programSnap.data() as Record<string, unknown>
      await updateDoc(doc(this.db, PROGRAMS_COLLECTION, data.programId), {
        currentBeneficiaries: (program.currentBeneficiaries as number) + 1,
        updatedAt: new Date().toISOString(),
      })
    }

    return enrollment
  }

  async updateEnrollment(id: string, data: Partial<SupportProgramEnrollment>): Promise<void> {
    await updateDoc(doc(this.db, ENROLLMENTS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  // ==================== RESOURCES ====================

  async listResources(tenantId: string, params?: { status?: string; category?: string }): Promise<ResourceDirectory[]> {
    const col = collection(this.db, RESOURCES_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("createdAt", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    if (params?.category) constraints.unshift(where("category", "==", params.category))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toResource(d.id, d.data() as Record<string, unknown>))
  }

  async getResource(id: string): Promise<ResourceDirectory | null> {
    const snap = await getDoc(doc(this.db, RESOURCES_COLLECTION, id))
    if (!snap.exists()) return null
    return toResource(snap.id, snap.data() as Record<string, unknown>)
  }

  async createResource(data: Omit<ResourceDirectory, "id" | "createdAt" | "updatedAt">): Promise<ResourceDirectory> {
    const ref = await addDoc(collection(this.db, RESOURCES_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getResource(ref.id) as Promise<ResourceDirectory>
  }

  async updateResource(id: string, data: Partial<ResourceDirectory>): Promise<void> {
    await updateDoc(doc(this.db, RESOURCES_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async archiveResource(id: string): Promise<void> {
    await updateDoc(doc(this.db, RESOURCES_COLLECTION, id), { status: "archived", updatedAt: new Date().toISOString() })
  }

  // ==================== ANALYTICS ====================

  async getAnalytics(tenantId: string): Promise<SupportHubAnalytics> {
    const loansSnap = await getDocs(query(collection(this.db, LOANS_COLLECTION), where("tenantId", "==", tenantId)))
    const activeLoans = loansSnap.docs.filter((d) => d.data().status === "repaying" || d.data().status === "disbursed")
    const totalLoanAmount = loansSnap.docs.reduce((sum, d) => sum + ((d.data().amountApproved as number) || 0), 0)
    const outstandingBalance = loansSnap.docs.reduce((sum, d) => sum + ((d.data().balance as number) || 0), 0)

    const scholarshipsSnap = await getDocs(query(collection(this.db, SCHOLARSHIPS_COLLECTION), where("tenantId", "==", tenantId)))
    const activeScholarships = scholarshipsSnap.docs.filter((d) => d.data().status === "open" || d.data().status === "accepting_applications")

    const sponsorshipsSnap = await getDocs(query(collection(this.db, SPONSORSHIPS_COLLECTION), where("tenantId", "==", tenantId)))
    const activeSponsorships = sponsorshipsSnap.docs.filter((d) => d.data().status === "active")

    const programsSnap = await getDocs(query(collection(this.db, PROGRAMS_COLLECTION), where("tenantId", "==", tenantId)))
    const activePrograms = programsSnap.docs.filter((d) => d.data().status === "active")

    const enrollmentsSnap = await getDocs(query(collection(this.db, ENROLLMENTS_COLLECTION), where("tenantId", "==", tenantId)))
    const totalBeneficiaries = enrollmentsSnap.docs.filter((d) => d.data().status === "approved" || d.data().status === "active").length

    const resourcesSnap = await getDocs(query(collection(this.db, RESOURCES_COLLECTION), where("tenantId", "==", tenantId)))

    const categoryMap = new Map<string, number>()
    loansSnap.docs.forEach((d) => {
      const cat = d.data().loanType as string
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
    })
    scholarshipsSnap.docs.forEach((d) => {
      const cat = d.data().scholarshipType as string
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
    })
    sponsorshipsSnap.docs.forEach((d) => {
      const cat = d.data().category as string
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
    })
    programsSnap.docs.forEach((d) => {
      const cat = d.data().category as string
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
    })
    const byCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }))

    return {
      totalLoans: loansSnap.size,
      activeLoans: activeLoans.length,
      totalLoanAmount,
      outstandingBalance,
      totalScholarships: scholarshipsSnap.size,
      activeScholarships: activeScholarships.length,
      totalSponsorships: sponsorshipsSnap.size,
      activeSponsorships: activeSponsorships.length,
      totalPrograms: programsSnap.size,
      activePrograms: activePrograms.length,
      totalBeneficiaries,
      totalResources: resourcesSnap.size,
      byCategory,
      recentActivity: [],
    }
  }

  // ==================== AUDIT ====================

  async getAuditLogs(tenantId: string): Promise<SupportHubAuditLog[]> {
    const col = collection(this.db, AUDIT_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
