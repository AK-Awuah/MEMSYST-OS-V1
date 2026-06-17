"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/features/auth/AuthContext"
import { Sidebar } from "@/components/admin/Sidebar"
import { TopNav } from "@/components/admin/TopNav"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"

function AppShellContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const publicRoutes = ["/app/login", "/app/forgot-password", "/app/reset-password"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.replace("/app/login")
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#011B2B]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated && !isPublicRoute) return null

  if (isPublicRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#011B2B]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <TopNav />
        <main className="p-6">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShellContent>{children}</AppShellContent>
    </AuthProvider>
  )
}
