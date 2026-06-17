import Link from "next/link";
import { homeContent } from "@/data/content";
import { fullCapabilitiesData } from "@/data/capabilities";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import { capabilityIcons, outcomeIcons } from "@/data/icons";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { X, Check } from "lucide-react";

export default function Home() {
  const { hero, problemStatement, whyInfrastructure, transformationJourney, capabilities, outcomes, industries, whyMemSyst, consultationCTA } = homeContent;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#011B2B] via-[#012a42] to-[#011B2B]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[var(--primary)]/6 blur-3xl" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-8 mt-8">
          <div className="inline-flex rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-5 py-2 text-sm text-[var(--primary)] font-medium backdrop-blur animate-fade-in-scale">
            {hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-5xl leading-[1.1] animate-fade-in-up stagger-1">
            <span className="text-white">Transforming Membership Organizations</span>{" "}
            <span className="text-[var(--primary)]">Through Digital Infrastructure</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl font-light leading-relaxed animate-fade-in-up stagger-2">
            {hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up stagger-3">
            <Link href={hero.primaryCTAHref}>
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 glow-pulse shadow-[0_0_25px_rgba(60,164,249,0.35)]">
                {hero.primaryCTA}
              </Button>
            </Link>
            <Link href={hero.secondaryCTAHref}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10">
                {hero.secondaryCTA}
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 w-full max-w-3xl animate-fade-in-up stagger-5">
            {problemStatement.painPoints.map((point, i) => (
              <div key={i} className="text-center p-4 rounded-xl border border-[var(--border)] glass-effect card-hover">
                <div className="text-3xl font-bold text-[var(--primary)]">{point.stat}</div>
                <div className="text-xs text-gray-400 mt-1 leading-tight">{point.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 text-xs animate-float">
          <span>Scroll to explore</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ── */}
      <ScrollReveal>
      <section className="py-28 bg-[var(--secondary)]/30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)] pointer-events-none" />
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-400 font-medium">
            {problemStatement.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {problemStatement.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            {problemStatement.description}
          </p>
        </div>
      </section>
      </ScrollReveal>

      {/* ── WHY DIGITAL INFRASTRUCTURE ── */}
      <ScrollReveal delay={100}>
      <section className="py-28">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)]">
              {whyInfrastructure.badge}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight">
              {whyInfrastructure.title}
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {whyInfrastructure.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyInfrastructure.pillars.map((pillar, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-[var(--border)] bg-gradient-to-b from-[var(--secondary)]/40 to-transparent card-hover card-glow group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/15 flex items-center justify-center mb-4 text-[var(--primary)] group-hover:bg-[var(--primary)]/25 transition-colors">
                  <span className="text-lg font-bold">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ── TRANSFORMATION JOURNEY ── */}
      <ScrollReveal>
      <section className="py-28 bg-gradient-to-b from-[var(--background)] to-[var(--secondary)]/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold text-white">{transformationJourney.title}</h2>
            <p className="text-lg text-gray-400">{transformationJourney.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Before */}
            <div className="p-8 rounded-2xl border border-red-900/40 bg-red-950/10 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-400">Before MemSyst</h3>
              </div>
              <ul className="space-y-3">
                {transformationJourney.before.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400">
                    <X className="w-4 h-4 text-red-500/70 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* After */}
            <div className="p-8 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 shadow-[0_0_40px_rgba(60,164,249,0.08)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--primary)]">With MemSyst</h3>
              </div>
              <ul className="space-y-3">
                {transformationJourney.after.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-200">
                    <Check className="w-4 h-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ── 10 CAPABILITIES ── */}
      <ScrollReveal>
      <section className="py-32 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full bg-[var(--primary)]/3 blur-3xl" />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)]">
              {capabilities.badge}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">{capabilities.title}</h2>
            <p className="text-xl text-[var(--primary)] font-light">{capabilities.subtitle}</p>
            <p className="text-gray-400 max-w-2xl mx-auto">{capabilities.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {fullCapabilitiesData.map((cap) => {
              const Icon = capabilityIcons[cap.number];
              return (
              <Link href={`/capabilities/${cap.slug}`} key={cap.id}>
                <Card className="h-full card-hover card-glow cursor-pointer border-[var(--border)] hover:border-[var(--primary)]/60 bg-[var(--secondary)]/20 hover:bg-[var(--secondary)]/40 hover:shadow-[0_0_30px_rgba(60,164,249,0.15)] glass-effect group">
                  <CardHeader className="pb-2">
                    <div className="capability-number mb-2">{cap.number}</div>
                    <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/15 flex items-center justify-center mb-3 group-hover:bg-[var(--primary)]/25 transition-colors">
                      {Icon && <Icon className="w-5 h-5 text-[var(--primary)]" />}
                    </div>
                    <CardTitle className="text-sm font-semibold text-white leading-tight group-hover:text-[var(--primary)] transition-colors">
                      {cap.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{cap.shortOverview}</p>
                    <div className="mt-5 pt-3 border-t border-[var(--border)]/50 text-xs text-[var(--primary)] font-medium flex items-center gap-1">
                      Learn more <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/capabilities">
              <Button variant="outline" size="lg" className="text-lg px-10">
                Explore All Capabilities
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ── OUTCOMES ── */}
      <ScrollReveal>
      <section className="py-28 bg-[var(--secondary)]/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Outcomes We Deliver</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Every capability we build is designed to answer one question: how does this make your organization stronger?
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outcomes.map((outcome, idx) => {
              const Icon = outcomeIcons[outcome.icon as keyof typeof outcomeIcons];
              return (
              <div
                key={idx}
                className="p-8 rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--secondary)]/40 to-[var(--background)] card-hover card-glow group"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center mb-4 group-hover:bg-[var(--primary)]/25 transition-colors">
                  {Icon && <Icon className="w-6 h-6 text-[var(--primary)]" />}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[var(--primary)] transition-colors">
                  {outcome.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{outcome.description}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ── INDUSTRIES ── */}
      <ScrollReveal>
      <section className="py-28">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)]">
              {industries.badge}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">{industries.title}</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">{industries.subtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {industries.list.map((industry) => (
              <Link key={industry} href="/industries">
                <div className="px-6 py-3 rounded-full border border-[var(--border)] bg-[var(--secondary)]/30 text-gray-300 hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 hover:-translate-y-0.5 transition-all cursor-pointer text-sm font-medium">
                  {industry}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/industries">
              <Button variant="outline" className="px-8">
                View All Industry Solutions →
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ── WHY MEMSYST ── */}
      <ScrollReveal>
      <section className="py-28 bg-gradient-to-b from-[var(--secondary)]/30 to-[var(--background)]">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)]">
              {whyMemSyst.badge}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">{whyMemSyst.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whyMemSyst.points.map((point, i) => (
              <div key={i} className="text-center space-y-4 p-8 rounded-2xl border border-[var(--border)] glass-effect card-hover card-glow">
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/15 flex items-center justify-center mx-auto">
                  {i === 0 ? (
                    <svg className="w-7 h-7 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : i === 1 ? (
                    <svg className="w-7 h-7 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  ) : (
                    <svg className="w-7 h-7 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{point.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ── CONSULTATION CTA ── */}
      <ConsultationCTA
        badge={consultationCTA.badge}
        title={consultationCTA.title}
        description={consultationCTA.description}
        primaryCTA={consultationCTA.primaryCTA}
        primaryCTAHref={consultationCTA.primaryCTAHref}
        secondaryCTA={consultationCTA.secondaryCTA}
        secondaryCTAHref={consultationCTA.secondaryCTAHref}
      />

    </main>
  );
}
