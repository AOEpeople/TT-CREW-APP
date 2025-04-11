"use client";

import { ReactNode } from "react";
import { OfflineMatchesProvider } from "./context/offlineMatchesContext";
import { MatchSavingProvider } from "./hooks/useMatchSaving";

interface GameLayoutProps {
  children: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <OfflineMatchesProvider>
      <MatchSavingProvider>
        {children}
      </MatchSavingProvider>
    </OfflineMatchesProvider>
  );
} 