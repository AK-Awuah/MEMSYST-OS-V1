"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, CreditCard, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { ID_CARD_STATUS_LABELS, ID_CARD_STATUSES } from "@/lib/constants"
import { getIDCardService } from "@/lib/services"
import type { IDCard, IDCardStatus } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function IDCardsPage() {
  const router = useRouter()
  const [cards, setCards] = useState<IDCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getIDCardService()
        const data = await svc.listIDCards("tenant-1")
        if (!cancelled) setCards(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load ID cards")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: cards.length,
    active: cards.filter((c) => c.status === "active").length,
    unprinted: cards.filter((c) => c.status === "unprinted").length,
    reprinted: cards.filter((c) => c.status === "reprinted").length,
  }), [cards])

  const filtered = useMemo(() => {
    let result = cards
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(
        (c) => c.fullName.toLowerCase().includes(s) || c.cardNumber.toLowerCase().includes(s)
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }
    return result
  }, [search, statusFilter, cards])

  const columns: Column<IDCard>[] = [
    {
      key: "cardNumber",
      header: "Card Number",
      render: (c) => <span className="font-medium text-white font-mono">{c.cardNumber}</span>,
    },
    {
      key: "fullName",
      header: "Full Name",
      render: (c) => <span className="text-white">{c.fullName}</span>,
    },
    {
      key: "ownerType",
      header: "Type",
      render: (c) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {c.ownerType}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: "issueDate",
      header: "Issue Date",
      render: (c) => <span className="text-gray-400">{new Date(c.issueDate).toLocaleDateString()}</span>,
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
      render: (c) => <span className="text-gray-400">{new Date(c.expiryDate).toLocaleDateString()}</span>,
    },
    {
      key: "reprintCount",
      header: "Reprints",
      render: (c) => <span className="text-gray-400">{c.reprintCount}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="ID Cards" description="Manage member and staff ID cards" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Cards" value="-" icon={<CreditCard className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<CreditCard className="h-5 w-5" />} />
          <StatCard title="Unprinted" value="-" icon={<CreditCard className="h-5 w-5" />} />
          <StatCard title="Reprinted" value="-" icon={<CreditCard className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading ID cards...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="ID Cards" />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="ID Cards"
          description="Manage member and staff ID cards"
          actions={
            <Link
              href="/app/credentials/id-cards/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New ID Card
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Cards" value={stats.total} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Unprinted" value={stats.unprinted} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Reprinted" value={stats.reprinted} icon={<CreditCard className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or card number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white"
        >
          <option value="all">All Statuses</option>
          {ID_CARD_STATUSES.map((s) => (
            <option key={s} value={s}>{ID_CARD_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(c) => router.push(`/app/credentials/id-cards/${c.id}`)}
          emptyMessage="No ID cards found."
        />
      </motion.div>
    </motion.div>
  )
}
