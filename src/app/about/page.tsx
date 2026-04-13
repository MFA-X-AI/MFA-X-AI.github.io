"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { skills, education } from "@/lib/data";
import { PageTransition } from "@/components/page-transition";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">About</h1>
        <Separator className="my-6" />

        {/* Summary */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              Dabbed in AI before it was mainstream, blessed to have a career and research topics related to it. Spent the last 5+ years shipping AI products — agentic workflows, RAG pipelines, vector search, the whole stack. Also a masters student at IIUM with published research and not done yet. Outside of work, practicing Kendo (2nd Kyu) at{" "}
              <a
                href="https://www.aikendo.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                AI Kendo Club
              </a>
              . Always happy to chat about AI, open source, or anything in between — feel free to reach out.
            </p>
          </CardContent>
        </Card>

        {/* Skills */}
        <h2 className="text-xl font-semibold mb-6">Skills</h2>
        <div className="space-y-6 mb-12">
          {skills.map((group) => (
            <div key={group.category}>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {group.category}
              </p>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {group.items.map((skill) => (
                  <motion.div key={skill} variants={fadeUp}>
                    <Badge variant="secondary">{skill}</Badge>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Education */}
        <h2 className="text-xl font-semibold mb-6">Education</h2>
        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.degree}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <CardTitle className="text-base">{edu.degree}</CardTitle>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {edu.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {edu.institution}
                </p>
                {edu.note && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {edu.note}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
