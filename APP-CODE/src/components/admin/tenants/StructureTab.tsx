"use client"

import type { Tenant, OrganizationalUnit, Region, Branch } from "@/types"
import { useState, useEffect } from "react"
import { getOrganizationStructureService } from "@/lib/services"
import { Loader2, Plus, X, ChevronDown, ChevronRight, Building2, MapPin, GitBranch } from "lucide-react"

export function StructureTab({ tenant }: { tenant: Tenant }) {
  const [orgUnits, setOrgUnits] = useState<OrganizationalUnit[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set())

  const [showRegionForm, setShowRegionForm] = useState(false)
  const [showBranchForm, setShowBranchForm] = useState(false)
  const [regionForm, setRegionForm] = useState({ name: "", code: "" })
  const [branchForm, setBranchForm] = useState({ regionId: "", name: "", code: "", location: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [tenant.id])

  async function loadData() {
    const svc = await getOrganizationStructureService()
    const [u, r, b] = await Promise.all([
      svc.listOrgUnits(tenant.id),
      svc.listRegions(tenant.id),
      svc.listBranches(tenant.id),
    ])
    setOrgUnits(u)
    setRegions(r)
    setBranches(b)
    setLoading(false)
  }

  async function handleCreateRegion() {
    if (!regionForm.name || !regionForm.code) return
    const svc = await getOrganizationStructureService()
    await svc.createRegion({ tenantId: tenant.id, name: regionForm.name, code: regionForm.code, status: "active" })
    setRegionForm({ name: "", code: "" })
    setShowRegionForm(false)
    loadData()
  }

  async function handleCreateBranch() {
    if (!branchForm.name || !branchForm.code || !branchForm.regionId) return
    const svc = await getOrganizationStructureService()
    await svc.createBranch({ tenantId: tenant.id, regionId: branchForm.regionId, name: branchForm.name, code: branchForm.code, location: branchForm.location, status: "active" })
    setBranchForm({ regionId: "", name: "", code: "", location: "" })
    setShowBranchForm(false)
    loadData()
  }

  async function handleDeactivateRegion(id: string) {
    const svc = await getOrganizationStructureService()
    await svc.deactivateRegion(id)
    loadData()
  }

  async function handleDeactivateBranch(id: string) {
    const svc = await getOrganizationStructureService()
    await svc.deactivateBranch(id)
    loadData()
  }

  function toggleRegion(id: string) {
    setExpandedRegions((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Organizational Hierarchy</h3>
        {orgUnits.length === 0 ? (
          <p className="text-sm text-gray-500">No organizational units configured.</p>
        ) : (
          <div className="space-y-2">
            {orgUnits.filter((u) => !u.parentId).map((national) => (
              <OrgUnitNode key={national.id} unit={national} allUnits={orgUnits} depth={0} />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Regions <span className="ml-2 text-sm font-normal text-gray-500">({regions.length})</span>
          </h3>
          <button onClick={() => setShowRegionForm(!showRegionForm)}
            className="flex items-center gap-1 rounded-lg bg-[#3CA4F9] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3594e0]"
          >
            <Plus className="h-3 w-3" /> Add Region
          </button>
        </div>

        {showRegionForm && (
          <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
            <div>
              <label className="form-label text-xs">Region Name</label>
              <input value={regionForm.name} onChange={(e) => setRegionForm((f) => ({ ...f, name: e.target.value }))} className="form-input text-sm" placeholder="e.g. Greater Accra" />
            </div>
            <div>
              <label className="form-label text-xs">Code</label>
              <input value={regionForm.code} onChange={(e) => setRegionForm((f) => ({ ...f, code: e.target.value }))} className="form-input text-sm w-24 uppercase" placeholder="GA" />
            </div>
            <button onClick={handleCreateRegion} disabled={!regionForm.name || !regionForm.code} className="rounded-lg bg-[#3CA4F9] px-3 py-2 text-xs font-medium text-white disabled:opacity-50">Create</button>
            <button onClick={() => setShowRegionForm(false)} className="rounded-lg border border-[#1e3a5f] px-3 py-2 text-xs text-gray-400">Cancel</button>
          </div>
        )}

        {regions.length === 0 ? (
          <p className="text-sm text-gray-500">No regions configured.</p>
        ) : (
          <div className="space-y-2">
            {regions.map((region) => {
              const regionBranches = branches.filter((b) => b.regionId === region.id)
              const isExpanded = expandedRegions.has(region.id)
              return (
                <div key={region.id} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B]">
                  <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => toggleRegion(region.id)} className="flex items-center gap-2 text-sm text-white hover:text-[#3CA4F9]">
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                      <MapPin className="h-4 w-4 text-[#3CA4F9]" />
                      <span className="font-medium">{region.name}</span>
                      <span className="rounded bg-[#1e3a5f] px-1.5 py-0.5 text-xs text-gray-400">{region.code}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${region.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>{region.status}</span>
                    </button>
                    <button onClick={() => handleDeactivateRegion(region.id)} className="text-xs text-red-400 hover:text-red-300">
                      Deactivate
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-[#1e3a5f] px-4 py-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Branches ({regionBranches.length})</span>
                        <button onClick={() => { setBranchForm((f) => ({ ...f, regionId: region.id })); setShowBranchForm(true) }} className="text-xs text-[#3CA4F9] hover:underline">+ Add Branch</button>
                      </div>
                      {regionBranches.length === 0 ? (
                        <p className="text-xs text-gray-500">No branches in this region.</p>
                      ) : (
                        <div className="space-y-1">
                          {regionBranches.map((branch) => (
                            <div key={branch.id} className="flex items-center justify-between rounded border border-[#1e3a5f] px-3 py-2">
                              <div className="flex items-center gap-2 text-sm">
                                <GitBranch className="h-3 w-3 text-gray-500" />
                                <span className="text-gray-300">{branch.name}</span>
                                <span className="text-xs text-gray-600">({branch.code})</span>
                                <span className="text-xs text-gray-600">— {branch.location}</span>
                                <span className={`rounded-full px-1.5 py-0.5 text-xs ${branch.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>{branch.status}</span>
                              </div>
                              <button onClick={() => handleDeactivateBranch(branch.id)} className="text-xs text-red-400 hover:text-red-300">Deactivate</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showBranchForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Add Branch</h3>
              <button onClick={() => setShowBranchForm(false)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Region</label>
                <select value={branchForm.regionId} onChange={(e) => setBranchForm((f) => ({ ...f, regionId: e.target.value }))} className="form-input">
                  <option value="">Select region...</option>
                  {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Branch Name</label>
                <input value={branchForm.name} onChange={(e) => setBranchForm((f) => ({ ...f, name: e.target.value }))} className="form-input" placeholder="e.g. Accra Central" />
              </div>
              <div>
                <label className="form-label">Code</label>
                <input value={branchForm.code} onChange={(e) => setBranchForm((f) => ({ ...f, code: e.target.value }))} className="form-input uppercase" placeholder="ACC-C" />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input value={branchForm.location} onChange={(e) => setBranchForm((f) => ({ ...f, location: e.target.value }))} className="form-input" placeholder="Accra" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleCreateBranch} disabled={!branchForm.name || !branchForm.code || !branchForm.regionId} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Create Branch</button>
              <button onClick={() => setShowBranchForm(false)} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OrgUnitNode({ unit, allUnits, depth }: { unit: OrganizationalUnit; allUnits: OrganizationalUnit[]; depth: number }) {
  const children = allUnits.filter((u) => u.parentId === unit.id)
  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-4 py-2.5" style={{ marginLeft: depth * 20 }}>
        <Building2 className="h-4 w-4 text-[#3CA4F9]" />
        <span className="text-sm font-medium text-white">{unit.name}</span>
        <span className="rounded bg-[#1e3a5f] px-1.5 py-0.5 text-xs text-gray-400 capitalize">{unit.type}</span>
        <span className={`rounded-full px-1.5 py-0.5 text-xs ${unit.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>{unit.status}</span>
      </div>
      {children.length > 0 && (
        <div className="mt-1 space-y-1">
          {children.map((child) => <OrgUnitNode key={child.id} unit={child} allUnits={allUnits} depth={depth + 1} />)}
        </div>
      )}
    </div>
  )
}
