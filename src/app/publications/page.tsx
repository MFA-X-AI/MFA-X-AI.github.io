"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ExternalLink, BookOpen, Quote } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { publications, profile } from "@/lib/data";
import { PageTransition } from "@/components/page-transition";

function AnimatedCounter({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <Card ref={ref} className="relative overflow-hidden">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
            {icon}
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight tabular-nums">{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CitationBar({ citations, max }: { citations: number; max: number }) {
  const width = max > 0 ? (citations / max) * 100 : 0;
  return (
    <Tooltip>
      <TooltipTrigger className="w-full">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-foreground/60"
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.3 }}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>{citations} citations</TooltipContent>
    </Tooltip>
  );
}

export default function PublicationsPage() {
  const [view, setView] = useState<string>("cards");
  const maxCitations = Math.max(...publications.selected.map((p) => p.citations));

  const firstAuthored = publications.selected.filter((p) =>
    p.authors.startsWith("MF Alghifari")
  );
  const coAuthored = publications.selected.filter(
    (p) => !p.authors.startsWith("MF Alghifari")
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Publications
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {publications.stats.firstAuthored} first-authored of {publications.stats.total} total
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <a
                href={profile.links.scholar}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Google Scholar
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>

        <Separator className="mb-8" />

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <AnimatedCounter
            value={publications.stats.total}
            label="Publications"
            icon={<BookOpen className="h-5 w-5 text-muted-foreground" />}
          />
          <AnimatedCounter
            value={publications.stats.citations}
            label="Total Citations"
            icon={<Quote className="h-5 w-5 text-muted-foreground" />}
          />
          <AnimatedCounter
            value={publications.stats.hIndex}
            label="h-index"
            icon={<span className="text-sm font-bold text-muted-foreground">H</span>}
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">All Papers</h2>
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {view === "cards" ? (
          <Accordion className="space-y-3">
            {/* First-authored */}
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                First Author ({firstAuthored.length})
              </p>
              {firstAuthored.map((paper, i) => (
                <AccordionItem
                  key={paper.title}
                  value={paper.title}
                  className="border rounded-lg px-4 mb-3"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col items-start gap-1 text-left pr-4"
                    >
                      <span className="text-sm font-medium leading-snug">
                        {paper.title}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {paper.venue}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {paper.year}
                        </span>
                        {paper.citations > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {paper.citations} cited
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {paper.authors}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground shrink-0">Citations</span>
                        <CitationBar citations={paper.citations} max={maxCitations} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>

            {/* Co-authored */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Co-authored ({coAuthored.length})
              </p>
              {coAuthored.map((paper, i) => (
                <AccordionItem
                  key={paper.title}
                  value={paper.title}
                  className="border rounded-lg px-4 mb-3"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col items-start gap-1 text-left pr-4"
                    >
                      <span className="text-sm font-medium leading-snug">
                        {paper.title}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {paper.venue}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {paper.year}
                        </span>
                        {paper.citations > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {paper.citations} cited
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {paper.authors}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground shrink-0">Citations</span>
                        <CitationBar citations={paper.citations} max={maxCitations} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          </Accordion>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Title</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Citations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publications.selected.map((paper) => (
                  <TableRow key={paper.title}>
                    <TableCell className="font-medium text-sm">
                      <div>
                        {paper.title}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {paper.authors}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {paper.venue}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {paper.year}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {paper.citations}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Dataset callout */}
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">Published Dataset</CardDescription>
            <CardTitle className="text-base">SAD: Sorrow Analysis Dataset</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              IEEE DataPort, 2023 — DOI: 10.21227/pbkv-6w98
            </p>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
