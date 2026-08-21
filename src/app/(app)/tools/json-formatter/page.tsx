// src/app/(app)/tools/json-formatter/page.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Copy,
  Trash2,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  Check,
  Code2,
  Minimize2,
  ArrowDownAZ,
  FileCode,
  FileText,
} from "lucide-react";
import { SplitPaneLayout } from "@/components/layouts/split-pane-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SAMPLE_JSON = `{
  "name": "Local Tools",
  "version": "0.2.0",
  "private": true,
  "description": "Fast, private browser utilities",
  "tags": [
    "privacy-first",
    "zero-server",
    "nextjs",
    "tailwind"
  ],
  "stats": {
    "totalTools": 30,
    "stars": 1280,
    "featured": true
  }
}`;

// Helper recursively sorting object keys alphabetically
function sortKeysRecursively(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortKeysRecursively);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, key) => {
        acc[key] = sortKeysRecursively((obj as Record<string, unknown>)[key]);
        return acc;
      }, {} as Record<string, unknown>);
  }
  return obj;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function JsonFormatterPage() {
  const [input, setInput] = React.useState(SAMPLE_JSON);
  const [indent, setIndent] = React.useState<number | "tab">(2);
  const [isMinified, setIsMinified] = React.useState(false);
  const [isSortKeys, setIsSortKeys] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Compute parsed state, syntax validation, error info, and formatted string
  const { output, isValid, errorMessage, lineCount, byteSize } = React.useMemo(() => {
    if (!input.trim()) {
      return {
        output: "",
        isValid: true,
        errorMessage: "",
        lineCount: 0,
        byteSize: 0,
      };
    }

    try {
      let parsed = JSON.parse(input);
      if (isSortKeys) {
        parsed = sortKeysRecursively(parsed);
      }

      const indentation = isMinified ? undefined : indent === "tab" ? "\t" : indent;
      const formatted = isMinified
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indentation);

      const size = new Blob([formatted]).size;
      const lines = formatted.split("\n").length;

      return {
        output: formatted,
        isValid: true,
        errorMessage: "",
        lineCount: lines,
        byteSize: size,
      };
    } catch (err) {
      const message = (err as Error).message;
      return {
        output: `// ❌ Syntax Error:\n// ${message}`,
        isValid: false,
        errorMessage: message,
        lineCount: 0,
        byteSize: 0,
      };
    }
  }, [input, indent, isMinified, isSortKeys]);

  const inputStats = React.useMemo(() => {
    const lines = input.trim() ? input.split("\n").length : 0;
    const size = new Blob([input]).size;
    return { lines, size };
  }, [input]);

  const handleCopy = () => {
    if (!output || !isValid) {
      toast.error("Nothing valid to copy");
      return;
    }
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Formatted JSON copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output || !isValid) {
      toast.error("Cannot download invalid JSON");
      return;
    }
    const blob = new Blob([output], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isMinified ? "data.min.json" : "formatted.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded JSON file!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json") && file.type && !file.type.includes("json")) {
      toast.error("Please select a valid .json file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      toast.success(`Loaded "${file.name}" (${formatBytes(file.size)})`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClear = () => {
    setInput("");
    toast.info("Input cleared");
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
    setIsMinified(false);
    toast.success("Sample JSON loaded!");
  };

  return (
    <SplitPaneLayout
      toolId="json-formatter"
      title="JSON Formatter & Validator"
      description="Prettify, validate, minify, and sort malformed JSON data instantly entirely inside your browser."
      category="dev"
      icon="FileJson"
      tags={["formatter", "validator"]}
      featured={true}
      headerActions={
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSample}
            className="h-8 text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Load Sample</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput("");
              setIsMinified(false);
              setIsSortKeys(false);
              setIndent(2);
            }}
            className="h-8 text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      }
      toolbar={
        <>
          <div className="flex flex-wrap items-center gap-2">
            {/* Indentation Selector */}
            <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/60">
              <span className="text-[11px] font-mono font-medium text-muted-foreground px-2">
                Indent:
              </span>
              {[2, 4].map((spaces) => (
                <Button
                  key={spaces}
                  variant={!isMinified && indent === spaces ? "default" : "ghost"}
                  size="xs"
                  disabled={isMinified}
                  onClick={() => {
                    setIsMinified(false);
                    setIndent(spaces);
                  }}
                  className="h-6 px-2 text-xs font-mono"
                >
                  {spaces}s
                </Button>
              ))}
              <Button
                variant={!isMinified && indent === "tab" ? "default" : "ghost"}
                size="xs"
                disabled={isMinified}
                onClick={() => {
                  setIsMinified(false);
                  setIndent("tab");
                }}
                className="h-6 px-2 text-xs font-mono"
              >
                Tab
              </Button>
            </div>

            {/* Minify Toggle */}
            <Button
              variant={isMinified ? "default" : "outline"}
              size="xs"
              onClick={() => setIsMinified(!isMinified)}
              className="h-7 text-xs font-mono gap-1"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Minify</span>
            </Button>

            {/* Sort Keys Toggle */}
            <Button
              variant={isSortKeys ? "default" : "outline"}
              size="xs"
              onClick={() => setIsSortKeys(!isSortKeys)}
              className="h-7 text-xs font-mono gap-1"
            >
              <ArrowDownAZ className="w-3 h-3" />
              <span>Sort Keys</span>
            </Button>
          </div>

          {/* Validation Status Badge */}
          <div className="flex items-center gap-2">
            {input.trim() ? (
              <Badge
                variant="outline"
                className={
                  isValid
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-mono text-[11px]"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/30 font-mono text-[11px]"
                }
              >
                {isValid ? "✓ Valid JSON" : "✕ Invalid JSON"}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground font-mono text-[11px]">
                Waiting for input...
              </Badge>
            )}
          </div>
        </>
      }
      leftPaneTitle="Raw JSON Input"
      leftPaneActions={
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={() => fileInputRef.current?.click()}
            className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs gap-1"
          >
            <Upload className="w-3 h-3" />
            Upload File
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={handleClear}
            disabled={!input}
            className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </Button>
        </div>
      }
      leftPane={
        <div className="flex flex-col flex-1 gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste raw JSON here or drag & drop a .json file..."
            spellCheck={false}
            className="flex-1 font-mono text-xs leading-relaxed min-h-[380px] p-3 resize-none bg-background/50 border-border/60 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground px-1">
            <span>Lines: {inputStats.lines}</span>
            <span>Size: {formatBytes(inputStats.size)}</span>
          </div>
        </div>
      }
      rightPaneTitle="Formatted Output"
      rightPaneActions={
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            disabled={!output || !isValid}
            className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs gap-1"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={handleDownload}
            disabled={!output || !isValid}
            className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs gap-1"
          >
            <Download className="w-3 h-3" />
            Export .json
          </Button>
        </div>
      }
      rightPane={
        <div className="flex flex-col flex-1 gap-2">
          <div
            className={`flex-1 font-mono text-xs leading-relaxed min-h-[380px] p-3.5 rounded-md border bg-muted/20 overflow-auto whitespace-pre selection:bg-emerald-500/20 ${
              !isValid
                ? "border-rose-500/30 text-rose-400 bg-rose-500/5"
                : "border-border/60 text-foreground"
            }`}
          >
            {output ? (
              output
            ) : (
              <span className="text-muted-foreground/60 italic select-none">
                Formatted JSON output will appear here in real-time...
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground px-1">
            <span>{isValid ? `Lines: ${lineCount}` : "Syntax error detected"}</span>
            <span>{isValid ? `Size: ${formatBytes(byteSize)}` : ""}</span>
          </div>
        </div>
      }
    />
  );
}