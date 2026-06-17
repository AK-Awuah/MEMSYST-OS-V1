"use client"

import { useEffect } from "react"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="text-sm text-gray-400">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0]"
      >
        Try Again
      </button>
    </div>
  )
}
