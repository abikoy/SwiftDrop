import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SwiftDrop — Fast delivery for anything you need",
    template: "%s | SwiftDrop",
  },
  description:
    "SwiftDrop delivers food, groceries, medicine, and more to your door in minutes. Fast delivery for anything you need.",
  keywords: ["delivery", "food delivery", "grocery delivery", "SwiftDrop"],
  authors: [{ name: "SwiftDrop" }],
  openGraph: {
    title: "SwiftDrop — Fast delivery for anything you need",
    description:
      "Food, groceries, medicine, and more — delivered to your door in minutes.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "SwiftDrop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftDrop — Fast delivery for anything you need",
    description:
      "Food, groceries, medicine, and more — delivered to your door in minutes.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-dark text-[#F9FAFB] antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
