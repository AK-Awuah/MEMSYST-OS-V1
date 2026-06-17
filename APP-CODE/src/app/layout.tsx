import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MemSyst | Digital Infrastructure & Membership Technology",
  description:
    "MemSyst helps membership organizations modernize operations, strengthen governance, improve member value, and achieve sustainable growth through 10 integrated digital infrastructure capabilities.",
  icons: {
    icon: "/images/Small-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#011B2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-[var(--background)] font-sans antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
