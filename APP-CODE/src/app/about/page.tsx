import { aboutContent } from "@/data/content";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import { Crosshair, Telescope, X, Check } from "lucide-react";

export default function AboutPage() {
  const { hero, whoWeAre, mission, vision, approach, difference } = aboutContent;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">

      {/* ── HERO ── */}
      <section className="pt-6 pb-20 md:pt-10 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--primary)]/6 blur-3xl" />
        </div>
        <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)]">
            {hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            <span className="text-white">We Build the</span>{" "}
            <span className="text-[var(--primary)]">Digital Infrastructure</span>{" "}
            <span className="text-white">That Powers</span>{" "}
            <span className="text-[var(--primary)]">Organizational Excellence</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            {hero.description}
          </p>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section className="py-20 border-y border-[var(--border)] bg-[var(--secondary)]/20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{whoWeAre.title}</h2>
          <div className="prose-memsyst space-y-5">
            {whoWeAre.paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-gray-300 leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-24">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="p-10 rounded-2xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)] shadow-xl card-hover card-glow">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center mb-6">
              <Crosshair className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">{mission.title}</h2>
            <p className="text-gray-300 leading-relaxed text-lg">{mission.statement}</p>
          </div>
          <div className="p-10 rounded-2xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)] shadow-xl card-hover card-glow">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center mb-6">
              <Telescope className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">{vision.title}</h2>
            <p className="text-gray-300 leading-relaxed text-lg">{vision.statement}</p>
          </div>
        </div>
      </section>

      {/* ── OUR APPROACH ── */}
      <section className="py-24 bg-gradient-to-b from-[var(--background)] to-[var(--secondary)]/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold text-white">{approach.title}</h2>
            <p className="text-lg text-gray-400">{approach.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {approach.steps.map((step, i) => (
              <div key={i} className="relative p-8 rounded-2xl border border-[var(--border)] glass-effect card-hover card-glow group">
                {/* Connector line */}
                {i < approach.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-[var(--primary)]/30 z-10" />
                )}
                <div className="text-4xl font-black text-[var(--primary)]/20 mb-4 group-hover:text-[var(--primary)]/40 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[var(--primary)] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE MEMSYST DIFFERENCE ── */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold text-white">{difference.title}</h2>
            <p className="text-lg text-gray-400">{difference.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional */}
            <div className="p-10 border border-red-900/40 bg-red-950/5 rounded-2xl space-y-6">
              <h3 className="text-xl font-bold text-red-400 pb-4 border-b border-red-900/30">
                {difference.traditional.label}
              </h3>
              <ul className="space-y-4">
                {difference.traditional.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400">
                    <X className="w-4 h-4 text-red-500/70 flex-shrink-0 mt-1" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* MemSyst */}
            <div className="p-10 border border-[var(--primary)]/30 bg-[var(--primary)]/5 rounded-2xl shadow-[0_0_40px_rgba(60,164,249,0.08)] space-y-6">
              <h3 className="text-xl font-bold text-[var(--primary)] pb-4 border-b border-[var(--primary)]/20">
                {difference.memsyst.label}
              </h3>
              <ul className="space-y-4">
                {difference.memsyst.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-200">
                    <Check className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-1" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ConsultationCTA
        title="Ready to Transform Your Organization?"
        description="Schedule a consultation to discover how MemSyst can build the digital infrastructure that powers your organization's next chapter."
      />
    </main>
  );
}
