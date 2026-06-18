import type { IIDCardService } from "./IIDCardService"
import type { IDCard, IDCardStatus } from "@/types"
import { mockIDCards } from "./mock-data"
import { delay } from "./shared-store"

export class MockIDCardService implements IIDCardService {
  private items = [...mockIDCards]

  async listIDCards(tenantId: string, params?: { status?: IDCardStatus; ownerType?: string }): Promise<IDCard[]> {
    await delay(200)
    let result = this.items.filter((c) => c.tenantId === tenantId)
    if (params?.status) result = result.filter((c) => c.status === params.status)
    if (params?.ownerType) result = result.filter((c) => c.ownerType === params.ownerType)
    return result
  }

  async getIDCard(id: string): Promise<IDCard | null> {
    await delay(100)
    return this.items.find((c) => c.id === id) || null
  }

  async createIDCard(data: Omit<IDCard, "id" | "createdAt" | "updatedAt">): Promise<IDCard> {
    await delay(200)
    const card: IDCard = { ...data, id: `idc-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    this.items.push(card)
    return card
  }

  async updateIDCard(id: string, data: Partial<IDCard>): Promise<IDCard> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("ID card not found")
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async updateIDCardStatus(id: string, status: IDCardStatus, reason?: string): Promise<IDCard> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("ID card not found")
    this.items[idx] = { ...this.items[idx], status, updatedAt: new Date().toISOString() }
    return this.items[idx]
  }

  async cancelIDCard(id: string, reason: string, cancelledBy: string): Promise<IDCard> {
    await delay(150)
    const idx = this.items.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("ID card not found")
    this.items[idx] = {
      ...this.items[idx],
      status: "cancelled",
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return this.items[idx]
  }

  async getIDCardsByOwner(ownerId: string, ownerType: string): Promise<IDCard[]> {
    await delay(100)
    return this.items.filter((c) => c.ownerId === ownerId && c.ownerType === ownerType)
  }
}
