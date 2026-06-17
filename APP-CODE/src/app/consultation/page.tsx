"use client";

import { useState } from "react";
import { consultationContent } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Search, Map, Lightbulb, CalendarCheck, Check } from "lucide-react";

export default function ConsultationPage() {
  const { hero, benefits, form, trustSignals } = consultationContent;
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">

      {/* ── HERO ── */}
      <section className="pt-10 pb-16 md:pt-14 md:pb-20 border-b border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/5 blur-3xl" />
        </div>
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)]">
            {hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            <span className="text-white">Partner with</span>{" "}
            <span className="text-[var(--primary)]">MemSyst</span>{" "}
            <span className="text-white">to Build Your</span>{" "}
            <span className="text-[var(--primary)]">Digital Future</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {hero.description}
          </p>
        </div>
      </section>

      {/* ── FORM SECTION ── */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-5 gap-16 max-w-6xl mx-auto">

            {/* Left Column — Benefits */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">What to Expect</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Our consultation is a structured, executive-level session — not a product demo. We invest the time to understand your organization before we recommend anything.
                </p>
              </div>
              <div className="space-y-6">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center">
                      {i === 0 ? <Search className="w-5 h-5 text-[var(--primary)]" /> : i === 1 ? <Map className="w-5 h-5 text-[var(--primary)]" /> : <Lightbulb className="w-5 h-5 text-[var(--primary)]" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Signals */}
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/30">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">Our Commitment</h3>
                <div className="space-y-3">
                  {trustSignals.map((signal, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                      <span className="text-sm text-gray-300">{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column — Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-6 p-12 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 glass-effect">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto">
                      <CalendarCheck className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Consultation Requested</h2>
                    <p className="text-gray-300 leading-relaxed max-w-md mx-auto">
                      Thank you. A senior MemSyst advisor will reach out within 24 business hours to confirm your consultation session.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 md:p-10 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/30 glass-effect shadow-2xl card-glow">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-1">{form.title}</h2>
                    <p className="text-sm text-gray-400">{form.subtitle}</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">{form.fields.firstName.label}</label>
                        <input type="text" className="form-input" placeholder={form.fields.firstName.placeholder} required />
                      </div>
                      <div>
                        <label className="form-label">{form.fields.lastName.label}</label>
                        <input type="text" className="form-input" placeholder={form.fields.lastName.placeholder} required />
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="form-label">{form.fields.title.label}</label>
                      <input type="text" className="form-input" placeholder={form.fields.title.placeholder} required />
                    </div>

                    {/* Organization + Type Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">{form.fields.organization.label}</label>
                        <input type="text" className="form-input" placeholder={form.fields.organization.placeholder} required />
                      </div>
                      <div>
                        <label className="form-label">{form.fields.organizationType.label}</label>
                        <select className="form-input" required defaultValue="">
                          {form.fields.organizationType.options.map((opt, i) => (
                            <option key={i} value={i === 0 ? "" : opt} disabled={i === 0}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Member Count */}
                    <div>
                      <label className="form-label">{form.fields.memberCount.label}</label>
                      <select className="form-input" defaultValue="">
                        {form.fields.memberCount.options.map((opt, i) => (
                          <option key={i} value={i === 0 ? "" : opt} disabled={i === 0}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Email + Phone Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">{form.fields.email.label}</label>
                        <input type="email" className="form-input" placeholder={form.fields.email.placeholder} required />
                      </div>
                      <div>
                        <label className="form-label">{form.fields.phone.label}</label>
                        <input type="tel" className="form-input" placeholder={form.fields.phone.placeholder} />
                      </div>
                    </div>

                    {/* Challenge */}
                    <div>
                      <label className="form-label">{form.fields.challenge.label}</label>
                      <textarea rows={4} className="form-input resize-none" placeholder={form.fields.challenge.placeholder} required />
                    </div>

                    {/* Preferred Contact */}
                    <div>
                      <label className="form-label">{form.fields.preferredContact.label}</label>
                      <select className="form-input" defaultValue="">
                        {form.fields.preferredContact.options.map((opt, i) => (
                          <option key={i} value={i === 0 ? "" : opt} disabled={i === 0}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2">
                      <Button type="submit" size="lg" className="w-full text-base shadow-[0_0_20px_rgba(60,164,249,0.3)] glow-pulse">
                        {form.submitLabel}
                      </Button>
                      <p className="text-xs text-gray-500 text-center mt-3">{form.disclaimer}</p>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
