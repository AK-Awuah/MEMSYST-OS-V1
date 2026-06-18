"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Ban, History, Loader2 } from "lucide-react"
import { PageHeader, StatusBadge } from "@/components/admin"
import { CERTIFICATE_TYPE_LABELS } from "@/lib/constants"
import { getCertificateService } from "@/lib/services"
import type { Certificate } from "@/types"

export default function CertificateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [cert, setCert] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getCertificateService()
        const data = await svc.getCertificate(id)
        if (!cancelled) setCert(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load certificate")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleCancel = async () => {
    if (!cancelReason.trim()) return
    setCancelling(true)
    try {
      const svc = await getCertificateService()
      await svc.cancelCertificate(id, cancelReason, "Admin")
      setShowCancelModal(false)
      setCancelReason("")
      const data = await svc.getCertificate(id)
      setCert(data)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to cancel certificate")
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading certificate...</p>
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

  if (!cert) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          Certificate not found.
        </div>
      </div>
    )
  }

  const canCancel = cert.status === "active" || cert.status === "unprinted" || cert.status === "printed" || cert.status === "ordered" || cert.status === "reprinted"

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Certificates
      </button>

      <PageHeader
        title={cert.recipientName}
        description={`Certificate #${cert.certificateNumber || cert.credentialNumber}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Certificate Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Certificate Number</p>
                <p className="text-sm font-medium text-white mt-1 font-mono">{cert.certificateNumber || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Credential Number</p>
                <p className="text-sm font-medium text-white mt-1 font-mono">{cert.credentialNumber || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Certificate Type</p>
                <p className="text-sm font-medium text-white mt-1 capitalize">
                  {CERTIFICATE_TYPE_LABELS[cert.certificateType] || cert.certificateType}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1"><StatusBadge status={cert.status} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Recipient Name</p>
                <p className="text-sm font-medium text-white mt-1">{cert.recipientName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Organization</p>
                <p className="text-sm font-medium text-white mt-1">{cert.organization || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Program</p>
                <p className="text-sm font-medium text-white mt-1">{cert.program || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Verification Code</p>
                <p className="text-sm font-medium text-white mt-1 font-mono">{cert.verificationCode || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Issue Date</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(cert.issueDate).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Expiry Date</p>
                <p className="text-sm font-medium text-white mt-1">{cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : "No expiry"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Reprint Count</p>
                <p className="text-sm font-medium text-white mt-1">{cert.reprintCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Last Printed</p>
                <p className="text-sm font-medium text-white mt-1">
                  {cert.lastPrintedAt ? new Date(cert.lastPrintedAt).toLocaleDateString() : "Never"}
                </p>
              </div>
              {cert.cancelledAt && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-red-500/30">
                  <p className="text-xs text-gray-500">Cancelled At</p>
                  <p className="text-sm font-medium text-white mt-1">{new Date(cert.cancelledAt).toLocaleDateString()}</p>
                  {cert.cancellationReason && (
                    <>
                      <p className="text-xs text-gray-500 mt-2">Reason</p>
                      <p className="text-sm font-medium text-red-400 mt-1">{cert.cancellationReason}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors"
                >
                  <Ban className="h-4 w-4" /> Cancel Certificate
                </button>
              )}
              <button
                onClick={() => router.push(`/app/credentials/audit?credentialId=${cert.id}`)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors"
              >
                <History className="h-4 w-4" /> View History
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Cancel Certificate</h3>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to cancel this certificate? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Reason for cancellation</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                rows={3}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowCancelModal(false); setCancelReason("") }}
                className="px-4 py-2 rounded-lg border border-[#1e3a5f] text-sm text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors"
              >
                Keep Certificate
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling || !cancelReason.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                {cancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
