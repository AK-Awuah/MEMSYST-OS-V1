"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, DollarSign, Search } from "lucide-react"
import { PageHeader, DataTable, StatCard, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { LOAN_STATUSES, LOAN_STATUS_LABELS, LOAN_TYPE_LABELS } from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { Loan } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LoansPage() {
  const router = useRouter()
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const data = await svc.listLoans("tenant-1", { status: "all" })
        if (!cancelled) setLoans(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load loans")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => ({
    total: loans.length,
    active: loans.filter((l) => l.status === "repaying" || l.status === "disbursed").length,
    disbursed: loans.filter((l) => l.status === "disbursed").length,
    defaulted: loans.filter((l) => l.status === "defaulted").length,
  }), [loans])

  const filtered = useMemo(() => {
    let result = loans
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(
        (l) => l.memberName?.toLowerCase().includes(s) || l.id.toLowerCase().includes(s)
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter)
    }
    return result
  }, [search, statusFilter, loans])

  const columns: Column<Loan>[] = [
    {
      key: "id",
      header: "Loan ID",
      render: (l) => <span className="font-medium text-white font-mono">{l.id.slice(0, 8)}...</span>,
    },
    {
      key: "memberId",
      header: "Member ID",
      render: (l) => <span className="text-gray-300">{l.memberId}</span>,
    },
    {
      key: "amountRequested",
      header: "Amount",
      render: (l) => <span className="text-white">${l.amountRequested.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (l) => <StatusBadge status={l.status} />,
    },
    {
      key: "loanType",
      header: "Type",
      render: (l) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#1e3a5f]/30 px-2.5 py-0.5 text-xs font-medium text-[#3CA4F9] capitalize">
          {LOAN_TYPE_LABELS[l.loanType] || l.loanType}
        </span>
      ),
    },
    {
      key: "applicationDate",
      header: "Created Date",
      render: (l) => <span className="text-gray-400">{new Date(l.applicationDate).toLocaleDateString()}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loans" description="Manage member loans and repayments" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Loans" value="-" icon={<DollarSign className="h-5 w-5" />} />
          <StatCard title="Active" value="-" icon={<DollarSign className="h-5 w-5" />} />
          <StatCard title="Disbursed" value="-" icon={<DollarSign className="h-5 w-5" />} />
          <StatCard title="Defaulted" value="-" icon={<DollarSign className="h-5 w-5" />} />
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Loading loans...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loans" />
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
          title="Loans"
          description="Manage member loans and repayments"
          actions={
            <Link
              href="/app/support-hub/loans/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Loan
            </Link>
          }
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Loans" value={stats.total} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Active" value={stats.active} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Disbursed" value={stats.disbursed} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Defaulted" value={stats.defaulted} icon={<DollarSign className="h-5 w-5" />} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by member name or loan ID..."
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
          {LOAN_STATUSES.map((s) => (
            <option key={s} value={s}>{LOAN_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(l) => router.push(`/app/support-hub/loans/${l.id}`)}
          emptyMessage="No loans found."
        />
      </motion.div>
    </motion.div>
  )
}
