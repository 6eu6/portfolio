import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmed Al‑Shaibani — Builder · Founder · Developer",
  description: "A calm, precise portfolio hub for projects, systems, writing, and digital experiences built by Ahmed Al‑Shaibani.",
  keywords: ["Ahmed Al-Shaibani", "portfolio", "builder", "founder", "developer", "AI", "product", "systems"],
  authors: [{ name: "Ahmed Al‑Shaibani" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Ahmed Al‑Shaibani — Portfolio",
    description: "Products, systems, and digital experiences. Builder · Founder · Developer.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Al‑Shaibani — Portfolio",
    description: "Products, systems, and digital experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--paper)] text-[var(--ink)]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
