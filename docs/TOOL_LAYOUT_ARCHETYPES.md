<!-- docs\TOOL_LAYOUT_ARCHETYPES.md -->

# Deep Dive: The 3 Tool Layout Archetypes

```text
+---------------------------------------------------------------------------------+
|  ARCHETYPE 1: Split-Pane          ARCHETYPE 2: Canvas / Media   ARCHETYPE 3: Compact Single |
|  (Transformation Tools)           (Editing & Media Tools)       (Generators & Calculators)  |
|                                                                                             |
|  +-----------+-----------+        +-------------------+-------+          +---------------+  |
|  | Input     | Output    |        |                   |Control|          | Options       |  |
|  |           |           |        |    Main Canvas    |Panel  |          +---------------+  |
|  |           |           |        |    / Preview      |       |          | Output Result |  |
|  +-----------+-----------+        +-------------------+-------+          +---------------+  |
+---------------------------------------------------------------------------------+
```

---

## Archetype 1: The Split-Pane Layout (`SplitPaneLayout`)

* **When to use:** Whenever the user gives a block of text/data, and the tool processes it into a transformed block of text, structured cards, or detailed analytics.
* **Live Implementations:**
  * **JSON Formatter & Validator** (`/tools/json-formatter`)
  * **Base64 Encoder / Decoder** (`/tools/base64-encoder`)
  * **SHA & MD5 Hash Generator** (`/tools/hash-generator`)
  * **Text Case Converter** (`/tools/case-converter`)
  * **Word & Text Analyzer** (`/tools/word-counter`)
* **Upcoming Planned Implementations:** Text Diff Checker, JWT Token Inspector, Regex Matcher, Markdown Live Previewer.
* **Why it works in-depth:**
  * **Real-time feedback loop:** As the user types or pastes into the left panel, the right panel updates instantly.
  * **Side-by-side comparison:** Visually compare the original raw data vs. transformed outputs without vertical scroll fatigue.
  * **Desktop screen efficiency:** Takes full advantage of horizontal space on desktop monitors while collapsing vertically (`grid-cols-1 lg:grid-cols-2`) on mobile.

---

## Archetype 2: Focus Canvas + Sidebar (`FocusCanvasLayout`)

* **When to use:** Visual editing, media manipulation, canvas tools, or utilities where a dominant visual preview needs maximum workspace.
* **Live Implementations:**
  * **Image Compressor & Resizer** (`/tools/image-compressor`)
* **Upcoming Planned Implementations:** SVG Vector Converter, Image Dimensions Resizer, Color Palette Extractor, PDF Page Merger.
* **Layout Structure:**
  * **Main Stage (approx. 60–70% width):** Large workspace displaying the visual canvas, drag-and-drop zone, or file preview.
  * **Controls Sidebar (approx. 30–40% width):** Sliders, quality dropdowns, format switches, dimensions inputs, and export triggers.

```text
+-----------------------------------------------------------------------+
| Header: Image Compressor & Resizer                                    |
+---------------------------------------------------+-------------------+
|                                                   |  SETTINGS PANEL   |
|                                                   |  Image Format:    |
|               [ IMAGE PREVIEW ]                   |  [ WEBP  v ]      |
|               Original: 4.2 MB                    |                   |
|               Compressed: 850 KB (-80%)           |  Quality: 80%     |
|                                                   |  [===========|--] |
|                                                   |                   |
|                                                   |  [ DOWNLOAD NOW ] |
+---------------------------------------------------+-------------------+
```

---

## Archetype 3: Compact Single-Panel / Card Layout (`CompactCardLayout`)

* **When to use:** Generators, color inspectors, and calculators that operate with targeted controls and a clean summary result display.
* **Live Implementations:**
  * **Secure Password Generator** (`/tools/password-generator`)
  * **Universal Color Code Converter** (`/tools/color-converter`)
* **Upcoming Planned Implementations:** UUID / GUID Generator, Unix Epoch Timestamp Tool, Byte & Data Unit Converter, EMI & Loan Calculator.
* **Layout Structure:**
  * A single, centered card container (`max-w-2xl` or `max-w-3xl mx-auto`).
  * Top / Middle section: Interactive configuration controls (swatches, sliders, checkboxes, universal input bar).
  * Bottom section: Result cards with one-click copy buttons and diagnostics (e.g. entropy scores, WCAG contrast badges).

```text
+-----------------------------------------------------------------------+
| Header: Universal Color Code Converter                                |
+-----------------------------------------------------------------------+
|                     +---------------------------+                     |
|                     |  UNIVERSAL INPUT BAR      |                     |
|                     |  [ oklch(0.7 0.15 160)  ] |                     |
|                     +---------------------------+                     |
|                     |  [ COLOR SWATCH & SLIDERS]|                     |
|                     |                           |                     |
|                     |  FORMATS:                 |                     |
|                     |  HEX: #10B981             |                     |
|                     |  RGB: rgb(16, 185, 129)   |                     |
|                     |  HSL: hsl(160, 84%, 39%)  |                     |
|                     |                           |                     |
|                     |  [ WCAG: AAA PASS ]       |                     |
|                     +---------------------------+                     |
+-----------------------------------------------------------------------+
```

---

## How to Implement Layout Archetypes in Code

All layout components live in `src/components/layouts/`:

```text
src/components/
└── layouts/
    ├── tool-shell.tsx             # Shared outer container & glow background
    ├── tool-header.tsx            # Shared header with breadcrumbs, title, badges & favorite toggle
    ├── split-pane-layout.tsx      # Archetype 1 (Transformation tools)
    ├── focus-canvas-layout.tsx    # Archetype 2 (Visual media & canvas tools)
    └── compact-card-layout.tsx    # Archetype 3 (Generators & calculators)
```
