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

To keep your code clean and scalable, don't re-create layouts from scratch for every new tool. Instead, build reusable **Layout Wrappers** in React:

### Example Directory Structure

```text
src/components/
└── layouts/
    ├── ToolHeader.tsx             # Shared header with breadcrumbs & title
    ├── SplitPaneLayout.tsx        # Archetype 1
    ├── FocusCanvasLayout.tsx      # Archetype 2
    └── CompactCardLayout.tsx      # Archetype 3
```

### Example Usage in a Tool Page (`src/app/tools/json-formatter/page.tsx`)

```tsx
import { SplitPaneLayout } from "@/components/layouts/SplitPaneLayout";

export default function JsonFormatterPage() {
  return (
    <SplitPaneLayout
      title="JSON Formatter"
      description="Prettify and validate JSON strings instantly."
      leftPanel={<JsonInputEditor />}
      rightPanel={<JsonOutputViewer />}
    />
  );
}
```
