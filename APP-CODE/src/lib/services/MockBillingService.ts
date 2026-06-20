import type { IBillingService } from "./IBillingService"
import type { Bill, BillType, BillStatus } from "@/types"
import { sharedBills, pushAuditLog } from "./shared-store"
import { delay } from "./shared-store"

const bills = [...sharedBills]

export class MockBillingService implements IBillingService {
  async listBills(params?: { tenantId?: string; memberId?: string; type?: BillType; status?: BillStatus }): Promise<Bill[]> {
    await delay(100)
    let result = [...bills]
    if (params?.tenantId) result = result.filter((b) => b.tenantId === params.tenantId)
    if (params?.memberId) result = result.filter((b) => b.memberId === params.memberId)
    if (params?.type) result = result.filter((b) => b.type === params.type)
    if (params?.status) result = result.filter((b) => b.status === params.status)
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getBill(id: string): Promise<Bill | null> {
    await delay(50)
    return bills.find((b) => b.id === id) || null
  }

  async createBill(data: Omit<Bill, "id" | "createdAt" | "updatedAt">): Promise<Bill> {
    await delay(150)
    const bill: Bill = { ...data, id: `bill-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    bills.unshift(bill)
    pushAuditLog({ actor: "System", role: "system", action: "CREATE", module: "FINANCE", recordType: "Bill", recordId: bill.id, newValue: `Bill created: GHS ${bill.amount}`, ipAddress: "127.0.0.1" })
    return bill
  }

  async updateBillStatus(id: string, status: BillStatus): Promise<Bill> {
    await delay(100)
    const idx = bills.findIndex((b) => b.id === id)
    if (idx === -1) throw new Error("Bill not found")
    const updates: Partial<Bill> = { status, updatedAt: new Date().toISOString() }
    if (status === "paid") updates.paidDate = new Date().toISOString()
    bills[idx] = { ...bills[idx], ...updates }
    pushAuditLog({ actor: "System", role: "system", action: "UPDATE", module: "FINANCE", recordType: "Bill", recordId: id, newValue: `Bill status: ${status}`, ipAddress: "127.0.0.1" })
    return bills[idx]
  }

  async getBillingStats(tenantId?: string): Promise<{ totalBills: number; paidBills: number; overdueBills: number; totalOutstanding: number }> {
    await delay(100)
    const filtered = tenantId ? bills.filter((b) => b.tenantId === tenantId) : bills
    return {
      totalBills: filtered.length,
      paidBills: filtered.filter((b) => b.status === "paid").length,
      overdueBills: filtered.filter((b) => b.status === "overdue" || b.status === "due").length,
      totalOutstanding: filtered.reduce((s, b) => s + (b.amount - b.paidAmount), 0),
    }
  }
}
