<!-- docs\PROJECT_UI_SYSTEM.md -->

# 🎨 UI Architecture & Design System Reference

This document serves as the single source of truth for the project's UI design system, Shadcn UI setup, Base UI integration rules, global CSS theme variables, and component implementation guidelines.

---

## 1. ⚙️ Tech Stack & Engine Configuration

| Layer | Library / Engine | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Server Components, Client Components (`"use client"`) |
| **UI Primitives Engine** | Base UI (`@base-ui/react`) | Component underlying engine (Replaces Radix UI) |
| **Styling Engine** | Tailwind CSS v4 | Native `@import "tailwindcss";`, OKLCH color support |
| **Variant Manager** | `class-variance-authority` (cva) | Type-safe variant generation |
| **Class Merger** | `clsx` + `tailwind-merge` | Handled via `cn()` utility (`@/lib/utils`) |
| **Command Palette** | `cmdk` | Accessible command menu engine |
| **Icon Library** | `lucide-react` | Standard vector icon set |
| **Theme Manager** | `next-themes` | Class-based dark/light mode toggle (`.dark` class on `<html>`) |
| **Toasts** | `sonner` | Toast notification system (`<Toaster />` from `@/components/ui/sonner`) |

---

## 2. 🎨 Global CSS & Theme Tokens (`globals.css`)

The project uses **Tailwind CSS v4** with **OKLCH color space** variables for high-perceptual accuracy dark and light themes.

### Inline Theme Mapping (`@theme inline`)

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Charts */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Sidebar */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Calculated Border Radii */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}
```

---

## 3. 🧩 Component & Data Catalog

### Layout Components (`src/components/layouts/*`)

1. **`ToolShell`** (`@/components/layouts/tool-shell`): Outer layout container providing responsive max-width bounds, padding, and ambient background glow.
2. **`ToolHeader`** (`@/components/layouts/tool-header`): Unified header with breadcrumb navigation, category pastel badges, favorite star toggle (`useFavorites`), and automatic recent tool tracking (`useRecentTools`).
3. **`SplitPaneLayout`** (`@/components/layouts/split-pane-layout`): Archetype 1 wrapper for data transformation, hash computation, and text processing tools.
4. **`FocusCanvasLayout`** (`@/components/layouts/focus-canvas-layout`): Archetype 2 wrapper for visual media, canvas editing, and file tools.
5. **`CompactCardLayout`** (`@/components/layouts/compact-card-layout`): Archetype 3 wrapper for generators, calculators, and color code utilities.

### Active Tools Live Directory (`src/app/(app)/tools/*`)

1. **`json-formatter/page.tsx`** — JSON Formatter, Syntax Validator & Minifier *(SplitPaneLayout)*
2. **`base64-encoder/page.tsx`** — UTF-8 Base64 Text & File Encoder/Decoder *(SplitPaneLayout)*
3. **`hash-generator/page.tsx`** — Web Crypto SHA & MD5 Checksum Generator *(SplitPaneLayout)*
4. **`case-converter/page.tsx`** — Multi-Format Text Case Converter *(SplitPaneLayout)*
5. **`word-counter/page.tsx`** — Typographic Word, Character & Readability Analyzer *(SplitPaneLayout)*
6. **`image-compressor/page.tsx`** — Canvas Image Compressor, Resizer & Converter *(FocusCanvasLayout)*
7. **`password-generator/page.tsx`** — CSPRNG Cryptographically Secure Password Generator *(CompactCardLayout)*
8. **`color-converter/page.tsx`** — Universal Color Code Converter (HEX, RGB, HSL, OKLCH, CMYK) *(CompactCardLayout)*

---

## 4. 🚨 Critical Architectural Rules

Refer to [UI Best Practices Reference](./UI_BEST_PRACTICES.md) for detailed guidelines on Base UI composition, avoiding `asChild`, React 19 immutability rules, capability detection via `useSyncExternalStore`, and `suppressHydrationWarning` usage.
