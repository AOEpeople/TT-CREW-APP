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
        className={inter.className}
        style={{
          background: "linear-gradient(160deg, #0d1b2a, #1b263b, #415a77, #778da9)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
      <Toaster />
    </html>
  );
}
