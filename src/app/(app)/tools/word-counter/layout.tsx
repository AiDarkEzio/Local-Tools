// src/app/(app)/tools/word-counter/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("word-counter", [
  "word counter",
  "character counter",
  "reading time calculator",
  "keyword density",
  "text analyzer",
]);

export default function WordCounterLayout({ children }: { children: ReactNode }) {
  return children;
}