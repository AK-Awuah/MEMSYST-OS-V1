"use client"

import { useState, useEffect } from "react"
import { Plus, Loader2, FileText, Download, Archive, Trash2 } from "lucide-react"
import type { Member, MemberDocument } from "@/types"
import { getMemberDocumentService } from "@/lib/services"
import { MEMBER_DOCUMENT_TYPE_LABELS } from "@/lib/constants"

export function MemberDocumentsTab({ member }: { member: Member }) {
  const [docs, setDocs] = useState<MemberDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", type: "identification" as MemberDocument["type"], url: "" })

  useEffect(() => {
    async function load() {
      const svc = await getMemberDocumentService()
      const data = await svc.listDocuments(member.tenantId, member.id)
      setDocs(data)
      setLoading(false)
    }
    load()
  }, [member.id, member.tenantId])

  async function handleUpload() {
    if (!form.name || !form.url) return
    const svc = await getMemberDocumentService()
    await svc.uploadDocument({
      tenantId: member.tenantId,
      memberId: member.id,
      name: form.name,
      type: form.type,
      url: form.url,
      status: "active",
      uploadedBy: member.id,
    })
    setShowForm(false)
    setForm({ name: "", type: "identification", url: "" })
    const data = await svc.listDocuments(member.tenantId, member.id)
    setDocs(data)
  }

  async function handleArchive(id: string) {
    const svc = await getMemberDocumentService()
    await svc.archiveDocument(id)
    setDocs((prev) => prev.map((d) => d.id === id ? { ...d, status: "archived" as const } : d))
  }

  async function handleDelete(id: string) {
    const svc = await getMemberDocumentService()
    await svc.deleteDocument(id)
    setDocs((prev) => prev.filter((d) => d.id !== id))
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Documents</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]">
          <Plus className="h-3 w-3" /> Upload
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as MemberDocument["type"] })} className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white">
                {Object.entries(MEMBER_DOCUMENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">URL *</label>
              <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="/docs/..." className="w-full rounded border border-[#1e3a5f] bg-[#012a42] px-2 py-1.5 text-sm text-white" />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="rounded px-3 py-1.5 text-xs text-gray-400 hover:text-white">Cancel</button>
            <button onClick={handleUpload} className="rounded-lg bg-[#3CA4F9] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]">Upload</button>
          </div>
        </div>
      )}

      {docs.length === 0 && (
        <div className="flex flex-col items-center py-10 text-gray-500">
          <FileText className="mb-2 h-10 w-10" />
          <p className="text-sm">No documents uploaded yet</p>
        </div>
      )}

      <div className="space-y-3">
        {docs.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#3CA4F9]" />
              <div>
                <p className="text-sm font-medium text-white">{d.name}</p>
                <p className="text-xs text-gray-500">{MEMBER_DOCUMENT_TYPE_LABELS[d.type]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {d.status === "active" && (
                <>
                  <button onClick={() => window.open(d.url)} className="rounded p-1.5 text-gray-400 hover:bg-[#1e3a5f] hover:text-white"><Download className="h-4 w-4" /></button>
                  <button onClick={() => handleArchive(d.id)} className="rounded p-1.5 text-gray-400 hover:bg-[#1e3a5f] hover:text-white"><Archive className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(d.id)} className="rounded p-1.5 text-red-400 hover:bg-red-500/20"><Trash2 className="h-4 w-4" /></button>
                </>
              )}
              {d.status === "archived" && <span className="text-xs text-gray-500">Archived</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
