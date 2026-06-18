"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, ArrowRightLeft, ArrowUp } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getApprenticeService, getMemberService } from "@/lib/services"
import { APPRENTICE_STATUS_LABELS } from "@/lib/constants"
import type { Apprentice, Member, TransferRecord, UpgradeRequest } from "@/types"

export default function ApprenticeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [apprentice, setApprentice] = useState<Apprentice | null>(null)
  const [parentMember, setParentMember] = useState<Member | null>(null)
  const [transfers, setTransfers] = useState<TransferRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [transferForm, setTransferForm] = useState({ newMemberId: "", reason: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [apprSvc, memSvc] = await Promise.all([getApprenticeService(), getMemberService()])
        const appr = await apprSvc.getApprentice(params.id as string)
        if (!appr) { setLoading(false); return }
        setApprentice(appr)
        const [parent, history] = await Promise.all([
          memSvc.getMember(appr.parentMemberId),
          apprSvc.getTransferHistory(appr.id),
        ])
        setParentMember(parent)
        setTransfers(history)
      } catch {
        setError("Failed to load apprentice")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  async function handleTransfer() {
    if (!apprentice || !transferForm.newMemberId || !transferForm.reason) return
    const svc = await getApprenticeService()
    await svc.requestTransfer(apprentice.id, transferForm.newMemberId, transferForm.reason, "admin")
    setShowTransfer(false)
    setTransferForm({ newMemberId: "", reason: "" })
  }

  async function handleUpgrade() {
    if (!apprentice) return
    const svc = await getApprenticeService()
    await svc.requestUpgrade(apprentice.id, "admin")
    setShowUpgrade(false)
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
  if (error || !apprentice) return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error || "Apprentice not found"}</div>

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${apprentice.firstName} ${apprentice.lastName}`}
        description={apprentice.trade}
        actions={<button onClick={() => router.push("/app/apprentices")} className="flex items-center gap-1.5 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Apprentice Information</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-400">Name:</span> <span className="text-white">{apprentice.firstName} {apprentice.lastName}</span></div>
            <div><span className="text-gray-400">Status:</span> <span className={`${apprentice.status === "active" ? "text-green-400" : "text-yellow-400"}`}>{APPRENTICE_STATUS_LABELS[apprentice.status]}</span></div>
            <div><span className="text-gray-400">Trade:</span> <span className="text-white">{apprentice.trade}</span></div>
            <div><span className="text-gray-400">Phone:</span> <span className="text-white">{apprentice.phone}</span></div>
            <div><span className="text-gray-400">Email:</span> <span className="text-white">{apprentice.email}</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Training Details</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-400">Start Date:</span> <span className="text-white">{new Date(apprentice.startDate).toLocaleDateString()}</span></div>
            <div><span className="text-gray-400">Expected Completion:</span> <span className="text-white">{new Date(apprentice.expectedCompletionDate).toLocaleDateString()}</span></div>
            <div><span className="text-gray-400">Parent Member:</span> <span className="text-white">{parentMember ? `${parentMember.firstName} ${parentMember.lastName}` : "—"}</span></div>
            <div><span className="text-gray-400">Registered:</span> <span className="text-white">{new Date(apprentice.dateRegistered).toLocaleDateString()}</span></div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setShowTransfer(!showTransfer)} className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
          Transfer
        </button>
        <button onClick={() => setShowUpgrade(!showUpgrade)} className="flex items-center gap-1.5 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600">
          Upgrade to Member
        </button>
      </div>

      {showTransfer && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Transfer Apprentice</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">New Member ID</label>
              <input value={transferForm.newMemberId} onChange={(e) => setTransferForm({ ...transferForm, newMemberId: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Reason</label>
              <input value={transferForm.reason} onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })} className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowTransfer(false)} className="rounded px-3 py-1.5 text-sm text-gray-400">Cancel</button>
            <button onClick={handleTransfer} className="rounded-lg bg-[#3CA4F9] px-4 py-1.5 text-sm font-medium text-white">Submit Transfer</button>
          </div>
        </div>
      )}

      {showUpgrade && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Upgrade to Member</h3>
          <p className="mb-4 text-sm text-gray-400">Submit upgrade request for {apprentice.firstName} {apprentice.lastName}. An executive will review and process this request.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowUpgrade(false)} className="rounded px-3 py-1.5 text-sm text-gray-400">Cancel</button>
            <button onClick={handleUpgrade} className="rounded-lg bg-purple-500 px-4 py-1.5 text-sm font-medium text-white">Submit Upgrade Request</button>
          </div>
        </div>
      )}

      {transfers.length > 0 && (
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Transfer History</h3>
          <div className="space-y-3">
            {transfers.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-[#1e3a5f] bg-[#011B2B] p-4">
                <div>
                  <p className="text-sm text-white">Reason: {t.reason}</p>
                  <p className="text-xs text-gray-500">Member {t.previousMemberId} → {t.newMemberId}</p>
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400">{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
