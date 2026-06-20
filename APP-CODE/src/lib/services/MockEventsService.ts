import type { IEventsService } from "./IEventsService"
import type { Event, EventRegistration, EventCertificate, Workshop, EventsAnalytics, EventsAuditLog } from "@/types"
import { delay } from "./shared-store"

let eventIdCounter = 1
let registrationIdCounter = 1
let certificateIdCounter = 1
let workshopIdCounter = 1
let auditIdCounter = 1

const now = new Date()

const mockEventsData: Event[] = [
  {
    id: `evt-${eventIdCounter++}`,
    tenantId: "tenant-1",
    title: "Annual General Meeting 2026",
    description: "The yearly general meeting for all members.",
    eventType: "meeting",
    format: "in_person",
    startDate: new Date(now.getTime() + 30 * 86400000).toISOString(),
    endDate: new Date(now.getTime() + 31 * 86400000).toISOString(),
    timezone: "Africa/Accra",
    location: "Accra International Conference Centre",
    maxAttendees: 500,
    registeredCount: 0,
    attendedCount: 0,
    fee: 0,
    currency: "GHS",
    organizerId: "user-3",
    organizerName: "Yaw Mensah",
    speakers: [{ name: "Dr. Kwame Asante", title: "National President" }],
    agenda: [{ time: "09:00", title: "Opening Address" }],
    sponsors: [],
    tags: ["annual", "general-meeting"],
    status: "published",
    createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
  },
  {
    id: `evt-${eventIdCounter++}`,
    tenantId: "tenant-1",
    title: "Healthcare Innovation Summit",
    description: "Exploring the latest trends in healthcare technology.",
    eventType: "conference",
    format: "hybrid",
    startDate: new Date(now.getTime() + 60 * 86400000).toISOString(),
    endDate: new Date(now.getTime() + 62 * 86400000).toISOString(),
    timezone: "Africa/Accra",
    location: "Kumasi Cultural Centre",
    virtualLink: "https://zoom.us/j/example",
    maxAttendees: 300,
    registeredCount: 0,
    attendedCount: 0,
    fee: 50,
    currency: "GHS",
    organizerId: "user-2",
    organizerName: "Ama Osei",
    speakers: [],
    agenda: [],
    sponsors: ["Ghana Health Service", "WHO"],
    tags: ["healthcare", "innovation", "summit"],
    status: "open_for_registration",
    createdAt: new Date(now.getTime() - 15 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
  },
  {
    id: `evt-${eventIdCounter++}`,
    tenantId: "tenant-1",
    title: "CPD Workshop: Medical Ethics",
    description: "Continuing professional development session on medical ethics.",
    eventType: "workshop",
    format: "virtual",
    startDate: new Date(now.getTime() - 5 * 86400000).toISOString(),
    endDate: new Date(now.getTime() - 5 * 86400000 + 4 * 3600000).toISOString(),
    timezone: "Africa/Accra",
    virtualLink: "https://meet.google.com/example",
    maxAttendees: 100,
    registeredCount: 45,
    attendedCount: 38,
    fee: 25,
    currency: "GHS",
    organizerId: "user-2",
    organizerName: "Ama Osei",
    speakers: [{ name: "Prof. Asare", title: "Ethics Chair" }],
    agenda: [{ time: "10:00", title: "Introduction to Medical Ethics", speaker: "Prof. Asare" }],
    sponsors: [],
    tags: ["cpd", "ethics", "workshop"],
    status: "completed",
    createdAt: new Date(now.getTime() - 30 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
  },
]

const mockRegistrationsData: EventRegistration[] = [
  {
    id: `reg-${registrationIdCounter++}`,
    eventId: mockEventsData[2].id,
    tenantId: "tenant-1",
    memberId: "mem-1",
    memberName: "Kofi Ansah",
    registrationDate: new Date(now.getTime() - 10 * 86400000).toISOString(),
    status: "attended",
    amountPaid: 25,
    certificateIssued: true,
    checkedInAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
  },
  {
    id: `reg-${registrationIdCounter++}`,
    eventId: mockEventsData[2].id,
    tenantId: "tenant-1",
    memberId: "mem-2",
    memberName: "Akua Serwaa",
    registrationDate: new Date(now.getTime() - 8 * 86400000).toISOString(),
    status: "attended",
    amountPaid: 25,
    certificateIssued: true,
    checkedInAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    createdAt: new Date(now.getTime() - 8 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
  },
  {
    id: `reg-${registrationIdCounter++}`,
    eventId: mockEventsData[1].id,
    tenantId: "tenant-1",
    memberId: "mem-1",
    memberName: "Kofi Ansah",
    registrationDate: new Date().toISOString(),
    status: "registered",
    amountPaid: 50,
    certificateIssued: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockCertificatesData: EventCertificate[] = [
  {
    id: `cert-${certificateIdCounter++}`,
    eventId: mockEventsData[2].id,
    tenantId: "tenant-1",
    registrationId: mockRegistrationsData[0].id,
    memberId: "mem-1",
    memberName: "Kofi Ansah",
    issuedAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
    certificateUrl: "/certificates/cpd-ethics-kofi-ansah.pdf",
    status: "issued",
    createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
  },
  {
    id: `cert-${certificateIdCounter++}`,
    eventId: mockEventsData[2].id,
    tenantId: "tenant-1",
    registrationId: mockRegistrationsData[1].id,
    memberId: "mem-2",
    memberName: "Akua Serwaa",
    issuedAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
    certificateUrl: "/certificates/cpd-ethics-akua-mensah.pdf",
    status: "downloaded",
    createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
  },
]

const mockWorkshopsData: Workshop[] = [
  {
    id: `ws-${workshopIdCounter++}`,
    tenantId: "tenant-1",
    title: "Leadership Development Workshop",
    description: "Building effective leadership skills for branch executives.",
    facilitatorId: "user-3",
    facilitatorName: "Yaw Mensah",
    maxParticipants: 30,
    registeredCount: 22,
    duration: "2 days",
    materials: ["Leadership Guide.pdf", "Workbook.pdf"],
    prerequisites: ["Must be a branch executive"],
    status: "scheduled",
    startDate: new Date(now.getTime() + 45 * 86400000).toISOString(),
    endDate: new Date(now.getTime() + 46 * 86400000).toISOString(),
    location: "GMA National Secretariat",
    createdAt: new Date(now.getTime() - 20 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
  },
  {
    id: `ws-${workshopIdCounter++}`,
    tenantId: "tenant-1",
    title: "Financial Management for Treasurers",
    description: "Training for branch and regional treasurers on financial best practices.",
    facilitatorId: "user-2",
    facilitatorName: "Ama Osei",
    maxParticipants: 25,
    registeredCount: 25,
    duration: "1 day",
    materials: ["Finance Handbook.pdf"],
    prerequisites: [],
    status: "completed",
    startDate: new Date(now.getTime() - 15 * 86400000).toISOString(),
    endDate: new Date(now.getTime() - 15 * 86400000).toISOString(),
    location: "Accra Regional Office",
    createdAt: new Date(now.getTime() - 40 * 86400000).toISOString(),
    updatedAt: new Date(now.getTime() - 15 * 86400000).toISOString(),
  },
]

const mockAuditLogsData: EventsAuditLog[] = [
  {
    id: `ealog-${auditIdCounter++}`,
    tenantId: "tenant-1",
    actor: "Yaw Mensah",
    action: "event_created",
    recordType: "Event",
    recordId: mockEventsData[0].id,
    newValue: "Created event: Annual General Meeting 2026",
    createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
  },
  {
    id: `ealog-${auditIdCounter++}`,
    tenantId: "tenant-1",
    actor: "Ama Osei",
    action: "event_created",
    recordType: "Event",
    recordId: mockEventsData[1].id,
    newValue: "Created event: Healthcare Innovation Summit",
    createdAt: new Date(now.getTime() - 15 * 86400000).toISOString(),
  },
  {
    id: `ealog-${auditIdCounter++}`,
    tenantId: "tenant-1",
    actor: "Ama Osei",
    action: "event_published",
    recordType: "Event",
    recordId: mockEventsData[1].id,
    previousValue: "draft",
    newValue: "published",
    createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
  },
]

let events = [...mockEventsData]
let registrations = [...mockRegistrationsData]
let certificates = [...mockCertificatesData]
let workshops = [...mockWorkshopsData]
let auditLogs = [...mockAuditLogsData]

export class MockEventsService implements IEventsService {
  async listEvents(tenantId: string, params?: { status?: string; eventType?: string; format?: string; search?: string }): Promise<Event[]> {
    await delay(200)
    let result = events.filter((e) => e.tenantId === tenantId)
    if (params?.status && params.status !== "all") result = result.filter((e) => e.status === params.status)
    if (params?.eventType && params.eventType !== "all") result = result.filter((e) => e.eventType === params.eventType)
    if (params?.format && params.format !== "all") result = result.filter((e) => e.format === params.format)
    if (params?.search) {
      const s = params.search.toLowerCase()
      result = result.filter((e) => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s))
    }
    return result
  }

  async getEvent(id: string): Promise<Event | null> {
    await delay(100)
    return events.find((e) => e.id === id) || null
  }

  async createEvent(data: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    await delay(200)
    const event: Event = {
      ...data,
      id: `evt-${eventIdCounter++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    events.push(event)
    return event
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<void> {
    await delay(150)
    const idx = events.findIndex((e) => e.id === id)
    if (idx !== -1) events[idx] = { ...events[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async publishEvent(id: string): Promise<void> {
    await delay(150)
    const idx = events.findIndex((e) => e.id === id)
    if (idx !== -1) events[idx] = { ...events[idx], status: "published", updatedAt: new Date().toISOString() }
  }

  async cancelEvent(id: string): Promise<void> {
    await delay(150)
    const idx = events.findIndex((e) => e.id === id)
    if (idx !== -1) events[idx] = { ...events[idx], status: "cancelled", updatedAt: new Date().toISOString() }
  }

  async listRegistrations(eventId: string, tenantId: string): Promise<EventRegistration[]> {
    await delay(200)
    return registrations.filter((r) => r.eventId === eventId && r.tenantId === tenantId)
  }

  async getRegistration(id: string): Promise<EventRegistration | null> {
    await delay(100)
    return registrations.find((r) => r.id === id) || null
  }

  async createRegistration(data: Omit<EventRegistration, "id" | "createdAt" | "updatedAt">): Promise<EventRegistration> {
    await delay(200)
    const registration: EventRegistration = {
      ...data,
      id: `reg-${registrationIdCounter++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    registrations.push(registration)
    const evtIdx = events.findIndex((e) => e.id === data.eventId)
    if (evtIdx !== -1) events[evtIdx] = { ...events[evtIdx], registeredCount: events[evtIdx].registeredCount + 1, updatedAt: new Date().toISOString() }
    return registration
  }

  async confirmRegistration(id: string): Promise<void> {
    await delay(150)
    const idx = registrations.findIndex((r) => r.id === id)
    if (idx !== -1) registrations[idx] = { ...registrations[idx], status: "confirmed", updatedAt: new Date().toISOString() }
  }

  async cancelRegistration(id: string): Promise<void> {
    await delay(150)
    const idx = registrations.findIndex((r) => r.id === id)
    if (idx !== -1) {
      const reg = registrations[idx]
      registrations[idx] = { ...reg, status: "cancelled", updatedAt: new Date().toISOString() }
      const evtIdx = events.findIndex((e) => e.id === reg.eventId)
      if (evtIdx !== -1) events[evtIdx] = { ...events[evtIdx], registeredCount: Math.max(0, events[evtIdx].registeredCount - 1), updatedAt: new Date().toISOString() }
    }
  }

  async recordAttendance(id: string): Promise<void> {
    await delay(150)
    const idx = registrations.findIndex((r) => r.id === id)
    if (idx !== -1) {
      const reg = registrations[idx]
      registrations[idx] = { ...reg, status: "attended", checkedInAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      const evtIdx = events.findIndex((e) => e.id === reg.eventId)
      if (evtIdx !== -1) events[evtIdx] = { ...events[evtIdx], attendedCount: events[evtIdx].attendedCount + 1, updatedAt: new Date().toISOString() }
    }
  }

  async issueCertificate(data: Omit<EventCertificate, "id" | "createdAt">): Promise<EventCertificate> {
    await delay(200)
    const cert: EventCertificate = {
      ...data,
      id: `cert-${certificateIdCounter++}`,
      createdAt: new Date().toISOString(),
    }
    certificates.push(cert)
    const regIdx = registrations.findIndex((r) => r.id === data.registrationId)
    if (regIdx !== -1) registrations[regIdx] = { ...registrations[regIdx], certificateIssued: true, updatedAt: new Date().toISOString() }
    return cert
  }

  async listCertificates(eventId: string, tenantId: string): Promise<EventCertificate[]> {
    await delay(200)
    return certificates.filter((c) => c.eventId === eventId && c.tenantId === tenantId)
  }

  async listWorkshops(tenantId: string, params?: { status?: string; search?: string }): Promise<Workshop[]> {
    await delay(200)
    let result = workshops.filter((w) => w.tenantId === tenantId)
    if (params?.status && params.status !== "all") result = result.filter((w) => w.status === params.status)
    if (params?.search) {
      const s = params.search.toLowerCase()
      result = result.filter((w) => w.title.toLowerCase().includes(s) || w.description.toLowerCase().includes(s))
    }
    return result
  }

  async getWorkshop(id: string): Promise<Workshop | null> {
    await delay(100)
    return workshops.find((w) => w.id === id) || null
  }

  async createWorkshop(data: Omit<Workshop, "id" | "createdAt" | "updatedAt">): Promise<Workshop> {
    await delay(200)
    const workshop: Workshop = {
      ...data,
      id: `ws-${workshopIdCounter++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    workshops.push(workshop)
    return workshop
  }

  async updateWorkshop(id: string, data: Partial<Workshop>): Promise<void> {
    await delay(150)
    const idx = workshops.findIndex((w) => w.id === id)
    if (idx !== -1) workshops[idx] = { ...workshops[idx], ...data, updatedAt: new Date().toISOString() }
  }

  async getAnalytics(tenantId: string): Promise<EventsAnalytics> {
    await delay(200)
    const tenantEvents = events.filter((e) => e.tenantId === tenantId)
    const tenantRegistrations = registrations.filter((r) => r.tenantId === tenantId)
    const now = new Date().toISOString()
    const upcoming = tenantEvents.filter((e) => e.startDate > now && e.status !== "cancelled" && e.status !== "completed")
    const completed = tenantEvents.filter((e) => e.status === "completed" || e.endDate < now)
    const attended = tenantRegistrations.filter((r) => r.status === "attended").length
    const byType = tenantEvents.reduce<{ type: string; count: number }[]>((acc, e) => {
      const existing = acc.find((a) => a.type === e.eventType)
      if (existing) existing.count++
      else acc.push({ type: e.eventType, count: 1 })
      return acc
    }, [])
    const byStatus = tenantEvents.reduce<{ status: string; count: number }[]>((acc, e) => {
      const existing = acc.find((a) => a.status === e.status)
      if (existing) existing.count++
      else acc.push({ status: e.status, count: 1 })
      return acc
    }, [])
    return {
      totalEvents: tenantEvents.length,
      upcomingEvents: upcoming.length,
      completedEvents: completed.length,
      totalRegistrations: tenantRegistrations.length,
      totalAttendance: attended,
      attendanceRate: tenantRegistrations.length > 0 ? Math.round((attended / tenantRegistrations.length) * 100) : 0,
      totalRevenue: tenantEvents.reduce((sum, e) => sum + e.fee * e.registeredCount, 0),
      byType,
      byStatus,
      upcomingEventsList: upcoming.map((e) => ({ id: e.id, title: e.title, date: e.startDate, registrations: e.registeredCount })),
    }
  }

  async getAuditLogs(tenantId: string): Promise<EventsAuditLog[]> {
    await delay(200)
    return auditLogs.filter((l) => l.tenantId === tenantId)
  }
}
