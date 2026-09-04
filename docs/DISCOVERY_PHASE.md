<!-- docs\DISCOVERY_PHASE.md -->

# 📄 Discovery Phase Document: `Local-Tools`

**Project Name:** Local-Tools  
**Project Type:** Open-Source Client-Side Utility Web Application  
**Target Platform:** Web (Desktop & Mobile, Progressive Web App)  
**Author:** @AiDarkEzio  
**Status:** Phase 2 Milestone Achieved (8 Tools Live) / Phase 3 Preparation  
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
| **Software Developers** | Quick, privacy-compliant dev helpers without ads or clutter. | JSON Formatter, Base64 Encoder/Decoder, Hash Generators, Regex Tester, Diff Checker, Color Converter |
| **Content Creators / Designers** | Quick image adjustments without opening heavy software or uploading sensitive files. | Image Resizer/Cropper, SVG to PNG, Color Converter, Color Palette Picker, WEBP Converter |
| **General Web Users** | Quick document or text fixes. | PDF Merger, Case Converter, Word/Character Counter, Password Generator, QR Code Generator |

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
       │       ├── JSON Formatter & Validator (JSON.parse / JSON.stringify)
       │       ├── Base64 Encoder / Decoder (btoa / atob / TextEncoder / TextDecoder)
       │       ├── SHA & MD5 Hash Generator (Web Cryptography API / RFC 1321)
       │       ├── Text Case Converter (Word Boundary Tokenizer & RegEx)
       │       ├── Word & Text Analyzer (Typographic & Density Engine)
       │       ├── Image Compressor & Resizer (HTML5 Canvas & toBlob)
       │       ├── Secure Password Generator (Web Cryptography API CSPRNG)
       │       └── Universal Color Code Converter (OKLCH / sRGB Math & EyeDropper API)
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
│   │   │       ├── json-formatter/page.tsx      # Archetype 1 (Dev)
│   │   │       ├── base64-encoder/page.tsx      # Archetype 1 (Dev)
│   │   │       ├── hash-generator/page.tsx      # Archetype 1 (Security)
│   │   │       ├── case-converter/page.tsx      # Archetype 1 (Text)
│   │   │       ├── word-counter/page.tsx        # Archetype 1 (Text)
│   │   │       ├── image-compressor/page.tsx    # Archetype 2 (Image)
│   │   │       ├── password-generator/page.tsx  # Archetype 3 (Security)
│   │   │       └── color-converter/page.tsx     # Archetype 3 (Image/Dev)
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
│   │   ├── tools.json        # Extended planned tool inventory
│   │   └── tools.ts          # Master tool registry array
│   ├── hooks/                # LocalStorage & Client state hooks
│   │   ├── use-favorites.ts  # Persisted favorites toggle state
│   │   └── use-recent-tools.ts# Persisted recent usage timestamp log
│   ├── lib/                  # Shared helper functions (utils.ts)
│   └── types/                # Storage & Data contracts (storage.ts)
├── public/                   # Static assets & icons
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

### Phase 2: Lightweight Text & Developer Utilities `[COMPLETED]`

* [x] **JSON Formatter & Validator:** Prettify, minify, validate syntax, sort object keys, upload/download JSON. *(Archetype 1)*
* [x] **Secure Password Generator:** Cryptographically secure passwords with entropy score & character controls. *(Archetype 3)*
* [x] **Base64 Encoder / Decoder:** UTF-8 Unicode text and binary file-to-Base64 conversion with URL-safe options. *(Archetype 1)*
* [x] **Cryptographic Hash Generator:** Client-side MD5, SHA-1, SHA-256, SHA-384, SHA-512 generation and checksum comparison. *(Archetype 1)*
* [x] **Text Case Converter:** 10 case convention transformations (camelCase, snake_case, PascalCase, kebab-case, CONSTANT_CASE). *(Archetype 1)*
* [x] **Word & Text Analyzer:** Real-time word, character, sentence, line, reading time, and keyword density analytics. *(Archetype 1)*
* [x] **Universal Color Code Converter:** Multi-format conversion (HEX, RGB, HSL, HSV, OKLCH, CMYK, CSS Names), WCAG contrast diagnostics, and EyeDropper. *(Archetype 3)*

### Phase 3: Canvas & Media Processing `[IN PROGRESS]`

* [x] **Image Compressor & Resizer:** Debounced HTML5 Canvas re-encoding, WEBP/JPEG/PNG format conversion, aspect-ratio locked resizing, and live savings metrics. *(Archetype 2)*
* [ ] **SVG to PNG Converter:** Client-side vector rasterization and format exporting.
* [ ] **Color Palette Extractor:** Image dominant color extraction using canvas pixel analysis.

### Phase 4: Advanced Utilities & Platform Infrastructure `[PLANNED]`

* [ ] **PDF Merge / Split / Extractor:** Powered by `pdf-lib` (pure client-side PDF binary manipulation).
* [ ] **Text Diff Checker:** Side-by-side and inline line-by-line diff comparison.
* [ ] **Progressive Web App (PWA) Implementation:** Offline asset caching via Service Workers and standalone install manifest.

---

## 6. Key Technical Benchmarks & Engineering Highlights

1. **Strict Zero-Server Data Flow:** Verification that no `fetch` or `XHR` calls transmit user inputs, files, or generated keys out of the browser.
2. **Debounced Canvas Execution:** Heavy image re-encoding tasks are debounced (~200ms) with in-memory image caching to maintain 60 FPS UI performance.
3. **Web Cryptography API:** Native `window.crypto.getRandomValues` and `window.crypto.subtle.digest` ensure cryptographic speed and true randomness.
4. **Universal Color Engine:** Bi-directional mathematical conversion across sRGB, HSL, HSV, CMYK, and native Tailwind v4 OKLCH color spaces.
5. **Deep-Link URL & External Store Synchronization:** Category filters and browser capabilities sync seamlessly without SSR hydration mismatches using `useSyncExternalStore`.

---

## 7. Risk Assessment & Mitigations

| Identified Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Large Bundle Sizes:** Heavy libraries slowing down initial loads. | High | Use dynamic imports (`next/dynamic`) and native browser APIs wherever possible. |
| **Canvas Slider Thrashing:** Un-debounced image re-encoding causing UI freeze or memory thrashing. | Medium | Cache decoded `HTMLImageElement` in memory and debounce `canvas.toBlob` execution by 200ms with cancellation flags. |
| **Browser Memory Limits:** Heavy image processing freezing the UI tab. | Medium | Revoke previous Object URLs immediately upon generating new blobs (`URL.revokeObjectURL`). |
| **Hydration Mismatches:** Client-only APIs like `EyeDropper` throwing SSR errors. | Low | Wrap capability queries in `useSyncExternalStore` with server snapshots returning `false`. |

---

## 8. Definition of Done `[UPDATED]`

* [x] Core project architecture, design tokens, and UI layout archetypes established.
* [x] **8 functional client-side tools** implemented and tested across multiple viewports and themes.
* [x] Universal Command-K search and filter pills work across all registered tools.
* [x] Static export passes without errors (`npm run build`) and deploys live via GitHub Pages.
* [x] Documentation fully up to date with exact architectural guidelines and layout references.
