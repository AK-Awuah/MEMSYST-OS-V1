"use client"

import { useState, useEffect } from "react"
import { Plus, Loader2, GraduationCap } from "lucide-react"
import type { Member, Apprentice } from "@/types"
import { getApprenticeService } from "@/lib/services"
import { APPRENTICE_STATUS_LABELS } from "@/lib/constants"

export function MemberApprenticesTab({ member }: { member: Member }) {
  const [apprentices, setApprentices] = useState<Apprentice[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", address: "", trade: "", startDate: "", expectedCompletionDate: "" })

  useEffect(() => {
    async function load() {
      const svc = await getApprenticeService()
      const data = await svc.getApprenticesByMember(member.id)
      setApprentices(data)
      setLoading(false)
    }
    load()
  }, [member.id])

  async function handleCreate() {
    if (!form.firstName || !form.lastName) return
    const svc = await getApprenticeService()
    await svc.createApprentice({
      tenantId: member.tenantId,
      parentMemberId: member.id,
      branchId: member.branchId,
      regionId: member.regionId,
      status: "pending",
      dateRegistered: new Date().toISOString(),
      ...form,
      photo: "",
      createdAt: "",
      updatedAt: "",
    } as Omit<Apprentice, "id" | "createdAt" | "updatedAt">)
    setShowForm(false)
    setForm({ firstName: "", lastName: "", phone: "", email: "", address: "", trade: "", startDate: "", expectedCompletionDate: "" })
    const data = await svc.getApprenticesByMember(member.id)
    setApprentices(data)
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Apprentices ({apprentices.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]">
          <Plus className="h-3 w-3" /> Register Apprentice
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-gray-400">First Name *</label>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Last Name *</label>
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Trade</label>
              <input value={form.trade} onChange={(e) => setForm({ ...form, trade: e.target.value })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Expected Completion</label>
              <input type="date" value={form.expectedCompletionDate} onChange={(e) => setForm({ ...form, expectedCompletionDate: e.target.value })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="rounded px-3 py-1.5 text-xs text-gray-400 hover:text-white">Cancel</button>
            <button onClick={handleCreate} className="rounded-lg bg-[#3CA4F9] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]">Create</button>
          </div>
        </div>
      )}

      {apprentices.length === 0 && !showForm && (
        <div className="flex flex-col items-center py-10 text-gray-500">
          <GraduationCap className="mb-2 h-10 w-10" />
          <p className="text-sm">No apprentices registered yet</p>
        </div>
      )}

      <div className="space-y-3">
        {apprentices.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
            <div>
              <p className="text-sm font-medium text-white">{a.firstName} {a.lastName}</p>
              <p className="text-xs text-gray-500">{a.trade} · Started {new Date(a.startDate).toLocaleDateString()}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${a.status === "active" ? "bg-green-500/20 text-green-400" : a.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>{APPRENTICE_STATUS_LABELS[a.status]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
