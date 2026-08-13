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

### CSS Imports & Dark Variant Definition

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/* Custom dark mode variant matching the .dark class on <html> */
@custom-variant dark (&:is(.dark *));
```

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

### Color Variables Palette Table (OKLCH)

| Variable | Light Theme (`:root`) | Dark Theme (`.dark`) |
| :--- | :--- | :--- |
| `--background` | `oklch(1 0 0)` (White) | `oklch(0.141 0.005 285.823)` (Dark Zinc) |
| `--foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` |
| `--card` | `oklch(1 0 0)` | `oklch(0.21 0.006 285.885)` |
| `--popover` | `oklch(1 0 0)` | `oklch(0.21 0.006 285.885)` |
| `--primary` | `oklch(0.508 0.118 165.612)` (Emerald) | `oklch(0.432 0.095 166.913)` |
| `--primary-foreground` | `oklch(0.979 0.021 166.113)` | `oklch(0.979 0.021 166.113)` |
| `--secondary` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` |
| `--muted` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` |
| `--muted-foreground` | `oklch(0.552 0.016 285.938)` | `oklch(0.705 0.015 286.067)` |
| `--border` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 15%)` |
| `--ring` | `oklch(0.705 0.015 286.067)` | `oklch(0.552 0.016 285.938)` |
| `--radius` | `0.625rem` (10px) | `0.625rem` (10px) |

---

## 3. 🧩 Component & Data Catalog (`src/components/*`, `src/config/*`, `src/hooks/*`)

### Layout Components (`src/components/layouts/*`)

1. **`ToolShell`** (`@/components/layouts/tool-shell`): Outer layout container providing responsive max-width bounds, padding, and ambient background glow.
2. **`ToolHeader`** (`@/components/layouts/tool-header`): Unified header with breadcrumb navigation, category pastel badges, favorite star toggle (`useFavorites`), and automatic recent tool tracking (`useRecentTools`).
3. **`SplitPaneLayout`** (`@/components/layouts/split-pane-layout`): Archetype 1 wrapper for data transformation and code/text processing tools.
4. **`FocusCanvasLayout`** (`@/components/layouts/focus-canvas-layout`): Archetype 2 wrapper for visual media, canvas editing, and file tools.
5. **`CompactCardLayout`** (`@/components/layouts/compact-card-layout`): Archetype 3 wrapper for generators, calculators, and low-input utilities.

### UI Components (`src/components/ui/*`)

1. **`Button`** (`@/components/ui/button`): Base UI button engine supporting `default`, `outline`, `secondary`, `ghost`, `destructive`, `link` variants and custom sizes (`xs`, `sm`, `icon-xs`, `icon-sm`, etc.).
2. **`Badge`** (`@/components/ui/badge`): Inline badge supporting `default`, `secondary`, `destructive`, `outline` variants.
3. **`Card`** (`@/components/ui/card`): Structural card container with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`.
4. **`Tabs`** (`@/components/ui/tabs`): Tab panel navigation system built on Base UI tabs.
5. **`Textarea`** (`@/components/ui/textarea`): Multi-line form input with auto-height and dark mode styling.
6. **`InputGroup`** (`@/components/ui/input-group`): Flexible input container supporting addons, inline icons, and trigger buttons.
7. **`DropdownMenu`** (`@/components/ui/dropdown-menu`): Menu popover built on `@base-ui/react/menu`.
8. **`Command` & `CommandDialog`** (`@/components/ui/command`): Modal search menu powered by `cmdk`.
9. **`Sonner` Toaster** (`@/components/ui/sonner`): Toast notification system integrated with `next-themes`.

### Configuration & Data Layer (`src/config/*`)

1. **`categories.ts`**: Single source of truth for tool categories, display labels, indicator dots, pill borders, and pastel badge styling (`CATEGORIES_MAP`, `ALL_FILTER_KEYS`, `getCategoryConfig`).
2. **`tools.ts`**: Master tool registry array (`TOOLS`) containing tool metadata, categories, paths, grid span allocations, and tags.
3. **`tags.ts`**: Strongly typed constant array (`KNOWN_TAGS`) restricting allowable tool tags.

### Custom Application Hooks (`src/hooks/*`)

1. **`useFavorites`**: Manages favorite tool IDs with `localStorage` persistence (`local-tools:favorites`) and `sonner` toast alerts.
2. **`useRecentTools`**: Logs recently selected tool timestamps in `localStorage` (`local-tools:recent`).

---

## 4. 🚨 Critical Architectural Rules & Best Practices

- Refer to [UI Best Practices Reference](./UI_BEST_PRACTICES.md) for detailed guidelines on Base UI composition, avoiding `asChild`, React 19 immutability rules, and state synchronization with `useSyncExternalStore`.
