import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

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
      <body className="min-h-screen bg-[var(--background)] font-sans antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
