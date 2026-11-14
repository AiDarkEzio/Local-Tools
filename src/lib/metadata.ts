// src/lib/metadata.ts
import type { Metadata } from "next";
import { TOOLS } from "@/config/tools";
import { getCategoryConfig } from "@/config/categories";

export function createToolMetadata(
  toolId: string,
  extraKeywords: string[] = []
): Metadata {
  const tool = TOOLS.find((t) => t.id === toolId);

  if (!tool) {
    return {};
  }

  const category = getCategoryConfig(tool.category);
  const fullTitle = `${tool.name} — Local Tools`;

  return {
    title: tool.name,
    description: tool.description,
    keywords: [
      tool.name.toLowerCase(),
      category.label.toLowerCase(),
      ...tool.tags,
      ...extraKeywords,
      "client-side",
      "browser utility",
      "privacy-first",
      "local tools",
    ],
    openGraph: {
      title: fullTitle,
      description: tool.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description: tool.description,
    },
  };
}