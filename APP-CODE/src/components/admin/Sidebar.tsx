"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/features/auth/AuthContext"
import { ROUTE_PERMISSIONS } from "@/lib/constants"
import {
  LayoutDashboard, FileText, Users, TrendingUp, Bell, Building2,
  UserPlus, Settings, Shield, ShieldAlert, UserCog, ChevronLeft, Key, Globe, Layers,
  Contact, GraduationCap, UserCheck, Wallet, CreditCard, Receipt, DollarSign, Percent, ArrowLeftRight,
  MessageSquare, Send, Megaphone, BarChart3, IdCard, Store, Briefcase, Search,
} from "lucide-react"

const navItems: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/members", label: "Members", icon: Contact },
  { href: "/app/apprentices", label: "Apprentices", icon: GraduationCap },
  { href: "/app/forms", label: "Form Submissions", icon: FileText },
  { href: "/app/leads", label: "Leads", icon: Users },
  { href: "/app/crm", label: "CRM Pipeline", icon: TrendingUp },
  { href: "/app/notifications", label: "Notifications", icon: Bell },
  { href: "/app/organizations", label: "Organizations", icon: Building2 },
  { href: "/app/tenants", label: "Tenants", icon: Layers },
  { href: "/app/directory", label: "Directory", icon: Globe },
  { href: "/app/onboarding", label: "Tenant Onboarding", icon: UserPlus },
  { href: "/app/users", label: "User Management", icon: UserCog },
  { href: "/app/roles", label: "Role Management", icon: Key },
  { href: "/app/sessions", label: "Sessions", icon: Globe },
  { href: "/app/security", label: "Security", icon: ShieldAlert },
  { href: "/app/finance/dashboard", label: "Finance", icon: Wallet },
  { href: "/app/finance/wallets", label: "Wallets", icon: CreditCard },
  { href: "/app/finance/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/app/finance/billing", label: "Billing", icon: Receipt },
  { href: "/app/finance/withdrawals", label: "Withdrawals", icon: DollarSign },
  { href: "/app/finance/revenue-distribution", label: "Revenue", icon: Percent },
  { href: "/app/finance/commissions", label: "Commissions", icon: TrendingUp },
  { href: "/app/finance/settings", label: "Finance Settings", icon: Settings },
  { href: "/app/communication", label: "Communication", icon: MessageSquare },
  { href: "/app/communication/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/app/communication/templates", label: "Templates", icon: FileText },
  { href: "/app/communication/segments", label: "Segments", icon: Users },
  { href: "/app/communication/preferences", label: "Preferences", icon: UserCheck },
  { href: "/app/communication/broadcasts", label: "Broadcasts", icon: Send },
  { href: "/app/communication/automation", label: "Automation", icon: Settings },
  { href: "/app/communication/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/communication/audit", label: "Comm. Audit", icon: Shield },
  { href: "/app/credentials", label: "Credentials", icon: IdCard },
  { href: "/app/credentials/id-cards", label: "ID Cards", icon: IdCard },
  { href: "/app/credentials/certificates", label: "Certificates", icon: FileText },
  { href: "/app/credentials/templates", label: "Cred. Templates", icon: FileText },
  { href: "/app/credentials/printing", label: "Printing", icon: Send },
  { href: "/app/credentials/repository", label: "Repository", icon: Layers },
  { href: "/app/credentials/analytics", label: "Cred. Analytics", icon: BarChart3 },
  { href: "/app/credentials/audit", label: "Cred. Audit", icon: Shield },
  { href: "/app/credentials/settings", label: "Cred. Settings", icon: Settings },
  { href: "/app/marketplace", label: "Marketplace", icon: Store },
  { href: "/app/marketplace/listings", label: "Listings", icon: FileText },
  { href: "/app/marketplace/businesses", label: "Businesses", icon: Briefcase },
  { href: "/app/marketplace/categories", label: "Categories", icon: Layers },
  { href: "/app/marketplace/opportunities", label: "Opportunities", icon: TrendingUp },
  { href: "/app/marketplace/approvals", label: "Approvals", icon: UserCheck },
  { href: "/app/marketplace/search", label: "Directory Search", icon: Search },
  { href: "/app/marketplace/analytics", label: "Mkt. Analytics", icon: BarChart3 },
  { href: "/app/marketplace/compliance", label: "Compliance", icon: Shield },
  { href: "/app/marketplace/audit", label: "Mkt. Audit", icon: ShieldAlert },
  { href: "/app/marketplace/settings", label: "Mkt. Settings", icon: Settings },
  { href: "/app/settings", label: "Platform Settings", icon: Settings },
  { href: "/app/audit-logs", label: "Audit Logs", icon: Shield },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  function hasAccess(href: string) {
    if (!user) return true
    if (user.permissions.includes("*")) return true
    const required = ROUTE_PERMISSIONS[href]
    if (!required) return true
    return user.permissions.includes(required)
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
            if (!hasAccess(item.href)) return null
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
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#3CA4F9]/20 text-sm font-semibold text-[#3CA4F9]">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
              ) : (
                <span>{user.firstName[0]}{user.lastName[0]}</span>
              )}
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
