export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#1e3a5f]/50 ${className}`} />
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] p-4">
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="h-7 w-16" />
      <Skeleton className="mt-1 h-3 w-20" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-[#1e3a5f] bg-[#012a42] overflow-hidden">
      <div className="border-b border-[#1e3a5f] p-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-[#1e3a5f] p-3 last:border-0">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
