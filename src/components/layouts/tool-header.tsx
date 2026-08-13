// src/components/layouts/tool-header.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Star, BadgeCheck, Sparkles } from "lucide-react";
import { ToolCategory, getCategoryConfig } from "@/config/categories";
import { ToolTag } from "@/config/tags";
import { ToolIcon } from "@/components/icons/tool-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { cn } from "@/lib/utils";

export interface ToolHeaderProps {
  toolId: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: string;
  tags?: ToolTag[];
  isNew?: boolean;
  featured?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function ToolHeader({
  toolId,
  title,
  description,
  category,
  icon,
  tags = [],
  isNew,
  featured,
  actions,
  className,
}: ToolHeaderProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecentTool } = useRecentTools();
  const catConfig = getCategoryConfig(category);

  const fav = isFavorite(toolId);

  // Automatically log tool usage in recent storage on mount
  React.useEffect(() => {
    if (toolId) {
      addRecentTool(toolId);
    }
  }, [toolId, addRecentTool]);

  return (
    <header className={cn("mb-6 sm:mb-8", className)}>
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-4"
      >
        <Link
          href="/"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
        <Link
          href={`/#${category}`}
          className="hover:text-foreground transition-colors capitalize shrink-0"
        >
          {catConfig.label}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
        <span className="text-foreground font-medium truncate max-w-[180px] sm:max-w-xs">
          {title}
        </span>
      </nav>

      {/* Main Header Content */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {/* Tool Category Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-emerald-500 border border-emerald-500/20 shadow-xs mt-0.5">
            <ToolIcon name={icon} className="h-5 w-5" />
          </div>

          <div>
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
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

              {isNew && (
                <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] px-1.5 py-0 font-mono">
                  NEW
                </Badge>
              )}

              {featured && (
                <Badge
                  variant="outline"
                  className="gap-1 text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-500 bg-emerald-500/5 font-mono"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  Featured
                </Badge>
              )}

              {/* <Badge
                variant="outline"
                className="gap-1 py-0 px-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-mono"
              >
                <BadgeCheck className="w-3 h-3 text-emerald-500" />
                <span>100% Client-Side</span>
              </Badge> */}
            </div>

            {/* Title & Description */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>

            {/* Tags List */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-muted-foreground/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Favorite Button */}
        <div className="flex items-center gap-2 shrink-0 self-start mt-2 md:mt-0">
          {actions}

          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleFavorite(toolId, title)}
            className={cn(
              "h-8 gap-1.5 text-xs transition-colors",
              fav
                ? "text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={cn(
                "h-3.5 w-3.5",
                fav ? "fill-amber-400 text-amber-400" : "fill-none"
              )}
            />
            <span>{fav ? "Favorited" : "Favorite"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}