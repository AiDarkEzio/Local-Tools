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

## 3. Color Tokens & Tailwind Classes

We will use the **Tailwind `zinc` palette** paired with an **`emerald` active accent** (signals precision, speed, and standard terminal success states).

### Dark Mode (Default)

* **Page Background:** `bg-zinc-950` (`#09090b`)
* **Card / Panel Surface:** `bg-zinc-900/60` with `backdrop-blur-md`
* **Card Hover State:** `hover:bg-zinc-900/90 hover:border-zinc-700`
* **Borders:** `border-zinc-800` (`#27272a`)
* **Primary Text:** `text-zinc-100`
* **Muted / Secondary Text:** `text-zinc-400`
* **Primary Accent (Buttons/Active):** `bg-emerald-500 text-zinc-950 hover:bg-emerald-400`
* **Subtle Glow Effects:** `shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]`

### Light Mode

* **Page Background:** `bg-zinc-50` (`#fafafa`)
* **Card / Panel Surface:** `bg-white`
* **Borders:** `border-zinc-200` (`#e4e4e7`)
* **Primary Text:** `text-zinc-900`
* **Muted Text:** `text-zinc-500`
* **Primary Accent:** `bg-emerald-600 text-white hover:bg-emerald-700`

---

## 4. Layout Architecture & Key Components

### A. Navigation Bar (Global)

* **Sticky Top:** `sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800`
* **Left Side:** Logo (Minimal icon -> `@/public/logo.svg` + Mono font title) + Category Links (`@/config/tools.ts` -> `ToolCategory`).
* **Center / Right Side:**
  * **Command Palette Button:** A fake search bar that triggers `Cmd + K` on click (e.g., `Search tools...` with a `⌘K` badge).
  * **GitHub Repo Link Button:** Displays star count badge.
  * **Theme Toggle Switch:** Smooth icon transition (Sun/Moon).

### B. Homepage Layout (Bento Grid System)

1. **Hero Section:**
   * Headline: Crisp, high-contrast headline (e.g., *"Fast, private utilities. 100% Client-Side."*).
   * Search Bar: Prominent input field with category filter pills underneath (`All`, `Favorites`, `Recently Used`, ...[`@/config/tools.ts` -> `ToolCategory`]).

2. **Dynamic Bento Grid Occupancy:**
   * Bento Grid slots are calculated **dynamically** from each tool's metadata properties (`featured`, `gridSpan`, and `order`) in `@/config/tools.ts`.
   * **`gridSpan: '2x2'`**: Occupies 2 columns × 2 rows with live visual micro-previews.
   * **`gridSpan: '2x1'`**: Occupies 2 columns × 1 row for medium prominence.
   * **`gridSpan: '1x1'`**: Standard single card occupancy (default).

3. **Tool Card Design:**
   * Outer container: `p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700`
   * Inner content: Small icon in a subtle box, tool title, 1-line description, category badge (`dev`, `text`, etc.), tag badges (`#formatter`, `#validator`), and a **Favorite Star Toggle Button** (`localStorage` persisted).

### C. Tool Workspace Page Layout

Every tool page must adopt one of three standardized responsive layout archetypes built via reusable wrapper components (`@/components/layouts/*`):

1. **Archetype 1: Split-Pane Layout (`SplitPaneLayout`)**
   * **Use Case:** Data transformation & text processing tools (e.g., JSON Formatter, Base64, Text Diff, JWT).
   * **Structure:** Real-time side-by-side comparison using `grid-cols-1 lg:grid-cols-2`. Raw input on the left, live transformed output on the right (auto-stacks vertically on mobile).

2. **Archetype 2: Focus Canvas + Sidebar (`FocusCanvasLayout`)**
   * **Use Case:** Visual editing & media manipulation tools (e.g., Image Compressor, SVG Optimizer, PDF Remover).
   * **Structure:** Asymmetric layout featuring a dominant main stage (~70% width) for preview/canvas and a control sidebar (~30% width) for sliders, formats, and download CTAs.

3. **Archetype 3: Compact Single Card (`CompactCardLayout`)**
   * **Use Case:** Low-input generators & calculators (e.g., UUID Generator, Password Generator, Hash Generator).
   * **Structure:** Centered container (`max-w-2xl mx-auto`) with configuration toggles/sliders on top and a prominent output display box with instant copy actions at the bottom.

* **Deep Dive & Code Specification:** `@/docs/TOOL_LAYOUT_ARCHETYPES.md`

---

## 5. Micro-Interactions & UX Polish

1. **Instant Feedback Toasts:**
   * Integrate `sonner` for toast notifications.
   * Clicking "Copy Output" triggers: `toast.success("Copied to clipboard!", { duration: 2000 })`.
2. **Keyboard Shortcuts:**
   * Global `Cmd + K` / `Ctrl + K` to open the search command palette (using Shadcn `<Command />`).
   * Tool-specific shortcuts (e.g., `Cmd + Enter` to trigger conversion/formatting).
3. **Drag & Drop Zones for Files:**
   * Dotted border active state: `border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 bg-zinc-900/20 hover:bg-emerald-500/5`.
4. **Loading & Processing States:**
   * When processing heavy WebAssembly tasks (like video or image compression), show a sleek progress bar and a pulsing state indicator instead of freezing the UI.

---

### Summary Checklist for Implementation

When setting up your repository, install these core UI packages:

``` bash
# Shadcn UI base components
npx shadcn@latest init --src-dir

# Add required UI components
npx shadcn@latest add button card input badge dialog command dropdown-menu tabs

# Toast notifications
npm install sonner lucide-react
```
