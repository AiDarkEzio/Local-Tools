<!-- docs\UI_BEST_PRACTICES.md -->

# 🚨 Critical Architectural Rules & Best Practices

Because this project uses **Base UI** (`@base-ui/react`) instead of Radix UI and target **React 19 / Next.js 16**, follow these rules to avoid TypeScript, React Compiler, and runtime errors.

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

## ⛔ Rule 8: Synchronize Browser Stores (`localStorage`, URL Hashes) via `useSyncExternalStore` & Avoid Mutating Global Objects

Do **not** read `localStorage` or `window.location.hash` inside `useEffect` and call `setState()`. Furthermore, do **not** directly mutate global browser objects like `window.location.hash = tab` inside event handlers, as this violates React 19 / React Compiler strict immutability rules (`react-hooks/immutability`).

Instead, subscribe to external browser storage and location sources using `useSyncExternalStore`, and update browser URL state via `window.history.pushState`:

### Example 1: Synchronizing `localStorage`

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

### Example 2: Synchronizing URL Hash (`window.location.hash`)

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
