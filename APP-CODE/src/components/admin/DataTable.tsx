import type { ReactNode } from "react"

export interface Column<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  isLoading?: boolean
  emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  isLoading,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA4F9] border-t-transparent" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#1e3a5f]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#1e3a5f] bg-[#011B2B]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 font-medium text-gray-400 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e3a5f]">
          {data.map((item: T, i: number) => (
            <tr
              key={(item as { id?: string }).id || String(i)}
              className={`transition-colors hover:bg-[#1e3a5f]/30 ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-white ${col.className || ""}`}>
                  {col.render ? col.render(item) : String(item[col.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
