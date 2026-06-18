"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getAuthService } from "@/lib/services"
import { logAuditEvent, createAuditEntry } from "@/lib/audit"
import { validateEmail } from "@/lib/validation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    const emailErr = validateEmail(email)
    if (emailErr) { setError(emailErr); return }
    setIsSubmitting(true)
    try {
      const svc = await getAuthService()
      await svc.resetPassword(email)
      await logAuditEvent(createAuditEntry({
        actor: email,
        role: "system",
        action: "password_reset_requested",
        module: "AUTH",
        recordType: "User",
        recordId: email,
        newValue: "Password reset email sent",
      }))
      setSent(true)
    } catch {
      setError("Failed to send reset email")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#011B2B] p-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-8">
            <h2 className="mb-2 text-xl font-semibold text-white">Check Your Email</h2>
            <p className="mb-6 text-sm text-gray-400">
              If an account exists for <span className="text-white">{email}</span>, we&apos;ve sent password reset instructions.
            </p>
            <Link href="/app/login" className="text-sm text-[#3CA4F9] hover:underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#011B2B] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src="/images/Small-logo.png" alt="MemSyst" className="mx-auto h-12 w-auto" />
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-8">
          <h2 className="mb-6 text-xl font-semibold text-white">Forgot Password</h2>
          <p className="mb-6 text-sm text-gray-400">Enter your email and we&apos;ll send you a reset link.</p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@organization.org"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3594e0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/app/login" className="inline-flex items-center gap-1.5 text-sm text-[#3CA4F9] hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
