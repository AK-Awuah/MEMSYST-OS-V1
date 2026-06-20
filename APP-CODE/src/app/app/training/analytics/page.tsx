"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users, BookOpen, Award, GraduationCap, FileText, BarChart3, TrendingUp, CheckCircle,
} from "lucide-react"
import { PageHeader, StatCard } from "@/components/admin"
import { getTrainingAnalyticsService } from "@/lib/services"
import type { TrainingAnalytics } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export default function TrainingAnalyticsPage() {
  const [analytics, setAnalytics] = useState<TrainingAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getTrainingAnalyticsService()
        const data = await svc.getAnalytics("tenant-1")
        if (!cancelled) setAnalytics(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load analytics")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading training analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
    )
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Training Analytics"
          description="Key training performance metrics and insights."
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Enrollments" value={analytics?.totalEnrollments ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Completions" value={analytics?.courseCompletions ?? 0} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard title="Pass Rate" value={`${analytics?.passRate ?? 0}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Graduations" value={analytics?.graduations ?? 0} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="Certifications" value={analytics?.certifications ?? 0} icon={<Award className="h-5 w-5" />} />
        <StatCard title="Active Centers" value={analytics?.activeCenters ?? 0} icon={<BarChart3 className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white mb-4">By Program</h3>
          {analytics?.byProgram && analytics.byProgram.length > 0 ? (
            <div className="space-y-3">
              {analytics.byProgram.map((item) => (
                <div key={item.program} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{item.program}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-[#1e3a5f] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#3CA4F9]"
                        style={{ width: `${Math.min(100, (item.count / Math.max(...analytics.byProgram.map((p) => p.count))) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No program data available.</p>
          )}
        </div>

        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
          <h3 className="text-lg font-bold text-white mb-4">By Status</h3>
          {analytics?.byStatus && analytics.byStatus.length > 0 ? (
            <div className="space-y-3">
              {analytics.byStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">{item.status.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-[#1e3a5f] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#3CA4F9]"
                        style={{ width: `${Math.min(100, (item.count / Math.max(...analytics.byStatus.map((s) => s.count))) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No status data available.</p>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e3a5f] text-left text-gray-400">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Enrollments</th>
                  <th className="pb-2 font-medium">Completions</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentActivity.map((row, i) => (
                  <tr key={i} className="border-b border-[#1e3a5f]/50">
                    <td className="py-3 text-white">{row.date}</td>
                    <td className="py-3 text-gray-300">{row.enrollments}</td>
                    <td className="py-3 text-gray-300">{row.completions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent activity data available.</p>
        )}
      </motion.div>
    </motion.div>
  )
}
