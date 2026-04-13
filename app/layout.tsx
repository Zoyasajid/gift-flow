import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GiftFlow",
  description: "Premium gifting, delivered with care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex flex-col flex-1">{children}</main>
        <footer className="border-t border-black/5 py-8">
          <div className="mx-auto w-full max-w-6xl px-4 text-sm text-zinc-500">
            GiftFlow © {new Date().getFullYear()} — Made for thoughtful gifting.
          </div>
        </footer>
      </body>
    </html>
  );
}
