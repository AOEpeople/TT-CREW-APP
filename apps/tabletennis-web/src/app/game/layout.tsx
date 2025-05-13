"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen w-screen p-4">
      <div className="w-full">
        <Button variant="link" asChild className="p-0 m-0 text-white">
          <Link href="/">
            <ChevronLeft />
            zurück
          </Link>
        </Button>
    </div>
      <h1 className="text-3xl font-bold mb-4 text-center text-white">Spiel</h1>
      {children}
    </main>
  );
} 