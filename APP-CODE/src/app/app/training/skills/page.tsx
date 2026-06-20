"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, UserCheck } from "lucide-react"
import { PageHeader, DataTable, StatCard } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getSkillService } from "@/lib/services"
import type { Skill, LearnerSkill } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [learnerSkills, setLearnerSkills] = useState<LearnerSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"skills" | "learner">("skills")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSkillService()
        const [skillsData, learnerSkillsData] = await Promise.all([
          svc.listSkills("tenant-1"),
          svc.listLearnerSkills("tenant-1"),
        ])
        if (!cancelled) {
          setSkills(skillsData)
          setLearnerSkills(learnerSkillsData)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load skills")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    totalSkills: skills.length,
    totalLearnerSkills: learnerSkills.length,
    categories: new Set(skills.map((s) => s.category)).size,
  }), [skills, learnerSkills])

  const skillColumns: Column<Skill>[] = [
    {
      key: "name",
      header: "Skill Name",
      render: (s) => <span className="font-medium text-white">{s.name}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (s) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9]">
          {s.category}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (s) => <span className="text-gray-400">{s.description || "-"}</span>,
    },
  ]

  const learnerSkillColumns: Column<LearnerSkill>[] = [
    {
      key: "learnerId",
      header: "Learner ID",
      render: (ls) => <span className="font-medium text-white">{ls.learnerId}</span>,
    },
    {
      key: "skillName",
      header: "Skill",
      render: (ls) => <span className="text-gray-400">{ls.skillName}</span>,
    },
    {
      key: "competencyLevel",
      header: "Competency",
      render: (ls) => (
        <span className={`text-xs font-medium ${
          ls.competencyLevel === "Advanced" ? "text-green-400" :
          ls.competencyLevel === "Intermediate" ? "text-yellow-400" :
          "text-blue-400"
        }`}>
          {ls.competencyLevel}
        </span>
      ),
    },
    {
      key: "dateAchieved",
      header: "Date Achieved",
      render: (ls) => <span className="text-gray-400">{new Date(ls.dateAchieved).toLocaleDateString()}</span>,
    },
    {
      key: "verifiedBy",
      header: "Verified By",
      render: (ls) => <span className="text-gray-400">{ls.verifiedBy || "-"}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Skills" description="Manage skills and learner skills" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Total Skills" value="-" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Learner Skills" value="-" icon={<UserCheck className="h-5 w-5" />} />
          <StatCard title="Categories" value="-" icon={<BookOpen className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading skills...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Skills" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader title="Skills" description="Manage skills and learner skills" />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Skills" value={stats.totalSkills} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Learner Skills" value={stats.totalLearnerSkills} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard title="Categories" value={stats.categories} icon={<BookOpen className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex border-b border-[#1e3a5f] mb-6">
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "skills" ? "text-[#3CA4F9]" : "text-gray-400 hover:text-white"
            }`}
          >
            Skills
            {activeTab === "skills" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3CA4F9]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("learner")}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "learner" ? "text-[#3CA4F9]" : "text-gray-400 hover:text-white"
            }`}
          >
            Learner Skills
            {activeTab === "learner" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3CA4F9]" />
            )}
          </button>
        </div>

        {activeTab === "skills" ? (
          <DataTable
            columns={skillColumns}
            data={skills}
            emptyMessage="No skills found."
          />
        ) : (
          <DataTable
            columns={learnerSkillColumns}
            data={learnerSkills}
            emptyMessage="No learner skills found."
          />
        )}
      </motion.div>
    </motion.div>
  )
}
