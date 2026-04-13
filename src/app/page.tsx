"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Mail, ArrowRight, Swords } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { profile } from "@/lib/data";

// --- Types ---
interface Point {
  x: number;
  y: number;
}

interface CutInfo {
  entryPct: Point; // 0-1 relative to element
  exitPct: Point;
  angle: number; // radians, perpendicular to cut direction
}

// --- Geometry helpers ---

/** Find where slash enters and exits an element, as 0-1 percentages */
function findCutPoints(
  slashPoints: Point[],
  rect: DOMRect
): { entry: Point; exit: Point } | null {
  let firstInside: Point | null = null;
  let lastInside: Point | null = null;

  for (const p of slashPoints) {
    if (
      p.x >= rect.left &&
      p.x <= rect.right &&
      p.y >= rect.top &&
      p.y <= rect.bottom
    ) {
      if (!firstInside) firstInside = p;
      lastInside = p;
    }
  }

  if (!firstInside || !lastInside || firstInside === lastInside) return null;

  // Convert to 0-1 percentages within element
  const w = rect.width || 1;
  const h = rect.height || 1;
  return {
    entry: {
      x: Math.max(0, Math.min(1, (firstInside.x - rect.left) / w)),
      y: Math.max(0, Math.min(1, (firstInside.y - rect.top) / h)),
    },
    exit: {
      x: Math.max(0, Math.min(1, (lastInside.x - rect.left) / w)),
      y: Math.max(0, Math.min(1, (lastInside.y - rect.top) / h)),
    },
  };
}

/** Snap a 0-1 point to the nearest rectangle edge */
function snapToEdge(p: Point): Point {
  const dists = [p.y, 1 - p.x, 1 - p.y, p.x]; // top, right, bottom, left
  const minD = Math.min(...dists);
  const edge = dists.indexOf(minD);
  switch (edge) {
    case 0: return { x: p.x, y: 0 };
    case 1: return { x: 1, y: p.y };
    case 2: return { x: p.x, y: 1 };
    case 3: return { x: 0, y: p.y };
    default: return p;
  }
}

/** Get perimeter parameter (0-4) for a point snapped to edge */
function perimeterT(p: Point): number {
  if (p.y <= 0.001) return p.x;           // top edge: 0-1
  if (p.x >= 0.999) return 1 + p.y;       // right edge: 1-2
  if (p.y >= 0.999) return 2 + (1 - p.x); // bottom edge: 2-3
  return 3 + (1 - p.y);                   // left edge: 3-4
}

/** Check if t is between start and end going clockwise (0-4 wrapping) */
function isBetweenCW(start: number, end: number, t: number): boolean {
  if (start < end) return t > start && t < end;
  return t > start || t < end;
}

/** Build two polygon clip-paths from entry/exit points (0-1 coords) */
function buildClipPaths(
  rawEntry: Point,
  rawExit: Point
): { clip1: string; clip2: string } {
  const entry = snapToEdge(rawEntry);
  const exit = snapToEdge(rawExit);
  const eT = perimeterT(entry);
  const xT = perimeterT(exit);

  // Corners at perimeter t = 0, 1, 2, 3
  const corners = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];
  const cornerTs = [0, 1, 2, 3];

  const fmt = (p: Point) => `${(p.x * 100).toFixed(1)}% ${(p.y * 100).toFixed(1)}%`;

  // Polygon 1: walk clockwise from entry to exit
  const poly1: string[] = [fmt(entry)];
  for (let i = 0; i < 4; i++) {
    if (isBetweenCW(eT, xT, cornerTs[i])) {
      poly1.push(fmt(corners[i]));
    }
  }
  poly1.push(fmt(exit));

  // Polygon 2: walk clockwise from exit to entry
  const poly2: string[] = [fmt(exit)];
  for (let i = 0; i < 4; i++) {
    if (isBetweenCW(xT, eT, cornerTs[i])) {
      poly2.push(fmt(corners[i]));
    }
  }
  poly2.push(fmt(entry));

  return {
    clip1: `polygon(${poly1.join(", ")})`,
    clip2: `polygon(${poly2.join(", ")})`,
  };
}

// --- Slash canvas hook ---
function useSlashCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  onSlashEnd: (points: Point[]) => void
) {
  const slashesRef = useRef<{ id: number; points: Point[] }[]>([]);
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<Point[]>([]);
  const animFrameRef = useRef<number>(0);

  const getPos = useCallback(
    (e: MouseEvent | TouchEvent): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        const touch = e.touches[0];
        if (!touch) return null;
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [canvasRef]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      slashesRef.current = slashesRef.current.filter((s) => now - s.id < 800);

      for (const slash of slashesRef.current) {
        const age = now - slash.id;
        const fade = Math.max(0, 1 - age / 800);
        const pts = slash.points;
        if (pts.length < 2) continue;

        ctx.save();
        ctx.globalAlpha = fade * 0.25;
        ctx.strokeStyle = "#8ba4ff";
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "#8ba4ff";
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = fade * 0.9;
        ctx.strokeStyle = "#c8d4ff";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.restore();
      }

      if (isDrawingRef.current && currentPointsRef.current.length > 1) {
        const pts = currentPointsRef.current;
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = "#8ba4ff";
        ctx.lineWidth = 12;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "#8ba4ff";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = "#c8d4ff";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    const onStart = (e: MouseEvent | TouchEvent) => {
      isDrawingRef.current = true;
      const pos = getPos(e);
      currentPointsRef.current = pos ? [pos] : [];
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      const pos = getPos(e);
      if (pos) {
        currentPointsRef.current.push(pos);
        if (currentPointsRef.current.length > 60)
          currentPointsRef.current = currentPointsRef.current.slice(-60);
      }
    };
    const onEnd = () => {
      if (isDrawingRef.current && currentPointsRef.current.length > 2) {
        const pts = [...currentPointsRef.current];
        slashesRef.current.push({ id: Date.now(), points: pts });
        onSlashEnd(pts);
      }
      isDrawingRef.current = false;
      currentPointsRef.current = [];
    };

    const el = containerRef.current || canvas;
    const onMouseStart = (e: Event) => onStart(e as MouseEvent);
    const onMouseMove = (e: Event) => onMove(e as MouseEvent);
    const onTouchStart = (e: Event) => onStart(e as TouchEvent);
    const onTouchMove = (e: Event) => onMove(e as TouchEvent);

    el.addEventListener("mousedown", onMouseStart);
    el.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      el.removeEventListener("mousedown", onMouseStart);
      el.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [canvasRef, containerRef, getPos, onSlashEnd]);
}

// --- Cuttable component ---
function Cuttable({
  children,
  cuts,
  id,
  className = "",
}: {
  children: React.ReactNode;
  cuts: Map<string, CutInfo>;
  id: string;
  className?: string;
}) {
  const cut = cuts.get(id);

  if (!cut) {
    return (
      <div data-cuttable={id} className={`relative ${className}`}>
        <div className="transition-all duration-300">{children}</div>
      </div>
    );
  }

  const { clip1, clip2 } = buildClipPaths(cut.entryPct, cut.exitPct);

  // Perpendicular to cut direction for animation
  const angle = cut.angle;
  const dist = 25;
  const dx1 = Math.cos(angle) * dist;
  const dy1 = Math.sin(angle) * dist;

  return (
    <div data-cuttable={id} className={`relative ${className}`}>
      {/* Half 1 */}
      <motion.div
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={{ x: dx1, y: dy1, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ clipPath: clip1 }}
      >
        {children}
      </motion.div>
      {/* Half 2 */}
      <motion.div
        className="absolute inset-0"
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={{ x: -dx1, y: -dy1, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ clipPath: clip2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// --- Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const socialLinks = [
  { href: profile.links.github, icon: <GitHubIcon className="h-5 w-5" />, label: "GitHub", external: true },
  { href: profile.links.linkedin, icon: <LinkedInIcon className="h-5 w-5" />, label: "LinkedIn", external: true },
  { href: profile.links.scholar, icon: <GraduationCap className="h-5 w-5" />, label: "Google Scholar", external: true },
  { href: "https://kendonexus.com", icon: <Swords className="h-5 w-5" />, label: "Kendo Nexus", external: true },
  { href: `mailto:${profile.email}`, icon: <Mail className="h-5 w-5" />, label: "Email", external: false },
];

// --- Main ---
export default function Home() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [cuts, setCuts] = useState<Map<string, CutInfo>>(new Map());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % profile.titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSlashEnd = useCallback((points: Point[]) => {
    const cuttables = document.querySelectorAll("[data-cuttable]");
    const newCuts = new Map<string, CutInfo>();

    cuttables.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cutPoints = findCutPoints(points, rect);
      if (!cutPoints) return;

      const id = el.getAttribute("data-cuttable");
      if (!id) return;

      // Cut direction angle
      const dx = cutPoints.exit.x - cutPoints.entry.x;
      const dy = cutPoints.exit.y - cutPoints.entry.y;
      const cutAngle = Math.atan2(dy, dx);
      // Perpendicular to cut
      const perpAngle = cutAngle + Math.PI / 2;

      newCuts.set(id, {
        entryPct: cutPoints.entry,
        exitPct: cutPoints.exit,
        angle: perpAngle,
      });
    });

    if (newCuts.size > 0) {
      setCuts((prev) => {
        const next = new Map(prev);
        newCuts.forEach((v, k) => next.set(k, v));
        return next;
      });

      // Reform after delay
      setTimeout(() => {
        setCuts((prev) => {
          const next = new Map(prev);
          newCuts.forEach((_, k) => next.delete(k));
          return next;
        });
      }, 1400);
    }
  }, []);

  useSlashCanvas(canvasRef, containerRef, handleSlashEnd);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 select-none"
    >
      {/* Slash canvas (visual only, no pointer events) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-20 pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center gap-6 text-center pointer-events-none"
      >
        <motion.div variants={itemVariants}>
          <Cuttable id="name" cuts={cuts}>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-8xl bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
              mfa-x-ai
            </h1>
          </Cuttable>
        </motion.div>

        <motion.div variants={itemVariants} className="h-8 flex items-center">
          <Cuttable id="title" cuts={cuts}>
            <AnimatePresence mode="wait">
              <motion.p
                key={titleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-base md:text-lg text-muted-foreground"
              >
                {profile.titles[titleIndex]}
              </motion.p>
            </AnimatePresence>
          </Cuttable>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-2"
        >
          <Cuttable id="stat-years" cuts={cuts}>
            <Badge variant="secondary">
              {profile.stats.yearsExperience} Years
            </Badge>
          </Cuttable>
          <Cuttable id="stat-pubs" cuts={cuts}>
            <Badge variant="secondary">
              {profile.stats.publications} Publications
            </Badge>
          </Cuttable>
          <Cuttable id="stat-cites" cuts={cuts}>
            <Badge variant="secondary">
              {profile.stats.citations} Citations
            </Badge>
          </Cuttable>
          <Cuttable id="stat-h" cuts={cuts}>
            <Badge variant="secondary">h-index {profile.stats.hIndex}</Badge>
          </Cuttable>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-1 pointer-events-auto"
        >
          {socialLinks.map((link) => (
            <Tooltip key={link.label}>
              <TooltipTrigger
                render={
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  />
                }
                className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {link.icon}
              </TooltipTrigger>
              <TooltipContent>{link.label}</TooltipContent>
            </Tooltip>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="pointer-events-auto">
          <Button nativeButton={false} render={<Link href="/about" />}>
            Explore my work <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
