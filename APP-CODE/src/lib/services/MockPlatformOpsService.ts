import type { IPlatformOpsService } from "./IPlatformOpsService"
import type { SubscriptionPlan, TenantSubscription, Invoice, SupportTicket, PlatformPartner, PartnerTenant, PlatformOpsAuditLog } from "@/types"
import { delay, pushAuditLog } from "./shared-store"

let plans: SubscriptionPlan[] = []
let subscriptions: TenantSubscription[] = []
let invoices: Invoice[] = []
let tickets: SupportTicket[] = []
let partners: PlatformPartner[] = []
let partnerTenants: PartnerTenant[] = []

export class MockPlatformOpsService implements IPlatformOpsService {
  async listPlans(): Promise<SubscriptionPlan[]> {
    await delay(200)
    return [...plans]
  }

  async getPlan(id: string): Promise<SubscriptionPlan | null> {
    await delay(100)
    return plans.find((p) => p.id === id) || null
  }

  async createPlan(data: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">): Promise<SubscriptionPlan> {
    await delay(200)
    const now = new Date().toISOString()
    const plan: SubscriptionPlan = { ...data, id: `plan-${Date.now()}`, createdAt: now, updatedAt: now }
    plans.push(plan)
    pushAuditLog({ actor: "System", role: "system", action: "CREATE", module: "PLATFORM_OPS", recordType: "SubscriptionPlan", recordId: plan.id, newValue: `Plan created: ${plan.name}`, ipAddress: "127.0.0.1" })
    return plan
  }

  async updatePlan(id: string, data: Partial<SubscriptionPlan>): Promise<void> {
    await delay(150)
    const idx = plans.findIndex((p) => p.id === id)
    if (idx !== -1) plans[idx] = { ...plans[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async deprecatePlan(id: string): Promise<void> {
    await delay(150)
    const idx = plans.findIndex((p) => p.id === id)
    if (idx !== -1) plans[idx] = { ...plans[idx], status: "deprecated", updatedAt: new Date().toISOString() }
  }

  async listSubscriptions(params?: { tenantId?: string; status?: string }): Promise<TenantSubscription[]> {
    await delay(200)
    let result = [...subscriptions]
    if (params?.tenantId) result = result.filter((s) => s.tenantId === params.tenantId)
    if (params?.status) result = result.filter((s) => s.status === params.status)
    return result
  }

  async getSubscription(id: string): Promise<TenantSubscription | null> {
    await delay(100)
    return subscriptions.find((s) => s.id === id) || null
  }

  async createSubscription(data: Omit<TenantSubscription, "id" | "createdAt" | "updatedAt">): Promise<TenantSubscription> {
    await delay(200)
    const now = new Date().toISOString()
    const sub: TenantSubscription = { ...data, id: `sub-${Date.now()}`, createdAt: now, updatedAt: now }
    subscriptions.push(sub)
    pushAuditLog({ actor: "System", role: "system", action: "CREATE", module: "PLATFORM_OPS", recordType: "TenantSubscription", recordId: sub.id, newValue: `Subscription created for ${sub.tenantId}`, ipAddress: "127.0.0.1" })
    return sub
  }

  async updateSubscription(id: string, data: Partial<TenantSubscription>): Promise<void> {
    await delay(150)
    const idx = subscriptions.findIndex((s) => s.id === id)
    if (idx !== -1) subscriptions[idx] = { ...subscriptions[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async cancelSubscription(id: string): Promise<void> {
    await delay(150)
    const idx = subscriptions.findIndex((s) => s.id === id)
    if (idx !== -1) subscriptions[idx] = { ...subscriptions[idx], status: "cancelled", cancelledAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  }

  async listInvoices(params?: { tenantId?: string; status?: string }): Promise<Invoice[]> {
    await delay(200)
    let result = [...invoices]
    if (params?.tenantId) result = result.filter((i) => i.tenantId === params.tenantId)
    if (params?.status) result = result.filter((i) => i.status === params.status)
    return result
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    await delay(100)
    return invoices.find((i) => i.id === id) || null
  }

  async issueInvoice(data: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Promise<Invoice> {
    await delay(200)
    const now = new Date().toISOString()
    const invoice: Invoice = { ...data, id: `inv-${Date.now()}`, createdAt: now, updatedAt: now }
    invoices.push(invoice)
    return invoice
  }

  async recordPayment(id: string, paidDate: string, paymentMethod: string, transactionId: string): Promise<void> {
    await delay(150)
    const idx = invoices.findIndex((i) => i.id === id)
    if (idx !== -1) invoices[idx] = { ...invoices[idx], status: "paid", paidDate, paymentMethod, transactionId, updatedAt: new Date().toISOString() }
  }

  async markOverdue(id: string): Promise<void> {
    await delay(100)
    const idx = invoices.findIndex((i) => i.id === id)
    if (idx !== -1) invoices[idx] = { ...invoices[idx], status: "overdue", updatedAt: new Date().toISOString() }
  }

  async listTickets(params?: { tenantId?: string; status?: string }): Promise<SupportTicket[]> {
    await delay(200)
    let result = [...tickets]
    if (params?.tenantId) result = result.filter((t) => t.tenantId === params.tenantId)
    if (params?.status) result = result.filter((t) => t.status === params.status)
    return result
  }

  async getTicket(id: string): Promise<SupportTicket | null> {
    await delay(100)
    return tickets.find((t) => t.id === id) || null
  }

  async createTicket(data: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket> {
    await delay(200)
    const now = new Date().toISOString()
    const ticket: SupportTicket = { ...data, id: `tkt-${Date.now()}`, createdAt: now, updatedAt: now }
    tickets.push(ticket)
    return ticket
  }

  async updateTicket(id: string, data: Partial<SupportTicket>): Promise<void> {
    await delay(150)
    const idx = tickets.findIndex((t) => t.id === id)
    if (idx !== -1) tickets[idx] = { ...tickets[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async resolveTicket(id: string): Promise<void> {
    await delay(150)
    const idx = tickets.findIndex((t) => t.id === id)
    if (idx !== -1) tickets[idx] = { ...tickets[idx], status: "resolved", resolvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  }

  async addMessage(id: string, sender: string, message: string, attachments?: string[]): Promise<void> {
    await delay(100)
    const idx = tickets.findIndex((t) => t.id === id)
    if (idx !== -1) {
      const msg = { sender, message, attachments: attachments || [], createdAt: new Date().toISOString() }
      tickets[idx] = { ...tickets[idx], messages: [...tickets[idx].messages, msg], updatedAt: new Date().toISOString() }
    }
  }

  async listPartners(): Promise<PlatformPartner[]> {
    await delay(200)
    return [...partners]
  }

  async getPartner(id: string): Promise<PlatformPartner | null> {
    await delay(100)
    return partners.find((p) => p.id === id) || null
  }

  async createPartner(data: Omit<PlatformPartner, "id" | "createdAt" | "updatedAt">): Promise<PlatformPartner> {
    await delay(200)
    const now = new Date().toISOString()
    const partner: PlatformPartner = { ...data, id: `prt-${Date.now()}`, createdAt: now, updatedAt: now }
    partners.push(partner)
    return partner
  }

  async updatePartner(id: string, data: Partial<PlatformPartner>): Promise<void> {
    await delay(150)
    const idx = partners.findIndex((p) => p.id === id)
    if (idx !== -1) partners[idx] = { ...partners[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async suspendPartner(id: string): Promise<void> {
    await delay(150)
    const idx = partners.findIndex((p) => p.id === id)
    if (idx !== -1) partners[idx] = { ...partners[idx], status: "suspended", updatedAt: new Date().toISOString() }
  }

  async listPartnerTenants(partnerId: string): Promise<PartnerTenant[]> {
    await delay(200)
    return partnerTenants.filter((pt) => pt.partnerId === partnerId)
  }

  async getAuditLogs(): Promise<PlatformOpsAuditLog[]> {
    await delay(100)
    return []
  }
}
