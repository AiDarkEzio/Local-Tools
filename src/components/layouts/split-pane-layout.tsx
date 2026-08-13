// src/components/layouts/split-pane-layout.tsx
"use client";

import * as React from "react";
import { ToolShell } from "@/components/layouts/tool-shell";
import { ToolHeader, ToolHeaderProps } from "@/components/layouts/tool-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface SplitPaneLayoutProps extends ToolHeaderProps {
  headerActions?: React.ReactNode;
  toolbar?: React.ReactNode;
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  leftPaneTitle?: string;
  rightPaneTitle?: string;
  leftPaneActions?: React.ReactNode;
  rightPaneActions?: React.ReactNode;
  className?: string;
}

export function SplitPaneLayout({
  toolId,
  title,
  description,
  category,
  icon,
  tags,
  isNew,
  featured,
  headerActions,
  toolbar,
  leftPane,
  rightPane,
  leftPaneTitle = "Input",
  rightPaneTitle = "Output",
  leftPaneActions,
  rightPaneActions,
  className,
}: SplitPaneLayoutProps) {
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

      {/* Global Toolbar */}
      {toolbar && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/60 p-2.5 backdrop-blur-xs">
          {toolbar}
        </div>
      )}

      {/* Side-by-Side Split Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[520px] items-stretch">
        {/* Left Pane (Input Area) */}
        <Card className="flex flex-col border-border/80 bg-card/80 backdrop-blur-xs shadow-xs overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 py-2.5 px-4 bg-muted/20">
            <CardTitle className="text-xs font-semibold font-mono tracking-tight text-foreground uppercase">
              {leftPaneTitle}
            </CardTitle>
            {leftPaneActions && (
              <div className="flex items-center gap-1.5">{leftPaneActions}</div>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-4 flex flex-col">{leftPane}</CardContent>
        </Card>

        {/* Right Pane (Output Area) */}
        <Card className="flex flex-col border-border/80 bg-card/80 backdrop-blur-xs shadow-xs overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 py-2.5 px-4 bg-muted/20">
            <CardTitle className="text-xs font-semibold font-mono tracking-tight text-foreground uppercase">
              {rightPaneTitle}
            </CardTitle>
            {rightPaneActions && (
              <div className="flex items-center gap-1.5">{rightPaneActions}</div>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-4 flex flex-col">{rightPane}</CardContent>
        </Card>
      </div>
    </ToolShell>
  );
}