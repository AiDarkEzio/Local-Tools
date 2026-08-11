// src/config/tools.ts

import { ToolTag } from "./tags";
import { ToolCategory } from "./categories";

export type { ToolCategory };

export type GridSpan = '1x1' | '2x1' | '1x2' | '2x2';

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

export const TOOLS: Tool[] = [
];