"use client"

import Link from "next/link"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function RootErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#011B2B] px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-gray-400 mb-8">{error.message || "An unexpected error occurred. Please try again."}</p>
        {error.digest && <p className="text-xs text-gray-600 mb-4 font-mono">Error ID: {error.digest}</p>}
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#1e3a5f]/50 transition-colors">
            <Home className="h-4 w-4" /> Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
