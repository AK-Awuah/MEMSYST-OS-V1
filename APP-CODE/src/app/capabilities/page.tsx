import Image from "next/image";
import Link from "next/link";
import { fullCapabilitiesData } from "@/data/capabilities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import { capabilityIcons } from "@/data/icons";
import { Link2, Zap, BarChart3 } from "lucide-react";

export default function CapabilitiesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--primary)]/6 blur-3xl" />
        </div>
        {/* Full-width banner image */}
        <div className="relative w-full">
          <div className="relative overflow-hidden">
            <Image
              src="/images/dashboard_mockup.png"
              alt="MemSyst Platform Dashboard"
              width={1920}
              height={600}
              className="w-full h-[300px] md:h-[400px] object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#011B2B] via-[#011B2B]/40 to-transparent" />
          </div>
        </div>
        {/* Text below banner */}
        <div className="container px-4 md:px-6 relative z-10 -mt-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)] backdrop-blur">
              The Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-white">10 Integrated</span>{" "}
              <span className="text-[var(--primary)]">Capabilities</span>
            </h1>
            <p className="text-2xl text-[var(--primary)] font-light">
              One Unified Digital Infrastructure Platform.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Each capability is powerful independently. Together, they form an interconnected ecosystem that eliminates silos, automates workflows, and transforms your organization into a high-performance institution.
            </p>
          </div>
        </div>
        <div className="pb-28" />
      </section>

      {/* ── DIGITAL INFRASTRUCTURE FRAMEWORK ── */}
      <section className="py-16 border-y border-[var(--border)] bg-[var(--secondary)]/20">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white">How the 10 Capabilities Work Together</h2>
            <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
              MemSyst is not a collection of separate tools. It is a unified digital infrastructure where every capability shares the same data layer, workflows, and intelligence — creating compounding value that no single-point solution can match.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[var(--border)] glass-effect text-center space-y-3">
              <Link2 className="w-8 h-8 text-[var(--primary)] mx-auto" />
              <h3 className="font-semibold text-white">Shared Data Layer</h3>
              <p className="text-sm text-gray-400">Every capability reads from and writes to a single source of truth — eliminating duplicates, reconciliation errors, and data silos.</p>
            </div>
            <div className="p-6 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-center space-y-3">
              <Zap className="w-8 h-8 text-[var(--primary)] mx-auto" />
              <h3 className="font-semibold text-white">Automated Workflows</h3>
              <p className="text-sm text-gray-400">Actions in one capability trigger intelligent workflows across others — a payment collected automatically updates membership status and triggers a receipt.</p>
            </div>
            <div className="p-6 rounded-xl border border-[var(--border)] glass-effect text-center space-y-3">
              <BarChart3 className="w-8 h-8 text-[var(--primary)] mx-auto" />
              <h3 className="font-semibold text-white">Unified Intelligence</h3>
              <p className="text-sm text-gray-400">Analytics draws from every capability to give leadership a complete, real-time view of organizational health and performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES GRID ── */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fullCapabilitiesData.map((cap) => {
              const Icon = capabilityIcons[cap.number];
              return (
              <Link href={`/capabilities/${cap.slug}`} key={cap.id}>
                <Card className="h-full card-hover card-glow cursor-pointer border-[var(--border)] hover:border-[var(--primary)]/60 bg-[var(--secondary)]/20 hover:bg-[var(--secondary)]/40 hover:shadow-[0_0_30px_rgba(60,164,249,0.15)] glass-effect group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <span className="capability-number">{cap.number}</span>
                      {Icon && <Icon className="w-5 h-5 text-[var(--primary)]" />}
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-[var(--primary)] transition-colors leading-tight">
                      {cap.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 leading-relaxed text-sm">{cap.shortOverview}</p>
                    <div className="pt-3 border-t border-[var(--border)]/60">
                      <p className="text-xs text-[var(--primary)]/80 italic leading-relaxed">{cap.outcomes}</p>
                    </div>
                    <div className="flex items-center text-[var(--primary)] text-sm font-medium gap-1">
                      View Capability <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ConsultationCTA
        title="Ready to Implement Your Digital Infrastructure?"
        description="Our advisors will help you understand which capabilities are most critical for your organization and design a phased implementation roadmap."
      />
    </main>
  );
}
