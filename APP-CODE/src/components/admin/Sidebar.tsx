"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/features/auth/AuthContext"
import {
  LayoutDashboard, FileText, Users, TrendingUp, Bell, Building2,
  UserPlus, Settings, Shield, ShieldAlert, UserCog, ChevronLeft, Key, Globe,
} from "lucide-react"

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: null },
  { href: "/app/forms", label: "Form Submissions", icon: FileText, permission: "forms:read" },
  { href: "/app/leads", label: "Leads", icon: Users, permission: "leads:read" },
  { href: "/app/crm", label: "CRM Pipeline", icon: TrendingUp, permission: "crm:read" },
  { href: "/app/notifications", label: "Notifications", icon: Bell, permission: null },
  { href: "/app/organizations", label: "Organizations", icon: Building2, permission: "organizations:read" },
  { href: "/app/onboarding", label: "Tenant Onboarding", icon: UserPlus, permission: null },
  { href: "/app/users", label: "User Management", icon: UserCog, permission: "users:read" },
  { href: "/app/roles", label: "Role Management", icon: Key, permission: "roles:read" },
  { href: "/app/sessions", label: "Sessions", icon: Globe, permission: null },
  { href: "/app/security", label: "Security", icon: ShieldAlert, permission: null },
  { href: "/app/settings", label: "Settings", icon: Settings, permission: null },
  { href: "/app/audit-logs", label: "Audit Logs", icon: Shield, permission: null },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  function hasAccess(permission: string | null) {
    if (!permission || !user) return true
    if (user.permissions.includes("*")) return true
    return user.permissions.includes(permission)
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#1e3a5f] bg-[#011B2B] transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#1e3a5f] px-4">
        {!collapsed && (
          <Link href="/app/dashboard" className="text-lg font-bold text-white">
            MEMSYST
          </Link>
        )}
        {collapsed && (
          <Link href="/app/dashboard" className="mx-auto text-lg font-bold text-[#3CA4F9]">
            M
          </Link>
        )}
        <button onClick={onToggle} className="text-gray-400 hover:text-white">
          <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (!hasAccess(item.permission)) return null
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#3CA4F9]/15 text-[#3CA4F9]"
                      : "text-gray-400 hover:bg-[#1e3a5f]/50 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {!collapsed && user && (
        <div className="border-t border-[#1e3a5f] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3CA4F9]/20 text-sm font-semibold text-[#3CA4F9]">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-gray-500">{user.role.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
