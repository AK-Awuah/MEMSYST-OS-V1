"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { CREDENTIAL_TEMPLATE_TYPES, CREDENTIAL_TEMPLATE_TYPE_LABELS } from "@/lib/constants"
import { getCredentialTemplateService } from "@/lib/services"
import type { CredentialTemplateType } from "@/types"

export default function NewTemplatePage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<CredentialTemplateType>("certificate")
  const [primaryColor, setPrimaryColor] = useState("#3CA4F9")
  const [secondaryColor, setSecondaryColor] = useState("#1e3a5f")
  const [typography, setTypography] = useState("Inter")

  const handleSubmit = async () => {
    if (!name) return
    setSubmitting(true)
    try {
      const svc = await getCredentialTemplateService()
      await svc.createTemplate({
        tenantId: "tenant-1",
        name,
        description,
        type,
        logo: "",
        primaryColor,
        secondaryColor,
        typography,
        fields: [],
        qrPlacement: { x: 0, y: 0 },
        status: "draft",
        version: 1,
        createdBy: "Admin",
      })
      router.push("/app/credentials/templates")
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create template")
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
        <ArrowLeft className="h-4 w-4" /> Back to Templates
      </button>

      <PageHeader title="New Template" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Template name"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Template description"
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CredentialTemplateType)}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
          >
            {CREDENTIAL_TEMPLATE_TYPES.map((t) => (
              <option key={t} value={t}>{CREDENTIAL_TEMPLATE_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Primary Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-10 rounded-lg border border-[#1e3a5f] bg-[#012a42] cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Secondary Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-10 w-10 rounded-lg border border-[#1e3a5f] bg-[#012a42] cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Typography</label>
          <input
            type="text"
            value={typography}
            onChange={(e) => setTypography(e.target.value)}
            placeholder="Font family name"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !name}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Template"}
        </button>
      </div>
    </div>
  )
}
