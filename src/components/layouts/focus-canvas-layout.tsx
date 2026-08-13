// src/components/layouts/focus-canvas-layout.tsx
"use client";

import * as React from "react";
import { ToolShell } from "@/components/layouts/tool-shell";
import { ToolHeader, ToolHeaderProps } from "@/components/layouts/tool-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FocusCanvasLayoutProps extends ToolHeaderProps {
  headerActions?: React.ReactNode;
  canvas: React.ReactNode;
  controls: React.ReactNode;
  sidebarPosition?: "left" | "right";
  canvasTitle?: string;
  canvasActions?: React.ReactNode;
  controlsTitle?: string;
  controlsActions?: React.ReactNode;
  className?: string;
}

export function FocusCanvasLayout({
  toolId,
  title,
  description,
  category,
  icon,
  tags,
  isNew,
  featured,
  headerActions,
  canvas,
  controls,
  sidebarPosition = "right",
  canvasTitle = "Workspace Preview",
  canvasActions,
  controlsTitle = "Settings & Controls",
  controlsActions,
  className,
}: FocusCanvasLayoutProps) {
  const isRightSidebar = sidebarPosition === "right";

  return (
    <ToolShell className={className}>
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

      {/* Asymmetric Canvas / Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Block */}
        <div
          className={cn(
            "lg:col-span-7 xl:col-span-8 min-h-[450px]",
            !isRightSidebar && "lg:order-2"
          )}
        >
          <Card className="flex flex-col border-border/80 bg-card/80 backdrop-blur-xs shadow-xs overflow-hidden h-full">
            {canvasTitle && (
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 py-3 px-4 bg-muted/20">
                <CardTitle className="text-xs font-semibold font-mono tracking-tight text-foreground uppercase">
                  {canvasTitle}
                </CardTitle>
                {canvasActions && (
                  <div className="flex items-center gap-1.5">{canvasActions}</div>
                )}
              </CardHeader>
            )}
            <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-center items-center">
              {canvas}
            </CardContent>
          </Card>
        </div>

        {/* Controls Sidebar Block */}
        <div
          className={cn(
            "lg:col-span-5 xl:col-span-4 sticky top-20",
            !isRightSidebar && "lg:order-1"
          )}
        >
          <Card className="border-border/80 bg-card/80 backdrop-blur-xs shadow-xs overflow-hidden">
            {controlsTitle && (
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 py-3 px-4 bg-muted/20">
                <CardTitle className="text-xs font-semibold font-mono tracking-tight text-foreground uppercase">
                  {controlsTitle}
                </CardTitle>
                {controlsActions && (
                  <div className="flex items-center gap-1.5">
                    {controlsActions}
                  </div>
                )}
              </CardHeader>
            )}
            <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
              {controls}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolShell>
  );
}