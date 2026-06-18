"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Package, Building2, Briefcase, MapPin, Calendar } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getDirectorySearchService } from "@/lib/services"
import type { SearchResults } from "@/lib/services/IDirectorySearchService"
import type { MarketplaceListing, BusinessProfile, Opportunity } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

type Tab = "all" | "listings" | "businesses" | "opportunities"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState({ categoryId: "", region: "", branch: "", location: "" })
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("all")

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true)
      setSearched(true)
      const svc = await getDirectorySearchService()
      const data = await svc.searchAll({
        query: query || undefined,
        tenantId: "tenant-1",
        ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
        ...(filters.region ? { region: filters.region } : {}),
        ...(filters.branch ? { branch: filters.branch } : {}),
        ...(filters.location ? { location: filters.location } : {}),
      })
      setResults(data)
    } catch {
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [query, filters])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const tabCount = (tab: Tab) => {
    if (!results) return 0
    switch (tab) {
      case "listings": return results.listings.length
      case "businesses": return results.businesses.length
      case "opportunities": return results.opportunities.length
      default: return results.totalResults
    }
  }

  const tabs: { key: Tab; label: string; icon: typeof Package }[] = [
    { key: "all", label: "All", icon: Search },
    { key: "listings", label: "Listings", icon: Package },
    { key: "businesses", label: "Businesses", icon: Building2 },
    { key: "opportunities", label: "Opportunities", icon: Briefcase },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <PageHeader title="Directory Search" description="Search listings, businesses and opportunities" />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-5 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search marketplace..."
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#011B2B] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500"
            />
          </div>
          <button onClick={handleSearch} disabled={loading} className="rounded-lg bg-[#3CA4F9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50">
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <input value={filters.categoryId} onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })} placeholder="Category ID" className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder:text-gray-500" />
          <input value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })} placeholder="Region" className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder:text-gray-500" />
          <input value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })} placeholder="Branch" className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder:text-gray-500" />
          <input value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="Location" className="rounded-lg border border-[#1e3a5f] bg-[#011B2B] px-3 py-2 text-sm text-white placeholder:text-gray-500" />
        </div>
      </motion.div>

      {loading && (
        <motion.div variants={itemVariants} className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">Searching marketplace...</p>
        </motion.div>
      )}

      {searched && !loading && !results && (
        <motion.div variants={itemVariants} className="flex items-center justify-center py-16">
          <p className="text-sm text-gray-500">No results found. Try a different search term.</p>
        </motion.div>
      )}

      {results && !loading && (
        <>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 border-b border-[#1e3a5f]">
            {tabs.map((tab) => {
              const count = tabCount(tab.key)
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.key ? "border-[#3CA4F9] text-white" : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <span className="ml-1 rounded-full bg-[#1e3a5f] px-2 py-0.5 text-xs">{count}</span>
                </button>
              )
            })}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            {(activeTab === "all" || activeTab === "listings") && results.listings.length > 0 && (
              <div>
                {(activeTab === "all") && <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Listings ({results.listings.length})</h3>}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results.listings.map((l) => (
                    <ResultCard key={l.id} title={l.title} subtitle={l.listingType} meta={[l.location || "", l.price ? `${l.currency || "GHS"} ${l.price}` : ""].filter(Boolean)} />
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "all" || activeTab === "businesses") && results.businesses.length > 0 && (
              <div>
                {(activeTab === "all") && <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Businesses ({results.businesses.length})</h3>}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results.businesses.map((b) => (
                    <ResultCard key={b.id} title={b.businessName} subtitle={b.verificationStatus} meta={[b.address || "", b.email].filter(Boolean)} />
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "all" || activeTab === "opportunities") && results.opportunities.length > 0 && (
              <div>
                {(activeTab === "all") && <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Opportunities ({results.opportunities.length})</h3>}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results.opportunities.map((o) => (
                    <ResultCard key={o.id} title={o.title} subtitle={o.opportunityType} meta={[o.location || "", o.applicationDeadline ? `Deadline: ${new Date(o.applicationDeadline).toLocaleDateString()}` : ""].filter(Boolean)} />
                  ))}
                </div>
              </div>
            )}

            {activeTab !== "all" && (
              (activeTab === "listings" && results.listings.length === 0) ||
              (activeTab === "businesses" && results.businesses.length === 0) ||
              (activeTab === "opportunities" && results.opportunities.length === 0)
            ) && (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-gray-500">No {(activeTab === "listings" ? "listings" : activeTab === "businesses" ? "businesses" : "opportunities")} found.</p>
              </div>
            )}
          </motion.div>
        </>
      )}

      {!searched && !loading && (
        <motion.div variants={itemVariants} className="flex items-center justify-center py-20">
          <div className="text-center">
            <Search className="mx-auto h-12 w-12 text-[#1e3a5f] mb-4" />
            <p className="text-sm text-gray-500">Enter a search term and filters to find listings, businesses, and opportunities.</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function ResultCard({ title, subtitle, meta }: { title: string; subtitle: string; meta: string[] }) {
  return (
    <div className="rounded-xl border border-[#1e3a5f] bg-[#0A1E2E] p-4 hover:border-[#3CA4F9]/50 transition-colors">
      <h4 className="text-sm font-semibold text-white truncate">{title}</h4>
      <p className="mt-0.5 text-xs text-gray-500 capitalize">{subtitle.replace(/_/g, " ")}</p>
      {meta.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {meta.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-400">
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
