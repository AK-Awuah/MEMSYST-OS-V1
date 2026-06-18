"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getBusinessCategoryService } from "@/lib/services"
import type { BusinessCategory } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<BusinessCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", description: "", sortOrder: 0, status: "active" as BusinessCategory["status"], parentId: "" })

  const fetch = async () => {
    try {
      setLoading(true)
      const svc = await getBusinessCategoryService()
      const data = await svc.listCategories("tenant-1")
      setCategories(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const parentName = (id?: string) => {
    if (!id) return "-"
    const p = categories.find((c) => c.id === id)
    return p ? p.name : "-"
  }

  const handleSave = async () => {
    try {
      const svc = await getBusinessCategoryService()
      const payload = {
        ...form,
        tenantId: "tenant-1",
        parentId: form.parentId || undefined,
      }
      if (editing) {
        await svc.updateCategory(editing, payload)
      } else {
        await svc.createCategory(payload as Omit<BusinessCategory, "id" | "createdAt" | "updatedAt">)
      }
      setShowForm(false)
      setEditing(null)
      setForm({ name: "", description: "", sortOrder: 0, status: "active", parentId: "" })
      await fetch()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save category")
    }
  }

  const handleEdit = (cat: BusinessCategory) => {
    setForm({ name: cat.name, description: cat.description, sortOrder: cat.sortOrder, status: cat.status, parentId: cat.parentId || "" })
    setEditing(cat.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const svc = await getBusinessCategoryService()
      await svc.deleteCategory(id)
      await fetch()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete category")
    }
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const idx = categories.findIndex((c) => c.id === id)
    if (idx === -1) return
    const next = [...categories]
    const swapWith = direction === "up" ? idx - 1 : idx + 1
    if (swapWith < 0 || swapWith >= next.length) return
    ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
    const reordered = next.map((c, i) => ({ ...c, sortOrder: i }))
    try {
      const svc = await getBusinessCategoryService()
      await svc.reorderCategories("tenant-1", reordered.map((c) => c.id))
      setCategories(reordered)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reorder")
    }
  }

  const columns: Column<BusinessCategory>[] = [
    { key: "name", header: "Name", render: (c) => <span className="text-white font-medium">{c.name}</span> },
    { key: "description", header: "Description", render: (c) => <span className="text-gray-400 text-xs max-w-[200px] truncate block">{c.description || "-"}</span> },
    { key: "sortOrder", header: "Sort Order", render: (c) => <span className="text-gray-300">{c.sortOrder}</span> },
    {
      key: "status", header: "Status", render: (c) => (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.status === "active" ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-gray-500/15 text-gray-400 border-gray-500/30"}`}>
          {c.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "parentId", header: "Parent", render: (c) => <span className="text-gray-400 text-xs">{parentName(c.parentId)}</span> },
    {
      key: "actions", header: "", render: (c) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleReorder(c.id, "up")} disabled={categories.indexOf(c) === 0} className="rounded p-1 text-gray-400 hover:text-white disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
          <button onClick={() => handleReorder(c.id, "down")} disabled={categories.indexOf(c) === categories.length - 1} className="rounded p-1 text-gray-400 hover:text-white disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
          <button onClick={() => handleEdit(c)} className="rounded p-1 text-blue-400 hover:text-blue-300"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => handleDelete(c.id)} className="rounded p-1 text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Business Categories" description="Manage listing categories" />
        <div className="flex items-center justify-center py-16"><p className="text-sm text-gray-500">Loading categories...</p></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Business Categories" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Business Categories"
          description="Manage listing categories for the marketplace directory"
          actions={
            <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", description: "", sortOrder: categories.length, status: "active", parentId: "" }) }} className="flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90">
              <Plus className="h-4 w-4" /> New Category
            </button>
          }
        />
      </motion.div>

      {showForm && (
        <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{editing ? "Edit Category" : "New Category"}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Parent Category</label>
              <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
                <option value="">None (Top Level)</option>
                {categories.filter((c) => c.id !== editing).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BusinessCategory["status"] })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-400">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
            <button onClick={handleSave} className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90">{editing ? "Update" : "Create"}</button>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <DataTable columns={columns} data={categories} emptyMessage="No categories found. Create your first category above." />
      </motion.div>
    </motion.div>
  )
}
