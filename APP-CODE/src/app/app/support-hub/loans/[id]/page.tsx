"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Send, Plus, Loader2 } from "lucide-react"
import { PageHeader, DataTable, StatusBadge } from "@/components/admin"
import type { Column } from "@/components/admin"
import { LOAN_TYPE_LABELS, LOAN_REPAYMENT_FREQUENCY_LABELS } from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { Loan, LoanRepayment } from "@/types"

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loan, setLoan] = useState<Loan | null>(null)
  const [repayments, setRepayments] = useState<LoanRepayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [approving, setApproving] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [amountApproved, setAmountApproved] = useState("")

  const [disbursing, setDisbursing] = useState(false)

  const [showRepaymentModal, setShowRepaymentModal] = useState(false)
  const [repaymentAmount, setRepaymentAmount] = useState("")
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getSupportHubService()
        const [loanData, repayData] = await Promise.all([
          svc.getLoan(id),
          svc.getLoanRepayments(id),
        ])
        if (!cancelled) {
          setLoan(loanData)
          setRepayments(repayData)
          if (loanData) setAmountApproved(loanData.amountRequested.toString())
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load loan")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleApprove = async () => {
    if (!amountApproved) return
    setApproving(true)
    try {
      const svc = await getSupportHubService()
      await svc.approveLoan(id, parseFloat(amountApproved))
      const data = await svc.getLoan(id)
      setLoan(data)
      setShowApproveModal(false)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to approve loan")
    } finally {
      setApproving(false)
    }
  }

  const handleDisburse = async () => {
    setDisbursing(true)
    try {
      const svc = await getSupportHubService()
      await svc.disburseLoan(id)
      const data = await svc.getLoan(id)
      setLoan(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to disburse loan")
    } finally {
      setDisbursing(false)
    }
  }

  const handleRecordRepayment = async () => {
    if (!repaymentAmount) return
    setRecording(true)
    try {
      const svc = await getSupportHubService()
      await svc.recordRepayment(id, {
        loanId: id,
        tenantId: "tenant-1",
        memberId: loan!.memberId,
        amount: parseFloat(repaymentAmount),
        principalPortion: parseFloat(repaymentAmount),
        interestPortion: 0,
        dueDate: new Date().toISOString(),
        paidDate: new Date().toISOString(),
        status: "paid",
      })
      const [loanData, repayData] = await Promise.all([
        svc.getLoan(id),
        svc.getLoanRepayments(id),
      ])
      setLoan(loanData)
      setRepayments(repayData)
      setShowRepaymentModal(false)
      setRepaymentAmount("")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to record repayment")
    } finally {
      setRecording(false)
    }
  }

  const repaymentColumns: Column<LoanRepayment>[] = [
    { key: "id", header: "ID", render: (r) => <span className="font-mono text-white">{r.id.slice(0, 8)}...</span> },
    { key: "amount", header: "Amount", render: (r) => <span className="text-white">${r.amount.toLocaleString()}</span> },
    { key: "principalPortion", header: "Principal", render: (r) => <span className="text-gray-400">${r.principalPortion.toLocaleString()}</span> },
    { key: "interestPortion", header: "Interest", render: (r) => <span className="text-gray-400">${r.interestPortion.toLocaleString()}</span> },
    { key: "dueDate", header: "Due Date", render: (r) => <span className="text-gray-400">{new Date(r.dueDate).toLocaleDateString()}</span> },
    { key: "paidDate", header: "Paid Date", render: (r) => <span className="text-gray-400">{r.paidDate ? new Date(r.paidDate).toLocaleDateString() : "-"}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading loan...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      </div>
    )
  }

  if (!loan) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          Loan not found.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Loans
      </button>

      <PageHeader
        title={`Loan ${loan.id.slice(0, 8)}...`}
        description={`${loan.memberName || loan.memberId} - ${LOAN_TYPE_LABELS[loan.loanType]}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Loan Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Loan ID</p>
                <p className="text-sm font-medium text-white mt-1 font-mono">{loan.id}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Member</p>
                <p className="text-sm font-medium text-white mt-1">{loan.memberName || loan.memberId}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Loan Type</p>
                <p className="text-sm font-medium text-white mt-1">{LOAN_TYPE_LABELS[loan.loanType]}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={loan.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Amount Requested</p>
                <p className="text-sm font-medium text-white mt-1">${loan.amountRequested.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Amount Approved</p>
                <p className="text-sm font-medium text-white mt-1">{loan.amountApproved ? `$${loan.amountApproved.toLocaleString()}` : "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Interest Rate</p>
                <p className="text-sm font-medium text-white mt-1">{loan.interestRate}%</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Repayment Period</p>
                <p className="text-sm font-medium text-white mt-1">{loan.repaymentPeriod} installments</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Repayment Frequency</p>
                <p className="text-sm font-medium text-white mt-1">{LOAN_REPAYMENT_FREQUENCY_LABELS[loan.repaymentFrequency]}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Installment Amount</p>
                <p className="text-sm font-medium text-white mt-1">{loan.installmentAmount ? `$${loan.installmentAmount.toFixed(2)}` : "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Total Repayable</p>
                <p className="text-sm font-medium text-white mt-1">{loan.totalRepayable ? `$${loan.totalRepayable.toLocaleString()}` : "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="text-sm font-medium text-white mt-1">${loan.amountPaid.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Balance</p>
                <p className="text-sm font-medium text-white mt-1">${loan.balance.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Application Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(loan.applicationDate).toLocaleDateString()}</p>
              </div>
            </div>
            {loan.purpose && (
              <div className="mt-4 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Purpose</p>
                <p className="text-sm font-medium text-white mt-1">{loan.purpose}</p>
              </div>
            )}
            {loan.notes && (
              <div className="mt-3 p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Notes</p>
                <p className="text-sm font-medium text-white mt-1">{loan.notes}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Repayment History</h3>
            <DataTable
              columns={repaymentColumns}
              data={repayments}
              emptyMessage="No repayments recorded yet."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {loan.status === "under_review" && (
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/80 text-sm text-white hover:bg-green-500 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" /> Approve Loan
                </button>
              )}
              {loan.status === "approved" && (
                <button
                  onClick={handleDisburse}
                  disabled={disbursing}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {disbursing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {disbursing ? "Dispursing..." : "Disburse Loan"}
                </button>
              )}
              {(loan.status === "disbursed" || loan.status === "repaying") && (
                <button
                  onClick={() => setShowRepaymentModal(true)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Record Repayment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Approve Loan</h3>
            <p className="text-sm text-gray-400 mb-4">Set the approved amount for this loan.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Approved Amount ($)</label>
              <input
                type="number"
                value={amountApproved}
                onChange={(e) => setAmountApproved(e.target.value)}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={approving || !amountApproved}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-sm text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {approving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                {approving ? "Approving..." : "Confirm Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRepaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Record Repayment</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount ($)</label>
              <input
                type="number"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowRepaymentModal(false); setRepaymentAmount("") }}
                className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordRepayment}
                disabled={recording || !repaymentAmount}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3CA4F9] text-sm text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {recording ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {recording ? "Recording..." : "Record Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
