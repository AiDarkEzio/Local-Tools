# 📄 Discovery Phase Document: `Local-Tools`

**Project Name:** Local-Tools  
**Project Type:** Open-Source Client-Side Utility Web Application  
**Target Platform:** Web (Desktop & Mobile, Progressive Web App)  
**Author:** @AiDarkEzio
**Status:** Discovery & Architecture Planning Phase  
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
| **Styling** | **Tailwind CSS** | Utility-first styling for high productivity, minimal bundle size, and native dark mode support. |
| **Component System** | **Shadcn UI + Radix** | Accessible, custom-styled UI primitives built directly into the repository without vendor lock-in. |
| **Icons** | **Lucide React** | Lightweight, consistent vector icon library. |
| **Concurrency** | **Web Workers & Comlink** | Offloads heavy JS/Wasm CPU-bound operations (FFmpeg, canvas manipulation) off the main UI thread. |
| **Hosting & CI/CD** | **Vercel / GitHub Pages** | Automated preview deployments per Pull Request, automated build checks, zero hosting cost. |

### 3.2 High-Level Architecture Diagram

```text
### 3.2 High-Level Architecture Diagram

```text
[ Browser / Client ]
       │
       ├──► Next.js Static Bundle (HTML / CSS / TSX)
       │
       ├──► Central Tool Registry (config/tools.ts)
       │
       ├──► Local Tool Components (Client Execution Only)
       │       ├── Standard JS/Canvas Tools (Synchronous UI Thread)
       │       └── Heavy Tools (Web Workers / WebAssembly)
       │
       └──► LocalStorage State Sync (Zero Server Persistence)
               ├── Favorites Array (`local-tools:favorites`)
               ├── Recent Tools Timestamp Log (`local-tools:recent`)
               └── URL Param Sync for Deep-linking
```

---

## 4. System Architecture & Extensibility Design

To keep the application maintainable as new tools are added, `Local-Tools` uses a **Centralized Registry Pattern**.

### 4.1 Project Directory Structure

```text
Local-Tools/
├── .github/                  # CI/CD workflows (GitHub Actions)
├── docs/                     # Architecture & Discovery docs
│   └── DISCOVERY_PHASE.md
├── src/
│   ├── app/                  # Next.js App Router (SSG Pages)
│   │   ├── layout.tsx        # Global Layout (Navbar, Sidebar, Command Palette)
│   │   ├── page.tsx          # Homepage Dashboard with Tool Search
│   │   └── tools/            # Individual Tool Page Routes
│   ├── components/
│   │   ├── layouts/          # Shared Navigation, Search Header, Tool Layout Wrappers, Footer
│   │   ├── ui/               # Shadcn components (Button, Card, Input)
│   │   └── tools/            # Concrete tool UI implementations
│   ├── config/
│   │   ├── tools.ts          # Metadata registry for all tools
│   │   └── tags.ts
│   ├── lib/                  # Shared helper functions
│   └── workers/              # Dedicated Web Workers for heavy tasks
├── public/                   # Static assets & PWA manifest
├── next.config.mjs           # Configured for static export (and basePath if deploying to GitHub Pages)
└── tsconfig.json
```

### 4.2 Central Tool Registry Contract (`src/config/tools.ts`)

Every tool added to `Local-Tools` must fulfill the strongly-typed contract including grid occupancy metadata for dynamic layout rendering:

```typescript
export type GridSpan = '1x1' | '2x1' | '1x2' | '2x2';

export interface Tool {
  id: string;          // Unique identifier (e.g., 'json-formatter')
  name: string;        // Display title
  description: string; // Short SEO summary
  category: ToolCategory;
  path: string;        // Route path (e.g., '/tools/json-formatter')
  icon: string;        // Lucide icon identifier
  tags: ToolTag[];     // Strongly-typed tags from KNOWN_TAGS in @/config/tags
  
  // Feature & Grid Metadata
  isNew?: boolean;     // Optional visual badge indicator
  featured?: boolean;  // Displayed in Featured Bento section
  gridSpan?: GridSpan; // Occupancy footprint in Bento Grid ('1x1', '2x1', '1x2', '2x2')
  order?: number;      // Optional numeric priority sorting
}
```

---

## 5. Incremental Tool Roadmap

The application will be developed iteratively in phases:

### Phase 1: Core Foundation & Framework Setup

* Set up Next.js (App Router), TypeScript, Tailwind CSS, and Shadcn UI.
* Build the global layout, search bar (Command-K modal), and dark mode toggle.
* Configure static site export (`output: 'export'`) and Vercel GitHub integration.

### Phase 2: Lightweight Text & Developer Utilities (Fast Wins)

* **JSON Formatter & Validator:** Prettify, minify, and validate JSON strings.
* **Base64 Encoder / Decoder:** Text and file-to-Base64 conversion.
* **Hash Generator:** Client-side MD5, SHA-1, SHA-256 generation using `crypto.subtle`.
* **Word & Character Counter:** Real-time text analytics.

### Phase 3: Canvas & Media Processing (Browser Native)

* **Image Resizer & Cropper:** Uses HTML5 Canvas API to modify image dimensions locally.
* **SVG to PNG Converter:** Client-side vector rasterization.
* **Color Picker & Palette Generator:** Canvas image color extractor.

### Phase 4: Advanced Utilities & Heavy Workers

* **PDF Merge / Split:** Powered by `pdf-lib` (client-side PDF binary manipulation).
* **Text Diff Checker:** Inline comparison of text strings.
* **PWA Implementation:** Enable offline caching via Service Workers.

---

## 6. Key Technical Benchmarks & Engineering Highlights

To maximize the project's impact as a developer portfolio, the following technical capabilities will be implemented:

1. **Strict Zero-Server Data Flow:** Verification that no `fetch` or `XHR` calls send user input payload out of the browser.
2. **Web Worker Task Delegation:** Heavy image conversions and diff algorithms run in web workers to preserve 60 FPS UI responsiveness.
3. **Deep-Link URL State Synchronization:** Tool states (e.g., selected settings) sync with URL search params so users can bookmark tool states easily.
4. **Offline Capability (PWA):** Service worker caching enables full functionality without an active internet connection.

---

## 7. Risk Assessment & Mitigations

| Identified Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Large Bundle Sizes:** Heavy libraries (e.g., PDF parsers, WASM modules) slowing down initial page loads. | High | Use dynamic imports (`next/dynamic`) so each tool page only loads its specific JavaScript bundle on demand. |
| **Browser Memory Limits:** Heavy image processing freezing the UI tab. | Medium | Offload execution to Web Workers and set maximum file upload warnings for client processing. |
| **SEO for Static Routes:** Dynamic metadata issues in pure client build. | Low | Utilize Next.js `generateMetadata()` at build time for static routes to guarantee valid OpenGraph previews. |

---

## 8. Definition of Done (MVP Milestone)

The initial MVP will be considered complete when:

1. Core project architecture and UI design system are established.
2. At least **3 functional client-side tools** are implemented.
3. Universal Command-K search works across all registered tools.
4. Static export passes without build errors and is deployed live via Github Pages | Vercel.
5. GitHub repository contains clear documentation, setup instructions, and open-source contribution guidelines.
