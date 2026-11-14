// src/app/(app)/tools/base64-encoder/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("base64-encoder", [
  "base64 encoder",
  "base64 decoder",
  "utf-8 base64",
  "file to base64",
  "url safe base64",
]);

export default function Base64EncoderLayout({ children }: { children: ReactNode }) {
  return children;
}