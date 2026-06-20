"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getProgramService } from "@/lib/services"
import type { Program } from "@/types"

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchProgram = async () => {
    try {
      const svc = await getProgramService()
      const data = await svc.getProgram(id)
      setProgram(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load program")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getProgramService()
        const data = await svc.getProgram(id)
        if (!cancelled) setProgram(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load program")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this program? This cannot be undone.")) return
    setActionLoading("delete")
    try {
      const svc = await getProgramService()
      await svc.deleteProgram(id)
      router.push("/app/training/programs")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete program")
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading program...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Program not found.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Programs
      </button>

      <PageHeader
        title={program.name}
        description={`Status: ${program.status === "active" ? "Active" : "Inactive"}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Program Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-white mt-1">{program.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block mt-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  program.status === "active"
                    ? "bg-green-500/15 text-green-400 border-green-500/30"
                    : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                }`}>
                  {program.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Levels</p>
                <p className="text-sm font-medium text-white mt-1">{program.levels.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Requirements</p>
                <p className="text-sm font-medium text-white mt-1">{program.requirements.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(program.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(program.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{program.description}</p>
          </div>

          {program.levels.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Levels</h3>
              <div className="flex flex-wrap gap-2">
                {program.levels.map((level, i) => (
                  <span
                    key={i}
                    className="inline-block rounded-full border border-[#1e3a5f] bg-[#012a42] px-3 py-1 text-xs font-medium text-[#3CA4F9]"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          )}

          {program.requirements.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Requirements</h3>
              <ul className="space-y-2">
                {program.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-[#3CA4F9] mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {program.completionRules.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Completion Rules</h3>
              <ul className="space-y-2">
                {program.completionRules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleDelete}
                disabled={actionLoading === "delete"}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {actionLoading === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {actionLoading === "delete" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
