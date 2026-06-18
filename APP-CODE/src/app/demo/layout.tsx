import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import "@/app/globals.css";

export const metadata = {
  title: "MemSyst Enterprise Demo",
  description: "Executive Dashboard Environment",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#000814] text-white flex">
      
      {/* Demo Sidebar Navigation */}
      <aside className="w-64 border-r border-[#01314E] bg-[#011B2B] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#01314E]">
          <span className="text-xl font-bold tracking-tight text-[var(--primary)]">MEMSYST DEMO</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Dashboards</div>
          <Link href="/demo" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#01314E] hover:text-white transition-colors">Demo Home</Link>
          <Link href="/demo/executive" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#01314E] hover:text-white transition-colors">Executive Dashboard</Link>
          <Link href="/demo/membership" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#01314E] hover:text-white transition-colors">Membership</Link>
          <Link href="/demo/revenue" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#01314E] hover:text-white transition-colors">Revenue & Finance</Link>
          <Link href="/demo/governance" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#01314E] hover:text-white transition-colors">Governance</Link>
          <Link href="/demo/training" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#01314E] hover:text-white transition-colors">Training & CPD</Link>
          <Link href="/demo/marketplace" className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-[#01314E] hover:text-white transition-colors">Marketplace</Link>
        </nav>
        
        <div className="p-4 border-t border-[#01314E]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)]"></div>
            <div>
              <p className="text-sm font-medium">Secretary General</p>
              <p className="text-xs text-gray-400">Ghana Medical Assoc.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-[#01314E] bg-[#011B2B]">
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Search members, documents, or transactions..." 
              className="w-96 px-4 py-1.5 bg-[#01314E] border border-[#01314E] rounded-md text-sm text-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white"><Bell className="w-5 h-5" /></button>
            <button className="text-gray-400 hover:text-white"><Settings className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Dashboard View */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
