import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fahreza Alghifari — AI Engineer & Researcher",
  description:
    "AI Engineer Lead with 5+ years building production AI systems. Published researcher with 11 publications and 174 citations. Open source developer.",
  openGraph: {
    title: "Fahreza Alghifari — AI Engineer & Researcher",
    description:
      "AI Engineer Lead with 5+ years building production AI systems. Published researcher with 11 publications and 174 citations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          <AppShell>
            <Navbar />
            <main className="flex-1">{children}</main>
          </AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
