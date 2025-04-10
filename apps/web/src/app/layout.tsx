import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "TT-Crew 🏓",
  description: "AOE - it's in the office",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} text-foreground bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] via-[#415a77] to-[#778da9] bg-fixed min-h-screen`}
      >
        {children}
      <Toaster />
      </body>
    </html>
  );
}
