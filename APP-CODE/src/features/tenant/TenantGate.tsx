import type { ReactNode } from "react"
import type { MemsystUser } from "@/types"
import { useAuth } from "@/features/auth/AuthContext"

export function useCurrentTenant() {
  const { user } = useAuth()
  return {
    tenantId: user?.tenantId || "memsyst",
    user,
  }
}

export function withTenantIsolation<T extends { tenantId?: string }>(
  items: T[],
  tenantId: string,
): T[] {
  return items.filter((item) => !item.tenantId || item.tenantId === tenantId)
}

export function assertTenantAccess(
  user: MemsystUser | null,
  resourceTenantId?: string,
): void {
  if (!user) throw new Error("Unauthorized: No authenticated user")
  if (resourceTenantId && resourceTenantId !== user.tenantId) {
    if (!user.permissions.includes("*")) {
      throw new Error(`Access denied: tenant mismatch (user: ${user.tenantId}, resource: ${resourceTenantId})`)
    }
  }
}

interface TenantGateProps {
  children: ReactNode
  requiredTenantId?: string
  fallback?: ReactNode
}

export function TenantGate({ children, requiredTenantId, fallback }: TenantGateProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) {
    return fallback ? <>{fallback}</> : (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Authentication required</p>
      </div>
    )
  }

  if (requiredTenantId && requiredTenantId !== user.tenantId && !user.permissions.includes("*")) {
    return fallback ? <>{fallback}</> : (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-lg font-medium text-white">Access Denied</p>
          <p className="mt-1 text-sm text-gray-500">You do not have access to this tenant's data.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
