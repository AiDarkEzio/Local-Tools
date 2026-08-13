<!-- docs\TOOL_LAYOUT_ARCHETYPES.md -->

# Deep Dive: The 3 Tool Layout Archetypes

``` text
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

## Archetype 1: The Split-Pane Layout (Transformation Tools)

* **When to use:** Whenever the user gives a block of text/data, and the tool processes it into a *new* block of text/data.
* **Examples:** JSON Formatter, Base64 Encoder/Decoder, Text Diff Checker, CSV to JSON, JWT Decoder, Markdown Previewer.
* **Why it works in-depth:**
  * **Real-time feedback loop:** As the user types or pastes into the left panel, the right panel updates instantly.
  * **Side-by-side comparison:** The user can visually compare the original raw data vs. the formatted/transformed result without scrolling.
  * **Desktop screen efficiency:** On widescreen desktop monitors, side-by-side takes full advantage of horizontal space.
* **Mobile behavior:** Automatically stacks vertically (Input on top, Output on bottom) using Tailwind's `grid-cols-1 lg:grid-cols-2`.

---

## Archetype 2: Focus Canvas + Sidebar (Visual & Media Tools)

* **When to use:** Visual editing, file manipulation, canvas tools, or tools where the visual preview needs maximum screen space.
* **Examples:** Image Cropper, SVG Optimizer/Viewer, PDF Page Remover, Color Palette Picker, Audio Trimmer.
* **Layout Structure:**
  * **Main Stage (70% width):** Large workspace displaying the visual preview or canvas.
  * **Controls Sidebar (30% width):** Sliders, quality dropdowns, file upload buttons, and action buttons ("Export PNG", "Compress").

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

## Archetype 3: Compact Single-Panel / Card Layout (Generators)

* **When to use:** Tools that don't need a large input area—just a few buttons/switches and a clear result display.
* **Examples:** UUID/GUID Generator, Password Generator, QR Code Generator, Hash (MD5/SHA256) Generator, Cron Expression Parser.
* **Layout Structure:**
  * A single, sleek, centered card (`max-w-2xl mx-auto`).
  * Top section: Options (length sliders, toggles for numbers/symbols).
  * Bottom section: Prominent output box with a large "Copy" button.

```text
+-----------------------------------------------------------------------+
| Header: Secure Password Generator                                     |
+-----------------------------------------------------------------------+
|                     +---------------------------+                     |
|                     |  CENTERED CONTAINER       |                     |
|                     |  Length: 16 characters    |                     |
|                     |  [x] Symbols  [x] Numbers |                     |
|                     |                           |                     |
|                     |  RESULT:                  |                     |
|                     |  [ k8#mP2$v9X!qL1zW  📋 ] |                     |
|                     |                           |                     |
|                     |  [ GENERATE NEW ]         |                     |
|                     +---------------------------+                     |
+-----------------------------------------------------------------------+
```

---

## How to Implement This Cleanly in Code

To keep code clean and scalable, tools should consume the reusable **Layout Wrappers** located in `src/components/layouts/`:

### Component Directory Structure

```text
src/components/
└── layouts/
    ├── tool-shell.tsx             # Shared outer container & glow background
    ├── tool-header.tsx            # Shared header with breadcrumbs, title, badges & favorite toggle
    ├── split-pane-layout.tsx      # Archetype 1 (Transformation tools)
    ├── focus-canvas-layout.tsx    # Archetype 2 (Visual media & canvas tools)
    └── compact-card-layout.tsx    # Archetype 3 (Generators & calculators)
```

### Example Usage in a Tool Page (`src/app/tools/json-formatter/page.tsx`)

```tsx
import { SplitPaneLayout } from "@/components/layouts/split-pane-layout";

export default function JsonFormatterPage() {
  return (
    <SplitPaneLayout
      toolId="json-formatter"
      title="JSON Formatter"
      description="Prettify, validate, and minify JSON strings instantly."
      category="dev"
      icon="FileJson"
      tags={["formatter", "validator"]}
      leftPaneTitle="Input JSON"
      rightPaneTitle="Formatted Output"
      leftPane={<JsonInputEditor />}
      rightPane={<JsonOutputViewer />}
    />
  );
}
```
