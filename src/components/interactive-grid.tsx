"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveGridProps {
  className?: string;
  children?: React.ReactNode;
  cellSize?: number;
  glowColor?: string;
  borderColor?: string;
  proximity?: number;
}

export function InteractiveGrid({
  className,
  children,
  cellSize = 50,
  glowColor = "rgba(60, 80, 180, 0.5)",
  borderColor = "rgba(255, 255, 255, 0.06)",
  proximity = 120,
}: InteractiveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ rows: 0, cols: 0, scale: 1 });
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const updateGrid = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    const scale = Math.max(1, Math.min(width, height) / 800);
    const scaledCellSize = cellSize * scale;
    const cols = Math.ceil(width / scaledCellSize) + 1;
    const rows = Math.ceil(height / scaledCellSize) + 1;
    setGrid({ rows, cols, scale });
  }, [cellSize]);

  useEffect(() => {
    updateGrid();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(updateGrid);
    ro.observe(container);
    return () => ro.disconnect();
  }, [updateGrid]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
    setHoveredCell(null);
  }, []);

  const scaledCellSize = cellSize * grid.scale;
  const scaledProximity = proximity * grid.scale;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grid cells */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: grid.rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex">
            {Array.from({ length: grid.cols }).map((_, colIndex) => {
              const index = rowIndex * grid.cols + colIndex;
              const cellX = colIndex * scaledCellSize + scaledCellSize / 2;
              const cellY = rowIndex * scaledCellSize + scaledCellSize / 2;
              const dx = mousePos.x - cellX;
              const dy = mousePos.y - cellY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const proximityFactor = Math.max(
                0,
                1 - distance / scaledProximity
              );
              const isHovered = hoveredCell === index;

              return (
                <div
                  key={index}
                  className="shrink-0 border transition-all ease-out pointer-events-auto"
                  style={{
                    width: scaledCellSize,
                    height: scaledCellSize,
                    borderColor: borderColor,
                    backgroundColor: isHovered
                      ? glowColor
                      : proximityFactor > 0
                        ? glowColor.replace(
                            /[\d.]+\)$/,
                            `${proximityFactor * 0.4})`
                          )
                        : "transparent",
                    boxShadow: isHovered
                      ? `0 0 ${30 * grid.scale}px ${glowColor}, inset 0 0 ${15 * grid.scale}px ${glowColor.replace(/[\d.]+\)$/, "0.4)")}`
                      : "none",
                    transitionDuration: isHovered ? "0ms" : "800ms",
                  }}
                  onMouseEnter={() => setHoveredCell(index)}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
