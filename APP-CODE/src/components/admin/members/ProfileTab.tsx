"use client"

import { useState } from "react"
import { Save, Loader2 } from "lucide-react"
import type { Member } from "@/types"
import { getMemberService } from "@/lib/services"

export function ProfileTab({ member, onUpdate }: { member: Member; onUpdate: (m: Member) => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    firstName: member.firstName,
    middleName: member.middleName,
    lastName: member.lastName,
    gender: member.gender,
    dateOfBirth: member.dateOfBirth,
    phone: member.phone,
    email: member.email,
    address: member.address,
    city: member.city,
    country: member.country,
    profession: member.profession,
    specialization: member.specialization,
    businessName: member.businessName,
    yearsOfExperience: member.yearsOfExperience,
    photo: member.photo,
  })

  async function handleSave() {
    setSaving(true)
    try {
      const svc = await getMemberService()
      await svc.updateMember(member.id, form)
      onUpdate({ ...member, ...form, updatedAt: new Date().toISOString() })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-400">First Name</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Middle Name</label>
            <input value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Last Name</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Gender</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Photo URL</label>
            <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">Contact Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">City</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-gray-400">Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Country</label>
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">Professional Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Profession</label>
            <input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Specialization</label>
            <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Business Name</label>
            <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Years of Experience</label>
            <input type="number" value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2 text-sm font-medium text-white hover:bg-[#3594e0] disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>
    </div>
  )
}
