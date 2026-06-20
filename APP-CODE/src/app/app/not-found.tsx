import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AppNotFoundPage() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#3CA4F9] mb-4">404</h1>
        <h2 className="text-xl font-semibold text-white mb-2">Page not found</h2>
        <p className="text-gray-400 mb-8">The page you are looking for does not exist.</p>
        <Link href="/app/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
