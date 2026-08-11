"use client";

import * as React from "react";
import { Search, X, Star, Clock, Terminal, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { TOOLS, ToolCategory } from "@/config/tools";
import { ToolCard } from "@/components/home/tool-card";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  dev: "Developer",
  text: "Text & Code",
  image: "Image & Media",
  "video-audio": "Video & Audio",
  document: "Document & PDF",
  security: "Security & Crypto",
  "math-finance": "Math & Finance",
  time: "Time & Date",
  generators: "Generators",
  "unit-converter": "Unit Converters",
  "games-edu": "Games & Edu",
};

type FilterTab = "all" | "favorites" | "recent" | ToolCategory;

const VALID_TABS: FilterTab[] = [
  "all",
  "favorites",
  "recent",
  ...(Object.keys(CATEGORY_LABELS) as ToolCategory[]),
];

// External Store Subscription for browser URL hash
function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

function getHashSnapshot(): string {
  return typeof window !== "undefined" ? window.location.hash : "";
}

function getHashServerSnapshot(): string {
  return "";
}

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { recentIds, addRecentTool } = useRecentTools();

  // Subscribe to browser URL location hash synchronously without setState-in-effect
  const rawHashWithSymbol = React.useSyncExternalStore(
    subscribeHash,
    getHashSnapshot,
    getHashServerSnapshot
  );

  const rawHash = rawHashWithSymbol.replace("#", "").trim();

  // Derive activeTab synchronously during render
  const activeTab = React.useMemo<FilterTab>(() => {
    if (!rawHash || rawHash === "all") return "all";
    if (VALID_TABS.includes(rawHash as FilterTab)) {
      return rawHash as FilterTab;
    }
    return "all"; // Fallback to "all" for invalid hashes
  }, [rawHash]);

  // Toast notification & URL cleanup for invalid hash
  React.useEffect(() => {
    if (rawHash && rawHash !== "all" && !VALID_TABS.includes(rawHash as FilterTab)) {
      toast.error("Category Not Found", {
        description: `"${rawHash}" is not a recognized category. Displaying all tools instead.`,
        id: "invalid-category-toast",
      });
      // Clean invalid hash from browser address bar
      window.history.replaceState(null, "", window.location.pathname);
      window.dispatchEvent(new Event("hashchange"));
    }
  }, [rawHash]);

  // Tab click handler updates URL anchor (which automatically triggers store update)
  const handleTabChange = (tab: FilterTab) => {
    if (tab === "all") {
      window.history.pushState(null, "", window.location.pathname);
      window.dispatchEvent(new Event("hashchange"));
    } else {
      window.location.hash = tab;
    }
  };

  // Filter tools based on active tab and search query
  const filteredTools = React.useMemo(() => {
    return TOOLS.filter((tool) => {
      // 1. Tab Filter
      if (activeTab === "favorites") {
        if (!favorites.includes(tool.id)) return false;
      } else if (activeTab === "recent") {
        if (!recentIds.includes(tool.id)) return false;
      } else if (activeTab !== "all") {
        if (tool.category !== activeTab) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = tool.name.toLowerCase().includes(query);
        const descMatch = tool.description.toLowerCase().includes(query);
        const categoryMatch = tool.category.toLowerCase().includes(query);
        const tagMatch = tool.tags.some((tag) => tag.toLowerCase().includes(query));

        return nameMatch || descMatch || categoryMatch || tagMatch;
      }

      return true;
    }).sort((a, b) => {
      if (activeTab === "recent") {
        const indexA = recentIds.indexOf(a.id);
        const indexB = recentIds.indexOf(b.id);
        return indexA - indexB;
      }
      return (a.order || 99) - (b.order || 99);
    });
  }, [searchQuery, activeTab, favorites, recentIds]);

  // Activate Bento layout spans when showing All tools with no search query
  const isBentoActive = activeTab === "all" && !searchQuery.trim();

  const handleClearFilters = () => {
    setSearchQuery("");
    handleTabChange("all");
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        {/* Status / Privacy Badge */}
        <Badge
          variant="outline"
          className="mb-4 gap-2 py-1 px-3 bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        >
          <BadgeCheck className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
          <span className="text-xs font-mono font-medium tracking-wide uppercase">
            100% Client-Side & Private
          </span>
        </Badge>

        {/* Hero Title */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
          Fast, Private Browser Utilities. <br className="hidden sm:inline" />
          <span className="text-emerald-500">Zero Server Uploads.</span>
        </h1>

        {/* Hero Description */}
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
          A suite of developer and everyday tools running entirely inside your browser. Your data never leaves your device.
        </p>

        {/* Search Input Box */}
        <div className="w-full max-w-xl mt-8">
          <InputGroup className="h-11 rounded-xl border-border/80 bg-card/80 shadow-xs has-[input:focus-visible]:border-emerald-500 focus-within:ring-emerald-500/20">
            <InputGroupAddon align="inline-start" className="pl-3.5 text-muted-foreground">
              <Search className="w-4 h-4" />
            </InputGroupAddon>
            <InputGroupInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 30+ tools by name, tag, or category... (e.g. JSON, PDF, Base64)"
              className="text-sm placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <InputGroupAddon align="inline-end" className="pr-2">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setSearchQuery("")}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        {/* Filter Pills Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 w-full max-w-4xl">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTabChange("all")}
            className={cn(
              "h-8 text-xs rounded-full px-3 transition-all",
              activeTab === "all" ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-medium" : "text-muted-foreground"
            )}
          >
            All Tools ({TOOLS.length})
          </Button>

          <Button
            variant={activeTab === "favorites" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTabChange("favorites")}
            className={cn(
              "h-8 text-xs rounded-full px-3 gap-1.5 transition-all",
              activeTab === "favorites" ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-medium" : "text-muted-foreground"
            )}
          >
            <Star className={cn("w-3.5 h-3.5", activeTab === "favorites" ? "fill-zinc-950" : "text-amber-400")} />
            Favorites ({favorites.length})
          </Button>

          <Button
            variant={activeTab === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTabChange("recent")}
            className={cn(
              "h-8 text-xs rounded-full px-3 gap-1.5 transition-all",
              activeTab === "recent" ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-medium" : "text-muted-foreground"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            Recent ({recentIds.length})
          </Button>

          <div className="w-full h-0 sm:hidden" />

          {(Object.keys(CATEGORY_LABELS) as ToolCategory[]).map((cat) => {
            const count = TOOLS.filter((t) => t.category === cat).length;
            const isActive = activeTab === cat;
            return (
              <Button
                key={cat}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTabChange(cat)}
                className={cn(
                  "h-8 text-xs rounded-full px-3 transition-all",
                  isActive
                    ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {CATEGORY_LABELS[cat]} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tools Counter / Active Filter Bar */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-semibold font-mono tracking-tight text-foreground uppercase">
            {activeTab === "all" ? "Available Tools" : activeTab === "favorites" ? "Favorited Utilities" : activeTab === "recent" ? "Recently Used Utilities" : `${CATEGORY_LABELS[activeTab as ToolCategory]} Utilities`}
          </h2>
          <Badge variant="secondary" className="font-mono text-[11px] px-2 py-0">
            {filteredTools.length}
          </Badge>
        </div>

        {(searchQuery || activeTab !== "all") && (
          <Button
            variant="ghost"
            size="xs"
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <X className="w-3 h-3" />
            Reset Filters
          </Button>
        )}
      </div>

      {/* Bento Grid System with Dense Auto-Flow */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)] grid-flow-dense">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={isFavorite(tool.id)}
              onToggleFavorite={toggleFavorite}
              onSelectTool={addRecentTool}
              isBentoActive={isBentoActive}
            />
          ))}
        </div>
      ) : (
        /* Empty Search / Filter State */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No utilities found</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md">
            No client-side tools matched your search query &quot;{searchQuery}&quot; or active filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="mt-6 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}