"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/features/auth/AuthContext"
import { Eye, EyeOff } from "lucide-react"
import { validateLoginForm } from "@/lib/validation"

export default function AppLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setFieldErrors({})

    const validation = validateLoginForm(email, password)
    if (!validation.valid) {
      setFieldErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    try {
      await login(email, password)
      router.replace("/app/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#011B2B] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src="/images/Small-logo.png" alt="MemSyst" className="mx-auto h-12 w-auto" />
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-8">
          <h2 className="mb-6 text-xl font-semibold text-white">Sign In</h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="form-label" htmlFor="email">Email Address or Username</label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input ${fieldErrors.email ? "border-red-500/50" : ""}`}
                placeholder="you@organization.org or username"
                required
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="form-label" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-input pr-10 ${fieldErrors.password ? "border-red-500/50" : ""}`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="rounded border-gray-600 bg-[#011B2B]" />
                Keep me signed in
              </label>
              <Link href="/app/forgot-password" className="text-[#3CA4F9] hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#3CA4F9] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3594e0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500">
          &copy; 2026 MemSyst Technologies. All rights reserved.
        </p>
      </div>
    </div>
  )
}
