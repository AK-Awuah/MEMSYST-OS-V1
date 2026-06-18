import type { Bill, BillType, BillStatus } from "@/types"

export interface IBillingService {
  listBills(params?: { tenantId?: string; memberId?: string; type?: BillType; status?: BillStatus }): Promise<Bill[]>
  getBill(id: string): Promise<Bill | null>
  createBill(data: Omit<Bill, "id" | "createdAt" | "updatedAt">): Promise<Bill>
  updateBillStatus(id: string, status: BillStatus): Promise<Bill>
  getBillingStats(tenantId?: string): Promise<{ totalBills: number; paidBills: number; overdueBills: number; totalOutstanding: number }>
}
