// src/components/home/tool-card.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { Star, ArrowUpRight, Sparkles } from "lucide-react";
import { Tool } from "@/config/tools";
import { getCategoryConfig } from "@/config/categories";
import { ToolIcon } from "@/components/icons/tool-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (id: string, name: string) => void;
  onSelectTool: (id: string) => void;
  isBentoActive?: boolean;
}

export function ToolCard({
  tool,
  isFavorite,
  onToggleFavorite,
  onSelectTool,
  isBentoActive = true,
}: ToolCardProps) {
  const catConfig = getCategoryConfig(tool.category);

  // Breakpoint-aware Bento Grid span classes
  const spanClasses = React.useMemo(() => {
    if (!isBentoActive || !tool.gridSpan) return "col-span-1 row-span-1";

    switch (tool.gridSpan) {
      case "2x2":
        return "col-span-1 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 min-h-[260px] sm:min-h-[280px]";
      case "2x1":
        return "col-span-1 sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1";
      case "1x2":
        return "col-span-1 sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2 min-h-[260px] sm:min-h-[280px]";
      case "1x1":
      default:
        return "col-span-1 row-span-1";
    }
  }, [tool.gridSpan, isBentoActive]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(tool.id, tool.name);
  };

  const handleCardClick = () => {
    onSelectTool(tool.id);
  };

  const isLarge = isBentoActive && (tool.gridSpan === "2x2" || tool.gridSpan === "2x1");

  return (
    <Link
      href={tool.path}
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col justify-between p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-xs hover:bg-card/90 hover:border-emerald-500/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)] transition-all duration-200 hover:-translate-y-0.5",
        spanClasses
      )}
    >
      {/* Top Header Row: Icon, Badges & Favorite Star Toggle */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
              <ToolIcon name={tool.icon} className="h-4 w-4" />
            </div>
            {tool.featured && (
              <Badge variant="outline" className="hidden xs:inline-flex gap-1 text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-500 bg-emerald-500/5">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {tool.isNew && (
              <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] px-1.5 py-0 font-mono">
                NEW
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleFavoriteClick}
              className={cn(
                "h-7 w-7 rounded-md transition-colors hover:bg-muted",
                isFavorite ? "text-amber-400 hover:text-amber-500" : "text-muted-foreground/40 hover:text-foreground"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={cn("h-3.5 w-3.5 fill-current", isFavorite ? "fill-amber-400" : "fill-none")} />
            </Button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-2">
          <div className="flex items-center gap-1.5 group-hover:text-emerald-500 transition-colors">
            <h3 className="font-semibold text-sm sm:text-base text-foreground tracking-tight group-hover:text-emerald-500 transition-colors">
              {tool.name}
            </h3>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-emerald-500" />
          </div>

          <p className={cn("mt-1.5 text-xs text-muted-foreground leading-relaxed", isLarge ? "line-clamp-3 sm:line-clamp-4" : "line-clamp-2")}>
            {tool.description}
          </p>
        </div>
      </div>

      {/* Footer Row: Category Badge & Tag Badges */}
      <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
        {/* Category Badge with Pastel Theme Tokens */}
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-2 py-0.5 capitalize font-mono border",
            catConfig.badgeBg,
            catConfig.badgeText,
            catConfig.badgeBorder
          )}
        >
          {catConfig.label}
        </Badge>

        <div className="flex flex-wrap items-center gap-1">
          {tool.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] font-mono text-muted-foreground/70">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}