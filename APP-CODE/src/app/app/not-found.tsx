import Link from "next/link"

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-white">Page Not Found</h2>
      <p className="text-sm text-gray-400">The page you are looking for does not exist.</p>
      <Link
        href="/app/dashboard"
        className="rounded-lg bg-[#3CA4F9] px-4 py-2 text-sm font-medium text-white hover:bg-[#3594e0]"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
