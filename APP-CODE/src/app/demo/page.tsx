import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Wallet, ShieldCheck, GraduationCap, Store, ArrowRight } from "lucide-react";

const dashboards = [
  {
    title: "Executive Overview",
    description: "Real-time performance metrics, organizational health, and strategic KPIs.",
    href: "/demo/executive",
    icon: BarChart3,
    stats: "14,289 members · ₵2.4M revenue",
  },
  {
    title: "Membership Management",
    description: "Lifecycle tracking, onboarding, renewals, and engagement analytics.",
    href: "/demo/membership",
    icon: Users,
    stats: "412 new this month · 89% renewal",
  },
  {
    title: "Revenue & Finance",
    description: "Fee collection, dues management, invoicing, and financial reporting.",
    href: "/demo/revenue",
    icon: Wallet,
    stats: "94% compliance · ₵2.45M collected",
  },
  {
    title: "Governance & Administration",
    description: "Board management, digital voting, compliance tracking, and approvals.",
    href: "/demo/governance",
    icon: ShieldCheck,
    stats: "98% compliance · 24 pending approvals",
  },
  {
    title: "Training & Capacity Development",
    description: "LMS, certifications, CPD tracking, and learner analytics.",
    href: "/demo/training",
    icon: GraduationCap,
    stats: "3,190 learners · 22% of membership",
  },
  {
    title: "Marketplace & Economic Empowerment",
    description: "Member business directory, B2B connections, and job board.",
    href: "/demo/marketplace",
    icon: Store,
    stats: "842 businesses · 12 sectors",
  },
];

export default function DemoHub() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Enterprise Demo Environment</h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Explore MemSyst&apos;s unified digital infrastructure platform through interactive dashboard mockups. 
          Each dashboard demonstrates a core capability of the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((db) => {
          const Icon = db.icon;
          return (
            <Link key={db.href} href={db.href} className="group block">
              <Card className="bg-[#011B2B] border-[#01314E] h-full transition-all duration-300 hover:border-[var(--primary)]/40 hover:shadow-[0_0_20px_rgba(60,164,249,0.1)]">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg text-white group-hover:text-[var(--primary)] transition-colors">
                      {db.title}
                    </CardTitle>
                    <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
                      {db.description}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 ml-4">
                    <Icon className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{db.stats}</span>
                    <ArrowRight className="w-4 h-4 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="bg-[#011B2B] border-[#01314E]">
        <CardHeader>
          <CardTitle className="text-lg text-white">About This Demo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-400 space-y-3">
          <p>
            These dashboards represent a simulated environment for the Ghana Medical Association using 
            the MemSyst platform. All data shown is fictional and for demonstration purposes only.
          </p>
          <p>
            Navigate between dashboards using the sidebar. Each view showcases a different module of the 
            MemSyst unified platform, illustrating how disconnected systems consolidate into one 
            seamless digital infrastructure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
