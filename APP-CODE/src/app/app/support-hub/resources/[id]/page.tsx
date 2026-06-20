"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Archive, Loader2, ExternalLink } from "lucide-react"
import { PageHeader, StatusBadge } from "@/components/admin"
import { RESOURCE_CATEGORY_LABELS } from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { ResourceDirectory, ResourceCategory } from "@/types"

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [resource, setResource] = useState<ResourceDirectory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchResource = async () => {
    try {
      const svc = await getSupportHubService()
      const data = await svc.getResource(id)
      setResource(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load resource")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const data = await svc.getResource(id)
        if (!cancelled) setResource(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load resource")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleArchive = async () => {
    setActionLoading("archive")
    try {
      const svc = await getSupportHubService()
      await svc.archiveResource(id)
      await fetchResource()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to archive resource")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading resource...</p>
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

  if (!resource) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Resource not found.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Resources
      </button>

      <PageHeader
        title={resource.title}
        description={`Provider: ${resource.provider} — ${RESOURCE_CATEGORY_LABELS[resource.category as ResourceCategory] || resource.category}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Resource Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Title</p>
                <p className="text-sm font-medium text-white mt-1">{resource.title}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={resource.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-white mt-1">{RESOURCE_CATEGORY_LABELS[resource.category as ResourceCategory] || resource.category}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Provider</p>
                <p className="text-sm font-medium text-white mt-1">{resource.provider}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Verified</p>
                <p className="text-sm font-medium text-white mt-1">{resource.isVerified ? "Yes" : "No"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Provider Contact</p>
                <p className="text-sm font-medium text-white mt-1">{resource.contactPhone || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Contact Email</p>
                <p className="text-sm font-medium text-white mt-1">{resource.contactEmail || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Website</p>
                <p className="text-sm font-medium text-white mt-1">
                  {resource.website ? (
                    <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-[#3CA4F9] hover:underline inline-flex items-center gap-1">
                      {resource.website} <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : "-"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(resource.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Updated</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(resource.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{resource.description}</p>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
            {resource.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((t) => (
                  <span key={t} className="rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-3 py-1 text-xs font-medium text-[#3CA4F9]">{t}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tags.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/app/support-hub/resources/${id}/edit`)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              {resource.status !== "archived" && (
                <button
                  onClick={handleArchive}
                  disabled={actionLoading === "archive"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "archive" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                  {actionLoading === "archive" ? "Archiving..." : "Archive"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
