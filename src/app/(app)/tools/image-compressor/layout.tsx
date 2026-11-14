// src/app/(app)/tools/image-compressor/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("image-compressor", [
  "image compressor",
  "image resizer",
  "webp converter",
  "jpeg compression",
  "canvas image optimizer",
]);

export default function ImageCompressorLayout({ children }: { children: ReactNode }) {
  return children;
}