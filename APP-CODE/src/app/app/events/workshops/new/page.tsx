"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getEventsService } from "@/lib/services"

export default function NewWorkshopPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [facilitatorName, setFacilitatorName] = useState("")
  const [maxParticipants, setMaxParticipants] = useState("")
  const [duration, setDuration] = useState("")
  const [startDate, setStartDate] = useState("")
  const [location, setLocation] = useState("")
  const [virtualLink, setVirtualLink] = useState("")
  const [materials, setMaterials] = useState("")
  const [prerequisites, setPrerequisites] = useState("")

  const handleSubmit = async () => {
    if (!title || !startDate || !maxParticipants || !duration) return
    setSubmitting(true)
    try {
      const svc = await getEventsService()
      await svc.createWorkshop({
        tenantId: "tenant-1",
        title,
        description,
        facilitatorId: "fac-1",
        facilitatorName,
        maxParticipants: parseInt(maxParticipants, 10),
        registeredCount: 0,
        duration,
        materials: materials ? materials.split(",").map((m) => m.trim()) : [],
        prerequisites: prerequisites ? prerequisites.split(",").map((p) => p.trim()) : [],
        status: "draft",
        startDate: new Date(startDate).toISOString(),
        location: location || undefined,
        virtualLink: virtualLink || undefined,

      })
      setSuccess(true)
      setTimeout(() => router.push("/app/events/workshops/list"), 1500)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create workshop")
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
        <p className="text-lg font-medium text-white">Workshop created successfully!</p>
        <p className="text-sm text-gray-400">Redirecting to workshops list...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Workshops
      </button>

      <PageHeader title="New Workshop" />

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Workshop title"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Workshop description"
            rows={3}
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Facilitator Name</label>
            <input
              type="text"
              value={facilitatorName}
              onChange={(e) => setFacilitatorName(e.target.value)}
              placeholder="Facilitator name"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2 hours, 1 day"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Start Date</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Participants</label>
            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              placeholder="0"
              min="1"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Venue or address"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Virtual Link</label>
            <input
              type="url"
              value={virtualLink}
              onChange={(e) => setVirtualLink(e.target.value)}
              placeholder="https://meet.example.com"
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Materials (comma-separated)</label>
          <input
            type="text"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            placeholder="Slides, Handouts, Code samples"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Prerequisites (comma-separated)</label>
          <input
            type="text"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            placeholder="Basic knowledge, Laptop required"
            className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !title || !startDate || !maxParticipants || !duration}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Creating..." : "Create Workshop"}
        </button>
      </div>
    </div>
  )
}
