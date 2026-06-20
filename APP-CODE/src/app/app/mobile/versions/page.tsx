"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getMobileService } from "@/lib/services"
import type { MobileAppVersion } from "@/types"

export default function VersionsListPage() {
  const [versions, setVersions] = useState<MobileAppVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [platform, setPlatform] = useState<MobileAppVersion["platform"]>("pwa")
  const [version, setVersion] = useState("")
  const [buildNumber, setBuildNumber] = useState("")
  const [releaseNotes, setReleaseNotes] = useState("")
  const [minAppVersion, setMinAppVersion] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [isForced, setIsForced] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getMobileService()
        const data = await svc.listVersions("tenant-1")
        if (!cancelled) setVersions(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleAdd = async () => {
    if (!version || !buildNumber || !downloadUrl) return
    setSaving(true)
    try {
      const svc = await getMobileService()
      await svc.createVersion("tenant-1", {
        tenantId: "tenant-1",
        platform,
        version,
        buildNumber,
        releaseNotes,
        minAppVersion: minAppVersion || version,
        downloadUrl,
        isForced,
        status: "development",
        releasedAt: new Date().toISOString(),
      })
      const data = await svc.listVersions("tenant-1")
      setVersions(data)
      setShowForm(false)
      setVersion("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create version")
    } finally {
      setSaving(false)
    }
  }

  const filtered = versions.filter((v) =>
    v.version.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<MobileAppVersion>[] = [
    { key: "version", header: "Version", render: (v) => <span className="text-white">{v.version}</span> },
    { key: "buildNumber", header: "Build", render: (v) => <span className="text-gray-400">{v.buildNumber}</span> },
    { key: "platform", header: "Platform", render: (v) => <span className="text-gray-400 uppercase">{v.platform}</span> },
    { key: "minAppVersion", header: "Min Version", render: (v) => <span className="text-gray-400">{v.minAppVersion}</span> },
    { key: "isForced", header: "Forced", render: (v) => <span className={v.isForced ? "text-amber-400" : "text-gray-500"}>{v.isForced ? "Yes" : "No"}</span> },
    { key: "status", header: "Status", render: (v) => <StatusBadge status={v.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="App Versions" description="Version management and releases" />
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Plus className="h-4 w-4" /> New Version
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search versions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No versions found." />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Version</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Version</label>
                  <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Build Number</label>
                  <input type="text" value={buildNumber} onChange={(e) => setBuildNumber(e.target.value)} placeholder="100" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Platform</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value as MobileAppVersion["platform"])}
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
                  <option value="pwa">PWA</option>
                  <option value="ios">iOS</option>
                  <option value="android">Android</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Download URL</label>
                <input type="url" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="https://..." className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Min App Version</label>
                  <input type="text" value={minAppVersion} onChange={(e) => setMinAppVersion(e.target.value)} placeholder="1.0.0" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isForced} onChange={(e) => setIsForced(e.target.checked)}
                      className="rounded border-[#1e3a5f] bg-[#012a42] text-[#3CA4F9] focus:ring-[#3CA4F9]" />
                    <span className="text-sm text-gray-300">Force Update</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Release Notes</label>
                <textarea value={releaseNotes} onChange={(e) => setReleaseNotes(e.target.value)} placeholder="What's new..." rows={3}
                  className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving || !version || !buildNumber || !downloadUrl}
                className="px-4 py-2 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
