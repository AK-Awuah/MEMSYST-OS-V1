"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck, AlertTriangle, Loader2, Globe, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/admin"
import {
  BUSINESS_VERIFICATION_STATUS_LABELS,
  BUSINESS_VERIFICATION_TYPES,
  BUSINESS_VERIFICATION_TYPE_LABELS,
} from "@/lib/constants"
import { getBusinessProfileService } from "@/lib/services"
import type { BusinessProfile, BusinessVerificationStatus, BusinessVerificationType } from "@/types"

function VerificationBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    verified: "bg-green-500/15 text-green-400 border-green-500/30",
    unverified: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    suspended: "bg-red-500/15 text-red-400 border-red-500/30",
    revoked: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  const c = colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = BUSINESS_VERIFICATION_STATUS_LABELS[status as BusinessVerificationStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>
      {label}
    </span>
  )
}

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchBusiness = async () => {
    try {
      const svc = await getBusinessProfileService()
      const data = await svc.getBusiness(id)
      setBusiness(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load business")
    }
  }

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getBusinessProfileService()
        const data = await svc.getBusiness(id)
        if (!cancelled) setBusiness(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load business")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleVerificationAction = async (status: BusinessVerificationStatus) => {
    setActionLoading(status)
    try {
      const svc = await getBusinessProfileService()
      await svc.updateVerificationStatus(id, status, "Admin", "verified_member_business" as BusinessVerificationType)
      await fetchBusiness()
    } catch (e) {
      alert(e instanceof Error ? e.message : `Failed to update verification status`)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading business profile...</p>
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
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">Business profile not found.</div>
      </div>
    )
  }

  const isVerified = business.verificationStatus === "verified"
  const isUnverified = business.verificationStatus === "unverified" || business.verificationStatus === "pending"
  const isSuspended = business.verificationStatus === "suspended"

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Businesses
      </button>

      <PageHeader
        title={business.businessName}
        description={`Verification: ${business.verificationStatus} — Status: ${business.status}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Business Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Business Name</p>
                <p className="text-sm font-medium text-white mt-1">{business.businessName}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-white mt-1">{business.categoryId || "-"}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-medium text-white mt-1 capitalize">{business.status}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Verification Status</p>
                <div className="mt-1"><VerificationBadge status={business.verificationStatus} /></div>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Member</p>
                <p className="text-sm font-medium text-white mt-1">{business.memberId}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-white mt-1">{new Date(business.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{business.description}</p>
          </div>

          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {business.address && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</p>
                  <p className="text-sm font-medium text-white mt-1">{business.address}</p>
                </div>
              )}
              {business.phone && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</p>
                  <p className="text-sm font-medium text-white mt-1">{business.phone}</p>
                </div>
              )}
              {business.email && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="h-3 w-3" /> Email</p>
                  <p className="text-sm font-medium text-white mt-1">{business.email}</p>
                </div>
              )}
              {business.website && (
                <div className="p-4 rounded-xl bg-[#012a42]/50 border border-[#1e3a5f]">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Globe className="h-3 w-3" /> Website</p>
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#3CA4F9] mt-1 flex items-center gap-1 hover:underline">
                    {business.website} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {business.socialMedia.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Social Media</h3>
              <div className="flex flex-wrap gap-2">
                {business.socialMedia.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1e3a5f] bg-[#012a42] px-3 py-1.5 text-xs font-medium text-[#3CA4F9] hover:bg-[#1e3a5f]/50 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {business.gallery.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Gallery Images ({business.gallery.length})</h3>
              <div className="grid grid-cols-3 gap-3">
                {business.gallery.map((img, i) => (
                  <div key={i} className="aspect-video rounded-lg bg-[#012a42] border border-[#1e3a5f] flex items-center justify-center overflow-hidden">
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {business.services.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Services ({business.services.length})</h3>
              <div className="flex flex-wrap gap-2">
                {business.services.map((s, i) => (
                  <span key={i} className="inline-block rounded-full border border-[#1e3a5f] bg-[#012a42] px-3 py-1 text-xs font-medium text-white">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {business.products.length > 0 && (
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">Products ({business.products.length})</h3>
              <div className="flex flex-wrap gap-2">
                {business.products.map((p, i) => (
                  <span key={i} className="inline-block rounded-full border border-[#1e3a5f] bg-[#012a42] px-3 py-1 text-xs font-medium text-white">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Verification Actions</h3>
            <div className="space-y-2">
              {isUnverified && (
                <button
                  onClick={() => handleVerificationAction("verified")}
                  disabled={actionLoading === "verified"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600/80 text-sm text-white hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "verified" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {actionLoading === "verified" ? "Verifying..." : "Verify Business"}
                </button>
              )}
              {(isVerified || isUnverified) && (
                <button
                  onClick={() => handleVerificationAction("suspended")}
                  disabled={actionLoading === "suspended"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-yellow-600/80 text-sm text-white hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "suspended" ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                  {actionLoading === "suspended" ? "Suspending..." : "Suspend"}
                </button>
              )}
              {isSuspended && (
                <button
                  onClick={() => handleVerificationAction("revoked")}
                  disabled={actionLoading === "revoked"}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/80 text-sm text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  {actionLoading === "revoked" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {actionLoading === "revoked" ? "Revoking..." : "Revoke Verification"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
