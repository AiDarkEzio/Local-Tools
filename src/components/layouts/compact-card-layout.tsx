// src/components/layouts/compact-card-layout.tsx
"use client";

import * as React from "react";
import { ToolShell } from "@/components/layouts/tool-shell";
import { ToolHeader, ToolHeaderProps } from "@/components/layouts/tool-header";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CompactCardLayoutProps extends ToolHeaderProps {
  headerActions?: React.ReactNode;
  controls: React.ReactNode;
  result: React.ReactNode;
  actions?: React.ReactNode;
  footerInfo?: React.ReactNode;
  maxCardWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
}

const WIDTH_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

export function CompactCardLayout({
  toolId,
  title,
  description,
  category,
  icon,
  tags,
  isNew,
  featured,
  headerActions,
  controls,
  result,
  actions,
  footerInfo,
  maxCardWidth = "2xl",
  className,
}: CompactCardLayoutProps) {
  const widthClass = WIDTH_CLASSES[maxCardWidth] || "max-w-2xl";

  return (
    <ToolShell className={className}>
      <div className={cn("mx-auto", widthClass)}>
        {/* Tool Header */}
        <ToolHeader
          toolId={toolId}
          title={title}
          description={description}
          category={category}
          icon={icon}
          tags={tags}
          isNew={isNew}
          featured={featured}
          actions={headerActions}
        />

        {/* Main Utility Card */}
        <Card className="border-border/80 bg-card/80 backdrop-blur-xs shadow-xs overflow-hidden">
          <CardContent className="p-5 sm:p-6 flex flex-col gap-6">
            {/* Options / Controls Section */}
            <div className="flex flex-col gap-4">{controls}</div>

            {/* Optional Primary Actions Bar */}
            {actions && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                {actions}
              </div>
            )}

            {/* Result Display Section */}
            <div className="pt-2">{result}</div>
          </CardContent>
        </Card>

        {/* Footer Guidance / Formula / FAQs Section */}
        {footerInfo && (
          <div className="mt-6 text-xs text-muted-foreground leading-relaxed px-1">
            {footerInfo}
          </div>
        )}
      </div>
    </ToolShell>
  );
}