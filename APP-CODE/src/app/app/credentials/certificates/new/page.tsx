"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { CERTIFICATE_TYPES, CERTIFICATE_TYPE_LABELS } from "@/lib/constants"
import { getCertificateService } from "@/lib/services"
import type { CertificateType } from "@/types"

export default function NewCertificatePage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [ownerId, setOwnerId] = useState("")
  const [certificateType, setCertificateType] = useState<CertificateType>("membership")
  const [recipientName, setRecipientName] = useState("")
  const [organization, setOrganization] = useState("")
  const [program, setProgram] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

  const handleSubmit = async () => {
    if (!recipientName || !issueDate) return
    setSubmitting(true)
    try {
      const svc = await getCertificateService()
      await svc.createCertificate({
        tenantId: "tenant-1",
        ownerId: ownerId || "auto",
        certificateType,
        recipientName,
        organization: organization || "Default",
        program: program || "General",
        issueDate,
        expiryDate: expiryDate || undefined,
        certificateNumber: "",
        credentialNumber: "",
        status: "unprinted",
        verificationCode: "",
        qrCode: "",
        reprintCount: 0,
      })
      router.push("/app/credentials/certificates")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create certificate")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Certificates
      </button>

      <PageHeader title="New Certificate" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Owner ID</label>
            <input
              type="text"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              placeholder="Owner identifier"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Certificate Type</label>
            <select
              value={certificateType}
              onChange={(e) => setCertificateType(e.target.value as CertificateType)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            >
              {CERTIFICATE_TYPES.map((t) => (
                <option key={t} value={t}>{CERTIFICATE_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Recipient Name</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Recipient full name"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Organization name"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Program</label>
            <input
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Program name"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Expiry Date (optional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !recipientName || !issueDate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Certificate"}
        </button>
      </div>
    </div>
  )
}
