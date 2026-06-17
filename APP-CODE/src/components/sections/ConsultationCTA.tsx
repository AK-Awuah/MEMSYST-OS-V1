import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ConsultationCTAProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryCTA?: string;
  primaryCTAHref?: string;
  secondaryCTA?: string;
  secondaryCTAHref?: string;
}

export default function ConsultationCTA({
  badge = "Ready to Transform?",
  title = "Start Your Digital Transformation Today",
  description = "Schedule a strategic consultation with our team. We'll assess your current infrastructure, identify your highest-priority gaps, and develop a transformation roadmap tailored to your organization.",
  primaryCTA = "Schedule a Consultation",
  primaryCTAHref = "/consultation",
  secondaryCTA = "Explore Capabilities",
  secondaryCTAHref = "/capabilities",
}: ConsultationCTAProps) {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[var(--primary)]/5 blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8 p-12 rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-b from-[var(--secondary)]/40 to-[var(--background)] glass-effect shadow-2xl">
          <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)]">
            {badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href={primaryCTAHref}>
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-10 glow-pulse shadow-[0_0_20px_rgba(60,164,249,0.3)]"
              >
                {primaryCTA}
              </Button>
            </Link>
            <Link href={secondaryCTAHref}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-10"
              >
                {secondaryCTA}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
