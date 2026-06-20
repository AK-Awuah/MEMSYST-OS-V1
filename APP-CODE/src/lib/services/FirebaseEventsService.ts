import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc, deleteDoc, Timestamp, increment } from "firebase/firestore"
import { getFirestoreDb } from "@/lib/firebase/client"
import type { IEventsService } from "./IEventsService"
import type { Event, EventRegistration, EventCertificate, Workshop, EventsAnalytics, EventsAuditLog } from "@/types"

const EVENTS_COLLECTION = "events"
const REGISTRATIONS_COLLECTION = "eventRegistrations"
const CERTIFICATES_COLLECTION = "eventCertificates"
const WORKSHOPS_COLLECTION = "workshops"
const AUDIT_LOGS_COLLECTION = "eventsAuditLogs"

function toEvent(id: string, data: Record<string, unknown>): Event {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    eventType: (data.eventType as Event["eventType"]) || "conference",
    format: (data.format as Event["format"]) || "in_person",
    startDate: (data.startDate as string) || "",
    endDate: (data.endDate as string) || "",
    timezone: (data.timezone as string) || "",
    location: data.location as string | undefined,
    virtualLink: data.virtualLink as string | undefined,
    maxAttendees: (data.maxAttendees as number) || 0,
    registeredCount: (data.registeredCount as number) || 0,
    attendedCount: (data.attendedCount as number) || 0,
    registrationDeadline: data.registrationDeadline as string | undefined,
    fee: (data.fee as number) || 0,
    currency: (data.currency as string) || "",
    organizerId: (data.organizerId as string) || "",
    organizerName: (data.organizerName as string) || "",
    speakers: (data.speakers as Event["speakers"]) || [],
    agenda: (data.agenda as Event["agenda"]) || [],
    sponsors: (data.sponsors as string[]) || [],
    coverImage: data.coverImage as string | undefined,
    tags: (data.tags as string[]) || [],
    status: (data.status as Event["status"]) || "draft",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toRegistration(id: string, data: Record<string, unknown>): EventRegistration {
  return {
    id,
    eventId: (data.eventId as string) || "",
    tenantId: (data.tenantId as string) || "",
    memberId: (data.memberId as string) || "",
    memberName: (data.memberName as string) || "",
    registrationDate: (data.registrationDate as string) || "",
    status: (data.status as EventRegistration["status"]) || "registered",
    ticketType: data.ticketType as string | undefined,
    amountPaid: (data.amountPaid as number) || 0,
    checkedInAt: data.checkedInAt as string | undefined,
    certificateIssued: (data.certificateIssued as boolean) || false,
    notes: data.notes as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toCertificate(id: string, data: Record<string, unknown>): EventCertificate {
  return {
    id,
    eventId: (data.eventId as string) || "",
    tenantId: (data.tenantId as string) || "",
    registrationId: (data.registrationId as string) || "",
    memberId: (data.memberId as string) || "",
    memberName: (data.memberName as string) || "",
    issuedAt: (data.issuedAt as string) || "",
    certificateUrl: data.certificateUrl as string | undefined,
    status: (data.status as EventCertificate["status"]) || "issued",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

function toWorkshop(id: string, data: Record<string, unknown>): Workshop {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    facilitatorId: (data.facilitatorId as string) || "",
    facilitatorName: (data.facilitatorName as string) || "",
    maxParticipants: (data.maxParticipants as number) || 0,
    registeredCount: (data.registeredCount as number) || 0,
    duration: (data.duration as string) || "",
    materials: (data.materials as string[]) || [],
    prerequisites: (data.prerequisites as string[]) || [],
    status: (data.status as Workshop["status"]) || "draft",
    startDate: (data.startDate as string) || "",
    endDate: data.endDate as string | undefined,
    location: data.location as string | undefined,
    virtualLink: data.virtualLink as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt as string) || "",
  }
}

function toAuditLog(id: string, data: Record<string, unknown>): EventsAuditLog {
  return {
    id,
    tenantId: (data.tenantId as string) || "",
    actor: (data.actor as string) || "",
    action: (data.action as EventsAuditLog["action"]) || "event_created",
    recordType: (data.recordType as string) || "",
    recordId: (data.recordId as string) || "",
    previousValue: data.previousValue as string | undefined,
    newValue: data.newValue as string | undefined,
    details: data.details as string | undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt as string) || "",
  }
}

export class FirebaseEventsService implements IEventsService {
  private db = getFirestoreDb()

  async listEvents(tenantId: string, params?: { status?: string; eventType?: string; format?: string; search?: string }): Promise<Event[]> {
    const col = collection(this.db, EVENTS_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("startDate", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    if (params?.eventType && params.eventType !== "all") constraints.unshift(where("eventType", "==", params.eventType))
    if (params?.format && params.format !== "all") constraints.unshift(where("format", "==", params.format))
    const snap = await getDocs(query(col, ...constraints))
    let events = snap.docs.map((d) => toEvent(d.id, d.data() as Record<string, unknown>))
    if (params?.search) {
      const s = params.search.toLowerCase()
      events = events.filter((e) => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s))
    }
    return events
  }

  async getEvent(id: string): Promise<Event | null> {
    const snap = await getDoc(doc(this.db, EVENTS_COLLECTION, id))
    if (!snap.exists()) return null
    return toEvent(snap.id, snap.data() as Record<string, unknown>)
  }

  async createEvent(data: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    const ref = await addDoc(collection(this.db, EVENTS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getEvent(ref.id) as Promise<Event>
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<void> {
    await updateDoc(doc(this.db, EVENTS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async publishEvent(id: string): Promise<void> {
    await updateDoc(doc(this.db, EVENTS_COLLECTION, id), { status: "published", updatedAt: new Date().toISOString() })
  }

  async cancelEvent(id: string): Promise<void> {
    await updateDoc(doc(this.db, EVENTS_COLLECTION, id), { status: "cancelled", updatedAt: new Date().toISOString() })
  }

  async listRegistrations(eventId: string, tenantId: string): Promise<EventRegistration[]> {
    const col = collection(this.db, REGISTRATIONS_COLLECTION)
    const snap = await getDocs(query(col, where("eventId", "==", eventId), where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toRegistration(d.id, d.data() as Record<string, unknown>))
  }

  async getRegistration(id: string): Promise<EventRegistration | null> {
    const snap = await getDoc(doc(this.db, REGISTRATIONS_COLLECTION, id))
    if (!snap.exists()) return null
    return toRegistration(snap.id, snap.data() as Record<string, unknown>)
  }

  async createRegistration(data: Omit<EventRegistration, "id" | "createdAt" | "updatedAt">): Promise<EventRegistration> {
    const ref = await addDoc(collection(this.db, REGISTRATIONS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    await updateDoc(doc(this.db, EVENTS_COLLECTION, data.eventId), { registeredCount: increment(1), updatedAt: new Date().toISOString() })
    return this.getRegistration(ref.id) as Promise<EventRegistration>
  }

  async confirmRegistration(id: string): Promise<void> {
    await updateDoc(doc(this.db, REGISTRATIONS_COLLECTION, id), { status: "confirmed", updatedAt: new Date().toISOString() })
  }

  async cancelRegistration(id: string): Promise<void> {
    const reg = await this.getRegistration(id)
    if (reg) {
      await updateDoc(doc(this.db, REGISTRATIONS_COLLECTION, id), { status: "cancelled", updatedAt: new Date().toISOString() })
      await updateDoc(doc(this.db, EVENTS_COLLECTION, reg.eventId), { registeredCount: increment(-1), updatedAt: new Date().toISOString() })
    }
  }

  async recordAttendance(id: string): Promise<void> {
    const reg = await this.getRegistration(id)
    if (reg) {
      await updateDoc(doc(this.db, REGISTRATIONS_COLLECTION, id), { status: "attended", checkedInAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      await updateDoc(doc(this.db, EVENTS_COLLECTION, reg.eventId), { attendedCount: increment(1), updatedAt: new Date().toISOString() })
    }
  }

  async issueCertificate(data: Omit<EventCertificate, "id" | "createdAt">): Promise<EventCertificate> {
    const ref = await addDoc(collection(this.db, CERTIFICATES_COLLECTION), { ...data, createdAt: new Date().toISOString() })
    const snap = await getDoc(ref)
    return toCertificate(snap.id, snap.data() as Record<string, unknown>)
  }

  async listCertificates(eventId: string, tenantId: string): Promise<EventCertificate[]> {
    const col = collection(this.db, CERTIFICATES_COLLECTION)
    const snap = await getDocs(query(col, where("eventId", "==", eventId), where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toCertificate(d.id, d.data() as Record<string, unknown>))
  }

  async listWorkshops(tenantId: string, params?: { status?: string; search?: string }): Promise<Workshop[]> {
    const col = collection(this.db, WORKSHOPS_COLLECTION)
    const constraints = [where("tenantId", "==", tenantId), orderBy("startDate", "desc")]
    if (params?.status && params.status !== "all") constraints.unshift(where("status", "==", params.status))
    const snap = await getDocs(query(col, ...constraints))
    let workshops = snap.docs.map((d) => toWorkshop(d.id, d.data() as Record<string, unknown>))
    if (params?.search) {
      const s = params.search.toLowerCase()
      workshops = workshops.filter((w) => w.title.toLowerCase().includes(s) || w.description.toLowerCase().includes(s))
    }
    return workshops
  }

  async getWorkshop(id: string): Promise<Workshop | null> {
    const snap = await getDoc(doc(this.db, WORKSHOPS_COLLECTION, id))
    if (!snap.exists()) return null
    return toWorkshop(snap.id, snap.data() as Record<string, unknown>)
  }

  async createWorkshop(data: Omit<Workshop, "id" | "createdAt" | "updatedAt">): Promise<Workshop> {
    const ref = await addDoc(collection(this.db, WORKSHOPS_COLLECTION), { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    return this.getWorkshop(ref.id) as Promise<Workshop>
  }

  async updateWorkshop(id: string, data: Partial<Workshop>): Promise<void> {
    await updateDoc(doc(this.db, WORKSHOPS_COLLECTION, id), { ...data, updatedAt: new Date().toISOString() })
  }

  async getAnalytics(tenantId: string): Promise<EventsAnalytics> {
    const events = await this.listEvents(tenantId)
    const registrationsCol = collection(this.db, REGISTRATIONS_COLLECTION)
    const regSnap = await getDocs(query(registrationsCol, where("tenantId", "==", tenantId)))
    const totalRegistrations = regSnap.size
    const attended = regSnap.docs.filter((d) => d.data().status === "attended").length
    const now = new Date().toISOString()
    const upcoming = events.filter((e) => e.startDate > now && e.status !== "cancelled" && e.status !== "completed")
    const completed = events.filter((e) => e.status === "completed" || e.endDate < now)
    const byType = events.reduce<{ type: string; count: number }[]>((acc, e) => {
      const existing = acc.find((a) => a.type === e.eventType)
      if (existing) existing.count++
      else acc.push({ type: e.eventType, count: 1 })
      return acc
    }, [])
    const byStatus = events.reduce<{ status: string; count: number }[]>((acc, e) => {
      const existing = acc.find((a) => a.status === e.status)
      if (existing) existing.count++
      else acc.push({ status: e.status, count: 1 })
      return acc
    }, [])
    return {
      totalEvents: events.length,
      upcomingEvents: upcoming.length,
      completedEvents: completed.length,
      totalRegistrations,
      totalAttendance: attended,
      attendanceRate: totalRegistrations > 0 ? Math.round((attended / totalRegistrations) * 100) : 0,
      totalRevenue: events.reduce((sum, e) => sum + e.fee * e.registeredCount, 0),
      byType,
      byStatus,
      upcomingEventsList: upcoming.map((e) => ({ id: e.id, title: e.title, date: e.startDate, registrations: e.registeredCount })),
    }
  }

  async getAuditLogs(tenantId: string): Promise<EventsAuditLog[]> {
    const col = collection(this.db, AUDIT_LOGS_COLLECTION)
    const snap = await getDocs(query(col, where("tenantId", "==", tenantId), orderBy("createdAt", "desc")))
    return snap.docs.map((d) => toAuditLog(d.id, d.data() as Record<string, unknown>))
  }
}


