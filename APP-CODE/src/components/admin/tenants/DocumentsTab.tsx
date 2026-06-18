"use client"

import type { Tenant, TenantDocument } from "@/types"
import { useState, useEffect } from "react"
import { getTenantDocumentService } from "@/lib/services"
import { Loader2, Plus, X, FileText, Download, Archive, Trash2 } from "lucide-react"

export function DocumentsTab({ tenant }: { tenant: Tenant }) {
  const [docs, setDocs] = useState<TenantDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({ name: "", type: "policy", url: "" })

  useEffect(() => {
    loadData()
  }, [tenant.id])

  async function loadData() {
    const svc = await getTenantDocumentService()
    const d = await svc.listDocuments(tenant.id)
    setDocs(d)
    setLoading(false)
  }

  async function handleUpload() {
    if (!uploadForm.name || !uploadForm.url) return
    const svc = await getTenantDocumentService()
    await svc.uploadDocument({
      tenantId: tenant.id,
      name: uploadForm.name,
      type: uploadForm.type,
      url: uploadForm.url,
      status: "active",
      uploadedBy: "current-user",
    })
    setUploadForm({ name: "", type: "policy", url: "" })
    setShowUpload(false)
    loadData()
  }

  async function handleArchive(id: string) {
    const svc = await getTenantDocumentService()
    await svc.archiveDocument(id)
    loadData()
  }

  async function handleDelete(id: string) {
    const svc = await getTenantDocumentService()
    await svc.deleteDocument(id)
    loadData()
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Documents <span className="ml-2 text-sm font-normal text-gray-500">({docs.length})</span>
          </h3>
          <button onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-1 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]"
          >
            <Plus className="h-3 w-3" /> Upload Document
          </button>
        </div>

        {showUpload && (
          <div className="mb-4 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="form-label text-xs">Document Name</label>
                <input value={uploadForm.name} onChange={(e) => setUploadForm((f) => ({ ...f, name: e.target.value }))} className="form-input text-sm" placeholder="e.g. Constitution" />
              </div>
              <div>
                <label className="form-label text-xs">Type</label>
                <select value={uploadForm.type} onChange={(e) => setUploadForm((f) => ({ ...f, type: e.target.value }))} className="form-input text-sm">
                  <option value="policy">Policy</option>
                  <option value="legal">Legal</option>
                  <option value="registration">Registration</option>
                  <option value="governance">Governance</option>
                  <option value="financial">Financial</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Document URL</label>
                <input value={uploadForm.url} onChange={(e) => setUploadForm((f) => ({ ...f, url: e.target.value }))} className="form-input text-sm" placeholder="https://..." />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={handleUpload} disabled={!uploadForm.name || !uploadForm.url} className="rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Upload</button>
              <button onClick={() => setShowUpload(false)} className="rounded-lg border border-[#1e3a5f] px-3 py-1.5 text-xs text-gray-400">Cancel</button>
            </div>
          </div>
        )}

        {docs.length === 0 ? (
          <p className="text-sm text-gray-500">No documents uploaded.</p>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-[#3CA4F9]" />
                  <div>
                    <span className="text-sm font-medium text-white">{doc.name}</span>
                    <span className="ml-2 rounded bg-[#1e3a5f] px-1.5 py-0.5 text-xs text-gray-400 capitalize">{doc.type}</span>
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${doc.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>{doc.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="rounded border border-[#1e3a5f] p-1.5 text-gray-400 hover:text-white">
                    <Download className="h-3 w-3" />
                  </a>
                  {doc.status === "active" && (
                    <button onClick={() => handleArchive(doc.id)} className="rounded border border-yellow-500/30 p-1.5 text-yellow-400 hover:bg-yellow-500/10">
                      <Archive className="h-3 w-3" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(doc.id)} className="rounded border border-red-500/30 p-1.5 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
