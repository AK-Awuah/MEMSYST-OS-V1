import type { ReactNode } from "react"
import { useAuth } from "@/features/auth/AuthContext"

export const routePermissions: Record<string, string | null> = {
  "/app/dashboard": null,
  "/app/forms": "forms:read",
  "/app/leads": "leads:read",
  "/app/crm": "crm:read",
  "/app/notifications": "notifications:read",
  "/app/organizations": "organizations:read",
  "/app/onboarding": "tenants:write",
  "/app/users": "users:read",
  "/app/roles": "roles:read",
  "/app/sessions": null,
  "/app/security": null,
  "/app/settings": "settings:read",
  "/app/audit-logs": "audit:read",
  "/app/profile": null,
  "/app/change-password": null,
}

export function getRequiredPermission(pathname: string): string | null {
  const exact = routePermissions[pathname]
  if (exact !== undefined) return exact
  for (const [route, perm] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route + "/")) return perm
  }
  return null
}

interface PermissionGuardProps {
  pathname: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ pathname, children, fallback }: PermissionGuardProps) {
  const { user, isLoading } = useAuth()
  const required = getRequiredPermission(pathname)
  if (!required || isLoading) return <>{children}</>
  if (!user) return fallback ? <>{fallback}</> : null
  if (user.permissions.includes("*")) return <>{children}</>
  if (!user.permissions.includes(required)) {
    return fallback ? <>{fallback}</> : (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-lg font-medium text-white">Access Denied</p>
          <p className="mt-1 text-sm text-gray-500">You do not have the required permission ({required}) to access this page.</p>
        </div>
      </div>
    )
  }
  return <>{children}</>
}
