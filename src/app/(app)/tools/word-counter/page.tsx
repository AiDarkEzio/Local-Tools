// src/app/(app)/tools/word-counter/page.tsx
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
  AlignLeft,
  Clock,
  Mic,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { SplitPaneLayout } from "@/components/layouts/split-pane-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SAMPLE_ESSAY = `LocalTools is an open-source suite of developer utilities designed with privacy as the foundational priority. Every byte of text, token, image, and certificate processed in this browser never leaves your device. 

Traditional online converter tools often transmit sensitive data over public HTTP networks to remote backend servers. LocalTools eliminates these security risks by running all computations in client-side WebAssembly, HTML5 Canvas, and modern Web Cryptography engines.`;

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
  "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
  "to", "was", "were", "will", "with", "this", "or", "an", "your",
]);

export default function WordCounterPage() {
  const [text, setText] = React.useState(SAMPLE_ESSAY);
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Compute text statistics
  const stats = React.useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        avgWordLength: 0,
        topKeywords: [],
      };
    }

    const wordsArray = trimmed.split(/\s+/).filter(Boolean);
    const words = wordsArray.length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
    const lines = text.split("\n").length;

    // Standard 200 WPM reading speed, 130 WPM speaking speed
    const readingTimeMinutes = Math.ceil(words / 200);
    const speakingTimeMinutes = Math.ceil(words / 130);
    const avgWordLength = words > 0 ? (charactersNoSpaces / words).toFixed(1) : 0;

    // Keyword density ranking
    const frequencyMap: Record<string, number> = {};
    wordsArray.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.length > 2 && !STOP_WORDS.has(clean)) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / words) * 100).toFixed(1),
      }));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTimeMinutes,
      speakingTimeMinutes,
      avgWordLength,
      topKeywords,
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
      toast.success(`Loaded "${file.name}"`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <SplitPaneLayout
      toolId="word-counter"
      title="Word & Text Analyzer"
      description="Count words, characters, sentences, reading time, and examine keyword density in real-time."
      category="text"
      icon="AlignLeft"
      tags={["checker", "formatter"]}
      headerActions={
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setText(SAMPLE_ESSAY);
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
            onClick={() => setText("")}
            className="h-8 text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      }
      toolbar={
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" /> Reading Time:{" "}
              <strong className="text-foreground">{stats.readingTimeMinutes} min</strong>
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-sky-400" /> Speaking Time:{" "}
              <strong className="text-foreground">{stats.speakingTimeMinutes} min</strong>
            </span>
          </div>
        </div>
      }
      leftPaneTitle="Text Editor"
      leftPaneActions={
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json,.csv"
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
            onClick={() => setText("")}
            disabled={!text}
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
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste any text to see real-time word count, reading times, and keyword analytics..."
            spellCheck={true}
            className="flex-1 font-mono text-xs leading-relaxed min-h-[380px] p-3 resize-none bg-background/50 border-border/60 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>
      }
      rightPaneTitle="Typographical Analytics"
      rightPaneActions={
        <Button
          variant="ghost"
          size="xs"
          onClick={handleCopy}
          disabled={!text}
          className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs gap-1"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy Text"}
        </Button>
      }
      rightPane={
        <div className="flex flex-col flex-1 gap-4 overflow-y-auto pr-1">
          {/* Main Counters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { label: "Words", val: stats.words },
              { label: "Characters", val: stats.characters },
              { label: "Chars (No Space)", val: stats.charactersNoSpaces },
              { label: "Sentences", val: stats.sentences },
              { label: "Paragraphs", val: stats.paragraphs },
              { label: "Lines", val: stats.lines },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-lg border border-border/60 bg-muted/20 flex flex-col"
              >
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {item.label}
                </span>
                <span className="text-xl font-bold font-mono text-foreground mt-0.5">
                  {item.val}
                </span>
              </div>
            ))}
          </div>

          {/* Average metrics */}
          <div className="p-3 rounded-lg border border-border/60 bg-muted/10 flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">Average Word Length:</span>
            <span className="font-bold text-emerald-500">{stats.avgWordLength} characters</span>
          </div>

          {/* Keyword Density Table */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Top Keyword Frequency</span>
            </div>

            {stats.topKeywords.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {stats.topKeywords.map((k) => (
                  <div
                    key={k.word}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-xs font-mono border border-border/40"
                  >
                    <span className="font-medium text-foreground">{k.word}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{k.count}x</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                        {k.density}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs font-mono text-muted-foreground/60 italic">
                Add text to generate keyword frequency metrics...
              </span>
            )}
          </div>
        </div>
      }
    />
  );
}