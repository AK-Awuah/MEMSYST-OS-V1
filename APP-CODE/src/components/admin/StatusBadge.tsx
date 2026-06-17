interface StatusBadgeProps {
  status: string
  variant?: "default" | "lead" | "submission" | "stage" | "prospect" | "tenant"
}

const colorMap: Record<string, Record<string, string>> = {
  default: {
    new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    inactive: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    suspended: "bg-red-500/15 text-red-400 border-red-500/30",
    closed: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  },
  lead: {
    new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    qualified: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    meeting_scheduled: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    needs_assessment: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    proposal_sent: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    negotiation: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    won: "bg-green-500/15 text-green-400 border-green-500/30",
    lost: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  stage: {
    new_lead: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    contacted: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    discovery_meeting: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    needs_assessment: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    proposal_sent: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    negotiation: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    approved: "bg-green-500/15 text-green-400 border-green-500/30",
    tenant_creation: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  },
  submission: {
    new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    assigned: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    in_progress: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    resolved: "bg-green-500/15 text-green-400 border-green-500/30",
    closed: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  },
  prospect: {
    prospect: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    qualified: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    proposal_stage: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    negotiation: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    approved: "bg-green-500/15 text-green-400 border-green-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  tenant: {
    prospect: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    qualified: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    proposal_accepted: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    contract_signed: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    setup: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    activated: "bg-green-500/15 text-green-400 border-green-500/30",
  },
}

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const map = colorMap[variant] || colorMap.default
  const colors = map[status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors}`}>
      {label}
    </span>
  )
}
