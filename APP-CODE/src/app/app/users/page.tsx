"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getAuthService } from "@/lib/services"
import type { MemsystUser, UserRole } from "@/types"
import { UserCog, X } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<MemsystUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editUser, setEditUser] = useState<MemsystUser | null>(null)
  const [resetUserId, setResetUserId] = useState<string | null>(null)
  const [resetPassword, setResetPassword] = useState("")
  const [form, setForm] = useState<{ email: string; password: string; name: string; role: UserRole }>({ email: "", password: "", name: "", role: "support_admin" })
  const [editForm, setEditForm] = useState<{ firstName: string; lastName: string; email: string; role: UserRole }>({ firstName: "", lastName: "", email: "", role: "support_admin" })

  async function loadUsers() {
    const svc = await getAuthService()
    const data = await svc.listUsers()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

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

  async function handleStatusChange(userId: string, status: "active" | "inactive" | "suspended") {
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
    { key: "role", header: "Role", render: (u) => <span className="capitalize text-gray-400">{u.role.replace(/_/g, " ")}</span> },
    { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
    {
      key: "actions", header: "", render: (u) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(u)} className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white">Edit</button>
          {u.status === "active" ? (
            <button onClick={() => handleStatusChange(u.id, "inactive")} className="rounded border border-yellow-500/30 px-2 py-1 text-xs text-yellow-400 hover:bg-yellow-500/10">Deactivate</button>
          ) : (
            <button onClick={() => handleStatusChange(u.id, "active")} className="rounded border border-green-500/30 px-2 py-1 text-xs text-green-400 hover:bg-green-500/10">Activate</button>
          )}
          <button onClick={() => { setResetUserId(u.id); setResetPassword("") }} className="rounded border border-[#1e3a5f] px-2 py-1 text-xs text-gray-400 hover:border-[#3CA4F9]/50 hover:text-white">Reset Pwd</button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage internal platform users"
        actions={
          <button onClick={() => setShowCreate(true)} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0]">
            + Create User
          </button>
        }
      />

      {showCreate && (
        <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Create New User</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="form-label">Password</label><input type="password" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><label className="form-label">Role</label>
              <select className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
                <option value="super_admin">Super Admin</option>
                <option value="operations_admin">Operations Admin</option>
                <option value="sales_admin">Sales Admin</option>
                <option value="support_admin">Support Admin</option>
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
                <option value="super_admin">Super Admin</option>
                <option value="operations_admin">Operations Admin</option>
                <option value="sales_admin">Sales Admin</option>
                <option value="support_admin">Support Admin</option>
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
        data={users}
        isLoading={loading}
        emptyMessage="No users found."
      />
    </div>
  )
}
