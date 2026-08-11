<!-- docs\DESIGN_SYSTEM_SPEC.md -->

# 🎨 Design System Spec: Modern Developer Utility Suite

## 1. Core Visual Identity

* **Style Name:** Modern Developer Minimalist (Vercel/Linear Aesthetic) with Bento Grid Discovery.
* **Theme Mode:** Dual Theme (Dark Mode Default + Crisp Light Mode toggle).
* **Vibe:** Precision engineering, ultra-fast, clean, dark-mode native, zero clutter.

---

## 2. Typography & Fonts

| Type | Font Family | Usage |
| :--- | :--- | :--- |
| **Primary Sans** | `Geist Sans` or `Inter` | UI text, headers, navigation, labels |
| **Monospace** | `Geist Mono` or `JetBrains Mono` | Code blocks, tool inputs/outputs, hex codes, statistics |

---

## 3. Color Tokens & Pastel Category Identity System

We use the **Tailwind `zinc` palette** for foundational backgrounds and surfaces, paired with a **Pastel Color Identity System** defined in `@/config/categories.ts` for visual category differentiation across light and dark themes.

### Base Dark Mode (Default)

* **Page Background:** `bg-zinc-950` (`#09090b`)
* **Card / Panel Surface:** `bg-zinc-900/60` with `backdrop-blur-md`
* **Card Hover State:** `hover:bg-zinc-900/90 hover:border-zinc-700`
* **Borders:** `border-zinc-800` (`#27272a`)
* **Primary Text:** `text-zinc-100`
* **Muted / Secondary Text:** `text-zinc-400`
* **Primary Accent (Buttons/Active):** `bg-emerald-500 text-zinc-950 hover:bg-emerald-400`
* **Subtle Glow Effects:** `shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]`

### Base Light Mode

* **Page Background:** `bg-zinc-50` (`#fafafa`)
* **Card / Panel Surface:** `bg-white`
* **Borders:** `border-zinc-200` (`#e4e4e7`)
* **Primary Text:** `text-zinc-900`
* **Muted Text:** `text-zinc-500`
* **Primary Accent:** `bg-emerald-600 text-white hover:bg-emerald-700`

### Pastel Category Theme Tokens (`src/config/categories.ts`)

Each category uses low-opacity background tints (`/10`), matching borders (`/20` to `/40`), and high-contrast text to ensure WCAG readability in both themes:

| Category Key | Accent Family | Dot Indicator | Pill Border | Badge Style (`badgeBg` + `badgeText` + `badgeBorder`) |
| :--- | :--- | :--- | :--- | :--- |
| `all` | Emerald | `bg-emerald-500` | `border-emerald-500/30` | `bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20` |
| `favorites` | Amber | `bg-amber-400` | `border-amber-500/40` | `bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20` |
| `recent` | Sky | `bg-sky-400` | `border-sky-500/40` | `bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20` |
| `dev` | Emerald | `bg-emerald-400` | `border-emerald-400/40` | `bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20` |
| `text` | Violet | `bg-violet-400` | `border-violet-400/40` | `bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20` |
| `image` | Rose | `bg-rose-400` | `border-rose-400/40` | `bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20` |
| `video-audio` | Orange | `bg-orange-400` | `border-orange-400/40` | `bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20` |
| `document` | Indigo | `bg-indigo-400` | `border-indigo-400/40` | `bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20` |
| `security` | Red | `bg-red-400` | `border-red-400/40` | `bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20` |
| `math-finance` | Teal | `bg-teal-400` | `border-teal-400/40` | `bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20` |
| `time` | Lime | `bg-lime-400` | `border-lime-400/40` | `bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20` |
| `generators` | Fuchsia | `bg-fuchsia-400` | `border-fuchsia-400/40` | `bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20` |
| `unit-converter` | Blue | `bg-blue-400` | `border-blue-400/40` | `bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20` |
| `games-edu` | Cyan | `bg-cyan-400` | `border-cyan-400/40` | `bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20` |

---

## 4. Layout Architecture & Key Components

### A. Navigation Bar (Global)

* **Sticky Top:** `sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/80`
* **Left Side:** Logo (Terminal icon + Mono font title `Local.Tools`) + Responsive Categories Navigation Dropdown (`DropdownMenu` with adaptive label `hidden sm:inline`).
  * **Conditional Visibility:** Conditionally rendered on subpages (`!isHomePage` / `pathname !== "/"`) and hidden on the home page to avoid visual redundancy.
  * **Centralized Category Menu:** Consumes `ALL_FILTER_KEYS` and `CATEGORIES_MAP` directly from `@/config/categories.ts`. Each category item displays a visual indicator dot (`<dot> <category>`).
* **Center / Right Side:**
  * **Command Palette Button:** Collapses into a square icon button (`w-8`) on mobile (<640px) and expands into a full search trigger input (`sm:w-48 md:w-56`) with a `⌘K` badge on desktop.
  * **GitHub Repo Link Button:** Displays GitHub icon (`size="icon-sm"`).
  * **Theme Toggle Switch:** Smooth icon transition (Sun/Moon) with `useSyncExternalStore` SSR hydration protection.

### B. Homepage Layout (Bento Grid System)

1. **Hero Section:**
   * Headline: Crisp, high-contrast headline (*"Fast, private utilities. Zero Server Uploads."*).
   * Search Bar: Prominent input field with category filter pills underneath (`ALL_FILTER_KEYS` from `@/config/categories.ts`).
   * **Pastel Filter Pills & Dots:** Inactive pills render custom category borders (`cat.pillBorder`) and indicator dots (`cat.dotColor`). Active pills render category accent backgrounds (`cat.pillActiveBg`).
   * **URL Hash Anchor Two-Way Sync:** Filter pills synchronize bi-directionally with URL fragment identifiers (`/#dev`, `/#favorites`, `/#recent`, `/#all`). Tab switches update URL state using `window.history.pushState(null, "", newUrl)` and dispatch `hashchange` events.
   * **Invalid Hash Error Handling:** Unrecognized hash anchors trigger a `sonner` toast error notification, clean the address bar, and gracefully fall back to showing all tools.

2. **Dynamic Bento Grid Occupancy & Dense Packing:**
   * Bento Grid slots are calculated **dynamically** from each tool's metadata properties (`featured`, `gridSpan`, and `order`) in `@/config/tools.ts`.
   * Container uses **CSS Dense Packing** (`grid-flow-dense` / `grid-auto-flow: dense`) on `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]` to automatically backfill empty grid gaps when large spans wrap.
   * **`gridSpan: '2x2'`**: Occupies 2 columns × 2 rows (`sm:col-span-2 sm:row-span-2`).
   * **`gridSpan: '2x1'`**: Occupies 2 columns × 1 row (`sm:col-span-2 sm:row-span-1`).
   * **`gridSpan: '1x2'`**: Occupies 1 column × 2 rows (`sm:col-span-1 sm:row-span-2`).
   * **`gridSpan: '1x1'`**: Standard single card occupancy (`col-span-1 row-span-1`).

3. **Tool Card Design:**
   * Outer container: `p-5 rounded-xl bg-card/60 border border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]`
   * Inner content: Tool icon in an emerald-tinted container, title, 2-line description, tag badges (`#formatter`, `#validator`), a **Favorite Star Toggle Button**, and a **Category Badge** styled with pastel theme tokens (`catConfig.badgeBg`, `catConfig.badgeText`, `catConfig.badgeBorder`).

### C. Tool Workspace Page Layout

Every tool page adopts one of three standardized responsive layout archetypes built via reusable wrapper components (`@/components/layouts/*`):

1. **Archetype 1: Split-Pane Layout (`SplitPaneLayout`)**
   * **Use Case:** Data transformation & text processing tools (e.g., JSON Formatter, Base64, Text Diff, JWT).
   * **Structure:** Real-time side-by-side comparison using `grid-cols-1 lg:grid-cols-2`. Raw input on left, transformed output on right.

2. **Archetype 2: Focus Canvas + Sidebar (`FocusCanvasLayout`)**
   * **Use Case:** Visual editing & media manipulation tools (e.g., Image Compressor, SVG Optimizer, PDF Merger).
   * **Structure:** Asymmetric layout featuring a dominant main stage (~70% width) for preview/canvas and a control sidebar (~30% width) for options and actions.

3. **Archetype 3: Compact Single Card (`CompactCardLayout`)**
   * **Use Case:** Low-input generators & calculators (e.g., UUID Generator, Password Generator, Hash Generator).
   * **Structure:** Centered container (`max-w-2xl mx-auto`) with configuration toggles/sliders on top and an output display box with copy actions at the bottom.

* **Deep Dive & Code Specification:** `@/docs/TOOL_LAYOUT_ARCHETYPES.md`

### D. Footer Component (Global)

* **Outer Container:** `w-full border-t border-border/60 bg-muted/20 py-6 text-xs text-muted-foreground`
* **Layout Structure:** `flex flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6`
* **Left Branding Block:** Flex-wrapping container keeping icon and title grouped while allowing the tagline to wrap gracefully on mobile viewports (<640px).
* **Right Meta Links:** Monospace text links (`Zero Server Requests • MIT License`) centered on mobile screens and right-aligned on desktop.

---

## 5. Micro-Interactions & UX Polish

1. **Instant Feedback Toasts:**
   * Integrated `sonner` for toast notifications.
   * Action feedback (copying, favoriting, invalid route alerts) displays a sleek notification toast.
2. **Keyboard Shortcuts:**
   * Global `Cmd + K` / `Ctrl + K` to open the search command palette (using Shadcn `<Command />`).
   * Tool-specific shortcuts (e.g., `Cmd + Enter` to trigger conversion/formatting).
3. **Drag & Drop Zones for Files:**
   * Dotted border active state: `border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 bg-zinc-900/20 hover:bg-emerald-500/5`.
4. **Loading & Processing States:**
   * Show a sleek progress bar and a pulsing state indicator during WebAssembly processing.
