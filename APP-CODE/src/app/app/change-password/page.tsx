"use client"

import { useState, type FormEvent } from "react"
import { useAuth } from "@/features/auth/AuthContext"
import { PageHeader } from "@/components/admin/PageHeader"
import { getAuthService } from "@/lib/services"
import { logAuditEvent, createAuditEntry } from "@/lib/audit"
import { validatePassword } from "@/lib/validation"

export default function ChangePasswordPage() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    const pwdErr = validatePassword(newPassword)
    if (pwdErr) { setError(pwdErr); return }
    setIsSubmitting(true)
    try {
      const svc = await getAuthService()
      await svc.changePassword(currentPassword, newPassword)
      await logAuditEvent(createAuditEntry({
        actor: user ? `${user.firstName} ${user.lastName}` : "Unknown",
        role: user?.role || "system",
        action: "password_changed",
        module: "AUTH",
        recordType: "User",
        recordId: user?.id || "unknown",
        newValue: "Password changed",
      }))
      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      setError("Failed to change password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Change Password"
        description="Update your account password"
      />

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        {success && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            Password changed successfully.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label" htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input"
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Re-enter new password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3594e0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
