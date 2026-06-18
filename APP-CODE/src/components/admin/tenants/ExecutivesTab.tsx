"use client"

import type { Tenant, ExecutivePosition, ExecutiveAppointment } from "@/types"
import { useState, useEffect } from "react"
import { getExecutiveService } from "@/lib/services"
import { Loader2, Plus, X, BadgeCheck, Clock, Ban } from "lucide-react"

export function ExecutivesTab({ tenant }: { tenant: Tenant }) {
  const [positions, setPositions] = useState<ExecutivePosition[]>([])
  const [appointments, setAppointments] = useState<ExecutiveAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [subTab, setSubTab] = useState<"positions" | "appointments">("positions")
  const [showPositionForm, setShowPositionForm] = useState(false)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [posForm, setPosForm] = useState({ title: "", level: "national" as const, termLength: 24, description: "" })
  const [apptForm, setApptForm] = useState({ executiveId: "", positionId: "", level: "national" as const, unitId: "", startDate: "", endDate: "" })

  useEffect(() => {
    loadData()
  }, [tenant.id])

  async function loadData() {
    const svc = await getExecutiveService()
    const [p, a] = await Promise.all([svc.listPositions(tenant.id), svc.listAppointments(tenant.id)])
    setPositions(p)
    setAppointments(a)
    setLoading(false)
  }

  async function handleCreatePosition() {
    if (!posForm.title) return
    const svc = await getExecutiveService()
    await svc.createPosition({ tenantId: tenant.id, ...posForm, status: "active" })
    setPosForm({ title: "", level: "national", termLength: 24, description: "" })
    setShowPositionForm(false)
    loadData()
  }

  async function handleDeactivatePosition(id: string) {
    const svc = await getExecutiveService()
    await svc.deactivatePosition(id)
    loadData()
  }

  async function handleCreateAppointment() {
    if (!apptForm.executiveId || !apptForm.positionId || !apptForm.startDate || !apptForm.endDate) return
    const svc = await getExecutiveService()
    await svc.createAppointment({
      tenantId: tenant.id,
      ...apptForm,
      status: "active",
    })
    setApptForm({ executiveId: "", positionId: "", level: "national", unitId: "", startDate: "", endDate: "" })
    setShowAppointmentForm(false)
    loadData()
  }

  async function handleEndAppointment(id: string) {
    const svc = await getExecutiveService()
    await svc.endAppointment(id)
    loadData()
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-[#1e3a5f]">
        <button onClick={() => setSubTab("positions")} className={`pb-2 text-sm font-medium ${subTab === "positions" ? "border-b-2 border-[#3CA4F9] text-[#3CA4F9]" : "text-gray-500 hover:text-gray-300"}`}>
          Positions ({positions.length})
        </button>
        <button onClick={() => setSubTab("appointments")} className={`pb-2 text-sm font-medium ${subTab === "appointments" ? "border-b-2 border-[#3CA4F9] text-[#3CA4F9]" : "text-gray-500 hover:text-gray-300"}`}>
          Appointments ({appointments.length})
        </button>
      </div>

      {subTab === "positions" && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Executive Positions</h3>
            <button onClick={() => setShowPositionForm(!showPositionForm)}
              className="flex items-center gap-1 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]"
            >
              <Plus className="h-3 w-3" /> Add Position
            </button>
          </div>

          {showPositionForm && (
            <div className="mb-4 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="form-label text-xs">Title</label>
                  <input value={posForm.title} onChange={(e) => setPosForm((f) => ({ ...f, title: e.target.value }))} className="form-input text-sm" placeholder="e.g. President" />
                </div>
                <div>
                  <label className="form-label text-xs">Level</label>
                  <select value={posForm.level} onChange={(e) => setPosForm((f) => ({ ...f, level: e.target.value as any }))} className="form-input text-sm">
                    <option value="national">National</option>
                    <option value="regional">Regional</option>
                    <option value="branch">Branch</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Term Length (months)</label>
                  <input type="number" value={posForm.termLength} onChange={(e) => setPosForm((f) => ({ ...f, termLength: parseInt(e.target.value) || 0 }))} className="form-input text-sm" />
                </div>
              </div>
              <div className="mt-3">
                <label className="form-label text-xs">Description</label>
                <textarea value={posForm.description} onChange={(e) => setPosForm((f) => ({ ...f, description: e.target.value }))} className="form-input text-sm min-h-[60px]" rows={2} />
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={handleCreatePosition} disabled={!posForm.title} className="rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Create</button>
                <button onClick={() => setShowPositionForm(false)} className="rounded-lg border border-[#1e3a5f] px-3 py-1.5 text-xs text-gray-400">Cancel</button>
              </div>
            </div>
          )}

          {positions.length === 0 ? (
            <p className="text-sm text-gray-500">No executive positions defined.</p>
          ) : (
            <div className="space-y-2">
              {positions.map((pos) => (
                <div key={pos.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="h-4 w-4 text-[#3CA4F9]" />
                    <div>
                      <span className="text-sm font-medium text-white">{pos.title}</span>
                      <span className="ml-2 rounded bg-[#1e3a5f] px-1.5 py-0.5 text-xs text-gray-400 capitalize">{pos.level}</span>
                      <span className="ml-2 text-xs text-gray-600">{pos.termLength}mo term</span>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${pos.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>{pos.status}</span>
                  </div>
                  {pos.status === "active" && (
                    <button onClick={() => handleDeactivatePosition(pos.id)} className="text-xs text-red-400 hover:text-red-300">Deactivate</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === "appointments" && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Executive Appointments</h3>
            <button onClick={() => setShowAppointmentForm(!showAppointmentForm)}
              className="flex items-center gap-1 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]"
            >
              <Plus className="h-3 w-3" /> Add Appointment
            </button>
          </div>

          {showAppointmentForm && (
            <div className="mb-4 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="form-label text-xs">Executive ID</label>
                  <input value={apptForm.executiveId} onChange={(e) => setApptForm((f) => ({ ...f, executiveId: e.target.value }))} className="form-input text-sm" placeholder="User ID" />
                </div>
                <div>
                  <label className="form-label text-xs">Position</label>
                  <select value={apptForm.positionId} onChange={(e) => setApptForm((f) => ({ ...f, positionId: e.target.value }))} className="form-input text-sm">
                    <option value="">Select...</option>
                    {positions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Level</label>
                  <select value={apptForm.level} onChange={(e) => setApptForm((f) => ({ ...f, level: e.target.value as any }))} className="form-input text-sm">
                    <option value="national">National</option>
                    <option value="regional">Regional</option>
                    <option value="branch">Branch</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Unit ID</label>
                  <input value={apptForm.unitId} onChange={(e) => setApptForm((f) => ({ ...f, unitId: e.target.value }))} className="form-input text-sm" placeholder="Org unit ID" />
                </div>
                <div>
                  <label className="form-label text-xs">Start Date</label>
                  <input type="date" value={apptForm.startDate} onChange={(e) => setApptForm((f) => ({ ...f, startDate: e.target.value }))} className="form-input text-sm" />
                </div>
                <div>
                  <label className="form-label text-xs">End Date</label>
                  <input type="date" value={apptForm.endDate} onChange={(e) => setApptForm((f) => ({ ...f, endDate: e.target.value }))} className="form-input text-sm" />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={handleCreateAppointment} disabled={!apptForm.executiveId || !apptForm.positionId || !apptForm.startDate || !apptForm.endDate} className="rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Create</button>
                <button onClick={() => setShowAppointmentForm(false)} className="rounded-lg border border-[#1e3a5f] px-3 py-1.5 text-xs text-gray-400">Cancel</button>
              </div>
            </div>
          )}

          {appointments.length === 0 ? (
            <p className="text-sm text-gray-500">No executive appointments.</p>
          ) : (
            <div className="space-y-2">
              {appointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="h-4 w-4 text-[#3CA4F9]" />
                    <div>
                      <span className="text-sm font-medium text-white">{appt.executiveId}</span>
                      <span className="ml-2 text-xs text-gray-400">
                        {positions.find((p) => p.id === appt.positionId)?.title || appt.positionId}
                      </span>
                      <span className="ml-2 rounded bg-[#1e3a5f] px-1.5 py-0.5 text-xs text-gray-400 capitalize">{appt.level}</span>
                    </div>
                    <AppointmentStatusBadge status={appt.status} />
                    <span className="text-xs text-gray-600">
                      {new Date(appt.startDate).toLocaleDateString()} — {new Date(appt.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {appt.status === "active" && (
                    <button onClick={() => handleEndAppointment(appt.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
                      <Ban className="h-3 w-3" /> End
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AppointmentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/10 text-green-400",
    expired: "bg-yellow-500/10 text-yellow-400",
    resigned: "bg-orange-500/10 text-orange-400",
    removed: "bg-red-500/10 text-red-400",
    completed: "bg-blue-500/10 text-blue-400",
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${colors[status] || "bg-gray-500/10 text-gray-400"}`}>
      {status}
    </span>
  )
}
