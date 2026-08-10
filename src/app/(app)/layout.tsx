import * as React from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Terminal } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Global Sticky Navigation Bar */}
      <Navbar />

      {/* Main Workspace Stage */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="w-full border-t border-border/60 bg-muted/20 py-6 text-xs text-muted-foreground">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 font-mono font-medium text-foreground shrink-0">
              <Terminal className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Local-Tools</span>
            </div>
            <span className="hidden sm:inline text-muted-foreground/60">—</span>
            <span>Fast, private, browser-native client-side utilities.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-mono">
            <span>Zero Server Requests</span>
            <span className="text-muted-foreground/60">•</span>
            <a
              href="https://github.com/AiDarkEzio/Local-Tools"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline transition-colors"
            >
              MIT License
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}