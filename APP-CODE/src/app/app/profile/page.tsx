"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/features/auth/AuthContext"
import { PageHeader } from "@/components/admin/PageHeader"
import { Mail, Phone, Shield, Calendar, BadgeCheck, AlertTriangle, Camera } from "lucide-react"
import { getAuthService } from "@/lib/services"
import { logAuditEvent, createAuditEntry } from "@/lib/audit"
import { validatePhone } from "@/lib/validation"
import type { MemsystUser } from "@/types"

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [resending, setResending] = useState(false)
  const [resendSent, setResendSent] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setPhone(user.phone || "")
      setPhotoURL(user.photoURL || "")
    }
  }, [user])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB")
      return
    }
    setUploading(true)
    setError("")
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string
      setPhotoURL(dataUrl)
      setUploading(false)
    }
    reader.onerror = () => {
      setError("Failed to read image file")
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!user) return
    const phoneErr = phone ? validatePhone(phone) : null
    if (phoneErr) { setError(phoneErr); return }
    setError("")
    setSaving(true)
    try {
      const svc = await getAuthService()
      await svc.updateProfile({ firstName, lastName, phone, photoURL } as Partial<MemsystUser>)
      await logAuditEvent(createAuditEntry({
        actor: `${user.firstName} ${user.lastName}`,
        role: user.role,
        action: "UPDATE",
        module: "USERS",
        recordType: "Profile",
        recordId: user.id,
        newValue: "Profile updated",
      }))
      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  async function handleResendVerification() {
    if (!user) return
    setResending(true)
    setResendSent(false)
    try {
      const svc = await getAuthService()
      await svc.sendEmailVerification()
      setResendSent(true)
    } catch {
      setError("Failed to send verification email")
    } finally {
      setResending(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="My Profile"
        description="Manage your account information"
      />

      <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3CA4F9]/20 text-2xl font-bold text-[#3CA4F9] transition-opacity disabled:opacity-50"
          >
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span>{user.firstName[0]}{user.lastName[0]}</span>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div>
            <h2 className="text-xl font-semibold text-white">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-[#3CA4F9] capitalize">{user.role.replace(/_/g, " ")}</p>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-gray-500"><Mail className="h-3.5 w-3.5" /> Email</dt>
            <dd className="text-sm text-white">{user.email}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-gray-500"><Phone className="h-3.5 w-3.5" /> Phone</dt>
            <dd className="text-sm text-white">{user.phone || "Not set"}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-gray-500"><Shield className="h-3.5 w-3.5" /> Role</dt>
            <dd className="text-sm text-white capitalize">{user.role.replace(/_/g, " ")}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-gray-500"><Calendar className="h-3.5 w-3.5" /> Member Since</dt>
            <dd className="text-sm text-white">{new Date(user.createdAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>

      <div className="mb-6 rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Email Verification</h3>
        {user.emailVerified ? (
          <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
            <BadgeCheck className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-400">Email Verified</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-yellow-400">Email Not Verified</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-xs font-medium text-white hover:bg-[#3594e0] disabled:opacity-50"
            >
              {resending ? "Sending..." : resendSent ? "Sent!" : "Resend Verification"}
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Edit Profile</h3>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            Profile updated successfully.
          </div>
        )}

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="form-label" htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              placeholder="+233 XX XXX XXXX"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3594e0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
