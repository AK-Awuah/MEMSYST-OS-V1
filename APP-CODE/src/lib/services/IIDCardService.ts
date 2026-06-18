import type { IDCard, IDCardStatus } from "@/types"

export interface IIDCardService {
  listIDCards(tenantId: string, params?: { status?: IDCardStatus; ownerType?: string }): Promise<IDCard[]>
  getIDCard(id: string): Promise<IDCard | null>
  createIDCard(data: Omit<IDCard, "id" | "createdAt" | "updatedAt">): Promise<IDCard>
  updateIDCard(id: string, data: Partial<IDCard>): Promise<IDCard>
  updateIDCardStatus(id: string, status: IDCardStatus, reason?: string): Promise<IDCard>
  cancelIDCard(id: string, reason: string, cancelledBy: string): Promise<IDCard>
  getIDCardsByOwner(ownerId: string, ownerType: string): Promise<IDCard[]>
}
