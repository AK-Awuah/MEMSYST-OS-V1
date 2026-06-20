import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IPlatformOpsService } from "./IPlatformOpsService"
import type { SubscriptionPlan, SubscriptionPlanStatus, TenantSubscription, Invoice, SupportTicket, PlatformPartner, PartnerTenant, PlatformOpsAuditLog } from "@/types"

const PLANS_COLLECTION = "subscription_plans"
const SUBSCRIPTIONS_COLLECTION = "tenant_subscriptions"
const INVOICES_COLLECTION = "invoices"
const TICKETS_COLLECTION = "support_tickets"
const PARTNERS_COLLECTION = "platform_partners"
const PARTNER_TENANTS_COLLECTION = "partner_tenants"
const AUDIT_COLLECTION = "platform_ops_audit_logs"

function toPlan(id: string, data: Record<string, unknown>): SubscriptionPlan {
  return {
    id,
    name: (data.name as string) || "",
    code: (data.code as string) || "",
    description: (data.description as string) || "",
    monthlyPrice: (data.monthlyPrice as number) || 0,
    quarterlyPrice: data.quarterlyPrice as number | undefined,
    biannualPrice: data.biannualPrice as number | undefined,
    annualPrice: data.annualPrice as number | undefined,
    currency: (data.currency as string) || "",
    features: (data.features as SubscriptionPlan["features"]) || [],
    maxMembers: (data.maxMembers as number) || 0,
    maxBranches: (data.maxBranches as number) || 0,
    maxAdmins: (data.maxAdmins as number) || 0,
    includedSMS: (data.includedSMS as number) || 0,
    includedEmail: (data.includedEmail as number) || 0,
    storageGB: (data.storageGB as number) || 0,
    status: (data.status as SubscriptionPlanStatus) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toSubscription(id: string, data: Record<string, unknown>): TenantSubscription {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    planId: (data.planId as string) || "",
    planName: (data.planName as string) || "",
    billingCycle: (data.billingCycle as TenantSubscription["billingCycle"]) || "monthly",
    amount: (data.amount as number) || 0,
    startDate: (data.startDate as string) || "",
    endDate: data.endDate as string | undefined,
    trialEndDate: data.trialEndDate as string | undefined,
    status: (data.status as TenantSubscription["status"]) || "active",
    autoRenew: (data.autoRenew as boolean) || false,
    gracePeriodEnd: data.gracePeriodEnd as string | undefined,
    suspendedAt: data.suspendedAt as string | undefined,
    cancelledAt: data.cancelledAt as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toInvoice(id: string, data: Record<string, unknown>): Invoice {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    subscriptionId: (data.subscriptionId as string) || "",
    invoiceNumber: (data.invoiceNumber as string) || "",
    description: (data.description as string) || "",
    amount: (data.amount as number) || 0,
    currency: (data.currency as string) || "",
    issuedDate: (data.issuedDate as string) || "",
    dueDate: (data.dueDate as string) || "",
    paidDate: data.paidDate as string | undefined,
    status: (data.status as Invoice["status"]) || "draft",
    paymentMethod: data.paymentMethod as string | undefined,
    transactionId: data.transactionId as string | undefined,
    lineItems: (data.lineItems as Invoice["lineItems"]) || [],
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toTicket(id: string, data: Record<string, unknown>): SupportTicket {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    subject: (data.subject as string) || "",
    description: (data.description as string) || "",
    priority: (data.priority as SupportTicket["priority"]) || "medium",
    category: (data.category as SupportTicket["category"]) || "other",
    status: (data.status as SupportTicket["status"]) || "open",
    assignedTo: data.assignedTo as string | undefined,
    createdBy: (data.createdBy as string) || "",
    createdByName: (data.createdByName as string) || "",
    messages: (data.messages as SupportTicket["messages"]) || [],
    resolvedAt: data.resolvedAt as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toPartner(id: string, data: Record<string, unknown>): PlatformPartner {
  return {
    id,
    name: (data.name as string) || "",
    partnerType: (data.partnerType as PlatformPartner["partnerType"]) || "technology",
    contactName: (data.contactName as string) || "",
    contactEmail: (data.contactEmail as string) || "",
    contactPhone: data.contactPhone as string | undefined,
    commissionRate: (data.commissionRate as number) || 0,
    revenueShare: (data.revenueShare as number) || 0,
    status: (data.status as PlatformPartner["status"]) || "active",
    contractStart: (data.contractStart as string) || "",
    contractEnd: data.contractEnd as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toPartnerTenant(id: string, data: Record<string, unknown>): PartnerTenant {
  return {
    id,
    partnerId: (data.partnerId as string) || "",
    tenantId: (data.tenantId as string) || "",
    tenantName: (data.tenantName as string) || "",
    commissionRate: (data.commissionRate as number) || 0,
    revenueShare: (data.revenueShare as number) || 0,
    referredAt: (data.referredAt as string) || "",
    status: (data.status as PartnerTenant["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

function toAuditLog(id: string, data: Record<string, unknown>): PlatformOpsAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as PlatformOpsAuditLog["action"]) || "plan_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: data.previousValue as string | undefined,
    newValue: data.newValue as string | undefined,
    details: data.details as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebasePlatformOpsService implements IPlatformOpsService {
  private db = getFirestoreDb()

  async listPlans(): Promise<SubscriptionPlan[]> {
    const col = collection(this.db, PLANS_COLLECTION)
    const snap = await getDocs(query(col, orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toPlan(d.id, d.data() as Record<string, unknown>))
  }

  async getPlan(id: string): Promise<SubscriptionPlan | null> {
    const snap = await getDoc(doc(this.db, PLANS_COLLECTION, id))
    if (!snap.exists()) return null
    return toPlan(snap.id, snap.data() as Record<string, unknown>)
  }

  async createPlan(data: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">): Promise<SubscriptionPlan> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, PLANS_COLLECTION), { ...data, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toPlan(created.id, created.data() as Record<string, unknown>)
  }

  async updatePlan(id: string, data: Partial<SubscriptionPlan>): Promise<void> {
    await updateDoc(doc(this.db, PLANS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async deprecatePlan(id: string): Promise<void> {
    await updateDoc(doc(this.db, PLANS_COLLECTION, id), { status: "deprecated", updatedAt: new Date().toISOString() })
  }

  async listSubscriptions(params?: { tenantId?: string; status?: string }): Promise<TenantSubscription[]> {
    const col = collection(this.db, SUBSCRIPTIONS_COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toSubscription(d.id, d.data() as Record<string, unknown>))
  }

  async getSubscription(id: string): Promise<TenantSubscription | null> {
    const snap = await getDoc(doc(this.db, SUBSCRIPTIONS_COLLECTION, id))
    if (!snap.exists()) return null
    return toSubscription(snap.id, snap.data() as Record<string, unknown>)
  }

  async createSubscription(data: Omit<TenantSubscription, "id" | "createdAt" | "updatedAt">): Promise<TenantSubscription> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, SUBSCRIPTIONS_COLLECTION), { ...data, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toSubscription(created.id, created.data() as Record<string, unknown>)
  }

  async updateSubscription(id: string, data: Partial<TenantSubscription>): Promise<void> {
    await updateDoc(doc(this.db, SUBSCRIPTIONS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async cancelSubscription(id: string): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, SUBSCRIPTIONS_COLLECTION, id), { status: "cancelled", cancelledAt: now, updatedAt: now })
  }

  async listInvoices(params?: { tenantId?: string; status?: string }): Promise<Invoice[]> {
    const col = collection(this.db, INVOICES_COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toInvoice(d.id, d.data() as Record<string, unknown>))
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    const snap = await getDoc(doc(this.db, INVOICES_COLLECTION, id))
    if (!snap.exists()) return null
    return toInvoice(snap.id, snap.data() as Record<string, unknown>)
  }

  async issueInvoice(data: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Promise<Invoice> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, INVOICES_COLLECTION), { ...data, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toInvoice(created.id, created.data() as Record<string, unknown>)
  }

  async recordPayment(id: string, paidDate: string, paymentMethod: string, transactionId: string): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, INVOICES_COLLECTION, id), { status: "paid", paidDate, paymentMethod, transactionId, updatedAt: now })
  }

  async markOverdue(id: string): Promise<void> {
    await updateDoc(doc(this.db, INVOICES_COLLECTION, id), { status: "overdue", updatedAt: new Date().toISOString() })
  }

  async listTickets(params?: { tenantId?: string; status?: string }): Promise<SupportTicket[]> {
    const col = collection(this.db, TICKETS_COLLECTION)
    const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc")]
    if (params?.tenantId) constraints.unshift(where("tenantId", "==", params.tenantId))
    if (params?.status) constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    return snap.docs.map((d) => toTicket(d.id, d.data() as Record<string, unknown>))
  }

  async getTicket(id: string): Promise<SupportTicket | null> {
    const snap = await getDoc(doc(this.db, TICKETS_COLLECTION, id))
    if (!snap.exists()) return null
    return toTicket(snap.id, snap.data() as Record<string, unknown>)
  }

  async createTicket(data: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, TICKETS_COLLECTION), { ...data, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toTicket(created.id, created.data() as Record<string, unknown>)
  }

  async updateTicket(id: string, data: Partial<SupportTicket>): Promise<void> {
    await updateDoc(doc(this.db, TICKETS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async resolveTicket(id: string): Promise<void> {
    const now = new Date().toISOString()
    await updateDoc(doc(this.db, TICKETS_COLLECTION, id), { status: "resolved", resolvedAt: now, updatedAt: now })
  }

  async addMessage(id: string, sender: string, message: string, attachments?: string[]): Promise<void> {
    const ref = doc(this.db, TICKETS_COLLECTION, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error(`Ticket ${id} not found`)
    const data = snap.data() as Record<string, unknown>
    const messages = (data.messages as { sender: string; message: string; attachments: string[]; createdAt: string }[]) || []
    messages.push({ sender, message, attachments: attachments || [], createdAt: new Date().toISOString() })
    await updateDoc(ref, { messages, updatedAt: new Date().toISOString() })
  }

  async listPartners(): Promise<PlatformPartner[]> {
    const col = collection(this.db, PARTNERS_COLLECTION)
    const snap = await getDocs(query(col, orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toPartner(d.id, d.data() as Record<string, unknown>))
  }

  async getPartner(id: string): Promise<PlatformPartner | null> {
    const snap = await getDoc(doc(this.db, PARTNERS_COLLECTION, id))
    if (!snap.exists()) return null
    return toPartner(snap.id, snap.data() as Record<string, unknown>)
  }

  async createPartner(data: Omit<PlatformPartner, "id" | "createdAt" | "updatedAt">): Promise<PlatformPartner> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, PARTNERS_COLLECTION), { ...data, createdAt: now, updatedAt: now })
    const created = await getDoc(ref)
    return toPartner(created.id, created.data() as Record<string, unknown>)
  }

  async updatePartner(id: string, data: Partial<PlatformPartner>): Promise<void> {
    await updateDoc(doc(this.db, PARTNERS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async suspendPartner(id: string): Promise<void> {
    await updateDoc(doc(this.db, PARTNERS_COLLECTION, id), { status: "suspended", updatedAt: new Date().toISOString() })
  }

  async listPartnerTenants(partnerId: string): Promise<PartnerTenant[]> {
    const col = collection(this.db, PARTNER_TENANTS_COLLECTION)
    const snap = await getDocs(query(col, where("partnerId", "==", partnerId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toPartnerTenant(d.id, d.data() as Record<string, unknown>))
  }

  async getAuditLogs(): Promise<PlatformOpsAuditLog[]> {
    const col = collection(this.db, AUDIT_COLLECTION)
    const snap = await getDocs(query(col, orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}
