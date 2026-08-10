"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Terminal, Sparkles, ArrowRight } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { TOOLS, ToolCategory, Tool } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  dev: "Developer Utilities",
  text: "Text & Formatting",
  image: "Image & Media",
  "video-audio": "Video & Audio",
  document: "Documents & PDF",
  security: "Security & Encryption",
  "math-finance": "Math & Finance",
  time: "Time & Date",
  generators: "Generators",
  "unit-converter": "Unit Converters",
  "games-edu": "Games & Education",
};

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const { addRecentTool } = useRecentTools();

  // Handle global Cmd + K shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (tool: Tool) => {
    addRecentTool(tool.id);
    onOpenChange(false);
    router.push(tool.path);
  };

  const featuredTools = TOOLS.filter((t) => t.featured);
  const categories = Array.from(new Set(TOOLS.map((t) => t.category)));

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tools by name, tag, or category... (e.g. JSON, Base64, PDF)" />
      <CommandList className="max-h-[350px]">
        <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
          No matching client-side tool found.
        </CommandEmpty>

        {/* Featured Section */}
        <CommandGroup heading="Featured & Popular">
          {featuredTools.map((tool) => (
            <CommandItem
              key={tool.id}
              value={`${tool.name} ${tool.tags.join(" ")} ${tool.category}`}
              onSelect={() => handleSelect(tool)}
              className="flex items-center justify-between py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-medium text-xs">{tool.name}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/60">
                  {tool.category}
                </Badge>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* All Categories */}
        {categories.map((category) => {
          const categoryTools = TOOLS.filter((t) => t.category === category);
          return (
            <CommandGroup key={category} heading={CATEGORY_LABELS[category] || category}>
              {categoryTools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  value={`${tool.name} ${tool.tags.join(" ")} ${tool.category}`}
                  onSelect={() => handleSelect(tool)}
                  className="flex items-center justify-between py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs">{tool.name}</span>
                  </div>
                  {tool.isNew && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] px-1.5 py-0">
                      NEW
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}