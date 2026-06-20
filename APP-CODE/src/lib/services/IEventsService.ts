import type { Event, EventRegistration, EventCertificate, Workshop, EventsAnalytics, EventsAuditLog } from "@/types"

export interface IEventsService {
  listEvents(tenantId: string, params?: { status?: string; eventType?: string; format?: string; search?: string }): Promise<Event[]>
  getEvent(id: string): Promise<Event | null>
  createEvent(data: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event>
  updateEvent(id: string, data: Partial<Event>): Promise<void>
  publishEvent(id: string): Promise<void>
  cancelEvent(id: string): Promise<void>

  listRegistrations(eventId: string, tenantId: string): Promise<EventRegistration[]>
  getRegistration(id: string): Promise<EventRegistration | null>
  createRegistration(data: Omit<EventRegistration, "id" | "createdAt" | "updatedAt">): Promise<EventRegistration>
  confirmRegistration(id: string): Promise<void>
  cancelRegistration(id: string): Promise<void>
  recordAttendance(id: string): Promise<void>

  issueCertificate(data: Omit<EventCertificate, "id" | "createdAt">): Promise<EventCertificate>
  listCertificates(eventId: string, tenantId: string): Promise<EventCertificate[]>

  listWorkshops(tenantId: string, params?: { status?: string; search?: string }): Promise<Workshop[]>
  getWorkshop(id: string): Promise<Workshop | null>
  createWorkshop(data: Omit<Workshop, "id" | "createdAt" | "updatedAt">): Promise<Workshop>
  updateWorkshop(id: string, data: Partial<Workshop>): Promise<void>

  getAnalytics(tenantId: string): Promise<EventsAnalytics>
  getAuditLogs(tenantId: string): Promise<EventsAuditLog[]>
}
