"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Settings, ShieldCheck, DollarSign, ListChecks } from "lucide-react"
import { PageHeader } from "@/components/admin"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const configCards = [
  {
    title: "Program Types",
    icon: <ListChecks className="h-5 w-5" />,
    items: [
      "Financial Assistance Programs",
      "Medical Support Programs",
      "Legal Aid Programs",
      "Counseling & Wellness",
      "Emergency Relief Programs",
      "Career Development Programs",
      "Housing Assistance",
      "Food & Nutrition Programs",
    ],
  },
  {
    title: "Approval Rules",
    icon: <ShieldCheck className="h-5 w-5" />,
    items: [
      "Loans > $10,000 require executive committee approval",
      "Scholarship awards must be reviewed by financial committee",
      "Sponsorships require program director sign-off",
      "Emergency programs bypass standard approval",
      "All new resources require admin verification",
    ],
  },
  {
    title: "Funding Rules",
    icon: <DollarSign className="h-5 w-5" />,
    items: [
      "Maximum loan amount: $50,000 per member",
      "Interest rates capped at 15% APR",
      "Scholarship fund allocation: 30% merit, 70% need-based",
      "Sponsorship matching: up to 50% from central fund",
      "Program budgets require quarterly reconciliation",
    ],
  },
]

export default function SupportHubSettingsPage() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-12">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Support Hub Settings"
          description="Configure support hub rules and options."
          actions={
            <Link
              href="/app/support-hub"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] bg-[#012a42] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#3CA4F9]/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Support Hub
            </Link>
          }
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {configCards.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <div className="rounded-2xl border border-[#1e3a5f]/50 bg-[#011B2B]/60 backdrop-blur-md p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#012a42] text-[#3CA4F9] shadow-inner border border-white/5">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{card.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {card.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3CA4F9]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
