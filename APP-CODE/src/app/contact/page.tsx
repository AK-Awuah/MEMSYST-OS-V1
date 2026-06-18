"use client";

import { useState } from "react";
import { contactContent } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { getFormsService } from "@/lib/services";

export default function ContactPage() {
  const { hero, methods, form } = contactContent;
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const svc = await getFormsService();
      await svc.createSubmission({
        type: "contact",
        data: Object.fromEntries(fd.entries()),
        status: "new",
        sourcePage: "/contact",
        notes: [],
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">

      {/* ── HERO ── */}
      <section className="pt-10 pb-20 md:pt-14 md:pb-24 border-b border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-[var(--primary)]/5 blur-3xl" />
        </div>
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)]">
            {hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            <span className="text-white">Get in Touch with the</span>{" "}
            <span className="text-[var(--primary)]">MemSyst Team</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">{hero.description}</p>
        </div>
      </section>

      {/* ── CONTACT METHODS ── */}
      <section className="py-16 border-b border-[var(--border)] bg-[var(--secondary)]/20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {methods.map((method) => {
              const Icon = method.type === "email" ? Mail : method.type === "phone" ? Phone : MapPin;
              return (
              <div
                key={method.type}
                className="p-8 rounded-2xl border border-[var(--border)] glass-effect card-hover card-glow text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center mx-auto group-hover:bg-[var(--primary)]/25 transition-colors">
                  <Icon className="w-7 h-7 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-white">{method.title}</h3>
                <p className="text-[var(--primary)] font-medium">{method.value}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{method.description}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MESSAGE FORM ── */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center space-y-6 p-12 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 glass-effect">
                <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h2 className="text-3xl font-bold text-white">Message Sent</h2>
                <p className="text-gray-300 leading-relaxed">
                  Thank you for reaching out. We will respond to your message within one business day.
                </p>
              </div>
            ) : (
              <div className="p-8 md:p-10 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/30 glass-effect shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-1">{form.title}</h2>
                  <p className="text-sm text-gray-400">{form.subtitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input type="text" name="fullName" className="form-input" placeholder="John Doe" required />
                    </div>
                    <div>
                      <label className="form-label">Phone Number</label>
                      <input type="tel" name="phone" className="form-input" placeholder="+233 50 000 0000" />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <input type="email" name="email" className="form-input" placeholder="john@org.com" required />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Organization</label>
                    <input type="text" name="organization" className="form-input" placeholder="Your organization name" />
                  </div>
                  <div>
                    <label className="form-label">Subject</label>
                    <input type="text" name="subject" className="form-input" placeholder="How can we help?" required />
                  </div>
                  <div>
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      className="form-input resize-none"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <Button type="submit" size="lg" className="w-full text-base shadow-[0_0_15px_rgba(60,164,249,0.25)]" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : form.submitLabel}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
