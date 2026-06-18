import type { IPaymentService } from "./IPaymentService"
import type { Payment, PaymentStatus } from "@/types"
import { sharedPayments, pushAuditLog } from "./shared-store"
import { delay } from "./shared-store"

let payments = [...sharedPayments]

export class MockPaymentService implements IPaymentService {
  async listPayments(params?: { tenantId?: string; memberId?: string; status?: PaymentStatus }): Promise<Payment[]> {
    await delay(100)
    let result = [...payments]
    if (params?.tenantId) result = result.filter((p) => p.tenantId === params.tenantId)
    if (params?.memberId) result = result.filter((p) => p.memberId === params.memberId)
    if (params?.status) result = result.filter((p) => p.status === params.status)
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getPayment(id: string): Promise<Payment | null> {
    await delay(50)
    return payments.find((p) => p.id === id) || null
  }

  async processPayment(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
    await delay(300)
    const payment: Payment = { ...data, id: `pmt-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    payments.unshift(payment)
    pushAuditLog({ actor: "System", role: "system", action: "CREATE", module: "FINANCE", recordType: "Payment", recordId: payment.id, newValue: `Payment processed: GHS ${payment.amount}`, ipAddress: "127.0.0.1" })
    return payment
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment> {
    await delay(100)
    const idx = payments.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error("Payment not found")
    payments[idx] = { ...payments[idx], status, updatedAt: new Date().toISOString() }
    pushAuditLog({ actor: "System", role: "system", action: "UPDATE", module: "FINANCE", recordType: "Payment", recordId: id, newValue: `Payment status: ${status}`, ipAddress: "127.0.0.1" })
    return payments[idx]
  }

  async getPaymentStats(tenantId?: string): Promise<{ totalPayments: number; successfulPayments: number; totalAmount: number; totalFees: number }> {
    await delay(100)
    const filtered = tenantId ? payments.filter((p) => p.tenantId === tenantId) : payments
    return {
      totalPayments: filtered.length,
      successfulPayments: filtered.filter((p) => p.status === "successful").length,
      totalAmount: filtered.reduce((s, p) => s + p.amount, 0),
      totalFees: filtered.reduce((s, p) => s + p.fee, 0),
    }
  }
}
