"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { PageHeader, DataTable } from "@/components/admin"
import type { Column } from "@/components/admin"
import { getAIService } from "@/lib/services"
import type { AIConversation } from "@/types"

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<AIConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        setLoading(true)
        const svc = await getAIService()
        const data = await svc.listConversations("tenant-1")
        if (!cancelled) setConversations(data)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const filtered = conversations.filter((c) =>
    c.userMessage.toLowerCase().includes(searchQuery.toLowerCase()) || c.userId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: Column<AIConversation>[] = [
    { key: "createdAt", header: "Date", render: (c) => <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleString()}</span> },
    { key: "userId", header: "User ID", render: (c) => <span className="text-white text-xs font-mono">{c.userId.slice(0, 12)}...</span> },
    { key: "userMessage", header: "Message", render: (c) => <span className="text-gray-300 text-sm truncate max-w-xs block">{c.userMessage}</span> },
    { key: "tokensUsed", header: "Tokens", render: (c) => <span className="text-gray-400">{c.tokensUsed.toLocaleString()}</span> },
    { key: "processingTime", header: "Time (ms)", render: (c) => <span className="text-gray-400">{c.processingTime}</span> },
    { key: "feedback", header: "Feedback", render: (c) => <span className={`text-xs capitalize ${c.feedback === "helpful" ? "text-green-400" : c.feedback === "not_helpful" ? "text-red-400" : "text-gray-500"}`}>{c.feedback || "-"}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Conversations" description="View AI conversation logs" />
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md">
          <DataTable columns={columns} data={filtered} emptyMessage="No conversations found." />
        </div>
      )}
    </div>
  )
}
