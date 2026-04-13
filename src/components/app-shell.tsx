"use client";

import { InteractiveGrid } from "@/components/interactive-grid";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <InteractiveGrid
      className="min-h-full flex flex-col"
      cellSize={45}
      glowColor="rgba(60, 80, 180, 0.5)"
      borderColor="rgba(255, 255, 255, 0.06)"
      proximity={120}
    >
      {children}
    </InteractiveGrid>
  );
}
