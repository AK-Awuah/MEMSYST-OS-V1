import type { SubscriptionPlan, TenantSubscription, Invoice, SupportTicket, PlatformPartner, PartnerTenant, PlatformOpsAuditLog } from "@/types"

export interface IPlatformOpsService {
  listPlans(): Promise<SubscriptionPlan[]>
  getPlan(id: string): Promise<SubscriptionPlan | null>
  createPlan(data: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">): Promise<SubscriptionPlan>
  updatePlan(id: string, data: Partial<SubscriptionPlan>): Promise<void>
  deprecatePlan(id: string): Promise<void>
  listSubscriptions(params?: { tenantId?: string; status?: string }): Promise<TenantSubscription[]>
  getSubscription(id: string): Promise<TenantSubscription | null>
  createSubscription(data: Omit<TenantSubscription, "id" | "createdAt" | "updatedAt">): Promise<TenantSubscription>
  updateSubscription(id: string, data: Partial<TenantSubscription>): Promise<void>
  cancelSubscription(id: string): Promise<void>
  listInvoices(params?: { tenantId?: string; status?: string }): Promise<Invoice[]>
  getInvoice(id: string): Promise<Invoice | null>
  issueInvoice(data: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Promise<Invoice>
  recordPayment(id: string, paidDate: string, paymentMethod: string, transactionId: string): Promise<void>
  markOverdue(id: string): Promise<void>
  listTickets(params?: { tenantId?: string; status?: string }): Promise<SupportTicket[]>
  getTicket(id: string): Promise<SupportTicket | null>
  createTicket(data: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket>
  updateTicket(id: string, data: Partial<SupportTicket>): Promise<void>
  resolveTicket(id: string): Promise<void>
  addMessage(id: string, sender: string, message: string, attachments?: string[]): Promise<void>
  listPartners(): Promise<PlatformPartner[]>
  getPartner(id: string): Promise<PlatformPartner | null>
  createPartner(data: Omit<PlatformPartner, "id" | "createdAt" | "updatedAt">): Promise<PlatformPartner>
  updatePartner(id: string, data: Partial<PlatformPartner>): Promise<void>
  suspendPartner(id: string): Promise<void>
  listPartnerTenants(partnerId: string): Promise<PartnerTenant[]>
  getAuditLogs(): Promise<PlatformOpsAuditLog[]>
}
