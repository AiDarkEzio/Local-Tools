// src/components/layouts/tool-shell.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToolShellProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function ToolShell({
  children,
  className,
  containerClassName,
}: ToolShellProps) {
  return (
    <div
      className={cn(
        "relative min-h-[calc(100vh-3.5rem)] w-full py-6 sm:py-8 md:py-10",
        className
      )}
    >
      {/* Background ambient lighting glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl" aria-hidden="true">
        <div className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent opacity-30 dark:opacity-20" />
      </div>

      <div
        className={cn(
          "container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}