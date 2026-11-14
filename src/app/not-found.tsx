// src/app/not-found.tsx
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Ambient Background Glow (matches ToolShell) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent opacity-25" />
      </div>

      {/* Main Error Card */}
      <main className="flex w-full max-w-lg flex-col items-center rounded-2xl border border-border/80 bg-card/60 p-8 text-center shadow-xs backdrop-blur-md sm:p-10">
        {/* Icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
          <Terminal className="h-6 w-6" />
        </div>

        {/* Status Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-destructive">
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span className="font-mono text-xs font-medium tracking-wide uppercase">
            404 — Page Not Found
          </span>
        </div>

        {/* Title & Description */}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Looks like this tool doesn&apos;t exist yet.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          The page or utility you are looking for could not be found, may have
          been moved, or hasn&apos;t been built yet.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "gap-2 px-5 font-mono text-xs"
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>

          <a
            href="https://github.com/AiDarkEzio/Local-Tools/discussions/new?category=ideas"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2 px-5 font-mono text-xs"
            )}
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>Request a Tool on GitHub</span>
          </a>
        </div>
      </main>

      {/* Subtle Brand Signature */}
      <div className="mt-8 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <Terminal className="h-3.5 w-3.5 text-emerald-500" />
        <span className="font-semibold text-foreground">
          Local<span className="text-emerald-500">.Tools</span>
        </span>
        <span className="text-muted-foreground/50">•</span>
        <span>100% Client-Side</span>
      </div>
    </div>
  );
}