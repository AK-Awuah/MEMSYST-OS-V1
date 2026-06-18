import type { PrintRequest, PrintRequestStatus } from "@/types"

export interface IPrintingService {
  listPrintRequests(tenantId: string, params?: { status?: PrintRequestStatus; credentialType?: string }): Promise<PrintRequest[]>
  getPrintRequest(id: string): Promise<PrintRequest | null>
  createPrintRequest(data: Omit<PrintRequest, "id" | "createdAt" | "updatedAt">): Promise<PrintRequest>
  updatePrintRequestStatus(id: string, status: PrintRequestStatus): Promise<PrintRequest>
  approvePrintRequest(id: string): Promise<PrintRequest>
  completePrintRequest(id: string): Promise<PrintRequest>
  getPrintQueue(tenantId: string): Promise<PrintRequest[]>
}
