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
* **Left Side:** Logo (Terminal icon + Mono font title `Local.Tools`) + Responsive Categories Navigation Dropdown (`DropdownMenu`).
* **Center / Right Side:** Command Palette Trigger (`⌘K` badge), GitHub Repo Link, and Theme Toggle Switch.

### B. Homepage Layout (Bento Grid System)

* **URL Hash Anchor Two-Way Sync:** Filter pills synchronize bi-directionally with URL fragment identifiers (`/#dev`, `/#favorites`, `/#recent`, `/#all`) via `useSyncExternalStore`.
* **Dense Packing:** Container uses CSS Dense Packing (`grid-flow-dense`) on `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]` to eliminate gaps.

### C. Tool Workspace Page Layout (3 Archetypes)

1. **Archetype 1: Split-Pane Layout (`SplitPaneLayout`)**
   * *Active Tools:* JSON Formatter, Base64 Encoder/Decoder, Hash Generator, Case Converter, Word Counter.
2. **Archetype 2: Focus Canvas + Sidebar (`FocusCanvasLayout`)**
   * *Active Tools:* Image Compressor & Resizer.
3. **Archetype 3: Compact Single Card (`CompactCardLayout`)**
   * *Active Tools:* Secure Password Generator, Universal Color Code Converter.

---

## 5. Micro-Interactions & UX Polish

1. **Instant Feedback Toasts:** Integrated `sonner` notifications for copying, resetting, and favorites.
2. **Keyboard Shortcuts:** Global `Cmd + K` / `Ctrl + K` search palette.
3. **Capabilities Guarding:** Safe client-side feature detection (e.g. `EyeDropper`) via `useSyncExternalStore`.
4. **Hydration Protection:** Standardized `suppressHydrationWarning` flags on root document elements.
