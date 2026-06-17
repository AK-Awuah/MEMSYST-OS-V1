"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setIsSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      router.push("/app/login")
    } catch {
      setError("Failed to reset password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#011B2B] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">MEMSYST</h1>
          <p className="mt-2 text-sm text-gray-400">Set a new password</p>
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-8">
          <h2 className="mb-6 text-xl font-semibold text-white">Reset Password</h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label" htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Min. 8 characters"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
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
              className="w-full rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3594e0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
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
