// src/app/(app)/tools/case-converter/page.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Copy,
  Trash2,
  RotateCcw,
  Sparkles,
  Check,
  Type,
  AlignLeft,
} from "lucide-react";
import { SplitPaneLayout } from "@/components/layouts/split-pane-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SAMPLE_TEXT = "Quick Brown Fox Jumps Over 123 Lazy Dogs!";

// Split any formatted string into clean word tokens
function extractWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[-_./\\]/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

// Case conversion helpers
const CONVERTERS: Record<string, { label: string; desc: string; convert: (str: string) => string }> = {
  camelCase: {
    label: "camelCase",
    desc: "standardCamelCaseConvention",
    convert: (str) => {
      const words = extractWords(str);
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
    },
  },
  pascalCase: {
    label: "PascalCase",
    desc: "StandardPascalCaseConvention",
    convert: (str) => {
      return extractWords(str)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");
    },
  },
  snakeCase: {
    label: "snake_case",
    desc: "standard_snake_case_convention",
    convert: (str) => extractWords(str).map((w) => w.toLowerCase()).join("_"),
  },
  screamingSnake: {
    label: "CONSTANT_CASE",
    desc: "SCREAMING_SNAKE_CASE_CONSTANTS",
    convert: (str) => extractWords(str).map((w) => w.toUpperCase()).join("_"),
  },
  kebabCase: {
    label: "kebab-case (Slug)",
    desc: "web-friendly-url-slugs",
    convert: (str) => extractWords(str).map((w) => w.toLowerCase()).join("-"),
  },
  titleCase: {
    label: "Title Case",
    desc: "Capitalize Every Significant Word",
    convert: (str) => {
      return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
    },
  },
  sentenceCase: {
    label: "Sentence case",
    desc: "Capitalize first word of every sentence.",
    convert: (str) => {
      return str
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    },
  },
  dotCase: {
    label: "dot.case",
    desc: "standard.dot.notation.case",
    convert: (str) => extractWords(str).map((w) => w.toLowerCase()).join("."),
  },
  pathCase: {
    label: "path/case",
    desc: "unix/filesystem/path/convention",
    convert: (str) => extractWords(str).map((w) => w.toLowerCase()).join("/"),
  },
  alternatingCase: {
    label: "aLtErNaTiNg cAsE",
    desc: "mOcKiNg SpOnGeBoB cAsE",
    convert: (str) => {
      return str
        .split("")
        .map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
    },
  },
};

export default function CaseConverterPage() {
  const [input, setInput] = React.useState(SAMPLE_TEXT);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const results = React.useMemo(() => {
    if (!input.trim()) return [];
    return Object.entries(CONVERTERS).map(([key, config]) => ({
      key,
      label: config.label,
      desc: config.desc,
      value: config.convert(input),
    }));
  }, [input]);

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    toast.success(`Copied ${key} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Quick transformations for the input textarea directly
  const transformInput = (fn: (str: string) => string) => {
    setInput((prev) => fn(prev));
  };

  return (
    <SplitPaneLayout
      toolId="case-converter"
      title="Text Case Converter"
      description="Convert text between camelCase, snake_case, PascalCase, kebab-case, Title Case, and CONSTANT_CASE instantly."
      category="text"
      icon="Type"
      tags={["converter", "formatter"]}
      headerActions={
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_TEXT);
              toast.success("Loaded sample text");
            }}
            className="h-8 text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Load Sample</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("")}
            className="h-8 text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      }
      toolbar={
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-muted-foreground mr-1">
            Quick Actions:
          </span>
          <Button
            variant="outline"
            size="xs"
            onClick={() => transformInput((s) => s.toUpperCase())}
            className="h-6 text-xs font-mono"
          >
            UPPERCASE
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => transformInput((s) => s.toLowerCase())}
            className="h-6 text-xs font-mono"
          >
            lowercase
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => transformInput((s) => s.trim().replace(/\s+/g, " "))}
            className="h-6 text-xs font-mono"
          >
            Clean Spaces
          </Button>
        </div>
      }
      leftPaneTitle="Original Text Input"
      leftPaneActions={
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setInput("")}
          disabled={!input}
          className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </Button>
      }
      leftPane={
        <div className="flex flex-col flex-1 gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste any text string to convert across 10 case conventions..."
            spellCheck={false}
            className="flex-1 font-mono text-xs leading-relaxed min-h-[380px] p-3 resize-none bg-background/50 border-border/60 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground px-1">
            <span>Chars: {input.length}</span>
            <span>Words: {extractWords(input).length}</span>
          </div>
        </div>
      }
      rightPaneTitle="Converted Case Variations"
      rightPaneActions={
        <Badge variant="outline" className="text-[10px] font-mono">
          10 Formats Available
        </Badge>
      }
      rightPane={
        <div className="flex flex-col flex-1 gap-2.5 overflow-y-auto max-h-[500px] pr-1">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-lg border border-border/60 bg-muted/20 hover:border-emerald-500/30 transition-all flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {item.label}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleCopy(item.value, item.key)}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                  >
                    {copiedKey === item.key ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copiedKey === item.key ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="font-mono text-xs text-emerald-500/90 break-all bg-background/60 p-2 rounded border border-border/40 select-all">
                  {item.value}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center flex-1 text-muted-foreground/60 italic text-xs">
              Type or paste input to generate case conversions...
            </div>
          )}
        </div>
      }
    />
  );
}