import { fullCapabilitiesData } from "@/data/capabilities";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import { capabilityIcons } from "@/data/icons";
import { Check } from "lucide-react";

export function generateStaticParams() {
  return fullCapabilitiesData.map((cap) => ({ slug: cap.slug }));
}

export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const capability = fullCapabilitiesData.find((c) => c.slug === resolvedParams.slug);
  if (!capability) notFound();

  const currentIndex = fullCapabilitiesData.findIndex((c) => c.slug === resolvedParams.slug);
  const prevCap = currentIndex > 0 ? fullCapabilitiesData[currentIndex - 1] : null;
  const nextCap = currentIndex < fullCapabilitiesData.length - 1 ? fullCapabilitiesData[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">

      {/* ── HERO ── */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-20 border-b border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/5 blur-3xl" />
        </div>
        <div className="container px-4 md:px-6 max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/capabilities" className="text-sm text-gray-400 hover:text-[var(--primary)] transition-colors">
              ← All Capabilities
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-sm text-gray-500">{capability.title}</span>
          </div>
          <div className="flex items-start gap-6">
            <div className="hidden md:flex w-20 h-20 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/20 items-center justify-center flex-shrink-0">
              {(() => { const Icon = capabilityIcons[capability.number]; return Icon ? <Icon className="w-10 h-10 text-[var(--primary)]" /> : null; })()}
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="capability-number text-base">{capability.number}</span>
                <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs text-[var(--primary)]">
                  Capability
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {capability.title.includes("&") ? (
                  <>
                    <span className="text-white">{capability.title.split("&")[0].trim()}</span>
                    {" & "}
                    <span className="text-[var(--primary)]">{capability.title.split("&")[1].trim()}</span>
                  </>
                ) : (
                  <>
                    <span className="text-white">{capability.title.split(" ").slice(0, -1).join(" ")}</span>
                    {" "}
                    <span className="text-[var(--primary)]">{capability.title.split(" ").pop()}</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
                {capability.shortOverview}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="py-20 bg-[var(--secondary)]/20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <p className="text-lg text-gray-300 leading-relaxed">{capability.overview}</p>
        </div>
      </section>

      {/* ── BENEFITS & FEATURES ── */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">

            {/* Key Benefits */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white">Key Benefits</h2>
              <ul className="space-y-5">
                {capability.keyBenefits.map((benefit, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-[var(--primary)]" />
                    </div>
                    <span className="text-gray-300 leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features + Outcome */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Platform Features</h2>
                <ul className="space-y-3">
                  {capability.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400">
                      <span className="text-[var(--primary)]/60 flex-shrink-0 mt-1">▸</span>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcome Card */}
              <div className="p-8 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 shadow-[0_0_30px_rgba(60,164,249,0.08)]">
                <h3 className="text-lg font-semibold text-[var(--primary)] mb-3">Organizational Outcome</h3>
                <p className="text-xl text-white font-light italic leading-relaxed">
                  "{capability.outcomes}"
                </p>
                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <Link href="/consultation">
                    <Button size="lg" className="w-full text-base shadow-[0_0_15px_rgba(60,164,249,0.25)]">
                      {capability.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PREV / NEXT NAVIGATION ── */}
      <section className="py-12 border-t border-[var(--border)] bg-[var(--secondary)]/20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto flex justify-between items-center gap-4">
          {prevCap ? (
            <Link
              href={`/capabilities/${prevCap.slug}`}
              className="flex items-center gap-3 group p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/40 transition-colors"
            >
              <span className="text-gray-400 group-hover:text-[var(--primary)]">←</span>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Previous</div>
                <div className="text-sm font-medium text-white group-hover:text-[var(--primary)] transition-colors">{prevCap.title}</div>
              </div>
            </Link>
          ) : <div />}

          <Link href="/capabilities" className="text-sm text-gray-400 hover:text-[var(--primary)] transition-colors px-4">
            All Capabilities
          </Link>

          {nextCap ? (
            <Link
              href={`/capabilities/${nextCap.slug}`}
              className="flex items-center gap-3 group p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/40 transition-colors text-right"
            >
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Next</div>
                <div className="text-sm font-medium text-white group-hover:text-[var(--primary)] transition-colors">{nextCap.title}</div>
              </div>
              <span className="text-gray-400 group-hover:text-[var(--primary)]">→</span>
            </Link>
          ) : <div />}
        </div>
      </section>

      <ConsultationCTA
        title={`Implement ${capability.title} in Your Organization`}
        description="Schedule a consultation to discover how this capability integrates with your current infrastructure and what outcomes you can realistically achieve."
        primaryCTA="Schedule Consultation"
        secondaryCTA="View All Capabilities"
        secondaryCTAHref="/capabilities"
      />
    </main>
  );
}
