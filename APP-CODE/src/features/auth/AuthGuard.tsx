"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "./AuthContext"

interface AuthGuardProps {
  children: React.ReactNode
  requiredPermission?: string
}

export function AuthGuard({ children, requiredPermission }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/app/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#011B2B]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (requiredPermission && user && !user.permissions.includes("*") && !user.permissions.includes(requiredPermission)) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Access Denied</h2>
          <p className="mt-2 text-gray-400">You do not have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
