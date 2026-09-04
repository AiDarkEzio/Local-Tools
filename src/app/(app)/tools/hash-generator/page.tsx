// src/app/(app)/tools/hash-generator/page.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Copy,
  Trash2,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { SplitPaneLayout } from "@/components/layouts/split-pane-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog";

// RFC 1321 pure TypeScript MD5 algorithm
function md5(input: string | Uint8Array): string {
  let bytes: Uint8Array;
  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input);
  } else {
    bytes = input;
  }

  const k = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ];

  const s = [
    7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
    5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
    4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
    6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,
  ];

  const bitLength = bytes.length * 8;
  const newLength = (((bytes.length + 8) >> 6) + 1) << 6;
  const padded = new Uint8Array(newLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(newLength - 8, bitLength, true);
  view.setUint32(newLength - 4, Math.floor(bitLength / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let i = 0; i < newLength; i += 64) {
    const m = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      m[j] = view.getUint32(i + j * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let j = 0; j < 64; j++) {
      let f = 0;
      let g = 0;
      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      const rotate = ((a + f + k[j] + m[g]) << s[j]) | ((a + f + k[j] + m[g]) >>> (32 - s[j]));
      b = (b + rotate) | 0;
      a = temp;
    }

    a0 = (a0 + a) | 0;
    b0 = (b0 + b) | 0;
    c0 = (c0 + c) | 0;
    d0 = (d0 + d) | 0;
  }

  const out = new DataView(new ArrayBuffer(16));
  out.setUint32(0, a0, true);
  out.setUint32(4, b0, true);
  out.setUint32(8, c0, true);
  out.setUint32(12, d0, true);

  return Array.from(new Uint8Array(out.buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Compute standard Web Crypto API digests
async function computeWebCryptoHash(algorithm: string, data: Uint8Array): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest(algorithm, data as BufferSource);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface HashRow {
  name: string;
  bits: number;
  value: string;
}

export default function HashGeneratorPage() {
  const [input, setInput] = React.useState(SAMPLE_TEXT);
  const [uppercase, setUppercase] = React.useState(false);
  const [compareHash, setCompareHash] = React.useState("");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [hashes, setHashes] = React.useState<HashRow[]>([]);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Compute all hashes on input change
  React.useEffect(() => {
    let isActive = true;

    async function generateAllHashes() {
      if (!input) {
        setHashes([]);
        return;
      }

      setIsCalculating(true);
      const data = new TextEncoder().encode(input);

      try {
        const md5Val = md5(data);
        const [sha1, sha256, sha384, sha512] = await Promise.all([
          computeWebCryptoHash("SHA-1", data),
          computeWebCryptoHash("SHA-256", data),
          computeWebCryptoHash("SHA-384", data),
          computeWebCryptoHash("SHA-512", data),
        ]);

        if (isActive) {
          setHashes([
            { name: "MD5", bits: 128, value: md5Val },
            { name: "SHA-1", bits: 160, value: sha1 },
            { name: "SHA-256", bits: 256, value: sha256 },
            { name: "SHA-384", bits: 384, value: sha384 },
            { name: "SHA-512", bits: 512, value: sha512 },
          ]);
          setIsCalculating(false);
        }
      } catch (err) {
        console.error("Hash calculation failed", err);
        setIsCalculating(false);
      }
    }

    generateAllHashes();

    return () => {
      isActive = false;
    };
  }, [input]);

  const handleCopy = (val: string, key: string) => {
    const formatted = uppercase ? val.toUpperCase() : val.toLowerCase();
    navigator.clipboard.writeText(formatted);
    setCopiedKey(key);
    toast.success(`Copied ${key} hash to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      toast.success(`Loaded "${file.name}" for checksum hashing`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Compare mode match status
  const matchResult = React.useMemo(() => {
    if (!compareHash.trim() || hashes.length === 0) return null;
    const target = compareHash.trim().toLowerCase();
    const matched = hashes.find((h) => h.value.toLowerCase() === target);
    return matched ? matched.name : "none";
  }, [compareHash, hashes]);

  return (
    <SplitPaneLayout
      toolId="hash-generator"
      title="Cryptographic Hash Generator"
      description="Generate instant MD5, SHA-1, SHA-256, SHA-384, and SHA-512 checksum hashes locally with native Web Crypto performance."
      category="security"
      icon="ShieldCheck"
      tags={["generator", "checker"]}
      headerActions={
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_TEXT);
              setCompareHash("");
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
              setCompareHash("");
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
            <Button
              variant={uppercase ? "default" : "outline"}
              size="xs"
              onClick={() => setUppercase(!uppercase)}
              className="h-7 text-xs font-mono"
            >
              {uppercase ? "UPPERCASE (HEX)" : "lowercase (hex)"}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-mono text-[11px]"
            >
              5 Algorithms Active
            </Badge>
          </div>
        </>
      }
      leftPaneTitle="Input Text or Data"
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
        <div className="flex flex-col flex-1 gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text string to compute hashes in real-time..."
            spellCheck={false}
            className="flex-1 font-mono text-xs leading-relaxed min-h-[260px] p-3 resize-none bg-background/50 border-border/60 focus:border-emerald-500 focus:ring-emerald-500/20"
          />

          {/* Checksum Matcher Input */}
          <div className="pt-2 border-t border-border/40 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Verify Checksum Match:</span>
              {matchResult && matchResult !== "none" && (
                <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Matches {matchResult}!
                </span>
              )}
              {matchResult === "none" && (
                <span className="text-rose-500 flex items-center gap-1 font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> No match found
                </span>
              )}
            </div>
            <Input
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              placeholder="Paste an existing hash to compare (e.g. e4d909c29...)"
              className="h-8 font-mono text-xs"
            />
          </div>
        </div>
      }
      rightPaneTitle="Computed Hash Digests"
      rightPaneActions={
        <span className="text-[11px] font-mono text-muted-foreground">
          {isCalculating ? "Calculating..." : `${hashes.length} Hashes`}
        </span>
      }
      rightPane={
        <div className="flex flex-col flex-1 gap-2.5 overflow-y-auto">
          {hashes.length > 0 ? (
            hashes.map((item) => {
              const displayVal = uppercase ? item.value.toUpperCase() : item.value.toLowerCase();
              const isMatched =
                compareHash.trim() && compareHash.trim().toLowerCase() === item.value.toLowerCase();

              return (
                <div
                  key={item.name}
                  className={`p-3 rounded-lg border transition-all ${
                    isMatched
                      ? "bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/30"
                      : "bg-muted/20 border-border/60 hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {item.name}
                      </span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono">
                        {item.bits} bits
                      </Badge>
                      {isMatched && (
                        <Badge className="bg-emerald-500 text-zinc-950 text-[9px] px-1.5 py-0 font-mono">
                          MATCH
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleCopy(item.value, item.name)}
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    >
                      {copiedKey === item.name ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="font-mono text-xs break-all text-muted-foreground select-all bg-background/50 p-2 rounded border border-border/40">
                    {displayVal}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center flex-1 text-muted-foreground/60 italic text-xs">
              Type or paste input to compute cryptographic digests...
            </div>
          )}
        </div>
      }
    />
  );
}