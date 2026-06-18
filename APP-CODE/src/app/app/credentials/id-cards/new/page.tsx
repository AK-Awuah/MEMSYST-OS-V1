"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { ID_CARD_TYPES, ID_CARD_TYPE_LABELS } from "@/lib/constants"
import { getIDCardService } from "@/lib/services"
import type { IDCardType } from "@/types"

export default function NewIDCardPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [ownerId, setOwnerId] = useState("")
  const [ownerType, setOwnerType] = useState<IDCardType>("member")
  const [fullName, setFullName] = useState("")
  const [membershipNumber, setMembershipNumber] = useState("")
  const [category, setCategory] = useState("")
  const [organization, setOrganization] = useState("")
  const [branch, setBranch] = useState("")
  const [region, setRegion] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

  const handleSubmit = async () => {
    if (!fullName || !issueDate || !expiryDate) return
    setSubmitting(true)
    try {
      const svc = await getIDCardService()
      await svc.createIDCard({
        tenantId: "tenant-1",
        ownerId: ownerId || "auto",
        ownerType,
        fullName,
        membershipNumber: membershipNumber || "N/A",
        category: category || "General",
        organization: organization || "Default",
        branch: branch || "Main",
        region: region || "Default",
        issueDate,
        expiryDate,
        cardNumber: "",
        credentialNumber: "",
        status: "unprinted",
        photo: "",
        qrCode: "",
        verificationCode: "",
        reprintCount: 0,
      })
      router.push("/app/credentials/id-cards")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create ID card")
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
        <ArrowLeft className="h-4 w-4" /> Back to ID Cards
      </button>

      <PageHeader title="New ID Card" />

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
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Owner Type</label>
            <select
              value={ownerType}
              onChange={(e) => setOwnerType(e.target.value as IDCardType)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            >
              {ID_CARD_TYPES.map((t) => (
                <option key={t} value={t}>{ID_CARD_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Card holder full name"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Membership Number</label>
            <input
              type="text"
              value={membershipNumber}
              onChange={(e) => setMembershipNumber(e.target.value)}
              placeholder="Membership #"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Organization"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="Branch"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Region</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Region"
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
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Expiry Date</label>
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
          disabled={submitting || !fullName || !issueDate || !expiryDate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create ID Card"}
        </button>
      </div>
    </div>
  )
}
