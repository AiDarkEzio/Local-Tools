// src/app/(app)/tools/hash-generator/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("hash-generator", [
  "md5 generator",
  "sha256 hash",
  "sha512 hash",
  "sha1 checksum",
  "checksum verifier",
]);

export default function HashGeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}