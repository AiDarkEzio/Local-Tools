<!-- docs\UI_BEST_PRACTICES.md -->

# 🚨 Critical Architectural Rules & Best Practices

Because this project uses **Base UI** (`@base-ui/react`) instead of Radix UI and targets **React 19 / Next.js 16**, follow these rules to avoid TypeScript, React Compiler, hydration, and runtime errors.

---

## ⛔ Rule 1: Do NOT use `asChild` on Base UI Components

Base UI components do **not** support Radix UI's `asChild` prop.

- 🔴 Incorrect (Radix Pattern)

```tsx
<Button asChild>
  <Link href="/tools">Explore</Link>
</Button>
```

- 🟢 Correct (Link button styling)

```tsx
import { buttonVariants } from "@/components/ui/button";

<Link href="/tools" className={buttonVariants({ variant: "default" })}>
  Explore
</Link>
```

---

## ⛔ Rule 2: Use `render` prop for Base UI Component Composition

To custom render a child component inside Base UI triggers or menu items, use the **`render`** prop:

- 🟢 Correct (Dropdown Menu Trigger)

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

- 🟢 Correct (Dropdown Menu Item with Next.js Link)

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

## ⛔ Rule 3: Always Wrap `DropdownMenuLabel` in `DropdownMenuGroup`

Base UI requires `MenuPrimitive.GroupLabel` to be inside a `MenuPrimitive.Group`. Missing this causes a runtime `MenuGroupContext is missing` error.

- 🔴 Incorrect

```tsx
<DropdownMenuContent>
  <DropdownMenuLabel>Tool Categories</DropdownMenuLabel>
</DropdownMenuContent>
```

- 🟢 Correct

```tsx
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>Tool Categories</DropdownMenuLabel>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

---

## ⛔ Rule 4: Always Wrap `CommandDialog` Children with `<Command>`

The `cmdk` store context (`subscribe`) must be present for `<CommandInput>` or `<CommandList>` to work inside a dialog.

- 🟢 Correct (`src/components/ui/command.tsx`)

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

## ⛔ Rule 5: Hydration Guarding without `useEffect` Cascades

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

## ⛔ Rule 6: Avoid Dark Mode Utility Property Conflicts

Avoid hardcoding light/dark Tailwind utility pairs that apply the same property (e.g. `bg-zinc-900 dark:bg-zinc-100`). Use semantic CSS variables instead:

- 🟢 Correct

```tsx
/* Use semantic color tokens */
<div className="bg-foreground text-background border border-foreground/10">
  <Terminal className="h-4 w-4" />
</div>
```

---

## ⛔ Rule 7: Always Use `grid-flow-dense` for Bento Grid Layouts

When creating asymmetrical grid layouts with varying column/row spans (`2x2`, `2x1`, `1x2`), always include `grid-flow-dense` (`grid-auto-flow: dense`) on the grid container. This prevents empty gaps caused by sequential item wrapping.

- 🟢 Correct

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 grid-flow-dense">
  {tools.map((tool) => (
    <ToolCard key={tool.id} tool={tool} />
  ))}
</div>
```

---

## ⛔ Rule 8: Synchronize Browser Stores (`localStorage`, URL Hashes) via `useSyncExternalStore` & Avoid Mutating Global Objects

Do **not** read `localStorage` or `window.location.hash` inside `useEffect` and call `setState()`. Furthermore, do **not** directly mutate global browser objects like `window.location.hash = tab` inside event handlers, as this violates React 19 strict immutability rules.

Instead, subscribe to external browser storage and location sources using `useSyncExternalStore`, and update browser URL state via `window.history.pushState`:

- 🟢 Correct

```typescript
function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

function getHashSnapshot(): string {
  return typeof window !== "undefined" ? window.location.hash : "";
}

function getHashServerSnapshot(): string {
  return "";
}

// Inside Component: derive state synchronously during render
const rawHash = React.useSyncExternalStore(subscribeHash, getHashSnapshot, getHashServerSnapshot);

// Event Handler: update URL state safely without mutating window.location directly
const handleTabChange = (tab: CategoryFilterKey) => {
  const newUrl = tab === "all" ? window.location.pathname : `${window.location.pathname}#${tab}`;
  window.history.pushState(null, "", newUrl);
  window.dispatchEvent(new Event("hashchange"));
};
```

---

## ⛔ Rule 9: Debounce Asynchronous Canvas & Media Computations

When building tools that modify media in real-time (sliders for quality, dimensions, filters), running asynchronous `canvas.toBlob()` synchronously on every input tick causes UI stutter and memory thrashing.

### Best Practice Pattern

1. **Cache decoded image in a `ref`:** Decode the uploaded `File` once into an `HTMLImageElement` stored in `cachedImgRef.current`.
2. **Debounce the re-encoding effect (200–250ms):** Postpone heavy canvas operations until dragging settles.
3. **Use cancellation flags (`isActive = false`):** Ignore stale async callbacks when settings change mid-processing.
4. **Revoke old Object URLs safely:** Clean up previous blob URLs whenever a new blob is produced.

---

## ⛔ Rule 10: Client-Only Browser API Feature Detection via `useSyncExternalStore`

Directly querying client-only browser capabilities (such as `window.EyeDropper`, `navigator.bluetooth`, or `window.serial`) inside JSX conditions causes **Hydration Failed** errors:

- 🔴 Incorrect (Triggers SSR Hydration Mismatch)

```tsx
{typeof window !== "undefined" && "EyeDropper" in window && (
  <Button onClick={handleEyeDropper}>Eyedropper</Button>
)}
```

- 🟢 Correct Pattern (`useSyncExternalStore`)

```tsx
const emptySubscribe = () => () => {};

function getEyeDropperSnapshot(): boolean {
  return typeof window !== "undefined" && "EyeDropper" in window;
}

function getEyeDropperServerSnapshot(): boolean {
  return false;
}

// Inside Component:
const hasEyeDropper = React.useSyncExternalStore(
  emptySubscribe,
  getEyeDropperSnapshot,
  getEyeDropperServerSnapshot
);

return (
  <>
    {hasEyeDropper && (
      <Button onClick={handleEyeDropper}>Eyedropper</Button>
    )}
  </>
);
```

---

## ⛔ Rule 11: React 19 Script Injections & Theme Hydration Guards

Theme providers (such as `next-themes`) inject inline `<script>` tags to manage `.dark` class attributes on `<html>` before hydration. In React 19, always add `suppressHydrationWarning` to both `<html>` and `<body>` tags in `src/app/layout.tsx` to prevent console script errors.

- 🟢 Correct (`src/app/layout.tsx`)

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="...">
      <body suppressHydrationWarning className="...">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```
