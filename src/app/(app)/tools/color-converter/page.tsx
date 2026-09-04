"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Copy,
  RotateCcw,
  Sparkles,
  Check,
  Palette,
  Eye,
  Pipette,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { CompactCardLayout } from "@/components/layouts/compact-card-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

// ---------------------------------------------------------------------------
// 1. Universal Color Parsing Engine
// ---------------------------------------------------------------------------

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// Convert HSL to RGBA
function hslToRgb(h: number, s: number, l: number, a = 1): RGBA {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: clamp(a, 0, 1),
  };
}

// Convert HSV/HSB to RGBA
function hsvToRgb(h: number, s: number, v: number, a = 1): RGBA {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  v = clamp(v, 0, 100) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: clamp(a, 0, 1),
  };
}

// Convert CMYK to RGBA
function cmykToRgb(c: number, m: number, y: number, k: number, a = 1): RGBA {
  c = clamp(c, 0, 100) / 100;
  m = clamp(m, 0, 100) / 100;
  y = clamp(y, 0, 100) / 100;
  k = clamp(k, 0, 100) / 100;

  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    a: clamp(a, 0, 1),
  };
}

// Convert OKLCH to RGBA (Native Tailwind CSS v4 Color Model)
function oklchToRgb(l: number, c: number, h: number, a = 1): RGBA {
  if (l > 1) l = l / 100; // Handle 0-100% inputs
  const hRad = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hRad);
  const b_ = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.2914855480 * b_;

  const lCube = l_ * l_ * l_;
  const mCube = m_ * m_ * m_;
  const sCube = s_ * s_ * s_;

  const rLin = +4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube;
  const gLin = -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube;
  const bLin = -0.0041960863 * lCube - 0.7034186147 * mCube + 1.7076147010 * sCube;

  const gamma = (val: number) =>
    val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(Math.max(0, val), 1 / 2.4) - 0.055;

  return {
    r: Math.round(clamp(gamma(rLin) * 255, 0, 255)),
    g: Math.round(clamp(gamma(gLin) * 255, 0, 255)),
    b: Math.round(clamp(gamma(bLin) * 255, 0, 255)),
    a: clamp(a, 0, 1),
  };
}

// Fallback Canvas parser for CSS named colors (e.g. coral, rebeccapurple, aquamarine)
function parseWithCanvas(str: string): RGBA | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000000";
  ctx.fillStyle = str;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: parseFloat((a / 255).toFixed(2)) };
}

// Main Universal Color Parser detecting any format
function parseUniversalColor(input: string): { rgba: RGBA; detectedFormat: string } | null {
  const str = input.trim();
  if (!str) return null;

  // 1. HEX / HEXA (#fff, #ffffff, #ffffffff, or without #)
  const hexMatch = str.match(/^#?([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("") + "ff";
    } else if (hex.length === 4) {
      hex = hex.split("").map((c) => c + c).join("");
    } else if (hex.length === 6) {
      hex += "ff";
    }
    if (hex.length === 8) {
      const num = parseInt(hex, 16);
      if (!isNaN(num)) {
        return {
          rgba: {
            r: (num >> 24) & 255,
            g: (num >> 16) & 255,
            b: (num >> 8) & 255,
            a: parseFloat(((num & 255) / 255).toFixed(2)),
          },
          detectedFormat: hexMatch[1].length > 6 ? "HEXA" : "HEX",
        };
      }
    }
  }

  // 2. RGB / RGBA: rgb(16, 185, 129) or rgb(16 185 129 / 0.8)
  const rgbMatch = str.match(
    /^rgba?\(\s*([0-9.]+)\s*[, ]\s*([0-9.]+)\s*[, ]\s*([0-9.]+)\s*(?:[,/]\s*([0-9.]+%?))?\s*\)$/i
  );
  if (rgbMatch) {
    const r = parseFloat(rgbMatch[1]);
    const g = parseFloat(rgbMatch[2]);
    const b = parseFloat(rgbMatch[3]);
    let a = 1;
    if (rgbMatch[4]) {
      a = rgbMatch[4].endsWith("%")
        ? parseFloat(rgbMatch[4]) / 100
        : parseFloat(rgbMatch[4]);
    }
    return {
      rgba: { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: clamp(a, 0, 1) },
      detectedFormat: rgbMatch[4] ? "RGBA" : "RGB",
    };
  }

  // 3. HSL / HSLA: hsl(160, 84%, 39%) or hsl(160deg 84% 39% / 80%)
  const hslMatch = str.match(
    /^hsla?\(\s*([0-9.]+)(?:deg)?\s*[, ]\s*([0-9.]+)%?\s*[, ]\s*([0-9.]+)%?\s*(?:[,/]\s*([0-9.]+%?))?\s*\)$/i
  );
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    let a = 1;
    if (hslMatch[4]) {
      a = hslMatch[4].endsWith("%")
        ? parseFloat(hslMatch[4]) / 100
        : parseFloat(hslMatch[4]);
    }
    return {
      rgba: hslToRgb(h, s, l, a),
      detectedFormat: hslMatch[4] ? "HSLA" : "HSL",
    };
  }

  // 4. HSV / HSB: hsv(160, 91%, 73%)
  const hsvMatch = str.match(
    /^hs[vb]\(\s*([0-9.]+)(?:deg)?\s*[, ]\s*([0-9.]+)%?\s*[, ]\s*([0-9.]+)%?\s*(?:[,/]\s*([0-9.]+%?))?\s*\)$/i
  );
  if (hsvMatch) {
    const h = parseFloat(hsvMatch[1]);
    const s = parseFloat(hsvMatch[2]);
    const v = parseFloat(hsvMatch[3]);
    let a = 1;
    if (hsvMatch[4]) {
      a = hsvMatch[4].endsWith("%")
        ? parseFloat(hsvMatch[4]) / 100
        : parseFloat(hsvMatch[4]);
    }
    return {
      rgba: hsvToRgb(h, s, v, a),
      detectedFormat: "HSV",
    };
  }

  // 5. OKLCH: oklch(0.696 0.17 162.48 / 0.8) or oklch(69.6% 0.17 162.48)
  const oklchMatch = str.match(
    /^oklch\(\s*([0-9.]+%?)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/i
  );
  if (oklchMatch) {
    const lStr = oklchMatch[1];
    const l = lStr.endsWith("%") ? parseFloat(lStr) / 100 : parseFloat(lStr);
    const c = parseFloat(oklchMatch[2]);
    const h = parseFloat(oklchMatch[3]);
    let a = 1;
    if (oklchMatch[4]) {
      a = oklchMatch[4].endsWith("%")
        ? parseFloat(oklchMatch[4]) / 100
        : parseFloat(oklchMatch[4]);
    }
    return {
      rgba: oklchToRgb(l, c, h, a),
      detectedFormat: "OKLCH",
    };
  }

  // 6. CMYK: cmyk(91%, 0%, 30%, 27%) or cmyk(91 0 30 27)
  const cmykMatch = str.match(
    /^cmyk\(\s*([0-9.]+)%?\s*[, ]\s*([0-9.]+)%?\s*[, ]\s*([0-9.]+)%?\s*[, ]\s*([0-9.]+)%?\s*\)$/i
  );
  if (cmykMatch) {
    const c = parseFloat(cmykMatch[1]);
    const m = parseFloat(cmykMatch[2]);
    const y = parseFloat(cmykMatch[3]);
    const k = parseFloat(cmykMatch[4]);
    return {
      rgba: cmykToRgb(c, m, y, k),
      detectedFormat: "CMYK",
    };
  }

  // 7. CSS Named Color Fallback (e.g. coral, tomato, rebeccapurple)
  const canvasRgba = parseWithCanvas(str);
  if (canvasRgba) {
    return {
      rgba: canvasRgba,
      detectedFormat: "CSS Name",
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// 2. Converters from RGBA to Formats
// ---------------------------------------------------------------------------

function rgbaToHex(rgba: RGBA): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`;
}

function rgbaToHexa(rgba: RGBA): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  const alphaHex = Math.round(rgba.a * 255).toString(16).padStart(2, "0");
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${alphaHex}`;
}

function rgbaToHsl(rgba: RGBA) {
  const r = rgba.r / 255;
  const g = rgba.g / 255;
  const b = rgba.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: rgba.a,
  };
}

function rgbaToHsv(rgba: RGBA) {
  const r = rgba.r / 255;
  const g = rgba.g / 255;
  const b = rgba.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function rgbaToCmyk(rgba: RGBA) {
  const r = rgba.r / 255;
  const g = rgba.g / 255;
  const b = rgba.b / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = Math.round(((1 - r - k) / (1 - k)) * 100);
  const m = Math.round(((1 - g - k) / (1 - k)) * 100);
  const y = Math.round(((1 - b - k) / (1 - k)) * 100);
  return { c, m, y, k: Math.round(k * 100) };
}

function rgbaToOklch(rgba: RGBA) {
  const toLinear = (c: number) =>
    c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  const r = toLinear(rgba.r / 255);
  const g = toLinear(rgba.g / 255);
  const b = toLinear(rgba.b / 255);

  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return {
    l: parseFloat(L.toFixed(3)),
    c: parseFloat(C.toFixed(3)),
    h: parseFloat(H.toFixed(2)),
  };
}

function getRelativeLuminance(rgba: RGBA): number {
  const sRGB = [rgba.r / 255, rgba.g / 255, rgba.b / 255];
  const linear = sRGB.map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

// Preset popular palettes
const POPULAR_SWATCHES = [
  { name: "Emerald", hex: "#10b981" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Fuchsia", hex: "#d946ef" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Zinc", hex: "#71717a" },
];

const emptySubscribe = () => () => {};

function getEyeDropperSnapshot(): boolean {
  return typeof window !== "undefined" && "EyeDropper" in window;
}

function getEyeDropperServerSnapshot(): boolean {
  return false;
}

export default function ColorConverterPage() {
  const [universalInput, setUniversalInput] = React.useState("#10B981");
  const [currentColor, setCurrentColor] = React.useState<RGBA>({ r: 16, g: 185, b: 129, a: 1 });
  const [detectedFormat, setDetectedFormat] = React.useState<string>("HEX");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const hasEyeDropper = React.useSyncExternalStore(
    emptySubscribe,
    getEyeDropperSnapshot,
    getEyeDropperServerSnapshot
  );

  // Handle live universal text inputs
  const handleUniversalChange = (val: string) => {
    setUniversalInput(val);
    const parsed = parseUniversalColor(val);
    if (parsed) {
      setCurrentColor(parsed.rgba);
      setDetectedFormat(parsed.detectedFormat);
    }
  };

  // Sync when sliders or color pickers update
  const updateColorFromRgba = (rgba: RGBA) => {
    setCurrentColor(rgba);
    setUniversalInput(rgbaToHexa(rgba));
    setDetectedFormat(rgba.a < 1 ? "HEXA" : "HEX");
  };

  // Native EyeDropper API (Chromium / Desktop supported)
  const handleEyeDropper = async () => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      try {
        const eyeDropper = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          handleUniversalChange(result.sRGBHex);
          toast.success(`Picked color: ${result.sRGBHex}`);
        }
      } catch {
        // User canceled picker
      }
    } else {
      toast.info("EyeDropper API is not supported on this browser");
    }
  };

  const hexString = rgbaToHex(currentColor);
  const hexaString = rgbaToHexa(currentColor);
  const hsl = rgbaToHsl(currentColor);
  const hsv = rgbaToHsv(currentColor);
  const cmyk = rgbaToCmyk(currentColor);
  const oklch = rgbaToOklch(currentColor);

  const formats = [
    { key: "HEX", val: hexString.toUpperCase() },
    { key: "HEXA", val: hexaString.toUpperCase() },
    { key: "RGB", val: `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})` },
    {
      key: "RGBA",
      val: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a})`,
    },
    { key: "HSL", val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { key: "HSLA", val: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})` },
    { key: "HSV", val: `hsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)` },
    { key: "OKLCH", val: `oklch(${oklch.l} ${oklch.c} ${oklch.h})` },
    { key: "CMYK", val: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  // Harmonies calculations
  const harmonies = [
    { name: "Complementary", rgb: hslToRgb(hsl.h + 180, hsl.s, hsl.l, hsl.a) },
    { name: "Analogous -30°", rgb: hslToRgb(hsl.h - 30, hsl.s, hsl.l, hsl.a) },
    { name: "Analogous +30°", rgb: hslToRgb(hsl.h + 30, hsl.s, hsl.l, hsl.a) },
    { name: "Triadic +120°", rgb: hslToRgb(hsl.h + 120, hsl.s, hsl.l, hsl.a) },
    { name: "Triadic +240°", rgb: hslToRgb(hsl.h + 240, hsl.s, hsl.l, hsl.a) },
  ];

  // WCAG Contrast Diagnostics
  const lum = getRelativeLuminance(currentColor);
  const contrastWhite = getContrastRatio(lum, 1.0);
  const contrastBlack = getContrastRatio(lum, 0.0);

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    toast.success(`Copied ${key}: ${val}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <CompactCardLayout
      toolId="color-converter"
      title="Universal Color Code Converter"
      description="Convert colors across HEX, RGB, HSL, HSV, OKLCH, and CMYK with auto-detection, live sliders, and WCAG contrast check."
      category="image"
      icon="Palette"
      tags={["converter", "viewer"]}
      maxCardWidth="3xl"
      headerActions={
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleUniversalChange("#10B981");
              toast.success("Reset to Emerald #10B981");
            }}
            className="h-8 text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      }
      controls={
        <>
          {/* Universal Paste & Search Bar */}
          <div className="flex flex-col gap-2 p-3 sm:p-4 rounded-xl border border-border/80 bg-muted/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-medium text-foreground flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-500" />
                <span>Input Any Color Format:</span>
              </label>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-mono text-[10px]"
              >
                Detected: {detectedFormat}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Input
                value={universalInput}
                onChange={(e) => handleUniversalChange(e.target.value)}
                placeholder="Paste HEX, RGB, HSL, OKLCH, CMYK, or CSS name (e.g. oklch(0.7 0.15 160) or coral)..."
                className="h-10 font-mono text-xs sm:text-sm bg-background/80"
              />

              {hasEyeDropper && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEyeDropper}
                  className="h-10 px-3 gap-1.5 shrink-0 text-xs font-mono"
                  title="Pick a color from screen"
                >
                  <Pipette className="w-4 h-4 text-emerald-500" />
                  <span className="hidden sm:inline">Eyedropper</span>
                </Button>
              )}
            </div>
          </div>

          {/* Color Preview & Native Palette Picker Stage */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl border border-border/60 bg-muted/10">
            {/* Color Swatch Display */}
            <div className="md:col-span-4 flex flex-col items-center gap-2">
              <div
                className="relative h-28 w-full rounded-xl border border-border/80 shadow-md overflow-hidden flex items-center justify-center"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #27272a 25%, transparent 25%), linear-gradient(-45deg, #27272a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #27272a 75%), linear-gradient(-45deg, transparent 75%, #27272a 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                }}
              >
                <div
                  className="absolute inset-0 transition-colors"
                  style={{
                    backgroundColor: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a})`,
                  }}
                />

                {/* Hidden native HTML color input triggered via custom button */}
                <input
                  type="color"
                  id="native-color-picker"
                  value={hexString}
                  onChange={(e) => handleUniversalChange(e.target.value)}
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  title="Click to open color picker"
                />

                <span className="relative z-10 font-mono text-xs font-bold px-2 py-1 rounded bg-black/60 text-white backdrop-blur-xs shadow-xs pointer-events-none">
                  {hexString.toUpperCase()}
                </span>
              </div>

              <label
                htmlFor="native-color-picker"
                className="cursor-pointer text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" /> Click swatch to open picker
              </label>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="md:col-span-8 flex flex-col gap-2.5">
              {/* Hue Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Hue:</span>
                  <span className="font-bold text-foreground">{hsl.h}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => {
                    const newRgb = hslToRgb(Number(e.target.value), hsl.s, hsl.l, currentColor.a);
                    updateColorFromRgba(newRgb);
                  }}
                  className="w-full h-2 rounded-lg cursor-pointer appearance-none bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500"
                />
              </div>

              {/* Saturation Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Saturation:</span>
                  <span className="font-bold text-foreground">{hsl.s}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => {
                    const newRgb = hslToRgb(hsl.h, Number(e.target.value), hsl.l, currentColor.a);
                    updateColorFromRgba(newRgb);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Lightness Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Lightness:</span>
                  <span className="font-bold text-foreground">{hsl.l}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => {
                    const newRgb = hslToRgb(hsl.h, hsl.s, Number(e.target.value), currentColor.a);
                    updateColorFromRgba(newRgb);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Alpha Opacity Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Alpha (Opacity):</span>
                  <span className="font-bold text-emerald-500">{Math.round(currentColor.a * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={currentColor.a}
                  onChange={(e) => {
                    const newRgb = { ...currentColor, a: parseFloat(e.target.value) };
                    updateColorFromRgba(newRgb);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick Palette Swatches */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-muted-foreground mr-1">Presets:</span>
            {POPULAR_SWATCHES.map((swatch) => (
              <button
                key={swatch.name}
                type="button"
                onClick={() => handleUniversalChange(swatch.hex)}
                className="h-6 px-2 rounded-md text-[10px] font-mono font-medium flex items-center gap-1.5 border border-border/60 hover:scale-105 transition-transform"
                style={{ backgroundColor: `${swatch.hex}20`, color: swatch.hex }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: swatch.hex }} />
                <span>{swatch.name}</span>
              </button>
            ))}
          </div>

          {/* Converted Formats Output Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
            {formats.map((fmt) => (
              <div
                key={fmt.key}
                className="p-3 rounded-lg border border-border/60 bg-muted/10 hover:border-emerald-500/30 transition-all flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">
                    {fmt.key}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleCopy(fmt.val, fmt.key)}
                    className="h-5 w-5 text-muted-foreground hover:text-foreground"
                  >
                    {copiedKey === fmt.key ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <span className="font-mono text-xs text-foreground font-medium truncate select-all">
                  {fmt.val}
                </span>
              </div>
            ))}
          </div>

          {/* Clickable Color Harmonies Preview */}
          <div className="flex flex-col gap-2 p-3 rounded-xl border border-border/60 bg-muted/10">
            <span className="text-xs font-mono font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              Color Harmonies (Click to Apply)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {harmonies.map((h) => {
                const hex = rgbaToHex(h.rgb);
                return (
                  <button
                    key={h.name}
                    type="button"
                    onClick={() => handleUniversalChange(hex)}
                    className="p-2 rounded-lg border border-border/60 bg-muted/20 hover:border-emerald-500/40 hover:scale-[1.02] transition-all flex flex-col items-center gap-1.5 text-center"
                  >
                    <div
                      className="w-full h-8 rounded border border-border/60 shadow-xs"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[10px] font-mono font-medium text-muted-foreground truncate w-full">
                      {h.name}
                    </span>
                    <span className="text-[10px] font-mono text-foreground font-semibold">
                      {hex.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* WCAG Contrast Diagnostics */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col gap-2.5">
            <span className="text-xs font-mono font-semibold text-foreground flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-500" />
              WCAG Accessibility & Contrast
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* White Text Contrast */}
              <div className="p-3 rounded-lg bg-zinc-950 text-white flex items-center justify-between border border-zinc-800">
                <span className="text-xs font-mono font-medium">White Text (#FFF)</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold">{contrastWhite}:1</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${
                      contrastWhite >= 4.5
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                    }`}
                  >
                    {contrastWhite >= 7 ? "AAA Pass" : contrastWhite >= 4.5 ? "AA Pass" : "Fail"}
                  </Badge>
                </div>
              </div>

              {/* Black Text Contrast */}
              <div className="p-3 rounded-lg bg-white text-black flex items-center justify-between border border-zinc-200">
                <span className="text-xs font-mono font-medium">Black Text (#000)</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold">{contrastBlack}:1</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${
                      contrastBlack >= 4.5
                        ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-700 border-rose-500/40"
                    }`}
                  >
                    {contrastBlack >= 7 ? "AAA Pass" : contrastBlack >= 4.5 ? "AA Pass" : "Fail"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      result={<></>}
    />
  );
}