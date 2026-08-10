<!-- docs\PROJECT_UI_SYSTEM.md -->

# 🎨 UI Architecture & Design System Reference

This document serves as the single source of truth for the project's UI design system, Shadcn UI setup, Base UI integration rules, global CSS theme variables, and component implementation guidelines.

---

## 1. ⚙️ Tech Stack & Engine Configuration

| Layer | Library / Engine | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Server Components, Client Components (`"use client"`) |
| **UI Primitives Engine** | Base UI (`@base-ui/react`) | Component underlying engine (Replaces Radix UI) |
| **Styling Engine** | Tailwind CSS v4 | Native `@import "tailwindcss";`, OKLCH color support |
| **Variant Manager** | `class-variance-authority` (cva) | Type-safe variant generation |
| **Class Merger** | `clsx` + `tailwind-merge` | Handled via `cn()` utility (`@/lib/utils`) |
| **Command Palette** | `cmdk` | Accessible command menu engine |
| **Icon Library** | `lucide-react` | Standard vector icon set |
| **Theme Manager** | `next-themes` | Class-based dark/light mode toggle (`.dark` class on `<html>`) |

---

## 2. 🎨 Global CSS & Theme Tokens (`globals.css`)

The project uses **Tailwind CSS v4** with **OKLCH color space** variables for high-perceptual accuracy dark and light themes.

### CSS Imports & Dark Variant Definition

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/* Custom dark mode variant matching the .dark class on <html> */
@custom-variant dark (&:is(.dark *));
```

### Inline Theme Mapping (`@theme inline`)

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Charts */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Sidebar */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Calculated Border Radii */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}
```

### Color Variables Palette Table (OKLCH)

| Variable | Light Theme (`:root`) | Dark Theme (`.dark`) |
| :--- | :--- | :--- |
| `--background` | `oklch(1 0 0)` (White) | `oklch(0.141 0.005 285.823)` (Dark Zinc) |
| `--foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` |
| `--card` | `oklch(1 0 0)` | `oklch(0.21 0.006 285.885)` |
| `--popover` | `oklch(1 0 0)` | `oklch(0.21 0.006 285.885)` |
| `--primary` | `oklch(0.508 0.118 165.612)` (Emerald) | `oklch(0.432 0.095 166.913)` |
| `--primary-foreground` | `oklch(0.979 0.021 166.113)` | `oklch(0.979 0.021 166.113)` |
| `--secondary` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` |
| `--muted` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` |
| `--muted-foreground` | `oklch(0.552 0.016 285.938)` | `oklch(0.705 0.015 286.067)` |
| `--border` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 15%)` |
| `--ring` | `oklch(0.705 0.015 286.067)` | `oklch(0.552 0.016 285.938)` |
| `--radius` | `0.625rem` (10px) | `0.625rem` (10px) |

---

## 3. 🧩 Component Catalog (`src/components/ui/*` & Custom Hooks)

### 1. `Button` (`@/components/ui/button`)

- **Engine**: `@base-ui/react/button`
- **Variants**: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`
- **Sizes**: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`

### 2. `Badge` (`@/components/ui/badge`)

- **Variants**: `default`, `secondary`, `destructive`, `outline`

### 3. `InputGroup` (`@/components/ui/input-group`)

- **Sub-components**: `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `InputGroupButton`, `InputGroupText`, `InputGroupTextarea`

### 4. `DropdownMenu` (`@/components/ui/dropdown-menu`)

- **Engine**: `@base-ui/react/menu`
- **Sub-components**: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuSeparator`

### 5. `Command` & `CommandDialog` (`@/components/ui/command`)

- **Engine**: `cmdk` + Custom Dialog wrapper

### 6. Custom Application Hooks (`src/hooks/*`)

- **`useFavorites`**: Manages favorite tool IDs with `localStorage` persistence (`local-tools:favorites`) and `sonner` toast alerts.
- **`useRecentTools`**: Logs recently selected tool timestamps in `localStorage` (`local-tools:recent`).

---

## 4. 🚨 Critical Architectural Rules & Best Practices

Because this project uses **Base UI** (`@base-ui/react`) instead of Radix UI, follow these rules to avoid TypeScript and runtime errors.

### ⛔ Rule 1: Do NOT use `asChild` on Base UI Components

Base UI components do **not** support Radix UI's `asChild` prop.

#### 🔴 Incorrect (Radix Pattern)

```tsx
<Button asChild>
  <Link href="/tools">Explore</Link>
</Button>
```

#### 🟢 Correct (Link button styling)

```tsx
import { buttonVariants } from "@/components/ui/button";

<Link href="/tools" className={buttonVariants({ variant: "default" })}>
  Explore
</Link>
```

---

### ⛔ Rule 2: Use `render` prop for Base UI Component Composition

To custom render a child component inside Base UI triggers or menu items, use the **`render`** prop:

#### 🟢 Correct (Dropdown Menu Trigger)

```tsx
<DropdownMenuTrigger
  render={
    <Button variant="ghost" size="sm" className="gap-1.5" />
  }
>
  <Layers className="w-3.5 h-3.5" />
  <span>Categories</span>
</DropdownMenuTrigger>
```

#### 🟢 Correct (Dropdown Menu Item with Next.js Link)

```tsx
<DropdownMenuItem
  key={cat.id}
  render={
    <Link
      href={`/#${cat.id}`}
      className="flex items-center justify-between text-xs"
    />
  }
>
  <span>{cat.label}</span>
</DropdownMenuItem>
```

---

### ⛔ Rule 3: Always Wrap `DropdownMenuLabel` in `DropdownMenuGroup`

Base UI requires `MenuPrimitive.GroupLabel` to be inside a `MenuPrimitive.Group`. Missing this causes a runtime `MenuGroupContext is missing` error.

#### 🔴 Incorrect

```tsx
<DropdownMenuContent>
  <DropdownMenuLabel>Tool Categories</DropdownMenuLabel>
</DropdownMenuContent>
```

#### 🟢 Correct

```tsx
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>Tool Categories</DropdownMenuLabel>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

---

### ⛔ Rule 4: Always Wrap `CommandDialog` Children with `<Command>`

The `cmdk` store context (`subscribe`) must be present for `<CommandInput>` or `<CommandList>` to work inside a dialog.

#### 🟢 Correct (`src/components/ui/command.tsx`)

```tsx
function CommandDialog({ children, ...props }: React.ComponentProps<typeof Dialog>) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}
```

---

### ⛔ Rule 5: Hydration Guarding without `useEffect` Cascades

To prevent React 19 / Compiler errors (`setState synchronously within an effect`), use `useSyncExternalStore` for client-side mounting checks (e.g., theme toggles):

- 🔴 Incorrect

```tsx
const [mounted, setMounted] = React.useState(false);

React.useEffect(() => {
  setMounted(true); // Triggers cascading render pass error
}, []);
```

- 🟢 Correct

```tsx
const emptySubscribe = () => () => {};

const mounted = React.useSyncExternalStore(
  emptySubscribe,
  () => true,  // Client snapshot
  () => false  // Server / SSR snapshot
);
```

---

### ⛔ Rule 6: Avoid Dark Mode Utility Property Conflicts

Avoid hardcoding light/dark Tailwind utility pairs that apply the same property (e.g. `bg-zinc-900 dark:bg-zinc-100`). Use semantic CSS variables instead:

- 🟢 Correct

```tsx
/* Use semantic color tokens */
<div className="bg-foreground text-background border border-foreground/10">
  <Terminal className="h-4 w-4" />
</div>
```

---

### ⛔ Rule 7: Always Use `grid-flow-dense` for Bento Grid Layouts

When creating asymmetrical grid layouts with varying column/row spans (`2x2`, `2x1`, `1x2`), always include `grid-flow-dense` (`grid-auto-flow: dense`) on the grid container. This prevents empty gaps/holes caused by sequential item wrapping.

- 🟢 Correct

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 grid-flow-dense">
  {tools.map((tool) => (
    <ToolCard key={tool.id} tool={tool} />
  ))}
</div>
```

---

### ⛔ Rule 8: Synchronize `localStorage` / Browser Stores via `useSyncExternalStore`

Do **not** read `localStorage` inside `useEffect` and immediately call `setState()` [1]. This triggers React 19 / Compiler linter errors due to cascading re-renders [1].

Instead, subscribe to external storage using React's built-in `useSyncExternalStore` and emit custom events for same-tab updates [2, 3].

- 🔴 Incorrect (Triggers `react-hooks/set-state-in-effect` Linter Error)

```typescript
// ❌ Avoid: Causes cascading re-renders on mount
const [items, setItems] = React.useState<string[]>([]);

React.useEffect(() => {
  const stored = localStorage.getItem("my-key");
  if (stored) setItems(JSON.parse(stored)); // ESLint Error!
}, []);
```

- 🟢 Correct (React 19 Zero-Warning External Store Pattern)

```typescript
const STORAGE_EVENT = "local-tools:settings-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function getSnapshot() {
  return localStorage.getItem("my-key") || "[]";
}

function getServerSnapshot() {
  return "[]";
}

export function useMySettings() {
  const rawData = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const data = React.useMemo(() => JSON.parse(rawData), [rawData]);

  const updateData = (newValue: any) => {
    localStorage.setItem("my-key", JSON.stringify(newValue));
    window.dispatchEvent(new Event(STORAGE_EVENT)); // Notifies all hook instances
  };

  return { data, updateData };
}
```
