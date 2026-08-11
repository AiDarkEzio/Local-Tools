"use client";

import * as React from "react";
import { Search, X, Star, Clock, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { TOOLS } from "@/config/tools";
import {
  CategoryFilterKey,
  ALL_FILTER_KEYS,
  CATEGORIES_MAP,
  getCategoryConfig,
} from "@/config/categories";
import { ToolCard } from "@/components/home/tool-card";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const activeTab = React.useMemo<CategoryFilterKey>(() => {
    if (!rawHash || rawHash === "all") return "all";
    if (ALL_FILTER_KEYS.includes(rawHash as CategoryFilterKey)) {
      return rawHash as CategoryFilterKey;
    }
    return "all"; // Fallback to "all" for invalid hashes
  }, [rawHash]);

  // Toast notification & URL cleanup for invalid hash
  React.useEffect(() => {
    if (rawHash && rawHash !== "all" && !ALL_FILTER_KEYS.includes(rawHash as CategoryFilterKey)) {
      toast.error("Category Not Found", {
        description: `"${rawHash}" is not a recognized category. Displaying all tools instead.`,
        id: "invalid-category-toast",
      });
      // Clean invalid hash from browser address bar
      window.history.replaceState(null, "", window.location.pathname);
      window.dispatchEvent(new Event("hashchange"));
    }
  }, [rawHash]);

  // Tab click handler updates URL anchor cleanly without window object mutations
  const handleTabChange = (tab: CategoryFilterKey) => {
    const newUrl = tab === "all" ? window.location.pathname : `${window.location.pathname}#${tab}`;
    window.history.pushState(null, "", newUrl);
    window.dispatchEvent(new Event("hashchange"));
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

  const activeCategoryConfig = getCategoryConfig(activeTab);

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
          <InputGroup className="h-11 rounded-xl border-border/80 bg-card/80 shadow-xs focus-within:border-emerald-500 focus-within:ring-emerald-500/20">
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
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 w-full max-w-5xl">
          {ALL_FILTER_KEYS.map((key) => {
            const cat = CATEGORIES_MAP[key];
            const isActive = activeTab === key;

            // Calculate tool count for pill display
            let count = TOOLS.length;
            if (key === "favorites") count = favorites.length;
            else if (key === "recent") count = recentIds.length;
            else if (key !== "all") count = TOOLS.filter((t) => t.category === key).length;

            return (
              <Button
                key={key}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleTabChange(key)}
                className={cn(
                  "h-8 text-xs rounded-full px-3 gap-1.5 transition-all border",
                  isActive
                    ? cat.pillActiveBg
                    : cn("bg-background/60 text-muted-foreground hover:text-foreground", cat.pillBorder)
                )}
              >
                {/* Designated Pastel Color Dot */}
                {key === "favorites" ? (
                  <Star className={cn("w-3.5 h-3.5", isActive ? "fill-zinc-950" : "text-amber-400")} />
                ) : key === "recent" ? (
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                ) : (
                  <span className={cn("h-2 w-2 rounded-full shrink-0", cat.dotColor)} />
                )}

                <span>{cat.label}</span>
                <span className="text-[10px] opacity-70 font-mono">({count})</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tools Counter / Active Filter Bar */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", activeCategoryConfig.dotColor)} />
          <h2 className="text-sm font-semibold font-mono tracking-tight text-foreground uppercase">
            {activeTab === "all"
              ? "Available Tools"
              : activeTab === "favorites"
              ? "Favorited Utilities"
              : activeTab === "recent"
              ? "Recently Used Utilities"
              : `${activeCategoryConfig.label} Utilities`}
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