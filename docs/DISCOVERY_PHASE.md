<!-- docs\DISCOVERY_PHASE.md -->

# 📄 Discovery Phase Document: `Local-Tools`

**Project Name:** Local-Tools  
**Project Type:** Open-Source Client-Side Utility Web Application  
**Target Platform:** Web (Desktop & Mobile, Progressive Web App)  
**Author:** @AiDarkEzio  
**Status:** MVP Milestone Achieved (3 Reference Tools Live) / Phase 2 Active Expansion  
**License:** MIT

---

## 1. Executive Summary

### 1.1 Vision

**`Local-Tools`** is a fast, privacy-first, browser-native collection of developer and everyday utility tools. The project operates on a **100% client-side architecture**, meaning zero user data, files, or inputs are ever uploaded to a remote server. All computations—including media processing, PDF generation, text transformation, and code formatting—take place locally within the user's web browser.

### 1.2 Core Objectives

* **Privacy & Security First:** Ensure 0% data transmission to third-party servers.
* **Performance & Speed:** Deliver near-instant load times using Static Site Generation (SSG), lightweight assets, and Web Workers for off-main-thread heavy computations.
* **Modular Engineering:** Build an extensible "Tool Registry" architecture that allows easy, incremental additions of single-purpose utilities over time.
* **Portfolio Showcase:** Serve as an open-source technical showcase demonstrating modern React/Next.js patterns, TypeScript strict typing, state management, WebAssembly (Wasm) integration, and offline-first capabilities.

---

## 2. Target Audience & User Personas

| Persona | Primary Needs | Key Tools Required |
| :--- | :--- | :--- |
| **Software Developers** | Quick, privacy-compliant dev helpers without ads or clutter. | JSON Formatter, Base64 Encoder/Decoder, Hash Generators, Regex Tester, Diff Checker |
| **Content Creators / Designers** | Quick image adjustments without opening heavy software or uploading sensitive files. | Image Resizer/Cropper, SVG to PNG, Color Palette Picker, WEBP Converter |
| **General Web Users** | Quick document or text fixes. | PDF Merger, Case Converter, Word/Character Counter, QR Code Generator |

---

## 3. Technical Architecture & Stack

### 3.1 Technology Matrix

| Layer | Selected Technology | Technical Justification |
| :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | Static export capabilities (`output: 'export'`), file-based routing, SEO routing, and strong TypeScript integration. |
| **Language** | **TypeScript** | Enforces strict type safety, prevents runtime errors, and demonstrates enterprise-level code quality. |
| **Styling** | **Tailwind CSS v4** | Utility-first styling for high productivity, minimal bundle size, OKLCH colors, and native dark mode support. |
| **Component System** | **Shadcn UI + Base UI** | Accessible, custom-styled UI primitives built directly into the repository without vendor lock-in. |
| **Icons** | **Lucide React** | Lightweight, consistent vector icon library. |
| **Concurrency** | **Web Workers & Canvas APIs** | Offloads heavy CPU-bound operations off the main UI thread. |
| **Hosting & CI/CD** | **GitHub Pages / GitHub Actions** | Automated build checks, static export pipeline, zero hosting cost. |

### 3.2 High-Level Architecture Diagram

```text
[ Browser / Client ]
       │
       ├──► Next.js Static Bundle (HTML / CSS / TSX)
       │
       ├──► Central Category Registry (config/categories.ts)
       │       └── Pastel Color Tokens, Dot Indicators & Filter Maps
       │
       ├──► Central Tool Registry (config/tools.ts)
       │
       ├──► Standard Layout Archetypes (components/layouts/*)
       │       ├── tool-shell.tsx & tool-header.tsx
       │       ├── split-pane-layout.tsx (Transformation Tools)
       │       ├── focus-canvas-layout.tsx (Media & Canvas Tools)
       │       └── compact-card-layout.tsx (Generators & Calculators)
       │
       ├──► Local Tool Components (Client Execution Only)
       │       ├── JSON Formatter & Validator (Native JSON & Blob APIs)
       │       ├── Image Compressor & Resizer (HTML5 Canvas & toBlob)
       │       └── Secure Password Generator (Web Cryptography API)
       │
       └──► LocalStorage & URL State Sync (Zero Server Persistence)
               ├── Favorites Array (`local-tools:favorites`)
               ├── Recent Tools Timestamp Log (`local-tools:recent`)
               └── URL Hash Sync (`useSyncExternalStore` + `pushState`)
```

---

## 4. System Architecture & Extensibility Design

To keep the application maintainable as new tools are added, `Local-Tools` uses a **Centralized Registry Pattern**.

### 4.1 Project Directory Structure

```text
Local-Tools/
├── .github/                  # CI/CD workflows (GitHub Actions)
├── docs/                     # Architecture & Discovery docs
│   ├── BASECN.md
│   ├── DESIGN_SYSTEM_SPEC.md
│   ├── DISCOVERY_PHASE.md
│   ├── PROJECT_UI_SYSTEM.md
│   ├── TOOL_LAYOUT_ARCHETYPES.md
│   └── UI_BEST_PRACTICES.md
├── src/
│   ├── app/                  # Next.js App Router (SSG Pages)
│   │   ├── (app)/
│   │   │   ├── layout.tsx    # App Shell (Navbar, Footer)
│   │   │   ├── page.tsx      # Bento Grid Dashboard & Search
│   │   │   └── tools/
│   │   │       ├── json-formatter/page.tsx      # Archetype 1 Reference Tool
│   │   │       ├── image-compressor/page.tsx    # Archetype 2 Reference Tool
│   │   │       └── password-generator/page.tsx  # Archetype 3 Reference Tool
│   │   ├── layout.tsx        # Root Providers & Fonts
│   │   ├── globals.css       # Global Tailwind v4 OKLCH theme styles
│   │   └── not-found.tsx     # 404 Error Stage
│   ├── components/
│   │   ├── home/             # Homepage components (tool-card.tsx)
│   │   ├── icons/            # Brand & Tool SVG components (logo-icon.tsx, tool-icon.tsx, github-icon.tsx)
│   │   ├── layouts/          # Standard tool page archetypes (tool-shell, tool-header, split-pane-layout, focus-canvas-layout, compact-card-layout)
│   │   ├── navigation/       # Navigation components (navbar.tsx, command-menu.tsx)
│   │   ├── theme-provider.tsx# Next-themes dark/light mode wrapper
│   │   └── ui/               # Base UI / Shadcn primitives (badge, button, card, command, dialog, dropdown-menu, input, input-group, sonner, tabs, textarea)
│   ├── config/
│   │   ├── categories.ts     # Centralized category config, labels & pastel theme tokens
│   │   ├── tags.ts           # Strictly-typed ToolTag array
│   │   └── tools.ts          # Metadata registry for all tools
│   ├── hooks/                # LocalStorage & Client state hooks
│   │   ├── use-favorites.ts  # Persisted favorites toggle state
│   │   └── use-recent-tools.ts# Persisted recent usage timestamp log
│   ├── lib/                  # Shared helper functions (utils.ts)
│   └── types/                # Storage & Data contracts (storage.ts)
├── public/                   # Static assets & PWA manifest
├── next.config.ts            # Configured for static export (output: 'export')
└── tsconfig.json
```

---

## 5. Incremental Tool Roadmap

### Phase 1: Core Foundation & Framework Setup `[COMPLETED]`

* [x] Set up Next.js (App Router), TypeScript, Tailwind CSS v4, and Base UI / Shadcn UI primitives.
* [x] Build global shell, navigation bar, search bar (Command-K modal), theme toggle, and URL-hash tab state synchronization.
* [x] Implement centralized category system (`categories.ts`) with pastel color identity.
* [x] Implement 3 standardized tool page layout archetypes (`components/layouts/*`).
* [x] Configure static site export (`output: 'export'`) and GitHub Actions Pages workflow.

### Phase 2: Lightweight Text & Developer Utilities `[IN PROGRESS]`

* [x] **JSON Formatter & Validator:** Prettify, minify, validate syntax, sort object keys, upload/download JSON. *(Archetype 1 Reference Tool)*
* [x] **Secure Password Generator:** Cryptographically secure passwords with entropy score & character controls. *(Archetype 3 Reference Tool)*
* [ ] **Base64 Encoder / Decoder:** Text and file-to-Base64 conversion.
* [ ] **Hash Generator:** Client-side MD5, SHA-1, SHA-256 generation using `crypto.subtle`.
* [ ] **Word & Character Counter:** Real-time text analytics.

### Phase 3: Canvas & Media Processing `[IN PROGRESS]`

* [x] **Image Compressor & Resizer:** Debounced HTML5 Canvas re-encoding, WEBP/JPEG/PNG format conversion, aspect-ratio locked resizing, and live savings metrics. *(Archetype 2 Reference Tool)*
* [ ] **SVG to PNG Converter:** Client-side vector rasterization.
* [ ] **Color Picker & Palette Generator:** Canvas image color extractor.

### Phase 4: Advanced Utilities & Heavy Workers `[PLANNED]`

* [ ] **PDF Merge / Split:** Powered by `pdf-lib` (client-side PDF binary manipulation).
* [ ] **Text Diff Checker:** Inline comparison of text strings.
* [ ] **PWA Implementation:** Enable offline caching via Service Workers.

---

## 6. Key Technical Benchmarks & Engineering Highlights

1. **Strict Zero-Server Data Flow:** Verification that no `fetch` or `XHR` calls send user input payload out of the browser.
2. **Debounced Canvas Execution:** Heavy image re-encoding tasks are debounced (~200ms) with in-memory image caching to maintain 60 FPS UI performance.
3. **Web Cryptography API:** Native `window.crypto.getRandomValues` ensures true cryptographic randomness for security tools.
4. **Deep-Link URL & State Synchronization:** Category filters sync bi-directionally with URL hash anchors (`useSyncExternalStore` + `history.pushState`).

---

## 7. Risk Assessment & Mitigations

| Identified Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Large Bundle Sizes:** Heavy libraries slowing down initial loads. | High | Use dynamic imports (`next/dynamic`) and native browser APIs wherever possible. |
| **Canvas Slider Thrashing:** Un-debounced image re-encoding causing UI freeze or memory thrashing. | Medium | Cache decoded `HTMLImageElement` in memory and debounce `canvas.toBlob` execution by 200ms with cancellation flags. |
| **Browser Memory Limits:** Heavy image processing freezing the UI tab. | Medium | Revoke previous Object URLs immediately upon generating new blobs (`URL.revokeObjectURL`). |

---

## 8. Definition of Done (MVP Milestone) `[ACHIEVED]`

* [x] Core project architecture and UI design system are established.
* [x] Reusable tool layout archetypes (`SplitPaneLayout`, `FocusCanvasLayout`, `CompactCardLayout`) are built and integrated.
* [x] At least **3 functional client-side tools** are implemented (JSON Formatter, Image Compressor, Password Generator).
* [x] Universal Command-K search works across all registered tools.
* [x] Static export passes without build errors and is deployed live via GitHub Pages.
* [x] GitHub repository contains clear documentation, setup instructions, and open-source contribution guidelines.
