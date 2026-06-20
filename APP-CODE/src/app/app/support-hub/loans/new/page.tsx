"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { LOAN_TYPES, LOAN_TYPE_LABELS, LOAN_REPAYMENT_FREQUENCIES, LOAN_REPAYMENT_FREQUENCY_LABELS } from "@/lib/constants"
import { getSupportHubService } from "@/lib/services"
import type { LoanType, LoanRepaymentFrequency } from "@/types"

export default function NewLoanPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [memberId, setMemberId] = useState("")
  const [loanType, setLoanType] = useState<LoanType>("personal")
  const [amount, setAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [repaymentPeriod, setRepaymentPeriod] = useState("")
  const [repaymentFrequency, setRepaymentFrequency] = useState<LoanRepaymentFrequency>("monthly")
  const [purpose, setPurpose] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
    if (!memberId || !amount || !interestRate || !repaymentPeriod || !purpose) return
    setSubmitting(true)
    try {
      const svc = await getSupportHubService()
      await svc.createLoan({
        tenantId: "tenant-1",
        memberId,
        memberName: "",
        loanType,
        amountRequested: parseFloat(amount),
        interestRate: parseFloat(interestRate),
        repaymentPeriod: parseInt(repaymentPeriod, 10),
        repaymentFrequency,
        amountPaid: 0,
        balance: 0,
        purpose,
        status: "pending",
        applicationDate: new Date().toISOString(),
        notes: description || "",
      })
      setSuccess(true)
      setTimeout(() => router.push("/app/support-hub/loans"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create loan")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Save className="h-8 w-8 text-green-400" />
        </div>
        <p className="text-lg font-medium text-white">Loan created successfully!</p>
        <p className="text-sm text-gray-400">Redirecting to loans list...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Loans
      </button>

      <PageHeader title="New Loan" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Member ID</label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Member identifier"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Loan Type</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value as LoanType)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            >
              {LOAN_TYPES.map((t) => (
                <option key={t} value={t}>{LOAN_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Repayment Period</label>
            <input
              type="number"
              value={repaymentPeriod}
              onChange={(e) => setRepaymentPeriod(e.target.value)}
              placeholder="Number of installments"
              min="1"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Repayment Frequency</label>
          <select
            value={repaymentFrequency}
            onChange={(e) => setRepaymentFrequency(e.target.value as LoanRepaymentFrequency)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
          >
            {LOAN_REPAYMENT_FREQUENCIES.map((f) => (
              <option key={f} value={f}>{LOAN_REPAYMENT_FREQUENCY_LABELS[f]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Purpose</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Purpose of the loan"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional notes or description"
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !memberId || !amount || !interestRate || !repaymentPeriod || !purpose}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Loan"}
        </button>
      </div>
    </div>
  )
}
