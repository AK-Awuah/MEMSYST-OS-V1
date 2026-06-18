"use client"

import type { Tenant } from "@/types"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { Globe, Building2, User, Mail, Phone, Calendar } from "lucide-react"

interface OverviewTabProps {
  tenant: Tenant
}

export function OverviewTab({ tenant }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Lifecycle</p>
          <div className="mt-2"><StatusBadge status={tenant.status} variant="tenant" /></div>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Commercial</p>
          <div className="mt-2"><StatusBadge status={tenant.commercialStatus} variant="tenant" /></div>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Plan</p>
            <Building2 className="h-4 w-4 text-[#3CA4F9]" />
          </div>
          <p className="mt-1 text-lg font-semibold text-white capitalize">{tenant.plan}</p>
        </div>
        <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Subscription</p>
          <p className="mt-1 text-lg font-semibold text-white capitalize">{tenant.subscription}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Organization Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow icon={<Globe className="h-4 w-4 text-gray-500" />} label="Domain" value={tenant.domain} />
          <DetailRow icon={<Globe className="h-4 w-4 text-gray-500" />} label="Subdomain" value={tenant.subdomain} />
          <DetailRow icon={<Building2 className="h-4 w-4 text-gray-500" />} label="Type" value={tenant.organizationType} />
          <DetailRow icon={<Building2 className="h-4 w-4 text-gray-500" />} label="Industry" value={tenant.industry} />
          <DetailRow icon={<Calendar className="h-4 w-4 text-gray-500" />} label="Created" value={new Date(tenant.createdAt).toLocaleDateString()} />
        </div>
      </div>

      <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Administrator</h3>
        <div className="space-y-3">
          <DetailRow icon={<User className="h-4 w-4 text-gray-500" />} label="Name" value={tenant.adminName} />
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-[#3CA4F9]">{tenant.adminEmail}</p>
            </div>
          </div>
          {tenant.adminPhone && (
            <DetailRow icon={<Phone className="h-4 w-4 text-gray-500" />} label="Phone" value={tenant.adminPhone} />
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {icon}
      <div>
        <p className="text-gray-400">{label}</p>
        <p className="text-white">{value || "—"}</p>
      </div>
    </div>
  )
}
