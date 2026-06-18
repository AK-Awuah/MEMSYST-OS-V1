"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getMemberRegistrationService, getOrganizationStructureService } from "@/lib/services"
import type { Member } from "@/types"

export default function NewMemberPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    firstName: "", lastName: "", middleName: "", gender: "Male", dateOfBirth: "",
    phone: "", email: "", address: "", city: "", country: "Ghana",
    profession: "", specialization: "", businessName: "", yearsOfExperience: 0,
    category: "Full Member", branchId: "", regionId: "",
    photo: "", registeredBy: "admin" as const,
  })

  async function handleSave() {
    if (!form.firstName || !form.lastName || !form.email) {
      setError("First name, last name, and email are required")
      return
    }
    setSaving(true)
    setError("")
    try {
      const svc = await getMemberRegistrationService()
      await svc.registerByAdmin({
        ...form,
        tenantId: "tenant-1",
        region: "",
      } as unknown as Omit<Member, "id" | "createdAt" | "updatedAt" | "membershipNumber" | "approvalStatus" | "renewalStatus" | "status" | "dateRegistered">)
      router.push("/app/members")
    } catch {
      setError("Failed to create member")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Register New Member" description="Create a new member record"
        actions={<button onClick={() => router.back()} className="flex items-center gap-1.5 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>}
      />

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>}

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-400">First Name *</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Middle Name</label>
            <input value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Last Name *</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
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
            <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Photo URL</label>
            <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">Contact Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">City</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-gray-400">Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Country</label>
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">Professional Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Profession</label>
            <input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Specialization</label>
            <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Business Name</label>
            <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Years of Experience</label>
            <input type="number" value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Membership Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
              <option>Full Member</option>
              <option>Associate Member</option>
              <option>Honorary Member</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => router.back()} className="rounded-lg border border-[#1e3a5f] px-6 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2 text-sm font-medium text-white hover:bg-[#3594e0] disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Create Member
        </button>
      </div>
    </div>
  )
}
