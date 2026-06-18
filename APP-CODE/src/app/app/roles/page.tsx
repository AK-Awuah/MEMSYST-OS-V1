"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { getRoleService, getPermissionService } from "@/lib/services"
import { useAuth } from "@/features/auth/AuthContext"
import type { Role, Permission } from "@/types"
import { Shield, X, Copy, Ban } from "lucide-react"

export default function RolesPage() {
  const { user } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissionsByGroup, setPermissionsByGroup] = useState<Record<string, Permission[]>>({})
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editRoleId, setEditRoleId] = useState<string | null>(null)
  const [cloneRoleId, setCloneRoleId] = useState<string | null>(null)
  const [assignRoleId, setAssignRoleId] = useState<string | null>(null)

  const [createForm, setCreateForm] = useState<{ name: string; description: string; permissions: string[] }>({ name: "", description: "", permissions: [] })
  const [editForm, setEditForm] = useState<{ name: string; description: string }>({ name: "", description: "" })
  const [cloneName, setCloneName] = useState("")
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])

  const tenantId = user?.tenantId || "memsyst"

  async function loadRoles() {
    const svc = await getRoleService()
    const data = await svc.listRoles(tenantId)
    setRoles(data)
    setLoading(false)
  }

  async function loadPermissions() {
    const svc = await getPermissionService()
    const groups = await svc.listByGroup()
    setPermissionsByGroup(groups)
  }

  useEffect(() => {
    loadRoles()
    loadPermissions()
  }, [])

  function togglePermission(perm: string) {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  function openEdit(role: Role) {
    setEditRoleId(role.id)
    setEditForm({ name: role.name, description: role.description })
  }

  async function handleCreate() {
    const svc = await getRoleService()
    const role = await svc.createRole({
      tenantId,
      name: createForm.name,
      description: createForm.description,
      isSystem: false,
      permissions: [],
    })
    if (selectedPerms.length > 0) {
      await svc.assignPermissions(role.id, selectedPerms)
    }
    setShowCreate(false)
    setCreateForm({ name: "", description: "", permissions: [] })
    setSelectedPerms([])
    loadRoles()
  }

  async function handleEditSave() {
    if (!editRoleId) return
    const svc = await getRoleService()
    await svc.updateRole(editRoleId, editForm)
    setEditRoleId(null)
    loadRoles()
  }

  async function handleClone() {
    if (!cloneRoleId || !cloneName) return
    const svc = await getRoleService()
    await svc.cloneRole(cloneRoleId, cloneName)
    setCloneRoleId(null)
    setCloneName("")
    loadRoles()
  }

  async function handleDeactivate(id: string) {
    const svc = await getRoleService()
    await svc.deactivateRole(id)
    loadRoles()
  }

  function openAssign(role: Role) {
    setAssignRoleId(role.id)
    setSelectedPerms([...role.permissions])
  }

  async function handleAssignSave() {
    if (!assignRoleId) return
    const svc = await getRoleService()
    await svc.assignPermissions(assignRoleId, selectedPerms)
    setAssignRoleId(null)
    setSelectedPerms([])
    loadRoles()
  }

  const columns: Column<Role>[] = [
    {
      key: "name",
      header: "Role Name",
      render: (r) => (
        <div>
          <span className="font-medium text-white">{r.name}</span>
          {r.isSystem && <span className="ml-2 rounded bg-[#3CA4F9]/10 px-1.5 py-0.5 text-[10px] text-[#3CA4F9]">SYSTEM</span>}
        </div>
      ),
    },
    { key: "description", header: "Description", render: (r) => <span className="text-gray-400">{r.description}</span> },
    { key: "permissions", header: "Permissions", render: (r) => <span className="text-gray-500 text-sm">{r.permissions.length} assigned</span> },
    {
      key: "actions", header: "", render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white">Edit</button>
          <button onClick={() => openAssign(r)} className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white">Permissions</button>
          <button onClick={() => { setCloneRoleId(r.id); setCloneName(`${r.name} (Copy)`) }} className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white"><Copy className="inline h-3 w-3 mr-0.5" />Clone</button>
          <button onClick={() => handleDeactivate(r.id)} className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"><Ban className="inline h-3 w-3 mr-0.5" />Deactivate</button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Role Management"
        description="Define roles and assign permissions to control system access"
        actions={
          <button onClick={() => setShowCreate(true)} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0]">
            + Create Role
          </button>
        }
      />

      {showCreate && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Create New Role</h3>
            <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="form-label">Role Name</label><input className="form-input" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="e.g. Finance Admin" /></div>
            <div><label className="form-label">Description</label><input className="form-input" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} placeholder="What this role can do" /></div>
          </div>
          <div className="mt-4">
            <label className="form-label mb-2">Assign Permissions</label>
            <PermissionGrid groups={permissionsByGroup} selected={selectedPerms} onToggle={togglePermission} />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleCreate} disabled={!createForm.name} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Create Role</button>
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {editRoleId && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Edit Role</h3>
            <button onClick={() => setEditRoleId(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="form-label">Role Name</label><input className="form-input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
            <div><label className="form-label">Description</label><input className="form-input" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /></div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleEditSave} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white">Save</button>
            <button onClick={() => setEditRoleId(null)} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {cloneRoleId && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Clone Role</h3>
            <button onClick={() => setCloneRoleId(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="form-label">New Role Name</label><input className="form-input" value={cloneName} onChange={(e) => setCloneName(e.target.value)} /></div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleClone} disabled={!cloneName} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Clone Role</button>
            <button onClick={() => setCloneRoleId(null)} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {assignRoleId && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Assign Permissions</h3>
            <button onClick={() => { setAssignRoleId(null); setSelectedPerms([]) }} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="mb-3 flex gap-2">
            <button onClick={() => {
              const all = Object.values(permissionsByGroup).flat().map((p) => p.key)
              setSelectedPerms(all)
            }} className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:text-white">Select All</button>
            <button onClick={() => setSelectedPerms([])} className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:text-white">Clear All</button>
          </div>
          <PermissionGrid groups={permissionsByGroup} selected={selectedPerms} onToggle={togglePermission} />
          <div className="mt-4 flex gap-3">
            <button onClick={handleAssignSave} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white">Save Permissions</button>
            <button onClick={() => { setAssignRoleId(null); setSelectedPerms([]) }} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={roles}
        isLoading={loading}
        emptyMessage="No roles defined yet."
      />
    </div>
  )
}

function PermissionGrid({ groups, selected, onToggle }: { groups: Record<string, Permission[]>; selected: string[]; onToggle: (key: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Object.entries(groups).map(([groupName, perms]) => (
        <div key={groupName} className="rounded-lg border border-[#1e3a5f] bg-[#011B2B]/50 p-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#3CA4F9]">{groupName}</h4>
          <div className="space-y-1.5">
            {perms.map((perm) => (
              <label key={perm.key} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-[#1e3a5f]/30">
                <input
                  type="checkbox"
                  checked={selected.includes(perm.key)}
                  onChange={() => onToggle(perm.key)}
                  className="h-3.5 w-3.5 rounded border-[#1e3a5f] bg-[#011B2B] text-[#3CA4F9] accent-[#3CA4F9]"
                />
                <span className="text-gray-300">{perm.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
