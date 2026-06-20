"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { UserPlus, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getMemberRegistrationService } from "@/lib/services"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MemberRegistrationPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dateOfBirth: "", gender: "", category: "", branchId: "",
    region: "", nationality: "", occupation: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const svc = await getMemberRegistrationService()
      await svc.registerByAdmin(form as any)
      setSuccess(true)
      setTimeout(() => router.push("/app/members"), 1500)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle className="mb-4 h-12 w-12 text-green-400" />
        <p className="text-lg font-medium text-white">Member Registered Successfully</p>
        <p className="mt-2 text-sm text-gray-400">Redirecting to members list...</p>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Register Member"
          description="Add a new member to the system"
          actions={
            <Link
              href="/app/members"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Members
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 p-6 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">First Name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Last Name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} required className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Date of Birth</label>
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Category *</label>
              <input name="category" value={form.category} onChange={handleChange} required placeholder="e.g. Regular, Associate" className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Branch ID</label>
              <input name="branchId" value={form.branchId} onChange={handleChange} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Region</label>
              <input name="region" value={form.region} onChange={handleChange} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Nationality</label>
              <input name="nationality" value={form.nationality} onChange={handleChange} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Occupation</label>
              <input name="occupation" value={form.occupation} onChange={handleChange} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3CA4F9]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Registering...</> : <><UserPlus className="h-4 w-4" /> Register Member</>}
            </button>
            <Link
              href="/app/members"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-transparent px-6 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
