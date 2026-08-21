# 🛠️ LocalTools

> **LocalTools** is an open-source, privacy-first collection of fast online utilities that run 100% locally in your browser. No server uploads, no sign-ups, and no data tracking.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![License MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

## Project Status

- **Version:** `v0.2.0`
- **Stage:** [Phase 2 — Active Tool Expansion](./docs/DISCOVERY_PHASE.md#phase-2-lightweight-text--developer-utilities-fast-wins)
- **Tools Count:** `3` (1 Functional Reference Tool per Standard Layout Archetype)

---

## ⚡ Available Tools

| Tool | Category | Layout Archetype | Description | Zero-Server Engine |
| :--- | :--- | :--- | :--- | :--- |
| [**JSON Formatter & Validator**](/tools/json-formatter) | `Developer` | **Split-Pane** (Archetype 1) | Prettify, validate, minify, and alphabetically sort JSON data with instant diagnostics. | `JSON.parse` / `JSON.stringify` |
| [**Image Compressor & Resizer**](/tools/image-compressor) | `Image & Media` | **Focus Canvas** (Archetype 2) | Compress, convert (WEBP, JPEG, PNG), and resize image dimensions with live size savings. | `HTMLCanvasElement` / `toBlob` |
| [**Secure Password Generator**](/tools/password-generator) | `Security & Crypto` | **Compact Card** (Archetype 3) | Generate cryptographically secure passwords with entropy calculation and ambiguity filters. | `window.crypto.getRandomValues` |

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