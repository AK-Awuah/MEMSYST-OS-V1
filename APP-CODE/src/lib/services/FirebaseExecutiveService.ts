import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, orderBy, Timestamp } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IExecutiveService } from "./IExecutiveService"
import type { ExecutivePosition, ExecutiveAppointment } from "@/types"

const POSITIONS_COL = "executivePositions"
const APPOINTMENTS_COL = "executiveAppointments"

function toPosition(id: string, data: Record<string, unknown>): ExecutivePosition {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    level: (data.level as ExecutivePosition["level"]) || "national",
    termLength: (data.termLength as number) || 0,
    description: (data.description as string) || "",
    status: (data.status as ExecutivePosition["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toAppointment(id: string, data: Record<string, unknown>): ExecutiveAppointment {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    executiveId: (data.executiveId as string) || "",
    positionId: (data.positionId as string) || "",
    level: (data.level as ExecutiveAppointment["level"]) || "national",
    unitId: (data.unitId as string) || "",
    startDate: (data.startDate as string) || "",
    endDate: (data.endDate as string) || "",
    status: (data.status as ExecutiveAppointment["status"]) || "active",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

export class FirebaseExecutiveService implements IExecutiveService {
  private db = getFirestoreDb()

  async listPositions(tenantId: string): Promise<ExecutivePosition[]> {
    const col = collection(this.db, POSITIONS_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "asc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toPosition(d.id, d.data() as Record<string, unknown>))
  }

  async createPosition(data: Omit<ExecutivePosition, "id" | "createdAt" | "updatedAt">): Promise<ExecutivePosition> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, POSITIONS_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async updatePosition(id: string, data: Partial<ExecutivePosition>): Promise<void> {
    const ref = doc(this.db, POSITIONS_COL, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async deactivatePosition(id: string): Promise<void> {
    const ref = doc(this.db, POSITIONS_COL, id)
    await updateDoc(ref, { status: "inactive", updatedAt: new Date().toISOString() })
  }

  async listAppointments(tenantId: string): Promise<ExecutiveAppointment[]> {
    const col = collection(this.db, APPOINTMENTS_COL)
    const q = query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toAppointment(d.id, d.data() as Record<string, unknown>))
  }

  async getAppointmentsByPosition(positionId: string): Promise<ExecutiveAppointment[]> {
    const col = collection(this.db, APPOINTMENTS_COL)
    const q = query(col, where("positionId", "==", positionId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => toAppointment(d.id, d.data() as Record<string, unknown>))
  }

  async createAppointment(data: Omit<ExecutiveAppointment, "id" | "createdAt" | "updatedAt">): Promise<ExecutiveAppointment> {
    const now = new Date().toISOString()
    const ref = await addDoc(collection(this.db, APPOINTMENTS_COL), { ...data, createdAt: now, updatedAt: now })
    return { id: ref.id, ...data, createdAt: now, updatedAt: now }
  }

  async updateAppointment(id: string, data: Partial<ExecutiveAppointment>): Promise<void> {
    const ref = doc(this.db, APPOINTMENTS_COL, id)
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
  }

  async endAppointment(id: string): Promise<void> {
    const ref = doc(this.db, APPOINTMENTS_COL, id)
    await updateDoc(ref, { status: "completed", updatedAt: new Date().toISOString() })
  }

  async renewAppointment(id: string, endDate: string): Promise<void> {
    const ref = doc(this.db, APPOINTMENTS_COL, id)
    await updateDoc(ref, { endDate, updatedAt: new Date().toISOString() })
  }
}
