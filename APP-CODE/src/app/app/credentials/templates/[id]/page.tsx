"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, CheckCircle, Loader2 } from "lucide-react"
import { PageHeader, StatusBadge } from "@/components/admin"
import { CREDENTIAL_TEMPLATE_TYPE_LABELS } from "@/lib/constants"
import { getCredentialTemplateService } from "@/lib/services"
import type { CredentialTemplate } from "@/types"

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [template, setTemplate] = useState<CredentialTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settingActive, setSettingActive] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCredentialTemplateService()
        const data = await svc.getTemplate(id)
        if (!cancelled) setTemplate(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load template")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleSetActive = async () => {
    setSettingActive(true)
    try {
      const svc = await getCredentialTemplateService()
      const updated = await svc.setActiveTemplate(id)
      setTemplate(updated)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to set template as active")
    } finally {
      setSettingActive(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const svc = await getCredentialTemplateService()
      await svc.deleteTemplate(id)
      router.push("/app/credentials/templates")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete template")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading template...</p>
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
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          Template not found.
        </div>
      </div>
    )
  }

  const canSetActive = template.status !== "active"

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Templates
      </button>

      <PageHeader
        title={template.name}
        description={`v${template.version}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Template Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-white mt-1">{template.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Version</p>
                <p className="text-sm font-medium text-white mt-1">v{template.version}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm font-medium text-white mt-1 capitalize">
                  {CREDENTIAL_TEMPLATE_TYPE_LABELS[template.type] || template.type}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={template.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm font-medium text-white mt-1">{template.description || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Typography</p>
                <p className="text-sm font-medium text-white mt-1">{template.typography || "Inter"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Primary Color</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-5 w-5 rounded-full border border-white/10" style={{ backgroundColor: template.primaryColor }} />
                  <p className="text-sm font-medium text-white font-mono">{template.primaryColor}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Secondary Color</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-5 w-5 rounded-full border border-white/10" style={{ backgroundColor: template.secondaryColor }} />
                  <p className="text-sm font-medium text-white font-mono">{template.secondaryColor}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Fields ({template.fields.length})</h3>
            {template.fields.length === 0 ? (
              <p className="text-sm text-gray-500">No fields configured.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#1e3a5f]">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#1e3a5f] bg-[#011B2B]">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-400">Label</th>
                      <th className="px-4 py-3 font-medium text-gray-400">Key</th>
                      <th className="px-4 py-3 font-medium text-gray-400">Position (x, y)</th>
                      <th className="px-4 py-3 font-medium text-gray-400">Font Size</th>
                      <th className="px-4 py-3 font-medium text-gray-400">Color</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e3a5f]">
                    {template.fields.map((f) => (
                      <tr key={f.id} className="hover:bg-[#1e3a5f]/30">
                        <td className="px-4 py-3 text-white">{f.label}</td>
                        <td className="px-4 py-3 text-gray-400 font-mono">{f.key}</td>
                        <td className="px-4 py-3 text-gray-400">({f.x}, {f.y})</td>
                        <td className="px-4 py-3 text-gray-400">{f.fontSize}px</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded border border-white/10" style={{ backgroundColor: f.color }} />
                            <span className="text-gray-400 font-mono text-xs">{f.color}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">QR Code Placement</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">X Position</p>
                <p className="text-sm font-medium text-white mt-1">{template.qrPlacement.x}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Y Position</p>
                <p className="text-sm font-medium text-white mt-1">{template.qrPlacement.y}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {canSetActive && (
                <button
                  onClick={handleSetActive}
                  disabled={settingActive}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/80 text-sm text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {settingActive ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {settingActive ? "Setting Active..." : "Set Active"}
                </button>
              )}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Delete Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Delete Template</h3>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to delete &ldquo;{template.name}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors"
              >
                Keep Template
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
