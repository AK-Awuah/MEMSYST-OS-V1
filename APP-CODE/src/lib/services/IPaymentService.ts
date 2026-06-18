import type { Payment, PaymentStatus } from "@/types"

export interface IPaymentService {
  listPayments(params?: { tenantId?: string; memberId?: string; status?: PaymentStatus }): Promise<Payment[]>
  getPayment(id: string): Promise<Payment | null>
  processPayment(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment>
  updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment>
  getPaymentStats(tenantId?: string): Promise<{ totalPayments: number; successfulPayments: number; totalAmount: number; totalFees: number }>
}
