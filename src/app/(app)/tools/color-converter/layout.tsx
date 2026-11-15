// src/app/(app)/tools/color-converter/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("color-converter", [
  "color converter",
  "hex to rgb",
  "oklch converter",
  "hsl cmyk",
  "wcag contrast checker",
]);

export default function ColorConverterLayout({ children }: { children: ReactNode }) {
  return children;
}