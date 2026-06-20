"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Briefcase, Search, Award, BookOpen, Clock } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getProfessionalDevelopmentService } from "@/lib/services"
import type { ProfessionalDevelopment } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ProfessionalDevelopmentPage() {
  const router = useRouter()
  const [records, setRecords] = useState<ProfessionalDevelopment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getProfessionalDevelopmentService()
        const data = await svc.listProfessionalDevelopments("tenant-1")
        if (!cancelled) setRecords(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load professional development records")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: records.length,
    totalCourses: records.reduce((sum, r) => sum + r.coursesTaken, 0),
    totalHours: records.reduce((sum, r) => sum + r.trainingHours, 0),
    totalCredits: records.reduce((sum, r) => sum + r.professionalCredits, 0),
  }), [records])

  const filtered = useMemo(() => {
    if (!search) return records
    const s = search.toLowerCase()
    return records.filter((r) => r.learnerName.toLowerCase().includes(s))
  }, [search, records])

  const columns: Column<ProfessionalDevelopment>[] = [
    {
      key: "learnerName",
      header: "Learner",
      render: (r) => <span className="font-medium text-white">{r.learnerName}</span>,
    },
    {
      key: "coursesTaken",
      header: "Courses",
      render: (r) => <span className="text-gray-300">{r.coursesTaken}</span>,
    },
    {
      key: "trainingHours",
      header: "Hours",
      render: (r) => <span className="text-gray-300">{r.trainingHours}</span>,
    },
    {
      key: "certificationsEarned",
      header: "Certifications",
      render: (r) => <span className="text-gray-300">{r.certificationsEarned}</span>,
    },
    {
      key: "professionalCredits",
      header: "Credits",
      render: (r) => <span className="text-gray-300">{r.professionalCredits}</span>,
    },
    {
      key: "skillsAchieved",
      header: "Skills",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.skillsAchieved.slice(0, 2).map((s, i) => (
            <span key={i} className="inline-flex items-center rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2 py-0.5 text-xs text-[#3CA4F9]">{s}</span>
          ))}
          {r.skillsAchieved.length > 2 && <span className="text-xs text-gray-500">+{r.skillsAchieved.length - 2}</span>}
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Professional Development" description="Track learner professional development" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Records" value="-" icon={<Briefcase className="h-5 w-5" />} />
          <StatCard title="Total Courses" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Training Hours" value="-" icon={<Clock className="h-5 w-5" />} />
          <StatCard title="Credits" value="-" icon={<Award className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading professional development records...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Professional Development" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Professional Development"
          description="Track learner professional development records"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Records" value={stats.total} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Total Courses" value={stats.totalCourses} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Training Hours" value={stats.totalHours} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="Credits" value={stats.totalCredits} icon={<Award className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by learner name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(r) => router.push(`/app/training/professional-development/${r.id}`)}
          emptyMessage="No professional development records found."
        />
      </motion.div>
    </motion.div>
  )
}
