// src/config/tools.ts

import { ToolTag } from "./tags";
import { ToolCategory } from "./categories";
// import rawTools from "./tools.json";

export type { ToolCategory };

export type GridSpan = "1x1" | "2x1" | "1x2" | "2x2";

export interface Tool {
  id: string;          // Unique identifier (e.g., 'json-formatter')
  name: string;        // Display title
  description: string; // Short SEO summary
  category: ToolCategory;
  path: string;        // Route path (e.g., '/tools/json-formatter')
  icon: string;        // Lucide icon key (e.g., Image / FileText)
  tags: ToolTag[];     // Strictly typed tags from KNOWN_TAGS

  // Visual & Feature Indicators
  isNew?: boolean;     // Visual 'New' badge indicator
  featured?: boolean;  // Promoted in Hero / Featured Bento section

  // Bento Grid Layout & Ordering
  gridSpan?: GridSpan; // Occupancy in Bento Grid (default: '1x1')
  order?: number;      // Custom display priority (lower numbers rank higher)
}

const ACTIVE_TOOLS: Tool[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    description: "Prettify, validate, minify, and sort JSON data with instant diagnostics.",
    category: "dev",
    path: "/tools/json-formatter",
    icon: "FileJson",
    tags: ["formatter", "validator"],
    featured: true,
    gridSpan: "2x1",
    order: 1,
  },
  {
    id: "image-compressor",
    name: "Image Compressor & Resizer",
    description: "Reduce image file size locally using HTML Canvas without quality loss.",
    category: "image",
    path: "/tools/image-compressor",
    icon: "Image",
    tags: ["compressor", "editor"],
    featured: true,
    gridSpan: "1x1",
    order: 2,
  },
  {
    id: "password-generator",
    name: "Secure Password Generator",
    description: "Create customizable cryptographically secure passwords and passphrases.",
    category: "security",
    path: "/tools/password-generator",
    icon: "KeyRound",
    tags: ["generator"],
    featured: true,
    gridSpan: "1x1",
    order: 3,
  },
  {
    id: "color-converter",
    name: "Universal Color Code Converter",
    description: "Convert HEX, RGB, HSL, HSV, OKLCH, and CMYK color codes with contrast checking.",
    category: "image",
    path: "/tools/color-converter",
    icon: "Palette",
    tags: ["converter", "viewer"],
    featured: true,
    gridSpan: "2x1",
    order: 8,
  },
];

// const activeIds = new Set(ACTIVE_TOOLS.map((t) => t.id));

// Filter out duplicates from rawTools and place active tools first
export const TOOLS: Tool[] = [
  ...ACTIVE_TOOLS,
  // ...(rawTools as Tool[]).filter((t) => !activeIds.has(t.id)),
];