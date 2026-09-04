// src/app/(app)/tools/base64-encoder/page.tsx
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
  Binary,
  ArrowRightLeft,
  FileCode,
  Link2,
} from "lucide-react";
import { SplitPaneLayout } from "@/components/layouts/split-pane-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SAMPLE_TEXT = `Hello, Local-Tools! 🛠️
Privacy-first developer utilities running 100% in your browser.
Zero servers, zero tracking, zero latency.`;

// Unicode & UTF-8 safe Base64 encoding
function utf8ToBase64(str: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  let base64 = btoa(binary);
  if (urlSafe) {
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return base64;
}

// Unicode & UTF-8 safe Base64 decoding
function base64ToUtf8(str: string): string {
  let normalized = str.trim().replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4) {
    normalized += "=";
  }
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function Base64EncoderPage() {
  const [mode, setMode] = React.useState<"encode" | "decode">("encode");
  const [input, setInput] = React.useState(SAMPLE_TEXT);
  const [urlSafe, setUrlSafe] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Compute conversion result
  const { output, isValid, errorMessage, byteSize, inputByteSize } = React.useMemo(() => {
    if (!input) {
      return { output: "", isValid: true, errorMessage: "", byteSize: 0, inputByteSize: 0 };
    }

    const inSize = new Blob([input]).size;

    try {
      if (mode === "encode") {
        const encoded = utf8ToBase64(input, urlSafe);
        return {
          output: encoded,
          isValid: true,
          errorMessage: "",
          byteSize: new Blob([encoded]).size,
          inputByteSize: inSize,
        };
      } else {
        const decoded = base64ToUtf8(input);
        return {
          output: decoded,
          isValid: true,
          errorMessage: "",
          byteSize: new Blob([decoded]).size,
          inputByteSize: inSize,
        };
      }
    } catch (err) {
      const message = (err as Error).message || "Malformed Base64 input string";
      return {
        output: `// ❌ Base64 Error:\n// ${message}`,
        isValid: false,
        errorMessage: message,
        byteSize: 0,
        inputByteSize: inSize,
      };
    }
  }, [input, mode, urlSafe]);

  const handleCopy = () => {
    if (!output || !isValid) {
      toast.error("Nothing valid to copy");
      return;
    }
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output || !isValid) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = mode === "encode" ? "encoded.b64.txt" : "decoded.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded converted text file!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mode === "encode") {
      // Encode any binary/text file directly into Base64 Data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setInput(result);
          toast.success(`Loaded "${file.name}" as Base64 Data URL (${formatBytes(file.size)})`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Decode text file
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setInput(result);
          toast.success(`Loaded "${file.name}" (${formatBytes(file.size)})`);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = "";
  };

  const handleSwap = () => {
    if (isValid && output && !output.startsWith("// ❌")) {
      setInput(output);
      setMode(mode === "encode" ? "decode" : "encode");
      toast.info(`Swapped to ${mode === "encode" ? "Decode" : "Encode"} mode`);
    } else {
      setMode(mode === "encode" ? "decode" : "encode");
    }
  };

  const overhead =
    inputByteSize > 0 && byteSize > 0 && mode === "encode"
      ? Math.round(((byteSize - inputByteSize) / inputByteSize) * 100)
      : 0;

  return (
    <SplitPaneLayout
      toolId="base64-encoder"
      title="Base64 Encoder / Decoder"
      description="Encode and decode text, strings, and binary files to and from Base64 format locally with full UTF-8 support."
      category="dev"
      icon="Binary"
      tags={["encoder-decoder", "converter"]}
      headerActions={
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_TEXT);
              setMode("encode");
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
            onClick={() => {
              setInput("");
              setUrlSafe(false);
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
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/60">
              <Button
                variant={mode === "encode" ? "default" : "ghost"}
                size="xs"
                onClick={() => setMode("encode")}
                className="h-6 px-2.5 text-xs font-mono font-medium"
              >
                Encode Base64
              </Button>
              <Button
                variant={mode === "decode" ? "default" : "ghost"}
                size="xs"
                onClick={() => setMode("decode")}
                className="h-6 px-2.5 text-xs font-mono font-medium"
              >
                Decode Base64
              </Button>
            </div>

            {/* Swap Button */}
            <Button
              variant="outline"
              size="xs"
              onClick={handleSwap}
              className="h-7 text-xs font-mono gap-1"
              title="Swap input with output"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>Swap</span>
            </Button>

            {/* URL Safe Option (Only for encode mode) */}
            {mode === "encode" && (
              <Button
                variant={urlSafe ? "default" : "outline"}
                size="xs"
                onClick={() => setUrlSafe(!urlSafe)}
                className="h-7 text-xs font-mono gap-1"
              >
                <Link2 className="w-3 h-3" />
                <span>URL-Safe (-_)</span>
              </Button>
            )}
          </div>

          {/* Diagnostics Badge */}
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
                {isValid
                  ? mode === "encode"
                    ? `Encodable (+${overhead}% overhead)`
                    : "Valid Base64 String"
                  : "Invalid Base64 Format"}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground font-mono text-[11px]">
                Waiting for input...
              </Badge>
            )}
          </div>
        </>
      }
      leftPaneTitle={mode === "encode" ? "Plaintext / Binary Input" : "Base64 Input"}
      leftPaneActions={
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
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
            onClick={() => setInput("")}
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
            placeholder={
              mode === "encode"
                ? "Type or paste text to encode (supports UTF-8 / Emojis) or drop a file..."
                : "Paste Base64 string to decode (e.g. SGVsbG8gV29ybGQ=)..."
            }
            spellCheck={false}
            className="flex-1 font-mono text-xs leading-relaxed min-h-[380px] p-3 resize-none bg-background/50 border-border/60 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground px-1">
            <span>Chars: {input.length}</span>
            <span>Size: {formatBytes(inputByteSize)}</span>
          </div>
        </div>
      }
      rightPaneTitle={mode === "encode" ? "Base64 Output" : "Decoded Plaintext Output"}
      rightPaneActions={
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            disabled={!output || !isValid}
            className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
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
            Export
          </Button>
        </div>
      }
      rightPane={
        <div className="flex flex-col flex-1 gap-2">
          <div
            className={`flex-1 font-mono text-xs leading-relaxed min-h-[380px] p-3.5 rounded-md border bg-muted/20 overflow-auto whitespace-pre-wrap break-all selection:bg-emerald-500/20 ${
              !isValid
                ? "border-rose-500/30 text-rose-400 bg-rose-500/5"
                : "border-border/60 text-foreground"
            }`}
          >
            {output ? (
              output
            ) : (
              <span className="text-muted-foreground/60 italic select-none">
                Base64 output will appear here in real-time...
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground px-1">
            <span>{isValid ? `Chars: ${output.length}` : "Decoding error"}</span>
            <span>{isValid ? `Size: ${formatBytes(byteSize)}` : ""}</span>
          </div>
        </div>
      }
    />
  );
}