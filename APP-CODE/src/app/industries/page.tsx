import { industriesContent } from "@/data/content";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import { Building2, GraduationCap, Handshake, Sprout, Heart, Globe, Shield, Network, Check, ArrowRight } from "lucide-react";

const industryIcons: Record<string, React.ReactNode> = {
  associations: <Building2 className="w-7 h-7 text-[var(--primary)]" />,
  "professional-bodies": <GraduationCap className="w-7 h-7 text-[var(--primary)]" />,
  "trade-associations": <Handshake className="w-7 h-7 text-[var(--primary)]" />,
  cooperatives: <Sprout className="w-7 h-7 text-[var(--primary)]" />,
  ngos: <Heart className="w-7 h-7 text-[var(--primary)]" />,
  federations: <Globe className="w-7 h-7 text-[var(--primary)]" />,
  unions: <Shield className="w-7 h-7 text-[var(--primary)]" />,
  "alumni-associations": <Network className="w-7 h-7 text-[var(--primary)]" />,
};

export default function IndustriesPage() {
  const { hero, industries } = industriesContent;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">

      {/* ── HERO ── */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[var(--primary)]/4 blur-3xl" />
        </div>
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)]">
            {hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            <span className="text-[var(--primary)]">Purpose-Built</span>{" "}
            <span className="text-white">for Membership Organizations</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {hero.description}
          </p>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="py-16 pb-32">
        <div className="container px-4 md:px-6 space-y-8">
          {industries.map((industry, i) => (
            <div
              key={industry.id}
              className={`grid lg:grid-cols-2 gap-12 items-center py-16 ${
                i < industries.length - 1 ? "border-b border-[var(--border)]" : ""
              } ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}
            >
              {/* Content */}
              <div className={`space-y-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/20 flex items-center justify-center">
                      {industryIcons[industry.id]}
                    </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{industry.title}</h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">{industry.description}</p>
                <Link href="/consultation">
                  <Button variant="outline" className="mt-4 group">
                    {industry.cta} <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Value Props */}
              <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="p-8 rounded-2xl border border-[var(--primary)]/20 bg-[var(--secondary)]/30 glass-effect space-y-5">
                  <h3 className="text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-6">
                    How MemSyst Helps
                  </h3>
                  {industry.valueProps.map((prop, j) => (
                    <div key={j} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--primary)]/15 flex items-center justify-center">
                        <Check className="w-4 h-4 text-[var(--primary)]" />
                      </div>
                      <p className="text-gray-300 leading-relaxed">{prop}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ConsultationCTA
        title="Let's Build the Right Infrastructure for Your Organization"
        description="Schedule a consultation to discuss the specific challenges and opportunities for your organization type — and design a tailored digital transformation roadmap."
        primaryCTA="Schedule a Consultation"
        secondaryCTA="Explore Our Capabilities"
        secondaryCTAHref="/capabilities"
      />
    </main>
  );
}
