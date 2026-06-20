"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Loader2, RefreshCw } from "lucide-react"
import { PageHeader } from "@/components/admin"
import { getMobileService } from "@/lib/services"
import type { PWAConfig } from "@/types"

export default function PWAConfigPage() {
  const [config, setConfig] = useState<PWAConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [building, setBuilding] = useState(false)
  const [name, setName] = useState("")
  const [shortName, setShortName] = useState("")
  const [description, setDescription] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("#011B2B")
  const [themeColor, setThemeColor] = useState("#3CA4F9")
  const [display, setDisplay] = useState<PWAConfig["display"]>("standalone")
  const [orientation, setOrientation] = useState<PWAConfig["orientation"]>("portrait")
  const [cacheStrategy, setCacheStrategy] = useState<PWAConfig["cacheStrategy"]>("network_first")
  const [pushEnabled, setPushEnabled] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        const svc = await getMobileService()
        const data = await svc.getPWAConfig("tenant-1")
        if (!cancelled && data) {
          setConfig(data); setName(data.name); setShortName(data.shortName)
          setDescription(data.description); setBackgroundColor(data.backgroundColor)
          setThemeColor(data.themeColor); setDisplay(data.display)
          setOrientation(data.orientation); setCacheStrategy(data.cacheStrategy)
          setPushEnabled(data.pushEnabled)
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const svc = await getMobileService()
      const result = await svc.updatePWAConfig("tenant-1", {
        name, shortName, description, backgroundColor, themeColor,
        display, orientation, cacheStrategy, pushEnabled,
      })
      setConfig(result)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleBuild = async () => {
    setBuilding(true)
    try {
      const svc = await getMobileService()
      const result = await svc.buildPWA("tenant-1")
      setConfig(result)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to build")
    } finally {
      setBuilding(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#3CA4F9]" /></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <PageHeader title="PWA Configuration" description="Configure Progressive Web App settings" />
        <div className="flex gap-2">
          <button onClick={handleBuild} disabled={building}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600/80 px-4 py-2 text-sm text-white hover:bg-green-500 disabled:opacity-50 transition-colors">
            {building ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {building ? "Building..." : "Build PWA"}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm text-white hover:bg-[#3CA4F9]/90 disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {config?.lastBuilt && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
          Last built: {new Date(config.lastBuilt).toLocaleString()}
        </div>
      )}

      <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">App Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="My App" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Short Name</label>
            <input type="text" value={shortName} onChange={(e) => setShortName(e.target.value)} placeholder="MyApp" className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="App description" rows={2} className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#3CA4F9] focus:outline-none resize-none" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-10 w-10 rounded-lg border border-[#1e3a5f] bg-[#012a42] cursor-pointer" />
              <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Theme Color</label>
            <div className="flex gap-2">
              <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="h-10 w-10 rounded-lg border border-[#1e3a5f] bg-[#012a42] cursor-pointer" />
              <input type="text" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="flex-1 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Display</label>
            <select value={display} onChange={(e) => setDisplay(e.target.value as PWAConfig["display"])}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
              <option value="standalone">Standalone</option>
              <option value="fullscreen">Fullscreen</option>
              <option value="minimal-ui">Minimal UI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Orientation</label>
            <select value={orientation} onChange={(e) => setOrientation(e.target.value as PWAConfig["orientation"])}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Cache Strategy</label>
            <select value={cacheStrategy} onChange={(e) => setCacheStrategy(e.target.value as PWAConfig["cacheStrategy"])}
              className="w-full rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm text-white focus:border-[#3CA4F9] focus:outline-none">
              <option value="network_first">Network First</option>
              <option value="cache_first">Cache First</option>
              <option value="stale_while_revalidate">Stale While Revalidate</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)}
            className="rounded border-[#1e3a5f] bg-[#012a42] text-[#3CA4F9] focus:ring-[#3CA4F9]" />
          <span className="text-sm text-gray-300">Enable Push Notifications</span>
        </label>
      </div>
    </div>
  )
}
