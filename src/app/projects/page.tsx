"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { projects } from "@/lib/data";
import { PageTransition } from "@/components/page-transition";

const tabs = [
  { value: "all", label: "All" },
  { value: "featured", label: "Featured" },
  { value: "opensource", label: "Open Source" },
  { value: "research", label: "Research" },
];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Projects
        </h1>
        <Separator className="my-6" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">
                        {project.name}
                      </CardTitle>
                      {project.award && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-xs"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          Award
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.impact}
                    </p>
                    {project.award && (
                      <p className="text-sm text-primary mt-2 font-medium">
                        {project.award}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-wrap items-center gap-1.5">
                    {project.tech.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                    {project.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        nativeButton={false}
                        render={
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
