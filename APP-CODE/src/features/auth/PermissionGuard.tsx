import type { ReactNode } from "react"
import { useAuth } from "@/features/auth/AuthContext"
import { ROUTE_PERMISSIONS } from "@/lib/constants"

export function getRequiredPermission(pathname: string): string | null {
  const exact = ROUTE_PERMISSIONS[pathname]
  if (exact !== undefined) return exact
  for (const [route, perm] of Object.entries(ROUTE_PERMISSIONS)) {
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
