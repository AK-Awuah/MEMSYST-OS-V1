"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2 } from "lucide-react";

export default function SignInPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 flex items-center justify-center">
      {/* Background Glow */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[var(--primary)]/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md px-4 py-16 relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden">
              <Image src="/images/Small-logo.png" alt="MemSyst" width={40} height={40} className="object-contain" unoptimized />
            </div>
            <span className="text-2xl font-bold text-[var(--primary)]">MEMSYST</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6 mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to your organization's MemSyst portal</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 p-10 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 glass-effect">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white">Signing You In...</h2>
            <p className="text-gray-400 text-sm">Redirecting to your portal dashboard.</p>
          </div>
        ) : (
          <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/30 glass-effect shadow-2xl card-glow">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@yourorganization.org"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label mb-0">Password</label>
                  <Link href="/contact" className="text-xs text-[var(--primary)] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-[var(--border)] bg-[var(--background)] accent-[var(--primary)]"
                />
                <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                  Keep me signed in
                </label>
              </div>
              <Button type="submit" size="lg" className="w-full text-base shadow-[0_0_20px_rgba(60,164,249,0.25)]">
                Sign In to Portal
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--border)] text-center space-y-3">
              <p className="text-sm text-gray-400">
                Not yet a MemSyst organization?
              </p>
              <Link href="/consultation">
                <Button variant="outline" className="w-full">
                  Request Organization Access
                </Button>
              </Link>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-600 mt-6">
          Having trouble accessing your portal?{" "}
          <Link href="/contact" className="text-[var(--primary)] hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
}
