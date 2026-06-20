import Link from "next/link"
import { Home } from "lucide-react"

export default function RootNotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#011B2B] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#3CA4F9] mb-4">404</h1>
        <h2 className="text-xl font-semibold text-white mb-2">Page not found</h2>
        <p className="text-gray-400 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-[#3CA4F9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3CA4F9]/90 transition-colors">
          <Home className="h-4 w-4" /> Go home
        </Link>
      </div>
    </div>
  )
}
