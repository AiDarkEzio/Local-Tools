// src/app/(app)/tools/password-generator/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = createToolMetadata("password-generator", [
  "password generator",
  "secure password",
  "random password",
  "password entropy",
  "csprng",
]);

export default function PasswordGeneratorLayout({ children }: { children: ReactNode }) {
  return children;
}