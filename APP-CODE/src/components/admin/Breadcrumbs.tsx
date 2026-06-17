"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  forms: "Forms",
  leads: "Leads",
  crm: "CRM Pipeline",
  notifications: "Notifications",
  organizations: "Organizations",
  onboarding: "Tenant Onboarding",
  users: "Users",
  roles: "Role Management",
  sessions: "Sessions",
  security: "Security Dashboard",
  settings: "Settings",
  "audit-logs": "Audit Logs",
  login: "Sign In",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length <= 1) return null

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/")
    const label = labelMap[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    const isLast = i === segments.length - 1
    return { href, label, isLast }
  })

  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
      <Link href="/app/dashboard" className="hover:text-white">
        <Home className="h-4 w-4" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          {crumb.isLast ? (
            <span className="text-white">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-white">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
