// src/app/(app)/tools/case-converter/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("case-converter", [
  "text case converter",
  "camelcase",
  "snake_case",
  "pascalcase",
  "kebab-case",
  "title case",
]);

export default function CaseConverterLayout({ children }: { children: ReactNode }) {
  return children;
}