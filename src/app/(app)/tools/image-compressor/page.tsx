// src/app/(app)/tools/image-compressor/page.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Upload,
  Download,
  RotateCcw,
  Lock,
  Unlock,
  Trash2,
  Loader2,
} from "lucide-react";
import { FocusCanvasLayout } from "@/components/layouts/focus-canvas-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type OutputFormat = "image/webp" | "image/jpeg" | "image/png";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function ImageCompressorPage() {
  // Input File State
  const [originalFile, setOriginalFile] = React.useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = React.useState<string>("");
  const [originalDimensions, setOriginalDimensions] = React.useState({ width: 0, height: 0 });
  const [originalSize, setOriginalSize] = React.useState(0);

  // Settings State
  const [quality, setQuality] = React.useState<number>(80);
  const [format, setFormat] = React.useState<OutputFormat>("image/webp");
  const [targetWidth, setTargetWidth] = React.useState<number>(0);
  const [targetHeight, setTargetHeight] = React.useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = React.useState<boolean>(true);

  // Compressed Result State
  const [compressedBlob, setCompressedBlob] = React.useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = React.useState<string>("");
  const [compressedSize, setCompressedSize] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cachedImgRef = React.useRef<HTMLImageElement | null>(null);

  // Clean up object URLs on unmount
  React.useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  // Load selected file and cache the HTMLImageElement in memory
  const handleLoadImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPEG, WEBP, etc.)");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      cachedImgRef.current = img;
      setOriginalFile(file);
      setOriginalUrl(objectUrl);
      setOriginalSize(file.size);
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      toast.success(`Loaded "${file.name}" (${img.naturalWidth}x${img.naturalHeight})`);
    };
    img.src = objectUrl;
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLoadImage(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleLoadImage(file);
  };

  // Debounced canvas re-encoding & compression
  React.useEffect(() => {
    const img = cachedImgRef.current;
    if (!img || targetWidth <= 0 || targetHeight <= 0) return;

    let isActive = true;

    // 200ms debounce prevents lagging when dragging sliders
    const debounceTimer = setTimeout(() => {
      setIsProcessing(true);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Fill white background for JPEG exports if original has transparency
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (!isActive || !blob) {
            setIsProcessing(false);
            return;
          }

          setCompressedBlob(blob);
          setCompressedSize(blob.size);
          setCompressedUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });
          setIsProcessing(false);
        },
        format,
        format === "image/png" ? undefined : quality / 100
      );
    }, 200);

    return () => {
      isActive = false;
      clearTimeout(debounceTimer);
    };
  }, [originalFile, targetWidth, targetHeight, format, quality]);

  // Dimension Change Handlers with Aspect Ratio Lock
  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspectRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const handleScalePreset = (percent: number) => {
    if (originalDimensions.width > 0) {
      const w = Math.round((originalDimensions.width * percent) / 100);
      const h = Math.round((originalDimensions.height * percent) / 100);
      setTargetWidth(w);
      setTargetHeight(h);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !compressedUrl) {
      toast.error("No compressed image available to download");
      return;
    }
    const ext = format === "image/webp" ? "webp" : format === "image/jpeg" ? "jpg" : "png";
    const nameWithoutExt = originalFile?.name.replace(/\.[^/.]+$/, "") || "compressed";
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `${nameWithoutExt}-compressed.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded compressed image!");
  };

  const handleReset = () => {
    setQuality(80);
    setFormat("image/webp");
    if (originalDimensions.width > 0) {
      setTargetWidth(originalDimensions.width);
      setTargetHeight(originalDimensions.height);
    }
    toast.info("Reset to default compression settings");
  };

  const handleClear = () => {
    cachedImgRef.current = null;
    setOriginalFile(null);
    setOriginalUrl("");
    setCompressedBlob(null);
    setCompressedUrl("");
    setOriginalSize(0);
    setCompressedSize(0);
    toast.info("Image cleared");
  };

  // Calculate savings
  const savingsPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return (
    <FocusCanvasLayout
      toolId="image-compressor"
      title="Image Compressor & Resizer"
      description="Reduce image file size and scale dimensions locally using HTML5 Canvas without server uploads."
      category="image"
      icon="Image"
      tags={["compressor", "editor"]}
      featured={true}
      headerActions={
        originalFile && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="h-8 text-xs gap-1.5 text-rose-400 hover:text-rose-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </Button>
          </div>
        )
      }
      canvasTitle={originalFile ? originalFile.name : "Image Preview Stage"}
      canvasActions={
        originalFile && compressedSize > 0 ? (
          <Badge
            variant="outline"
            className={`font-mono text-[10px] ${
              savingsPercent > 0
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            }`}
          >
            {savingsPercent > 0 ? `Savings: -${savingsPercent}%` : `Size: +${Math.abs(savingsPercent)}%`}
          </Badge>
        ) : undefined
      }
      canvas={
        originalFile && (compressedUrl || originalUrl) ? (
          <div className="flex flex-col items-center justify-center w-full gap-4">
            {/* Visual Canvas Display */}
            <div className="relative flex items-center justify-center w-full max-h-[380px] min-h-[260px] rounded-xl bg-zinc-950/40 border border-border/60 overflow-hidden p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={compressedUrl || originalUrl}
                alt="Preview"
                className="max-h-[340px] max-w-full object-contain rounded-md shadow-md transition-opacity duration-200"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-background/40 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-mono text-emerald-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Optimizing...</span>
                </div>
              )}
            </div>

            {/* Metrics Comparison Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-muted-foreground bg-muted/20 px-4 py-2 rounded-lg border border-border/40">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Original:</span>
                <span className="text-foreground font-semibold">{formatBytes(originalSize)}</span>
                <span className="text-[10px] opacity-70">({originalDimensions.width}x{originalDimensions.height})</span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Compressed:</span>
                <span className="text-emerald-500 font-bold">
                  {compressedSize > 0 ? formatBytes(compressedSize) : "Processing..."}
                </span>
                <span className="text-[10px] opacity-70">({targetWidth}x{targetHeight})</span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Upload Dropzone */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full min-h-[360px] p-8 text-center rounded-xl border-2 border-dashed border-border/80 hover:border-emerald-500/50 bg-muted/10 hover:bg-emerald-500/5 cursor-pointer transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4 border border-emerald-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Drop your image here or click to browse
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              Supports PNG, JPEG, WEBP, and AVIF up to 50 MB. Processed 100% locally on your device.
            </p>
          </div>
        )
      }
      controlsTitle="Compression Controls"
      controls={
        <>
          {/* Quality Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Quality Level:</span>
              <span className="font-bold text-emerald-500">{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              disabled={!originalFile || format === "image/png"}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer disabled:opacity-40"
            />
            {format === "image/png" && (
              <span className="text-[10px] text-muted-foreground font-mono">
                PNG uses lossless compression (quality slider disabled).
              </span>
            )}
          </div>

          {/* Format Selection */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
            <span className="text-xs font-mono text-muted-foreground">Output Format:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "WEBP", value: "image/webp" as OutputFormat },
                { label: "JPEG", value: "image/jpeg" as OutputFormat },
                { label: "PNG", value: "image/png" as OutputFormat },
              ].map((item) => (
                <Button
                  key={item.value}
                  variant={format === item.value ? "default" : "outline"}
                  size="xs"
                  disabled={!originalFile}
                  onClick={() => setFormat(item.value)}
                  className="h-7 text-xs uppercase font-mono"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Dimension Resizing */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Dimensions (px):</span>
              <Button
                variant="ghost"
                size="icon-xs"
                disabled={!originalFile}
                onClick={() => setLockAspectRatio(!lockAspectRatio)}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                title={lockAspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
              >
                {lockAspectRatio ? <Lock className="w-3 h-3 text-emerald-500" /> : <Unlock className="w-3 h-3" />}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-muted-foreground">Width</label>
                <Input
                  type="number"
                  min="10"
                  max="10000"
                  value={targetWidth || ""}
                  disabled={!originalFile}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-muted-foreground">Height</label>
                <Input
                  type="number"
                  min="10"
                  max="10000"
                  value={targetHeight || ""}
                  disabled={!originalFile}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Quick Scale Presets */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {[25, 50, 75, 100].map((pct) => (
                <Button
                  key={pct}
                  variant="outline"
                  size="xs"
                  disabled={!originalFile}
                  onClick={() => handleScalePreset(pct)}
                  className="h-6 text-[10px] font-mono"
                >
                  {pct}%
                </Button>
              ))}
            </div>
          </div>

          {/* Download Action Button */}
          <Button
            onClick={handleDownload}
            disabled={!originalFile || !compressedBlob || isProcessing}
            className="w-full h-10 mt-2 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 gap-2 font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Download Compressed</span>
          </Button>
        </>
      }
    />
  );
}