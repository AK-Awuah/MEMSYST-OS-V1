"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/features/auth/AuthContext"

export default function AppLoginPage() {
  const [email, setEmail] = useState("admin@memsyst.com")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      await login(email, password)
      router.replace("/app/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#011B2B] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">MEMSYST</h1>
          <p className="mt-2 text-sm text-gray-400">Business Operations Platform</p>
        </div>

        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-8">
          <h2 className="mb-6 text-xl font-semibold text-white">Sign In</h2>

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
            <div>
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
                required
              />
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
          MemSyst Business Operations Platform v1.0
        </p>
      </div>
    </div>
  )
}
