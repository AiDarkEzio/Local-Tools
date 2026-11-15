// src/app/(app)/tools/json-formatter/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("json-formatter", [
  "json formatter",
  "json validator",
  "json minifier",
  "prettify json",
  "sort json keys",
]);

export default function JsonFormatterLayout({ children }: { children: ReactNode }) {
  return children;
}