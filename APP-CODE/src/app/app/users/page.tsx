"use client"

import { useState, useEffect, useMemo } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getAuthService } from "@/lib/services"
import type { MemsystUser, UserRole, UserStatus } from "@/types"
import { UserCog, X, Search, Filter } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<MemsystUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all")
  const [showCreate, setShowCreate] = useState(false)
  const [editUser, setEditUser] = useState<MemsystUser | null>(null)
  const [resetUserId, setResetUserId] = useState<string | null>(null)
  const [resetPassword, setResetPassword] = useState("")
  const [form, setForm] = useState<{ email: string; password: string; name: string; role: UserRole }>({ email: "", password: "", name: "", role: "support_admin" })
  const [editForm, setEditForm] = useState<{ firstName: string; lastName: string; email: string; role: UserRole }>({ firstName: "", lastName: "", email: "", role: "support_admin" })

  const allRoles: UserRole[] = ["super_admin", "operations_admin", "sales_admin", "support_admin"]
  const allStatuses: UserStatus[] = ["active", "inactive", "suspended", "archived", "pending_verification"]

  async function loadUsers() {
    const svc = await getAuthService()
    const data = await svc.listUsers()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = useMemo(() => {
    let result = [...users]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          (u.username || "").toLowerCase().includes(q)
      )
    }
    if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter)
    if (statusFilter !== "all") result = result.filter((u) => u.status === statusFilter)
    return result
  }, [users, search, roleFilter, statusFilter])

  async function handleCreate() {
    const svc = await getAuthService()
    await svc.createUser(form.email, form.password, form.name, form.role)
    setShowCreate(false)
    setForm({ email: "", password: "", name: "", role: "support_admin" })
    loadUsers()
  }

  function openEdit(user: MemsystUser) {
    setEditUser(user)
    setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role })
  }

  async function handleEditSave() {
    if (!editUser) return
    const svc = await getAuthService()
    await svc.updateUser(editUser.id, editForm)
    setEditUser(null)
    loadUsers()
  }

  async function handleStatusChange(userId: string, status: UserStatus) {
    const svc = await getAuthService()
    await svc.updateUser(userId, { status } as Partial<MemsystUser>)
    loadUsers()
  }

  async function handleResetPassword() {
    if (!resetUserId || !resetPassword) return
    const svc = await getAuthService()
    await svc.adminResetPassword(resetUserId, resetPassword)
    setResetUserId(null)
    setResetPassword("")
  }

  const columns: Column<MemsystUser>[] = [
    { key: "name", header: "Name", render: (u) => <span className="font-medium text-white">{u.firstName} {u.lastName}</span> },
    { key: "email", header: "Email" },
    { key: "username", header: "Username", render: (u) => <span className="text-gray-500 text-sm">{u.username || "—"}</span> },
    { key: "role", header: "Role", render: (u) => <span className="capitalize text-gray-400">{u.role.replace(/_/g, " ")}</span> },
    { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
    { key: "lastLogin", header: "Last Login", render: (u) => <span className="text-sm text-gray-500">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}</span> },
    {
      key: "actions", header: "", render: (u) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(u)} className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white">Edit</button>
          {u.status === "active" ? (
            <button onClick={() => handleStatusChange(u.id, "inactive")} className="rounded border border-yellow-500/30 px-2 py-1 text-xs text-yellow-400 hover:bg-yellow-500/10">Deactivate</button>
          ) : u.status === "inactive" ? (
            <>
              <button onClick={() => handleStatusChange(u.id, "active")} className="rounded border border-green-500/30 px-2 py-1 text-xs text-green-400 hover:bg-green-500/10">Activate</button>
              <button onClick={() => handleStatusChange(u.id, "suspended")} className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">Suspend</button>
            </>
          ) : (
            <button onClick={() => handleStatusChange(u.id, "active")} className="rounded border border-green-500/30 px-2 py-1 text-xs text-green-400 hover:bg-green-500/10">Reactivate</button>
          )}
          <button onClick={() => { setResetUserId(u.id); setResetPassword("") }} className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white">Reset Pwd</button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="User Directory"
        description="Manage platform users — search, filter, create, and manage accounts"
        actions={
          <button onClick={() => setShowCreate(true)} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0]">
            + Create User
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, username..."
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9]/50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
            className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-300 focus:border-[#3CA4F9]/50 focus:outline-none"
          >
            <option value="all">All Roles</option>
            {allRoles.map((r) => (
              <option key={r} value={r}>{r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | "all")}
            className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-gray-300 focus:border-[#3CA4F9]/50 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {allStatuses.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-500">{filtered.length} of {users.length} users</span>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Create New User</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="form-label">Password</label><input type="password" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><label className="form-label">Role</label>
              <select className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
                {allRoles.map((r) => (
                  <option key={r} value={r}>{r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleCreate} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white">Create</button>
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {editUser && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Edit User: {editUser.firstName} {editUser.lastName}</h3>
            <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><label className="form-label">First Name</label><input className="form-input" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} /></div>
            <div><label className="form-label">Last Name</label><input className="form-input" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} /></div>
            <div><label className="form-label">Email</label><input type="email" className="form-input" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
            <div><label className="form-label">Role</label>
              <select className="form-input" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}>
                {allRoles.map((r) => (
                  <option key={r} value={r}>{r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleEditSave} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white">Save</button>
            <button onClick={() => setEditUser(null)} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {resetUserId && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Reset Password</h3>
          <div className="flex gap-3">
            <input
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              placeholder="New password (min. 8 chars)"
              className="flex-1 rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9]/50 focus:outline-none"
              minLength={8}
            />
            <button onClick={handleResetPassword} disabled={!resetPassword} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Reset</button>
            <button onClick={() => setResetUserId(null)} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        emptyMessage="No users match your search criteria."
      />
    </div>
  )
}
