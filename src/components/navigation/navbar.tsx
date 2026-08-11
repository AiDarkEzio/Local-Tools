"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, Terminal, ChevronDown, Layers } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GithubIcon } from "@/components/icons/github-icon";
import { CommandMenu } from "@/components/navigation/command-menu";
import { ToolCategory } from "@/config/tools";
import { cn } from "@/lib/utils";

// Base Category List (prepared for future centralization)
const BASE_CATEGORIES: { id: string; label: string }[] = [
  { id: "dev", label: "Developer Tools" },
  { id: "text", label: "Text & Formatting" },
  { id: "image", label: "Image Utilities" },
  { id: "document", label: "Document & PDF" },
  { id: "security", label: "Security & Crypto" },
  { id: "generators", label: "Generators & Codes" },
  { id: "time", label: "Time & Clock" },
  { id: "math-finance", label: "Math & Calculators" },
  { id: "unit-converter", label: "Unit Converters" },
  { id: "video-audio", label: "Video & Audio" },
];

// Injected anchor links for Quick Filters
const INJECTED_ANCHORS: { id: string; label: string }[] = [
  { id: "favorites", label: "Favorited Utilities" },
  { id: "recent", label: "Recently Used" },
];

// Dynamically composite without mutating BASE_CATEGORIES directly
const CATEGORIES = [...INJECTED_ANCHORS, ...BASE_CATEGORIES];

const emptySubscribe = () => () => {};

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = React.useState(false);

  // Detect homepage route (strips basePath automatically)
  const isHomePage = pathname === "/";

  // Safely detect client hydration without useEffect render cascades
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true, // Client snapshot
    () => false // Server snapshot
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors">
        <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 gap-2">
          {/* Left Side: Logo & Category Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background border border-foreground/10 transition-transform group-hover:scale-105">
                <Terminal className="h-4 w-4" />
              </div>
              <span className="font-mono text-sm font-bold tracking-tight text-foreground">
                Local<span className="text-emerald-500">.Tools</span>
              </span>
            </Link>

            {/* Category Navigation Dropdown — Hidden on Home Page */}
            {!isHomePage && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground h-8 px-2"
                    />
                  }
                >
                  <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="hidden sm:inline">Categories</span>
                  <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-1.5">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                      Tool Categories
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {CATEGORIES.map((cat) => (
                    <DropdownMenuItem
                      key={cat.id}
                      render={
                        <Link
                          href={`/#${cat.id}`}
                          className="flex items-center justify-between text-xs py-1.5 px-2 cursor-pointer rounded-md"
                        />
                      }
                    >
                      <span>{cat.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Right Side: Command Trigger, Github Link & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Command Palette Trigger Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="relative flex h-8 w-8 sm:w-48 md:w-56 items-center justify-center sm:justify-between gap-2 rounded-lg border border-border/80 bg-muted/40 px-2 sm:px-2.5 text-xs text-muted-foreground hover:bg-muted hover:border-zinc-700/60 transition-all shrink-0"
              aria-label="Search tools"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline truncate">Search tools...</span>
              </div>
              <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-[10px]">⌘</span><span className="text-[13px]">K</span>
              </kbd>
            </Button>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/AiDarkEzio/Local-Tools"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
              )}
            >
              <GithubIcon className="h-3.5 w-3.5 fill-current" />
            </a>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Toggle visual theme"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-4 w-4 transition-transform hover:rotate-45 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 transition-transform hover:-rotate-12 text-zinc-700" />
                )
              ) : (
                <div className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Global Command Palette Dialog */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}