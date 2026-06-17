import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  platform: {
    label: "Platform",
    links: [
      { href: "/capabilities", label: "All Capabilities" },
      { href: "/capabilities/membership-management", label: "Membership Management" },
      { href: "/capabilities/financial-management", label: "Financial Management" },
      { href: "/capabilities/governance-administration", label: "Governance & Admin" },
      { href: "/capabilities/data-analytics", label: "Data Analytics" },
      { href: "/capabilities/digital-portals", label: "Digital Portals" },
    ],
  },
  company: {
    label: "Company",
    links: [
      { href: "/about", label: "About MemSyst" },
      { href: "/industries", label: "Industries" },
      { href: "/resources", label: "Resources" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  getStarted: {
    label: "Get Started",
    links: [
      { href: "/consultation", label: "Schedule Consultation" },
      { href: "/signin", label: "Sign In" },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--secondary)]/40">
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-bold text-[#011B2B] text-lg overflow-hidden">
                <Image src="/images/Small-logo.png" alt="MemSyst" width={32} height={32} className="object-contain" unoptimized />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--primary)]">MEMSYST</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Digital Infrastructure & Membership Technology. Built exclusively for membership-based organizations.
            </p>
            <p className="text-xs text-gray-500">
              Transforming organizations across Africa and beyond.
            </p>
          </div>

          {/* Nav Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.label} className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
                {section.label}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-[var(--primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MemSyst. All rights reserved. Digital Infrastructure & Membership Technology.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
