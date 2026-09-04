# 🛠️ LocalTools

> **LocalTools** is an open-source, privacy-first collection of fast online utilities that run 100% locally in your browser. No server uploads, no sign-ups, and no data tracking.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![License MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

## Project Status

- **Version:** `v0.3.0`
- **Stage:** [Phase 2 Completed — Transitioning to Phase 3 Media Utilities](./docs/DISCOVERY_PHASE.md#phase-3-canvas--media-processing-in-progress)
- **Tools Count:** `8` (Active utilities spanning all 3 standard layout archetypes)

---

## ⚡ Available Tools

| Tool | Category | Layout Archetype | Description | Zero-Server Engine |
| :--- | :--- | :--- | :--- | :--- |
| [**JSON Formatter & Validator**](/tools/json-formatter) | `Developer` | **Split-Pane** (Archetype 1) | Prettify, validate, minify, and alphabetically sort JSON data with instant diagnostics. | `JSON.parse` / `JSON.stringify` |
| [**Base64 Encoder / Decoder**](/tools/base64-encoder) | `Developer` | **Split-Pane** (Archetype 1) | Encode and decode text, emojis, and binary files with URL-safe formatting and size metrics. | `btoa` / `atob` / `TextEncoder` |
| [**SHA & MD5 Hash Generator**](/tools/hash-generator) | `Security & Crypto` | **Split-Pane** (Archetype 1) | Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic digests with checksum validation. | `window.crypto.subtle` / RFC 1321 |
| [**Text Case Converter**](/tools/case-converter) | `Text & Code` | **Split-Pane** (Archetype 1) | Transform text across camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, and Title Case. | Tokenizer & Regex Engine |
| [**Word & Text Analyzer**](/tools/word-counter) | `Text & Code` | **Split-Pane** (Archetype 1) | Real-time word, character, and sentence counter with reading time and keyword frequency analysis. | Typography & Frequency Engine |
| [**Image Compressor & Resizer**](/tools/image-compressor) | `Image & Media` | **Focus Canvas** (Archetype 2) | Compress, convert (WEBP, JPEG, PNG), and resize image dimensions with live size savings. | `HTMLCanvasElement` / `toBlob` |
| [**Secure Password Generator**](/tools/password-generator) | `Security & Crypto` | **Compact Card** (Archetype 3) | Generate cryptographically secure passwords with entropy calculation and ambiguity filters. | `window.crypto.getRandomValues` |
| [**Universal Color Code Converter**](/tools/color-converter) | `Image & Media` | **Compact Card** (Archetype 3) | Convert HEX, RGB, HSL, HSV, OKLCH, and CMYK colors with live sliders, contrast checking, and Eyedropper. | OKLCH / sRGB Math & EyeDropper API |

---

## ✨ Core Principles

- 🔒 **100% Client-Side Execution:** Your data, images, code, and credentials never touch a remote server.
- ⚡ **Zero-Latency Performance:** Instant calculations running directly on your device using native browser APIs.
- 🎨 **Modern Minimalist UI:** Built with Next.js 16 (App Router), Tailwind CSS v4, Base UI primitives, and dual Dark/Light mode support.
- 📱 **Responsive Bento Discovery:** Dynamic grid layout with universal `Cmd + K` search, category filter pills, and URL hash synchronization.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AiDarkEzio/Local-Tools.git
cd Local-Tools
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000/Local-Tools](http://localhost:3000/Local-Tools) in your browser to view Local Tools.

### 4. Build for static export

```bash
npm run build
```

The static HTML/CSS/JS export will be generated in the `./out` directory, ready for deployment to GitHub Pages or any static host.

---

## 📚 Documentation Index

- [Discovery & Architecture Plan](./docs/DISCOVERY_PHASE.md)
- [Design System Specification](./docs/DESIGN_SYSTEM_SPEC.md)
- [UI System Architecture Reference](./docs/PROJECT_UI_SYSTEM.md)
- [The 3 Tool Layout Archetypes](./docs/TOOL_LAYOUT_ARCHETYPES.md)
- [Base UI & React 19 Best Practices](./docs/UI_BEST_PRACTICES.md)
- [Basecn Registry Reference](./docs/BASECN.md)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.