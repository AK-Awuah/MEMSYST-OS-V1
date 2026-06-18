"use client"

import type { Tenant, GovernanceConfig, ApprovalWorkflow } from "@/types"
import { useState, useEffect } from "react"
import { getGovernanceService } from "@/lib/services"
import { Loader2, Plus, X, Save, ArrowRight } from "lucide-react"

export function GovernanceTab({ tenant }: { tenant: Tenant }) {
  const [config, setConfig] = useState<GovernanceConfig | null>(null)
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [subTab, setSubTab] = useState<"config" | "workflows">("workflows")
  const [saving, setSaving] = useState(false)
  const [showWorkflowForm, setShowWorkflowForm] = useState(false)
  const [configForm, setConfigForm] = useState({ approvalLevels: "", governanceHierarchy: "", executiveStructure: "", organizationalRules: "" })
  const [wfForm, setWfForm] = useState({ name: "", stages: [{ order: 1, label: "", approverLevel: "branch", required: true }] })

  useEffect(() => {
    loadData()
  }, [tenant.id])

  async function loadData() {
    const svc = await getGovernanceService()
    const [c, w] = await Promise.all([svc.getGovernanceConfig(tenant.id), svc.listWorkflows(tenant.id)])
    if (c) {
      setConfig(c)
      setConfigForm({
        approvalLevels: c.approvalLevels.join("\n"),
        governanceHierarchy: Object.entries(c.governanceHierarchy).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n"),
        executiveStructure: c.executiveStructure.join("\n"),
        organizationalRules: c.organizationalRules.join("\n"),
      })
    }
    setWorkflows(w)
    setLoading(false)
  }

  async function handleSaveConfig() {
    setSaving(true)
    const svc = await getGovernanceService()
    await svc.updateGovernanceConfig(tenant.id, {
      approvalLevels: configForm.approvalLevels.split("\n").filter(Boolean),
      governanceHierarchy: Object.fromEntries(
        configForm.governanceHierarchy.split("\n").filter(Boolean).map((line) => {
          const [k, ...v] = line.split(":").map((s) => s.trim())
          return [k, v.join("").split(",").map((s) => s.trim())]
        })
      ),
      executiveStructure: configForm.executiveStructure.split("\n").filter(Boolean),
      organizationalRules: configForm.organizationalRules.split("\n").filter(Boolean),
    })
    setSaving(false)
  }

  async function handleCreateWorkflow() {
    if (!wfForm.name || wfForm.stages.length === 0) return
    const svc = await getGovernanceService()
    await svc.createWorkflow({
      tenantId: tenant.id,
      name: wfForm.name,
      stages: wfForm.stages,
      status: "active",
    })
    setWfForm({ name: "", stages: [{ order: 1, label: "", approverLevel: "branch", required: true }] })
    setShowWorkflowForm(false)
    loadData()
  }

  async function handleToggleWorkflow(id: string, currentStatus: string) {
    const svc = await getGovernanceService()
    if (currentStatus === "active") await svc.deactivateWorkflow(id)
    else await svc.activateWorkflow(id)
    loadData()
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-[#1e3a5f]">
        <button onClick={() => setSubTab("workflows")} className={`pb-2 text-sm font-medium ${subTab === "workflows" ? "border-b-2 border-[#3CA4F9] text-[#3CA4F9]" : "text-gray-500 hover:text-gray-300"}`}>
          Approval Workflows ({workflows.length})
        </button>
        <button onClick={() => setSubTab("config")} className={`pb-2 text-sm font-medium ${subTab === "config" ? "border-b-2 border-[#3CA4F9] text-[#3CA4F9]" : "text-gray-500 hover:text-gray-300"}`}>
          Governance Config
        </button>
      </div>

      {subTab === "workflows" && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Approval Workflows</h3>
            <button onClick={() => setShowWorkflowForm(!showWorkflowForm)}
              className="flex items-center gap-1 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]"
            >
              <Plus className="h-3 w-3" /> Add Workflow
            </button>
          </div>

          {showWorkflowForm && (
            <div className="mb-4 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
              <div className="mb-3">
                <label className="form-label text-xs">Workflow Name</label>
                <input value={wfForm.name} onChange={(e) => setWfForm((f) => ({ ...f, name: e.target.value }))} className="form-input text-sm" placeholder="e.g. Membership Approval" />
              </div>
              <label className="form-label text-xs mb-2">Approval Stages</label>
              <div className="space-y-2">
                {wfForm.stages.map((stage, i) => (
                  <div key={i} className="flex items-center gap-2 rounded border border-[#1e3a5f] bg-[#012a42] p-2">
                    <span className="text-xs text-gray-500 w-5">{stage.order}.</span>
                    <input value={stage.label} onChange={(e) => {
                      const s = [...wfForm.stages]; s[i] = { ...s[i], label: e.target.value }; setWfForm((f) => ({ ...f, stages: s }))
                    }} className="form-input text-xs flex-1" placeholder="Stage label" />
                    <select value={stage.approverLevel} onChange={(e) => {
                      const s = [...wfForm.stages]; s[i] = { ...s[i], approverLevel: e.target.value }; setWfForm((f) => ({ ...f, stages: s }))
                    }} className="form-input text-xs w-24">
                      <option value="branch">Branch</option>
                      <option value="regional">Regional</option>
                      <option value="national">National</option>
                    </select>
                    <label className="flex items-center gap-1 text-xs text-gray-400">
                      <input type="checkbox" checked={stage.required} onChange={(e) => {
                        const s = [...wfForm.stages]; s[i] = { ...s[i], required: e.target.checked }; setWfForm((f) => ({ ...f, stages: s }))
                      }} className="rounded border-gray-600" />
                      Required
                    </label>
                    {wfForm.stages.length > 1 && (
                      <button onClick={() => setWfForm((f) => ({ ...f, stages: f.stages.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-300"><X className="h-3 w-3" /></button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setWfForm((f) => ({ ...f, stages: [...f.stages, { order: f.stages.length + 1, label: "", approverLevel: "branch", required: true }] }))}
                className="mt-2 text-xs text-[#3CA4F9] hover:underline">+ Add Stage</button>
              <div className="mt-3 flex gap-2">
                <button onClick={handleCreateWorkflow} disabled={!wfForm.name} className="rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Create</button>
                <button onClick={() => setShowWorkflowForm(false)} className="rounded-lg border border-[#1e3a5f] px-3 py-1.5 text-xs text-gray-400">Cancel</button>
              </div>
            </div>
          )}

          {workflows.length === 0 ? (
            <p className="text-sm text-gray-500">No approval workflows configured.</p>
          ) : (
            <div className="space-y-3">
              {workflows.map((wf) => (
                <div key={wf.id} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{wf.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${wf.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>{wf.status}</span>
                    </div>
                    <button onClick={() => handleToggleWorkflow(wf.id, wf.status)}
                      className={`text-xs ${wf.status === "active" ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}`}>
                      {wf.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {wf.stages.sort((a, b) => a.order - b.order).map((stage, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="rounded border border-[#1e3a5f] bg-[#012a42] px-3 py-1.5">
                          <span className="text-xs text-gray-300">{stage.label}</span>
                          <span className="ml-1.5 text-xs text-gray-600">({stage.approverLevel})</span>
                          {stage.required && <span className="ml-1 text-xs text-red-400">*</span>}
                        </div>
                        {i < wf.stages.length - 1 && <ArrowRight className="h-3 w-3 text-gray-600" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === "config" && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Governance Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Approval Levels (one per line)</label>
              <textarea value={configForm.approvalLevels} onChange={(e) => setConfigForm((f) => ({ ...f, approvalLevels: e.target.value }))}
                className="form-input min-h-[80px]" rows={3} placeholder="branch&#10;regional&#10;national" />
            </div>
            <div>
              <label className="form-label">Governance Hierarchy (format: level: parent1, parent2)</label>
              <textarea value={configForm.governanceHierarchy} onChange={(e) => setConfigForm((f) => ({ ...f, governanceHierarchy: e.target.value }))}
                className="form-input min-h-[80px]" rows={3} placeholder="branch: regional&#10;regional: national&#10;national: " />
            </div>
            <div>
              <label className="form-label">Executive Structure (one per line)</label>
              <textarea value={configForm.executiveStructure} onChange={(e) => setConfigForm((f) => ({ ...f, executiveStructure: e.target.value }))}
                className="form-input min-h-[80px]" rows={3} placeholder="national_president&#10;vice_president&#10;national_secretary" />
            </div>
            <div>
              <label className="form-label">Organizational Rules (one per line)</label>
              <textarea value={configForm.organizationalRules} onChange={(e) => setConfigForm((f) => ({ ...f, organizationalRules: e.target.value }))}
                className="form-input min-h-[80px]" rows={3} placeholder="Two-term limit for president&#10;Annual general meeting required" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleSaveConfig} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0] disabled:opacity-50">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Config"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
