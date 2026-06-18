"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft, GraduationCap, Plus, MapPin, User, BookOpen, X,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/admin"
import type { TrainingCenter } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

const seedData: TrainingCenter[] = [
  {
    id: "tc-1",
    tenantId: "tenant-1",
    businessId: "bp-1",
    name: "Ansah Cardiac Training Academy",
    ownerId: "mem-1",
    ownerName: "Kofi Ansah",
    location: "Accra",
    coursesOffered: ["Advanced Cardiac Life Support", "ECG Interpretation", "Basic Life Support"],
    status: "active",
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "tc-2",
    tenantId: "tenant-1",
    businessId: "bp-2",
    name: "Ghana Tech Skills Institute",
    ownerId: "mem-2",
    ownerName: "Ama Serwaa",
    location: "Kumasi",
    coursesOffered: ["Full Stack Development", "Cloud Computing", "Cybersecurity"],
    status: "active",
    createdAt: "2026-04-15T00:00:00Z",
    updatedAt: "2026-04-15T00:00:00Z",
  },
  {
    id: "tc-3",
    tenantId: "tenant-1",
    businessId: "bp-3",
    name: "Coastal Culinary School",
    ownerId: "mem-3",
    ownerName: "Ekow Mensah",
    location: "Takoradi",
    coursesOffered: ["Professional Cooking", "Pastry Arts", "Food Safety"],
    status: "active",
    createdAt: "2026-03-20T00:00:00Z",
    updatedAt: "2026-03-20T00:00:00Z",
  },
  {
    id: "tc-4",
    tenantId: "tenant-1",
    businessId: "bp-4",
    name: "Northern Agri-Business Hub",
    ownerId: "mem-4",
    ownerName: "Fati Ibrahim",
    location: "Tamale",
    coursesOffered: ["Sustainable Farming", "Agri-Business Management", "Irrigation Techniques"],
    status: "inactive",
    createdAt: "2026-02-10T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
  },
]

export default function TrainingCentersPage() {
  const [centers, setCenters] = useState<TrainingCenter[]>(seedData)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    location: "",
    coursesOffered: "",
  })

  const handleAdd = () => {
    if (!form.name.trim() || !form.ownerName.trim() || !form.location.trim()) return
    const newCenter: TrainingCenter = {
      id: `tc-${Date.now()}`,
      tenantId: "tenant-1",
      businessId: `bp-${Date.now()}`,
      name: form.name,
      ownerId: `mem-${Date.now()}`,
      ownerName: form.ownerName,
      location: form.location,
      coursesOffered: form.coursesOffered.split(",").map((c) => c.trim()).filter(Boolean),
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setCenters([newCenter, ...centers])
    setForm({ name: "", ownerName: "", location: "", coursesOffered: "" })
    setShowForm(false)
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Training Centers"
          description="Directory of registered training centers and course providers"
          actions={
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
              >
                <Plus className="h-4 w-4" /> New Training Center
              </button>
              <Link
                href="/app/marketplace"
                className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-3 py-2 text-sm text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
            </div>
          }
        />
      </motion.div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">New Training Center</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Center Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tech Skills Academy"
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Owner Name</label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Accra"
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Courses (comma separated)</label>
              <input
                type="text"
                value={form.coursesOffered}
                onChange={(e) => setForm({ ...form, coursesOffered: e.target.value })}
                placeholder="e.g. Web Dev, Data Science"
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#0A1E2E] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!form.name.trim() || !form.ownerName.trim() || !form.location.trim()}
              className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50 transition-colors"
            >
              Add Center
            </button>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="overflow-x-auto rounded-xl border border-[#1e3a5f] bg-[#011B2B]">
        {centers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
            <GraduationCap className="h-10 w-10" />
            <p className="text-sm">No training centers registered</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] text-left">
                <th className="px-4 py-3 font-medium text-gray-400">Name</th>
                <th className="px-4 py-3 font-medium text-gray-400">Owner</th>
                <th className="px-4 py-3 font-medium text-gray-400">Location</th>
                <th className="px-4 py-3 font-medium text-gray-400">Courses Offered</th>
                <th className="px-4 py-3 font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]/50">
              {centers.map((center) => (
                <tr key={center.id} className="hover:bg-[#0A1E2E]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-[#3CA4F9]" />
                      <span className="text-white font-medium">{center.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-gray-300">{center.ownerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-gray-300">{center.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-gray-500" />
                      <div className="flex flex-wrap gap-1">
                        {center.coursesOffered.map((course, idx) => (
                          <span key={idx} className="rounded-full bg-[#1e3a5f]/50 px-2 py-0.5 text-xs text-gray-300">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      center.status === "active"
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-gray-400 bg-gray-400/10"
                    }`}>
                      {center.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  )
}
